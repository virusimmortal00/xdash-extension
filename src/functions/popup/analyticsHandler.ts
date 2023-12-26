import { Analytics } from './google-analytics';

export class AnalyticsHandler {
  private analytics: Analytics;

  constructor() {
    this.analytics = new Analytics();
  }
  
  async firePageViewEvent(pageTitle: string, pageLocation: string, additionalParams: Record<string, any> = {}) {
    await this.analytics.firePageViewEvent(pageTitle, pageLocation, additionalParams);
  }

  async fireEvent(name: string, params: Record<string, any> = {}) {
    await this.analytics.fireEvent(name, params);
  }

  async fireErrorEvent(error: Record<string, any>, additionalParams: Record<string, any> = {}) {
    await this.analytics.fireErrorEvent(error, additionalParams);
  }
}

// Export the class itself instead of an instance
export default AnalyticsHandler;
