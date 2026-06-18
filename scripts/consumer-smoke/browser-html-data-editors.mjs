export const consumerDataEditorsHtml = `    <ul class="uzu-list" id="consumer-list">
      <li class="uzu-list-item"><span>Design tokens</span><span class="uzu-list-meta">Ready</span><button class="uzu-button uzu-list-action" type="button">Open</button></li>
      <li class="uzu-list-item"><span>Runtime</span><span class="uzu-list-meta">Loaded</span></li>
    </ul>
    <div class="uzu-data-grid-wrap">
      <table class="uzu-data-grid" id="consumer-data-grid" data-uzu-data-grid>
        <thead><tr><th data-uzu-grid-sort>Name</th><th data-uzu-grid-sort>Count</th></tr></thead>
        <tbody>
          <tr data-uzu-grid-row="beta"><td>Beta</td><td>2</td></tr>
          <tr data-uzu-grid-row="alpha"><td>Alpha</td><td>1</td></tr>
        </tbody>
      </table>
    </div>
    <div class="uzu-data-grid-wrap">
      <table class="uzu-data-grid" id="consumer-data-grid-multi" data-uzu-data-grid data-uzu-data-grid-multi="true">
        <thead>
          <tr>
            <th scope="col"><input type="checkbox" data-uzu-grid-select-all aria-label="Select all rows"></th>
            <th data-uzu-grid-sort scope="col">Task</th>
            <th data-uzu-grid-sort data-uzu-grid-align="end" scope="col">Count</th>
          </tr>
        </thead>
        <tbody>
          <tr data-uzu-grid-row="tokens"><td><input type="checkbox" data-uzu-grid-selection aria-label="Select tokens"></td><td>Tokens</td><td data-uzu-grid-align="end" data-uzu-grid-sort-value="12">12</td></tr>
          <tr data-uzu-grid-row="runtime"><td><input type="checkbox" data-uzu-grid-selection aria-label="Select runtime"></td><td>Runtime</td><td data-uzu-grid-align="end" data-uzu-grid-sort-value="4">4</td></tr>
          <tr data-uzu-grid-empty hidden><td colspan="3">No rows</td></tr>
        </tbody>
      </table>
    </div>
    <div class="uzu-data-grid-wrap">
      <table class="uzu-data-grid" id="consumer-data-grid-plain" data-uzu-data-grid>
        <thead><tr><th data-uzu-grid-sort>Plain name</th><th>State</th></tr></thead>
        <tbody>
          <tr><td>One</td><td>Ready</td></tr>
          <tr><td>Two</td><td>Queued</td></tr>
        </tbody>
      </table>
    </div>
    <section class="uzu-heatmap" id="consumer-heatmap" data-uzu-heatmap aria-label="Consumer heatmap">
      <div class="uzu-heatmap-header">
        <div>
          <h2 class="uzu-heatmap-title">Activity</h2>
          <p class="uzu-heatmap-summary">8 compact days</p>
        </div>
      </div>
      <script type="application/json" data-uzu-heatmap-data>{"s":"2025-06-18","w":1,"v":[0,2,[4,4],1,0,3,5,0],"sel":2,"l":["Less","More","No events"],"ev":[[2,[["Review","12:20","Explicit level"]]], [5,[["Ship","21:40"]]]]}</script>
      <div data-uzu-heatmap-grid></div>
    </section>
    <section class="uzu-heatmap" id="consumer-static-heatmap" data-uzu-heatmap aria-label="Static heatmap">
      <div class="uzu-heatmap-viewport">
        <div class="uzu-heatmap-grid" data-uzu-heatmap-grid>
          <button class="uzu-heatmap-cell" type="button" data-uzu-heatmap-date="2025-06-18" data-uzu-heatmap-offset="0" data-uzu-heatmap-value="0" data-uzu-heatmap-level="0" aria-label="2025-06-18"></button>
          <button class="uzu-heatmap-cell is-selected" type="button" data-uzu-heatmap-date="2025-06-19" data-uzu-heatmap-offset="1" data-uzu-heatmap-value="2" data-uzu-heatmap-level="2" aria-label="2025-06-19"></button>
          <button class="uzu-heatmap-cell" type="button" data-uzu-heatmap-date="2025-06-20" data-uzu-heatmap-offset="2" data-uzu-heatmap-value="4" data-uzu-heatmap-level="4" aria-label="2025-06-20"></button>
        </div>
      </div>
      <div class="uzu-heatmap-detail" data-uzu-heatmap-detail></div>
    </section>
    <ul class="uzu-tree" id="consumer-tree" data-uzu-tree aria-label="Consumer tree">
      <li class="uzu-tree-item is-open" data-uzu-tree-item data-uzu-tree-value="docs">
        <div class="uzu-tree-row"><button class="uzu-tree-toggle" type="button" data-uzu-tree-toggle aria-label="Toggle docs"></button><span class="uzu-tree-label" data-uzu-tree-label>docs</span></div>
        <ul class="uzu-tree-group">
          <li class="uzu-tree-item is-selected" data-uzu-tree-item data-uzu-tree-value="overview"><div class="uzu-tree-row"><span class="uzu-tree-label" data-uzu-tree-label>Overview</span></div></li>
        </ul>
      </li>
      <li class="uzu-tree-item" data-uzu-tree-item data-uzu-tree-value="hidden-details">
        <div class="uzu-tree-row"><button class="uzu-tree-toggle" type="button" data-uzu-tree-toggle aria-label="Toggle hidden details"></button><span class="uzu-tree-label" data-uzu-tree-label>details</span></div>
        <ul class="uzu-tree-group">
          <li class="uzu-tree-item" data-uzu-tree-item data-uzu-tree-value="tree-disclosure">
            <section class="uzu-disclosure is-open" id="consumer-tree-hidden-disclosure" data-uzu-disclosure>
              <button class="uzu-disclosure-trigger" type="button" data-uzu-disclosure-trigger aria-expanded="true">Tree details</button>
              <div class="uzu-disclosure-panel" data-uzu-disclosure-panel><div style="min-height: 280px">Disclosure content inside a collapsed tree branch.</div></div>
            </section>
          </li>
        </ul>
      </li>
    </ul>
    <div class="uzu-split-pane" id="consumer-split-pane" data-uzu-split-pane data-uzu-split-size="40" data-uzu-split-min="20" data-uzu-split-max="80">
      <section class="uzu-split-panel">Left panel</section>
      <button class="uzu-split-resizer" type="button" data-uzu-split-resizer aria-label="Resize split pane"></button>
      <section class="uzu-split-panel">Right panel</section>
    </div>
    <div class="uzu-resizable" id="consumer-resizable" data-uzu-resizable data-uzu-resizable-width="260" data-uzu-resizable-height="140" data-uzu-resizable-min-width="180" data-uzu-resizable-min-height="100">
      <div class="uzu-resizable-content">Resizable content</div>
      <button class="uzu-resizable-handle" type="button" data-uzu-resizable-handle aria-label="Resize panel"></button>
    </div>
    <div class="uzu-json-viewer" id="consumer-json-viewer" data-uzu-json-viewer><script type="application/json">{"name":"Usuzumi","enabled":true,"count":2,"theme":{"light":true,"dark":true},"modules":["css","runtime"]}</script></div>
    <div class="uzu-json-viewer" id="consumer-json-escaped-key-viewer" data-uzu-json-viewer><script type="application/json">{"":1,"quote\\\"key":"line\\nbreak","path":"C:\\\\Temp"}</script></div>
    <pre class="uzu-diff-viewer" id="consumer-diff-viewer" data-uzu-diff-viewer>@@ file
- old
+ new</pre>
    <textarea class="uzu-code-editor" id="consumer-code-editor">const editable = true;</textarea>
    <textarea class="uzu-plain-editor" id="consumer-plain-editor">Plain editable text</textarea>
    <section class="uzu-editor" id="consumer-editor" data-uzu-editor>
      <div class="uzu-editor-toolbar" role="toolbar" aria-label="Editor tools"><button class="uzu-toolbar-button" type="button" data-uzu-editor-command="bold" data-uzu-editor-toggle>B</button><input class="uzu-input uzu-toolbar-link-input" id="consumer-toolbar-link-input" aria-label="Link URL" value="https://example.com"></div>
      <div class="uzu-editor-surface" data-uzu-editor-surface contenteditable="true" role="textbox" aria-multiline="true">Editable text</div>
    </section>
    <div class="uzu-editor-surface" id="consumer-standalone-editor-surface" contenteditable="true" role="textbox" aria-multiline="true">Standalone editable surface</div>
    <section class="uzu-editor uzu-markdown-editor" id="consumer-markdown-editor" data-uzu-markdown-editor data-uzu-markdown-render>
      <textarea class="uzu-markdown-source" data-uzu-markdown-source># Editor markdown</textarea>
      <div class="uzu-markdown-preview" data-uzu-markdown-preview></div>
    </section>
    <section class="uzu-editor uzu-markdown-editor" id="consumer-markdown-editor-shell" data-uzu-markdown-editor>
      <textarea class="uzu-markdown-source" data-uzu-markdown-source># Shell only</textarea>
      <div class="uzu-markdown-preview" data-uzu-markdown-preview></div>
    </section>
    <span class="uzu-inline-editor" id="consumer-inline-editor" data-uzu-inline-editor data-placeholder="Untitled">Inline text</span>
    <span class="uzu-avatar" id="consumer-avatar" aria-label="Usuzumi">U</span>
    <aside class="uzu-sidebar uzu-scroll-area" id="consumer-sidebar" style="--uzu-scroll-area-max-height: 72px" aria-label="Consumer sidebar">
      <section class="uzu-sidebar-section">
        <p class="uzu-micro-label">Project</p>
        <ul class="uzu-sidebar-nav">
          <li><a href="#overview" aria-current="page">Overview</a></li>
          <li><button type="button">Settings</button></li>
          <li><button type="button">Members</button></li>
          <li><button type="button">Deployments</button></li>
          <li><button type="button">Billing</button></li>
        </ul>
      </section>
    </aside>
    <div class="uzu-sidebar-layout" id="consumer-sidebar-layout">
      <aside class="uzu-sidebar" aria-label="Consumer layout sidebar"></aside>
      <main class="uzu-card">Main content</main>
    </div>
    <div class="uzu-sidebar-layout" id="consumer-collapsible-sidebar-layout" data-uzu-sidebar-layout data-uzu-sidebar-default="expanded" data-uzu-sidebar-collapse-on-select="false" data-uzu-sidebar-mobile="inline">
      <div class="uzu-sidebar-layout-controls">
        <span class="uzu-section-label">Navigation</span>
        <button class="uzu-icon-button uzu-sidebar-layout-toggle" type="button" id="consumer-collapsible-sidebar-toggle" data-uzu-sidebar-toggle data-uzu-sidebar-target="#consumer-collapsible-sidebar-layout" aria-label="Toggle navigation">
          <svg viewBox="0 0 24 24" aria-hidden="true" fill="none"><rect x="4.5" y="5" width="15" height="14" rx="2" stroke="currentColor" stroke-width="1.7"/><path d="M9.5 5v14M13 9.5l2.5 2.5-2.5 2.5" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </button>
      </div>
      <aside class="uzu-sidebar" id="consumer-collapsible-sidebar" aria-label="Consumer collapsible sidebar">
        <section class="uzu-sidebar-section">
          <ul class="uzu-sidebar-nav">
            <li><button type="button">Overview</button></li>
          </ul>
        </section>
      </aside>
      <main class="uzu-card">Collapsible content</main>
    </div>
    <div class="uzu-sidebar-layout-controls">
      <button class="uzu-icon-button uzu-sidebar-layout-toggle" type="button" id="consumer-auto-sidebar-toggle" data-uzu-sidebar-toggle data-uzu-sidebar-target="#consumer-auto-sidebar-layout" aria-label="Toggle auto navigation">
        <svg viewBox="0 0 24 24" aria-hidden="true" fill="none"><path d="M4 6h16M4 12h10M4 18h16" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>
      </button>
    </div>
    <div class="uzu-sidebar-layout" id="consumer-auto-sidebar-layout" data-uzu-sidebar-layout data-uzu-sidebar-default="auto" data-uzu-sidebar-collapse-on-select="narrow">
      <aside class="uzu-sidebar" id="consumer-auto-sidebar" aria-label="Consumer auto sidebar">
        <section class="uzu-sidebar-section">
          <ul class="uzu-sidebar-nav">
            <li><button type="button" id="consumer-auto-sidebar-select">Open section</button></li>
          </ul>
        </section>
      </aside>
      <main class="uzu-card">Auto content</main>
    </div>
    <div class="uzu-sidebar-layout-controls">
      <button class="uzu-icon-button uzu-sidebar-layout-toggle" type="button" id="consumer-inline-sidebar-toggle" data-uzu-sidebar-toggle data-uzu-sidebar-target="#consumer-inline-sidebar-layout" aria-label="Toggle inline navigation">
        <svg viewBox="0 0 24 24" aria-hidden="true" fill="none"><path d="M4 6h16M4 12h10M4 18h16" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>
      </button>
    </div>
    <div class="uzu-sidebar-layout" id="consumer-inline-sidebar-layout" data-uzu-sidebar-layout data-uzu-sidebar-default="auto" data-uzu-sidebar-collapse-on-select="narrow" data-uzu-sidebar-mobile="inline">
      <aside class="uzu-sidebar" id="consumer-inline-sidebar" aria-label="Consumer inline sidebar">
        <section class="uzu-sidebar-section">
          <ul class="uzu-sidebar-nav">
            <li><button type="button" id="consumer-inline-sidebar-select">Inline section</button></li>
          </ul>
        </section>
      </aside>
      <main class="uzu-card" id="consumer-inline-sidebar-main">Inline content</main>
    </div>`;
