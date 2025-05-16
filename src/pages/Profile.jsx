import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavbarBack from "../components/NavbarBack";
import ReviewCard from "../components/ReviewCard";
import LogoutDialog from "../components/LogoutDialog";
import { logout } from "../utils/authUtils";
import axios from "axios";

const reviews = [
  {
    image: "../assets/universitas-brawijaya.jpg",
    title: "Universitas Brawijaya",
    address: "Jl. Veteran No.8, Malang",
    rating: 4.9,
    features: ["toiletdisabilitas-w", "jalurkursiroda-w"],
  },
  {
    image: "../assets/UnivIndo.jpeg",
    title: "Universitas Indonesia",
    address: "Depok, Jawa Barat",
    rating: 4.7,
    features: ["liftbraille-w", "pintuotomatis-w"],
  },
];

// Sample data for dropdowns
const provinces = ["Jawa Timur", "Jawa Barat", "Jawa Tengah", "DKI Jakarta"];
const countries = ["Indonesia", "Malaysia", "Singapore", "Thailand"];
const cities = ["Malang", "Surabaya", "Jakarta", "Bandung"];

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
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const fileInputRef = useRef(null);
  const [profileImageUrl, setProfileImageUrl] = useState("/users/profile-picture.png");
  const [formData, setFormData] = useState({
    username: "",
    phone: "",
    province: "",
    email: "",
    country: "",
    city: "",
  });
  const logoutDialogRef = useRef(null);

  // Fetch user data when component mounts
  useEffect(() => {
    fetchUserData();
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
      setIsLoading(true);
      // Get token from local storage
      const token = localStorage.getItem("auth_header");
      
      // Set up headers with the auth token
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      };
      
      // Make API call to get user data
      const response = await axios.get("http://localhost:8000/api/auth/validate-token", config);
      
      // Check if the response contains user data
      if (response.data && response.data.user) {
        const user = response.data.user;
        
        // Update form data with user info
        setFormData({
          username: user.name || "",
          phone: user.number || "",
          province: user.province || "",
          email: user.email || "",
          country: user.country || "",
          city: user.city || "",
        });

        // Set profile image if available
        if (user.profile_image) {
          setProfileImageUrl(user.profile_image);
        }
      }
    } catch (error) {
      console.error("Failed to fetch user data:", error);
      // If unauthorized, redirect to login
      if (error.response && error.response.status === 401) {
        navigate("/login");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const prevReview = () => {
    setCurrentIndex((prev) => (prev === 0 ? reviews.length - 1 : prev - 1));
  };

  const nextReview = () => {
    setCurrentIndex((prev) => (prev === reviews.length - 1 ? 0 : prev + 1));
  };

  const handleProfileEdit = () => {
    setIsEditMode(true);
  };

  const handleSaveProfile = async () => {
    try {
      setIsSaving(true);
      setUpdateError(null);
      
      // Form validation
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
      
      // Get token from local storage
      const token = localStorage.getItem("auth_header");
      
      // Set up headers with the auth token
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        withCredentials: true,
      };
      
      // Prepare the data to update
      const updateData = {
        name: formData.username,
        number: formData.phone,
        province: formData.province,
        email: formData.email,
        country: formData.country,
        city: formData.city,
      };
      
      // Make API call to update user data
      const response = await axios.put("http://localhost:8000/api/auth/update", updateData, config);
      
      // Check if update was successful
      if (response.data && response.data.success) {
        // Exit edit mode
        setIsEditMode(false);
        
        // Show success message
        setUpdateSuccess(true);
        
        // Refresh user data to make sure we have the latest
        fetchUserData();
      } else {
        setUpdateError("Gagal memperbarui profil. Silakan coba lagi.");
      }
    } catch (error) {
      console.error("Failed to update profile:", error);
      setUpdateError(error.response?.data?.message || "Gagal memperbarui profil. Silakan coba lagi.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    // Reset form data to original values by refetching
    fetchUserData();
    // Exit edit mode
    setIsEditMode(false);
    // Clear selected image if any
    setSelectedImage(null);
  };

  const handleChangeProfilePicture = () => {
    // Trigger file input click
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setUpdateError("Ukuran gambar tidak boleh lebih dari 5MB");
        return;
      }

      // Validate file type
      if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
        setUpdateError("Format gambar tidak valid. Gunakan jpeg, png, atau jpg");
        return;
      }

      // Set selected image
      setSelectedImage(file);
      
      // Create a preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImageUrl(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadProfileImage = async () => {
    if (!selectedImage) {
      setUpdateError("Pilih gambar terlebih dahulu");
      return;
    }

    try {
      setIsUploadingImage(true);
      setUpdateError(null);

      // Get token from local storage
      const token = localStorage.getItem("auth_header");
      
      // Set up form data
      const formData = new FormData();
      formData.append('profile_image', selectedImage);
      
      // Set up headers with the auth token
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        },
        withCredentials: true,
      };
      
      // Make API call to upload image
      const response = await axios.post(
        "http://localhost:8000/api/auth/update-profile-image",
        formData,
        config
      );
      
      if (response.data && response.data.success) {
        // Update profile image URL with the one from server
        setProfileImageUrl(response.data.profile_image);
        
        // Show success message
        setUpdateSuccess(true);
        
        // Clear selected image
        setSelectedImage(null);
      } else {
        setUpdateError("Gagal mengunggah gambar profil");
      }
    } catch (error) {
      console.error("Failed to upload profile image:", error);
      setUpdateError(error.response?.data?.message || "Gagal mengunggah gambar profil");
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

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

  if (isLoading) {
    return (
      <div className="h-screen flex justify-center items-center bg-[#F5F6FA]">
        <div className="text-lg text-[#3C91E6]">Loading...</div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden pt-10">
      <NavbarBack title="Profile" showAvatar={true} />

      {/* Status Messages */}
      {updateSuccess && (
        <div className="fixed top-16 left-1/2 transform -translate-x-1/2 z-50 bg-green-500 text-white px-4 py-2 rounded-lg shadow-md transition-opacity">
          Profil berhasil diperbarui!
        </div>
      )}
      
      {updateError && (
        <div className="fixed top-16 left-1/2 transform -translate-x-1/2 z-50 bg-red-500 text-white px-4 py-2 rounded-lg shadow-md transition-opacity">
          {updateError}
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
      <div className="flex-1 bg-white p-4 lg:p-15 flex flex-col lg:flex-row gap-4 lg:gap-6 overflow-hidden">
        {/* Left Card */}
        <div className="w-full lg:w-[380px] bg-[#3C91E6] rounded-2xl p-4 lg:p-6 text-center text-white shadow-md flex flex-col">
          <h2 className="text-xl lg:text-2xl font-semibold mb-3 lg:mb-4">
            Profile Pengguna
          </h2>

          {/* Foto Profil */}
          <div className="flex justify-center mb-3 lg:mb-4 relative">
            <img
              src={profileImageUrl}
              alt="Profile"
              className="w-24 h-24 lg:w-36 lg:h-36 rounded-full object-cover border-2 border-white"
            />
            {selectedImage && (
              <div className="absolute bottom-1 lg:bottom-2 right-1/3 lg:right-1/3">
                <button
                  onClick={handleUploadProfileImage}
                  disabled={isUploadingImage}
                  className="bg-green-500 hover:bg-green-600 text-white text-xs rounded-full p-1 shadow"
                >
                  {isUploadingImage ? (
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
              </div>
            )}
          </div>
          <h2 className="text-lg lg:text-xl font-bold">{formData.username}</h2>
          <p className="text-xs lg:text-sm mt-1">
            {formData.city}, {formData.province}
          </p>

          {/* Ulasan Terbaru */}
          <div className="mt-3 lg:mt-10 flex-1 flex flex-col max-h-[160px]">
            <h3 className="text-sm lg:text-base font-semibold mb-2 lg:mb-3">
              Ulasan Terbaru
            </h3>
            <div className="flex justify-center items-center gap-2 lg:gap-3">
              <button
                onClick={prevReview}
                className="text-white text-xl lg:text-2xl hover:text-gray-300"
              >
                ‹
              </button>

              {/* Review Card Container */}
              <div className="relative w-[180px] h-[160px] lg:w-[200px] lg:h-[100px] overflow-hidden">
                {reviews.map((review, index) => (
                  <div
                    key={index}
                    className={`absolute inset-0 transition-opacity duration-500 ease-in-out
                      ${
                        index === currentIndex
                          ? "opacity-100"
                          : "opacity-0 pointer-events-none"
                      }
                    `}
                  >
                    <div className="h-full w-full flex justify-center">
                      <div className="w-full max-w-[200px] bg-white rounded-lg shadow-md flex flex-col overflow-hidden">
                        {/* Content: Padded, full rounded corners */}
                        <div className="p-2 bg-white rounded-lg flex-1 flex flex-col text-left">
                          <div>
                            <h4 className="text-xs lg:text-sm font-bold text-gray-800 truncate">
                              {review.title}
                            </h4>
                            <p className="text-[10px] lg:text-xs text-gray-600 truncate">
                              {review.address}
                            </p>
                          </div>

                          <div className="flex items-center mt-1 gap-2">
                            <span className="text-xs lg:text-sm font-bold text-gray-800">
                              {review.rating}
                            </span>
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <img
                                  key={i}
                                  src="/icons/star-filled.png"
                                  alt="Star"
                                  className={`w-2 h-2 lg:w-2.5 lg:h-2.5 ${
                                    i < Math.floor(review.rating)
                                      ? ""
                                      : "filter grayscale"
                                  }`}
                                />
                              ))}
                            </div>
                          </div>

                          {/* Features: icons */}
                          <div className="mt-1 flex flex-nowrap gap-0.5 lg:gap-1 overflow-hidden">
                            {review.features.map((icon, i) => (
                              <div
                                key={i}
                                className="w-5 h-5 lg:w-5 lg:h-5 bg-[#74B5F5] rounded p-1 lg:p-1 flex items-center justify-center"
                              >
                                <img
                                  src={`/icons/${icon}.png`}
                                  alt={icon}
                                  className="w-4 h-4 lg:w-5 lg:h-5 object-contain"
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
                className="text-white text-2xl lg:text-2xl hover:text-gray-300"
              >
                ›
              </button>
            </div>
          </div>

          {/* Kontak */}
          <div className="mt-3 lg:mt-4">
            <h3 className="text-sm lg:text-base font-semibold mb-2 text-white">
              Kontak
            </h3>
            <div className="flex justify-center gap-2 lg:gap-3">
              <button className="bg-white p-1.5 lg:p-2 rounded-full text-blue-500 flex items-center justify-center">
                <img
                  src="/icons/email-icon.png"
                  alt="Email"
                  className="w-4 h-4 lg:w-5 lg:h-5"
                />
              </button>
              <button className="bg-white p-1.5 lg:p-2 rounded-full text-blue-500 flex items-center justify-center">
                <img
                  src="/icons/phone-icon.png"
                  alt="Phone"
                  className="w-4 h-4 lg:w-5 lg:h-5"
                />
              </button>
          </div>
        </div>

        {/* Right Form */}
        <div className="flex-1 bg-[#EFF0F7] rounded-2xl p-4 lg:p-6 shadow-md flex flex-col">
          <div className="-mx-4 lg:-mx-6">
            <h2 className="text-xl lg:text-2xl font-semibold mb-3 lg:mb-4 border-b-2 pb-2 border-blue-300 px-4 lg:px-6">
              {isEditMode ? "Edit Profile" : "Data Profile"}
            </h2>
          </div>

          <form className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-4 flex-1 overflow-auto" onSubmit={(e) => { e.preventDefault(); handleSaveProfile(); }}>
            {/* Left Column */}
            <div className="space-y-4 lg:space-y-12 p-4 lg:p-8">
              <div>
                <label className="text-sm lg:text-base font-semibold">
                  Nama Pengguna
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className={`w-full h-10 lg:h-12 px-3 py-2 mt-1 bg-white text-gray-800 text-sm lg:text-base rounded-xl shadow-md border ${
                    isEditMode ? "border-blue-400 focus:ring-2 focus:ring-blue-400" : "border-gray-300"
                  } focus:outline-none ${isEditMode ? "" : "bg-gray-50"}`}
                  readOnly={!isEditMode}
                  disabled={isSaving}
                  required
                />
              </div>
              <div>
                <label className="text-sm lg:text-base font-semibold">
                  Nomor Telepon
                </label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={`w-full h-10 lg:h-12 px-3 py-2 mt-1 bg-white text-gray-800 text-sm lg:text-base rounded-xl shadow-md border ${
                    isEditMode ? "border-blue-400 focus:ring-2 focus:ring-blue-400" : "border-gray-300"
                  } focus:outline-none ${isEditMode ? "" : "bg-gray-50"}`}
                  readOnly={!isEditMode}
                  disabled={isSaving}
                  required
                />
              </div>
              <div>
                <label className="text-sm lg:text-base font-semibold">
                  Provinsi
                </label>
                {isEditMode ? (
                  <div className="relative">
                    <select
                      name="province"
                      value={formData.province}
                      onChange={handleInputChange}
                      className="w-full h-10 lg:h-12 px-3 py-2 mt-1 bg-white text-gray-800 text-sm lg:text-base rounded-xl shadow-md border border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400 appearance-none"
                      disabled={isSaving}
                      required
                    >
                      <option value="">Pilih Provinsi</option>
                      {provinces.map((prov) => (
                        <option
                          key={prov}
                          value={prov}
                          className="text-gray-800 text-sm lg:text-base bg-white hover:bg-gray-100"
                        >
                          {prov}
                        </option>
                      ))}
                    </select>
                    <img
                      src="/icons/droparrow_icon.png"
                      alt="Dropdown Arrow"
                      className="absolute right-5 top-1/2 transform w-4 h-4 lg:w-3 lg:h-2 pointer-events-none"
                    />
                  </div>
                ) : (
                  <input
                    type="text"
                    value={formData.province}
                    className="w-full h-10 lg:h-12 px-3 py-2 mt-1 bg-gray-50 text-gray-800 text-sm lg:text-base rounded-xl shadow-md border border-gray-300 focus:outline-none"
                    readOnly
                  />
                )}
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-10 lg:space-y-12 p-4 lg:p-8">
              <div>
                <label className="text-sm lg:text-base font-semibold">
                  Alamat Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  className="w-full h-10 lg:h-12 px-3 py-2 mt-1 bg-gray-50 text-gray-800 text-sm lg:text-base rounded-xl shadow-md border border-gray-300 focus:outline-none"
                  readOnly={true} // Email should not be editable
                  disabled={true}
                />
              </div>
              <div>
                <label className="text-sm lg:text-base font-semibold">
                  Negara
                </label>
                {isEditMode ? (
                  <div className="relative">
                    <select
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      className="w-full h-10 lg:h-12 px-3 py-2 mt-1 bg-white text-gray-800 text-sm lg:text-base rounded-xl shadow-md border border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400 appearance-none"
                      disabled={isSaving}
                      required
                    >
                      <option value="">Pilih Negara</option>
                      {countries.map((country) => (
                        <option
                          key={country}
                          value={country}
                          className="text-gray-800 text-sm lg:text-base bg-white hover:bg-gray-100"
                        >
                          {country}
                        </option>
                      ))}
                    </select>
                    <img
                      src="/icons/droparrow_icon.png"
                      alt="Dropdown Arrow"
                      className="absolute right-5 top-1/2 transform w-4 h-4 lg:w-3 lg:h-2 pointer-events-none"
                    />
                  </div>
                ) : (
                  <input
                    type="text"
                    value={formData.country}
                    className="w-full h-10 lg:h-12 px-3 py-2 mt-1 bg-gray-50 text-gray-800 text-sm lg:text-base rounded-xl shadow-md border border-gray-300 focus:outline-none"
                    readOnly
                  />
                )}
              </div>
              <div>
                <label className="text-sm lg:text-base font-semibold">
                  Kota/Kabupaten
                </label>
                {isEditMode ? (
                  <div className="relative">
                    <select
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full h-10 lg:h-12 px-3 py-2 mt-1 bg-white text-gray-800 text-sm lg:text-base rounded-xl shadow-md border border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400 appearance-none"
                      disabled={isSaving}
                      required
                    >
                      <option value="">Pilih Kota</option>
                      {cities.map((city) => (
                        <option
                          key={city}
                          value={city}
                          className="text-gray-800 text-sm lg:text-base bg-white hover:bg-gray-100"
                        >
                          {city}
                        </option>
                      ))}
                    </select>
                    <img
                      src="/icons/droparrow_icon.png"
                      alt="Dropdown Arrow"
                      className="absolute right-5 top-1/2 transform w-4 h-4 lg:w-3 lg:h-2 pointer-events-none"
                    />
                  </div>
                ) : (
                  <input
                    type="text"
                    value={formData.city}
                    className="w-full h-10 lg:h-12 px-3 py-2 mt-1 bg-gray-50 text-gray-800 text-sm lg:text-base rounded-xl shadow-md border border-gray-300 focus:outline-none"
                    readOnly
                  />
                )}
              </div>
            </div>
          </form>

          {/* Buttons */}
          <div className="mt-3 lg:mt-4 pr-4 lg:pr-8 mb-5">
            <div className="flex justify-end gap-4 lg:gap-6">
              {isEditMode ? (
                <>
                  <button
                    onClick={handleCancelEdit}
                    type="button"
                    className="bg-gray-400 text-white px-3 py-1.5 lg:px-8 lg:py-2 text-sm lg:text-base rounded-md hover:bg-gray-500 transition"
                    disabled={isSaving}
                  >
                    Batal
                  </button>
                  <button
                    onClick={handleChangeProfilePicture}
                    type="button"
                    className="bg-[#3C91E6] text-white px-3 py-1.5 lg:px-6 lg:py-2 text-sm lg:text-base rounded-md hover:bg-blue-500 transition"
                    disabled={isSaving}
                  >
                    Ganti Foto Profile
                  </button>
                  <button
                    onClick={handleSaveProfile}
                    className="bg-[#019D00] text-white px-3 py-1.5 lg:px-14 lg:py-2 text-sm lg:text-base rounded-md hover:bg-green-700 transition flex items-center justify-center"
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <span className="flex items-center">
                        <span className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                        Menyimpan...
                      </span>
                    ) : (
                      "Perbarui"
                    )}
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={handleLogoutClick}
                    type="button"
                    className="bg-[#E63C3C] text-white px-3 py-1.5 lg:px-10 lg:py-2 text-sm lg:text-base rounded-md hover:bg-[#E63000] transition"
                  >
                    Logout
                  </button>
                  <button
                    onClick={handleProfileEdit}
                    className="bg-[#3C91E6] text-white px-3 py-1.5 lg:px-8 lg:py-2 text-sm lg:text-base rounded-md hover:bg-blue-500 transition"
                  >
                    Edit Profile
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {showLogoutDialog && (
          <LogoutDialog
            ref={logoutDialogRef}
            onConfirm={handleConfirmLogout}
            onCancel={handleCancelLogout}
          />
        )}
      </div>
    </div>
    </div>
  );
};

export default Profile;