import React, { useState, useRef, useEffect } from 'react';
import { Option } from '../../types';

interface AutocompleteDropdownProps {
  id: string;
  options: Option[];
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  required?: boolean;
}

const AutocompleteDropdown: React.FC<AutocompleteDropdownProps> = ({
  id,
  options,
  value,
  onChange,
  required,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const selectedOption = options.find((opt) => opt.value === value);
  const displayValue = isOpen ? searchTerm : selectedOption?.label || '';

  const normalizedTerm = searchTerm.trim().toLowerCase();

  // Filter options based on search term
  const filteredOptions = normalizedTerm
    ? [
        ...options.filter((opt) => {
          const label = opt.label.toLowerCase();
          return label.startsWith(normalizedTerm);
        }),
        ...options.filter((opt) => {
          const label = opt.label.toLowerCase();
          return !label.startsWith(normalizedTerm) && label.includes(normalizedTerm);
        }),
      ]
    : options;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm('');
        setHighlightedIndex(-1);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const selectOption = (option: Option) => {
    // Create a synthetic event for consistency
    const syntheticEvent = {
      target: { value: option.value },
    } as React.ChangeEvent<HTMLSelectElement>;
    
    onChange(syntheticEvent);
    setIsOpen(false);
    setSearchTerm('');
    setHighlightedIndex(-1);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen) {
      if (event.key === 'Enter' || event.key === 'ArrowDown') {
        event.preventDefault();
        setIsOpen(true);
        setHighlightedIndex(0);
      }
      return;
    }

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        setHighlightedIndex((prev) =>
          prev < filteredOptions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        event.preventDefault();
        setHighlightedIndex((prev) =>
          prev > 0 ? prev - 1 : filteredOptions.length - 1
        );
        break;
      case 'Enter':
        event.preventDefault();
        if (highlightedIndex >= 0 && filteredOptions[highlightedIndex]) {
          selectOption(filteredOptions[highlightedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSearchTerm('');
        setHighlightedIndex(-1);
        inputRef.current?.blur();
        break;
      default:
        break;
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const term = event.target.value;
    setSearchTerm(term);
    setIsOpen(true);
    setHighlightedIndex(-1);
  };

  const handleInputClick = () => {
    setIsOpen(true);
    setHighlightedIndex(-1);
  };

  return (
    <div ref={dropdownRef} className="relative w-full">
      <input
        ref={inputRef}
        type="text"
        id={id}
        value={displayValue}
        placeholder="Type to search..."
        onChange={handleInputChange}
        onClick={handleInputClick}
        onKeyDown={handleKeyDown}
        onFocus={() => setIsOpen(true)}
        className="w-full py-[18px] px-5 text-[1.0625rem] border-2 border-stone-200 rounded-xl focus:outline-none focus:border-primary transition-colors bg-white text-stone-900"
        autoComplete="off"
        aria-required={required}
        aria-invalid={required && !value ? 'true' : 'false'}
      />

      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
        <svg
          className={`w-5 h-5 text-stone-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {isOpen && (
        <div 
          className="absolute z-10 w-full mt-1 bg-white border-2 border-stone-200 rounded-xl shadow-lg max-h-60 overflow-y-auto"
          style={{ boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)' }}
        >
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option, index) => (
              <button
                type="button"
                key={option.value}
                onClick={() => selectOption(option)}
                className={`w-full text-left px-5 py-3 transition-colors ${
                  index === highlightedIndex
                    ? 'bg-primary/10 text-primary'
                    : 'hover:bg-stone-50 text-stone-700'
                }`}
                onMouseEnter={() => setHighlightedIndex(index)}
              >
                <span>{option.label}</span>
              </button>
            ))
          ) : (
            <div className="px-5 py-3 text-sm text-stone-500 text-center">
              No matching options
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AutocompleteDropdown;

