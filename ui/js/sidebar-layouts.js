  const sidebarLayoutStates = new WeakMap();
  const sidebarToggleStates = new WeakMap();
  const sidebarCloseTimers = new WeakMap();
  const sidebarLayoutMedia = window.matchMedia ? window.matchMedia('(max-width: 920px)') : null;
  let sidebarLayoutCounter = 0;

  function normalizeSidebarDefault(value) {
    return ['auto', 'expanded', 'collapsed'].includes(value) ? value : 'expanded';
  }

  function getSidebarLayout(control) {
    const target = control.dataset.uzuSidebarTarget || '';
    if (target) {
      if (target.startsWith('#') && target.length > 1) {
        const layout = document.getElementById(target.slice(1));
        if (layout && layout.matches('[data-uzu-sidebar-layout]')) return layout;
      }
      try {
        const layout = document.querySelector(target);
        if (layout && layout.matches('[data-uzu-sidebar-layout]')) return layout;
      } catch (_) {
        return null;
      }
      return null;
    }
    return control.closest('[data-uzu-sidebar-layout]');
  }

  function getSidebar(layout) {
    return layout.querySelector(':scope > .uzu-sidebar');
  }

  function getSidebarToggles(layout) {
    const scoped = queryAll(layout, '[data-uzu-sidebar-toggle]').filter((toggle) => getSidebarLayout(toggle) === layout);
    const external = queryAll(document, '[data-uzu-sidebar-toggle][data-uzu-sidebar-target]')
      .filter((toggle) => getSidebarLayout(toggle) === layout);
    return [...new Set([...scoped, ...external])];
  }

  function isSidebarNarrow() {
    return Boolean(sidebarLayoutMedia && sidebarLayoutMedia.matches);
  }

  function isSidebarDropdownMode(layout) {
    return isSidebarNarrow() && layout.dataset.uzuSidebarMobile !== 'inline';
  }

  function getInitialSidebarCollapsed(layout) {
    const value = normalizeSidebarDefault(layout.dataset.uzuSidebarDefault || '');
    if (value === 'collapsed') return true;
    if (value === 'auto') return isSidebarNarrow();
    return false;
  }

  function clearSidebarCloseTimer(layout) {
    const timer = sidebarCloseTimers.get(layout);
    if (!timer) return;
    window.clearTimeout(timer);
    sidebarCloseTimers.delete(layout);
  }

  function ensureSidebarId(sidebar) {
    if (!sidebar || sidebar.id) return;
    sidebarLayoutCounter += 1;
    sidebar.id = `uzu-sidebar-${sidebarLayoutCounter}`;
  }

  function syncSidebarToggles(layout, collapsed, sidebar) {
    getSidebarToggles(layout).forEach((toggle) => {
      syncSidebarToggle(toggle, collapsed, sidebar);
    });
  }

  function syncSidebarToggle(toggle, collapsed, sidebar) {
    toggle.setAttribute('aria-expanded', collapsed ? 'false' : 'true');
    if (sidebar?.id) toggle.setAttribute('aria-controls', sidebar.id);
  }

  function syncSidebarToggleForLayout(toggle, layout) {
    const sidebar = getSidebar(layout);
    ensureSidebarId(sidebar);
    syncSidebarToggle(toggle, layout.dataset.uzuSidebarCollapsed === 'true', sidebar);
  }

  function dispatchSidebarLayoutChange(layout, collapsed) {
    layout.dispatchEvent(new CustomEvent('uzu-sidebar-layout-change', {
      bubbles: true,
      detail: {
        collapsed,
        expanded: !collapsed
      }
    }));
  }

  function finishSidebarClose(layout, sidebar) {
    if (layout.dataset.uzuSidebarCollapsed !== 'true') return;
    layout.classList.remove('is-closing');
    if (sidebar) sidebar.hidden = true;
    sidebarCloseTimers.delete(layout);
  }

  function finishSidebarOpen(layout) {
    if (layout.dataset.uzuSidebarCollapsed !== 'false') return;
    layout.classList.remove('is-open');
    sidebarCloseTimers.delete(layout);
  }

  function syncSidebarLayout(layout, collapsed, options = {}) {
    const sidebar = getSidebar(layout);
    const nextCollapsed = Boolean(collapsed);
    const dispatch = options.dispatch !== false;
    const animate = options.animate !== false;
    const wasCollapsed = layout.dataset.uzuSidebarCollapsed === 'true';

    ensureSidebarId(sidebar);
    clearSidebarCloseTimer(layout);

    if (sidebar) {
      if (nextCollapsed) {
        layout.classList.remove('is-open');
        layout.dataset.uzuSidebarCollapsed = 'true';
        if (animate && !sidebar.hidden) {
          layout.classList.add('is-closing');
          const timer = scheduleAfterAnimation([sidebar], () => finishSidebarClose(layout, sidebar));
          if (timer) sidebarCloseTimers.set(layout, timer);
        } else {
          layout.classList.remove('is-closing');
          sidebar.hidden = true;
        }
      } else {
        if (animate && wasCollapsed) {
          layout.classList.remove('is-closing');
          layout.classList.add('is-open');
          sidebar.hidden = false;
          void layout.offsetWidth;
          layout.dataset.uzuSidebarCollapsed = 'false';
          const timer = scheduleAfterAnimation([sidebar], () => finishSidebarOpen(layout));
          if (timer) sidebarCloseTimers.set(layout, timer);
        } else {
          layout.classList.remove('is-open');
          layout.classList.remove('is-closing');
          layout.dataset.uzuSidebarCollapsed = 'false';
          sidebar.hidden = false;
        }
      }
    } else {
      layout.dataset.uzuSidebarCollapsed = nextCollapsed ? 'true' : 'false';
      layout.classList.remove('is-open', 'is-closing');
    }

    syncSidebarToggles(layout, nextCollapsed, sidebar);
    if (dispatch) dispatchSidebarLayoutChange(layout, nextCollapsed);
  }

  function setSidebarLayoutUserChanged(layout) {
    const state = sidebarLayoutStates.get(layout);
    if (state) state.userChanged = true;
  }

  function toggleSidebarLayout(layout) {
    const collapsed = layout.dataset.uzuSidebarCollapsed === 'true';
    setSidebarLayoutUserChanged(layout);
    syncSidebarLayout(layout, !collapsed);
  }

  function handleSidebarLayoutMediaChange() {
    queryAll(document, '[data-uzu-sidebar-layout]').forEach((layout) => {
      if (normalizeSidebarDefault(layout.dataset.uzuSidebarDefault || '') !== 'auto') return;
      const state = sidebarLayoutStates.get(layout);
      if (!state || state.userChanged) return;
      syncSidebarLayout(layout, getInitialSidebarCollapsed(layout), { dispatch: false, animate: false });
    });
  }

  function isSidebarOutsideTarget(layout, target) {
    if (!(target instanceof Element)) return true;
    const sidebar = getSidebar(layout);
    if (sidebar?.contains(target)) return false;
    const toggle = target.closest('[data-uzu-sidebar-toggle]');
    return !(toggle && getSidebarLayout(toggle) === layout);
  }

  function closeOpenSidebarLayouts(target = null) {
    let closed = false;
    queryAll(document, '[data-uzu-sidebar-layout][data-uzu-sidebar-collapsed="false"]').forEach((layout) => {
      if (!isSidebarDropdownMode(layout)) return;
      if (target && !isSidebarOutsideTarget(layout, target)) return;
      setSidebarLayoutUserChanged(layout);
      syncSidebarLayout(layout, true);
      closed = true;
    });
    return closed;
  }

  function initSidebarLayouts(root = document) {
    queryAll(root, '[data-uzu-sidebar-layout]').forEach((layout) => {
      if (!sidebarLayoutStates.has(layout)) sidebarLayoutStates.set(layout, { userChanged: false });
      const state = sidebarLayoutStates.get(layout);
      if (!markInitialized(layout, 'SidebarLayout')) {
        const sidebar = getSidebar(layout);
        ensureSidebarId(sidebar);
        syncSidebarToggles(layout, layout.dataset.uzuSidebarCollapsed === 'true', sidebar);
        return;
      }
      syncSidebarLayout(layout, getInitialSidebarCollapsed(layout), { dispatch: false, animate: false });
      state.onClick = (event) => {
        const control = getScopedEventControl(event, '[data-uzu-sidebar-toggle]', layout, '[data-uzu-sidebar-layout]');
        if (control && getSidebarLayout(control) === layout) {
          event.preventDefault();
          toggleSidebarLayout(layout);
          return;
        }
        const collapseMode = layout.dataset.uzuSidebarCollapseOnSelect || 'false';
        if (collapseMode === 'false' || (collapseMode === 'narrow' && !isSidebarNarrow())) return;
        const sidebar = getSidebar(layout);
        const selected = getScopedEventControl(event, 'a[href], button', sidebar, '.uzu-sidebar');
        if (!selected || selected.matches('[data-uzu-sidebar-toggle]')) return;
        setSidebarLayoutUserChanged(layout);
        syncSidebarLayout(layout, true);
      };
      layout.addEventListener('click', state.onClick);
    });
    queryAll(root, '[data-uzu-sidebar-toggle]').forEach((toggle) => {
      const layout = getSidebarLayout(toggle);
      if (!layout) return;
      syncSidebarToggleForLayout(toggle, layout);
      if (!toggle.hasAttribute('data-uzu-sidebar-target')) return;
      const closestLayout = toggle.closest('[data-uzu-sidebar-layout]');
      if (closestLayout && layout === closestLayout) return;
      if (!markInitialized(toggle, 'SidebarToggle')) return;
      const state = {};
      state.onClick = (event) => {
        const layout = getSidebarLayout(toggle);
        if (!layout) return;
        event.preventDefault();
        toggleSidebarLayout(layout);
      };
      sidebarToggleStates.set(toggle, state);
      toggle.addEventListener('click', state.onClick);
    });
    if (sidebarLayoutMedia && document.documentElement.dataset.uzuSidebarLayoutMediaListener !== 'true') {
      if (sidebarLayoutMedia.addEventListener) {
        sidebarLayoutMedia.addEventListener('change', handleSidebarLayoutMediaChange);
      } else if (sidebarLayoutMedia.addListener) {
        sidebarLayoutMedia.addListener(handleSidebarLayoutMediaChange);
      }
      document.documentElement.dataset.uzuSidebarLayoutMediaListener = 'true';
    }
  }

  function destroySidebarLayouts(root = document) {
    queryAll(root, '[data-uzu-sidebar-layout]').forEach((layout) => {
      const state = sidebarLayoutStates.get(layout);
      if (state?.onClick) layout.removeEventListener('click', state.onClick);
      clearSidebarCloseTimer(layout);
      layout.classList.remove('is-open', 'is-closing');
      sidebarLayoutStates.delete(layout);
      delete layout.dataset.uzuSidebarLayoutInitialized;
    });
    queryAll(root, '[data-uzu-sidebar-toggle][data-uzu-sidebar-target]').forEach((toggle) => {
      const state = sidebarToggleStates.get(toggle);
      if (state?.onClick) toggle.removeEventListener('click', state.onClick);
      sidebarToggleStates.delete(toggle);
      delete toggle.dataset.uzuSidebarToggleInitialized;
    });
    if (!isWholeDocumentRoot(root)) return;
    if (sidebarLayoutMedia && document.documentElement.dataset.uzuSidebarLayoutMediaListener === 'true') {
      if (sidebarLayoutMedia.removeEventListener) {
        sidebarLayoutMedia.removeEventListener('change', handleSidebarLayoutMediaChange);
      } else if (sidebarLayoutMedia.removeListener) {
        sidebarLayoutMedia.removeListener(handleSidebarLayoutMediaChange);
      }
      delete document.documentElement.dataset.uzuSidebarLayoutMediaListener;
    }
  }
