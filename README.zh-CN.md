# Usuzumi

[English](README.md) | [更新日志](CHANGELOG.zh-CN.md)

Usuzumi 是一套零构建 CSS 和 JavaScript UI 库，适合个人站点、应用介绍页、文档页面和小型产品工具。你可以直接在 HTML 中加载它，也可以从 npm 引入，或把生成后的 `ui/` 文件放进自己的项目。

## 安装

```bash
npm install usuzumi
```

```js
import "usuzumi/usuzumi.css";
import "usuzumi/usuzumi.js";
```

只有在使用 `.uzu-signature` 时，才需要额外引入签名字体：

```js
import "usuzumi/usuzumi-signature.css";
```

CDN 用法：

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/usuzumi/ui/usuzumi.min.css">
<script src="https://cdn.jsdelivr.net/npm/usuzumi/ui/usuzumi.min.js" defer></script>
```

## 快速开始

当 Usuzumi 接管整个页面时，使用 `uzu-root` 和 `uzu-app`：

```html
<html class="uzu-root" lang="zh-CN" data-theme="light">
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

如果只想在现有页面中局部使用，可以包一层 `uzu-scope`：

```html
<section class="uzu-scope">
  <article class="uzu-card">
    <h3>Scoped component</h3>
    <p>This area adopts Usuzumi without taking over the whole page.</p>
  </article>
</section>
```

## 自定义

Usuzumi 通过已文档化的 `--uzu-*` CSS 自定义属性暴露样式接口，主样式表使用 `@layer usuzumi` 包裹，因此项目 CSS 可以在不提高选择器权重的情况下覆盖它。

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

完整变量列表和组件使用规则见 [DESIGN.md](DESIGN.md)。

## 文档

- [DESIGN.md](DESIGN.md)：组件契约、设计规则、CSS 变量、运行时属性、事件和编写指引。
- [CHANGELOG.zh-CN.md](CHANGELOG.zh-CN.md)：从 2.0.1 开始记录的正式发布更新日志。
- [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md)：内置第三方资源的许可说明。

## 运行时

`usuzumi.js` 无依赖，会在浏览器中自动初始化。它也可以安全地在 SSR 或 Node 环境中 import，动态插入内容后可手动初始化：

```js
window.Usuzumi.init(container);
window.Usuzumi.destroy(container);
```

运行时 data attribute 和自定义事件细节见 [DESIGN.md](DESIGN.md)。

## 包含内容

- 面向页面、章节、卡片、布局、表单、导航、反馈、浮层、数据视图、编辑器外壳和状态界面的主题化 CSS 原语。
- 无框架、无运行时依赖的可选 JavaScript 交互。
- 热力图通过 `data-uzu-heatmap` 支持紧凑日期数据、可点击格子和内置事件详情。
- 面向 npm 和 CDN 使用的生成版 CSS / JS bundle。
- 浏览器 API 和自定义事件的类型声明。
- 响应式顶部栏可通过 `data-uzu-topbar-overflow` 把溢出的导航链接折入公共“更多”菜单。
- 侧边导航区分普通应用侧栏 `.uzu-sidebar-nav` 和同页面板索引 `.uzu-panel-index`。

## 站点与示例

- [文档站仓库](https://github.com/Usuzumi-org/Usuzumi-site)
- [UI 库仓库](https://github.com/Usuzumi-org/Usuzumi)

官网、组件目录、编辑器接入页和更大的示例放在站点仓库中，避免文档专用需求进入 UI 库本体。

## 开发

```bash
npm run build
npm run validate
```

源文件在 `ui/css/` 和 `ui/js/`。公开入口 `ui/usuzumi.css`、`ui/usuzumi.js`、`ui/usuzumi.min.css`、`ui/usuzumi.min.js` 是生成文件，请修改源文件后重新构建，不要手改。

`npm run validate` 会检查生成文件同步、源码约束、package exports、浏览器行为和组件页冒烟覆盖。

## 浏览器支持

Usuzumi 面向支持 CSS 自定义属性、`color-mix()`、`:has()` 和 `:focus-visible` 的现代浏览器。更旧的浏览器仍可使用，但部分视觉细节会退化。

## 许可

Usuzumi 代码使用 [MIT License](LICENSE) 发布。

内置的 Meddon 字体按其自身的 SIL Open Font License 条款再分发，详见 [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md)。
