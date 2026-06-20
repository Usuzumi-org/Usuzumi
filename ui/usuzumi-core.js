/* Usuzumi generated core runtime. Edit ui/js/*.js, then run npm run build. */
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

/* ui/js/select-tabs.js */
function closeSelect(select) {
    if (select.classList.contains('is-closing') || !select.classList.contains('is-open')) return;
    select.classList.remove('is-open');
    select.classList.add('is-closing');
    queryAll(select, '[data-uzu-select-option]').forEach((option) => {
      option.classList.remove('is-active');
      option.setAttribute('tabindex', '-1');
    });
    const trigger = select.querySelector('[data-uzu-select-trigger]');
    if (trigger) {
      const selected = select.querySelector('[data-uzu-select-option].is-selected');
      trigger.setAttribute('aria-expanded', 'false');
      if (selected && selected.id) {
        trigger.setAttribute('aria-activedescendant', selected.id);
      } else {
        trigger.removeAttribute('aria-activedescendant');
      }
    }
    const menu = select.querySelector('[role="listbox"]');
    const finish = () => {
      select.classList.remove('is-closing');
      selectCloseTimers.delete(select);
    };
    const timer = scheduleAfterAnimation([menu].filter(Boolean), finish);
    if (timer) selectCloseTimers.set(select, timer);
  }

  function ensureId(element, prefix) {
    if (!element.id) {
      selectCounter += 1;
      element.id = `${prefix}-${selectCounter}`;
    }
    return element.id;
  }

  function focusSelectOption(select, index) {
    const options = queryAll(select, '[data-uzu-select-option]');
    const trigger = select.querySelector('[data-uzu-select-trigger]');
    if (!options.length) return;
    const nextIndex = (index + options.length) % options.length;
    options.forEach((option, optionIndex) => {
      const isActive = optionIndex === nextIndex;
      option.classList.toggle('is-active', isActive);
      option.setAttribute('tabindex', isActive ? '0' : '-1');
    });
    if (trigger && options[nextIndex].id) {
      trigger.setAttribute('aria-activedescendant', options[nextIndex].id);
    }
    options[nextIndex].focus();
  }

  function openSelect(select, focusIndex) {
    const trigger = select.querySelector('[data-uzu-select-trigger]');
    const options = queryAll(select, '[data-uzu-select-option]');
    const existingTimer = selectCloseTimers.get(select);
    if (existingTimer) {
      window.clearTimeout(existingTimer);
      selectCloseTimers.delete(select);
    }
    select.classList.remove('is-closing');
    select.classList.add('is-open');
    if (trigger) trigger.setAttribute('aria-expanded', 'true');
    queueDisclosureHeightRefresh(select);
    const selectedIndex = options.findIndex((option) => option.classList.contains('is-selected'));
    focusSelectOption(select, focusIndex ?? (selectedIndex >= 0 ? selectedIndex : 0));
  }

  function getSelectOptionLabelNodes(option) {
    const nodes = [...option.childNodes].filter((node) => {
      if (node.nodeType === Node.TEXT_NODE) return node.textContent.trim();
      return node.nodeType === Node.ELEMENT_NODE && node.hasAttribute('data-lang');
    });
    return nodes.length ? nodes : [document.createTextNode(option.textContent.trim())];
  }

  function syncSelectTriggerLabel(trigger, option) {
    const labelRoot = trigger.querySelector('[data-uzu-select-label]') || trigger;
    labelRoot.replaceChildren(...getSelectOptionLabelNodes(option).map((node) => node.cloneNode(true)));
  }

  function getSelectOptionValue(option) {
    return option.dataset.uzuSelectValue ?? option.dataset.value ?? option.textContent.trim();
  }

  function getSelectOptionLabel(option) {
    return option.textContent.trim();
  }

  function getSelectInput(select) {
    let input = select.querySelector('input[type="hidden"][data-uzu-select-input]');
    const name = select.dataset.uzuSelectName || select.getAttribute('name') || input?.name || '';
    if (!input && name) {
      input = document.createElement('input');
      input.type = 'hidden';
      input.setAttribute('data-uzu-select-input', '');
      select.append(input);
    }
    if (input && name) input.name = name;
    return input;
  }

  function syncSelectValue(select, option) {
    const value = getSelectOptionValue(option);
    const trigger = select.querySelector('[data-uzu-select-trigger]');
    const input = getSelectInput(select);
    select.dataset.uzuSelectValue = value;
    if (trigger) trigger.dataset.uzuSelectValue = value;
    if (input) input.value = value;
    return value;
  }

  function emitSelectChange(select, option, value) {
    select.dispatchEvent(new CustomEvent('uzu-select-change', {
      bubbles: true,
      detail: {
        value,
        label: getSelectOptionLabel(option),
        option,
        select
      }
    }));
    select.dispatchEvent(new Event('change', { bubbles: true }));
  }

  function chooseSelectOption(select, option) {
    const trigger = select.querySelector('[data-uzu-select-trigger]');
    const options = queryAll(select, '[data-uzu-select-option]');
    const previousValue = select.dataset.uzuSelectValue || getSelectInput(select)?.value || '';
    options.forEach((item) => {
      item.classList.remove('is-selected');
      item.setAttribute('aria-selected', 'false');
    });
    option.classList.add('is-selected');
    option.setAttribute('aria-selected', 'true');
    const value = syncSelectValue(select, option);
    if (trigger) {
      syncSelectTriggerLabel(trigger, option);
      closeSelect(select);
      trigger.focus();
    }
    if (value !== previousValue) emitSelectChange(select, option, value);
  }

  function initSelects(root = document) {
    queryAll(root, '[data-uzu-select]').forEach((select) => {
      const trigger = select.querySelector('[data-uzu-select-trigger]');
      const options = queryAll(select, '[data-uzu-select-option]');
      const menu = select.querySelector('[role="listbox"]');
      if (!trigger || !options.length) return;

      const selectId = ensureId(select, 'uzu-select');
      const menuId = menu ? ensureId(menu, `${selectId}-menu`) : '';
      trigger.setAttribute('aria-haspopup', 'listbox');
      trigger.setAttribute('aria-expanded', 'false');
      if (menuId) trigger.setAttribute('aria-controls', menuId);
      options.forEach((option, index) => {
        ensureId(option, `${selectId}-option-${index + 1}`);
        option.setAttribute('tabindex', '-1');
        option.setAttribute('aria-selected', option.classList.contains('is-selected') ? 'true' : 'false');
      });
      const selected = options.find((option) => option.classList.contains('is-selected'));
      if (selected) {
        trigger.setAttribute('aria-activedescendant', selected.id);
        syncSelectValue(select, selected);
      }

      if (!markInitialized(select, 'Select')) return;

      trigger.addEventListener('click', () => {
        if (trigger.disabled || trigger.getAttribute('aria-disabled') === 'true') return;
        if (select.classList.contains('is-open')) {
          closeSelect(select);
        } else {
          const selectedIndex = options.findIndex((option) => option.classList.contains('is-selected'));
          openSelect(select, selectedIndex >= 0 ? selectedIndex : 0);
        }
      });

      trigger.addEventListener('keydown', (event) => {
        if (trigger.disabled || trigger.getAttribute('aria-disabled') === 'true') return;
        if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(event.key)) {
          event.preventDefault();
          const selectedIndex = options.findIndex((option) => option.classList.contains('is-selected'));
          const startIndex = event.key === 'ArrowUp' ? (selectedIndex >= 0 ? selectedIndex - 1 : options.length - 1) : (selectedIndex >= 0 ? selectedIndex : 0);
          openSelect(select, startIndex);
        }
      });

      options.forEach((option) => {
        option.addEventListener('mouseenter', () => {
          focusSelectOption(select, options.indexOf(option));
        });

        option.addEventListener('click', () => {
          chooseSelectOption(select, option);
        });

        option.addEventListener('keydown', (event) => {
          const currentIndex = options.indexOf(option);
          if (event.key === 'ArrowDown') {
            event.preventDefault();
            focusSelectOption(select, currentIndex + 1);
          } else if (event.key === 'ArrowUp') {
            event.preventDefault();
            focusSelectOption(select, currentIndex - 1);
          } else if (event.key === 'Home') {
            event.preventDefault();
            focusSelectOption(select, 0);
          } else if (event.key === 'End') {
            event.preventDefault();
            focusSelectOption(select, options.length - 1);
          } else if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            chooseSelectOption(select, option);
          } else if (event.key === 'Escape') {
            event.preventDefault();
            closeSelect(select);
            trigger.focus();
          }
        });
      });

      select.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
          closeSelect(select);
          trigger.focus();
        }
      });
    });
  }

/* ui/js/tabs-segmented.js */
function syncTabsState(tabsRoot, activeTab, emit = true) {
    const tabs = getScopedControls(tabsRoot, '.uzu-tab', '[data-uzu-tabs]');
    const enabled = getEnabledControls(tabs);
    const nextTab = activeTab && !isControlDisabled(activeTab) ? activeTab : enabled[0];
    if (!nextTab) return;
    const previousValue = tabsRoot.dataset.uzuTabsValue || '';
    const value = getControlValue(nextTab, 'uzuTabValue');
    let panel = null;

    if (!tabsRoot.hasAttribute('role')) tabsRoot.setAttribute('role', 'tablist');
    tabs.forEach((tab, index) => {
      const isActive = tab === nextTab;
      const tabPanel = getTabPanel(tab);
      if (tabPanel) {
        const panelId = tabPanel.id || ensureId(tabPanel, `${tabsRoot.id || 'uzu-tabs'}-panel-${index + 1}`);
        const tabId = tab.id || ensureId(tab, `${tabsRoot.id || 'uzu-tabs'}-tab-${index + 1}`);
        tab.setAttribute('aria-controls', panelId);
        tabPanel.setAttribute('role', 'tabpanel');
        tabPanel.setAttribute('aria-labelledby', tabId);
      }
      tab.classList.toggle('is-active', isActive);
      tab.setAttribute('role', 'tab');
      tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
      tab.setAttribute('tabindex', isActive && !isControlDisabled(tab) ? '0' : '-1');
      if (tabPanel) tabPanel.hidden = !isActive;
      if (isActive) panel = tabPanel;
    });
    tabsRoot.dataset.uzuTabsValue = value;
    setControlIndicator(tabsRoot, nextTab, 'tabs');
    if (panel) {
      queueIndicatorRefresh(panel, true);
      queueDisclosureHeightRefresh(panel);
    }

    if (emit && value !== previousValue) {
      tabsRoot.dispatchEvent(new CustomEvent('uzu-tabs-change', {
        bubbles: true,
        detail: {
          value,
          tab: nextTab,
          tabs: tabsRoot,
          index: tabs.indexOf(nextTab),
          panel
        }
      }));
      tabsRoot.dispatchEvent(new Event('change', { bubbles: true }));
    }
  }

  function initTabs(root = document) {
    queryAll(root, '[data-uzu-tabs]').forEach((tabsRoot) => {
      const tabs = getScopedControls(tabsRoot, '.uzu-tab', '[data-uzu-tabs]');
      if (!tabs.length) return;
      const activeTab = tabs.find((tab) => tab.classList.contains('is-active') || tab.getAttribute('aria-selected') === 'true');
      syncTabsState(tabsRoot, activeTab, false);

      if (!markInitialized(tabsRoot, 'Tabs')) return;

      tabsRoot.addEventListener('click', (event) => {
        const tab = getScopedEventControl(event, '.uzu-tab', tabsRoot, '[data-uzu-tabs]');
        if (!tab || isControlDisabled(tab)) return;
        syncTabsState(tabsRoot, tab);
      });

      tabsRoot.addEventListener('keydown', (event) => {
        const tab = getScopedEventControl(event, '.uzu-tab', tabsRoot, '[data-uzu-tabs]');
        if (!tab || isControlDisabled(tab)) return;
        const currentTabs = getScopedControls(tabsRoot, '.uzu-tab', '[data-uzu-tabs]');
        let nextTab = null;
        if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
          nextTab = moveActiveControl(currentTabs, tab, 1);
        } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
          nextTab = moveActiveControl(currentTabs, tab, -1);
        } else if (event.key === 'Home') {
          nextTab = getEnabledControls(currentTabs)[0];
        } else if (event.key === 'End') {
          const enabled = getEnabledControls(currentTabs);
          nextTab = enabled[enabled.length - 1];
        }
        if (nextTab) {
          event.preventDefault();
          syncTabsState(tabsRoot, nextTab);
          nextTab.focus();
        }
      });
    });
  }

  function syncSegmentedState(segmented, activeSegment, emit = true) {
    const segments = getScopedControls(segmented, '.uzu-segment', '[data-uzu-segmented]');
    const enabled = getEnabledControls(segments);
    const nextSegment = activeSegment && !isControlDisabled(activeSegment) ? activeSegment : enabled[0];
    if (!nextSegment) return;
    const previousValue = segmented.dataset.uzuSegmentedValue || '';
    const value = getControlValue(nextSegment, 'uzuSegmentValue');

    if (!segmented.hasAttribute('role')) segmented.setAttribute('role', 'group');
    segments.forEach((segment) => {
      const isActive = segment === nextSegment;
      segment.classList.toggle('is-active', isActive);
      segment.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    });
    segmented.dataset.uzuSegmentedValue = value;
    setControlIndicator(segmented, nextSegment, 'segmented');

    if (emit && value !== previousValue) {
      segmented.dispatchEvent(new CustomEvent('uzu-segmented-change', {
        bubbles: true,
        detail: {
          value,
          segment: nextSegment,
          segmented,
          index: segments.indexOf(nextSegment)
        }
      }));
      segmented.dispatchEvent(new Event('change', { bubbles: true }));
    }
  }

  function initSegmented(root = document) {
    queryAll(root, '[data-uzu-segmented]').forEach((segmented) => {
      const segments = getScopedControls(segmented, '.uzu-segment', '[data-uzu-segmented]');
      if (!segments.length) return;
      const activeSegment = segments.find((segment) => segment.classList.contains('is-active') || segment.getAttribute('aria-pressed') === 'true');
      syncSegmentedState(segmented, activeSegment, false);

      if (!markInitialized(segmented, 'Segmented')) return;

      segmented.addEventListener('click', (event) => {
        const segment = getScopedEventControl(event, '.uzu-segment', segmented, '[data-uzu-segmented]');
        if (!segment || isControlDisabled(segment)) return;
        syncSegmentedState(segmented, segment);
      });

      segmented.addEventListener('keydown', (event) => {
        const segment = getScopedEventControl(event, '.uzu-segment', segmented, '[data-uzu-segmented]');
        if (!segment || isControlDisabled(segment)) return;
        const currentSegments = getScopedControls(segmented, '.uzu-segment', '[data-uzu-segmented]');
        let nextSegment = null;
        if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
          nextSegment = moveActiveControl(currentSegments, segment, 1);
        } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
          nextSegment = moveActiveControl(currentSegments, segment, -1);
        } else if (event.key === 'Home') {
          nextSegment = getEnabledControls(currentSegments)[0];
        } else if (event.key === 'End') {
          const enabled = getEnabledControls(currentSegments);
          nextSegment = enabled[enabled.length - 1];
        }
        if (nextSegment) {
          event.preventDefault();
          syncSegmentedState(segmented, nextSegment);
          nextSegment.focus();
        }
      });
    });
  }

/* ui/js/pagination.js */
function getPaginationPageValue(control) {
    return control.dataset.uzuPage ?? control.dataset.page ?? '';
  }

  function getPaginationPageControls(pagination) {
    return getScopedControls(pagination, '.uzu-page-button', '[data-uzu-pagination]')
      .filter((control) => getPaginationPageValue(control));
  }

  function getActivePaginationPage(pagination) {
    const pages = getPaginationPageControls(pagination);
    return pages.find((page) => page.classList.contains('is-active') || page.getAttribute('aria-current') === 'page')
      || pages.find((page) => getPaginationPageValue(page) === pagination.dataset.uzuPaginationPage)
      || pages.find((page) => !isControlDisabled(page));
  }

  function getPaginationPanelRoot(pagination) {
    const target = pagination.dataset.uzuPaginationTarget;
    if (!target) return null;
    try {
      return document.querySelector(target);
    } catch (_) {
      return null;
    }
  }

  function setPaginationControlDisabled(control, disabled) {
    control.classList.toggle('is-disabled', disabled);
    if ('disabled' in control) control.disabled = disabled;
    if (disabled) {
      control.setAttribute('aria-disabled', 'true');
      control.setAttribute('tabindex', '-1');
    } else {
      control.removeAttribute('aria-disabled');
      control.removeAttribute('tabindex');
    }
  }

  function syncPaginationPanels(pagination, value) {
    const panelRoot = getPaginationPanelRoot(pagination);
    if (!panelRoot) return null;
    let activePanel = null;
    [...panelRoot.children].filter((panel) => panel.hasAttribute('data-uzu-page-panel')).forEach((panel) => {
      const isActive = (panel.dataset.uzuPagePanel ?? panel.dataset.page ?? '') === value;
      panel.hidden = !isActive;
      if (isActive) activePanel = panel;
    });
    return activePanel;
  }

  function syncPaginationState(pagination, activePage, emit = true) {
    const pages = getPaginationPageControls(pagination);
    const enabledPages = getEnabledControls(pages);
    const requestedValue = typeof activePage === 'string' ? activePage : getPaginationPageValue(activePage || getActivePaginationPage(pagination));
    const nextPage = enabledPages.find((page) => getPaginationPageValue(page) === requestedValue) || enabledPages[0];
    if (!nextPage) return;

    const previousValue = pagination.dataset.uzuPaginationPage || '';
    const value = getPaginationPageValue(nextPage);
    const pageIndex = pages.indexOf(nextPage);
    const enabledPageIndex = enabledPages.indexOf(nextPage);
    pages.forEach((page) => {
      const isActive = page === nextPage;
      page.classList.toggle('is-active', isActive);
      if (isActive) page.setAttribute('aria-current', 'page');
      else page.removeAttribute('aria-current');
    });

    const controls = getScopedControls(pagination, '.uzu-page-button', '[data-uzu-pagination]');
    controls
      .filter((control) => control.hasAttribute('data-uzu-page-prev'))
      .forEach((control) => setPaginationControlDisabled(control, enabledPageIndex <= 0));
    controls
      .filter((control) => control.hasAttribute('data-uzu-page-next'))
      .forEach((control) => setPaginationControlDisabled(control, enabledPageIndex >= enabledPages.length - 1));

    pagination.dataset.uzuPaginationPage = value;
    const panel = syncPaginationPanels(pagination, value);
    if (panel) queueDisclosureHeightRefresh(panel);

    if (emit && value !== previousValue) {
      pagination.dispatchEvent(new CustomEvent('uzu-pagination-change', {
        bubbles: true,
        detail: {
          value,
          page: nextPage,
          pagination,
          index: pageIndex,
          panel
        }
      }));
      pagination.dispatchEvent(new Event('change', { bubbles: true }));
    }
  }

  function getRelativePaginationPage(pagination, direction) {
    const pages = getEnabledControls(getPaginationPageControls(pagination));
    const active = getActivePaginationPage(pagination);
    const index = Math.max(0, pages.indexOf(active));
    return pages[index + direction] || null;
  }

  function initPaginations(root = document) {
    queryAll(root, '[data-uzu-pagination]').forEach((pagination) => {
      const pages = getPaginationPageControls(pagination);
      if (!pages.length) return;
      syncPaginationState(pagination, getActivePaginationPage(pagination), false);

      if (!markInitialized(pagination, 'Pagination')) return;

      pagination.addEventListener('click', (event) => {
        const control = getScopedEventControl(event, '.uzu-page-button', pagination, '[data-uzu-pagination]');
        if (!control || isControlDisabled(control)) return;
        let nextPage = null;
        if (control.hasAttribute('data-uzu-page-prev')) {
          nextPage = getRelativePaginationPage(pagination, -1);
        } else if (control.hasAttribute('data-uzu-page-next')) {
          nextPage = getRelativePaginationPage(pagination, 1);
        } else if (getPaginationPageValue(control)) {
          nextPage = control;
        }
        if (!nextPage) return;
        event.preventDefault();
        syncPaginationState(pagination, nextPage);
        if (typeof nextPage.focus === 'function') nextPage.focus({ preventScroll: true });
      });

      pagination.addEventListener('keydown', (event) => {
        const control = getScopedEventControl(event, '.uzu-page-button', pagination, '[data-uzu-pagination]');
        if (!control || isControlDisabled(control)) return;
        const pages = getEnabledControls(getPaginationPageControls(pagination));
        const active = getActivePaginationPage(pagination);
        let nextPage = null;
        if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
          nextPage = pages[Math.min(pages.length - 1, Math.max(0, pages.indexOf(active)) + 1)];
        } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
          nextPage = pages[Math.max(0, Math.max(0, pages.indexOf(active)) - 1)];
        } else if (event.key === 'Home') {
          nextPage = pages[0];
        } else if (event.key === 'End') {
          nextPage = pages[pages.length - 1];
        }
        if (nextPage) {
          event.preventDefault();
          syncPaginationState(pagination, nextPage);
          nextPage.focus();
        }
      });
    });
  }

