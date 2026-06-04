import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import net from 'node:net';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { pathToFileURL } from 'node:url';
import { connectCdp, requestJson } from './cdp.mjs';
import { assertConsumerBrowserResult, assertReducedMotionResult } from './browser-assertions.mjs';
import { consumerBrowserExpression, reducedMotionExpression } from './browser-expressions.mjs';
import { consumerBrowserHtml } from './browser-html.mjs';

function getBrowserCandidates() {
  const candidates = [
    process.env.CHROME_PATH,
    process.env.CHROMIUM_PATH,
    path.join(process.env.ProgramFiles || '', 'Google/Chrome/Application/chrome.exe'),
    path.join(process.env['ProgramFiles(x86)'] || '', 'Google/Chrome/Application/chrome.exe'),
    path.join(process.env.LOCALAPPDATA || '', 'Google/Chrome/Application/chrome.exe'),
    path.join(process.env.ProgramFiles || '', 'Microsoft/Edge/Application/msedge.exe'),
    path.join(process.env['ProgramFiles(x86)'] || '', 'Microsoft/Edge/Application/msedge.exe'),
    path.join(process.env.LOCALAPPDATA || '', 'Microsoft/Edge/Application/msedge.exe'),
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/Applications/Chromium.app/Contents/MacOS/Chromium',
    '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
    '/usr/bin/google-chrome',
    '/usr/bin/google-chrome-stable',
    '/usr/bin/chromium',
    '/usr/bin/chromium-browser',
    '/usr/bin/microsoft-edge',
    '/usr/bin/microsoft-edge-stable',
    '/snap/bin/chromium',
    '/opt/google/chrome/chrome'
  ].filter(Boolean);

  return [...new Set(candidates)];
}

function findBrowserExecutable() {
  for (const candidate of getBrowserCandidates()) {
    if (existsSync(candidate)) return candidate;
  }

  const playwrightRoot = path.join(process.env.LOCALAPPDATA || '', 'ms-playwright');
  if (!existsSync(playwrightRoot)) return '';

  const matches = [];
  const walk = (directory) => {
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      const fullPath = path.join(directory, entry.name);
      if (entry.isDirectory()) {
        walk(fullPath);
      } else if (entry.name === 'chrome.exe') {
        matches.push(fullPath);
      }
    }
  };
  walk(playwrightRoot);
  return matches.sort().at(-1) || '';
}

function getFreePort() {
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    server.listen(0, '127.0.0.1', () => {
      const address = server.address();
      const port = typeof address === 'object' && address ? address.port : 0;
      server.close(() => {
        if (port) resolve(port);
        else reject(new Error('Could not allocate a browser debugging port'));
      });
    });
    server.on('error', reject);
  });
}

export async function browserSmoke(appDir) {
  const browser = findBrowserExecutable();
  if (!browser) {
    console.log('Consumer browser smoke skipped: no Chromium/Chrome/Edge executable found.');
    return;
  }

  const htmlPath = path.join(appDir, 'browser-check.html');
  writeFileSync(htmlPath, consumerBrowserHtml, 'utf8');

  const profile = path.join(appDir, 'browser-profile');
  const activePortFile = path.join(profile, 'DevToolsActivePort');
  const targetUrl = `${pathToFileURL(htmlPath).href}#consumer-panel-hash-two`;
  const debugPort = Number.parseInt(process.env.USUZUMI_BROWSER_DEBUG_PORT || '', 10) || await getFreePort();

  rmSync(profile, { recursive: true, force: true });
  mkdirSync(profile, { recursive: true });

  const launchArgs = [
    '--headless=new',
    ...(process.platform === 'linux' ? [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage'
    ] : []),
    `--remote-debugging-port=${debugPort}`,
    '--remote-debugging-address=127.0.0.1',
    '--remote-allow-origins=*',
    `--user-data-dir=${profile}`,
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    'about:blank'
  ];
  const child = spawn(browser, launchArgs, { stdio: ['ignore', 'ignore', 'pipe'], windowsHide: true });
  const stderrChunks = [];
  let childExit = null;
  child.stderr.on('data', (chunk) => {
    stderrChunks.push(Buffer.from(chunk));
    if (stderrChunks.length > 20) stderrChunks.shift();
  });
  child.on('exit', (code, signal) => {
    childExit = { code, signal };
  });

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const browserDiagnostics = () => {
    const lines = [`Browser executable: ${browser}`, `Browser args: ${launchArgs.join(' ')}`];
    if (childExit) lines.push(`Browser exit: code=${childExit.code ?? 'null'} signal=${childExit.signal ?? 'null'}`);
    const stderr = Buffer.concat(stderrChunks).toString('utf8').trim();
    if (stderr) lines.push(`Browser stderr:\n${stderr.slice(-4000)}`);
    return lines.join('\n');
  };
  const readBrowserPort = () => {
    if (!existsSync(activePortFile)) return 0;
    const [portText] = readFileSync(activePortFile, 'utf8').split(/\r?\n/);
    return Number.parseInt(portText, 10) || 0;
  };
  const getBrowserPortCandidates = () => [...new Set([debugPort, readBrowserPort()].filter(Boolean))];
  const waitForBrowser = async () => {
    for (let index = 0; index < 150; index += 1) {
      if (childExit) break;
      for (const port of getBrowserPortCandidates()) {
        try {
          return await requestJson(port, '/json/version');
        } catch (_) {
          /* Keep polling while Chrome starts. */
        }
      }
      await delay(100);
    }
    throw new Error(`Browser did not expose a DevTools endpoint.\n${browserDiagnostics()}`);
  };
  try {
    const browserInfo = await waitForBrowser();
    const port = Number.parseInt(new URL(browserInfo.webSocketDebuggerUrl).port, 10) || debugPort || readBrowserPort();
    const target = await requestJson(port, `/json/new?${encodeURIComponent(targetUrl)}`, 'PUT');
    const cdp = await connectCdp(target.webSocketDebuggerUrl);
    await cdp.send('Runtime.enable');
    await cdp.send('Page.enable');
    await delay(800);


    const evaluation = await cdp.send('Runtime.evaluate', { expression: consumerBrowserExpression, returnByValue: true, awaitPromise: true });
    if (evaluation.exceptionDetails) throw new Error(evaluation.exceptionDetails.text);
    const value = evaluation.result.value;
    assertConsumerBrowserResult(value);

    await cdp.send('Emulation.setEmulatedMedia', {
      features: [{ name: 'prefers-reduced-motion', value: 'reduce' }]
    });

    const reducedMotionEvaluation = await cdp.send('Runtime.evaluate', { expression: reducedMotionExpression, returnByValue: true, awaitPromise: true });
    if (reducedMotionEvaluation.exceptionDetails) throw new Error(reducedMotionEvaluation.exceptionDetails.text);
    assertReducedMotionResult(reducedMotionEvaluation.result.value);
    cdp.close();
    console.log('Consumer browser smoke passed.');
  } finally {
    child.kill();
    await delay(250);
    rmSync(profile, { recursive: true, force: true });
  }
}
