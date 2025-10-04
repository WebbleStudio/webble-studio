import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface CountryCode {
  code: string;
  country: string;
  flag: string;
  format: string; // Pattern per la formattazione
}

const countryCodes: CountryCode[] = [
  { code: '+39', country: 'Italia', flag: '🇮🇹', format: 'xxx xxx xxxx' },
  { code: '+1', country: 'USA/Canada', flag: '🇺🇸', format: '(xxx) xxx-xxxx' },
  { code: '+44', country: 'Regno Unito', flag: '🇬🇧', format: 'xxxx xxx xxxx' },
  { code: '+33', country: 'Francia', flag: '🇫🇷', format: 'x xx xx xx xx' },
  { code: '+49', country: 'Germania', flag: '🇩🇪', format: 'xxx xxxxxxx' },
  { code: '+34', country: 'Spagna', flag: '🇪🇸', format: 'xxx xxx xxx' },
  { code: '+41', country: 'Svizzera', flag: '🇨🇭', format: 'xxx xxx xxx' },
  { code: '+43', country: 'Austria', flag: '🇦🇹', format: 'xxx xxxxxxx' },
  { code: '+31', country: 'Paesi Bassi', flag: '🇳🇱', format: 'x xxxx xxxx' },
  { code: '+32', country: 'Belgio', flag: '🇧🇪', format: 'xxx xx xx xx' },
  { code: '+351', country: 'Portogallo', flag: '🇵🇹', format: 'xxx xxx xxx' },
  { code: '+45', country: 'Danimarca', flag: '🇩🇰', format: 'xx xx xx xx' },
  { code: '+46', country: 'Svezia', flag: '🇸🇪', format: 'xx-xxx xx xx' },
  { code: '+47', country: 'Norvegia', flag: '🇳🇴', format: 'xxx xx xxx' },
  { code: '+358', country: 'Finlandia', flag: '🇫🇮', format: 'xx xxx xxxx' },
];

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  error?: boolean;
  autoFocus?: boolean;
}

export default function PhoneInput({
  value,
  onChange,
  placeholder = "123 456 7890",
  className = "",
  error = false,
  autoFocus = false,
}: PhoneInputProps) {
  const [selectedCountry, setSelectedCountry] = useState<CountryCode>(countryCodes[0]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');

  // Inizializza il numero dal valore prop solo una volta - versione semplificata
  useEffect(() => {
    if (value && !phoneNumber) {
      // Estrae il prefisso e il numero dal valore
      const foundCountry = countryCodes.find(country => 
        value.startsWith(country.code)
      );
      
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
    <div className="relative">
      <div className="flex items-center">
        {/* Prefix Selector */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center space-x-2 px-4 py-3 text-white/80 hover:text-white transition-colors border-r border-white/20 text-xl md:text-2xl"
          >
            <span className="text-xl">{selectedCountry.flag}</span>
            <span className="text-xl md:text-2xl font-medium">{selectedCountry.code}</span>
            <motion.span
              animate={{ rotate: isDropdownOpen ? 180 : 0 }}
              transition={{ duration: 0.2 }}
              className="text-sm ml-2"
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
          type="tel"
          value={phoneNumber}
          onChange={handleNumberChange}
          placeholder="Inserisci il numero"
          className={`flex-1 text-2xl md:text-3xl bg-transparent border-none outline-none text-white text-left placeholder-gray-400 ml-4 py-3 ${
            error ? 'border-b border-red-500' : ''
          } ${className}`}
          autoFocus={autoFocus}
          style={{ caretColor: 'white' }}
        />
      </div>

      {/* Click outside to close dropdown */}
      {isDropdownOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsDropdownOpen(false)}
        />
      )}
    </div>
  );
}
