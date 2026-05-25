# Mashiro UI Design System

Mashiro UI is a professional, zero-build web design system for quiet editorial interfaces, personal sites, app introduction pages, documentation pages, and small product tools. It is built around a soft monochrome paper atmosphere: warm gray surfaces, charcoal ink, serif typography, low-contrast borders, restrained motion, and a small set of reusable HTML/CSS/JS primitives.

The system has two goals:

- New web projects can adopt the full visual language by adding `class="msh-app"` and linking the UI library.
- Existing web projects can migrate safely by wrapping selected areas in `.msh-scope` or using `.msh-*` component classes incrementally.

## Library Files

Use the single entry files in normal pages:

```html
<link rel="stylesheet" href="ui/mashiro.css">
<script src="ui/mashiro.js" defer></script>
```

The entry CSS imports the maintainable source files:

- `ui/css/tokens.css`: design tokens, dark mode tokens, font face.
- `ui/css/base.css`: root behavior, focus, selection, scrollbar, forms, links.
- `ui/css/typography.css`: signature, titles, section labels, title pairs.
- `ui/css/components.css`: buttons, cards, fields, select, tabs, feedback, tables, overlays, progress.
- `ui/css/layout.css`: page containers, sections, top bars, grids, hero split, footer.
- `ui/css/patterns.css`: homepage, app intro, catalog, mockups, token specimens.
- `ui/css/utilities.css`: small utilities and language visibility helpers.
- `ui/mashiro.js`: theme toggles, language toggles, custom select behavior.

## Adoption Modes

### Full Application

Use this for new pages where Mashiro UI owns the design surface.

```html
<html class="msh-root" lang="en">
<body class="msh-app" data-theme="light">
  ...
</body>
</html>
```

`ui/mashiro.js` also adds `msh-root` automatically when it detects `body.msh-app`, but adding the class in markup gives the viewport scrollbar styling an immediate CSS hook before JavaScript runs.

### Scoped Migration

Use this for existing projects where only one area should adopt the system.

```html
<section class="msh-scope">
  ...
</section>
```

### Component Class API

All public component classes use the `msh-` prefix. Do not rely on internal file names or implementation details. Use stable classes such as:

- `.msh-button`, `.msh-button-primary`, `.msh-button-ghost`, `.msh-button-danger`
- `.msh-text-link`
- `.msh-icon-button`, `.msh-theme-toggle`, `.msh-floating-controls`
- `.msh-card`, `.msh-card-muted`, `.msh-title-pair`
- `.msh-field`, `.msh-label`, `.msh-input`, `.msh-textarea`, `.msh-select`
- `.msh-tabs`, `.msh-tab`, `.msh-segmented`, `.msh-segment`
- `.msh-badge`, `.msh-alert`, `.msh-table`, `.msh-popover`, `.msh-modal`
- `.msh-progress`, `.msh-progress-bar`, `.msh-progress-circular`
- `.msh-page`, `.msh-section`, `.msh-section-head`, `.msh-grid`, `.msh-hero-split`
- `.msh-home-hero`, `.msh-home-summary`, `.msh-project-list`, `.msh-project-row`, `.msh-project-preview`
- `.msh-app-preview`, `.msh-download-actions`, `.msh-feature-list`, `.msh-feature-item`, `.msh-screen-grid`, `.msh-screen-card`

## Visual Principles

Mashiro UI should feel like a carefully typeset independent publication that can also support real application controls. It is not stark black and white minimalism, not beige notebook UI, and not a colorful SaaS dashboard.

- Use `#f4f3f0` as the default paper-gray page foundation.
- Use `#20201e` and `#333331` instead of pure black.
- Use `#fbfaf7`, `#efeee9`, `#ebeae6`, and `#e7e6e1` for layered surfaces.
- Use thin borders and spacing for hierarchy. Standard cards do not float.
- Use Georgia-based serif typography for almost everything.
- Use `Meddon Custom` only for signature identity marks.
- Keep rectangular buttons at 7px radius.
- Keep the minimum visible radius at 4px.
- Keep motion quiet: no page entrances, no bouncy easing, no parallax.
- Avoid saturated accent systems, emoji decoration, heavy shadows, glass panels, and decorative blobs.

## Tokens

### Core Color Roles

