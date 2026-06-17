  const topbarOverflowStates = new WeakMap();

  function getTopbarOverflowNav(topbar) {
    return getScopedControls(topbar, '.uzu-nav', '[data-uzu-topbar-overflow]')[0] || null;
  }

  function getTopbarOverflowMenu(topbar) {
    return getScopedControls(topbar, '[data-uzu-topbar-overflow-menu]', '[data-uzu-topbar-overflow]')[0] || null;
  }

  function getTopbarOverflowContent(menu) {
    return menu?.querySelector('[data-uzu-menu-content], .uzu-menu-content') || null;
  }

  function getTopbarOverflowItems(nav, menu) {
    return [...nav.children].filter((child) => child !== menu && child.matches('a, button'));
  }

  function getTopbarOverflowMinVisible(topbar) {
    const value = Number.parseInt(topbar.dataset.uzuTopbarOverflowMinVisible || '0', 10);
    return Number.isFinite(value) && value > 0 ? value : 0;
  }

  function setTopbarOverflowMenuVisible(menu, visible) {
    const content = getTopbarOverflowContent(menu);
    const trigger = menu?.querySelector('[data-uzu-menu-trigger], .uzu-menu-trigger');
    if (!menu || !content) return;
    menu.hidden = !visible;
    if (!visible) {
      menu.classList.remove('is-open', 'is-closing');
      content.hidden = true;
      if (trigger) trigger.setAttribute('aria-expanded', 'false');
    }
  }

  function captureTopbarOverflowRecord(element) {
    return {
      element,
      className: element.getAttribute('class'),
      role: element.getAttribute('role'),
      tabindex: element.getAttribute('tabindex')
    };
  }

  function restoreTopbarOverflowRecord(record) {
    if (record.className === null) record.element.removeAttribute('class');
    else record.element.setAttribute('class', record.className);
    if (record.role === null) record.element.removeAttribute('role');
    else record.element.setAttribute('role', record.role);
    if (record.tabindex === null) record.element.removeAttribute('tabindex');
    else record.element.setAttribute('tabindex', record.tabindex);
  }

  function prepareTopbarOverflowMenuItem(record) {
    const classes = new Set((record.className || '').split(/\s+/).filter(Boolean));
    classes.add('uzu-menu-item');
    record.element.setAttribute('class', [...classes].join(' '));
    record.element.setAttribute('role', 'menuitem');
    record.element.setAttribute('tabindex', '-1');
  }

  function restoreTopbarOverflow(topbar) {
    const state = topbarOverflowStates.get(topbar);
    if (!state) return;
    state.records.forEach((record) => {
      restoreTopbarOverflowRecord(record);
      if (record.element.parentElement !== state.nav) {
        state.nav.insertBefore(record.element, state.menu);
      }
    });
    state.content.replaceChildren();
    setTopbarOverflowMenuVisible(state.menu, false);
  }

  function getTopbarOverflowRects(elements) {
    return elements
      .filter((element) => element !== null && element !== undefined && !element.hidden)
      .map((element) => element.getBoundingClientRect())
      .filter((rect) => rect.width > 0 || rect.height > 0);
  }

  function isTopbarOverflowing(state) {
    const topbarRect = state.topbar.getBoundingClientRect();
    const navRect = state.nav.getBoundingClientRect();
    const topbarRects = getTopbarOverflowRects([...state.topbar.children]);
    const navRects = getTopbarOverflowRects([...state.nav.children].filter((element) => element !== state.menu));
    const right = topbarRects.length ? Math.max(...topbarRects.map((rect) => rect.right)) : topbarRect.right;
    const left = topbarRects.length ? Math.min(...topbarRects.map((rect) => rect.left)) : topbarRect.left;
    const navRight = navRects.length ? Math.max(...navRects.map((rect) => rect.right)) : navRect.right;
    const navLeft = navRects.length ? Math.min(...navRects.map((rect) => rect.left)) : navRect.left;
    return state.topbar.scrollWidth > state.topbar.clientWidth + 1
      || state.nav.scrollWidth > state.nav.clientWidth + 1
      || right > topbarRect.right + 1
      || left < topbarRect.left - 1
      || navRight > navRect.right + 1
      || navLeft < navRect.left - 1;
  }

  function syncTopbarOverflow(topbar) {
    const state = topbarOverflowStates.get(topbar);
    if (!state || !topbar.isConnected) return;
    restoreTopbarOverflow(topbar);
    const minVisible = Math.min(getTopbarOverflowMinVisible(topbar), state.records.length);
    if (!isTopbarOverflowing(state)) return;
    setTopbarOverflowMenuVisible(state.menu, true);
    for (let index = state.records.length - 1; index >= minVisible; index -= 1) {
      const record = state.records[index];
      prepareTopbarOverflowMenuItem(record);
      state.content.insertBefore(record.element, state.content.firstElementChild);
      if (!isTopbarOverflowing(state)) break;
    }
  }

  function queueTopbarOverflow(topbar) {
    const state = topbarOverflowStates.get(topbar);
    if (!state) return;
    if (state.raf) window.cancelAnimationFrame(state.raf);
    state.raf = window.requestAnimationFrame(() => {
      state.raf = 0;
      syncTopbarOverflow(topbar);
    });
  }

  function queueTopbarOverflows(root = document) {
    queryAll(root, '[data-uzu-topbar-overflow]').forEach((topbar) => queueTopbarOverflow(topbar));
  }

  function initTopbarOverflows(root = document) {
    queryAll(root, '[data-uzu-topbar-overflow]').forEach((topbar) => {
      const nav = getTopbarOverflowNav(topbar);
      const menu = getTopbarOverflowMenu(topbar);
      const content = getTopbarOverflowContent(menu);
      if (!nav || !menu || !content) return;
      if (!markInitialized(topbar, 'TopbarOverflow')) return;
      const records = getTopbarOverflowItems(nav, menu).map(captureTopbarOverflowRecord);
      const state = { topbar, nav, menu, content, records, observer: null, resize: null, language: null, raf: 0 };
      topbarOverflowStates.set(topbar, state);
      setTopbarOverflowMenuVisible(menu, false);
      if (typeof ResizeObserver !== 'undefined') {
        state.observer = new ResizeObserver(() => queueTopbarOverflow(topbar));
        state.observer.observe(topbar);
        state.observer.observe(nav);
      }
      state.resize = () => queueTopbarOverflow(topbar);
      window.addEventListener('resize', state.resize);
      state.language = () => queueTopbarOverflow(topbar);
      topbar.addEventListener('uzu-language-change', state.language);
      queueTopbarOverflow(topbar);
    });
  }

  function destroyTopbarOverflows(root = document) {
    queryAll(root, '[data-uzu-topbar-overflow]').forEach((topbar) => {
      const state = topbarOverflowStates.get(topbar);
      if (!state) return;
      if (state.raf) window.cancelAnimationFrame(state.raf);
      if (state.observer) state.observer.disconnect();
      if (state.resize) window.removeEventListener('resize', state.resize);
      if (state.language) topbar.removeEventListener('uzu-language-change', state.language);
      restoreTopbarOverflow(topbar);
      topbarOverflowStates.delete(topbar);
      delete topbar.dataset.uzuTopbarOverflowInitialized;
    });
  }
