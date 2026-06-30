# Usuzumi Design System

Usuzumi is a direct-use CSS and JavaScript component library for personal sites, app introduction pages, documentation pages, and small product tools. It ships reusable HTML/CSS/JS patterns built around warm gray surfaces, charcoal text, serif typography, low-contrast borders, and motion for state changes.

The system has two goals:

- New web projects can adopt the full visual language by adding `class="uzu-app"` and linking the UI library.
- Existing web projects can migrate safely by wrapping selected areas in `.uzu-scope` or using `.uzu-*` component classes incrementally.

## Library Files

Use the single entry files in normal pages:

```html
<link rel="stylesheet" href="ui/usuzumi.css">
<script src="ui/usuzumi.js" defer></script>
```

Package consumers can import the stylesheet as `usuzumi/usuzumi.css` and the behavior script as `usuzumi/usuzumi.js`. CDN consumers can use `ui/usuzumi.min.css` and `ui/usuzumi.min.js`.

Performance-sensitive pages can use the split runtime entries:

- `ui/usuzumi.js` / `ui/usuzumi.min.js`: full compatible runtime, including the bundled syntax highlight engine.
- `ui/usuzumi-core.js` / `ui/usuzumi-core.min.js`: core runtime without the syntax highlight engine.
- `ui/usuzumi-highlight.js` / `ui/usuzumi-highlight.min.js`: syntax highlight engine only; pair it with core on code-heavy pages.

Maintenance validation includes a consumer smoke test: `npm run validate` packs the library, installs it into a temporary external project, verifies package exports and type/CSS/runtime files from `node_modules/usuzumi`, and opens browser pages that cover full, core-only, and core-plus-highlight runtime loading.

The published `ui/usuzumi.css`, `ui/usuzumi.js`, `ui/usuzumi.min.css`, `ui/usuzumi.min.js`, `ui/usuzumi-core.js`, `ui/usuzumi-core.min.js`, `ui/usuzumi-highlight.js`, and `ui/usuzumi-highlight.min.js` files are generated from the maintainable source files. Edit source files in `ui/css/` and `ui/js/`, then run `npm run build`. The CSS bundle is wrapped in `@layer usuzumi` so project styles can override it cleanly. Do not hand-edit the generated entry files unless you are intentionally updating build output and have rebuilt from source.

- `ui/css/tokens.css`: design tokens and dark mode tokens.
- `ui/css/fonts.css`: optional Meddon signature font face.
- `ui/css/base.css`: root behavior, focus, selection, scrollbar, forms, links.
- `ui/css/typography.css`: signature, titles, section labels, title pairs.
- `ui/css/components.css`: shared buttons, cards, fields, badges, tables, toolbars, and small component foundations.
- `ui/css/forms.css`: input groups, search, password, file upload, sliders, steppers, and form states.
- `ui/css/menus.css`: menus, menubars, command surfaces, custom select, and combobox surfaces.
- `ui/css/indicators.css`: progress, spinners, skeletons, and lightweight state indicators.
- `ui/css/code-editors.css`: code blocks, JSON/diff viewers, Markdown editor, code/plain/inline editors, and Markdown surfaces.
- `ui/css/feedback.css`: alerts, callouts, toasts, and validation feedback.
- `ui/css/navigation.css`: tabs, segmented controls, breadcrumbs, pagination, sidebars, and step navigation.
- `ui/css/data-layout.css`: lists, data grids, heatmaps, galleries, tree views, split panes, resizable panels, scroll areas, and ratio/layout helpers.
- `ui/css/overlays.css`: dialogs, image viewers, drawers, sheets, popovers, hover cards, tooltips, and overlay animation.
- `ui/css/status.css`: empty, error, and loading states.
- `ui/css/motion.css`: shared process animation primitives.
- `ui/css/layout.css`: page containers, sections, top bars, grids, sidebars, hero split, footer.
- `ui/css/patterns.css`: reusable brand links, language selectors, panel navigation, prose helpers, and small public page patterns.
- `ui/css/utilities.css`: small utilities and language visibility helpers.
- `ui/css/forced-colors.css`: high-contrast mode visibility rules.
- `ui/usuzumi-signature.css`: optional signature font entry for `.uzu-signature` and signature specimens.
- `ui/js/*.js`: maintainable runtime source modules. They are concatenated into the generated full and core runtime entries.
- `ui/usuzumi.js`: generated full runtime entry for theme toggles, language selectors, custom selects, tabs, segmented controls, pagination, switches, search, password, steppers, menus, comboboxes, data grids, heatmaps, galleries, image viewers, trees, split/resizable panels, JSON/diff viewers, Markdown editor, code/plain/inline editors, tags, disclosures, accordions, hover cards, popovers, dialogs, step navigation, panel navigation, toast dismissal, code highlighting, code copying, and limited Markdown rendering.
- `ui/usuzumi-core.js`: generated runtime entry with the same public `window.Usuzumi` API, but without the bundled syntax highlight engine.
- `ui/usuzumi-highlight.js`: generated syntax highlight engine entry. It exposes `window.UsuzumiHighlightEngine` and dispatches `uzu-code-highlight-engine-ready` after loading.
- `ui/usuzumi.d.ts`: TypeScript declarations for the browser API and custom events.

## Adoption Modes

### Full Application

Use this for new pages where Usuzumi owns the design surface.

```html
<html class="uzu-root" lang="en" data-theme="light" data-uzu-theme-key="site-theme">
<body class="uzu-app">
  ...
</body>
</html>
```

`ui/usuzumi.js` also adds `uzu-root` automatically when it detects `body.uzu-app`, but adding the class in markup gives the viewport scrollbar styling an immediate CSS hook before JavaScript runs.

### Scoped Migration

Use this for existing projects where only one area should adopt the system.

```html
<section class="uzu-scope">
  ...
</section>
```

### Component Class API

All public component classes use the `uzu-` prefix. Do not rely on internal file names or implementation details. Use stable classes such as:

- `.uzu-button`, `.uzu-button-primary`, `.uzu-button-ghost`, `.uzu-button-danger`
- `.uzu-text-link`
- `.uzu-icon-button`, `.uzu-theme-toggle`, `.uzu-language-select`, `.uzu-language-trigger`, `.uzu-language-menu`, `.uzu-language-option`, `.uzu-floating-controls`
- `.uzu-topbar`, `.uzu-topbar-leading`, `.uzu-brand-link`, `.uzu-nav`, `.uzu-topbar-actions`, `.uzu-topbar-overflow-menu`
- `.uzu-toolbar`, `.uzu-toolbar-group`, `.uzu-breadcrumb`, `.uzu-pagination`, `.uzu-page-button`
- `.uzu-card`, `.uzu-card-muted`, `.uzu-card-cover`, `.uzu-card-cover-horizontal`, `.uzu-card-cover-compact`, `.uzu-card-cover-media`, `.uzu-card-cover-body`, `.uzu-title-pair`, `.uzu-stat`, `.uzu-stat-label`, `.uzu-stat-value`, `.uzu-stat-note`
- `.uzu-list`, `.uzu-list-item`, `.uzu-list-meta`, `.uzu-list-action`, `.uzu-avatar`
- `.uzu-form`, `.uzu-fieldset`, `.uzu-form-message`, `.uzu-form-error`
- `.uzu-field`, `.uzu-label`, `.uzu-input`, `.uzu-textarea`, `.uzu-select`, `.uzu-input-group`, `.uzu-input-addon`, `.uzu-input-action`
- `.uzu-search`, `.uzu-search-input`, `.uzu-search-clear`, `.uzu-password`, `.uzu-password-input`, `.uzu-password-toggle`, `.uzu-file-upload`, `.uzu-file-input`, `.uzu-file-summary`, `.uzu-slider`, `.uzu-slider-stepped`, `.uzu-stepper`, `.uzu-stepper-input`, `.uzu-stepper-button`
- `.uzu-menu`, `.uzu-menu-trigger`, `.uzu-menu-content`, `.uzu-menu-item`, `.uzu-menubar`, `.uzu-menubar-item`, `.uzu-command`, `.uzu-command-input`, `.uzu-command-list`, `.uzu-command-item`
- `.uzu-tabs`, `.uzu-tab`, `.uzu-segmented`, `.uzu-segment`
- `.uzu-badge`, `.uzu-tag`, `.uzu-tag-close`, `.uzu-separator`, `.uzu-separator-vertical`, `.uzu-code`, `.uzu-kbd`, `.uzu-alert`, `.uzu-alert-info`, `.uzu-alert-success`, `.uzu-alert-warning`, `.uzu-alert-danger`, `.uzu-callout`, `.uzu-callout-title`, `.uzu-toast`, `.uzu-table`, `.uzu-popover`, `.uzu-modal`, `.uzu-alert-dialog`, `.uzu-dialog-overlay`, `.uzu-drawer`, `.uzu-sheet`
- `.uzu-progress`, `.uzu-progress-bar`, `.uzu-progress-indeterminate`, `.uzu-progress-circular`, `.uzu-progress-circular-track`, `.uzu-progress-circular-fill`, `.uzu-spinner`, `.uzu-skeleton`
- `.uzu-activity`, `.uzu-activity-dot`, `.uzu-process`, `.uzu-process-step`, `.uzu-step-nav`, `.uzu-step-nav-item`, `.uzu-step-nav-button`
- `.uzu-disclosure`, `.uzu-disclosure-trigger`, `.uzu-disclosure-panel`, `.uzu-accordion`, `.uzu-popover-trigger`, `.uzu-hover-card`, `.uzu-hover-card-content`, `.uzu-tooltip`
- `.uzu-page`, `.uzu-section`, `.uzu-section-head`, `.uzu-grid`, `.uzu-grid-auto`, `.uzu-grid-2`, `.uzu-grid-3`, `.uzu-grid-4`, `.uzu-sidebar-layout`, `.uzu-sidebar-layout-controls`, `.uzu-sidebar-layout-toggle`, `.uzu-stack`, `.uzu-flex`, `.uzu-measure`, `.uzu-spacer`, `.uzu-aspect`, `.uzu-scroll-area`, `.uzu-sidebar`, `.uzu-sidebar-section`, `.uzu-sidebar-nav`, `.uzu-hero-split`
- `.uzu-section-centered`, `.uzu-panel`
- `.uzu-panel-index`, `.uzu-panel-index-section`, `.uzu-panel-index-title`, `.uzu-panel-index-button`, `.uzu-panel-index-meta`
- `.uzu-panel-nav`, `.uzu-panel-nav-section`, `.uzu-panel-nav-title`, `.uzu-panel-nav-button`, `.uzu-panel-nav-meta`
- `.uzu-code-block`, `.uzu-code-block-body`, `.uzu-code-block-copy`, `.uzu-prose`
- `.uzu-error-page`, `.uzu-error-page-screen`, `.uzu-error-page-code`, `.uzu-error-page-actions`
- `.uzu-break-anywhere`

