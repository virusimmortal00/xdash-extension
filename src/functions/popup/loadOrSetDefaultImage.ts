import { selectImage } from './selectImage';

export const customImagePreview = document.getElementById(
  'customImagePreview'
) as HTMLElement;
export const customImageUrlInput = document.getElementById(
  'customImageUrl'
) as HTMLInputElement;

export function loadOrSetDefaultImage() {
  console.log('Loading or setting default image');
  chrome.storage.sync.get(['selectedImage', 'activePreset'], function (result) {
    // Define the default selected image
    console.log('Loaded active preset button:', result.activePreset);
    const defaultSelectedImage = 'icons/af_icon_rainbow.png';
    let selectedImage = result.selectedImage || defaultSelectedImage;
    console.log('Selected image:', selectedImage);

    // Check if the selected image is a predefined image or a custom URL
    const isPredefinedImage = selectedImage.startsWith('icons/');
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

    document.querySelectorAll('.preset-button').forEach(button => {
      button.classList.remove('active');
    });

    // Load and set active preset button
    const activePresetButtonId = result.activePreset || 'button-custom';
    const activePresetButton = document.getElementById(activePresetButtonId);
    console.log('Active preset button:', activePresetButton);
    if (activePresetButton) {
      activePresetButton.classList.add('active');
    }
  });
}
