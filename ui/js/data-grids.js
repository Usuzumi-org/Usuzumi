  function getDataGridRows(table) {
    return queryAll(table, 'tbody tr, [data-uzu-grid-row]').filter((row) => row.closest('table') === table && !row.hasAttribute('data-uzu-grid-empty'));
  }

  function getDataGridVisibleRows(table) {
    return getDataGridRows(table).filter((row) => !row.hidden);
  }

  function getDataGridSelectableRows(table) {
    return getDataGridVisibleRows(table).filter((row) => !row.hasAttribute('data-uzu-grid-disabled') && row.getAttribute('aria-disabled') !== 'true');
  }

  function getDataGridRowValue(row) {
    return row.dataset.uzuGridRow || row.dataset.value || '';
  }

  function getDataGridRowSelection(row) {
    return row.querySelector('[data-uzu-grid-selection], input[type="checkbox"]');
  }

  function getDataGridSortText(row, columnIndex) {
    const cell = row.cells[columnIndex];
    if (!cell) return '';
    return cell.dataset.uzuGridSortValue ?? cell.getAttribute('data-sort-value') ?? cell.textContent.trim();
  }

  function syncDataGridRowSelected(grid, table, row, selected, emit = true) {
    const nextSelected = Boolean(selected);
    const selection = getDataGridRowSelection(row);
    row.classList.toggle('is-selected', nextSelected);
    row.setAttribute('aria-selected', nextSelected ? 'true' : 'false');
    if (selection && 'checked' in selection) selection.checked = nextSelected;
    if (emit) {
      grid.dispatchEvent(new CustomEvent('uzu-data-grid-select', {
        bubbles: true,
        detail: { grid, table, row, selected: nextSelected, value: getDataGridRowValue(row) }
      }));
    }
  }

  function getDataGridTable(gridOrTable) {
    return gridOrTable?.matches?.('table') ? gridOrTable : gridOrTable?.querySelector?.('table');
  }

  function getDataGridRoot(table) {
    return table?.closest?.('[data-uzu-data-grid]') || table;
  }

  function setDataGridRowSelected(row, selected, emit = true) {
    const table = row?.closest?.('table');
    const grid = getDataGridRoot(table);
    if (!table || !grid || row.hasAttribute('data-uzu-grid-empty')) return;
    syncDataGridRowSelected(grid, table, row, selected, emit);
    syncDataGridSelectAll(grid, table);
  }

  function syncDataGridSelectAll(grid, table) {
    const controls = queryAll(table, '[data-uzu-grid-select-all]');
    if (!controls.length) return;
    const rows = getDataGridSelectableRows(table);
    const selectedRows = rows.filter((row) => row.getAttribute('aria-selected') === 'true' || row.classList.contains('is-selected'));
    controls.forEach((control) => {
      if ('checked' in control) control.checked = rows.length > 0 && selectedRows.length === rows.length;
      if ('indeterminate' in control) control.indeterminate = selectedRows.length > 0 && selectedRows.length < rows.length;
      control.setAttribute('aria-checked', selectedRows.length > 0 && selectedRows.length === rows.length ? 'true' : selectedRows.length > 0 ? 'mixed' : 'false');
    });
  }

  function updateDataGridEmptyState(table) {
    const rows = getDataGridVisibleRows(table);
    queryAll(table, '[data-uzu-grid-empty]').forEach((row) => {
      row.hidden = rows.length > 0;
    });
  }

  function refreshDataGrid(gridOrTable) {
    const table = getDataGridTable(gridOrTable);
    if (!table) return;
    const grid = getDataGridRoot(table);
    updateDataGridEmptyState(table);
    syncDataGridSelectAll(grid, table);
  }

  function initDataGrids(root = document) {
    queryAll(root, '[data-uzu-data-grid]').forEach((grid) => {
      const table = getDataGridTable(grid);
      if (!table) return;
      const allRows = () => getDataGridRows(table);
      const rows = () => getDataGridVisibleRows(table);
      allRows().forEach((row, index) => {
        row.dataset.uzuGridRow = row.dataset.uzuGridRow || String(index + 1);
        row.setAttribute('tabindex', row.getAttribute('tabindex') || '0');
        row.setAttribute('aria-selected', row.classList.contains('is-selected') || row.getAttribute('aria-selected') === 'true' ? 'true' : 'false');
        const selection = getDataGridRowSelection(row);
        if (selection && 'checked' in selection) selection.checked = row.getAttribute('aria-selected') === 'true';
      });
      updateDataGridEmptyState(table);
      syncDataGridSelectAll(grid, table);
      if (!markInitialized(grid, 'DataGrid')) return;
      queryAll(table, '[data-uzu-grid-sort]').forEach((header) => {
        header.setAttribute('tabindex', header.getAttribute('tabindex') || '0');
        header.setAttribute('aria-sort', header.getAttribute('aria-sort') || 'none');
        const sort = () => {
          const body = table.tBodies[0];
          if (!body) return;
          const headers = [...header.parentElement.children];
          const columnIndex = headers.indexOf(header);
          const current = header.getAttribute('aria-sort') === 'ascending' ? 'descending' : 'ascending';
          queryAll(table, '[data-uzu-grid-sort]').forEach((item) => item.setAttribute('aria-sort', item === header ? current : 'none'));
          const direction = current === 'ascending' ? 1 : -1;
          const sorted = [...body.rows].sort((a, b) => {
            if (a.hasAttribute('data-uzu-grid-empty')) return 1;
            if (b.hasAttribute('data-uzu-grid-empty')) return -1;
            if (a.hidden && !b.hidden) return 1;
            if (!a.hidden && b.hidden) return -1;
            const aText = getDataGridSortText(a, columnIndex);
            const bText = getDataGridSortText(b, columnIndex);
            const aNumber = Number(aText.replace(/[^\d.-]/g, ''));
            const bNumber = Number(bText.replace(/[^\d.-]/g, ''));
            if (Number.isFinite(aNumber) && Number.isFinite(bNumber) && /\d/.test(aText + bText)) {
              return (aNumber - bNumber) * direction;
            }
            return aText.localeCompare(bText, undefined, { numeric: true }) * direction;
          });
          sorted.forEach((row) => body.append(row));
          grid.dispatchEvent(new CustomEvent('uzu-data-grid-sort', {
            bubbles: true,
            detail: { grid, table, header, columnIndex, direction: current }
          }));
        };
        header.addEventListener('click', sort);
        header.addEventListener('keydown', (event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            sort();
          }
        });
      });
      queryAll(table, '[data-uzu-grid-select-all]').forEach((control) => {
        control.addEventListener('change', () => {
          const nextSelected = Boolean(control.checked);
          getDataGridSelectableRows(table).forEach((row) => syncDataGridRowSelected(grid, table, row, nextSelected));
          syncDataGridSelectAll(grid, table);
          grid.dispatchEvent(new CustomEvent('uzu-data-grid-select-all', {
            bubbles: true,
            detail: {
              grid,
              table,
              selected: nextSelected,
              rows: getDataGridSelectableRows(table).filter((row) => row.getAttribute('aria-selected') === 'true')
            }
          }));
        });
      });
      grid.addEventListener('click', (event) => {
        const row = event.target instanceof Element ? event.target.closest('[data-uzu-grid-row], tbody tr') : null;
        if (!row || !table.contains(row) || row.hasAttribute('data-uzu-grid-empty') || row.hasAttribute('data-uzu-grid-disabled') || row.getAttribute('aria-disabled') === 'true') return;
        const selection = event.target instanceof Element ? event.target.closest('[data-uzu-grid-selection], input[type="checkbox"]') : null;
        if (!selection && event.target.closest('a, button, input, select, textarea')) return;
        const multi = grid.dataset.uzuDataGridMulti === 'true';
        if (!multi) rows().forEach((item) => {
          if (item !== row) {
            syncDataGridRowSelected(grid, table, item, false, false);
          }
        });
        const selected = selection && 'checked' in selection
          ? Boolean(selection.checked)
          : !(row.classList.contains('is-selected') || row.getAttribute('aria-selected') === 'true');
        syncDataGridRowSelected(grid, table, row, selected);
        syncDataGridSelectAll(grid, table);
      });
      grid.addEventListener('keydown', (event) => {
        const row = event.target instanceof Element ? event.target.closest('[data-uzu-grid-row], tbody tr') : null;
        const list = rows();
        if (!row || !list.length) return;
        const index = list.indexOf(row);
        if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
          event.preventDefault();
          list[(index + (event.key === 'ArrowDown' ? 1 : -1) + list.length) % list.length].focus();
        } else if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          row.click();
        }
      });
    });
  }
