import { restoreDefaults } from './functions/popup/restoreDefaults';
import { addChangeListenerToInputs } from './functions/popup/addChangeListenerToInputs';
import { loadExistingMappings } from './functions/popup/loadExistingMappings';
import { loadOrSetDefaultImage } from './functions/popup/loadOrSetDefaultImage';
import { setEventListeners } from './functions/popup/setEventListeners';
import { unsavedChangesMsg } from './functions/popup/saveMappings';
import './styles/popup.scss';

interface ChromeStorageResult {
  extensionEnabled?: boolean;
}

export const extensionStatusCheckbox = document.getElementById(
  'extensionStatusCheckbox'
) as HTMLInputElement;

document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM fully loaded and parsed');

  const saveSection = document.getElementById('saveSection') as HTMLElement;
  const restoreDefaultsButton = document.getElementById(
    'restoreDefaults'
  ) as HTMLButtonElement;

  chrome.storage.sync.get(
    ['extensionEnabled'],
    (result: ChromeStorageResult) => {
      if (result.extensionEnabled === undefined) {
        chrome.storage.sync.set({ extensionEnabled: true });
        extensionStatusCheckbox.checked = true;
      } else {
        extensionStatusCheckbox.checked = result.extensionEnabled;
      }
    }
  );

  restoreDefaultsButton.addEventListener('click', restoreDefaults);
  saveSection.parentNode?.insertBefore(unsavedChangesMsg, saveSection);

  loadExistingMappings();
  loadOrSetDefaultImage();
  addChangeListenerToInputs();
  setEventListeners();
});
