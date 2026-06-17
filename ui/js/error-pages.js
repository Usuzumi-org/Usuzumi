  function getErrorPageParam(params, names) {
    for (const name of names) {
      const value = params.get(name);
      if (value !== null && value.trim() !== '') return value.trim();
    }
    return '';
  }

  function getErrorPageLanguage(page) {
    const root = getClosestLanguageRoot(page);
    return normalizeLanguage(root.getAttribute('data-language') || root.getAttribute('data-uzu-lang') || '');
  }

  function getErrorPageQueryValue(params, baseName, language = '') {
    const languages = [...new Set([language, language.split(/[-_]/)[0]].filter(Boolean))];
    const names = languages.flatMap((item) => {
      const upperLanguage = `${item.charAt(0).toUpperCase()}${item.slice(1)}`;
      return [`${baseName}${upperLanguage}`, `${baseName}-${item}`, `${baseName}_${item}`];
    });
    names.push(baseName);
    return getErrorPageParam(params, names);
  }

  function getErrorPageOptionsFromQuery(page) {
    const params = new URLSearchParams(window.location.search || '');
    const language = getErrorPageLanguage(page);
    const primaryLabel = getErrorPageQueryValue(params, 'errorPrimaryLabel', language);
    const primaryHref = getErrorPageQueryValue(params, 'errorPrimaryHref', language);
    const secondaryLabel = getErrorPageQueryValue(params, 'errorSecondaryLabel', language);
    const secondaryHref = getErrorPageQueryValue(params, 'errorSecondaryHref', language);
    return {
      code: getErrorPageQueryValue(params, 'errorCode', language),
      title: getErrorPageQueryValue(params, 'errorTitle', language),
      message: getErrorPageQueryValue(params, 'errorMessage', language),
      documentTitle: getErrorPageQueryValue(params, 'errorDocumentTitle', language),
      actions: {
        primary: primaryLabel || primaryHref ? { label: primaryLabel, href: primaryHref } : null,
        secondary: secondaryLabel || secondaryHref ? { label: secondaryLabel, href: secondaryHref } : null
      }
    };
  }

  function isSafeErrorPageHref(value) {
    const href = String(value || '').trim();
    if (!href) return false;
    if (href.startsWith('#') || href.startsWith('/') || href.startsWith('./') || href.startsWith('../')) return true;
    try {
      return ['http:', 'https:', 'mailto:', 'tel:'].includes(new URL(href, window.location.href).protocol);
    } catch (_) {
      return false;
    }
  }

  function getErrorPageSlot(page, selector) {
    return page.querySelector(selector);
  }

  function setErrorPageText(page, selector, value) {
    if (typeof value !== 'string' || value.trim() === '') return;
    const slot = getErrorPageSlot(page, selector);
    if (slot) slot.textContent = value.trim();
  }

  function normalizeErrorPageActions(settings) {
    const actions = settings.actions && typeof settings.actions === 'object' ? settings.actions : {};
    return {
      primary: settings.primaryAction || actions.primary || (Array.isArray(settings.actions) ? settings.actions[0] : null),
      secondary: settings.secondaryAction || actions.secondary || (Array.isArray(settings.actions) ? settings.actions[1] : null)
    };
  }

  function setErrorPageAction(page, name, options) {
    if (!options || typeof options !== 'object') return null;
    const actionsRoot = page.querySelector('[data-uzu-error-actions]') || page;
    const action = actionsRoot.querySelector(`[data-uzu-error-action="${name}"]`);
    if (!action) return null;
    const applied = {
      label: action.textContent.trim(),
      href: action instanceof HTMLAnchorElement ? action.getAttribute('href') || '' : ''
    };
    if (typeof options.label === 'string' && options.label.trim() !== '') {
      applied.label = options.label.trim();
      action.textContent = applied.label;
    }
    if (isSafeErrorPageHref(options.href) && action instanceof HTMLAnchorElement) {
      applied.href = options.href.trim();
      action.setAttribute('href', applied.href);
    }
    return applied;
  }

  function resolveErrorPage(pageOrSelector) {
    if (pageOrSelector instanceof Element) return pageOrSelector;
    if (typeof pageOrSelector !== 'string' || !pageOrSelector.trim()) return null;
    try {
      return document.querySelector(pageOrSelector);
    } catch (_) {
      return null;
    }
  }

  function setErrorPage(pageOrSelector, options = {}) {
    const page = resolveErrorPage(pageOrSelector);
    if (!page) return null;
    const settings = options || {};
    setErrorPageText(page, '[data-uzu-error-code]', settings.code);
    setErrorPageText(page, '[data-uzu-error-title]', settings.title);
    setErrorPageText(page, '[data-uzu-error-message]', settings.message);
    if (typeof settings.documentTitle === 'string' && settings.documentTitle.trim() !== '') {
      document.title = settings.documentTitle.trim();
    }
    const actions = normalizeErrorPageActions(settings);
    const appliedActions = {
      primary: setErrorPageAction(page, 'primary', actions.primary),
      secondary: setErrorPageAction(page, 'secondary', actions.secondary)
    };
    page.dispatchEvent(new CustomEvent('uzu-error-page-change', {
      bubbles: true,
      detail: {
        page,
        code: settings.code || '',
        title: settings.title || '',
        message: settings.message || '',
        documentTitle: settings.documentTitle || '',
        actions: appliedActions
      }
    }));
    return page;
  }

  function initErrorPages(root = document) {
    queryAll(root, '[data-uzu-error-page]').forEach((page) => {
      if (!markInitialized(page, 'ErrorPage')) return;
      if ((page.dataset.uzuErrorPageSource || '').toLowerCase() === 'query') {
        setErrorPage(page, getErrorPageOptionsFromQuery(page));
      }
    });
  }
