import React, { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import NavbarBack from "../components/NavbarBack";
import ConfirmDialog from "../components/ConfirmDialog";
import { logout } from "../utils/authUtils";
import axios from "axios";
import CustomNotification from "../components/CustomNotification";
import LoadingIndicator from "../components/LoadingIndicator"; // Import the new LoadingIndicator

// Facility icon mapping
const facilityIconMap = {
  1: "jalurkursiroda-w",
  2: "pintuotomatis-w",
  3: "parkirdisabilitas-w",
  4: "toiletdisabilitas-w",
  5: "liftbraille-w",
  6: "interpreterisyarat-w",
  7: "menubraille-w",
  8: "jalurguildingblock-w",
};

// Sample data for dropdowns
const provinces = ["Jawa Timur", "Jawa Barat", "Jawa Tengah", "DKI Jakarta"];
const countries = ["Indonesia", "Malaysia", "Singapore", "Thailand"];
const cities = ["Malang", "Surabaya", "Jakarta", "Bandung"];

// Profile-specific dropdown component
const ProfileDropdown = ({
  isOpen,
  toggle,
  selected,
  options,
  onSelect,
  className = "",
  placeholder = "",
  disabled = false,
  dropdownRef,
}) => (
  <div className={`relative ${className}`} ref={dropdownRef}>
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        toggle(e);
      }}
      className={`w-full h-10 sm:h-11 md:h-12 px-3 py-2 text-xs sm:text-sm md:text-base bg-white rounded-xl shadow-md border border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200 flex items-center justify-between ${
        disabled ? "opacity-50 cursor-not-allowed" : "hover:shadow-lg"
      }`}
      disabled={disabled}
      aria-label={placeholder}
    >
      <span className="text-gray-800 truncate">{selected || placeholder}</span>
      <svg
        className={`w-4 h-4 sm:w-5 sm:h-5 text-gray-500 transition-transform duration-200 ${
          isOpen ? "rotate-180" : ""
        }`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 9l-7 7-7-7"
        />
      </svg>
    </button>

    {isOpen && (
      <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-lg border border-gray-200 z-[60] max-h-[40vh] overflow-y-auto">
        {options.map((option, index) => (
          <button
            type="button"
            key={index}
            onClick={(e) => {
              e.stopPropagation();
              onSelect(option);
              toggle(e);
            }}
            className={`block w-full text-left px-3 py-2 text-xs sm:text-sm md:text-base transition-all duration-200 hover:bg-blue-50 hover:text-blue-600 ${
              selected === option
                ? "bg-blue-100 text-blue-600 font-medium"
                : "text-gray-800"
            }`}
            disabled={disabled}
          >
            {option}
          </button>
        ))}
      </div>
    )}
  </div>
);

