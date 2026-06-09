  const tagInputTriggers = new WeakMap();

  function setTagSelected(tag, selected, emit = true) {
    const nextSelected = Boolean(selected);
    const previousSelected = tag.classList.contains('is-selected') || tag.getAttribute('aria-pressed') === 'true';
    tag.classList.toggle('is-selected', nextSelected);
    tag.setAttribute('aria-pressed', nextSelected ? 'true' : 'false');
    if (emit && nextSelected !== previousSelected) {
      tag.dispatchEvent(new CustomEvent('uzu-tag-change', {
        bubbles: true,
        detail: { selected: nextSelected, tag, value: getControlValue(tag, 'uzuTagValue') }
      }));
      tag.dispatchEvent(new Event('change', { bubbles: true }));
    }
  }

  function closeTag(tag, closeButton = null) {
    const event = new CustomEvent('uzu-tag-close', {
      bubbles: true,
      cancelable: true,
      detail: { tag, closeButton, value: getControlValue(tag, 'uzuTagValue') }
    });
    tag.dispatchEvent(event);
    if (!event.defaultPrevented) tag.hidden = true;
  }

  function isSelectableTag(tag) {
    return tag.dataset.uzuTagSelectable === 'true' || tag.hasAttribute('aria-pressed');
  }

  function getTagListAddButton(list) {
    return getScopedControls(list, '[data-uzu-tag-add], .uzu-tag-add', '[data-uzu-tag-list]')[0] || null;
  }

  function getOpenTagInput(list) {
    return getScopedControls(list, '[data-uzu-tag-input], .uzu-tag-input', '[data-uzu-tag-list]')[0] || null;
  }

  function getTagInputControl(inputTag) {
    return inputTag?.querySelector?.('[data-uzu-tag-input-control], .uzu-tag-input-control') || null;
  }

  function getTagAddText(list, trigger, key, fallback, useTriggerLabel = false) {
    return list.dataset[key] || trigger?.dataset?.[key] || (useTriggerLabel ? trigger?.getAttribute?.('aria-label') : '') || fallback;
  }

  function setTagInputWidth(input) {
    const length = String(input.value || input.placeholder || '').length;
    input.style.width = `${Math.max(8, Math.min(length + 2, 24))}ch`;
  }

  function createTagIcon(path) {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('aria-hidden', 'true');
    svg.setAttribute('fill', 'none');
    const iconPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    iconPath.setAttribute('d', path);
    iconPath.setAttribute('stroke', 'currentColor');
    iconPath.setAttribute('stroke-width', '1.8');
    iconPath.setAttribute('stroke-linecap', 'round');
    svg.append(iconPath);
    return svg;
  }

  function createAddedTag(list, label, trigger = null) {
    const tag = document.createElement('span');
    const value = label;
    const closeText = list.dataset.uzuTagCloseLabel || trigger?.dataset?.uzuTagCloseLabel || 'Remove tag';
    const closeLabel = closeText.includes('{label}') ? closeText.split('{label}').join(label) : `${closeText}: ${label}`;
    const text = document.createElement('span');
    const closeButton = document.createElement('button');

    tag.className = 'uzu-tag';
    tag.dataset.uzuTag = '';
    tag.dataset.uzuTagValue = value;
    text.textContent = label;
    closeButton.className = 'uzu-tag-close';
    closeButton.type = 'button';
    closeButton.dataset.uzuTagClose = '';
    closeButton.setAttribute('aria-label', closeLabel);
    closeButton.append(createTagIcon('M6 6l12 12M18 6 6 18'));
    tag.append(text, closeButton);
    return tag;
  }

  function closeTagInput(list, inputTag, options = {}) {
    const input = getTagInputControl(inputTag);
    if (!input || input.dataset.uzuTagInputClosing === 'true') return null;
    input.dataset.uzuTagInputClosing = 'true';
    const label = String(input.value || '').trim();
    const trigger = tagInputTriggers.get(inputTag) || getTagListAddButton(list);
    let tag = null;

    if (options.commit !== false && label) {
      tag = createAddedTag(list, label, trigger);
      const event = new CustomEvent('uzu-tag-add', {
        bubbles: true,
        cancelable: true,
        detail: {
          list,
          tag,
          input,
          trigger,
          value: tag.dataset.uzuTagValue,
          label
        }
      });
      list.dispatchEvent(event);
      if (event.defaultPrevented) {
        delete input.dataset.uzuTagInputClosing;
        if (options.restoreFocus && typeof input.focus === 'function') {
          window.requestAnimationFrame(() => {
            if (input.isConnected) input.focus();
          });
        }
        return null;
      }
      if (!event.defaultPrevented) {
        inputTag.before(tag);
        initTags(tag);
        list.dispatchEvent(new Event('change', { bubbles: true }));
      }
    }

    inputTag.remove();
    list.classList.remove('is-adding');
    if (options.restoreFocus && trigger && typeof trigger.focus === 'function') trigger.focus();
    return tag;
  }

  function openTagInput(list, trigger = null) {
    const existing = getOpenTagInput(list);
    if (existing) {
      const input = getTagInputControl(existing);
      if (input) input.focus();
      return input || existing;
    }

    const inputTag = document.createElement('span');
    const input = document.createElement('input');
    inputTag.className = 'uzu-tag uzu-tag-input';
    inputTag.dataset.uzuTagInput = '';
    input.type = 'text';
    input.className = 'uzu-tag-input-control';
    input.dataset.uzuTagInputControl = '';
    input.autocomplete = 'off';
    input.spellcheck = false;
    input.setAttribute('aria-label', getTagAddText(list, trigger, 'uzuTagInputLabel', 'Add tag', true));
    const placeholder = getTagAddText(list, trigger, 'uzuTagInputPlaceholder', '');
    if (placeholder) input.placeholder = placeholder;
    setTagInputWidth(input);
    inputTag.append(input);

    const addButton = trigger || getTagListAddButton(list);
    tagInputTriggers.set(inputTag, addButton);
    list.insertBefore(inputTag, addButton || null);
    list.classList.add('is-adding');

    input.addEventListener('input', () => setTagInputWidth(input));
    input.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        closeTagInput(list, inputTag, { commit: true, restoreFocus: true });
      } else if (event.key === 'Escape') {
        event.preventDefault();
        closeTagInput(list, inputTag, { commit: false, restoreFocus: true });
      }
    });
    input.addEventListener('blur', () => {
      window.setTimeout(() => {
        if (inputTag.isConnected) closeTagInput(list, inputTag, { commit: true });
      }, 0);
    });

    window.requestAnimationFrame(() => input.focus());
    return input;
  }

  function initTagLists(root = document) {
    queryAll(root, '[data-uzu-tag-list]').forEach((list) => {
      getScopedControls(list, '[data-uzu-tag-add], .uzu-tag-add', '[data-uzu-tag-list]').forEach((addButton) => {
        addButton.setAttribute('aria-label', addButton.getAttribute('aria-label') || 'Add tag');
        addButton.setAttribute('type', addButton.getAttribute('type') || 'button');
      });
      if (!markInitialized(list, 'TagList')) return;
      list.addEventListener('click', (event) => {
        const trigger = getScopedEventControl(event, '[data-uzu-tag-add], .uzu-tag-add', list, '[data-uzu-tag-list]');
        if (!trigger || isControlDisabled(trigger)) return;
        event.preventDefault();
        openTagInput(list, trigger);
      });
    });
  }

  function initTags(root = document) {
    initTagLists(root);
    queryAll(root, '[data-uzu-tag]').forEach((tag) => {
      const selectable = isSelectableTag(tag);
      if (selectable) {
        if (!/^(A|BUTTON)$/i.test(tag.tagName)) {
          tag.setAttribute('role', tag.getAttribute('role') || 'button');
          tag.setAttribute('tabindex', tag.getAttribute('tabindex') || '0');
        }
        setTagSelected(tag, tag.classList.contains('is-selected') || tag.getAttribute('aria-pressed') === 'true', false);
      }
      queryAll(tag, '[data-uzu-tag-close], .uzu-tag-close').forEach((button) => {
        button.setAttribute('aria-label', button.getAttribute('aria-label') || 'Remove tag');
      });
      if (!markInitialized(tag, 'Tag')) return;
      tag.addEventListener('click', (event) => {
        const closeButton = getScopedEventControl(event, '[data-uzu-tag-close], .uzu-tag-close', tag, '[data-uzu-tag]');
        if (closeButton) {
          event.preventDefault();
          closeTag(tag, closeButton);
          return;
        }
        if (selectable && !isControlDisabled(tag)) {
          setTagSelected(tag, !(tag.classList.contains('is-selected') || tag.getAttribute('aria-pressed') === 'true'));
        }
      });
      tag.addEventListener('keydown', (event) => {
        if (!selectable || isControlDisabled(tag) || !['Enter', ' '].includes(event.key)) return;
        event.preventDefault();
        setTagSelected(tag, !(tag.classList.contains('is-selected') || tag.getAttribute('aria-pressed') === 'true'));
      });
    });
  }