### CSS Custom Property API

CSS custom properties are the public customization interface for project-specific sizing and rhythm. Consumers should set documented `--uzu-*` variables on `:root`, `.uzu-app`, `.uzu-scope`, or a local wrapper. Avoid high-specificity selector overrides unless the variable API cannot express the requirement.

Global customization:

```css
:root {
  --uzu-radius-standard: 10px;
  --uzu-motion-base: 220ms;
}
```

Scoped customization:

```css
.billing-panel {
  --uzu-card-block-gap: 16px;
  --uzu-field-gap: 8px;
  --uzu-alert-max-width: 640px;
  --uzu-alert-accent-color: #6b5855;
  --uzu-alert-bg: #f4eeeb;
  --uzu-toast-width: 420px;
  --uzu-disclosure-panel-block-end-padding: 24px;
}
```

Instance customization:

```html
<article class="uzu-toast" style="--uzu-toast-width: 420px; --uzu-toast-content-end-offset: 8px">
  ...
</article>
```

Stable global variables include:

- Color roles: `--uzu-bg`, `--uzu-surface`, `--uzu-surface-soft`, `--uzu-surface-muted`, `--uzu-surface-inset`, `--uzu-fg`, `--uzu-fg-strong`, `--uzu-muted`, `--uzu-subtle`, `--uzu-soft`, `--uzu-disabled`, `--uzu-border`, `--uzu-border-soft`, `--uzu-border-strong`, `--uzu-action-bg`, `--uzu-action-fg`
- Semantic roles: `--uzu-success`, `--uzu-success-bg`, `--uzu-warning`, `--uzu-warning-bg`, `--uzu-danger`, `--uzu-danger-bg`, `--uzu-info`, `--uzu-info-bg`
- Surface support: `--uzu-control-bg`, `--uzu-shadow-popover`, `--uzu-focus-ring`, `--uzu-edit-focus-border`
- Font stacks: `--uzu-font-serif`, `--uzu-font-signature`, `--uzu-font-mono`
- Motion: `--uzu-motion-quick`, `--uzu-motion-base`, `--uzu-motion-slow`, `--uzu-ease-standard`
- Radius: `--uzu-radius-micro`, `--uzu-radius-standard`, `--uzu-radius-medium`, `--uzu-radius-large`, `--uzu-radius-pill`
- Spacing: `--uzu-space-1`, `--uzu-space-2`, `--uzu-space-3`, `--uzu-space-4`, `--uzu-space-5`, `--uzu-space-6`, `--uzu-space-8`, `--uzu-space-10`
- Layout, card, and form rhythm: `--uzu-page-max-width`, `--uzu-page-narrow-max-width`, `--uzu-page-padding-block-start`, `--uzu-page-padding-block-end`, `--uzu-measure-width`, `--uzu-measure-gutter`, `--uzu-topbar-margin-bottom`, `--uzu-topbar-gap`, `--uzu-topbar-actions-gap`, `--uzu-topbar-leading-gap`, `--uzu-card-title-size`, `--uzu-card-title-line`, `--uzu-card-subtitle-size`, `--uzu-card-subtitle-line`, `--uzu-card-title-gap`, `--uzu-card-block-gap`, `--uzu-field-gap`
- Local layout primitives: `--uzu-stack-gap`, `--uzu-flex-gap`, `--uzu-grid-min-item-width`, `--uzu-grid-max-columns`, `--uzu-aspect-ratio`, `--uzu-scroll-area-max-height`

Stable component variables include:

- Alert sizing and colors: `--uzu-alert-max-width`, `--uzu-alert-border-color`, `--uzu-alert-accent-color`, `--uzu-alert-bg`, `--uzu-alert-title-color`, `--uzu-alert-text-color`
- Callout colors: `--uzu-callout-border-color`, `--uzu-callout-bg`, `--uzu-callout-title-color`, `--uzu-callout-text-color`
- Toast sizing: `--uzu-toast-width`, `--uzu-toast-inline-padding`, `--uzu-toast-content-end-offset`, `--uzu-toast-action-size`, `--uzu-toast-action-gap`
- Disclosure spacing: `--uzu-disclosure-panel-block-end-padding`
- Form, upload, and slider sizing: `--uzu-form-gap`, `--uzu-file-upload-min-height`, `--uzu-slider-track-height`, `--uzu-slider-thumb-size`, `--uzu-slider-track`, `--uzu-slider-track-border`, `--uzu-slider-fill`, `--uzu-slider-thumb`, `--uzu-slider-thumb-border`, `--uzu-slider-step-dot`, `--uzu-slider-step-dot-active`, `--uzu-slider-step-dot-radius`
- Menu and command sizing: `--uzu-menu-min-width`, `--uzu-menu-offset`, `--uzu-menu-content-width`, `--uzu-command-max-height`
- Card cover sizing: `--uzu-cover-ratio`, `--uzu-cover-min-height`, `--uzu-cover-body-min-height`, `--uzu-cover-bg`, `--uzu-cover-align`, `--uzu-cover-radius`, `--uzu-cover-media-padding`, `--uzu-cover-object-fit`
- Page error sizing: `--uzu-error-page-min-height`, `--uzu-error-page-max-width`, `--uzu-error-page-gap`, `--uzu-error-page-code-size`
- Identity and navigation sizing: `--uzu-avatar-size`, `--uzu-sidebar-width`, `--uzu-sidebar-layout-sidebar-width`, `--uzu-sidebar-layout-gap`, `--uzu-step-nav-gap`
- Overlay sizing: `--uzu-popover-width`, `--uzu-popover-offset`, `--uzu-hover-card-width`, `--uzu-alert-dialog-accent-color`, `--uzu-drawer-width`, `--uzu-sheet-width`
- Loading sizing: `--uzu-spinner-size`, `--uzu-spinner-stroke`

Use `--uzu-space-*` for layout primitives and project-level spacing. Component internals use component-specific rhythm variables when customization is part of the public API.

| Variable | Default | Applies to | Suggested scope |
| --- | --- | --- | --- |
| `--uzu-page-max-width` | `1120px` | `.uzu-page` width | `.uzu-app`, `.uzu-scope`, local page |
| `--uzu-page-narrow-max-width` | `960px` | `.uzu-page-narrow` width | `.uzu-app`, `.uzu-scope`, local page |
| `--uzu-page-padding-block-start` | `56px` | `.uzu-page` top padding | `.uzu-page`, local page |
| `--uzu-page-padding-block-end` | `60px` desktop, `40px` narrow screens | `.uzu-page` bottom padding | `.uzu-page`, local page |
| `--uzu-measure-width` | `680px` | `.uzu-measure` maximum width | local content block |
| `--uzu-measure-gutter` | `0px` | `.uzu-measure` inline gutter reservation | local content block |
| `--uzu-topbar-margin-bottom` | `58px` desktop, `54px` narrow screens | `.uzu-topbar` block-end spacing | local topbar or page |
| `--uzu-topbar-gap` | `24px` | brand/nav/actions gap in `.uzu-topbar` | local topbar or page |
| `--uzu-topbar-actions-gap` | `8px` | action button gap in `.uzu-topbar-actions` | local topbar or page |
| `--uzu-topbar-leading-gap` | `8px` | leading controls/brand gap in `.uzu-topbar-leading` | local topbar |
| `--uzu-card-title-size` | `18px` | `.uzu-title-pair` heading | `.uzu-app`, `.uzu-scope`, local card |
| `--uzu-card-title-line` | `1.25` | `.uzu-title-pair` heading | `.uzu-app`, `.uzu-scope`, local card |
| `--uzu-card-subtitle-size` | `13px` | `.uzu-title-pair` description | `.uzu-app`, `.uzu-scope`, local card |
| `--uzu-card-subtitle-line` | `1.55` | `.uzu-title-pair` description | `.uzu-app`, `.uzu-scope`, local card |
| `--uzu-card-title-gap` | `6px` | title/description rhythm | `.uzu-app`, `.uzu-scope`, local card |
| `--uzu-card-block-gap` | `12px` | repeated card content spacing | `.uzu-app`, `.uzu-scope`, local card |
| `--uzu-grid-min-item-width` | `240px` | `.uzu-grid-auto` minimum item width | local auto grid |
| `--uzu-grid-max-columns` | `4` | `.uzu-grid-auto` maximum column count | local auto grid |
| `--uzu-cover-ratio` | `16 / 9` | `.uzu-card-cover-media` aspect ratio | local cover card |
| `--uzu-cover-min-height` | `0` | `.uzu-card-cover-media` minimum height | local cover card |
| `--uzu-cover-body-min-height` | `0` | `.uzu-card-cover-body` minimum height | local cover card |
| `--uzu-cover-bg` | `var(--uzu-surface-soft)` | `.uzu-card-cover-media` fallback background | local cover card |
| `--uzu-cover-align` | `stretch` | `.uzu-card-cover-media` content alignment | local cover card |
| `--uzu-cover-radius` | `var(--uzu-radius-micro)` | `.uzu-card-cover-media` top corner radius | local cover card |
| `--uzu-cover-media-padding` | `0` | `.uzu-card-cover-media` inset for contained art | local cover card |
| `--uzu-cover-object-fit` | `cover` | cover image and video fit mode | local cover card |
| `--uzu-error-page-min-height` | `420px` | `.uzu-error-page` minimum height | local page error |
| `--uzu-error-page-max-width` | `680px` | `.uzu-error-page` content width | local page error |
| `--uzu-error-page-gap` | `18px` | `.uzu-error-page` vertical rhythm | local page error |
| `--uzu-error-page-code-size` | `88px` | `.uzu-error-page-code` text size | local page error |
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
| `--uzu-menu-min-width` | `180px` | menu minimum width | local menu |
| `--uzu-menu-offset` | `4px` | menu distance from trigger | local menu |
| `--uzu-menu-content-width` | `max-content` | menu content width | local menu |
| `--uzu-command-max-height` | `260px` | command list height | local command menu |
| `--uzu-avatar-size` | `36px` | avatar size | local avatar or container |
| `--uzu-sidebar-width` | `240px` | sidebar width | local sidebar or layout |
| `--uzu-sidebar-layout-sidebar-width` | `240px` | sidebar layout column width | local sidebar layout |
| `--uzu-sidebar-layout-gap` | `28px` | sidebar layout column gap | local sidebar layout |
| `--uzu-step-nav-gap` | `8px` | step navigation gap | local step nav |
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
| `--uzu-editor-min-height` | `160px` | Markdown, code, plain, and inline editor minimum height | local editor |
| `--uzu-alert-dialog-accent-color` | `var(--uzu-danger)` | alert dialog accent | local alert dialog |
| `--uzu-drawer-width` | `420px` | drawer width | local drawer |
| `--uzu-sheet-width` | `520px` | sheet width | local sheet |
| `--uzu-spinner-size` | `18px` | spinner size | local spinner |
| `--uzu-spinner-stroke` | `2px` | spinner stroke | local spinner |

