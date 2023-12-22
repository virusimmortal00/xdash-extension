import { addMappingRow } from './addMappingRow';
import { saveMappings } from './saveMappings';
import { inputChangeListener } from './inputChangeListener';
import { selectImage } from './selectImage';
import { unsavedChangesMsg } from './saveMappings';
import {
  customImageUrlInput,
  customImagePreview,
} from './loadOrSetDefaultImage';
import { extensionStatusCheckbox } from '../../popup';
import { buttonConfigs } from './verticals'; 

export function setEventListeners() {
  console.log('Setting event listeners');
  const addMediaSourceButton = document.getElementById(
    'addMediaSource'
  ) as HTMLButtonElement;
  const addInAppEventButton = document.getElementById(
    'addInAppEvent'
  ) as HTMLButtonElement;
  const saveButton = document.getElementById('save') as HTMLButtonElement;

  addMediaSourceButton.addEventListener('click', () =>
    addMappingRow('mediaSources', '', '')
  );
  addInAppEventButton.addEventListener('click', () =>
    addMappingRow('inAppEvents', '', '')
  );
  saveButton.addEventListener('click', saveMappings);
  extensionStatusCheckbox.addEventListener('change', inputChangeListener);

  customImageUrlInput.addEventListener('input', () => {
    const url = customImageUrlInput.value || ''; // Ensure url is a string
    selectImage(url, !!url);
    if (url) {
      customImagePreview.innerHTML = `<img src="${url}" class="preview-image">`;
      customImagePreview.style.border = '2px solid green';
      customImagePreview.style.display = 'block';
    } else {
      customImagePreview.innerHTML = '';
      customImagePreview.style.border = 'none';
      customImagePreview.style.display = 'none';
    }
    unsavedChangesMsg.style.display = 'block'; // Show unsaved changes message for custom URL changes
  });

  function onPresetButtonClick(event: Event) {
    // Remove 'active' class from all preset buttons
    document.querySelectorAll('.preset-button').forEach((button) => {
      button.classList.remove('active');
    });

    // Add 'active' class to the clicked button
    const clickedButton = event.currentTarget as HTMLButtonElement;
    clickedButton.classList.add('active');

    // Get the config for the clicked button
    const config =
      buttonConfigs[clickedButton.id as keyof typeof buttonConfigs];
    if (config) {
      // Select the appropriate image
      if (config.iconUrl) {
        selectImage(config.iconUrl);
      }

      // Clear all in-app event mappings
      const inAppEventsDiv = document.getElementById(
        'inAppEvents'
      ) as HTMLDivElement;
      if (inAppEventsDiv) {
        inAppEventsDiv.innerHTML = '';
      }

      // Add mappings for the selected button
      config.mappings?.forEach((mapping) => {
        addMappingRow(mapping.section, mapping.original, mapping.newText);
      });
    }
  }

  // Add event listeners to preset buttons
  const presetButtons = document.querySelectorAll('.preset-button');
  presetButtons.forEach((button) => {
    button.addEventListener('click', onPresetButtonClick);
  });

  // Ensure the default active button is set
  const defaultActiveButton = document.getElementById(
    'button-custom'
  ) as HTMLButtonElement;
  if (defaultActiveButton) {
    defaultActiveButton.classList.add('active');
  }

  document.querySelectorAll('.image-option').forEach((img) => {
    img.addEventListener('click', () => {
      const imgUrl = img.getAttribute('src') || ''; // Ensure imgUrl is a string
      console.log('Predefined image option clicked:', imgUrl);
      selectImage(imgUrl);
      customImageUrlInput.value = '';
      unsavedChangesMsg.style.display = 'block'; // Show unsaved changes message for image selection
    });
  });
}
