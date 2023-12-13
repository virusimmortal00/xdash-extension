// textReplacer.js

export function replaceTextInElement(element) {
  chrome.storage.sync.get(["mappings"], function (result) {
    if (result.mappings && element) {
      const mappings = result.mappings;
      element.childNodes.forEach(function (node) {
        if (node.nodeType === Node.TEXT_NODE) {
          mappings.forEach((mapping) => {
            if (
              mapping.section === "mediaSources" ||
              mapping.section === "inAppEvents"
            ) {
              const regex = new RegExp(mapping.original, "gi");
              // Check if newText is not blank before replacement
              if (mapping.newText.trim() !== "") {
                node.textContent = node.textContent.replace(
                  regex,
                  mapping.newText
                );
              }
            }
          });
        } else if (node.nodeType === Node.ELEMENT_NODE) {
          replaceTextInElement(node);
        }
      });
    }
  });
}