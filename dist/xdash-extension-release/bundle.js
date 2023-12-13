/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./js/DOMObserver.js":
/*!***************************!*\
  !*** ./js/DOMObserver.js ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   observeDOMChanges: () => (/* binding */ observeDOMChanges)
/* harmony export */ });
/* harmony import */ var _textReplacer_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./textReplacer.js */ "./js/textReplacer.js");
// DOMObserver.js

function observeDOMChanges() {
  var observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      mutation.addedNodes.forEach(function (node) {
        if (node.nodeType === Node.ELEMENT_NODE) {
          (0,_textReplacer_js__WEBPACK_IMPORTED_MODULE_0__.replaceTextInElement)(node);
        }
      });
    });
  });
  var config = {
    childList: true,
    subtree: true
  };
  observer.observe(document.body, config);
}

/***/ }),

/***/ "./js/createAnimationStyles.js":
/*!*************************************!*\
  !*** ./js/createAnimationStyles.js ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createAnimationStyles: () => (/* binding */ createAnimationStyles)
/* harmony export */ });
function createAnimationStyles() {
  // Add keyframes for spin and color change animations
  var styleSheet = document.createElement("style");
  styleSheet.type = "text/css";
  styleSheet.innerText = "\n@keyframes spin {\n    0% { transform: rotate(0deg); }\n    50% { transform: rotate(180deg); }\n    100% { transform: rotate(360deg); }\n}\n@keyframes colorChange {\n    0% { border-top-color: #3498db; }\n    33% { border-top-color: #e74c3c; }\n    66% { border-top-color: #2ecc71; }\n    100% { border-top-color: #3498db; }\n}";
  document.head.appendChild(styleSheet);
}

/***/ }),

/***/ "./js/imageReplacer.js":
/*!*****************************!*\
  !*** ./js/imageReplacer.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   replaceImage: () => (/* binding */ replaceImage)
/* harmony export */ });
/* harmony import */ var _loadingOverlay_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./loadingOverlay.js */ "./js/loadingOverlay.js");
// imageReplacer.js


function replaceImage() {
  console.log("Attempting to replace images");
  chrome.storage.sync.get(["selectedImage"], function (result) {
    var imageToUse = result.selectedImage;
    console.log("Image to use: ".concat(imageToUse));
    if (!imageToUse) {
      console.log("No selected image found in storage, using default");
      imageToUse = "https://web1.sa.appsflyer.com/xdash_images/af_icon_rainbow.png"; // Default image URL
    }
    var images;
    if (window.location.href.includes("onelink")) {
      // If the current URL contains "onelink"
      images = document.querySelectorAll('[class^="onelink-MuiAvatar-img"]'); // For OneLink
    } else {
      // If the current URL does not contain "onelink"
      images = document.querySelectorAll('[class^="MuiAvatar-img"]');
    }
    var imagesChanged = 0;
    var totalImages = images.length;
    console.log("Found ".concat(totalImages, " images for replacement with '").concat(imageToUse, "'"));
    if (totalImages === 0) {
      (0,_loadingOverlay_js__WEBPACK_IMPORTED_MODULE_0__.removeLoadingOverlay)();
      return;
    }
    images.forEach(function (img, index) {
      img.onload = function () {
        console.log("Image ".concat(index, " loaded: ").concat(img.src));
        imagesChanged++;
        if (imagesChanged === totalImages) {
          console.log("All images loaded, removing overlay");
          (0,_loadingOverlay_js__WEBPACK_IMPORTED_MODULE_0__.removeLoadingOverlay)();
        }
      };
      img.onerror = function () {
        console.log("Error loading image ".concat(index));
      };
      img.src = imageToUse;
    });

    // Fallback mechanism
    setTimeout(function () {
      if (imagesChanged !== totalImages) {
        console.log("Fallback: Removing overlay");
        (0,_loadingOverlay_js__WEBPACK_IMPORTED_MODULE_0__.removeLoadingOverlay)();
      }
    }, 5000); // Adjust the timeout as necessary
  });
}

/***/ }),

