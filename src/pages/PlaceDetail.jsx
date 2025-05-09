import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { motion, AnimatePresence } from "framer-motion";
import NavbarBack from "../components/NavbarBack";

// Daftar lengkap fasilitas aksesibilitas (dari database atau statis)
const allAccessibilityFeatures = [
  { id: 1, name: "Jalur Kursi Roda" },
  { id: 2, name: "Pintu Otomatis" },
  { id: 3, name: "Parkir Disabilitas" },
  { id: 4, name: "Toilet Disabilitas" },
  { id: 5, name: "Lift Braille & Suara" },
  { id: 6, name: "Interpreter Isyarat" },
  { id: 7, name: "Jalur Guiding Block" },
  { id: 8, name: "Menu Braille" },
];

const PlaceDetail = () => {
  const location = useLocation();
  const selectedPlace = location.state?.selectedPlace;

  // Default fallback jika selectedPlace tidak tersedia
  const placeName = selectedPlace?.name || "Universitas Brawijaya";
  const placeAddress = selectedPlace?.address || "Jl Veteran No.10-11, Kec. Lowokwaru, Kota Malang";
  const images = selectedPlace?.images || [];
  const facilities = selectedPlace?.facilities || [];
  const ratings = selectedPlace?.ratings || [];

  // State untuk modal gambar full-screen
  const [selectedImage, setSelectedImage] = useState(null);

  // Fungsi untuk membuka modal gambar
  const handleImageClick = (image) => {
    setSelectedImage(image);
  };

  // Fungsi untuk menutup modal
  const closeModal = () => {
    setSelectedImage(null);
  };

  // Variasi animasi untuk modal
  const modalVariants = {
    hidden: { y: "100vh", opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.3, ease: "easeOut" } },
    exit: { y: "100vh", opacity: 0, transition: { duration: 0.3, ease: "easeIn" } },
  };

  // Komponen panah kustom untuk carousel
  const arrowStyles = {
    position: "absolute",
    zIndex: 2,
    top: "calc(50% - 15px)",
    width: 40,
    height: 40,
    cursor: "pointer",
    border: "none",
    background: "transparent",
  };

  const NextArrow = (onClickHandler, hasNext, label) =>
    hasNext && (
      <button
        type="button"
        onClick={onClickHandler}
        title={label}
        className="hover:scale-125 transition-all duration-200"
        style={{ ...arrowStyles, right: 15 }}
      >
        <img src="/icons/forward_ic.png" alt="Next" />
      </button>
    );

  const PrevArrow = (onClickHandler, hasPrev, label) =>
    hasPrev && (
      <button
        type="button"
        onClick={onClickHandler}
        title={label}
        className="hover:scale-125 transition-all duration-200"
        style={{ ...arrowStyles, left: 15 }}
      >
        <img src="/icons/backward_ic.png" alt="Previous" />
      </button>
    );

  // Fungsi untuk merender bintang rating
  const renderRatingStars = (rating = 0) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <div className="flex items-center">
        <div className="flex text-3xl text-yellow-500">
          {[...Array(fullStars)].map((_, i) => (
            <span key={`full-${i}`}>★</span>
          ))}
          {hasHalfStar && <span>★</span>}
          {[...Array(emptyStars)].map((_, i) => (
            <span key={`empty-${i}`} className="text-gray-300">
              ★
            </span>
          ))}
        </div>
      </div>
    );
  };

  // Error handling jika selectedPlace tidak ada
  if (!selectedPlace) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500">Place data not provided</p>
      </div>
    );
  }

  // Fungsi untuk menentukan status ketersediaan fasilitas
  const getFacilityStatus = () => {
    return allAccessibilityFeatures.map((feature) => ({
      ...feature,
      available: facilities.some((facility) => facility.name === feature.name),
    }));
  };

  const accessibilityFeaturesWithStatus = getFacilityStatus();

  return (
    <div>
      <NavbarBack title={placeName} />

      <div className="text-center mt-10">
        <h2 className="text-3xl font-bold text-[#3C91E6]">{placeName}</h2>
        <p className="text-xl text-black mt-2 mb-10">{placeAddress}</p>
      </div>

      {/* 📷 Carousel dengan Gambar dari selectedPlace */}
      <div className="mt-4 mx-20 bg-gray-100 rounded-[20px] overflow-hidden">
        {images.length === 0 ? (
          <div className="h-[250px] flex items-center justify-center">
            <img
              src="/placeholder_img.png"
              alt="No images available"
              className="object-cover h-[250px] w-full"
            />
          </div>
        ) : (
          <Carousel
            showThumbs={false}
            infiniteLoop
            autoPlay
            showStatus={false}
            renderArrowPrev={PrevArrow}
            renderArrowNext={NextArrow}
          >
            {images.map((image, index) => (
              <div key={image.id} onClick={() => handleImageClick(image)} className="cursor-pointer">
                <img
                  src={image.image}
                  alt={`Place image ${index + 1}`}
                  className="object-cover h-[450px] w-full"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/placeholder_img.png";
                  }}
                />
              </div>
            ))}
          </Carousel>
        )}
      </div>

      {/* Modal Gambar Full-screen dengan Animasi Slide Fade */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            className="fixed inset-0 bg-[rgba(0,0,0,0.6)] flex items-center justify-center z-50"
            onClick={closeModal}
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div
              className="relative max-w-4xl w-full h-[90vh] flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={selectedImage.image}
                alt="Full-screen image"
                className="max-w-full max-h-full object-contain"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/placeholder_img.png";
                }}
              />
              <button
                className="absolute top-0 right-4 text-xl font-bold text-white rounded-full w-8 h-8 flex items-center justify-center cursor-pointer"
                onClick={closeModal}
                aria-label="Close image modal"
              >
                ✕
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-6 px-4">
        <h3 className="font-semibold text-2xl text-center mb-10 mt-15">
          Fasilitas Aksesibilitas
        </h3>
        <div className="flex justify-center">
          <div className="grid grid-cols-2 gap-y-5 gap-x-60 text-sm w-full max-w-2xl mb-20">
            {accessibilityFeaturesWithStatus.map((feature, idx) => (
              <div
                key={feature.id}
                className="flex items-center whitespace-nowrap font-medium text-base"
              >
                <span className="mr-2">{feature.name}</span>
                <div className="ml-auto flex-shrink-0">
                  <img
                    src={`/icons/${feature.available ? "check_rounded" : "false_rounded"}.png`}
                    alt={feature.available ? "Available" : "Not Available"}
                    className="w-6 h-6"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 px-15 mx-4">
        <h3 className="font-semibold text-2xl text-center mb-5">Ulasan</h3>
        <div className="border-2 border-[#3C91E6] rounded-lg overflow-hidden">
          {/* Ulasan Pertama */}
          <div className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-full overflow-hidden">
                <img
                  src="/icons/user.png"
                  alt="User"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://via.placeholder.com/40";
                  }}
                />
              </div>
              <span className="text-xl font-medium">James</span>
            </div>

            <div className="pl-[60px]">
              <div className="text-yellow-500 mb-4 flex">
                <span className="text-3xl">★</span>
                <span className="text-3xl">★</span>
                <span className="text-3xl">★</span>
                <span className="text-3xl">★</span>
                <span className="text-3xl">★</span>
              </div>

              <div className="mb-4 space-y-2">
                <div className="flex items-center">
                  <span className="inline-block w-36">Jalur Kursi Roda</span>
                  <img
                    src="/icons/check_rounded.png"
                    alt="Available"
                    className="w-5 h-5"
                  />
                </div>
                <div className="flex items-center">
                  <span className="inline-block w-36">Pintu Otomatis</span>
                  <img
                    src="/icons/check_rounded.png"
                    alt="Available"
                    className="w-5 h-5"
                  />
                </div>
                <div className="flex items-center">
                  <span className="inline-block w-36">Parkir Disabilitas</span>
                  <img
                    src="/icons/check_rounded.png"
                    alt="Available"
                    className="w-5 h-5"
                  />
                </div>
                <div className="flex items-center">
                  <span className="inline-block w-36">Toilet Disabilitas</span>
                  <img
                    src="/icons/check_rounded.png"
                    alt="Available"
                    className="w-5 h-5"
                  />
                </div>
              </div>

              <p className="text-base text-gray-700">
                Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque
                faucibus ex sapien vitae pellentesque sem placerat. In id cursus
                mi pretium tellus duis convallis
              </p>
            </div>
          </div>

          {/* Divider */}
          <div className="flex justify-center">
            <div className="w-11/12 h-px bg-gray-400"></div>
          </div>

          {/* Ulasan Kedua */}
          <div className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-full overflow-hidden">
                <img
                  src="/icons/user.png"
                  alt="User"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://via.placeholder.com/40";
                  }}
                />
              </div>
              <span className="text-xl font-medium">James</span>
            </div>

            <div className="pl-[60px]">
              <div className="text-yellow-500 mb-4 flex">
                <span className="text-3xl">★</span>
                <span className="text-3xl">★</span>
                <span className="text-3xl">★</span>
                <span className="text-3xl">★</span>
                <span className="text-3xl">★</span>
              </div>

              <div className="mb-4 space-y-2">
                <div className="flex items-center">
                  <span className="inline-block w-36">Jalur Kursi Roda</span>
                  <img
                    src="/icons/check_rounded.png"
                    alt="Available"
                    className="w-5 h-5"
                  />
                </div>
                <div className="flex items-center">
                  <span className="inline-block w-36">Pintu Otomatis</span>
                  <img
                    src="/icons/check_rounded.png"
                    alt="Available"
                    className="w-5 h-5"
                  />
                </div>
                <div className="flex items-center">
                  <span className="inline-block w-36">Parkir Disabilitas</span>
                  <img
                    src="/icons/check_rounded.png"
                    alt="Available"
                    className="w-5 h-5"
                  />
                </div>
                <div className="flex items-center">
                  <span className="inline-block w-36">Toilet Disabilitas</span>
                  <img
                    src="/icons/check_rounded.png"
                    alt="Available"
                    className="w-5 h-5"
                  />
                </div>
              </div>

              <p className="text-base text-gray-700">
                Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque
                faucibus ex sapien vitae pellentesque sem placerat. In id cursus
                mi pretium tellus duis convallis
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-5 px-4 flex flex-col items-center gap-6 mb-6">
        <button className="border border-[#3C91E6] text-black font-semibold px-15 py-2 rounded cursor-pointer hover:bg-[#e0efff]">
          Lihat Semua Ulasan
        </button>
        <button className="bg-[#3C91E6] text-white font-semibold px-12 py-2 rounded flex items-center gap-2 cursor-pointer hover:bg-[#337ac2]">
          <img src="/icons/add_review.png" alt="Tambah" className="w-6 h-6" />
          Tambahkan Ulasan
        </button>
      </div>
    </div>
  );
};

export default PlaceDetail;