  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  let selectCounter = 0;
  let activeDialog = null;
  let activeDialogTrigger = null;
  const selectCloseTimers = new WeakMap();
  const languageSelectCloseTimers = new WeakMap();
  const disclosureCloseTimers = new WeakMap();
  const dialogCloseTimers = new WeakMap();
  const toastCloseTimers = new WeakMap();
  const menuCloseTimers = new WeakMap();
  const popoverCloseTimers = new WeakMap();
  const menuActiveTriggers = new WeakMap();
  const hoverCardCloseTimers = new WeakMap();
  const hoverCardOpenTimers = new WeakMap();
  const indicatorInstantTimers = new WeakMap();
  const codeCopyDefaultContent = new WeakMap();
  const comboboxSelectionInputs = new WeakSet();
  const autoInitObservers = new WeakMap();
  const panelNavHashListeners = new WeakMap();
  const tooltipNodes = new WeakMap();
  const dialogTriggers = new WeakMap();
  const activePointerDrags = new Map();
  const dialogStack = [];
  let themeMediaQuery = null;
  let resizeListener = null;
  let dialogIsolationState = null;
  let dialogScrollLockState = null;

  const storage = {
    get(key) {
      try {
        return window.localStorage.getItem(key);
      } catch (_) {
        return null;
      }
    },
    set(key, value) {
      try {
        window.localStorage.setItem(key, value);
      } catch (_) {
        /* localStorage can be unavailable in embedded previews. */
      }
    }
  };

  function fallbackCopyText(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'fixed';
    textarea.style.left = '-9999px';
    document.body.append(textarea);
    textarea.select();
    try {
      document.execCommand('copy');
      return Promise.resolve();
    } finally {
      textarea.remove();
    }
  }

  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text).catch(() => fallbackCopyText(text));
    }
    return fallbackCopyText(text);
  }

  function queryAll(root, selector) {
    const scope = root || document;
    const matchesRoot = scope instanceof Element && scope.matches(selector) ? [scope] : [];
    return [...matchesRoot, ...scope.querySelectorAll(selector)];
  }

  function markInitialized(element, key) {
    const flag = `uzu${key}Initialized`;
    if (element.dataset[flag] === 'true') return false;
    element.dataset[flag] = 'true';
    return true;
  }

  function syncRootClass() {
    document.documentElement.classList.toggle('uzu-root', document.body && document.body.classList.contains('uzu-app'));
  }

  function getThemeRoot(trigger) {
    try {
      return document.querySelector(trigger.dataset.uzuThemeTarget) || document.documentElement;
    } catch (_) {
      return document.documentElement;
    }
  }

  function getThemeKey(root, trigger) {
    return root.dataset.uzuThemeKey || trigger?.dataset.uzuThemeKey || document.documentElement.dataset.uzuThemeKey || '';
  }

  function getThemeMode(value) {
    return ['auto', 'light', 'dark'].includes(value) ? value : '';
  }

  function getResolvedTheme(value) {
    return ['light', 'dark'].includes(value) ? value : '';
  }

  function getPreferredTheme() {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function resolveTheme(mode) {
    return mode === 'auto' ? getPreferredTheme() : mode;
  }

  function syncThemeToggles(root) {
    const mode = getThemeMode(root.getAttribute('data-theme-mode')) || getResolvedTheme(root.getAttribute('data-theme')) || 'light';
    const theme = getResolvedTheme(root.getAttribute('data-theme')) || resolveTheme(mode);
    queryAll(document, '[data-uzu-theme-toggle]').forEach((toggle) => {
      const target = getThemeRoot(toggle);
      if (target === root) {
        toggle.classList.toggle('is-auto', mode === 'auto');
        toggle.classList.toggle('is-dark', theme === 'dark');
        toggle.setAttribute('aria-label', `Theme: ${mode}, currently ${theme}`);
      }
    });
  }

  function applyTheme(root, mode, key, persist = true) {
    const themeMode = getThemeMode(mode) || 'light';
    const theme = resolveTheme(themeMode);
    root.setAttribute('data-theme-mode', themeMode);
    root.setAttribute('data-theme', theme);
    root.setAttribute('data-uzu-theme', theme);
    if (persist && key) storage.set(key, themeMode);
    syncThemeToggles(root);
  }

  function getInitialThemeMode(root, key) {
    const saved = getThemeMode(key ? storage.get(key) : '');
    if (saved) return saved;
    const currentMode = getThemeMode(root.getAttribute('data-theme-mode'));
    if (currentMode) return currentMode;
    if (root.dataset.uzuThemeKey) return 'auto';
    return getResolvedTheme(root.getAttribute('data-theme')) || getPreferredTheme();
  }

  function getNextThemeMode(mode) {
    if (mode === 'light') return 'dark';
    if (mode === 'dark') return 'auto';
    return 'light';
  }

  function handleThemePreferenceChange() {
    const roots = new Set([document.documentElement]);
    queryAll(document, '[data-uzu-theme-toggle]').forEach((toggle) => {
      roots.add(getThemeRoot(toggle));
    });
    roots.forEach((root) => {
      if (getThemeMode(root.getAttribute('data-theme-mode')) === 'auto') {
        applyTheme(root, 'auto', getThemeKey(root), false);
      }
    });
  }

  function initThemePreferenceListener() {
    const media = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)');
    if (!media || document.documentElement.dataset.uzuThemeMediaListener === 'true') return;
    themeMediaQuery = media;
    if (media.addEventListener) {
      media.addEventListener('change', handleThemePreferenceChange);
    } else if (media.addListener) {
      media.addListener(handleThemePreferenceChange);
    }
    document.documentElement.dataset.uzuThemeMediaListener = 'true';
  }

  function initThemeToggles(root = document) {
    queryAll(root, '[data-uzu-theme-toggle]').forEach((toggle) => {
      const themeRoot = getThemeRoot(toggle);
      const key = getThemeKey(themeRoot, toggle);
      const savedMode = getThemeMode(key ? storage.get(key) : '');
      if (savedMode) {
        applyTheme(themeRoot, savedMode, key, false);
      } else if (themeRoot.hasAttribute('data-theme-mode')) {
        syncThemeToggles(themeRoot);
      } else {
        applyTheme(themeRoot, getInitialThemeMode(themeRoot, key), key);
      }
      if (!markInitialized(toggle, 'ThemeToggle')) return;
      toggle.addEventListener('click', () => {
        const current = getThemeMode(themeRoot.getAttribute('data-theme-mode')) || getResolvedTheme(themeRoot.getAttribute('data-theme')) || 'light';
        applyTheme(themeRoot, getNextThemeMode(current), key);
      });
    });
    initThemePreferenceListener();
  }

  function getLanguageRoot(control) {
    try {
      const target = control?.dataset.uzuLanguageTarget || '';
      return target ? document.querySelector(target) || document.documentElement : document.documentElement;
    } catch (_) {
      return document.documentElement;
    }
  }

  function getLanguageKey(root, control) {
    if (control?.hasAttribute('data-uzu-language-key')) return control.dataset.uzuLanguageKey || '';
    if (root?.hasAttribute?.('data-uzu-language-key')) return root.dataset.uzuLanguageKey || '';
    if (document.documentElement.hasAttribute('data-uzu-language-key')) return document.documentElement.dataset.uzuLanguageKey || '';
    return 'usuzumi-language';
  }

  function normalizeLanguage(value, fallback = 'zh') {
    const language = String(value || '').trim();
    return language || fallback;
  }

  function parseLanguageValues(value) {
    return String(value || '').split(/[\s,]+/).map((item) => item.trim()).filter(Boolean);
  }

  function getDefaultLanguageHtmlLang(language) {
    return language === 'zh' ? 'zh-CN' : language;
  }

  function getLanguageSelectTrigger(select) {
    return select.querySelector('[data-uzu-language-trigger], .uzu-language-trigger');
  }

  function getLanguageSelectMenu(select) {
    return select.querySelector('[data-uzu-language-menu], .uzu-language-menu');
  }

  function getLanguageOptions(select) {
    return getScopedControls(select, '[data-uzu-language-option], .uzu-language-option', '[data-uzu-language-select]');
  }

  function getLanguageOptionValue(option) {
    return normalizeLanguage(option.dataset.uzuLanguageValue ?? option.dataset.value ?? option.getAttribute('lang') ?? option.textContent);
  }

  function getLanguageOptionLabel(option) {
    return (option.dataset.uzuLanguageLabel || option.textContent || getLanguageOptionValue(option)).trim();
  }

  function getLanguageOptionHtmlLang(option, language = getLanguageOptionValue(option)) {
    return normalizeLanguage(option.dataset.uzuLanguageHtmlLang || option.getAttribute('lang') || getDefaultLanguageHtmlLang(language), getDefaultLanguageHtmlLang(language));
  }

  function getLanguageSelectHtmlLang(select, language) {
    const option = getLanguageOptions(select).find((item) => getLanguageOptionValue(item) === language);
    return option ? getLanguageOptionHtmlLang(option, language) : getDefaultLanguageHtmlLang(language);
  }

  function getSelectedLanguageOption(select, language) {
    const options = getLanguageOptions(select);
    return options.find((option) => getLanguageOptionValue(option) === language)
      || options.find((option) => option.classList.contains('is-selected') || option.getAttribute('aria-selected') === 'true')
      || options[0]
      || null;
  }

  function getInitialLanguage(root, key, select = null) {
    const optionValues = select ? getLanguageOptions(select).map(getLanguageOptionValue) : [];
    const selectedOption = select ? getSelectedLanguageOption(select, '') : null;
    const candidates = [
      key ? storage.get(key) : '',
      root.getAttribute('data-language'),
      root.getAttribute('data-uzu-lang'),
      select?.dataset.uzuLanguageDefault,
      selectedOption ? getLanguageOptionValue(selectedOption) : '',
      optionValues[0],
      'zh'
    ].map((value) => normalizeLanguage(value, '')).filter(Boolean);
    return candidates.find((value) => !optionValues.length || optionValues.includes(value)) || candidates[0] || 'zh';
  }

  function getLanguageRootStorageKey(root) {
    return root?.hasAttribute?.('data-uzu-language-key') ? root.dataset.uzuLanguageKey || '' : '';
  }

  function getInitialLanguageRootLanguage(root) {
    const key = getLanguageRootStorageKey(root);
    return normalizeLanguage((key ? storage.get(key) : '') || root.getAttribute('data-language') || root.getAttribute('data-uzu-lang'));
  }

  function isNestedLanguageRoot(root, element) {
    const nestedRoot = element.closest('[data-uzu-language-root]');
    return Boolean(nestedRoot && nestedRoot !== root);
  }

  function syncLanguageContent(root, language) {
    queryAll(root, '[data-lang]').forEach((element) => {
      if (isNestedLanguageRoot(root, element)) return;
      const values = parseLanguageValues(element.getAttribute('data-lang'));
      const hidden = values.length > 0 && !values.includes(language);
      element.toggleAttribute('data-uzu-language-hidden', hidden);
    });
  }

  function getClosestLanguageRoot(element) {
    if (!(element instanceof Element)) return document.documentElement;
    return element.closest('[data-uzu-language-root], [data-language], [data-uzu-lang]') || document.documentElement;
  }

  function hasExplicitLanguageRoot(root) {
    return Boolean(root?.hasAttribute?.('data-language') || root?.hasAttribute?.('data-uzu-lang'));
  }

  function initLanguageRoots(root = document) {
    const roots = new Set();
    if (root === document && hasExplicitLanguageRoot(document.documentElement)) roots.add(document.documentElement);
    if (root instanceof Element && hasExplicitLanguageRoot(root)) roots.add(root);
    queryAll(root, '[data-language], [data-uzu-lang]').forEach((item) => roots.add(item));
    queryAll(root, '[data-lang]').forEach((item) => {
      const languageRoot = getClosestLanguageRoot(item);
      if (hasExplicitLanguageRoot(languageRoot)) roots.add(languageRoot);
    });
    roots.forEach((languageRoot) => {
      if (languageRoot !== document.documentElement) languageRoot.setAttribute('data-uzu-language-root', '');
    });
    roots.forEach((languageRoot) => {
      const language = getInitialLanguageRootLanguage(languageRoot);
      applyLanguage(languageRoot, language, '', getDefaultLanguageHtmlLang(language));
    });
  }

  function syncLanguageSelect(select, language) {
    const trigger = getLanguageSelectTrigger(select);
    const options = getLanguageOptions(select);
    const selected = options.find((option) => getLanguageOptionValue(option) === language) || null;
    select.dataset.uzuLanguageValue = language;
    options.forEach((option) => {
      const isSelected = option === selected;
      option.classList.toggle('is-selected', isSelected);
      option.setAttribute('aria-selected', isSelected ? 'true' : 'false');
      option.setAttribute('tabindex', '-1');
    });
    if (trigger) {
      const label = selected ? getLanguageOptionLabel(selected) : language;
      trigger.dataset.uzuLanguageValue = language;
      trigger.setAttribute('aria-label', trigger.dataset.uzuLanguageLabel || `Language: ${label}`);
    }
  }

  function syncLanguageControls(root, language) {
    queryAll(document, '[data-uzu-language-select]').forEach((select) => {
      if (getLanguageRoot(select) === root) syncLanguageSelect(select, language);
    });
  }

  function applyLanguage(root, language, key, htmlLang) {
    const nextLanguage = normalizeLanguage(language);
    root.toggleAttribute('data-uzu-language-root', root !== document.documentElement);
    root.setAttribute('data-language', nextLanguage);
    root.setAttribute('data-uzu-lang', nextLanguage);
    root.setAttribute('lang', normalizeLanguage(htmlLang, getDefaultLanguageHtmlLang(nextLanguage)));
    if (key) storage.set(key, nextLanguage);
    syncLanguageContent(root, nextLanguage);
    syncLanguageControls(root, nextLanguage);
    if (typeof refreshCodeCopyLabels === 'function') refreshCodeCopyLabels(root);
    if (typeof refreshHeatmaps === 'function') refreshHeatmaps(root);
    refreshStateIndicators(root, true);
    queueIndicatorRefresh(root, true);
    if (typeof queueTopbarOverflows === 'function') queueTopbarOverflows(root);
  }

  function focusLanguageOption(select, index) {
    const options = getEnabledControls(getLanguageOptions(select));
    if (!options.length) return null;
    const nextIndex = (index + options.length) % options.length;
    options.forEach((option, optionIndex) => {
      const active = optionIndex === nextIndex;
      option.classList.toggle('is-active', active);
      option.setAttribute('tabindex', active ? '0' : '-1');
    });
    options[nextIndex].focus();
    return options[nextIndex];
  }

  function openLanguageSelect(select, options = {}) {
    const trigger = getLanguageSelectTrigger(select);
    const menu = getLanguageSelectMenu(select);
    if (!trigger || !menu) return;
    if (select.classList.contains('is-open')) return;
    const timer = languageSelectCloseTimers.get(select);
    if (timer) {
      window.clearTimeout(timer);
      languageSelectCloseTimers.delete(select);
    }
    closeOpenLanguageSelects(select);
    menu.hidden = false;
    select.classList.remove('is-closing');
    select.classList.add('is-open');
    trigger.setAttribute('aria-expanded', 'true');
    queueDisclosureHeightRefresh(menu);
    if (options.focus !== false) {
      const enabled = getEnabledControls(getLanguageOptions(select));
      const selectedIndex = Math.max(0, enabled.findIndex((option) => option.classList.contains('is-selected') || option.getAttribute('aria-selected') === 'true'));
      focusLanguageOption(select, selectedIndex);
    }
  }

  function closeLanguageSelect(select, options = {}) {
    const trigger = getLanguageSelectTrigger(select);
    const menu = getLanguageSelectMenu(select);
    if (!menu || select.classList.contains('is-closing') || (!select.classList.contains('is-open') && menu.hidden)) return;
    const timer = languageSelectCloseTimers.get(select);
    if (timer) window.clearTimeout(timer);
    select.classList.remove('is-open');
    select.classList.add('is-closing');
    if (trigger) trigger.setAttribute('aria-expanded', 'false');
    getLanguageOptions(select).forEach((option) => {
      option.classList.remove('is-active');
      option.setAttribute('tabindex', '-1');
    });
    const finish = () => {
      select.classList.remove('is-closing');
      menu.hidden = true;
      languageSelectCloseTimers.delete(select);
      if (options.restoreFocus && trigger && typeof trigger.focus === 'function') trigger.focus();
    };
    const closeTimer = scheduleAfterAnimation([menu], finish);
    if (closeTimer) languageSelectCloseTimers.set(select, closeTimer);
  }

  function closeOpenLanguageSelects(except = null) {
    let count = 0;
    queryAll(document, '[data-uzu-language-select].is-open').forEach((select) => {
      if (select !== except) {
        count += 1;
        closeLanguageSelect(select);
      }
    });
    return count;
  }

  function emitLanguageChange(select, root, language, option, previousLanguage, key) {
    select.dispatchEvent(new CustomEvent('uzu-language-change', {
      bubbles: true,
      detail: {
        language,
        previousLanguage,
        htmlLang: root.getAttribute('lang') || '',
        key,
        option,
        select,
        root
      }
    }));
  }

  function chooseLanguageOption(select, option) {
    const languageRoot = getLanguageRoot(select);
    const key = getLanguageKey(languageRoot, select);
    const previousLanguage = languageRoot.getAttribute('data-language') || '';
    const language = getLanguageOptionValue(option);
    applyLanguage(languageRoot, language, key, getLanguageOptionHtmlLang(option, language));
    closeLanguageSelect(select, { restoreFocus: true });
    if (language !== previousLanguage) emitLanguageChange(select, languageRoot, language, option, previousLanguage, key);
  }

  function handleLanguageOptionKeydown(event, select, option) {
    const options = getEnabledControls(getLanguageOptions(select));
    const index = Math.max(0, options.indexOf(option));
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      focusLanguageOption(select, index + 1);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      focusLanguageOption(select, index - 1);
    } else if (event.key === 'Home') {
      event.preventDefault();
      focusLanguageOption(select, 0);
    } else if (event.key === 'End') {
      event.preventDefault();
      focusLanguageOption(select, options.length - 1);
    } else if (event.key === 'Escape') {
      event.preventDefault();
      closeLanguageSelect(select, { restoreFocus: true });
    } else if (event.key === 'Tab') {
      closeLanguageSelect(select);
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      chooseLanguageOption(select, option);
    }
  }

  function initLanguageSelects(root = document) {
    initLanguageRoots(root);
    queryAll(root, '[data-uzu-language-select]').forEach((select) => {
      const trigger = getLanguageSelectTrigger(select);
      const menu = getLanguageSelectMenu(select);
      const options = getLanguageOptions(select);
      if (!trigger || !menu || !options.length) return;
      const selectId = ensureId(select, 'uzu-language-select');
      const menuId = ensureId(menu, `${selectId}-menu`);
      const languageRoot = getLanguageRoot(select);
      const key = getLanguageKey(languageRoot, select);
      trigger.setAttribute('aria-haspopup', 'listbox');
      trigger.setAttribute('aria-expanded', select.classList.contains('is-open') ? 'true' : 'false');
      trigger.setAttribute('aria-controls', menuId);
      menu.setAttribute('role', menu.getAttribute('role') || 'listbox');
      if (!select.classList.contains('is-open')) menu.hidden = true;
      options.forEach((option, index) => {
        ensureId(option, `${selectId}-option-${index + 1}`);
        option.setAttribute('role', option.getAttribute('role') || 'option');
        option.setAttribute('tabindex', '-1');
      });
      const initial = getInitialLanguage(languageRoot, key, select);
      applyLanguage(languageRoot, initial, key, getLanguageSelectHtmlLang(select, initial));
      if (!markInitialized(select, 'LanguageSelect')) return;
      trigger.addEventListener('click', (event) => {
        if (isControlDisabled(trigger)) return;
        event.preventDefault();
        if (select.classList.contains('is-open')) closeLanguageSelect(select, { restoreFocus: true });
        else openLanguageSelect(select);
      });
      trigger.addEventListener('keydown', (event) => {
        if (isControlDisabled(trigger)) return;
        if (['ArrowDown', 'Enter', ' '].includes(event.key)) {
          event.preventDefault();
          openLanguageSelect(select);
        } else if (event.key === 'ArrowUp') {
          event.preventDefault();
          openLanguageSelect(select, { focus: false });
          focusLanguageOption(select, getEnabledControls(getLanguageOptions(select)).length - 1);
        }
      });
      select.addEventListener('click', (event) => {
        const option = getScopedEventControl(event, '[data-uzu-language-option], .uzu-language-option', select, '[data-uzu-language-select]');
        if (!option || isControlDisabled(option)) return;
        event.preventDefault();
        chooseLanguageOption(select, option);
      });
      select.addEventListener('keydown', (event) => {
        const option = getScopedEventControl(event, '[data-uzu-language-option], .uzu-language-option', select, '[data-uzu-language-select]');
        if (option) handleLanguageOptionKeydown(event, select, option);
        else if (event.key === 'Escape') {
          event.preventDefault();
          closeLanguageSelect(select, { restoreFocus: true });
        }
      });
    });
  }
