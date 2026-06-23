function assertHardEditorFocusProbe(probe, label) {
if (!probe || !probe.active) throw new Error(`Browser consumer ${label} did not receive focus`);
if (probe.boxShadow !== 'none' || probe.targetBoxShadow !== 'none') throw new Error(`Browser consumer ${label} focus should not use a blurred or outer shadow ring: ${JSON.stringify(probe)}`);
if (!probe.borderColor || probe.borderColor === probe.beforeBorderColor) throw new Error(`Browser consumer ${label} focus should strengthen a hard border: ${JSON.stringify(probe)}`);
if (probe.editFocusBorderColor && probe.borderColor !== probe.editFocusBorderColor) throw new Error(`Browser consumer ${label} focus should use the edit focus border token: ${JSON.stringify(probe)}`);
if (probe.fgStrongColor && probe.borderColor === probe.fgStrongColor) throw new Error(`Browser consumer ${label} focus should not reuse the strong text color as its edit border: ${JSON.stringify(probe)}`);
}

function assertEnglishLanguageVisibility(states, label) {
if (!Array.isArray(states) || !states.some((item) => item.lang === 'en' && !item.hidden) || !states.some((item) => item.lang === 'zh' && item.hidden) || !states.some((item) => item.lang === 'ja' && item.hidden)) throw new Error(`Browser consumer ${label} language visibility did not match English: ${JSON.stringify(states)}`);
}

