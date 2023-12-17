/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/functions/popup/addChangeListenerToInputs.ts":
/*!**********************************************************!*\
  !*** ./src/functions/popup/addChangeListenerToInputs.ts ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   addChangeListenerToInputs: () => (/* binding */ addChangeListenerToInputs)
/* harmony export */ });
/* harmony import */ var _inputChangeListener__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./inputChangeListener */ "./src/functions/popup/inputChangeListener.ts");

function addChangeListenerToInputs() {
    document.querySelectorAll('.original-text, .new-text').forEach(input => {
        input.removeEventListener('input', _inputChangeListener__WEBPACK_IMPORTED_MODULE_0__.inputChangeListener);
        input.addEventListener('input', _inputChangeListener__WEBPACK_IMPORTED_MODULE_0__.inputChangeListener);
    });
}


/***/ }),

/***/ "./src/functions/popup/addMappingRow.ts":
/*!**********************************************!*\
  !*** ./src/functions/popup/addMappingRow.ts ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   addMappingRow: () => (/* binding */ addMappingRow)
/* harmony export */ });
/* harmony import */ var _addChangeListenerToInputs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./addChangeListenerToInputs */ "./src/functions/popup/addChangeListenerToInputs.ts");
/* harmony import */ var _saveMappings__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./saveMappings */ "./src/functions/popup/saveMappings.ts");


function addMappingRow(section, original, newText) {
    console.log("Adding mapping row to", section);
    const mappingDiv = document.createElement('div');
    const mediaSourcesDiv = document.getElementById('mediaSources');
    const inAppEventsDiv = document.getElementById('inAppEvents');
    if (!mediaSourcesDiv || !inAppEventsDiv) {
        console.error('Required elements not found in the document');
        return;
    }
    mappingDiv.className = 'mapping-row';
    mappingDiv.innerHTML = `
        <input type="text" class="original-text" placeholder="Original" value="${original}">
        <input type="text" class="new-text" placeholder="Replacement" value="${newText}">
        <button class="action-button remove-mapping">&#10005;</button>`;
    const removeButton = mappingDiv.querySelector('.remove-mapping');
    removeButton.addEventListener('click', () => {
        mappingDiv.remove();
        _saveMappings__WEBPACK_IMPORTED_MODULE_1__.unsavedChangesMsg.style.display = 'block';
    });
    if (section === 'mediaSources') {
        mediaSourcesDiv.appendChild(mappingDiv);
    }
    else if (section === 'inAppEvents') {
        inAppEventsDiv.appendChild(mappingDiv);
    }
    (0,_addChangeListenerToInputs__WEBPACK_IMPORTED_MODULE_0__.addChangeListenerToInputs)();
}


/***/ }),

/***/ "./src/functions/popup/defaultMappings.ts":
/*!************************************************!*\
  !*** ./src/functions/popup/defaultMappings.ts ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   defaultInAppEvents: () => (/* binding */ defaultInAppEvents),
/* harmony export */   defaultMediaSources: () => (/* binding */ defaultMediaSources)
/* harmony export */ });
// Default mappings for media sources and in-app events
const defaultMediaSources = [
    "Facebook Ads",
    "SMS",
    "unityads_int",
    "Apple Search Ads",
    "applovin_int",
    "remerge_int",
    "Email",
    "tapjoy_int",
    "adquant",
    "criteo_int",
    "googleadwords_int",
    "ironsource_int",
    "bytedanceglobal_int",
    "reddit_int",
    "twitter_int",
    "snapchat_int",
    "vungle_int",
    "tiktok_int",
    "taboola_int",
    "appguardion_int",
    "blindferret_int",
    "crosstarget_int",
    "Google"
];
const defaultInAppEvents = [
    "level_5_achieved",
    "tutorial_completed",
    "af_purchase",
    "ad_monetized",
    "level_10_achieved",
];


/***/ }),

/***/ "./src/functions/popup/inputChangeListener.ts":
/*!****************************************************!*\
  !*** ./src/functions/popup/inputChangeListener.ts ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   inputChangeListener: () => (/* binding */ inputChangeListener)
/* harmony export */ });
/* harmony import */ var _saveMappings__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./saveMappings */ "./src/functions/popup/saveMappings.ts");

