# Usuzumi

[English](README.md)

Usuzumi 是一套可以直接引入的 CSS 和 JavaScript 组件库，适合个人页面、应用介绍页、文档页面和小型产品工具。

它提供 `uzu-*` 类名、可覆盖的 CSS 变量、可选的签名字体，以及一组无依赖脚本，用来处理主题、语言、标签页、分页、选择器、弹窗等交互。

## 安装

```bash
npm install usuzumi
```

```js
import "usuzumi/usuzumi.css";
import "usuzumi/usuzumi.js";
```

只有在使用 `.uzu-signature` 或签名字体样张时，才需要额外引入：

```js
import "usuzumi/usuzumi-signature.css";
```

CDN 用法：

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/usuzumi/ui/usuzumi.min.css">
<script src="https://cdn.jsdelivr.net/npm/usuzumi/ui/usuzumi.min.js" defer></script>
```

如果页面会记住暗色或自动主题，请在加载样式表之前先写入主题属性，这样首屏会直接使用正确颜色。需要从 localStorage 读取时，在根元素上设置 `data-uzu-theme-key`：

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

## 使用

完整页面可以使用 `uzu-root` 和 `uzu-app`：

```html
<html class="uzu-root" lang="zh-CN" data-theme="light">
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

如果只想在现有页面中局部使用，可以包一层 `uzu-scope`：

```html
<section class="uzu-scope">
  <article class="uzu-card">
    <h3>Scoped component</h3>
    <p>This area adopts Usuzumi without taking over the whole page.</p>
  </article>
</section>
```

## 自定义样式接口

Usuzumi 通过 CSS 自定义属性提供样式接口。项目应优先在 `:root`、`.uzu-app`、`.uzu-scope` 或局部容器上覆盖已文档化的 `--uzu-*` 变量，而不是直接覆盖组件内部选择器。

生成后的主样式表使用 `@layer usuzumi` 包裹，因此项目自己的普通 CSS 可以更容易覆盖库规则。

全局调整：

```css
:root {
  --uzu-radius-standard: 10px;
  --uzu-motion-base: 220ms;
}
```

局部调整：

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

单个实例也可以直接设置变量：

```html
<article class="uzu-toast" style="--uzu-toast-width: 420px; --uzu-toast-content-end-offset: 8px">
  ...
</article>
```

已文档化的变量覆盖颜色角色、圆角、间距、动效、页面宽度、卡片标题节奏、表单字段间距、反馈卡片尺寸与颜色、Toast 尺寸和 Disclosure 内容边距。
`--uzu-space-*` 主要用于布局原语和项目级间距；组件内部节奏使用更具体的变量，例如 `--uzu-card-block-gap`、`--uzu-field-gap`、`--uzu-toast-inline-padding`。

