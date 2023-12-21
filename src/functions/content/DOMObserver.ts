// DOMObserver.js
import { replaceTextInElement } from './textReplacer';

export function observeDOMChanges() {
  const observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          replaceTextInElement(node);
        }
      });
    });
  });

  const config = { childList: true, subtree: true };
  observer.observe(document.body, config);
}
