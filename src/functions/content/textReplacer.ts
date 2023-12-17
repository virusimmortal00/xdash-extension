interface Mapping {
  section: string;
  original: string;
  newText: string;
}

export function replaceTextInElement(element: Node): void {
  chrome.storage.sync.get(["mappings"], (result: { [key: string]: any }) => {
    const mappings: Mapping[] = result.mappings;
    if (mappings && element) {
      const regexReplacementPairs = mappings
        .filter(mapping => (mapping.section === "mediaSources" || mapping.section === "inAppEvents") && mapping.newText.trim() !== "")
        .map(mapping => ({
          original: mapping.original,
          regex: new RegExp(mapping.original, "gi"),
          replacement: mapping.newText
        }));

      regexReplacementPairs.sort((a, b) => b.original.length - a.original.length);

      const processNode = (node: Node): void => {
        if (node.nodeType === Node.TEXT_NODE) {
          regexReplacementPairs.forEach(pair => {
            node.textContent = (node.textContent ?? '').replace(pair.regex, pair.replacement);
          });
        } else if (node.nodeType === Node.ELEMENT_NODE && node.hasChildNodes()) {
          node.childNodes.forEach(processNode);
        }
      };

      element.childNodes.forEach(processNode);
    }
  });
}