| 变量 | 默认值 | 作用范围 | 建议设置位置 |
| --- | --- | --- | --- |
| `--uzu-page-max-width` | `1120px` | `.uzu-page` 宽度 | `.uzu-app`、`.uzu-scope`、局部页面 |
| `--uzu-page-narrow-max-width` | `960px` | `.uzu-page-narrow` 宽度 | `.uzu-app`、`.uzu-scope`、局部页面 |
| `--uzu-card-title-size` | `18px` | `.uzu-title-pair` 标题 | `.uzu-app`、`.uzu-scope`、局部卡片 |
| `--uzu-card-title-line` | `1.25` | `.uzu-title-pair` 标题行高 | `.uzu-app`、`.uzu-scope`、局部卡片 |
| `--uzu-card-subtitle-size` | `13px` | `.uzu-title-pair` 说明文字 | `.uzu-app`、`.uzu-scope`、局部卡片 |
| `--uzu-card-subtitle-line` | `1.55` | `.uzu-title-pair` 说明文字行高 | `.uzu-app`、`.uzu-scope`、局部卡片 |
| `--uzu-card-title-gap` | `6px` | 标题和说明之间的距离 | `.uzu-app`、`.uzu-scope`、局部卡片 |
| `--uzu-card-block-gap` | `12px` | 卡片内重复内容间距 | `.uzu-app`、`.uzu-scope`、局部卡片 |
| `--uzu-field-gap` | `5px` | label、输入框、帮助文字间距 | `.uzu-app`、`.uzu-scope`、局部表单 |
| `--uzu-alert-max-width` | `520px` | Alert 最大宽度 | 局部 Alert 或外层容器 |
| `--uzu-alert-border-color` | `var(--uzu-border)` | Alert 边框 | 局部 Alert 或外层容器 |
| `--uzu-alert-accent-color` | `var(--uzu-border-strong)` | Alert 左侧强调线 | 局部 Alert 或外层容器 |
| `--uzu-alert-bg` | `var(--uzu-surface)` | Alert 背景 | 局部 Alert 或外层容器 |
| `--uzu-alert-title-color` | `var(--uzu-fg-strong)` | Alert 标题 | 局部 Alert 或外层容器 |
| `--uzu-alert-text-color` | `var(--uzu-muted)` | Alert 正文 | 局部 Alert 或外层容器 |
| `--uzu-callout-border-color` | `var(--uzu-border)` | Callout 边框 | 局部 Callout 或外层容器 |
| `--uzu-callout-bg` | 混合弱化表面色 | Callout 背景 | 局部 Callout 或外层容器 |
| `--uzu-callout-title-color` | `var(--uzu-fg-strong)` | Callout 标题 | 局部 Callout 或外层容器 |
| `--uzu-callout-text-color` | `var(--uzu-muted)` | Callout 正文 | 局部 Callout 或外层容器 |
| `--uzu-toast-width` | `360px` | Toast 宽度 | 局部 Toast 或 Toast stack |
| `--uzu-toast-inline-padding` | `16px` | Toast 左右内边距 | 局部 Toast 或 Toast stack |
| `--uzu-toast-content-end-offset` | `0px` | Toast 正文右边界和关闭按钮对齐 | 局部 Toast |
| `--uzu-toast-action-size` | `28px` | Toast 关闭按钮尺寸 | 局部 Toast |
| `--uzu-toast-action-gap` | `12px` | Toast 为关闭按钮预留的距离 | 局部 Toast |
| `--uzu-disclosure-panel-block-end-padding` | `20px` | Disclosure 面板底部间距 | 局部 Disclosure 或外层容器 |
| `--uzu-menu-min-width` | `180px` | 下拉菜单和右键菜单宽度 | 局部 menu |
| `--uzu-menu-offset` | `4px` | 菜单和触发器之间的距离 | 局部 menu |
| `--uzu-menu-content-width` | `max-content` | 菜单内容宽度策略 | 局部 menu |
| `--uzu-command-max-height` | `260px` | 命令菜单结果列表高度 | 局部 command menu |
| `--uzu-avatar-size` | `36px` | 头像宽高 | 局部 avatar 或容器 |
| `--uzu-sidebar-width` | `240px` | 侧边栏宽度 | 局部 sidebar 或布局 |
| `--uzu-step-nav-gap` | `8px` | 可点击步骤导航间距 | 局部 step nav |
| `--uzu-hover-card-width` | `260px` | 悬浮卡片宽度 | 局部 hover card |
| `--uzu-combobox-list-max-height` | `240px` | 组合框弹出列表高度 | 局部 combobox |
| `--uzu-split-primary-size` | `50%` | 分栏面板主区域尺寸 | 局部 split pane |
| `--uzu-split-resizer-size` | `8px` | 分栏拖拽条尺寸 | 局部 split pane |
| `--uzu-resizable-width` | `320px` | 可调整面板宽度 | 局部 resizable |
| `--uzu-resizable-height` | `180px` | 可调整面板高度 | 局部 resizable |
| `--uzu-viewer-max-height` | `360px` | JSON / Diff 查看器高度 | 局部 viewer |
| `--uzu-json-indent` | `18px` | JSON 子级缩进 | 局部 JSON viewer |
| `--uzu-editor-min-height` | `160px` | 编辑器表面最小高度 | 局部 editor |
| `--uzu-alert-dialog-accent-color` | `var(--uzu-danger)` | 警告弹窗危险强调色 | 局部 alert dialog |
| `--uzu-drawer-width` | `420px` | 抽屉宽度 | 局部 drawer |
| `--uzu-sheet-width` | `520px` | 板式面板宽度 | 局部 sheet |
| `--uzu-spinner-size` | `18px` | spinner 尺寸 | 局部 spinner |
| `--uzu-spinner-stroke` | `2px` | spinner 线宽 | 局部 spinner |