function inputChangeListener() {
    _saveMappings__WEBPACK_IMPORTED_MODULE_0__.unsavedChangesMsg.style.display = 'block';
    _saveMappings__WEBPACK_IMPORTED_MODULE_0__.unsavedChangesMsg.innerText = 'Unsaved changes - make sure to save.';
    _saveMappings__WEBPACK_IMPORTED_MODULE_0__.unsavedChangesMsg.style.color = 'red';
}


/***/ }),

/***/ "./src/functions/popup/loadExistingMappings.ts":
/*!*****************************************************!*\
  !*** ./src/functions/popup/loadExistingMappings.ts ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   loadExistingMappings: () => (/* binding */ loadExistingMappings)
/* harmony export */ });
/* harmony import */ var _addMappingRow__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./addMappingRow */ "./src/functions/popup/addMappingRow.ts");
/* harmony import */ var _defaultMappings__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./defaultMappings */ "./src/functions/popup/defaultMappings.ts");


function loadExistingMappings() {
    console.log("Loading existing mappings");
    chrome.storage.sync.get(['mappings'], (result) => {
        const mappings = result.mappings || [];
        if (mappings.length > 0) {
            console.log("Saved mappings found:", mappings);
            mappings.forEach(mapping => {
                (0,_addMappingRow__WEBPACK_IMPORTED_MODULE_0__.addMappingRow)(mapping.section, mapping.original, mapping.newText);
            });
        }
        else {
            console.log("No saved mappings found. Adding default mappings.");
            _defaultMappings__WEBPACK_IMPORTED_MODULE_1__.defaultMediaSources.forEach(original => {
                (0,_addMappingRow__WEBPACK_IMPORTED_MODULE_0__.addMappingRow)('mediaSources', original, '');
            });
            _defaultMappings__WEBPACK_IMPORTED_MODULE_1__.defaultInAppEvents.forEach(original => {
                (0,_addMappingRow__WEBPACK_IMPORTED_MODULE_0__.addMappingRow)('inAppEvents', original, '');
            });
        }
    });
}


/***/ }),

/***/ "./src/functions/popup/loadOrSetDefaultImage.ts":
/*!******************************************************!*\
  !*** ./src/functions/popup/loadOrSetDefaultImage.ts ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   customImagePreview: () => (/* binding */ customImagePreview),
/* harmony export */   customImageUrlInput: () => (/* binding */ customImageUrlInput),
/* harmony export */   loadOrSetDefaultImage: () => (/* binding */ loadOrSetDefaultImage)
/* harmony export */ });
/* harmony import */ var _selectImage__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./selectImage */ "./src/functions/popup/selectImage.ts");

const customImagePreview = document.getElementById('customImagePreview');
const customImageUrlInput = document.getElementById('customImageUrl');
function loadOrSetDefaultImage() {
    console.log("Loading or setting default image");
    chrome.storage.sync.get(['selectedImage'], function (result) {
        // Define the default selected image
        const defaultSelectedImage = "icons/af_icon_rainbow.png";
        let selectedImage = result.selectedImage || defaultSelectedImage;
        console.log("Selected image:", selectedImage);
        // Check if the selected image is a predefined image or a custom URL
        const isPredefinedImage = selectedImage.startsWith("icons/");
        if (isPredefinedImage) {
            // Handle predefined image
            (0,_selectImage__WEBPACK_IMPORTED_MODULE_0__.selectImage)(selectedImage); // This will update the border for the selected predefined image
            customImageUrlInput.value = '';
            customImagePreview.innerHTML = '';
            customImagePreview.style.display = 'none';
        }
        else {
            // Handle custom image URL
            customImageUrlInput.value = selectedImage;
            (0,_selectImage__WEBPACK_IMPORTED_MODULE_0__.selectImage)(selectedImage, true); // This will update the preview for the custom image URL
        }
    });
}


/***/ }),

/***/ "./src/functions/popup/restoreDefaults.ts":
/*!************************************************!*\
  !*** ./src/functions/popup/restoreDefaults.ts ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   restoreDefaults: () => (/* binding */ restoreDefaults)
