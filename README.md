# Usuzumi

[中文](README.zh-CN.md)

Usuzumi is a CSS and JavaScript component library you can load directly in a page. It is aimed at personal pages, app introductions, documentation, and small product tools.

It provides `uzu-*` classes, documented CSS variables, optional signature typography, and dependency-free scripts for themes, language selectors, tabs, pagination, selects, dialogs, and related controls.

## Install

```bash
npm install usuzumi
```

```js
import "usuzumi/usuzumi.css";
import "usuzumi/usuzumi.js";
```

Load the optional signature font only when using `.uzu-signature` or signature specimens:

```js
import "usuzumi/usuzumi-signature.css";
```

CDN usage:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/usuzumi/ui/usuzumi.min.css">
<script src="https://cdn.jsdelivr.net/npm/usuzumi/ui/usuzumi.min.js" defer></script>
```

When a page remembers dark or auto theme, set the theme before loading the stylesheet so the first paint uses the right colors. Add `data-uzu-theme-key` to the root element when the mode should be read from localStorage:

```html
<script>
(() => {
  const root = document.documentElement;
  const key = root.getAttribute("data-uzu-theme-key") || "";
  let mode = root.getAttribute("data-theme-mode") || root.getAttribute("data-theme") || "light";
  try { if (key) mode = localStorage.getItem(key) || mode; } catch (_) {}
  const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  const theme = mode === "auto" ? (prefersDark ? "dark" : "light") : (mode === "dark" ? "dark" : "light");
  root.setAttribute("data-theme-mode", mode === "auto" ? "auto" : theme);
  root.setAttribute("data-theme", theme);
  root.setAttribute("data-uzu-theme", theme);
})();
</script>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/usuzumi/ui/usuzumi.min.css">
```

## Usage

Use `uzu-root` and `uzu-app` for a full page:

```html
<html class="uzu-root" lang="en" data-theme="light">
  <body class="uzu-app">
    <main class="uzu-page">
      <section class="uzu-section">
        <div class="uzu-section-head">
          <p class="uzu-section-label">Overview</p>
          <h1 class="uzu-page-title">Project notes</h1>
        </div>
        <button class="uzu-button uzu-button-primary">Continue</button>
      </section>
    </main>
  </body>
</html>
```

Use `uzu-scope` when adopting Usuzumi inside an existing page:

```html
<section class="uzu-scope">
  <article class="uzu-card">
    <h3>Scoped component</h3>
    <p>This area adopts Usuzumi without taking over the whole page.</p>
  </article>
</section>
```

## Customization

Usuzumi is customized through CSS custom properties. Set documented `--uzu-*` variables on `:root`, `.uzu-app`, `.uzu-scope`, or a local wrapper before overriding component internals.

The bundled stylesheet is wrapped in `@layer usuzumi`, so ordinary project CSS that is not placed in a lower-priority layer can override library rules without fighting high selector specificity.

Global adjustments:

```css
:root {
  --uzu-radius-standard: 10px;
  --uzu-motion-base: 220ms;
}
```

Scoped adjustments:

```css
.settings-panel {
  --uzu-card-block-gap: 16px;
  --uzu-field-gap: 8px;
  --uzu-alert-max-width: 640px;
  --uzu-alert-accent-color: #6b5855;
  --uzu-alert-bg: #f4eeeb;
  --uzu-toast-width: 420px;
  --uzu-disclosure-panel-block-end-padding: 24px;
}
```

Single-instance adjustments:

```html
<article class="uzu-toast" style="--uzu-toast-width: 420px; --uzu-toast-content-end-offset: 8px">
  ...
