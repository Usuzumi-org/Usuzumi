  const galleryRootSelector = '[data-uzu-gallery]';
  const galleryItemSelector = '.uzu-gallery-item';
  const imageViewerSelector = '[data-uzu-image-viewer]';
  const galleryImageExtensions = /\.(?:avif|gif|jpe?g|png|svg|webp)(?:[?#].*)?$/i;
  const galleryState = new WeakMap();
  const galleryCleanups = new WeakMap();
  const galleryAutoViewers = new WeakMap();
  const imageViewerState = new WeakMap();
  const imageViewerCleanups = new WeakMap();

  function resolveElement(target, selector = '') {
    if (target instanceof Element) return target;
    if (typeof target !== 'string' || !target.trim()) return null;
    try {
      const element = document.querySelector(target);
      return selector && element && !element.matches(selector) ? element.querySelector(selector) : element;
    } catch (_) {
      return null;
    }
  }

  function getGalleryState(gallery) {
    const current = galleryState.get(gallery);
    if (current) return current;
    const state = { items: [], source: 'static', requestId: 0, destroyed: false };
    galleryState.set(gallery, state);
    return state;
  }

  function getGalleryScoped(gallery, selector) {
    return getScopedControls(gallery, selector, galleryRootSelector);
  }

  function clampGalleryNumber(value, fallback, min = 0, max = Number.POSITIVE_INFINITY) {
    const number = Number.parseFloat(value);
    if (!Number.isFinite(number)) return fallback;
    return Math.min(max, Math.max(min, number));
  }

  function getGalleryGap(gallery) {
    const gap = clampGalleryNumber(gallery.dataset.uzuGalleryGap, 12, 0, 80);
    gallery.style.setProperty('--uzu-gallery-gap', `${gap}px`);
    return gap;
  }

  function getGalleryRowHeight(gallery) {
    const target = clampGalleryNumber(gallery.dataset.uzuGalleryRowHeight, 260, 80, 720);
    const narrow = gallery.clientWidth && gallery.clientWidth < 560 ? Math.min(target, 180) : target;
    gallery.style.setProperty('--uzu-gallery-row-height', `${narrow}px`);
    return narrow;
  }

  function fileNameToCaption(src) {
    try {
      const url = new URL(src, window.location.href);
      const name = decodeURIComponent(url.pathname.split('/').filter(Boolean).at(-1) || '');
      return name.replace(/\.[^.]+$/, '').replace(/[-_]+/g, ' ').trim() || src;
    } catch (_) {
      return String(src || '').split('/').filter(Boolean).at(-1)?.replace(/\.[^.]+$/, '').replace(/[-_]+/g, ' ').trim() || String(src || '');
    }
  }

  function normalizeGalleryItem(raw, index = 0, gallery = null) {
    if (!raw || typeof raw !== 'object') return null;
    const src = String(raw.src || raw.href || '').trim();
    if (!src) return null;
    const width = clampGalleryNumber(raw.width, 0, 0);
    const height = clampGalleryNumber(raw.height, 0, 0);
    const caption = raw.caption == null || raw.caption === '' ? fileNameToCaption(src) : String(raw.caption);
    const alt = raw.alt == null ? '' : String(raw.alt);
    const rawDownload = raw.download;
    const hasDownload = Object.prototype.hasOwnProperty.call(raw, 'download');
    const galleryAllowsDownload = !gallery || (gallery.dataset.uzuGalleryDownload || 'true').trim().toLowerCase() !== 'false';
    const download = !galleryAllowsDownload || rawDownload === false || rawDownload === 'false' || (hasDownload && rawDownload === '')
      ? ''
      : String(hasDownload && rawDownload != null ? rawDownload : src);
    return {
      src,
      alt,
      caption,
      width,
      height,
      download,
      index,
      element: raw.element || null
    };
  }

  function normalizeGalleryItems(rawItems, gallery = null) {
    const input = Array.isArray(rawItems) ? rawItems : rawItems?.items;
    if (!Array.isArray(input)) return [];
    return input.map((item, index) => normalizeGalleryItem(item, index, gallery)).filter(Boolean);
  }

  function parseGalleryJson(text) {
    const parsed = JSON.parse(String(text || '[]'));
    return Array.isArray(parsed) ? parsed : parsed.items || [];
  }

  function getGalleryDataSourceElement(source) {
    if (!source || !source.startsWith('#')) return null;
    try {
      return document.querySelector(source);
    } catch (_) {
      return null;
    }
  }

  function parseDirectoryGalleryItems(html, source) {
    const doc = new DOMParser().parseFromString(String(html || ''), 'text/html');
    const base = new URL(source, window.location.href);
    const seen = new Set();
    return [...doc.querySelectorAll('a[href]')].flatMap((link) => {
      const absolute = new URL(link.getAttribute('href') || '', base).href;
      if (!galleryImageExtensions.test(absolute) || seen.has(absolute)) return [];
      seen.add(absolute);
      const label = link.textContent.trim();
      return [{
        src: absolute,
        alt: label || '',
        caption: label || fileNameToCaption(absolute),
        download: absolute
      }];
    });
  }

  function clearGalleryMessages(gallery) {
    getGalleryScoped(gallery, '.uzu-gallery-empty, .uzu-gallery-error').forEach((message) => message.remove());
  }

  function renderGalleryMessage(gallery, className, message) {
    clearGalleryMessages(gallery);
    const element = document.createElement('div');
    element.className = className;
    element.textContent = message;
    gallery.append(element);
  }

  function setGalleryState(gallery, state, message = '') {
    gallery.dataset.uzuGalleryState = state;
    gallery.setAttribute('aria-busy', state === 'loading' ? 'true' : 'false');
    if (state === 'empty') renderGalleryMessage(gallery, 'uzu-gallery-empty', message || 'No images.');
    else if (state === 'error') renderGalleryMessage(gallery, 'uzu-gallery-error', message || 'Images could not be loaded.');
    else clearGalleryMessages(gallery);
  }

  function emitGalleryLoad(gallery, items, source) {
    gallery.dispatchEvent(new CustomEvent('uzu-gallery-load', {
      bubbles: true,
      detail: { gallery, items, source }
    }));
  }

  function emitGalleryError(gallery, source, error) {
    gallery.dispatchEvent(new CustomEvent('uzu-gallery-error', {
      bubbles: true,
      detail: { gallery, source, error }
    }));
  }

  function syncGalleryImageRatio(element, item) {
    const width = Number(item.width) || 0;
    const height = Number(item.height) || 0;
    if (width > 0 && height > 0) element.style.setProperty('--uzu-gallery-item-ratio', `${width} / ${height}`);
  }

  function updateGalleryItemNaturalSize(gallery, item, img) {
    if (!img || !img.naturalWidth || !img.naturalHeight) return;
    if (!item.width) item.width = img.naturalWidth;
    if (!item.height) item.height = img.naturalHeight;
    syncGalleryImageRatio(item.element, item);
    layoutGallery(gallery);
  }

  function getGalleryViewerMode(gallery) {
    return (gallery.dataset.uzuGalleryViewer || 'auto').trim().toLowerCase();
  }

  function createGalleryItem(gallery, item) {
    const element = getGalleryViewerMode(gallery) === 'none' ? document.createElement('a') : document.createElement('button');
    if (element.tagName === 'BUTTON') element.type = 'button';
    if (element.tagName === 'A') element.href = item.src;
    element.className = 'uzu-gallery-item';
    element.dataset.uzuGalleryIndex = String(item.index);
    const img = document.createElement('img');
    img.className = 'uzu-gallery-image';
    img.src = item.src;
    img.alt = item.alt;
    img.loading = 'lazy';
    img.decoding = 'async';
    img.draggable = false;
    element.append(img);
    if ((gallery.dataset.uzuGalleryCaption || 'auto') !== 'none') {
      const caption = document.createElement('span');
      caption.className = 'uzu-gallery-caption';
      caption.textContent = item.caption;
      element.append(caption);
    }
    item.element = element;
    syncGalleryImageRatio(element, item);
    img.addEventListener('load', () => updateGalleryItemNaturalSize(gallery, item, img), { once: true });
    return element;
  }

  function renderGalleryItems(gallery, items) {
    getGalleryScoped(gallery, galleryItemSelector).forEach((item) => item.remove());
    clearGalleryMessages(gallery);
    const fragment = document.createDocumentFragment();
    items.forEach((item, index) => {
      item.index = index;
      fragment.append(createGalleryItem(gallery, item));
    });
    gallery.append(fragment);
  }

  function normalizeStaticGallery(gallery) {
    return getGalleryScoped(gallery, galleryItemSelector).map((element, index) => {
      const img = element.querySelector('img, .uzu-gallery-image');
      if (img) img.classList.add('uzu-gallery-image');
      const src = element.getAttribute('href') || element.dataset.src || img?.currentSrc || img?.getAttribute('src') || '';
      const captionElement = element.querySelector('.uzu-gallery-caption');
      const raw = {
        src,
        alt: img?.getAttribute('alt') || '',
        caption: captionElement?.textContent.trim() || element.dataset.caption || '',
        width: element.dataset.width || img?.getAttribute('width') || img?.naturalWidth || 0,
        height: element.dataset.height || img?.getAttribute('height') || img?.naturalHeight || 0,
        download: element.dataset.download || element.getAttribute('download') || src,
        element
      };
      const item = normalizeGalleryItem(raw, index, gallery);
      if (!item) return null;
      element.classList.add('uzu-gallery-item');
      element.dataset.uzuGalleryIndex = String(index);
      syncGalleryImageRatio(element, item);
      if (!captionElement && item.caption && (gallery.dataset.uzuGalleryCaption || 'auto') !== 'none') {
        const caption = document.createElement('span');
        caption.className = 'uzu-gallery-caption';
        caption.textContent = item.caption;
        element.append(caption);
      }
      if (img && (!item.width || !item.height)) {
        if (img.complete) updateGalleryItemNaturalSize(gallery, item, img);
        else img.addEventListener('load', () => updateGalleryItemNaturalSize(gallery, item, img), { once: true });
      }
      return item;
    }).filter(Boolean);
  }

  function layoutGallery(gallery) {
    const state = galleryState.get(gallery);
    if (!state) return;
    const layout = (gallery.dataset.uzuGalleryLayout || 'justified').toLowerCase();
    const gap = getGalleryGap(gallery);
    const items = state.items.filter((item) => item.element);
    if (layout !== 'justified' || !items.length) {
      gallery.classList.remove('is-justified');
      items.forEach((item) => {
        item.element.style.removeProperty('--uzu-gallery-item-width');
        item.element.style.removeProperty('--uzu-gallery-item-height');
      });
      return;
    }
    const available = Math.max(0, gallery.clientWidth);
    if (!available) return;
    const targetHeight = getGalleryRowHeight(gallery);
    gallery.classList.add('is-justified');
    const rows = [];
    let row = [];
    let ratioSum = 0;
    const flush = (fill = true) => {
      if (!row.length) return;
      const gaps = Math.max(0, row.length - 1) * gap;
      const availableWidth = Math.max(80, available - gaps);
      const filledHeight = availableWidth / Math.max(0.01, ratioSum);
      const height = fill ? Math.min(targetHeight * 1.45, Math.max(96, filledHeight)) : Math.min(targetHeight, Math.max(96, filledHeight));
      rows.push({ items: row, height });
      row = [];
      ratioSum = 0;
    };
    items.forEach((item) => {
      const ratio = item.width > 0 && item.height > 0 ? item.width / item.height : 4 / 3;
      row.push({ item, ratio });
      ratioSum += ratio;
      const projected = (available - Math.max(0, row.length - 1) * gap) / Math.max(0.01, ratioSum);
      if (projected <= targetHeight || row.length >= 6) flush(true);
    });
    flush(false);
    rows.forEach(({ items: rowItems, height }) => {
      rowItems.forEach(({ item, ratio }) => {
        item.element.style.setProperty('--uzu-gallery-item-width', `${Math.max(80, Math.round(ratio * height))}px`);
        item.element.style.setProperty('--uzu-gallery-item-height', `${Math.round(height)}px`);
      });
    });
  }

  function setGalleryItems(galleryOrSelector, rawItems, emit = true) {
    const gallery = resolveElement(galleryOrSelector, galleryRootSelector);
    if (!gallery) return null;
    const items = normalizeGalleryItems(rawItems, gallery);
    const state = getGalleryState(gallery);
    state.destroyed = false;
    state.requestId += 1;
    state.items = items;
    state.source = 'api';
    renderGalleryItems(gallery, items);
    setGalleryState(gallery, items.length ? 'ready' : 'empty');
    layoutGallery(gallery);
    if (emit) emitGalleryLoad(gallery, items, 'api');
    return gallery;
  }

  async function loadGalleryFromUrl(gallery, source, requestId) {
    const state = getGalleryState(gallery);
    try {
      const response = await fetch(source, { credentials: 'same-origin' });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      if (state.destroyed || state.requestId !== requestId || galleryState.get(gallery) !== state) return;
      const contentType = response.headers.get('content-type') || '';
      const text = await response.text();
      if (state.destroyed || state.requestId !== requestId || galleryState.get(gallery) !== state) return;
      const rawItems = /\.json(?:[?#].*)?$/i.test(source) || /\bjson\b/i.test(contentType)
        ? parseGalleryJson(text)
        : parseDirectoryGalleryItems(text, source);
      const items = normalizeGalleryItems(rawItems, gallery);
      state.items = items;
      state.source = source;
      renderGalleryItems(gallery, items);
      setGalleryState(gallery, items.length ? 'ready' : 'empty');
      layoutGallery(gallery);
      emitGalleryLoad(gallery, items, source);
    } catch (error) {
      if (state.destroyed || state.requestId !== requestId || galleryState.get(gallery) !== state) return;
      state.items = [];
      setGalleryState(gallery, 'error');
      emitGalleryError(gallery, source, error);
    }
  }

  function refreshGallery(galleryOrSelector) {
    const gallery = resolveElement(galleryOrSelector, galleryRootSelector);
    if (!gallery) return null;
    const state = getGalleryState(gallery);
    state.destroyed = false;
    state.requestId += 1;
    const requestId = state.requestId;
    const source = (gallery.dataset.uzuGallerySource || '').trim();
    getGalleryGap(gallery);
    getGalleryRowHeight(gallery);
    if (!source) {
      const items = normalizeStaticGallery(gallery);
      state.items = items;
      state.source = 'static';
      setGalleryState(gallery, items.length ? 'ready' : 'empty');
      layoutGallery(gallery);
      return gallery;
    }
    setGalleryState(gallery, 'loading');
    const sourceElement = getGalleryDataSourceElement(source);
    if (sourceElement) {
      try {
        const items = normalizeGalleryItems(parseGalleryJson(sourceElement.textContent || '[]'), gallery);
        state.items = items;
        state.source = source;
        renderGalleryItems(gallery, items);
        setGalleryState(gallery, items.length ? 'ready' : 'empty');
        layoutGallery(gallery);
        emitGalleryLoad(gallery, items, source);
      } catch (error) {
        state.items = [];
        setGalleryState(gallery, 'error');
        emitGalleryError(gallery, source, error);
      }
      return gallery;
    }
    loadGalleryFromUrl(gallery, source, requestId);
    return gallery;
  }

  function getGalleryItemForElement(gallery, element) {
    const state = galleryState.get(gallery);
    const index = Number.parseInt(element.dataset.uzuGalleryIndex || '', 10);
    return state?.items.find((item) => item.element === element || item.index === index) || normalizeStaticGallery(gallery).find((item) => item.element === element) || null;
  }

  function resolveGalleryViewer(gallery) {
    const mode = getGalleryViewerMode(gallery);
    if (mode === 'none') return null;
    if (mode && mode !== 'auto') {
      const target = resolveElement(mode);
      if (!target) return null;
      return target.matches(imageViewerSelector) ? target : target.querySelector(imageViewerSelector);
    }
    return ensureAutoImageViewer(gallery);
  }

  function emitGallerySelect(gallery, item, trigger, viewer) {
    gallery.dispatchEvent(new CustomEvent('uzu-gallery-select', {
      bubbles: true,
      detail: { gallery, item, index: item.index, trigger, viewer }
    }));
  }

  function selectGalleryItem(gallery, element, event = null) {
    const item = getGalleryItemForElement(gallery, element);
    if (!item) return;
    const viewer = resolveGalleryViewer(gallery);
    if (!viewer) return;
    if (event) event.preventDefault();
    openImageViewer(viewer, item, element);
    emitGallerySelect(gallery, item, element, viewer);
  }

  function addCleanup(map, root, cleanup) {
    const cleanups = map.get(root) || [];
    cleanups.push(cleanup);
    map.set(root, cleanups);
  }

  function listenWithCleanup(map, root, target, type, listener, options) {
    target.addEventListener(type, listener, options);
    addCleanup(map, root, () => target.removeEventListener(type, listener, options));
  }

  function observeGalleryResize(gallery) {
    if (typeof ResizeObserver !== 'undefined') {
      const observer = new ResizeObserver(() => window.requestAnimationFrame(() => layoutGallery(gallery)));
      observer.observe(gallery);
      addCleanup(galleryCleanups, gallery, () => observer.disconnect());
      return;
    }
    const listener = () => layoutGallery(gallery);
    window.addEventListener('resize', listener);
    addCleanup(galleryCleanups, gallery, () => window.removeEventListener('resize', listener));
  }

  function initGalleries(root = document) {
    queryAll(root, galleryRootSelector).forEach((gallery) => {
      refreshGallery(gallery);
      if (!markInitialized(gallery, 'Gallery')) return;
      listenWithCleanup(galleryCleanups, gallery, gallery, 'click', (event) => {
        const item = getScopedEventControl(event, galleryItemSelector, gallery, galleryRootSelector);
        if (!item || getGalleryViewerMode(gallery) === 'none') return;
        selectGalleryItem(gallery, item, event);
      });
      listenWithCleanup(galleryCleanups, gallery, gallery, 'keydown', (event) => {
        if (!['Enter', ' '].includes(event.key) || getGalleryViewerMode(gallery) === 'none') return;
        const item = getScopedEventControl(event, galleryItemSelector, gallery, galleryRootSelector);
        if (!item) return;
        selectGalleryItem(gallery, item, event);
      });
      observeGalleryResize(gallery);
    });
    queryAll(root, imageViewerSelector).forEach((viewer) => initImageViewer(viewer));
  }

  function makeImageViewerIcon(tagName, attribute, label, svgPath) {
    const element = document.createElement(tagName);
    element.className = 'uzu-icon-button';
    element.setAttribute(attribute, '');
    element.setAttribute('aria-label', label);
    if (tagName === 'button') element.type = 'button';
    element.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true" fill="none">${svgPath}</svg>`;
    return element;
  }

  function ensureAutoImageViewer(gallery) {
    const current = galleryAutoViewers.get(gallery);
    if (current && current.isConnected) return current;
    const overlay = document.createElement('div');
    overlay.className = 'uzu-dialog-overlay uzu-image-viewer-overlay';
    overlay.setAttribute('data-uzu-dialog-overlay', '');
    overlay.setAttribute('data-uzu-gallery-auto-viewer', '');
    overlay.hidden = true;
    const viewer = document.createElement('section');
    viewer.className = 'uzu-image-viewer';
    viewer.setAttribute('data-uzu-image-viewer', '');
    viewer.setAttribute('data-uzu-dialog', '');
    viewer.setAttribute('aria-label', 'Image viewer');
    viewer.tabIndex = -1;
    viewer.hidden = true;
    const toolbar = document.createElement('div');
    toolbar.className = 'uzu-image-viewer-toolbar';
    const controls = document.createElement('div');
    controls.className = 'uzu-flex uzu-gap-2 uzu-wrap';
    controls.append(
      makeImageViewerIcon('button', 'data-uzu-image-viewer-zoom-out', 'Zoom out', '<path d="M5 12h14" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>'),
      makeImageViewerIcon('button', 'data-uzu-image-viewer-reset', 'Reset zoom', '<path d="M7 7h10v10H7z" stroke="currentColor" stroke-width="1.7"/><path d="M4 12h3M17 12h3M12 4v3M12 17v3" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/>'),
      makeImageViewerIcon('button', 'data-uzu-image-viewer-zoom-in', 'Zoom in', '<path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>')
    );
    const download = makeImageViewerIcon('a', 'data-uzu-image-viewer-download', 'Download image', '<path d="M12 4v11M8 11l4 4 4-4M5 20h14" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>');
    download.setAttribute('download', '');
    controls.append(download);
    const close = makeImageViewerIcon('button', 'data-uzu-dialog-close', 'Close image viewer', '<path d="M6 6l12 12M18 6 6 18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>');
    toolbar.append(controls, close);
    const stage = document.createElement('div');
    stage.className = 'uzu-image-viewer-stage';
    stage.setAttribute('data-uzu-image-viewer-stage', '');
    const image = document.createElement('img');
    image.className = 'uzu-image-viewer-image';
    image.setAttribute('data-uzu-image-viewer-image', '');
    image.draggable = false;
    stage.append(image);
    const caption = document.createElement('p');
    caption.className = 'uzu-image-viewer-caption';
    caption.setAttribute('data-uzu-image-viewer-caption', '');
    viewer.append(toolbar, stage, caption);
    overlay.append(viewer);
    document.body.append(overlay);
    galleryAutoViewers.set(gallery, viewer);
    initDialogs(overlay);
    initImageViewer(viewer);
    return viewer;
  }

  function getImageViewerState(viewer) {
    const current = imageViewerState.get(viewer);
    if (current) return current;
    const state = { item: null, trigger: null, scale: 1, x: 0, y: 0, pointer: null };
    imageViewerState.set(viewer, state);
    return state;
  }

  function getViewerScoped(viewer, selector) {
    return getScopedControls(viewer, selector, imageViewerSelector)[0] || null;
  }

  function getViewerStage(viewer) {
    return getViewerScoped(viewer, '[data-uzu-image-viewer-stage], .uzu-image-viewer-stage');
  }

  function getViewerImage(viewer) {
    return getViewerScoped(viewer, '[data-uzu-image-viewer-image], .uzu-image-viewer-image');
  }

  function getViewerCaption(viewer) {
    return getViewerScoped(viewer, '[data-uzu-image-viewer-caption], .uzu-image-viewer-caption');
  }

  function clampViewerScale(viewer, scale) {
    const min = clampGalleryNumber(viewer.dataset.uzuImageViewerMinScale, 0.25, 0.05, 10);
    const max = clampGalleryNumber(viewer.dataset.uzuImageViewerMaxScale, 6, min, 20);
    return Math.min(max, Math.max(min, scale));
  }

  function syncImageViewerTransform(viewer, emit = false) {
    const state = getImageViewerState(viewer);
    viewer.style.setProperty('--uzu-image-viewer-scale', String(state.scale));
    viewer.style.setProperty('--uzu-image-viewer-x', `${Math.round(state.x)}px`);
    viewer.style.setProperty('--uzu-image-viewer-y', `${Math.round(state.y)}px`);
    if (emit) {
      viewer.dispatchEvent(new CustomEvent('uzu-image-viewer-zoom', {
        bubbles: true,
        detail: { viewer, item: state.item, scale: state.scale }
      }));
    }
  }

  function resetImageViewer(viewer, emit = false) {
    const state = getImageViewerState(viewer);
    state.scale = 1;
    state.x = 0;
    state.y = 0;
    syncImageViewerTransform(viewer, emit);
  }

  function zoomImageViewer(viewer, delta, emit = true) {
    const state = getImageViewerState(viewer);
    state.scale = clampViewerScale(viewer, state.scale * delta);
    syncImageViewerTransform(viewer, emit);
  }

  function updateImageViewerDownload(viewer, item) {
    const download = getViewerScoped(viewer, '[data-uzu-image-viewer-download]');
    if (!download) return;
    if (!item.download) {
      download.hidden = true;
      download.removeAttribute('href');
      return;
    }
    download.hidden = false;
    download.setAttribute('href', item.download);
    download.setAttribute('download', '');
  }

  function openImageViewer(viewerOrSelector, rawItem, trigger = null) {
    const viewer = resolveElement(viewerOrSelector, imageViewerSelector);
    const item = normalizeGalleryItem(rawItem, rawItem?.index || 0) || rawItem;
    if (!viewer || !item?.src) return null;
    initImageViewer(viewer);
    const state = getImageViewerState(viewer);
    state.item = item;
    state.trigger = trigger;
    const image = getViewerImage(viewer);
    const caption = getViewerCaption(viewer);
    if (image) {
      image.src = item.src;
      image.alt = item.alt || '';
      image.draggable = false;
    }
    if (caption) caption.textContent = item.caption || item.alt || fileNameToCaption(item.src);
    updateImageViewerDownload(viewer, item);
    resetImageViewer(viewer, false);
    const overlay = viewer.closest('[data-uzu-dialog-overlay]');
    if (overlay) initDialogs(overlay);
    openDialog(viewer, trigger);
    viewer.dispatchEvent(new CustomEvent('uzu-image-viewer-open', {
      bubbles: true,
      detail: { viewer, item, trigger }
    }));
    return viewer;
  }

  function closeImageViewer(viewerOrSelector) {
    const viewer = resolveElement(viewerOrSelector, imageViewerSelector);
    if (!viewer) return null;
    closeDialog(viewer);
    return viewer;
  }

  function initImageViewer(viewer) {
    if (!viewer.matches(imageViewerSelector)) return;
    getImageViewerState(viewer);
    if (!markInitialized(viewer, 'ImageViewer')) return;
    listenWithCleanup(imageViewerCleanups, viewer, viewer, 'click', (event) => {
      const target = event.target instanceof Element ? event.target : null;
      if (!target) return;
      if (target.closest('[data-uzu-image-viewer-zoom-in]')) zoomImageViewer(viewer, 1.2);
      else if (target.closest('[data-uzu-image-viewer-zoom-out]')) zoomImageViewer(viewer, 1 / 1.2);
      else if (target.closest('[data-uzu-image-viewer-reset]')) resetImageViewer(viewer, true);
    });
    listenWithCleanup(imageViewerCleanups, viewer, viewer, 'keydown', (event) => {
      if (event.key === '+' || event.key === '=') {
        event.preventDefault();
        zoomImageViewer(viewer, 1.2);
      } else if (event.key === '-') {
        event.preventDefault();
        zoomImageViewer(viewer, 1 / 1.2);
      } else if (event.key === '0') {
        event.preventDefault();
        resetImageViewer(viewer, true);
      }
    });
    const stage = getViewerStage(viewer);
    if (stage) {
      listenWithCleanup(imageViewerCleanups, viewer, stage, 'wheel', (event) => {
        if ((viewer.dataset.uzuImageViewerWheelZoom || 'true') === 'false') return;
        event.preventDefault();
        zoomImageViewer(viewer, event.deltaY < 0 ? 1.12 : 1 / 1.12);
      }, { passive: false });
      listenWithCleanup(imageViewerCleanups, viewer, stage, 'pointerdown', (event) => {
        if (event.button !== 0) return;
        const state = getImageViewerState(viewer);
        state.pointer = {
          id: event.pointerId,
          startX: event.clientX,
          startY: event.clientY,
          x: state.x,
          y: state.y
        };
        stage.classList.add('is-panning');
        try {
          stage.setPointerCapture?.(event.pointerId);
        } catch (_) {}
      });
      listenWithCleanup(imageViewerCleanups, viewer, stage, 'pointermove', (event) => {
        const state = getImageViewerState(viewer);
        if (!state.pointer || state.pointer.id !== event.pointerId) return;
        state.x = state.pointer.x + event.clientX - state.pointer.startX;
        state.y = state.pointer.y + event.clientY - state.pointer.startY;
        syncImageViewerTransform(viewer, false);
      });
      const endPan = (event) => {
        const state = getImageViewerState(viewer);
        if (state.pointer && (!event || state.pointer.id === event.pointerId)) state.pointer = null;
        stage.classList.remove('is-panning');
      };
      listenWithCleanup(imageViewerCleanups, viewer, stage, 'pointerup', endPan);
      listenWithCleanup(imageViewerCleanups, viewer, stage, 'pointercancel', endPan);
      listenWithCleanup(imageViewerCleanups, viewer, stage, 'lostpointercapture', endPan);
    }
    const image = getViewerImage(viewer);
    if (image) {
      image.draggable = false;
      listenWithCleanup(imageViewerCleanups, viewer, image, 'dragstart', (event) => event.preventDefault());
    }
    listenWithCleanup(imageViewerCleanups, viewer, viewer, 'uzu-dialog-close', (event) => {
      if (event.target !== viewer) return;
      const state = getImageViewerState(viewer);
      viewer.dispatchEvent(new CustomEvent('uzu-image-viewer-close', {
        bubbles: true,
        detail: { viewer, item: state.item, trigger: state.trigger }
      }));
    });
  }

  function runCleanups(map, element) {
    const cleanups = map.get(element) || [];
    cleanups.forEach((cleanup) => {
      try { cleanup(); } catch (_) {}
    });
    map.delete(element);
  }

  function destroyAutoImageViewer(viewer) {
    if (!viewer) return;
    const overlay = viewer.closest('[data-uzu-dialog-overlay]');
    const timer = dialogCloseTimers.get(viewer);
    if (timer) {
      window.clearTimeout(timer);
      dialogCloseTimers.delete(viewer);
    }
    restoreDialogIsolation(viewer);
    if (activeDialog === viewer) {
      activeDialog = null;
      activeDialogTrigger = null;
    }
    const stackIndex = dialogStack.indexOf(viewer);
    if (stackIndex >= 0) dialogStack.splice(stackIndex, 1);
    dialogTriggers.delete(viewer);
    runCleanups(imageViewerCleanups, viewer);
    imageViewerState.delete(viewer);
    delete viewer.dataset.uzuImageViewerInitialized;
    viewer.classList.remove('is-open', 'is-closing');
    viewer.hidden = true;
    if (overlay) {
      overlay.classList.remove('is-open', 'is-closing');
      overlay.hidden = true;
      if (overlay.parentNode) overlay.remove();
    }
  }

  function destroyGalleries(root = document) {
    queryAll(root, galleryRootSelector).forEach((gallery) => {
      const state = galleryState.get(gallery);
      if (state) {
        state.destroyed = true;
        state.requestId += 1;
      }
      runCleanups(galleryCleanups, gallery);
      const autoViewer = galleryAutoViewers.get(gallery);
      destroyAutoImageViewer(autoViewer);
      galleryAutoViewers.delete(gallery);
      galleryState.delete(gallery);
      delete gallery.dataset.uzuGalleryInitialized;
    });
    queryAll(root, imageViewerSelector).forEach((viewer) => {
      runCleanups(imageViewerCleanups, viewer);
      imageViewerState.delete(viewer);
      delete viewer.dataset.uzuImageViewerInitialized;
    });
  }
