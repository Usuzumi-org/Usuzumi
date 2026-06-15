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