Runtime-written variables such as `--uzu-tabs-indicator-x`, `--uzu-tabs-indicator-width`, `--uzu-segmented-indicator-x`, `--uzu-segmented-indicator-width`, `--uzu-disclosure-panel-height`, and `--uzu-slider-step-ticks` are internal state. They can appear in computed styles, but application code should not set them as customization hooks.

If a project repeatedly needs a size or behavior that is not covered here, add a small component variable to `ui/css/*.css`, rebuild `ui/usuzumi.css`, and document it in this section. Do not solve that gap with example-page CSS.

### State Contract

Every interactive component must define the states it exposes. Use native attributes where possible:

- Disabled: use `disabled` on buttons and form controls, or `aria-disabled="true"` when an element cannot use the native attribute.
- Busy: use `.is-loading` with `aria-busy="true"` for command buttons that are processing.
- Active/current: use `.is-active`, `aria-current`, `aria-selected`, or the native checked state depending on the component.
- Invalid: use `.is-invalid` on the field wrapper or control, plus `aria-invalid="true"` on the input-like element.
- Read-only: use `readonly` for text controls and keep the value readable.
- Empty: use `.uzu-empty-state` for empty panels, lists, and tables.
- Page error: use `.uzu-error-page` for full-page 404, 500, and maintenance states.
- Open/closed: use `.is-open` with `aria-expanded` for disclosures and dialogs.

Do not introduce a visual state without also defining the matching semantic attribute when one exists.

### Advanced Component Scope

The native runtime includes lightweight versions of the complex component families:

- Combobox handles local filtering, ARIA sync, keyboard selection, and optional hidden form values.
- Data grid keeps real table markup while adding sortable headers, single or multi-row selection, select-all controls, empty rows, alignment helpers, and row keyboard navigation.
- Tree view manages hierarchical focus, selection, expand/collapse state, and matching ARIA level/position attributes.
- Split pane and resizable panel support pointer and keyboard resizing. Optional persistence keys use local storage.
- JSON viewer parses JSON into a collapsible tree. Diff viewer renders unified-diff style text into readable rows.
- Usuzumi editor surfaces are self-owned Markdown, code, plain text, and inline editing primitives. `.uzu-markdown-editor` pairs a source field with a preview region, emits change/render events, and can render Usuzumi's lightweight Markdown subset with `data-uzu-markdown-render`. It is not a full document model: projects that need history, collaboration, paste rules, plugin ecosystems, or complete CommonMark behavior should keep that policy in application code and update the preview through the public slots.

## Visual Principles

Usuzumi should feel like a carefully typeset independent publication that can also support real application controls. It is not stark black and white minimalism, not beige notebook UI, and not a colorful SaaS dashboard.

- Use `#f4f3f0` as the default paper-gray page foundation.
- Use `#20201e` and `#333331` instead of pure black.
- Use `#fbfaf7`, `#efeee9`, `#ebeae6`, and `#e7e6e1` for layered surfaces.
- Use thin borders and spacing for hierarchy. Standard cards do not float.
- Use Georgia-based serif typography for almost everything.
- Use `Meddon Custom` only for signature identity marks, and load `usuzumi-signature.css` only when that role is needed.
- Keep rectangular buttons at 7px radius.
- Keep the minimum visible radius at 4px.
- Keep motion quiet: no page entrances, no bouncy easing, no parallax.
- Avoid saturated accent systems, emoji decoration, heavy shadows, glass panels, and decorative blobs.

## Tokens

Color tokens and motion tokens are documentation-level design roles, not component catalog entries. Explain their scope, contrast expectations, timing intent, and affected component roles in documentation; the component page should stay focused on actual reusable UI components.

### Core Color Roles

| Role | Token | Hex | Use |
|------|-------|-----|-----|
| Paper Gray | `--uzu-bg` | `#f4f3f0` | Page background |
| Surface | `--uzu-surface` | `#fbfaf7` | Cards, panels, popovers |
| Soft Surface | `--uzu-surface-soft` | `#efeee9` | Inputs, secondary cards |
| Muted Surface | `--uzu-surface-muted` | `#ebeae6` | Preview blocks, nested panels |
| Inset Surface | `--uzu-surface-inset` | `#e7e6e1` | Recessed UI areas |
| Strong Ink | `--uzu-fg-strong` | `#20201e` | Titles, active states |
| Body Ink | `--uzu-fg` | `#333331` | Body text |
| Muted Text | `--uzu-muted` | `#686866` | Descriptions |
| Subtle Text | `--uzu-subtle` | `#6d6c68` | Help text, metadata, footer text |
| Soft Text | `--uzu-soft` | `#8a8a85` | Decorative captions, section labels. Not for long-form readable text |
| Default Border | `--uzu-border` | `#dad9d5` | Cards, controls, dividers |
| Soft Border | `--uzu-border-soft` | `#e5e4e0` | Internal dividers |
| Strong Border | `--uzu-border-strong` | `#aaa9a2` | Hover support and stronger dividers |
| Edit Focus Border | `--uzu-edit-focus-border` | mixed | Hard focus border for inputs and editor surfaces |
| Primary Action | `--uzu-action-bg` | `#2f2f2c` | Filled primary action |
| Action Text | `--uzu-action-fg` | `#f7f6f1` | Text on charcoal action |

### Semantic Colors

Semantic colors are muted and gray-balanced. They must never read as generic bright red, green, yellow, or blue.

| Role | Text | Background |
|------|------|------------|
| Success | `#4e6655` | `#e6ede7` |
| Warning | `#7b6842` | `#f0eadc` |
| Danger | `#7a4d4a` | `#efe3e1` |
| Info | `#56606a` | `#e5e7e8` |

### Radius

- Micro: `4px`
- Standard: `7px`
- Medium: `10px`
- Large: `14px`
- Full Pill: `999px`

Never use visible 0px, 1px, 2px, or 3px corner radius for cards, controls, previews, popovers, progress tracks, or modal surfaces.

### Motion

- Quick: `160ms`
- Base: `180ms`
- Slow: `280ms`
- Easing: `cubic-bezier(.2, .8, .2, 1)`

Allowed transitions are limited to `transform`, `color`, `background`, `border-color`, `opacity`, `text-decoration-color`, and occasional overlay `box-shadow`. Hover and focus states may change color, border, background, opacity, or an internal indicator, but they must not move the whole control. Passive surfaces such as cards, rows, specimens, and empty states should not gain decorative hover motion.

Use animation for process states and state transitions: loading, syncing, indeterminate progress, skeleton content, active task steps, tab and segmented indicators, select menus, disclosures, dialogs, and toast dismissal. Popup surfaces such as menus, dialogs, tooltips, and toasts should fade without translating, scaling, or changing their visual geometry after they appear. Keep repeated animation localized to `.is-loading`, `.uzu-skeleton`, `.uzu-progress-indeterminate`, `.uzu-activity`, and `.uzu-process-step.is-active`. Avoid whole-page entrance animation, bounce, parallax, repeated decorative motion, or layout-shifting size transitions.

## Typography

| Role | Class | Size | Line Height | Notes |
|------|-------|------|-------------|-------|
| Signature | `.uzu-signature` | 120px desktop, 82px mobile, 48px narrow, 38px ultra-narrow | 1.42 | Single-line identity mark; requires optional `usuzumi-signature.css` |
| Hero Title | `.uzu-hero-title` | 132px desktop, 82px mobile | 0.86 | Product or offer name |
| Page Title | `.uzu-page-title` | 56px desktop, 40px mobile | 1.02 | Documentation or catalog title |
| Section Title | `.uzu-section-title` | 44px desktop, 34px mobile | 1.08 | Major content sections |
| Body Large | `.uzu-body-large` | 18px | 1.65 | Hero copy and intros |
| Body | `.uzu-text` | 15px | 1.7 | Standard reading text |
| Card Title Pair | `.uzu-title-pair` | 18px + 13px | 1.25 + 1.55 | Fixed 6px gap |

