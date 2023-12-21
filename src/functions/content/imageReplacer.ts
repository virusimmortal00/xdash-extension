import { removeLoadingOverlay } from './loadingOverlay';

export function replaceImage(): void {
  console.log('Attempting to replace images');
  chrome.storage.sync.get(
    ['selectedImage'],
    (result: { selectedImage?: string }) => {
      // Provide a default image URL if selectedImage is undefined
      let imageToUse =
        result.selectedImage ||
        chrome.runtime.getURL('icons/af_icon_rainbow.png');
      console.log(`Image to use: ${imageToUse}`);

      // Convert local image path to a web-accessible URL if it's from the icons directory
      if (imageToUse.startsWith('icons/')) {
        imageToUse = chrome.runtime.getURL(imageToUse);
      }

      const selector = window.location.href.includes('onelink')
        ? '[class^="onelink-MuiAvatar-img"]' // For OneLink
        : '[class^="MuiAvatar-img"]'; // For other URLs

      const images = document.querySelectorAll<HTMLImageElement>(selector);
      let imagesChanged = 0;
      const totalImages = images.length;

      console.log(
        `Found ${totalImages} images for replacement with '${imageToUse}'`
      );

      if (totalImages === 0) {
        removeLoadingOverlay();
        return;
      }

      images.forEach((img, index) => {
        img.onload = () => {
          console.log(`Image ${index} loaded: ${img.src}`);
          imagesChanged++;
          if (imagesChanged === totalImages) {
            console.log('All images loaded, removing overlay');
            removeLoadingOverlay();
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
          console.log('Fallback: Removing overlay');
          removeLoadingOverlay();
        }
      }, 5000); // Adjust the timeout as necessary
    }
  );
}
