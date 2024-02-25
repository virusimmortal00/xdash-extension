import { createLoadingOverlay } from './functions/content/loadingOverlay';
import { replaceImage } from './functions/content/imageReplacer';
import { observeDOMChanges } from './functions/content/DOMObserver';
import { createAnimationStyles } from './functions/content/createAnimationStyles';
import { replaceTextInElement } from './functions/content/textReplacer';
import './styles/content.scss';

const url: string = window.location.href;

function checkExtensionStateAndRun(): void {
  chrome.runtime.sendMessage({action: 'getExtensionState'}, function(response) {
    if (response.extensionEnabled === true) {
      // Run only if explicitly set to true
      console.log('Extension is enabled. Running main functions...');
      mainFunctions();
    } else {
      // This will cover both false and undefined scenarios
      console.log('Extension is disabled or not yet configured.');
    }
  });
}


function mainFunctions(): void {
  const url: string = window.location.href;

  if (!url.includes('com.appsflyer.android.demo.app.gaming') && !url.includes('id1510243350')) {
    return;
  }

  console.log('Running main functions...');
  createLoadingOverlay();
  createAnimationStyles();

  let interval: number = window.setInterval(function () {
    if (document.querySelector('[class^="MuiAvatar-img"]')) {
      console.log('Starting image and text replacement process');
      replaceImage();
      replaceTextInElement(document.body);
      clearInterval(interval);
    }
  }, 2000);

  observeDOMChanges();
}

checkExtensionStateAndRun();
