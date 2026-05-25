(function () {
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

  function syncRootClass() {
    document.documentElement.classList.toggle('msh-root', document.body && document.body.classList.contains('msh-app'));
  }

  function getThemeRoot(trigger) {
    return document.querySelector(trigger.dataset.mshThemeTarget) || document.documentElement;
  }

  function applyTheme(root, theme, key) {
    root.setAttribute('data-theme', theme);
    root.setAttribute('data-msh-theme', theme);
    if (key) storage.set(key, theme);
    document.querySelectorAll('[data-msh-theme-toggle]').forEach((toggle) => {
      const target = getThemeRoot(toggle);
      if (target === root) {
        toggle.classList.toggle('is-dark', theme === 'dark');
        toggle.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
      }
    });
  }

  function initThemeToggles() {
    document.querySelectorAll('[data-msh-theme-toggle]').forEach((toggle) => {
      const root = getThemeRoot(toggle);
      const key = toggle.dataset.mshThemeKey || 'mashiro-theme';
      const saved = storage.get(key);
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      applyTheme(root, saved || root.getAttribute('data-theme') || (prefersDark ? 'dark' : 'light'), key);
      toggle.addEventListener('click', () => {
        const current = root.getAttribute('data-theme') || 'light';
        applyTheme(root, current === 'dark' ? 'light' : 'dark', key);
      });
    });
  }

  function applyLanguage(root, language, key) {
    root.setAttribute('data-language', language);
    root.setAttribute('data-msh-lang', language);
    root.setAttribute('lang', language === 'zh' ? 'zh-CN' : 'en');
    if (key) storage.set(key, language);
    document.querySelectorAll('[data-msh-language-toggle]').forEach((toggle) => {
      const target = document.querySelector(toggle.dataset.mshLanguageTarget) || document.documentElement;
      if (target === root) {
        toggle.textContent = language === 'en' ? 'ZH' : 'EN';
        toggle.setAttribute('aria-label', language === 'en' ? 'Switch to Chinese' : 'Switch to English');
      }
    });
  }

  function initLanguageToggles() {
    document.querySelectorAll('[data-msh-language-toggle]').forEach((toggle) => {
      const root = document.querySelector(toggle.dataset.mshLanguageTarget) || document.documentElement;
      const key = toggle.dataset.mshLanguageKey || 'mashiro-language';
      applyLanguage(root, storage.get(key) || root.getAttribute('data-language') || 'zh', key);
      toggle.addEventListener('click', () => {
        const current = root.getAttribute('data-language') || 'zh';
        applyLanguage(root, current === 'zh' ? 'en' : 'zh', key);
      });
    });
  }

  function closeSelect(select) {
    select.classList.remove('is-open');
    select.querySelectorAll('[data-msh-select-option]').forEach((option) => {
      option.classList.remove('is-active');
      option.setAttribute('tabindex', '-1');
    });
    const trigger = select.querySelector('[data-msh-select-trigger]');
    if (trigger) trigger.setAttribute('aria-expanded', 'false');
  }

  function focusSelectOption(select, index) {
    const options = [...select.querySelectorAll('[data-msh-select-option]')];
    if (!options.length) return;
    const nextIndex = (index + options.length) % options.length;
    options.forEach((option, optionIndex) => {
      const isActive = optionIndex === nextIndex;
      option.classList.toggle('is-active', isActive);
      option.setAttribute('tabindex', isActive ? '0' : '-1');
    });
    options[nextIndex].focus();
  }

  function openSelect(select, focusIndex) {
    const trigger = select.querySelector('[data-msh-select-trigger]');
    const options = [...select.querySelectorAll('[data-msh-select-option]')];
    select.classList.add('is-open');
    if (trigger) trigger.setAttribute('aria-expanded', 'true');
    const selectedIndex = options.findIndex((option) => option.classList.contains('is-selected'));
    focusSelectOption(select, focusIndex ?? (selectedIndex >= 0 ? selectedIndex : 0));
  }

  function chooseSelectOption(select, option) {
    const trigger = select.querySelector('[data-msh-select-trigger]');
    const options = [...select.querySelectorAll('[data-msh-select-option]')];
    options.forEach((item) => {
      item.classList.remove('is-selected');
      item.setAttribute('aria-selected', 'false');
    });
    option.classList.add('is-selected');
    option.setAttribute('aria-selected', 'true');
    if (trigger) {
      trigger.textContent = option.textContent.trim();
      closeSelect(select);
      trigger.focus();
    }
  }

  function initSelects() {
    document.querySelectorAll('[data-msh-select]').forEach((select) => {
      const trigger = select.querySelector('[data-msh-select-trigger]');
      const options = [...select.querySelectorAll('[data-msh-select-option]')];
      if (!trigger || !options.length) return;

      trigger.setAttribute('aria-haspopup', 'listbox');
      trigger.setAttribute('aria-expanded', 'false');
      options.forEach((option) => option.setAttribute('tabindex', '-1'));

      trigger.addEventListener('click', () => {
        if (select.classList.contains('is-open')) {
          closeSelect(select);
        } else {
          const selectedIndex = options.findIndex((option) => option.classList.contains('is-selected'));
          openSelect(select, selectedIndex >= 0 ? selectedIndex : 0);
        }
      });

      trigger.addEventListener('keydown', (event) => {
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

      document.addEventListener('click', (event) => {
        if (!select.contains(event.target)) closeSelect(select);
      });

      select.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
          closeSelect(select);
          trigger.focus();
        }
      });
    });
  }

  function init() {
    syncRootClass();
    initThemeToggles();
    initLanguageToggles();
    initSelects();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
