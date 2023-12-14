// imageReplacer.js

import {removeLoadingOverlay } from './loadingOverlay.js';


export function replaceImage() {
  console.log("Attempting to replace images");
  chrome.storage.sync.get(["selectedImage"], function (result) {
    let imageToUse = result.selectedImage;
    console.log(`Image to use: ${imageToUse}`);

    // Convert local image path to a web-accessible URL
    if (imageToUse && imageToUse.startsWith('icons/')) {
        imageToUse = chrome.runtime.getURL(imageToUse);
    }

    if (!imageToUse) {
      console.log("No selected image found in storage, using default");
      // Update the default image path to a web-accessible URL
      imageToUse = chrome.runtime.getURL("icons/af_icon_rainbow.png");
    }

    let images;
    if (window.location.href.includes("onelink")) {
        // If the current URL contains "onelink"
        images = document.querySelectorAll('[class^="onelink-MuiAvatar-img"]'); // For OneLink
    } else {
        // If the current URL does not contain "onelink"
        images = document.querySelectorAll('[class^="MuiAvatar-img"]');
    }

    let imagesChanged = 0;
    let totalImages = images.length;

    console.log(`Found ${totalImages} images for replacement with '${imageToUse}'`);

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
