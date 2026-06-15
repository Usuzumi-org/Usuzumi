function assertHardEditFocusProbe(probe, label) {
if (!probe || !probe.active) throw new Error(`Browser consumer ${label} did not receive focus`);
if (probe.boxShadow !== 'none' || probe.targetBoxShadow !== 'none') throw new Error(`Browser consumer ${label} focus should not use a blurred or outer shadow ring: ${JSON.stringify(probe)}`);
if (!probe.borderColor || probe.borderColor === probe.beforeBorderColor) throw new Error(`Browser consumer ${label} focus should strengthen a hard border: ${JSON.stringify(probe)}`);
if (probe.editFocusBorderColor && probe.borderColor !== probe.editFocusBorderColor) throw new Error(`Browser consumer ${label} focus should use the edit focus border token: ${JSON.stringify(probe)}`);
if (probe.fgStrongColor && probe.borderColor === probe.fgStrongColor) throw new Error(`Browser consumer ${label} focus should not reuse the strong text color as its edit border: ${JSON.stringify(probe)}`);
}

function assertAttachedControlFocusProbe(probe, label) {
if (!probe || !probe.active) throw new Error(`Browser consumer ${label} did not receive focus`);
if (probe.borderColor !== probe.beforeBorderColor || probe.boxShadow !== 'none') throw new Error(`Browser consumer ${label} focus should not strengthen the outer edit border: ${JSON.stringify(probe)}`);
if (probe.targetBoxShadow !== 'none') throw new Error(`Browser consumer ${label} focus should not use a blurred or outer shadow ring: ${JSON.stringify(probe)}`);
if (probe.outlineStyle !== 'solid' || Number.parseFloat(probe.outlineWidth) < 1) throw new Error(`Browser consumer ${label} focus should keep a local hard outline: ${JSON.stringify(probe)}`);
if (probe.editFocusBorderColor && probe.outlineColor !== probe.editFocusBorderColor) throw new Error(`Browser consumer ${label} focus outline should use the edit focus border token: ${JSON.stringify(probe)}`);
if (probe.fgStrongColor && probe.outlineColor === probe.fgStrongColor) throw new Error(`Browser consumer ${label} focus outline should not reuse the strong text color: ${JSON.stringify(probe)}`);
}

function isTransparent(value) {
return value === 'rgba(0, 0, 0, 0)' || value === 'transparent';
}

