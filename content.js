import { createLoadingOverlay } from "./js/loadingOverlay.js";
import { replaceImage } from "./js/imageReplacer.js";
import { observeDOMChanges } from "./js/DOMObserver.js";
import { createAnimationStyles } from "./js/createAnimationStyles.js";
import { replaceTextInElement } from './js/textReplacer.js';

const url = window.location.href;

function checkExtensionStateAndRun() {
  chrome.storage.sync.get(["extensionEnabled"], function (result) {
    if (result.extensionEnabled !== false) {
      // Default to true if undefined
      console.log("Extension is enabled. Running main functions...");
      mainFunctions();
    } else {
      console.log("Extension is disabled.");
    }
  });
}

function mainFunctions() {
  console.log("Running main functions...");
  createLoadingOverlay();
  createAnimationStyles();

  let interval = setInterval(function () {
    if (document.querySelector('[class^="MuiAvatar-img"]')) {
      console.log("Starting image and text replacement process");
      replaceImage();
      replaceTextInElement(document.body);
      clearInterval(interval);
    }
  }, 2000);

  // Call this function at the end of your script
  observeDOMChanges();
}

checkExtensionStateAndRun();