/* harmony export */ });
/* harmony import */ var _defaultMappings__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./defaultMappings */ "./src/functions/popup/defaultMappings.ts");
/* harmony import */ var _addMappingRow__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./addMappingRow */ "./src/functions/popup/addMappingRow.ts");
/* harmony import */ var _saveMappings__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./saveMappings */ "./src/functions/popup/saveMappings.ts");



// Function to load default mappings
function loadDefaultMappings() {
    // Add default mappings to the UI
    _defaultMappings__WEBPACK_IMPORTED_MODULE_0__.defaultMediaSources.forEach(original => {
        (0,_addMappingRow__WEBPACK_IMPORTED_MODULE_1__.addMappingRow)('mediaSources', original, '');
    });
    _defaultMappings__WEBPACK_IMPORTED_MODULE_0__.defaultInAppEvents.forEach(original => {
        (0,_addMappingRow__WEBPACK_IMPORTED_MODULE_1__.addMappingRow)('inAppEvents', original, '');
    });
}
function restoreDefaults() {
    // Remove all existing mappings
    document.querySelectorAll('.mapping-row').forEach(mappingRow => {
        mappingRow.remove();
    });
    // Load default mappings
    loadDefaultMappings();
    // Hide unsaved changes message
    _saveMappings__WEBPACK_IMPORTED_MODULE_2__.unsavedChangesMsg.style.display = 'none';
}


/***/ }),

/***/ "./src/functions/popup/saveMappings.ts":
/*!*********************************************!*\
  !*** ./src/functions/popup/saveMappings.ts ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createUnsavedChangesMsg: () => (/* binding */ createUnsavedChangesMsg),
/* harmony export */   saveMappings: () => (/* binding */ saveMappings),
/* harmony export */   unsavedChangesMsg: () => (/* binding */ unsavedChangesMsg)
/* harmony export */ });
/* harmony import */ var _loadOrSetDefaultImage__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./loadOrSetDefaultImage */ "./src/functions/popup/loadOrSetDefaultImage.ts");
/* harmony import */ var _popup__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../popup */ "./src/popup.ts");


function createUnsavedChangesMsg() {
    const msg = document.createElement('div');
    msg.id = 'unsaved-changes-msg';
    msg.innerText = 'Unsaved changes - make sure to save.';
    return msg;
}
const unsavedChangesMsg = createUnsavedChangesMsg();
function saveMappings() {
    console.log("Save button clicked");
    const allMappings = [];
    document.querySelectorAll('#mediaSources .mapping-row, #inAppEvents .mapping-row').forEach(div => {
        const originalInput = div.querySelector('.original-text');
        const newTextInput = div.querySelector('.new-text');
        const section = div.parentElement ? div.parentElement.id : '';
        if (originalInput && newTextInput) {
            allMappings.push({ section, original: originalInput.value, newText: newTextInput.value });
        }
    });
    let imageToSave;
    const selectedImageElement = document.querySelector('.image-option[style*="border: 2px solid green"]');
    if (selectedImageElement) {
        imageToSave = selectedImageElement.getAttribute('src') || "https://web1.sa.appsflyer.com/xdash_images/af_icon_rainbow.png";
    }
    else if (_loadOrSetDefaultImage__WEBPACK_IMPORTED_MODULE_0__.customImageUrlInput.value) {
        imageToSave = _loadOrSetDefaultImage__WEBPACK_IMPORTED_MODULE_0__.customImageUrlInput.value;
    }
    else {
        imageToSave = "https://web1.sa.appsflyer.com/xdash_images/af_icon_rainbow.png";
    }
    const isEnabled = _popup__WEBPACK_IMPORTED_MODULE_1__.extensionStatusCheckbox.checked;
    chrome.storage.sync.set({ 'extensionEnabled': isEnabled }, () => {
        console.log('Extension status saved:', isEnabled);
    });
    chrome.storage.sync.set({ mappings: allMappings, selectedImage: imageToSave }, () => {
        console.log("Mappings and selected image saved:", allMappings, imageToSave);
        unsavedChangesMsg.innerText = 'Changes saved!';
        unsavedChangesMsg.style.color = 'green';
        unsavedChangesMsg.style.display = 'block';
        setTimeout(() => {
            unsavedChangesMsg.style.display = 'none';
        }, 2000);
    });
}


