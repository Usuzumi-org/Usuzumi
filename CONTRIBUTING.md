# Contributing

Thank you for improving Mashiro UI. The project is intentionally small, static, and dependency-free at runtime.

## Local Workflow

Open the HTML files directly in a modern browser:

- `mashiro-design-preview.html`
- `example/index.html`
- `example/sked-app.html`

Run the validation checks before opening a pull request:

```bash
npm run validate
```

The validation script checks JavaScript syntax, local asset references, placeholder links, and design-system guardrails.

## Design Rules

- Use the public `msh-*` class API.
- Add reusable styling to `ui/css/` before adding page-specific overrides.
- Keep the minimum visible radius at `4px`.
- Do not use viewport-width font sizing.
- Keep `letter-spacing` at `0`.
- Use `.msh-title-pair` for title and subtitle groups.
- Use `.msh-text-link` for normal navigation and buttons for real commands.
- Keep examples generic enough to work as templates.

## File Responsibilities

- `ui/mashiro.css`: public stylesheet entry.
- `ui/css/tokens.css`: design tokens and themes.
- `ui/css/base.css`: root behavior and browser defaults.
- `ui/css/typography.css`: type hierarchy and title pairs.
- `ui/css/components.css`: component primitives and states.
- `ui/css/layout.css`: page containers and grids.
- `ui/css/patterns.css`: page-level patterns and reusable mockups.
- `ui/css/utilities.css`: small utilities and language helpers.
- `ui/mashiro.js`: dependency-free behavior only.

## Accessibility

Interactive elements must be keyboard reachable, visibly focusable, and understandable without color alone. Form controls need visible labels, and custom controls should expose native roles and state attributes.

## Third-Party Assets

Do not add third-party fonts, images, or icons unless their license allows redistribution. Document any added asset in `THIRD_PARTY_NOTICES.md`.