export function assertConsumerFoundationResult(value) {
if (!value.hasApi) throw new Error('Browser consumer page did not expose window.Usuzumi');
if (!value.rootClass) throw new Error('Browser consumer page did not keep uzu-root');
if (value.restoredTheme !== 'dark' || !value.themeToggleDark) throw new Error('Browser consumer theme did not restore the saved mode');
if (!(value.pageWidth > value.pageWidthCustom) || Math.round(value.pageWidthCustom) !== 520) throw new Error('Browser consumer page max-width variable did not apply');
if (Math.round(value.measureWidth) !== 320) throw new Error(`Browser consumer measure width did not apply: ${value.measureWidth}`);
if (value.tabValue !== 'two' || value.tabSelected !== 'true') throw new Error('Browser consumer tabs did not respond');
if (value.tabsIndicator !== 'true' || value.tabsIndicatorWidth <= 0) throw new Error('Browser consumer tabs did not expose animated indicator metrics');
if (value.tabsIndicatorTransform === 'none') throw new Error('Browser consumer tabs indicator did not move');
if (Math.abs(value.tabsIndicatorWidthAfterLanguage - value.tabsActiveWidthAfterLanguage) > 1) throw new Error('Browser consumer tabs indicator did not refresh after language change');
if (value.languageHasLegacyToggle) throw new Error('Browser consumer should not expose retired language toggle controls');
if (value.languageOpenAnimation !== 'uzu-menu-in' || value.languageCloseAnimation !== 'uzu-menu-out' || value.languageMenuDisplayOpen !== 'grid') throw new Error(`Browser consumer language selector did not open as a public listbox menu: ${JSON.stringify({ open: value.languageOpenAnimation, close: value.languageCloseAnimation, display: value.languageMenuDisplayOpen })}`);
if (value.languageExpandedAfterOpen !== 'true' || value.languageExpandedAfterSelect !== 'false') throw new Error('Browser consumer language selector did not sync trigger ARIA state');
if (value.languageRootValue !== 'en' || value.languageRootUzuValue !== 'en' || value.languageRootHtmlLang !== 'en' || value.languageSelectValue !== 'en' || value.languageSelectedText !== 'English') throw new Error(`Browser consumer language selector did not sync root and option state: ${JSON.stringify({ language: value.languageRootValue, uzu: value.languageRootUzuValue, html: value.languageRootHtmlLang, select: value.languageSelectValue, selected: value.languageSelectedText })}`);
if (!Array.isArray(value.languageInitialHiddenStates) || !value.languageInitialHiddenStates.some((item) => item.lang === 'zh' && !item.hidden) || !value.languageInitialHiddenStates.some((item) => item.lang === 'en' && item.hidden) || !value.languageInitialHiddenStates.some((item) => item.lang === 'ja' && item.hidden)) throw new Error(`Browser consumer initial language visibility did not sync: ${JSON.stringify(value.languageInitialHiddenStates)}`);
assertEnglishLanguageVisibility(value.languageHiddenStates, 'static');
if (value.standaloneLanguageRootValue !== 'en' || value.standaloneLanguageRootUzuValue !== 'en' || value.standaloneLanguageRootHtmlLang !== 'en') throw new Error(`Browser consumer standalone language root did not restore saved language: ${JSON.stringify({ language: value.standaloneLanguageRootValue, uzu: value.standaloneLanguageRootUzuValue, html: value.standaloneLanguageRootHtmlLang })}`);
if (!Array.isArray(value.standaloneLanguageHiddenStates) || !value.standaloneLanguageHiddenStates.some((item) => item.lang === 'en' && !item.hidden) || !value.standaloneLanguageHiddenStates.some((item) => item.lang === 'zh' && item.hidden)) throw new Error(`Browser consumer standalone language root visibility did not match restored language: ${JSON.stringify(value.standaloneLanguageHiddenStates)}`);
assertEnglishLanguageVisibility(value.languageManualDynamicHiddenStates, 'manual dynamic');
assertEnglishLanguageVisibility(value.languageAutoDynamicHiddenStates, 'auto-init dynamic');
if (!value.events.includes('language:en:zh:en')) throw new Error(`Browser consumer language selector did not emit uzu-language-change: ${JSON.stringify(value.events)}`);
if (value.segmentValue !== 'beta' || value.segmentPressed !== 'true') throw new Error('Browser consumer segmented control did not respond');
if (value.segmentedIndicator !== 'true' || value.segmentedIndicatorWidth <= 0) throw new Error('Browser consumer segmented control did not expose animated indicator metrics');
if (value.segmentedIndicatorTransform === 'none') throw new Error('Browser consumer segmented indicator did not move');
if (Math.abs(value.segmentedIndicatorWidthBeforeLanguage - value.segmentedActiveWidthBeforeLanguage) > 1) throw new Error('Browser consumer segmented indicator did not match the active segment before language change');
if (Math.abs(value.segmentedIndicatorWidthAfterLanguage - value.segmentedActiveWidthAfterLanguage) > 1) throw new Error('Browser consumer segmented indicator did not refresh after language change');
if (value.selectOpenAnimation !== 'uzu-menu-in' || value.selectCloseAnimation !== 'uzu-menu-out') throw new Error('Browser consumer select did not animate open and close');
if (value.selectOpenTransform !== 'none') throw new Error('Browser consumer select menu should not shift or scale while opening');
if (!value.selectClosing || value.selectExpandedAfterClose !== 'false') throw new Error('Browser consumer select did not keep a closing state with collapsed ARIA');
if (value.selectHiddenDisclosureTargetHeight <= 260) throw new Error('Browser consumer select reveal did not refresh nested open disclosure height');
if (value.comboboxOpenAnimation !== 'uzu-menu-in' || value.comboboxVisibleCount !== 1 || value.comboboxValue !== 'tree' || value.comboboxHiddenValue !== 'tree') throw new Error('Browser consumer combobox did not filter, animate, or sync value');
if (!value.comboboxClosedAfterSelect) throw new Error('Browser consumer combobox reopened after selecting an option');
if (value.comboboxListDisplayOpen !== 'grid') throw new Error('Browser consumer combobox list styling is missing');
if (value.comboboxHiddenDisclosureTargetHeight <= 260) throw new Error('Browser consumer combobox reveal did not refresh nested open disclosure height');
if (value.dataGridFirstCellAfterSort !== 'Alpha' || value.dataGridSelectedValue !== 'alpha' || value.dataGridDisplay !== 'table') throw new Error('Browser consumer data grid did not sort/select');
if (value.multiDataGridSelectedCount !== 2 || !value.multiDataGridSelectAllChecked || value.multiDataGridSelectAllMixedBeforeRefresh || value.multiDataGridRuntimeSelectedAfterCheckboxClick || value.multiDataGridRuntimeCheckboxAfterClick || !value.multiDataGridSelectAllMixedAfterCheckboxClick || !value.multiDataGridEmptyVisible || value.multiDataGridAlign !== 'right') throw new Error('Browser consumer data grid multi-select, checkbox sync, empty state, or alignment did not work');
if (value.plainDataGridFirstValue !== '1' || value.plainDataGridSelectedValue !== '2') throw new Error('Browser consumer data grid did not initialize plain table rows');
if (
  value.heatmapInitialCellCount !== 8
  || value.heatmapInitialSelectedDate !== '2025-06-20'
  || !String(value.heatmapInitialDetailText).includes('Review')
  || value.heatmapExplicitLevel !== '4'
  || value.heatmapViewportOverflowX !== 'auto'
  || value.heatmapGridDisplay !== 'grid'
  || !value.heatmapGridInsideViewport
  || !value.heatmapGridHasClass
  || value.heatmapGridRole !== ''
  || value.heatmapCellWidth !== 12
  || value.heatmapCellHeight !== 12
  || value.heatmapCellSizeVar !== '12px'
  || value.heatmapInitialSelectedBoxShadow === 'none'
  || !value.heatmapInitialSelectedClass
  || value.heatmapLegendCount !== 5
) throw new Error(`Browser consumer heatmap did not initialize compact data, styles, selected state, or legend: ${JSON.stringify({
  count: value.heatmapInitialCellCount,
  selected: value.heatmapInitialSelectedDate,
  detail: value.heatmapInitialDetailText,
  level: value.heatmapExplicitLevel,
  overflow: value.heatmapViewportOverflowX,
  display: value.heatmapGridDisplay,
  gridInsideViewport: value.heatmapGridInsideViewport,
  gridHasClass: value.heatmapGridHasClass,
  gridRole: value.heatmapGridRole,
  size: [value.heatmapCellWidth, value.heatmapCellHeight],
  sizeVar: value.heatmapCellSizeVar,
  shadow: value.heatmapInitialSelectedBoxShadow,
  selectedClass: value.heatmapInitialSelectedClass,
  legend: value.heatmapLegendCount
})}`);
if (
  value.heatmapClickedSelectedDate !== '2025-06-23'
  || value.heatmapClickedPressed !== 'true'
  || !String(value.heatmapClickedDetailText).includes('Ship')
  || !value.heatmapClickedEventLogged
  || value.heatmapFocusedAfterClick !== '5'
  || value.heatmapKeyboardFocusedOffset !== '6'
  || value.heatmapKeyboardSelectedDate !== '2025-06-24'
  || !value.heatmapEventDetail
  || value.heatmapEventDetail.date !== '2025-06-23'
  || value.heatmapEventDetail.offset !== 5
  || value.heatmapEventDetail.value !== 3
  || value.heatmapEventDetail.level !== 3
  || value.heatmapEventDetail.events !== 'Ship'
) throw new Error(`Browser consumer heatmap did not select, emit, render details, or support keyboard navigation: ${JSON.stringify({
  clicked: value.heatmapClickedSelectedDate,
  pressed: value.heatmapClickedPressed,
  detail: value.heatmapClickedDetailText,
  logged: value.heatmapClickedEventLogged,
  focus: value.heatmapFocusedAfterClick,
  keyboardFocus: value.heatmapKeyboardFocusedOffset,
  keyboardSelected: value.heatmapKeyboardSelectedDate,
  event: value.heatmapEventDetail
})}`);
if (
  !value.heatmapApiSelectReturnMatches
  || value.heatmapApiSelectedDate !== '2025-06-20'
  || !value.heatmapSetDataUsesSelReturnMatches
  || value.heatmapSetDataUsesSelDate !== '2025-06-21'
  || !value.heatmapSetDataReturnMatches
  || value.heatmapAfterSetCellCount !== 2
  || value.heatmapAfterSetSelectedDate !== '2025-07-02'
  || value.heatmapAfterSetExplicitLevel !== '4'
  || value.heatmapApiSelectByDate !== '2025-07-01'
  || !value.heatmapRefreshReturnMatches
  || value.heatmapRefreshCellCount !== 8
  || value.heatmapRefreshSelectedDate !== '2025-06-20'
  || !value.heatmapRefreshPreserveReturnMatches
  || value.heatmapRefreshPreservedDate !== '2025-06-23'
) throw new Error(`Browser consumer heatmap public API did not update and refresh data: ${JSON.stringify({
  apiReturn: value.heatmapApiSelectReturnMatches,
  apiSelected: value.heatmapApiSelectedDate,
  setUsesSelReturn: value.heatmapSetDataUsesSelReturnMatches,
  setUsesSelDate: value.heatmapSetDataUsesSelDate,
  setReturn: value.heatmapSetDataReturnMatches,
  afterSetCount: value.heatmapAfterSetCellCount,
  afterSetSelected: value.heatmapAfterSetSelectedDate,
  afterSetLevel: value.heatmapAfterSetExplicitLevel,
  byDate: value.heatmapApiSelectByDate,
  refreshReturn: value.heatmapRefreshReturnMatches,
  refreshCount: value.heatmapRefreshCellCount,
  refreshSelected: value.heatmapRefreshSelectedDate,
  refreshPreserveReturn: value.heatmapRefreshPreserveReturnMatches,
  refreshPreservedDate: value.heatmapRefreshPreservedDate
})}`);
if (value.staticHeatmapInitialSelectedDate !== '2025-06-19' || value.staticHeatmapCellCount !== 3 || value.staticHeatmapClickedSelectedDate !== '2025-06-20' || value.staticHeatmapClickedPressed !== 'true' || !String(value.staticHeatmapDetailText).trim()) {
  throw new Error(`Browser consumer static heatmap cells did not stay clickable and selectable: ${JSON.stringify({
    initial: value.staticHeatmapInitialSelectedDate,
    count: value.staticHeatmapCellCount,
    clicked: value.staticHeatmapClickedSelectedDate,
    pressed: value.staticHeatmapClickedPressed,
    detail: value.staticHeatmapDetailText
  })}`);
}
if (
  value.galleryInitialState !== 'ready'
  || value.galleryInitialItemCount !== 3
  || !value.galleryInitialAnchorsPreserved
  || value.galleryInitialDisplay !== 'flex'
  || !value.galleryInitialJustified
  || !value.galleryInitialOverflowStable
  || value.galleryFirstItemWidth <= 80
  || value.galleryFirstItemHeight <= 90
  || !String(value.galleryFirstItemCssWidth).endsWith('px')
  || value.galleryFirstImageObjectFit !== 'cover'
  || value.galleryCaptionOpacity !== '0'
  || value.galleryGapVar !== '8px'
  || value.galleryRowHeightVar !== '150px'
  || value.galleryFirstItemFocusBoxShadow === 'none'
  || value.galleryFirstItemFocusOutlineStyle !== 'none'
) throw new Error(`Browser consumer gallery did not initialize static justified layout or preserve link fallback: ${JSON.stringify({
  state: value.galleryInitialState,
  count: value.galleryInitialItemCount,
  anchors: value.galleryInitialAnchorsPreserved,
  display: value.galleryInitialDisplay,
  justified: value.galleryInitialJustified,
  overflow: value.galleryInitialOverflowStable,
  size: [value.galleryFirstItemWidth, value.galleryFirstItemHeight],
  cssWidth: value.galleryFirstItemCssWidth,
  objectFit: value.galleryFirstImageObjectFit,
  captionOpacity: value.galleryCaptionOpacity,
  gap: value.galleryGapVar,
  rowHeight: value.galleryRowHeightVar,
  focusShadow: value.galleryFirstItemFocusBoxShadow,
  focusOutline: value.galleryFirstItemFocusOutlineStyle
})}`);
if (
  value.jsonGalleryState !== 'ready'
  || value.jsonGalleryItemCount !== 2
  || !value.jsonGalleryGeneratedLinks
  || !String(value.jsonGalleryViewerNoneHref).startsWith('data:image/svg+xml')
  || value.jsonGalleryDisplay !== 'grid'
  || value.directoryGalleryState !== 'ready'
  || value.directoryGalleryItemCount !== 1
  || value.directoryGalleryCaption !== 'directory-image.png'
  || value.viewerCountBeforeJsonClick !== 0
  || value.viewerCountAfterJsonClick !== 0
  || !value.delayedGalleryLoadingBeforeDestroy
  || value.delayedGalleryItemCountAfterDestroy !== 0
  || value.delayedGalleryLoadAfterDestroy
  || !value.apiOverrideGalleryLoadingBeforeSet
  || !value.apiOverrideSetReturnMatches
  || value.apiOverrideGalleryCaptionBeforeResolve !== 'API override image'
  || value.apiOverrideGalleryCaptionAfterResolve !== 'API override image'
  || value.apiOverrideGalleryItemCountAfterResolve !== 1
  || value.apiOverrideGalleryStateAfterResolve !== 'ready'
  || !value.staticRefreshGalleryLoadingBeforeRefresh
  || !value.staticRefreshReturnMatches
  || value.staticRefreshGalleryCaptionBeforeResolve !== 'Static refresh image'
  || value.staticRefreshGalleryCaptionAfterResolve !== 'Static refresh image'
  || value.staticRefreshGalleryItemCountAfterResolve !== 1
  || value.staticRefreshGalleryStateAfterResolve !== 'ready'
) throw new Error(`Browser consumer gallery JSON, directory, or viewer-none behavior did not match: ${JSON.stringify({
  jsonState: value.jsonGalleryState,
  jsonCount: value.jsonGalleryItemCount,
  jsonLinks: value.jsonGalleryGeneratedLinks,
  jsonHref: value.jsonGalleryViewerNoneHref,
  jsonDisplay: value.jsonGalleryDisplay,
  directoryState: value.directoryGalleryState,
  directoryCount: value.directoryGalleryItemCount,
  directoryCaption: value.directoryGalleryCaption,
  viewerBefore: value.viewerCountBeforeJsonClick,
  viewerAfter: value.viewerCountAfterJsonClick,
  delayedLoading: value.delayedGalleryLoadingBeforeDestroy,
  delayedCount: value.delayedGalleryItemCountAfterDestroy,
  delayedLoad: value.delayedGalleryLoadAfterDestroy,
  apiOverrideLoading: value.apiOverrideGalleryLoadingBeforeSet,
  apiOverrideReturn: value.apiOverrideSetReturnMatches,
  apiOverrideBefore: value.apiOverrideGalleryCaptionBeforeResolve,
  apiOverrideAfter: value.apiOverrideGalleryCaptionAfterResolve,
  apiOverrideCount: value.apiOverrideGalleryItemCountAfterResolve,
  apiOverrideState: value.apiOverrideGalleryStateAfterResolve,
  staticRefreshLoading: value.staticRefreshGalleryLoadingBeforeRefresh,
  staticRefreshReturn: value.staticRefreshReturnMatches,
  staticRefreshBefore: value.staticRefreshGalleryCaptionBeforeResolve,
  staticRefreshAfter: value.staticRefreshGalleryCaptionAfterResolve,
  staticRefreshCount: value.staticRefreshGalleryItemCountAfterResolve,
  staticRefreshState: value.staticRefreshGalleryStateAfterResolve
})}`);
if (
  !value.gallerySelectDetail
  || value.gallerySelectDetail.index !== 0
  || value.gallerySelectDetail.caption !== 'Wide demo'
  || !value.gallerySelectDetail.viewer
  || value.gallerySelectDetail.triggerTag !== 'A'
  || !value.viewerOpenDetail
  || value.viewerOpenDetail.caption !== 'Wide demo'
  || value.viewerOpenDetail.triggerTag !== 'A'
  || !value.galleryViewerOpenReturnMatches
  || !value.galleryViewerOpenVisible
  || value.galleryViewerRole !== 'dialog'
  || value.galleryViewerModal !== 'true'
  || !String(value.galleryViewerImageSrc).startsWith('data:image/svg+xml')
  || value.galleryViewerImageDraggable
  || value.galleryViewerCaption !== 'Wide demo'
  || !String(value.galleryViewerDownloadHref).startsWith('data:image/svg+xml')
  || !value.galleryViewerFocusInside
  || !value.galleryViewerBodyScrollLocked
) throw new Error(`Browser consumer image viewer did not open from gallery with dialog semantics: ${JSON.stringify({
  select: value.gallerySelectDetail,
  open: value.viewerOpenDetail,
  returnMatches: value.galleryViewerOpenReturnMatches,
  visible: value.galleryViewerOpenVisible,
  role: value.galleryViewerRole,
  modal: value.galleryViewerModal,
  src: value.galleryViewerImageSrc,
  draggable: value.galleryViewerImageDraggable,
  caption: value.galleryViewerCaption,
  download: value.galleryViewerDownloadHref,
  focusInside: value.galleryViewerFocusInside,
  scrollLocked: value.galleryViewerBodyScrollLocked
})}`);
if (
  !value.viewerZoomDetail
  || value.viewerZoomDetail.caption !== 'Wide demo'
  || value.viewerZoomDetail.scale <= 1
  || value.galleryViewerScaleAfterButton <= 1
  || value.galleryViewerScaleAfterResetKey !== 1
  || value.galleryViewerScaleAfterWheel <= 1
  || value.galleryViewerPanX !== '30px'
  || value.galleryViewerPanY !== '24px'
  || !value.viewerCloseDetail
  || value.viewerCloseDetail.caption !== 'Wide demo'
  || value.viewerCloseDetail.triggerTag !== 'A'
  || !value.galleryViewerClosedHidden
  || !value.galleryViewerFocusRestored
  || !value.galleryViewerBodyScrollRestored
  || !value.gallerySquareViewerFitsStage
  || !value.galleryDownloadOffHidden
  || value.galleryDownloadOffHref
  || !value.galleryDestroyScrollLockedBefore
  || !value.galleryDestroyAutoViewerRemoved
  || !value.galleryDestroyScrollRestored
  || !value.galleryDestroyNoInert
) throw new Error(`Browser consumer image viewer controls, pan, close, or focus restore failed: ${JSON.stringify({
  zoomEvent: value.viewerZoomDetail,
  scaleButton: value.galleryViewerScaleAfterButton,
  scaleReset: value.galleryViewerScaleAfterResetKey,
  scaleWheel: value.galleryViewerScaleAfterWheel,
  pan: [value.galleryViewerPanX, value.galleryViewerPanY],
  close: value.viewerCloseDetail,
  closed: value.galleryViewerClosedHidden,
  focusRestored: value.galleryViewerFocusRestored,
  scrollRestored: value.galleryViewerBodyScrollRestored,
  squareFits: value.gallerySquareViewerFitsStage,
  downloadOffHidden: value.galleryDownloadOffHidden,
  downloadOffHref: value.galleryDownloadOffHref,
  destroyLockedBefore: value.galleryDestroyScrollLockedBefore,
  destroyRemoved: value.galleryDestroyAutoViewerRemoved,
  destroyScrollRestored: value.galleryDestroyScrollRestored,
  destroyNoInert: value.galleryDestroyNoInert
})}`);
if (
  !value.galleryApiSetReturnMatches
  || value.galleryApiSetCount !== 1
  || value.galleryApiSetButton !== 'BUTTON'
  || !value.galleryApiRefreshReturnMatches
  || value.galleryApiRefreshCount !== 1
  || !value.galleryApiOpenReturnMatches
  || value.galleryApiViewerCaption !== 'API viewer'
  || !value.galleryApiCloseReturnMatches
  || !value.galleryApiCloseHidden
) throw new Error(`Browser consumer gallery and image viewer public APIs did not remain reusable: ${JSON.stringify({
  setReturn: value.galleryApiSetReturnMatches,
  setCount: value.galleryApiSetCount,
  setButton: value.galleryApiSetButton,
  refreshReturn: value.galleryApiRefreshReturnMatches,
  refreshCount: value.galleryApiRefreshCount,
  openReturn: value.galleryApiOpenReturnMatches,
  caption: value.galleryApiViewerCaption,
  closeReturn: value.galleryApiCloseReturnMatches,
  closeHidden: value.galleryApiCloseHidden
})}`);
if (!value.treeClosed || !value.treeOpen || value.treeKeyboardFocusValue !== 'docs' || value.treeDisplay !== 'grid') throw new Error('Browser consumer tree did not toggle, focus, or style correctly');
if (value.treeHiddenDisclosureTargetHeight <= 260) throw new Error('Browser consumer tree reveal did not refresh nested open disclosure height');
if (Number(value.splitSize) !== 58 || value.splitAriaValue !== '58' || value.splitPaneDisplay !== 'grid') throw new Error('Browser consumer split pane did not resize');
if (value.resizableWidth !== 300 || value.resizableHeight !== 150 || value.resizablePosition !== 'relative') throw new Error('Browser consumer resizable panel did not resize');
if (
  value.jsonNodeCount < 2
  || value.jsonFirstLineNumber !== '1'
  || value.jsonSecondLineNumber !== '2'
  || value.jsonLineDisplay !== 'grid'
  || value.jsonLineNumberWidth !== '40px'
  || value.jsonFoldWidth !== '20px'
  || value.jsonIndent !== '20px'
  || !value.jsonHasNestedDepth
  || value.jsonNestedCodePaddingLeft < 19
  || value.jsonToggleOpacity !== '0'
  || value.jsonToggleWidth !== 20
  || !value.jsonToggleCenterAligned
  || !value.jsonFoldGutterHover
  || value.jsonVisibleToggleCountOnGutterHover < 2
  || !value.jsonFoldGutterHoverCleared
  || value.jsonToggleText !== ''
  || value.jsonOpenPunctuationText !== '{'
  || !value.jsonUsesCodeTokens
  || !value.jsonEscapedKeyTexts.includes('""')
  || !value.jsonEscapedKeyTexts.includes('"quote\\"key"')
  || !value.jsonEscapedStringTexts.includes('"line\\nbreak"')
  || !value.jsonEscapedStringTexts.includes('"C:\\\\Temp"')
  || !value.jsonCollapsed
  || value.jsonCollapsedAria !== 'false'
  || !value.jsonChildrenHidden
  || !value.jsonCollapsedSummaryVisible
  || value.jsonCollapsedSummaryText !== '...'
  || value.jsonViewerBorderStyle === 'none'
) throw new Error('Browser consumer JSON viewer did not render collapsible highlighted JSON');
if (value.diffAddRows !== 1 || value.diffRemoveRows !== 1 || value.diffViewerDisplay !== 'block') throw new Error('Browser consumer diff viewer did not classify rows');
if (value.markdownEditorDisplay !== 'grid' || value.markdownEditorHeading !== 'Updated' || value.markdownEditorCleared !== '' || !value.markdownEditorCopyInitialized || value.inlineEditorValue !== 'Changed inline') throw new Error('Browser consumer editor helpers did not initialize');
if (!value.markdownEditorCodeCopyZh || value.markdownEditorCodeCopyZh.aria !== '\u590d\u5236\u4ee3\u7801' || value.markdownEditorCodeCopyZh.label !== '\u590d\u5236' || value.markdownEditorCodeCopyZh.zhHidden || !value.markdownEditorCodeCopyZh.enHidden) throw new Error(`Browser consumer markdown preview code copy should initialize with Chinese labels: ${JSON.stringify(value.markdownEditorCodeCopyZh)}`);
if (!value.markdownEditorCodeCopyEn || value.markdownEditorCodeCopyEn.aria !== 'Copy code' || value.markdownEditorCodeCopyEn.label !== 'Copy' || !value.markdownEditorCodeCopyEn.zhHidden || value.markdownEditorCodeCopyEn.enHidden) throw new Error(`Browser consumer markdown preview code copy should switch to English labels: ${JSON.stringify(value.markdownEditorCodeCopyEn)}`);
if (!value.markdownEditorCodeCopyEnAfterRender || value.markdownEditorCodeCopyEnAfterRender.aria !== 'Copy code' || value.markdownEditorCodeCopyEnAfterRender.label !== 'Copy' || !value.markdownEditorCodeCopyEnAfterRender.zhHidden || value.markdownEditorCodeCopyEnAfterRender.enHidden) throw new Error(`Browser consumer markdown preview code copy should keep English labels after rerender: ${JSON.stringify(value.markdownEditorCodeCopyEnAfterRender)}`);
for (const [label, probe] of [
  ['code editor', value.codeEditorFocusProbe],
  ['plain editor', value.plainEditorFocusProbe],
  ['markdown source', value.markdownSourceFocusProbe],
  ['stacked markdown source bottom border', value.markdownSourceStackedFocusProbe],
  ['inline editor', value.inlineEditorFocusProbe]
]) assertHardEditorFocusProbe(probe, label);
if (value.markdownSourceStackedBorderBottomWidth !== '1px') throw new Error(`Browser consumer stacked markdown source should keep a visible bottom focus border: ${JSON.stringify({ borderBottomWidth: value.markdownSourceStackedBorderBottomWidth })}`);
if (Math.round(value.fieldGap) !== 5) throw new Error('Browser consumer form field should use the default field gap variable');
if (value.fieldLabelToInputGap < 4) throw new Error('Browser consumer form label should not overlap the input');
if (!Array.isArray(value.checkRowAlignment) || value.checkRowAlignment.length !== 2) throw new Error(`Browser consumer check rows were not measured: ${JSON.stringify(value.checkRowAlignment)}`);
for (const probe of value.checkRowAlignment) {
  if (probe.missing) throw new Error(`Browser consumer check row is missing required parts: ${JSON.stringify(probe)}`);
  if (probe.rowDisplay !== 'flex' || probe.rowAlignItems !== 'center') throw new Error(`Browser consumer check row should align input and label with flex center: ${JSON.stringify(probe)}`);
  if (probe.inputWidth !== 16 || probe.inputHeight !== 16 || probe.inputMarginTop !== '0px' || probe.inputMarginBottom !== '0px') throw new Error(`Browser consumer check row input should have a stable 16px box without default vertical margin: ${JSON.stringify(probe)}`);
  if (probe.centerDelta > 1) throw new Error(`Browser consumer check row input and label center lines should align: ${JSON.stringify(probe)}`);
}
if (value.disclosureOpenAnimation !== 'uzu-disclosure-in' || value.disclosureCloseAnimation !== 'uzu-disclosure-out') throw new Error('Browser consumer disclosure did not animate open and close');
if (!(value.disclosurePanelTargetHeight > 0)) throw new Error('Browser consumer disclosure did not set a measured panel height');
if (!value.disclosureClosing || value.disclosureHiddenWhileClosing) throw new Error('Browser consumer disclosure did not stay visible while closing');
if (value.buttonTransform !== 'none') throw new Error('Browser consumer button hover/base transform should not move the button');
}