/***/ }),

/***/ "./src/functions/popup/selectImage.ts":
/*!********************************************!*\
  !*** ./src/functions/popup/selectImage.ts ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   selectImage: () => (/* binding */ selectImage)
/* harmony export */ });
function selectImage(url, isCustom = false) {
    console.log("selectImage called with URL:", url, "Is custom URL:", isCustom);
    // Fetch 'customImagePreview' element from the DOM
    const customImagePreview = document.getElementById('customImagePreview');
    // Deselect all predefined images
    document.querySelectorAll('.image-option').forEach((img) => {
        img.style.border = 'none';
    });
    if (isCustom && customImagePreview) {
        // Display custom image preview
        customImagePreview.innerHTML = `<img src="${url}" class="preview-image">`;
        customImagePreview.style.border = '2px solid green';
        customImagePreview.style.display = 'block';
    }
    else {
        // Highlight selected predefined image
        const predefinedImage = document.querySelector(`.image-option[src="${url}"]`);
        if (predefinedImage) {
            predefinedImage.style.border = '2px solid green';
        }
        if (customImagePreview) {
            customImagePreview.innerHTML = '';
            customImagePreview.style.display = 'none';
        }
    }
}


/***/ }),

/***/ "./src/functions/popup/setEventListeners.ts":
/*!**************************************************!*\
  !*** ./src/functions/popup/setEventListeners.ts ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   setEventListeners: () => (/* binding */ setEventListeners)
/* harmony export */ });
/* harmony import */ var _addMappingRow__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./addMappingRow */ "./src/functions/popup/addMappingRow.ts");
/* harmony import */ var _saveMappings__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./saveMappings */ "./src/functions/popup/saveMappings.ts");
/* harmony import */ var _inputChangeListener__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./inputChangeListener */ "./src/functions/popup/inputChangeListener.ts");
/* harmony import */ var _selectImage__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./selectImage */ "./src/functions/popup/selectImage.ts");
/* harmony import */ var _loadOrSetDefaultImage__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./loadOrSetDefaultImage */ "./src/functions/popup/loadOrSetDefaultImage.ts");
/* harmony import */ var _popup__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../popup */ "./src/popup.ts");







function setEventListeners() {
    console.log("Setting event listeners");
    const addMediaSourceButton = document.getElementById('addMediaSource');
    const addInAppEventButton = document.getElementById('addInAppEvent');
    const saveButton = document.getElementById('save');
    addMediaSourceButton.addEventListener('click', () => (0,_addMappingRow__WEBPACK_IMPORTED_MODULE_0__.addMappingRow)('mediaSources', '', ''));
    addInAppEventButton.addEventListener('click', () => (0,_addMappingRow__WEBPACK_IMPORTED_MODULE_0__.addMappingRow)('inAppEvents', '', ''));
    saveButton.addEventListener('click', _saveMappings__WEBPACK_IMPORTED_MODULE_1__.saveMappings);
    _popup__WEBPACK_IMPORTED_MODULE_5__.extensionStatusCheckbox.addEventListener('change', _inputChangeListener__WEBPACK_IMPORTED_MODULE_2__.inputChangeListener);
    _loadOrSetDefaultImage__WEBPACK_IMPORTED_MODULE_4__.customImageUrlInput.addEventListener('input', () => {
        const url = _loadOrSetDefaultImage__WEBPACK_IMPORTED_MODULE_4__.customImageUrlInput.value || ''; // Ensure url is a string
        (0,_selectImage__WEBPACK_IMPORTED_MODULE_3__.selectImage)(url, !!url);
        if (url) {
            _loadOrSetDefaultImage__WEBPACK_IMPORTED_MODULE_4__.customImagePreview.innerHTML = `<img src="${url}" class="preview-image">`;
            _loadOrSetDefaultImage__WEBPACK_IMPORTED_MODULE_4__.customImagePreview.style.border = '2px solid green';
            _loadOrSetDefaultImage__WEBPACK_IMPORTED_MODULE_4__.customImagePreview.style.display = 'block';
        }
        else {
            _loadOrSetDefaultImage__WEBPACK_IMPORTED_MODULE_4__.customImagePreview.innerHTML = '';
            _loadOrSetDefaultImage__WEBPACK_IMPORTED_MODULE_4__.customImagePreview.style.border = 'none';
            _loadOrSetDefaultImage__WEBPACK_IMPORTED_MODULE_4__.customImagePreview.style.display = 'none';
        }
        _saveMappings__WEBPACK_IMPORTED_MODULE_1__.unsavedChangesMsg.style.display = 'block'; // Show unsaved changes message for custom URL changes
    });
    document.querySelectorAll('.image-option').forEach(img => {
        img.addEventListener('click', () => {
            const imgUrl = img.getAttribute('src') || ''; // Ensure imgUrl is a string
            console.log("Predefined image option clicked:", imgUrl);
            (0,_selectImage__WEBPACK_IMPORTED_MODULE_3__.selectImage)(imgUrl);
            _loadOrSetDefaultImage__WEBPACK_IMPORTED_MODULE_4__.customImageUrlInput.value = '';
            _saveMappings__WEBPACK_IMPORTED_MODULE_1__.unsavedChangesMsg.style.display = 'block'; // Show unsaved changes message for image selection
        });
    });
}


