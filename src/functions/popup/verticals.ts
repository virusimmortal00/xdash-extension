import { Mapping } from './Mapping'; // Adjust the path as necessary

interface ButtonConfig {
  iconUrl?: string;
  mappings?: Mapping[];
}

// Define button configurations with comments
export const buttonConfigs: Record<string, ButtonConfig> = {
  'button-gaming': {
    iconUrl: 'icons/af_icon_red.png',
    mappings: [
      { section: 'inAppEvents', original: 'level_5_achieved', newText: 'Purchase' },
      { section: 'inAppEvents', original: 'af_purchase', newText: 'Level 3 Achieved' },
      { section: 'inAppEvents', original: 'level_10_achieved', newText: 'Level 10 Achieved' },
      { section: 'inAppEvents', original: 'tutorial_completed', newText: 'Deposit' },
      { section: 'inAppEvents', original: 'ad_monetized', newText: 'Log In' }
    ]
    
    // Additional configurations or comments here
  },
  'button-ecommerce': {
    // Add configurations for e-commerce
    iconUrl: 'icons/af_icon_orange.png',
    mappings: [
      { section: 'inAppEvents', original: 'level_5_achieved', newText: 'Log-in' },
      { section: 'inAppEvents', original: 'af_purchase', newText: 'Purchase' },
      { section: 'inAppEvents', original: 'level_10_achieved', newText: 'Add to Wishlist' },
      { section: 'inAppEvents', original: 'tutorial_completed', newText: 'First Purchase' },
      { section: 'inAppEvents', original: 'ad_monetized', newText: 'Loyalty Signup' }
    ]    
    // Additional configurations or comments here
  },
  'button-banking': {
    // Add configurations for travel
    iconUrl: 'icons/af_icon_green.png',
    mappings: [
      { section: 'inAppEvents', original: 'level_5_achieved', newText: 'Application Started' },
      { section: 'inAppEvents', original: 'af_purchase', newText: 'Application Completed' },
      { section: 'inAppEvents', original: 'level_10_achieved', newText: 'Application Approved' },
      { section: 'inAppEvents', original: 'tutorial_completed', newText: 'First Deposit' },
      { section: 'inAppEvents', original: 'ad_monetized', newText: 'Create Account' }
    ]    
    // Additional configurations or comments here
  },
  'button-general': {
    // Add configurations for travel
    iconUrl: 'icons/af_icon_rainbow.png',
    mappings: [
      { section: 'inAppEvents', original: 'level_5_achieved', newText: 'Create Account' },
      { section: 'inAppEvents', original: 'af_purchase', newText: 'Add to Cart' },
      { section: 'inAppEvents', original: 'level_10_achieved', newText: 'Purchase' },
      { section: 'inAppEvents', original: 'tutorial_completed', newText: 'First Purchase' },
      { section: 'inAppEvents', original: 'ad_monetized', newText: 'Booking' }
    ]    
    // Additional configurations or comments here
  }
  // Add other buttons as needed
};