Letter spacing is 0 by default. Section labels may be uppercase, but they should remain quiet and compact.

Use display-size classes only in their intended page context. `.uzu-signature` belongs in open identity areas such as a homepage hero, stays on one line, and should contain short identity text rather than long headings. `.uzu-hero-title` belongs in product or offer heroes. In design catalogs, inspect type roles with public layout primitives such as `.uzu-grid`, `.uzu-card`, `.uzu-title-pair`, `.uzu-scroll-area`, `.uzu-section-title`, `.uzu-body-large`, and `.uzu-text`; bound page-scale specimens with `.uzu-scroll-area` instead of adding catalog-only specimen classes to the library.

## Components

### Buttons

Buttons are tactile but calm. Use one primary button per decision area. Rectangular buttons use 7px radius and 13px labels. Icon-label spacing is 7px.

```html
<a class="uzu-button uzu-button-primary" href="download.html">Primary</a>
<button class="uzu-button" type="button">Default</button>
<button class="uzu-button uzu-button-ghost" type="button">Ghost</button>
<button class="uzu-button uzu-button-danger" type="button">Danger</button>
<button class="uzu-button" type="button" disabled>Disabled</button>
<button class="uzu-button is-loading" type="button" aria-busy="true">Saving</button>
```

Use `.uzu-text-link` for low-pressure navigation such as opening a project, viewing a page, or moving to documentation. Do not turn every page link into a rectangular button. Buttons are for explicit actions: download, submit, confirm, save, delete, or start.

### Cards

Cards use surfaces, borders, and spacing. They do not use default shadows.

```html
<article class="uzu-card">
  <div class="uzu-title-pair">
    <h3>Card title</h3>
    <p>Muted description with fixed rhythm.</p>
  </div>
</article>
```

Cards are for repeated bounded objects, compact summaries, controls, static overlay content, and screen thumbnails. Do not use cards as the default wrapper for every section. If the content is primarily a list of projects or feature explanations, use the relevant page pattern instead of a card grid.

Use `.uzu-card-cover` together with `.uzu-card` when a repeated object needs a flush media region above its body. The modifier removes the default card padding, stacks media and body vertically, and clips the top media region to the card radius. Put consumer-owned images, video, SVG, canvas, or component markup in `.uzu-card-cover-media`; put text and actions in `.uzu-card-cover-body`. Keep cover colors on `--uzu-*` tokens or `currentColor` so the composition follows theme changes.

Add `.uzu-card-cover-horizontal` when a cover item should become media/body columns on wider screens and return to the vertical cover layout on narrow screens. Add `.uzu-card-cover-compact` when the body should use tighter card rhythm for dense project, tool, or article grids. For drawn covers, SVG interface art, canvas snapshots, and other code-rendered media, set `--uzu-cover-object-fit: contain` and add `--uzu-cover-media-padding`; this is the recommended `art` recipe. Use `cover` for photographic thumbnails, `contain` for complete screenshots or drawn covers, and `scale-down` when large source art should never upscale. Use `--uzu-cover-body-min-height` when rows of horizontal cards need stable text blocks.

```html
<article class="uzu-card uzu-card-cover" style="--uzu-cover-ratio: 4 / 3">
  <div class="uzu-card-cover-media">
    <img src="cover.jpg" alt="">
  </div>
  <div class="uzu-card-cover-body">
    <div class="uzu-title-pair">
      <h3>Cover card</h3>
      <p>Flush media with regular card body rhythm.</p>
    </div>
  </div>
</article>
```

```html
<article class="uzu-card uzu-card-cover uzu-card-cover-horizontal uzu-card-cover-compact"
  style="--uzu-cover-object-fit: contain; --uzu-cover-media-padding: 18px; --uzu-cover-body-min-height: 160px">
  <div class="uzu-card-cover-media">
    <svg viewBox="0 0 320 180" role="img" aria-label="Drawn interface cover">
      <rect width="320" height="180" rx="18" fill="var(--uzu-surface-soft)"></rect>
      <path d="M48 56h224M48 90h164M48 124h196" stroke="currentColor" stroke-width="10" stroke-linecap="round"></path>
    </svg>
  </div>
  <div class="uzu-card-cover-body">
    <div class="uzu-title-pair">
      <h3>Drawn cover</h3>
      <p>Complete artwork stays visible instead of being cropped.</p>
    </div>
  </div>
</article>
```

### Layout Grids

Use `.uzu-grid` for repeated local content. `.uzu-grid-2`, `.uzu-grid-3`, and `.uzu-grid-4` are fixed presets that collapse to one column on narrow screens. Use `.uzu-grid-auto` when the layout should choose the column count from available width instead of hand-written breakpoints.

```html
<div class="uzu-grid uzu-grid-auto" style="--uzu-grid-min-item-width: 240px; --uzu-grid-max-columns: 3">
  <article class="uzu-card">One</article>
  <article class="uzu-card">Two</article>
  <article class="uzu-card">Three</article>
</div>
```

`.uzu-grid-auto` uses CSS Grid only. `--uzu-grid-min-item-width` sets the smallest comfortable card width, while `--uzu-grid-max-columns` caps the number of columns so wide pages do not create over-dense rows. Keep item sizing on the grid container and let each child own its content.

### Forms

Fields must have real labels. Placeholders are hints, not labels.

Text inputs, textareas, command inputs, combobox inputs, steppers, Markdown editors, code editors, plain editors, and inline editors use `--uzu-edit-focus-border` for a hard focus border with no blurred shadow or glow. The token is mixed from strong ink and strong border so dark mode does not flash a near-white edit border. Input groups and steppers are one control surface: `.uzu-input-group` and `.uzu-stepper` own the rounded outer border and show the edit focus border only when their editable input is focused, while add-ons, selectable suffixes, local actions, and stepper buttons stay as attached inner segments with their own focus affordance. Use `.uzu-input-addon` only for fixed text; when a suffix can vary, compose a nested `.uzu-select[data-uzu-select]` inside the input group.

```html
<label class="uzu-field">
  <span class="uzu-label">Project name</span>
  <input class="uzu-input" placeholder="Untitled">
</label>
```

Custom selects use `.uzu-select` plus `data-uzu-select`. Add `data-uzu-select-name` to generate a hidden input for form submission. Use `data-value` or `data-uzu-select-value` on options when the submitted value should differ from the visible label. The script dispatches both `change` and `uzu-select-change` when the value changes.

Validation belongs to the field, not just the message:

```html
<form class="uzu-form" data-uzu-form novalidate>
  <label class="uzu-field" data-uzu-field>
    <span class="uzu-label">Email</span>
    <input class="uzu-input" type="email" required aria-describedby="email-error">
    <span class="uzu-form-error" id="email-error" data-uzu-form-error hidden>Enter a complete email address.</span>
  </label>
</form>
```

`data-uzu-form` uses native control validity, toggles `.is-invalid`, syncs `aria-invalid`, reveals `.uzu-form-error`, and emits `uzu-field-validate` plus `uzu-form-validate`. Initial load preserves any existing `.is-invalid` or `aria-invalid="true"` state without validating empty required fields; add `data-uzu-form-validate-on-init="true"` when the first render should validate immediately. Forms that need custom validation can listen for those events or call `window.Usuzumi.validateForm(form)`.

Use `disabled` and `readonly` attributes for non-editable controls. Disabled controls reduce contrast and remove pointer affordance; read-only controls remain readable.

Sliders use `.uzu-slider` on native `input[type="range"]` so keyboard, min/max, form value, and validation behavior stay native. For finite choices, add `.uzu-slider-stepped` plus `data-uzu-slider-stepped`; the runtime reads `min`, `max`, and `step` to generate marker dots while keeping the input as a real range control. Stepped sliders keep the same base track and thumb as continuous sliders; marker dots stay within the thumb travel range instead of stretching to the visual edges.

### Navigation

Top navigation uses `.uzu-topbar` for the row, `.uzu-brand-link` for the brand, `.uzu-nav` for links, and `.uzu-topbar-actions` for compact page controls. The nav slot grows through the center of the row, while `.uzu-topbar-actions` stays at the inline end for theme toggles and language selectors. Add `data-uzu-topbar-overflow` to keep the topbar on one row and move trailing `.uzu-nav` links into a `.uzu-menu.uzu-topbar-overflow-menu[data-uzu-topbar-overflow-menu]` when width runs out; the menu trigger copy is supplied by the consumer, and `data-uzu-topbar-overflow-min-visible` can keep a minimum number of links outside the menu. Links marked with `.is-current`, `aria-current="page"`, or `aria-current="location"` keep their visual and ARIA state when they move into or out of the overflow menu. Add `data-uzu-topbar-spy="hash"` when same-page hash links should update the current state from `location.hash` and visible sections during scroll. Use `.uzu-tabs` for peer sections and `.uzu-segmented` for compact mode switches.

Tabs and segmented controls are static visual primitives by default. Add `data-uzu-tabs` or `data-uzu-segmented` when the runtime should manage the active state, keyboard arrow navigation, ARIA state, animated active indicators, and change events.

```html
<div class="uzu-tabs" data-uzu-tabs>
  <button class="uzu-tab is-active" type="button" data-uzu-tab-value="overview" aria-selected="true">Overview</button>
  <button class="uzu-tab" type="button" data-uzu-tab-value="details" aria-selected="false">Details</button>
</div>

<div class="uzu-segmented" data-uzu-segmented>
  <button class="uzu-segment is-active" type="button" data-uzu-segment-value="today" aria-pressed="true">Today</button>
  <button class="uzu-segment" type="button" data-uzu-segment-value="plan" aria-pressed="false">Plan</button>
</div>
```

