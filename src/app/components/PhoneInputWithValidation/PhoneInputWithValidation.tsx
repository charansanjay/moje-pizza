import styles from './PhoneInputWithValidation.module.css';
import React, { useState, useRef, useEffect } from 'react';

/* Third-party imports */
import { AsYouType, isValidPhoneNumber, CountryCode } from 'libphonenumber-js';
import ReactCountryFlag from 'react-country-flag';
import countries from 'country-telephone-data';

interface Country {
  iso2: string;
  dialCode: string;
  name: string;
}

interface PhoneInputWithValidationProps {
  sendDataToParent: (formattedNumber: string, isValid: boolean) => void;
  initialValue: string;
}

export const PhoneInputWithValidation = React.forwardRef<
  HTMLInputElement,
  PhoneInputWithValidationProps
>(
  (
    { sendDataToParent, initialValue, ...props }: PhoneInputWithValidationProps,
    ref
  ) => {
    /* Get current country code prefix from phone number if available */
    // get the digits till first space character
    const currentCountryCode = initialValue?.split(' ')[0];

    // remove the first '+' character
    const currentCountryCodeWithoutPlus = currentCountryCode?.slice(1);

    // find the country object from the countries array
    const currentCountry =
      countries.allCountries.find(
        (country: Country) => country.dialCode === currentCountryCodeWithoutPlus
      ) || countries.allCountries[0];

    const [selectedCountry, setSelectedCountry] =
      useState<Country>(currentCountry);
    const [phoneNumberPrefix, setPhoneNumberPrefix] = useState<string>(
      `+${currentCountry.dialCode}`
    );
    const [cursorPosition, setCursorPosition] = useState<number>(0);
    const [formattedNumber, setFormattedNumber] = useState<string>(
      initialValue || `+${currentCountry.dialCode} `
    );
    const [showDropdown, setShowDropdown] = useState<boolean>(false);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [highlightedIndex, setHighlightedIndex] = useState<number>(0);

    const phoneInputRef = useRef<HTMLInputElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Filter countries based on search
    const filteredCountries = countries.allCountries.filter(
      (country: Country) =>
        country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        country.dialCode.includes(searchTerm)
    );

    // Phone number validation and formatting
    const handlePhoneChange = (value: string) => {
      const newValue = value;

      // If user tries to delete the prefix, reset to prefix
      if (!newValue.startsWith(`+${selectedCountry.dialCode}`)) {
        setPhoneNumberPrefix(`+${selectedCountry.dialCode}`);
        setCursorPosition(phoneNumberPrefix.length + 1);
        return;
      }

      // If user tries to modify the prefix, reset to previous value
      if (newValue.length < phoneNumberPrefix.length) {
        setPhoneNumberPrefix(`+${selectedCountry.dialCode}`);
        setCursorPosition(phoneNumberPrefix.length + 1);
        return;
      }

      // Check if the format of the phone number is correct
      const formatter = new AsYouType(selectedCountry.iso2 as CountryCode);
      const formatterNumber = formatter.input(value);

      setFormattedNumber(formatterNumber);

      const isValid = isValidPhoneNumber(
        formatterNumber,
        selectedCountry.iso2 as CountryCode
      );

      sendDataToParent(formatterNumber, isValid);
    };

    // Country selection handler
    const handleCountrySelect = (country: Country) => {
      setSelectedCountry(country);
      setShowDropdown(false);

      phoneInputRef.current?.focus();
      setPhoneNumberPrefix(`+${country.dialCode}`);
      setCursorPosition(country.dialCode.length + 2);
      setFormattedNumber(`+${country.dialCode} `);
      sendDataToParent('', false);
    };

    // Keyboard navigation
    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (!showDropdown) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setHighlightedIndex((prev) =>
          Math.min(prev + 1, filteredCountries.length - 1)
        );
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setHighlightedIndex((prev) => Math.max(prev - 1, 0));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredCountries[highlightedIndex]) {
          handleCountrySelect(filteredCountries[highlightedIndex]);
        }
      }
    };

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      e.preventDefault();

      // Move cursor to end of prefix if empty
      if (phoneNumberPrefix) {
        setCursorPosition(phoneNumberPrefix.length + 1);
      }
    };

    // Click outside handler
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          dropdownRef.current &&
          !dropdownRef.current.contains(event.target as Node)
        ) {
          setShowDropdown(false);
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () =>
        document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Update cursor position
    useEffect(() => {
      if (phoneInputRef.current) {
        phoneInputRef.current.setSelectionRange(cursorPosition, cursorPosition);
      }
    }, [cursorPosition]);

    return (
      <div className={styles.phoneContainer}>
        <div className={styles.inputGroup}>
          {/* Country Selector */}
          <div className={styles.countrySelector} ref={dropdownRef}>
            <button
              type='button'
              className={styles.countryTrigger}
              onClick={() => setShowDropdown(!showDropdown)}
              onKeyDown={handleKeyDown}
            >
              <ReactCountryFlag
                countryCode={selectedCountry.iso2}
                svg
                style={{ width: '24px', height: '24px' }}
              />
              <span>+{selectedCountry.dialCode}</span>
            </button>

            {/* Country Dropdown */}
            {showDropdown && (
              <div className={styles.countryDropdown}>
                <input
                  type='text'
                  placeholder='Search country...'
                  className={styles.searchInput}
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setHighlightedIndex(0);
                  }}
                  autoFocus
                />

                <div className={styles.countryList}>
                  {filteredCountries.map((country: Country, index: number) => (
                    <div
                      key={country.iso2}
                      className={`${styles.countryItem} ${
                        highlightedIndex === index ? styles.highlighted : ''
                      }`}
                      onClick={() => handleCountrySelect(country)}
                      onMouseEnter={() => setHighlightedIndex(index)}
                    >
                      <ReactCountryFlag
                        countryCode={country.iso2}
                        svg
                        style={{ width: '20px', height: '20px' }}
                      />
                      <span className={styles.countryName}>{country.name}</span>
                      <span className={styles.dialCode}>
                        +{country.dialCode}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Phone Input */}
          <input
            type='tel'
            id='phoneNumber'
            value={formattedNumber}
            onChange={(e) => handlePhoneChange(e.target.value)}
            onFocus={handleFocus}
            placeholder='Enter phone number'
            className={styles.phoneInput}
            autoComplete='off'
            ref={ref || phoneInputRef}
            {...props}
          />
        </div>
      </div>
    );
  }
);
