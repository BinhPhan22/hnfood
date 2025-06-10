import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

// Import translation files
import viTranslations from './locales/vi.json';
import enTranslations from './locales/en.json';

// Function to detect user's country based on IP
const detectCountry = async () => {
  try {
    const response = await fetch('https://ipapi.co/json/');
    const data = await response.json();
    return data.country_code;
  } catch (error) {
    console.log('Could not detect country, defaulting to VN');
    return 'VN';
  }
};

// Custom language detector that considers geography
const customLanguageDetector = {
  name: 'customDetector',
  
  async: true,
  
  detect: async (callback) => {
    // First check if user has previously selected a language
    const savedLanguage = localStorage.getItem('i18nextLng');
    if (savedLanguage) {
      callback(savedLanguage);
      return;
    }
    
    // Then check browser language
    const browserLang = navigator.language || navigator.userLanguage;
    
    // Finally check geographic location
    try {
      const country = await detectCountry();
      
      // If user is in Vietnam or has Vietnamese browser, default to Vietnamese
      if (country === 'VN' || browserLang.startsWith('vi')) {
        callback('vi');
      } else {
        // For other countries, default to English
        callback('en');
      }
    } catch (error) {
      // Fallback to browser language or Vietnamese
      if (browserLang.startsWith('vi')) {
        callback('vi');
      } else {
        callback('en');
      }
    }
  },
  
  init: () => {},
  
  cacheUserLanguage: (lng) => {
    localStorage.setItem('i18nextLng', lng);
  }
};

i18n
  // Load translation using http backend
  .use(Backend)
  // Detect user language
  .use(LanguageDetector)
  // Pass the i18n instance to react-i18next
  .use(initReactI18next)
  // Initialize i18next
  .init({
    // Add custom detector
    detection: {
      order: ['customDetector', 'localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng'
    },
    
    // Fallback language
    fallbackLng: 'vi',
    
    // Debug mode (disable in production)
    debug: process.env.NODE_ENV === 'development',
    
    // Resources (inline translations)
    resources: {
      vi: {
        translation: viTranslations
      },
      en: {
        translation: enTranslations
      }
    },
    
    // Interpolation options
    interpolation: {
      escapeValue: false // React already does escaping
    },
    
    // React options
    react: {
      useSuspense: false // Disable suspense for now
    },
    
    // Backend options (if using http backend)
    backend: {
      loadPath: '/locales/{{lng}}.json',
      addPath: '/locales/add/{{lng}}/{{ns}}'
    }
  });

// Add custom detector
i18n.services.languageDetector.addDetector(customLanguageDetector);

export default i18n;
