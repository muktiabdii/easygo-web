import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const NavbarBack = ({ title = "Profile", showAvatar = true, avatarSrc }) => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [profileImageUrl, setProfileImageUrl] = useState(null);
  const [isImageLoading, setIsImageLoading] = useState(true);

  // Handle scroll event to toggle transparency
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fetch user profile image if avatarSrc is not provided
  useEffect(() => {
    const fetchProfileImage = async () => {
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

        const response = await axios.get("http://localhost:8000/api/auth/validate-token", config);
        if (response.data && response.data.user && response.data.user.profile_image) {
          setProfileImageUrl(response.data.user.profile_image);
        } else {
          setIsImageLoading(false);
        }
      } catch (error) {
        console.error("Failed to fetch profile image:", error);
        setIsImageLoading(false);
      }
    };

    if (!avatarSrc) {
      fetchProfileImage();
    }
  }, [avatarSrc]);

  const handleBackClick = () => {
    navigate(-1);
  };

  const imageSrc = avatarSrc || profileImageUrl;

  // Handle image load success
  const handleImageLoad = () => {
    setIsImageLoading(false);
  };

  // Handle image load error
  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = "icons/user.png";
    setIsImageLoading(false);
  };

  return (
    <div
      className={`fixed top-0 left-0 right-0 w-full shadow-sm z-50 transition-all duration-300 ${
        isScrolled ? "bg-[rgba(239,240,247,0.2)]" : "bg-[#EFF0F7]"
      }`}
    >
      <div className="flex items-center h-18 px-6">
        <button
          className="rounded-full hover:cursor-pointer hover:bg-gray-300 transition-colors"
          onClick={handleBackClick}
        >
          <img src="icons/back_button.png" alt="Back" className="w-10 h-10" />
        </button>

        {/* Title */}
        <h1 className="p-2 text-[#3C91E6] text-2xl font-semibold ml-2">{title}</h1>

        <div className="flex-grow"></div>

        {/* Avatar */}
        {showAvatar && (
          <div className="w-10 h-10 rounded-full overflow-hidden hover:cursor-pointer flex items-center justify-center">
            {isImageLoading && (
              <div className="absolute w-10 h-10 flex items-center justify-center rounded-full bg-white">
                <svg
                  className="animate-spin h-6 w-6 text-[#3C91E6]"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
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
            )}
            <img
              src={imageSrc}
              alt="Profile"
              className="w-full h-full object-cover"
              onLoad={handleImageLoad}
              onError={handleImageError}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default NavbarBack;