/* ui/js/switches.js */
function setSwitchState(control, checked, emit = true) {
    control.classList.toggle('is-on', checked);
    control.setAttribute('role', 'switch');
    control.setAttribute('aria-checked', checked ? 'true' : 'false');
    if (!control.hasAttribute('tabindex') && control.tagName !== 'BUTTON') {
      control.setAttribute('tabindex', '0');
    }
    if (emit) {
      control.dispatchEvent(new CustomEvent('uzu-switch-change', {
        bubbles: true,
        detail: { checked, switch: control }
      }));
      control.dispatchEvent(new Event('change', { bubbles: true }));
    }
  }

  function toggleSwitch(control) {
    if (control.getAttribute('aria-disabled') === 'true' || control.classList.contains('is-disabled') || control.disabled) return;
    setSwitchState(control, control.getAttribute('aria-checked') !== 'true');
  }

/* ui/js/forms.js */
function initSwitches(root = document) {
    queryAll(root, '[data-uzu-switch]').forEach((control) => {
      const checked = control.getAttribute('aria-checked') === 'true' || control.classList.contains('is-on');
      setSwitchState(control, checked, false);
      if (!markInitialized(control, 'Switch')) return;
      control.addEventListener('click', () => toggleSwitch(control));
      control.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          toggleSwitch(control);
        }
      });
    });
  }

  function getFieldControl(field) {
    return field.querySelector('input:not([type="hidden"]), textarea, select, [data-uzu-select], [data-uzu-combobox], [data-uzu-switch]');
  }

  function getFormField(control) {
    return control.closest('.uzu-field, [data-uzu-field]');
  }

  function getControlValidity(control) {
    if ('validity' in control && control.validity) return control.validity.valid;
    if (control.matches?.('[data-uzu-select], [data-uzu-combobox], [data-uzu-switch]')) {
      return control.getAttribute('aria-invalid') !== 'true' && !control.classList.contains('is-invalid');
    }
    return true;
  }

  function syncFieldValidity(field, emit = false) {
    const control = getFieldControl(field);
    if (!control) return true;
    const valid = getControlValidity(control);
    const invalid = !valid;
    field.classList.toggle('is-invalid', invalid);
    if ('setAttribute' in control) {
      control.setAttribute('aria-invalid', invalid ? 'true' : 'false');
    }
    queryAll(field, '.uzu-form-error, [data-uzu-form-error]').forEach((message) => {
      message.hidden = !invalid;
      message.setAttribute('role', message.getAttribute('role') || 'alert');
    });
    if (emit) {
      field.dispatchEvent(new CustomEvent('uzu-field-validate', {
        bubbles: true,
        detail: { field, control, valid, invalid }
      }));
    }
    return valid;
  }

  function syncFieldInitialState(field) {
    const control = getFieldControl(field);
    const invalid = field.classList.contains('is-invalid') || control?.getAttribute?.('aria-invalid') === 'true';
    field.classList.toggle('is-invalid', invalid);
    if (control && 'setAttribute' in control) {
      control.setAttribute('aria-invalid', invalid ? 'true' : 'false');
    }
    queryAll(field, '.uzu-form-error, [data-uzu-form-error]').forEach((message) => {
      message.hidden = !invalid;
      message.setAttribute('role', message.getAttribute('role') || 'alert');
    });
    return invalid;
  }

  function shouldValidateFormOnInit(form) {
    const value = form.getAttribute('data-uzu-form-validate-on-init');
    return value === '' || value === 'true';
  }

  function validateForm(form, emit = true) {
    const fields = queryAll(form, '.uzu-field, [data-uzu-field]');
    const valid = fields.map((field) => syncFieldValidity(field, emit)).every(Boolean);
    form.classList.toggle('is-invalid', !valid);
    if (emit) {
      form.dispatchEvent(new CustomEvent('uzu-form-validate', {
        bubbles: true,
        detail: { form, valid, invalid: !valid }
      }));
    }
    return valid;
  }

  function initForms(root = document) {
    queryAll(root, '[data-uzu-form]').forEach((form) => {
      if (shouldValidateFormOnInit(form)) {
        validateForm(form, false);
      } else {
        const hasInvalidField = queryAll(form, '.uzu-field, [data-uzu-field]').map(syncFieldInitialState).some(Boolean);
        form.classList.toggle('is-invalid', hasInvalidField || form.classList.contains('is-invalid'));
      }
      if (!markInitialized(form, 'Form')) return;
      queryAll(form, 'input, textarea, select, [data-uzu-select], [data-uzu-combobox], [data-uzu-switch]').forEach((control) => {
        const sync = () => {
          const field = getFormField(control);
          if (field) syncFieldValidity(field, true);
          validateForm(form, true);
        };
        control.addEventListener('input', sync);
        control.addEventListener('change', sync);
        control.addEventListener('blur', sync);
        control.addEventListener('uzu-select-change', sync);
        control.addEventListener('uzu-combobox-change', sync);
        control.addEventListener('uzu-switch-change', sync);
      });
      form.addEventListener('submit', (event) => {
        if (!validateForm(form, true)) {
          event.preventDefault();
          const firstInvalid = form.querySelector('[aria-invalid="true"], .is-invalid input, .is-invalid textarea, .is-invalid select, .is-invalid [tabindex]');
          if (firstInvalid && typeof firstInvalid.focus === 'function') firstInvalid.focus();
        }
      });
    });
  }

  function setSearchClearState(search) {
    const input = search.querySelector('.uzu-search-input, input[type="search"], input[type="text"]');
    const clear = search.querySelector('[data-uzu-search-clear]');
    if (!input || !clear) return;
    clear.hidden = !input.value;
    clear.setAttribute('aria-hidden', input.value ? 'false' : 'true');
  }

  function initSearches(root = document) {
    queryAll(root, '[data-uzu-search]').forEach((search) => {
      const input = search.querySelector('.uzu-search-input, input[type="search"], input[type="text"]');
      const clear = search.querySelector('[data-uzu-search-clear]');
      if (!input || !clear) return;
      setSearchClearState(search);
      if (!markInitialized(search, 'Search')) return;
      input.addEventListener('input', () => setSearchClearState(search));
      clear.addEventListener('click', () => {
        if (input.disabled || input.readOnly) return;
        input.value = '';
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new Event('change', { bubbles: true }));
        setSearchClearState(search);
        input.focus();
      });
    });
  }

  function setPasswordVisible(password, visible, emit = true) {
    const input = password.querySelector('.uzu-password-input, input[type="password"], input[type="text"]');
    const toggle = password.querySelector('[data-uzu-password-toggle]');
    if (!input || !toggle) return;
    input.type = visible ? 'text' : 'password';
    password.classList.toggle('is-visible', visible);
    toggle.setAttribute('aria-pressed', visible ? 'true' : 'false');
    if (emit) {
      password.dispatchEvent(new CustomEvent('uzu-password-toggle', {
        bubbles: true,
        detail: { visible, password, input, toggle }
      }));
    }
  }

  function initPasswords(root = document) {
    queryAll(root, '[data-uzu-password]').forEach((password) => {
      const input = password.querySelector('.uzu-password-input, input[type="password"], input[type="text"]');
      const toggle = password.querySelector('[data-uzu-password-toggle]');
      if (!input || !toggle) return;
      setPasswordVisible(password, input.type === 'text', false);
      if (!markInitialized(password, 'Password')) return;
      toggle.addEventListener('click', () => {
        if (input.disabled || toggle.disabled || toggle.getAttribute('aria-disabled') === 'true') return;
        setPasswordVisible(password, input.type !== 'text');
      });
    });
  }

  function getStepperInput(stepper) {
    return stepper.querySelector('.uzu-stepper-input, input[type="number"]');
  }

  function getNumberAttribute(input, name, fallback) {
    const value = Number.parseFloat(input.getAttribute(name));
    return Number.isFinite(value) ? value : fallback;
  }

  function getInputNumber(input) {
    const value = Number.parseFloat(input.value);
    return Number.isFinite(value) ? value : 0;
  }

  function clampNumber(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function getStepPrecision(step) {
    const text = String(step);
    if (/e/i.test(text)) {
      const fixed = Number(step).toFixed(12).replace(/0+$/, '');
      const fixedIndex = fixed.indexOf('.');
      return fixedIndex === -1 ? 0 : fixed.length - fixedIndex - 1;
    }
    const index = text.indexOf('.');
    return index === -1 ? 0 : text.length - index - 1;
  }

  function syncStepperDisabled(stepper) {
    const input = getStepperInput(stepper);
    if (!input) return;
    const min = getNumberAttribute(input, 'min', Number.NEGATIVE_INFINITY);
    const max = getNumberAttribute(input, 'max', Number.POSITIVE_INFINITY);
    const value = getInputNumber(input);
    queryAll(stepper, '[data-uzu-stepper-decrement]').forEach((button) => {
      button.disabled = input.disabled || value <= min;
    });
    queryAll(stepper, '[data-uzu-stepper-increment]').forEach((button) => {
      button.disabled = input.disabled || value >= max;
    });
  }

  function setStepperValue(stepper, nextValue, emit = true) {
    const input = getStepperInput(stepper);
    if (!input) return;
    const min = getNumberAttribute(input, 'min', Number.NEGATIVE_INFINITY);
    const max = getNumberAttribute(input, 'max', Number.POSITIVE_INFINITY);
    const step = Math.abs(getNumberAttribute(input, 'step', 1)) || 1;
    const precision = getStepPrecision(step);
    const clamped = clampNumber(nextValue, min, max);
    input.value = Number.isFinite(clamped) ? clamped.toFixed(precision).replace(/\.?0+$/, '') : String(nextValue);
    syncStepperDisabled(stepper);
    if (emit) {
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new Event('change', { bubbles: true }));
      stepper.dispatchEvent(new CustomEvent('uzu-stepper-change', {
        bubbles: true,
        detail: { value: input.value, number: getInputNumber(input), stepper, input }
      }));
    }
  }

  function stepStepper(stepper, direction) {
    const input = getStepperInput(stepper);
    if (!input || input.disabled || input.readOnly) return;
    const step = Math.abs(getNumberAttribute(input, 'step', 1)) || 1;
    setStepperValue(stepper, getInputNumber(input) + step * direction);
    input.focus();
  }

  function initSteppers(root = document) {
    queryAll(root, '[data-uzu-stepper]').forEach((stepper) => {
      const input = getStepperInput(stepper);
      if (!input) return;
      syncStepperDisabled(stepper);
      if (!markInitialized(stepper, 'Stepper')) return;
      queryAll(stepper, '[data-uzu-stepper-decrement]').forEach((button) => {
        button.addEventListener('click', () => stepStepper(stepper, -1));
      });
      queryAll(stepper, '[data-uzu-stepper-increment]').forEach((button) => {
        button.addEventListener('click', () => stepStepper(stepper, 1));
      });
      input.addEventListener('input', () => syncStepperDisabled(stepper));
      input.addEventListener('change', () => setStepperValue(stepper, getInputNumber(input), false));
    });
  }

  function syncSliderValue(slider) {
    if (!slider || !('value' in slider)) return;
    const min = Number.parseFloat(slider.min || '0');
    const max = Number.parseFloat(slider.max || '100');
    const value = Number.parseFloat(slider.value || '0');
    const range = max - min;
    const percent = range ? ((value - min) / range) * 100 : 0;
    const clampedPercent = Math.min(100, Math.max(0, percent));
    slider.style.setProperty('--uzu-slider-value', `${clampedPercent}%`);
    syncSliderSteps(slider, min, max, value, range);
  }

  function syncSliderSteps(slider, min, max, value, range) {
    const stepped = slider.classList.contains('uzu-slider-stepped') || slider.hasAttribute('data-uzu-slider-stepped');
    const stepAttr = slider.getAttribute('step');
    const step = stepAttr !== 'any' ? Number.parseFloat(stepAttr || '1') : NaN;
    const stepCount = range > 0 && Number.isFinite(step) && step > 0 ? Math.floor(range / step) + 1 : 0;
    if (!stepped || stepCount < 2 || stepCount > 64) {
      slider.style.setProperty('--uzu-slider-step-count', '0');
      slider.style.setProperty('--uzu-slider-step-ticks', 'none');
      return;
    }

    const clampedValue = Math.min(range, Math.max(0, value - min));
    const valueIndex = Math.round(clampedValue / step);
    const ticks = Array.from({ length: stepCount }, (_, index) => {
      const stepValue = Math.min(range, index * step);
      const position = (stepValue / range) * 100;
      const color = index <= valueIndex ? 'var(--uzu-slider-step-dot-active)' : 'var(--uzu-slider-step-dot)';
      return `radial-gradient(circle at ${position}% 50%, ${color} 0 var(--uzu-slider-step-dot-radius), transparent calc(var(--uzu-slider-step-dot-radius) + 1px))`;
    });
    slider.style.setProperty('--uzu-slider-step-count', String(stepCount));
    slider.style.setProperty('--uzu-slider-step-ticks', ticks.join(', '));
  }

  function initSliders(root = document) {
    queryAll(root, '[data-uzu-slider], .uzu-slider').forEach((slider) => {
      if (!(slider instanceof HTMLInputElement) || slider.type !== 'range') return;
      syncSliderValue(slider);
      if (!markInitialized(slider, 'Slider')) return;
      slider.addEventListener('input', () => syncSliderValue(slider));
      slider.addEventListener('change', () => syncSliderValue(slider));
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

/* ui/js/menubars.js */
function initMenubars(root = document) {
    queryAll(root, '[data-uzu-menubar]').forEach((menubar) => {
      const items = getScopedControls(menubar, '.uzu-menubar-item', '[data-uzu-menubar]');
      if (!items.length) return;
      menubar.setAttribute('role', menubar.getAttribute('role') || 'menubar');
      items.forEach((item, index) => {
        item.setAttribute('role', item.getAttribute('role') || 'menuitem');
        item.setAttribute('tabindex', index === 0 ? '0' : '-1');
      });
      if (!markInitialized(menubar, 'Menubar')) return;
      menubar.addEventListener('click', (event) => {
        const item = getScopedEventControl(event, '.uzu-menubar-item', menubar, '[data-uzu-menubar]');
        if (!item || isControlDisabled(item)) return;
        items.forEach((control) => {
          const active = control === item;
          control.classList.toggle('is-active', active);
          control.setAttribute('tabindex', active ? '0' : '-1');
        });
        menubar.dispatchEvent(new CustomEvent('uzu-menubar-change', {
          bubbles: true,
          detail: { value: getControlValue(item, 'uzuMenubarValue'), item, menubar, index: items.indexOf(item) }
        }));
      });
      menubar.addEventListener('keydown', (event) => {
        const item = getScopedEventControl(event, '.uzu-menubar-item', menubar, '[data-uzu-menubar]');
        if (!item || isControlDisabled(item)) return;
        let next = null;
        if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = moveActiveControl(items, item, 1);
        else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = moveActiveControl(items, item, -1);
        else if (event.key === 'Home') next = getEnabledControls(items)[0];
        else if (event.key === 'End') next = getEnabledControls(items).at(-1);
        if (next) {
          event.preventDefault();
          items.forEach((control) => control.setAttribute('tabindex', control === next ? '0' : '-1'));
          next.focus();
        }
      });
    });
  }

/* ui/js/commands.js */
function getCommandItems(command) {
    return getScopedControls(command, '.uzu-command-item', '[data-uzu-command]');
  }

  function getCommandInput(command) {
    return command.querySelector('.uzu-command-input, [data-uzu-command-input]');
  }

  function getCommandList(command) {
    return command.querySelector('.uzu-command-list, [data-uzu-command-list]');
  }

  function getCommandItemText(item) {
    return (item.dataset.uzuCommandText || item.textContent || '').trim().toLowerCase();
  }

  function getVisibleCommandItems(command) {
    return getEnabledControls(getCommandItems(command).filter((item) => !item.hidden));
  }

  function focusCommandItem(command, index, focus = true) {
    const items = getVisibleCommandItems(command);
    if (!items.length) return null;
    const nextIndex = (index + items.length) % items.length;
    items.forEach((item, itemIndex) => {
      item.classList.toggle('is-active', itemIndex === nextIndex);
      item.setAttribute('tabindex', itemIndex === nextIndex ? '0' : '-1');
    });
    const input = getCommandInput(command);
    if (input && items[nextIndex].id) input.setAttribute('aria-activedescendant', items[nextIndex].id);
    if (focus) items[nextIndex].focus();
    return items[nextIndex];
  }

  function filterCommand(command, focus = false) {
    const input = getCommandInput(command);
    const list = getCommandList(command);
    const query = (input?.value || '').trim().toLowerCase();
    let visibleCount = 0;
    getCommandItems(command).forEach((item, index) => {
      ensureId(item, `uzu-command-item-${index + 1}`);
      const visible = !query || getCommandItemText(item).includes(query);
      item.hidden = !visible;
      item.setAttribute('tabindex', '-1');
      item.classList.remove('is-active');
      if (visible) visibleCount += 1;
    });
    queryAll(command, '.uzu-command-empty').forEach((empty) => {
      empty.hidden = visibleCount > 0;
    });
    if (list) list.setAttribute('aria-busy', 'false');
    if (visibleCount) {
      const items = getVisibleCommandItems(command);
      items[0].classList.add('is-active');
      items[0].setAttribute('tabindex', '0');
      if (input && items[0].id) input.setAttribute('aria-activedescendant', items[0].id);
      if (focus) items[0].focus();
    } else if (input) {
      input.removeAttribute('aria-activedescendant');
    }
    command.dispatchEvent(new CustomEvent('uzu-command-filter', {
      bubbles: true,
      detail: { value: input?.value || '', command, visibleCount }
    }));
  }

  function initCommands(root = document) {
    queryAll(root, '[data-uzu-command]').forEach((command) => {
      const input = getCommandInput(command);
      const list = getCommandList(command);
      const items = getCommandItems(command);
      if (!input || !list || !items.length) return;
      list.setAttribute('role', list.getAttribute('role') || 'listbox');
      input.setAttribute('role', input.getAttribute('role') || 'combobox');
      input.setAttribute('aria-expanded', 'true');
      input.setAttribute('aria-controls', ensureId(list, 'uzu-command-list'));
      items.forEach((item, index) => {
        ensureId(item, `uzu-command-item-${index + 1}`);
        item.setAttribute('role', item.getAttribute('role') || 'option');
        item.setAttribute('tabindex', '-1');
      });
      filterCommand(command);
      if (!markInitialized(command, 'Command')) return;
      input.addEventListener('input', () => filterCommand(command));
      input.addEventListener('keydown', (event) => {
        const visible = getVisibleCommandItems(command);
        const active = visible.find((item) => item.classList.contains('is-active')) || visible[0];
        const index = Math.max(0, visible.indexOf(active));
        if (event.key === 'ArrowDown') {
          event.preventDefault();
          focusCommandItem(command, index + 1, false);
        } else if (event.key === 'ArrowUp') {
          event.preventDefault();
          focusCommandItem(command, index - 1, false);
        } else if (event.key === 'Enter' && active) {
          event.preventDefault();
          active.click();
        }
      });
      command.addEventListener('click', (event) => {
        const item = getScopedEventControl(event, '.uzu-command-item', command, '[data-uzu-command]');
        if (!item || isControlDisabled(item)) return;
        command.dispatchEvent(new CustomEvent('uzu-command-select', {
          bubbles: true,
          detail: { value: getControlValue(item, 'uzuCommandValue'), item, command }
        }));
      });
    });
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

/* ui/js/comboboxes.js */
function getComboboxInput(combobox) {
    return combobox.querySelector('[data-uzu-combobox-input], .uzu-combobox-input');
  }

  function getComboboxList(combobox) {
    return combobox.querySelector('[data-uzu-combobox-list], .uzu-combobox-list');
  }

  function getComboboxOptions(combobox) {
    return getScopedControls(combobox, '[data-uzu-combobox-option], .uzu-combobox-option', '[data-uzu-combobox]');
  }

  function getComboboxOptionText(option) {
    return (option.dataset.uzuComboboxText || option.textContent || '').trim();
  }

  function ensureComboboxHiddenInput(combobox) {
    const name = combobox.dataset.uzuComboboxName;
    if (!name) return null;
    let input = combobox.querySelector('input[type="hidden"][data-uzu-combobox-hidden]');
    if (!input) {
      input = document.createElement('input');
      input.type = 'hidden';
      input.dataset.uzuComboboxHidden = '';
      combobox.append(input);
    }
    input.name = name;
    return input;
  }

  function getVisibleComboboxOptions(combobox) {
    return getEnabledControls(getComboboxOptions(combobox).filter((option) => !option.hidden));
  }

  function openCombobox(combobox) {
    const input = getComboboxInput(combobox);
    const list = getComboboxList(combobox);
    if (!input || !list) return;
    list.hidden = false;
    combobox.classList.add('is-open');
    input.setAttribute('aria-expanded', 'true');
    queueDisclosureHeightRefresh(list);
    combobox.dispatchEvent(new CustomEvent('uzu-combobox-open', {
      bubbles: true,
      detail: { combobox, input, list }
    }));
  }

  function closeCombobox(combobox) {
    const input = getComboboxInput(combobox);
    const list = getComboboxList(combobox);
    if (!input || !list || list.hidden) return;
    combobox.classList.remove('is-open');
    input.setAttribute('aria-expanded', 'false');
    list.hidden = true;
    getComboboxOptions(combobox).forEach((option) => option.classList.remove('is-active'));
    input.removeAttribute('aria-activedescendant');
    combobox.dispatchEvent(new CustomEvent('uzu-combobox-close', {
      bubbles: true,
      detail: { combobox, input, list }
    }));
  }

  function focusComboboxOption(combobox, index) {
    const input = getComboboxInput(combobox);
    const options = getVisibleComboboxOptions(combobox);
    if (!options.length) return null;
    const nextIndex = (index + options.length) % options.length;
    options.forEach((option, optionIndex) => {
      option.classList.toggle('is-active', optionIndex === nextIndex);
    });
    if (input) input.setAttribute('aria-activedescendant', ensureId(options[nextIndex], 'uzu-combobox-option'));
    return options[nextIndex];
  }

  function filterCombobox(combobox) {
    const input = getComboboxInput(combobox);
    const query = (input?.value || '').trim().toLowerCase();
    let visibleCount = 0;
    getComboboxOptions(combobox).forEach((option, index) => {
      ensureId(option, `uzu-combobox-option-${index + 1}`);
      const visible = !query || getComboboxOptionText(option).toLowerCase().includes(query);
      option.hidden = !visible;
      option.classList.remove('is-active');
      if (visible) visibleCount += 1;
    });
    queryAll(combobox, '.uzu-combobox-empty').forEach((empty) => {
      empty.hidden = visibleCount > 0;
    });
    focusComboboxOption(combobox, 0);
    combobox.dispatchEvent(new CustomEvent('uzu-combobox-filter', {
      bubbles: true,
      detail: { value: input?.value || '', combobox, visibleCount }
    }));
  }

  function setComboboxValue(combobox, optionOrValue, emit = true) {
    const input = getComboboxInput(combobox);
    const hidden = ensureComboboxHiddenInput(combobox);
    const options = getComboboxOptions(combobox);
    const option = optionOrValue instanceof Element
      ? optionOrValue
      : options.find((item) => getControlValue(item, 'uzuComboboxValue') === String(optionOrValue));
    if (!input || !option || isControlDisabled(option)) return;
    const value = getControlValue(option, 'uzuComboboxValue');
    const label = getComboboxOptionText(option);
    input.value = label;
    if (hidden) hidden.value = value;
    combobox.dataset.uzuComboboxValue = value;
    options.forEach((item) => {
      const selected = item === option;
      item.classList.toggle('is-selected', selected);
      item.setAttribute('aria-selected', selected ? 'true' : 'false');
    });
    closeCombobox(combobox);
    if (emit) {
      comboboxSelectionInputs.add(input);
      input.dispatchEvent(new Event('input', { bubbles: true }));
      comboboxSelectionInputs.delete(input);
      input.dispatchEvent(new Event('change', { bubbles: true }));
      combobox.dispatchEvent(new CustomEvent('uzu-combobox-change', {
        bubbles: true,
        detail: { value, label, option, combobox, input }
      }));
      combobox.dispatchEvent(new Event('change', { bubbles: true }));
    }
  }

  function initComboboxes(root = document) {
    queryAll(root, '[data-uzu-combobox]').forEach((combobox) => {
      const input = getComboboxInput(combobox);
      const list = getComboboxList(combobox);
      const options = getComboboxOptions(combobox);
      if (!input || !list || !options.length) return;
      const listId = ensureId(list, 'uzu-combobox-list');
      input.setAttribute('role', 'combobox');
      input.setAttribute('aria-autocomplete', input.getAttribute('aria-autocomplete') || 'list');
      input.setAttribute('aria-expanded', 'false');
      input.setAttribute('aria-controls', listId);
      list.setAttribute('role', list.getAttribute('role') || 'listbox');
      ensureComboboxHiddenInput(combobox);
      options.forEach((option, index) => {
        ensureId(option, `uzu-combobox-option-${index + 1}`);
        option.setAttribute('role', option.getAttribute('role') || 'option');
        option.setAttribute('aria-selected', option.classList.contains('is-selected') ? 'true' : 'false');
      });
      const selected = options.find((option) => option.classList.contains('is-selected') || option.getAttribute('aria-selected') === 'true');
      if (selected) setComboboxValue(combobox, selected, false);
      else if (!input.value) {
        const hidden = ensureComboboxHiddenInput(combobox);
        if (hidden) hidden.value = '';
      }
      list.hidden = true;
      if (!markInitialized(combobox, 'Combobox')) return;
      input.addEventListener('focus', () => {
        filterCombobox(combobox);
        openCombobox(combobox);
      });
      input.addEventListener('input', () => {
        if (comboboxSelectionInputs.has(input)) return;
        filterCombobox(combobox);
        openCombobox(combobox);
      });
      input.addEventListener('keydown', (event) => {
        const visible = getVisibleComboboxOptions(combobox);
        const active = visible.find((option) => option.classList.contains('is-active'));
        const index = Math.max(0, visible.indexOf(active));
        if (event.key === 'ArrowDown') {
          event.preventDefault();
          openCombobox(combobox);
          focusComboboxOption(combobox, index + 1);
        } else if (event.key === 'ArrowUp') {
          event.preventDefault();
          openCombobox(combobox);
          focusComboboxOption(combobox, index - 1);
        } else if (event.key === 'Enter' && active) {
          event.preventDefault();
          setComboboxValue(combobox, active);
        } else if (event.key === 'Escape') {
          event.preventDefault();
          closeCombobox(combobox);
        }
      });
      combobox.addEventListener('click', (event) => {
        const option = getScopedEventControl(event, '[data-uzu-combobox-option], .uzu-combobox-option', combobox, '[data-uzu-combobox]');
        if (option) {
          event.preventDefault();
          setComboboxValue(combobox, option);
        } else if (event.target === input) {
          openCombobox(combobox);
        }
      });
    });
  }

/* ui/js/data-grids.js */
function getDataGridRows(table) {
    return queryAll(table, 'tbody tr, [data-uzu-grid-row]').filter((row) => row.closest('table') === table && !row.hasAttribute('data-uzu-grid-empty'));
  }

  function getDataGridVisibleRows(table) {
    return getDataGridRows(table).filter((row) => !row.hidden);
  }

  function getDataGridSelectableRows(table) {
    return getDataGridVisibleRows(table).filter((row) => !row.hasAttribute('data-uzu-grid-disabled') && row.getAttribute('aria-disabled') !== 'true');
  }

  function getDataGridRowValue(row) {
    return row.dataset.uzuGridRow || row.dataset.value || '';
  }

  function getDataGridRowSelection(row) {
    return row.querySelector('[data-uzu-grid-selection], input[type="checkbox"]');
  }

  function getDataGridSortText(row, columnIndex) {
    const cell = row.cells[columnIndex];
    if (!cell) return '';
    return cell.dataset.uzuGridSortValue ?? cell.getAttribute('data-sort-value') ?? cell.textContent.trim();
  }

  function syncDataGridRowSelected(grid, table, row, selected, emit = true) {
    const nextSelected = Boolean(selected);
    const selection = getDataGridRowSelection(row);
    row.classList.toggle('is-selected', nextSelected);
    row.setAttribute('aria-selected', nextSelected ? 'true' : 'false');
    if (selection && 'checked' in selection) selection.checked = nextSelected;
    if (emit) {
      grid.dispatchEvent(new CustomEvent('uzu-data-grid-select', {
        bubbles: true,
        detail: { grid, table, row, selected: nextSelected, value: getDataGridRowValue(row) }
      }));
    }
  }

  function getDataGridTable(gridOrTable) {
    return gridOrTable?.matches?.('table') ? gridOrTable : gridOrTable?.querySelector?.('table');
  }

  function getDataGridRoot(table) {
    return table?.closest?.('[data-uzu-data-grid]') || table;
  }

  function setDataGridRowSelected(row, selected, emit = true) {
    const table = row?.closest?.('table');
    const grid = getDataGridRoot(table);
    if (!table || !grid || row.hasAttribute('data-uzu-grid-empty')) return;
    syncDataGridRowSelected(grid, table, row, selected, emit);
    syncDataGridSelectAll(grid, table);
  }

  function syncDataGridSelectAll(grid, table) {
    const controls = queryAll(table, '[data-uzu-grid-select-all]');
    if (!controls.length) return;
    const rows = getDataGridSelectableRows(table);
    const selectedRows = rows.filter((row) => row.getAttribute('aria-selected') === 'true' || row.classList.contains('is-selected'));
    controls.forEach((control) => {
      if ('checked' in control) control.checked = rows.length > 0 && selectedRows.length === rows.length;
      if ('indeterminate' in control) control.indeterminate = selectedRows.length > 0 && selectedRows.length < rows.length;
      control.setAttribute('aria-checked', selectedRows.length > 0 && selectedRows.length === rows.length ? 'true' : selectedRows.length > 0 ? 'mixed' : 'false');
    });
  }

  function updateDataGridEmptyState(table) {
    const rows = getDataGridVisibleRows(table);
    queryAll(table, '[data-uzu-grid-empty]').forEach((row) => {
      row.hidden = rows.length > 0;
    });
  }

  function refreshDataGrid(gridOrTable) {
    const table = getDataGridTable(gridOrTable);
    if (!table) return;
    const grid = getDataGridRoot(table);
    updateDataGridEmptyState(table);
    syncDataGridSelectAll(grid, table);
  }

  function initDataGrids(root = document) {
    queryAll(root, '[data-uzu-data-grid]').forEach((grid) => {
      const table = getDataGridTable(grid);
      if (!table) return;
      const allRows = () => getDataGridRows(table);
      const rows = () => getDataGridVisibleRows(table);
      allRows().forEach((row, index) => {
        row.dataset.uzuGridRow = row.dataset.uzuGridRow || String(index + 1);
        row.setAttribute('tabindex', row.getAttribute('tabindex') || '0');
        row.setAttribute('aria-selected', row.classList.contains('is-selected') || row.getAttribute('aria-selected') === 'true' ? 'true' : 'false');
        const selection = getDataGridRowSelection(row);
        if (selection && 'checked' in selection) selection.checked = row.getAttribute('aria-selected') === 'true';
      });
      updateDataGridEmptyState(table);
      syncDataGridSelectAll(grid, table);
      if (!markInitialized(grid, 'DataGrid')) return;
      queryAll(table, '[data-uzu-grid-sort]').forEach((header) => {
        header.setAttribute('tabindex', header.getAttribute('tabindex') || '0');
        header.setAttribute('aria-sort', header.getAttribute('aria-sort') || 'none');
        const sort = () => {
          const body = table.tBodies[0];
          if (!body) return;
          const headers = [...header.parentElement.children];
          const columnIndex = headers.indexOf(header);
          const current = header.getAttribute('aria-sort') === 'ascending' ? 'descending' : 'ascending';
          queryAll(table, '[data-uzu-grid-sort]').forEach((item) => item.setAttribute('aria-sort', item === header ? current : 'none'));
          const direction = current === 'ascending' ? 1 : -1;
          const sorted = [...body.rows].sort((a, b) => {
            if (a.hasAttribute('data-uzu-grid-empty')) return 1;
            if (b.hasAttribute('data-uzu-grid-empty')) return -1;
            if (a.hidden && !b.hidden) return 1;
            if (!a.hidden && b.hidden) return -1;
            const aText = getDataGridSortText(a, columnIndex);
            const bText = getDataGridSortText(b, columnIndex);
            const aNumber = Number(aText.replace(/[^\d.-]/g, ''));
            const bNumber = Number(bText.replace(/[^\d.-]/g, ''));
            if (Number.isFinite(aNumber) && Number.isFinite(bNumber) && /\d/.test(aText + bText)) {
              return (aNumber - bNumber) * direction;
            }
            return aText.localeCompare(bText, undefined, { numeric: true }) * direction;
          });
          sorted.forEach((row) => body.append(row));
          grid.dispatchEvent(new CustomEvent('uzu-data-grid-sort', {
            bubbles: true,
            detail: { grid, table, header, columnIndex, direction: current }
          }));
        };
        header.addEventListener('click', sort);
        header.addEventListener('keydown', (event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            sort();
          }
        });
      });
      queryAll(table, '[data-uzu-grid-select-all]').forEach((control) => {
        control.addEventListener('change', () => {
          const nextSelected = Boolean(control.checked);
          getDataGridSelectableRows(table).forEach((row) => syncDataGridRowSelected(grid, table, row, nextSelected));
          syncDataGridSelectAll(grid, table);
          grid.dispatchEvent(new CustomEvent('uzu-data-grid-select-all', {
            bubbles: true,
            detail: {
              grid,
              table,
              selected: nextSelected,
              rows: getDataGridSelectableRows(table).filter((row) => row.getAttribute('aria-selected') === 'true')
            }
          }));
        });
      });
      grid.addEventListener('click', (event) => {
        const row = event.target instanceof Element ? event.target.closest('[data-uzu-grid-row], tbody tr') : null;
        if (!row || !table.contains(row) || row.hasAttribute('data-uzu-grid-empty') || row.hasAttribute('data-uzu-grid-disabled') || row.getAttribute('aria-disabled') === 'true') return;
        const selection = event.target instanceof Element ? event.target.closest('[data-uzu-grid-selection], input[type="checkbox"]') : null;
        if (!selection && event.target.closest('a, button, input, select, textarea')) return;
        const multi = grid.dataset.uzuDataGridMulti === 'true';
        if (!multi) rows().forEach((item) => {
          if (item !== row) {
            syncDataGridRowSelected(grid, table, item, false, false);
          }
        });
        const selected = selection && 'checked' in selection
          ? Boolean(selection.checked)
          : !(row.classList.contains('is-selected') || row.getAttribute('aria-selected') === 'true');
        syncDataGridRowSelected(grid, table, row, selected);
        syncDataGridSelectAll(grid, table);
      });
      grid.addEventListener('keydown', (event) => {
        const row = event.target instanceof Element ? event.target.closest('[data-uzu-grid-row], tbody tr') : null;
        const list = rows();
        if (!row || !list.length) return;
        const index = list.indexOf(row);
        if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
          event.preventDefault();
          list[(index + (event.key === 'ArrowDown' ? 1 : -1) + list.length) % list.length].focus();
        } else if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          row.click();
        }
      });
    });
  }

/* ui/js/heatmaps.js */
const heatmapState = new WeakMap();
  const heatmapCellSelector = '.uzu-heatmap-cell, [data-uzu-heatmap-date]';
  const heatmapRootSelector = '[data-uzu-heatmap]';

  function clampHeatmapNumber(value, min, max) {
    const number = Number(value);
    if (!Number.isFinite(number)) return min;
    return Math.min(max, Math.max(min, number));
  }

  function parseHeatmapDate(value) {
    const match = String(value || '').trim().match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (!match) return null;
    const year = Number(match[1]);
    const month = Number(match[2]);
    const day = Number(match[3]);
    const date = new Date(year, month - 1, day);
    if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) return null;
    return date;
  }

  function formatHeatmapDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  function getHeatmapDateOrdinal(date) {
    return Math.floor(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 86400000);
  }

  function addHeatmapDays(date, amount) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate() + amount);
  }

  function getHeatmapLanguage(heatmap) {
    const root = typeof getClosestLanguageRoot === 'function' ? getClosestLanguageRoot(heatmap) : document.documentElement;
    return normalizeLanguage(root.getAttribute('data-language') || root.getAttribute('data-uzu-lang') || '', 'en');
  }

  function getHeatmapLabels(data, language) {
    const compact = Array.isArray(data?.l) ? data.l : [];
    const fallback = language === 'zh'
      ? ['\u5c11', '\u591a', '\u8fd9\u4e00\u5929\u6ca1\u6709\u4e8b\u4ef6']
      : ['Less', 'More', 'No events for this day'];
    return [
      String(compact[0] || fallback[0]),
      String(compact[1] || fallback[1]),
      String(compact[2] || fallback[2])
    ];
  }

  function getHeatmapWeekdayLabels(language, weekStart) {
    const labels = language === 'zh'
      ? ['\u65e5', '\u4e00', '\u4e8c', '\u4e09', '\u56db', '\u4e94', '\u516d']
      : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return Array.from({ length: 7 }, (_, index) => labels[(weekStart + index) % 7]);
  }

  function getHeatmapMonthLabel(date, language) {
    if (language === 'zh') return `${date.getMonth() + 1}\u6708`;
    return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][date.getMonth()];
  }

  function normalizeHeatmapEventTuple(tuple) {
    if (Array.isArray(tuple)) {
      return {
        title: String(tuple[0] || ''),
        meta: tuple[1] == null ? '' : String(tuple[1]),
        description: tuple[2] == null ? '' : String(tuple[2])
      };
    }
    if (tuple && typeof tuple === 'object') {
      return {
        title: String(tuple.title || ''),
        meta: tuple.meta == null ? '' : String(tuple.meta),
        description: tuple.description == null ? '' : String(tuple.description)
      };
    }
    return { title: String(tuple || ''), meta: '', description: '' };
  }

  function normalizeHeatmapEvents(data) {
    const events = new Map();
    (Array.isArray(data?.ev) ? data.ev : []).forEach((entry) => {
      if (!Array.isArray(entry)) return;
      const offset = Math.trunc(Number(entry[0]));
      if (!Number.isFinite(offset) || offset < 0) return;
      const list = Array.isArray(entry[1]) ? entry[1].map(normalizeHeatmapEventTuple).filter((item) => item.title) : [];
      events.set(offset, list);
    });
    return events;
  }

  function normalizeHeatmapData(rawData, heatmap = null) {
    const data = typeof rawData === 'string' ? JSON.parse(rawData) : rawData;
    if (!data || typeof data !== 'object') return null;
    const start = parseHeatmapDate(data.s);
    const values = Array.isArray(data.v) ? data.v : [];
    if (!start || !values.length) return null;
    const language = heatmap ? getHeatmapLanguage(heatmap) : 'en';
    const labels = getHeatmapLabels(data, language);
    const weekStart = Math.trunc(clampHeatmapNumber(data.w ?? 1, 0, 6));
    const numericValues = values.map((entry) => Number(Array.isArray(entry) ? entry[0] : entry)).filter((value) => Number.isFinite(value));
    const maxValue = Math.max(0, ...numericValues);
    const leadingDays = (start.getDay() - weekStart + 7) % 7;
    const events = normalizeHeatmapEvents(data);
    const days = values.map((entry, offset) => {
      const explicit = Array.isArray(entry);
      const value = Number(explicit ? entry[0] : entry);
      const safeValue = Number.isFinite(value) ? value : 0;
      const level = explicit && entry.length > 1
        ? Math.trunc(clampHeatmapNumber(entry[1], 0, 4))
        : safeValue <= 0 || maxValue <= 0
          ? 0
          : Math.trunc(clampHeatmapNumber(Math.ceil((safeValue / maxValue) * 4), 1, 4));
      const date = addHeatmapDays(start, offset);
      return {
        date: formatHeatmapDate(date),
        offset,
        value: safeValue,
        level,
        week: Math.floor((leadingDays + offset) / 7) + 1,
        weekday: ((date.getDay() - weekStart + 7) % 7) + 1,
        events: events.get(offset) || []
      };
    });
    const columns = Math.max(1, Math.ceil((leadingDays + days.length) / 7));
    const selectedOffset = Math.trunc(clampHeatmapNumber(data.sel ?? days.length - 1, 0, days.length - 1));
    return {
      start: formatHeatmapDate(start),
      weekStart,
      labels,
      days,
      columns,
      selectedOffset,
      byDate: new Map(days.map((day) => [day.date, day])),
      byOffset: new Map(days.map((day) => [day.offset, day]))
    };
  }

  function resolveHeatmap(heatmapOrSelector) {
    if (heatmapOrSelector instanceof Element) return heatmapOrSelector;
    if (typeof heatmapOrSelector !== 'string' || !heatmapOrSelector.trim()) return null;
    try {
      return document.querySelector(heatmapOrSelector);
    } catch (_) {
      return null;
    }
  }

  function getHeatmapScoped(heatmap, selector) {
    return getScopedControls(heatmap, selector, heatmapRootSelector);
  }

  function getHeatmapCells(heatmap) {
    return getHeatmapScoped(heatmap, heatmapCellSelector);
  }

  function ensureHeatmapPart(heatmap, selector, className, attribute, parent = heatmap) {
    const existing = getHeatmapScoped(heatmap, selector)[0];
    if (existing) {
      className.split(/\s+/).filter(Boolean).forEach((item) => existing.classList.add(item));
      if (attribute) existing.setAttribute(attribute, '');
      return existing;
    }
    const element = document.createElement('div');
    element.className = className;
    if (attribute) element.setAttribute(attribute, '');
    parent.append(element);
    return element;
  }

  function ensureHeatmapViewportPart(heatmap, selector, className, attribute, viewport) {
    const element = ensureHeatmapPart(heatmap, selector, className, attribute, viewport);
    if (element.parentElement !== viewport) viewport.append(element);
    return element;
  }

  function ensureHeatmapViewport(heatmap) {
    return ensureHeatmapPart(heatmap, '.uzu-heatmap-viewport', 'uzu-heatmap-viewport');
  }

  function ensureHeatmapDetail(heatmap) {
    if ((heatmap.dataset.uzuHeatmapDetailRender || 'auto').toLowerCase() === 'manual') return null;
    return ensureHeatmapPart(heatmap, '[data-uzu-heatmap-detail], .uzu-heatmap-detail', 'uzu-heatmap-detail', 'data-uzu-heatmap-detail');
  }

  function ensureHeatmapLegend(heatmap, viewport) {
    const existing = getHeatmapScoped(heatmap, '.uzu-heatmap-legend')[0];
    if (existing) {
      existing.classList.add('uzu-heatmap-legend');
      if (existing.parentElement !== heatmap) viewport.after(existing);
      return existing;
    }
    const legend = document.createElement('ol');
    legend.className = 'uzu-heatmap-legend';
    viewport.after(legend);
    return legend;
  }

  function renderHeatmapWeekdays(container, labels) {
    const fragment = document.createDocumentFragment();
    labels.forEach((label) => {
      const span = document.createElement('span');
      span.textContent = label;
      fragment.append(span);
    });
    container.replaceChildren(fragment);
  }

  function renderHeatmapMonths(container, data, language) {
    const months = [];
    data.days.forEach((day) => {
      const date = parseHeatmapDate(day.date);
      if (!date) return;
      const previous = months[months.length - 1];
      if (!previous || previous.month !== date.getMonth() || previous.year !== date.getFullYear()) {
        months.push({
          month: date.getMonth(),
          year: date.getFullYear(),
          label: getHeatmapMonthLabel(date, language),
          startWeek: day.week,
          span: 1
        });
      } else {
        previous.span = Math.max(previous.span, day.week - previous.startWeek + 1);
      }
    });
    const fragment = document.createDocumentFragment();
    months.forEach((month, index) => {
      const next = months[index + 1];
      const span = document.createElement('span');
      span.textContent = month.label;
      span.style.gridColumn = `${month.startWeek} / span ${Math.max(1, (next ? next.startWeek : data.columns + 1) - month.startWeek)}`;
      fragment.append(span);
    });
    container.replaceChildren(fragment);
  }

  function getHeatmapCellLabel(day, language) {
    const eventCount = day.events.length;
    if (language === 'zh') return `${day.date}, \u6570\u503c ${day.value}, ${eventCount} \u4e2a\u4e8b\u4ef6`;
    return `${day.date}, value ${day.value}, ${eventCount} ${eventCount === 1 ? 'event' : 'events'}`;
  }

  function renderHeatmapGrid(grid, data, language) {
    const fragment = document.createDocumentFragment();
    data.days.forEach((day) => {
      const cell = document.createElement('button');
      cell.type = 'button';
      cell.className = 'uzu-heatmap-cell';
      cell.dataset.uzuHeatmapDate = day.date;
      cell.dataset.uzuHeatmapOffset = String(day.offset);
      cell.dataset.uzuHeatmapValue = String(day.value);
      cell.dataset.uzuHeatmapLevel = String(day.level);
      cell.style.setProperty('--uzu-heatmap-week', String(day.week));
      cell.style.setProperty('--uzu-heatmap-weekday', String(day.weekday));
      cell.style.gridColumn = String(day.week);
      cell.style.gridRow = String(day.weekday);
      cell.setAttribute('aria-label', getHeatmapCellLabel(day, language));
      cell.setAttribute('aria-pressed', 'false');
      cell.setAttribute('tabindex', '-1');
      fragment.append(cell);
    });
    grid.replaceChildren(fragment);
  }

  function renderHeatmapLegend(legend, labels) {
    const fragment = document.createDocumentFragment();
    const less = document.createElement('li');
    less.textContent = labels[0];
    fragment.append(less);
    for (let level = 0; level <= 4; level += 1) {
      const item = document.createElement('li');
      const swatch = document.createElement('span');
      swatch.className = 'uzu-heatmap-legend-cell';
      swatch.dataset.uzuHeatmapLevel = String(level);
      item.append(swatch);
      fragment.append(item);
    }
    const more = document.createElement('li');
    more.textContent = labels[1];
    fragment.append(more);
    legend.replaceChildren(fragment);
  }

  function renderHeatmap(heatmap, data) {
    heatmap.style.setProperty('--uzu-heatmap-columns', String(data.columns));
    const language = getHeatmapLanguage(heatmap);
    const viewport = ensureHeatmapViewport(heatmap);
    const months = ensureHeatmapViewportPart(heatmap, '.uzu-heatmap-months', 'uzu-heatmap-months', '', viewport);
    const weekdays = ensureHeatmapViewportPart(heatmap, '.uzu-heatmap-weekdays', 'uzu-heatmap-weekdays', '', viewport);
    const grid = ensureHeatmapViewportPart(heatmap, '[data-uzu-heatmap-grid], .uzu-heatmap-grid', 'uzu-heatmap-grid', 'data-uzu-heatmap-grid', viewport);
    const legend = ensureHeatmapLegend(heatmap, viewport);
    viewport.style.setProperty('--uzu-heatmap-columns', String(data.columns));
    months.style.setProperty('--uzu-heatmap-columns', String(data.columns));
    grid.style.setProperty('--uzu-heatmap-columns', String(data.columns));
    renderHeatmapMonths(months, data, language);
    renderHeatmapWeekdays(weekdays, getHeatmapWeekdayLabels(language, data.weekStart));
    renderHeatmapGrid(grid, data, language);
    renderHeatmapLegend(legend, data.labels);
  }

  function normalizeStaticHeatmap(heatmap) {
    const cells = getHeatmapCells(heatmap);
    if (!cells.length) return null;
    const datedCells = cells.map((cell, index) => {
      const date = parseHeatmapDate(cell.dataset.uzuHeatmapDate);
      return {
        cell,
        date,
        index,
        value: Number(cell.dataset.uzuHeatmapValue || 0),
        level: Math.trunc(clampHeatmapNumber(cell.dataset.uzuHeatmapLevel || 0, 0, 4))
      };
    }).filter((item) => item.date);
    if (!datedCells.length) return null;
    const firstOrdinal = Math.min(...datedCells.map((item) => getHeatmapDateOrdinal(item.date)));
    const days = datedCells.map((item) => {
      const offset = Number.isFinite(Number(item.cell.dataset.uzuHeatmapOffset))
        ? Math.trunc(Number(item.cell.dataset.uzuHeatmapOffset))
        : getHeatmapDateOrdinal(item.date) - firstOrdinal;
      return {
        cell: item.cell,
        date: formatHeatmapDate(item.date),
        offset,
        value: Number.isFinite(item.value) ? item.value : 0,
        level: item.level,
        events: []
      };
    }).sort((a, b) => a.offset - b.offset);
    return {
      start: days[0].date,
      weekStart: 1,
      labels: getHeatmapLabels({}, getHeatmapLanguage(heatmap)),
      days,
      columns: 1,
      selectedOffset: days.find((day) => day.cell.classList.contains('is-selected') || day.cell.getAttribute('aria-pressed') === 'true')?.offset ?? days[0].offset,
      byDate: new Map(days.map((day) => [day.date, day])),
      byOffset: new Map(days.map((day) => [day.offset, day]))
    };
  }

  function syncStaticHeatmapCells(heatmap, data) {
    data.days.forEach((day) => {
      const cell = day.cell;
      cell.classList.add('uzu-heatmap-cell');
      if (cell instanceof HTMLButtonElement && !cell.getAttribute('type')) cell.type = 'button';
      cell.dataset.uzuHeatmapDate = day.date;
      cell.dataset.uzuHeatmapOffset = String(day.offset);
      cell.dataset.uzuHeatmapValue = String(day.value);
      cell.dataset.uzuHeatmapLevel = String(day.level);
      cell.setAttribute('aria-pressed', cell.classList.contains('is-selected') || cell.getAttribute('aria-pressed') === 'true' ? 'true' : 'false');
      cell.setAttribute('tabindex', cell.getAttribute('aria-pressed') === 'true' ? '0' : '-1');
    });
  }

  function getHeatmapDayByInput(data, dateOrOffset) {
    if (!data) return null;
    if (typeof dateOrOffset === 'number') return data.byOffset.get(Math.trunc(dateOrOffset)) || null;
    const value = String(dateOrOffset || '').trim();
    if (!value) return null;
    if (/^-?\d+$/.test(value)) return data.byOffset.get(Math.trunc(Number(value))) || null;
    return data.byDate.get(value) || null;
  }

  function getHeatmapCellForDay(heatmap, day) {
    if (day?.cell) return day.cell;
    return getHeatmapCells(heatmap).find((cell) => cell.dataset.uzuHeatmapDate === day?.date || cell.dataset.uzuHeatmapOffset === String(day?.offset)) || null;
  }

  function focusHeatmapOffset(heatmap, offset) {
    const data = heatmapState.get(heatmap);
    const day = data?.byOffset.get(offset);
    const cell = day ? getHeatmapCellForDay(heatmap, day) : null;
    if (!cell || isControlDisabled(cell)) return null;
    getHeatmapCells(heatmap).forEach((item) => item.setAttribute('tabindex', item === cell ? '0' : '-1'));
    cell.focus();
    return cell;
  }

  function renderHeatmapDetail(heatmap, day) {
    if ((heatmap.dataset.uzuHeatmapDetailRender || 'auto').toLowerCase() === 'manual') return;
    const data = heatmapState.get(heatmap);
    const detail = ensureHeatmapDetail(heatmap);
    if (!detail || !day) return;
    const language = getHeatmapLanguage(heatmap);
    const title = document.createElement('p');
    title.className = 'uzu-heatmap-detail-title';
    title.textContent = language === 'zh' ? `${day.date} \u7684\u4e8b\u4ef6` : `Events on ${day.date}`;
    const events = day.events || [];
    if (!events.length) {
      const empty = document.createElement('p');
      empty.className = 'uzu-heatmap-detail-empty';
      empty.textContent = data?.labels?.[2] || getHeatmapLabels({}, language)[2];
      detail.replaceChildren(title, empty);
      return;
    }
    const list = document.createElement('ul');
    list.className = 'uzu-heatmap-detail-list';
    events.forEach((event) => {
      const item = document.createElement('li');
      item.className = 'uzu-heatmap-event';
      const eventTitle = document.createElement('span');
      eventTitle.className = 'uzu-heatmap-event-title';
      eventTitle.textContent = event.title;
      item.append(eventTitle);
      if (event.meta) {
        const meta = document.createElement('span');
        meta.className = 'uzu-heatmap-event-meta';
        meta.textContent = event.meta;
        item.append(meta);
      }
      if (event.description) {
        const description = document.createElement('p');
        description.className = 'uzu-heatmap-event-description';
        description.textContent = event.description;
        item.append(description);
      }
      list.append(item);
    });
    detail.replaceChildren(title, list);
  }

  function emitHeatmapSelect(heatmap, cell, day) {
    const detail = {
      heatmap,
      cell,
      date: day.date,
      offset: day.offset,
      value: day.value,
      level: day.level,
      events: day.events || []
    };
    heatmap.dispatchEvent(new CustomEvent('uzu-heatmap-select', { bubbles: true, detail }));
    heatmap.dispatchEvent(new Event('change', { bubbles: true }));
  }

  function selectHeatmapDate(heatmapOrSelector, dateOrOffset, emit = true) {
    const heatmap = resolveHeatmap(heatmapOrSelector);
    if (!heatmap) return null;
    const data = heatmapState.get(heatmap);
    const day = getHeatmapDayByInput(data, dateOrOffset);
    const cell = day ? getHeatmapCellForDay(heatmap, day) : null;
    if (!day || !cell || isControlDisabled(cell)) return null;
    getHeatmapCells(heatmap).forEach((item) => {
      const selected = item === cell;
      item.classList.toggle('is-selected', selected);
      item.setAttribute('aria-pressed', selected ? 'true' : 'false');
      item.setAttribute('tabindex', selected ? '0' : '-1');
    });
    heatmap.dataset.uzuHeatmapSelectedDate = day.date;
    renderHeatmapDetail(heatmap, day);
    if (emit) emitHeatmapSelect(heatmap, cell, day);
    return cell;
  }

  function setHeatmapData(heatmapOrSelector, rawData, emit = true, options = {}) {
    const heatmap = resolveHeatmap(heatmapOrSelector);
    if (!heatmap) return null;
    let data = null;
    try {
      data = normalizeHeatmapData(rawData, heatmap);
    } catch (_) {
      data = null;
    }
    if (!data) return null;
    heatmapState.set(heatmap, data);
    renderHeatmap(heatmap, data);
    const selected = options.preserveSelection && heatmap.dataset.uzuHeatmapSelectedDate && data.byDate.has(heatmap.dataset.uzuHeatmapSelectedDate)
      ? heatmap.dataset.uzuHeatmapSelectedDate
      : data.selectedOffset;
    selectHeatmapDate(heatmap, selected, emit);
    return heatmap;
  }

  function getHeatmapDataScript(heatmap) {
    return getHeatmapScoped(heatmap, '[data-uzu-heatmap-data]')[0] || null;
  }

  function refreshHeatmap(heatmapOrSelector) {
    const heatmap = resolveHeatmap(heatmapOrSelector);
    if (!heatmap) return null;
    const script = getHeatmapDataScript(heatmap);
    if (script) return setHeatmapData(heatmap, script.textContent || '{}', false, { preserveSelection: true });
    const data = normalizeStaticHeatmap(heatmap);
    if (!data) return null;
    heatmapState.set(heatmap, data);
    syncStaticHeatmapCells(heatmap, data);
    selectHeatmapDate(heatmap, heatmap.dataset.uzuHeatmapSelectedDate || data.selectedOffset, false);
    return heatmap;
  }

  function refreshHeatmaps(root = document) {
    queryAll(root, heatmapRootSelector).forEach((heatmap) => {
      refreshHeatmap(heatmap);
    });
  }

  function handleHeatmapKeydown(event, heatmap, cell) {
    const data = heatmapState.get(heatmap);
    if (!data) return;
    const current = getHeatmapDayByInput(data, cell.dataset.uzuHeatmapOffset || cell.dataset.uzuHeatmapDate);
    if (!current) return;
    const direction = document.dir === 'rtl' ? -1 : 1;
    let nextOffset = null;
    if (event.key === 'ArrowRight') nextOffset = current.offset + direction;
    else if (event.key === 'ArrowLeft') nextOffset = current.offset - direction;
    else if (event.key === 'ArrowDown') nextOffset = current.offset + 7;
    else if (event.key === 'ArrowUp') nextOffset = current.offset - 7;
    else if (event.key === 'Home') nextOffset = data.days[0]?.offset;
    else if (event.key === 'End') nextOffset = data.days.at(-1)?.offset;
    else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      selectHeatmapDate(heatmap, current.offset);
      return;
    }
    if (nextOffset == null) return;
    event.preventDefault();
    focusHeatmapOffset(heatmap, Math.trunc(clampHeatmapNumber(nextOffset, data.days[0].offset, data.days.at(-1).offset)));
  }

  function initHeatmaps(root = document) {
    queryAll(root, heatmapRootSelector).forEach((heatmap) => {
      refreshHeatmap(heatmap);
      if (!markInitialized(heatmap, 'Heatmap')) return;
      heatmap.addEventListener('click', (event) => {
        const cell = getScopedEventControl(event, heatmapCellSelector, heatmap, heatmapRootSelector);
        if (!cell || isControlDisabled(cell)) return;
        event.preventDefault();
        selectHeatmapDate(heatmap, cell.dataset.uzuHeatmapOffset || cell.dataset.uzuHeatmapDate);
        cell.focus();
      });
      heatmap.addEventListener('keydown', (event) => {
        const cell = getScopedEventControl(event, heatmapCellSelector, heatmap, heatmapRootSelector);
        if (!cell || isControlDisabled(cell)) return;
        handleHeatmapKeydown(event, heatmap, cell);
      });
    });
  }

