export {};

declare global {
  interface UsuzumiLiteErrorPageActionOptions {
    label?: string;
    href?: string;
  }

  interface UsuzumiLiteErrorPageOptions {
    code?: string;
    title?: string;
    message?: string;
    documentTitle?: string;
    primaryAction?: UsuzumiLiteErrorPageActionOptions | null;
    secondaryAction?: UsuzumiLiteErrorPageActionOptions | null;
    actions?: {
      primary?: UsuzumiLiteErrorPageActionOptions | null;
      secondary?: UsuzumiLiteErrorPageActionOptions | null;
    } | Array<UsuzumiLiteErrorPageActionOptions | null>;
  }

  interface UsuzumiLiteMenuOptions {
    trigger?: HTMLElement | null;
    focus?: boolean;
    x?: number;
    y?: number;
  }

  interface UsuzumiLiteMenuCloseOptions {
    trigger?: HTMLElement | null;
    restoreFocus?: boolean;
  }

  interface UsuzumiLiteApi {
    init(root?: ParentNode): void;
    destroy(root?: ParentNode): void;
    applyTheme(root: HTMLElement, mode: "auto" | "light" | "dark", key?: string, persist?: boolean): void;
    applyLanguage(root: HTMLElement, language: string, key?: string, htmlLang?: string): void;
    openMenu(menu: HTMLElement, options?: UsuzumiLiteMenuOptions): void;
    closeMenu(menu: HTMLElement, options?: UsuzumiLiteMenuCloseOptions): void;
    setErrorPage(pageOrSelector: HTMLElement | string, options?: UsuzumiLiteErrorPageOptions): HTMLElement | null;
    initCodeCopy(root?: ParentNode): void;
    refreshCodeCopyLabels(root?: ParentNode): void;
  }

  var Usuzumi: UsuzumiLiteApi;
}
