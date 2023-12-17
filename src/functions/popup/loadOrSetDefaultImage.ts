import { selectImage } from './selectImage';

export const customImagePreview = document.getElementById('customImagePreview') as HTMLElement;
export const customImageUrlInput = document.getElementById('customImageUrl') as HTMLInputElement;

export function loadOrSetDefaultImage() {
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