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
