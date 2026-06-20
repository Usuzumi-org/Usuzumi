export const browserExpressionSetup = `
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const events = [];
let clipboardText = '';
try {
  Object.defineProperty(navigator, 'clipboard', {
    configurable: true,
    value: {
      writeText: async (value) => {
        clipboardText = value;
      }
    }
  });
} catch (_) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText = async (value) => {
      clipboardText = value;
    };
  }
}
if (!navigator.clipboard?.writeText) {
  navigator.clipboard = {
    writeText: async (value) => {
      clipboardText = value;
    }
  };
}
const originalExecCommand = document.execCommand?.bind(document);
document.execCommand = (command, ...args) => {
  if (String(command).toLowerCase() === 'copy') {
    const active = document.activeElement;
    clipboardText = active && 'value' in active ? active.value : String(window.getSelection?.() || '');
    return true;
  }
  return originalExecCommand ? originalExecCommand(command, ...args) : false;
};
const themeToggle = document.querySelector('#consumer-theme-toggle');
const pageWidthTarget = document.querySelector('#consumer-page-width');
const pageWidth = pageWidthTarget.getBoundingClientRect().width;
pageWidthTarget.style.setProperty('--uzu-page-max-width', '520px');
const pageWidthCustom = pageWidthTarget.getBoundingClientRect().width;
const measureWidth = document.querySelector('#consumer-measure').getBoundingClientRect().width;
const tabs = document.querySelector('[data-uzu-tabs]');
const segmented = document.querySelector('[data-uzu-segmented]');
const paginationRoot = document.querySelector('#consumer-pagination');
const languageSelect = document.querySelector('#consumer-language-select');
const languageTrigger = document.querySelector('#consumer-language-trigger');
const languageMenu = document.querySelector('#consumer-language-menu');
const languageEnglishOption = document.querySelector('#consumer-language-en');
const select = document.querySelector('#consumer-select');
const selectTrigger = select.querySelector('[data-uzu-select-trigger]');
const selectMenu = select.querySelector('.uzu-select-menu');
const combobox = document.querySelector('#consumer-combobox');
const comboboxInput = combobox.querySelector('[data-uzu-combobox-input]');
const comboboxList = combobox.querySelector('[data-uzu-combobox-list]');
const dataGrid = document.querySelector('#consumer-data-grid');
const plainDataGrid = document.querySelector('#consumer-data-grid-plain');
const multiDataGrid = document.querySelector('#consumer-data-grid-multi');
const multiDataGridSelectAll = multiDataGrid.querySelector('[data-uzu-grid-select-all]');
const multiDataGridEmpty = multiDataGrid.querySelector('[data-uzu-grid-empty]');
const heatmap = document.querySelector('#consumer-heatmap');
const staticHeatmap = document.querySelector('#consumer-static-heatmap');
const gallery = document.querySelector('#consumer-gallery');
const jsonGallery = document.querySelector('#consumer-json-gallery');
const directoryGallery = document.querySelector('#consumer-directory-gallery');
const tree = document.querySelector('#consumer-tree');
const splitPane = document.querySelector('#consumer-split-pane');
const splitResizer = splitPane.querySelector('[data-uzu-split-resizer]');
const resizable = document.querySelector('#consumer-resizable');
const resizableHandle = resizable.querySelector('[data-uzu-resizable-handle]');
const jsonViewer = document.querySelector('#consumer-json-viewer');
const jsonEscapedKeyViewer = document.querySelector('#consumer-json-escaped-key-viewer');
const diffViewer = document.querySelector('#consumer-diff-viewer');
const markdownEditor = document.querySelector('#consumer-markdown-editor');
const markdownEditorSource = markdownEditor.querySelector('[data-uzu-markdown-source]');
const markdownEditorPreview = markdownEditor.querySelector('[data-uzu-markdown-preview]');
const inlineEditor = document.querySelector('#consumer-inline-editor');
const consumerPlainInput = document.querySelector('#consumer-field');
const consumerNotesTextarea = document.querySelector('#consumer-notes-textarea');
const consumerCodeEditor = document.querySelector('#consumer-code-editor');
const consumerPlainEditor = document.querySelector('#consumer-plain-editor');
const disclosure = document.querySelector('#consumer-disclosure');
const disclosureTrigger = disclosure.querySelector('[data-uzu-disclosure-trigger]');
const disclosurePanel = disclosure.querySelector('[data-uzu-disclosure-panel]');
const search = document.querySelector('#consumer-search');
const searchInput = document.querySelector('#consumer-search-input');
const searchClear = search.querySelector('[data-uzu-search-clear]');
const password = document.querySelector('#consumer-password');
const passwordInput = document.querySelector('#consumer-password-input');
const passwordToggle = password.querySelector('[data-uzu-password-toggle]');
const stepper = document.querySelector('#consumer-stepper');
const stepperInput = document.querySelector('#consumer-stepper-input');
const stepperIncrement = stepper.querySelector('[data-uzu-stepper-increment]');
const newEvents = [];
const menu = document.querySelector('#consumer-menu');
const menuTrigger = menu.querySelector('[data-uzu-menu-trigger]');
const menuContent = menu.querySelector('[data-uzu-menu-content]');
const menuRename = menu.querySelector('[data-uzu-menu-value="rename"]');
const contextMenu = document.querySelector('#consumer-context-menu');
const contextTarget = document.querySelector('#consumer-context-target');
const contextContent = contextMenu.querySelector('[data-uzu-menu-content]');
const menubar = document.querySelector('#consumer-menubar');
const command = document.querySelector('#consumer-command');
const commandInput = command.querySelector('[data-uzu-command-input]');
const accordion = document.querySelector('#consumer-accordion');
const stepNav = document.querySelector('#consumer-step-nav');
const hoverCard = document.querySelector('#consumer-hover-card');
const popover = document.querySelector('#consumer-popover');
const popoverTrigger = popover.querySelector('[data-uzu-popover-trigger]');
const popoverContent = popover.querySelector('[data-uzu-popover-content]');
const tagSelectable = document.querySelector('#consumer-tag-selectable');
const tagCloseable = document.querySelector('#consumer-tag-closeable');
const tagCloseButton = tagCloseable.querySelector('[data-uzu-tag-close]');
const tagList = document.querySelector('#consumer-tag-list');
const tagAddButton = document.querySelector('#consumer-tag-add');
const consumerForm = document.querySelector('#consumer-form');
const consumerRequiredField = document.querySelector('#consumer-required-field');
const consumerRequiredInput = document.querySelector('#consumer-required-input');
const canContainProbe = (element) => element && !['INPUT', 'TEXTAREA', 'SELECT', 'BUTTON'].includes(element.tagName);
const readResolvedBorderToken = (token, context = document.body) => {
  const host = canContainProbe(context) ? context : context?.parentElement || document.body;
  const probe = document.createElement('span');
  probe.style.cssText = 'position:fixed;left:-9999px;top:-9999px;border:1px solid var(' + token + ');';
  host.append(probe);
  const value = getComputedStyle(probe).borderTopColor;
  probe.remove();
  return value;
};
const readResolvedColorValue = (value, context = document.body) => {
  if (!value) return '';
  const host = canContainProbe(context) ? context : context?.parentElement || document.body;
  const probe = document.createElement('span');
  probe.style.cssText = 'position:fixed;left:-9999px;top:-9999px;border:1px solid transparent;';
  probe.style.borderTopColor = value;
  host.append(probe);
  const resolved = getComputedStyle(probe).borderTopColor;
  probe.remove();
  return resolved;
};
const readFocusProbe = async (target, surface = target, borderProperty = 'borderTopColor') => {
  const beforeStyle = getComputedStyle(surface);
  const beforeBorderColor = beforeStyle[borderProperty];
  const editFocusBorderColor = readResolvedBorderToken('--uzu-edit-focus-border', surface);
  const fgStrongColor = readResolvedBorderToken('--uzu-fg-strong', surface);
  try {
    window.focus();
  } catch (_) {
    /* Ignore focus restoration limits in headless browsers. */
  }
  await wait(0);
  target.focus();
  await wait(0);
  const surfaceStyle = getComputedStyle(surface);
  const targetStyle = getComputedStyle(target);
  const probe = {
    active: document.activeElement === target,
    beforeBorderColor,
    borderColor: surfaceStyle[borderProperty],
    borderTopColor: surfaceStyle.borderTopColor,
    borderRightColor: surfaceStyle.borderRightColor,
    boxShadow: surfaceStyle.boxShadow,
    targetBoxShadow: targetStyle.boxShadow,
    editFocusBorderColor,
    fgStrongColor,
    inertAncestor: Boolean(target.closest('[inert]')),
    ariaHiddenAncestor: Boolean(target.closest('[aria-hidden="true"]')),
    documentHasFocus: document.hasFocus(),
    matchesFocus: target.matches(':focus')
  };
  target.blur();
  await wait(0);
  return probe;
};
const focusVisible = (target) => {
  try {
    target.focus({ focusVisible: true });
  } catch (_) {
    target.focus();
  }
};
const readDisclosureTargetHeight = (selector) => Number.parseFloat(document.querySelector(selector)?.style.getPropertyValue('--uzu-disclosure-panel-height') || '0');
menu.addEventListener('uzu-menu-select', (event) => newEvents.push('menu:' + event.detail.value));
contextMenu.addEventListener('uzu-menu-select', (event) => newEvents.push('context:' + event.detail.value));
menubar.addEventListener('uzu-menubar-change', (event) => newEvents.push('menubar:' + event.detail.value));
command.addEventListener('uzu-command-filter', (event) => newEvents.push('command-filter:' + event.detail.visibleCount));
command.addEventListener('uzu-command-select', (event) => newEvents.push('command:' + event.detail.value));
combobox.addEventListener('uzu-combobox-change', (event) => newEvents.push('combobox:' + event.detail.value));
dataGrid.addEventListener('uzu-data-grid-sort', (event) => newEvents.push('grid-sort:' + event.detail.direction));
dataGrid.addEventListener('uzu-data-grid-select', (event) => newEvents.push('grid-select:' + event.detail.value));
multiDataGrid.addEventListener('uzu-data-grid-select-all', (event) => newEvents.push('grid-all:' + event.detail.rows.length));
plainDataGrid.addEventListener('uzu-data-grid-select', (event) => newEvents.push('plain-grid-select:' + event.detail.value));
heatmap.addEventListener('uzu-heatmap-select', (event) => newEvents.push('heatmap:' + event.detail.date + ':' + event.detail.events.length));
gallery.addEventListener('uzu-gallery-load', (event) => newEvents.push('gallery-load:' + event.detail.items.length + ':' + event.detail.source));
gallery.addEventListener('uzu-gallery-select', (event) => newEvents.push('gallery-select:' + event.detail.index + ':' + Boolean(event.detail.viewer)));
jsonGallery.addEventListener('uzu-gallery-load', (event) => newEvents.push('json-gallery-load:' + event.detail.items.length));
directoryGallery.addEventListener('uzu-gallery-load', (event) => newEvents.push('directory-gallery-load:' + event.detail.items.length));
document.addEventListener('uzu-image-viewer-open', (event) => newEvents.push('viewer-open:' + (event.detail.item?.caption || '')));
document.addEventListener('uzu-image-viewer-close', (event) => newEvents.push('viewer-close:' + (event.detail.item?.caption || '')));
document.addEventListener('uzu-image-viewer-zoom', (event) => newEvents.push('viewer-zoom:' + Number(event.detail.scale).toFixed(2)));
tree.addEventListener('uzu-tree-toggle', (event) => newEvents.push('tree-toggle:' + event.detail.expanded));
splitPane.addEventListener('uzu-split-resize', (event) => newEvents.push('split:' + Math.round(event.detail.size)));
resizable.addEventListener('uzu-resizable-resize', () => newEvents.push('resizable'));
markdownEditor.addEventListener('uzu-markdown-editor-change', () => newEvents.push('markdown-editor-change'));
markdownEditor.addEventListener('uzu-markdown-editor-render', () => newEvents.push('markdown-editor'));
inlineEditor.addEventListener('uzu-inline-editor-change', () => newEvents.push('inline-editor'));
accordion.addEventListener('uzu-accordion-change', (event) => newEvents.push('accordion:' + event.detail.open));
stepNav.addEventListener('uzu-step-nav-change', (event) => newEvents.push('step-nav:' + event.detail.value));
hoverCard.addEventListener('uzu-hover-card-open', () => newEvents.push('hover:open'));
popover.addEventListener('uzu-popover-open', () => newEvents.push('popover:open'));
popover.addEventListener('uzu-popover-close', () => newEvents.push('popover:close'));
tagSelectable.addEventListener('uzu-tag-change', (event) => newEvents.push('tag:' + event.detail.selected));
tagCloseable.addEventListener('uzu-tag-close', (event) => newEvents.push('tag-close:' + event.detail.value));
tagList.addEventListener('uzu-tag-add', (event) => newEvents.push('tag-add:' + event.detail.label + ':' + event.detail.value));
consumerForm.addEventListener('uzu-form-validate', (event) => newEvents.push('form:' + event.detail.valid));
tabs.addEventListener('uzu-tabs-change', (event) => events.push(event.detail.value));
segmented.addEventListener('uzu-segmented-change', (event) => events.push(event.detail.value));
paginationRoot.addEventListener('uzu-pagination-change', (event) => events.push('page:' + event.detail.value));
password.addEventListener('uzu-password-toggle', (event) => events.push('password:' + event.detail.visible));
stepper.addEventListener('uzu-stepper-change', (event) => events.push('stepper:' + event.detail.value));
languageSelect.addEventListener('uzu-language-change', (event) => events.push('language:' + event.detail.language + ':' + event.detail.previousLanguage + ':' + event.detail.htmlLang));
`;
