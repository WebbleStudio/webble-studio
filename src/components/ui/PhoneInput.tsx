import React, { useState, useEffect, forwardRef } from 'react';
import { motion } from 'framer-motion';

interface CountryCode {
  code: string;
  country: string;
  flag: string;
  format: string; // Pattern per la formattazione
}

const countryCodes: CountryCode[] = [
  // Default
  { code: '+39', country: 'Italia', flag: '🇮🇹', format: 'xxx xxx xxxx' },
  // Altri paesi in ordine alfabetico
  { code: '+213', country: 'Algeria', flag: '🇩🇿', format: 'xxx xx xx xx' },
  { code: '+966', country: 'Arabia Saudita', flag: '🇸🇦', format: 'xx xxx xxxx' },
  { code: '+54', country: 'Argentina', flag: '🇦🇷', format: 'xx xxxx xxxx' },
  { code: '+61', country: 'Australia', flag: '🇦🇺', format: 'xxx xxx xxx' },
  { code: '+43', country: 'Austria', flag: '🇦🇹', format: 'xxx xxxxxxx' },
  { code: '+880', country: 'Bangladesh', flag: '🇧🇩', format: 'xxxx xxxxxx' },
  { code: '+32', country: 'Belgio', flag: '🇧🇪', format: 'xxx xx xx xx' },
  { code: '+375', country: 'Bielorussia', flag: '🇧🇾', format: 'xx xxx xx xx' },
  { code: '+55', country: 'Brasile', flag: '🇧🇷', format: 'xx xxxxx xxxx' },
  { code: '+56', country: 'Cile', flag: '🇨🇱', format: 'x xxxx xxxx' },
  { code: '+86', country: 'Cina', flag: '🇨🇳', format: 'xxx xxxx xxxx' },
  { code: '+57', country: 'Colombia', flag: '🇨🇴', format: 'xxx xxx xxxx' },
  { code: '+82', country: 'Corea del Sud', flag: '🇰🇷', format: 'xx xxxx xxxx' },
  { code: '+385', country: 'Croazia', flag: '🇭🇷', format: 'xx xxx xxxx' },
  { code: '+45', country: 'Danimarca', flag: '🇩🇰', format: 'xx xx xx xx' },
  { code: '+20', country: 'Egitto', flag: '🇪🇬', format: 'xxx xxx xxxx' },
  { code: '+971', country: 'Emirati Arabi', flag: '🇦🇪', format: 'xx xxx xxxx' },
  { code: '+372', country: 'Estonia', flag: '🇪🇪', format: 'xxxx xxxx' },
  { code: '+63', country: 'Filippine', flag: '🇵🇭', format: 'xxx xxx xxxx' },
  { code: '+358', country: 'Finlandia', flag: '🇫🇮', format: 'xx xxx xxxx' },
  { code: '+33', country: 'Francia', flag: '🇫🇷', format: 'x xx xx xx xx' },
  { code: '+49', country: 'Germania', flag: '🇩🇪', format: 'xxx xxxxxxx' },
  { code: '+81', country: 'Giappone', flag: '🇯🇵', format: 'xx xxxx xxxx' },
  { code: '+30', country: 'Grecia', flag: '🇬🇷', format: 'xxx xxx xxxx' },
  { code: '+852', country: 'Hong Kong', flag: '🇭🇰', format: 'xxxx xxxx' },
  { code: '+91', country: 'India', flag: '🇮🇳', format: 'xxxxx xxxxx' },
  { code: '+62', country: 'Indonesia', flag: '🇮🇩', format: 'xxx xxx xxxx' },
  { code: '+98', country: 'Iran', flag: '🇮🇷', format: 'xxx xxx xxxx' },
  { code: '+353', country: 'Irlanda', flag: '🇮🇪', format: 'xx xxx xxxx' },
  { code: '+972', country: 'Israele', flag: '🇮🇱', format: 'xx xxx xxxx' },
  { code: '+254', country: 'Kenya', flag: '🇰🇪', format: 'xxx xxx xxx' },
  { code: '+371', country: 'Lettonia', flag: '🇱🇻', format: 'xx xxx xxx' },
  { code: '+370', country: 'Lituania', flag: '🇱🇹', format: 'xxx xxxxx' },
  { code: '+352', country: 'Lussemburgo', flag: '🇱🇺', format: 'xxx xxx xxx' },
  { code: '+853', country: 'Macao', flag: '🇲🇴', format: 'xxxx xxxx' },
  { code: '+60', country: 'Malesia', flag: '🇲🇾', format: 'xx xxx xxxx' },
  { code: '+212', country: 'Marocco', flag: '🇲🇦', format: 'xxx xxx xxx' },
  { code: '+52', country: 'Messico', flag: '🇲🇽', format: 'xxx xxx xxxx' },
  { code: '+377', country: 'Monaco', flag: '🇲🇨', format: 'xx xx xx xx' },
  { code: '+234', country: 'Nigeria', flag: '🇳🇬', format: 'xxx xxx xxxx' },
  { code: '+47', country: 'Norvegia', flag: '🇳🇴', format: 'xxx xx xxx' },
  { code: '+64', country: 'Nuova Zelanda', flag: '🇳🇿', format: 'xx xxx xxxx' },
  { code: '+31', country: 'Paesi Bassi', flag: '🇳🇱', format: 'x xxxx xxxx' },
  { code: '+92', country: 'Pakistan', flag: '🇵🇰', format: 'xxx xxxxxxx' },
  { code: '+51', country: 'Perù', flag: '🇵🇪', format: 'xxx xxx xxx' },
  { code: '+48', country: 'Polonia', flag: '🇵🇱', format: 'xxx xxx xxx' },
  { code: '+351', country: 'Portogallo', flag: '🇵🇹', format: 'xxx xxx xxx' },
  { code: '+44', country: 'Regno Unito', flag: '🇬🇧', format: 'xxxx xxx xxxx' },
  { code: '+420', country: 'Rep. Ceca', flag: '🇨🇿', format: 'xxx xxx xxx' },
  { code: '+40', country: 'Romania', flag: '🇷🇴', format: 'xxx xxx xxx' },
  { code: '+7', country: 'Russia', flag: '🇷🇺', format: 'xxx xxx xx xx' },
  { code: '+378', country: 'San Marino', flag: '🇸🇲', format: 'xxxx xxxxxx' },
  { code: '+65', country: 'Singapore', flag: '🇸🇬', format: 'xxxx xxxx' },
  { code: '+421', country: 'Slovacchia', flag: '🇸🇰', format: 'xxx xxx xxx' },
  { code: '+386', country: 'Slovenia', flag: '🇸🇮', format: 'xx xxx xxx' },
  { code: '+34', country: 'Spagna', flag: '🇪🇸', format: 'xxx xxx xxx' },
  { code: '+94', country: 'Sri Lanka', flag: '🇱🇰', format: 'xx xxx xxxx' },
  { code: '+27', country: 'Sudafrica', flag: '🇿🇦', format: 'xx xxx xxxx' },
  { code: '+46', country: 'Svezia', flag: '🇸🇪', format: 'xx-xxx xx xx' },
  { code: '+41', country: 'Svizzera', flag: '🇨🇭', format: 'xxx xxx xxx' },
  { code: '+886', country: 'Taiwan', flag: '🇹🇼', format: 'xxxx xxxx' },
  { code: '+66', country: 'Tailandia', flag: '🇹🇭', format: 'xx xxx xxxx' },
  { code: '+90', country: 'Turchia', flag: '🇹🇷', format: 'xxx xxx xxxx' },
  { code: '+380', country: 'Ucraina', flag: '🇺🇦', format: 'xx xxx xxxx' },
  { code: '+36', country: 'Ungheria', flag: '🇭🇺', format: 'xx xxx xxxx' },
  { code: '+1', country: 'USA/Canada', flag: '🇺🇸', format: '(xxx) xxx-xxxx' },
  { code: '+84', country: 'Vietnam', flag: '🇻🇳', format: 'xx xxx xxxx' },
];

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  error?: boolean;
  autoFocus?: boolean;
}

