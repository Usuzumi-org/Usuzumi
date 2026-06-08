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