Tabs 指示条、Segmented 指示条、Disclosure 实测高度等由脚本写入的变量属于内部状态，项目代码可以读取它们，但不把它们当作配置入口。项目反复需要某个新尺寸时，应在库里新增组件变量并更新文档。

如果某个项目经常需要的尺寸或行为还没被这里覆盖，优先补到 `ui/css/*.css` 的公开变量，再重新构建并更新文档。

## 包含内容

- 颜色、字体、间距、边框、圆角、动效和暗色模式等设计 token。
- 页面、章节、二/三/四列网格、Stack/Flex 布局、侧边栏、按钮、工具栏、面包屑、分页、卡片、指标、列表、头像、表单、输入组合、搜索框、密码输入、文件上传、滑块、步进器、标签页、选择器、组合框、菜单、菜单栏、命令菜单、数据网格、树形视图、分栏、可调整面板、JSON / Diff 查看器、编辑器表面、徽章、标签、分割线、代码、代码块、快捷键提示、Alert 预设、callout、表格、浮层、进度、spinner、骨架屏、toast、dialog、alert dialog、drawer、sheet、disclosure、accordion、hover card、panel navigation、prose 和 tooltip 等布局与组件原语。
- 面向产品页、文档页和组件页的可复用布局辅助类。具体站点组合留在消费方站点里完成。
- 主题切换、语言切换、自定义 select、组合框过滤、数据网格排序/选择、树形导航、分栏/可调整面板、JSON / Diff 渲染、编辑器表面、标签页、分段控件、分页、switch、搜索清空、密码显示切换、stepper、下拉/右键菜单、菜单栏、命令过滤、标签选择/关闭、disclosure、accordion、hover card、dialog、toast 关闭、步骤导航、面板导航、代码复制和有限 Markdown 渲染等交互脚本。

所有公开滚动区域共用同一套 6px 滚动条规范。根页面滚动条保持可见；局部滚动区域保留稳定滚动槽，并在 hover、focus、focus-within 或 active 交互时显示 thumb。WebKit 箭头按钮会被隐藏，滚动条 thumb 保持稳定的最小长度，避免长内容把 thumb 压成像三角形快速滚动按钮的形状。

文本输入、文本域、命令输入、组合框输入、步进器和编辑器表面使用硬边框焦点，不使用虚化阴影或外发光。输入组合和步进器的焦点边框画在外层壳上，让前缀、后缀、局部操作和步进按钮保持一个整体控件的视觉。

## 文档页

组件目录、API 参考和较长的文档页应由公开原语组合：`.uzu-page`、`.uzu-sidebar-layout`、`.uzu-sidebar`、`.uzu-scroll-area`、`.uzu-scroll`、`.uzu-panel-nav`、`.uzu-panel`、`.uzu-section-head`、`.uzu-card`、`.uzu-table`、`.uzu-code-block` 和 `.uzu-prose`。站点仓库里的组件目录是这些公开能力的严格消费方，不依赖隐藏的文档选择器，也不依赖库内的文档生成器。

`.uzu-sidebar-layout` 提供可复用的“侧栏 + 主内容”网格，适合文档页和应用页。它用 `--uzu-sidebar-layout-sidebar-width` 控制侧栏宽度，通过 `--uzu-sidebar-layout-gap` 提供默认 28px 列间距，窄屏收成单列，并会限制子级 `.uzu-sidebar.uzu-scroll-area` 的高度，避免过长导航把当前内容推到首屏之外。`.uzu-scroll-area` 也可以用 `--uzu-scroll-area-max-height` 约束局部预览或标本区域，同时保留公开滚动条样式。`.uzu-section-centered` 会居中标题组、大正文和直接子级 `.uzu-flex` 操作行。`.uzu-grid-4` 是 `.uzu-grid` 的四列形态，窄屏会收成单列。`.uzu-break-anywhere` 用于表格或卡片里的长 CSS 变量、包名、URL，避免撑破容器。

## 交互脚本

JavaScript 会在浏览器中自动初始化，也可以安全地在 SSR/Node 环境中 import。动态插入内容后可手动初始化：

```js
window.Usuzumi.init(container);
```

当客户端路由移除某一块界面时，可以对被移除的根节点调用：