/* ui/js/galleries.js */
const galleryRootSelector = '[data-uzu-gallery]';
  const galleryItemSelector = '.uzu-gallery-item';
  const imageViewerSelector = '[data-uzu-image-viewer]';
  const galleryImageExtensions = /\.(?:avif|gif|jpe?g|png|svg|webp)(?:[?#].*)?$/i;
  const galleryState = new WeakMap();
  const galleryCleanups = new WeakMap();
  const galleryAutoViewers = new WeakMap();
  const imageViewerState = new WeakMap();
  const imageViewerCleanups = new WeakMap();

  function resolveElement(target, selector = '') {
    if (target instanceof Element) return target;
    if (typeof target !== 'string' || !target.trim()) return null;
    try {
      const element = document.querySelector(target);
      return selector && element && !element.matches(selector) ? element.querySelector(selector) : element;
    } catch (_) {
      return null;
    }
  }

  function getGalleryState(gallery) {
    const current = galleryState.get(gallery);
    if (current) return current;
    const state = { items: [], source: 'static', requestId: 0, destroyed: false };
    galleryState.set(gallery, state);
    return state;
  }

  function getGalleryScoped(gallery, selector) {
    return getScopedControls(gallery, selector, galleryRootSelector);
  }

  function clampGalleryNumber(value, fallback, min = 0, max = Number.POSITIVE_INFINITY) {
    const number = Number.parseFloat(value);
    if (!Number.isFinite(number)) return fallback;
    return Math.min(max, Math.max(min, number));
  }

  function getGalleryGap(gallery) {
    const gap = clampGalleryNumber(gallery.dataset.uzuGalleryGap, 12, 0, 80);
    gallery.style.setProperty('--uzu-gallery-gap', `${gap}px`);
    return gap;
  }

  function getGalleryRowHeight(gallery) {
    const target = clampGalleryNumber(gallery.dataset.uzuGalleryRowHeight, 260, 80, 720);
    const narrow = gallery.clientWidth && gallery.clientWidth < 560 ? Math.min(target, 180) : target;
    gallery.style.setProperty('--uzu-gallery-row-height', `${narrow}px`);
    return narrow;
  }

  function fileNameToCaption(src) {
    try {
      const url = new URL(src, window.location.href);
      const name = decodeURIComponent(url.pathname.split('/').filter(Boolean).at(-1) || '');
      return name.replace(/\.[^.]+$/, '').replace(/[-_]+/g, ' ').trim() || src;
    } catch (_) {
      return String(src || '').split('/').filter(Boolean).at(-1)?.replace(/\.[^.]+$/, '').replace(/[-_]+/g, ' ').trim() || String(src || '');
    }
  }

  function normalizeGalleryItem(raw, index = 0, gallery = null) {
    if (!raw || typeof raw !== 'object') return null;
    const src = String(raw.src || raw.href || '').trim();
    if (!src) return null;
    const width = clampGalleryNumber(raw.width, 0, 0);
    const height = clampGalleryNumber(raw.height, 0, 0);
    const caption = raw.caption == null || raw.caption === '' ? fileNameToCaption(src) : String(raw.caption);
    const alt = raw.alt == null ? '' : String(raw.alt);
    const rawDownload = raw.download;
    const hasDownload = Object.prototype.hasOwnProperty.call(raw, 'download');
    const galleryAllowsDownload = !gallery || (gallery.dataset.uzuGalleryDownload || 'true').trim().toLowerCase() !== 'false';
    const download = !galleryAllowsDownload || rawDownload === false || rawDownload === 'false' || (hasDownload && rawDownload === '')
      ? ''
      : String(hasDownload && rawDownload != null ? rawDownload : src);
    return {
      src,
      alt,
      caption,
      width,
      height,
      download,
      index,
      element: raw.element || null
    };
  }

  function normalizeGalleryItems(rawItems, gallery = null) {
    const input = Array.isArray(rawItems) ? rawItems : rawItems?.items;
    if (!Array.isArray(input)) return [];
    return input.map((item, index) => normalizeGalleryItem(item, index, gallery)).filter(Boolean);
  }

  function parseGalleryJson(text) {
    const parsed = JSON.parse(String(text || '[]'));
    return Array.isArray(parsed) ? parsed : parsed.items || [];
  }

  function getGalleryDataSourceElement(source) {
    if (!source || !source.startsWith('#')) return null;
    try {
      return document.querySelector(source);
    } catch (_) {
      return null;
    }
  }

  function parseDirectoryGalleryItems(html, source) {
    const doc = new DOMParser().parseFromString(String(html || ''), 'text/html');
    const base = new URL(source, window.location.href);
    const seen = new Set();
    return [...doc.querySelectorAll('a[href]')].flatMap((link) => {
      const absolute = new URL(link.getAttribute('href') || '', base).href;
      if (!galleryImageExtensions.test(absolute) || seen.has(absolute)) return [];
      seen.add(absolute);
      const label = link.textContent.trim();
      return [{
        src: absolute,
        alt: label || '',
        caption: label || fileNameToCaption(absolute),
        download: absolute
      }];
    });
  }

  function clearGalleryMessages(gallery) {
    getGalleryScoped(gallery, '.uzu-gallery-empty, .uzu-gallery-error').forEach((message) => message.remove());
  }

  function renderGalleryMessage(gallery, className, message) {
    clearGalleryMessages(gallery);
    const element = document.createElement('div');
    element.className = className;
    element.textContent = message;
    gallery.append(element);
  }

  function setGalleryState(gallery, state, message = '') {
    gallery.dataset.uzuGalleryState = state;
    gallery.setAttribute('aria-busy', state === 'loading' ? 'true' : 'false');
    if (state === 'empty') renderGalleryMessage(gallery, 'uzu-gallery-empty', message || 'No images.');
    else if (state === 'error') renderGalleryMessage(gallery, 'uzu-gallery-error', message || 'Images could not be loaded.');
    else clearGalleryMessages(gallery);
  }

  function emitGalleryLoad(gallery, items, source) {
    gallery.dispatchEvent(new CustomEvent('uzu-gallery-load', {
      bubbles: true,
      detail: { gallery, items, source }
    }));
  }

  function emitGalleryError(gallery, source, error) {
    gallery.dispatchEvent(new CustomEvent('uzu-gallery-error', {
      bubbles: true,
      detail: { gallery, source, error }
    }));
  }

  function syncGalleryImageRatio(element, item) {
    const width = Number(item.width) || 0;
    const height = Number(item.height) || 0;
    if (width > 0 && height > 0) element.style.setProperty('--uzu-gallery-item-ratio', `${width} / ${height}`);
  }

  function updateGalleryItemNaturalSize(gallery, item, img) {
    if (!img || !img.naturalWidth || !img.naturalHeight) return;
    if (!item.width) item.width = img.naturalWidth;
    if (!item.height) item.height = img.naturalHeight;
    syncGalleryImageRatio(item.element, item);
    layoutGallery(gallery);
  }

  function getGalleryViewerMode(gallery) {
    return (gallery.dataset.uzuGalleryViewer || 'auto').trim().toLowerCase();
  }

  function createGalleryItem(gallery, item) {
    const element = getGalleryViewerMode(gallery) === 'none' ? document.createElement('a') : document.createElement('button');
    if (element.tagName === 'BUTTON') element.type = 'button';
    if (element.tagName === 'A') element.href = item.src;
    element.className = 'uzu-gallery-item';
    element.dataset.uzuGalleryIndex = String(item.index);
    const img = document.createElement('img');
    img.className = 'uzu-gallery-image';
    img.src = item.src;
    img.alt = item.alt;
    img.loading = 'lazy';
    img.decoding = 'async';
    img.draggable = false;
    element.append(img);
    if ((gallery.dataset.uzuGalleryCaption || 'auto') !== 'none') {
      const caption = document.createElement('span');
      caption.className = 'uzu-gallery-caption';
      caption.textContent = item.caption;
      element.append(caption);
    }
    item.element = element;
    syncGalleryImageRatio(element, item);
    img.addEventListener('load', () => updateGalleryItemNaturalSize(gallery, item, img), { once: true });
    return element;
  }

  function renderGalleryItems(gallery, items) {
    getGalleryScoped(gallery, galleryItemSelector).forEach((item) => item.remove());
    clearGalleryMessages(gallery);
    const fragment = document.createDocumentFragment();
    items.forEach((item, index) => {
      item.index = index;
      fragment.append(createGalleryItem(gallery, item));
    });
    gallery.append(fragment);
  }

  function normalizeStaticGallery(gallery) {
    return getGalleryScoped(gallery, galleryItemSelector).map((element, index) => {
      const img = element.querySelector('img, .uzu-gallery-image');
      if (img) img.classList.add('uzu-gallery-image');
      const src = element.getAttribute('href') || element.dataset.src || img?.currentSrc || img?.getAttribute('src') || '';
      const captionElement = element.querySelector('.uzu-gallery-caption');
      const raw = {
        src,
        alt: img?.getAttribute('alt') || '',
        caption: captionElement?.textContent.trim() || element.dataset.caption || '',
        width: element.dataset.width || img?.getAttribute('width') || img?.naturalWidth || 0,
        height: element.dataset.height || img?.getAttribute('height') || img?.naturalHeight || 0,
        download: element.dataset.download || element.getAttribute('download') || src,
        element
      };
      const item = normalizeGalleryItem(raw, index, gallery);
      if (!item) return null;
      element.classList.add('uzu-gallery-item');
      element.dataset.uzuGalleryIndex = String(index);
      syncGalleryImageRatio(element, item);
      if (!captionElement && item.caption && (gallery.dataset.uzuGalleryCaption || 'auto') !== 'none') {
        const caption = document.createElement('span');
        caption.className = 'uzu-gallery-caption';
        caption.textContent = item.caption;
        element.append(caption);
      }
      if (img && (!item.width || !item.height)) {
        if (img.complete) updateGalleryItemNaturalSize(gallery, item, img);
        else img.addEventListener('load', () => updateGalleryItemNaturalSize(gallery, item, img), { once: true });
      }
      return item;
    }).filter(Boolean);
  }

  function layoutGallery(gallery) {
    const state = galleryState.get(gallery);
    if (!state) return;
    const layout = (gallery.dataset.uzuGalleryLayout || 'justified').toLowerCase();
    const gap = getGalleryGap(gallery);
    const items = state.items.filter((item) => item.element);
    if (layout !== 'justified' || !items.length) {
      gallery.classList.remove('is-justified');
      items.forEach((item) => {
        item.element.style.removeProperty('--uzu-gallery-item-width');
        item.element.style.removeProperty('--uzu-gallery-item-height');
      });
      return;
    }
    const available = Math.max(0, gallery.clientWidth);
    if (!available) return;
    const targetHeight = getGalleryRowHeight(gallery);
    gallery.classList.add('is-justified');
    const rows = [];
    let row = [];
    let ratioSum = 0;
    const flush = (fill = true) => {
      if (!row.length) return;
      const gaps = Math.max(0, row.length - 1) * gap;
      const availableWidth = Math.max(80, available - gaps);
      const filledHeight = availableWidth / Math.max(0.01, ratioSum);
      const height = fill ? Math.min(targetHeight * 1.45, Math.max(96, filledHeight)) : Math.min(targetHeight, Math.max(96, filledHeight));
      rows.push({ items: row, height });
      row = [];
      ratioSum = 0;
    };
    items.forEach((item) => {
      const ratio = item.width > 0 && item.height > 0 ? item.width / item.height : 4 / 3;
      row.push({ item, ratio });
      ratioSum += ratio;
      const projected = (available - Math.max(0, row.length - 1) * gap) / Math.max(0.01, ratioSum);
      if (projected <= targetHeight || row.length >= 6) flush(true);
    });
    flush(false);
    rows.forEach(({ items: rowItems, height }) => {
      rowItems.forEach(({ item, ratio }) => {
        item.element.style.setProperty('--uzu-gallery-item-width', `${Math.max(80, Math.round(ratio * height))}px`);
        item.element.style.setProperty('--uzu-gallery-item-height', `${Math.round(height)}px`);
      });
    });
  }

  function setGalleryItems(galleryOrSelector, rawItems, emit = true) {
    const gallery = resolveElement(galleryOrSelector, galleryRootSelector);
    if (!gallery) return null;
    const items = normalizeGalleryItems(rawItems, gallery);
    const state = getGalleryState(gallery);
    state.destroyed = false;
    state.requestId += 1;
    state.items = items;
    state.source = 'api';
    renderGalleryItems(gallery, items);
    setGalleryState(gallery, items.length ? 'ready' : 'empty');
    layoutGallery(gallery);
    if (emit) emitGalleryLoad(gallery, items, 'api');
    return gallery;
  }

  async function loadGalleryFromUrl(gallery, source, requestId) {
    const state = getGalleryState(gallery);
    try {
      const response = await fetch(source, { credentials: 'same-origin' });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      if (state.destroyed || state.requestId !== requestId || galleryState.get(gallery) !== state) return;
      const contentType = response.headers.get('content-type') || '';
      const text = await response.text();
      if (state.destroyed || state.requestId !== requestId || galleryState.get(gallery) !== state) return;
      const rawItems = /\.json(?:[?#].*)?$/i.test(source) || /\bjson\b/i.test(contentType)
        ? parseGalleryJson(text)
        : parseDirectoryGalleryItems(text, source);
      const items = normalizeGalleryItems(rawItems, gallery);
      state.items = items;
      state.source = source;
      renderGalleryItems(gallery, items);
      setGalleryState(gallery, items.length ? 'ready' : 'empty');
      layoutGallery(gallery);
      emitGalleryLoad(gallery, items, source);
    } catch (error) {
      if (state.destroyed || state.requestId !== requestId || galleryState.get(gallery) !== state) return;
      state.items = [];
      setGalleryState(gallery, 'error');
      emitGalleryError(gallery, source, error);
    }
  }

  function refreshGallery(galleryOrSelector) {
    const gallery = resolveElement(galleryOrSelector, galleryRootSelector);
    if (!gallery) return null;
    const state = getGalleryState(gallery);
    state.destroyed = false;
    state.requestId += 1;
    const requestId = state.requestId;
    const source = (gallery.dataset.uzuGallerySource || '').trim();
    getGalleryGap(gallery);
    getGalleryRowHeight(gallery);
    if (!source) {
      const items = normalizeStaticGallery(gallery);
      state.items = items;
      state.source = 'static';
      setGalleryState(gallery, items.length ? 'ready' : 'empty');
      layoutGallery(gallery);
      return gallery;
    }
    setGalleryState(gallery, 'loading');
    const sourceElement = getGalleryDataSourceElement(source);
    if (sourceElement) {
      try {
        const items = normalizeGalleryItems(parseGalleryJson(sourceElement.textContent || '[]'), gallery);
        state.items = items;
        state.source = source;
        renderGalleryItems(gallery, items);
        setGalleryState(gallery, items.length ? 'ready' : 'empty');
        layoutGallery(gallery);
        emitGalleryLoad(gallery, items, source);
      } catch (error) {
        state.items = [];
        setGalleryState(gallery, 'error');
        emitGalleryError(gallery, source, error);
      }
      return gallery;
    }
    loadGalleryFromUrl(gallery, source, requestId);
    return gallery;
  }

  function getGalleryItemForElement(gallery, element) {
    const state = galleryState.get(gallery);
    const index = Number.parseInt(element.dataset.uzuGalleryIndex || '', 10);
    return state?.items.find((item) => item.element === element || item.index === index) || normalizeStaticGallery(gallery).find((item) => item.element === element) || null;
  }

  function resolveGalleryViewer(gallery) {
    const mode = getGalleryViewerMode(gallery);
    if (mode === 'none') return null;
    if (mode && mode !== 'auto') {
      const target = resolveElement(mode);
      if (!target) return null;
      return target.matches(imageViewerSelector) ? target : target.querySelector(imageViewerSelector);
    }
    return ensureAutoImageViewer(gallery);
  }

  function emitGallerySelect(gallery, item, trigger, viewer) {
    gallery.dispatchEvent(new CustomEvent('uzu-gallery-select', {
      bubbles: true,
      detail: { gallery, item, index: item.index, trigger, viewer }
    }));
  }

  function selectGalleryItem(gallery, element, event = null) {
    const item = getGalleryItemForElement(gallery, element);
    if (!item) return;
    const viewer = resolveGalleryViewer(gallery);
    if (!viewer) return;
    if (event) event.preventDefault();
    openImageViewer(viewer, item, element);
    emitGallerySelect(gallery, item, element, viewer);
  }

  function addCleanup(map, root, cleanup) {
    const cleanups = map.get(root) || [];
    cleanups.push(cleanup);
    map.set(root, cleanups);
  }

  function listenWithCleanup(map, root, target, type, listener, options) {
    target.addEventListener(type, listener, options);
    addCleanup(map, root, () => target.removeEventListener(type, listener, options));
  }

  function observeGalleryResize(gallery) {
    if (typeof ResizeObserver !== 'undefined') {
      const observer = new ResizeObserver(() => window.requestAnimationFrame(() => layoutGallery(gallery)));
      observer.observe(gallery);
      addCleanup(galleryCleanups, gallery, () => observer.disconnect());
      return;
    }
    const listener = () => layoutGallery(gallery);
    window.addEventListener('resize', listener);
    addCleanup(galleryCleanups, gallery, () => window.removeEventListener('resize', listener));
  }

  function initGalleries(root = document) {
    queryAll(root, galleryRootSelector).forEach((gallery) => {
      refreshGallery(gallery);
      if (!markInitialized(gallery, 'Gallery')) return;
      listenWithCleanup(galleryCleanups, gallery, gallery, 'click', (event) => {
        const item = getScopedEventControl(event, galleryItemSelector, gallery, galleryRootSelector);
        if (!item || getGalleryViewerMode(gallery) === 'none') return;
        selectGalleryItem(gallery, item, event);
      });
      listenWithCleanup(galleryCleanups, gallery, gallery, 'keydown', (event) => {
        if (!['Enter', ' '].includes(event.key) || getGalleryViewerMode(gallery) === 'none') return;
        const item = getScopedEventControl(event, galleryItemSelector, gallery, galleryRootSelector);
        if (!item) return;
        selectGalleryItem(gallery, item, event);
      });
      observeGalleryResize(gallery);
    });
    queryAll(root, imageViewerSelector).forEach((viewer) => initImageViewer(viewer));
  }

  function makeImageViewerIcon(tagName, attribute, label, svgPath) {
    const element = document.createElement(tagName);
    element.className = 'uzu-icon-button';
    element.setAttribute(attribute, '');
    element.setAttribute('aria-label', label);
    if (tagName === 'button') element.type = 'button';
    element.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true" fill="none">${svgPath}</svg>`;
    return element;
  }

  function ensureAutoImageViewer(gallery) {
    const current = galleryAutoViewers.get(gallery);
    if (current && current.isConnected) return current;
    const overlay = document.createElement('div');
    overlay.className = 'uzu-dialog-overlay uzu-image-viewer-overlay';
    overlay.setAttribute('data-uzu-dialog-overlay', '');
    overlay.setAttribute('data-uzu-gallery-auto-viewer', '');
    overlay.hidden = true;
    const viewer = document.createElement('section');
    viewer.className = 'uzu-image-viewer';
    viewer.setAttribute('data-uzu-image-viewer', '');
    viewer.setAttribute('data-uzu-dialog', '');
    viewer.setAttribute('aria-label', 'Image viewer');
    viewer.tabIndex = -1;
    viewer.hidden = true;
    const toolbar = document.createElement('div');
    toolbar.className = 'uzu-image-viewer-toolbar';
    const controls = document.createElement('div');
    controls.className = 'uzu-flex uzu-gap-2 uzu-wrap';
    controls.append(
      makeImageViewerIcon('button', 'data-uzu-image-viewer-zoom-out', 'Zoom out', '<path d="M5 12h14" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>'),
      makeImageViewerIcon('button', 'data-uzu-image-viewer-reset', 'Reset zoom', '<path d="M7 7h10v10H7z" stroke="currentColor" stroke-width="1.7"/><path d="M4 12h3M17 12h3M12 4v3M12 17v3" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/>'),
      makeImageViewerIcon('button', 'data-uzu-image-viewer-zoom-in', 'Zoom in', '<path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>')
    );
    const download = makeImageViewerIcon('a', 'data-uzu-image-viewer-download', 'Download image', '<path d="M12 4v11M8 11l4 4 4-4M5 20h14" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>');
    download.setAttribute('download', '');
    controls.append(download);
    const close = makeImageViewerIcon('button', 'data-uzu-dialog-close', 'Close image viewer', '<path d="M6 6l12 12M18 6 6 18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>');
    toolbar.append(controls, close);
    const stage = document.createElement('div');
    stage.className = 'uzu-image-viewer-stage';
    stage.setAttribute('data-uzu-image-viewer-stage', '');
    const image = document.createElement('img');
    image.className = 'uzu-image-viewer-image';
    image.setAttribute('data-uzu-image-viewer-image', '');
    image.draggable = false;
    stage.append(image);
    const caption = document.createElement('p');
    caption.className = 'uzu-image-viewer-caption';
    caption.setAttribute('data-uzu-image-viewer-caption', '');
    viewer.append(toolbar, stage, caption);
    overlay.append(viewer);
    document.body.append(overlay);
    galleryAutoViewers.set(gallery, viewer);
    initDialogs(overlay);
    initImageViewer(viewer);
    return viewer;
  }

  function getImageViewerState(viewer) {
    const current = imageViewerState.get(viewer);
    if (current) return current;
    const state = { item: null, trigger: null, scale: 1, x: 0, y: 0, pointer: null };
    imageViewerState.set(viewer, state);
    return state;
  }

  function getViewerScoped(viewer, selector) {
    return getScopedControls(viewer, selector, imageViewerSelector)[0] || null;
  }

  function getViewerStage(viewer) {
    return getViewerScoped(viewer, '[data-uzu-image-viewer-stage], .uzu-image-viewer-stage');
  }

  function getViewerImage(viewer) {
    return getViewerScoped(viewer, '[data-uzu-image-viewer-image], .uzu-image-viewer-image');
  }

  function getViewerCaption(viewer) {
    return getViewerScoped(viewer, '[data-uzu-image-viewer-caption], .uzu-image-viewer-caption');
  }

  function clampViewerScale(viewer, scale) {
    const min = clampGalleryNumber(viewer.dataset.uzuImageViewerMinScale, 0.25, 0.05, 10);
    const max = clampGalleryNumber(viewer.dataset.uzuImageViewerMaxScale, 6, min, 20);
    return Math.min(max, Math.max(min, scale));
  }

  function syncImageViewerTransform(viewer, emit = false) {
    const state = getImageViewerState(viewer);
    viewer.style.setProperty('--uzu-image-viewer-scale', String(state.scale));
    viewer.style.setProperty('--uzu-image-viewer-x', `${Math.round(state.x)}px`);
    viewer.style.setProperty('--uzu-image-viewer-y', `${Math.round(state.y)}px`);
    if (emit) {
      viewer.dispatchEvent(new CustomEvent('uzu-image-viewer-zoom', {
        bubbles: true,
        detail: { viewer, item: state.item, scale: state.scale }
      }));
    }
  }

  function resetImageViewer(viewer, emit = false) {
    const state = getImageViewerState(viewer);
    state.scale = 1;
    state.x = 0;
    state.y = 0;
    syncImageViewerTransform(viewer, emit);
  }

  function zoomImageViewer(viewer, delta, emit = true) {
    const state = getImageViewerState(viewer);
    state.scale = clampViewerScale(viewer, state.scale * delta);
    syncImageViewerTransform(viewer, emit);
  }

  function updateImageViewerDownload(viewer, item) {
    const download = getViewerScoped(viewer, '[data-uzu-image-viewer-download]');
    if (!download) return;
    if (!item.download) {
      download.hidden = true;
      download.removeAttribute('href');
      return;
    }
    download.hidden = false;
    download.setAttribute('href', item.download);
    download.setAttribute('download', '');
  }

  function openImageViewer(viewerOrSelector, rawItem, trigger = null) {
    const viewer = resolveElement(viewerOrSelector, imageViewerSelector);
    const item = normalizeGalleryItem(rawItem, rawItem?.index || 0) || rawItem;
    if (!viewer || !item?.src) return null;
    initImageViewer(viewer);
    const state = getImageViewerState(viewer);
    state.item = item;
    state.trigger = trigger;
    const image = getViewerImage(viewer);
    const caption = getViewerCaption(viewer);
    if (image) {
      image.src = item.src;
      image.alt = item.alt || '';
      image.draggable = false;
    }
    if (caption) caption.textContent = item.caption || item.alt || fileNameToCaption(item.src);
    updateImageViewerDownload(viewer, item);
    resetImageViewer(viewer, false);
    const overlay = viewer.closest('[data-uzu-dialog-overlay]');
    if (overlay) initDialogs(overlay);
    openDialog(viewer, trigger);
    viewer.dispatchEvent(new CustomEvent('uzu-image-viewer-open', {
      bubbles: true,
      detail: { viewer, item, trigger }
    }));
    return viewer;
  }

  function closeImageViewer(viewerOrSelector) {
    const viewer = resolveElement(viewerOrSelector, imageViewerSelector);
    if (!viewer) return null;
    closeDialog(viewer);
    return viewer;
  }

  function initImageViewer(viewer) {
    if (!viewer.matches(imageViewerSelector)) return;
    getImageViewerState(viewer);
    if (!markInitialized(viewer, 'ImageViewer')) return;
    listenWithCleanup(imageViewerCleanups, viewer, viewer, 'click', (event) => {
      const target = event.target instanceof Element ? event.target : null;
      if (!target) return;
      if (target.closest('[data-uzu-image-viewer-zoom-in]')) zoomImageViewer(viewer, 1.2);
      else if (target.closest('[data-uzu-image-viewer-zoom-out]')) zoomImageViewer(viewer, 1 / 1.2);
      else if (target.closest('[data-uzu-image-viewer-reset]')) resetImageViewer(viewer, true);
    });
    listenWithCleanup(imageViewerCleanups, viewer, viewer, 'keydown', (event) => {
      if (event.key === '+' || event.key === '=') {
        event.preventDefault();
        zoomImageViewer(viewer, 1.2);
      } else if (event.key === '-') {
        event.preventDefault();
        zoomImageViewer(viewer, 1 / 1.2);
      } else if (event.key === '0') {
        event.preventDefault();
        resetImageViewer(viewer, true);
      }
    });
    const stage = getViewerStage(viewer);
    if (stage) {
      listenWithCleanup(imageViewerCleanups, viewer, stage, 'wheel', (event) => {
        if ((viewer.dataset.uzuImageViewerWheelZoom || 'true') === 'false') return;
        event.preventDefault();
        zoomImageViewer(viewer, event.deltaY < 0 ? 1.12 : 1 / 1.12);
      }, { passive: false });
      listenWithCleanup(imageViewerCleanups, viewer, stage, 'pointerdown', (event) => {
        if (event.button !== 0) return;
        const state = getImageViewerState(viewer);
        state.pointer = {
          id: event.pointerId,
          startX: event.clientX,
          startY: event.clientY,
          x: state.x,
          y: state.y
        };
        stage.classList.add('is-panning');
        try {
          stage.setPointerCapture?.(event.pointerId);
        } catch (_) {}
      });
      listenWithCleanup(imageViewerCleanups, viewer, stage, 'pointermove', (event) => {
        const state = getImageViewerState(viewer);
        if (!state.pointer || state.pointer.id !== event.pointerId) return;
        state.x = state.pointer.x + event.clientX - state.pointer.startX;
        state.y = state.pointer.y + event.clientY - state.pointer.startY;
        syncImageViewerTransform(viewer, false);
      });
      const endPan = (event) => {
        const state = getImageViewerState(viewer);
        if (state.pointer && (!event || state.pointer.id === event.pointerId)) state.pointer = null;
        stage.classList.remove('is-panning');
      };
      listenWithCleanup(imageViewerCleanups, viewer, stage, 'pointerup', endPan);
      listenWithCleanup(imageViewerCleanups, viewer, stage, 'pointercancel', endPan);
      listenWithCleanup(imageViewerCleanups, viewer, stage, 'lostpointercapture', endPan);
    }
    const image = getViewerImage(viewer);
    if (image) {
      image.draggable = false;
      listenWithCleanup(imageViewerCleanups, viewer, image, 'dragstart', (event) => event.preventDefault());
    }
    listenWithCleanup(imageViewerCleanups, viewer, viewer, 'uzu-dialog-close', (event) => {
      if (event.target !== viewer) return;
      const state = getImageViewerState(viewer);
      viewer.dispatchEvent(new CustomEvent('uzu-image-viewer-close', {
        bubbles: true,
        detail: { viewer, item: state.item, trigger: state.trigger }
      }));
    });
  }

  function runCleanups(map, element) {
    const cleanups = map.get(element) || [];
    cleanups.forEach((cleanup) => {
      try { cleanup(); } catch (_) {}
    });
    map.delete(element);
  }

  function destroyAutoImageViewer(viewer) {
    if (!viewer) return;
    const overlay = viewer.closest('[data-uzu-dialog-overlay]');
    const timer = dialogCloseTimers.get(viewer);
    if (timer) {
      window.clearTimeout(timer);
      dialogCloseTimers.delete(viewer);
    }
    restoreDialogIsolation(viewer);
    if (activeDialog === viewer) {
      activeDialog = null;
      activeDialogTrigger = null;
    }
    const stackIndex = dialogStack.indexOf(viewer);
    if (stackIndex >= 0) dialogStack.splice(stackIndex, 1);
    dialogTriggers.delete(viewer);
    runCleanups(imageViewerCleanups, viewer);
    imageViewerState.delete(viewer);
    delete viewer.dataset.uzuImageViewerInitialized;
    viewer.classList.remove('is-open', 'is-closing');
    viewer.hidden = true;
    if (overlay) {
      overlay.classList.remove('is-open', 'is-closing');
      overlay.hidden = true;
      if (overlay.parentNode) overlay.remove();
    }
  }

  function destroyGalleries(root = document) {
    queryAll(root, galleryRootSelector).forEach((gallery) => {
      const state = galleryState.get(gallery);
      if (state) {
        state.destroyed = true;
        state.requestId += 1;
      }
      runCleanups(galleryCleanups, gallery);
      const autoViewer = galleryAutoViewers.get(gallery);
      destroyAutoImageViewer(autoViewer);
      galleryAutoViewers.delete(gallery);
      galleryState.delete(gallery);
      delete gallery.dataset.uzuGalleryInitialized;
    });
    queryAll(root, imageViewerSelector).forEach((viewer) => {
      runCleanups(imageViewerCleanups, viewer);
      imageViewerState.delete(viewer);
      delete viewer.dataset.uzuImageViewerInitialized;
    });
  }

/* ui/js/trees.js */
function getTreeItems(tree) {
    return getScopedControls(tree, '[data-uzu-tree-item], .uzu-tree-item', '[data-uzu-tree]');
  }

  function getTreeItemControl(item) {
    return item.querySelector('[data-uzu-tree-label], .uzu-tree-label') || item;
  }

  function getTreeItemRow(item) {
    return item.querySelector(':scope > [data-uzu-tree-row], :scope > .uzu-tree-row');
  }

  function getTreeItemGroup(item) {
    return item.querySelector(':scope > [role="group"], :scope > .uzu-tree-group');
  }

  function isTreeItemExpanded(item) {
    const group = getTreeItemGroup(item);
    return Boolean(group && !group.hidden);
  }

  function setTreeItemExpanded(item, expanded, emit = true) {
    const tree = item.closest('[data-uzu-tree]');
    const group = getTreeItemGroup(item);
    const toggle = item.querySelector('[data-uzu-tree-toggle], .uzu-tree-toggle');
    if (!group) return;
    group.hidden = !expanded;
    item.classList.toggle('is-open', expanded);
    item.setAttribute('aria-expanded', expanded ? 'true' : 'false');
    if (toggle) toggle.setAttribute('aria-expanded', expanded ? 'true' : 'false');
    if (expanded) queueDisclosureHeightRefresh(group);
    if (emit && tree) {
      tree.dispatchEvent(new CustomEvent('uzu-tree-toggle', {
        bubbles: true,
        detail: { tree, item, expanded, value: getControlValue(item, 'uzuTreeValue') }
      }));
    }
  }

  function getVisibleTreeItems(tree) {
    return getTreeItems(tree).filter((item) => {
      let parent = item.parentElement?.closest('[data-uzu-tree-item], .uzu-tree-item');
      while (parent && tree.contains(parent)) {
        if (!isTreeItemExpanded(parent)) return false;
        parent = parent.parentElement?.closest('[data-uzu-tree-item], .uzu-tree-item');
      }
      return true;
    });
  }

  function selectTreeItem(tree, item, emit = true) {
    getTreeItems(tree).forEach((control) => {
      const selected = control === item;
      control.classList.toggle('is-selected', selected);
      control.setAttribute('aria-selected', selected ? 'true' : 'false');
    });
    tree.dataset.uzuTreeValue = getControlValue(item, 'uzuTreeValue');
    if (emit) {
      tree.dispatchEvent(new CustomEvent('uzu-tree-select', {
        bubbles: true,
        detail: { tree, item, value: tree.dataset.uzuTreeValue }
      }));
      tree.dispatchEvent(new Event('change', { bubbles: true }));
    }
  }

  function getTreeItemLevel(item) {
    let level = 1;
    let parent = item.parentElement?.closest('[data-uzu-tree-item], .uzu-tree-item');
    while (parent) {
      level += 1;
      parent = parent.parentElement?.closest('[data-uzu-tree-item], .uzu-tree-item');
    }
    return level;
  }

  function syncTreeItemSetMetadata(tree) {
    getTreeItems(tree).forEach((item) => {
      const parentGroup = item.parentElement;
      const siblings = [...parentGroup?.children || []].filter((child) => child.matches?.('[data-uzu-tree-item], .uzu-tree-item'));
      item.setAttribute('aria-level', String(getTreeItemLevel(item)));
      item.setAttribute('aria-setsize', String(siblings.length || 1));
      item.setAttribute('aria-posinset', String(Math.max(1, siblings.indexOf(item) + 1)));
    });
  }

  function initTrees(root = document) {
    queryAll(root, '[data-uzu-tree]').forEach((tree) => {
      const items = getTreeItems(tree);
      if (!items.length) return;
      tree.setAttribute('role', tree.getAttribute('role') || 'tree');
      items.forEach((item) => {
        item.setAttribute('role', item.getAttribute('role') || 'treeitem');
        item.setAttribute('tabindex', item.classList.contains('is-selected') ? '0' : '-1');
        const group = getTreeItemGroup(item);
        if (group) {
          group.setAttribute('role', group.getAttribute('role') || 'group');
          if (!item.classList.contains('is-open') && item.getAttribute('aria-expanded') !== 'true') group.hidden = true;
          setTreeItemExpanded(item, !group.hidden, false);
        }
      });
      const selected = items.find((item) => item.classList.contains('is-selected')) || items[0];
      if (selected) {
        selected.setAttribute('tabindex', '0');
        selectTreeItem(tree, selected, false);
      }
      syncTreeItemSetMetadata(tree);
      if (!markInitialized(tree, 'Tree')) return;
      tree.addEventListener('click', (event) => {
        const toggle = getScopedEventControl(event, '[data-uzu-tree-toggle], .uzu-tree-toggle', tree, '[data-uzu-tree]');
        const item = toggle ? toggle.closest('[data-uzu-tree-item], .uzu-tree-item') : getScopedEventControl(event, '[data-uzu-tree-item], .uzu-tree-item', tree, '[data-uzu-tree]');
        if (!item) return;
        const group = getTreeItemGroup(item);
        const row = getTreeItemRow(item);
        const target = event.target instanceof Element ? event.target : null;
        const clickedRow = Boolean(target && row?.contains(target));
        const embeddedControl = target?.closest('a, button, input, select, textarea, [role="button"], [role="link"]');
        if (embeddedControl && !toggle) return;
        if (toggle || (group && clickedRow)) {
          event.preventDefault();
          setTreeItemExpanded(item, !isTreeItemExpanded(item));
        } else {
          selectTreeItem(tree, item);
        }
      });
      tree.addEventListener('keydown', (event) => {
        const item = event.target instanceof Element ? event.target.closest('[data-uzu-tree-item], .uzu-tree-item') : null;
        if (!item || !tree.contains(item)) return;
        const visible = getVisibleTreeItems(tree);
        const index = visible.indexOf(item);
        let next = null;
        if (event.key === 'ArrowDown') next = visible[index + 1] || visible[0];
        else if (event.key === 'ArrowUp') next = visible[index - 1] || visible.at(-1);
        else if (event.key === 'ArrowRight') {
          if (getTreeItemGroup(item) && !isTreeItemExpanded(item)) setTreeItemExpanded(item, true);
          else next = getVisibleTreeItems(tree)[index + 1] || null;
        } else if (event.key === 'ArrowLeft') {
          if (getTreeItemGroup(item) && isTreeItemExpanded(item)) setTreeItemExpanded(item, false);
          else next = item.parentElement?.closest('[data-uzu-tree-item], .uzu-tree-item');
        } else if (event.key === 'Home') next = visible[0];
        else if (event.key === 'End') next = visible.at(-1);
        else if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          selectTreeItem(tree, item);
        }
        if (next) {
          event.preventDefault();
          getTreeItems(tree).forEach((control) => control.setAttribute('tabindex', control === next ? '0' : '-1'));
          next.focus();
        }
      });
    });
  }

/* ui/js/accordions-hover-cards.js */
function initAccordions(root = document) {
    queryAll(root, '[data-uzu-accordion]').forEach((accordion) => {
      const disclosures = getScopedControls(accordion, '[data-uzu-disclosure]', '[data-uzu-accordion]');
      if (!disclosures.length) return;
      const allowMultiple = accordion.dataset.uzuAccordionMultiple === 'true';
      if (!allowMultiple) {
        let hasOpenDisclosure = false;
        disclosures.forEach((disclosure) => {
          if (!disclosure.classList.contains('is-open')) return;
          if (hasOpenDisclosure) setDisclosureState(disclosure, false, false);
          else hasOpenDisclosure = true;
        });
      }
      if (!markInitialized(accordion, 'Accordion')) return;
      disclosures.forEach((disclosure) => {
        disclosure.addEventListener('uzu-disclosure-change', (event) => {
          if (event.target !== disclosure) return;
          if (event.detail.open && !allowMultiple) {
            disclosures.forEach((item) => {
              if (item !== disclosure) setDisclosureState(item, false, false);
            });
          }
          accordion.dispatchEvent(new CustomEvent('uzu-accordion-change', {
            bubbles: true,
            detail: { accordion, disclosure, open: Boolean(event.detail.open) }
          }));
        });
      });
    });
  }

  function getHoverCardTrigger(card) {
    return card.querySelector('[data-uzu-hover-card-trigger], .uzu-hover-card-trigger');
  }

  function getHoverCardContent(card) {
    return card.querySelector('[data-uzu-hover-card-content], .uzu-hover-card-content');
  }

  function clearHoverCardTimer(card, store) {
    const timer = store.get(card);
    if (!timer) return;
    window.clearTimeout(timer);
    store.delete(card);
  }

  function setHoverCardState(card, open, emit = true) {
    const trigger = getHoverCardTrigger(card);
    const content = getHoverCardContent(card);
    if (!content) return;
    clearHoverCardTimer(card, hoverCardOpenTimers);
    clearHoverCardTimer(card, hoverCardCloseTimers);
    if (trigger) trigger.setAttribute('aria-expanded', open ? 'true' : 'false');
    if (open) {
      content.hidden = false;
      card.classList.remove('is-closing');
      card.classList.add('is-open');
      queueDisclosureHeightRefresh(content);
    } else if (card.classList.contains('is-open')) {
      card.classList.remove('is-open');
      card.classList.add('is-closing');
      const finish = () => {
        card.classList.remove('is-closing');
        content.hidden = true;
        hoverCardCloseTimers.delete(card);
      };
      const timer = scheduleAfterAnimation([content], finish);
      if (timer) hoverCardCloseTimers.set(card, timer);
    } else {
      card.classList.remove('is-closing');
      content.hidden = true;
    }
    if (emit) {
      card.dispatchEvent(new CustomEvent(open ? 'uzu-hover-card-open' : 'uzu-hover-card-close', {
        bubbles: true,
        detail: { hoverCard: card, trigger, content }
      }));
    }
  }

  function initHoverCards(root = document) {
    queryAll(root, '[data-uzu-hover-card]').forEach((card) => {
      const trigger = getHoverCardTrigger(card);
      const content = getHoverCardContent(card);
      if (!trigger || !content) return;
      const contentId = ensureId(content, 'uzu-hover-card-content');
      trigger.setAttribute('aria-haspopup', 'dialog');
      trigger.setAttribute('aria-expanded', card.classList.contains('is-open') ? 'true' : 'false');
      trigger.setAttribute('aria-controls', contentId);
      if (!card.classList.contains('is-open')) content.hidden = true;
      if (!markInitialized(card, 'HoverCard')) return;
      const openDelay = Number.isFinite(Number(card.dataset.uzuHoverCardDelay)) ? Number(card.dataset.uzuHoverCardDelay) : 120;
      const closeDelay = Number.isFinite(Number(card.dataset.uzuHoverCardCloseDelay)) ? Number(card.dataset.uzuHoverCardCloseDelay) : 120;
      const open = () => {
        clearHoverCardTimer(card, hoverCardCloseTimers);
        clearHoverCardTimer(card, hoverCardOpenTimers);
        const timer = window.setTimeout(() => setHoverCardState(card, true), openDelay);
        hoverCardOpenTimers.set(card, timer);
      };
      const close = () => {
        clearHoverCardTimer(card, hoverCardOpenTimers);
        clearHoverCardTimer(card, hoverCardCloseTimers);
        const timer = window.setTimeout(() => setHoverCardState(card, false), closeDelay);
        hoverCardCloseTimers.set(card, timer);
      };
      [trigger, content].forEach((element) => {
        element.addEventListener('mouseenter', open);
        element.addEventListener('mouseleave', close);
        element.addEventListener('focusin', open);
        element.addEventListener('focusout', close);
      });
      trigger.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
          event.preventDefault();
          setHoverCardState(card, false);
          trigger.focus();
        }
      });
    });
  }

