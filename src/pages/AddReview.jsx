import React, { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Rating from "../components/Rating";
import Facilities from "../components/Facilities";
import Review from "../components/Review";
import FACILITIES from "../constants/facilities";
import NavbarBack from "../components/NavbarBack";
import api from "../utils/authUtils"; // Import the API instance with auth headers

const AddReview = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  // Extract place information from location state
  const placeId = location.state?.placeId;
  const placeName = location.state?.placeName || "Universitas Brawijaya";
  const placeAddress = location.state?.placeAddress || "Jl. Veteran No.8, Kec. Lowokwaru, Kota Malang";
  const placeFacilities = location.state?.facilities || [];
  
  const [formData, setFormData] = useState({
    rating: 0,
    ulasan: "",
    selectedFacilities: [],
    foto: [],
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  
  // Set initial selected facilities from place data
  useEffect(() => {
    if (placeFacilities && placeFacilities.length > 0) {
      const facilityIds = placeFacilities.map(facility => 
        FACILITIES.find(f => f.name === facility.name)?.id
      ).filter(id => id !== undefined);
      
      setFormData(prev => ({
        ...prev,
        selectedFacilities: facilityIds
      }));
    }
  }, [placeFacilities]);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  
  const handleFacilityToggle = (facilityId) => {
    setFormData((prevData) => {
      const currentSelected = [...prevData.selectedFacilities];
      if (currentSelected.includes(facilityId)) {
        return {
          ...prevData,
          selectedFacilities: currentSelected.filter((id) => id !== facilityId),
        };
      } else {
        return {
          ...prevData,
          selectedFacilities: [...currentSelected, facilityId],
        };
      }
    });
  };
  
  const handleRatingChange = (rating) => {
    setFormData({
      ...formData,
      rating,
    });
  };
  
  const handleFotoClick = () => {
    fileInputRef.current.click();
  };
  
  const handleFotoChange = (e) => {
    const files = Array.from(e.target.files);
    
    if (formData.foto.length + files.length > 5) {
      setErrorMessage("Maksimal 5 foto yang dapat diunggah.");
      return;
    }
    
    const newFiles = [...formData.foto, ...files];
    setFormData({
      ...formData,
      foto: newFiles,
    });
    
    // Create preview URLs for the new images
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setImagePreviews(prev => [...prev, ...newPreviews]);
  };
  
  const handleRemoveImage = (index) => {
    // Remove from formData
    const updatedFiles = [...formData.foto];
    updatedFiles.splice(index, 1);
    
    // Remove from previews
    const updatedPreviews = [...imagePreviews];
    URL.revokeObjectURL(updatedPreviews[index]); // Clean up the URL object
    updatedPreviews.splice(index, 1);
    
    setFormData({
      ...formData,
      foto: updatedFiles,
    });
    setImagePreviews(updatedPreviews);
  };
  
  const handleClearReview = () => {
    setFormData({
      ...formData,
      ulasan: "",
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!placeId) {
      setErrorMessage("Data tempat tidak ditemukan.");
      return;
    }
    
    if (formData.rating === 0) {
      setErrorMessage("Silakan berikan rating terlebih dahulu.");
      return;
    }
    
    setIsLoading(true);
    setErrorMessage("");
    
    const formDataObj = new FormData();
    formDataObj.append("place_id", placeId);
    formDataObj.append("rating", formData.rating);
    formDataObj.append("comment", formData.ulasan);
    
    if (formData.selectedFacilities.length > 0) {
      formDataObj.append(
        "facilities",
        JSON.stringify(formData.selectedFacilities)
      );
    }
    
    // Append each file with the same field name
    formData.foto.forEach((file, index) => {
      formDataObj.append(`images[${index}]`, file);
    });
    
    try {
      // Get the token from localStorage with correct key
      const token = localStorage.getItem("auth_header");
      if (!token) {
        throw new Error("Anda perlu login terlebih dahulu");
      }
      
      // Use the api instance with auth headers
      const response = await api.post("/reviews", formDataObj, {
        headers: {
          'Content-Type': 'multipart/form-data', // Important for file uploads
        }
      });
      
      // Success, navigate back to place detail
      navigate(`/places/${placeId}`, { 
        state: { successMessage: "Ulasan berhasil ditambahkan" }
      });
      
    } catch (error) {
      console.error("Error submitting review:", error);
      
      // Handle different error responses
      if (error.response) {
        // Server responded with an error
        if (error.response.status === 401) {
          setErrorMessage("Anda perlu login terlebih dahulu");
        } else {
          setErrorMessage(error.response.data?.error || error.response.data?.message || "Gagal menambahkan ulasan");
        }
      } else if (error.request) {
        // Request was made but no response received
        setErrorMessage("Tidak dapat terhubung ke server");
      } else {
        // Error in request setup
        setErrorMessage(error.message || "Terjadi kesalahan saat menambahkan ulasan");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      imagePreviews.forEach(url => URL.revokeObjectURL(url));
    };
  }, [imagePreviews]);
  
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <NavbarBack title="Tambah Ulasan" showAvatar={false} />
      
      <div className="w-full mt-8 flex flex-col items-center mb-6">
        <h1 className="text-5xl font-bold text-[#3C91E6] text-center mb-4">
          {placeName}
        </h1>
        <p className="text-xl text-center">
          {placeAddress}
        </p>
      </div>
      
      <div className="container mx-auto max-w-lg px-4 py-6">
        {errorMessage && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {errorMessage}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <Rating
            rating={formData.rating}
            onRatingChange={handleRatingChange}
          />
          
          <div className="mb-6 relative left-1/2 -translate-x-1/2 w-full min-w-3xl mx-auto">
            <Facilities
              facilities={FACILITIES}
              selectedFacilities={formData.selectedFacilities}
              onFacilityToggle={handleFacilityToggle}
            />
          </div>
          
          <div className="mb-6">
            <div className="relative left-1/2 -translate-x-1/2 min-w-2xl">
              <Review
                review={formData.ulasan}
                onReviewChange={handleInputChange}
                onClear={handleClearReview}
                images={imagePreviews}
                onRemoveImage={handleRemoveImage}
                totalImages={formData.foto.length}
                showImagePreviews={formData.foto.length > 0}
              />
            </div>
          </div>
          
          <div className="flex flex-row gap-4 justify-center items-center">
            <input
              type="file"
              accept="image/*"
              multiple
              ref={fileInputRef}
              onChange={handleFotoChange}
              className="hidden"
            />
            <button
              type="button"
              onClick={handleFotoClick}
              disabled={formData.foto.length >= 5 || isLoading}
              className={`${
                formData.foto.length >= 5 || isLoading
                  ? "bg-gray-400 text-white border-gray-400"
                  : "bg-white text-black border-[#3C91E6] hover:bg-gray-100"
              } border-2 rounded-lg p-3 w-1/2 flex justify-center items-center gap-2 cursor-pointer`}
            >
              <img
                src="/icons/camera_ic.png"
                alt="Camera"
                className="w-6 h-6"
              />
              Tambah Foto
            </button>
            
            <button
              type="submit"
              disabled={isLoading}
              className={`${
                isLoading ? "bg-gray-400" : "bg-[#3C91E6] hover:bg-[#3c80e6]"
              } text-white rounded-lg p-3 w-1/2 flex justify-center items-center cursor-pointer`}
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                  Mengirim...
                </>
              ) : (
                "Tambahkan Ulasan"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddReview;