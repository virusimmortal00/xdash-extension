import { addMappingRow } from './addMappingRow';
import { defaultMediaSources, defaultInAppEvents } from './defaultMappings';
import { Mapping } from './Mapping'; // Adjust the path as necessary

export function loadExistingMappings() {
  console.log('Loading existing mappings');

  chrome.storage.sync.get(['mappings'], (result: any) => {
    const mappings: Mapping[] = result.mappings || [];
    if (mappings.length > 0) {
      console.log('Saved mappings found:', mappings);
      mappings.forEach((mapping) => {
        addMappingRow(mapping.section, mapping.original, mapping.newText);
      });
    } else {
      console.log('No saved mappings found. Adding default mappings.');
      defaultMediaSources.forEach((original) => {
        addMappingRow('mediaSources', original, '');
      });
      defaultInAppEvents.forEach((original) => {
        addMappingRow('inAppEvents', original, '');
      });
    }
  });
}
