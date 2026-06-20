import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import net from 'node:net';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { pathToFileURL } from 'node:url';
import { connectCdp, requestJson } from './cdp.mjs';
import { assertConsumerBrowserResult, assertReducedMotionResult } from './browser-assertions.mjs';
import { consumerBrowserExpression, reducedMotionExpression } from './browser-expressions.mjs';
import { consumerBrowserHtml } from './browser-html.mjs';

const coreOnlyBrowserHtml = `<!doctype html>
<html class="uzu-root" lang="en" data-theme="light" data-uzu-code-highlight="auto">
<head>
  <meta charset="utf-8">
  <link rel="stylesheet" href="./node_modules/usuzumi/ui/usuzumi.css">
  <script src="./node_modules/usuzumi/ui/usuzumi-core.js" defer></script>
</head>
<body class="uzu-app">
  <main class="uzu-page">
    <pre class="uzu-code-block-body uzu-scroll"><code class="language-javascript">const label = 'Usuzumi';</code></pre>
  </main>
</body>
</html>
`;

const coreWithLateHighlightBrowserHtml = `<!doctype html>
<html class="uzu-root" lang="en" data-theme="light" data-uzu-code-highlight="auto">
<head>
  <meta charset="utf-8">
  <link rel="stylesheet" href="./node_modules/usuzumi/ui/usuzumi.css">
  <script src="./node_modules/usuzumi/ui/usuzumi-core.js" defer></script>
  <script>
    window.addEventListener('DOMContentLoaded', () => {
      window.setTimeout(() => {
        window.__beforeHighlightSignature = document.querySelector('code')?.dataset.uzuSyntaxHighlighted || '';
        const script = document.createElement('script');
        script.src = './node_modules/usuzumi/ui/usuzumi-highlight.js';
        document.head.append(script);
      }, 120);
    });
  </script>
</head>
<body class="uzu-app">
  <main class="uzu-page">
    <pre class="uzu-code-block-body uzu-scroll"><code class="language-javascript">const label = 'Usuzumi';</code></pre>
  </main>
</body>
</html>
`;