export function assertConsumerFormsLayoutResult(value) {
if (value.calloutBorderStyle === 'none') throw new Error('Browser consumer CSS did not style callouts');
if (value.calloutBorderColor !== 'rgb(10, 20, 30)' || value.calloutBackground !== 'rgb(240, 241, 242)') throw new Error('Browser consumer callout color variables did not apply');
if (value.calloutTitleColor !== 'rgb(30, 40, 50)' || value.calloutBodyColor !== 'rgb(60, 70, 80)') throw new Error('Browser consumer callout text color variables did not apply');
if (Number.parseFloat(value.calloutSignatureFontSize) < 100) throw new Error(`Browser consumer callout should not shrink explicit signature typography: ${JSON.stringify({ fontSize: value.calloutSignatureFontSize, lineHeight: value.calloutSignatureLineHeight })}`);
if (value.alertAccentColor !== 'rgb(10, 20, 30)' || value.alertBackground !== 'rgb(240, 241, 242)') throw new Error('Browser consumer alert color variables did not apply');
if (value.alertTitleColor !== 'rgb(30, 40, 50)' || value.alertBodyColor !== 'rgb(60, 70, 80)') throw new Error('Browser consumer alert text color variables did not apply');
if (value.alertSuccessAccentColor !== 'rgb(78, 102, 85)') throw new Error('Browser consumer success alert preset did not apply');
if (value.alertWarningAccentColor !== 'rgb(123, 104, 66)') throw new Error('Browser consumer warning alert preset did not apply');
if (Math.round(value.alertWidth) !== 420) throw new Error('Browser consumer alert max-width variable did not apply');
if (Math.round(value.alertSuccessWidth) !== 520) throw new Error('Browser consumer alert default max width did not apply');
if (value.stackDisplay !== 'flex' || value.flexDisplay !== 'flex') throw new Error('Browser consumer layout primitives did not use flex layout');
if (value.topbarDisplay !== 'flex' || value.topbarNavFlexGrow !== '1' || value.topbarActionsDisplay !== 'flex' || value.topbarActionsFlexShrink !== '0') throw new Error('Browser consumer topbar slots did not use the public flex contract');
if (value.topbarMarginBottom !== '0px' || value.topbarGap !== '30px' || value.topbarActionsGap !== '10px') throw new Error('Browser consumer topbar variables did not apply');
if (!value.topbarActionsAlignedRight) throw new Error('Browser consumer topbar actions should stay at the topbar end');
if (value.centeredFlexJustify !== 'center') throw new Error('Browser consumer centered section did not center direct flex action rows');
if (value.centeredFlexBetweenJustify !== 'space-between') throw new Error('Browser consumer centered section should not override explicit flex distribution utilities');
if (!value.aspectRatio.includes('2 / 1') || value.scrollAreaMaxHeight !== '64px') throw new Error('Browser consumer layout primitive variables did not apply');
if (value.localScrollThumbTokenIdle !== 'transparent') throw new Error(`Browser consumer local scroll thumb should be hidden while idle: ${value.localScrollThumbTokenIdle}`);
if (!value.localScrollFocusActive || !['var(--uzu-border)', '#dad9d5', 'rgb(218, 217, 213)'].includes(value.localScrollThumbTokenFocused)) throw new Error(`Browser consumer local scroll thumb should be visible while focused: ${JSON.stringify({ active: value.localScrollFocusActive, token: value.localScrollThumbTokenFocused })}`);
if (!Array.isArray(value.scrollbarButtonProbe) || value.scrollbarButtonProbe.length !== 5) throw new Error('Browser consumer scrollbar probe did not inspect all key public scroll surfaces');
for (const probe of value.scrollbarButtonProbe) {
if (probe.standardScrollbarWidth === 'thin') throw new Error(`Browser consumer Chromium scroll surface should use WebKit scrollbar styling instead of standard thin scrollbars: ${JSON.stringify(probe)}`);
if (
  probe.buttonDisplay !== 'none'
  || probe.buttonWidth !== '0px'
  || probe.buttonHeight !== '0px'
  || (probe.buttonBackgroundImage !== 'none' && probe.buttonBackgroundImage !== '')
  || (probe.buttonColor !== 'rgba(0, 0, 0, 0)' && probe.buttonColor !== 'transparent')
) throw new Error(`Browser consumer WebKit scrollbar arrow button is not fully hidden: ${JSON.stringify(probe)}`);
if (Number.parseFloat(probe.thumbMinWidth) < 24 || Number.parseFloat(probe.thumbMinHeight) < 24) throw new Error(`Browser consumer scrollbar thumb can collapse into a triangular arrow-like shape: ${JSON.stringify(probe)}`);
}
if (value.formDisplay !== 'grid' || value.inputGroupDisplay !== 'flex') throw new Error('Browser consumer form primitives did not apply');
if (value.inputGroupBorderWidth !== '1px' || value.inputGroupInputBorderWidth !== '0px' || value.inputGroupBorderRadius === '0px') throw new Error('Browser consumer input group should use one outer rounded border');
if (value.inputGroupFocusedBorderColor === value.inputGroupBorderColor || value.inputGroupFocusedBoxShadow !== 'none' || value.inputGroupFocusedInputBoxShadow !== 'none') throw new Error('Browser consumer input group focus should strengthen the group border without a blurred ring or inner input ring');
assertAttachedControlFocusProbe({
  active: value.inputGroupCurrencyTriggerFocusedActive,
  beforeBorderColor: value.inputGroupBorderColor,
  borderColor: value.inputGroupCurrencyTriggerFocusedBorderColor,
  boxShadow: value.inputGroupCurrencyTriggerFocusedBoxShadow,
  targetBoxShadow: value.inputGroupCurrencyTriggerFocusedTargetBoxShadow,
  outlineStyle: value.inputGroupCurrencyTriggerFocusedOutlineStyle,
  outlineWidth: value.inputGroupCurrencyTriggerFocusedOutlineWidth,
  outlineColor: value.inputGroupCurrencyTriggerFocusedOutlineColor,
  outlineOffset: value.inputGroupCurrencyTriggerFocusedOutlineOffset,
  editFocusBorderColor: value.plainInputFocusProbe?.editFocusBorderColor,
  fgStrongColor: value.plainInputFocusProbe?.fgStrongColor
}, 'input group selectable suffix');
assertAttachedControlFocusProbe({
  active: value.inputGroupActionFocusedActive,
  beforeBorderColor: value.inputGroupBorderColor,
  borderColor: value.inputGroupActionFocusedBorderColor,
  boxShadow: value.inputGroupActionFocusedBoxShadow,
  targetBoxShadow: value.inputGroupActionFocusedTargetBoxShadow,
  outlineStyle: value.inputGroupActionFocusedOutlineStyle,
  outlineWidth: value.inputGroupActionFocusedOutlineWidth,
  outlineColor: value.inputGroupActionFocusedOutlineColor,
  outlineOffset: value.inputGroupActionFocusedOutlineOffset,
  editFocusBorderColor: value.plainInputFocusProbe?.editFocusBorderColor,
  fgStrongColor: value.plainInputFocusProbe?.fgStrongColor
}, 'input group action');
if (value.inputGroupAddonBackground !== 'rgb(239, 238, 233)' || value.inputGroupAddonBorderRightWidth !== '0px') throw new Error('Browser consumer input group fixed addons should read as quiet attached segments');
if (value.inputGroupCurrencySelectDividerWidth !== '1px' || value.inputGroupCurrencyTriggerBorderWidth !== '0px' || value.inputGroupCurrencyTriggerBackground !== 'rgb(239, 238, 233)') throw new Error(`Browser consumer input group selectable suffix should render as an attached select segment: ${JSON.stringify({ divider: value.inputGroupCurrencySelectDividerWidth, border: value.inputGroupCurrencyTriggerBorderWidth, background: value.inputGroupCurrencyTriggerBackground })}`);
if (value.inputGroupCurrencyOpenAnimation !== 'uzu-menu-in' || value.inputGroupCurrencyMenuDisplay !== 'grid' || !value.inputGroupCurrencyMenuEscapesGroup) throw new Error(`Browser consumer input group selectable suffix menu should open outside the group shell: ${JSON.stringify({ animation: value.inputGroupCurrencyOpenAnimation, display: value.inputGroupCurrencyMenuDisplay, escapes: value.inputGroupCurrencyMenuEscapesGroup })}`);
if (value.inputGroupCurrencyValue !== 'eur' || value.inputGroupCurrencyLabel !== 'EUR' || value.inputGroupCurrencyExpandedAfterSelect !== 'false') throw new Error(`Browser consumer input group selectable suffix did not sync selected value: ${JSON.stringify({ value: value.inputGroupCurrencyValue, label: value.inputGroupCurrencyLabel, expanded: value.inputGroupCurrencyExpandedAfterSelect })}`);
for (const [label, probe] of [
  ['plain input', value.plainInputFocusProbe],
  ['textarea', value.textareaFocusProbe],
  ['search input', value.searchInputFocusProbe],
  ['password input', value.passwordInputFocusProbe],
  ['stepper', value.stepperInputFocusProbe],
  ['combobox input', value.comboboxInputFocusProbe],
  ['command input', value.commandFocusProbe]
]) assertHardEditFocusProbe(probe, label);
if (
  value.stepperShellBorderWidth !== '1px'
  || value.stepperShellBorderRadius === '0px'
  || value.stepperInputBorderWidth !== '0px'
  || value.stepperInputBoxShadow !== 'none'
  || value.stepperControlsDividerWidth !== '1px'
  || value.stepperButtonBorderWidth !== '0px'
  || !['none', ''].includes(value.stepperButtonBackdropFilter)
) throw new Error('Browser consumer stepper should render as one attached input surface without floating inner buttons');
assertAttachedControlFocusProbe({
  active: value.stepperButtonFocusedActive,
  beforeBorderColor: value.stepperBorderColor,
  borderColor: value.stepperButtonFocusedBorderColor,
  boxShadow: value.stepperButtonFocusedBoxShadow,
  targetBoxShadow: value.stepperButtonFocusedTargetBoxShadow,
  outlineStyle: value.stepperButtonFocusedOutlineStyle,
  outlineWidth: value.stepperButtonFocusedOutlineWidth,
  outlineColor: value.stepperButtonFocusedOutlineColor,
  outlineOffset: value.stepperButtonFocusedOutlineOffset,
  editFocusBorderColor: value.plainInputFocusProbe?.editFocusBorderColor,
  fgStrongColor: value.plainInputFocusProbe?.fgStrongColor
}, 'stepper button');
if (value.formInvalidBefore || value.formValidBeforeManualValidate || !value.formInvalidAfterManualValidate || value.formInvalidAfter || !value.formValidAfter) throw new Error('Browser consumer form validation sync did not work');
if (value.fileUploadBorderStyle !== 'dashed') throw new Error('Browser consumer file upload styling is missing');
if (!value.sliderAccentColor || value.sliderValueBefore !== '50%' || value.sliderValueAfter !== '75%') throw new Error('Browser consumer slider styling or value sync is missing');
if (
  value.sliderHeight !== '36px'
  || value.sliderTrackHeightToken !== '10px'
  || value.sliderThumbSizeToken !== '16px'
  || !value.sliderTrackToken
  || !value.sliderTrackBorderToken
  || !value.sliderFillColor
  || value.sliderFillColor === value.sliderEditFocusBorderColor
  || value.sliderFillColor === value.sliderActionBgColor
  || !value.sliderThumbColor
  || value.sliderThumbColor === value.sliderActionBgColor
  || !value.sliderThumbBorderColor
  || value.sliderThumbBorderColor === value.sliderFillColor
  || value.sliderBoxShadow !== 'none'
  || value.sliderFocusedBoxShadow !== 'none'
) throw new Error(`Browser consumer slider should expose a calm filled track and avoid an outer focus shadow: ${JSON.stringify({
  height: value.sliderHeight,
  trackHeight: value.sliderTrackHeightToken,
  thumbSize: value.sliderThumbSizeToken,
  track: value.sliderTrackToken,
  trackBorder: value.sliderTrackBorderToken,
  fill: value.sliderFillToken,
  thumb: value.sliderThumbToken,
  thumbBorder: value.sliderThumbBorderToken,
  fillColor: value.sliderFillColor,
  editFocusBorderColor: value.sliderEditFocusBorderColor,
  actionBgColor: value.sliderActionBgColor,
  thumbColor: value.sliderThumbColor,
  surfaceColor: value.sliderSurfaceColor,
  thumbBorderColor: value.sliderThumbBorderColor,
  shadow: value.sliderBoxShadow,
  focusShadow: value.sliderFocusedBoxShadow
})}`);
if (
  value.steppedSliderValueBefore !== '40%'
  || value.steppedSliderValueAfter !== '80%'
  || value.steppedSliderTrackHeightToken !== '10px'
  || value.steppedSliderThumbSizeToken !== '16px'
  || value.steppedSliderStepCount !== '6'
  || !value.steppedSliderStepTicks.includes('radial-gradient')
  || value.steppedSliderStepTicks === value.steppedSliderStepTicksAfter
) throw new Error(`Browser consumer stepped slider should expose discrete step dots synced to the native range value: ${JSON.stringify({
  before: value.steppedSliderValueBefore,
  after: value.steppedSliderValueAfter,
  trackHeight: value.steppedSliderTrackHeightToken,
  thumbSize: value.steppedSliderThumbSizeToken,
  stepCount: value.steppedSliderStepCount,
  ticks: value.steppedSliderStepTicks,
  ticksAfter: value.steppedSliderStepTicksAfter
})}`);
if (
  value.unevenSteppedSliderValue !== '60%'
  || value.unevenSteppedSliderStepCount !== '4'
  || !value.unevenSteppedSliderStepTicks.includes('90% 50%')
  || value.unevenSteppedSliderStepTicks.includes('100% 50%')
) throw new Error(`Browser consumer uneven stepped slider should place step dots at native values instead of stretching to 100%: ${JSON.stringify({
  value: value.unevenSteppedSliderValue,
  stepCount: value.unevenSteppedSliderStepCount,
  ticks: value.unevenSteppedSliderStepTicks
})}`);
if (value.searchClearInitiallyHidden || value.searchValueAfterClear !== '' || !value.searchClearHiddenAfterClear) throw new Error('Browser consumer search clear behavior did not work');
if (!value.searchClearHasSvg || value.searchClearText !== '') throw new Error('Browser consumer search clear button should use an icon-only affordance');
if (
  value.searchClearWidth !== '32px'
  || value.searchClearHeight !== '32px'
  || value.searchClearBorderWidth !== '0px'
  || Number.parseFloat(value.searchClearBorderRadius) > 12
  || !isTransparent(value.searchClearBackground)
  || value.searchClearBoxShadow !== 'none'
  || !['none', ''].includes(value.searchClearBackdropFilter)
) throw new Error(`Browser consumer search clear button should render as a quiet embedded input action: ${JSON.stringify({
  width: value.searchClearWidth,
  height: value.searchClearHeight,
  border: value.searchClearBorderWidth,
  radius: value.searchClearBorderRadius,
  background: value.searchClearBackground,
  shadow: value.searchClearBoxShadow,
  backdrop: value.searchClearBackdropFilter
})}`);
if (value.passwordTypeAfterToggle !== 'text' || value.passwordPressedAfterToggle !== 'true') throw new Error('Browser consumer password toggle behavior did not work');
if (!value.passwordToggleHasSvg || value.passwordToggleText !== '') throw new Error('Browser consumer password toggle should use an icon-only affordance');
if (
  value.passwordToggleWidth !== '32px'
  || value.passwordToggleHeight !== '32px'
  || value.passwordToggleBorderWidth !== '0px'
  || Number.parseFloat(value.passwordToggleBorderRadius) > 12
  || !isTransparent(value.passwordToggleBackground)
  || value.passwordToggleBoxShadow !== 'none'
  || !['none', ''].includes(value.passwordToggleBackdropFilter)
) throw new Error(`Browser consumer password toggle should render as a quiet embedded input action: ${JSON.stringify({
  width: value.passwordToggleWidth,
  height: value.passwordToggleHeight,
  border: value.passwordToggleBorderWidth,
  radius: value.passwordToggleBorderRadius,
  background: value.passwordToggleBackground,
  shadow: value.passwordToggleBoxShadow,
  backdrop: value.passwordToggleBackdropFilter
})}`);
if (value.stepperValueAfterIncrement !== '3' || !value.stepperIncrementDisabledAfterMax || value.stepperInputAppearance === 'auto') throw new Error('Browser consumer stepper behavior or appearance did not work');
}
