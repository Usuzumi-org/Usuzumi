# Mashiro UI

[中文](README.md)

Mashiro UI is a zero-build web design system for quiet editorial interfaces, personal homepages, app introduction pages, documentation pages, and small product tools.

It is built around a soft monochrome paper atmosphere: warm gray surfaces, charcoal ink, Georgia-based serif typography, low-contrast borders, restrained motion, and reusable `msh-*` HTML/CSS/JS primitives.

## Preview

Open these files directly in a browser:

- [Design system catalog](mashiro-design-preview.html)
- [Personal homepage example](example/index.html)
- [App introduction example](example/sked-app.html)

No build step or development server is required.

## Quick Start

Link the bundled CSS and JavaScript:

```html
<link rel="stylesheet" href="ui/mashiro.css">
<script src="ui/mashiro.js" defer></script>
```

For a full Mashiro page:

```html
<!doctype html>
<html class="msh-root" lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="stylesheet" href="ui/mashiro.css">
  <script src="ui/mashiro.js" defer></script>
</head>
<body class="msh-app" data-theme="light">
  <main class="msh-page">
    <section class="msh-section">
      <div class="msh-section-head">
        <p class="msh-section-label">Overview</p>
        <h1 class="msh-page-title">A quiet interface starts with good rhythm.</h1>
      </div>
    </section>
  </main>
</body>
</html>
```

For incremental migration inside an existing site:

```html
<section class="msh-scope">
  <article class="msh-card">
    <div class="msh-title-pair">
      <h3>Scoped component</h3>
      <p>This area adopts Mashiro UI without taking over the whole page.</p>
    </div>
  </article>
</section>
```

## What Is Included

- Design tokens for color, radius, typography, motion, borders, and dark mode.
- Layout primitives such as pages, sections, grids, top bars, hero splits, and footers.
- Components for buttons, text links, cards, fields, selects, tabs, segmented controls, badges, alerts, tables, overlays, and progress.
- Page patterns for personal homepages, app introduction pages, design catalogs, project lists, mockups, feature lists, and screen cards.
- Small framework-free JavaScript for theme toggles, language toggles, and custom select behavior.
- Examples that use only the public UI library.

## Repository Structure

```text
.
├── CHANGELOG.md
├── CONTRIBUTING.md
├── DESIGN.md
├── LICENSE
├── README.md
├── README.en.md
├── THIRD_PARTY_NOTICES.md
├── mashiro-design-preview.html
├── package.json
├── example/
│   ├── index.html
│   └── sked-app.html
├── scripts/
│   └── validate.mjs
└── ui/
    ├── mashiro.css
    ├── mashiro.js
    ├── assets/
    │   └── Meddon-Regular.ttf
    └── css/
        ├── tokens.css
        ├── base.css
        ├── typography.css
        ├── components.css
        ├── layout.css
        ├── patterns.css
        └── utilities.css
```

Use `ui/mashiro.css` as the public stylesheet entry. It imports the source CSS files in `ui/css/`.

## Validation

The runtime library has no dependencies. The repository includes one optional Node-based validation command for maintainers:

```bash
npm run validate
```

It checks JavaScript syntax, local file references, placeholder links, and design-system guardrails such as minimum radius, font sizing, and letter spacing.

## Design Principles

- Use paper-gray backgrounds instead of pure white.
- Use charcoal ink instead of pure black.
- Build hierarchy with spacing, borders, and type scale rather than heavy shadows or saturated color.
- Keep the minimum visible radius at `4px`.
- Use rectangular buttons for real actions and `.msh-text-link` for ordinary navigation.
- Use `.msh-title-pair` for title and subtitle rhythm.
- Keep page templates generic and reusable.

See [DESIGN.md](DESIGN.md) for the full specification.

## JavaScript Behaviors

`ui/mashiro.js` is intentionally small and dependency-free.

It supports:

- `[data-msh-theme-toggle]`
- `[data-msh-language-toggle]`
- `[data-msh-select]`

The script can target either the document root or a scoped element through target attributes such as `data-msh-theme-target`.

## Browser Notes

Mashiro UI uses modern CSS features such as CSS custom properties, `color-mix()`, `:focus-visible`, and WebKit scrollbar pseudo-elements. It is intended for modern browsers.

## License

Mashiro UI code is released under the [MIT License](LICENSE).

The bundled Meddon font is redistributed under its own SIL Open Font License terms. See [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md) before replacing, modifying, or redistributing bundled assets.
