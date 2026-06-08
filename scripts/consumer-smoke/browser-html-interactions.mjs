export const consumerInteractionsHtml = `    <div class="uzu-menu" id="consumer-menu" data-uzu-menu>
      <button class="uzu-button uzu-menu-trigger" type="button" data-uzu-menu-trigger>More</button>
      <div class="uzu-menu-content" data-uzu-menu-content>
        <button class="uzu-menu-item" type="button" data-uzu-menu-value="rename">Rename</button>
        <button class="uzu-menu-item" type="button" data-uzu-menu-value="duplicate">Duplicate</button>
        <section class="uzu-disclosure is-open" id="consumer-menu-hidden-disclosure" data-uzu-disclosure>
          <button class="uzu-disclosure-trigger" type="button" data-uzu-disclosure-trigger aria-expanded="true">Menu details</button>
          <div class="uzu-disclosure-panel" data-uzu-disclosure-panel><div style="min-height: 280px">Disclosure content inside a menu.</div></div>
        </section>
      </div>
    </div>
    <div class="uzu-menu" id="consumer-context-menu" data-uzu-context-menu data-uzu-context-menu-trigger="#consumer-context-target">
      <button class="uzu-button" id="consumer-context-target" type="button">Context target</button>
      <div class="uzu-menu-content" data-uzu-menu-content>
        <button class="uzu-menu-item" type="button" data-uzu-menu-value="open">Open</button>
      </div>
    </div>
    <div class="uzu-menubar" id="consumer-menubar" data-uzu-menubar aria-label="Consumer menubar">
      <button class="uzu-menubar-item is-active" type="button" data-uzu-menubar-value="file">File</button>
      <button class="uzu-menubar-item" type="button" data-uzu-menubar-value="edit">Edit</button>
      <button class="uzu-menubar-item" type="button" data-uzu-menubar-value="view">View</button>
    </div>
    <div class="uzu-command" id="consumer-command" data-uzu-command>
      <label class="uzu-label uzu-sr-only" for="consumer-command-input">Command</label>
      <input class="uzu-command-input" id="consumer-command-input" data-uzu-command-input value="">
      <div class="uzu-command-list" data-uzu-command-list>
        <button class="uzu-command-item" type="button" data-uzu-command-value="new">New page</button>
        <button class="uzu-command-item" type="button" data-uzu-command-value="theme">Toggle theme</button>
        <button class="uzu-command-item" type="button" data-uzu-command-value="publish">Publish draft</button>
        <p class="uzu-command-empty" hidden>No matches</p>
      </div>
    </div>
    <ol class="uzu-step-nav" id="consumer-step-nav" data-uzu-step-nav aria-label="Consumer steps">
      <li class="uzu-step-nav-item"><button class="uzu-step-nav-button is-active" type="button" data-uzu-step-value="profile">Profile</button></li>
      <li class="uzu-step-nav-item"><button class="uzu-step-nav-button" type="button" data-uzu-step-value="plan">Plan</button></li>
      <li class="uzu-step-nav-item"><button class="uzu-step-nav-button" type="button" data-uzu-step-value="review">Review</button></li>
    </ol>
    <div class="uzu-accordion" id="consumer-accordion" data-uzu-accordion>
      <section class="uzu-disclosure is-open" data-uzu-disclosure>
        <button class="uzu-disclosure-trigger" type="button" data-uzu-disclosure-trigger aria-expanded="true">First</button>
        <div class="uzu-disclosure-panel" data-uzu-disclosure-panel>First content</div>
      </section>
      <section class="uzu-disclosure" data-uzu-disclosure>
        <button class="uzu-disclosure-trigger" type="button" data-uzu-disclosure-trigger>Second</button>
        <div class="uzu-disclosure-panel" data-uzu-disclosure-panel hidden>Second content</div>
      </section>
    </div>
    <div class="uzu-hover-card" id="consumer-hover-card" data-uzu-hover-card data-uzu-hover-card-delay="20" data-uzu-hover-card-close-delay="20">
      <button class="uzu-button" type="button" data-uzu-hover-card-trigger>Hover info</button>
      <div class="uzu-hover-card-content" data-uzu-hover-card-content>
        <section class="uzu-disclosure is-open" id="consumer-hover-hidden-disclosure" data-uzu-disclosure>
          <button class="uzu-disclosure-trigger" type="button" data-uzu-disclosure-trigger aria-expanded="true">Hover details</button>
          <div class="uzu-disclosure-panel" data-uzu-disclosure-panel><div style="min-height: 280px">Disclosure content inside a hover card.</div></div>
        </section>
      </div>
    </div>
    <div id="consumer-popover" data-uzu-popover>
      <button class="uzu-button uzu-popover-trigger" type="button" data-uzu-popover-trigger>View settings</button>
      <aside class="uzu-popover uzu-stack uzu-gap-3" data-uzu-popover-content aria-labelledby="consumer-popover-title">
        <div class="uzu-title-pair">
          <h3 id="consumer-popover-title">Display options</h3>
          <p>Small settings beside a trigger.</p>
        </div>
        <section class="uzu-disclosure is-open" id="consumer-popover-hidden-disclosure" data-uzu-disclosure>
          <button class="uzu-disclosure-trigger" type="button" data-uzu-disclosure-trigger aria-expanded="true">Popover details</button>
          <div class="uzu-disclosure-panel" data-uzu-disclosure-panel><div style="min-height: 280px">Disclosure content inside a popover.</div></div>
        </section>
      </aside>
    </div>
    <span class="uzu-tag" id="consumer-tag-static" data-uzu-tag>Docs</span>
    <button class="uzu-tag is-selected" id="consumer-tag-selectable" type="button" data-uzu-tag data-uzu-tag-selectable="true" data-uzu-tag-value="active" aria-pressed="true">Active</button>
    <span class="uzu-tag" id="consumer-tag-closeable" data-uzu-tag data-uzu-tag-value="filter">Filter<button class="uzu-tag-close" type="button" data-uzu-tag-close aria-label="Remove filter">x</button></span>
    <section class="uzu-empty-state" id="consumer-empty-state"><div class="uzu-title-pair"><h3>No projects</h3><p>Create one to continue.</p></div></section>
    <section class="uzu-error-state" id="consumer-error-state" role="alert"><div class="uzu-title-pair"><h3>Load failed</h3><p>Try again.</p></div></section>
    <button class="uzu-button" id="consumer-toast-trigger" type="button" data-uzu-toast-trigger data-uzu-toast-template="#consumer-toast-template" data-uzu-toast-stack="#consumer-toast-stack">Show toast</button>
    <div class="uzu-toast-stack uzu-toast-stack-inline" id="consumer-toast-stack" data-uzu-toast-stack></div>
    <template id="consumer-toast-template">
      <article class="uzu-toast" data-uzu-toast>
        <div class="uzu-toast-content">
          <div class="uzu-title-pair">
            <h3>Triggered</h3>
            <p>Created from a public toast trigger.</p>
          </div>
        </div>
        <button class="uzu-icon-button uzu-toast-close" type="button" data-uzu-toast-close aria-label="Dismiss triggered toast"><svg viewBox="0 0 24 24" aria-hidden="true" fill="none"><path d="M6 6l12 12M18 6 6 18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg></button>
      </article>
    </template>
    <article class="uzu-toast" data-uzu-toast>
      <div class="uzu-toast-content">
        <div class="uzu-title-pair">
          <h3>Saved</h3>
          <p>Dismissible toast message with a longer body line for wrapping checks.</p>
        </div>
      </div>
      <button class="uzu-icon-button uzu-toast-close" type="button" data-uzu-toast-close aria-label="Dismiss toast"><svg viewBox="0 0 24 24" aria-hidden="true" fill="none"><path d="M6 6l12 12M18 6 6 18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg></button>
    </article>
    <div class="uzu-grid uzu-grid-2">
      <article class="uzu-card" id="consumer-tall-card" style="min-height: 180px">Tall sibling</article>
      <article class="uzu-toast" id="consumer-grid-toast" data-uzu-toast>
        <div class="uzu-toast-content">
          <div class="uzu-title-pair">
            <h3>Saved</h3>
            <p>Compact grid toast.</p>
          </div>
        </div>
        <button class="uzu-icon-button uzu-toast-close" type="button" data-uzu-toast-close aria-label="Dismiss grid toast"><svg viewBox="0 0 24 24" aria-hidden="true" fill="none"><path d="M6 6l12 12M18 6 6 18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg></button>
      </article>
    </div>`;
