export {};

declare global {
  type UsuzumiThemeMode = "auto" | "light" | "dark";
  type UsuzumiLanguage = string;

  interface UsuzumiSelectChangeDetail {
    value: string;
    label: string;
    option: HTMLElement;
    select: HTMLElement;
  }

  interface UsuzumiTabsChangeDetail {
    value: string;
    tab: HTMLElement;
    tabs: HTMLElement;
    index: number;
    panel: HTMLElement | null;
  }

  interface UsuzumiSegmentedChangeDetail {
    value: string;
    segment: HTMLElement;
    segmented: HTMLElement;
    index: number;
  }

  interface UsuzumiLanguageChangeDetail {
    language: UsuzumiLanguage;
    previousLanguage: string;
    htmlLang: string;
    key: string;
    option: HTMLElement;
    select: HTMLElement;
    root: HTMLElement;
  }

  interface UsuzumiPaginationChangeDetail {
    value: string;
    page: HTMLElement;
    pagination: HTMLElement;
    index: number;
    panel: HTMLElement | null;
  }

  interface UsuzumiSwitchChangeDetail {
    checked: boolean;
    switch: HTMLElement;
  }

  interface UsuzumiPasswordToggleDetail {
    visible: boolean;
    password: HTMLElement;
    input: HTMLInputElement;
    toggle: HTMLElement;
  }

  interface UsuzumiStepperChangeDetail {
    value: string;
    number: number;
    stepper: HTMLElement;
    input: HTMLInputElement;
  }

  interface UsuzumiMenuDetail {
    menu: HTMLElement;
    trigger: HTMLElement | null;
    content: HTMLElement | null;
  }

  interface UsuzumiMenuSelectDetail extends UsuzumiMenuDetail {
    item: HTMLElement;
    value: string;
  }

  interface UsuzumiMenubarChangeDetail {
    value: string;
    item: HTMLElement;
    menubar: HTMLElement;
    index: number;
  }

  interface UsuzumiCommandFilterDetail {
    value: string;
    command: HTMLElement;
    visibleCount: number;
  }

  interface UsuzumiCommandSelectDetail {
    value: string;
    item: HTMLElement;
    command: HTMLElement;
  }

  interface UsuzumiComboboxDetail {
    combobox: HTMLElement;
    input: HTMLInputElement;
    list: HTMLElement;
  }

  interface UsuzumiComboboxFilterDetail {
    value: string;
    combobox: HTMLElement;
    visibleCount: number;
  }

  interface UsuzumiComboboxChangeDetail {
    value: string;
    label: string;
    option: HTMLElement;
    combobox: HTMLElement;
    input: HTMLInputElement;
  }

  interface UsuzumiDataGridSortDetail {
    grid: HTMLElement;
    table: HTMLTableElement;
    header: HTMLElement;
    columnIndex: number;
    direction: "ascending" | "descending";
  }

  interface UsuzumiDataGridSelectDetail {
    grid: HTMLElement;
    table: HTMLTableElement;
    row: HTMLTableRowElement;
    selected: boolean;
    value: string;
  }

  interface UsuzumiDataGridSelectAllDetail {
    grid: HTMLElement;
    table: HTMLTableElement;
    selected: boolean;
    rows: HTMLTableRowElement[];
  }

  interface UsuzumiFieldValidateDetail {
    field: HTMLElement;
    control: HTMLElement;
    valid: boolean;
    invalid: boolean;
  }

  interface UsuzumiFormValidateDetail {
    form: HTMLFormElement | HTMLElement;
    valid: boolean;
    invalid: boolean;
  }

  interface UsuzumiTreeToggleDetail {
    tree: HTMLElement;
    item: HTMLElement;
    expanded: boolean;
    value: string;
  }

  interface UsuzumiTreeSelectDetail {
    tree: HTMLElement;
    item: HTMLElement;
    value: string;
  }

  interface UsuzumiSplitResizeDetail {
    splitPane: HTMLElement;
    size: number;
  }

  interface UsuzumiResizableResizeDetail {
    resizable: HTMLElement;
    width: number;
    height: number;
  }

  interface UsuzumiDisclosureChangeDetail {
    open: boolean;
    disclosure: HTMLElement;
  }

  interface UsuzumiAccordionChangeDetail {
    accordion: HTMLElement;
    disclosure: HTMLElement;
    open: boolean;
  }

  interface UsuzumiHoverCardDetail {
    hoverCard: HTMLElement;
    trigger: HTMLElement | null;
    content: HTMLElement | null;
  }

  interface UsuzumiPopoverDetail {
    popover: HTMLElement;
    trigger: HTMLElement | null;
    content: HTMLElement | null;
  }

  interface UsuzumiTagChangeDetail {
    selected: boolean;
    tag: HTMLElement;
    value: string;
  }

  interface UsuzumiTagCloseDetail {
    tag: HTMLElement;
    closeButton: HTMLElement | null;
    value: string;
  }

  interface UsuzumiTagAddDetail {
    list: HTMLElement;
    tag: HTMLElement;
    input: HTMLInputElement;
    trigger: HTMLElement | null;
    value: string;
    label: string;
  }

  interface UsuzumiToastCloseDetail {
    toast: HTMLElement;
  }

  interface UsuzumiToastOpenDetail {
    toast: HTMLElement;
    stack: HTMLElement;
  }

  interface UsuzumiShowToastOptions {
    template?: string;
    templateSelector?: string;
    stack?: string;
    stackSelector?: string;
    toast?: HTMLElement;
    trigger?: Element;
  }

  interface UsuzumiErrorPageActionOptions {
    label?: string;
    href?: string;
  }

  interface UsuzumiErrorPageOptions {
    code?: string;
    title?: string;
    message?: string;
    documentTitle?: string;
    primaryAction?: UsuzumiErrorPageActionOptions | null;
    secondaryAction?: UsuzumiErrorPageActionOptions | null;
    actions?: {
      primary?: UsuzumiErrorPageActionOptions | null;
      secondary?: UsuzumiErrorPageActionOptions | null;
    } | Array<UsuzumiErrorPageActionOptions | null>;
  }

  interface UsuzumiErrorPageAppliedAction {
    label: string;
    href: string;
  }

  interface UsuzumiErrorPageChangeDetail {
    page: HTMLElement;
    code: string;
    title: string;
    message: string;
    documentTitle: string;
    actions: {
      primary: UsuzumiErrorPageAppliedAction | null;
      secondary: UsuzumiErrorPageAppliedAction | null;
    };
  }

  interface UsuzumiDialogDetail {
    dialog: HTMLElement;
    overlay: HTMLElement | null;
    trigger: HTMLElement | null;
  }

  interface UsuzumiPanelNavDetail {
    target: string;
    control: HTMLElement;
    panel: HTMLElement;
    nav: HTMLElement;
  }

  interface UsuzumiStepNavChangeDetail {
    value: string;
    step: HTMLElement;
    stepNav: HTMLElement;
    index: number;
  }

  interface UsuzumiSidebarLayoutChangeDetail {
    collapsed: boolean;
    expanded: boolean;
  }

  interface UsuzumiEditorCommandDetail {
    editor: HTMLElement;
    surface: HTMLElement | null;
    button: HTMLElement;
    command: string;
    value: string;
  }

  interface UsuzumiEditorChangeDetail {
    editor: HTMLElement;
    surface: HTMLElement;
    value: string;
  }

  interface UsuzumiMarkdownEditorChangeDetail {
    editor: HTMLElement;
    source: HTMLTextAreaElement | HTMLElement;
    preview: HTMLElement | null;
    value: string;
  }

  interface UsuzumiMarkdownEditorRenderDetail {
    editor: HTMLElement;
    source: HTMLTextAreaElement | HTMLElement;
    preview: HTMLElement;
    value: string;
  }

  interface UsuzumiInlineEditorChangeDetail {
    editor: HTMLElement;
    value: string;
  }

  interface UsuzumiCodeHighlightResult {
    fragment: DocumentFragment;
    html: string;
    language: string;
    highlighted: boolean;
  }

  interface UsuzumiCodeHighlightDetail {
    code: HTMLElement;
    language: string;
    source: string;
    highlighted: boolean;
  }

  interface UsuzumiApi {
    init(root?: ParentNode): void;
    destroy(root?: ParentNode): void;
    applyTheme(root: HTMLElement, mode: UsuzumiThemeMode, key?: string, persist?: boolean): void;
    applyLanguage(root: HTMLElement, language: UsuzumiLanguage, key?: string, htmlLang?: string): void;
    setSwitchState(control: HTMLElement, checked: boolean, emit?: boolean): void;
    setPasswordVisible(password: HTMLElement, visible: boolean, emit?: boolean): void;
    setStepperValue(stepper: HTMLElement, value: number, emit?: boolean): void;
    setComboboxValue(combobox: HTMLElement, optionOrValue: HTMLElement | string, emit?: boolean): void;
    setDataGridRowSelected(row: HTMLTableRowElement, selected: boolean, emit?: boolean): void;
    refreshDataGrid(gridOrTable: HTMLElement | HTMLTableElement): void;
    setTagSelected(tag: HTMLElement, selected: boolean, emit?: boolean): void;
    setSplitPaneSize(splitPane: HTMLElement, size: number, emit?: boolean): void;
    setResizableSize(resizable: HTMLElement, width: number, height: number, emit?: boolean): void;
    setTreeItemExpanded(item: HTMLElement, expanded: boolean, emit?: boolean): void;
    validateForm(form: HTMLFormElement | HTMLElement, emit?: boolean): boolean;
    openMenu(menu: HTMLElement, options?: { trigger?: HTMLElement | null; focus?: boolean; x?: number; y?: number }): void;
    closeMenu(menu: HTMLElement, options?: { trigger?: HTMLElement | null; restoreFocus?: boolean }): void;
    openPopover(popover: HTMLElement, options?: { trigger?: HTMLElement | null }): void;
    closePopover(popover: HTMLElement, options?: { trigger?: HTMLElement | null; restoreFocus?: boolean }): void;
    setPaginationPage(pagination: HTMLElement, page: HTMLElement | string, emit?: boolean): void;
    setStepNavStep(stepNav: HTMLElement, step: HTMLElement, emit?: boolean): void;
    renderJson(value: unknown): DocumentFragment;
    renderMarkdown(markdown: string): DocumentFragment;
    highlightCode(source: string, language?: string): UsuzumiCodeHighlightResult;
    highlightCodeBlock(target: HTMLElement): boolean;
    highlightCodeBlocks(root?: ParentNode): number;
    initCodeHighlight(root?: ParentNode): void;
    listCodeLanguages(): string[];
    hasCodeLanguage(language: string): boolean;
    initCodeCopy(root?: ParentNode): void;
    refreshCodeCopyLabels(root?: ParentNode): void;
    showToast(options?: UsuzumiShowToastOptions | string): HTMLElement | null;
    closeToast(toast: HTMLElement): void;
    setErrorPage(pageOrSelector: HTMLElement | string, options?: UsuzumiErrorPageOptions): HTMLElement | null;
    openDialog(dialog: HTMLElement, trigger?: HTMLElement | null): void;
    closeDialog(dialog: HTMLElement): void;
  }

  interface Window {
    Usuzumi: UsuzumiApi;
  }

  interface HTMLElementEventMap {
    "uzu-select-change": CustomEvent<UsuzumiSelectChangeDetail>;
    "uzu-tabs-change": CustomEvent<UsuzumiTabsChangeDetail>;
    "uzu-segmented-change": CustomEvent<UsuzumiSegmentedChangeDetail>;
    "uzu-language-change": CustomEvent<UsuzumiLanguageChangeDetail>;
    "uzu-pagination-change": CustomEvent<UsuzumiPaginationChangeDetail>;
    "uzu-switch-change": CustomEvent<UsuzumiSwitchChangeDetail>;
    "uzu-password-toggle": CustomEvent<UsuzumiPasswordToggleDetail>;
    "uzu-stepper-change": CustomEvent<UsuzumiStepperChangeDetail>;
    "uzu-menu-open": CustomEvent<UsuzumiMenuDetail>;
    "uzu-menu-close": CustomEvent<UsuzumiMenuDetail>;
    "uzu-menu-select": CustomEvent<UsuzumiMenuSelectDetail>;
    "uzu-menubar-change": CustomEvent<UsuzumiMenubarChangeDetail>;
    "uzu-command-filter": CustomEvent<UsuzumiCommandFilterDetail>;
    "uzu-command-select": CustomEvent<UsuzumiCommandSelectDetail>;
    "uzu-combobox-open": CustomEvent<UsuzumiComboboxDetail>;
    "uzu-combobox-close": CustomEvent<UsuzumiComboboxDetail>;
    "uzu-combobox-filter": CustomEvent<UsuzumiComboboxFilterDetail>;
    "uzu-combobox-change": CustomEvent<UsuzumiComboboxChangeDetail>;
    "uzu-data-grid-sort": CustomEvent<UsuzumiDataGridSortDetail>;
    "uzu-data-grid-select": CustomEvent<UsuzumiDataGridSelectDetail>;
    "uzu-data-grid-select-all": CustomEvent<UsuzumiDataGridSelectAllDetail>;
    "uzu-field-validate": CustomEvent<UsuzumiFieldValidateDetail>;
    "uzu-form-validate": CustomEvent<UsuzumiFormValidateDetail>;
    "uzu-tree-toggle": CustomEvent<UsuzumiTreeToggleDetail>;
    "uzu-tree-select": CustomEvent<UsuzumiTreeSelectDetail>;
    "uzu-split-resize": CustomEvent<UsuzumiSplitResizeDetail>;
    "uzu-resizable-resize": CustomEvent<UsuzumiResizableResizeDetail>;
    "uzu-disclosure-change": CustomEvent<UsuzumiDisclosureChangeDetail>;
    "uzu-accordion-change": CustomEvent<UsuzumiAccordionChangeDetail>;
    "uzu-hover-card-open": CustomEvent<UsuzumiHoverCardDetail>;
    "uzu-hover-card-close": CustomEvent<UsuzumiHoverCardDetail>;
    "uzu-popover-open": CustomEvent<UsuzumiPopoverDetail>;
    "uzu-popover-close": CustomEvent<UsuzumiPopoverDetail>;
    "uzu-tag-change": CustomEvent<UsuzumiTagChangeDetail>;
    "uzu-tag-close": CustomEvent<UsuzumiTagCloseDetail>;
    "uzu-tag-add": CustomEvent<UsuzumiTagAddDetail>;
    "uzu-toast-open": CustomEvent<UsuzumiToastOpenDetail>;
    "uzu-toast-close": CustomEvent<UsuzumiToastCloseDetail>;
    "uzu-error-page-change": CustomEvent<UsuzumiErrorPageChangeDetail>;
    "uzu-dialog-open": CustomEvent<UsuzumiDialogDetail>;
    "uzu-dialog-close": CustomEvent<UsuzumiDialogDetail>;
    "uzu-step-nav-change": CustomEvent<UsuzumiStepNavChangeDetail>;
    "uzu-sidebar-layout-change": CustomEvent<UsuzumiSidebarLayoutChangeDetail>;
    "uzu-editor-command": CustomEvent<UsuzumiEditorCommandDetail>;
    "uzu-editor-change": CustomEvent<UsuzumiEditorChangeDetail>;
    "uzu-markdown-editor-change": CustomEvent<UsuzumiMarkdownEditorChangeDetail>;
    "uzu-markdown-editor-render": CustomEvent<UsuzumiMarkdownEditorRenderDetail>;
    "uzu-inline-editor-change": CustomEvent<UsuzumiInlineEditorChangeDetail>;
    "uzu-code-highlight": CustomEvent<UsuzumiCodeHighlightDetail>;
    "uzu-panel-nav-change": CustomEvent<UsuzumiPanelNavDetail>;
    "uzu-panel-show": CustomEvent<UsuzumiPanelNavDetail>;
  }
}
