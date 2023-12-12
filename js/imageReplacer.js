// imageReplacer.js

import { removeLoadingOverlay } from './loadingOverlay.js';

export function replaceImage() {
    console.log("Attempting to replace images");
    chrome.storage.sync.get(["selectedImage"], function (result) {
      let imageToUse = result.selectedImage;
      console.log(`Image to use: ${imageToUse}`);

      if (!imageToUse) {
        console.log("No selected image found in storage, using default");
        imageToUse =
          "https://web1.sa.appsflyer.com/xdash_images/af_icon_rainbow.png"; // Default image URL
      }

      let images = document.querySelectorAll(".MuiAvatar-img");
      let imagesChanged = 0;
      let totalImages = images.length;

      console.log(
        `Found ${totalImages} images for replacement with '${imageToUse}'`
      );

      if (totalImages === 0) {
        removeLoadingOverlay();
        return;
      }

      images.forEach(function (img, index) {
        img.onload = function () {
          console.log(`Image ${index} loaded: ${img.src}`);
          imagesChanged++;
          if (imagesChanged === totalImages) {
            console.log("All images loaded, removing overlay");
            removeLoadingOverlay();
          }
        };
        img.onerror = function () {
          console.log(`Error loading image ${index}`);
        };

        img.src = imageToUse;
      });

      // Fallback mechanism
      setTimeout(() => {
        if (imagesChanged !== totalImages) {
          console.log("Fallback: Removing overlay");
          removeLoadingOverlay();
        }
      }, 5000); // Adjust the timeout as necessary
    });
  }