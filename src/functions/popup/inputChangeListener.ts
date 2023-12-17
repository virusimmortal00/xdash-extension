import { unsavedChangesMsg } from './saveMappings';

export function inputChangeListener() {
    unsavedChangesMsg.style.display = 'block';
    unsavedChangesMsg.innerText = 'Unsaved changes - make sure to save.';
    unsavedChangesMsg.style.color = 'red';
}