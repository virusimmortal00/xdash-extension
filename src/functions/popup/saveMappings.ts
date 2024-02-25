import { customImageUrlInput } from './loadOrSetDefaultImage';
import { extensionStatusCheckbox } from '../../popup';

interface Mapping {
  section: string;
  original: string;
  newText: string;
}

export function createUnsavedChangesMsg(): HTMLDivElement {
  const msg = document.createElement('div');
  msg.id = 'unsaved-changes-msg';
  msg.innerText = 'Unsaved changes - make sure to save.';
  return msg;
}

export const unsavedChangesMsg = createUnsavedChangesMsg();

export function saveMappings(): void {
  console.log('Save button clicked');
  const allMappings: Mapping[] = [];

  document
    .querySelectorAll('#mediaSources .mapping-row, #inAppEvents .mapping-row')
    .forEach((div) => {
      const originalInput = div.querySelector('.original-text') as HTMLInputElement;
      const newTextInput = div.querySelector('.new-text') as HTMLInputElement;
      const section = div.parentElement ? div.parentElement.id : '';

      if (originalInput && newTextInput) {
        allMappings.push({
          section,
          original: originalInput.value,
          newText: newTextInput.value,
        });
      }
    });

  let imageToSave: string;
  const selectedImageElement = document.querySelector('.image-option[style*="border: 2px solid green"]') as HTMLImageElement | null;

  if (selectedImageElement) {
    imageToSave = selectedImageElement.getAttribute('src') || 'https://web1.sa.appsflyer.com/xdash_images/af_icon_rainbow.png';
  } else if (customImageUrlInput.value) {
    imageToSave = customImageUrlInput.value;
  } else {
    imageToSave = 'https://web1.sa.appsflyer.com/xdash_images/af_icon_rainbow.png';
  }

  // Retrieve the currently active preset button's value
  const activePresetButton = document.querySelector('.preset-button.active') as HTMLButtonElement;
  const activePresetValue = activePresetButton ? activePresetButton.value : '';

  const isEnabled = extensionStatusCheckbox.checked;
  chrome.storage.sync.set({ extensionEnabled: isEnabled }, () => {
    console.log('Extension status saved:', isEnabled);
  });

  // Save mappings, selected image, and active preset button state
  chrome.storage.sync.set(
    { mappings: allMappings, selectedImage: imageToSave, activePreset: activePresetValue },
    () => {
      console.log(
        'Mappings, selected image, and active preset button state saved:',
        allMappings,
        imageToSave,
        activePresetValue
      );
      unsavedChangesMsg.innerText = 'Changes saved!';
      unsavedChangesMsg.style.color = 'green';
      unsavedChangesMsg.style.display = 'block';
      document.body.classList.remove('body-border-alert');
      document.body.classList.add('body-border-good');

      setTimeout(() => {
        unsavedChangesMsg.style.display = 'none';
        document.body.classList.remove('body-border-good');
      }, 2000);
    }
  );
}
