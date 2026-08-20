import React, { useState, useEffect, useRef } from 'react';
import { Languages, Search, X, Check, RotateCcw, Globe } from 'lucide-react';

export const LANGUAGES = [
  { code: 'en', name: 'English', native: 'English', flag: '🇺🇸' },
  { code: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ', flag: '🇮🇳' },
  { code: 'hi', name: 'Hindi', native: 'हिन्दी', flag: '🇮🇳' },
  { code: 'ta', name: 'Tamil', native: 'தமிழ்', flag: '🇮🇳' },
  { code: 'te', name: 'Telugu', native: 'తెలుగు', flag: '🇮🇳' },
  { code: 'mr', name: 'Marathi', native: 'ಮರಾಠಿ', flag: '🇮🇳' },
  { code: 'bn', name: 'Bengali', native: 'বাংলা', flag: '🇮🇳' },
  { code: 'gu', name: 'Gujarati', native: 'ગુજરાતી', flag: '🇮🇳' },
  { code: 'ml', name: 'Malayalam', native: 'മലയാളം', flag: '🇮🇳' },
  { code: 'pa', name: 'Punjabi', native: 'ਪੰਜਾਬੀ', flag: '🇮🇳' },
  { code: 'es', name: 'Spanish', native: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'French', native: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'German', native: 'Deutsch', flag: '🇩🇪' },
  { code: 'ja', name: 'Japanese', native: '日本語', flag: '🇯🇵' },
  { code: 'zh-CN', name: 'Chinese (Simp.)', native: '中文', flag: '🇨🇳' },
  { code: 'ar', name: 'Arabic', native: 'العربية', flag: '🇸🇦' },
  { code: 'pt', name: 'Portuguese', native: 'Português', flag: '🇧🇷' },
  { code: 'ru', name: 'Russian', native: 'Русский', flag: '🇷🇺' },
  { code: 'it', name: 'Italian', native: 'Italiano', flag: '🇮🇹' },
  { code: 'ko', name: 'Korean', native: '한국어', flag: '🇰🇷' },
  { code: 'nl', name: 'Dutch', native: 'Nederlands', flag: '🇳🇱' },
  { code: 'tr', name: 'Turkish', native: 'Türkçe', flag: '🇹🇷' }
];

export const LanguageTranslator = ({ isFloating = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentLang, setCurrentLang] = useState('en');
  const modalRef = useRef(null);

  // Helper to retrieve active language from googtrans cookie
  const getActiveLangCode = () => {
    const cookies = document.cookie.split(';');
    for (let c of cookies) {
      const [key, val] = c.trim().split('=');
      if (key === 'googtrans' && val) {
        const parts = val.split('/');
        const lang = parts[parts.length - 1];
        if (lang && lang !== 'en' && lang !== 'null') return lang;
      }
    }
    return 'en';
  };

  useEffect(() => {
    const active = getActiveLangCode();
    setCurrentLang(active);

    // Dynamically insert google_translate_element div if missing
    if (!document.getElementById('google_translate_element')) {
      const gDiv = document.createElement('div');
      gDiv.id = 'google_translate_element';
      gDiv.style.cssText = 'position: absolute; top: -9999px; left: -9999px; width: 1px; height: 1px; overflow: hidden; opacity: 0; pointer-events: none;';
      document.body.appendChild(gDiv);
    }

    // Define global callback if missing
    window.googleTranslateElementInit = function() {
      if (window.google && window.google.translate) {
        try {
          new window.google.translate.TranslateElement({
            pageLanguage: 'en',
            autoDisplay: false,
            layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE
          }, 'google_translate_element');
        } catch (e) {
          console.warn('Google Translate init warning:', e);
        }
      }
    };

    // Load Google Translate script dynamically if not loaded
    if (!document.getElementById('google-translate-script')) {
      const script = document.createElement('script');
      script.id = 'google-translate-script';
      script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(e.target) &&
        !e.target.closest('.translator-trigger')
      ) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const clearAllGoogtransCookies = () => {
    const hostname = window.location.hostname;
    const parts = hostname.split('.');
    const domains = [
      '',
      hostname,
      '.' + hostname,
      parts.length >= 2 ? '.' + parts.slice(-2).join('.') : '',
      parts.length >= 3 ? '.' + parts.slice(-3).join('.') : ''
    ];
    const paths = ['/', '/post', '/admin', ''];

    domains.forEach((dom) => {
      paths.forEach((p) => {
        const dAttr = dom ? `; domain=${dom}` : '';
        const pAttr = p ? `; path=${p}` : '; path=/';
        document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC${dAttr}${pAttr}`;
        document.cookie = `googtrans=/en/en; expires=Thu, 01 Jan 1970 00:00:00 UTC${dAttr}${pAttr}`;
      });
    });

    document.cookie = `googtrans=/en/en; path=/; domain=${hostname}`;
    document.cookie = `googtrans=/en/en; path=/`;
  };

  const handleSelectLanguage = (langCode) => {
    if (langCode === 'en') {
      handleReset();
      return;
    }

    setCurrentLang(langCode);
    setIsOpen(false);

    const hostname = window.location.hostname;
    const parts = hostname.split('.');
    const parentDomain = parts.length >= 2 ? '.' + parts.slice(-2).join('.') : hostname;

    document.cookie = `googtrans=/en/${langCode}; path=/; domain=${hostname}`;
    document.cookie = `googtrans=/en/${langCode}; path=/; domain=${parentDomain}`;
    document.cookie = `googtrans=/en/${langCode}; path=/`;
    document.cookie = `googtrans=/auto/${langCode}; path=/; domain=${hostname}`;
    document.cookie = `googtrans=/auto/${langCode}; path=/; domain=${parentDomain}`;
    document.cookie = `googtrans=/auto/${langCode}; path=/`;

    const selectElem = document.querySelector('.goog-te-combo');
    if (selectElem) {
      selectElem.value = langCode;
      selectElem.dispatchEvent(new Event('change', { bubbles: true }));
      selectElem.dispatchEvent(new Event('input', { bubbles: true }));
    }

    setTimeout(() => {
      window.location.reload();
    }, 150);
  };

  const handleReset = () => {
    setCurrentLang('en');
    setIsOpen(false);

    clearAllGoogtransCookies();

    const selectElem = document.querySelector('.goog-te-combo');
    if (selectElem) {
      selectElem.value = '';
      selectElem.dispatchEvent(new Event('change', { bubbles: true }));
      selectElem.dispatchEvent(new Event('input', { bubbles: true }));
    }

    try {
      const iframe = document.querySelector('iframe.goog-te-banner-frame');
      if (iframe && iframe.contentWindow) {
        const restoreBtn = iframe.contentWindow.document.querySelector('button');
        if (restoreBtn) restoreBtn.click();
      }
    } catch (e) {
      // Ignore cross-origin error
    }

    setTimeout(() => {
      window.location.reload();
    }, 150);
  };

  const filteredLanguages = LANGUAGES.filter(
    (l) =>
      l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.native.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeLangObj = LANGUAGES.find((l) => l.code === currentLang) || LANGUAGES[0];

  return (
    <>
      {/* Trigger Button (Floating or Header) */}
      {isFloating ? (
        <button
          className="translator-floating-btn translator-trigger"
          onClick={() => setIsOpen(!isOpen)}
          title="Translate Page (A to Z)"
          aria-label="Language Translator"
        >
          <Languages size={20} />
          {currentLang !== 'en' && (
            <span className="floating-lang-badge">{activeLangObj.code.toUpperCase()}</span>
          )}
        </button>
      ) : (
        <button
          className="translator-nav-btn translator-trigger"
          onClick={() => setIsOpen(!isOpen)}
          title="Translate Blog Language"
          aria-label="Language Translator"
        >
          <Languages size={18} />
          <span className="lang-name-label">{activeLangObj.flag} {activeLangObj.code.toUpperCase()}</span>
        </button>
      )}

      {/* Modern Glassmorphism Translator Modal / Popover */}
      {isOpen && (
        <div className="translator-modal-overlay">
          <div className="translator-modal-card" ref={modalRef}>
            {/* Modal Header */}
            <div className="translator-modal-header">
              <div className="translator-header-title">
                <Globe size={20} className="translator-header-icon" />
                <div>
                  <h3>Translate Blog (A to Z)</h3>
                  <p>Choose your language for full page translation</p>
                </div>
              </div>
              <button
                className="translator-close-btn"
                onClick={() => setIsOpen(false)}
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            {/* Search Input */}
            <div className="translator-search-wrapper">
              <Search size={16} className="search-icon" />
              <input
                type="text"
                placeholder="Search language (e.g. Kannada, Hindi, Marathi, Spanish, French)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
              {searchQuery && (
                <button className="clear-search-btn" onClick={() => setSearchQuery('')}>
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Quick Access Badges */}
            <div className="translator-quick-chips">
              <span className="chip-label">Popular:</span>
              {['en', 'kn', 'hi', 'mr', 'es', 'fr', 'de', 'ja'].map((code) => {
                const item = LANGUAGES.find((l) => l.code === code);
                if (!item) return null;
                return (
                  <button
                    key={code}
                    className={`translator-chip ${currentLang === code ? 'active' : ''}`}
                    onClick={() => handleSelectLanguage(code)}
                  >
                    <span>{item.flag}</span> {item.name}
                  </button>
                );
              })}
            </div>

            {/* Language Grid List */}
            <div className="translator-grid">
              {filteredLanguages.map((lang) => {
                const isSelected = currentLang === lang.code;
                return (
                  <div
                    key={lang.code}
                    className={`translator-card-item ${isSelected ? 'selected' : ''}`}
                    onClick={() => handleSelectLanguage(lang.code)}
                  >
                    <div className="lang-info">
                      <span className="lang-flag">{lang.flag}</span>
                      <div>
                        <div className="lang-english-name">{lang.name}</div>
                        <div className="lang-native-name">{lang.native}</div>
                      </div>
                    </div>
                    {isSelected && <Check size={16} className="selected-icon" />}
                  </div>
                );
              })}

              {filteredLanguages.length === 0 && (
                <div className="translator-no-results">
                  No languages found matching "{searchQuery}"
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="translator-modal-footer">
              {currentLang !== 'en' ? (
                <button className="translator-reset-btn" onClick={handleReset}>
                  <RotateCcw size={14} /> Reset to Original English
                </button>
              ) : (
                <span className="translator-info-text">Translates all headings, articles & content A to Z</span>
              )}
              <span className="powered-by-tag">Powered by Google Translate</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
