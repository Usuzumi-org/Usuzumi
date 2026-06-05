import { execFileSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ignoredDirs = new Set(['.git', 'node_modules', 'dist', 'build', 'coverage', '.cache', '.tmp', 'usuzumi-site']);
const ignoredFiles = new Set(['AGENTS.md', 'REVIEW.md']);
const textExtensions = new Set(['.css', '.html', '.js', '.md', '.json']);
const issues = [];
const forbiddenRootDependencyPattern = /^(?:@tiptap\/|@codemirror\/|codemirror$|markdown-it$|shiki$)/i;
const forbiddenUiEditorPattern = /@tiptap|@codemirror|\bCodeMirror\b|\bEditorView\b|\bMarkdownIt\b|markdown-it|\bshiki\b|createHighlighterCore/i;
const publicDocs = ['DESIGN.md', 'README.md', 'README.zh-CN.md'];
const scrollbarSurfaces = [
  'html.uzu-root',
  'body.uzu-app',
  '.uzu-scroll',
  '.uzu-scroll-area',
  '.uzu-command-list',
  '.uzu-combobox-list',
  '.uzu-table-wrap',
  '.uzu-data-grid-wrap',
  '.uzu-json-viewer',
  '.uzu-diff-viewer',
  '.uzu-code-editor',
  '.uzu-plain-editor',
  '.uzu-markdown-source',
  '.uzu-markdown-preview',
  '.uzu-editor-surface'
];
const scrollbarButtonStates = [
  '',
  ':single-button',
  ':double-button',
  ':start:decrement',
  ':start:increment',
  ':end:decrement',
  ':end:increment',
  ':vertical:decrement',
  ':vertical:increment',
  ':vertical:start:decrement',
  ':vertical:start:increment',
  ':vertical:end:decrement',
  ':vertical:end:increment',
  ':horizontal:decrement',
  ':horizontal:increment',
  ':horizontal:start:decrement',
  ':horizontal:start:increment',
  ':horizontal:end:decrement',
  ':horizontal:end:increment'
];

function toPosix(filePath) {
  return path.relative(root, filePath).replaceAll(path.sep, '/');
}

function walk(dir) {
  return readdirSync(dir).flatMap((entry) => {
    const fullPath = path.join(dir, entry);
    const stat = statSync(fullPath);
    if (stat.isDirectory()) {
      return ignoredDirs.has(entry) ? [] : walk(fullPath);
    }
    return [fullPath];
  });
}

function readText(filePath) {
  return readFileSync(filePath, 'utf8');
}

function report(filePath, message) {
  issues.push(`${toPosix(filePath)}: ${message}`);
}

function isExternalReference(value) {
  return /^(https?:|mailto:|tel:|data:)/i.test(value);
}

function splitReference(value) {
  const trimmed = value.trim();
  const noQuery = trimmed.split('?')[0];
  const hashIndex = noQuery.indexOf('#');
  return {
    pathPart: hashIndex >= 0 ? noQuery.slice(0, hashIndex) : noQuery,
    hash: hashIndex >= 0 ? noQuery.slice(hashIndex + 1) : ''
  };
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function dataAttributeToDatasetKey(attribute) {
  return attribute
    .replace(/^data-/, '')
    .replace(/-([a-z0-9])/g, (_, character) => character.toUpperCase());
}

function cssContainsClass(cssText, className) {
  return new RegExp(`\\.${escapeRegExp(className)}(?:[^_a-zA-Z0-9-]|$)`).test(cssText);
}

function cssContainsSurfacePseudo(cssText, surface, pseudo) {
  if (cssText.includes(`${surface}${pseudo}`)) return true;
  if (!surface.startsWith('.')) return false;
  const className = surface.slice(1);
  return new RegExp(`:where\\([^)]*\\.${escapeRegExp(className)}(?:[^_a-zA-Z0-9-]|[^)]*)\\)${escapeRegExp(pseudo)}`).test(cssText);
}

function getFirstRuleBody(cssText, selectorPart) {
  const match = cssText.match(new RegExp(`${escapeRegExp(selectorPart)}[\\s\\S]*?\\{([\\s\\S]*?)\\}`));
  return match ? match[1] : '';
}

function validateScrollbarCssContract(filePath) {
  const text = readText(filePath);
  const buttonBody = getFirstRuleBody(text, '::-webkit-scrollbar-button');
  const thumbBody = getFirstRuleBody(text, '::-webkit-scrollbar-thumb');

  for (const surface of scrollbarSurfaces) {
    for (const pseudo of ['::-webkit-scrollbar', '::-webkit-scrollbar-track', '::-webkit-scrollbar-thumb', '::-webkit-scrollbar-corner']) {
      if (!cssContainsSurfacePseudo(text, surface, pseudo)) {
        report(filePath, `scrollbar contract does not cover ${surface}${pseudo}`);
      }
    }
    for (const state of scrollbarButtonStates) {
      const pseudo = `::-webkit-scrollbar-button${state}`;
      if (!cssContainsSurfacePseudo(text, surface, pseudo)) {
        report(filePath, `scrollbar contract does not hide ${surface}${pseudo}`);
      }
    }
  }

  const buttonDeclarations = [
    [/display\s*:\s*none\s*!important/i, 'display: none !important'],
    [/width\s*:\s*0(?:px)?\s*!important/i, 'width: 0 !important'],
    [/height\s*:\s*0(?:px)?\s*!important/i, 'height: 0 !important'],
    [/min-width\s*:\s*0(?:px)?\s*!important/i, 'min-width: 0 !important'],
    [/min-height\s*:\s*0(?:px)?\s*!important/i, 'min-height: 0 !important'],
    [/background-image\s*:\s*none\s*!important/i, 'background-image: none !important'],
    [/color\s*:\s*transparent\s*!important/i, 'color: transparent !important'],
    [/-webkit-appearance\s*:\s*none\s*!important/i, '-webkit-appearance: none !important'],
    [/(^|[;\s])appearance\s*:\s*none\s*!important/i, 'appearance: none !important']
  ];
  for (const [pattern, label] of buttonDeclarations) {
    if (!pattern.test(buttonBody)) {
      report(filePath, `scrollbar buttons must be fully hidden with ${label}`);
    }
  }

  if (!/min-width\s*:\s*24px/i.test(thumbBody) || !/min-height\s*:\s*24px/i.test(thumbBody)) {
    report(filePath, 'scrollbar thumbs need a 24px minimum length so short thumbs do not read as triangular arrow buttons');
  }
}

function collectDocumentedItems(pattern) {
  return publicDocs.flatMap((fileName) => {
    const filePath = path.join(root, fileName);
    if (!existsSync(filePath)) return [];
    return [...readText(filePath).matchAll(pattern)].map((match) => ({
      filePath,
      value: match[0]
    }));
  });
}

function uniqueDocumentedItems(items) {
  const byValue = new Map();
  items.forEach((item) => {
    if (!byValue.has(item.value)) byValue.set(item.value, item);
  });
  return [...byValue.values()];
}

function decodeHash(value) {
  try {
    return decodeURIComponent(value);
  } catch (_) {
    return value;
  }
}

function hasHtmlHashTarget(filePath, hash) {
  if (!hash || hash.startsWith(':~:text=')) return true;
  const target = decodeHash(hash);
  const pattern = new RegExp(`\\b(?:id|name)=["']${escapeRegExp(target)}["']`, 'i');
  return pattern.test(readText(filePath));
}

function checkExistingReference(filePath, rawValue, label) {
  if (!rawValue || isExternalReference(rawValue)) return;
  const { pathPart, hash } = splitReference(rawValue);
  if (pathPart.startsWith('{') || pathPart.startsWith('var(') || pathPart.includes('${')) return;
  if (!pathPart && !hash) return;
  const resolved = pathPart ? path.resolve(path.dirname(filePath), pathPart) : filePath;
  if (!existsSync(resolved)) {
    report(filePath, `${label} reference does not exist: ${rawValue}`);
    return;
  }
  if (hash && path.extname(resolved).toLowerCase() === '.html' && !hasHtmlHashTarget(resolved, hash)) {
    report(filePath, `${label} hash target does not exist: ${rawValue}`);
  }
}

function checkHtmlReferences(filePath, text) {
  const attrPattern = /\b(?:href|src)=["']([^"']+)["']/gi;
  for (const match of text.matchAll(attrPattern)) {
    checkExistingReference(filePath, match[1], 'HTML');
  }
}

function checkCssReferences(filePath, text) {
  const urlPattern = /url\(\s*["']?([^"')]+)["']?\s*\)/gi;
  for (const match of text.matchAll(urlPattern)) {
    checkExistingReference(filePath, match[1], 'CSS');
  }
}

function checkMarkdownReferences(filePath, text) {
  const markdownLinkPattern = /\[[^\]]+\]\(([^)\s]+)(?:\s+["'][^"']*["'])?\)/g;
  for (const match of text.matchAll(markdownLinkPattern)) {
    checkExistingReference(filePath, match[1], 'Markdown');
  }
}

