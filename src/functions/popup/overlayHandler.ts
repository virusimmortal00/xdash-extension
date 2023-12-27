import { doc, getDoc, setDoc, addDoc, collection } from 'firebase/firestore';
import { db } from './firebaseInit'; // Adjust the import path as necessary
import AnalyticsHandler from './analyticsHandler';

export class OverlayHandler {
  private analyticsHandler: AnalyticsHandler;

  constructor(analyticsHandler: AnalyticsHandler) {
    this.analyticsHandler = analyticsHandler;
  }

  public initializeOverlay() {
    console.log('OverlayHandler initialized');
    const overlay = document.getElementById('overlay');
    if (!overlay) {
      console.error('Overlay element not found');
      return;
    }

    chrome.storage.sync.get(['firstLaunch'], (result) => {
      if (result.firstLaunch === undefined) {
        overlay.style.display = 'flex';
      }
    });

    const submitButton = document.getElementById('submitOverlay');
    if (!submitButton) {
      console.error('Submit button not found');
      return;
    }
    submitButton.addEventListener('click', () => {
      this.handleSubmit();
    });
  }

  private async handleSubmit() {
    const submitButton = document.getElementById(
      'submitOverlay'
    ) as HTMLButtonElement;
    const overlaySubmitSpinner = submitButton.querySelector(
      '.overlay-submit-spinner'
    ) as HTMLElement;

    overlaySubmitSpinner.style.display = 'inline-block'; // Show spinner
    submitButton.disabled = true; // Disable the button to prevent multiple submits

    const afGmailInput = document.getElementById('afGmail') as HTMLInputElement;
    const afRegionSelect = document.getElementById(
      'afRegion'
    ) as HTMLSelectElement;
    const afTeamSelect = document.getElementById('afTeam') as HTMLSelectElement;

    if (!afGmailInput || !afRegionSelect || !afTeamSelect) {
      console.error('One or more input elements not found');
      return;
    }

    afGmailInput.classList.remove('error');
    const errorMessage = afGmailInput.nextElementSibling as HTMLElement;
    if (errorMessage) errorMessage.textContent = '';

    const afGmail = afGmailInput.value.trim();
    if (!this.validateEmail(afGmail)) {
      afGmailInput.classList.add('error');
      if (errorMessage)
        errorMessage.textContent =
          'Please enter a valid AppsFlyer email address.';
      return;
    }

    const afRegion = afRegionSelect.value;
    const afTeam = afTeamSelect.value;
    const currentDate = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD

    try {
      const userRef = doc(db, 'users', afGmail);
      const docSnap = await getDoc(userRef);

      if (docSnap.exists()) {
        // User exists, handle re-install logic
        await this.logInstall(afGmail, 're-install', currentDate);
        this.analyticsHandler.fireEvent('re_install', {
          afGmail,
          afRegion,
          afTeam,
        });
        console.log('Analytics Event Fired: Re-install');
      } else {
        // New user, save their data
        await setDoc(userRef, {
          afGmail,
          afRegion,
          afTeam,
          firstInstallDate: currentDate,
        });
        await this.logInstall(afGmail, 'install', currentDate);
        this.analyticsHandler.fireEvent('new_user', {
          afGmail,
          afRegion,
          afTeam,
        });
        console.log('Analytics Event Fired: New User');
      }
    } catch (error) {
      console.error('Error interacting with Firestore:', error);
    }

    chrome.storage.sync.set(
      {
        firstLaunch: false,
        afGmail: afGmail,
        afRegion: afRegion,
        afTeam: afTeam,
        extensionEnabled: true,
      },
      () => {
        this.updateExtensionEnabledCheckbox(true);
      }
    );

    const overlay = document.getElementById('overlay');
    if (overlay) {
      overlay.style.display = 'none';
    } else {
      console.error('Overlay element not found');
    }

    overlaySubmitSpinner.style.display = 'none';
    submitButton.disabled = false;

    // Check if overlay exists before manipulating it
    if (overlay) {
      overlay.style.opacity = '0';
      setTimeout(() => {
        if (overlay) {
          // Check again in case the element was removed from the DOM in the meantime
          overlay.style.display = 'none';
        }
      }, 500); // Adjust the timeout to match your fade duration
    } else {
      console.error('Overlay element not found');
    }
  }

  private async logInstall(
    userEmail: string,
    installType: string,
    installDate: string
  ): Promise<void> {
    await addDoc(collection(db, 'installs'), {
      userEmail,
      installType,
      installDate,
    });
  }

  private updateExtensionEnabledCheckbox(isEnabled: boolean): void {
    const checkbox = document.getElementById(
      'extensionStatusCheckbox'
    ) as HTMLInputElement;
    if (checkbox) {
      checkbox.checked = isEnabled;
    } else {
      console.error('Extension status checkbox not found');
    }
  }

  private validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) && email.endsWith('@appsflyer.com');
  }
}
