export const browserExpressionOverlayInteractions = `const field = document.querySelector('.uzu-field');
const fieldLabel = field.querySelector('.uzu-label');
const fieldInput = field.querySelector('.uzu-input');
const fieldGap = Number.parseFloat(getComputedStyle(field).gap);
const fieldLabelBottom = fieldLabel.getBoundingClientRect().bottom;
const fieldInputTop = fieldInput.getBoundingClientRect().top;
const selectOpenTransform = getComputedStyle(selectMenu).transform;
const dialogOpenAnimation = getComputedStyle(dialog).animationName;
const dialogOpenTransform = getComputedStyle(dialog).transform;
const toast = document.querySelector('[data-uzu-toast]');
const toastContent = toast.querySelector('.uzu-toast-content');
const toastClose = toast.querySelector('.uzu-toast-close');
const toastTitle = toast.querySelector('h3');
const toastRole = toast.getAttribute('role');
const toastLive = toast.getAttribute('aria-live');
const toastAtomic = toast.getAttribute('aria-atomic');
const toastWidthDefault = toast.getBoundingClientRect().width;
const toastLeftDefault = toast.getBoundingClientRect().left;
const toastRightDefault = toast.getBoundingClientRect().right;
const toastContentLeftDefault = toastContent.getBoundingClientRect().left;
const toastContentRightDefault = toastContent.getBoundingClientRect().right;
const toastCloseRightDefault = toastClose.getBoundingClientRect().right;
const toastCloseWidth = toastClose.getBoundingClientRect().width;
const toastTitlePaddingRight = Number.parseFloat(getComputedStyle(toastTitle).paddingRight);
toast.style.setProperty('--uzu-toast-content-end-offset', '8px');
const toastContentRightCustom = toastContent.getBoundingClientRect().right;
const toastCloseRightCustom = toastClose.getBoundingClientRect().right;
const toastOpenTransform = getComputedStyle(toast).transform;
const tooltipTransform = getComputedStyle(document.querySelector('[data-uzu-tooltip]'), '::after').transform;
const tooltipZh = getComputedStyle(document.querySelector('#consumer-tooltip-zh'), '::after');
const tooltipZhWidth = Number.parseFloat(tooltipZh.width);
const tooltipZhHeight = Number.parseFloat(tooltipZh.height);
const tooltipCustom = document.querySelector('#consumer-tooltip-custom');
const tooltipCustomDescription = tooltipCustom.getAttribute('aria-describedby');
const tooltipCustomHelpExists = Boolean(document.querySelector('#consumer-tooltip-custom-help'));
const tooltipDestroyRoot = document.createElement('div');
tooltipDestroyRoot.innerHTML = '<button id="consumer-tooltip-generated-destroy" class="uzu-icon-button" type="button" data-uzu-tooltip="Generated" aria-label="Generated tooltip">?</button><button id="consumer-tooltip-custom-destroy" class="uzu-icon-button" type="button" data-uzu-tooltip="External" aria-describedby="consumer-tooltip-external-destroy-help" aria-label="External tooltip">?</button><span id="consumer-tooltip-external-destroy-help" class="uzu-sr-only">External description</span>';
document.body.append(tooltipDestroyRoot);
window.Usuzumi.init(tooltipDestroyRoot);
const generatedDestroyTooltip = document.querySelector('#consumer-tooltip-generated-destroy');
const generatedDestroyDescriptionId = generatedDestroyTooltip.getAttribute('aria-describedby');
const generatedDestroyDescriptionCreated = Boolean(generatedDestroyDescriptionId && document.getElementById(generatedDestroyDescriptionId));
window.Usuzumi.destroy(tooltipDestroyRoot);
const generatedDestroyDescriptionRemoved = Boolean(generatedDestroyDescriptionId && !document.getElementById(generatedDestroyDescriptionId));
const generatedDestroyTooltipCleared = !generatedDestroyTooltip.hasAttribute('aria-describedby');
const customDestroyTooltipDescription = document.querySelector('#consumer-tooltip-custom-destroy').getAttribute('aria-describedby');
tooltipDestroyRoot.remove();
const gridToastHeight = document.querySelector('#consumer-grid-toast').getBoundingClientRect().height;
const gridTallCardHeight = document.querySelector('#consumer-tall-card').getBoundingClientRect().height;
const toastTrigger = document.querySelector('#consumer-toast-trigger');
const toastStack = document.querySelector('#consumer-toast-stack');
const triggeredToastOpenEvents = [];
toastStack.addEventListener('uzu-toast-open', (event) => {
  triggeredToastOpenEvents.push(event.detail.toast?.querySelector('h3')?.textContent.trim() || '');
});
const triggeredToastInitialCount = toastStack.querySelectorAll('[data-uzu-toast]').length;
click(toastTrigger);
await wait(80);
const triggeredToast = toastStack.querySelector('[data-uzu-toast]');
const triggeredToastCountAfterOpen = toastStack.querySelectorAll('[data-uzu-toast]').length;
const triggeredToastTitle = triggeredToast?.querySelector('h3')?.textContent.trim() || '';
const triggeredToastClose = triggeredToast?.querySelector('[data-uzu-toast-close]');
const triggeredToastCloseHasSvg = Boolean(triggeredToastClose?.querySelector('svg'));
const triggeredToastRole = triggeredToast?.getAttribute('role') || '';
const triggeredToastLive = triggeredToast?.getAttribute('aria-live') || '';
click(triggeredToastClose);
await wait(260);
const triggeredToastRemovedAfterClose = !toastStack.querySelector('[data-uzu-toast]');
const explicitMissingStackToast = document.createElement('article');
explicitMissingStackToast.className = 'uzu-toast';
explicitMissingStackToast.innerHTML = '<div class="uzu-toast-content"><h3>Wrong stack</h3></div><button type="button" data-uzu-toast-close>Close</button>';
const missingStackToastBeforeCount = toastStack.querySelectorAll('[data-uzu-toast]').length;
const missingStackToastResult = window.Usuzumi.showToast({
  toast: explicitMissingStackToast,
  stack: '#consumer-missing-toast-stack'
});
const missingStackToastAfterCount = toastStack.querySelectorAll('[data-uzu-toast]').length;
const missingStackToastReturnedNull = missingStackToastResult === null;
const missingStackToastMutated = explicitMissingStackToast.hasAttribute('data-uzu-toast')
  || explicitMissingStackToast.hasAttribute('role')
  || explicitMissingStackToast.hasAttribute('aria-live')
  || explicitMissingStackToast.isConnected;
click(dialog.querySelector('[data-uzu-dialog-close]'));
const dialogCloseAnimation = getComputedStyle(dialog).animationName;
const dialogCloseTransform = getComputedStyle(dialog).transform;
const dialogClosing = dialog.classList.contains('is-closing');
const dialogHiddenWhileClosing = dialog.hidden;
const overlayClosing = overlay.classList.contains('is-closing');
click(toast.querySelector('[data-uzu-toast-close]'));
const toastCloseTransform = getComputedStyle(toast).transform;
const closeEventsBeforeAnimationEnd = dialogCloseEvents.length;
await wait(260);
const closeEventTriggerAfterAnimation = dialogCloseEvents.join(',');
click(secondDialogTrigger);
await wait(80);
const secondDialogOpenBeforeOverlayChecks = secondDialog.classList.contains('is-open');
const focusedSecondDialogBeforeOverlayChecks = document.activeElement === secondDialog.querySelector('[data-uzu-dialog-close]');
click(secondDialog.querySelector('[data-uzu-dialog-close]'));
await wait(260);
const dialogIsolationRestored = ![...overlay.parentElement.children].some((child) => child.hasAttribute('inert'))
  && document.documentElement.style.overflow === ''
  && document.body.style.overflow === '';
click(dialogTrigger);
await wait(80);
const nestedDialogTrigger = dialog.querySelector('#consumer-nested-dialog-trigger');
const nestedDialog = dialog.querySelector('#consumer-dialog-nested');
const nestedOverlay = nestedDialog.closest('[data-uzu-dialog-overlay]');
click(nestedDialogTrigger);
await wait(80);
const nestedDialogOpen = nestedDialog.classList.contains('is-open') && !nestedDialog.hidden;
const nestedParentStillOpen = dialog.classList.contains('is-open') && !dialog.hidden;
const nestedOverlayInteractive = !nestedOverlay.hasAttribute('inert') && nestedOverlay.getAttribute('aria-hidden') !== 'true';
const nestedScrollStillLocked = document.documentElement.style.overflow === 'hidden' && document.body.style.overflow === 'hidden';
const nestedFocused = document.activeElement === nestedDialog.querySelector('[data-uzu-dialog-close]');
click(nestedDialog.querySelector('[data-uzu-dialog-close]'));
await wait(260);
const nestedClosed = nestedDialog.hidden && nestedOverlay.hidden;
const nestedParentOpenAfterChildClose = dialog.classList.contains('is-open') && !dialog.hidden;
const nestedFocusReturnedToTrigger = document.activeElement === nestedDialogTrigger;
const nestedScrollLockedAfterChildClose = document.documentElement.style.overflow === 'hidden' && document.body.style.overflow === 'hidden';
click(dialog.querySelector('[data-uzu-dialog-close]'));
await wait(260);
const nestedIsolationRestoredAfterParentClose = document.documentElement.style.overflow === ''
  && document.body.style.overflow === ''
  && ![...overlay.parentElement.children].some((child) => child.hasAttribute('inert'));
click(dialogTrigger);
await wait(80);
const destroyDialogRoot = dialog.closest('[data-uzu-dialog-overlay]');
window.Usuzumi.destroy(destroyDialogRoot);
const destroyDialogHidden = dialog.hidden;
const destroyOverlayHidden = destroyDialogRoot.hidden;
const drawerTrigger = document.querySelector('#consumer-drawer-trigger');
const drawer = document.querySelector('#consumer-drawer');
click(drawerTrigger);
await wait(80);
const drawerOpenAnimation = getComputedStyle(drawer).animationName;
const drawerOpenTransform = getComputedStyle(drawer).transform;
const drawerWidth = Math.round(drawer.getBoundingClientRect().width);
click(drawer.querySelector('[data-uzu-dialog-close]'));
await wait(120);
const alertDialogTrigger = document.querySelector('#consumer-alert-dialog-trigger');
const alertDialog = document.querySelector('#consumer-alert-dialog');
click(alertDialogTrigger);
await wait(80);
const alertDialogRole = alertDialog.getAttribute('role');
const alertDialogBorderLeftWidth = Math.round(Number.parseFloat(getComputedStyle(alertDialog).borderLeftWidth));
const alertDialogAccentColor = getComputedStyle(alertDialog).borderLeftColor;
click(alertDialog.querySelector('[data-uzu-dialog-close]'));
await wait(80);
const originalMatchMedia = window.matchMedia?.bind(window);
let themePreferenceListener = null;
let themePreferenceListenerAdds = 0;
let themePreferenceListenerRemoves = 0;
const fakeThemeMedia = {
  matches: false,
  media: '(prefers-color-scheme: dark)',
  addEventListener(type, listener) {
    if (type === 'change') {
      themePreferenceListener = listener;
      themePreferenceListenerAdds += 1;
    }
  },
  removeEventListener(type, listener) {
    if (type === 'change' && listener === themePreferenceListener) {
      themePreferenceListenerRemoves += 1;
    }
  }
};
window.Usuzumi.destroy(document);
document.documentElement.setAttribute('data-theme-mode', 'auto');
document.documentElement.setAttribute('data-theme', 'light');
document.documentElement.setAttribute('data-uzu-theme', 'light');
window.matchMedia = (query) => query === '(prefers-color-scheme: dark)' ? fakeThemeMedia : originalMatchMedia?.(query);
window.Usuzumi.init(document);
const themeMediaReinitListenerRegistered = themePreferenceListenerAdds === 1
  && document.documentElement.dataset.uzuThemeMediaListener === 'true'
  && typeof themePreferenceListener === 'function';
fakeThemeMedia.matches = true;
if (themePreferenceListener) themePreferenceListener({ matches: true });
const themeAfterReinitPreferenceChange = document.documentElement.getAttribute('data-theme');
window.Usuzumi.destroy(document);
const themeMediaReinitListenerRemoved = themePreferenceListenerRemoves === 1
  && document.documentElement.dataset.uzuThemeMediaListener !== 'true';
window.matchMedia = originalMatchMedia;
document.documentElement.setAttribute('data-theme-mode', 'light');
document.documentElement.setAttribute('data-theme', 'light');
document.documentElement.setAttribute('data-uzu-theme', 'light');`;
