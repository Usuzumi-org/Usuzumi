  function createJsonToken(text, type = '') {
    const node = document.createElement('span');
    node.className = type ? `uzu-code-token uzu-code-token-${type}` : 'uzu-code-token';
    node.textContent = text;
    return node;
  }

  function createJsonSpacer() {
    const spacer = document.createElement('span');
    spacer.className = 'uzu-json-spacer';
    spacer.setAttribute('aria-hidden', 'true');
    return spacer;
  }

  function createJsonLine(depth, state, foldControl = null) {
    const line = document.createElement('div');
    const code = document.createElement('span');
    line.className = 'uzu-json-line';
    line.dataset.uzuJsonLine = String(state.line += 1);
    line.style.setProperty('--uzu-json-depth', String(depth));
    code.className = 'uzu-json-code';
    line.append(foldControl || createJsonSpacer(), code);
    return { line, code };
  }

  function appendJsonKey(row, key) {
    if (key === null || key === undefined) return;
    const keyNode = createJsonToken(JSON.stringify(String(key)), 'property');
    keyNode.classList.add('uzu-json-key');
    row.append(keyNode, createJsonToken(': ', 'punctuation'));
  }

  function appendJsonComma(row, isLast) {
    if (!isLast) row.append(createJsonToken(',', 'punctuation'));
  }

  function formatJsonSummary(count) {
    return ' ...';
  }

  function createJsonNode(value, key = '', options = {}) {
    const isLast = options.isLast !== false;
    const depth = Number.isFinite(options.depth) ? options.depth : 0;
    const state = options.state || { line: 0 };
    const row = document.createElement('div');
    row.className = 'uzu-json-node';
    if (value && typeof value === 'object') {
      const isArray = Array.isArray(value);
      const entries = Object.entries(value);
      row.classList.add('uzu-json-branch');
      const toggle = document.createElement('button');
      toggle.className = 'uzu-json-toggle';
      toggle.type = 'button';
      toggle.setAttribute('aria-expanded', 'true');
      toggle.setAttribute('aria-label', isArray ? 'Collapse array' : 'Collapse object');
      const { line, code } = createJsonLine(depth, state, toggle);
      appendJsonKey(code, key);
      code.append(createJsonToken(isArray ? '[' : '{', 'punctuation'));
      const summary = createJsonToken(formatJsonSummary(entries.length), 'comment');
      summary.classList.add('uzu-json-summary');
      const inlineClose = createJsonToken(isArray ? ']' : '}', 'punctuation');
      inlineClose.classList.add('uzu-json-inline-close');
      code.append(summary, inlineClose);
      if (!isLast) {
        const inlineComma = createJsonToken(',', 'punctuation');
        inlineComma.classList.add('uzu-json-inline-comma');
        code.append(inlineComma);
      }
      const children = document.createElement('div');
      children.className = 'uzu-json-children';
      children.dataset.uzuJsonChildren = '';
      entries.forEach(([childKey, childValue], index) => {
        children.append(createJsonNode(childValue, isArray ? null : childKey, {
          depth: depth + 1,
          isLast: index === entries.length - 1,
          state
        }));
      });
      const close = createJsonLine(depth, state);
      const closeLine = close.line;
      closeLine.classList.add('uzu-json-line-end');
      close.code.append(createJsonToken(isArray ? ']' : '}', 'punctuation'));
      appendJsonComma(close.code, isLast);
      toggle.addEventListener('click', () => {
        const collapsed = !children.hidden;
        children.hidden = collapsed;
        closeLine.hidden = collapsed;
        toggle.classList.toggle('is-collapsed', collapsed);
        toggle.setAttribute('aria-expanded', collapsed ? 'false' : 'true');
        toggle.setAttribute('aria-label', collapsed ? (isArray ? 'Expand array' : 'Expand object') : (isArray ? 'Collapse array' : 'Collapse object'));
        row.classList.toggle('is-collapsed', collapsed);
      });
      row.append(line, children, closeLine);
      return row;
    }
    const { line, code } = createJsonLine(depth, state);
    appendJsonKey(code, key);
    const valueNode = document.createElement('span');
    const valueType = value === null ? 'null' : typeof value;
    const tokenType = valueType === 'string' ? 'string' : valueType === 'number' ? 'number' : valueType === 'boolean' || valueType === 'null' ? 'keyword' : '';
    valueNode.className = `uzu-json-value uzu-json-${valueType} uzu-code-token${tokenType ? ` uzu-code-token-${tokenType}` : ''}`;
    valueNode.textContent = typeof value === 'string' ? JSON.stringify(value) : String(value);
    code.append(valueNode);
    appendJsonComma(code, isLast);
    row.append(line);
    return row;
  }

  function renderJson(value) {
    const fragment = document.createDocumentFragment();
    fragment.append(createJsonNode(value, null, { state: { line: 0 } }));
    return fragment;
  }

  function updateJsonFoldGutterHover(viewer, event) {
    const line = viewer.querySelector('.uzu-json-line');
    if (!line) return;
    const lineBox = line.getBoundingClientRect();
    const style = getComputedStyle(viewer);
    const lineNumberWidth = Number.parseFloat(style.getPropertyValue('--uzu-json-line-number-width')) || 40;
    const foldWidth = Number.parseFloat(style.getPropertyValue('--uzu-json-fold-width')) || 20;
    const x = event.clientX - lineBox.left;
    const inFoldGutter = x >= lineNumberWidth && x <= lineNumberWidth + foldWidth;
    viewer.classList.toggle('is-fold-gutter-hover', inFoldGutter);
  }

  function initJsonViewers(root = document) {
    queryAll(root, '[data-uzu-json-viewer]').forEach((viewer) => {
      if (!markInitialized(viewer, 'JsonViewer')) return;
      const source = (viewer.querySelector('script[type="application/json"]')?.textContent || viewer.dataset.uzuJsonSource || viewer.textContent || '').trim();
      viewer.dataset.uzuJsonSource = source;
      try {
        const value = JSON.parse(source);
        viewer.replaceChildren(renderJson(value));
        viewer.addEventListener('pointermove', (event) => updateJsonFoldGutterHover(viewer, event));
        viewer.addEventListener('pointerleave', () => viewer.classList.remove('is-fold-gutter-hover'));
      } catch (_) {
        viewer.classList.add('is-invalid');
      }
    });
  }

  function initDiffViewers(root = document) {
    queryAll(root, '[data-uzu-diff-viewer]').forEach((viewer) => {
      if (!markInitialized(viewer, 'DiffViewer') || viewer.querySelector('.uzu-diff-line')) return;
      const source = String(viewer.textContent || '').replace(/\r\n?/g, '\n').trim();
      const lines = source.split('\n');
      viewer.replaceChildren();
      lines.forEach((line, index) => {
        const row = document.createElement('div');
        const type = line.startsWith('+') ? 'add' : line.startsWith('-') ? 'remove' : line.startsWith('@') ? 'meta' : 'context';
        row.className = `uzu-diff-line uzu-diff-line-${type}`;
        const gutter = document.createElement('span');
        gutter.className = 'uzu-diff-gutter';
        gutter.textContent = String(index + 1);
        const code = document.createElement('code');
        code.className = 'uzu-diff-code';
        code.textContent = line;
        row.append(gutter, code);
        viewer.append(row);
      });
    });
  }

  function initEditorShells(root = document) {
    queryAll(root, '[data-uzu-editor]').forEach((editor) => {
      const surface = editor.querySelector('[data-uzu-editor-surface], .uzu-editor-surface');
      if (!markInitialized(editor, 'EditorShell')) return;
      queryAll(editor, '[data-uzu-editor-command]').forEach((button) => {
        const command = button.dataset.uzuEditorCommand || '';
        const value = button.dataset.uzuEditorValue || '';
        if (button.hasAttribute('data-uzu-editor-toggle') && !button.hasAttribute('aria-pressed')) {
          button.setAttribute('aria-pressed', button.getAttribute('aria-pressed') || 'false');
        }
        button.addEventListener('click', () => {
          if (surface && typeof surface.focus === 'function') surface.focus({ preventScroll: true });
          editor.dispatchEvent(new CustomEvent('uzu-editor-command', {
            bubbles: true,
            detail: { editor, surface, button, command, value }
          }));
        });
      });
      if (surface) {
        surface.addEventListener('input', () => {
          const value = 'value' in surface ? surface.value : surface.innerHTML;
          editor.dispatchEvent(new CustomEvent('uzu-editor-change', {
            bubbles: true,
            detail: { editor, surface, value }
          }));
        });
      }
    });
  }

  function shouldRenderMarkdownEditor(editor) {
    const value = editor.getAttribute('data-uzu-markdown-render');
    return value !== null && value !== 'false';
  }

  function initMarkdownEditors(root = document) {
    queryAll(root, '[data-uzu-markdown-editor]').forEach((editor) => {
      const source = editor.querySelector('[data-uzu-markdown-source]');
      const preview = editor.querySelector('[data-uzu-markdown-preview]');
      if (!source) return;
      const getSourceValue = () => {
        return 'value' in source ? source.value : source.textContent;
      };
      const render = (sourceValue = getSourceValue()) => {
        if (!preview) return;
        const value = sourceValue || '';
        editor.dataset.uzuMarkdownValue = value;
        preview.replaceChildren(renderMarkdown(value));
        initCodeHighlight(preview);
        initCodeCopy(preview);
        editor.dispatchEvent(new CustomEvent('uzu-markdown-editor-render', {
          bubbles: true,
          detail: { editor, source, preview, value }
        }));
      };
      if (shouldRenderMarkdownEditor(editor)) render();
      if (!markInitialized(editor, 'MarkdownEditor')) return;
      source.addEventListener('input', () => {
        const value = getSourceValue() || '';
        editor.dataset.uzuMarkdownValue = value;
        editor.dispatchEvent(new CustomEvent('uzu-markdown-editor-change', {
          bubbles: true,
          detail: { editor, source, preview, value }
        }));
        if (shouldRenderMarkdownEditor(editor)) render(value);
      });
    });
  }

  function initInlineEditors(root = document) {
    queryAll(root, '[data-uzu-inline-editor]').forEach((editor) => {
      editor.setAttribute('contenteditable', editor.getAttribute('contenteditable') || 'true');
      editor.setAttribute('role', editor.getAttribute('role') || 'textbox');
      const sync = (emit = true) => {
        editor.classList.toggle('is-empty', !editor.textContent.trim());
        if (emit) {
          editor.dispatchEvent(new CustomEvent('uzu-inline-editor-change', {
            bubbles: true,
            detail: { editor, value: editor.textContent }
          }));
        }
      };
      sync(false);
      if (!markInitialized(editor, 'InlineEditor')) return;
      editor.addEventListener('input', sync);
    });
  }

  function initEditors(root = document) {
    initEditorShells(root);
    initMarkdownEditors(root);
    initInlineEditors(root);
  }