| Role | Token | Hex | Use |
|------|-------|-----|-----|
| Paper Gray | `--msh-bg` | `#f4f3f0` | Page background |
| Surface | `--msh-surface` | `#fbfaf7` | Cards, panels, popovers |
| Soft Surface | `--msh-surface-soft` | `#efeee9` | Inputs, secondary cards |
| Muted Surface | `--msh-surface-muted` | `#ebeae6` | Preview blocks, nested panels |
| Inset Surface | `--msh-surface-inset` | `#e7e6e1` | Recessed UI areas |
| Strong Ink | `--msh-fg-strong` | `#20201e` | Titles, active states |
| Body Ink | `--msh-fg` | `#333331` | Body text |
| Muted Text | `--msh-muted` | `#686866` | Descriptions, metadata |
| Soft Text | `--msh-soft` | `#999995` | Captions, section labels |
| Default Border | `--msh-border` | `#dad9d5` | Cards, controls, dividers |
| Soft Border | `--msh-border-soft` | `#e5e4e0` | Internal dividers |
| Strong Border | `--msh-border-strong` | `#aaa9a2` | Focus and hover support |
| Primary Action | `--msh-action-bg` | `#2f2f2c` | Filled primary action |
| Action Text | `--msh-action-fg` | `#f7f6f1` | Text on charcoal action |

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

Allowed transitions are limited to `transform`, `color`, `background`, `border-color`, `opacity`, `text-decoration-color`, and occasional overlay `box-shadow`. Hover translation must not exceed `translateY(-1px)`.

## Typography

| Role | Class | Size | Line Height | Notes |
|------|-------|------|-------------|-------|
| Signature | `.msh-signature` | 124px desktop, 76px mobile, 42px ultra-narrow | 1.05 to 1.18 | Uses `Meddon Custom` only |
| Hero Title | `.msh-hero-title` | 132px desktop, 82px mobile | 0.86 | Product or offer name |
| Page Title | `.msh-page-title` | 56px desktop, 40px mobile | 1.02 | Documentation or catalog title |
| Section Title | `.msh-section-title` | 44px desktop, 34px mobile | 1.08 | Major content sections |
| Body Large | `.msh-body-large` | 18px | 1.65 | Hero copy and intros |
| Body | `.msh-text` | 15px | 1.7 | Standard reading text |
| Card Title Pair | `.msh-title-pair` | 18px + 13px | 1.25 + 1.55 | Fixed 6px gap |

Letter spacing is 0 by default. Section labels may be uppercase, but they should remain quiet and compact.

## Components

### Buttons

Buttons are tactile but calm. Use one primary button per decision area. Rectangular buttons use 7px radius and 13px labels. Icon-label spacing is 7px.

```html
<a class="msh-button msh-button-primary" href="#">Primary</a>
<button class="msh-button" type="button">Default</button>
<button class="msh-button msh-button-ghost" type="button">Ghost</button>
<button class="msh-button msh-button-danger" type="button">Danger</button>
```

Use `.msh-text-link` for low-pressure navigation such as opening a project, viewing a page, or moving to documentation. Do not turn every page link into a rectangular button. Buttons are for explicit actions: download, submit, confirm, save, delete, or start.

### Cards

Cards use surfaces, borders, and spacing. They do not use default shadows.

```html
<article class="msh-card">
  <div class="msh-title-pair">
    <h3>Card title</h3>
    <p>Muted description with fixed rhythm.</p>
  </div>
</article>
```

Cards are for repeated bounded objects, compact summaries, controls, static overlay content, and screen thumbnails. Do not use cards as the default wrapper for every section. If the content is primarily a list of projects or feature explanations, use the relevant page pattern instead of a card grid.

### Forms

Fields must have real labels. Placeholders are hints, not labels.

```html
<label class="msh-field">
  <span class="msh-label">Project name</span>
  <input class="msh-input" placeholder="Untitled">
</label>
```

Custom selects use `.msh-select` plus `data-msh-select`. Options keep a 4px vertical gap, so selected and hovered states never touch.

### Navigation

Top navigation uses `.msh-topbar` and `.msh-nav`. Use `.msh-tabs` for peer sections and `.msh-segmented` for compact mode switches.

### Feedback

Badges, alerts, and validation use the muted semantic families. Do not use bright red or color alone to communicate state.

### Data

Tables use `.msh-table-wrap` and `.msh-table`. Horizontal scrolling is acceptable on narrow screens. `.msh-table-wrap` receives the same 6px system scrollbar treatment as `.msh-scroll`; do not add local scrollbar overrides. Do not shrink table text below 12px.

### Overlays

Use `.msh-popover` and `.msh-modal` for static overlay surfaces. Overlay shadows are allowed, but standard cards should remain flat.

### Progress

Linear progress uses `.msh-progress` and `.msh-progress-bar`. Circular progress uses `.msh-progress-circular` with SVG rings.

## JavaScript Behaviors

`ui/mashiro.js` is intentionally small and framework-free.

### Theme Toggle

```html
<button class="msh-icon-button msh-theme-toggle" data-msh-theme-toggle data-msh-theme-key="site-theme">
  ...
</button>
```

The script toggles `data-theme` and `data-msh-theme` on the target root. Use `data-msh-theme-target` to target a scoped element. If omitted, the document root is used. Toggle icon state is synchronized through `.is-dark`, so scoped toggles do not inherit the visual state of an unrelated dark ancestor.

### Language Toggle

```html
<button class="msh-icon-button msh-language-toggle" data-msh-language-toggle>EN</button>
```

