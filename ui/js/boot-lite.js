  function handleLiteDocumentClick(event) {
    queryAll(document, '[data-uzu-language-select].is-open').forEach((select) => {
      if (!select.contains(event.target)) closeLanguageSelect(select);
    });
    queryAll(document, '[data-uzu-menu].is-open').forEach((menu) => {
      const trigger = getMenuTrigger(menu);
      if (!menu.contains(event.target) && !(trigger instanceof Element && trigger.contains(event.target))) closeMenu(menu);
    });
  }

  function handleLiteDocumentKeydown(event) {
    if (event.key !== 'Escape') return;
    if (closeOpenLanguageSelects() || closeOpenMenus()) event.preventDefault();
  }

  function initLiteGlobalListeners() {
    if (document.documentElement.dataset.uzuGlobalListeners === 'true') return;
    document.addEventListener('click', handleLiteDocumentClick);
    document.addEventListener('keydown', handleLiteDocumentKeydown);
    resizeListener = () => queueIndicatorRefresh();
    window.addEventListener('resize', resizeListener);
    document.documentElement.dataset.uzuGlobalListeners = 'true';
  }

  function isWholeDocumentRoot(root) {
    return root === document || root === document.documentElement || root === document.body;
  }

  function destroyLite(root = document) {
    destroyTopbarOverflows(root);
    if (!isWholeDocumentRoot(root)) return;
    if (themeMediaQuery) {
      if (themeMediaQuery.removeEventListener) {
        themeMediaQuery.removeEventListener('change', handleThemePreferenceChange);
      } else if (themeMediaQuery.removeListener) {
        themeMediaQuery.removeListener(handleThemePreferenceChange);
      }
      themeMediaQuery = null;
    }
    delete document.documentElement.dataset.uzuThemeMediaListener;
    if (resizeListener) {
      window.removeEventListener('resize', resizeListener);
      resizeListener = null;
    }
    document.removeEventListener('click', handleLiteDocumentClick);
    document.removeEventListener('keydown', handleLiteDocumentKeydown);
    delete document.documentElement.dataset.uzuGlobalListeners;
  }

  function initLite(root = document) {
    syncRootClass();
    initLiteGlobalListeners();
    for (const fn of [initThemeToggles, initLanguageSelects, initMenus, initTopbarOverflows, initErrorPages, initCodeCopy]) {
      try { fn(root); } catch (error) { console.error('[usuzumi]', error); }
    }
    queueIndicatorRefresh(root);
  }

  function shouldAutoInit() {
    return document.documentElement.getAttribute('data-uzu-init') !== 'manual'
      && document.body?.getAttribute('data-uzu-init') !== 'manual';
  }

  window.Usuzumi = {
    init: initLite,
    applyTheme,
    applyLanguage,
    openMenu,
    closeMenu,
    setErrorPage,
    initCodeCopy,
    refreshCodeCopyLabels,
    destroy: destroyLite
  };

  if (shouldAutoInit()) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        if (shouldAutoInit()) initLite();
      }, { once: true });
    } else {
      initLite();
    }
  }
