import React, { useState, useEffect } from 'react';
import useSpeechRecognition from '../hooks/useSpeechRecognition'; 
import { useNavigate } from 'react-router-dom';
import AuthDialog from './AuthDialog'; // Import AuthDialog
import { isAuthenticated } from '../utils/authUtils'; // Import isAuthenticated function

const filterOptions = [
  { label: "Lift Braille & Suara", icon: "/icons/lift.png" },
  { label: "Interpreter Isyarat", icon: "/icons/interpreter.png" },
  { label: "Jalur Kursi Roda", icon: "/icons/kursi-roda.png" },
  { label: "Pintu Otomatis", icon: "/icons/pintu.png" },
  { label: "Parkir Disabilitas", icon: "/icons/parkir.png" },
  { label: "Toilet Disabilitas", icon: "/icons/toilet.png" },
  { label: "Jalur Guiding Block", icon: "/icons/guiding-block.png" },
  { label: "Menu Braille", icon: "/icons/menu-braille.png" },
];

const Navbar = ({ onSearchChange, onSearchSubmit, onFilterChange, hideBackground }) => {
  const navigate = useNavigate();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [showAuthDialog, setShowAuthDialog] = useState(false); // State for showing auth dialog
  const [redirectPath, setRedirectPath] = useState(""); // State for redirect path

  // speech recognition hook
  const { isListening, toggleSpeechRecognition, searchInputRef, transcript } = useSpeechRecognition((e) => {
    setSearchValue(e.target.value);
    if (onSearchChange) {
      onSearchChange(e);
    }
    // Auto-submit using speech recognition
    if (onSearchSubmit && e.target.value.trim() !== '') {
      onSearchSubmit();
    }
  });

  useEffect(() => {
    if (onFilterChange) {
      onFilterChange(selectedFilters);
    }
  }, [selectedFilters, onFilterChange]);

  const toggleFilter = () => setIsFilterOpen(!isFilterOpen);

  const handleCheckboxChange = (label) => {
    setSelectedFilters((prev) =>
      prev.includes(label)
        ? prev.filter((item) => item !== label)
        : [...prev, label]
    );
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchValue(value); 
    if (onSearchChange) {
      onSearchChange(e); 
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && searchValue.trim() !== '') {
      if (onSearchSubmit) {
        onSearchSubmit();
      }
    }
  };

  const handleSearchClick = () => {
    if (onSearchSubmit && searchValue.trim() !== '') {
      onSearchSubmit();
    }
  };

  // Handler for profile click
  const handleProfileClick = () => {
    if (isAuthenticated()) {
      navigate('/profile'); // Navigate to profile if authenticated
    } else {
      setRedirectPath('/profile'); // Set redirect path
      setShowAuthDialog(true); // Show auth dialog
    }
  };

  // Handler for login action
  const handleLogin = () => {
    setShowAuthDialog(false);
    navigate("/login", { state: { from: redirectPath } });
  };

  // Handler for cancel action
  const handleCancelAuth = () => {
    setShowAuthDialog(false);
  };

  return (
    <>
      {isFilterOpen && (
        <div
          className="fixed inset-0 backdrop-blur-xs bg-white/5 z-[1001]"
          onClick={toggleFilter}
        />
      )}

      <div
 className={`fixed top-0 left-0 h-full w-72 bg-[#3C91E6] text-white shadow-lg transform transition-transform duration-300 z-[1001] ${
          isFilterOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-4">
          <div className="flex items-center mb-4">
            <img src="/icons/filter.png" alt="Filter" className="h-6 w-6 mr-2" />
            <span className="font-semibold text-lg">Filter Aksesibilitas</span>
          </div>

          <div className="space-y-1 max-h-[calc(100vh-100px)] overflow-y-auto">
            {filterOptions.map((filter) => (
              <label
                key={filter.label}
                className="flex items-center justify-between p-2 rounded-md cursor-pointer hover:bg-[#357FCC] transition-colors duration-200"
              >
                <div className="flex items-center space-x-3">
                  <img src={filter.icon} alt={filter.label} className="h-6 w-6" />
                  <span className="text-sm">{filter.label}</span>
                </div>
                <input
                  type="checkbox"
                  checked={selectedFilters.includes(filter.label)}
                  onChange={() => handleCheckboxChange(filter.label)}
                />
              </label>
            ))}
          </div>
        </div>
      </div>

      <nav className={`fixed top-0 left-0 w-full p-4 flex items-center justify-between z-[1000] ${hideBackground ? 'bg-transparent' : 'bg-[#EFF0F7] text-white'}`}>
        <div className="flex items-center space-x-4">
          <button onClick={toggleFilter}>
            <img
              src="/icons/filter-bt.png"
              alt="Filter"
              className="h-10 w-10 object-contain"
            />
          </button>

          <img src="/logo.png" alt="EasyGo Logo" className="h-10" />

          <div className="relative ml-4 w-100">
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Cari fasilitas aksesibilitas.."
              className="w-full pl-4 pr-20 py-2 bg-white rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#3C91E6]"
              value={searchValue} 
              onChange={handleSearchChange}
              onKeyDown={handleKeyDown}
            />
            <img
              src="/icons/search.png"
              alt="Search"
              className="absolute right-10 top-2.5 h-5 w-5 text-gray-500 cursor-pointer"
              onClick={handleSearchClick}
            />
            <button 
              onClick={toggleSpeechRecognition}
              className="absolute right-3 top-2.5 h-5 w-5 flex items-center justify-center cursor-pointer"
            >
              <img
                src="/icons/mic.png"
                alt="Mic"
                className={`h-5 w-5 ${isListening ? 'opacity-100 animate-pulse' : 'opacity-100'}`}
                style={{
                  animationDuration: isListening ? '0.6s' : '0s',
                  animationTimingFunction: 'ease-in-out'
                }}
              />
            </button>
          </div>
        </div>

        <div className="flex items-center space-x-6">
          <button className="text-white bg-[#3C91E6] px-8 py-2 rounded-full text-sm">Tentang</button>
          <button className="text-white bg-[#3C91E6] px-8 py-2 rounded-full text-sm">Pedoman</button>
          <img src="/icons/user.png" alt="User " className="h-10 w-10 object-contain cursor-pointer" onClick={() => navigate('/profile')}/>
        </div>
      </nav>

      {/* Render dialog autentikasi jika showAuthDialog true */}
      {showAuthDialog && (
        <div className="fixed inset-0 z-[1001]">
          <AuthDialog 
            onLogin={handleLogin} 
            onCancel={handleCancelAuth} 
          />
        </div>
      )}
    </>
  );
}

export default Navbar;