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

  function getTopbarOverflowSpyMode(topbar) {
    return topbar.dataset.uzuTopbarSpy === 'hash' ? 'hash' : '';
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
      tabindex: element.getAttribute('tabindex'),
      ariaCurrent: element.getAttribute('aria-current')
    };
  }

  function restoreTopbarOverflowRecord(record) {
    if (record.className === null) record.element.removeAttribute('class');
    else record.element.setAttribute('class', record.className);
    if (record.role === null) record.element.removeAttribute('role');
    else record.element.setAttribute('role', record.role);
    if (record.tabindex === null) record.element.removeAttribute('tabindex');
    else record.element.setAttribute('tabindex', record.tabindex);
    if (record.ariaCurrent === null) record.element.removeAttribute('aria-current');
    else record.element.setAttribute('aria-current', record.ariaCurrent);
  }

  function getTopbarOverflowCurrentState(record) {
    return {
      isCurrent: record.element.classList.contains('is-current'),
      ariaCurrent: record.element.getAttribute('aria-current')
    };
  }

  function applyTopbarOverflowCurrentState(record, currentState) {
    if (!currentState) return;
    record.element.classList.toggle('is-current', currentState.isCurrent);
    if (currentState.ariaCurrent === null) record.element.removeAttribute('aria-current');
    else record.element.setAttribute('aria-current', currentState.ariaCurrent);
  }

  function getTopbarOverflowInitialCurrentState(record) {
    return {
      isCurrent: (record.className || '').split(/\s+/).includes('is-current'),
      ariaCurrent: record.ariaCurrent
    };
  }

  function prepareTopbarOverflowMenuItem(record) {
    const classes = new Set((record.element.getAttribute('class') || '').split(/\s+/).filter(Boolean));
    classes.add('uzu-menu-item');
    record.element.setAttribute('class', [...classes].join(' '));
    record.element.setAttribute('role', 'menuitem');
    record.element.setAttribute('tabindex', '-1');
  }

  function getTopbarOverflowHash(record) {
    const href = (record.element.getAttribute('href') || '').trim();
    if (!href.includes('#')) return '';
    if (href.startsWith('#')) return href;
    try {
      const url = new URL(href, window.location.href);
      const current = new URL(window.location.href);
      if (url.origin !== current.origin || url.pathname !== current.pathname || url.search !== current.search) return '';
      return url.hash;
    } catch (_) {
      return '';
    }
  }

  function getTopbarOverflowHashTarget(hash) {
    if (!hash || hash === '#') return null;
    try {
      return document.getElementById(decodeURIComponent(hash.slice(1)));
    } catch (_) {
      return document.getElementById(hash.slice(1));
    }
  }

  function getTopbarOverflowSpyActiveRecord(state) {
    const hashRecords = state.records
      .map((record) => ({ record, hash: getTopbarOverflowHash(record) }))
      .map((item) => ({ ...item, target: getTopbarOverflowHashTarget(item.hash) }))
      .filter((item) => item.hash && item.target);
    const currentHash = window.location.hash;
    if (currentHash) {
      const matched = hashRecords.find((item) => item.hash === currentHash);
      return matched ? matched.record : null;
    }
    const threshold = Math.max(48, state.topbar.getBoundingClientRect().bottom + 24);
    let active = null;
    hashRecords.forEach((item) => {
      const rect = item.target.getBoundingClientRect();
      if (rect.top <= threshold && rect.bottom > 0) active = item.record;
    });
    return active;
  }

  function syncTopbarOverflowSpy(state) {
    if (state.spyMode !== 'hash') return;
    const active = getTopbarOverflowSpyActiveRecord(state);
    if (!active) {
      if (window.location.hash) {
        state.records.forEach((record) => {
          applyTopbarOverflowCurrentState(record, getTopbarOverflowInitialCurrentState(record));
        });
      }
      return;
    }
    state.records.forEach((record) => {
      record.element.classList.toggle('is-current', record === active);
      if (record === active) record.element.setAttribute('aria-current', 'location');
      else record.element.removeAttribute('aria-current');
    });
  }

  function restoreTopbarOverflow(topbar) {
    const state = topbarOverflowStates.get(topbar);
    if (!state) return;
    state.records.forEach((record) => {
      const currentState = getTopbarOverflowCurrentState(record);
      restoreTopbarOverflowRecord(record);
      applyTopbarOverflowCurrentState(record, currentState);
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
    syncTopbarOverflowSpy(state);
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
      const state = { topbar, nav, menu, content, records, observer: null, resize: null, language: null, spy: null, raf: 0, spyMode: getTopbarOverflowSpyMode(topbar) };
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
      if (state.spyMode === 'hash') {
        state.spy = () => queueTopbarOverflow(topbar);
        window.addEventListener('hashchange', state.spy);
        window.addEventListener('scroll', state.spy, { passive: true });
      }
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
      if (state.spy) {
        window.removeEventListener('hashchange', state.spy);
        window.removeEventListener('scroll', state.spy);
      }
      restoreTopbarOverflow(topbar);
      topbarOverflowStates.delete(topbar);
      delete topbar.dataset.uzuTopbarOverflowInitialized;
    });
  }
