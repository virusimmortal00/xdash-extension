import { db } from './functions/popup/firebaseInit';
import AnalyticsHandler from './functions/popup/analyticsHandler';

const analyticsHandler = new AnalyticsHandler();


// Use analyticsHandler to call methods, e.g., analyticsHandler.fireEvent(...)


chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getExtensionState') {
    chrome.storage.sync.get(['extensionEnabled'], function (result: any) {
      sendResponse({extensionEnabled: result.extensionEnabled});
    });
    return true;  // Will respond asynchronously.
  }
});

addEventListener('unhandledrejection', async (event) => {
  if (event.reason instanceof Error) {
    await analyticsHandler.fireErrorEvent({ message: event.reason.message });
  } else {
    await analyticsHandler.fireErrorEvent({ message: 'Unhandled rejection with unknown reason' });
  }
});

chrome.runtime.onInstalled.addListener(async () => {
  try {
    await analyticsHandler.fireEvent('install');
  } catch (error) {
    console.error('Error firing install event:', error);
  }
});

// Schedule to throw an exception after a timeout
setTimeout(async () => {
  try {
    await throwAnException();
  } catch (error) {
    if (error instanceof Error) {
      // Now it's safe to assume 'error' is an Error object
      await analyticsHandler.fireErrorEvent({ message: error.message });
    } else {
      // Handle non-Error throwns
      await analyticsHandler.fireErrorEvent({ message: 'Unknown error occurred' });
    }
  }
}, 2000);

async function throwAnException() {
  throw new Error("👋 I'm an error");
}
