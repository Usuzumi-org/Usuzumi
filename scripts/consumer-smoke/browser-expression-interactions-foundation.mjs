export const browserExpressionFoundationInteractions = `const click = (element) => element.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
const secondTab = tabs.querySelector('[data-uzu-tab-value="two"]');
const betaSegment = segmented.querySelector('[data-uzu-segment-value="beta"]');
click(secondTab);
click(betaSegment);
const secondPage = paginationRoot.querySelector('[data-uzu-page="2"]');
const nextPage = paginationRoot.querySelector('[data-uzu-page-next]');
click(secondPage);
const paginationPage = paginationRoot.dataset.uzuPaginationPage;
const paginationSecondCurrent = secondPage.getAttribute('aria-current');
const paginationSecondPanelHidden = document.querySelector('[data-uzu-page-panel="2"]').hidden;
const paginationFirstPanelHidden = document.querySelector('[data-uzu-page-panel="1"]').hidden;
const nestedPanelHidden = document.querySelector('[data-uzu-page-panel="nested"]').hidden;
const paginationNextDisabled = nextPage.getAttribute('aria-disabled');
const disabledPaginationRoot = document.querySelector('#consumer-disabled-pagination');
click(disabledPaginationRoot.querySelector('[data-uzu-page-next]'));
const disabledPaginationPage = disabledPaginationRoot.dataset.uzuPaginationPage;
const disabledPaginationActiveText = disabledPaginationRoot.querySelector('[aria-current="page"]').textContent.trim();
const languageHasLegacyToggle = Boolean(document.querySelector('[data-uzu-language-toggle], .uzu-language-toggle'));
const languageInitialHiddenStates = Array.from(document.querySelectorAll('#consumer-language-copy [data-lang]')).map((element) => ({
  lang: element.getAttribute('data-lang'),
  hidden: element.hasAttribute('data-uzu-language-hidden')
}));
click(languageTrigger);
await wait(60);
const languageOpenAnimation = getComputedStyle(languageMenu).animationName;
const languageMenuDisplayOpen = getComputedStyle(languageMenu).display;
const languageExpandedAfterOpen = languageTrigger.getAttribute('aria-expanded');
click(languageEnglishOption);
await wait(60);
const languageCloseAnimation = getComputedStyle(languageMenu).animationName;
const languageRootValue = document.documentElement.getAttribute('data-language');
const languageRootUzuValue = document.documentElement.getAttribute('data-uzu-lang');
const languageRootHtmlLang = document.documentElement.getAttribute('lang');
const languageSelectValue = languageSelect.dataset.uzuLanguageValue;
const languageSelectedText = languageSelect.querySelector('[aria-selected="true"]')?.textContent.trim() || '';
const languageExpandedAfterSelect = languageTrigger.getAttribute('aria-expanded');
const languageHiddenStates = Array.from(document.querySelectorAll('#consumer-language-copy [data-lang]')).map((element) => ({
  lang: element.getAttribute('data-lang'),
  hidden: element.hasAttribute('data-uzu-language-hidden')
}));
const standaloneLanguageRoot = document.querySelector('#consumer-standalone-language-root');
const standaloneLanguageRootValue = standaloneLanguageRoot.getAttribute('data-language');
const standaloneLanguageRootUzuValue = standaloneLanguageRoot.getAttribute('data-uzu-lang');
const standaloneLanguageRootHtmlLang = standaloneLanguageRoot.getAttribute('lang');
const standaloneLanguageHiddenStates = Array.from(standaloneLanguageRoot.querySelectorAll('[data-lang]')).map((element) => ({
  lang: element.getAttribute('data-lang'),
  hidden: element.hasAttribute('data-uzu-language-hidden')
}));
const languageManualDynamicRoot = document.querySelector('#consumer-language-dynamic-manual');
const languageManualDynamicFragment = document.createElement('span');
languageManualDynamicFragment.innerHTML = '<span data-lang="zh">Manual Chinese copy</span><span data-lang="en">Manual English copy</span><span data-lang="ja">Manual Japanese copy</span>';
languageManualDynamicRoot.append(languageManualDynamicFragment);
window.Usuzumi.init(languageManualDynamicFragment);
const languageManualDynamicHiddenStates = Array.from(languageManualDynamicRoot.querySelectorAll('[data-lang]')).map((element) => ({
  lang: element.getAttribute('data-lang'),
  hidden: element.hasAttribute('data-uzu-language-hidden')
}));
const languageAutoDynamicRoot = document.querySelector('#consumer-language-dynamic-auto');
const languageAutoDynamicFragment = document.createElement('span');
languageAutoDynamicFragment.innerHTML = '<span data-lang="zh">Auto Chinese copy</span><span data-lang="en">Auto English copy</span><span data-lang="ja">Auto Japanese copy</span>';
languageAutoDynamicRoot.append(languageAutoDynamicFragment);
await wait(80);
const languageAutoDynamicHiddenStates = Array.from(languageAutoDynamicRoot.querySelectorAll('[data-lang]')).map((element) => ({
  lang: element.getAttribute('data-lang'),
  hidden: element.hasAttribute('data-uzu-language-hidden')
}));
const topbarOverflowWrap = document.querySelector('#consumer-topbar-overflow-wrap');
const topbarOverflow = document.querySelector('#consumer-topbar-overflow');
const topbarOverflowNav = topbarOverflow.querySelector('.uzu-nav');
const topbarOverflowMenu = topbarOverflow.querySelector('[data-uzu-topbar-overflow-menu]');
const topbarOverflowMenuTrigger = topbarOverflowMenu.querySelector('[data-uzu-menu-trigger]');
const topbarOverflowMenuContent = topbarOverflowMenu.querySelector('[data-uzu-menu-content]');
const readTopbarOverflowState = () => ({
  directLinks: topbarOverflowNav.querySelectorAll(':scope > a').length,
  menuItems: topbarOverflowMenuContent.querySelectorAll('.uzu-menu-item').length,
  menuHidden: topbarOverflowMenu.hidden,
  overflow: topbarOverflow.scrollWidth - topbarOverflow.clientWidth,
  leadingTop: Math.round(topbarOverflow.querySelector('.uzu-topbar-leading').getBoundingClientRect().top),
  actionsTop: Math.round(topbarOverflow.querySelector('.uzu-topbar-actions').getBoundingClientRect().top),
  leadingCenter: Math.round(topbarOverflow.querySelector('.uzu-topbar-leading').getBoundingClientRect().top + topbarOverflow.querySelector('.uzu-topbar-leading').getBoundingClientRect().height / 2),
  actionsCenter: Math.round(topbarOverflow.querySelector('.uzu-topbar-actions').getBoundingClientRect().top + topbarOverflow.querySelector('.uzu-topbar-actions').getBoundingClientRect().height / 2)
});
await wait(120);
const topbarOverflowWideState = readTopbarOverflowState();
topbarOverflowWrap.style.width = '520px';
await wait(120);
const topbarOverflowMediumState = readTopbarOverflowState();
topbarOverflowWrap.style.width = '300px';
await wait(120);
const topbarOverflowNarrowState = readTopbarOverflowState();
click(topbarOverflowMenuTrigger);
await wait(80);
const topbarOverflowMenuOpenState = {
  open: topbarOverflowMenu.classList.contains('is-open'),
  expanded: topbarOverflowMenuTrigger.getAttribute('aria-expanded'),
  firstItemRole: topbarOverflowMenuContent.querySelector('.uzu-menu-item')?.getAttribute('role') || '',
  firstItemTabindex: topbarOverflowMenuContent.querySelector('.uzu-menu-item')?.getAttribute('tabindex') || ''
};
click(topbarOverflowMenuContent.querySelector('.uzu-menu-item'));
await wait(160);
const topbarOverflowMenuClosedAfterSelect = !topbarOverflowMenu.classList.contains('is-open');
topbarOverflowWrap.style.width = '760px';
await wait(120);
const topbarOverflowRestoredState = readTopbarOverflowState();
window.Usuzumi.destroy(topbarOverflowWrap);
const topbarOverflowDestroyState = readTopbarOverflowState();
click(selectTrigger);
await wait(60);
const selectOpenAnimation = getComputedStyle(selectMenu).animationName;
const selectHiddenDisclosureTargetHeight = readDisclosureTargetHeight('#consumer-select-hidden-disclosure [data-uzu-disclosure-panel]');
click(selectTrigger);
const selectCloseAnimation = getComputedStyle(selectMenu).animationName;
const selectClosing = select.classList.contains('is-closing');
const selectExpandedAfterClose = selectTrigger.getAttribute('aria-expanded');`;
