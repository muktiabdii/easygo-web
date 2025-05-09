import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Rating from "../components/Rating";
import Facilities from "../components/Facilities";
import Review from "../components/Review";
import FACILITIES from "../constants/facilities";
import NavbarBack from "../components/NavbarBack";

const AddReview = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { position } = location.state || { position: null };

  const [formData, setFormData] = useState({
    namaTempat: "",
    detailAlamat: "",
    foto: null,
    rating: 0,
    ulasan: "",
    selectedFacilities: [],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);

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

  const handleFotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        foto: file,
      });

      const fileReader = new FileReader();
      fileReader.onload = () => {
        setPreviewUrl(fileReader.result);
      };
      fileReader.readAsDataURL(file);
    }
  };

  const handleClearReview = () => {
    setFormData({
      ...formData,
      ulasan: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (position) {
      if (!formData.foto) {
        alert("Silakan pilih foto terlebih dahulu.");
        return;
      }
      setIsLoading(true);

      const formDataObj = new FormData();
      formDataObj.append("name", formData.namaTempat);
      formDataObj.append("address", formData.detailAlamat);
      formDataObj.append("comment", formData.ulasan);
      formDataObj.append("latitude", position.lat);
      formDataObj.append("longitude", position.lng);
      formDataObj.append("rating", formData.rating);

      if (formData.selectedFacilities.length > 0) {
        formDataObj.append(
          "facilities",
          JSON.stringify(formData.selectedFacilities)
        );
      }

      if (formData.foto) {
        formDataObj.append("image", formData.foto);
      }

      try {
        console.log("Sending review data...");
        const response = await fetch("http://127.0.0.1:8000/api/reviews", {
          method: "POST",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: formDataObj,
        });

        const responseData = await response.json();
        console.log("Response:", responseData);

        if (response.ok) {
          navigate("/dashboard");
        } else {
          alert("Gagal mengirim ulasan: " + (responseData.message || "Unknown error"));
        }
      } catch (error) {
        console.error("Error:", error);
        alert("Terjadi kesalahan. Silakan cek console.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <NavbarBack title="Tambah Ulasan" showAvatar={false} />
      
    <div className="w-full mt-8 flex flex-col items-center mb-6">
      <h1 className="text-5xl font-bold text-[#3C91E6] text-center mb-4">Universitas Brawijaya</h1>
        <p className="text-xl text-center">
        Jl. Veteran No.8, Kec. Lowokwaru, Kota Malang
        </p>
    </div>

      <div className="container mx-auto max-w-lg px-4 py-6">
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
            />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`${
              isLoading ? "bg-gray-400" : "bg-[#3C91E6] hover:bg-[#3c80e6]"
            } text-white rounded p-3 w-1/2 flex justify-center items-center mx-auto`}
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
              "Kirim Ulasan"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddReview;