### Feedback

Badges, alerts, callouts, toasts, and validation use the muted semantic families. State should be carried by text, ARIA, and layout as well as color. Badges are short status labels; do not use them for user-removable filters or categories. Alerts provide `.uzu-alert-info`, `.uzu-alert-success`, `.uzu-alert-warning`, and `.uzu-alert-danger` presets. Alerts and callouts also expose color custom properties for project-specific tones; prefer those variables over selector overrides. Toasts use `.uzu-toast-stack` and `.uzu-toast`; close buttons use icon-only `.uzu-icon-button` controls with `data-uzu-toast-close`. Use `data-uzu-toast-trigger`, `data-uzu-toast-template`, and `data-uzu-toast-stack` when a toast should be created after a user action. The runtime fills default `role="status"`, `aria-live="polite"`, and `aria-atomic="true"` when authors have not set them.

Use `.uzu-error-state` for a failed region inside an otherwise usable view. Use `.uzu-error-page` when the whole route is blocked, such as a missing page, server failure, or maintenance notice. Add `.uzu-error-page-screen` when the error should occupy the available viewport height inside `.uzu-page`. Keep page errors unframed and spacious, put the short code or label in `.uzu-error-page-code`, and group recovery links or retry controls in `.uzu-error-page-actions`. `.uzu-error-page` is a page-level layout primitive, not a card; do not wrap it in another bordered error surface unless the product route itself requires a framed tool.

Add `data-uzu-error-page` when a page error should accept parameters. Mark replaceable slots with `data-uzu-error-code`, `data-uzu-error-title`, `data-uzu-error-message`, and actions with `data-uzu-error-action="primary"` or `"secondary"`. With `data-uzu-error-page-source="query"`, the runtime reads URL parameters such as `errorCode`, `errorTitle`, `errorMessage`, `errorDocumentTitle`, `errorPrimaryLabel`, `errorPrimaryHref`, `errorSecondaryLabel`, and `errorSecondaryHref`. Language-specific variants like `errorTitleEn` or `errorTitleZh` are preferred over the unsuffixed value when the current language matches. Applications can also call `window.Usuzumi.setErrorPage(page, options)` with `{ code, title, message, documentTitle, primaryAction, secondaryAction }`. Parameter text is written as text, not HTML, and `javascript:` action links are ignored.

```html
<section class="uzu-error-page uzu-error-page-screen" data-uzu-error-page data-uzu-error-page-source="query" aria-labelledby="not-found-title">
  <p class="uzu-error-page-code" data-uzu-error-code>404</p>
  <div class="uzu-title-pair">
    <h1 id="not-found-title" data-uzu-error-title>Page not found</h1>
    <p data-uzu-error-message>The page may have moved or been removed.</p>
  </div>
  <div class="uzu-error-page-actions" data-uzu-error-actions>
    <a class="uzu-button uzu-button-primary" href="/" data-uzu-error-action="primary">Go home</a>
    <a class="uzu-button" href="/components.html" data-uzu-error-action="secondary">View components</a>
  </div>
</section>
```

Use `.uzu-callout` for editorial notes, constraints, and secondary context that belongs in the reading flow. Callouts are not alerts: they should not announce urgent errors, destructive states, or time-sensitive feedback. Use `.uzu-callout-note`, `.uzu-callout-info`, or `.uzu-callout-warning` to adjust the tone while keeping the message text-led.

```html
<aside class="uzu-callout uzu-callout-note">
  <h3 class="uzu-callout-title">Context note</h3>
  <p>Use callouts for guidance that supports the surrounding content.</p>
</aside>
```

### Navigation And Tools

Use `.uzu-breadcrumb` for page hierarchy, `.uzu-toolbar` with `.uzu-toolbar-group` for local actions, and `.uzu-pagination` with `.uzu-page-button` for paged lists. Page buttons are fixed square controls with rounded corners, so keep the visible label to a page number, ellipsis, or compact symbol and put longer meaning in `aria-label`. Mark the current breadcrumb or page with `aria-current="page"`. Add `data-uzu-pagination` when the runtime should manage active page state, previous/next buttons, and optional `data-uzu-page-panel` content. Toolbars may use native buttons, links styled as `.uzu-button`, or icon buttons when the action has an accessible name.

Use `.uzu-panel-index` with `data-uzu-panel-index` for same-page catalogs that switch `.uzu-panel` sections, such as a component list, documentation index, or settings panel index. `.uzu-panel-nav` with `data-uzu-panel-nav` remains a compatible older alias, but new catalogs should prefer the clearer Panel Index name. Use `.uzu-code-block` for copyable code snippets: add `data-uzu-code-language` or a `language-*` class to the `code` or `pre` element, let `Usuzumi.init()` write Usuzumi token spans, and keep `data-uzu-code-source` as the plain copy value. If one code block carries multiple `[data-lang]` snippets, the copy control should follow the currently visible language. Use `window.Usuzumi.listCodeLanguages()` and `window.Usuzumi.hasCodeLanguage(language)` when a page needs to expose or validate the bundled language set. Set `--uzu-code-block-bg`, `--uzu-code-block-fg`, and `--uzu-code-token-*` variables on the block when a page needs different code colors. Use `.uzu-prose[data-uzu-markdown]` for the built-in Markdown subset, or `.uzu-markdown-editor[data-uzu-markdown-editor]` when users should edit source and see a live preview. The Markdown renderer is Usuzumi-owned and intentionally limited to headings, paragraphs, unordered lists, safe links, inline code, and fenced code blocks; full Markdown documents should still be generated by a dedicated documentation pipeline when policy needs to be exact.

Usuzumi ships its own lightweight tokenizer-based syntax highlighter. Syntax highlighting can be controlled with `data-uzu-code-highlight` on the document root, body, or a local container. `auto` is the default and highlights matching code blocks during initialization. `visible` highlights blocks immediately when they are near the viewport and observes the rest with `IntersectionObserver`, falling back to immediate highlighting when the browser lacks that API. `manual` disables automatic code highlighting for that scope; call `window.Usuzumi.highlightCodeBlocks(root)` to process it explicitly. `window.Usuzumi.highlightCode(source, language)`, `highlightCodeBlock(code)`, and `highlightCodeBlocks(root)` stay available in both full and core entries. In core-only mode they safely return or render plain text with `highlighted: false`. Loading `ui/usuzumi-highlight.js` after `ui/usuzumi-core.js` exposes `window.UsuzumiHighlightEngine`, dispatches `uzu-code-highlight-engine-ready`, and allows automatic code blocks to be highlighted again with the Usuzumi engine.

```html
<nav aria-label="Breadcrumb">
  <ol class="uzu-breadcrumb">
    <li><a href="/">Home</a></li>
    <li><span aria-current="page">Settings</span></li>
  </ol>
</nav>

<div class="uzu-toolbar" role="toolbar" aria-label="List actions">
  <div class="uzu-toolbar-group">
    <button class="uzu-button uzu-button-primary" type="button">New</button>
    <button class="uzu-button" type="button">Import</button>
  </div>
</div>

<div id="page-panels">
  <article class="uzu-page-panel" data-uzu-page-panel="1">Page one</article>
  <article class="uzu-page-panel" data-uzu-page-panel="2" hidden>Page two</article>
</div>

<nav aria-label="Pagination">
  <ol class="uzu-pagination" data-uzu-pagination data-uzu-pagination-target="#page-panels">
    <li><button class="uzu-page-button" type="button" data-uzu-page-prev aria-label="Previous page">‹</button></li>
    <li><button class="uzu-page-button" type="button" data-uzu-page="1" aria-current="page">1</button></li>
    <li><button class="uzu-page-button" type="button" data-uzu-page="2">2</button></li>
    <li><button class="uzu-page-button" type="button" data-uzu-page-next aria-label="Next page">›</button></li>
  </ol>
</nav>
```

### Compact Data

Use `.uzu-stat` for small metric summaries. Use `.uzu-tag` for category labels, filter tokens, and removable conditions; selectable tags use `data-uzu-tag-selectable="true"` with `aria-pressed`, removable tags use an icon-only `.uzu-tag-close` control with `data-uzu-tag-close`, and editable tag groups use `data-uzu-tag-list` with a trailing `.uzu-tag-add[data-uzu-tag-add]` control. Canceling `uzu-tag-add` with `preventDefault()` keeps the input open and leaves insertion to the application. Use `.uzu-separator` or `.uzu-separator-vertical` for explicit divisions inside compact surfaces. Use `.uzu-code` for inline identifiers and `.uzu-kbd` for keyboard hints.

```html
<article class="uzu-stat">
  <p class="uzu-stat-label">Components</p>
  <p class="uzu-stat-value">42</p>
  <p class="uzu-stat-note">Public primitives.</p>
</article>

<p>Use <code class="uzu-code">.uzu-scope</code> and press <kbd class="uzu-kbd">Ctrl</kbd> <kbd class="uzu-kbd">K</kbd>.</p>
```

### Disclosure And Loading

Use disclosures for optional details, compact settings, and short documentation blocks. Runtime-managed disclosures keep the panel visible during close animation before applying `hidden`.

```html
<article class="uzu-disclosure" data-uzu-disclosure>
  <button class="uzu-disclosure-trigger" type="button" data-uzu-disclosure-trigger>Details</button>
  <div class="uzu-disclosure-panel" data-uzu-disclosure-panel>Optional content.</div>
</article>
```

Use `.uzu-skeleton`, `.uzu-skeleton-title`, `.uzu-skeleton-text`, and `.uzu-skeleton-block` for loading placeholders. Skeletons must preserve layout dimensions and must not replace useful status text when the wait is long.

### Data

