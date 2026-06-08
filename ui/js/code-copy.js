  function getCodeCopyLabelText(button, label, key, fallback) {
    return label?.dataset[key] || button.dataset[key] || fallback;
  }

  function getCodeCopyLabels(button) {
    return queryAll(button, '[data-uzu-code-copy-label]');
  }

  function setCodeCopyLabel(button, key, fallback) {
    const labels = getCodeCopyLabels(button);
    const nextLabel = button.dataset[key] || fallback;
    button.setAttribute('aria-label', nextLabel);
    if (labels.length) {
      labels.forEach((label) => {
        label.textContent = getCodeCopyLabelText(button, label, key, fallback);
      });
      return;
    }
    button.textContent = nextLabel;
  }

  function restoreCodeCopyLabel(button) {
    const labels = getCodeCopyLabels(button);
    if (labels.length) {
      button.setAttribute('aria-label', button.dataset.uzuCopyText || 'Copy code');
      labels.forEach((label) => {
        label.textContent = getCodeCopyLabelText(button, label, 'uzuCopyText', label.dataset.uzuCodeCopyDefault || 'Copy');
      });
      return;
    }
    const defaultContent = codeCopyDefaultContent.get(button);
    if (defaultContent) {
      button.replaceChildren(...defaultContent.map((node) => node.cloneNode(true)));
      button.setAttribute('aria-label', button.dataset.uzuCopyText || 'Copy code');
      return;
    }
    button.setAttribute('aria-label', button.dataset.uzuCopyText || 'Copy code');
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
        if (!label.dataset.uzuCodeCopyDefault) label.dataset.uzuCodeCopyDefault = label.textContent.trim();
      });
      if (!labels.length && !codeCopyDefaultContent.has(button)) {
        codeCopyDefaultContent.set(button, [...button.childNodes].map((node) => node.cloneNode(true)));
      }
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
