  function handleDocumentClick(event) {
    queryAll(document, '[data-uzu-select].is-open').forEach((select) => {
      if (!select.contains(event.target)) closeSelect(select);
    });
    queryAll(document, '[data-uzu-combobox].is-open').forEach((combobox) => {
      if (!combobox.contains(event.target)) closeCombobox(combobox);
    });
    queryAll(document, '[data-uzu-language-select].is-open').forEach((select) => {
      if (!select.contains(event.target)) closeLanguageSelect(select);
    });
    queryAll(document, '[data-uzu-menu].is-open, [data-uzu-context-menu].is-open').forEach((menu) => {
      const trigger = getContextMenuTrigger(menu);
      if (!menu.contains(event.target) && !(trigger instanceof Element && trigger.contains(event.target))) closeMenu(menu);
    });
    queryAll(document, '[data-uzu-popover].is-open').forEach((popover) => {
      if (!popover.contains(event.target)) closePopover(popover);
    });
    closeOpenSidebarLayouts(event.target);
  }

  function handleDocumentKeydown(event) {
    if (event.key !== 'Escape') return;
    if (closeOpenLanguageSelects() || closeOpenMenus() || closeOpenPopovers() || closeOpenSidebarLayouts()) {
      event.preventDefault();
    } else if (activeDialog) {
      event.preventDefault();
      closeDialog(activeDialog);
    }
  }

  function trapDialogFocus(event) {
    if (event.key !== 'Tab' || !activeDialog) return;
    const focusable = getFocusable(activeDialog);
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  function initGlobalListeners() {
    if (document.documentElement.dataset.uzuGlobalListeners === 'true') return;
    document.addEventListener('click', handleDocumentClick);
    document.addEventListener('keydown', handleDocumentKeydown);
    document.addEventListener('keydown', trapDialogFocus);
    resizeListener = () => queueIndicatorRefresh();
    window.addEventListener('resize', resizeListener);
    document.documentElement.dataset.uzuGlobalListeners = 'true';
  }

  function initAutoInit(root = document) {
    if (typeof MutationObserver === 'undefined') return;
    queryAll(root, '[data-uzu-auto-init]').forEach((container) => {
      if (autoInitObservers.has(container)) return;
      const observer = new MutationObserver((records) => {
        const added = [];
        records.forEach((record) => {
          record.addedNodes.forEach((node) => {
            if (node instanceof Element) added.push(node);
          });
        });
        if (!added.length) return;
        window.requestAnimationFrame(() => {
          if (!container.isConnected) return;
          added.forEach((node) => {
            if (node.isConnected && container.contains(node)) init(node);
          });
        });
      });
      observer.observe(container, { childList: true, subtree: true });
      autoInitObservers.set(container, observer);
    });
  }

  function isWholeDocumentRoot(root) {
    return root === document || root === document.documentElement || root === document.body;
  }

  function hasInitTargets(root, selector) {
    if (!selector) return true;
    try {
      return root instanceof Element && root.matches(selector) ? true : !!root.querySelector(selector);
    } catch (_) {
      return true;
    }
  }

  function rootContains(root, node) {
    return root === document || root === node || (root instanceof Element && root.contains(node));
  }

  function destroy(root = document) {
    queryAll(root, '[data-uzu-auto-init]').forEach((container) => {
      const observer = autoInitObservers.get(container);
      if (observer) {
        observer.disconnect();
        autoInitObservers.delete(container);
      }
    });
    queryAll(root, '[data-uzu-panel-nav], [data-uzu-panel-index]').forEach((nav) => {
      const listener = panelNavHashListeners.get(nav);
      if (!listener) return;
      window.removeEventListener('hashchange', listener);
      panelNavHashListeners.delete(nav);
    });
    destroySidebarLayouts(root);
    destroyTopbarOverflows(root);
    destroyHeatmaps(root);
    destroyGalleries(root);
    queryAll(root, '[data-uzu-tooltip]').forEach((tooltip) => {
      const description = tooltipNodes.get(tooltip);
      if (description && description.parentNode) {
        description.remove();
      }
      if (description) {
        const describedBy = (tooltip.getAttribute('aria-describedby') || '').split(/\s+/).filter(Boolean);
        const nextDescribedBy = describedBy.filter((id) => id !== description.id).join(' ');
        if (nextDescribedBy) {
          tooltip.setAttribute('aria-describedby', nextDescribedBy);
        } else {
          tooltip.removeAttribute('aria-describedby');
        }
      }
      tooltipNodes.delete(tooltip);
    });
    [...activePointerDrags].forEach(([handle, stop]) => {
      if (!rootContains(root, handle)) return;
      try { stop(); } catch (_) {}
      handle.removeEventListener('lostpointercapture', stop);
    });
    if (isWholeDocumentRoot(root) || (dialogIsolationState && rootContains(root, dialogIsolationState.dialog))) {
      restoreDialogIsolation();
    }
    if (activeDialog && rootContains(root, activeDialog)) {
      const timer = dialogCloseTimers.get(activeDialog);
      if (timer) {
        window.clearTimeout(timer);
        dialogCloseTimers.delete(activeDialog);
      }
      activeDialog = null;
      activeDialogTrigger = null;
    }
    for (let index = dialogStack.length - 1; index >= 0; index -= 1) {
      const dialog = dialogStack[index];
      if (rootContains(root, dialog)) {
        dialogStack.splice(index, 1);
        dialogTriggers.delete(dialog);
      }
    }
    const dialogNodes = new Set(queryAll(root, '[data-uzu-dialog-overlay], [data-uzu-dialog]'));
    queryAll(root, '[data-uzu-dialog]').forEach((dialog) => {
      const overlay = dialog.closest('[data-uzu-dialog-overlay]');
      if (overlay) dialogNodes.add(overlay);
    });
    dialogNodes.forEach((node) => {
      const timer = dialogCloseTimers.get(node);
      if (timer) {
        window.clearTimeout(timer);
        dialogCloseTimers.delete(node);
      }
      node.classList.remove('is-open');
      node.classList.remove('is-closing');
      node.hidden = true;
    });
    queryAll(root, '[data-uzu-popover]').forEach((popover) => {
      const timer = popoverCloseTimers.get(popover);
      if (timer) {
        window.clearTimeout(timer);
        popoverCloseTimers.delete(popover);
      }
      const content = getPopoverContent(popover);
      popover.classList.remove('is-open', 'is-closing');
      if (content) content.hidden = true;
      const trigger = getPopoverTrigger(popover);
      if (trigger) trigger.setAttribute('aria-expanded', 'false');
    });
    destroyCodeHighlight(root);
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
    document.removeEventListener('click', handleDocumentClick);
    document.removeEventListener('keydown', handleDocumentKeydown);
    document.removeEventListener('keydown', trapDialogFocus);
    delete document.documentElement.dataset.uzuGlobalListeners;
  }

  function init(root = document) {
    syncRootClass();
    initGlobalListeners();
    const initRegistry = [
      [initThemeToggles, '[data-theme], [data-theme-mode], [data-uzu-theme], [data-uzu-theme-toggle]'],
      [initLanguageSelects, '[data-language], [data-uzu-lang], [data-uzu-language-root], [data-uzu-language-select], [data-lang]'],
      [initSelects, '[data-uzu-select]'],
      [initTabs, '[data-uzu-tabs]'],
      [initSegmented, '[data-uzu-segmented]'],
      [initPaginations, '[data-uzu-pagination]'],
      [initSwitches, '[data-uzu-switch]'],
      [initForms, '[data-uzu-form], [data-uzu-field]'],
      [initSearches, '[data-uzu-search]'],
      [initPasswords, '[data-uzu-password]'],
      [initSteppers, '[data-uzu-stepper]'],
      [initSliders, '[data-uzu-slider], .uzu-slider'],
      [initMenus, '[data-uzu-menu]'],
      [initTopbarOverflows, '[data-uzu-topbar-overflow]'],
      [initContextMenus, '[data-uzu-context-menu]'],
      [initMenubars, '[data-uzu-menubar]'],
      [initCommands, '[data-uzu-command]'],
      [initComboboxes, '[data-uzu-combobox]'],
      [initDataGrids, '[data-uzu-data-grid]'],
      [initHeatmaps, '[data-uzu-heatmap]'],
      [initGalleries, '[data-uzu-gallery], [data-uzu-image-viewer]'],
      [initTrees, '[data-uzu-tree]'],
      [initDisclosures, '[data-uzu-disclosure]'],
      [initAccordions, '[data-uzu-accordion]'],
      [initHoverCards, '[data-uzu-hover-card]'],
      [initPopovers, '[data-uzu-popover]'],
      [initTags, '[data-uzu-tag], [data-uzu-tag-list], [data-uzu-tag-add]'],
      [initSplitPanes, '[data-uzu-split-pane]'],
      [initResizables, '[data-uzu-resizable]'],
      [initSidebarLayouts, '[data-uzu-sidebar-layout], [data-uzu-sidebar-toggle]'],
      [initJsonViewers, '[data-uzu-json-viewer]'],
      [initDiffViewers, '[data-uzu-diff-viewer]'],
      [initEditors, '[data-uzu-inline-editor], [data-uzu-markdown-editor]'],
      [initDialogs, '[data-uzu-dialog], [data-uzu-dialog-overlay]'],
      [initToasts, '[data-uzu-toast], [data-uzu-toast-trigger]'],
      [initTooltips, '[data-uzu-tooltip]'],
      [initStepNavs, '[data-uzu-step-nav]'],
      [initPanelNavs, '[data-uzu-panel-nav], [data-uzu-panel-index]'],
      [initErrorPages, '[data-uzu-error-page]'],
      [initMarkdown, '[data-uzu-markdown]'],
      [initCodeHighlight, 'pre code, code[class*="language-"], [data-uzu-code-highlight-target]'],
      [initCodeCopy, '[data-uzu-code-copy]']
    ];
    for (const [fn, selector] of initRegistry) {
      if (!hasInitTargets(root, selector)) continue;
      try { fn(root); } catch (error) { console.error('[usuzumi]', error); }
    }
    initAutoInit(root);
    queueIndicatorRefresh(root);
  }

  function shouldAutoInit() {
    return document.documentElement.getAttribute('data-uzu-init') !== 'manual'
      && document.body?.getAttribute('data-uzu-init') !== 'manual';
  }

  window.Usuzumi = {
    init,
    applyTheme,
    applyLanguage,
    setSwitchState,
    setPasswordVisible,
    setStepperValue,
    setComboboxValue,
    setDataGridRowSelected,
    refreshDataGrid,
    setHeatmapData,
    selectHeatmapDate,
    refreshHeatmap,
    setGalleryItems,
    refreshGallery,
    openImageViewer,
    closeImageViewer,
    setTagSelected,
    setSplitPaneSize,
    setResizableSize,
    setTreeItemExpanded,
    validateForm,
    renderJson,
    openMenu,
    closeMenu,
    openPopover,
    closePopover,
    setPaginationPage: syncPaginationState,
    setStepNavStep: syncStepNavState,
    renderMarkdown,
    highlightCode,
    highlightCodeBlock,
    highlightCodeBlocks,
    initCodeHighlight,
    listCodeLanguages,
    hasCodeLanguage,
    initCodeCopy,
    refreshCodeCopyLabels,
    showToast,
    closeToast,
    setErrorPage,
    openDialog,
    closeDialog,
    destroy
  };

  if (shouldAutoInit()) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        if (shouldAutoInit()) init();
      }, { once: true });
    } else {
      init();
    }
  }