/* ui/js/popovers.js */
function getPopoverTrigger(popover) {
    return getScopedControls(popover, '[data-uzu-popover-trigger], .uzu-popover-trigger', '[data-uzu-popover]')[0] || null;
  }

  function getPopoverContent(popover) {
    return getScopedControls(popover, '[data-uzu-popover-content], .uzu-popover', '[data-uzu-popover]')[0] || null;
  }

  function emitPopoverEvent(popover, name, trigger = getPopoverTrigger(popover)) {
    popover.dispatchEvent(new CustomEvent(name, {
      bubbles: true,
      detail: {
        popover,
        trigger,
        content: getPopoverContent(popover)
      }
    }));
  }

  function openPopover(popover, options = {}) {
    const trigger = options.trigger || getPopoverTrigger(popover);
    const content = getPopoverContent(popover);
    if (!content) return;
    if (popover.classList.contains('is-open')) return;
    const existingTimer = popoverCloseTimers.get(popover);
    if (existingTimer) {
      window.clearTimeout(existingTimer);
      popoverCloseTimers.delete(popover);
    }
    content.hidden = false;
    popover.classList.remove('is-closing');
    popover.classList.add('is-open');
    if (trigger) trigger.setAttribute('aria-expanded', 'true');
    queueDisclosureHeightRefresh(content);
    emitPopoverEvent(popover, 'uzu-popover-open', trigger);
  }

  function closePopover(popover, options = {}) {
    const trigger = options.trigger || getPopoverTrigger(popover);
    const content = getPopoverContent(popover);
    if (!content || popover.classList.contains('is-closing') || (!popover.classList.contains('is-open') && content.hidden)) return;
    popover.classList.remove('is-open');
    popover.classList.add('is-closing');
    if (trigger) trigger.setAttribute('aria-expanded', 'false');
    const existingTimer = popoverCloseTimers.get(popover);
    if (existingTimer) window.clearTimeout(existingTimer);
    const finish = () => {
      popover.classList.remove('is-closing');
      content.hidden = true;
      popoverCloseTimers.delete(popover);
      emitPopoverEvent(popover, 'uzu-popover-close', trigger);
      if (options.restoreFocus && trigger && typeof trigger.focus === 'function') trigger.focus();
    };
    const timer = scheduleAfterAnimation([content], finish);
    if (timer) popoverCloseTimers.set(popover, timer);
  }

  function closeOpenPopovers(except = null) {
    let count = 0;
    queryAll(document, '[data-uzu-popover].is-open').forEach((popover) => {
      if (popover !== except) {
        count += 1;
        closePopover(popover);
      }
    });
    return count;
  }

  function initPopovers(root = document) {
    queryAll(root, '[data-uzu-popover]').forEach((popover) => {
      const trigger = getPopoverTrigger(popover);
      const content = getPopoverContent(popover);
      if (!trigger || !content) return;
      const contentId = ensureId(content, 'uzu-popover-content');
      trigger.setAttribute('aria-haspopup', trigger.getAttribute('aria-haspopup') || 'dialog');
      trigger.setAttribute('aria-expanded', popover.classList.contains('is-open') ? 'true' : 'false');
      trigger.setAttribute('aria-controls', contentId);
      if (popover.classList.contains('is-open')) {
        content.hidden = false;
        queueDisclosureHeightRefresh(content);
      } else {
        content.hidden = true;
      }
      if (!markInitialized(popover, 'Popover')) return;
      trigger.addEventListener('click', (event) => {
        if (isControlDisabled(trigger)) return;
        event.preventDefault();
        if (popover.classList.contains('is-open')) {
          closePopover(popover, { restoreFocus: true });
        } else {
          closeOpenPopovers(popover);
          openPopover(popover, { trigger });
        }
      });
      trigger.addEventListener('keydown', (event) => {
        if (isControlDisabled(trigger)) return;
        if (['Enter', ' ', 'ArrowDown'].includes(event.key)) {
          event.preventDefault();
          closeOpenPopovers(popover);
          openPopover(popover, { trigger });
        } else if (event.key === 'Escape') {
          event.preventDefault();
          closePopover(popover, { restoreFocus: true });
        }
      });
      popover.addEventListener('keydown', (event) => {
        if (event.key !== 'Escape') return;
        event.preventDefault();
        closePopover(popover, { restoreFocus: true });
      });
    });
  }

