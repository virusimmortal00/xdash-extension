import { addChangeListenerToInputs } from './addChangeListenerToInputs';
import { unsavedChangesMsg } from './saveMappings';

import { Mapping } from './Mapping'; // Adjust the path as necessary

export function addMappingRow(section: Mapping['section'], original: string, newText: string) {
   console.log("Adding mapping row to", section);
    const mappingDiv = document.createElement('div');
    const mediaSourcesDiv = document.getElementById('mediaSources') as HTMLDivElement;
    const inAppEventsDiv = document.getElementById('inAppEvents') as HTMLDivElement;

    if (!mediaSourcesDiv || !inAppEventsDiv) {
        console.error('Required elements not found in the document');
        return;
    }

    mappingDiv.className = 'mapping-row';
    mappingDiv.innerHTML = `
        <input type="text" class="original-text" placeholder="Original" value="${original}">
        <input type="text" class="new-text" placeholder="Replacement" value="${newText}">
        <button class="action-button remove-mapping">&#10005;</button>`;

    const removeButton = mappingDiv.querySelector('.remove-mapping') as HTMLButtonElement;
    removeButton.addEventListener('click', () => {
        mappingDiv.remove();
        unsavedChangesMsg.style.display = 'block';
    });

    if (section === 'mediaSources') {
        mediaSourcesDiv.appendChild(mappingDiv);
    } else if (section === 'inAppEvents') {
        inAppEventsDiv.appendChild(mappingDiv);
    }

    addChangeListenerToInputs();
}
