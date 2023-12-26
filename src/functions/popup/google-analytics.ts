const GA_ENDPOINT = 'https://www.google-analytics.com/mp/collect';
const GA_DEBUG_ENDPOINT = 'https://www.google-analytics.com/debug/mp/collect';

const MEASUREMENT_ID = 'G-MK76Z35GVB';
const API_SECRET = 'hlO6ouhqRxOxVyWkEk8eQw';
const DEFAULT_ENGAGEMENT_TIME_MSEC = 100;
const SESSION_EXPIRATION_IN_MIN = 30;

interface SessionData {
  session_id: string;
  timestamp: string;
}

export class Analytics {
  private debug: boolean;

  constructor(debug = false) {
    this.debug = debug;
  }

  async getOrCreateClientId(): Promise<string> {
    const { clientId } = await chrome.storage.local.get('clientId');
    if (!clientId) {
      const newClientId = self.crypto.randomUUID();
      await chrome.storage.local.set({ clientId: newClientId });
      return newClientId;
    }
    return clientId;
  }

  async getOrCreateSessionId(): Promise<string> {
    let sessionData = await chrome.storage.session.get('sessionData') as { sessionData?: SessionData };
    const currentTimeInMs = Date.now();

    // Check if sessionData exists and has a timestamp
    if (sessionData && sessionData.sessionData && sessionData.sessionData.timestamp) {
      const durationInMin = (currentTimeInMs - parseInt(sessionData.sessionData.timestamp)) / 60000;
      if (durationInMin > SESSION_EXPIRATION_IN_MIN) {
        sessionData.sessionData = undefined; // Reset session data
      } else {
        sessionData.sessionData.timestamp = currentTimeInMs.toString(); // Update timestamp
        await chrome.storage.session.set({ sessionData: sessionData.sessionData });
      }
    }

    // If sessionData is undefined or doesn't exist, create a new one
    if (!sessionData || !sessionData.sessionData) {
      const newSessionData: SessionData = {
        session_id: currentTimeInMs.toString(),
        timestamp: currentTimeInMs.toString(),
      };
      await chrome.storage.session.set({ sessionData: newSessionData });
      return newSessionData.session_id;
    }

    // Return existing session id
    return sessionData.sessionData.session_id;
  }


  async fireEvent(name: string, params: Record<string, any> = {}): Promise<void> {
    if (!params.session_id) {
      params.session_id = await this.getOrCreateSessionId();
    }
    if (!params.engagement_time_msec) {
      params.engagement_time_msec = DEFAULT_ENGAGEMENT_TIME_MSEC;
    }

    try {
      const response = await fetch(
        `${this.debug ? GA_DEBUG_ENDPOINT : GA_ENDPOINT}?measurement_id=${MEASUREMENT_ID}&api_secret=${API_SECRET}`,
        {
          method: 'POST',
          body: JSON.stringify({
            client_id: await this.getOrCreateClientId(),
            events: [{ name, params }],
          }),
        },
      );
      if (this.debug) {
        console.log(await response.text());
      }
    } catch (e) {
      console.error('Google Analytics request failed with an exception', e);
    }
  }

  async firePageViewEvent(pageTitle: string, pageLocation: string, additionalParams: Record<string, any> = {}): Promise<void> {
    return this.fireEvent('page_view', {
      page_title: pageTitle,
      page_location: pageLocation,
      ...additionalParams,
    });
  }

  async fireErrorEvent(error: Record<string, any>, additionalParams: Record<string, any> = {}): Promise<void> {
    return this.fireEvent('extension_error', {
      ...error,
      ...additionalParams,
    });
  }
}

export default new Analytics();