/* ui/js/tags.js */
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

/* ui/js/resizable.js */
function setSplitPaneSize(splitPane, size, emit = true) {
    const min = Number(splitPane.dataset.uzuSplitMin || 20);
    const max = Number(splitPane.dataset.uzuSplitMax || 80);
    const next = clampNumber(size, min, max);
    splitPane.style.setProperty('--uzu-split-primary-size', `${next}%`);
    splitPane.dataset.uzuSplitSize = String(next);
    const key = splitPane.dataset.uzuSplitKey;
    if (key) storage.set(`uzu-split:${key}`, String(next));
    queryAll(splitPane, '[data-uzu-split-resizer], .uzu-split-resizer').forEach((resizer) => {
      resizer.setAttribute('aria-valuenow', String(Math.round(next)));
    });
    if (emit) {
      splitPane.dispatchEvent(new CustomEvent('uzu-split-resize', {
        bubbles: true,
        detail: { splitPane, size: next }
      }));
    }
  }

  function initSplitPanes(root = document) {
    queryAll(root, '[data-uzu-split-pane]').forEach((splitPane) => {
      const resizer = splitPane.querySelector('[data-uzu-split-resizer], .uzu-split-resizer');
      if (!resizer) return;
      const orientation = splitPane.dataset.uzuSplitOrientation === 'vertical' ? 'vertical' : 'horizontal';
      splitPane.dataset.uzuSplitOrientation = orientation;
      resizer.setAttribute('role', 'separator');
      resizer.setAttribute('tabindex', resizer.getAttribute('tabindex') || '0');
      resizer.setAttribute('aria-orientation', orientation);
      const saved = splitPane.dataset.uzuSplitKey ? Number(storage.get(`uzu-split:${splitPane.dataset.uzuSplitKey}`)) : NaN;
      setSplitPaneSize(splitPane, Number.isFinite(saved) ? saved : Number(splitPane.dataset.uzuSplitSize || 50), false);
      if (!markInitialized(splitPane, 'SplitPane')) return;
      const getPointSize = (event) => {
        const rect = splitPane.getBoundingClientRect();
        const raw = orientation === 'vertical'
          ? ((event.clientY - rect.top) / rect.height) * 100
          : ((event.clientX - rect.left) / rect.width) * 100;
        return Number.isFinite(raw) ? raw : Number(splitPane.dataset.uzuSplitSize || 50);
      };
      const stopDrag = () => {
        splitPane.classList.remove('is-resizing');
        activePointerDrags.delete(resizer);
        document.removeEventListener('pointermove', moveDrag);
        document.removeEventListener('pointerup', stopDrag);
        document.removeEventListener('pointercancel', stopDrag);
      };
      const moveDrag = (event) => {
        event.preventDefault();
        setSplitPaneSize(splitPane, getPointSize(event));
      };
      resizer.addEventListener('pointerdown', (event) => {
        event.preventDefault();
        if (activePointerDrags.has(resizer)) activePointerDrags.get(resizer)();
        splitPane.classList.add('is-resizing');
        activePointerDrags.set(resizer, stopDrag);
        if (resizer.setPointerCapture) {
          try { resizer.setPointerCapture(event.pointerId); } catch (_) {}
        }
        document.addEventListener('pointermove', moveDrag);
        document.addEventListener('pointerup', stopDrag, { once: true });
        document.addEventListener('pointercancel', stopDrag, { once: true });
      });
      resizer.addEventListener('lostpointercapture', stopDrag);
      resizer.addEventListener('keydown', (event) => {
        const keyMap = orientation === 'vertical'
          ? { ArrowUp: -2, ArrowDown: 2, Home: -100, End: 100 }
          : { ArrowLeft: -2, ArrowRight: 2, Home: -100, End: 100 };
        if (!(event.key in keyMap)) return;
        event.preventDefault();
        const current = Number(splitPane.dataset.uzuSplitSize || 50);
        const next = event.key === 'Home' ? Number(splitPane.dataset.uzuSplitMin || 20)
          : event.key === 'End' ? Number(splitPane.dataset.uzuSplitMax || 80)
            : current + keyMap[event.key];
        setSplitPaneSize(splitPane, next);
      });
    });
  }

  function setResizableSize(panel, width, height, emit = true) {
    const axis = panel.dataset.uzuResizableAxis || 'both';
    const minWidth = Number(panel.dataset.uzuResizableMinWidth || 160);
    const maxWidth = Number(panel.dataset.uzuResizableMaxWidth || 960);
    const minHeight = Number(panel.dataset.uzuResizableMinHeight || 100);
    const maxHeight = Number(panel.dataset.uzuResizableMaxHeight || 720);
    const nextWidth = clampNumber(width, minWidth, maxWidth);
    const nextHeight = clampNumber(height, minHeight, maxHeight);
    if (axis !== 'vertical') panel.style.setProperty('--uzu-resizable-width', `${nextWidth}px`);
    if (axis !== 'horizontal') panel.style.setProperty('--uzu-resizable-height', `${nextHeight}px`);
    panel.dataset.uzuResizableWidth = String(Math.round(nextWidth));
    panel.dataset.uzuResizableHeight = String(Math.round(nextHeight));
    const key = panel.dataset.uzuResizableKey;
    if (key) storage.set(`uzu-resizable:${key}`, `${Math.round(nextWidth)}:${Math.round(nextHeight)}`);
    if (emit) {
      panel.dispatchEvent(new CustomEvent('uzu-resizable-resize', {
        bubbles: true,
        detail: { resizable: panel, width: nextWidth, height: nextHeight }
      }));
    }
  }

  function initResizables(root = document) {
    queryAll(root, '[data-uzu-resizable]').forEach((panel) => {
      const handle = panel.querySelector('[data-uzu-resizable-handle], .uzu-resizable-handle');
      if (!handle) return;
      const rect = panel.getBoundingClientRect();
      const saved = panel.dataset.uzuResizableKey ? storage.get(`uzu-resizable:${panel.dataset.uzuResizableKey}`) : '';
      const [savedWidth, savedHeight] = String(saved || '').split(':').map(Number);
      setResizableSize(panel, Number.isFinite(savedWidth) ? savedWidth : Number(panel.dataset.uzuResizableWidth || rect.width || 320), Number.isFinite(savedHeight) ? savedHeight : Number(panel.dataset.uzuResizableHeight || rect.height || 180), false);
      handle.setAttribute('role', 'separator');
      handle.setAttribute('tabindex', handle.getAttribute('tabindex') || '0');
      if (!markInitialized(panel, 'Resizable')) return;
      let start = null;
      const move = (event) => {
        if (!start) return;
        event.preventDefault();
        setResizableSize(panel, start.width + event.clientX - start.x, start.height + event.clientY - start.y);
      };
      const stop = () => {
        panel.classList.remove('is-resizing');
        start = null;
        activePointerDrags.delete(handle);
        document.removeEventListener('pointermove', move);
        document.removeEventListener('pointerup', stop);
        document.removeEventListener('pointercancel', stop);
      };
      handle.addEventListener('pointerdown', (event) => {
        event.preventDefault();
        if (activePointerDrags.has(handle)) activePointerDrags.get(handle)();
        const bounds = panel.getBoundingClientRect();
        start = { x: event.clientX, y: event.clientY, width: bounds.width, height: bounds.height };
        panel.classList.add('is-resizing');
        activePointerDrags.set(handle, stop);
        if (handle.setPointerCapture) {
          try { handle.setPointerCapture(event.pointerId); } catch (_) {}
        }
        document.addEventListener('pointermove', move);
        document.addEventListener('pointerup', stop, { once: true });
        document.addEventListener('pointercancel', stop, { once: true });
      });
      handle.addEventListener('lostpointercapture', stop);
      handle.addEventListener('keydown', (event) => {
        const currentWidth = Number(panel.dataset.uzuResizableWidth || panel.getBoundingClientRect().width);
        const currentHeight = Number(panel.dataset.uzuResizableHeight || panel.getBoundingClientRect().height);
        let width = currentWidth;
        let height = currentHeight;
        if (event.key === 'ArrowRight') width += 12;
        else if (event.key === 'ArrowLeft') width -= 12;
        else if (event.key === 'ArrowDown') height += 12;
        else if (event.key === 'ArrowUp') height -= 12;
        else return;
        event.preventDefault();
        setResizableSize(panel, width, height);
      });
    });
  }

