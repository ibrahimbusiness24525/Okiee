import React, { useState, useRef, useEffect } from 'react';

const CustomSelect = ({
  options = [],
  value = null,
  onChange = () => {},
  placeholder = 'Select...',
  noOptionsMessage = 'No options found',
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (option) => {
    onChange(option);
    setIsOpen(false);
    setSearchTerm('');
  };

  const selectedLabel =
    options.find((opt) => opt.value === value)?.label || placeholder;

  return (
    <div
      ref={selectRef}
      style={{
        position: 'relative',
        width: '100%',
        maxWidth: '500px',
        fontFamily: 'sans-serif',
      }}
    >
      {/* Trigger Box */}
      <div
        style={{
          padding: '10px 15px',
          border: '1px solid #d1d5db',
          borderRadius: '6px',
          cursor: 'pointer',
          backgroundColor: '#fff',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          userSelect: 'none',
        }}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <span style={{ color: value ? '#111827' : '#9ca3af' }}>
          {selectedLabel}
        </span>
        <span style={{ color: '#6b7280' }}>{isOpen ? '▲' : '▼'}</span>
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            zIndex: 50,
            marginTop: '4px',
            backgroundColor: '#fff',
            borderRadius: '6px',
            boxShadow:
              '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            border: '1px solid #e5e7eb',
            overflow: 'hidden',
          }}
          onClick={(e) => e.stopPropagation()} // prevent closing on dropdown click
        >
          {/* Search input */}
          <div style={{ padding: '8px', borderBottom: '1px solid #e5e7eb' }}>
            <input
              ref={inputRef}
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search..."
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: '4px',
                border: '1px solid #d1d5db',
                outline: 'none',
                fontSize: '14px',
              }}
              onClick={(e) => e.stopPropagation()}
            />
          </div>

          {/* Options list */}
          <div style={{ maxHeight: '250px', overflowY: 'auto' }}>
            {filteredOptions.length > 0 ? (
              filteredOptions.slice(0, 10).map((option) => (
                <div
                  key={option.value}
                  style={{
                    padding: '10px 15px',
                    cursor: 'pointer',
                    backgroundColor:
                      value === option.value ? '#f3f4f6' : '#fff',
                    borderBottom: '1px solid #f3f4f6',
                  }}
                  onClick={(e) => {
                    e.stopPropagation(); // prevent toggle when selecting
                    handleSelect(option);
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#f3f4f6';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor =
                      value === option.value ? '#f3f4f6' : '#fff';
                  }}
                >
                  {option.label}
                </div>
              ))
            ) : (
              <div
                style={{
                  padding: '10px 15px',
                  color: '#6b7280',
                  textAlign: 'center',
                }}
              >
                {noOptionsMessage}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomSelect;
