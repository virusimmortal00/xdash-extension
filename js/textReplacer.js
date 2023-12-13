// textReplacer.js

export function replaceTextInElement(element) {
  chrome.storage.sync.get(["mappings"], function (result) {
    if (result.mappings && element) {
      // Preprocess mappings to create regex-replacement pairs
      const regexReplacementPairs = result.mappings
        .filter(mapping => (mapping.section === "mediaSources" || mapping.section === "inAppEvents") && mapping.newText.trim() !== "")
        .map(mapping => ({
          original: mapping.original,
          regex: new RegExp(mapping.original, "gi"),
          replacement: mapping.newText
        }));

      // Sort mappings to handle longer strings first
      regexReplacementPairs.sort((a, b) => b.original.length - a.original.length);

      const processNode = function (node) {
        if (node.nodeType === Node.TEXT_NODE) {
          regexReplacementPairs.forEach(pair => {
            node.textContent = node.textContent.replace(pair.regex, pair.replacement);
          });
        } else if (node.nodeType === Node.ELEMENT_NODE) {
          Array.from(node.childNodes).forEach(processNode);
        }
      };

      // Process each child node of the element
      Array.from(element.childNodes).forEach(processNode);
    }
  });
}
