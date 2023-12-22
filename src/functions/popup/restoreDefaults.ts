import { defaultMediaSources, defaultInAppEvents } from './defaultMappings';
import { addMappingRow } from './addMappingRow';
import { unsavedChangesMsg } from './saveMappings';
import { selectCustomVertical } from './setEventListeners';

// Function to load default mappings
function loadDefaultMappings() {
  // Add default mappings to the UI
  defaultMediaSources.forEach((original) => {
    addMappingRow('mediaSources', original, '');
  });

  defaultInAppEvents.forEach((original) => {
    addMappingRow('inAppEvents', original, '');
  });
}

export function restoreDefaults() {
  // Remove all existing mappings
  document.querySelectorAll('.mapping-row').forEach((mappingRow) => {
    mappingRow.remove();
  });

  // Load default mappings
  loadDefaultMappings();
  selectCustomVertical();

  // Hide unsaved changes message
  //unsavedChangesMsg.style.display = 'none';
}
