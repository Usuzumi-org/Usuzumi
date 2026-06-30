# Changelog

[中文](CHANGELOG.zh-CN.md)

All notable changes to Usuzumi are recorded here.

## Unreleased

### Added

- Added responsive cover card variants, auto grids, language URL routing, and topbar current-state support for overflow navigation.

## 2.2.1 - 2026-06-23

### Changed

- Refined Heatmap layout, legend placement, and selected-date details for a calmer component preview.

### Fixed

- Fixed Image Viewer default fitting so opened images stay fully inside the viewport.

## 2.2.0 - 2026-06-21

### Added

- Added public Gallery and Image Viewer components for progressive image collections, JSON or directory sources, and focused preview controls.

### Changed

- Replaced the bundled third-party syntax highlighter with a Usuzumi-owned lightweight tokenizer engine.
- Repositioned editor documentation around the self-owned Markdown Editor and retired the generic editor bridge concept.
- Refined Image Viewer into a full-screen focused preview layout.

### Fixed

- Kept `.uzu-signature` identity text on one line at narrow viewport widths.

## 2.1.0 - 2026-06-18

### Added

- Added interactive `.uzu-heatmap` date heatmaps with compact tuple data, clickable day cells, built-in details, and selection events.
- Added split runtime entries with `usuzumi-core.js`, `usuzumi-highlight.js`, and `data-uzu-code-highlight="visible"` for lighter pages and deferred syntax highlighting.

## 2.0.5 - 2026-06-18

### Added

- Added `.uzu-panel-index*` classes and `data-uzu-panel-index` as the recommended same-page panel catalog interface, while keeping `.uzu-panel-nav*` compatible.

### Changed

- Improved component catalog readability by consistently separating live demos from usage notes.

### Fixed

- Added the missing TypeScript event detail for `uzu-sidebar-layout-change`.

## 2.0.4 - 2026-06-18

### Changed

- Added responsive topbar overflow menus that keep the brand and page actions visible while moving trailing navigation links into a More menu.

## 2.0.3 - 2026-06-17

### Added

- Added page-level error layout primitives, parameterized error page runtime support, and a static site 404 page.

## 2.0.2 - 2026-06-17

### Changed

- Refined collapsible sidebar layouts with a topbar-leading toggle slot, smoother desktop transitions, and mobile dropdown behavior.

## 2.0.1 - 2026-06-17

### Added

- Added the `.uzu-card-cover` card primitive for flush cover media and padded card body layouts, with matching structure classes and cover variables.
