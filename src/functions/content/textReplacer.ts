interface Mapping {
  section: string;
  original: string;
  newText: string;
}

export function replaceTextInElement(element: Node): void {
  chrome.storage.sync.get(['mappings'], (result: { [key: string]: any }) => {
    // Check if the extension context is still valid
    if (chrome.runtime.lastError) {
      console.error('Extension context has been invalidated.');
      return;
    }

    const mappings: Mapping[] = result.mappings;
    if (mappings && element) {
      let regexReplacementPairs = mappings
        .filter(
          (mapping) =>
            (mapping.section === 'mediaSources' ||
              mapping.section === 'inAppEvents') &&
            mapping.newText.trim() !== ''
        )
        .map((mapping) => ({
          original: mapping.original,
          regex: new RegExp(mapping.original, 'gi'),
          replacement: mapping.newText,
        }));

      // Add new hardcoded mapping
      regexReplacementPairs.push({
        original: 'AppsFlyer gaming app',
        regex: new RegExp('AppsFlyer gaming app', 'gi'),
        replacement: 'xDash demo app',
      });

      regexReplacementPairs.sort(
        (a, b) => b.original.length - a.original.length
      );

      const processNode = (node: Node): void => {
        if (node.nodeType === Node.TEXT_NODE) {
          regexReplacementPairs.forEach((pair) => {
            const nodeText = node.textContent ?? '';
            if (nodeText.includes(pair.original) && !nodeText.includes(pair.replacement)) {
              node.textContent = nodeText.replace(pair.regex, pair.replacement);
            }
          });
        } else if (
          node.nodeType === Node.ELEMENT_NODE &&
          node.hasChildNodes()
        ) {
          node.childNodes.forEach(processNode);
        }
      };

      element.childNodes.forEach(processNode);
    }
  });
}