The script toggles `data-language` and `data-msh-lang`. Content can be marked with `data-lang="zh"` and `data-lang="en"`.

### Custom Select

```html
<div class="msh-select" data-msh-select>
  <button class="msh-select-trigger" data-msh-select-trigger aria-expanded="false">Balanced</button>
  <div class="msh-select-menu" role="listbox">
    <div class="msh-select-option is-selected" data-msh-select-option role="option">Balanced</div>
  </div>
</div>
```

The script supports click to open, click outside to close, Escape to close, ArrowUp/ArrowDown/Home/End navigation, Enter/Space selection, and option selection.

## Page Patterns

### Personal Homepage

Use `.msh-home-hero` with a large left-aligned `.msh-signature`, optional `.msh-home-summary`, a project index, and a compact footer. Do not add an avatar, generic biography block, skills grid, or blog unless the project specifically needs them.

Use this structure for project rows:

```html
<div class="msh-project-list">
  <article class="msh-project-row">
    <div class="msh-project-media">
      <div class="msh-project-preview msh-project-preview-app" aria-label="Project preview"></div>
    </div>
    <div class="msh-project-copy">
      <div class="msh-title-pair">
        <h3>Project title</h3>
        <p>Short role, scope, or outcome.</p>
      </div>
    </div>
    <a class="msh-text-link msh-project-action" href="#">View page</a>
  </article>
</div>
```

Homepage project rows should read like an index, not like a dashboard. Use text links for project navigation. Use buttons only when the project row itself performs an action such as download or submit.

### App Introduction Page

Use a top bar, a hero with product name and short copy, download actions near the hero, a quiet product mockup, feature sections, screen sections, and optional bilingual content.

Use `.msh-hero-split` with `.msh-app-hero-copy`, `.msh-product-meta`, `.msh-download-actions`, and `.msh-app-preview`. Download actions may be buttons because they are explicit actions. Keep icon labels short enough to fit at mobile widths.

Use `.msh-feature-list` and `.msh-feature-item` for explanatory product features. A feature list is preferred over three identical cards when the content is mostly text and needs editorial rhythm.

Use `.msh-screen-grid` and `.msh-screen-card` for screen previews. Screen cards may contain simulated interface art or real screenshots. The thumbnail, title, and subtitle must use stable spacing and should not rely on browser-default paragraph margins.

Use `.msh-title-pair` for every title and subtitle pair inside feature items, project rows, cards, mockups, and screen cards. Do not hand-place headings and paragraphs with ad hoc margins.

### Design Catalog Page

Use the catalog page to show the complete system surface: colors, typography, buttons, cards, forms, navigation, feedback, data, overlays, layout, spacing, radius, elevation, motion, focus, accessibility, system defaults, controls, and progress.

The catalog page should demonstrate generic system primitives only. It must not include specific product names or project-branded language except for the design-system identity itself.

### Choosing The Right Surface

Use sections for major page bands. Use cards for individual repeated objects. Use lists for editorial indexes and text-first explanations. Use previews only when a visual artifact is being represented. Do not nest cards inside cards.

Action hierarchy:

- Primary button: one main action in a decision area.
- Default button: secondary action with real command weight.
- Ghost button: utility action inside a dense control area.
- Text link: navigation to another page, project, document, or external reference.
- Icon button: compact tool action with an accessible label.

Example pages in `example/` are canonical usage examples for the UI library. If a new template needs local CSS to fix spacing, hierarchy, title/subtitle rhythm, or responsive behavior, first consider whether the missing rule belongs in `ui/css/patterns.css`, `ui/css/layout.css`, or `ui/css/components.css`.

## Accessibility

- Use `:focus-visible` rings from the system. Never remove outlines without replacement.
- Every interactive element must be reachable by keyboard.
- Color must not be the only meaning channel.
- Forms need visible labels.
- Theme and language toggles must remain focusable.
- Respect `prefers-reduced-motion`.
- Respect `forced-colors` where possible.
- Soft borders are aesthetic and not sufficient as the only interactive affordance.

## System Defaults

Mashiro UI defines:

- 6px scrollbars with hidden WebKit arrow buttons for the root viewport, `.msh-scroll`, `.msh-table-wrap`, and `.msh-catalog-body`.
- Paper-toned scrollbar thumbs.
- Ink-tinted text selection.
- Serif link treatment with subtle underline color changes.
- Strong caret color for text inputs.
- Placeholder text using the soft text token at full opacity.

## Do

- Build from tokens before writing page-specific overrides.
- Use `.msh-app` for new projects and `.msh-scope` for migrations.
- Use `.msh-title-pair` for every title and subtitle pair.
- Use `.msh-text-link` for ordinary page navigation.
- Use page patterns before inventing page-specific layout CSS.
- Prefer borders, surfaces, and spacing over shadows.
- Keep button hover states subtle.
- Keep preview pages generic and component-focused.

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
