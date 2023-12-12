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
        const defaultMediaSources = [
            "Facebook Ads",
            "SMS",
            "unityads_int",
            "Apple Search Ads",
            "applovin_int",
            "remerge_int",
            "Email",
            "tapjoy_int",
            "itonsource_int",
            "adquant",
            "criteo_int",
            "googleadwords_int",
            "ironsource_int"
        ];
    
        const defaultInAppEvents = [
            "level_5_achieved",
            "af_purchase",
            "level_10_achieved",
            "tutorial_completed",
            "ad_monetized"
        ];
    
        chrome.storage.sync.get(['mappings'], function(result) {
            if (result.mappings) {
                result.mappings.forEach(mapping => {
                    if (mapping.section === 'mediaSources' && defaultMediaSources.includes(mapping.original)) {
                        addMappingRow(mapping.section, mapping.original, mapping.newText);
                    } else if (mapping.section === 'inAppEvents' && defaultInAppEvents.includes(mapping.original)) {
                        addMappingRow(mapping.section, mapping.original, mapping.newText);
                    }
                });
            } else {
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
            const defaultSelectedImage = "https://web1.sa.appsflyer.com/xdash_images/af_icon_rainbow.png";
            const selectedImage = result.selectedImage || defaultSelectedImage;
            console.log("Selected image:", selectedImage);
            selectImage(selectedImage);

            if (selectedImage && !selectedImage.startsWith('https://web1.sa.appsflyer.com')) {
                customImageUrlInput.value = selectedImage;
                customImagePreview.innerHTML = `<img src="${selectedImage}" class="preview-image">`;
                customImagePreview.style.border = '2px solid green';
                customImagePreview.style.display = 'block';
            } else {
                customImageUrlInput.value = '';
                customImagePreview.innerHTML = '';
                customImagePreview.style.border = 'none';
                customImagePreview.style.display = 'none';
            }
        });
    }

    function selectImage(url, isCustom = false) {
        console.log("selectImage called with URL:", url, "Is custom URL:", isCustom);
        document.querySelectorAll('.image-option').forEach(img => {
            if (img.getAttribute('src') === url || (isCustom && img.getAttribute('data-url') === url)) {
                img.style.border = '2px solid green';
            } else {
                img.style.border = 'none';
            }
        });

        if (isCustom) {
            customImagePreview.innerHTML = `<img src="${url}" class="preview-image">`;
            customImagePreview.style.border = '2px solid green';
        } else {
            customImagePreview.innerHTML = '';
            customImagePreview.style.border = 'none';
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
        // Define default mappings for Media Sources and In App Events
        const defaultMediaSources = [
            "Facebook Ads",
            "SMS",
            "unityads_int",
            "Apple Search Ads",
            "applovin_int",
            "remerge_int",
            "Email",
            "tapjoy_int",
            "itonsource_int",
            "adquant",
            "criteo_int",
            "googleadwords_int",
            "ironsource_int"
        ];

        const defaultInAppEvents = [
            "level_5_achieved",
            "af_purchase",
            "level_10_achieved",
            "tutorial_completed",
            "ad_monetized"
        ];

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