function checkGuardrails(filePath, text) {
  if (/href=["']#["']/i.test(text)) {
    report(filePath, 'placeholder href="#" is not allowed');
  }
  if (/(?:href|src)\s*=\s*["']\s*javascript:/i.test(text)) {
    report(filePath, 'javascript: URL is not allowed');
  }
  if (/font-size\s*:[^;]*vw/i.test(text)) {
    report(filePath, 'viewport-width font sizing is not allowed');
  }
  if (/letter-spacing\s*:\s*-/i.test(text)) {
    report(filePath, 'negative letter-spacing is not allowed');
  }
  if (filePath.endsWith('.css') && /border-radius\s*:\s*(?:0|1px|2px|3px)\b/i.test(text)) {
    report(filePath, 'visible border-radius below 4px is not allowed');
  }
  if (filePath.startsWith(path.join(root, 'ui')) && /catalog-body/i.test(text)) {
    report(filePath, 'site-only catalog selectors must not live in ui/ styles');
  }
  if (filePath.startsWith(path.join(root, 'ui')) && /\.(?:uzu-doc|uzu-guide)-[A-Za-z0-9_-]+/.test(text)) {
    report(filePath, 'component-page documentation selectors must not live in ui/ files');
  }
  if (['README.md', 'README.zh-CN.md', 'DESIGN.md'].includes(toPosix(filePath)) && /(?:ProseMirror|\bremark\b|\bmarked\b(?!\s+with\b)|Monaco)/.test(text)) {
    report(filePath, 'editor guidance should stay explicit: Tiptap, markdown-it, and CodeMirror 6');
  }
}

function checkMarkdownShape(filePath, text) {
  if (!['README.md', 'README.zh-CN.md'].includes(toPosix(filePath))) return;
  const fences = text.match(/^```/gm) || [];
  if (fences.length % 2 !== 0) {
    report(filePath, 'markdown code fences are unbalanced');
  }
  const headings = text.match(/^#{1,6}\s+\S/gm) || [];
  if (headings.length < 6) {
    report(filePath, 'README should expose a scannable heading structure');
  }
}

function validateTextFiles() {
  for (const filePath of walk(root)) {
    const extension = path.extname(filePath);
    if (ignoredFiles.has(path.basename(filePath))) continue;
    if (!textExtensions.has(extension)) continue;
    if (extension === '.html') continue;
    const text = readText(filePath);
    checkGuardrails(filePath, text);
    if (extension === '.md') checkMarkdownShape(filePath, text);
    if (extension === '.css') checkCssReferences(filePath, text);
    if (extension === '.md') checkMarkdownReferences(filePath, text);
  }
}

function validateRootPackageDependencies() {
  const filePath = path.join(root, 'package.json');
  const packageJson = JSON.parse(readText(filePath));
  const dependencyBuckets = ['dependencies', 'devDependencies', 'peerDependencies', 'optionalDependencies'];
  for (const bucket of dependencyBuckets) {
    for (const name of Object.keys(packageJson[bucket] || {})) {
      if (forbiddenRootDependencyPattern.test(name)) {
        report(filePath, `root UI package must not depend on external editor/highlighter package: ${name}`);
      }
    }
  }
}

function validatePublicUiSources() {
  const uiDir = path.join(root, 'ui');
  for (const filePath of walk(uiDir)) {
    const extension = path.extname(filePath);
    if (!textExtensions.has(extension)) continue;
    const text = readText(filePath);
    if (forbiddenUiEditorPattern.test(text)) {
      report(filePath, 'ui/ must expose editor shells only, not bundled external editor/highlighter engines');
    }
    if (/\.(?:uzu-home|uzu-project|uzu-app-preview|uzu-app-window|uzu-window-|uzu-mock|uzu-today|uzu-timeline|uzu-task|uzu-metric|uzu-doc|uzu-guide)-/i.test(text)) {
      report(filePath, 'ui/ must not contain site-only page shell selectors');
    }
  }
}

function validateDocumentedPublicApi() {
  const cssPath = path.join(root, 'ui', 'usuzumi.css');
  const jsPath = path.join(root, 'ui', 'usuzumi.js');
  const typesPath = path.join(root, 'ui', 'usuzumi.d.ts');
  const cssText = readText(cssPath);
  const sourceSurface = [
    cssText,
    readText(jsPath),
    existsSync(typesPath) ? readText(typesPath) : ''
  ].join('\n');

  const documentedClasses = uniqueDocumentedItems(collectDocumentedItems(/\.uzu-[A-Za-z0-9_-]+/g));
  documentedClasses.forEach(({ filePath, value }) => {
    const className = value.slice(1);
    if (!cssContainsClass(cssText, className)) {
      report(filePath, `documented public class is not defined in ui/usuzumi.css: ${value}`);
    }
  });

  const documentedVariables = uniqueDocumentedItems(collectDocumentedItems(/--uzu-[A-Za-z0-9_-]+/g));
  documentedVariables.forEach(({ filePath, value }) => {
    if (!cssText.includes(value)) {
      report(filePath, `documented CSS variable is not present in ui/usuzumi.css: ${value}`);
    }
  });

  const documentedDataAttributes = uniqueDocumentedItems(collectDocumentedItems(/\bdata-uzu-[A-Za-z0-9_-]+\b/g));
  documentedDataAttributes.forEach(({ filePath, value }) => {
    const datasetKey = dataAttributeToDatasetKey(value);
    if (!sourceSurface.includes(value) && !sourceSurface.includes(datasetKey)) {
      report(filePath, `documented data attribute is not handled by the public library: ${value}`);
    }
  });
}

function validateJavaScript() {
  const scriptFiles = walk(root).filter((filePath) => {
    const extension = path.extname(filePath);
    return extension === '.js' || extension === '.mjs';
  });
  for (const filePath of scriptFiles) {
    try {
      if (filePath.startsWith(path.join(root, 'ui/js'))) {
        new Function(readText(filePath));
      } else {
        execFileSync(process.execPath, ['--check', filePath], {
          cwd: root,
          stdio: 'pipe'
        });
      }
    } catch (error) {
      const output = [error.stdout, error.stderr, error.message].filter(Boolean).join('\n').trim();
      report(filePath, `JavaScript syntax check failed${output ? `: ${output}` : ''}`);
    }
  }
}

validateJavaScript();
validateRootPackageDependencies();
validatePublicUiSources();
validateDocumentedPublicApi();
validateTextFiles();
validateScrollbarCssContract(path.join(root, 'ui', 'css', 'base.css'));
validateScrollbarCssContract(path.join(root, 'ui', 'usuzumi.css'));

if (issues.length) {
  console.error(`Validation failed with ${issues.length} issue(s):`);
  for (const issue of issues) console.error(`- ${issue}`);
  process.exit(1);
}

console.log('Validation passed.');
