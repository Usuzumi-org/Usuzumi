/* Usuzumi generated lite runtime. Edit ui/js/*.js, then run npm run build. */
(function () {
/* ui/js/core.js */
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

  function ensureId(element, prefix) {
    if (!element.id) {
      selectCounter += 1;
      element.id = `${prefix}-${selectCounter}`;
    }
    return element.id;
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

  function getLanguageUrlMode(root, select) {
    const value = select?.dataset.uzuLanguageUrlMode || root?.dataset?.uzuLanguageUrlMode || '';
    return ['assign', 'replace', 'none'].includes(value) ? value : 'none';
  }

  function isRouteLanguageMode(root, select = null) {
    return getLanguageUrlMode(root, select) !== 'none';
  }

  function navigateLanguageUrl(url, mode) {
    if (!url || mode === 'none') return;
    if (mode === 'replace') window.location.replace(url);
    else window.location.assign(url);
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
    const storedLanguage = key ? storage.get(key) : '';
    const routeLanguage = root.getAttribute('data-language') || root.getAttribute('data-uzu-lang');
    const candidates = isRouteLanguageMode(root, select)
      ? [routeLanguage, select?.dataset.uzuLanguageDefault, selectedOption ? getLanguageOptionValue(selectedOption) : '', optionValues[0], storedLanguage, 'zh']
      : [storedLanguage, routeLanguage, select?.dataset.uzuLanguageDefault, selectedOption ? getLanguageOptionValue(selectedOption) : '', optionValues[0], 'zh'];
    const normalizedCandidates = candidates.map((value) => normalizeLanguage(value, '')).filter(Boolean);
    return normalizedCandidates.find((value) => !optionValues.length || optionValues.includes(value)) || normalizedCandidates[0] || 'zh';
  }

  function getLanguageRootStorageKey(root) {
    return root?.hasAttribute?.('data-uzu-language-key') ? root.dataset.uzuLanguageKey || '' : '';
  }

  function getInitialLanguageRootLanguage(root) {
    const key = getLanguageRootStorageKey(root);
    const storedLanguage = key ? storage.get(key) : '';
    const routeLanguage = root.getAttribute('data-language') || root.getAttribute('data-uzu-lang');
    return normalizeLanguage(isRouteLanguageMode(root) ? routeLanguage || storedLanguage : storedLanguage || routeLanguage);
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
    navigateLanguageUrl(option.dataset.uzuLanguageUrl || '', getLanguageUrlMode(languageRoot, select));
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

/* ui/js/control-utils.js */
function isControlDisabled(control) {
    return control.disabled || control.getAttribute('aria-disabled') === 'true' || control.classList.contains('is-disabled');
  }

  function getControlValue(control, datasetKey) {
    return control.dataset[datasetKey] ?? control.dataset.value ?? control.textContent.trim();
  }

  function getTabPanel(tab) {
    const target = tab.dataset.uzuTabTarget;
    if (target) {
      try {
        return document.querySelector(target);
      } catch (_) {
        return null;
      }
    }
    const panelId = tab.getAttribute('aria-controls');
    return panelId ? document.getElementById(panelId) : null;
  }

  function getEnabledControls(controls) {
    return controls.filter((control) => !isControlDisabled(control));
  }

  function getScopedControls(root, controlSelector, rootSelector) {
    return [...root.querySelectorAll(controlSelector)].filter((control) => control.closest(rootSelector) === root);
  }

  function getScopedEventControl(event, controlSelector, root, rootSelector) {
    if (!(event.target instanceof Element)) return null;
    const control = event.target.closest(controlSelector);
    return control && control.closest(rootSelector) === root ? control : null;
  }

  function moveActiveControl(controls, current, direction) {
    const enabled = getEnabledControls(controls);
    if (!enabled.length) return null;
    const currentIndex = Math.max(0, enabled.indexOf(current));
    return enabled[(currentIndex + direction + enabled.length) % enabled.length];
  }

  function parseTimeValue(value) {
    const item = String(value || '').trim();
    if (!item || item === '0s') return 0;
    return item.endsWith('ms') ? Number.parseFloat(item) : Number.parseFloat(item) * 1000;
  }

  function getAnimationDuration(element) {
    if (!element) return 0;
    const style = window.getComputedStyle(element);
    const durations = style.animationDuration.split(',').map(parseTimeValue);
    const delays = style.animationDelay.split(',').map(parseTimeValue);
    return Math.max(0, ...durations.map((duration, index) => duration + (delays[index] || 0)));
  }

  function scheduleAfterAnimation(elements, callback) {
    const duration = Math.max(0, ...elements.map(getAnimationDuration));
    if (!duration) {
      callback();
      return null;
    }
    return window.setTimeout(callback, duration + 30);
  }

  function holdIndicatorInstant(root) {
    root.dataset.uzuIndicatorInstant = 'true';
    if (indicatorInstantTimers.has(root)) window.clearTimeout(indicatorInstantTimers.get(root));
    indicatorInstantTimers.set(root, window.setTimeout(() => {
      delete root.dataset.uzuIndicatorInstant;
      indicatorInstantTimers.delete(root);
    }, 120));
  }

  function setControlIndicator(root, control, prefix, instant = false) {
    if (!control || !root.isConnected || control.offsetWidth <= 0 || control.offsetHeight <= 0) {
      root.dataset[prefix === 'tabs' ? 'uzuTabsIndicator' : 'uzuSegmentedIndicator'] = 'false';
      return;
    }
    if (instant) holdIndicatorInstant(root);
    const cssPrefix = prefix === 'tabs' ? 'uzu-tabs' : 'uzu-segmented';
    root.style.setProperty(`--${cssPrefix}-indicator-x`, `${control.offsetLeft}px`);
    root.style.setProperty(`--${cssPrefix}-indicator-width`, `${control.offsetWidth}px`);
    root.style.setProperty(`--${cssPrefix}-indicator-opacity`, '1');
    if (prefix === 'tabs') {
      root.style.setProperty('--uzu-tabs-indicator-y', `${control.offsetTop + control.offsetHeight - 1}px`);
      root.dataset.uzuTabsIndicator = 'true';
    } else {
      root.style.setProperty('--uzu-segmented-indicator-y', `${control.offsetTop}px`);
      root.style.setProperty('--uzu-segmented-indicator-height', `${control.offsetHeight}px`);
      root.dataset.uzuSegmentedIndicator = 'true';
    }
  }

  function refreshStateIndicators(root = document, instant = false) {
    queryAll(root, '[data-uzu-tabs]').forEach((tabsRoot) => {
      const activeTab = getScopedControls(tabsRoot, '.uzu-tab', '[data-uzu-tabs]')
        .find((tab) => tab.classList.contains('is-active') || tab.getAttribute('aria-selected') === 'true');
      if (activeTab) setControlIndicator(tabsRoot, activeTab, 'tabs', instant);
    });
    queryAll(root, '[data-uzu-segmented]').forEach((segmented) => {
      const activeSegment = getScopedControls(segmented, '.uzu-segment', '[data-uzu-segmented]')
        .find((segment) => segment.classList.contains('is-active') || segment.getAttribute('aria-pressed') === 'true');
      if (activeSegment) setControlIndicator(segmented, activeSegment, 'segmented', instant);
    });
  }

  function queueIndicatorRefresh(root = document, instant = false) {
    window.requestAnimationFrame(() => refreshStateIndicators(root, instant));
  }

/* ui/js/disclosures.js */
function parseLengthValue(value) {
    return Number.parseFloat(value) || 0;
  }

  function syncDisclosurePanelHeight(panel) {
    if (!panel) return;
    if (!panel.isConnected || panel.getClientRects().length === 0) {
      panel.style.removeProperty('--uzu-disclosure-panel-height');
      return;
    }
    const style = window.getComputedStyle(panel);
    const targetPadding = parseLengthValue(style.getPropertyValue('--uzu-disclosure-panel-block-end-padding'));
    const currentPadding = parseLengthValue(style.paddingBottom);
    panel.style.setProperty('--uzu-disclosure-panel-height', `${panel.scrollHeight + Math.max(0, targetPadding - currentPadding)}px`);
  }

  function refreshDisclosureHeights(root = document) {
    queryAll(root, '[data-uzu-disclosure].is-open').forEach((disclosure) => {
      syncDisclosurePanelHeight(disclosure.querySelector('[data-uzu-disclosure-panel]'));
    });
  }

  function queueDisclosureHeightRefresh(root = document) {
    window.requestAnimationFrame(() => refreshDisclosureHeights(root));
  }

  function setDisclosureState(disclosure, open, emit = true) {
    const trigger = disclosure.querySelector('[data-uzu-disclosure-trigger]');
    const panel = disclosure.querySelector('[data-uzu-disclosure-panel]');
    const existingTimer = disclosureCloseTimers.get(disclosure);
    if (existingTimer) {
      window.clearTimeout(existingTimer);
      disclosureCloseTimers.delete(disclosure);
    }
    if (trigger) trigger.setAttribute('aria-expanded', open ? 'true' : 'false');
    if (open) {
      disclosure.classList.remove('is-closing');
      if (panel) panel.hidden = false;
      syncDisclosurePanelHeight(panel);
      disclosure.classList.add('is-open');
    } else {
      if (disclosure.classList.contains('is-open')) {
        syncDisclosurePanelHeight(panel);
        disclosure.classList.remove('is-open');
        disclosure.classList.add('is-closing');
        const finish = () => {
          disclosure.classList.remove('is-closing');
          if (panel) panel.hidden = true;
          disclosureCloseTimers.delete(disclosure);
        };
        const timer = scheduleAfterAnimation([panel].filter(Boolean), finish);
        if (timer) disclosureCloseTimers.set(disclosure, timer);
      } else {
        disclosure.classList.remove('is-closing');
        if (panel) panel.hidden = true;
      }
    }
    if (emit) {
      disclosure.dispatchEvent(new CustomEvent('uzu-disclosure-change', {
        bubbles: true,
        detail: { open, disclosure }
      }));
      disclosure.dispatchEvent(new Event('change', { bubbles: true }));
    }
  }

  function initDisclosures(root = document) {
    queryAll(root, '[data-uzu-disclosure]').forEach((disclosure) => {
      const trigger = disclosure.querySelector('[data-uzu-disclosure-trigger]');
      const panel = disclosure.querySelector('[data-uzu-disclosure-panel]');
      if (!trigger || !panel) return;
      const panelId = ensureId(panel, 'uzu-disclosure-panel');
      trigger.setAttribute('aria-controls', panelId);
      setDisclosureState(disclosure, disclosure.classList.contains('is-open') || trigger.getAttribute('aria-expanded') === 'true', false);
      if (!markInitialized(disclosure, 'Disclosure')) return;
      trigger.addEventListener('click', () => {
        setDisclosureState(disclosure, !disclosure.classList.contains('is-open'));
      });
    });
  }

/* ui/js/menus-core.js */
function getMenuTrigger(menu) {
    return menu.querySelector('[data-uzu-menu-trigger], .uzu-menu-trigger');
  }

  function getMenuContent(menu) {
    return menu.querySelector('[data-uzu-menu-content], .uzu-menu-content');
  }

  function getMenuItems(menu) {
    return getScopedControls(menu, '.uzu-menu-item', '[data-uzu-menu], [data-uzu-context-menu]');
  }

  function emitMenuEvent(menu, name, trigger = getMenuTrigger(menu), extra = {}) {
    menu.dispatchEvent(new CustomEvent(name, {
      bubbles: true,
      detail: {
        menu,
        trigger,
        content: getMenuContent(menu),
        ...extra
      }
    }));
  }

  function emitMenuSelectEvent(menu, item) {
    emitMenuEvent(menu, 'uzu-menu-select', menuActiveTriggers.get(menu) || getMenuTrigger(menu), {
      item,
      value: getControlValue(item, 'uzuMenuValue')
    });
  }

  function setContextMenuPoint(menu, content, x, y) {
    if (!Number.isFinite(x) || !Number.isFinite(y)) return;
    const rect = content.getBoundingClientRect();
    const inlineMargin = 8;
    const blockMargin = 8;
    const nextX = Math.max(inlineMargin, Math.min(x, window.innerWidth - rect.width - inlineMargin));
    const nextY = Math.max(blockMargin, Math.min(y, window.innerHeight - rect.height - blockMargin));
    menu.style.setProperty('--uzu-menu-x', `${nextX}px`);
    menu.style.setProperty('--uzu-menu-y', `${nextY}px`);
  }

  function focusMenuItem(menu, index) {
    const items = getEnabledControls(getMenuItems(menu));
    if (!items.length) return null;
    const nextIndex = (index + items.length) % items.length;
    items.forEach((item, itemIndex) => {
      item.classList.toggle('is-active', itemIndex === nextIndex);
      item.setAttribute('tabindex', itemIndex === nextIndex ? '0' : '-1');
    });
    items[nextIndex].focus();
    return items[nextIndex];
  }

  function openMenu(menu, options = {}) {
    const trigger = options.trigger || getMenuTrigger(menu);
    const content = getMenuContent(menu);
    if (!content) return;
    if (menu.classList.contains('is-open')) {
      if (Number.isFinite(options.x) && Number.isFinite(options.y)) {
        menu.classList.add('is-context');
        setContextMenuPoint(menu, content, options.x, options.y);
      }
      return;
    }
    const existingTimer = menuCloseTimers.get(menu);
    if (existingTimer) {
      window.clearTimeout(existingTimer);
      menuCloseTimers.delete(menu);
    }
    const isContextMenu = Number.isFinite(options.x) && Number.isFinite(options.y);
    if (isContextMenu) menu.classList.add('is-context');
    content.hidden = false;
    menu.classList.remove('is-closing');
    menu.classList.add('is-open');
    queueDisclosureHeightRefresh(content);
    if (isContextMenu) setContextMenuPoint(menu, content, options.x, options.y);
    if (trigger) {
      trigger.setAttribute('aria-haspopup', trigger.getAttribute('aria-haspopup') || 'menu');
      trigger.setAttribute('aria-expanded', 'true');
    }
    menuActiveTriggers.set(menu, trigger || null);
    content.setAttribute('role', content.getAttribute('role') || 'menu');
    getMenuItems(menu).forEach((item) => {
      item.setAttribute('role', item.getAttribute('role') || 'menuitem');
      item.setAttribute('tabindex', '-1');
    });
    emitMenuEvent(menu, 'uzu-menu-open', trigger);
    if (options.focus !== false) focusMenuItem(menu, 0);
  }

  function closeMenu(menu, options = {}) {
    const content = getMenuContent(menu);
    if (!content || menu.classList.contains('is-closing') || (!menu.classList.contains('is-open') && content.hidden)) return;
    const trigger = options.trigger || menuActiveTriggers.get(menu) || getMenuTrigger(menu);
    const existingTimer = menuCloseTimers.get(menu);
    if (existingTimer) window.clearTimeout(existingTimer);
    menu.classList.remove('is-open');
    menu.classList.add('is-closing');
    if (trigger) trigger.setAttribute('aria-expanded', 'false');
    getMenuItems(menu).forEach((item) => {
      item.classList.remove('is-active');
      item.setAttribute('tabindex', '-1');
    });
    const finish = () => {
      menu.classList.remove('is-closing', 'is-context');
      content.hidden = true;
      menuCloseTimers.delete(menu);
      menuActiveTriggers.delete(menu);
      emitMenuEvent(menu, 'uzu-menu-close', trigger);
      if (options.restoreFocus && trigger && typeof trigger.focus === 'function') trigger.focus();
    };
    const timer = scheduleAfterAnimation([content], finish);
    if (timer) menuCloseTimers.set(menu, timer);
  }

  function closeOpenMenus(except = null) {
    let count = 0;
    queryAll(document, '[data-uzu-menu].is-open, [data-uzu-context-menu].is-open').forEach((menu) => {
      if (menu !== except) {
        count += 1;
        closeMenu(menu);
      }
    });
    return count;
  }

  function handleMenuItemKeydown(event, menu, item) {
    const enabled = getEnabledControls(getMenuItems(menu));
    const index = Math.max(0, enabled.indexOf(item));
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      focusMenuItem(menu, index + 1);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      focusMenuItem(menu, index - 1);
    } else if (event.key === 'Home') {
      event.preventDefault();
      focusMenuItem(menu, 0);
    } else if (event.key === 'End') {
      event.preventDefault();
      focusMenuItem(menu, enabled.length - 1);
    } else if (event.key === 'Escape') {
      event.preventDefault();
      closeMenu(menu, { restoreFocus: true });
    } else if (event.key === 'Tab') {
      closeMenu(menu);
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      item.click();
    }
  }

  function initMenus(root = document) {
    queryAll(root, '[data-uzu-menu]').forEach((menu) => {
      const trigger = getMenuTrigger(menu);
      const content = getMenuContent(menu);
      if (!trigger || !content) return;
      const contentId = ensureId(content, 'uzu-menu-content');
      trigger.setAttribute('aria-haspopup', 'menu');
      trigger.setAttribute('aria-expanded', menu.classList.contains('is-open') ? 'true' : 'false');
      trigger.setAttribute('aria-controls', contentId);
      if (!menu.classList.contains('is-open')) content.hidden = true;
      getMenuItems(menu).forEach((item) => {
        item.setAttribute('role', item.getAttribute('role') || 'menuitem');
        item.setAttribute('tabindex', '-1');
      });
      if (!markInitialized(menu, 'Menu')) return;
      trigger.addEventListener('click', (event) => {
        if (isControlDisabled(trigger)) return;
        event.preventDefault();
        if (menu.classList.contains('is-open')) {
          closeMenu(menu, { restoreFocus: true });
        } else {
          closeOpenMenus(menu);
          openMenu(menu, { trigger });
        }
      });
      trigger.addEventListener('keydown', (event) => {
        if (isControlDisabled(trigger)) return;
        if (['ArrowDown', 'Enter', ' '].includes(event.key)) {
          event.preventDefault();
          closeOpenMenus(menu);
          openMenu(menu, { trigger });
        } else if (event.key === 'ArrowUp') {
          event.preventDefault();
          closeOpenMenus(menu);
          openMenu(menu, { trigger, focus: false });
          focusMenuItem(menu, getEnabledControls(getMenuItems(menu)).length - 1);
        }
      });
      menu.addEventListener('click', (event) => {
        const item = getScopedEventControl(event, '.uzu-menu-item', menu, '[data-uzu-menu], [data-uzu-context-menu]');
        if (!item || isControlDisabled(item)) return;
        emitMenuSelectEvent(menu, item);
        if (item.dataset.uzuMenuKeepOpen === 'true') return;
        closeMenu(menu, { restoreFocus: false });
      });
      menu.addEventListener('keydown', (event) => {
        const item = getScopedEventControl(event, '.uzu-menu-item', menu, '[data-uzu-menu], [data-uzu-context-menu]');
        if (!item) return;
        handleMenuItemKeydown(event, menu, item);
      });
      getMenuItems(menu).forEach((item) => {
        item.addEventListener('mouseenter', () => {
          const enabled = getEnabledControls(getMenuItems(menu));
          const index = enabled.indexOf(item);
          if (index >= 0) focusMenuItem(menu, index);
        });
      });
    });
  }

  function getContextMenuTrigger(contextMenu) {
    const selector = contextMenu.dataset.uzuContextMenuTrigger || '';
    if (!selector) return contextMenu;
    try {
      return document.querySelector(selector) || contextMenu;
    } catch (_) {
      return contextMenu;
    }
  }

  function getContextPoint(event, target) {
    if ('clientX' in event && event.clientX) {
      return { x: event.clientX, y: event.clientY };
    }
    const rect = target.getBoundingClientRect();
    return { x: rect.left, y: rect.bottom + 4 };
  }

  function initContextMenus(root = document) {
    queryAll(root, '[data-uzu-context-menu]').forEach((menu) => {
      const content = getMenuContent(menu);
      const trigger = getContextMenuTrigger(menu);
      if (!content || !trigger) return;
      const contentId = ensureId(content, 'uzu-context-menu-content');
      content.hidden = true;
      content.setAttribute('role', content.getAttribute('role') || 'menu');
      if (trigger !== menu) {
        trigger.setAttribute('aria-haspopup', 'menu');
        trigger.setAttribute('aria-controls', contentId);
        trigger.setAttribute('aria-expanded', 'false');
      }
      getMenuItems(menu).forEach((item) => {
        item.setAttribute('role', item.getAttribute('role') || 'menuitem');
        item.setAttribute('tabindex', '-1');
      });
      if (!markInitialized(menu, 'ContextMenu')) return;
      trigger.addEventListener('contextmenu', (event) => {
        if (isControlDisabled(trigger)) return;
        event.preventDefault();
        closeOpenMenus(menu);
        const point = getContextPoint(event, trigger);
        openMenu(menu, { trigger, x: point.x, y: point.y });
      });
      trigger.addEventListener('keydown', (event) => {
        if (isControlDisabled(trigger)) return;
        if (event.key === 'ContextMenu' || (event.shiftKey && event.key === 'F10')) {
          event.preventDefault();
          closeOpenMenus(menu);
          const point = getContextPoint(event, trigger);
          openMenu(menu, { trigger, x: point.x, y: point.y });
        }
      });
      menu.addEventListener('click', (event) => {
        const item = getScopedEventControl(event, '.uzu-menu-item', menu, '[data-uzu-menu], [data-uzu-context-menu]');
        if (!item || isControlDisabled(item)) return;
        emitMenuSelectEvent(menu, item);
        if (item.dataset.uzuMenuKeepOpen === 'true') return;
        closeMenu(menu);
      });
      menu.addEventListener('keydown', (event) => {
        const item = getScopedEventControl(event, '.uzu-menu-item', menu, '[data-uzu-menu], [data-uzu-context-menu]');
        if (!item) return;
        handleMenuItemKeydown(event, menu, item);
      });
    });
  }

/* ui/js/topbar-overflow.js */
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

/* ui/js/error-pages.js */
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

/* ui/js/code-copy.js */
function getCodeCopyLabelText(button, label, key, fallback) {
    return label?.dataset[key] || button.dataset[key] || fallback;
  }

  function getCodeCopyLabels(button) {
    return queryAll(button, '[data-uzu-code-copy-label]');
  }

  function isCodeCopyLabelActive(button, label) {
    if (!(label instanceof Element)) return false;
    let node = label;
    while (node && node !== button) {
      if (node.hidden || node.hasAttribute('data-uzu-language-hidden')) return false;
      node = node.parentElement;
    }
    return true;
  }

  function getActiveCodeCopyLabel(button) {
    const labels = getCodeCopyLabels(button);
    return labels.find((label) => isCodeCopyLabelActive(button, label)) || labels[0] || null;
  }

  function setCodeCopyAriaLabel(button, key, fallback) {
    const label = getActiveCodeCopyLabel(button);
    button.setAttribute('aria-label', getCodeCopyLabelText(button, label, key, button.dataset[key] || fallback));
  }

  function getCodeCopyLabelDefault(button, label) {
    if (!label.dataset.uzuCodeCopyDefault) {
      label.dataset.uzuCodeCopyDefault = label.textContent.trim() || getCodeCopyLabelText(button, label, 'uzuCopyText', 'Copy');
    }
    return label.dataset.uzuCodeCopyDefault;
  }

  function setCodeCopyLabel(button, key, fallback) {
    const labels = getCodeCopyLabels(button);
    setCodeCopyAriaLabel(button, key, fallback);
    if (labels.length) {
      labels.forEach((label) => {
        label.textContent = getCodeCopyLabelText(button, label, key, fallback);
      });
      return;
    }
    const nextLabel = button.dataset[key] || fallback;
    button.textContent = nextLabel;
  }

  function restoreCodeCopyLabel(button) {
    const labels = getCodeCopyLabels(button);
    if (labels.length) {
      setCodeCopyAriaLabel(button, 'uzuCopyText', 'Copy code');
      labels.forEach((label) => {
        label.textContent = getCodeCopyLabelDefault(button, label);
      });
      return;
    }
    const defaultContent = codeCopyDefaultContent.get(button);
    if (defaultContent) {
      button.replaceChildren(...defaultContent.map((node) => node.cloneNode(true)));
      setCodeCopyAriaLabel(button, 'uzuCopyText', 'Copy code');
      return;
    }
    setCodeCopyAriaLabel(button, 'uzuCopyText', 'Copy code');
    button.textContent = button.dataset.uzuCopyText || 'Copy';
  }

  function isCodeCopyCandidateVisible(candidate) {
    if (!(candidate instanceof Element)) return false;
    let node = candidate;
    const block = candidate.closest('.uzu-code-block');
    while (node && node !== block) {
      if (node.hidden || node.hasAttribute('data-uzu-language-hidden')) return false;
      node = node.parentElement;
    }
    const style = window.getComputedStyle(candidate);
    return style.display !== 'none' && style.visibility !== 'hidden';
  }

  function getCodeCopyCandidate(block) {
    if (!block) return null;
    const candidates = [
      ...queryAll(block, 'pre code'),
      ...queryAll(block, 'pre').filter((pre) => !pre.querySelector('code'))
    ];
    return candidates.find(isCodeCopyCandidateVisible) || candidates[0] || null;
  }

  function getCodeCopyText(block) {
    const code = getCodeCopyCandidate(block);
    return code?.dataset?.uzuCodeSource ?? code?.textContent ?? '';
  }

  function initCodeCopy(root = document) {
    queryAll(root, '[data-uzu-code-copy]').forEach((button) => {
      if (!markInitialized(button, 'CodeCopy')) return;
      const labels = getCodeCopyLabels(button);
      labels.forEach((label) => {
        getCodeCopyLabelDefault(button, label);
      });
      if (!labels.length && !codeCopyDefaultContent.has(button)) {
        codeCopyDefaultContent.set(button, [...button.childNodes].map((node) => node.cloneNode(true)));
      }
      restoreCodeCopyLabel(button);
      button.addEventListener('click', () => {
        const block = button.closest('.uzu-code-block');
        const code = getCodeCopyText(block);
        copyText(code).then(() => {
          setCodeCopyLabel(button, 'uzuCopiedText', 'Copied');
          window.setTimeout(() => {
            restoreCodeCopyLabel(button);
          }, 1400);
        }).catch(() => {
          setCodeCopyLabel(button, 'uzuCopyFailedText', 'Copy failed');
          window.setTimeout(() => {
            restoreCodeCopyLabel(button);
          }, 1800);
        });
      });
    });
  }

  function refreshCodeCopyLabels(root = document) {
    queryAll(root, '[data-uzu-code-copy]').forEach((button) => {
      const labels = getCodeCopyLabels(button);
      if (!labels.length && button.dataset.uzuCodeCopyInitialized !== 'true' && !codeCopyDefaultContent.has(button)) {
        setCodeCopyAriaLabel(button, 'uzuCopyText', 'Copy code');
        return;
      }
      restoreCodeCopyLabel(button);
    });
  }

/* ui/js/boot-lite.js */
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
})();