/***/ "./js/loadingOverlay.js":
/*!******************************!*\
  !*** ./js/loadingOverlay.js ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createLoadingOverlay: () => (/* binding */ createLoadingOverlay),
/* harmony export */   removeLoadingOverlay: () => (/* binding */ removeLoadingOverlay)
/* harmony export */ });
// loadingOverlay.js

function createLoadingOverlay() {
  console.log("Creating loading overlay");
  var overlay = document.createElement("div");
  var spinner = document.createElement("div");
  var message = document.createElement("div");

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
  var messages = ["Life is like a box of chocolates, but with less SKAN.", "Grounding up some fresh attribution.", "Compiling our deepest darkest secrets.", "Mo' ROAS, mo' problems.", "I'm sure some of these numbers are right...", "Pre-heating the deep links.", "Attribution is our favorite kind of 'bution."];

  // Shuffle messages
  for (var i = messages.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var _ref = [messages[j], messages[i]];
    messages[i] = _ref[0];
    messages[j] = _ref[1];
  }
  var messageIndex = 0;
  message.innerText = messages[messageIndex]; // Set initial random message
  setInterval(function () {
    messageIndex = (messageIndex + 1) % messages.length;
    message.innerText = messages[messageIndex];
  }, 1500); // Change message every second

  console.log("Loading overlay created");
}
function removeLoadingOverlay() {
  //console.log("Attempting to remove loading overlay");
  var overlay = document.getElementById("my-extension-loading-overlay");
  if (overlay) {
    overlay.remove();
    console.log("Loading overlay removed");
  } else {
    console.log("Loading overlay not found");
  }
}

/***/ }),

/***/ "./js/textReplacer.js":
/*!****************************!*\
  !*** ./js/textReplacer.js ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   replaceTextInElement: () => (/* binding */ replaceTextInElement)
/* harmony export */ });
// textReplacer.js

function replaceTextInElement(element) {
  chrome.storage.sync.get(["mappings"], function (result) {
    if (result.mappings && element) {
      var mappings = result.mappings;
      element.childNodes.forEach(function (node) {
        if (node.nodeType === Node.TEXT_NODE) {
          mappings.forEach(function (mapping) {
            if (mapping.section === "mediaSources" || mapping.section === "inAppEvents") {
              var regex = new RegExp(mapping.original, "gi");
              // Check if newText is not blank before replacement
              if (mapping.newText.trim() !== "") {
                node.textContent = node.textContent.replace(regex, mapping.newText);
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
/*!********************!*\
  !*** ./content.js ***!
  \********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _js_loadingOverlay_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./js/loadingOverlay.js */ "./js/loadingOverlay.js");
/* harmony import */ var _js_imageReplacer_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./js/imageReplacer.js */ "./js/imageReplacer.js");
/* harmony import */ var _js_DOMObserver_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./js/DOMObserver.js */ "./js/DOMObserver.js");
/* harmony import */ var _js_createAnimationStyles_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./js/createAnimationStyles.js */ "./js/createAnimationStyles.js");
/* harmony import */ var _js_textReplacer_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./js/textReplacer.js */ "./js/textReplacer.js");





var url = window.location.href;
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
  (0,_js_loadingOverlay_js__WEBPACK_IMPORTED_MODULE_0__.createLoadingOverlay)();
  (0,_js_createAnimationStyles_js__WEBPACK_IMPORTED_MODULE_3__.createAnimationStyles)();
  var interval = setInterval(function () {
    if (document.querySelector('[class^="MuiAvatar-img"]')) {
      console.log("Starting image and text replacement process");
      (0,_js_imageReplacer_js__WEBPACK_IMPORTED_MODULE_1__.replaceImage)();
      (0,_js_textReplacer_js__WEBPACK_IMPORTED_MODULE_4__.replaceTextInElement)(document.body);
      clearInterval(interval);
    }
  }, 2000);

  // Call this function at the end of your script
  (0,_js_DOMObserver_js__WEBPACK_IMPORTED_MODULE_2__.observeDOMChanges)();
}
checkExtensionStateAndRun();
})();

/******/ })()
;
//# sourceMappingURL=bundle.js.map