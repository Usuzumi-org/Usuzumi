# Usuzumi

[English](README.md)

Usuzumi 是一套零构建网页设计系统，适用于安静、克制的编辑型界面、个人页面、应用介绍页、文档页面和小型产品工具。

它提供 `uzu-*` CSS 原语、柔和的单色视觉语言，以及少量无依赖 JavaScript，用于常见 UI 行为。

## 安装

```bash
npm install usuzumi
```

```js
import "usuzumi/usuzumi.css";
import "usuzumi/usuzumi.js";
```

也可以直接引入文件：

```html
<link rel="stylesheet" href="ui/usuzumi.css">
<script src="ui/usuzumi.js" defer></script>
```

## 使用

完整页面可以使用 `uzu-root` 和 `uzu-app`：

```html
<html class="uzu-root" lang="zh-CN" data-theme="light">
  <body class="uzu-app">
    <main class="uzu-page">
      <section class="uzu-section">
        <div class="uzu-section-head">
          <p class="uzu-section-label">Overview</p>
          <h1 class="uzu-page-title">A quiet interface starts with good rhythm.</h1>
        </div>
        <button class="uzu-button uzu-button-primary">Continue</button>
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

## 包含内容

- 颜色、字体、间距、边框、圆角、动效和暗色模式等设计 token。
- 页面、章节、网格、按钮、卡片、表单、标签页、徽章、提示、表格、浮层和进度等布局与组件原语。
- 个人主页、应用介绍页、设计目录、项目列表、产品 mockup 和功能区块等页面模式。
- 主题切换、语言切换、自定义 select 和 switch 等小型 JavaScript 行为。

## 示例

- [设计系统目录](https://github.com/Mashiro0619/Usuzumi/blob/main/example/preview.html)
- [个人主页示例](https://github.com/Mashiro0619/Usuzumi/blob/main/example/index.html)
- [应用介绍页示例](https://github.com/Mashiro0619/Usuzumi/blob/main/example/app-introduction.html)

示例文件可以直接在浏览器中打开，不需要构建步骤或开发服务器。

## 维护

```bash
npm run validate
```

运行时库没有依赖。完整设计规范见 [DESIGN.md](DESIGN.md)。

## 许可证

Usuzumi 代码使用 [MIT License](LICENSE) 发布。

内置的 Meddon 字体按其自身的 SIL Open Font License 条款再分发，详见 [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md)。
