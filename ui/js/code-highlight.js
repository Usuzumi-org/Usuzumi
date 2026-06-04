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
    const engine = typeof UsuzumiHighlightEngine !== 'undefined' ? UsuzumiHighlightEngine : null;
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
    const signature = `${language || 'auto'}:${source}`;
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

  function highlightCodeBlocks(root = document) {
    let count = 0;
    getCodeTargets(root).forEach((target) => {
      if (highlightCodeBlock(target)) count += 1;
    });
    return count;
  }

  function initCodeHighlight(root = document) {
    highlightCodeBlocks(root);
  }

  function listCodeLanguages() {
    const engine = typeof UsuzumiHighlightEngine !== 'undefined' ? UsuzumiHighlightEngine : null;
    if (!engine || typeof engine.listLanguages !== 'function') return [];
    return engine.listLanguages().map(normalizeCodeLanguage).filter(Boolean);
  }

  function hasCodeLanguage(language) {
    const normalizedLanguage = normalizeCodeLanguage(language);
    if (!normalizedLanguage) return false;
    const engine = typeof UsuzumiHighlightEngine !== 'undefined' ? UsuzumiHighlightEngine : null;
    if (!engine || typeof engine.hasLanguage !== 'function') return false;
    return engine.hasLanguage(normalizedLanguage);
  }
