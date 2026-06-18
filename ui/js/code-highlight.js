  const codeHighlightClassMap = new Map([
    ['comment', 'comment'],
    ['quote', 'comment'],
    ['doctag', 'property'],
    ['keyword', 'keyword'],
    ['built_in', 'keyword'],
    ['type', 'tag'],
    ['literal', 'keyword'],
    ['number', 'number'],
    ['operator', 'operator'],
    ['punctuation', 'punctuation'],
    ['regexp', 'string'],
    ['string', 'string'],
    ['subst', 'variable'],
    ['symbol', 'variable'],
    ['class', 'tag'],
    ['function', 'variable'],
    ['title', 'variable'],
    ['params', 'variable'],
    ['attr', 'attr'],
    ['attribute', 'attr'],
    ['variable', 'variable'],
    ['property', 'property'],
    ['selector-tag', 'selector'],
    ['selector-id', 'selector'],
    ['selector-class', 'selector'],
    ['selector-attr', 'selector'],
    ['selector-pseudo', 'selector'],
    ['tag', 'tag'],
    ['name', 'tag'],
    ['section', 'selector'],
    ['bullet', 'operator'],
    ['code', 'string'],
    ['emphasis', 'string'],
    ['strong', 'keyword'],
    ['formula', 'string'],
    ['link', 'string'],
    ['meta', 'property'],
    ['deletion', 'invalid'],
    ['addition', 'string']
  ]);

  const codeLanguageAliases = {
    cjs: 'javascript',
    conf: 'ini',
    console: 'shell',
    cs: 'csharp',
    docker: 'dockerfile',
    golang: 'go',
    htm: 'html',
    html: 'xml',
    js: 'javascript',
    jsx: 'javascript',
    jsonc: 'json',
    mjs: 'javascript',
    md: 'markdown',
    patch: 'diff',
    ps: 'powershell',
    ps1: 'powershell',
    py: 'python',
    rb: 'ruby',
    rs: 'rust',
    sh: 'bash',
    svg: 'xml',
    terminal: 'shell',
    toml: 'ini',
    ts: 'typescript',
    tsx: 'typescript',
    xhtml: 'xml',
    yml: 'yaml',
    zsh: 'bash'
  };
  let codeHighlightObserver = null;
  let codeHighlightEventsInitialized = false;
  let codeHighlightEngineReadyListener = null;
  let codeHighlightTabsChangeListener = null;
  let codeHighlightPanelShowListener = null;

  function getHighlightEngine() {
    if (typeof UsuzumiHighlightEngine !== 'undefined') return UsuzumiHighlightEngine;
    const globalTarget = typeof globalThis !== 'undefined' ? globalThis : null;
    return globalTarget?.UsuzumiHighlightEngine || (typeof window !== 'undefined' ? window.UsuzumiHighlightEngine : null) || null;
  }

  function normalizeCodeHighlightMode(value) {
    const mode = String(value || '').trim().toLowerCase();
    return ['auto', 'visible', 'manual'].includes(mode) ? mode : '';
  }

  function getCodeHighlightMode(target) {
    const localRoot = target instanceof Element ? target.closest('[data-uzu-code-highlight]') : null;
    return normalizeCodeHighlightMode(localRoot?.dataset.uzuCodeHighlight)
      || normalizeCodeHighlightMode(document.body?.dataset.uzuCodeHighlight)
      || normalizeCodeHighlightMode(document.documentElement.dataset.uzuCodeHighlight)
      || 'auto';
  }

  function normalizeCodeLanguage(value) {
    const language = String(value || '').trim().toLowerCase().replace(/^language-/, '');
    if (!language || language === 'text' || language === 'txt' || language === 'plain' || language === 'plaintext') return '';
    return codeLanguageAliases[language] || language;
  }

  function inferCodeLanguage(source) {
    const code = String(source || '').trim();
    if (!code) return '';
    if (/^\s*</.test(code)) return 'xml';
    if (/^\s*(?:\{|\[)/.test(code)) return 'json';
    if (/^\s*(?:--[\w-]+|[.#]?[\w-]+\s*\{|@media|@supports|:root)/m.test(code)) return 'css';
    if (/^\s*(?:npm|pnpm|yarn|node|git|cd|mkdir|cp|mv|rm|curl|sudo|export)\b/m.test(code)) return 'bash';
    if (/^\s*(?:#|\- |\* |\d+\. )/m.test(code)) return 'markdown';
    if (/\b(?:import|export|const|let|var|function|return|document|window|class|await|async)\b/.test(code)) return 'javascript';
    return '';
  }

  function getCodeLanguage(element, source) {
    const classLanguage = [...element.classList]
      .find((className) => className.startsWith('language-'));
    return normalizeCodeLanguage(element.dataset.uzuCodeLanguage || classLanguage || inferCodeLanguage(source));
  }

  function getCodeTargets(root = document) {
    const scope = root instanceof Element || root instanceof Document ? root : document;
    const nestedCode = queryAll(scope, '.uzu-code-block pre code, pre.uzu-code-block-body code');
    const plainPre = queryAll(scope, '.uzu-code-block pre, pre.uzu-code-block-body')
      .filter((pre) => !pre.querySelector('code'));
    return [...nestedCode, ...plainPre];
  }

  function mapHighlightClass(className) {
    if (!className.startsWith('hljs-')) return '';
    const token = className.replace(/^hljs-/, '');
    return codeHighlightClassMap.get(token) || '';
  }

  function mapCodeHighlightTokens(root) {
    queryAll(root, '[class*="hljs-"]').forEach((node) => {
      const mapped = [...node.classList].map(mapHighlightClass).filter(Boolean);
      node.className = mapped.length
        ? `uzu-code-token ${[...new Set(mapped)].map((token) => `uzu-code-token-${token}`).join(' ')}`
        : 'uzu-code-token';
    });
  }

  function highlightCode(source, language = '') {
    const code = String(source ?? '');
    const normalizedLanguage = normalizeCodeLanguage(language);
    const engine = getHighlightEngine();
    if (!engine || typeof engine.highlight !== 'function') {
      const span = document.createElement('span');
      span.textContent = code;
      const fragment = document.createDocumentFragment();
      fragment.append(span);
      return {
        fragment,
        html: span.innerHTML,
        language: normalizedLanguage,
        highlighted: false
      };
    }
    const result = engine.highlight(code, normalizedLanguage);
    const template = document.createElement('template');
    template.innerHTML = result.value || '';
    if (!template.content.childNodes.length) {
      template.content.append(document.createTextNode(code));
    }
    mapCodeHighlightTokens(template.content);
    return {
      fragment: template.content,
      html: template.innerHTML,
      language: normalizeCodeLanguage(result.language) || normalizedLanguage,
      highlighted: Boolean(result.value)
    };
  }

  function highlightCodeBlock(target) {
    if (!(target instanceof HTMLElement)) return false;
    const source = target.dataset.uzuCodeSource ?? target.textContent ?? '';
    const language = getCodeLanguage(target, source);
    const engine = getHighlightEngine();
    const signature = `${engine && typeof engine.highlight === 'function' ? 'engine' : 'plain'}:${language || 'auto'}:${source}`;
    if (target.dataset.uzuSyntaxHighlighted === signature) return false;
    const result = highlightCode(source, language);
    target.dataset.uzuCodeSource = source;
    target.dataset.uzuCodeLanguage = result.language || language || '';
    target.dataset.uzuSyntaxHighlighted = signature;
    [...target.classList].forEach((className) => {
      if (className.startsWith('language-')) target.classList.remove(className);
    });
    target.classList.add(`language-${target.dataset.uzuCodeLanguage || 'text'}`);
    target.replaceChildren(result.fragment.cloneNode(true));
    target.dispatchEvent(new CustomEvent('uzu-code-highlight', {
      bubbles: true,
      detail: {
        code: target,
        language: target.dataset.uzuCodeLanguage,
        source,
        highlighted: result.highlighted
      }
    }));
    return true;
  }

  function isCodeTargetNearViewport(target) {
    if (!target.isConnected || !target.getClientRects().length) return false;
    const rect = target.getBoundingClientRect();
    const width = window.innerWidth || document.documentElement.clientWidth || 0;
    const height = window.innerHeight || document.documentElement.clientHeight || 0;
    const margin = 360;
    return rect.bottom >= -margin
      && rect.right >= -margin
      && rect.top <= height + margin
      && rect.left <= width + margin;
  }

  function getCodeHighlightObserver() {
    if (typeof IntersectionObserver === 'undefined') return null;
    if (!codeHighlightObserver) {
      codeHighlightObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting && entry.intersectionRatio <= 0) return;
          codeHighlightObserver.unobserve(entry.target);
          highlightCodeBlock(entry.target);
        });
      }, { rootMargin: '360px 0px' });
    }
    return codeHighlightObserver;
  }

  function queueVisibleCodeHighlight(target) {
    if (isCodeTargetNearViewport(target)) return highlightCodeBlock(target);
    const observer = getCodeHighlightObserver();
    if (!observer) return highlightCodeBlock(target);
    observer.observe(target);
    return false;
  }

  function highlightCodeBlocks(root = document, options = {}) {
    let count = 0;
    getCodeTargets(root).forEach((target) => {
      const mode = getCodeHighlightMode(target);
      if (options.respectMode && mode === 'manual') return;
      const changed = options.respectMode && mode === 'visible'
        ? queueVisibleCodeHighlight(target)
        : highlightCodeBlock(target);
      if (changed) count += 1;
    });
    return count;
  }

  function refreshAutomaticCodeHighlights(root = document) {
    window.requestAnimationFrame(() => {
      highlightCodeBlocks(root, { respectMode: true });
    });
  }

  function initCodeHighlightEvents() {
    if (codeHighlightEventsInitialized) return;
    codeHighlightEngineReadyListener = () => refreshAutomaticCodeHighlights(document);
    codeHighlightTabsChangeListener = (event) => {
      if (event.detail?.panel) refreshAutomaticCodeHighlights(event.detail.panel);
    };
    codeHighlightPanelShowListener = (event) => {
      if (event.detail?.panel) refreshAutomaticCodeHighlights(event.detail.panel);
    };
    window.addEventListener('uzu-code-highlight-engine-ready', codeHighlightEngineReadyListener);
    document.addEventListener('uzu-tabs-change', codeHighlightTabsChangeListener);
    document.addEventListener('uzu-panel-show', codeHighlightPanelShowListener);
    codeHighlightEventsInitialized = true;
  }

  function initCodeHighlight(root = document) {
    initCodeHighlightEvents();
    highlightCodeBlocks(root, { respectMode: true });
  }

  function destroyCodeHighlight(root = document) {
    const isWholeRoot = root === document || root === document.documentElement || root === document.body;
    if (codeHighlightObserver) {
      getCodeTargets(root).forEach((target) => codeHighlightObserver.unobserve(target));
    }
    if (isWholeRoot && codeHighlightObserver) {
      codeHighlightObserver.disconnect();
      codeHighlightObserver = null;
    }
    if (isWholeRoot && codeHighlightEventsInitialized) {
      if (codeHighlightEngineReadyListener) {
        window.removeEventListener('uzu-code-highlight-engine-ready', codeHighlightEngineReadyListener);
      }
      if (codeHighlightTabsChangeListener) {
        document.removeEventListener('uzu-tabs-change', codeHighlightTabsChangeListener);
      }
      if (codeHighlightPanelShowListener) {
        document.removeEventListener('uzu-panel-show', codeHighlightPanelShowListener);
      }
      codeHighlightEngineReadyListener = null;
      codeHighlightTabsChangeListener = null;
      codeHighlightPanelShowListener = null;
      codeHighlightEventsInitialized = false;
    }
  }

  function listCodeLanguages() {
    const engine = getHighlightEngine();
    if (!engine || typeof engine.listLanguages !== 'function') return [];
    return engine.listLanguages().map(normalizeCodeLanguage).filter(Boolean);
  }

  function hasCodeLanguage(language) {
    const normalizedLanguage = normalizeCodeLanguage(language);
    if (!normalizedLanguage) return false;
    const engine = getHighlightEngine();
    if (!engine || typeof engine.hasLanguage !== 'function') return false;
    return engine.hasLanguage(normalizedLanguage);
  }
