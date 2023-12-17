import { addMappingRow } from './addMappingRow';
import { saveMappings } from './saveMappings';
import { inputChangeListener } from './inputChangeListener';
import { selectImage } from './selectImage';
import { unsavedChangesMsg } from './saveMappings';
import { customImageUrlInput, customImagePreview } from './loadOrSetDefaultImage';
import { extensionStatusCheckbox } from '../../popup';

export function setEventListeners() {
    console.log("Setting event listeners");
    const addMediaSourceButton = document.getElementById('addMediaSource') as HTMLButtonElement;
    const addInAppEventButton = document.getElementById('addInAppEvent') as HTMLButtonElement;
    const saveButton = document.getElementById('save') as HTMLButtonElement;

    addMediaSourceButton.addEventListener('click', () => addMappingRow('mediaSources', '', ''));
    addInAppEventButton.addEventListener('click', () => addMappingRow('inAppEvents', '', ''));
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

    document.querySelectorAll('.image-option').forEach(img => {
        img.addEventListener('click', () => {
            const imgUrl = img.getAttribute('src') || ''; // Ensure imgUrl is a string
            console.log("Predefined image option clicked:", imgUrl);
            selectImage(imgUrl);
            customImageUrlInput.value = '';
            unsavedChangesMsg.style.display = 'block'; // Show unsaved changes message for image selection
        });
    });
}