const visibleHighlightBrowserHtml = `<!doctype html>
<html class="uzu-root" lang="en" data-theme="light" data-uzu-code-highlight="visible">
<head>
  <meta charset="utf-8">
  <link rel="stylesheet" href="./node_modules/usuzumi/ui/usuzumi.css">
  <script src="./node_modules/usuzumi/ui/usuzumi.js" defer></script>
</head>
<body class="uzu-app">
  <main class="uzu-page">
    <pre class="uzu-code-block-body uzu-scroll"><code id="near-code" class="language-javascript">const near = true;</code></pre>
    <div style="height: 2200px"></div>
    <pre class="uzu-code-block-body uzu-scroll"><code id="far-code" class="language-javascript">const far = true;</code></pre>
  </main>
</body>
</html>
`;

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
  const coreOnlyHtmlPath = path.join(appDir, 'browser-core-check.html');
  const coreHighlightHtmlPath = path.join(appDir, 'browser-core-highlight-check.html');
  const visibleHighlightHtmlPath = path.join(appDir, 'browser-visible-highlight-check.html');
  writeFileSync(htmlPath, consumerBrowserHtml, 'utf8');
  writeFileSync(coreOnlyHtmlPath, coreOnlyBrowserHtml, 'utf8');
  writeFileSync(coreHighlightHtmlPath, coreWithLateHighlightBrowserHtml, 'utf8');
  writeFileSync(visibleHighlightHtmlPath, visibleHighlightBrowserHtml, 'utf8');

  const profile = path.join(appDir, `browser-profile-${process.pid}-${Date.now()}`);
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
    '--disable-gpu-sandbox',
    '--disable-direct-composition',
    '--disable-features=Vulkan,DefaultANGLEVulkan,VulkanFromANGLE,UseSkiaRenderer,SkiaGraphite,DawnGraphite,WebGPU,CanvasOopRasterization,Accelerated2dCanvas',
    '--use-angle=swiftshader',
    '--disable-background-networking',
    '--disable-component-update',
    '--disable-default-apps',
    '--disable-extensions',
    '--disable-sync',
    '--disable-client-side-phishing-detection',
    '--disable-popup-blocking',
    '--disable-renderer-backgrounding',
    '--metrics-recording-only',
    '--no-service-autorun',
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
  const withTimeout = (promise, label, ms = 10000) => {
    let timer = null;
    const timeout = new Promise((_, reject) => {
      timer = setTimeout(() => reject(new Error(`${label} timed out after ${ms}ms`)), ms);
    });
    return Promise.race([promise, timeout]).finally(() => {
      if (timer) clearTimeout(timer);
    });
  };
  const send = (cdp, label, method, params = {}, ms = 10000) => withTimeout(cdp.send(method, params), label, ms);
  const exceptionDetailsToText = (details) => {
    if (!details) return '';
    const frames = details.stackTrace?.callFrames
      ?.map((frame) => `${frame.functionName || '<anonymous>'}@${frame.url}:${frame.lineNumber}:${frame.columnNumber}`)
      .join('\n') || '';
    return [
      details.text,
      details.exception?.description || details.exception?.value,
      frames
    ].filter(Boolean).join('\n');
  };
  const evaluate = async (cdp, label, expression, ms = 10000) => {
    const result = await send(cdp, label, 'Runtime.evaluate', {
      expression,
      returnByValue: true,
      awaitPromise: true
    }, ms);
    if (result.exceptionDetails) {
      throw new Error(`${label} failed:\n${exceptionDetailsToText(result.exceptionDetails)}`);
    }
    return result.result.value;
  };
  const navigate = async (cdp, url, waitMs = 800) => {
    await send(cdp, `navigate ${url}`, 'Page.navigate', { url });
    try {
      await send(cdp, `activate ${url}`, 'Page.bringToFront');
    } catch (_) {
      /* Older Chromium builds can still run the smoke without explicit activation. */
    }
    await delay(waitMs);
  };
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
  let browserPageReady = false;
  try {
    const browserInfo = await waitForBrowser();
    const port = Number.parseInt(new URL(browserInfo.webSocketDebuggerUrl).port, 10) || debugPort || readBrowserPort();
    const target = await requestJson(port, `/json/new?${encodeURIComponent('about:blank')}`, 'PUT');
    const cdp = await connectCdp(target.webSocketDebuggerUrl);
    await send(cdp, 'Runtime.enable', 'Runtime.enable');
    await send(cdp, 'Page.enable', 'Page.enable');
    browserPageReady = true;
    await navigate(cdp, targetUrl);

    const value = await evaluate(cdp, 'full runtime browser smoke', consumerBrowserExpression, 20000);
    assertConsumerBrowserResult(value);

    await send(cdp, 'Emulation.setEmulatedMedia', 'Emulation.setEmulatedMedia', {
      features: [{ name: 'prefers-reduced-motion', value: 'reduce' }]
    });

    const reducedMotionResult = await evaluate(cdp, 'reduced motion browser smoke', reducedMotionExpression);
    assertReducedMotionResult(reducedMotionResult);

    await navigate(cdp, pathToFileURL(coreOnlyHtmlPath).href);
    const coreOnlyResult = await evaluate(cdp, 'core-only syntax highlight smoke', `(() => {
      const code = document.querySelector('code');
      const direct = window.Usuzumi.highlightCode("const value = 1;", "javascript");
      return {
        hasApi: Boolean(window.Usuzumi?.highlightCodeBlocks),
        hasEngine: Boolean(window.UsuzumiHighlightEngine),
        directHighlighted: Boolean(direct.highlighted),
        directText: direct.fragment.textContent,
        tokenCount: code.querySelectorAll('.uzu-code-token').length,
        signature: code.dataset.uzuSyntaxHighlighted || '',
        text: code.textContent
      };
    })()`);
    if (!coreOnlyResult.hasApi || coreOnlyResult.hasEngine || coreOnlyResult.directHighlighted || coreOnlyResult.directText !== 'const value = 1;' || coreOnlyResult.tokenCount !== 0 || !coreOnlyResult.signature.startsWith('plain:javascript:') || coreOnlyResult.text !== "const label = 'Usuzumi';") {
      throw new Error(`Core-only highlight fallback failed: ${JSON.stringify(coreOnlyResult)}`);
    }

    await navigate(cdp, pathToFileURL(coreHighlightHtmlPath).href, 300);
    const lateHighlightResult = await evaluate(cdp, 'late highlight runtime smoke', `(async () => {
      const code = document.querySelector('code');
      const beforeSignature = window.__beforeHighlightSignature || '';
      for (let index = 0; index < 40; index += 1) {
        if (code.querySelectorAll('.uzu-code-token').length > 0 && (code.dataset.uzuSyntaxHighlighted || '').startsWith('engine:')) break;
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
      return {
        hasApi: Boolean(window.Usuzumi?.highlightCodeBlocks),
        hasEngine: Boolean(window.UsuzumiHighlightEngine),
        beforeSignature,
        afterSignature: code.dataset.uzuSyntaxHighlighted || '',
        tokenCount: code.querySelectorAll('.uzu-code-token').length,
        languageCount: window.Usuzumi.listCodeLanguages().length,
        hasTypescript: window.Usuzumi.hasCodeLanguage('typescript')
      };
    })()`);
    if (!lateHighlightResult.hasApi || !lateHighlightResult.hasEngine || !lateHighlightResult.beforeSignature.startsWith('plain:javascript:') || !lateHighlightResult.afterSignature.startsWith('engine:javascript:') || lateHighlightResult.tokenCount <= 0 || lateHighlightResult.languageCount <= 0 || !lateHighlightResult.hasTypescript) {
      throw new Error(`Late highlight runtime failed: ${JSON.stringify(lateHighlightResult)}`);
    }
    const destroyHighlightResult = await evaluate(cdp, 'highlight destroy cleanup smoke', `(async () => {
      const code = document.querySelector('code');
      window.Usuzumi.destroy(document);
      code.dataset.uzuCodeSource = 'const destroyed = true;';
      delete code.dataset.uzuSyntaxHighlighted;
      code.replaceChildren(document.createTextNode('const destroyed = true;'));
      window.dispatchEvent(new CustomEvent('uzu-code-highlight-engine-ready', { detail: { engine: window.UsuzumiHighlightEngine || null } }));
      await new Promise((resolve) => requestAnimationFrame(resolve));
      await new Promise((resolve) => setTimeout(resolve, 80));
      const afterDestroyTokens = code.querySelectorAll('.uzu-code-token').length;
      const afterDestroySignature = code.dataset.uzuSyntaxHighlighted || '';
      window.Usuzumi.init(document);
      for (let index = 0; index < 30; index += 1) {
        if (code.querySelectorAll('.uzu-code-token').length > 0 && (code.dataset.uzuSyntaxHighlighted || '').startsWith('engine:')) break;
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
      return {
        afterDestroyTokens,
        afterDestroySignature,
        afterInitTokens: code.querySelectorAll('.uzu-code-token').length,
        afterInitSignature: code.dataset.uzuSyntaxHighlighted || ''
      };
    })()`);
    if (destroyHighlightResult.afterDestroyTokens !== 0 || destroyHighlightResult.afterDestroySignature || destroyHighlightResult.afterInitTokens <= 0 || !destroyHighlightResult.afterInitSignature.startsWith('engine:javascript:')) {
      throw new Error(`Highlight destroy cleanup failed: ${JSON.stringify(destroyHighlightResult)}`);
    }

    await navigate(cdp, pathToFileURL(visibleHighlightHtmlPath).href);
    const visibleInitialResult = await evaluate(cdp, 'visible highlight initial smoke', `(() => {
      const near = document.querySelector('#near-code');
      const far = document.querySelector('#far-code');
      return {
        nearTokens: near.querySelectorAll('.uzu-code-token').length,
        farTokens: far.querySelectorAll('.uzu-code-token').length,
        nearSignature: near.dataset.uzuSyntaxHighlighted || '',
        farSignature: far.dataset.uzuSyntaxHighlighted || '',
        horizontalOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth
      };
    })()`);
    if (visibleInitialResult.nearTokens <= 0 || visibleInitialResult.farTokens !== 0 || !visibleInitialResult.nearSignature.startsWith('engine:javascript:') || visibleInitialResult.farSignature || visibleInitialResult.horizontalOverflow > 1) {
      throw new Error(`Visible highlight initial state failed: ${JSON.stringify(visibleInitialResult)}`);
    }
    const visibleScrolledResult = await evaluate(cdp, 'visible highlight scroll smoke', `(async () => {
      const far = document.querySelector('#far-code');
      far.scrollIntoView({ block: 'center' });
      for (let index = 0; index < 30; index += 1) {
        if (far.querySelectorAll('.uzu-code-token').length > 0) break;
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
      return {
        farTokens: far.querySelectorAll('.uzu-code-token').length,
        farSignature: far.dataset.uzuSyntaxHighlighted || ''
      };
    })()`);
    if (visibleScrolledResult.farTokens <= 0 || !visibleScrolledResult.farSignature.startsWith('engine:javascript:')) {
      throw new Error(`Visible highlight scroll state failed: ${JSON.stringify(visibleScrolledResult)}`);
    }
    cdp.close();
    console.log('Consumer browser smoke passed.');
  } catch (error) {
    const message = error instanceof Error ? error.stack || error.message : String(error);
    const startupFailure = !browserPageReady
      && process.platform === 'win32'
      && /DevTools WebSocket closed|Target crashed|timed out after|timed out|GPU process isn't usable/i.test(message + '\n' + browserDiagnostics());
    if (startupFailure && process.env.USUZUMI_BROWSER_REQUIRED !== '1') {
      console.log('Consumer browser smoke skipped: local Chromium could not initialize a headless page target.');
      console.log(browserDiagnostics());
      return;
    }
    throw new Error(`${message}\n${browserDiagnostics()}`);
  } finally {
    child.kill();
    await delay(250);
    rmSync(profile, { recursive: true, force: true });
  }
}
