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
      { section: 'inAppEvents', original: 'level_5_achieved', newText: 'Gaming Event' }
      // Add more mappings as needed
    ]
    // Additional configurations or comments here
  },
  'button-ecommerce': {
    // Add configurations for e-commerce
    iconUrl: 'icons/af_icon_orange.png',
    mappings: [
      { section: 'inAppEvents', original: 'level_5_achieved', newText: 'eComm Event' }
      // Add more mappings as needed
    ]
    // Additional configurations or comments here
  },
  'button-banking': {
    // Add configurations for travel
    iconUrl: 'icons/af_icon_green.png',
    mappings: [
      { section: 'inAppEvents', original: 'level_5_achieved', newText: 'Banking Event' }
      // Add more mappings as needed
    ]
    // Additional configurations or comments here
  },
  'button-general': {
    // Add configurations for travel
    iconUrl: 'icons/af_icon_rainbow.png',
    mappings: [
      { section: 'inAppEvents', original: 'level_5_achieved', newText: 'General Event' }
      // Add more mappings as needed
    ]
    // Additional configurations or comments here
  }
  // Add other buttons as needed
};
