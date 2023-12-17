/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/functions/content/DOMObserver.ts":
/*!**********************************************!*\
  !*** ./src/functions/content/DOMObserver.ts ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   observeDOMChanges: () => (/* binding */ observeDOMChanges)
/* harmony export */ });
/* harmony import */ var _textReplacer__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./textReplacer */ "./src/functions/content/textReplacer.ts");
// DOMObserver.js

function observeDOMChanges() {
    const observer = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
            mutation.addedNodes.forEach((node) => {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    (0,_textReplacer__WEBPACK_IMPORTED_MODULE_0__.replaceTextInElement)(node);
                }
            });
        });
    });
    const config = { childList: true, subtree: true };
    observer.observe(document.body, config);
}


/***/ }),

/***/ "./src/functions/content/createAnimationStyles.ts":
/*!********************************************************!*\
  !*** ./src/functions/content/createAnimationStyles.ts ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createAnimationStyles: () => (/* binding */ createAnimationStyles)
/* harmony export */ });
function createAnimationStyles() {
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
}


/***/ }),

/***/ "./src/functions/content/imageReplacer.ts":
/*!************************************************!*\
  !*** ./src/functions/content/imageReplacer.ts ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   replaceImage: () => (/* binding */ replaceImage)
/* harmony export */ });
/* harmony import */ var _loadingOverlay__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./loadingOverlay */ "./src/functions/content/loadingOverlay.ts");

function replaceImage() {
    console.log("Attempting to replace images");
    chrome.storage.sync.get(["selectedImage"], (result) => {
        // Provide a default image URL if selectedImage is undefined
        let imageToUse = result.selectedImage || chrome.runtime.getURL("icons/af_icon_rainbow.png");
        console.log(`Image to use: ${imageToUse}`);
        // Convert local image path to a web-accessible URL if it's from the icons directory
        if (imageToUse.startsWith('icons/')) {
            imageToUse = chrome.runtime.getURL(imageToUse);
        }
        const selector = window.location.href.includes("onelink") ?
            '[class^="onelink-MuiAvatar-img"]' : // For OneLink
            '[class^="MuiAvatar-img"]'; // For other URLs
        const images = document.querySelectorAll(selector);
        let imagesChanged = 0;
        const totalImages = images.length;
        console.log(`Found ${totalImages} images for replacement with '${imageToUse}'`);
        if (totalImages === 0) {
            (0,_loadingOverlay__WEBPACK_IMPORTED_MODULE_0__.removeLoadingOverlay)();
            return;
        }
        images.forEach((img, index) => {
            img.onload = () => {
                console.log(`Image ${index} loaded: ${img.src}`);
                imagesChanged++;
                if (imagesChanged === totalImages) {
                    console.log("All images loaded, removing overlay");
                    (0,_loadingOverlay__WEBPACK_IMPORTED_MODULE_0__.removeLoadingOverlay)();
                }
            };
            img.onerror = () => {
                console.log(`Error loading image ${index}`);
            };
            img.src = imageToUse;
        });
        // Fallback mechanism
        setTimeout(() => {
            if (imagesChanged !== totalImages) {
                console.log("Fallback: Removing overlay");
                (0,_loadingOverlay__WEBPACK_IMPORTED_MODULE_0__.removeLoadingOverlay)();
            }
        }, 5000); // Adjust the timeout as necessary
    });
}


/***/ }),

/***/ "./src/functions/content/loadingOverlay.ts":
/*!*************************************************!*\
  !*** ./src/functions/content/loadingOverlay.ts ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createLoadingOverlay: () => (/* binding */ createLoadingOverlay),
