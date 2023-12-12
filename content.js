import { createLoadingOverlay, removeLoadingOverlay } from './js/loadingOverlay.js';
import { replaceImage } from './js/imageReplacer.js';
import { replaceTextInElement } from './js/textReplacer.js';
import { observeDOMChanges } from './js/DOMObserver.js';

const url = window.location.href;

console.log("Content script loaded");

function checkExtensionStateAndRun() {
    chrome.storage.sync.get(["extensionEnabled"], function (result) {
        if (result.extensionEnabled !== false) { // Default to true if undefined
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
    // Add keyframes for spin and color change animations
    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = `
    @keyframes spin {
        0% { transform: rotate(0deg); }
        50% { transform: rotate(180deg); }
        100% { transform: rotate(360deg); }
    }
    @keyframes colorChange {
        0% { border-top-color: #3498db; }
        33% { border-top-color: #e74c3c; }
        66% { border-top-color: #2ecc71; }
        100% { border-top-color: #3498db; }
    }`;
    document.head.appendChild(styleSheet);

    // Replace images and text depending on the URL
    if (url.includes('id1510243350') || url.includes('com.appsflyer.android.demo.app.gaming')) {
        let interval = setInterval(function () {
            if (document.querySelector(".MuiAvatar-img")) {
                console.log("Starting image and text replacement process");
                replaceImage();
                replaceTextInElement(document.body);
                clearInterval(interval);
            }
        }, 2000);
    }

    // Other conditional checks for different URLs can be added here

    // Observe DOM changes for dynamic content
    observeDOMChanges();

    // Remove the loading overlay when the necessary operations are complete
    // This might need to be called inside replaceImage and replaceTextInElement
    // depending on when those operations complete
    removeLoadingOverlay();
}

checkExtensionStateAndRun();