/***/ }),

/***/ "./src/popup.ts":
/*!**********************!*\
  !*** ./src/popup.ts ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   extensionStatusCheckbox: () => (/* binding */ extensionStatusCheckbox)
/* harmony export */ });
/* harmony import */ var _functions_popup_restoreDefaults__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./functions/popup/restoreDefaults */ "./src/functions/popup/restoreDefaults.ts");
/* harmony import */ var _functions_popup_addChangeListenerToInputs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./functions/popup/addChangeListenerToInputs */ "./src/functions/popup/addChangeListenerToInputs.ts");
/* harmony import */ var _functions_popup_loadExistingMappings__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./functions/popup/loadExistingMappings */ "./src/functions/popup/loadExistingMappings.ts");
/* harmony import */ var _functions_popup_loadOrSetDefaultImage__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./functions/popup/loadOrSetDefaultImage */ "./src/functions/popup/loadOrSetDefaultImage.ts");
/* harmony import */ var _functions_popup_setEventListeners__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./functions/popup/setEventListeners */ "./src/functions/popup/setEventListeners.ts");
/* harmony import */ var _functions_popup_saveMappings__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./functions/popup/saveMappings */ "./src/functions/popup/saveMappings.ts");






const extensionStatusCheckbox = document.getElementById('extensionStatusCheckbox');
document.addEventListener('DOMContentLoaded', () => {
    var _a;
    console.log("DOM fully loaded and parsed");
    const saveSection = document.getElementById('saveSection');
    const restoreDefaultsButton = document.getElementById('restoreDefaults');
    chrome.storage.sync.get(['extensionEnabled'], (result) => {
        if (result.extensionEnabled === undefined) {
            chrome.storage.sync.set({ 'extensionEnabled': true });
            extensionStatusCheckbox.checked = true;
        }
        else {
            extensionStatusCheckbox.checked = result.extensionEnabled;
        }
    });
    restoreDefaultsButton.addEventListener('click', _functions_popup_restoreDefaults__WEBPACK_IMPORTED_MODULE_0__.restoreDefaults);
    (_a = saveSection.parentNode) === null || _a === void 0 ? void 0 : _a.insertBefore(_functions_popup_saveMappings__WEBPACK_IMPORTED_MODULE_5__.unsavedChangesMsg, saveSection);
    (0,_functions_popup_loadExistingMappings__WEBPACK_IMPORTED_MODULE_2__.loadExistingMappings)();
    (0,_functions_popup_loadOrSetDefaultImage__WEBPACK_IMPORTED_MODULE_3__.loadOrSetDefaultImage)();
    (0,_functions_popup_addChangeListenerToInputs__WEBPACK_IMPORTED_MODULE_1__.addChangeListenerToInputs)();
    (0,_functions_popup_setEventListeners__WEBPACK_IMPORTED_MODULE_4__.setEventListeners)();
});


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
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./src/popup.ts");
/******/ 	
/******/ })()
;
//# sourceMappingURL=popup.js.map