/* harmony export */   removeLoadingOverlay: () => (/* binding */ removeLoadingOverlay)
/* harmony export */ });
function createLoadingOverlay() {
    console.log("Creating loading overlay");
    let overlay = document.createElement("div");
    let spinner = document.createElement("div");
    let message = document.createElement("div");
    // Overlay styling
    overlay.id = "my-extension-loading-overlay";
    overlay.style.position = "fixed";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "100%";
    overlay.style.height = "100%";
    overlay.style.backgroundColor = "#FFFFFF";
    overlay.style.display = "flex";
    overlay.style.flexDirection = "column";
    overlay.style.justifyContent = "center";
    overlay.style.alignItems = "center";
    overlay.style.zIndex = "1000";
    // Spinner styling
    spinner.id = "my-extension-spinner";
    spinner.style.border = "8px solid #f3f3f3"; // Light grey for the base
    spinner.style.borderTop = "8px solid #3498db"; // Initial color
    spinner.style.borderRadius = "50%";
    spinner.style.width = "60px";
    spinner.style.height = "60px";
    spinner.style.animation = "spin 3s infinite, colorChange 3s infinite";
    // Message styling
    message.id = "my-extension-message";
    message.innerText = "xDash Creation In Process";
    message.style.fontSize = "20px";
    message.style.color = "#333333";
    message.style.fontWeight = "bold";
    message.style.marginTop = "20px";
    message.style.fontFamily = "Museo, sans-serif";
    overlay.appendChild(spinner);
    overlay.appendChild(message);
    document.body.appendChild(overlay);
    // Dynamic message updates
    const messages = [
        "Life is like a box of chocolates, but with less SKAN.",
        "Grounding up some fresh attribution.",
        "Compiling our deepest darkest secrets.",
        "Mo' ROAS, mo' problems.",
        "I'm sure some of these numbers are right...",
        "Pre-heating the deep links.",
        "Attribution is our favorite kind of 'bution.",
    ];
    // Shuffle messages
    for (let i = messages.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [messages[i], messages[j]] = [messages[j], messages[i]];
    }
    let messageIndex = 0;
    message.innerText = messages[messageIndex]; // Set initial random message
    setInterval(() => {
        messageIndex = (messageIndex + 1) % messages.length;
        message.innerText = messages[messageIndex];
    }, 1500); // Change message every second
    console.log("Loading overlay created");
}
function removeLoadingOverlay() {
    //console.log("Attempting to remove loading overlay");
    let overlay = document.getElementById("my-extension-loading-overlay");
    if (overlay) {
        overlay.remove();
        console.log("Loading overlay removed");
    }
    else {
        console.log("Loading overlay not found");
    }
}


/***/ }),

/***/ "./src/functions/content/textReplacer.ts":
/*!***********************************************!*\
  !*** ./src/functions/content/textReplacer.ts ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   replaceTextInElement: () => (/* binding */ replaceTextInElement)
/* harmony export */ });
function replaceTextInElement(element) {
    chrome.storage.sync.get(["mappings"], (result) => {
        const mappings = result.mappings;
        if (mappings && element) {
            const regexReplacementPairs = mappings
                .filter(mapping => (mapping.section === "mediaSources" || mapping.section === "inAppEvents") && mapping.newText.trim() !== "")
                .map(mapping => ({
                original: mapping.original,
                regex: new RegExp(mapping.original, "gi"),
                replacement: mapping.newText
            }));
            regexReplacementPairs.sort((a, b) => b.original.length - a.original.length);
            const processNode = (node) => {
                if (node.nodeType === Node.TEXT_NODE) {
                    regexReplacementPairs.forEach(pair => {
                        var _a;
                        node.textContent = ((_a = node.textContent) !== null && _a !== void 0 ? _a : '').replace(pair.regex, pair.replacement);
                    });
                }
                else if (node.nodeType === Node.ELEMENT_NODE && node.hasChildNodes()) {
                    node.childNodes.forEach(processNode);
                }
            };
            element.childNodes.forEach(processNode);
        }
    });
}


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!************************!*\
  !*** ./src/content.ts ***!
  \************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _functions_content_loadingOverlay__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./functions/content/loadingOverlay */ "./src/functions/content/loadingOverlay.ts");
/* harmony import */ var _functions_content_imageReplacer__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./functions/content/imageReplacer */ "./src/functions/content/imageReplacer.ts");
/* harmony import */ var _functions_content_DOMObserver__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./functions/content/DOMObserver */ "./src/functions/content/DOMObserver.ts");
/* harmony import */ var _functions_content_createAnimationStyles__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./functions/content/createAnimationStyles */ "./src/functions/content/createAnimationStyles.ts");
/* harmony import */ var _functions_content_textReplacer__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./functions/content/textReplacer */ "./src/functions/content/textReplacer.ts");





const url = window.location.href;
function checkExtensionStateAndRun() {
    chrome.storage.sync.get(["extensionEnabled"], function (result) {
        if (result.extensionEnabled !== false) { // Default to true if undefined
            console.log("Extension is enabled. Running main functions...");
            mainFunctions();
        }
        else {
            console.log("Extension is disabled.");
        }
    });
}
function mainFunctions() {
    console.log("Running main functions...");
    (0,_functions_content_loadingOverlay__WEBPACK_IMPORTED_MODULE_0__.createLoadingOverlay)();
    (0,_functions_content_createAnimationStyles__WEBPACK_IMPORTED_MODULE_3__.createAnimationStyles)();
    let interval = window.setInterval(function () {
        if (document.querySelector('[class^="MuiAvatar-img"]')) {
            console.log("Starting image and text replacement process");
            (0,_functions_content_imageReplacer__WEBPACK_IMPORTED_MODULE_1__.replaceImage)();
            (0,_functions_content_textReplacer__WEBPACK_IMPORTED_MODULE_4__.replaceTextInElement)(document.body);
            clearInterval(interval);
        }
    }, 2000);
    (0,_functions_content_DOMObserver__WEBPACK_IMPORTED_MODULE_2__.observeDOMChanges)();
}
checkExtensionStateAndRun();

})();

/******/ })()
;
//# sourceMappingURL=content.js.map