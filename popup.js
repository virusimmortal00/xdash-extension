document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM fully loaded and parsed");
    const mediaSourcesDiv = document.getElementById('mediaSources');
    const inAppEventsDiv = document.getElementById('inAppEvents');
    const addMediaSourceButton = document.getElementById('addMediaSource');
    const addInAppEventButton = document.getElementById('addInAppEvent');
    const saveButton = document.getElementById('save');
    const customImageUrlInput = document.getElementById('customImageUrl');
    const customImagePreview = document.getElementById('customImagePreview');
    const unsavedChangesMsg = createUnsavedChangesMsg();

    saveButton.parentNode.insertBefore(unsavedChangesMsg, saveButton);
    setEventListeners();
    loadExistingMappings();
    loadOrSetDefaultImage();

    fetch('verticals.json')
    .then(response => response.json())
    .then(data => {
        console.log("Verticals data:", data);
        // Process and use your data here
    })
    .catch(error => console.error("Error loading verticals.json:", error));


    function createUnsavedChangesMsg() {
        const msg = document.createElement('div');
        msg.id = 'unsaved-changes-msg';
        msg.innerText = 'Unsaved changes - make sure to save.';
        msg.style.color = 'red';
        msg.style.display = 'none'; // Initially hidden
        msg.style.fontSize = '12px';
        msg.style.marginBottom = '10px';
        return msg;
    }

    function setEventListeners() {
        console.log("Setting event listeners");
        addMediaSourceButton.addEventListener('click', () => addMappingRow('mediaSources'));
        addInAppEventButton.addEventListener('click', () => addMappingRow('inAppEvents'));
        saveButton.addEventListener('click', saveMappings);
    
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
        });
        
        document.querySelectorAll('.image-option').forEach(img => {
            img.addEventListener('click', () => {
                const imgUrl = img.getAttribute('src');  // Using 'src' instead of 'data-url'
                console.log("Predefined image option clicked:", imgUrl);
                selectImage(imgUrl);
                customImageUrlInput.value = '';
            });
        });
    }
    

    function addMappingRow(section, original = '', newText = '') {
        console.log("Adding mapping row to", section);
        const mappingDiv = document.createElement('div');
        mappingDiv.className = 'mapping-row';
        mappingDiv.innerHTML = `
            <input type="text" class="original-text" placeholder="Original text" value="${original}">
            <input type="text" class="new-text" placeholder="New text" value="${newText}">
            <button class="action-button remove-mapping">&#10005;</button>`;
        
        const removeButton = mappingDiv.querySelector('.remove-mapping');
        removeButton.addEventListener('click', () => {
            mappingDiv.remove();
            unsavedChangesMsg.style.display = 'block';
        });

        if (section === 'mediaSources') mediaSourcesDiv.appendChild(mappingDiv);
        else if (section === 'inAppEvents') inAppEventsDiv.appendChild(mappingDiv);
    }

    function saveMappings() {
        console.log("Save button clicked");
        const allMappings = [];
        document.querySelectorAll('#mediaSources .mapping-row, #inAppEvents .mapping-row').forEach(div => {
            const original = div.querySelector('.original-text').value;
            const newText = div.querySelector('.new-text').value;
            allMappings.push({ section: div.parentElement.id, original, newText });
        });
    
        let imageToSave;
        const selectedImageElement = document.querySelector('.image-option[style*="border: 2px solid green"]');
        if (selectedImageElement) {
            // Use the src of the selected predefined image
            imageToSave = selectedImageElement.getAttribute('src');
        } else if (customImageUrlInput.value) {
            // Use the custom URL if provided
            imageToSave = customImageUrlInput.value;
        } else {
            // Default image URL
            imageToSave = "https://web1.sa.appsflyer.com/xdash_images/af_icon_rainbow.png";
        }
    
        chrome.storage.sync.set({ mappings: allMappings, selectedImage: imageToSave }, () => {
            console.log("Mappings and selected image saved:", allMappings, imageToSave);
            unsavedChangesMsg.style.display = 'none';
        });
    }
    

    function loadExistingMappings() {
        console.log("Loading existing mappings");
        chrome.storage.sync.get(['mappings'], function(result) {
            if (result.mappings) {
                result.mappings.forEach(mapping => addMappingRow(mapping.section, mapping.original, mapping.newText));
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
});