const PhoneInput = forwardRef<HTMLInputElement, PhoneInputProps>(function PhoneInput(
  {
    value,
    onChange,
    placeholder = '123 456 7890',
    className = '',
    error = false,
    autoFocus = false,
  },
  ref
) {
  const [selectedCountry, setSelectedCountry] = useState<CountryCode>(countryCodes[0]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');

  // Inizializza il numero dal valore prop solo una volta - versione semplificata
  useEffect(() => {
    if (value && !phoneNumber) {
      // Estrae il prefisso e il numero dal valore
      const foundCountry = countryCodes.find((country) => value.startsWith(country.code));

      if (foundCountry) {
        setSelectedCountry(foundCountry);
        const numberWithoutPrefix = value.replace(foundCountry.code, '').trim();
        setPhoneNumber(numberWithoutPrefix);
      } else {
        // Se non trova il prefisso, assume che sia solo il numero
        setPhoneNumber(value);
      }
    }
  }, []); // Solo all'mount

  // Rimuoviamo la formattazione automatica

  // Funzione di formattazione rimossa per semplicità

  // Gestisce il cambio del numero - versione semplificata
  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;

    // Aggiorna lo stato locale direttamente
    setPhoneNumber(inputValue);

    // Combina prefisso + numero inserito dall'utente
    const fullNumber = `${selectedCountry.code} ${inputValue}`.trim();
    onChange(fullNumber);
  };

  // Gestisce il cambio del paese - versione semplificata
  const handleCountryChange = (country: CountryCode) => {
    setSelectedCountry(country);
    setIsDropdownOpen(false);

    // Mantiene il numero esistente, cambia solo il prefisso
    const fullNumber = `${country.code} ${phoneNumber}`.trim();
    onChange(fullNumber);
  };

  return (
    <div className="relative w-full">
      <div className="flex items-baseline w-full">
        {/* Prefix Selector */}
        <div className="relative flex-shrink-0">
          <button
            type="button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center text-white/80 hover:text-white transition-colors pr-2"
          >
            <span className="text-xl md:text-2xl font-medium">{selectedCountry.code}</span>
            <motion.span
              animate={{ rotate: isDropdownOpen ? 180 : 0 }}
              transition={{ duration: 0.2 }}
              className="text-xs ml-1"
            >
              ▼
            </motion.span>
          </button>

          {/* Dropdown */}
          {isDropdownOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full left-0 mt-1 w-64 bg-black/90 backdrop-blur-lg border border-white/20 rounded-lg shadow-xl z-50 max-h-60 overflow-y-auto"
            >
              {countryCodes.map((country) => (
                <button
                  key={country.code}
                  type="button"
                  onClick={() => handleCountryChange(country)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-white/10 transition-colors ${
                    selectedCountry.code === country.code ? 'bg-white/5' : ''
                  }`}
                >
                  <span className="text-lg">{country.flag}</span>
                  <div className="flex-1">
                    <div className="text-white text-sm font-medium">{country.country}</div>
                    <div className="text-white/60 text-xs">{country.code}</div>
                  </div>
                </button>
              ))}
            </motion.div>
          )}
        </div>

        {/* Phone Number Input */}
        <input
          ref={ref}
          type="tel"
          value={phoneNumber}
          onChange={handleNumberChange}
          placeholder="1234567890"
          className={`w-full text-2xl md:text-3xl bg-transparent border-none outline-none text-white text-left placeholder-gray-400 ${
            error ? 'border-b border-red-500' : ''
          } ${className}`}
          autoFocus={autoFocus}
          style={{ caretColor: 'white', minWidth: 0 }}
        />
      </div>

      {/* Click outside to close dropdown */}
      {isDropdownOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setIsDropdownOpen(false)} />
      )}
    </div>
  );
});

export default PhoneInput;
