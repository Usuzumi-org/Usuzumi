# Mashiro UI

[English](README.en.md)

Mashiro UI 是一套零构建网页设计系统，适用于安静、克制的编辑型界面、个人主页、应用介绍页、文档页面和小型产品工具。

它围绕柔和的单色纸面气质构建：暖灰背景、炭黑文字、Georgia 系衬线字体、低对比边框、克制动效，以及可复用的 `msh-*` HTML/CSS/JS 原语。

## 预览

这些文件可以直接在浏览器中打开：

- [设计系统目录](mashiro-design-preview.html)
- [个人主页示例](example/index.html)
- [应用介绍页示例](example/sked-app.html)

不需要构建步骤，也不需要启动开发服务器。

## 快速开始

引入打包入口 CSS 和 JavaScript：

```html
<link rel="stylesheet" href="ui/mashiro.css">
<script src="ui/mashiro.js" defer></script>
```

用于一个完整的 Mashiro 页面：

```html
<!doctype html>
<html class="msh-root" lang="zh-CN">
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

用于现有项目中的局部迁移：

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

## 包含内容

- 颜色、圆角、字体、动效、边框、暗色模式等设计 token。
- 页面、章节、网格、顶部栏、hero split、页脚等布局原语。
- 按钮、文本链接、卡片、字段、选择器、标签页、分段控件、徽章、提示、表格、浮层和进度组件。
- 个人主页、应用介绍页、设计目录、项目列表、产品 mockup、功能列表和屏幕卡片等页面模式。
- 无框架 JavaScript，用于主题切换、语言切换和自定义 select 行为。
- 只使用公共 UI 库的示例页面。

## 仓库结构

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

`ui/mashiro.css` 是公共样式入口，它会导入 `ui/css/` 下的可维护源码文件。

## 维护校验

运行时库没有依赖。维护者可以使用这个可选的 Node 校验命令：

```bash
npm run validate
```

它会检查 JavaScript 语法、本地文件引用、占位链接，以及最低圆角、字体尺寸、字距等设计系统约束。

## 设计原则

- 使用纸感暖灰背景，而不是纯白。
- 使用炭黑文字，而不是纯黑。
- 用间距、边框和字体层级建立结构，避免依赖重阴影或高饱和色。
- 可见圆角最低为 `4px`。
- 真正的命令使用矩形按钮，普通导航使用 `.msh-text-link`。
- 标题和副标题组合使用 `.msh-title-pair`。
- 示例页面保持通用、可复用，避免和具体项目强绑定。

完整规范见 [DESIGN.md](DESIGN.md)。

## JavaScript 行为

`ui/mashiro.js` 保持小型、无依赖。

它支持：

- `[data-msh-theme-toggle]`
- `[data-msh-language-toggle]`
- `[data-msh-select]`

脚本可以作用于文档根节点，也可以通过 `data-msh-theme-target` 等 target 属性作用于局部作用域。

## 浏览器说明

Mashiro UI 使用 CSS custom properties、`color-mix()`、`:focus-visible` 和 WebKit scrollbar pseudo-elements 等现代 CSS 能力，面向现代浏览器。

## 许可证

Mashiro UI 代码使用 [MIT License](LICENSE) 发布。

内置的 Meddon 字体按其自身的 SIL Open Font License 条款再分发。替换、修改或再分发内置资产前，请查看 [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md)。
