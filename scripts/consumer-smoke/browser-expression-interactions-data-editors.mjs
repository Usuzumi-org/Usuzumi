export const browserExpressionDataEditorInteractions = `comboboxInput.value = 'tree';
comboboxInput.dispatchEvent(new Event('input', { bubbles: true }));
await wait(60);
const comboboxOpenAnimation = getComputedStyle(comboboxList).animationName;
const comboboxListDisplayOpen = getComputedStyle(comboboxList).display;
const comboboxHiddenDisclosureTargetHeight = readDisclosureTargetHeight('#consumer-combobox-hidden-disclosure [data-uzu-disclosure-panel]');
const comboboxVisibleCount = [...combobox.querySelectorAll('[data-uzu-combobox-option]')].filter((item) => !item.hidden).length;
click(combobox.querySelector('[data-uzu-combobox-value="tree"]'));
await wait(60);
const comboboxValue = combobox.dataset.uzuComboboxValue;
const comboboxHiddenValue = combobox.querySelector('input[type="hidden"]')?.value || '';
const comboboxClosedAfterSelect = comboboxList.hidden && !combobox.classList.contains('is-open') && comboboxInput.getAttribute('aria-expanded') === 'false';
click(dataGrid.querySelector('[data-uzu-grid-sort]'));
await wait(60);
const dataGridFirstCellAfterSort = dataGrid.tBodies[0].rows[0].cells[0].textContent.trim();
click(dataGrid.querySelector('[data-uzu-grid-row="alpha"]'));
const dataGridSelectedValue = dataGrid.querySelector('[aria-selected="true"]')?.dataset.uzuGridRow || '';
multiDataGridSelectAll.click();
const multiDataGridSelectedCount = multiDataGrid.querySelectorAll('tbody tr[aria-selected="true"]').length;
const multiDataGridSelectAllChecked = multiDataGridSelectAll.checked;
const multiDataGridSelectAllMixedBeforeRefresh = multiDataGridSelectAll.indeterminate;
const multiDataGridRuntimeSelection = multiDataGrid.querySelector('[data-uzu-grid-row="runtime"] [data-uzu-grid-selection]');
multiDataGridRuntimeSelection.click();
const multiDataGridRuntimeSelectedAfterCheckboxClick = multiDataGrid.querySelector('[data-uzu-grid-row="runtime"]').getAttribute('aria-selected') === 'true';
const multiDataGridRuntimeCheckboxAfterClick = multiDataGridRuntimeSelection.checked;
const multiDataGridSelectAllMixedAfterCheckboxClick = multiDataGridSelectAll.indeterminate;
multiDataGrid.querySelectorAll('tbody tr:not([data-uzu-grid-empty])').forEach((row) => {
  row.hidden = true;
  window.Usuzumi.setDataGridRowSelected(row, false, false);
});
window.Usuzumi.refreshDataGrid(multiDataGrid);
const multiDataGridEmptyVisible = !multiDataGridEmpty.hidden;
const multiDataGridAlign = getComputedStyle(multiDataGrid.querySelector('[data-uzu-grid-align="end"]')).textAlign;
const plainDataGridFirstValue = plainDataGrid.tBodies[0].rows[0].dataset.uzuGridRow || '';
click(plainDataGrid.tBodies[0].rows[1]);
const plainDataGridSelectedValue = plainDataGrid.querySelector('[aria-selected="true"]')?.dataset.uzuGridRow || '';
const heatmapViewport = heatmap.querySelector('.uzu-heatmap-viewport');
const heatmapGrid = heatmap.querySelector('[data-uzu-heatmap-grid]');
const heatmapCells = [...heatmap.querySelectorAll('.uzu-heatmap-cell')];
const heatmapInitialCellCount = heatmapCells.length;
const heatmapInitialSelectedDate = heatmap.dataset.uzuHeatmapSelectedDate || '';
const heatmapInitialDetailText = heatmap.querySelector('[data-uzu-heatmap-detail]')?.textContent.trim() || '';
const heatmapExplicitLevel = heatmap.querySelector('[data-uzu-heatmap-offset="2"]')?.dataset.uzuHeatmapLevel || '';
const heatmapViewportStyle = getComputedStyle(heatmapViewport);
const heatmapGridStyle = getComputedStyle(heatmapGrid);
const heatmapCellStyle = getComputedStyle(heatmapCells[0]);
const heatmapInitialSelectedStyle = getComputedStyle(heatmap.querySelector('[aria-pressed="true"]'));
const heatmapViewportOverflowX = heatmapViewportStyle.overflowX;
const heatmapGridDisplay = heatmapGridStyle.display;
const heatmapGridInsideViewport = heatmapGrid.parentElement === heatmapViewport;
const heatmapGridHasClass = heatmapGrid.classList.contains('uzu-heatmap-grid');
const heatmapGridRole = heatmapGrid.getAttribute('role') || '';
const heatmapCellWidth = Math.round(heatmapCells[0].getBoundingClientRect().width);
const heatmapCellHeight = Math.round(heatmapCells[0].getBoundingClientRect().height);
const heatmapCellBackground = heatmapCellStyle.backgroundColor;
const heatmapCellSizeVar = heatmapCellStyle.getPropertyValue('--uzu-heatmap-cell-size').trim();
const heatmapInitialSelectedBoxShadow = heatmapInitialSelectedStyle.boxShadow;
const heatmapInitialSelectedClass = heatmap.querySelector('[aria-pressed="true"]')?.classList.contains('is-selected') || false;
const heatmapLegendCount = heatmap.querySelectorAll('.uzu-heatmap-legend-cell').length;
let heatmapEventDetail = null;
heatmap.addEventListener('uzu-heatmap-select', (event) => {
  heatmapEventDetail = {
    date: event.detail.date,
    offset: event.detail.offset,
    value: event.detail.value,
    level: event.detail.level,
    events: event.detail.events.map((item) => item.title).join(',')
  };
}, { once: true });
click(heatmap.querySelector('[data-uzu-heatmap-offset="5"]'));
await wait(40);
const heatmapClickedSelectedDate = heatmap.dataset.uzuHeatmapSelectedDate || '';
const heatmapClickedPressed = heatmap.querySelector('[data-uzu-heatmap-offset="5"]').getAttribute('aria-pressed');
const heatmapClickedDetailText = heatmap.querySelector('[data-uzu-heatmap-detail]')?.textContent.trim() || '';
const heatmapClickedEventLogged = newEvents.includes('heatmap:2025-06-23:1');
const heatmapFocusedAfterClick = document.activeElement?.dataset.uzuHeatmapOffset || '';
document.activeElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
await wait(0);
const heatmapKeyboardFocusedOffset = document.activeElement?.dataset.uzuHeatmapOffset || '';
document.activeElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
await wait(40);
const heatmapKeyboardSelectedDate = heatmap.dataset.uzuHeatmapSelectedDate || '';
const heatmapApiSelectReturn = window.Usuzumi.selectHeatmapDate(heatmap, 2, false);
const heatmapApiSelectReturnMatches = heatmapApiSelectReturn === heatmap.querySelector('[data-uzu-heatmap-offset="2"]');
const heatmapApiSelectedDate = heatmap.dataset.uzuHeatmapSelectedDate || '';
const heatmapSetDataUsesSelReturn = window.Usuzumi.setHeatmapData(heatmap, {
  s: '2025-06-19',
  w: 1,
  v: [1, 2, 3],
  sel: 2
}, false);
const heatmapSetDataUsesSelDate = heatmap.dataset.uzuHeatmapSelectedDate || '';
const heatmapSetDataReturn = window.Usuzumi.setHeatmapData(heatmap, {
  s: '2025-07-01',
  w: 1,
  v: [1, [3, 4]],
  sel: 1,
  l: ['Low', 'High', 'Quiet'],
  ev: [[1, [['API event', '10:00', 'Updated data']]]]
}, false);
const heatmapAfterSetCellCount = heatmap.querySelectorAll('.uzu-heatmap-cell').length;
const heatmapAfterSetSelectedDate = heatmap.dataset.uzuHeatmapSelectedDate || '';
const heatmapAfterSetExplicitLevel = heatmap.querySelector('[data-uzu-heatmap-offset="1"]')?.dataset.uzuHeatmapLevel || '';
window.Usuzumi.selectHeatmapDate(heatmap, '2025-07-01', false);
const heatmapApiSelectByDate = heatmap.dataset.uzuHeatmapSelectedDate || '';
const heatmapRefreshReturn = window.Usuzumi.refreshHeatmap(heatmap);
const heatmapRefreshCellCount = heatmap.querySelectorAll('.uzu-heatmap-cell').length;
const heatmapRefreshSelectedDate = heatmap.dataset.uzuHeatmapSelectedDate || '';
window.Usuzumi.selectHeatmapDate(heatmap, '2025-06-23', false);
const heatmapRefreshPreserveReturn = window.Usuzumi.refreshHeatmap(heatmap);
const heatmapRefreshPreservedDate = heatmap.dataset.uzuHeatmapSelectedDate || '';
const staticHeatmapInitialSelectedDate = staticHeatmap.dataset.uzuHeatmapSelectedDate || '';
const staticHeatmapCellCount = staticHeatmap.querySelectorAll('.uzu-heatmap-cell').length;
click(staticHeatmap.querySelector('[data-uzu-heatmap-offset="2"]'));
await wait(40);
const staticHeatmapClickedSelectedDate = staticHeatmap.dataset.uzuHeatmapSelectedDate || '';
const staticHeatmapClickedPressed = staticHeatmap.querySelector('[data-uzu-heatmap-offset="2"]').getAttribute('aria-pressed');
const staticHeatmapDetailText = staticHeatmap.querySelector('[data-uzu-heatmap-detail]')?.textContent.trim() || '';
const codeEditorFocusProbe = await readFocusProbe(consumerCodeEditor);
const plainEditorFocusProbe = await readFocusProbe(consumerPlainEditor);
const markdownSourceFocusProbe = await readFocusProbe(markdownEditorSource, markdownEditor);
const markdownSourceStackedStyle = document.createElement('style');
markdownSourceStackedStyle.textContent = '@layer usuzumi{.consumer-stacked-markdown-source-probe,textarea.consumer-stacked-markdown-source-probe{border-right:0;border-bottom:1px solid var(--uzu-border-soft)}}';
document.head.append(markdownSourceStackedStyle);
markdownEditorSource.classList.add('consumer-stacked-markdown-source-probe');
const markdownSourceStackedFocusProbe = await readFocusProbe(markdownEditorSource, markdownEditorSource, 'borderBottomColor');
const markdownSourceStackedBorderBottomWidth = getComputedStyle(markdownEditorSource).borderBottomWidth;
markdownEditorSource.classList.remove('consumer-stacked-markdown-source-probe');
markdownSourceStackedStyle.remove();
const inlineEditorFocusProbe = await readFocusProbe(inlineEditor);
const waitForGallery = async (condition, timeout = 600) => {
  const started = performance.now();
  while (performance.now() - started < timeout) {
    if (condition()) return true;
    await wait(20);
  }
  return condition();
};
await waitForGallery(() => jsonGallery.dataset.uzuGalleryState === 'ready' && directoryGallery.dataset.uzuGalleryState !== 'loading');
const galleryInitialState = gallery.dataset.uzuGalleryState || '';
const galleryInitialItemCount = gallery.querySelectorAll('.uzu-gallery-item').length;
const galleryInitialAnchorsPreserved = [...gallery.querySelectorAll('.uzu-gallery-item')].every((item) => item.tagName === 'A' && item.hasAttribute('href'));
const galleryInitialDisplay = getComputedStyle(gallery).display;
const galleryInitialJustified = gallery.classList.contains('is-justified');
const galleryInitialOverflowStable = gallery.scrollWidth <= gallery.clientWidth + 1;
const galleryFirstItem = gallery.querySelector('.uzu-gallery-item');
const galleryFirstItemStyle = getComputedStyle(galleryFirstItem);
const galleryFirstItemWidth = Math.round(galleryFirstItem.getBoundingClientRect().width);
const galleryFirstItemHeight = Math.round(galleryFirstItem.getBoundingClientRect().height);
const galleryFirstItemCssWidth = galleryFirstItem.style.getPropertyValue('--uzu-gallery-item-width').trim();
const galleryFirstImageObjectFit = getComputedStyle(galleryFirstItem.querySelector('.uzu-gallery-image')).objectFit;
const galleryCaptionOpacity = getComputedStyle(galleryFirstItem.querySelector('.uzu-gallery-caption')).opacity;
const galleryGapVar = getComputedStyle(gallery).getPropertyValue('--uzu-gallery-gap').trim();
const galleryRowHeightVar = getComputedStyle(gallery).getPropertyValue('--uzu-gallery-row-height').trim();
const jsonGalleryState = jsonGallery.dataset.uzuGalleryState || '';
const jsonGalleryItemCount = jsonGallery.querySelectorAll('.uzu-gallery-item').length;
const jsonGalleryGeneratedLinks = [...jsonGallery.querySelectorAll('.uzu-gallery-item')].every((item) => item.tagName === 'A' && item.hasAttribute('href'));
const jsonGalleryFirstItem = jsonGallery.querySelector('.uzu-gallery-item');
const jsonGalleryViewerNoneHref = jsonGalleryFirstItem?.getAttribute('href') || '';
const jsonGalleryDisplay = getComputedStyle(jsonGallery).display;
const directoryGalleryState = directoryGallery.dataset.uzuGalleryState || '';
const directoryGalleryItemCount = directoryGallery.querySelectorAll('.uzu-gallery-item').length;
const directoryGalleryCaption = directoryGallery.querySelector('.uzu-gallery-caption')?.textContent.trim() || '';
const viewerCountBeforeJsonClick = document.querySelectorAll('[data-uzu-gallery-auto-viewer]').length;
jsonGalleryFirstItem?.addEventListener('click', (event) => event.preventDefault(), { once: true });
click(jsonGalleryFirstItem);
await wait(0);
const viewerCountAfterJsonClick = document.querySelectorAll('[data-uzu-gallery-auto-viewer]').length;
const originalFetchForDelayedGallery = window.fetch.bind(window);
let resolveDelayedGalleryFetch = null;
let delayedGalleryLoadAfterDestroy = false;
window.fetch = (input, init) => {
  if (String(input).includes('consumer-delayed-gallery.json')) {
    return new Promise((resolve) => {
      resolveDelayedGalleryFetch = resolve;
    });
  }
  return originalFetchForDelayedGallery(input, init);
};
const delayedGallery = document.createElement('section');
delayedGallery.className = 'uzu-gallery';
delayedGallery.dataset.uzuGallery = '';
delayedGallery.dataset.uzuGallerySource = 'consumer-delayed-gallery.json';
delayedGallery.dataset.uzuGalleryLayout = 'grid';
delayedGallery.addEventListener('uzu-gallery-load', () => {
  delayedGalleryLoadAfterDestroy = true;
});
document.body.append(delayedGallery);
window.Usuzumi.init(delayedGallery);
await wait(0);
const delayedGalleryLoadingBeforeDestroy = delayedGallery.dataset.uzuGalleryState === 'loading';
window.Usuzumi.destroy(delayedGallery);
if (resolveDelayedGalleryFetch) {
  resolveDelayedGalleryFetch(new Response('[{"src":"data:image/svg+xml,%3Csvg%20xmlns%3D%22http://www.w3.org/2000/svg%22%20width%3D%22100%22%20height%3D%22100%22%3E%3C/svg%3E","width":100,"height":100}]', {
    status: 200,
    headers: { 'content-type': 'application/json' }
  }));
}
await wait(40);
const delayedGalleryItemCountAfterDestroy = delayedGallery.querySelectorAll('.uzu-gallery-item').length;
window.fetch = originalFetchForDelayedGallery;
delayedGallery.remove();
const originalFetchForApiOverrideGallery = window.fetch.bind(window);
let resolveApiOverrideGalleryFetch = null;
window.fetch = (input, init) => {
  if (String(input).includes('consumer-api-override-gallery.json')) {
    return new Promise((resolve) => {
      resolveApiOverrideGalleryFetch = resolve;
    });
  }
  return originalFetchForApiOverrideGallery(input, init);
};
const apiOverrideGallery = document.createElement('section');
apiOverrideGallery.className = 'uzu-gallery';
apiOverrideGallery.dataset.uzuGallery = '';
apiOverrideGallery.dataset.uzuGallerySource = 'consumer-api-override-gallery.json';
apiOverrideGallery.dataset.uzuGalleryLayout = 'grid';
document.body.append(apiOverrideGallery);
window.Usuzumi.init(apiOverrideGallery);
await wait(0);
const apiOverrideGalleryLoadingBeforeSet = apiOverrideGallery.dataset.uzuGalleryState === 'loading';
const apiOverrideSetReturn = window.Usuzumi.setGalleryItems(apiOverrideGallery, [{
  src: 'data:image/svg+xml,%3Csvg%20xmlns%3D%22http://www.w3.org/2000/svg%22%20width%3D%22120%22%20height%3D%2280%22%3E%3Crect%20width%3D%22120%22%20height%3D%2280%22%20fill%3D%22%23e4e4e7%22/%3E%3C/svg%3E',
  alt: 'API override',
  caption: 'API override image',
  width: 120,
  height: 80
}], false);
const apiOverrideGalleryCaptionBeforeResolve = apiOverrideGallery.querySelector('.uzu-gallery-caption')?.textContent.trim() || '';
if (resolveApiOverrideGalleryFetch) {
  resolveApiOverrideGalleryFetch(new Response('[{"src":"data:image/svg+xml,%3Csvg%20xmlns%3D%22http://www.w3.org/2000/svg%22%20width%3D%2290%22%20height%3D%2290%22%3E%3Crect%20width%3D%2290%22%20height%3D%2290%22%20fill%3D%22%23d4d4d8%22/%3E%3C/svg%3E","alt":"Remote stale","caption":"Remote stale image","width":90,"height":90}]', {
    status: 200,
    headers: { 'content-type': 'application/json' }
  }));
}
await wait(40);
const apiOverrideGalleryCaptionAfterResolve = apiOverrideGallery.querySelector('.uzu-gallery-caption')?.textContent.trim() || '';
const apiOverrideGalleryItemCountAfterResolve = apiOverrideGallery.querySelectorAll('.uzu-gallery-item').length;
const apiOverrideGalleryStateAfterResolve = apiOverrideGallery.dataset.uzuGalleryState || '';
window.fetch = originalFetchForApiOverrideGallery;
apiOverrideGallery.remove();
const originalFetchForStaticRefreshGallery = window.fetch.bind(window);
let resolveStaticRefreshGalleryFetch = null;
window.fetch = (input, init) => {
  if (String(input).includes('consumer-static-refresh-gallery.json')) {
    return new Promise((resolve) => {
      resolveStaticRefreshGalleryFetch = resolve;
    });
  }
  return originalFetchForStaticRefreshGallery(input, init);
};
const staticRefreshGallery = document.createElement('section');
staticRefreshGallery.className = 'uzu-gallery';
staticRefreshGallery.dataset.uzuGallery = '';
staticRefreshGallery.dataset.uzuGallerySource = 'consumer-static-refresh-gallery.json';
staticRefreshGallery.dataset.uzuGalleryLayout = 'grid';
staticRefreshGallery.innerHTML = '<a class="uzu-gallery-item" href="data:image/svg+xml,%3Csvg%20xmlns%3D%22http://www.w3.org/2000/svg%22%20width%3D%22140%22%20height%3D%2280%22%3E%3Crect%20width%3D%22140%22%20height%3D%2280%22%20fill%3D%22%23e5e7eb%22/%3E%3C/svg%3E" data-width="140" data-height="80"><img class="uzu-gallery-image" alt="Static refresh" src="data:image/svg+xml,%3Csvg%20xmlns%3D%22http://www.w3.org/2000/svg%22%20width%3D%22140%22%20height%3D%2280%22%3E%3Crect%20width%3D%22140%22%20height%3D%2280%22%20fill%3D%22%23e5e7eb%22/%3E%3C/svg%3E"><span class="uzu-gallery-caption">Static refresh image</span></a>';
document.body.append(staticRefreshGallery);
window.Usuzumi.init(staticRefreshGallery);
await wait(0);
const staticRefreshGalleryLoadingBeforeRefresh = staticRefreshGallery.dataset.uzuGalleryState === 'loading';
staticRefreshGallery.removeAttribute('data-uzu-gallery-source');
const staticRefreshReturn = window.Usuzumi.refreshGallery(staticRefreshGallery);
const staticRefreshGalleryCaptionBeforeResolve = staticRefreshGallery.querySelector('.uzu-gallery-caption')?.textContent.trim() || '';
if (resolveStaticRefreshGalleryFetch) {
  resolveStaticRefreshGalleryFetch(new Response('[{"src":"data:image/svg+xml,%3Csvg%20xmlns%3D%22http://www.w3.org/2000/svg%22%20width%3D%2290%22%20height%3D%2290%22%3E%3Crect%20width%3D%2290%22%20height%3D%2290%22%20fill%3D%22%23d4d4d8%22/%3E%3C/svg%3E","alt":"Remote refresh stale","caption":"Remote refresh stale image","width":90,"height":90}]', {
    status: 200,
    headers: { 'content-type': 'application/json' }
  }));
}
await wait(40);
const staticRefreshGalleryCaptionAfterResolve = staticRefreshGallery.querySelector('.uzu-gallery-caption')?.textContent.trim() || '';
const staticRefreshGalleryItemCountAfterResolve = staticRefreshGallery.querySelectorAll('.uzu-gallery-item').length;
const staticRefreshGalleryStateAfterResolve = staticRefreshGallery.dataset.uzuGalleryState || '';
window.fetch = originalFetchForStaticRefreshGallery;
staticRefreshGallery.remove();
let gallerySelectDetail = null;
gallery.addEventListener('uzu-gallery-select', (event) => {
  gallerySelectDetail = {
    index: event.detail.index,
    caption: event.detail.item.caption,
    viewer: Boolean(event.detail.viewer),
    triggerTag: event.detail.trigger?.tagName || ''
  };
}, { once: true });
let viewerOpenDetail = null;
let viewerCloseDetail = null;
let viewerZoomDetail = null;
document.addEventListener('uzu-image-viewer-open', (event) => {
  viewerOpenDetail = {
    caption: event.detail.item?.caption || '',
    triggerTag: event.detail.trigger?.tagName || ''
  };
}, { once: true });
document.addEventListener('uzu-image-viewer-close', (event) => {
  viewerCloseDetail = {
    caption: event.detail.item?.caption || '',
    triggerTag: event.detail.trigger?.tagName || ''
  };
}, { once: true });
document.addEventListener('uzu-image-viewer-zoom', (event) => {
  viewerZoomDetail = {
    caption: event.detail.item?.caption || '',
    scale: Number(event.detail.scale)
  };
}, { once: true });
focusVisible(galleryFirstItem);
await wait(0);
const galleryFirstItemFocusBoxShadow = getComputedStyle(galleryFirstItem).boxShadow;
const galleryFirstItemFocusOutlineStyle = getComputedStyle(galleryFirstItem).outlineStyle;
click(galleryFirstItem);
await wait(0);
const galleryViewer = document.querySelector('.uzu-image-viewer[data-uzu-image-viewer]');
const galleryViewerOverlay = galleryViewer?.closest('[data-uzu-dialog-overlay]');
const galleryViewerOpenReturn = galleryViewer;
const galleryViewerOpenVisible = Boolean(galleryViewer && !galleryViewer.hidden && galleryViewerOverlay && !galleryViewerOverlay.hidden);
const galleryViewerRole = galleryViewer?.getAttribute('role') || '';
const galleryViewerModal = galleryViewer?.getAttribute('aria-modal') || '';
const galleryViewerImageSrc = galleryViewer?.querySelector('[data-uzu-image-viewer-image]')?.getAttribute('src') || '';
const galleryViewerImageDraggable = galleryViewer?.querySelector('[data-uzu-image-viewer-image]')?.draggable;
const galleryViewerCaption = galleryViewer?.querySelector('[data-uzu-image-viewer-caption]')?.textContent.trim() || '';
const galleryViewerDownloadHref = galleryViewer?.querySelector('[data-uzu-image-viewer-download]')?.getAttribute('href') || '';
const galleryViewerFocusInside = Boolean(galleryViewer && galleryViewer.contains(document.activeElement));
const galleryViewerBodyScrollLocked = getComputedStyle(document.documentElement).overflow === 'hidden' || getComputedStyle(document.body).overflow === 'hidden';
click(galleryViewer.querySelector('[data-uzu-image-viewer-zoom-in]'));
await wait(0);
const galleryViewerScaleAfterButton = Number.parseFloat(galleryViewer.style.getPropertyValue('--uzu-image-viewer-scale') || '1');
galleryViewer.dispatchEvent(new KeyboardEvent('keydown', { key: '0', bubbles: true }));
await wait(0);
const galleryViewerScaleAfterResetKey = Number.parseFloat(galleryViewer.style.getPropertyValue('--uzu-image-viewer-scale') || '1');
const galleryViewerStage = galleryViewer.querySelector('[data-uzu-image-viewer-stage]');
galleryViewerStage.dispatchEvent(new WheelEvent('wheel', { bubbles: true, cancelable: true, deltaY: -120 }));
await wait(0);
const galleryViewerScaleAfterWheel = Number.parseFloat(galleryViewer.style.getPropertyValue('--uzu-image-viewer-scale') || '1');
galleryViewerStage.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, button: 0, pointerId: 41, clientX: 120, clientY: 120 }));
galleryViewerStage.dispatchEvent(new PointerEvent('pointermove', { bubbles: true, pointerId: 41, clientX: 150, clientY: 144 }));
galleryViewerStage.dispatchEvent(new PointerEvent('pointerup', { bubbles: true, pointerId: 41, clientX: 150, clientY: 144 }));
await wait(0);
const galleryViewerPanX = galleryViewer.style.getPropertyValue('--uzu-image-viewer-x').trim();
const galleryViewerPanY = galleryViewer.style.getPropertyValue('--uzu-image-viewer-y').trim();
click(galleryViewer.querySelector('[data-uzu-dialog-close]'));
await waitForGallery(() => galleryViewer.hidden && galleryViewerOverlay.hidden);
const galleryViewerClosedHidden = galleryViewer.hidden && galleryViewerOverlay.hidden;
const galleryViewerFocusRestored = document.activeElement === galleryFirstItem;
const galleryViewerBodyScrollRestored = getComputedStyle(document.documentElement).overflow !== 'hidden' && getComputedStyle(document.body).overflow !== 'hidden';
const downloadOffGallery = document.createElement('section');
downloadOffGallery.className = 'uzu-gallery';
downloadOffGallery.dataset.uzuGallery = '';
downloadOffGallery.dataset.uzuGalleryDownload = 'false';
downloadOffGallery.innerHTML = '<a class="uzu-gallery-item" href="data:image/svg+xml,%3Csvg%20xmlns%3D%22http://www.w3.org/2000/svg%22%20width%3D%22180%22%20height%3D%22120%22%3E%3Crect%20width%3D%22180%22%20height%3D%22120%22%20fill%3D%22%23d4d4d8%22/%3E%3C/svg%3E" data-width="180" data-height="120"><img class="uzu-gallery-image" alt="No download" src="data:image/svg+xml,%3Csvg%20xmlns%3D%22http://www.w3.org/2000/svg%22%20width%3D%22180%22%20height%3D%22120%22%3E%3Crect%20width%3D%22180%22%20height%3D%22120%22%20fill%3D%22%23d4d4d8%22/%3E%3C/svg%3E"></a>';
document.body.append(downloadOffGallery);
window.Usuzumi.init(downloadOffGallery);
click(downloadOffGallery.querySelector('.uzu-gallery-item'));
await wait(40);
const downloadOffOverlay = [...document.querySelectorAll('[data-uzu-gallery-auto-viewer]')].find((overlay) => !overlay.hidden);
const downloadOffViewer = downloadOffOverlay?.querySelector('[data-uzu-image-viewer]');
const downloadOffControl = downloadOffViewer?.querySelector('[data-uzu-image-viewer-download]');
const galleryDownloadOffHidden = downloadOffControl?.hidden === true;
const galleryDownloadOffHref = downloadOffControl?.getAttribute('href') || '';
const galleryDestroyScrollLockedBefore = getComputedStyle(document.documentElement).overflow === 'hidden' || getComputedStyle(document.body).overflow === 'hidden';
window.Usuzumi.destroy(downloadOffGallery);
await wait(0);
const galleryDestroyAutoViewerRemoved = downloadOffOverlay ? !downloadOffOverlay.isConnected : false;
const galleryDestroyScrollRestored = getComputedStyle(document.documentElement).overflow !== 'hidden' && getComputedStyle(document.body).overflow !== 'hidden';
const galleryDestroyNoInert = ![...document.body.children].some((child) => child.hasAttribute('inert'));
downloadOffGallery.remove();
const galleryApiSetReturn = window.Usuzumi.setGalleryItems(gallery, [{
  src: 'data:image/svg+xml,%3Csvg%20xmlns%3D%22http://www.w3.org/2000/svg%22%20width%3D%22320%22%20height%3D%22200%22%3E%3Crect%20width%3D%22320%22%20height%3D%22200%22%20fill%3D%22%23e4e4e7%22/%3E%3C/svg%3E',
  alt: 'API demo',
  caption: 'API image',
  width: 320,
  height: 200
}], false);
const galleryApiSetCount = gallery.querySelectorAll('.uzu-gallery-item').length;
const galleryApiSetButton = gallery.querySelector('.uzu-gallery-item')?.tagName || '';
const galleryApiRefreshReturn = window.Usuzumi.refreshGallery(gallery);
const galleryApiRefreshCount = gallery.querySelectorAll('.uzu-gallery-item').length;
const galleryApiOpenReturn = window.Usuzumi.openImageViewer(galleryViewer, {
  src: 'data:image/svg+xml,%3Csvg%20xmlns%3D%22http://www.w3.org/2000/svg%22%20width%3D%22280%22%20height%3D%22180%22%3E%3Crect%20width%3D%22280%22%20height%3D%22180%22%20fill%3D%22%23d1d5db%22/%3E%3C/svg%3E',
  alt: 'Opened by API',
  caption: 'API viewer',
  width: 280,
  height: 180
}, gallery.querySelector('.uzu-gallery-item'));
await wait(0);
const galleryApiViewerCaption = galleryViewer.querySelector('[data-uzu-image-viewer-caption]')?.textContent.trim() || '';
const galleryApiCloseReturn = window.Usuzumi.closeImageViewer(galleryViewer);
await waitForGallery(() => galleryViewer.hidden);
const galleryApiCloseHidden = galleryViewer.hidden;
const treeRowLabel = tree.querySelector('[data-uzu-tree-value="docs"] [data-uzu-tree-label]');
click(treeRowLabel);
await wait(60);
const treeClosed = tree.querySelector('.uzu-tree-group').hidden;
click(treeRowLabel);
await wait(60);
const treeOpen = !tree.querySelector('.uzu-tree-group').hidden;
const treeSelected = tree.querySelector('[data-uzu-tree-value="overview"]');
treeSelected.focus();
treeSelected.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true }));
const treeKeyboardFocusValue = document.activeElement?.dataset.uzuTreeValue || '';
const treeHiddenDetails = tree.querySelector('[data-uzu-tree-value="hidden-details"]');
click(treeHiddenDetails.querySelector('[data-uzu-tree-label]'));
await wait(60);
const treeHiddenDisclosureTargetHeight = readDisclosureTargetHeight('#consumer-tree-hidden-disclosure [data-uzu-disclosure-panel]');
window.Usuzumi.setSplitPaneSize(splitPane, 58);
window.Usuzumi.setResizableSize(resizable, 300, 150);
const splitSize = splitPane.dataset.uzuSplitSize;
const splitAriaValue = splitResizer.getAttribute('aria-valuenow');
const resizableWidth = Math.round(resizable.getBoundingClientRect().width);
const resizableHeight = Math.round(resizable.getBoundingClientRect().height);
const collapsibleSidebarLayout = document.querySelector('#consumer-collapsible-sidebar-layout');
const collapsibleSidebar = document.querySelector('#consumer-collapsible-sidebar');
const collapsibleSidebarToggle = document.querySelector('#consumer-topbar-sidebar-toggle');
const collapsibleSidebarInlineToggle = document.querySelector('#consumer-collapsible-sidebar-toggle');
let collapsibleSidebarEventDetail = null;
collapsibleSidebarLayout.addEventListener('uzu-sidebar-layout-change', (event) => { collapsibleSidebarEventDetail = event.detail; }, { once: true });
const collapsibleSidebarInitialCollapsed = collapsibleSidebarLayout.dataset.uzuSidebarCollapsed;
const collapsibleSidebarInitialExpanded = collapsibleSidebarToggle.getAttribute('aria-expanded');
const collapsibleSidebarInitialControls = collapsibleSidebarToggle.getAttribute('aria-controls');
const collapsibleSidebarInlineInitialExpanded = collapsibleSidebarInlineToggle.getAttribute('aria-expanded');
const collapsibleSidebarInitialHidden = collapsibleSidebar.hidden;
const collapsibleSidebarInitialGrid = getComputedStyle(collapsibleSidebarLayout).gridTemplateColumns;
click(collapsibleSidebarToggle);
await wait(40);
const collapsibleSidebarClosing = collapsibleSidebarLayout.classList.contains('is-closing');
const collapsibleSidebarCloseAnimation = getComputedStyle(collapsibleSidebar).animationName;
const collapsibleSidebarHiddenWhileClosing = collapsibleSidebar.hidden;
await wait(340);
const collapsibleSidebarCollapsedState = collapsibleSidebarLayout.dataset.uzuSidebarCollapsed;
const collapsibleSidebarCollapsedExpanded = collapsibleSidebarToggle.getAttribute('aria-expanded');
const collapsibleSidebarCollapsedHidden = collapsibleSidebar.hidden;
const collapsibleSidebarCollapsedGrid = getComputedStyle(collapsibleSidebarLayout).gridTemplateColumns;
const collapsibleSidebarCollapsedColumnCount = collapsibleSidebarCollapsedGrid.trim().split(/\s+/).filter(Boolean).length;
window.Usuzumi.init(collapsibleSidebarLayout);
const collapsibleSidebarAfterReinitCollapsed = collapsibleSidebarLayout.dataset.uzuSidebarCollapsed;
const collapsibleSidebarAfterReinitExpanded = collapsibleSidebarToggle.getAttribute('aria-expanded');
const collapsibleSidebarAfterReinitHidden = collapsibleSidebar.hidden;
const dynamicSidebarToggle = document.createElement('button');
dynamicSidebarToggle.type = 'button';
dynamicSidebarToggle.dataset.uzuSidebarToggle = '';
dynamicSidebarToggle.dataset.uzuSidebarTarget = '#consumer-collapsible-sidebar-layout';
document.body.append(dynamicSidebarToggle);
window.Usuzumi.init(dynamicSidebarToggle);
const dynamicSidebarToggleInitialExpanded = dynamicSidebarToggle.getAttribute('aria-expanded');
const dynamicSidebarToggleControls = dynamicSidebarToggle.getAttribute('aria-controls');
click(dynamicSidebarToggle);
await wait(40);
const collapsibleSidebarExpandedState = collapsibleSidebarLayout.dataset.uzuSidebarCollapsed;
const collapsibleSidebarExpandedExpanded = collapsibleSidebarToggle.getAttribute('aria-expanded');
const collapsibleSidebarExpandedHidden = collapsibleSidebar.hidden;
const collapsibleSidebarOpenAnimation = getComputedStyle(collapsibleSidebar).animationName;
const dynamicSidebarToggleAfterClickExpanded = dynamicSidebarToggle.getAttribute('aria-expanded');
const dynamicSidebarToggleAfterClickCollapsed = collapsibleSidebarLayout.dataset.uzuSidebarCollapsed;
const autoSidebarLayout = document.querySelector('#consumer-auto-sidebar-layout');
const autoSidebar = document.querySelector('#consumer-auto-sidebar');
const autoSidebarToggle = document.querySelector('#consumer-auto-sidebar-toggle');
const autoSidebarSelect = document.querySelector('#consumer-auto-sidebar-select');
const autoSidebarMain = autoSidebarLayout.querySelector('main');
const sidebarNarrowViewport = window.matchMedia('(max-width: 920px)').matches;
const autoSidebarInitialCollapsed = autoSidebarLayout.dataset.uzuSidebarCollapsed;
const autoSidebarInitialExpanded = autoSidebarToggle.getAttribute('aria-expanded');
const autoSidebarInitialHidden = autoSidebar.hidden;
const autoSidebarInitialPosition = getComputedStyle(autoSidebar).position;
const autoSidebarMainTopBeforeOpen = Math.round(autoSidebarMain.getBoundingClientRect().top);
const autoSidebarMainOffsetBeforeOpen = Math.round(autoSidebarMain.getBoundingClientRect().top - autoSidebarLayout.getBoundingClientRect().top);
if (autoSidebar.hidden) {
  click(autoSidebarToggle);
  await wait(40);
}
const autoSidebarOpenHidden = autoSidebar.hidden;
const autoSidebarOpenExpanded = autoSidebarToggle.getAttribute('aria-expanded');
const autoSidebarOpenAnimation = getComputedStyle(autoSidebar).animationName;
const autoSidebarOpenPosition = getComputedStyle(autoSidebar).position;
const autoSidebarMainTopAfterOpen = Math.round(autoSidebarMain.getBoundingClientRect().top);
const autoSidebarMainOffsetAfterOpen = Math.round(autoSidebarMain.getBoundingClientRect().top - autoSidebarLayout.getBoundingClientRect().top);
document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
await wait(260);
const autoSidebarAfterEscapeCollapsed = autoSidebarLayout.dataset.uzuSidebarCollapsed;
const autoSidebarAfterEscapeHidden = autoSidebar.hidden;
if (autoSidebar.hidden) {
  click(autoSidebarToggle);
  await wait(40);
}
click(document.querySelector('#consumer-list'));
await wait(260);
const autoSidebarAfterOutsideClickCollapsed = autoSidebarLayout.dataset.uzuSidebarCollapsed;
const autoSidebarAfterOutsideClickHidden = autoSidebar.hidden;
if (autoSidebar.hidden) {
  click(autoSidebarToggle);
  await wait(40);
}
click(autoSidebarMain);
await wait(260);
const autoSidebarAfterContentClickCollapsed = autoSidebarLayout.dataset.uzuSidebarCollapsed;
const autoSidebarAfterContentClickHidden = autoSidebar.hidden;
if (autoSidebar.hidden) {
  click(autoSidebarToggle);
  await wait(40);
}
click(autoSidebarSelect);
await wait(260);
const autoSidebarAfterSelectCollapsed = autoSidebarLayout.dataset.uzuSidebarCollapsed;
const autoSidebarAfterSelectHidden = autoSidebar.hidden;
const inlineSidebarLayout = document.querySelector('#consumer-inline-sidebar-layout');
const inlineSidebar = document.querySelector('#consumer-inline-sidebar');
const inlineSidebarToggle = document.querySelector('#consumer-inline-sidebar-toggle');
const inlineSidebarMain = document.querySelector('#consumer-inline-sidebar-main');
const inlineSidebarInitialCollapsed = inlineSidebarLayout.dataset.uzuSidebarCollapsed;
const inlineSidebarInitialHidden = inlineSidebar.hidden;
const inlineSidebarInitialPosition = getComputedStyle(inlineSidebar).position;
const inlineSidebarMainTopBeforeOpen = Math.round(inlineSidebarMain.getBoundingClientRect().top);
const inlineSidebarMainOffsetBeforeOpen = Math.round(inlineSidebarMain.getBoundingClientRect().top - inlineSidebarLayout.getBoundingClientRect().top);
if (inlineSidebar.hidden) {
  click(inlineSidebarToggle);
  await wait(40);
}
const inlineSidebarOpenHidden = inlineSidebar.hidden;
const inlineSidebarOpenPosition = getComputedStyle(inlineSidebar).position;
const inlineSidebarMainTopAfterOpen = Math.round(inlineSidebarMain.getBoundingClientRect().top);
const inlineSidebarMainOffsetAfterOpen = Math.round(inlineSidebarMain.getBoundingClientRect().top - inlineSidebarLayout.getBoundingClientRect().top);
const jsonToggle = jsonViewer.querySelector('.uzu-json-toggle');
const jsonNodeCount = jsonViewer.querySelectorAll('.uzu-json-node').length;
const jsonLines = [...jsonViewer.querySelectorAll('.uzu-json-line')];
const jsonFirstLineNumber = jsonLines[0]?.dataset.uzuJsonLine || '';
const jsonSecondLineNumber = jsonLines[1]?.dataset.uzuJsonLine || '';
const jsonLineDisplay = getComputedStyle(jsonLines[0]).display;
const jsonLineNumberWidth = getComputedStyle(jsonViewer).getPropertyValue('--uzu-json-line-number-width').trim();
const jsonFoldWidth = getComputedStyle(jsonViewer).getPropertyValue('--uzu-json-fold-width').trim();
const jsonIndent = getComputedStyle(jsonViewer).getPropertyValue('--uzu-json-indent').trim();
const jsonHasNestedDepth = jsonLines.some((line) => line.style.getPropertyValue('--uzu-json-depth').trim() === '1');
const jsonNestedCodePaddingLeft = Number.parseFloat(getComputedStyle(jsonLines.find((line) => line.style.getPropertyValue('--uzu-json-depth').trim() === '1')?.querySelector('.uzu-json-code')).paddingLeft);
const jsonToggleOpacity = getComputedStyle(jsonToggle).opacity;
const jsonToggleWidth = Math.round(jsonToggle.getBoundingClientRect().width);
const jsonToggleBox = jsonToggle.getBoundingClientRect();
const jsonToggleCenterAligned = Math.abs((jsonToggleBox.top + jsonToggleBox.height / 2) - (jsonLines[0].getBoundingClientRect().top + jsonLines[0].getBoundingClientRect().height / 2)) < 1.5;
const jsonFoldGutterX = jsonLines[0].getBoundingClientRect().left + Number.parseFloat(jsonLineNumberWidth) + Number.parseFloat(jsonFoldWidth) / 2;
const jsonFoldGutterY = jsonLines[0].getBoundingClientRect().top + jsonLines[0].getBoundingClientRect().height / 2;
jsonViewer.dispatchEvent(new PointerEvent('pointermove', { bubbles: true, clientX: jsonFoldGutterX, clientY: jsonFoldGutterY }));
await wait(80);
const jsonFoldGutterHover = jsonViewer.classList.contains('is-fold-gutter-hover');
const jsonVisibleToggleCountOnGutterHover = [...jsonViewer.querySelectorAll('.uzu-json-toggle')].filter((toggle) => Number.parseFloat(getComputedStyle(toggle).opacity) > 0.5).length;
jsonViewer.dispatchEvent(new PointerEvent('pointermove', { bubbles: true, clientX: jsonLines[0].getBoundingClientRect().left + Number.parseFloat(jsonLineNumberWidth) + Number.parseFloat(jsonFoldWidth) + 16, clientY: jsonFoldGutterY }));
await wait(80);
const jsonFoldGutterHoverCleared = !jsonViewer.classList.contains('is-fold-gutter-hover');
const jsonToggleText = jsonToggle.textContent.trim();
const jsonOpenPunctuationText = jsonViewer.querySelector('.uzu-json-line .uzu-code-token-punctuation')?.textContent || '';
const jsonUsesCodeTokens = Boolean(
  jsonViewer.querySelector('.uzu-code-token-punctuation')
  && jsonViewer.querySelector('.uzu-code-token-property')
  && jsonViewer.querySelector('.uzu-code-token-string')
  && jsonViewer.querySelector('.uzu-code-token-keyword')
);
const jsonEscapedKeyTexts = [...jsonEscapedKeyViewer.querySelectorAll('.uzu-json-key')].map((node) => node.textContent);
const jsonEscapedStringTexts = [...jsonEscapedKeyViewer.querySelectorAll('.uzu-json-string')].map((node) => node.textContent);
click(jsonToggle);
const jsonCollapsed = jsonToggle.classList.contains('is-collapsed');
const jsonCollapsedAria = jsonToggle.getAttribute('aria-expanded');
const jsonChildrenHidden = jsonViewer.querySelector('.uzu-json-children')?.hidden === true;
const jsonCollapsedSummaryVisible = getComputedStyle(jsonViewer.querySelector('.uzu-json-summary')).display !== 'none';
const jsonCollapsedSummaryText = jsonViewer.querySelector('.uzu-json-summary')?.textContent.trim() || '';
const diffAddRows = diffViewer.querySelectorAll('.uzu-diff-line-add').length;
const diffRemoveRows = diffViewer.querySelectorAll('.uzu-diff-line-remove').length;
markdownEditorSource.value = '## Updated';
markdownEditorSource.dispatchEvent(new Event('input', { bubbles: true }));
markdownEditorSource.value = '';
markdownEditorSource.dispatchEvent(new Event('input', { bubbles: true }));
const markdownEditorCleared = markdownEditorPreview.textContent.trim();
markdownEditorSource.value = '## Updated';
markdownEditorSource.dispatchEvent(new Event('input', { bubbles: true }));
inlineEditor.textContent = 'Changed inline';
inlineEditor.dispatchEvent(new Event('input', { bubbles: true }));
await wait(80);
const markdownEditorHeading = markdownEditorPreview.querySelector('h2')?.textContent.trim() || '';
const markdownFence = String.fromCharCode(96, 96, 96);
const markdownLineBreak = String.fromCharCode(10);
window.Usuzumi.applyLanguage(document.documentElement, 'zh', '', 'zh-CN');
await wait(60);
markdownEditorSource.value = markdownFence + 'js' + markdownLineBreak + 'const copied = true;' + markdownLineBreak + markdownFence;
markdownEditorSource.dispatchEvent(new Event('input', { bubbles: true }));
const markdownEditorCopyButton = markdownEditorPreview.querySelector('[data-uzu-code-copy]');
const markdownEditorCopyInitialized = markdownEditorCopyButton?.dataset.uzuCodeCopyInitialized === 'true';
const getMarkdownEditorActiveCodeCopyLabelText = (button) => Array.from(button?.querySelectorAll('[data-uzu-code-copy-label]') || [])
  .find((label) => !label.hasAttribute('data-uzu-language-hidden'))
  ?.textContent.trim() || '';
const markdownEditorCodeCopyZh = {
  aria: markdownEditorCopyButton?.getAttribute('aria-label') || '',
  label: getMarkdownEditorActiveCodeCopyLabelText(markdownEditorCopyButton),
  zhHidden: markdownEditorCopyButton?.querySelector('[data-uzu-code-copy-label][data-lang="zh"]')?.hasAttribute('data-uzu-language-hidden') || false,
  enHidden: markdownEditorCopyButton?.querySelector('[data-uzu-code-copy-label][data-lang="en"]')?.hasAttribute('data-uzu-language-hidden') || false
};
window.Usuzumi.applyLanguage(document.documentElement, 'en', '', 'en');
await wait(60);
const markdownEditorCodeCopyEn = {
  aria: markdownEditorCopyButton?.getAttribute('aria-label') || '',
  label: getMarkdownEditorActiveCodeCopyLabelText(markdownEditorCopyButton),
  zhHidden: markdownEditorCopyButton?.querySelector('[data-uzu-code-copy-label][data-lang="zh"]')?.hasAttribute('data-uzu-language-hidden') || false,
  enHidden: markdownEditorCopyButton?.querySelector('[data-uzu-code-copy-label][data-lang="en"]')?.hasAttribute('data-uzu-language-hidden') || false
};
markdownEditorSource.value = markdownFence + 'js' + markdownLineBreak + 'const copiedAgain = true;' + markdownLineBreak + markdownFence;
markdownEditorSource.dispatchEvent(new Event('input', { bubbles: true }));
const markdownEditorCopyButtonAfterLanguageRender = markdownEditorPreview.querySelector('[data-uzu-code-copy]');
const markdownEditorCodeCopyEnAfterRender = {
  aria: markdownEditorCopyButtonAfterLanguageRender?.getAttribute('aria-label') || '',
  label: getMarkdownEditorActiveCodeCopyLabelText(markdownEditorCopyButtonAfterLanguageRender),
  zhHidden: markdownEditorCopyButtonAfterLanguageRender?.querySelector('[data-uzu-code-copy-label][data-lang="zh"]')?.hasAttribute('data-uzu-language-hidden') || false,
  enHidden: markdownEditorCopyButtonAfterLanguageRender?.querySelector('[data-uzu-code-copy-label][data-lang="en"]')?.hasAttribute('data-uzu-language-hidden') || false
};
window.Usuzumi.applyLanguage(document.documentElement, 'zh', '', 'zh-CN');
await wait(60);
const inlineEditorValue = inlineEditor.textContent;`;
