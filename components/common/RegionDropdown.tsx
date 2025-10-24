import React, { useState, useRef, useEffect } from 'react';

interface RegionDropdownProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  name?: string;
}

interface StateOption {
  name: string;
  code: string;
}

const US_STATES: StateOption[] = [
  { name: 'Alabama', code: 'AL' },
  { name: 'Alaska', code: 'AK' },
  { name: 'Arizona', code: 'AZ' },
  { name: 'Arkansas', code: 'AR' },
  { name: 'California', code: 'CA' },
  { name: 'Colorado', code: 'CO' },
  { name: 'Connecticut', code: 'CT' },
  { name: 'Delaware', code: 'DE' },
  { name: 'Florida', code: 'FL' },
  { name: 'Georgia', code: 'GA' },
  { name: 'Hawaii', code: 'HI' },
  { name: 'Idaho', code: 'ID' },
  { name: 'Illinois', code: 'IL' },
  { name: 'Indiana', code: 'IN' },
  { name: 'Iowa', code: 'IA' },
  { name: 'Kansas', code: 'KS' },
  { name: 'Kentucky', code: 'KY' },
  { name: 'Louisiana', code: 'LA' },
  { name: 'Maine', code: 'ME' },
  { name: 'Maryland', code: 'MD' },
  { name: 'Massachusetts', code: 'MA' },
  { name: 'Michigan', code: 'MI' },
  { name: 'Minnesota', code: 'MN' },
  { name: 'Mississippi', code: 'MS' },
  { name: 'Missouri', code: 'MO' },
  { name: 'Montana', code: 'MT' },
  { name: 'Nebraska', code: 'NE' },
  { name: 'Nevada', code: 'NV' },
  { name: 'New Hampshire', code: 'NH' },
  { name: 'New Jersey', code: 'NJ' },
  { name: 'New Mexico', code: 'NM' },
  { name: 'New York', code: 'NY' },
  { name: 'North Carolina', code: 'NC' },
  { name: 'North Dakota', code: 'ND' },
  { name: 'Ohio', code: 'OH' },
  { name: 'Oklahoma', code: 'OK' },
  { name: 'Oregon', code: 'OR' },
  { name: 'Pennsylvania', code: 'PA' },
  { name: 'Rhode Island', code: 'RI' },
  { name: 'South Carolina', code: 'SC' },
  { name: 'South Dakota', code: 'SD' },
  { name: 'Tennessee', code: 'TN' },
  { name: 'Texas', code: 'TX' },
  { name: 'Utah', code: 'UT' },
  { name: 'Vermont', code: 'VT' },
  { name: 'Virginia', code: 'VA' },
  { name: 'Washington', code: 'WA' },
  { name: 'West Virginia', code: 'WV' },
  { name: 'Wisconsin', code: 'WI' },
  { name: 'Wyoming', code: 'WY' },
  { name: 'District of Columbia', code: 'DC' },
];

const RegionDropdown: React.FC<RegionDropdownProps> = ({
  value,
  onChange,
  placeholder = 'Select state',
  disabled = false,
  name,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const selectedRegion = US_STATES.find((state) => state.code === value);
  const displayValue = isOpen ? searchTerm : selectedRegion?.name || '';

  const normalizedTerm = searchTerm.trim().toLowerCase();

  // Always show all states, but sort matching ones to the top when searching
  const filteredRegions = normalizedTerm
    ? [
        ...US_STATES.filter((state) => {
          const name = state.name.toLowerCase();
          const code = state.code.toLowerCase();
          return name.startsWith(normalizedTerm) || code.startsWith(normalizedTerm);
        }),
        ...US_STATES.filter((state) => {
          const name = state.name.toLowerCase();
          const code = state.code.toLowerCase();
          return !(name.startsWith(normalizedTerm) || code.startsWith(normalizedTerm));
        }),
      ]
    : US_STATES;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm('');
        setHighlightedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectRegion = (region: StateOption) => {
    onChange(region.code);
    setIsOpen(false);
    setSearchTerm('');
    setHighlightedIndex(-1);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return;

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
          prev < filteredRegions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        event.preventDefault();
        setHighlightedIndex((prev) =>
          prev > 0 ? prev - 1 : filteredRegions.length - 1
        );
        break;
      case 'Enter':
        event.preventDefault();
        if (highlightedIndex >= 0 && filteredRegions[highlightedIndex]) {
          selectRegion(filteredRegions[highlightedIndex]);
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

    if (!term) {
      onChange('');
    }
  };

  const handleInputClick = () => {
    if (disabled) return;
    setIsOpen(true);
    setHighlightedIndex(-1);
  };

  return (
    <div ref={dropdownRef} className="relative">
      <input
        ref={inputRef}
        type="text"
        name={name}
        value={displayValue}
        placeholder={placeholder}
        onChange={handleInputChange}
        onClick={handleInputClick}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        className="w-full py-[18px] px-5 text-[1.0625rem] border-2 border-stone-300 rounded-xl focus:outline-none focus:ring-0 focus:border-primary transition-colors disabled:bg-stone-100"
        autoComplete="off"
      />

      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
        <svg
          className={`w-4 h-4 text-stone-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {isOpen && !disabled && (
        <div className="absolute z-10 w-full mt-1 bg-white border-2 border-stone-300 rounded-xl shadow-lg max-h-60 overflow-y-auto" style={{ boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)' }}>
          {filteredRegions.length > 0 ? (
            filteredRegions.map((region, index) => (
              <button
                type="button"
                key={region.code}
                onClick={() => selectRegion(region)}
                className={`w-full text-left px-4 py-3 transition-colors flex items-center justify-between ${
                  index === highlightedIndex
                    ? 'bg-primary/10 text-primary'
                    : 'hover:bg-stone-100'
                }`}
                onMouseEnter={() => setHighlightedIndex(index)}
              >
                <span className="font-medium text-stone-700">{region.name}</span>
                <span className="text-sm text-stone-500">{region.code}</span>
              </button>
            ))
          ) : (
            <div className="px-4 py-3 text-sm text-stone-500 text-center">
              No matching states
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RegionDropdown;
