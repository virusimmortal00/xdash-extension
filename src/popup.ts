import { restoreDefaults } from './functions/popup/restoreDefaults';
import { addChangeListenerToInputs } from './functions/popup/addChangeListenerToInputs';
import { loadExistingMappings } from './functions/popup/loadExistingMappings';
import { loadOrSetDefaultImage } from './functions/popup/loadOrSetDefaultImage';
import { setEventListeners } from './functions/popup/setEventListeners';
import { unsavedChangesMsg } from './functions/popup/saveMappings';
import { OverlayHandler } from './functions/popup/overlayHandler';
import AnalyticsHandler from './functions/popup/analyticsHandler';

import './styles/popup.scss';

const analyticsHandler = new AnalyticsHandler();
const overlayHandler = new OverlayHandler(analyticsHandler);
export const extensionStatusCheckbox = document.getElementById('extensionStatusCheckbox') as HTMLInputElement;

let lastClickedVerticalPresetId: string | null = null;

function addAnalyticsEventListeners() {
  extensionStatusCheckbox.addEventListener('change', () => {
    const isChecked = extensionStatusCheckbox.checked;
    analyticsHandler.fireEvent('checkbox_change', { status: isChecked ? 'checked' : 'unchecked' });
    console.log('Analytics Event Fired: Active Checkbox Status Changed');
  });

  document.querySelectorAll('.image-option').forEach((image) => {
    image.addEventListener('click', () => {
      const imageSrc = (image as HTMLImageElement).src;
      analyticsHandler.fireEvent('image_option_clicked', { imageSrc });
      console.log('Analytics Event Fired: Image Option Clicked');
    });
  });

  const customImageUrlInput = document.getElementById('customImageUrl') as HTMLInputElement;
  customImageUrlInput.addEventListener('input', () => {
    const url = customImageUrlInput.value;
    analyticsHandler.fireEvent('custom_image_url_changed', { url });
    console.log('Analytics Event Fired: Custom Image URL Changed');
  });

  document.querySelectorAll('.preset-button').forEach((button) => {
    button.addEventListener('click', (event) => {
      const buttonId = (event.target as HTMLButtonElement).id;
      lastClickedVerticalPresetId = buttonId;
      analyticsHandler.fireEvent('vertical_preset_clicked', { buttonId });
      console.log('Analytics Event Fired: Vertical Preset Clicked');
    });
  });

  const saveButton = document.getElementById('save') as HTMLButtonElement | null;
  if (saveButton) {
    saveButton.addEventListener('click', () => {
      if (lastClickedVerticalPresetId) {
        analyticsHandler.fireEvent('vertical_preset_changed', { buttonId: lastClickedVerticalPresetId });
        console.log('Analytics Event Fired: Vertical Preset Changed');
      }
    });
  } else {
    console.error('Save button not found');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM fully loaded and parsed');

  overlayHandler.initializeOverlay();

  const saveSection = document.getElementById('saveSection') as HTMLElement;
  const restoreDefaultsButton = document.getElementById('restoreDefaults') as HTMLButtonElement;

  chrome.storage.sync.get(['extensionEnabled'], (result: { extensionEnabled?: boolean }) => {
    if (result.extensionEnabled === undefined) {
      // Initially, do not set extensionEnabled to true
      // It will be set to true after submitting the overlay form
      extensionStatusCheckbox.checked = false;
    } else {
      extensionStatusCheckbox.checked = result.extensionEnabled;
    }
  });

  restoreDefaultsButton.addEventListener('click', restoreDefaults);
  saveSection.parentNode?.insertBefore(unsavedChangesMsg, saveSection);

  window.addEventListener('load', () => {
    analyticsHandler.firePageViewEvent(document.title, document.location.href);
    console.log('Analytics Event Fired: Page View');
  });

  addAnalyticsEventListeners();

  loadExistingMappings();
  loadOrSetDefaultImage();
  addChangeListenerToInputs();
  setEventListeners();
});