/* ui/js/sidebar-layouts.js */
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

/* ui/js/editors.js */
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
        syncGeneratedMarkdownLanguage(editor);
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
    initMarkdownEditors(root);
    initInlineEditors(root);
  }

/* ui/js/dialogs.js */
function getDialog(selector) {
    try {
      return selector ? document.querySelector(selector) : null;
    } catch (_) {
      return null;
    }
  }

  function getFocusable(dialog) {
    return queryAll(dialog, 'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])')
      .filter((element) => element.offsetParent !== null || element === document.activeElement);
  }

  function emitDialogEvent(dialog, name, trigger = activeDialogTrigger) {
    dialog.dispatchEvent(new CustomEvent(name, {
      bubbles: true,
      detail: {
        dialog,
        overlay: dialog.closest('[data-uzu-dialog-overlay]'),
        trigger
      }
    }));
  }

  function getDialogIsolationRoot(dialog) {
    return dialog.closest('[data-uzu-dialog-overlay]') || dialog;
  }

  function getDialogInertSiblings(root) {
    const siblings = new Set();
    let node = root;
    while (node && node !== document.body && node.parentElement) {
      [...node.parentElement.children].forEach((child) => {
        if (child !== node && !child.contains(root)) siblings.add(child);
      });
      node = node.parentElement;
    }
    return [...siblings];
  }

  function lockDialogScroll() {
    if (dialogScrollLockState || !document.body) return;
    const body = document.body;
    const root = document.documentElement;
    const scrollbarWidth = Math.max(0, window.innerWidth - root.clientWidth);
    const bodyPaddingRight = window.getComputedStyle(body).paddingRight;
    const bodyPaddingValue = Number.parseFloat(bodyPaddingRight) || 0;
    dialogScrollLockState = {
      bodyOverflow: body.style.overflow,
      bodyPaddingRight: body.style.paddingRight,
      rootOverflow: root.style.overflow
    };
    root.style.overflow = 'hidden';
    body.style.overflow = 'hidden';
    if (scrollbarWidth > 0) body.style.paddingRight = `${bodyPaddingValue + scrollbarWidth}px`;
  }

  function unlockDialogScroll() {
    if (!dialogScrollLockState || !document.body) return;
    const body = document.body;
    const root = document.documentElement;
    body.style.overflow = dialogScrollLockState.bodyOverflow;
    body.style.paddingRight = dialogScrollLockState.bodyPaddingRight;
    root.style.overflow = dialogScrollLockState.rootOverflow;
    dialogScrollLockState = null;
  }

  function applyDialogIsolation(dialog) {
    if (dialogIsolationState && dialogIsolationState.dialog === dialog) return;
    restoreDialogIsolation();
    const root = getDialogIsolationRoot(dialog);
    const entries = getDialogInertSiblings(root).map((element) => ({
      element,
      hadInert: element.hasAttribute('inert'),
      ariaHidden: element.getAttribute('aria-hidden')
    }));
    entries.forEach(({ element }) => {
      element.setAttribute('inert', '');
      element.setAttribute('aria-hidden', 'true');
    });
    dialogIsolationState = { dialog, entries };
    lockDialogScroll();
  }

  function getTopDialog() {
    return dialogStack.at(-1) || null;
  }

  function isNestedDialog(dialog) {
    const top = getTopDialog();
    if (!top || top === dialog) return false;
    const overlay = dialog.closest('[data-uzu-dialog-overlay]');
    return top.contains(dialog) || (overlay && top.contains(overlay));
  }

  function pushDialog(dialog, trigger) {
    const existingIndex = dialogStack.indexOf(dialog);
    if (existingIndex >= 0) dialogStack.splice(existingIndex, 1);
    dialogStack.push(dialog);
    if (trigger) dialogTriggers.set(dialog, trigger);
    activeDialog = dialog;
    activeDialogTrigger = trigger;
  }

  function popDialog(dialog) {
    const index = dialogStack.indexOf(dialog);
    if (index >= 0) dialogStack.splice(index, 1);
    activeDialog = getTopDialog();
    activeDialogTrigger = activeDialog ? dialogTriggers.get(activeDialog) || null : null;
    dialogTriggers.delete(dialog);
  }

  function restoreDialogIsolation(dialog = null) {
    if (!dialogIsolationState || (dialog && dialogIsolationState.dialog !== dialog)) return;
    dialogIsolationState.entries.forEach(({ element, hadInert, ariaHidden }) => {
      if (!hadInert) element.removeAttribute('inert');
      if (ariaHidden === null) {
        element.removeAttribute('aria-hidden');
      } else {
        element.setAttribute('aria-hidden', ariaHidden);
      }
    });
    dialogIsolationState = null;
    unlockDialogScroll();
  }

  function openDialog(dialog, trigger = null) {
    if (!dialog) return;
    const nested = isNestedDialog(dialog);
    if (activeDialog && activeDialog !== dialog && !activeDialog.hidden && !nested) {
      closeDialog(activeDialog);
    }
    const existingTimer = dialogCloseTimers.get(dialog);
    if (existingTimer) {
      window.clearTimeout(existingTimer);
      dialogCloseTimers.delete(dialog);
    }
    pushDialog(dialog, trigger);
    const overlay = dialog.closest('[data-uzu-dialog-overlay]');
    if (overlay) overlay.hidden = false;
    dialog.hidden = false;
    if (overlay) {
      overlay.classList.remove('is-closing');
      overlay.classList.add('is-open');
    }
    dialog.classList.remove('is-closing');
    dialog.classList.add('is-open');
    dialog.setAttribute('role', dialog.getAttribute('role') || 'dialog');
    dialog.setAttribute('aria-modal', 'true');
    if (!dialog.hasAttribute('tabindex')) dialog.setAttribute('tabindex', '-1');
    if (!nested) applyDialogIsolation(dialog);
    queueDisclosureHeightRefresh(dialog);
    const focusable = getFocusable(dialog);
    (focusable[0] || dialog).focus();
    emitDialogEvent(dialog, 'uzu-dialog-open');
  }

  function closeDialog(dialog) {
    if (!dialog || dialog.classList.contains('is-closing') || dialog.hidden) return;
    const overlay = dialog.closest('[data-uzu-dialog-overlay]');
    dialog.classList.remove('is-open');
    dialog.classList.add('is-closing');
    if (overlay) {
      overlay.classList.remove('is-open');
      overlay.classList.add('is-closing');
    }
    const trigger = dialogTriggers.get(dialog) || activeDialogTrigger;
    const finish = () => {
      dialog.classList.remove('is-closing');
      dialog.hidden = true;
      if (overlay) {
        overlay.classList.remove('is-closing');
        overlay.hidden = true;
      }
      restoreDialogIsolation(dialog);
      emitDialogEvent(dialog, 'uzu-dialog-close', trigger);
      const wasActiveDialog = activeDialog === dialog;
      if (wasActiveDialog || dialogStack.includes(dialog)) {
        popDialog(dialog);
        if (wasActiveDialog && trigger && typeof trigger.focus === 'function') trigger.focus();
      }
      dialogCloseTimers.delete(dialog);
    };
    const timer = scheduleAfterAnimation([dialog, overlay].filter(Boolean), finish);
    if (timer) dialogCloseTimers.set(dialog, timer);
  }

  function initDialogs(root = document) {
    queryAll(root, '[data-uzu-dialog-target]').forEach((trigger) => {
      if (!markInitialized(trigger, 'DialogTrigger')) return;
      trigger.addEventListener('click', () => {
        openDialog(getDialog(trigger.dataset.uzuDialogTarget), trigger);
      });
    });

    queryAll(root, '[data-uzu-dialog-close]').forEach((trigger) => {
      if (!markInitialized(trigger, 'DialogClose')) return;
      trigger.addEventListener('click', () => {
        closeDialog(trigger.closest('[data-uzu-dialog]'));
      });
    });

    queryAll(root, '[data-uzu-dialog-overlay]').forEach((overlay) => {
      if (!markInitialized(overlay, 'DialogOverlay')) return;
      overlay.addEventListener('click', (event) => {
        if (event.target === overlay) closeDialog(overlay.querySelector('[data-uzu-dialog]'));
      });
    });
  }