```js
window.Usuzumi.destroy(container);
```

它会断开该区域内的自动初始化观察器，移除运行时生成的 tooltip 描述，并清理属于该区域的拖拽状态与弹窗隔离状态。

代码片段使用 `.uzu-code-block`、`.uzu-code-block-body` 和带有 `data-uzu-code-copy` 的复制按钮。在 `code` 或 `pre` 上添加 `data-uzu-code-language="javascript"`，也可以使用 `language-js` 类名。`Usuzumi.init()` 会完成高亮，把纯文本源码保存在 `data-uzu-code-source`，复制按钮会继续读取这份源码。需要检查内置语言范围时，可以调用 `window.Usuzumi.listCodeLanguages()` 或 `window.Usuzumi.hasCodeLanguage("ts")`。需要调整颜色时，在 `.uzu-code-block` 或 `.uzu-code-block-body` 上设置 `--uzu-code-block-bg`、`--uzu-code-block-fg` 和 `--uzu-code-token-*` 变量。

需要内置行为时，在组件外层使用对应的 `data-uzu-*` 属性：表单校验使用 `data-uzu-form`，菜单使用 `data-uzu-menu` 或 `data-uzu-context-menu`，命令菜单使用 `data-uzu-command`，accordion 使用 `data-uzu-accordion`，悬浮卡片使用 `data-uzu-hover-card`，标签使用 `data-uzu-tag`，步骤导航使用 `data-uzu-step-nav`。`data-uzu-form` 初始加载时只保留已有的 `.is-invalid` 或 `aria-invalid="true"` 状态，不会立刻校验空的必填项；需要首屏立即校验时添加 `data-uzu-form-validate-on-init="true"`。

组合框、轻量数据网格、树形视图、分栏和可调整面板分别使用 `data-uzu-combobox`、`data-uzu-data-grid`、`data-uzu-tree`、`data-uzu-split-pane`、`data-uzu-resizable`。数据网格可用 `data-uzu-grid-sort`、`data-uzu-grid-selection`、`data-uzu-grid-select-all`、`data-uzu-grid-empty`、`data-uzu-grid-align` 处理排序、多选、全选、空状态和列对齐。JSON / Diff 查看器和编辑器外壳使用 `data-uzu-json-viewer`、`data-uzu-diff-viewer`、`data-uzu-editor`、`data-uzu-markdown-editor`、`data-uzu-inline-editor`。

Dialog、drawer 和 sheet 共用 `data-uzu-dialog-*` 行为。从已打开的弹窗内部再打开弹窗时，运行时会保持父弹窗挂载，关闭子弹窗后把焦点还给触发按钮，并在父弹窗关闭后释放滚动锁和背景隔离。

编辑器外壳只负责 UI、事件和主题，不把完整编辑器引擎打包进核心库。`data-uzu-editor` 会通过公开外壳派发工具栏命令和内容区输入事件；需要文档模型、历史记录、快捷键、粘贴规则、协作或完整代码编辑时，把项目自己的编辑器引擎挂到 `.uzu-editor-mount`。`data-uzu-markdown-editor` 会派发源码变化事件；内置预览不够用时，由项目自己的 Markdown 流程负责渲染和安全策略。短代码片段可以继续使用原生 `textarea.uzu-code-editor`。

异步插入组件时，可以在外层容器上加 `data-uzu-auto-init`，后续新增的组件会自动初始化；也可以继续手动调用 `window.Usuzumi.init(container)`。

自定义事件：