Tables use `.uzu-table-wrap` and `.uzu-table`. Horizontal scrolling is acceptable on narrow screens. `.uzu-table-wrap` receives the same 6px system scrollbar treatment as `.uzu-scroll`; do not add local scrollbar overrides. Do not shrink table text below 12px.

Data grids start from the same table markup and add `data-uzu-data-grid` to the wrapper or table. Add `data-uzu-grid-sort` to sortable headers, `data-uzu-grid-selection` to row checkboxes, `data-uzu-grid-select-all` to a header checkbox, `data-uzu-grid-empty` to an empty-state row, and `data-uzu-grid-align="end"` or `.uzu-grid-align-end` for numeric columns. Call `window.Usuzumi.refreshDataGrid(grid)` after filtering rows so select-all and empty-state rows stay synchronized.

Date heatmaps use `.uzu-heatmap` for sign-in streaks, contribution density, activity calendars, and other day-value summaries. They are not card surfaces by themselves; place them inside `.uzu-card` when the surrounding screen needs a framed module. Add `data-uzu-heatmap` when the runtime should build or normalize cells. The root may include `.uzu-heatmap-header`, `.uzu-heatmap-title`, `.uzu-heatmap-summary`, `.uzu-heatmap-viewport`, `.uzu-heatmap-months`, `.uzu-heatmap-weekdays`, `.uzu-heatmap-grid`, `.uzu-heatmap-legend`, and `.uzu-heatmap-detail`. Static cells can be authored with `.uzu-heatmap-cell`, `data-uzu-heatmap-date`, `data-uzu-heatmap-offset`, `data-uzu-heatmap-value`, and `data-uzu-heatmap-level`.

Prefer the compact data script for generated heatmaps. The `s` date starts a continuous local-calendar range, `v` stores one entry per day, `w` sets week start, `sel` selects a default offset, `l` supplies `[less, more, empty]` labels, and `ev` stores per-day event tuples keyed by offset. A `v` item can be a number or `[value, level]`; explicit levels override automatic `0..4` mapping.

```html
<section class="uzu-heatmap" data-uzu-heatmap>
  <script type="application/json" data-uzu-heatmap-data>{
    "s": "2025-06-18",
    "w": 1,
    "v": [0, 0, 1, 3, 0, [2, 4]],
    "sel": 3,
    "l": ["Less", "More", "No events"],
    "ev": [
      [3, [["Midday check-in", "12:20", "18 day streak"]]],
      [5, [["Review complete", "21:40"]]]
    ]
  }</script>
</section>
```

The runtime creates button cells, writes `aria-pressed`, keeps `data-uzu-heatmap-selected-date` on the root, supports click, Enter, Space, Home, End, and arrow-key focus movement, and renders `.uzu-heatmap-detail` as text only. Set `data-uzu-heatmap-detail-render="manual"` when application code owns the detail region. Selection dispatches `uzu-heatmap-select` with `{ heatmap, cell, date, offset, value, level, events }` and then a plain `change` event. Use `window.Usuzumi.setHeatmapData(heatmap, data, emit)`, `window.Usuzumi.selectHeatmapDate(heatmap, dateOrOffset, emit)`, and `window.Usuzumi.refreshHeatmap(heatmap)` for dynamic data.

Heatmap spacing and scale are controlled with `--uzu-heatmap-cell-size`, `--uzu-heatmap-cell-gap`, `--uzu-heatmap-cell-radius`, `--uzu-heatmap-min-width`, `--uzu-heatmap-level-0` through `--uzu-heatmap-level-4`, and `--uzu-heatmap-selected-ring`. Annual ranges should stay inside `.uzu-heatmap-viewport` so horizontal scrolling is local and follows the public 6px scrollbar contract.

Image collections use `.uzu-gallery`. The root is not a card by itself; place it inside `.uzu-card` only when the surrounding page needs a framed module. Static galleries should keep progressive links:

```html
<section class="uzu-gallery" data-uzu-gallery data-uzu-gallery-layout="justified">
  <a class="uzu-gallery-item" href="/images/wide.jpg" data-width="1600" data-height="900">
    <img class="uzu-gallery-image" src="/images/wide.jpg" alt="Wide image">
    <span class="uzu-gallery-caption">Wide image</span>
  </a>
</section>
```

Without JavaScript the link opens the image. With `data-uzu-gallery`, the runtime reads `.uzu-gallery-item` children, preserves their link structure, writes stable justified sizes when `data-uzu-gallery-layout="justified"`, and opens an Image Viewer when `data-uzu-gallery-viewer` is `auto` or points at a viewer selector. Set `data-uzu-gallery-viewer="none"` when items should remain plain links or buttons. `data-uzu-gallery-caption="auto|always|hover|none"` controls caption visibility, `data-uzu-gallery-row-height` and `data-uzu-gallery-gap` tune justified layout, `data-uzu-gallery-download="false"` disables viewer downloads, and `data-uzu-gallery-state` is synchronized as `idle`, `loading`, `ready`, `empty`, or `error`.

Generated galleries can load compact item arrays from `data-uzu-gallery-source`. A `#id` source reads a local `script[type="application/json"]`; a `.json` URL or JSON response reads an array or `{ "items": [...] }`; any other URL is treated as a server directory index and parses image links from returned HTML. Directory mode depends on the server exposing linkable directory HTML and is not guaranteed on static hosts that hide directory listings.

```html
<script type="application/json" id="gallery-data">[
  { "src": "/images/a.jpg", "alt": "A", "caption": "A", "width": 1200, "height": 800 },
  { "src": "/images/b.jpg", "alt": "B", "caption": "B", "width": 800, "height": 1200 }
]</script>
<section class="uzu-gallery" data-uzu-gallery data-uzu-gallery-source="#gallery-data"></section>
```

Each data item uses `{ src, alt, caption, width, height, download }`. `src` is required. `alt` defaults to an empty string, `caption` defaults to a readable file name, `download` defaults to `src`, and missing dimensions are filled from the image natural size when it loads. Use `window.Usuzumi.setGalleryItems(gallery, items, emit)` and `window.Usuzumi.refreshGallery(gallery)` for application-owned updates. Loading emits `uzu-gallery-load`, failures emit `uzu-gallery-error`, and viewer selection emits `uzu-gallery-select` with `{ gallery, item, index, trigger, viewer }`.

Image Viewer uses `.uzu-image-viewer-overlay`, `.uzu-image-viewer`, `.uzu-image-viewer-toolbar`, `.uzu-image-viewer-stage`, `.uzu-image-viewer-image`, and `.uzu-image-viewer-caption`. It is a full-viewport focused preview by default: the image stage fills the screen, the caption sits at the top-left, and zoom/download/close controls sit at the top-right. When `data-uzu-gallery-viewer="auto"`, the gallery runtime creates a public dialog overlay at the end of `body`. Pages that need localized toolbar labels should author the viewer explicitly with `.uzu-dialog-overlay.uzu-image-viewer-overlay[data-uzu-dialog-overlay]`, `.uzu-image-viewer[data-uzu-image-viewer][data-uzu-dialog]`, `data-uzu-image-viewer-stage`, `data-uzu-image-viewer-image`, `data-uzu-image-viewer-caption`, `data-uzu-image-viewer-zoom-in`, `data-uzu-image-viewer-zoom-out`, `data-uzu-image-viewer-reset`, `data-uzu-image-viewer-download`, and a normal `data-uzu-dialog-close` control. The dialog runtime supplies Escape close, close controls, focus return, isolation, scroll locking, and animation timing.

The viewer supports `+` / `=` zoom in, `-` zoom out, `0` reset, wheel zoom by default, and left-button drag panning inside the stage. Set `data-uzu-image-viewer-wheel-zoom="false"` to disable wheel zoom, and use `data-uzu-image-viewer-min-scale` / `data-uzu-image-viewer-max-scale` to bound zoom. Use `window.Usuzumi.openImageViewer(viewer, item, trigger)` and `window.Usuzumi.closeImageViewer(viewer)` for direct control. Viewer events are `uzu-image-viewer-open`, `uzu-image-viewer-close`, and `uzu-image-viewer-zoom`. Layout variables include `--uzu-gallery-gap`, `--uzu-gallery-row-height`, `--uzu-gallery-item-ratio`, `--uzu-gallery-item-width`, `--uzu-gallery-item-height`, `--uzu-image-viewer-scale`, `--uzu-image-viewer-x`, and `--uzu-image-viewer-y`. Visual variables include `--uzu-image-viewer-backdrop`, `--uzu-image-viewer-control-fg`, `--uzu-image-viewer-control-muted`, `--uzu-image-viewer-control-bg`, and `--uzu-image-viewer-control-border`; their defaults derive from `--uzu-*` tokens.

### Overlays

Use `.uzu-popover` and `.uzu-modal` for overlay surfaces. Overlay shadows are allowed, but standard cards should remain flat. Triggered popovers use a `data-uzu-popover` wrapper, a `data-uzu-popover-trigger` button, and a `.uzu-popover[data-uzu-popover-content]` layer. The wrapper provides the positioning scope, supports `data-uzu-popover-align="end"`, and the runtime toggles `hidden`, `is-open`, and `aria-expanded`, then closes on Escape or outside click. Dialog behavior uses `data-uzu-dialog-target`, `data-uzu-dialog-overlay`, `data-uzu-dialog`, and `data-uzu-dialog-close`. The runtime handles Escape, backdrop clicks, focus return, a small focus trap, background `inert` isolation, page scroll locking, and open/close animation timing.

Nested dialogs are supported when the nested overlay lives inside the active dialog. Closing the nested dialog returns focus to its trigger and keeps the parent dialog isolated; closing the parent releases scroll locking and background isolation.

Tooltips use `data-uzu-tooltip` for short supplemental labels. During initialization the runtime adds an off-screen description and connects it through `aria-describedby` when the trigger does not already provide one. Essential instructions should also appear in visible copy or accessible labels.

### Progress

