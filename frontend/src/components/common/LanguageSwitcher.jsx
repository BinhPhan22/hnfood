import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronDownIcon, GlobeAltIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const LanguageSwitcher = ({ className = '' }) => {
  const { i18n, t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const languages = [
    {
      code: 'vi',
      name: 'Tiếng Việt',
      flag: '🇻🇳',
      country: 'Vietnam'
    },
    {
      code: 'en',
      name: 'English',
      flag: '🇺🇸',
      country: 'United States'
    }
  ];

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const changeLanguage = async (languageCode) => {
    try {
      await i18n.changeLanguage(languageCode);
      setIsOpen(false);
      
      // Show success message
      const languageName = languages.find(lang => lang.code === languageCode)?.name;
      toast.success(t('language.change_success'), {
        icon: languages.find(lang => lang.code === languageCode)?.flag,
        duration: 2000
      });

      // Save to localStorage for persistence
      localStorage.setItem('i18nextLng', languageCode);
      
      // Optional: Send analytics event
      if (window.gtag) {
        window.gtag('event', 'language_change', {
          'language': languageCode,
          'previous_language': currentLanguage.code
        });
      }
    } catch (error) {
      console.error('Error changing language:', error);
      toast.error('Failed to change language');
    }
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Language Selector Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
        aria-label={t('language.select')}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <GlobeAltIcon className="h-4 w-4" />
        <span className="hidden sm:block">{currentLanguage.flag}</span>
        <span className="hidden md:block">{currentLanguage.name}</span>
        <ChevronDownIcon 
          className={`h-4 w-4 transition-transform duration-200 ${
            isOpen ? 'transform rotate-180' : ''
          }`} 
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100">
            {t('language.select')}
          </div>
          
          {languages.map((language) => (
            <button
              key={language.code}
              onClick={() => changeLanguage(language.code)}
              className={`w-full flex items-center space-x-3 px-3 py-2 text-sm text-left hover:bg-gray-50 transition-colors duration-150 ${
                currentLanguage.code === language.code
                  ? 'bg-primary-50 text-primary-600 font-medium'
                  : 'text-gray-700'
              }`}
              role="menuitem"
            >
              <span className="text-lg">{language.flag}</span>
              <div className="flex-1">
                <div className="font-medium">{language.name}</div>
                <div className="text-xs text-gray-500">{language.country}</div>
              </div>
              {currentLanguage.code === language.code && (
                <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
              )}
            </button>
          ))}
          
          {/* Auto-detection info */}
          <div className="border-t border-gray-100 mt-1 pt-2 px-3 pb-2">
            <div className="text-xs text-gray-500">
              <div className="flex items-center space-x-1">
                <span>🌍</span>
                <span>Auto-detected based on location</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Mobile Language Switcher for smaller screens
export const MobileLanguageSwitcher = ({ className = '' }) => {
  const { i18n, t } = useTranslation();

  const languages = [
    { code: 'vi', name: 'Tiếng Việt', flag: '🇻🇳' },
    { code: 'en', name: 'English', flag: '🇺🇸' }
  ];

  const changeLanguage = async (languageCode) => {
    try {
      await i18n.changeLanguage(languageCode);
      toast.success(t('language.change_success'), {
        icon: languages.find(lang => lang.code === languageCode)?.flag,
        duration: 2000
      });
      localStorage.setItem('i18nextLng', languageCode);
    } catch (error) {
      console.error('Error changing language:', error);
      toast.error('Failed to change language');
    }
  };

  return (
    <div className={`flex space-x-2 ${className}`}>
      {languages.map((language) => (
        <button
          key={language.code}
          onClick={() => changeLanguage(language.code)}
          className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
            i18n.language === language.code
              ? 'bg-primary-100 text-primary-700 border border-primary-200'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <span>{language.flag}</span>
          <span>{language.name}</span>
        </button>
      ))}
    </div>
  );
};

export default LanguageSwitcher;
