import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useSpeechRecognition from "../hooks/useSpeechRecognition";
import ConfirmDialog from "./ConfirmDialog";
import RoutePopup from "./RoutePopup";
import { isAuthenticated } from "../utils/authUtils";
import axios from "axios";

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

const Navbar = ({
  onSearchChange,
  onSearchSubmit,
  onFilterChange,
  hideBackground = false,
  routeDistance,
  onRouteSubmit,
  onClearRoute,
  currentLocation,
  places,
  showSearch = true,
  showFilter = true,
}) => {
  const navigate = useNavigate();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [redirectPath, setRedirectPath] = useState("");
  const [profileImageUrl, setProfileImageUrl] = useState(null);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [showRoutePopup, setShowRoutePopup] = useState(false);
  const [profileImgError, setProfileImgError] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Speech recognition hook
  const { isListening, toggleSpeechRecognition, searchInputRef, transcript } =
    useSpeechRecognition((e) => {
      setSearchValue(e.target.value);
      if (onSearchChange) {
        onSearchChange(e);
      }
    });

  useEffect(() => {
    if (onFilterChange) {
      onFilterChange(selectedFilters);
    }
  }, [selectedFilters, onFilterChange]);

  // Fetch user profile image if user is authenticated
  useEffect(() => {
    const fetchProfileImage = async () => {
      if (!isAuthenticated()) {
        setIsImageLoading(false);
        return;
      }

      try {
        setIsImageLoading(true);
        const token = localStorage.getItem("auth_header");
        if (!token) {
          setIsImageLoading(false);
          return;
        }

        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        };

        const response = await axios.get(
          "http://easygo-api-production-d477.up.railway.app/api/auth/validate-token",
          config
        );
        if (
          response.data &&
          response.data.user &&
          response.data.user.profile_image
        ) {
          setProfileImageUrl(response.data.user.profile_image);
        } else {
          setIsImageLoading(false);
        }
      } catch (error) {
        console.error("Failed to fetch profile image:", error);
        setIsImageLoading(false);
      }
    };

    fetchProfileImage();
  }, []);

  useEffect(() => {
    if (profileImageUrl) {
      const img = new Image();
      img.src = profileImageUrl;

      img.onload = () => {
        setIsImageLoading(false);
      };

      img.onerror = () => {
        setProfileImgError(true);
        setIsImageLoading(false);
      };
    }
  }, [profileImageUrl]);

  const toggleFilter = () => setIsFilterOpen(!isFilterOpen);
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

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
    if (e.key === "Enter" && searchValue.trim() !== "") {
      if (onSearchSubmit) {
        onSearchSubmit();
      }
    }
  };

  const handleSearchClick = () => {
    if (onSearchSubmit && searchValue.trim() !== "") {
      onSearchSubmit();
    }
  };

  const handleRouteClick = () => {
    setShowRoutePopup(true);
  };

  const handleRouteApply = (startCoords, destCoords) => {
    setShowRoutePopup(false);
    onRouteSubmit(startCoords, destCoords);
  };

  const handleRouteCancel = () => {
    setShowRoutePopup(false);
  };

  const handleClearRoute = () => {
    if (onClearRoute) {
      onClearRoute();
    }
    setSearchValue("");
  };

  const handleProfileClick = () => {
    setIsMobileMenuOpen(false);
    if (isAuthenticated()) {
      navigate("/profile");
    } else {
      setRedirectPath("/profile");
      setShowAuthDialog(true);
    }
  };

  const handleAboutClick = () => {
    setIsMobileMenuOpen(false);
    navigate("/about");
  };

  const handlePedomanClick = () => {
    setIsMobileMenuOpen(false);
    navigate("/pedoman");
  };

  const handleLogoClick = () => {
    setIsMobileMenuOpen(false);
    navigate("/dashboard");
  };

  const handleLogin = () => {
    setShowAuthDialog(false);
    navigate("/login", { state: { from: redirectPath } });
  };

  const handleCancelAuth = () => {
    setShowAuthDialog(false);
  };

  const handleImageError = () => {
    setProfileImgError(true);
    setIsImageLoading(false);
  };

  const imageSrc =
    profileImgError || !profileImageUrl ? "/icons/user.png" : profileImageUrl;

  return (
    <>
      {/* Filter Sidebar Overlay */}
      {showFilter && isFilterOpen && (
        <div
          className="fixed inset-0 backdrop-blur-xs bg-white/5 z-[1001]"
          onClick={toggleFilter}
        />
      )}

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 backdrop-blur-xs bg-black/20 z-[1002] md:hidden"
          onClick={toggleMobileMenu}
        />
      )}

      {/* Filter Sidebar */}
      {showFilter && (
        <div
          className={`fixed top-0 left-0 h-full w-72 sm:w-80 bg-[#3C91E6] text-white shadow-lg transform transition-transform duration-300 z-[1001] ${
            isFilterOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="p-4">
            <div className="flex items-center mb-4 justify-center">
              <img
                src="/icons/filter.png"
                alt="Filter"
                className="h-6 w-6 mr-4"
              />
              <span className="font-semibold text-2xl sm:text-3xl">Filter</span>
            </div>
            <div className="space-y-1 max-h-[calc(100vh-100px)] overflow-y-auto">
              {filterOptions.map((filter) => (
                <label
                  key={filter.label}
                  className="flex items-center justify-between p-2 rounded-md cursor-pointer hover:bg-[#357FCC] transition-colors duration-200"
                >
                  <div className="flex items-center space-x-3">
                    <img
                      src={filter.icon}
                      alt={filter.label}
                      className="h-5 w-5 sm:h-6 sm:w-6"
                    />
                    <span className="text-xs sm:text-sm">{filter.label}</span>
                  </div>
                  <input
                    type="checkbox"
                    className="h-4 w-4 sm:h-5 sm:w-5 text-[#3C91E6] focus:ring-[#357FCC]"
                    checked={selectedFilters.includes(filter.label)}
                    onChange={() => handleCheckboxChange(filter.label)}
                  />
                </label>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Mobile Menu */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 z-[1003] md:hidden ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-4 pt-8">
          <div className="flex flex-col space-y-4">
            <button
              onClick={handleAboutClick}
              className="text-white bg-[#3C91E6] px-6 py-3 rounded-full text-sm cursor-pointer hover:bg-[#357FCC] transition-colors duration-200 text-center"
            >
              Tentang
            </button>
            <button
              onClick={handlePedomanClick}
              className="text-white bg-[#3C91E6] px-6 py-3 rounded-full text-sm cursor-pointer hover:bg-[#357FCC] transition-colors duration-200 text-center"
            >
              Pedoman
            </button>
            <div
              className="flex items-center justify-center p-3 cursor-pointer hover:bg-gray-100 rounded-lg transition-colors duration-200"
              onClick={handleProfileClick}
            >
              <div className="h-8 w-8 rounded-full overflow-hidden mr-3">
                {isImageLoading ? (
                  <div className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full">
                    <svg
                      className="animate-spin h-4 w-4 text-[#3C91E6]"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  </div>
                ) : (
                  <img
                    src={imageSrc}
                    alt="User Profile"
                    className="h-full w-full object-cover"
                    onError={handleImageError}
                  />
                )}
              </div>
              <span className="text-sm text-gray-700">Profile</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav
        className={`fixed top-0 left-0 w-full p-3 sm:p-4 flex items-center justify-between z-[1000] ${
          hideBackground ? "bg-transparent" : "bg-[#EFF0F7]"
        }`}
      >
        {/* Left Section */}
        <div className="flex items-center space-x-2 sm:space-x-4 flex-1">
          {/* Filter Button */}
          {showFilter && (
            <button onClick={toggleFilter} className="flex-shrink-0">
              <img
                src="/icons/filter-bt.png"
                alt="Filter"
                className="h-8 w-8 sm:h-10 sm:w-10 object-contain cursor-pointer hover:brightness-90 transition-filter duration-200"
              />
            </button>
          )}

          {/* Logo */}
          <button onClick={handleLogoClick} className="flex-shrink-0">
            <img
              src="/logo.png"
              alt="EasyGo Logo"
              className="h-8 sm:h-10 cursor-pointer"
            />
          </button>

          {/* Search Bar - Hidden on small screens, shown on medium+ */}
          {showSearch && (
            <div className="relative ml-2 sm:ml-4 flex-1 max-w-md hidden md:block">
              <div className="relative">
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Cari fasilitas atau tujuan.."
                  className="w-full pl-3 pr-24 sm:pl-4 sm:pr-28 py-2 bg-white rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#3C91E6] text-sm"
                  value={searchValue}
                  onChange={handleSearchChange}
                  onKeyDown={handleKeyDown}
                />
                <button
                  onClick={handleRouteClick}
                  className="absolute right-16 sm:right-20 top-2 h-5 w-5 sm:h-6 sm:w-6 cursor-pointer"
                >
                  <img
                    src="/icons/route_ic.png"
                    alt="Route"
                    className="h-5 w-5 sm:h-6 sm:w-6"
                  />
                </button>
                <img
                  src="/icons/search.png"
                  alt="Search"
                  className="absolute right-9 sm:right-12 top-2.5 h-4 w-4 sm:h-5 sm:w-5 text-gray-500 cursor-pointer"
                  onClick={handleSearchClick}
                />
                <button
                  onClick={toggleSpeechRecognition}
                  className="absolute right-3 sm:right-4 top-2.5 h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center cursor-pointer"
                >
                  <img
                    src="/icons/mic.png"
                    alt="Mic"
                    className={`h-4 w-4 sm:h-5 sm:w-5 ${
                      isListening ? "opacity-100 animate-pulse" : "opacity-100"
                    }`}
                    style={{
                      animationDuration: isListening ? "0.6s" : "0s",
                      animationTimingFunction: "ease-in-out",
                    }}
                  />
                </button>
              </div>
              {routeDistance && (
                <div className="absolute left-0 top-12 bg-white p-3 sm:p-4 rounded-3xl shadow-md w-full z-[1001] flex items-center justify-between text-xs sm:text-sm text-black">
                  <span>Jarak: {routeDistance} km</span>
                  <button
                    onClick={handleClearRoute}
                    className="text-white text-xs bg-[#3C91E6] rounded-2xl p-2 hover:bg-blue-500 cursor-pointer"
                  >
                    Hapus Rute
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Section - Desktop */}
        <div className="hidden md:flex items-center space-x-4 lg:space-x-6">
          <button
            onClick={handleAboutClick}
            className="text-white bg-[#3C91E6] px-4 lg:px-8 py-2 rounded-full text-sm cursor-pointer hover:bg-[#357FCC] transition-colors duration-200 whitespace-nowrap"
          >
            Tentang
          </button>
          <button
            onClick={handlePedomanClick}
            className="text-white bg-[#3C91E6] px-4 lg:px-8 py-2 rounded-full text-sm cursor-pointer hover:bg-[#357FCC] transition-colors duration-200 whitespace-nowrap"
          >
            Pedoman
          </button>

          <div
            className="h-8 w-8 sm:h-10 sm:w-10 rounded-full overflow-hidden cursor-pointer relative flex-shrink-0"
            onClick={handleProfileClick}
          >
            {isImageLoading ? (
              <div className="absolute inset-0 w-full h-full flex items-center justify-center bg-gray-200 rounded-full">
                <svg
                  className="animate-spin h-4 w-4 sm:h-6 sm:w-6 text-[#3C91E6]"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              </div>
            ) : (
              <img
                src={imageSrc}
                alt="User Profile"
                className="h-full w-full object-cover"
                onError={handleImageError}
              />
            )}
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMobileMenu}
          className="md:hidden flex-shrink-0 p-1"
        >
          <svg
            className="h-6 w-6 text-[#3C91E6]"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {isMobileMenuOpen ? (
              <path d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </nav>

      {/* Mobile Search Bar - Shown below navbar on small screens */}
      {showSearch && (
        <div className="fixed top-16 left-0 w-full p-3 z-[999] md:hidden">
          <div className="relative">
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Cari fasilitas atau tujuan.."
              className="w-full pl-4 pr-28 py-2 bg-white rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#3C91E6] text-sm"
              value={searchValue}
              onChange={handleSearchChange}
              onKeyDown={handleKeyDown}
            />
            <button
              onClick={handleRouteClick}
              className="absolute right-20 top-2 h-6 w-6 cursor-pointer"
            >
              <img
                src="/icons/route_ic.png"
                alt="Route"
                className="h-6 w-6"
              />
            </button>
            <img
              src="/icons/search.png"
              alt="Search"
              className="absolute right-12 top-2.5 h-5 w-5 text-gray-500 cursor-pointer"
              onClick={handleSearchClick}
            />
            <button
              onClick={toggleSpeechRecognition}
              className="absolute right-4 top-2.5 h-5 w-5 flex items-center justify-center cursor-pointer"
            >
              <img
                src="/icons/mic.png"
                alt="Mic"
                className={`h-5 w-5 ${
                  isListening ? "opacity-100 animate-pulse" : "opacity-100"
                }`}
                style={{
                  animationDuration: isListening ? "0.6s" : "0s",
                  animationTimingFunction: "ease-in-out",
                }}
              />
            </button>
          </div>
          {routeDistance && (
            <div className="mt-3 bg-white p-3 rounded-3xl shadow-md flex items-center justify-between text-sm text-black">
              <span>Jarak: {routeDistance} km</span>
              <button
                onClick={handleClearRoute}
                className="text-white text-xs bg-[#3C91E6] rounded-2xl p-2 hover:bg-blue-500 cursor-pointer"
              >
                Hapus Rute
              </button>
            </div>
          )}
        </div>
      )}

      {/* Dialogs */}
      {showAuthDialog && (
        <ConfirmDialog
          isOpen={showAuthDialog}
          onConfirm={handleLogin}
          onCancel={handleCancelAuth}
          message="Harap login untuk mengakses konten ini. Ingin masuk sekarang?"
          confirmLabel="Masuk"
          cancelLabel="Batal"
          confirmColor="text-[#3C91E6]"
          cancelColor="text-red-500"
        />
      )}

      {showSearch && showRoutePopup && (
        <RoutePopup
          onApply={handleRouteApply}
          onCancel={handleRouteCancel}
          currentLocation={currentLocation}
          places={places}
        />
      )}
    </>
  );
};

export default Navbar;