Linear progress uses `.uzu-progress` and `.uzu-progress-bar`. Use `.uzu-progress-indeterminate` on the track, or `.is-indeterminate` on the bar, when work is ongoing but the percentage is unknown. Circular progress uses `.uzu-progress-circular` on the SVG and `.uzu-progress-circular-track` / `.uzu-progress-circular-fill` on the rings.

Use `.uzu-activity` with three `.uzu-activity-dot` children for compact activity status, and `.uzu-process` with `.uzu-process-step` for short multi-step flows. Mark completed steps with `.is-complete`; mark the current step with `.is-active` and `aria-current="step"`.

```html
<div class="uzu-progress uzu-progress-indeterminate" role="progressbar" aria-label="Syncing changes">
  <span class="uzu-progress-bar"></span>
</div>

<ol class="uzu-process" aria-label="Publish progress">
  <li class="uzu-process-step is-complete">Validate tokens</li>
  <li class="uzu-process-step is-active" aria-current="step">Build CSS bundle</li>
  <li class="uzu-process-step">Package release</li>
</ol>
```

### Switches

Switches use `.uzu-switch` with `data-uzu-switch`, `role="switch"`, and `aria-checked`. The script keeps `.is-on` and `aria-checked` synchronized and dispatches both `change` and `uzu-switch-change` when the state changes.

```html
<button class="uzu-switch" type="button" data-uzu-switch aria-checked="false" aria-label="Sync"></button>
```

## JavaScript Behaviors

`ui/usuzumi.js` is intentionally framework-free, while `ui/usuzumi-core.js` is the recommended entry for pages that do not need built-in syntax highlighting. Keep code-heavy documentation pages on core plus the separate highlight entry, and keep lightweight landing or error pages on core only.

`npm run validate` includes a performance budget check for the generated minified CSS, full runtime, core runtime, and highlight runtime. The documentation site has a matching budget for vendored Usuzumi assets and the large component catalog HTML.

It auto-initializes in browsers, is safe to import in SSR/Node environments, and can be rerun for dynamic content:

```js
window.Usuzumi.init(container);
```

Repeated `init()` calls do not rebind already-initialized controls.
For containers that receive components after page load, add `data-uzu-auto-init` to observe inserted elements and initialize them through the same idempotent path.

### Theme Toggle

```html
<html class="uzu-root" lang="en" data-theme="light" data-uzu-theme-key="site-theme">
...
<button class="uzu-icon-button uzu-theme-toggle" data-uzu-theme-toggle>
  ...
</button>
```

Place the inline theme boot script before the stylesheet so it can resolve the persisted `data-theme-mode` (`auto`, `light`, or `dark`) into `data-theme` / `data-uzu-theme` (`light` or `dark`) before CSS loads. The deferred script cycles `light -> dark -> auto -> light` and persists the mode under the root `data-uzu-theme-key`. Use `data-uzu-theme-target` to target a scoped element. If omitted, the document root is used. Toggle icon state is synchronized through `.is-dark` and `.is-auto`, so scoped toggles do not inherit the visual state of an unrelated dark ancestor.

### Language Selector

```html
<span class="uzu-language-select" data-uzu-language-select data-uzu-language-key="site-language">
  <button class="uzu-icon-button uzu-language-trigger" type="button" data-uzu-language-trigger aria-label="Language">
    Language
  </button>
  <span class="uzu-language-menu" data-uzu-language-menu>
    <button class="uzu-language-option is-selected" type="button" data-uzu-language-option data-uzu-language-value="en" data-uzu-language-html-lang="en">English</button>
    <button class="uzu-language-option" type="button" data-uzu-language-option data-uzu-language-value="ja" data-uzu-language-html-lang="ja">Japanese</button>
  </span>
</span>
```

The script writes `data-language`, `data-uzu-lang`, and `lang` on the target root. Use `data-uzu-language-target` when a selector should control a scoped container instead of the document root. A language root can also carry `data-uzu-language-key` directly; when `usuzumi.js` initializes, it restores the saved language for that root even if the page does not include a visible selector. Use that pattern for static 404, 500, maintenance, and other one-off pages that should follow the user's existing site language. Content can be marked with `data-lang="en"`, `data-lang="ja"`, or any other language value. Static markup should add `data-uzu-language-hidden` to fragments outside the initial language so deferred scripts do not reveal multiple languages on first paint.

For SEO or route-based multilingual sites, add `data-uzu-language-url` to individual language options and set `data-uzu-language-url-mode="assign"` or `replace` on the select or language root. `none` is the default and preserves the existing in-page language switch. On selection, the runtime first applies the language state and dispatches `uzu-language-change`, then calls `location.assign(url)` or `location.replace(url)`. Use `assign` when the browser Back button should return to the previous language route; use `replace` for one-way canonical redirects.

### Custom Select

```html
<div class="uzu-select" data-uzu-select data-uzu-select-name="density">
  <button class="uzu-select-trigger" data-uzu-select-trigger aria-expanded="false">Balanced</button>
  <div class="uzu-select-menu" role="listbox">
    <div class="uzu-select-option is-selected" data-uzu-select-option data-value="balanced" role="option">Balanced</div>
  </div>
</div>
```

The script supports click to open, click outside to close, Escape to close, ArrowUp/ArrowDown/Home/End navigation, Enter/Space selection, and option selection. It also assigns stable runtime ids, `aria-controls`, `aria-activedescendant`, and `aria-selected` state for the custom select pattern, and keeps the menu mounted during close animation. Selected values are exposed through `data-uzu-select-value`, an optional generated hidden input, `change`, and `uzu-select-change`.

### Tabs And Segmented Controls

```html
<div class="uzu-tabs" data-uzu-tabs>
  <button class="uzu-tab is-active" type="button" data-uzu-tab-value="foundation" aria-selected="true">Foundation</button>
  <button class="uzu-tab" type="button" data-uzu-tab-value="components" aria-selected="false">Components</button>
</div>
```

The script keeps `.is-active`, `aria-selected`, roving `tabindex`, and the animated underline indicator synchronized for tabs. It supports click, ArrowLeft/ArrowRight/ArrowUp/ArrowDown, Home, and End. If a tab has `data-uzu-tab-target` or `aria-controls`, the matching panel is shown and sibling tab panels are hidden.

Segmented controls use `data-uzu-segmented` and `.uzu-segment`. The script keeps `.is-active`, `aria-pressed`, and the animated selected backing synchronized, supports the same arrow-key navigation, and emits `uzu-segmented-change`.

### Runtime Pagination

Pagination uses `data-uzu-pagination` and page buttons with `data-uzu-page`. Previous and next controls use `data-uzu-page-prev` and `data-uzu-page-next`. When `data-uzu-pagination-target` points to a container, child panels with matching `data-uzu-page-panel` values are shown or hidden with the active page. The script keeps `.is-active`, `aria-current`, disabled previous/next state, and emits `uzu-pagination-change`.

### Custom Events

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
- `uzu-heatmap-select`: `{ heatmap, cell, date, offset, value, level, events }`
- `uzu-gallery-load`: `{ gallery, items, source }`
- `uzu-gallery-error`: `{ gallery, source, error }`
- `uzu-gallery-select`: `{ gallery, item, index, trigger, viewer }`
- `uzu-image-viewer-open` / `uzu-image-viewer-close`: `{ viewer, item, trigger }`
- `uzu-image-viewer-zoom`: `{ viewer, item, scale }`
- `uzu-tree-toggle`: `{ tree, item, expanded, value }`
- `uzu-tree-select`: `{ tree, item, value }`
- `uzu-split-resize`: `{ splitPane, size }`
- `uzu-resizable-resize`: `{ resizable, width, height }`
- `uzu-sidebar-layout-change`: `{ collapsed, expanded }`
- `uzu-disclosure-change`: `{ open, disclosure }`
- `uzu-accordion-change`: `{ open, accordion, disclosure }`
- `uzu-hover-card-open` / `uzu-hover-card-close`: `{ hoverCard, trigger, content }`
- `uzu-popover-open` / `uzu-popover-close`: `{ popover, trigger, content }`
- `uzu-tag-change`: `{ selected, tag, value }`
- `uzu-tag-close`: `{ tag, closeButton, value }`
- `uzu-tag-add`: `{ list, tag, input, trigger, value, label }`
- `uzu-toast-open`: `{ toast, stack }`
- `uzu-toast-close`: `{ toast }`
- `uzu-error-page-change`: `{ page, code, title, message, documentTitle, actions }`
- `uzu-dialog-open` / `uzu-dialog-close`: `{ dialog, overlay, trigger }`
- `uzu-step-nav-change`: `{ value, step, stepNav, index }`
- `uzu-markdown-editor-change`: `{ editor, source, preview, value }`
- `uzu-markdown-editor-render`: `{ editor, source, preview, value }`
- `uzu-code-highlight`: `{ code, language, source, highlighted }`
- `uzu-code-highlight-engine-ready`: `{ engine }`
- `uzu-inline-editor-change`: `{ editor, value }`
- `uzu-panel-nav-change`: `{ target, control, panel, nav }`
- `uzu-panel-show`: `{ target, control, panel, nav }`

## Page Patterns

### Product Homepage

Build homepage introductions from `.uzu-page`, `.uzu-topbar`, `.uzu-section`, `.uzu-hero-split`, `.uzu-signature`, `.uzu-title-pair`, `.uzu-body-large`, `.uzu-flex`, `.uzu-grid`, `.uzu-card`, and `.uzu-footer`. Project-specific hero composition, portfolio rows, or mockup artwork can live in the consuming page while still using public buttons, links, cards, typography, and layout primitives.

Use this structure for a compact intro:

```html
<main class="uzu-page">
  <section class="uzu-hero-split">
    <div class="uzu-stack uzu-gap-4">
      <p class="uzu-section-label">CSS / Runtime / Components</p>
      <h1 class="uzu-signature">Usuzumi</h1>
      <p class="uzu-body-large">A quiet interface kit for small sites and product pages.</p>
      <div class="uzu-flex uzu-wrap uzu-gap-2">
        <a class="uzu-button uzu-button-primary" href="https://github.com/Usuzumi-org/Usuzumi-site">Components</a>
        <a class="uzu-button" href="https://github.com/Usuzumi-org/Usuzumi">GitHub</a>
      </div>
    </div>
  </section>
</main>
```

### App Introduction Page

Use a top bar, a hero with product name and short copy, action buttons near the hero, a quiet product preview, feature sections, screen sections, and optional bilingual content.

Use `.uzu-hero-split` with `.uzu-stack`, `.uzu-section-label`, `.uzu-body-large`, and `.uzu-flex` for compact hero copy and actions. Action links may be buttons because they are explicit commands. Keep icon labels short enough to fit at mobile widths.

Use `.uzu-stack`, `.uzu-list`, `.uzu-list-item`, `.uzu-grid`, or `.uzu-card` for explanatory product features. A list is preferred over three identical cards when the content is mostly text and needs editorial rhythm.

Use `.uzu-grid`, `.uzu-card`, `.uzu-aspect`, and `.uzu-title-pair` for screen previews. Screen cards may contain simulated interface art or real screenshots. The thumbnail, title, and subtitle must use stable spacing and should not rely on browser-default paragraph margins.

Use `.uzu-title-pair` for title and subtitle pairs inside feature items, cards, and screen previews.

### Design Catalog Page

Use the catalog page to show the complete system surface: colors, typography, buttons, cards, forms, navigation, feedback, data, overlays, layout, spacing, radius, elevation, motion, focus, accessibility, system defaults, controls, and progress.

The catalog page should demonstrate generic system primitives only. It must not include specific product names or project-branded language except for the design-system identity itself.

### Documentation Page

Use public primitives for component catalogs, API references, long documentation pages, and static error pages that need persistent navigation plus one main reading column. Documentation pages should compose `.uzu-page`, `.uzu-topbar`, `.uzu-topbar-leading`, `.uzu-nav`, `.uzu-topbar-actions`, `.uzu-sidebar-layout`, `.uzu-sidebar`, `.uzu-scroll-area`, `.uzu-scroll`, `.uzu-panel-index`, `.uzu-panel`, `.uzu-section-head`, `.uzu-card`, `.uzu-error-page`, `.uzu-error-page-screen`, `.uzu-table`, `.uzu-code-block`, and `.uzu-prose`.

Component catalogs are consumers of the library. They should not add catalog-only selectors, runtime hooks, or hidden documentation generators to `ui/`. Each component entry should keep a real preview/code switch, a copyable snippet, two concise guidance notes, and a concrete interface table. Multi-variant entries should put variant-specific guidance beside each variant preview/code group, while bottom notes stay limited to shared rules, events, accessibility, and interface tables. Use `.uzu-code` for inline class, attribute, ARIA, role, and token names; do not leave markdown backticks, ellipsis placeholders, or template categories such as "Base Interface" in visible docs. Merge closely related public controls into one panel when it improves comprehension, as with topbar, theme toggle, and language selector. Do not add standalone panels for design-token categories such as color roles or motion timings; put animated examples under the concrete component that owns the behavior.

```html
<main class="uzu-page">
  <div class="uzu-sidebar-layout">
    <aside class="uzu-sidebar uzu-scroll uzu-scroll-area">
      <nav class="uzu-panel-index" data-uzu-panel-index>
        <button class="uzu-panel-index-button" data-uzu-panel-target="#button">Button</button>
      </nav>
    </aside>
    <section class="uzu-panel" id="button">
      <article class="uzu-card">
        <header class="uzu-section-head">
          <h1 class="uzu-section-title">Button</h1>
        </header>
        <p class="uzu-text">Use the button class on a button or link with a clear command label.</p>
      </article>
    </section>
  </div>
</main>
```

Choose sidebar-related primitives by job: use `.uzu-sidebar-nav` for route links, page links, app sections, and settings groups; use `.uzu-panel-index[data-uzu-panel-index]` for same-page panel switching and catalog indexes; use `.uzu-sidebar-layout` only for the two-column layout and optional collapse behavior. A Panel Index may live inside a `.uzu-sidebar`, but it should not be presented as ordinary app navigation.

`.uzu-sidebar-layout` keeps the sidebar column at `--uzu-sidebar-layout-sidebar-width`, uses a 28px default `--uzu-sidebar-layout-gap` for the column gap, and stacks to one column on narrow screens. When the sidebar also has `.uzu-scroll-area`, the layout limits its height so long navigation remains locally scrollable instead of pushing the active panel below the first viewport.

Add `data-uzu-sidebar-layout` when the sidebar should collapse. Pair it with an icon button using `.uzu-sidebar-layout-toggle[data-uzu-sidebar-toggle]`; page-level navigation should place that button in `.uzu-topbar-leading` before the brand, while local tools can use `.uzu-sidebar-layout-controls` inside the layout. `data-uzu-sidebar-default` accepts `auto`, `expanded`, or `collapsed`; `auto` opens on wide screens and starts collapsed on narrow screens. `data-uzu-sidebar-mobile` accepts `dropdown` or `inline`, with `dropdown` as the narrow-screen default. `data-uzu-sidebar-collapse-on-select` accepts `false`, `narrow`, or `always`. The runtime syncs `data-uzu-sidebar-collapsed`, `hidden`, `aria-expanded`, and `aria-controls`, animates open/close, delays `hidden` until the close animation ends, and emits `uzu-sidebar-layout-change` with `{ collapsed, expanded }`.

`.uzu-section-centered` centers its section head, large body copy, and direct `.uzu-flex` action row for intro, empty, and download sections. Use `.uzu-measure` when a local content block needs a stable readable width; tune it with `--uzu-measure-width` and `--uzu-measure-gutter`. Usuzumi's own site root pages should not add page-local layout classes; promote reusable page patterns into `ui/css/` and consume them from the site through the vendored library. Use `.uzu-break-anywhere` on cells or inline text that may contain long variable names or URLs.

### Choosing The Right Surface

Use sections for major page bands. Use cards for individual repeated objects. Use lists for editorial indexes and text-first explanations. Use previews only when a visual artifact is being represented. Do not nest cards inside cards.

Action hierarchy:

- Primary button: one main action in a decision area.
- Default button: secondary action with real command weight.
- Ghost button: utility action inside a dense control area.
- Text link: navigation to another page, project, document, or external reference.
- Icon button: compact tool action with an accessible label.

The documentation site and large examples live in `Usuzumi-org/Usuzumi-site`. Keep site-only layout, prose, and demo code in that repository. Promote a rule into `ui/css/` only when it is a reusable library primitive.

## Accessibility

- Use `:focus-visible` affordances from the system. Never remove outlines without replacement. Editing surfaces use the system hard-border focus treatment instead of blurred shadow rings.
- Every interactive element must be reachable by keyboard.
- Color must not be the only meaning channel.
- Forms need visible labels.
- Theme toggles and language selectors must remain focusable.
- Respect `prefers-reduced-motion`.
- Respect `forced-colors` where possible.
- Soft borders are aesthetic and not sufficient as the only interactive affordance.

## System Defaults

Usuzumi defines:

- 6px scrollbars with hidden WebKit arrow buttons for the root viewport and every public scroll surface, including `.uzu-scroll`, `.uzu-scroll-area`, `.uzu-table-wrap`, data viewers, editor surfaces, command lists, and combobox lists.
- Root scrollbar thumbs stay visible; local scroll surface thumbs are transparent while idle and become paper-toned on hover, focus, focus-within, or active interaction without changing the reserved 6px gutter.
- Paper-toned scrollbar thumbs keep a stable minimum length so short thumbs do not read as triangular quick-scroll buttons.
- Firefox-only standard scrollbar styling uses `scrollbar-width` / `scrollbar-color` inside `@supports (-moz-appearance: none)`. Chromium and Edge must stay on the `::-webkit-scrollbar*` path so classic arrow buttons are not drawn.
- Ink-tinted text selection.
- Serif link treatment with subtle underline color changes.
- Strong caret color for text inputs.
- Placeholder text using the soft text token at full opacity.

## Do

- Build from tokens before writing page-specific overrides.
- Use `.uzu-app` for new projects and `.uzu-scope` for migrations.
- Use `.uzu-title-pair` for every title and subtitle pair.
- Use `.uzu-text-link` for ordinary page navigation.
- Use page patterns before inventing page-specific layout CSS.
- Prefer borders, surfaces, and spacing over shadows.
- Keep button hover states subtle.
- Keep example pages generic and component-focused.

## Browser Support

Usuzumi targets modern browsers. Minimum requirements:

| Feature | Browsers |
|---------|----------|
| CSS `color-mix()` | Chrome 111+, Firefox 113+, Safari 16.2+ |
| CSS `:has()` | Chrome 105+, Firefox 121+, Safari 15.4+ |
| CSS `:focus-visible` | Chrome 86+, Firefox 85+, Safari 15.4+ |
| CSS Custom Properties | Chrome 49+, Firefox 52+, Safari 10+ |

In older browsers, `color-mix()` falls back to the raw base color (no hover or state tinting), and `:has()`-based parent styling is omitted. The system remains usable but some visual refinements are lost.

## Do Not

- Do not use pure white page backgrounds.
- Do not introduce saturated accent systems.
- Do not use emoji as feature icons.
- Do not use full-pill radius for rectangular buttons.
- Do not use rectangular buttons for ordinary project-list navigation.
- Do not add decorative blobs, orbs, or generic visual metaphors.
- Do not split section labels and headings into distant columns.
- Do not let select option backgrounds touch.
- Do not use card grids for text-first feature explanations when a feature list would scan better.
- Do not duplicate the token block in every page.
