export function assertConsumerFormsLayoutResult(value) {
if (value.calloutBorderStyle === 'none') throw new Error('Browser consumer CSS did not style callouts');
if (value.calloutBorderColor !== 'rgb(10, 20, 30)' || value.calloutBackground !== 'rgb(240, 241, 242)') throw new Error('Browser consumer callout color variables did not apply');
if (value.calloutTitleColor !== 'rgb(30, 40, 50)' || value.calloutBodyColor !== 'rgb(60, 70, 80)') throw new Error('Browser consumer callout text color variables did not apply');
if (value.alertAccentColor !== 'rgb(10, 20, 30)' || value.alertBackground !== 'rgb(240, 241, 242)') throw new Error('Browser consumer alert color variables did not apply');
if (value.alertTitleColor !== 'rgb(30, 40, 50)' || value.alertBodyColor !== 'rgb(60, 70, 80)') throw new Error('Browser consumer alert text color variables did not apply');
if (value.alertSuccessAccentColor !== 'rgb(78, 102, 85)') throw new Error('Browser consumer success alert preset did not apply');
if (value.alertWarningAccentColor !== 'rgb(123, 104, 66)') throw new Error('Browser consumer warning alert preset did not apply');
if (Math.round(value.alertWidth) !== 420) throw new Error('Browser consumer alert max-width variable did not apply');
if (Math.round(value.alertSuccessWidth) !== 520) throw new Error('Browser consumer alert default max width did not apply');
if (value.stackDisplay !== 'flex' || value.flexDisplay !== 'flex') throw new Error('Browser consumer layout primitives did not use flex layout');
if (!value.aspectRatio.includes('2 / 1') || value.scrollAreaMaxHeight !== '64px') throw new Error('Browser consumer layout primitive variables did not apply');
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
if (value.formInvalidBefore || value.formValidBeforeManualValidate || !value.formInvalidAfterManualValidate || value.formInvalidAfter || !value.formValidAfter) throw new Error('Browser consumer form validation sync did not work');
if (value.fileUploadBorderStyle !== 'dashed') throw new Error('Browser consumer file upload styling is missing');
if (!value.sliderAccentColor || value.sliderValueBefore !== '50%' || value.sliderValueAfter !== '75%') throw new Error('Browser consumer slider styling or value sync is missing');
if (value.searchClearInitiallyHidden || value.searchValueAfterClear !== '' || !value.searchClearHiddenAfterClear) throw new Error('Browser consumer search clear behavior did not work');
if (value.passwordTypeAfterToggle !== 'text' || value.passwordPressedAfterToggle !== 'true') throw new Error('Browser consumer password toggle behavior did not work');
if (value.stepperValueAfterIncrement !== '3' || !value.stepperIncrementDisabledAfterMax || value.stepperInputAppearance === 'auto') throw new Error('Browser consumer stepper behavior or appearance did not work');
}
