// overlayHandler.ts
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

    private handleSubmit() {
        const afGmailInput = document.getElementById('afGmail') as HTMLInputElement;
        const afRegionSelect = document.getElementById('afRegion') as HTMLSelectElement;
        const afTeamSelect = document.getElementById('afTeam') as HTMLSelectElement;

        if (!afGmailInput || !afRegionSelect || !afTeamSelect) {
            console.error('One or more input elements not found');
            return;
        }

        // Reset validation styles and messages
        afGmailInput.classList.remove('error');
        const errorMessage = afGmailInput.nextElementSibling as HTMLElement;
        if (errorMessage) errorMessage.textContent = '';

        const afGmail = afGmailInput.value.trim();
        if (!this.validateEmail(afGmail)) {
            // Apply error styling and show error message
            afGmailInput.classList.add('error');
            if (errorMessage) errorMessage.textContent = "Please enter a valid AppsFlyer email address.";
            return;
        }

        const afRegion = afRegionSelect.value;
        const afTeam = afTeamSelect.value;

        chrome.storage.sync.set({
            firstLaunch: false,
            afGmail: afGmail,
            afRegion: afRegion,
            afTeam: afTeam,
            extensionEnabled: true // Enable the extension
        }, () => {
            this.updateExtensionEnabledCheckbox(true); // Update the checkbox state
        });
    
        const overlay = document.getElementById('overlay');
        if (overlay) {
            overlay.style.display = 'none';
        } else {
            console.error('Overlay element not found');
        }
    
        this.analyticsHandler.fireEvent('new_user', { afGmail, afRegion, afTeam });
    }

    private updateExtensionEnabledCheckbox(isEnabled: boolean): void {
        const checkbox = document.getElementById('extensionStatusCheckbox') as HTMLInputElement;
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
