import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { motion, AnimatePresence } from "framer-motion";
import NavbarBack from "../components/NavbarBack";
import api from "../utils/authUtils";

// Daftar lengkap fasilitas aksesibilitas dengan ikon khusus
const allAccessibilityFeatures = [
  { id: 1, name: "Jalur Kursi Roda", icon: "jalurkursiroda-bk" },
  { id: 2, name: "Pintu Otomatis", icon: "pintuotomatis-bk" },
  { id: 3, name: "Parkir Disabilitas", icon: "parkirdisabilitas-bk" },
  { id: 4, name: "Toilet Disabilitas", icon: "toiletdisabilitas-bk" },
  { id: 5, name: "Lift Braille & Suara", icon: "liftbraille-bk" },
  { id: 6, name: "Interpreter Isyarat", icon: "interpreterisyarat-bk" },
  { id: 7, name: "Jalur Guiding Block", icon: "jalurguildingblock-bk" },
  { id: 8, name: "Menu Braille", icon: "menubraille-bk" },
];

// Variants for the modal content (slide animation)
const modalVariants = {
  hidden: { y: "100vh", opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.3, ease: "easeOut" },
  },
  exit: {
    y: "100vh",
    opacity: 0,
    transition: { duration: 0.3, ease: "easeIn" },
  },
};

// Variants for the background (fade animation)
const backgroundVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.4, ease: "easeInOut" },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.3, ease: "easeInOut" },
  },
};

// Variants for the dialog content
const dialogVariants = {
  hidden: { scale: 0, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: { duration: 0.2, ease: "easeOut" },
  },
  exit: {
    scale: 0,
    opacity: 0,
    transition: { duration: 0.2, ease: "easeIn" },
  },
};

const PlaceDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const selectedPlace = location.state?.selectedPlace;
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasReviewed, setHasReviewed] = useState(false);
  const [showWarningDialog, setShowWarningDialog] = useState(false);

  // Default fallback jika selectedPlace tidak tersedia
  const placeId = selectedPlace?.id;
  const placeName = selectedPlace?.name || "Universitas Brawijaya";
  const placeAddress =
    selectedPlace?.address ||
    "Jl Veteran No.10-11, Kec. Lowokwaru, Kota Malang";
  const images = selectedPlace?.images || [];
  const facilities = selectedPlace?.facilities || [];

  // State untuk modal gambar full-screen
  const [selectedImage, setSelectedImage] = useState(null);

  // Fetch reviews and check review status
  useEffect(() => {
    const fetchData = async () => {
      if (!placeId) {
        setLoading(false);
        setError("Place ID not provided");
        return;
      }

      try {
        // Fetch reviews
        const reviewsResponse = await api.get(`/places/${placeId}/reviews`);
        setReviews(reviewsResponse.data);

        // Fetch review status
        try {
          const reviewStatusResponse = await api.get(`/places/${placeId}/has-reviewed`);
          setHasReviewed(reviewStatusResponse.data.hasReviewed);
        } catch (err) {
          if (err.response?.status === 401) {
            setHasReviewed(false); // User not authenticated
          } else {
            console.error("Error fetching review status:", err);
          }
        }

        setLoading(false);
      } catch (err) {
        console.error("Error fetching reviews:", err);
        setError("Gagal memuat ulasan. Silakan coba lagi.");
        setLoading(false);
      }
    };

    fetchData();
  }, [placeId]);

  // Fungsi untuk membuka modal gambar
  const handleImageClick = (image) => {
    setSelectedImage(image);
  };

  // Fungsi untuk menutup modal
  const closeModal = () => {
    setSelectedImage(null);
  };

  // Fungsi untuk navigasi ke halaman tambah ulasan
  const navigateToAddReview = () => {
    if (hasReviewed) {
      setShowWarningDialog(true);
    } else {
      navigate("/tambah-review", {
        state: {
          placeId: selectedPlace?.id,
          placeName: placeName,
          placeAddress: placeAddress,
          facilities: facilities,
        },
      });
    }
  };

  // Close warning dialog
  const closeWarningDialog = () => {
    setShowWarningDialog(false);
  };

  // Navigate to all reviews page
  const navigateToAllReviews = () => {
    navigate(`/places/${placeId}/reviews`, {
      state: {
        placeName: placeName,
        placeAddress: placeAddress,
      },
    });
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
  const renderRatingStars = (rating =Stud0) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <div className="text-yellow-500 mb-4 flex">
        {[...Array(fullStars)].map((_, i) => (
          <span key={`full-${i}`} className="text-3xl">
            ★
          </span>
        ))}
        {hasHalfStar && <span className="text-3xl">★</span>}
        {[...Array(emptyStars)].map((_, i) => (
          <span key={`empty-${i}`} className="text-3xl text-gray-300">
            ★
          </span>
        ))}
      </div>
    );
  };

  // Error handling jika selectedPlace tidak ada
  if (!selectedPlace) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500">Data tempat tidak tersedia</p>
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

  // Helper to find facility availability from review
  const getReviewFacilities = (review) => {
    if (
      !review.confirmed_facilities ||
      !Array.isArray(review.confirmed_facilities) ||
      review.confirmed_facilities.length === 0
    ) {
      return [];
    }
    return review.confirmed_facilities.slice(0, 4);
  };

  const accessibilityFeaturesWithStatus = getFacilityStatus();

  // Get at most 2 reviews to display
  const displayedReviews = reviews.slice(0, 2);

  return (
    <div className="pt-20">
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
              alt="Tidak ada gambar tersedia"
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
              <div
                key={image.id}
                onClick={() => handleImageClick(image)}
                className="cursor-pointer"
              >
                <img
                  src={image.image}
                  alt={`Gambar tempat ${index + 1}`}
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
            className="fixed inset-0 bg-[rgba(0,0,0,0.8)] flex items-center justify-center z-50"
            onClick={closeModal}
            variants={backgroundVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <motion.div
              className="relative max-w-4xl w-full h-[90vh] flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <img
                src={selectedImage.image}
                alt="Gambar layar penuh"
                className="max-w-full max-h-full object-contain"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/placeholder_img.png";
                }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Warning Dialog */}
      <AnimatePresence>
        {showWarningDialog && (
          <motion.div
            className="fixed inset-0 bg-[rgba(0,0,0,0.5)] flex items-center justify-center z-50"
            onClick={closeWarningDialog}
            variants={backgroundVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <motion.div
              className="bg-white rounded-lg p-6 max-w-md w-full mx-4"
              variants={dialogVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Peringatan
              </h3>
              <p className="text-gray-600 mb-6">
                Anda sudah memberikan ulasan untuk tempat ini. Setiap pengguna hanya dapat memberikan satu ulasan per tempat.
              </p>
              <div className="flex justify-end gap-4">
                <button
                  className="bg-[#3C91E6] text-white font-semibold px-4 py-2 rounded hover:bg-[#337ac2] cursor-pointer"
                  onClick={closeWarningDialog}
                >
                  Tutup
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-6 px-4">
        <h3 className="font-semibold text-2xl text-center mb-10 mt-15">
          Fasilitas Aksesibilitas
        </h3>
        <div className="flex justify-center">
          <div className="grid grid-cols-2 gap-y-5 gap-x-50 text-sm w-full max-w-2xl mb-20">
            {accessibilityFeaturesWithStatus.map((feature) => (
              <div
                key={feature.id}
                className="flex items-center whitespace-nowrap font-medium text-base"
              >
                <img
                  src={`/icons/${feature.icon}.png`}
                  alt={feature.name}
                  className="w-7 h-7 mr-4"
                  onError={(e) => {
                    console.error(`Failed to load icon ${feature.icon}.png`);
                    e.target.src = "/icons/fallback_icon.png";
                  }}
                />
                <span className="mr-4">{feature.name}</span>
                <div className="ml-auto flex-shrink-0">
                  <img
                    src={`/icons/${
                      feature.available ? "check_rounded" : "false_rounded"
                    }.png`}
                    alt={feature.available ? "Tersedia" : "Tidak Tersedia"}
                    className="w-6 h-6"
                    onError={(e) => {
                      console.error(`Failed to load status icon for ${feature.name}`);
                      e.target.src = "/icons/fallback_icon.png";
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 px-15 mx-4">
        <h3 className="font-semibold text-2xl text-center mb-5">Ulasan</h3>

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3C91E6]"></div>
          </div>
        ) : error ? (
          <div className="text-center text-red-500 py-4">{error}</div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            Belum ada ulasan. Jadilah yang pertama memberikan ulasan!
          </div>
        ) : (
          <div className="border-2 border-[#3C91E6] rounded-lg overflow-hidden">
            {displayedReviews.map((review, index) => (
              <React.Fragment key={review.id || index}>
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-full overflow-hidden">
                      <img
                        src={review.user?.profile_image || "/icons/user.png"}
                        alt={review.user?.name || "Pengguna"}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "/icons/user.png";
                        }}
                      />
                    </div>
                    <span className="text-xl font-semibold text-gray-800">
                      {review.user?.name || "Pengguna"}
                    </span>
                  </div>

                  <div className="pl-[60px]">
                    {renderRatingStars(review.rating)}

                    {getReviewFacilities(review).length > 0 ? (
                      <div className="mb-5 space-y-2">
                        <h4 className="text-sm font-medium text-gray-500 mb-2">
                          Fasilitas yang dikonfirmasi:
                        </h4>
                        {getReviewFacilities(review).map((facility) => (
                          <div
                            key={facility.id}
                            className="flex items-center"
                          >
                            <span className="inline-block w-36 font-light text-black">
                              {facility.name}
                            </span>
                            <img
                              src="/icons/check_rounded.png"
                              alt="Tersedia"
                              className="w-5 h-5"
                              onError={(e) => {
                                console.error(
                                  `Failed to load check icon for facility ${facility.name}`
                                );
                                e.target.src = "/icons/fallback_icon.png";
                              }}
                            />
                          </div>
                        ))}
                      </div>
                    ) : null}

                    <div className="mt-3">
                      <h4 className="text-sm font-medium text-gray-500 mb-2">
                        Ulasan:
                      </h4>
                      <p className="text-xl text-black">
                        {review.comment
                          ? `"${review.comment}"`
                          : "Tidak ada komentar"}
                      </p>
                    </div>
                  </div>
                </div>

                {index < displayedReviews.length - 1 && (
                  <div className="flex justify-center">
                    <div className="w-11/12 h-px bg-gray-400"></div>
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        )}
      </div>

      <div className="mt-5 px-4 flex flex-col items-center gap-6 mb-6">
        {reviews.length > 0 && (
          <button
            className="border border-[#3C91E6] text-black font-semibold px-15 py-2 rounded cursor-pointer hover:bg-[#e0efff]"
            onClick={navigateToAllReviews}
          >
            Lihat Semua Ulasan
          </button>
        )}
        <button
          className="bg-[#3C91E6] text-white font-semibold px-12 py-2 rounded flex items-center gap-2 cursor-pointer hover:bg-[#337ac2]"
          onClick={navigateToAddReview}
        >
          <img src="/icons/add_review.png" alt="Tambah" className="w-6 h-6" />
          Tambahkan Ulasan
        </button>
      </div>
    </div>
  );
};

export default PlaceDetail;