- `uzu-select-change`：`{ value, label, option, select }`
- `uzu-tabs-change`：`{ value, tab, tabs, index, panel }`
- `uzu-segmented-change`：`{ value, segment, segmented, index }`
- `uzu-pagination-change`：`{ value, page, pagination, index, panel }`
- `uzu-switch-change`：`{ checked, switch }`
- `uzu-password-toggle`：`{ visible, password, input, toggle }`
- `uzu-stepper-change`：`{ value, number, stepper, input }`
- `uzu-field-validate`：`{ field, control, valid, invalid }`
- `uzu-form-validate`：`{ form, valid, invalid }`
- `uzu-disclosure-change`：`{ open, disclosure }`
- `uzu-toast-close`：`{ toast }`
- `uzu-dialog-open` / `uzu-dialog-close`：`{ dialog, overlay, trigger }`
- `uzu-menu-open` / `uzu-menu-close`：`{ menu, trigger, content }`
- `uzu-menu-select`：`{ menu, trigger, content, item, value }`
- `uzu-menubar-change`：`{ value, item, menubar, index }`
- `uzu-command-filter`：`{ value, command, visibleCount }`
- `uzu-command-select`：`{ value, item, command }`
- `uzu-combobox-open` / `uzu-combobox-close`：`{ combobox, input, list }`
- `uzu-combobox-filter`：`{ value, combobox, visibleCount }`
- `uzu-combobox-change`：`{ value, label, option, combobox, input }`
- `uzu-data-grid-sort`：`{ grid, table, header, columnIndex, direction }`
- `uzu-data-grid-select`：`{ grid, table, row, selected, value }`
- `uzu-data-grid-select-all`：`{ grid, table, selected, rows }`
- `uzu-tree-toggle`：`{ tree, item, expanded, value }`
- `uzu-tree-select`：`{ tree, item, value }`
- `uzu-split-resize`：`{ splitPane, size }`
- `uzu-resizable-resize`：`{ resizable, width, height }`
- `uzu-accordion-change`：`{ open, accordion, disclosure }`
- `uzu-hover-card-open` / `uzu-hover-card-close`：`{ hoverCard, trigger, content }`
- `uzu-tag-change`：`{ selected, tag, value }`
- `uzu-tag-close`：`{ tag, closeButton, value }`
- `uzu-step-nav-change`：`{ value, step, stepNav, index }`
- `uzu-editor-command`：`{ editor, surface, button, command, value }`
- `uzu-editor-change`：`{ editor, surface, value }`
- `uzu-markdown-editor-change`：`{ editor, source, preview, value }`
- `uzu-markdown-editor-render`：`{ editor, source, preview, value }`
- `uzu-inline-editor-change`：`{ editor, value }`
- `uzu-panel-nav-change`：`{ target, control, panel, nav }`
- `uzu-panel-show`：`{ target, control, panel, nav }`

项目内置 TypeScript 类型声明。

## 高阶组件

原生库已经包含这些较大的组件族：

- Combobox：本地过滤、键盘选择、ARIA 同步和可选隐藏表单值。
- Data Grid：基于真实 table 的排序、单选/多选、全选、空状态、列对齐和键盘移动。
- Tree View：层级焦点、选中、展开收起和 ARIA 层级位置同步。
- Split Pane / Resizable Panel：拖拽和键盘调整尺寸，并可用 key 做本地持久化。
- JSON Viewer / Diff Viewer：JSON 树渲染和统一 diff 风格行展示。
- 编辑器表面：通用编辑器外壳、代码、Markdown、纯文本、行内编辑和工具栏按钮。它们是外壳和轻量辅助；需要完整编辑能力时，由项目接入自己的编辑器引擎。

## 站点与示例

- [文档站仓库](https://github.com/Usuzumi-org/Usuzumi-site)
- [UI 库仓库](https://github.com/Usuzumi-org/Usuzumi)

官网、组件目录、编辑器接入演示和较大的示例页放在独立站点仓库里，避免文档专用依赖进入 UI 库本体。

## 维护

仓库维护命令：

```bash
npm run build
npm run validate
```

源码拆在 `ui/css/` 和 `ui/js/`。`ui/usuzumi.css`、`ui/usuzumi.js`、`ui/usuzumi.min.css`、`ui/usuzumi.min.js` 是给 npm 和 CDN 使用的生成入口，不要手动修改它们，改源码后运行 `npm run build` 重新生成。`npm run build:css` 和 `npm run check:css` 仍保留为旧命令别名。

`npm run validate` 会检查生成文件是否同步和源码约束，然后将库打包并安装到临时外部项目中，验证 package exports、CSS 文件、类型声明、CDN 风格的 `ui/*` 路径、浏览器交互脚本和组件页面布局 smoke check。

发布后的库没有运行时依赖。完整设计规范见 [DESIGN.md](DESIGN.md)。

## 许可证

Usuzumi 代码使用 [MIT License](LICENSE) 发布。

内置的 Meddon 字体按其自身的 SIL Open Font License 条款再分发，详见 [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md)。
