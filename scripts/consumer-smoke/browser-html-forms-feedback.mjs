export const consumerFormsFeedbackHtml = `    <div class="uzu-stack" id="consumer-stack" style="--uzu-stack-gap: 10px">
      <div class="uzu-flex uzu-flex-between" id="consumer-flex"><span>Left</span><span>Right</span></div>
      <section class="uzu-section-centered" id="consumer-section-centered">
        <div class="uzu-flex" id="consumer-section-centered-actions"><button class="uzu-button" type="button">Action</button></div>
        <div class="uzu-flex uzu-flex-between" id="consumer-section-centered-between"><span>Left</span><span>Right</span></div>
      </section>
      <div class="uzu-aspect" id="consumer-aspect" style="--uzu-aspect-ratio: 2 / 1"><div class="uzu-scroll-area" id="consumer-scroll-area" tabindex="0" style="--uzu-scroll-area-max-height: 64px"><div style="height: 160px">Scrollable area</div></div></div>
    </div>
    <form class="uzu-form" id="consumer-form" data-uzu-form novalidate>
      <fieldset class="uzu-fieldset">
        <legend>Account</legend>
        <div class="uzu-field" id="consumer-required-field">
          <label class="uzu-label" for="consumer-required-input">Project</label>
          <input class="uzu-input" id="consumer-required-input" required value="">
          <p class="uzu-form-error" data-uzu-form-error>Project is required.</p>
        </div>
        <div class="uzu-field">
          <label class="uzu-label" for="consumer-search-input">Search</label>
          <div class="uzu-search" id="consumer-search" data-uzu-search>
            <input class="uzu-input uzu-search-input" id="consumer-search-input" type="search" value="query">
            <button class="uzu-icon-button uzu-search-clear" type="button" data-uzu-search-clear aria-label="Clear search"><svg viewBox="0 0 24 24" aria-hidden="true" fill="none"><path d="M6 6l12 12M18 6 6 18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg></button>
          </div>
        </div>
        <div class="uzu-field">
          <label class="uzu-label" for="consumer-password-input">Password</label>
          <div class="uzu-password" id="consumer-password" data-uzu-password>
            <input class="uzu-input uzu-password-input" id="consumer-password-input" type="password" value="secret">
            <button class="uzu-icon-button uzu-password-toggle" type="button" data-uzu-password-toggle aria-label="Toggle password"><svg viewBox="0 0 24 24" aria-hidden="true" fill="none"><path d="M3.8 12s3-5.2 8.2-5.2S20.2 12 20.2 12s-3 5.2-8.2 5.2S3.8 12 3.8 12Z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/><circle cx="12" cy="12" r="2.2" stroke="currentColor" stroke-width="1.7"/></svg></button>
          </div>
        </div>
        <div class="uzu-field">
          <label class="uzu-label" for="consumer-stepper-input">Count</label>
          <div class="uzu-stepper" id="consumer-stepper" data-uzu-stepper>
            <input class="uzu-input uzu-stepper-input" id="consumer-stepper-input" type="number" min="1" max="3" step="1" value="2">
            <span class="uzu-stepper-controls">
              <button class="uzu-icon-button uzu-stepper-button" type="button" data-uzu-stepper-decrement aria-label="Decrease">-</button>
              <button class="uzu-icon-button uzu-stepper-button" type="button" data-uzu-stepper-increment aria-label="Increase">+</button>
            </span>
          </div>
        </div>
      </fieldset>
    </form>
    <div class="uzu-input-group" id="consumer-input-group"><span class="uzu-input-addon">$</span><input class="uzu-input" value="128"><span class="uzu-select" id="consumer-input-group-currency" data-uzu-select data-uzu-select-name="currency"><button class="uzu-select-trigger" type="button" data-uzu-select-trigger aria-label="Currency"><span data-uzu-select-label>USD</span></button><span class="uzu-select-menu" role="listbox"><span class="uzu-select-option is-selected" data-uzu-select-option data-value="usd" role="option">USD</span><span class="uzu-select-option" data-uzu-select-option data-value="eur" role="option">EUR</span></span></span><button class="uzu-button uzu-input-action" type="button">Apply</button></div>
    <label class="uzu-file-upload" id="consumer-file-upload"><span class="uzu-label">File</span><input class="uzu-file-input" type="file"><span class="uzu-file-summary">Native file input.</span></label>
    <input class="uzu-slider" id="consumer-slider" type="range" value="50">
    <input class="uzu-slider uzu-slider-stepped" id="consumer-slider-stepped" type="range" min="0" max="5" step="1" value="2" data-uzu-slider-stepped>
    <input class="uzu-slider uzu-slider-stepped" id="consumer-slider-stepped-uneven" type="range" min="0" max="10" step="3" value="6" data-uzu-slider-stepped>
    <div class="uzu-select" id="consumer-select" data-uzu-select data-uzu-select-name="density">
      <button class="uzu-select-trigger" type="button" data-uzu-select-trigger aria-expanded="false">Balanced</button>
      <div class="uzu-select-menu" role="listbox">
        <div class="uzu-select-option is-selected" data-uzu-select-option data-value="balanced" role="option" aria-selected="true">Balanced</div>
        <div class="uzu-select-option" data-uzu-select-option data-value="compact" role="option" aria-selected="false">Compact</div>
        <section class="uzu-disclosure is-open" id="consumer-select-hidden-disclosure" data-uzu-disclosure>
          <button class="uzu-disclosure-trigger" type="button" data-uzu-disclosure-trigger aria-expanded="true">Select details</button>
          <div class="uzu-disclosure-panel" data-uzu-disclosure-panel><div style="min-height: 280px">Disclosure content inside a select menu.</div></div>
        </section>
      </div>
    </div>
    <div class="uzu-combobox" id="consumer-combobox" data-uzu-combobox data-uzu-combobox-name="component">
      <input class="uzu-input uzu-combobox-input" id="consumer-combobox-input" data-uzu-combobox-input autocomplete="off" value="">
      <div class="uzu-combobox-list" data-uzu-combobox-list>
        <button class="uzu-combobox-option is-selected" type="button" data-uzu-combobox-option data-uzu-combobox-value="button">Button</button>
        <button class="uzu-combobox-option" type="button" data-uzu-combobox-option data-uzu-combobox-value="dialog">Dialog</button>
        <button class="uzu-combobox-option" type="button" data-uzu-combobox-option data-uzu-combobox-value="tree">Tree View</button>
        <p class="uzu-combobox-empty" hidden>No matches</p>
        <section class="uzu-disclosure is-open" id="consumer-combobox-hidden-disclosure" data-uzu-disclosure>
          <button class="uzu-disclosure-trigger" type="button" data-uzu-disclosure-trigger aria-expanded="true">Combobox details</button>
          <div class="uzu-disclosure-panel" data-uzu-disclosure-panel><div style="min-height: 280px">Disclosure content inside a combobox list.</div></div>
        </section>
      </div>
    </div>
    <div class="uzu-field">
      <label class="uzu-label" for="consumer-field">Project name</label>
      <input class="uzu-input" id="consumer-field" placeholder="Untitled project">
      <span class="uzu-help">Field helper text.</span>
    </div>
    <div class="uzu-field">
      <label class="uzu-label" for="consumer-notes-textarea">Notes</label>
      <textarea class="uzu-textarea" id="consumer-notes-textarea">Draft notes</textarea>
    </div>
    <section class="uzu-disclosure" id="consumer-disclosure" data-uzu-disclosure>
      <button class="uzu-disclosure-trigger" type="button" data-uzu-disclosure-trigger aria-expanded="false">Details</button>
      <div class="uzu-disclosure-panel" data-uzu-disclosure-panel hidden>Disclosure content</div>
    </section>
    <aside class="uzu-callout uzu-callout-note" style="--uzu-callout-border-color: rgb(10, 20, 30); --uzu-callout-bg: rgb(240, 241, 242); --uzu-callout-title-color: rgb(30, 40, 50); --uzu-callout-text-color: rgb(60, 70, 80);">
      <h3 class="uzu-callout-title">Consumer page</h3>
      <p>Loaded from node_modules.</p>
    </aside>
    <article class="uzu-alert" id="consumer-alert" style="--uzu-alert-max-width: 420px; --uzu-alert-accent-color: rgb(10, 20, 30); --uzu-alert-bg: rgb(240, 241, 242); --uzu-alert-title-color: rgb(30, 40, 50); --uzu-alert-text-color: rgb(60, 70, 80);">
      <div class="uzu-title-pair">
        <h3>Custom alert</h3>
        <p>Alert colors are set with custom properties.</p>
      </div>
    </article>
    <article class="uzu-alert uzu-alert-success" id="consumer-alert-success">
      <div class="uzu-title-pair">
        <h3>Success alert</h3>
        <p>Preset success alert.</p>
      </div>
    </article>
    <article class="uzu-alert uzu-alert-warning" id="consumer-alert-warning">
      <div class="uzu-title-pair">
        <h3>Warning alert</h3>
        <p>Preset warning alert.</p>
      </div>
    </article>
    <div class="uzu-progress uzu-progress-indeterminate" role="progressbar" aria-label="Syncing changes">
      <span class="uzu-progress-bar"></span>
    </div>
    <span class="uzu-activity" role="status" aria-label="Syncing">
      <span class="uzu-activity-dot" aria-hidden="true"></span>
      <span class="uzu-activity-dot" aria-hidden="true"></span>
      <span class="uzu-activity-dot" aria-hidden="true"></span>
    </span>
    <ol class="uzu-process" aria-label="Publish progress">
      <li class="uzu-process-step is-complete">Validate tokens</li>
      <li class="uzu-process-step is-active" aria-current="step">Build CSS bundle</li>
      <li class="uzu-process-step">Package release</li>
    </ol>
    <article class="uzu-skeleton-card" id="consumer-skeleton-card" aria-busy="true" aria-label="Loading card">
      <div class="uzu-skeleton-row">
        <span class="uzu-skeleton uzu-skeleton-avatar" id="consumer-skeleton-avatar" aria-hidden="true"></span>
        <span class="uzu-skeleton-stack">
          <span class="uzu-skeleton uzu-skeleton-title" id="consumer-skeleton-title"></span>
          <span class="uzu-skeleton uzu-skeleton-line uzu-skeleton-short"></span>
        </span>
      </div>
      <span class="uzu-skeleton uzu-skeleton-media" id="consumer-skeleton-media" aria-hidden="true"></span>
      <span class="uzu-skeleton uzu-skeleton-line" id="consumer-skeleton-line"></span>
    </article>
    <span class="uzu-spinner" id="consumer-spinner" role="status" aria-label="Loading"></span>`;
