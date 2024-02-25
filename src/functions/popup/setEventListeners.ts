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

const UNSAVED_CHANGES_TEXT: string = 'Unsaved changes - make sure to save!';
const DISPLAY_BLOCK: string = 'block';
const COLOR_RED: string = 'red';
const COLOR_GREEN: string = '2px solid green';
const COLOR_NONE: string = 'none';
const DISPLAY_NONE: string = 'none';

function setUnsavedChangesMessage(text: string, display: string, color: string): void {
  unsavedChangesMsg.innerText = text;
  unsavedChangesMsg.style.display = display;
  unsavedChangesMsg.style.color = color;
}

function updateCustomImagePreview(url: string, display: string, border: string): void {
  customImagePreview.innerHTML = url ? `<img src="${url}" class="preview-image">` : '';
  customImagePreview.style.border = url ? border : COLOR_NONE;
  customImagePreview.style.display = url ? display : DISPLAY_NONE;
}

export function selectCustomVertical(): void {
  const customButton = document.getElementById('button-custom') as HTMLButtonElement;
  customButton?.click();  // Programmatically click the 'custom' button
}

export function setEventListeners(): void {
  console.log('Setting event listeners');
  const addMediaSourceButton = document.getElementById('addMediaSource') as HTMLButtonElement;
  const addInAppEventButton = document.getElementById('addInAppEvent') as HTMLButtonElement;
  const saveButton = document.getElementById('save') as HTMLButtonElement;

  addMediaSourceButton.addEventListener('click', () => addMappingRow('mediaSources', '', ''));
  addInAppEventButton.addEventListener('click', () => addMappingRow('inAppEvents', '', ''));
  saveButton.addEventListener('click', saveMappings);
  extensionStatusCheckbox.addEventListener('change', inputChangeListener);

  customImageUrlInput.addEventListener('input', () => {
    const url = customImageUrlInput.value || '';
    selectImage(url, !!url);
    updateCustomImagePreview(url, DISPLAY_BLOCK, COLOR_GREEN);
    setUnsavedChangesMessage(UNSAVED_CHANGES_TEXT, DISPLAY_BLOCK, COLOR_RED);
    selectCustomVertical();
  });

  function onPresetButtonClick(event: Event): void {
    document.querySelectorAll('.preset-button').forEach(button => button.classList.remove('active'));
    const clickedButton = event.currentTarget as HTMLButtonElement;
    clickedButton.classList.add('active');

    const config = buttonConfigs[clickedButton.id as keyof typeof buttonConfigs];
    if (config) {
      if (config.iconUrl) {
        selectImage(config.iconUrl);
      }

      const inAppEventsDiv = document.getElementById('inAppEvents') as HTMLDivElement;
      inAppEventsDiv.innerHTML = '';

      config.mappings?.forEach(mapping => addMappingRow(mapping.section, mapping.original, mapping.newText));
    }
    setUnsavedChangesMessage(UNSAVED_CHANGES_TEXT, DISPLAY_BLOCK, COLOR_RED);
    document.body.classList.add('body-border-alert');
  }

  const presetButtons = document.querySelectorAll('.preset-button');
  presetButtons.forEach(button => button.addEventListener('click', onPresetButtonClick));

  const defaultActiveButton = document.getElementById('button-custom') as HTMLButtonElement;
  defaultActiveButton?.classList.add('active');

  document.querySelectorAll('.image-option').forEach(img => {
    img.addEventListener('click', () => {
      const imgUrl = img.getAttribute('src') || '';
      console.log('Predefined image option clicked:', imgUrl);
      selectImage(imgUrl);
      customImageUrlInput.value = '';
      setUnsavedChangesMessage(UNSAVED_CHANGES_TEXT, DISPLAY_BLOCK, COLOR_RED);
      selectCustomVertical();
    });
  });

  document.querySelectorAll('#mediaSources input, #inAppEvents input').forEach(input => {
    input.addEventListener('input', () => {
      setUnsavedChangesMessage(UNSAVED_CHANGES_TEXT, DISPLAY_BLOCK, COLOR_RED);
      selectCustomVertical();
    });
  });
}