/* ui/js/toasts.js */
function closeToast(toast) {
    if (!toast || toast.classList.contains('is-dismissed')) return;
    toast.classList.add('is-dismissed');
    toast.dispatchEvent(new CustomEvent('uzu-toast-close', {
      bubbles: true,
      detail: { toast }
    }));
    const timer = scheduleAfterAnimation([toast], () => {
      toast.remove();
      toastCloseTimers.delete(toast);
    });
    if (timer) toastCloseTimers.set(toast, timer);
  }

  function getToastStack(selector) {
    const explicitSelector = typeof selector === 'string' && selector.trim() !== '';
    if (!explicitSelector) {
      return document.querySelector('[data-uzu-toast-stack], .uzu-toast-stack') || null;
    }
    try {
      return document.querySelector(selector) || null;
    } catch (_) {
      return null;
    }
  }

  function getToastTemplate(selector) {
    if (!selector) return null;
    try {
      const target = document.querySelector(selector);
      return target instanceof HTMLTemplateElement ? target : null;
    } catch (_) {
      return null;
    }
  }

  function syncToastLanguage(toast, reference = toast) {
    const languageRoot = getClosestLanguageRoot(reference);
    const language = languageRoot.getAttribute('data-language') || languageRoot.getAttribute('data-uzu-lang') || 'zh';
    if (toast.matches?.('[data-lang]') || toast.querySelector?.('[data-lang]')) {
      syncLanguageContent(toast, normalizeLanguage(language));
    }
  }

  function prepareToast(toast, reference = toast) {
    if (!(toast instanceof HTMLElement)) return null;
    if (!toast.hasAttribute('data-uzu-toast')) toast.setAttribute('data-uzu-toast', '');
    syncToastLanguage(toast, reference);
    initToasts(toast);
    return toast;
  }

  function getToastFromTemplate(template) {
    if (!template) return null;
    const fragment = template.content.cloneNode(true);
    return fragment.querySelector('[data-uzu-toast], .uzu-toast') || fragment.firstElementChild || null;
  }

  function showToast(options = {}) {
    const settings = typeof options === 'string' ? { template: options } : options || {};
    const stack = getToastStack(settings.stack || settings.stackSelector);
    if (!stack) return null;
    const template = getToastTemplate(settings.template || settings.templateSelector);
    const reference = settings.trigger instanceof Element ? settings.trigger : stack;
    const toast = prepareToast(settings.toast instanceof HTMLElement ? settings.toast : getToastFromTemplate(template), reference);
    if (!toast) return null;
    stack.append(toast);
    toast.dispatchEvent(new CustomEvent('uzu-toast-open', {
      bubbles: true,
      detail: { toast, stack }
    }));
    return toast;
  }

  function initToastInstance(toast) {
    if (!markInitialized(toast, 'Toast')) return;
    if (!toast.hasAttribute('role')) toast.setAttribute('role', 'status');
    if (!toast.hasAttribute('aria-live')) {
      toast.setAttribute('aria-live', toast.getAttribute('role') === 'alert' ? 'assertive' : 'polite');
    }
    if (!toast.hasAttribute('aria-atomic')) toast.setAttribute('aria-atomic', 'true');
    const timeout = Number(toast.dataset.uzuToastTimeout || 0);
    queryAll(toast, '[data-uzu-toast-close]').forEach((close) => {
      close.addEventListener('click', () => closeToast(toast));
    });
    if (timeout > 0) window.setTimeout(() => closeToast(toast), timeout);
  }

  function initToastTriggers(root = document) {
    queryAll(root, '[data-uzu-toast-trigger]').forEach((trigger) => {
      if (!markInitialized(trigger, 'ToastTrigger')) return;
      trigger.addEventListener('click', () => {
        if (isControlDisabled(trigger)) return;
        showToast({
          template: trigger.dataset.uzuToastTemplate || trigger.dataset.uzuToastTrigger,
          stack: trigger.dataset.uzuToastStack,
          trigger
        });
      });
    });
  }

  function initToasts(root = document) {
    queryAll(root, '[data-uzu-toast]').forEach((toast) => {
      initToastInstance(toast);
    });
    initToastTriggers(root);
  }