</article>
```

Documented variables cover color roles, radius, spacing, motion, page width, card title rhythm, form field rhythm, slider track/thumb/step-dot styling, feedback sizing and colors, toast sizing, and disclosure panel spacing.
Use `--uzu-space-*` for layout primitives and project-level spacing. Component internals expose narrower rhythm variables such as `--uzu-card-block-gap`, `--uzu-field-gap`, and `--uzu-toast-inline-padding` when they are intended to be customized.

| Variable | Default | Applies to | Suggested scope |
| --- | --- | --- | --- |
| `--uzu-page-max-width` | `1120px` | `.uzu-page` width | `.uzu-app`, `.uzu-scope`, local page |
| `--uzu-page-narrow-max-width` | `960px` | `.uzu-page-narrow` width | `.uzu-app`, `.uzu-scope`, local page |
| `--uzu-topbar-margin-bottom` | `58px` desktop, `54px` narrow screens | `.uzu-topbar` block-end spacing | local topbar or page |
| `--uzu-topbar-gap` | `24px` | brand/nav/actions gap in `.uzu-topbar` | local topbar or page |
| `--uzu-topbar-actions-gap` | `8px` | action button gap in `.uzu-topbar-actions` | local topbar or page |
| `--uzu-card-title-size` | `18px` | `.uzu-title-pair` heading | `.uzu-app`, `.uzu-scope`, local card |
| `--uzu-card-title-line` | `1.25` | `.uzu-title-pair` heading | `.uzu-app`, `.uzu-scope`, local card |
| `--uzu-card-subtitle-size` | `13px` | `.uzu-title-pair` description | `.uzu-app`, `.uzu-scope`, local card |
| `--uzu-card-subtitle-line` | `1.55` | `.uzu-title-pair` description | `.uzu-app`, `.uzu-scope`, local card |
| `--uzu-card-title-gap` | `6px` | title/description rhythm | `.uzu-app`, `.uzu-scope`, local card |
| `--uzu-card-block-gap` | `12px` | repeated card content spacing | `.uzu-app`, `.uzu-scope`, local card |
| `--uzu-field-gap` | `5px` | label/input/help spacing | `.uzu-app`, `.uzu-scope`, local form |
| `--uzu-edit-focus-border` | mixed strong ink and strong border | input and editor focus border | `.uzu-app`, `.uzu-scope`, local form or editor |
| `--uzu-slider-track-height` | `10px` | slider track height | local slider or form |
| `--uzu-slider-thumb-size` | `16px` | slider thumb width and height | local slider or form |
| `--uzu-slider-track` | `color-mix(in srgb, var(--uzu-surface-inset) 76%, var(--uzu-border))` | slider track background | local slider or form |
| `--uzu-slider-track-border` | `color-mix(in srgb, var(--uzu-border-strong) 54%, transparent)` | slider track border | local slider or form |
| `--uzu-slider-fill` | `color-mix(in srgb, var(--uzu-fg-strong) 82%, var(--uzu-border))` | slider filled range | local slider or form |
| `--uzu-slider-thumb` | `var(--uzu-fg-strong)` | slider thumb background | local slider or form |
| `--uzu-slider-thumb-border` | `var(--uzu-surface)` | slider thumb border | local slider or form |
| `--uzu-slider-step-dot` | `color-mix(in srgb, var(--uzu-fg) 20%, transparent)` | inactive stepped slider dots | local stepped slider |
| `--uzu-slider-step-dot-active` | `color-mix(in srgb, var(--uzu-surface) 62%, var(--uzu-slider-fill))` | active stepped slider dots | local stepped slider |
| `--uzu-slider-step-dot-radius` | `1px` | stepped slider dot radius | local stepped slider |
| `--uzu-slider-step-ticks` | `none`, runtime generated for stepped sliders | stepped slider tick background | runtime-owned slider state |
| `--uzu-alert-max-width` | `520px` | alert width | local alert or container |
| `--uzu-alert-border-color` | `var(--uzu-border)` | alert border | local alert or container |
| `--uzu-alert-accent-color` | `var(--uzu-border-strong)` | alert left accent | local alert or container |
| `--uzu-alert-bg` | `var(--uzu-surface)` | alert background | local alert or container |
| `--uzu-alert-title-color` | `var(--uzu-fg-strong)` | alert title | local alert or container |
| `--uzu-alert-text-color` | `var(--uzu-muted)` | alert body text | local alert or container |
| `--uzu-callout-border-color` | `var(--uzu-border)` | callout border | local callout or container |
| `--uzu-callout-bg` | mixed soft surface | callout background | local callout or container |
| `--uzu-callout-title-color` | `var(--uzu-fg-strong)` | callout title | local callout or container |
| `--uzu-callout-text-color` | `var(--uzu-muted)` | callout body text | local callout or container |
| `--uzu-toast-width` | `360px` | toast width | local toast or toast stack |
| `--uzu-toast-inline-padding` | `16px` | toast side padding | local toast or toast stack |
| `--uzu-toast-content-end-offset` | `0px` | toast text/right action alignment | local toast |
| `--uzu-toast-action-size` | `28px` | toast close button size | local toast |
| `--uzu-toast-action-gap` | `12px` | gap reserved for toast action | local toast |
| `--uzu-disclosure-panel-block-end-padding` | `20px` | disclosure panel bottom spacing | local disclosure or container |
| `--uzu-menu-min-width` | `180px` | dropdown and context menu width | local menu |
| `--uzu-menu-offset` | `4px` | dropdown distance from trigger | local menu |
| `--uzu-menu-content-width` | `max-content` | menu content width strategy | local menu |
| `--uzu-command-max-height` | `260px` | command result list height | local command menu |
| `--uzu-avatar-size` | `36px` | avatar width and height | local avatar or container |
| `--uzu-sidebar-width` | `240px` | sidebar width | local sidebar or layout |
| `--uzu-step-nav-gap` | `8px` | clickable step navigation gap | local step nav |
| `--uzu-popover-width` | `280px` | triggered popover width | local popover wrapper |
| `--uzu-popover-offset` | `6px` | triggered popover distance from trigger | local popover wrapper |
| `--uzu-hover-card-width` | `260px` | hover card width | local hover card |
| `--uzu-combobox-list-max-height` | `240px` | combobox popup height | local combobox |
| `--uzu-split-primary-size` | `50%` | split pane primary panel size | local split pane |
| `--uzu-split-resizer-size` | `8px` | split pane divider size | local split pane |
| `--uzu-resizable-width` | `320px` | resizable panel width | local resizable |
| `--uzu-resizable-height` | `180px` | resizable panel height | local resizable |
| `--uzu-viewer-max-height` | `360px` | JSON / diff viewer height | local viewer |
| `--uzu-json-indent` | `18px` | JSON child indentation | local JSON viewer |
| `--uzu-editor-min-height` | `160px` | editor surface minimum height | local editor |
| `--uzu-alert-dialog-accent-color` | `var(--uzu-danger)` | alert dialog danger accent | local alert dialog |
| `--uzu-drawer-width` | `420px` | drawer width | local drawer |
| `--uzu-sheet-width` | `520px` | sheet width | local sheet |
| `--uzu-spinner-size` | `18px` | spinner size | local spinner |
| `--uzu-spinner-stroke` | `2px` | spinner stroke width | local spinner |

Script-written variables for tab indicators, segmented indicators, and measured disclosure height are internal state and should not be set by application code. If a repeated project need is not covered by the variable API, add a component variable to the library instead of depending on example-page CSS.

## Included

- Design tokens for color, typography, spacing, borders, radius, motion, and dark mode.
- Layout and component primitives for pages, sections, two-, three-, and four-column grids, stack/flex layouts, sidebars, buttons, toolbars, breadcrumbs, pagination, cards, stats, lists, avatars, forms, input groups, search, password fields, file upload, sliders, steppers, tabs, selects, comboboxes, menus, menubars, command menus, data grids, tree views, split panes, resizable panels, JSON/diff viewers, editor surfaces, badges, tags, separators, code, code blocks, keyboard hints, alert presets, callouts, tables, overlays, progress, spinners, skeletons, toasts, dialogs, alert dialogs, drawers, sheets, disclosures, accordions, hover cards, panel navigation, prose, and tooltips.
- Reusable layout helpers for product, documentation, and component pages. Site-specific compositions remain in the consuming site.
- JavaScript helpers for theme toggles, language selectors, custom selects, combobox filtering, data grid sorting/selection, tree navigation, split/resizable panels, JSON/diff rendering, editor surfaces, tabs, segmented controls, pagination, switches, search clearing, password visibility, steppers, dropdown and context menus, menubars, command filtering, tag selection and closing, disclosures, accordions, hover cards, popovers, dialogs, toast triggers/dismissal, step navigation, panel navigation, code copying, and a limited Markdown renderer.

Public scroll surfaces use the same 6px scrollbar contract. Root scrollbars stay visible, while local scroll surfaces keep the gutter stable and reveal their thumb on hover, focus, focus-within, or active interaction. WebKit arrow buttons are hidden, and thumbs keep a stable minimum length so long content never turns the thumb into a triangular quick-scroll affordance.

Text inputs, textareas, command inputs, combobox inputs, steppers, and editor surfaces use `--uzu-edit-focus-border` for a calm hard focus border without blurred shadow or glow. Input groups and steppers draw that hard border on the outer shell only when the editable input is focused; add-ons, inline actions, selectable suffixes, and stepper buttons keep their own focus affordance without triggering the edit shell. Use `.uzu-input-addon` for fixed text and a nested `.uzu-select[data-uzu-select]` when the suffix should be chosen, such as currency or units.

## Documentation Pages

Use public primitives to compose component catalogs, API references, and long documentation pages: `.uzu-page`, `.uzu-topbar`, `.uzu-nav`, `.uzu-topbar-actions`, `.uzu-sidebar-layout`, `.uzu-sidebar`, `.uzu-scroll-area`, `.uzu-scroll`, `.uzu-panel-nav`, `.uzu-panel`, `.uzu-section-head`, `.uzu-card`, `.uzu-table`, `.uzu-code-block`, and `.uzu-prose`. The component catalog in the site repository is a strict consumer of these pieces; it does not rely on hidden documentation selectors or a library-owned docs generator. Catalog entries should keep public preview/code tabs, copyable snippets, concrete interface notes, and inline `.uzu-code` markers for class, attribute, ARIA, role, and token names. Related public controls can share one panel when that is clearer, such as the topbar, theme toggle, and language selector pattern.

`.uzu-topbar` arranges brand, `.uzu-nav`, and `.uzu-topbar-actions` as one page header. The nav slot grows to fill the middle of the row, while `.uzu-topbar-actions` stays at the inline end for compact controls such as theme toggles and language selectors. Use `--uzu-topbar-margin-bottom: 0` when embedding a topbar as a bounded preview rather than a page header.

`.uzu-sidebar-layout` creates a reusable sidebar-plus-main grid for documentation and application pages. It keeps the sidebar column at `--uzu-sidebar-layout-sidebar-width`, uses a 28px default column gap through `--uzu-sidebar-layout-gap`, stacks to one column on narrow screens, and limits a child `.uzu-sidebar.uzu-scroll-area` so long navigation does not push the active content far below the first viewport. `.uzu-scroll-area` can also bound local preview or specimen regions with `--uzu-scroll-area-max-height` while preserving the public scrollbar styling. `.uzu-section-centered` centers its section head, large body copy, and direct `.uzu-flex` action row. `.uzu-grid-4` extends `.uzu-grid` to four equal columns and collapses to one column on narrow screens. `.uzu-break-anywhere` is a small utility for long tokens such as CSS variables, package names, and URLs inside constrained tables or cards.

## Scripts

The JavaScript file auto-initializes in browsers, is safe to import in SSR/Node contexts, and can be rerun for dynamic content:

```js
window.Usuzumi.init(container);
```

When a view is removed by a client-side router, call `destroy(root)` for the removed subtree. It disconnects Usuzumi auto-init observers, generated tooltip descriptions, active drag state, and dialog isolation owned by that subtree:

```js
window.Usuzumi.destroy(container);
```

Optional document helpers:

- Add `data-uzu-panel-nav` to a `.uzu-panel-nav` container and `data-uzu-panel-target="#panel-id"` to its buttons to switch `.uzu-panel` sections. Use `data-uzu-panel-hash="true"` to sync the URL hash.
- Use `.uzu-code-block` with `.uzu-code-block-body` and a `[data-uzu-code-copy]` button for copyable snippets. Add `data-uzu-code-language="javascript"` to the `code` or `pre` element, or use a `language-js` class. `Usuzumi.init()` highlights the snippet, stores the plain source in `data-uzu-code-source`, and keeps copy buttons reading from that source. When a code block contains multiple `[data-lang]` code variants, the copy button uses the currently visible language block. Use `window.Usuzumi.listCodeLanguages()` or `window.Usuzumi.hasCodeLanguage("ts")` when an integration needs to inspect the bundled language set. Set `--uzu-code-block-bg`, `--uzu-code-block-fg`, and `--uzu-code-token-*` variables on `.uzu-code-block` or `.uzu-code-block-body` to tune the block and token colors.
- Add `data-uzu-markdown` to a `.uzu-prose` container to render a small Markdown subset: headings, paragraphs, unordered lists, links, inline code, and fenced code blocks. This is not a full Markdown engine.
- Add `data-uzu-language-select` to a `.uzu-language-select` wrapper when a page needs a production language picker. Use `data-uzu-language-trigger`, `data-uzu-language-menu`, and `data-uzu-language-option` with `data-uzu-language-value` for each option. The selector writes `data-language`, `data-uzu-lang`, and `lang` to the document root by default; set `data-uzu-language-target="#id"` for a scoped preview or embedded app. Any `[data-lang]` fragment whose value does not match the current language is hidden; static HTML should pre-mark non-initial language fragments with `data-uzu-language-hidden` so the first paint does not flash multiple languages.
- Add `data-uzu-search`, `data-uzu-password`, or `data-uzu-stepper` when search clear buttons, password visibility toggles, or numeric steppers need built-in behavior.
- Add `data-uzu-form` to a form when Usuzumi should synchronize invalid field state, reveal `.uzu-form-error` messages, and emit validation events. Initial load preserves any existing `.is-invalid` or `aria-invalid="true"` state without validating empty required fields; add `data-uzu-form-validate-on-init="true"` when the first render should validate immediately.
- Add `data-uzu-menu`, `data-uzu-context-menu`, `data-uzu-menubar`, or `data-uzu-command` for lightweight menu behavior.
- Add `data-uzu-accordion`, `data-uzu-hover-card`, `data-uzu-popover`, `data-uzu-tag`, or `data-uzu-step-nav` when those components need runtime state sync. Popovers use a `data-uzu-popover` wrapper, a `data-uzu-popover-trigger` button, and a `.uzu-popover[data-uzu-popover-content]` layer. The runtime toggles `hidden`, `is-open`, and `aria-expanded`, then closes on Escape or outside click.
- Use `data-uzu-toast-trigger` with `data-uzu-toast-template="#template-id"` and `data-uzu-toast-stack="#stack-id"` when a toast should appear after user action. Static `.uzu-toast[data-uzu-toast]` nodes still initialize close buttons and live-region attributes.
- Add `data-uzu-combobox`, `data-uzu-data-grid`, `data-uzu-tree`, `data-uzu-split-pane`, or `data-uzu-resizable` for searchable choices, light data tables, hierarchical lists, and adjustable panels. Data grids can use `data-uzu-grid-sort`, `data-uzu-grid-selection`, `data-uzu-grid-select-all`, `data-uzu-grid-empty`, and `data-uzu-grid-align` for sorting, multi-select, empty rows, and column alignment.
- Add `data-uzu-json-viewer`, `data-uzu-diff-viewer`, `data-uzu-editor`, `data-uzu-markdown-editor`, or `data-uzu-inline-editor` for readable data previews and editor shells.
- Dialogs, drawers, and sheets use the same `data-uzu-dialog-*` behavior. A dialog opened from inside another active dialog stays nested, keeps the parent mounted, returns focus to the nested trigger on close, and releases scroll locking after the parent closes.
- Add `data-uzu-auto-init` to a container when components will be inserted later and should initialize without calling `window.Usuzumi.init(container)` manually.

Editor shells are UI and event bridges, not bundled editor engines. `data-uzu-editor` emits toolbar command and surface change events through the public shell; mount any project-owned editing engine inside `.uzu-editor-mount` when you need a document model, history, shortcuts, paste rules, collaboration, or full code editing. `data-uzu-markdown-editor` emits source changes; use a project-owned Markdown pipeline when the built-in light preview is not enough. `textarea.uzu-code-editor` can stay a native textarea for short snippets.

Custom events:

- `uzu-select-change`: `{ value, label, option, select }`
- `uzu-language-change`: `{ language, previousLanguage, htmlLang, key, option, select, root }`
- `uzu-tabs-change`: `{ value, tab, tabs, index, panel }`
- `uzu-segmented-change`: `{ value, segment, segmented, index }`
- `uzu-pagination-change`: `{ value, page, pagination, index, panel }`
- `uzu-switch-change`: `{ checked, switch }`
- `uzu-password-toggle`: `{ visible, password, input, toggle }`
- `uzu-stepper-change`: `{ value, number, stepper, input }`
- `uzu-field-validate`: `{ field, control, valid, invalid }`
- `uzu-form-validate`: `{ form, valid, invalid }`
- `uzu-menu-open` / `uzu-menu-close`: `{ menu, trigger, content }`
- `uzu-menu-select`: `{ menu, trigger, content, item, value }`
- `uzu-menubar-change`: `{ value, item, menubar, index }`
- `uzu-command-filter`: `{ value, command, visibleCount }`
- `uzu-command-select`: `{ value, item, command }`
- `uzu-combobox-open` / `uzu-combobox-close`: `{ combobox, input, list }`
- `uzu-combobox-filter`: `{ value, combobox, visibleCount }`
- `uzu-combobox-change`: `{ value, label, option, combobox, input }`
- `uzu-data-grid-sort`: `{ grid, table, header, columnIndex, direction }`
- `uzu-data-grid-select`: `{ grid, table, row, selected, value }`
- `uzu-data-grid-select-all`: `{ grid, table, selected, rows }`
- `uzu-tree-toggle`: `{ tree, item, expanded, value }`
- `uzu-tree-select`: `{ tree, item, value }`
- `uzu-split-resize`: `{ splitPane, size }`
- `uzu-resizable-resize`: `{ resizable, width, height }`
- `uzu-disclosure-change`: `{ open, disclosure }`
- `uzu-accordion-change`: `{ open, accordion, disclosure }`
- `uzu-hover-card-open` / `uzu-hover-card-close`: `{ hoverCard, trigger, content }`
- `uzu-popover-open` / `uzu-popover-close`: `{ popover, trigger, content }`
- `uzu-tag-change`: `{ selected, tag, value }`
- `uzu-tag-close`: `{ tag, closeButton, value }`
- `uzu-toast-open`: `{ toast, stack }`
- `uzu-toast-close`: `{ toast }`
- `uzu-dialog-open` / `uzu-dialog-close`: `{ dialog, overlay, trigger }`
- `uzu-step-nav-change`: `{ value, step, stepNav, index }`
- `uzu-editor-command`: `{ editor, surface, button, command, value }`
- `uzu-editor-change`: `{ editor, surface, value }`
- `uzu-markdown-editor-change`: `{ editor, source, preview, value }`
- `uzu-markdown-editor-render`: `{ editor, source, preview, value }`
- `uzu-inline-editor-change`: `{ editor, value }`
- `uzu-panel-nav-change`: `{ target, control, panel, nav }`
- `uzu-panel-show`: `{ target, control, panel, nav }`

Type declarations are included.

## Advanced Components

The native library now includes lightweight versions of the larger component families:

- Combobox: local filtering, keyboard selection, ARIA sync, and optional hidden form value.
- Data grid: sortable columns, single or multi-row selection, select-all controls, empty rows, alignment helpers, and row keyboard navigation on real table markup.
- Tree view: hierarchical focus, selection, expand/collapse behavior, and ARIA level/position metadata.
- Split pane and resizable panel: pointer and keyboard resizing, with optional local persistence keys.
- JSON viewer and diff viewer: parsed JSON trees and readable unified-diff style rows.
- Editor surfaces: generic editor shells, code, Markdown, plain-text, inline editing, and toolbar buttons. These are shells and light helpers; pair them with project-owned engines when the project needs full editor behavior.

## Site And Examples

- [Documentation site](https://github.com/Usuzumi-org/Usuzumi-site)
- [UI library repository](https://github.com/Usuzumi-org/Usuzumi)

The homepage, component catalog, editor integration demos, and larger examples live in the site repository so documentation-only dependencies do not become library dependencies.

## Maintenance

Repository maintenance commands:

```bash
npm run build
npm run validate
```

Edit source partials in `ui/css/` and `ui/js/`. The public entry files `ui/usuzumi.css`, `ui/usuzumi.js`, `ui/usuzumi.min.css`, and `ui/usuzumi.min.js` are generated bundles for package and CDN consumers, so rebuild them instead of editing them by hand. `npm run build:css` and `npm run check:css` remain compatibility aliases for older local workflows.

`npm run validate` checks generated bundle sync and source guardrails, then packs the library and installs it into a temporary consumer project to verify package exports, CSS files, type declarations, CDN-style `ui/*` paths, browser behavior, and component page layout smoke checks.

The published library has no runtime dependencies. See [DESIGN.md](DESIGN.md) for the full design specification.

## License

Usuzumi code is released under the [MIT License](LICENSE).

The bundled Meddon font is redistributed under its own SIL Open Font License terms. See [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).
