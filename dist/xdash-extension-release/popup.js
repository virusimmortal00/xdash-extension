document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM fully loaded and parsed");
    const mediaSourcesDiv = document.getElementById('mediaSources');
    const inAppEventsDiv = document.getElementById('inAppEvents');
    const addMediaSourceButton = document.getElementById('addMediaSource');
    const addInAppEventButton = document.getElementById('addInAppEvent');
    const saveButton = document.getElementById('save');
    const saveSection = document.getElementById('saveSection');
    const customImageUrlInput = document.getElementById('customImageUrl');
    const customImagePreview = document.getElementById('customImagePreview');
    const unsavedChangesMsg = createUnsavedChangesMsg();

    const restoreDefaultsButton =  document.getElementById('restoreDefaults');
    
    const extensionStatusCheckbox = document.getElementById('extensionStatusCheckbox');

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

    chrome.storage.sync.get(['extensionEnabled'], function(result) {
        if (result.extensionEnabled === undefined) {
            chrome.storage.sync.set({ 'extensionEnabled': true }); // Set default state in storage
            extensionStatusCheckbox.checked = true; // Set the checkbox state
        } else {
            extensionStatusCheckbox.checked = result.extensionEnabled;
        }
    });

     // Add an event listener for the "Restore Defaults" button
    restoreDefaultsButton.addEventListener('click', restoreDefaults);

    saveSection.parentNode.insertBefore(unsavedChangesMsg, saveSection);
    loadExistingMappings();
    loadOrSetDefaultImage();

    function inputChangeListener() {
        unsavedChangesMsg.style.display = 'block';
        unsavedChangesMsg.innerText = 'Unsaved changes - make sure to save.';
        unsavedChangesMsg.style.color = 'red';
    }

    function addChangeListenerToInputs() {
        document.querySelectorAll('.original-text, .new-text').forEach(input => {
            input.removeEventListener('input', inputChangeListener);
            input.addEventListener('input', inputChangeListener);
        });
    }

    function createUnsavedChangesMsg() {
        const msg = document.createElement('div');
        msg.id = 'unsaved-changes-msg';
        msg.innerText = 'Unsaved changes - make sure to save.';
        return msg;
    }

    function inputChangeListener() {
        unsavedChangesMsg.style.display = 'block';
        unsavedChangesMsg.innerText = 'Unsaved changes - make sure to save.';
        unsavedChangesMsg.style.color = 'red';
    }

    function setEventListeners() {
        console.log("Setting event listeners");
        addMediaSourceButton.addEventListener('click', () => addMappingRow('mediaSources'));
        addInAppEventButton.addEventListener('click', () => addMappingRow('inAppEvents'));
        saveButton.addEventListener('click', saveMappings);
        extensionStatusCheckbox.addEventListener('change', inputChangeListener);

        customImageUrlInput.addEventListener('input', () => {
            const url = customImageUrlInput.value;
            selectImage(url, !!url);
            if (url) {
                customImagePreview.innerHTML = `<img src="${url}" class="preview-image">`;
                customImagePreview.style.border = '2px solid green';
                customImagePreview.style.display = 'block';
            } else {
                customImagePreview.innerHTML = '';
                customImagePreview.style.border = 'none';
                customImagePreview.style.display = 'none';
            }
            unsavedChangesMsg.style.display = 'block'; // Show unsaved changes message for custom URL changes
        });

        document.querySelectorAll('.image-option').forEach(img => {
            img.addEventListener('click', () => {
                const imgUrl = img.getAttribute('src');
                console.log("Predefined image option clicked:", imgUrl);
                selectImage(imgUrl);
                customImageUrlInput.value = '';
                unsavedChangesMsg.style.display = 'block'; // Show unsaved changes message for image selection
            });
        });
    }

    function addMappingRow(section, original = '', newText = '') {
        console.log("Adding mapping row to", section);
        const mappingDiv = document.createElement('div');

        mappingDiv.className = 'mapping-row';
        mappingDiv.innerHTML = `
            <input type="text" class="original-text" placeholder="Original" value="${original}">
            <input type="text" class="new-text" placeholder="Replacement" value="${newText}">
            <button class="action-button remove-mapping">&#10005;</button>`;
    
        const removeButton = mappingDiv.querySelector('.remove-mapping');
        removeButton.addEventListener('click', () => {
            mappingDiv.remove();
            unsavedChangesMsg.style.display = 'block';
        });
        console.log("New mapping row HTML:", mappingDiv.innerHTML);
        if (section === 'mediaSources') mediaSourcesDiv.appendChild(mappingDiv);
        else if (section === 'inAppEvents') inAppEventsDiv.appendChild(mappingDiv);
    
        addChangeListenerToInputs();
    }
    

    function saveMappings() {
        console.log("Save button clicked");
        const allMappings = [];
        document.querySelectorAll('#mediaSources .mapping-row, #inAppEvents .mapping-row').forEach(div => {
            const original = div.querySelector('.original-text').value;
            const newText = div.querySelector('.new-text').value;
    
            // Include all mappings, even if "New text" is blank
            allMappings.push({ section: div.parentElement.id, original, newText });
        });
    
        let imageToSave;
        const selectedImageElement = document.querySelector('.image-option[style*="border: 2px solid green"]');
        if (selectedImageElement) {
            imageToSave = selectedImageElement.getAttribute('src');
        } else if (customImageUrlInput.value) {
            imageToSave = customImageUrlInput.value;
        } else {
            imageToSave = "https://web1.sa.appsflyer.com/xdash_images/af_icon_rainbow.png";
        }
    
        // Save the state of the checkbox
        const isEnabled = extensionStatusCheckbox.checked;
        chrome.storage.sync.set({ 'extensionEnabled': isEnabled }, function() {
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
    
    

    function loadExistingMappings() {
        
        console.log("Loading existing mappings");
    
        chrome.storage.sync.get(['mappings'], function(result) {
            if (result.mappings && result.mappings.length > 0) {
                console.log("Saved mappings found:", result.mappings);
                result.mappings.forEach(mapping => {
                    addMappingRow(mapping.section, mapping.original, mapping.newText);
                });
            } else {
                console.log("No saved mappings found. Adding default mappings.");
                // Add default mappings if there are no saved mappings
                defaultMediaSources.forEach(original => {
                    addMappingRow('mediaSources', original, '');
                });
    
                defaultInAppEvents.forEach(original => {
                    addMappingRow('inAppEvents', original, '');
                });
            }
        });
    }
    
    

    function loadOrSetDefaultImage() {
        console.log("Loading or setting default image");
        chrome.storage.sync.get(['selectedImage'], function(result) {
            // Define the default selected image
            const defaultSelectedImage = "icons/af_icon_rainbow.png";
            let selectedImage = result.selectedImage || defaultSelectedImage;
            console.log("Selected image:", selectedImage);
    
            // Check if the selected image is a predefined image or a custom URL
            const isPredefinedImage = selectedImage.startsWith("icons/");
            if (isPredefinedImage) {
                // Handle predefined image
                selectImage(selectedImage); // This will update the border for the selected predefined image
                customImageUrlInput.value = '';
                customImagePreview.innerHTML = '';
                customImagePreview.style.display = 'none';
            } else {
                // Handle custom image URL
                customImageUrlInput.value = selectedImage;
                selectImage(selectedImage, true); // This will update the preview for the custom image URL
            }
        });
    }
    

    function selectImage(url, isCustom = false) {
        console.log("selectImage called with URL:", url, "Is custom URL:", isCustom);
    
        // Deselect all predefined images
        document.querySelectorAll('.image-option').forEach(img => {
            img.style.border = 'none';
        });
    
        if (isCustom) {
            // Display custom image preview
            customImagePreview.innerHTML = `<img src="${url}" class="preview-image">`;
            customImagePreview.style.border = '2px solid green';
            customImagePreview.style.display = 'block';
        } else {
            // Highlight selected predefined image
            const predefinedImage = document.querySelector(`.image-option[src="${url}"]`);
            if (predefinedImage) {
                predefinedImage.style.border = '2px solid green';
            }
            customImagePreview.innerHTML = '';
            customImagePreview.style.display = 'none';
        }
    }


    

    function restoreDefaults() {
        // Remove all existing mappings
        document.querySelectorAll('.mapping-row').forEach(mappingRow => {
            mappingRow.remove();
        });

        // Load default mappings
        loadDefaultMappings();

        // Clear custom image URL and reset image preview
        customImageUrlInput.value = '';
        customImagePreview.innerHTML = '';
        customImagePreview.style.border = 'none';

        // Hide unsaved changes message
        unsavedChangesMsg.style.display = 'none';
    }

    // Function to load default mappings
    function loadDefaultMappings() {
        // Add default mappings to the UI
        defaultMediaSources.forEach(original => {
            addMappingRow('mediaSources', original, '');
        });

        defaultInAppEvents.forEach(original => {
            addMappingRow('inAppEvents', original, '');
        });
    }

    


    addChangeListenerToInputs(); // Ensure change listeners are added to existing inputs
    setEventListeners();
});