const Profile = () => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [updateError, setUpdateError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [profileImageUrl, setProfileImageUrl] = useState(
    "/users/profile-picture.png"
  );
  const [formData, setFormData] = useState({
    username: "",
    phone: "",
    province: "",
    email: "",
    country: "",
    city: "",
  });
  const [reviews, setReviews] = useState([]);
  const fileInputRef = useRef(null);
  const logoutDialogRef = useRef(null);
  const countryDropdownRef = useRef(null);
  const provinceDropdownRef = useRef(null);
  const cityDropdownRef = useRef(null);

  // Fetch user data and reviews when component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        await Promise.all([fetchUserData(), fetchUserReviews()]);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // Reset status messages after 3 seconds
  useEffect(() => {
    if (updateSuccess || updateError) {
      const timer = setTimeout(() => {
        setUpdateSuccess(false);
        setUpdateError(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [updateSuccess, updateError]);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem("auth_header");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      };
      const response = await axios.get(
        "http://localhost:8000/api/auth/validate-token",
        config
      );
      if (response.data && response.data.user) {
        const user = response.data.user;
        setFormData({
          username: user.name || "",
          phone: user.number || "",
          province: user.province || "",
          email: user.email || "",
          country: user.country || "",
          city: user.city || "",
        });
        if (user.profile_image) {
          setProfileImageUrl(user.profile_image);
        }
      }
    } catch (error) {
      console.error("Failed to fetch user data:", error);
      if (error.response && error.response.status === 401) {
        navigate("/login");
      }
    }
  };

  const fetchUserReviews = async () => {
    try {
      const token = localStorage.getItem("auth_header");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      };
      const response = await axios.get(
        "http://localhost:8000/api/reviews/user",
        config
      );
      if (response.data) {
        const reviewsWithImages = await Promise.all(
          response.data.map(async (review) => {
            try {
              const placeResponse = await axios.get(
                `http://localhost:8000/api/places/${review.place_id}`,
                config
              );
              return {
                ...review,
                images: placeResponse.data.images || [
                  "/images/placeholder.jpg",
                ],
              };
            } catch (error) {
              console.error(
                `Failed to fetch images for place ${review.place_id}:`,
                error
              );
              return {
                ...review,
                images: ["/images/placeholder.jpg"],
              };
            }
          })
        );
        setReviews(reviewsWithImages);
      }
    } catch (error) {
      console.error("Failed to fetch user reviews:", error);
      if (error.response && error.response.status === 401) {
        navigate("/login");
      }
    }
  };

  const prevReview = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? reviews.length - 1 : prev - 1));
  };

  const nextReview = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === reviews.length - 1 ? 0 : prev + 1));
  };

  const handleCardClick = (review) => {
    const selectedPlace = {
      id: review.place_id,
      name: review.title,
      address: review.address,
      facilities: review.facilities,
      images: review.images,
    };
    navigate("/place-detail", { state: { selectedPlace } });
  };

  const handleProfileEdit = () => {
    setIsEditMode(true);
  };

  const handleSaveProfile = async () => {
    try {
      setIsSaving(true);
      setUpdateError(null);

      // Validate profile data
      if (!formData.username.trim()) {
        setUpdateError("Nama pengguna tidak boleh kosong");
        setIsSaving(false);
        return;
      }
      if (!formData.phone.trim()) {
        setUpdateError("Nomor telepon tidak boleh kosong");
        setIsSaving(false);
        return;
      }
      if (!formData.country || !formData.province || !formData.city) {
        setUpdateError("Negara, Provinsi, dan Kota harus diisi");
        setIsSaving(false);
        return;
      }

      const token = localStorage.getItem("auth_header");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      };

      // Prepare profile data
      const updateData = {
        name: formData.username,
        number: formData.phone,
        province: formData.province,
        email: formData.email,
        country: formData.country,
        city: formData.city,
      };

      // Update profile data
      const profileResponse = await axios.put(
        "http://localhost:8000/api/auth/update",
        updateData,
        {
          ...config,
          headers: {
            ...config.headers,
            "Content-Type": "application/json",
          },
        }
      );

      // Handle profile image upload if selected
      if (selectedImage) {
        if (selectedImage.size > 5 * 1024 * 1024) {
          setUpdateError("Ukuran gambar tidak boleh lebih dari 5MB");
          setIsSaving(false);
          return;
        }
        if (
          !["image/jpeg", "image/png", "image/jpg"].includes(selectedImage.type)
        ) {
          setUpdateError(
            "Format gambar tidak valid. Gunakan jpeg, png, atau jpg"
          );
          setIsSaving(false);
          return;
        }

        const imageFormData = new FormData();
        imageFormData.append("profile_image", selectedImage);

        const imageResponse = await axios.post(
          "http://localhost:8000/api/auth/update-profile-image",
          imageFormData,
          {
            ...config,
            headers: {
              ...config.headers,
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (imageResponse.data && imageResponse.data.success) {
          setProfileImageUrl(imageResponse.data.profile_image);
        } else {
          setUpdateError("Gagal mengunggah gambar profil");
          setIsSaving(false);
          return;
        }
      }

      if (profileResponse.data && profileResponse.data.success) {
        setIsEditMode(false);
        setUpdateSuccess(true);
        setSelectedImage(null);
        fetchUserData();
      } else {
        setUpdateError("Gagal memperbarui profil. Silakan coba lagi.");
      }
    } catch (error) {
      console.error("Failed to update profile:", error);
      setUpdateError(
        error.response?.data?.message ||
          "Gagal memperbarui profil. Silakan coba lagi."
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    fetchUserData();
    setIsEditMode(false);
    setSelectedImage(null);
    setProfileImageUrl(formData.profile_image || "/users/profile-picture.png");
  };

  const handleChangeProfilePicture = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImageUrl(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = useCallback((name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleLogoutClick = () => {
    setShowLogoutDialog(true);
  };

  const handleCancelLogout = () => {
    setShowLogoutDialog(false);
  };

  const handleConfirmLogout = () => {
    logout();
    setShowLogoutDialog(false);
    navigate("/login");
  };

  // Dropdown state management
  const [countryDropdownOpen, setCountryDropdownOpen] = useState(false);
  const [provinceDropdownOpen, setProvinceDropdownOpen] = useState(false);
  const [cityDropdownOpen, setCityDropdownOpen] = useState(false);

  const toggleCountryDropdown = useCallback((e) => {
    e.stopPropagation();
    setCountryDropdownOpen((prev) => !prev);
    setProvinceDropdownOpen(false);
    setCityDropdownOpen(false);
  }, []);

  const toggleProvinceDropdown = useCallback((e) => {
    e.stopPropagation();
    setProvinceDropdownOpen((prev) => !prev);
    setCountryDropdownOpen(false);
    setCityDropdownOpen(false);
  }, []);

  const toggleCityDropdown = useCallback((e) => {
    e.stopPropagation();
    setCityDropdownOpen((prev) => !prev);
    setCountryDropdownOpen(false);
    setProvinceDropdownOpen(false);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        countryDropdownRef.current &&
        !countryDropdownRef.current.contains(event.target)
      ) {
        setCountryDropdownOpen(false);
      }
      if (
        provinceDropdownRef.current &&
        !provinceDropdownRef.current.contains(event.target)
      ) {
        setProvinceDropdownOpen(false);
      }
      if (
        cityDropdownRef.current &&
        !cityDropdownRef.current.contains(event.target)
      ) {
        setCityDropdownOpen(false);
      }
    };

    const timeout = setTimeout(() => {
      document.addEventListener("click", handleClickOutside);
    }, 0);

    return () => {
      clearTimeout(timeout);
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  if (isLoading) {
    return <LoadingIndicator />; // Replaced CustomLoader with LoadingIndicator
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F6FA] pt-12 sm:pt-16">
      <NavbarBack title="Profile" showAvatar={true} />

      {/* Status Messages */}
      {updateSuccess && (
        <div className="fixed top-[10vh] left-4 right-4 sm:left-1/2 sm:-translate-x-1/2 z-50 max-w-md">
          <CustomNotification
            title="Sukses"
            type="success"
            onClose={() => setUpdateSuccess(false)}
          >
            Profil berhasil diperbarui!
          </CustomNotification>
        </div>
      )}
      {updateError && (
        <div className="fixed top-[10vh] left-4 right-4 sm:left-1/2 sm:-translate-x-1/2 z-50 max-w-md">
          <CustomNotification
            title="Error"
            type="error"
            onClose={() => setUpdateError(null)}
          >
            {updateError}
          </CustomNotification>
        </div>
      )}
      {isSaving && (
        <div className="fixed top-[10vh] left-4 right-4 sm:left-1/2 sm:-translate-x-1/2 z-50 max-w-md">
          <CustomNotification title="Menyimpan" type="loading">
            Sedang memperbarui profil...
          </CustomNotification>
        </div>
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept=".jpg,.jpeg,.png"
        onChange={handleFileChange}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:flex-row gap-4 sm:gap-6 p-4 sm:p-15 w-full">
        {/* Left Card */}
        <div className="w-full lg:w-96 bg-[#3C91E6] rounded-2xl p-4 sm:p-6 text-center text-white shadow-md flex flex-col">
          <h2 className="text-lg sm:text-xl md:text-2xl font-semibold mb-3 sm:mb-4">
            Profile Pengguna
          </h2>

          {/* Foto Profil */}
          <div className="flex justify-center mb-3 sm:mb-4 relative">
            <img
              src={profileImageUrl}
              alt="Profile"
              className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 rounded-full object-cover border-2 border-white"
            />
          </div>
          <h2 className="text-base sm:text-lg md:text-xl font-bold truncate">
            {formData.username}
          </h2>
          <p className="text-xs sm:text-sm mt-1 truncate">
            {formData.city}, {formData.province}
          </p>

          {/* Ulasan Terbaru */}
          <div className="mt-3 sm:mt-10 flex-1 flex flex-col">
            <h3 className="text-sm sm:text-base font-semibold mb-2 sm:mb-3">
              Ulasan Terbaru
            </h3>
            {reviews.length === 0 ? (
              <p className="text-xs sm:text-sm text-gray-200">
                Belum ada ulasan
              </p>
            ) : (
              <div className="flex justify-center items-center gap-2 sm:gap-3">
                <button
                  onClick={prevReview}
                  className="text-white text-lg sm:text-xl md:text-2xl hover:text-gray-300 cursor-pointer p-2"
                  disabled={reviews.length <= 1}
                >
                  ‹
                </button>

                <div className="relative w-full max-w-[180px] sm:max-w-[220px] md:max-w-[240px] h-25 sm:h-40 md:h-30 overflow-hidden">
                  {reviews.map((review, index) => (
                    <div
                      key={review.place_id}
                      className={`absolute inset-0 transition-opacity duration-500 ease-in-out
                        ${
                          index === currentIndex
                            ? "opacity-100"
                            : "opacity-0 pointer-events-none"
                        }
                      `}
                    >
                      <div
                        className="h-full w-full flex justify-center cursor-pointer"
                        onClick={() => handleCardClick(review)}
                      >
                        <div className="w-full bg-white rounded-lg shadow-md flex flex-col overflow-hidden">
                          <div className="p-2 sm:p-3 bg-white rounded-lg flex-1 flex flex-col text-left hover:bg-gray-100 transition-colors">
                            <div>
                              <h4 className="text-xs sm:text-sm font-bold text-gray-800 truncate">
                                {review.title}
                              </h4>
                              <p className="text-[10px] sm:text-xs text-gray-600 truncate">
                                {review.address}
                              </p>
                            </div>

                            <div className="flex items-center mt-1 sm:mt-2 gap-1 sm:gap-2">
                              <span className="text-xs sm:text-sm font-bold text-gray-800">
                                {parseFloat(review.rating || 0).toFixed(1)}
                              </span>
                              <div className="flex items-center gap-0.5 sm:gap-1">
                                {[...Array(5)].map((_, i) => (
                                  <img
                                    key={i}
                                    src="/icons/star-filled.png"
                                    alt="Star"
                                    className={`w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-3.5 md:h-3.5 ${
                                      i <
                                      Math.floor(parseFloat(review.rating || 0))
                                        ? ""
                                        : "filter grayscale"
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>

                            <div className="mt-1 sm:mt-2 flex flex-nowrap gap-0.5 sm:gap-1 overflow-hidden">
                              {review.facilities.map((facilityId) => (
                                <div
                                  key={facilityId}
                                  className="w-5 h-5 sm:w-6 sm:h-6 bg-[#74B5F5] rounded p-0.5 sm:p-1 flex items-center justify-center"
                                >
                                  <img
                                    src={`/icons/${facilityIconMap[facilityId]}.png`}
                                    alt={facilityIconMap[facilityId]}
                                    className="w-3 h-3 sm:w-4 sm:h-4 object-contain"
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={nextReview}
                  className="text-white text-lg sm:text-xl md:text-2xl hover:text-gray-300 cursor-pointer p-2"
                  disabled={reviews.length <= 1}
                >
                  ›
                </button>
              </div>
            )}
          </div>

          <div className="mt-3 sm:mt-4">
            <h3 className="text-sm sm:text-base font-semibold mb-2 text-white">
              Kontak
            </h3>
            <div className="flex justify-center gap-2 sm:gap-3">
              <button className="bg-white p-1.5 sm:p-2 rounded-full text-blue-500 flex items-center justify-center">
                <img
                  src="/icons/email-icon.png"
                  alt="Email"
                  className="w-4 h-4 sm:w-5 sm:h-5"
                />
              </button>
              <button className="bg-white p-1.5 sm:p-2 rounded-full text-blue-500 flex items-center justify-center">
                <img
                  src="/icons/phone-icon.png"
                  alt="Phone"
                  className="w-4 h-4 sm:w-5 sm:h-5"
                />
              </button>
            </div>
          </div>
        </div>

        {/* Right Form */}
        <div className="flex-1 bg-[#EFF0F7] rounded-2xl p-4 sm:p-6 shadow-md flex flex-col">
          <div className="-mx-4 sm:-mx-6">
            <h2 className="text-lg sm:text-xl md:text-2xl font-semibold mb-3 sm:mb-4 border-b-2 pb-2 border-blue-300 px-4 sm:px-6">
              {isEditMode ? "Edit Profile" : "Data Profile"}
            </h2>
          </div>

          <form
            className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 flex-1"
            onSubmit={(e) => {
              e.preventDefault();
              handleSaveProfile();
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Left Column */}
            <div className="space-y-4 sm:space-y-10 p-3 sm:p-4 mt-5">
              <div>
                <label className="text-xs sm:text-sm md:text-base font-semibold">
                  Nama Pengguna
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={(e) =>
                    handleInputChange(e.target.name, e.target.value)
                  }
                  className={`w-full h-10 sm:h-11 md:h-12 px-3 py-2 mt-1 bg-white text-gray-800 text-xs sm:text-sm md:text-base rounded-xl shadow-md border ${
                    isEditMode
                      ? "border-blue-400 focus:ring-2 focus:ring-blue-400"
                      : "border-gray-300"
                  } focus:outline-none ${isEditMode ? "" : "bg-gray-50"}`}
                  readOnly={!isEditMode}
                  disabled={isSaving}
                  required
                />
              </div>
              <div>
                <label className="text-xs sm:text-sm md:text-base font-semibold">
                  Nomor Telepon
                </label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={(e) =>
                    handleInputChange(e.target.name, e.target.value)
                  }
                  className={`w-full h-10 sm:h-11 md:h-12 px-3 py-2 mt-1 bg-white text-gray-800 text-xs sm:text-sm md:text-base rounded-xl shadow-md border ${
                    isEditMode
                      ? "border-blue-400 focus:ring-2 focus:ring-blue-400"
                      : "border-gray-300"
                  } focus:outline-none ${isEditMode ? "" : "bg-gray-50"}`}
                  readOnly={!isEditMode}
                  disabled={isSaving}
                  required
                />
              </div>
              <div>
                <label className="text-xs sm:text-sm md:text-base font-semibold">
                  Provinsi
                </label>
                {isEditMode ? (
                  <ProfileDropdown
                    className="province-dropdown mt-1"
                    isOpen={provinceDropdownOpen}
                    toggle={toggleProvinceDropdown}
                    selected={formData.province}
                    options={provinces}
                    onSelect={(value) => handleInputChange("province", value)}
                    placeholder="Pilih Provinsi"
                    disabled={isSaving}
                    dropdownRef={provinceDropdownRef}
                  />
                ) : (
                  <input
                    type="text"
                    value={formData.province}
                    className="w-full h-10 sm:h-11 md:h-12 px-3 py-2 mt-1 bg-gray-50 text-gray-800 text-xs sm:text-sm md:text-base rounded-xl shadow-md border border-gray-300 focus:outline-none"
                    readOnly
                  />
                )}
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4 sm:space-y-10 p-3 sm:p-4 mt-5">
              <div>
                <label className="text-xs sm:text-sm md:text-base font-semibold">
                  Alamat Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  className="w-full h-10 sm:h-11 md:h-12 px-3 py-2 mt-1 bg-gray-50 text-gray-800 text-xs sm:text-sm md:text-base rounded-xl shadow-md border border-gray-300 focus:outline-none"
                  readOnly={true}
                  disabled={true}
                />
              </div>
              <div>
                <label className="text-xs sm:text-sm md:text-base font-semibold">
                  Negara
                </label>
                {isEditMode ? (
                  <ProfileDropdown
                    className="country-dropdown mt-1"
                    isOpen={countryDropdownOpen}
                    toggle={toggleCountryDropdown}
                    selected={formData.country}
                    options={countries}
                    onSelect={(value) => handleInputChange("country", value)}
                    placeholder="Pilih Negara"
                    disabled={isSaving}
                    dropdownRef={countryDropdownRef}
                  />
                ) : (
                  <input
                    type="text"
                    value={formData.country}
                    className="w-full h-10 sm:h-11 md:h-12 px-3 py-2 mt-1 bg-gray-50 text-gray-800 text-xs sm:text-sm md:text-base rounded-xl shadow-md border border-gray-300 focus:outline-none"
                    readOnly
                  />
                )}
              </div>
              <div>
                <label className="text-xs sm:text-sm md:text-base font-semibold">
                  Kota/Kabupaten
                </label>
                {isEditMode ? (
                  <ProfileDropdown
                    className="city-dropdown mt-1"
                    isOpen={cityDropdownOpen}
                    toggle={toggleCityDropdown}
                    selected={formData.city}
                    options={cities}
                    onSelect={(value) => handleInputChange("city", value)}
                    placeholder="Pilih Kota"
                    disabled={isSaving}
                    dropdownRef={cityDropdownRef}
                  />
                ) : (
                  <input
                    type="text"
                    value={formData.city}
                    className="w-full h-10 sm:h-11 md:h-12 px-3 py-2 mt-1 bg-gray-50 text-gray-800 text-xs sm:text-sm md:text-base rounded-xl shadow-md border border-gray-300 focus:outline-none"
                    readOnly
                  />
                )}
              </div>
            </div>
          </form>

          {/* Buttons */}
          <div className="mt-4 sm:mt-6 px-3 sm:px-4">
            <div className="flex justify-end gap-3 sm:gap-4">
              {isEditMode ? (
                <>
                  <button
                    onClick={handleCancelEdit}
                    type="button"
                    className="bg-gray-400 text-white font-medium px-4 py-2 sm:px-6 sm:py-2.5 text-xs sm:text-sm rounded-md hover:bg-gray-500 transition cursor-pointer"
                    disabled={isSaving}
                  >
                    Batal
                  </button>
                  <button
                    onClick={handleChangeProfilePicture}
                    type="button"
                    className="bg-[#3C91E6] text-white font-medium px-4 py-2 sm:px-6 sm:py-2.5 text-xs sm:text-sm rounded-md hover:bg-blue-500 transition cursor-pointer"
                    disabled={isSaving}
                  >
                    Ganti Foto Profil
                  </button>
                  <button
                    onClick={handleSaveProfile}
                    type="button"
                    className="bg-[#019D00] text-white font-medium px-4 py-2 sm:px-6 sm:py-2.5 text-xs sm:text-sm rounded-md hover:bg-green-700 transition cursor-pointer"
                    disabled={isSaving}
                  >
                    Perbarui
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={handleLogoutClick}
                    type="button"
                    className="bg-[#E63C3C] text-white font-medium px-4 py-2 sm:px-6 sm:py-2.5 text-xs sm:text-sm rounded-md hover:bg-[#E63000] transition cursor-pointer"
                  >
                    Logout
                  </button>
                  <button
                    onClick={handleProfileEdit}
                    type="button"
                    className="bg-[#3C91E6] text-white font-medium px-4 py-2 sm:px-6 sm:py-2.5 text-xs sm:text-sm rounded-md hover:bg-blue-500 transition cursor-pointer"
                  >
                    Edit Profile
                  </button>
                </>
              )}
            </div>
          </div>

          {showLogoutDialog && (
            <ConfirmDialog
              ref={logoutDialogRef}
              isOpen={showLogoutDialog}
              onConfirm={handleConfirmLogout}
              onCancel={handleCancelLogout}
              message="Apakah Anda yakin ingin keluar dari akun?"
              confirmLabel="Keluar"
              cancelLabel="Batal"
              confirmColor="text-red-500"
              cancelColor="text-[#3C91E6]"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
