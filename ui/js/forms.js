  function initSwitches(root = document) {
    queryAll(root, '[data-uzu-switch]').forEach((control) => {
      const checked = control.getAttribute('aria-checked') === 'true' || control.classList.contains('is-on');
      setSwitchState(control, checked, false);
      if (!markInitialized(control, 'Switch')) return;
      control.addEventListener('click', () => toggleSwitch(control));
      control.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          toggleSwitch(control);
        }
      });
    });
  }

  function getFieldControl(field) {
    return field.querySelector('input:not([type="hidden"]), textarea, select, [data-uzu-select], [data-uzu-combobox], [data-uzu-switch]');
  }

  function getFormField(control) {
    return control.closest('.uzu-field, [data-uzu-field]');
  }

  function getControlValidity(control) {
    if ('validity' in control && control.validity) return control.validity.valid;
    if (control.matches?.('[data-uzu-select], [data-uzu-combobox], [data-uzu-switch]')) {
      return control.getAttribute('aria-invalid') !== 'true' && !control.classList.contains('is-invalid');
    }
    return true;
  }

  function syncFieldValidity(field, emit = false) {
    const control = getFieldControl(field);
    if (!control) return true;
    const valid = getControlValidity(control);
    const invalid = !valid;
    field.classList.toggle('is-invalid', invalid);
    if ('setAttribute' in control) {
      control.setAttribute('aria-invalid', invalid ? 'true' : 'false');
    }
    queryAll(field, '.uzu-form-error, [data-uzu-form-error]').forEach((message) => {
      message.hidden = !invalid;
      message.setAttribute('role', message.getAttribute('role') || 'alert');
    });
    if (emit) {
      field.dispatchEvent(new CustomEvent('uzu-field-validate', {
        bubbles: true,
        detail: { field, control, valid, invalid }
      }));
    }
    return valid;
  }

  function syncFieldInitialState(field) {
    const control = getFieldControl(field);
    const invalid = field.classList.contains('is-invalid') || control?.getAttribute?.('aria-invalid') === 'true';
    field.classList.toggle('is-invalid', invalid);
    if (control && 'setAttribute' in control) {
      control.setAttribute('aria-invalid', invalid ? 'true' : 'false');
    }
    queryAll(field, '.uzu-form-error, [data-uzu-form-error]').forEach((message) => {
      message.hidden = !invalid;
      message.setAttribute('role', message.getAttribute('role') || 'alert');
    });
    return invalid;
  }

  function shouldValidateFormOnInit(form) {
    const value = form.getAttribute('data-uzu-form-validate-on-init');
    return value === '' || value === 'true';
  }

  function validateForm(form, emit = true) {
    const fields = queryAll(form, '.uzu-field, [data-uzu-field]');
    const valid = fields.map((field) => syncFieldValidity(field, emit)).every(Boolean);
    form.classList.toggle('is-invalid', !valid);
    if (emit) {
      form.dispatchEvent(new CustomEvent('uzu-form-validate', {
        bubbles: true,
        detail: { form, valid, invalid: !valid }
      }));
    }
    return valid;
  }

  function initForms(root = document) {
    queryAll(root, '[data-uzu-form]').forEach((form) => {
      if (shouldValidateFormOnInit(form)) {
        validateForm(form, false);
      } else {
        const hasInvalidField = queryAll(form, '.uzu-field, [data-uzu-field]').map(syncFieldInitialState).some(Boolean);
        form.classList.toggle('is-invalid', hasInvalidField || form.classList.contains('is-invalid'));
      }
      if (!markInitialized(form, 'Form')) return;
      queryAll(form, 'input, textarea, select, [data-uzu-select], [data-uzu-combobox], [data-uzu-switch]').forEach((control) => {
        const sync = () => {
          const field = getFormField(control);
          if (field) syncFieldValidity(field, true);
          validateForm(form, true);
        };
        control.addEventListener('input', sync);
        control.addEventListener('change', sync);
        control.addEventListener('blur', sync);
        control.addEventListener('uzu-select-change', sync);
        control.addEventListener('uzu-combobox-change', sync);
        control.addEventListener('uzu-switch-change', sync);
      });
      form.addEventListener('submit', (event) => {
        if (!validateForm(form, true)) {
          event.preventDefault();
          const firstInvalid = form.querySelector('[aria-invalid="true"], .is-invalid input, .is-invalid textarea, .is-invalid select, .is-invalid [tabindex]');
          if (firstInvalid && typeof firstInvalid.focus === 'function') firstInvalid.focus();
        }
      });
    });
  }

  function setSearchClearState(search) {
    const input = search.querySelector('.uzu-search-input, input[type="search"], input[type="text"]');
    const clear = search.querySelector('[data-uzu-search-clear]');
    if (!input || !clear) return;
    clear.hidden = !input.value;
    clear.setAttribute('aria-hidden', input.value ? 'false' : 'true');
  }

  function initSearches(root = document) {
    queryAll(root, '[data-uzu-search]').forEach((search) => {
      const input = search.querySelector('.uzu-search-input, input[type="search"], input[type="text"]');
      const clear = search.querySelector('[data-uzu-search-clear]');
      if (!input || !clear) return;
      setSearchClearState(search);
      if (!markInitialized(search, 'Search')) return;
      input.addEventListener('input', () => setSearchClearState(search));
      clear.addEventListener('click', () => {
        if (input.disabled || input.readOnly) return;
        input.value = '';
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new Event('change', { bubbles: true }));
        setSearchClearState(search);
        input.focus();
      });
    });
  }

  function setPasswordVisible(password, visible, emit = true) {
    const input = password.querySelector('.uzu-password-input, input[type="password"], input[type="text"]');
    const toggle = password.querySelector('[data-uzu-password-toggle]');
    if (!input || !toggle) return;
    input.type = visible ? 'text' : 'password';
    password.classList.toggle('is-visible', visible);
    toggle.setAttribute('aria-pressed', visible ? 'true' : 'false');
    if (emit) {
      password.dispatchEvent(new CustomEvent('uzu-password-toggle', {
        bubbles: true,
        detail: { visible, password, input, toggle }
      }));
    }
  }

  function initPasswords(root = document) {
    queryAll(root, '[data-uzu-password]').forEach((password) => {
      const input = password.querySelector('.uzu-password-input, input[type="password"], input[type="text"]');
      const toggle = password.querySelector('[data-uzu-password-toggle]');
      if (!input || !toggle) return;
      setPasswordVisible(password, input.type === 'text', false);
      if (!markInitialized(password, 'Password')) return;
      toggle.addEventListener('click', () => {
        if (input.disabled || toggle.disabled || toggle.getAttribute('aria-disabled') === 'true') return;
        setPasswordVisible(password, input.type !== 'text');
      });
    });
  }

  function getStepperInput(stepper) {
    return stepper.querySelector('.uzu-stepper-input, input[type="number"]');
  }

  function getNumberAttribute(input, name, fallback) {
    const value = Number.parseFloat(input.getAttribute(name));
    return Number.isFinite(value) ? value : fallback;
  }

  function getInputNumber(input) {
    const value = Number.parseFloat(input.value);
    return Number.isFinite(value) ? value : 0;
  }

  function clampNumber(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function getStepPrecision(step) {
    const text = String(step);
    if (/e/i.test(text)) {
      const fixed = Number(step).toFixed(12).replace(/0+$/, '');
      const fixedIndex = fixed.indexOf('.');
      return fixedIndex === -1 ? 0 : fixed.length - fixedIndex - 1;
    }
    const index = text.indexOf('.');
    return index === -1 ? 0 : text.length - index - 1;
  }

  function syncStepperDisabled(stepper) {
    const input = getStepperInput(stepper);
    if (!input) return;
    const min = getNumberAttribute(input, 'min', Number.NEGATIVE_INFINITY);
    const max = getNumberAttribute(input, 'max', Number.POSITIVE_INFINITY);
    const value = getInputNumber(input);
    queryAll(stepper, '[data-uzu-stepper-decrement]').forEach((button) => {
      button.disabled = input.disabled || value <= min;
    });
    queryAll(stepper, '[data-uzu-stepper-increment]').forEach((button) => {
      button.disabled = input.disabled || value >= max;
    });
  }

  function setStepperValue(stepper, nextValue, emit = true) {
    const input = getStepperInput(stepper);
    if (!input) return;
    const min = getNumberAttribute(input, 'min', Number.NEGATIVE_INFINITY);
    const max = getNumberAttribute(input, 'max', Number.POSITIVE_INFINITY);
    const step = Math.abs(getNumberAttribute(input, 'step', 1)) || 1;
    const precision = getStepPrecision(step);
    const clamped = clampNumber(nextValue, min, max);
    input.value = Number.isFinite(clamped) ? clamped.toFixed(precision).replace(/\.?0+$/, '') : String(nextValue);
    syncStepperDisabled(stepper);
    if (emit) {
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new Event('change', { bubbles: true }));
      stepper.dispatchEvent(new CustomEvent('uzu-stepper-change', {
        bubbles: true,
        detail: { value: input.value, number: getInputNumber(input), stepper, input }
      }));
    }
  }

  function stepStepper(stepper, direction) {
    const input = getStepperInput(stepper);
    if (!input || input.disabled || input.readOnly) return;
    const step = Math.abs(getNumberAttribute(input, 'step', 1)) || 1;
    setStepperValue(stepper, getInputNumber(input) + step * direction);
    input.focus();
  }

  function initSteppers(root = document) {
    queryAll(root, '[data-uzu-stepper]').forEach((stepper) => {
      const input = getStepperInput(stepper);
      if (!input) return;
      syncStepperDisabled(stepper);
      if (!markInitialized(stepper, 'Stepper')) return;
      queryAll(stepper, '[data-uzu-stepper-decrement]').forEach((button) => {
        button.addEventListener('click', () => stepStepper(stepper, -1));
      });
      queryAll(stepper, '[data-uzu-stepper-increment]').forEach((button) => {
        button.addEventListener('click', () => stepStepper(stepper, 1));
      });
      input.addEventListener('input', () => syncStepperDisabled(stepper));
      input.addEventListener('change', () => setStepperValue(stepper, getInputNumber(input), false));
    });
  }

  function syncSliderValue(slider) {
    if (!slider || !('value' in slider)) return;
    const min = Number.parseFloat(slider.min || '0');
    const max = Number.parseFloat(slider.max || '100');
    const value = Number.parseFloat(slider.value || '0');
    const range = max - min;
    const percent = range ? ((value - min) / range) * 100 : 0;
    slider.style.setProperty('--uzu-slider-value', `${Math.min(100, Math.max(0, percent))}%`);
  }

  function initSliders(root = document) {
    queryAll(root, '[data-uzu-slider], .uzu-slider').forEach((slider) => {
      if (!(slider instanceof HTMLInputElement) || slider.type !== 'range') return;
      syncSliderValue(slider);
      if (!markInitialized(slider, 'Slider')) return;
      slider.addEventListener('input', () => syncSliderValue(slider));
      slider.addEventListener('change', () => syncSliderValue(slider));
    });
  }