/* ui/js/panel-navigation.js */
const panelNavRootSelector = '[data-uzu-panel-nav], [data-uzu-panel-index]';

  function getPanelNavTarget(control) {
    return control.dataset.uzuPanelTarget || '';
  }

  function getPanelNavControl(root, target) {
    return getScopedControls(root, '[data-uzu-panel-target]', panelNavRootSelector)
      .find((control) => getPanelNavTarget(control) === target);
  }

  function getPanelNavPanel(target) {
    if (!target) return null;
    try {
      return document.querySelector(target);
    } catch (_) {
      return null;
    }
  }

  function getPanelNavPanels(root, panel) {
    const panels = getScopedControls(root, '[data-uzu-panel-target]', panelNavRootSelector)
      .map((item) => getPanelNavPanel(getPanelNavTarget(item)))
      .filter(Boolean);
    if (panels.length) return [...new Set(panels)];
    const selector = root.dataset.uzuPanelSelector || '.uzu-panel';
    const scope = root.closest(root.dataset.uzuPanelScope || '.uzu-scope, main, body') || root.parentElement || document;
    return queryAll(scope, selector).filter((item) => item === panel || item.parentElement === panel.parentElement);
  }

  function showPanelNavTarget(root, control, options = {}) {
    const target = getPanelNavTarget(control);
    if (!target || isControlDisabled(control)) return null;
    const panel = getPanelNavPanel(target);
    if (!panel) return null;
    const controls = getScopedControls(root, '[data-uzu-panel-target]', panelNavRootSelector);
    controls.forEach((item) => {
      const isActive = item === control;
      item.classList.toggle('is-active', isActive);
      item.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    });
    getPanelNavPanels(root, panel).forEach((item) => {
      item.hidden = item !== panel;
    });
    if (options.updateHash && window.location.hash !== target) {
      window.history.pushState(null, '', target);
    }
    root.dispatchEvent(new CustomEvent('uzu-panel-nav-change', {
      bubbles: true,
      detail: { target, control, panel, nav: root }
    }));
    panel.dispatchEvent(new CustomEvent('uzu-panel-show', {
      bubbles: true,
      detail: { target, control, panel, nav: root }
    }));
    queueIndicatorRefresh(panel, true);
    queueDisclosureHeightRefresh(panel);
    return panel;
  }

  function syncStepNavState(stepNav, activeButton, emit = true) {
    const buttons = getScopedControls(stepNav, '.uzu-step-nav-button', '[data-uzu-step-nav]');
    const enabled = getEnabledControls(buttons);
    const nextButton = activeButton && !isControlDisabled(activeButton) ? activeButton : enabled[0];
    if (!nextButton) return;
    const previousValue = stepNav.dataset.uzuStepNavValue || '';
    const value = getControlValue(nextButton, 'uzuStepValue');
    let reachedActive = false;
    buttons.forEach((button) => {
      const isActive = button === nextButton;
      if (isActive) reachedActive = true;
      button.classList.toggle('is-active', isActive);
      button.classList.toggle('is-complete', !reachedActive && !isControlDisabled(button));
      if (isActive) button.setAttribute('aria-current', 'step');
      else button.removeAttribute('aria-current');
    });
    stepNav.dataset.uzuStepNavValue = value;
    if (emit && value !== previousValue) {
      stepNav.dispatchEvent(new CustomEvent('uzu-step-nav-change', {
        bubbles: true,
        detail: { value, step: nextButton, stepNav, index: buttons.indexOf(nextButton) }
      }));
      stepNav.dispatchEvent(new Event('change', { bubbles: true }));
    }
  }

  function initStepNavs(root = document) {
    queryAll(root, '[data-uzu-step-nav]').forEach((stepNav) => {
      const buttons = getScopedControls(stepNav, '.uzu-step-nav-button', '[data-uzu-step-nav]');
      if (!buttons.length) return;
      const active = buttons.find((button) => button.classList.contains('is-active') || button.getAttribute('aria-current') === 'step');
      syncStepNavState(stepNav, active, false);
      if (!markInitialized(stepNav, 'StepNav')) return;
      stepNav.addEventListener('click', (event) => {
        const button = getScopedEventControl(event, '.uzu-step-nav-button', stepNav, '[data-uzu-step-nav]');
        if (!button || isControlDisabled(button)) return;
        syncStepNavState(stepNav, button);
      });
      stepNav.addEventListener('keydown', (event) => {
        const button = getScopedEventControl(event, '.uzu-step-nav-button', stepNav, '[data-uzu-step-nav]');
        if (!button || isControlDisabled(button)) return;
        let next = null;
        if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = moveActiveControl(buttons, button, 1);
        else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = moveActiveControl(buttons, button, -1);
        else if (event.key === 'Home') next = getEnabledControls(buttons)[0];
        else if (event.key === 'End') next = getEnabledControls(buttons).at(-1);
        if (next) {
          event.preventDefault();
          syncStepNavState(stepNav, next);
          next.focus();
        }
      });
    });
  }

  function showPanelNavFromHash(root) {
    const target = window.location.hash;
    if (!target) return false;
    const control = getPanelNavControl(root, target);
    if (!control) return false;
    showPanelNavTarget(root, control);
    return true;
  }

  function initPanelNavs(root = document) {
    queryAll(root, panelNavRootSelector).forEach((nav) => {
      const controls = getScopedControls(nav, '[data-uzu-panel-target]', panelNavRootSelector);
      if (!controls.length) return;
      const openedFromHash = nav.dataset.uzuPanelHash === 'true' && showPanelNavFromHash(nav);
      if (!openedFromHash) {
        const active = controls.find((control) => control.classList.contains('is-active') || control.getAttribute('aria-pressed') === 'true') || controls[0];
        showPanelNavTarget(nav, active);
      }

      if (!markInitialized(nav, 'PanelNav')) return;
      nav.addEventListener('click', (event) => {
        const control = getScopedEventControl(event, '[data-uzu-panel-target]', nav, panelNavRootSelector);
        if (!control) return;
        showPanelNavTarget(nav, control, { updateHash: nav.dataset.uzuPanelHash === 'true' });
      });
      if (nav.dataset.uzuPanelHash === 'true') {
        const listener = () => showPanelNavFromHash(nav);
        panelNavHashListeners.set(nav, listener);
        window.addEventListener('hashchange', listener);
      }
    });
  }

/* ui/js/tooltips.js */
function initTooltips(root = document) {
    queryAll(root, '[data-uzu-tooltip]').forEach((tooltip) => {
      if (tooltipNodes.has(tooltip)) return;
      if (tooltip.getAttribute('aria-describedby')) return;
      const text = tooltip.getAttribute('data-uzu-tooltip') || '';
      const id = tooltip.id || ensureId(tooltip, 'uzu-tooltip');
      const description = document.createElement('span');
      description.id = `${id}-desc`;
      description.className = 'uzu-sr-only';
      description.textContent = text;
      (document.body || document.documentElement).append(description);
      tooltip.setAttribute('aria-describedby', description.id);
      tooltipNodes.set(tooltip, description);
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

/* ui/js/code-highlight.js */
const codeLanguageAliases = {
    cjs: 'javascript',
    conf: 'ini',
    console: 'shell',
    cs: 'csharp',
    docker: 'dockerfile',
    golang: 'go',
    htm: 'html',
    html: 'xml',
    js: 'javascript',
    jsx: 'javascript',
    jsonc: 'json',
    mjs: 'javascript',
    md: 'markdown',
    patch: 'diff',
    ps: 'powershell',
    ps1: 'powershell',
    py: 'python',
    rb: 'ruby',
    rs: 'rust',
    sh: 'bash',
    svg: 'xml',
    terminal: 'shell',
    toml: 'ini',
    ts: 'typescript',
    tsx: 'typescript',
    xhtml: 'xml',
    yml: 'yaml',
    zsh: 'bash'
  };
  let codeHighlightObserver = null;
  let codeHighlightEventsInitialized = false;
  let codeHighlightEngineReadyListener = null;
  let codeHighlightTabsChangeListener = null;
  let codeHighlightPanelShowListener = null;

  function getHighlightEngine() {
    if (typeof UsuzumiHighlightEngine !== 'undefined') return UsuzumiHighlightEngine;
    const globalTarget = typeof globalThis !== 'undefined' ? globalThis : null;
    return globalTarget?.UsuzumiHighlightEngine || (typeof window !== 'undefined' ? window.UsuzumiHighlightEngine : null) || null;
  }

  function normalizeCodeHighlightMode(value) {
    const mode = String(value || '').trim().toLowerCase();
    return ['auto', 'visible', 'manual'].includes(mode) ? mode : '';
  }

  function getCodeHighlightMode(target) {
    const localRoot = target instanceof Element ? target.closest('[data-uzu-code-highlight]') : null;
    return normalizeCodeHighlightMode(localRoot?.dataset.uzuCodeHighlight)
      || normalizeCodeHighlightMode(document.body?.dataset.uzuCodeHighlight)
      || normalizeCodeHighlightMode(document.documentElement.dataset.uzuCodeHighlight)
      || 'auto';
  }

  function normalizeCodeLanguage(value) {
    const language = String(value || '').trim().toLowerCase().replace(/^language-/, '');
    if (!language || language === 'text' || language === 'txt' || language === 'plain' || language === 'plaintext') return '';
    return codeLanguageAliases[language] || language;
  }

  function inferCodeLanguage(source) {
    const code = String(source || '').trim();
    if (!code) return '';
    if (/^\s*</.test(code)) return 'xml';
    if (/^\s*(?:\{|\[)/.test(code)) return 'json';
    if (/^\s*(?:--[\w-]+|[.#]?[\w-]+\s*\{|@media|@supports|:root)/m.test(code)) return 'css';
    if (/^\s*(?:npm|pnpm|yarn|node|git|cd|mkdir|cp|mv|rm|curl|sudo|export)\b/m.test(code)) return 'bash';
    if (/^\s*(?:#|\- |\* |\d+\. )/m.test(code)) return 'markdown';
    if (/\b(?:import|export|const|let|var|function|return|document|window|class|await|async)\b/.test(code)) return 'javascript';
    return '';
  }

  function getCodeLanguage(element, source) {
    const classLanguage = [...element.classList]
      .find((className) => className.startsWith('language-'));
    return normalizeCodeLanguage(element.dataset.uzuCodeLanguage || classLanguage || inferCodeLanguage(source));
  }

  function getCodeTargets(root = document) {
    const scope = root instanceof Element || root instanceof Document ? root : document;
    const nestedCode = queryAll(scope, '.uzu-code-block pre code, pre.uzu-code-block-body code');
    const plainPre = queryAll(scope, '.uzu-code-block pre, pre.uzu-code-block-body')
      .filter((pre) => !pre.querySelector('code'));
    return [...nestedCode, ...plainPre];
  }


  function highlightCode(source, language = '') {
    const code = String(source ?? '');
    const normalizedLanguage = normalizeCodeLanguage(language);
    const engine = getHighlightEngine();
    if (!engine || typeof engine.highlight !== 'function') {
      const span = document.createElement('span');
      span.textContent = code;
      const fragment = document.createDocumentFragment();
      fragment.append(span);
      return {
        fragment,
        html: span.innerHTML,
        language: normalizedLanguage,
        highlighted: false
      };
    }
    const result = engine.highlight(code, normalizedLanguage);
    const template = document.createElement('template');
    template.innerHTML = result.value || '';
    if (!template.content.childNodes.length) {
      template.content.append(document.createTextNode(code));
    }
    return {
      fragment: template.content,
      html: template.innerHTML,
      language: normalizeCodeLanguage(result.language) || normalizedLanguage,
      highlighted: Boolean(result.value)
    };
  }

  function highlightCodeBlock(target) {
    if (!(target instanceof HTMLElement)) return false;
    const source = target.dataset.uzuCodeSource ?? target.textContent ?? '';
    const language = getCodeLanguage(target, source);
    const engine = getHighlightEngine();
    const signature = `${engine && typeof engine.highlight === 'function' ? 'engine' : 'plain'}:${language || 'auto'}:${source}`;
    if (target.dataset.uzuSyntaxHighlighted === signature) return false;
    const result = highlightCode(source, language);
    target.dataset.uzuCodeSource = source;
    target.dataset.uzuCodeLanguage = result.language || language || '';
    target.dataset.uzuSyntaxHighlighted = signature;
    [...target.classList].forEach((className) => {
      if (className.startsWith('language-')) target.classList.remove(className);
    });
    target.classList.add(`language-${target.dataset.uzuCodeLanguage || 'text'}`);
    target.replaceChildren(result.fragment.cloneNode(true));
    target.dispatchEvent(new CustomEvent('uzu-code-highlight', {
      bubbles: true,
      detail: {
        code: target,
        language: target.dataset.uzuCodeLanguage,
        source,
        highlighted: result.highlighted
      }
    }));
    return true;
  }

  function isCodeTargetNearViewport(target) {
    if (!target.isConnected || !target.getClientRects().length) return false;
    const rect = target.getBoundingClientRect();
    const width = window.innerWidth || document.documentElement.clientWidth || 0;
    const height = window.innerHeight || document.documentElement.clientHeight || 0;
    const margin = 360;
    return rect.bottom >= -margin
      && rect.right >= -margin
      && rect.top <= height + margin
      && rect.left <= width + margin;
  }

  function getCodeHighlightObserver() {
    if (typeof IntersectionObserver === 'undefined') return null;
    if (!codeHighlightObserver) {
      codeHighlightObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting && entry.intersectionRatio <= 0) return;
          codeHighlightObserver.unobserve(entry.target);
          highlightCodeBlock(entry.target);
        });
      }, { rootMargin: '360px 0px' });
    }
    return codeHighlightObserver;
  }

  function queueVisibleCodeHighlight(target) {
    if (isCodeTargetNearViewport(target)) return highlightCodeBlock(target);
    const observer = getCodeHighlightObserver();
    if (!observer) return highlightCodeBlock(target);
    observer.observe(target);
    return false;
  }

  function highlightCodeBlocks(root = document, options = {}) {
    let count = 0;
    getCodeTargets(root).forEach((target) => {
      const mode = getCodeHighlightMode(target);
      if (options.respectMode && mode === 'manual') return;
      const changed = options.respectMode && mode === 'visible'
        ? queueVisibleCodeHighlight(target)
        : highlightCodeBlock(target);
      if (changed) count += 1;
    });
    return count;
  }

  function refreshAutomaticCodeHighlights(root = document) {
    window.requestAnimationFrame(() => {
      highlightCodeBlocks(root, { respectMode: true });
    });
  }

  function initCodeHighlightEvents() {
    if (codeHighlightEventsInitialized) return;
    codeHighlightEngineReadyListener = () => refreshAutomaticCodeHighlights(document);
    codeHighlightTabsChangeListener = (event) => {
      if (event.detail?.panel) refreshAutomaticCodeHighlights(event.detail.panel);
    };
    codeHighlightPanelShowListener = (event) => {
      if (event.detail?.panel) refreshAutomaticCodeHighlights(event.detail.panel);
    };
    window.addEventListener('uzu-code-highlight-engine-ready', codeHighlightEngineReadyListener);
    document.addEventListener('uzu-tabs-change', codeHighlightTabsChangeListener);
    document.addEventListener('uzu-panel-show', codeHighlightPanelShowListener);
    codeHighlightEventsInitialized = true;
  }

  function initCodeHighlight(root = document) {
    initCodeHighlightEvents();
    highlightCodeBlocks(root, { respectMode: true });
  }

  function destroyCodeHighlight(root = document) {
    const isWholeRoot = root === document || root === document.documentElement || root === document.body;
    if (codeHighlightObserver) {
      getCodeTargets(root).forEach((target) => codeHighlightObserver.unobserve(target));
    }
    if (isWholeRoot && codeHighlightObserver) {
      codeHighlightObserver.disconnect();
      codeHighlightObserver = null;
    }
    if (isWholeRoot && codeHighlightEventsInitialized) {
      if (codeHighlightEngineReadyListener) {
        window.removeEventListener('uzu-code-highlight-engine-ready', codeHighlightEngineReadyListener);
      }
      if (codeHighlightTabsChangeListener) {
        document.removeEventListener('uzu-tabs-change', codeHighlightTabsChangeListener);
      }
      if (codeHighlightPanelShowListener) {
        document.removeEventListener('uzu-panel-show', codeHighlightPanelShowListener);
      }
      codeHighlightEngineReadyListener = null;
      codeHighlightTabsChangeListener = null;
      codeHighlightPanelShowListener = null;
      codeHighlightEventsInitialized = false;
    }
  }

  function listCodeLanguages() {
    const engine = getHighlightEngine();
    if (!engine || typeof engine.listLanguages !== 'function') return [];
    return engine.listLanguages().map(normalizeCodeLanguage).filter(Boolean);
  }

  function hasCodeLanguage(language) {
    const normalizedLanguage = normalizeCodeLanguage(language);
    if (!normalizedLanguage) return false;
    const engine = getHighlightEngine();
    if (!engine || typeof engine.hasLanguage !== 'function') return false;
    return engine.hasLanguage(normalizedLanguage);
  }

/* ui/js/markdown.js */
function isSafeMarkdownHref(value) {
    const href = String(value || '').trim();
    if (!href) return false;
    if (href.startsWith('#') || href.startsWith('/') || href.startsWith('./') || href.startsWith('../')) return true;
    try {
      return ['http:', 'https:', 'mailto:', 'tel:'].includes(new URL(href, window.location.href).protocol);
    } catch (_) {
      return false;
    }
  }

  function appendInlineMarkdown(parent, text) {
    const pattern = /(`[^`]+`|\[[^\]]+\]\([^)]+\))/g;
    String(text).split(pattern).forEach((part) => {
      if (!part) return;
      if (part.startsWith('`') && part.endsWith('`') && part.length > 2) {
        const code = document.createElement('code');
        code.className = 'uzu-code';
        code.textContent = part.slice(1, -1);
        parent.append(code);
        return;
      }
      const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      if (link) {
        if (!isSafeMarkdownHref(link[2])) {
          parent.append(document.createTextNode(link[1]));
          return;
        }
        const anchor = document.createElement('a');
        anchor.href = link[2].trim();
        anchor.textContent = link[1];
        parent.append(anchor);
        return;
      }
      parent.append(document.createTextNode(part));
    });
  }

  function createMarkdownBlock(type, content) {
    const element = document.createElement(type);
    appendInlineMarkdown(element, content);
    return element;
  }

  function createCodeBlock(codeText, language = '') {
    const shell = document.createElement('div');
    shell.className = 'uzu-code-block';
    const pre = document.createElement('pre');
    pre.className = 'uzu-code-block-body uzu-scroll';
    const code = document.createElement('code');
    if (language) code.className = `language-${language}`;
    code.textContent = codeText.replace(/\n$/, '');
    pre.append(code);
    const button = document.createElement('button');
    button.className = 'uzu-icon-button uzu-code-block-copy';
    button.type = 'button';
    button.setAttribute('aria-label', 'Copy code');
    button.setAttribute('data-uzu-code-copy', '');
    button.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none"><rect x="8" y="8" width="10" height="10" rx="1.8" stroke="currentColor" stroke-width="1.7"/><path d="M6 15H5.8A1.8 1.8 0 0 1 4 13.2V5.8A1.8 1.8 0 0 1 5.8 4h7.4A1.8 1.8 0 0 1 15 5.8V6" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg><span data-uzu-code-copy-label data-lang="en" data-uzu-copy-text="Copy code" data-uzu-copied-text="Copied" data-uzu-copy-failed-text="Copy failed">Copy</span><span data-uzu-code-copy-label data-lang="zh" data-uzu-copy-text="\u590d\u5236\u4ee3\u7801" data-uzu-copied-text="\u5df2\u590d\u5236" data-uzu-copy-failed-text="\u590d\u5236\u5931\u8d25" data-uzu-language-hidden>\u590d\u5236</span>';
    shell.append(pre, button);
    return shell;
  }

  function syncGeneratedMarkdownLanguage(element) {
    const languageRoot = getClosestLanguageRoot(element);
    if (!languageRoot.hasAttribute('data-language') && !languageRoot.hasAttribute('data-uzu-lang')) return;
    const language = normalizeLanguage(languageRoot.getAttribute('data-language') || languageRoot.getAttribute('data-uzu-lang'));
    syncLanguageContent(languageRoot, language);
  }

  function renderMarkdown(markdown) {
    const fragment = document.createDocumentFragment();
    const lines = String(markdown).replace(/\r\n?/g, '\n').split('\n');
    let paragraph = [];
    let list = null;
    let inFence = false;
    let fenceLanguage = '';
    let fenceLines = [];

    const flushParagraph = () => {
      if (!paragraph.length) return;
      fragment.append(createMarkdownBlock('p', paragraph.join(' ')));
      paragraph = [];
    };
    const flushList = () => {
      if (!list) return;
      fragment.append(list);
      list = null;
    };

    lines.forEach((line) => {
      const fence = line.match(/^\s{0,3}```([\w-]*)\s*$/);
      if (fence) {
        if (inFence) {
          fragment.append(createCodeBlock(fenceLines.join('\n'), fenceLanguage));
          inFence = false;
          fenceLanguage = '';
          fenceLines = [];
        } else {
          flushParagraph();
          flushList();
          inFence = true;
          fenceLanguage = fence[1] || '';
        }
        return;
      }
      if (inFence) {
        fenceLines.push(line);
        return;
      }

      if (!line.trim()) {
        flushParagraph();
        flushList();
        return;
      }

      const heading = line.match(/^(#{1,3})\s+(.+)$/);
      if (heading) {
        flushParagraph();
        flushList();
        fragment.append(createMarkdownBlock(`h${heading[1].length}`, heading[2]));
        return;
      }

      const item = line.match(/^\s*[-*]\s+(.+)$/);
      if (item) {
        flushParagraph();
        if (!list) list = document.createElement('ul');
        const li = document.createElement('li');
        appendInlineMarkdown(li, item[1]);
        list.append(li);
        return;
      }

      paragraph.push(line.trim());
    });

    if (inFence) fragment.append(createCodeBlock(fenceLines.join('\n'), fenceLanguage));
    flushParagraph();
    flushList();
    return fragment;
  }

  function initMarkdown(root = document) {
    queryAll(root, '[data-uzu-markdown]').forEach((element) => {
      if (markInitialized(element, 'Markdown')) {
        const source = element.tagName === 'TEXTAREA' ? element.value : element.textContent;
        element.replaceChildren(renderMarkdown(source));
        syncGeneratedMarkdownLanguage(element);
      }
      initCodeHighlight(element);
      initCodeCopy(element);
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

/* ui/js/boot.js */
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
    for (const fn of [initThemeToggles, initLanguageSelects, initSelects, initTabs, initSegmented, initPaginations, initSwitches, initForms, initSearches, initPasswords, initSteppers, initSliders, initMenus, initTopbarOverflows, initContextMenus, initMenubars, initCommands, initComboboxes, initDataGrids, initHeatmaps, initGalleries, initTrees, initDisclosures, initAccordions, initHoverCards, initPopovers, initTags, initSplitPanes, initResizables, initSidebarLayouts, initJsonViewers, initDiffViewers, initEditors, initDialogs, initToasts, initTooltips, initStepNavs, initPanelNavs, initErrorPages, initMarkdown, initCodeHighlight, initCodeCopy]) {
      try { fn(root); } catch (error) { console.error('[usuzumi]', error); }
    }
    initAutoInit(root);
    queueIndicatorRefresh(root);
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

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => init(), { once: true });
  } else {
    init();
  }
})();
