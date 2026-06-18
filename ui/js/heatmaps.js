  const heatmapState = new WeakMap();
  const heatmapCellSelector = '.uzu-heatmap-cell, [data-uzu-heatmap-date]';
  const heatmapRootSelector = '[data-uzu-heatmap]';

  function clampHeatmapNumber(value, min, max) {
    const number = Number(value);
    if (!Number.isFinite(number)) return min;
    return Math.min(max, Math.max(min, number));
  }

  function parseHeatmapDate(value) {
    const match = String(value || '').trim().match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (!match) return null;
    const year = Number(match[1]);
    const month = Number(match[2]);
    const day = Number(match[3]);
    const date = new Date(year, month - 1, day);
    if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) return null;
    return date;
  }

  function formatHeatmapDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  function getHeatmapDateOrdinal(date) {
    return Math.floor(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 86400000);
  }

  function addHeatmapDays(date, amount) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate() + amount);
  }

  function getHeatmapLanguage(heatmap) {
    const root = typeof getClosestLanguageRoot === 'function' ? getClosestLanguageRoot(heatmap) : document.documentElement;
    return normalizeLanguage(root.getAttribute('data-language') || root.getAttribute('data-uzu-lang') || '', 'en');
  }

  function getHeatmapLabels(data, language) {
    const compact = Array.isArray(data?.l) ? data.l : [];
    const fallback = language === 'zh'
      ? ['\u5c11', '\u591a', '\u8fd9\u4e00\u5929\u6ca1\u6709\u4e8b\u4ef6']
      : ['Less', 'More', 'No events for this day'];
    return [
      String(compact[0] || fallback[0]),
      String(compact[1] || fallback[1]),
      String(compact[2] || fallback[2])
    ];
  }

  function getHeatmapWeekdayLabels(language, weekStart) {
    const labels = language === 'zh'
      ? ['\u65e5', '\u4e00', '\u4e8c', '\u4e09', '\u56db', '\u4e94', '\u516d']
      : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return Array.from({ length: 7 }, (_, index) => labels[(weekStart + index) % 7]);
  }

  function getHeatmapMonthLabel(date, language) {
    if (language === 'zh') return `${date.getMonth() + 1}\u6708`;
    return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][date.getMonth()];
  }

  function normalizeHeatmapEventTuple(tuple) {
    if (Array.isArray(tuple)) {
      return {
        title: String(tuple[0] || ''),
        meta: tuple[1] == null ? '' : String(tuple[1]),
        description: tuple[2] == null ? '' : String(tuple[2])
      };
    }
    if (tuple && typeof tuple === 'object') {
      return {
        title: String(tuple.title || ''),
        meta: tuple.meta == null ? '' : String(tuple.meta),
        description: tuple.description == null ? '' : String(tuple.description)
      };
    }
    return { title: String(tuple || ''), meta: '', description: '' };
  }

  function normalizeHeatmapEvents(data) {
    const events = new Map();
    (Array.isArray(data?.ev) ? data.ev : []).forEach((entry) => {
      if (!Array.isArray(entry)) return;
      const offset = Math.trunc(Number(entry[0]));
      if (!Number.isFinite(offset) || offset < 0) return;
      const list = Array.isArray(entry[1]) ? entry[1].map(normalizeHeatmapEventTuple).filter((item) => item.title) : [];
      events.set(offset, list);
    });
    return events;
  }

  function normalizeHeatmapData(rawData, heatmap = null) {
    const data = typeof rawData === 'string' ? JSON.parse(rawData) : rawData;
    if (!data || typeof data !== 'object') return null;
    const start = parseHeatmapDate(data.s);
    const values = Array.isArray(data.v) ? data.v : [];
    if (!start || !values.length) return null;
    const language = heatmap ? getHeatmapLanguage(heatmap) : 'en';
    const labels = getHeatmapLabels(data, language);
    const weekStart = Math.trunc(clampHeatmapNumber(data.w ?? 1, 0, 6));
    const numericValues = values.map((entry) => Number(Array.isArray(entry) ? entry[0] : entry)).filter((value) => Number.isFinite(value));
    const maxValue = Math.max(0, ...numericValues);
    const leadingDays = (start.getDay() - weekStart + 7) % 7;
    const events = normalizeHeatmapEvents(data);
    const days = values.map((entry, offset) => {
      const explicit = Array.isArray(entry);
      const value = Number(explicit ? entry[0] : entry);
      const safeValue = Number.isFinite(value) ? value : 0;
      const level = explicit && entry.length > 1
        ? Math.trunc(clampHeatmapNumber(entry[1], 0, 4))
        : safeValue <= 0 || maxValue <= 0
          ? 0
          : Math.trunc(clampHeatmapNumber(Math.ceil((safeValue / maxValue) * 4), 1, 4));
      const date = addHeatmapDays(start, offset);
      return {
        date: formatHeatmapDate(date),
        offset,
        value: safeValue,
        level,
        week: Math.floor((leadingDays + offset) / 7) + 1,
        weekday: ((date.getDay() - weekStart + 7) % 7) + 1,
        events: events.get(offset) || []
      };
    });
    const columns = Math.max(1, Math.ceil((leadingDays + days.length) / 7));
    const selectedOffset = Math.trunc(clampHeatmapNumber(data.sel ?? days.length - 1, 0, days.length - 1));
    return {
      start: formatHeatmapDate(start),
      weekStart,
      labels,
      days,
      columns,
      selectedOffset,
      byDate: new Map(days.map((day) => [day.date, day])),
      byOffset: new Map(days.map((day) => [day.offset, day]))
    };
  }

  function resolveHeatmap(heatmapOrSelector) {
    if (heatmapOrSelector instanceof Element) return heatmapOrSelector;
    if (typeof heatmapOrSelector !== 'string' || !heatmapOrSelector.trim()) return null;
    try {
      return document.querySelector(heatmapOrSelector);
    } catch (_) {
      return null;
    }
  }

  function getHeatmapScoped(heatmap, selector) {
    return getScopedControls(heatmap, selector, heatmapRootSelector);
  }

  function getHeatmapCells(heatmap) {
    return getHeatmapScoped(heatmap, heatmapCellSelector);
  }

  function ensureHeatmapPart(heatmap, selector, className, attribute, parent = heatmap) {
    const existing = getHeatmapScoped(heatmap, selector)[0];
    if (existing) {
      className.split(/\s+/).filter(Boolean).forEach((item) => existing.classList.add(item));
      if (attribute) existing.setAttribute(attribute, '');
      return existing;
    }
    const element = document.createElement('div');
    element.className = className;
    if (attribute) element.setAttribute(attribute, '');
    parent.append(element);
    return element;
  }

  function ensureHeatmapViewportPart(heatmap, selector, className, attribute, viewport) {
    const element = ensureHeatmapPart(heatmap, selector, className, attribute, viewport);
    if (element.parentElement !== viewport) viewport.append(element);
    return element;
  }

  function ensureHeatmapViewport(heatmap) {
    return ensureHeatmapPart(heatmap, '.uzu-heatmap-viewport', 'uzu-heatmap-viewport');
  }

  function ensureHeatmapDetail(heatmap) {
    if ((heatmap.dataset.uzuHeatmapDetailRender || 'auto').toLowerCase() === 'manual') return null;
    return ensureHeatmapPart(heatmap, '[data-uzu-heatmap-detail], .uzu-heatmap-detail', 'uzu-heatmap-detail', 'data-uzu-heatmap-detail');
  }

  function ensureHeatmapLegend(heatmap, viewport) {
    const existing = getHeatmapScoped(heatmap, '.uzu-heatmap-legend')[0];
    if (existing) {
      existing.classList.add('uzu-heatmap-legend');
      if (existing.parentElement !== heatmap) viewport.after(existing);
      return existing;
    }
    const legend = document.createElement('ol');
    legend.className = 'uzu-heatmap-legend';
    viewport.after(legend);
    return legend;
  }

  function renderHeatmapWeekdays(container, labels) {
    const fragment = document.createDocumentFragment();
    labels.forEach((label) => {
      const span = document.createElement('span');
      span.textContent = label;
      fragment.append(span);
    });
    container.replaceChildren(fragment);
  }

  function renderHeatmapMonths(container, data, language) {
    const months = [];
    data.days.forEach((day) => {
      const date = parseHeatmapDate(day.date);
      if (!date) return;
      const previous = months[months.length - 1];
      if (!previous || previous.month !== date.getMonth() || previous.year !== date.getFullYear()) {
        months.push({
          month: date.getMonth(),
          year: date.getFullYear(),
          label: getHeatmapMonthLabel(date, language),
          startWeek: day.week,
          span: 1
        });
      } else {
        previous.span = Math.max(previous.span, day.week - previous.startWeek + 1);
      }
    });
    const fragment = document.createDocumentFragment();
    months.forEach((month, index) => {
      const next = months[index + 1];
      const span = document.createElement('span');
      span.textContent = month.label;
      span.style.gridColumn = `${month.startWeek} / span ${Math.max(1, (next ? next.startWeek : data.columns + 1) - month.startWeek)}`;
      fragment.append(span);
    });
    container.replaceChildren(fragment);
  }

  function getHeatmapCellLabel(day, language) {
    const eventCount = day.events.length;
    if (language === 'zh') return `${day.date}, \u6570\u503c ${day.value}, ${eventCount} \u4e2a\u4e8b\u4ef6`;
    return `${day.date}, value ${day.value}, ${eventCount} ${eventCount === 1 ? 'event' : 'events'}`;
  }

  function renderHeatmapGrid(grid, data, language) {
    const fragment = document.createDocumentFragment();
    data.days.forEach((day) => {
      const cell = document.createElement('button');
      cell.type = 'button';
      cell.className = 'uzu-heatmap-cell';
      cell.dataset.uzuHeatmapDate = day.date;
      cell.dataset.uzuHeatmapOffset = String(day.offset);
      cell.dataset.uzuHeatmapValue = String(day.value);
      cell.dataset.uzuHeatmapLevel = String(day.level);
      cell.style.setProperty('--uzu-heatmap-week', String(day.week));
      cell.style.setProperty('--uzu-heatmap-weekday', String(day.weekday));
      cell.style.gridColumn = String(day.week);
      cell.style.gridRow = String(day.weekday);
      cell.setAttribute('aria-label', getHeatmapCellLabel(day, language));
      cell.setAttribute('aria-pressed', 'false');
      cell.setAttribute('tabindex', '-1');
      fragment.append(cell);
    });
    grid.replaceChildren(fragment);
  }

  function renderHeatmapLegend(legend, labels) {
    const fragment = document.createDocumentFragment();
    const less = document.createElement('li');
    less.textContent = labels[0];
    fragment.append(less);
    for (let level = 0; level <= 4; level += 1) {
      const item = document.createElement('li');
      const swatch = document.createElement('span');
      swatch.className = 'uzu-heatmap-legend-cell';
      swatch.dataset.uzuHeatmapLevel = String(level);
      item.append(swatch);
      fragment.append(item);
    }
    const more = document.createElement('li');
    more.textContent = labels[1];
    fragment.append(more);
    legend.replaceChildren(fragment);
  }

  function renderHeatmap(heatmap, data) {
    heatmap.style.setProperty('--uzu-heatmap-columns', String(data.columns));
    const language = getHeatmapLanguage(heatmap);
    const viewport = ensureHeatmapViewport(heatmap);
    const months = ensureHeatmapViewportPart(heatmap, '.uzu-heatmap-months', 'uzu-heatmap-months', '', viewport);
    const weekdays = ensureHeatmapViewportPart(heatmap, '.uzu-heatmap-weekdays', 'uzu-heatmap-weekdays', '', viewport);
    const grid = ensureHeatmapViewportPart(heatmap, '[data-uzu-heatmap-grid], .uzu-heatmap-grid', 'uzu-heatmap-grid', 'data-uzu-heatmap-grid', viewport);
    const legend = ensureHeatmapLegend(heatmap, viewport);
    viewport.style.setProperty('--uzu-heatmap-columns', String(data.columns));
    months.style.setProperty('--uzu-heatmap-columns', String(data.columns));
    grid.style.setProperty('--uzu-heatmap-columns', String(data.columns));
    renderHeatmapMonths(months, data, language);
    renderHeatmapWeekdays(weekdays, getHeatmapWeekdayLabels(language, data.weekStart));
    renderHeatmapGrid(grid, data, language);
    renderHeatmapLegend(legend, data.labels);
  }

  function normalizeStaticHeatmap(heatmap) {
    const cells = getHeatmapCells(heatmap);
    if (!cells.length) return null;
    const datedCells = cells.map((cell, index) => {
      const date = parseHeatmapDate(cell.dataset.uzuHeatmapDate);
      return {
        cell,
        date,
        index,
        value: Number(cell.dataset.uzuHeatmapValue || 0),
        level: Math.trunc(clampHeatmapNumber(cell.dataset.uzuHeatmapLevel || 0, 0, 4))
      };
    }).filter((item) => item.date);
    if (!datedCells.length) return null;
    const firstOrdinal = Math.min(...datedCells.map((item) => getHeatmapDateOrdinal(item.date)));
    const days = datedCells.map((item) => {
      const offset = Number.isFinite(Number(item.cell.dataset.uzuHeatmapOffset))
        ? Math.trunc(Number(item.cell.dataset.uzuHeatmapOffset))
        : getHeatmapDateOrdinal(item.date) - firstOrdinal;
      return {
        cell: item.cell,
        date: formatHeatmapDate(item.date),
        offset,
        value: Number.isFinite(item.value) ? item.value : 0,
        level: item.level,
        events: []
      };
    }).sort((a, b) => a.offset - b.offset);
    return {
      start: days[0].date,
      weekStart: 1,
      labels: getHeatmapLabels({}, getHeatmapLanguage(heatmap)),
      days,
      columns: 1,
      selectedOffset: days.find((day) => day.cell.classList.contains('is-selected') || day.cell.getAttribute('aria-pressed') === 'true')?.offset ?? days[0].offset,
      byDate: new Map(days.map((day) => [day.date, day])),
      byOffset: new Map(days.map((day) => [day.offset, day]))
    };
  }

  function syncStaticHeatmapCells(heatmap, data) {
    data.days.forEach((day) => {
      const cell = day.cell;
      cell.classList.add('uzu-heatmap-cell');
      if (cell instanceof HTMLButtonElement && !cell.getAttribute('type')) cell.type = 'button';
      cell.dataset.uzuHeatmapDate = day.date;
      cell.dataset.uzuHeatmapOffset = String(day.offset);
      cell.dataset.uzuHeatmapValue = String(day.value);
      cell.dataset.uzuHeatmapLevel = String(day.level);
      cell.setAttribute('aria-pressed', cell.classList.contains('is-selected') || cell.getAttribute('aria-pressed') === 'true' ? 'true' : 'false');
      cell.setAttribute('tabindex', cell.getAttribute('aria-pressed') === 'true' ? '0' : '-1');
    });
  }

  function getHeatmapDayByInput(data, dateOrOffset) {
    if (!data) return null;
    if (typeof dateOrOffset === 'number') return data.byOffset.get(Math.trunc(dateOrOffset)) || null;
    const value = String(dateOrOffset || '').trim();
    if (!value) return null;
    if (/^-?\d+$/.test(value)) return data.byOffset.get(Math.trunc(Number(value))) || null;
    return data.byDate.get(value) || null;
  }

  function getHeatmapCellForDay(heatmap, day) {
    if (day?.cell) return day.cell;
    return getHeatmapCells(heatmap).find((cell) => cell.dataset.uzuHeatmapDate === day?.date || cell.dataset.uzuHeatmapOffset === String(day?.offset)) || null;
  }

  function focusHeatmapOffset(heatmap, offset) {
    const data = heatmapState.get(heatmap);
    const day = data?.byOffset.get(offset);
    const cell = day ? getHeatmapCellForDay(heatmap, day) : null;
    if (!cell || isControlDisabled(cell)) return null;
    getHeatmapCells(heatmap).forEach((item) => item.setAttribute('tabindex', item === cell ? '0' : '-1'));
    cell.focus();
    return cell;
  }

  function renderHeatmapDetail(heatmap, day) {
    if ((heatmap.dataset.uzuHeatmapDetailRender || 'auto').toLowerCase() === 'manual') return;
    const data = heatmapState.get(heatmap);
    const detail = ensureHeatmapDetail(heatmap);
    if (!detail || !day) return;
    const language = getHeatmapLanguage(heatmap);
    const title = document.createElement('p');
    title.className = 'uzu-heatmap-detail-title';
    title.textContent = language === 'zh' ? `${day.date} \u7684\u4e8b\u4ef6` : `Events on ${day.date}`;
    const events = day.events || [];
    if (!events.length) {
      const empty = document.createElement('p');
      empty.className = 'uzu-heatmap-detail-empty';
      empty.textContent = data?.labels?.[2] || getHeatmapLabels({}, language)[2];
      detail.replaceChildren(title, empty);
      return;
    }
    const list = document.createElement('ul');
    list.className = 'uzu-heatmap-detail-list';
    events.forEach((event) => {
      const item = document.createElement('li');
      item.className = 'uzu-heatmap-event';
      const eventTitle = document.createElement('span');
      eventTitle.className = 'uzu-heatmap-event-title';
      eventTitle.textContent = event.title;
      item.append(eventTitle);
      if (event.meta) {
        const meta = document.createElement('span');
        meta.className = 'uzu-heatmap-event-meta';
        meta.textContent = event.meta;
        item.append(meta);
      }
      if (event.description) {
        const description = document.createElement('p');
        description.className = 'uzu-heatmap-event-description';
        description.textContent = event.description;
        item.append(description);
      }
      list.append(item);
    });
    detail.replaceChildren(title, list);
  }

  function emitHeatmapSelect(heatmap, cell, day) {
    const detail = {
      heatmap,
      cell,
      date: day.date,
      offset: day.offset,
      value: day.value,
      level: day.level,
      events: day.events || []
    };
    heatmap.dispatchEvent(new CustomEvent('uzu-heatmap-select', { bubbles: true, detail }));
    heatmap.dispatchEvent(new Event('change', { bubbles: true }));
  }

  function selectHeatmapDate(heatmapOrSelector, dateOrOffset, emit = true) {
    const heatmap = resolveHeatmap(heatmapOrSelector);
    if (!heatmap) return null;
    const data = heatmapState.get(heatmap);
    const day = getHeatmapDayByInput(data, dateOrOffset);
    const cell = day ? getHeatmapCellForDay(heatmap, day) : null;
    if (!day || !cell || isControlDisabled(cell)) return null;
    getHeatmapCells(heatmap).forEach((item) => {
      const selected = item === cell;
      item.classList.toggle('is-selected', selected);
      item.setAttribute('aria-pressed', selected ? 'true' : 'false');
      item.setAttribute('tabindex', selected ? '0' : '-1');
    });
    heatmap.dataset.uzuHeatmapSelectedDate = day.date;
    renderHeatmapDetail(heatmap, day);
    if (emit) emitHeatmapSelect(heatmap, cell, day);
    return cell;
  }

  function setHeatmapData(heatmapOrSelector, rawData, emit = true, options = {}) {
    const heatmap = resolveHeatmap(heatmapOrSelector);
    if (!heatmap) return null;
    let data = null;
    try {
      data = normalizeHeatmapData(rawData, heatmap);
    } catch (_) {
      data = null;
    }
    if (!data) return null;
    heatmapState.set(heatmap, data);
    renderHeatmap(heatmap, data);
    const selected = options.preserveSelection && heatmap.dataset.uzuHeatmapSelectedDate && data.byDate.has(heatmap.dataset.uzuHeatmapSelectedDate)
      ? heatmap.dataset.uzuHeatmapSelectedDate
      : data.selectedOffset;
    selectHeatmapDate(heatmap, selected, emit);
    return heatmap;
  }

  function getHeatmapDataScript(heatmap) {
    return getHeatmapScoped(heatmap, '[data-uzu-heatmap-data]')[0] || null;
  }

  function refreshHeatmap(heatmapOrSelector) {
    const heatmap = resolveHeatmap(heatmapOrSelector);
    if (!heatmap) return null;
    const script = getHeatmapDataScript(heatmap);
    if (script) return setHeatmapData(heatmap, script.textContent || '{}', false, { preserveSelection: true });
    const data = normalizeStaticHeatmap(heatmap);
    if (!data) return null;
    heatmapState.set(heatmap, data);
    syncStaticHeatmapCells(heatmap, data);
    selectHeatmapDate(heatmap, heatmap.dataset.uzuHeatmapSelectedDate || data.selectedOffset, false);
    return heatmap;
  }

  function refreshHeatmaps(root = document) {
    queryAll(root, heatmapRootSelector).forEach((heatmap) => {
      refreshHeatmap(heatmap);
    });
  }

  function handleHeatmapKeydown(event, heatmap, cell) {
    const data = heatmapState.get(heatmap);
    if (!data) return;
    const current = getHeatmapDayByInput(data, cell.dataset.uzuHeatmapOffset || cell.dataset.uzuHeatmapDate);
    if (!current) return;
    const direction = document.dir === 'rtl' ? -1 : 1;
    let nextOffset = null;
    if (event.key === 'ArrowRight') nextOffset = current.offset + direction;
    else if (event.key === 'ArrowLeft') nextOffset = current.offset - direction;
    else if (event.key === 'ArrowDown') nextOffset = current.offset + 7;
    else if (event.key === 'ArrowUp') nextOffset = current.offset - 7;
    else if (event.key === 'Home') nextOffset = data.days[0]?.offset;
    else if (event.key === 'End') nextOffset = data.days.at(-1)?.offset;
    else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      selectHeatmapDate(heatmap, current.offset);
      return;
    }
    if (nextOffset == null) return;
    event.preventDefault();
    focusHeatmapOffset(heatmap, Math.trunc(clampHeatmapNumber(nextOffset, data.days[0].offset, data.days.at(-1).offset)));
  }

  function initHeatmaps(root = document) {
    queryAll(root, heatmapRootSelector).forEach((heatmap) => {
      refreshHeatmap(heatmap);
      if (!markInitialized(heatmap, 'Heatmap')) return;
      heatmap.addEventListener('click', (event) => {
        const cell = getScopedEventControl(event, heatmapCellSelector, heatmap, heatmapRootSelector);
        if (!cell || isControlDisabled(cell)) return;
        event.preventDefault();
        selectHeatmapDate(heatmap, cell.dataset.uzuHeatmapOffset || cell.dataset.uzuHeatmapDate);
        cell.focus();
      });
      heatmap.addEventListener('keydown', (event) => {
        const cell = getScopedEventControl(event, heatmapCellSelector, heatmap, heatmapRootSelector);
        if (!cell || isControlDisabled(cell)) return;
        handleHeatmapKeydown(event, heatmap, cell);
      });
    });
  }
