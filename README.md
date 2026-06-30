# Usuzumi

[中文](README.zh-CN.md) | [Changelog](CHANGELOG.md)

Usuzumi is a zero-build CSS and JavaScript UI library for personal sites, app introduction pages, documentation, and small product tools. Load it directly in HTML, import it from npm, or serve the generated `ui/` files from your own project.

## Install

```bash
npm install usuzumi
```

```js
import "usuzumi/usuzumi.css";
import "usuzumi/usuzumi.js";
```

Load the optional signature font only when using `.uzu-signature`:

```js
import "usuzumi/usuzumi-signature.css";
```

CDN usage:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/usuzumi/ui/usuzumi.min.css">
<script src="https://cdn.jsdelivr.net/npm/usuzumi/ui/usuzumi.min.js" defer></script>
```

## Quick Start

Use `uzu-root` and `uzu-app` when Usuzumi owns the whole page:

```html
<html class="uzu-root" lang="en" data-theme="light">
  <body class="uzu-app">
    <main class="uzu-page">
      <section class="uzu-section">
        <div class="uzu-section-head">
          <p class="uzu-section-label">Overview</p>
          <h1 class="uzu-page-title">Project notes</h1>
        </div>
        <button class="uzu-button uzu-button-primary" type="button">Continue</button>
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

Usuzumi exposes documented `--uzu-*` CSS custom properties and wraps the main stylesheet in `@layer usuzumi`, so project CSS can override it without high selector specificity.

```css
:root {
  --uzu-radius-standard: 10px;
  --uzu-motion-base: 220ms;
}

.settings-panel {
  --uzu-card-block-gap: 16px;
  --uzu-field-gap: 8px;
}
```

See [DESIGN.md](DESIGN.md) for the complete variable list and component guidance.

## Documentation

- [DESIGN.md](DESIGN.md): component contracts, design rules, CSS variables, runtime attributes, events, and authoring guidance.
- [CHANGELOG.md](CHANGELOG.md): release notes from version 2.0.1 onward.
- [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md): bundled third-party license notices.

## Runtime

`usuzumi.js` is dependency-free and auto-initializes in browsers. It is safe to import in SSR or Node contexts, and dynamic content can be initialized manually:

```js
window.Usuzumi.init(container);
window.Usuzumi.destroy(container);
```

Use `usuzumi-lite.js` for simple landing, navigation, and error pages. Use `usuzumi-core.js` for component pages that do not need syntax highlighting. Code-heavy pages can pair core with `usuzumi-highlight.js`, and set `data-uzu-code-highlight="visible"` to defer highlighting until code blocks approach the viewport. Add `data-uzu-init="manual"` to `html` or `body` when application code should call `window.Usuzumi.init()` itself.

See [DESIGN.md](DESIGN.md) for runtime data attributes and custom events.

## Included

- Themeable CSS primitives for pages, sections, cards, layout, forms, navigation, feedback, overlays, data views, Markdown editing, and status states.
- Optional JavaScript behavior for common UI interactions without framework or runtime dependencies.
- Heatmaps support compact day-value data, clickable cells, and built-in event details with `data-uzu-heatmap`.
- Gallery and Image Viewer components support progressive image links, JSON or directory sources, and focused preview controls.
- Cover cards and auto grids support responsive project, tool, and drawn-cover layouts without custom breakpoints.
- Responsive topbars can move trailing navigation links into a public "More" menu with `data-uzu-topbar-overflow`, while preserving current-link state.
- Language selectors can optionally map choices to URLs for multilingual site routing.
- Side navigation distinguishes app sidebars with `.uzu-sidebar-nav` from same-page panel indexes with `.uzu-panel-index`.
- Optional lite, core, and syntax-highlight runtime entries for lighter pages.
- Generated CSS and JS bundles for npm and CDN consumers.
- Type declarations for the browser API and custom events.

## Site And Examples

- [Documentation site repository](https://github.com/Usuzumi-org/Usuzumi-site)
- [UI library repository](https://github.com/Usuzumi-org/Usuzumi)

The homepage, component catalog, Markdown editor page, and larger examples live in the site repository so documentation-only needs do not become library dependencies.

## Development

```bash
npm run build
npm run validate
```

Edit source partials in `ui/css/` and `ui/js/`. The public entry files in `ui/`, including the full, lite, core, and syntax-highlight bundles, are generated, so rebuild them instead of editing them by hand.

`npm run validate` checks generated bundle sync, source guardrails, package exports, browser behavior, and component page smoke coverage.

## Browser Support

Usuzumi targets modern browsers with CSS custom properties, `color-mix()`, `:has()`, and `:focus-visible`. Older browsers remain usable with fewer visual refinements.

## License

Usuzumi code is released under the [MIT License](LICENSE).

The bundled Meddon font is redistributed under its own SIL Open Font License terms. See [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).
