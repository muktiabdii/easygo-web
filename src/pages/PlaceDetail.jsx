import React, { useState, useEffect, forwardRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { motion, AnimatePresence } from "framer-motion";
import NavbarBack from "../components/NavbarBack";
import ConfirmDialog from "../components/ConfirmDialog"; // Impor ConfirmDialog
import api, { isAuthenticated } from "../utils/authUtils";

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

// Variants for carousel modal (slide + fade)
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

// Variants for review image modal (fade only)
const fadeModalVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3, ease: "easeInOut" } },
  exit: { opacity: 0, transition: { duration: 0.3, ease: "easeInOut" } },
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
  const [showLoginDialog, setShowLoginDialog] = useState(false); // State untuk login dialog
  const [selectedImage, setSelectedImage] = useState(null); // For carousel images
  const [selectedReviewImage, setSelectedReviewImage] = useState(null); // For review images

  // Default fallback jika selectedPlace tidak tersedia
  const placeId = selectedPlace?.id;
  const placeName = selectedPlace?.name || "Nama tempat tidak tersedia";
  const placeAddress = selectedPlace?.address || "Alamat tempat tidak tersedia";
  const images = selectedPlace?.images || [];
  const facilities = selectedPlace?.facilities || [];

  // Fetch reviews and check review status
  useEffect(() => {
    const fetchData = async () => {
      if (!placeId) {
        setLoading(false);
        setError("Place ID not provided");
        return;
      }

      try {
        const reviewsResponse = await api.get(`/places/${placeId}/reviews`);
        setReviews(reviewsResponse.data);

        if (isAuthenticated()) {
          try {
            const reviewStatusResponse = await api.get(
              `/places/${placeId}/has-reviewed`
            );
            setHasReviewed(reviewStatusResponse.data.hasReviewed);
          } catch (err) {
            if (err.response?.status === 401) {
              setHasReviewed(false);
            } else {
              console.error("Error fetching review status:", err);
            }
          }
        } else {
          setHasReviewed(false);
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

  // Fungsi untuk membuka modal gambar (carousel)
  const handleImageClick = (image) => {
    setSelectedImage(image);
  };

  // Fungsi untuk membuka modal gambar ulasan
  const handleReviewImageClick = (image) => {
    setSelectedReviewImage(image);
  };

  // Fungsi untuk menutup modal
  const closeModal = () => {
    setSelectedImage(null);
    setSelectedReviewImage(null);
  };

  // Fungsi untuk navigasi ke halaman tambah ulasan
  const navigateToAddReview = () => {
    if (!isAuthenticated()) {
      setShowLoginDialog(true); // Tampilkan ConfirmDialog untuk login
    } else if (hasReviewed) {
      setShowWarningDialog(true); // Tampilkan dialog peringatan jika sudah review
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

  // Handle login confirmation
  const handleLoginConfirm = () => {
    setShowLoginDialog(false);
    navigate("/login", {
      state: {
        from: location.pathname,
        placeId: selectedPlace?.id,
        placeName,
        placeAddress,
        facilities,
      },
    });
  };

  // Close login dialog
  const closeLoginDialog = () => {
    setShowLoginDialog(false);
  };

  // Navigate to all reviews page
  const navigateToAllReviews = () => {
    navigate("/reviews", {
      state: {
        placeName: placeName,
        placeAddress: placeAddress,
        facilities: facilities,
        reviews: reviews,
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

  // Fungsi untuk menentukan status ketersediaan fasilitas
  const getFacilityStatus = () => {
    const facilityCounts = allAccessibilityFeatures.reduce((acc, feature) => {
      acc[feature.id] = {
        name: feature.name,
        icon: feature.icon,
        count: 0,
      };
      return acc;
    }, {});

    const totalContributors = 1 + reviews.length;

    facilities.forEach((facility) => {
      const feature = allAccessibilityFeatures.find(
        (f) => f.name === facility.name
      );
      if (feature) {
        facilityCounts[feature.id].count += 1;
      }
    });

    reviews.forEach((review) => {
      if (
        review.confirmed_facilities &&
        Array.isArray(review.confirmed_facilities)
      ) {
        review.confirmed_facilities.forEach((facility) => {
          const feature = allAccessibilityFeatures.find(
            (f) => f.name === facility.name
          );
          if (feature) {
            facilityCounts[feature.id].count += 1;
          }
        });
      }
    });

    return allAccessibilityFeatures.map((feature) => {
      const countData = facilityCounts[feature.id];
      const confirmationPercentage =
        totalContributors > 0 ? countData.count / totalContributors : 0;
      const available =
        totalContributors <= 3
          ? countData.count > 0
          : confirmationPercentage >= 0.5;
      return {
        ...feature,
        available,
        confirmationCount: countData.count,
        totalContributors,
        confirmationPercentage: (confirmationPercentage * 100).toFixed(1),
      };
    });
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

  // Helper to get review images
  const getReviewImages = (review) => {
    if (
      !review.images ||
      !Array.isArray(review.images) ||
      review.images.length === 0
    ) {
      return [];
    }
    return review.images;
  };

  const accessibilityFeaturesWithStatus = getFacilityStatus();
  const displayedReviews = reviews.slice(0, 2);

  return (
    <div className="pt-20">
      <NavbarBack title={placeName} />
      
      {/* Title Section - Responsive */}
      <div className="text-center mt-6 sm:mt-10 px-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-[#3C91E6] break-words">
          {placeName}
        </h2>
        <p className="text-lg sm:text-xl text-black mt-2 mb-6 sm:mb-10 break-words">
          {placeAddress}
        </p>
      </div>

      {/* Carousel Section - Responsive */}
      <div className="mt-4 mx-4 sm:mx-8 lg:mx-20 bg-gray-100 rounded-[20px] overflow-hidden">
        {images.length === 0 ? (
          <div className="h-[200px] sm:h-[250px] lg:h-[300px] flex items-center justify-center">
            <img
              src="/placeholder_img.png"
              alt="Tidak ada gambar tersedia"
              className="object-cover h-full w-full"
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
                  className="object-cover h-[200px] sm:h-[300px] lg:h-[450px] w-full"
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

      {/* Modal Gambar Full-screen (Carousel) */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            className="fixed inset-0 bg-[rgba(0,0,0,0.8)] flex items-center justify-center z-50 p-4"
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

      {/* Modal Gambar Ulasan */}
      <AnimatePresence>
        {selectedReviewImage && (
          <motion.div
            className="fixed inset-0 bg-[rgba(0,0,0,0.8)] flex items-center justify-center z-50 p-4"
            onClick={closeModal}
            variants={backgroundVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <motion.div
              className="relative max-w-4xl w-full h-[90vh] flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
              variants={fadeModalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <img
                src={selectedReviewImage.image_url}
                alt="Preview ulasan"
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

      {/* Warning Dialog for Already Reviewed */}
      <AnimatePresence>
        {showWarningDialog && (
          <motion.div
            className="fixed inset-0 bg-[rgba(0,0,0,0.5)] flex items-center justify-center z-50 p-4"
            onClick={closeWarningDialog}
            variants={backgroundVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <motion.div
              className="bg-white rounded-lg p-4 sm:p-6 max-w-md w-full mx-4"
              variants={dialogVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">
                Peringatan
              </h3>
              <p className="text-sm sm:text-base text-gray-600 mb-6">
                Anda sudah memberikan ulasan untuk tempat ini. Setiap pengguna
                hanya dapat memberikan satu ulasan per tempat.
              </p>
              <div className="flex justify-end gap-4">
                <button
                  className="bg-[#3C91E6] text-white font-semibold px-4 py-2 rounded hover:bg-[#337ac2] cursor-pointer text-sm sm:text-base"
                  onClick={closeWarningDialog}
                >
                  Tutup
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Login Dialog using ConfirmDialog */}
      {showLoginDialog && (
        <ConfirmDialog
          isOpen={showLoginDialog}
          onConfirm={handleLoginConfirm}
          onCancel={closeLoginDialog}
          message="Anda perlu login untuk menambahkan ulasan. Silakan login terlebih dahulu."
          confirmLabel="Login"
          cancelLabel="Batal"
          confirmColor="text-[#3C91E6]"
          cancelColor="text-red-500"
        />
      )}

      {/* Accessibility Features Section - Responsive */}
      <div className="mt-6 px-4">
        <h3 className="font-semibold text-xl sm:text-2xl text-center mb-6 sm:mb-10 mt-8 sm:mt-15">
          Fasilitas Aksesibilitas
        </h3>
        <div className="flex justify-center">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 sm:gap-y-5 gap-x-4 sm:gap-x-8 lg:gap-x-50 text-sm w-full max-w-4xl mb-12 sm:mb-20">
            {accessibilityFeaturesWithStatus.map((feature) => (
              <div
                key={feature.id}
                className="flex items-center font-medium text-sm sm:text-base p-2 sm:p-0"
              >
                <img
                  src={`/icons/${feature.icon}.png`}
                  alt={feature.name}
                  className="w-6 h-6 sm:w-7 sm:h-7 mr-3 sm:mr-4 flex-shrink-0"
                  onError={(e) => {
                    console.error(`Failed to load icon ${feature.icon}.png`);
                    e.target.src = "/icons/fallback_icon.png";
                  }}
                />
                <span className="mr-3 sm:mr-4 flex-1 min-w-0">{feature.name}</span>
                <div className="flex-shrink-0">
                  <img
                    src={`/icons/${
                      feature.available ? "check_rounded" : "false_rounded"
                    }.png`}
                    alt={feature.available ? "Tersedia" : "Tidak Tersedia"}
                    className="w-5 h-5 sm:w-6 sm:h-6"
                    onError={(e) => {
                      console.error(
                        `Failed to load status icon for ${feature.name}`
                      );
                      e.target.src = "/icons/fallback_icon.png";
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reviews Section - Responsive */}
      <div className="mt-6 px-4">
        <h3 className="font-semibold text-xl sm:text-2xl text-center mb-5">Ulasan</h3>

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3C91E6]"></div>
          </div>
        ) : error ? (
          <div className="text-center text-red-500 py-4 text-sm sm:text-base">{error}</div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-8 text-gray-500 text-sm sm:text-base px-4">
            Belum ada ulasan. Jadilah yang pertama memberikan ulasan!
          </div>
        ) : (
          <div className="max-w-6xl mx-auto border-[#3C91E6] border-2 rounded-2xl p-2 sm:p-4">
            {displayedReviews.map((review, index) => (
              <React.Fragment key={review.id || index}>
                <div className="flex gap-2 sm:gap-4 py-4 sm:py-6">
                  {/* Icon User */}
                  <div className="w-12 sm:w-16 flex-shrink-0 flex justify-center items-start pt-2 ml-2 sm:ml-4">
                    <img
                      src={review.user?.profile_image || "/icons/user.png"}
                      alt={review.user?.name || "Pengguna"}
                      className="w-10 h-10 sm:w-[52px] sm:h-[52px] rounded-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/icons/user.png";
                      }}
                    />
                  </div>

                  {/* Isi Review */}
                  <div className="flex-1 pl-2 sm:pl-4 space-y-3 sm:space-y-4 pr-2 sm:pr-4">
                    {/* Nama & Rating */}
                    <div>
                      <p className="font-semibold text-gray-800 text-lg sm:text-xl break-words">
                        {review.user?.name || "Pengguna"}
                      </p>
                      <div className="text-yellow-500 text-2xl sm:text-3xl">
                        {Array(Math.floor(review.rating))
                          .fill("★")
                          .map((star, i) => (
                            <span key={i} className="mr-1 sm:mr-2">
                              {star}
                            </span>
                          ))}
                      </div>
                    </div>

                    {/* Fasilitas */}
                    {getReviewFacilities(review).length > 0 && (
                      <div>
                        <ul className="text-sm sm:text-base text-gray-700 space-y-2">
                          {getReviewFacilities(review).map((facility, i) => (
                            <li key={facility.id} className="flex items-center">
                              <div className="w-30 sm:w-32 mr-2 flex-shrink-0">
                                <span className="text-xs sm:text-sm break-words">{facility.name}</span>
                              </div>
                              <img
                                src="/icons/check_rounded_bk.png"
                                alt="Tersedia"
                                className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = "/icons/fallback_icon.png";
                                }}
                              />
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Komentar */}
                    <div className="mt-3">
                      <h4 className="text-xs sm:text-sm font-medium text-gray-500 mb-2">
                        Ulasan:
                      </h4>
                      <p className="text-base sm:text-xl text-black break-words">
                        {review.comment
                          ? `${review.comment}`
                          : "Tidak ada komentar"}
                      </p>
                    </div>

                    {/* Foto-foto Ulasan */}
                    {getReviewImages(review).length > 0 && (
                      <div className="mt-4">
                        <h4 className="text-xs sm:text-sm font-medium text-gray-500 mb-2">
                          Foto:
                        </h4>
                        <div className="flex flex-wrap gap-2 sm:gap-3">
                          {getReviewImages(review).map((image, imgIndex) => (
                            <div
                              key={image.id || imgIndex}
                              className="cursor-pointer rounded-lg overflow-hidden"
                              onClick={() => handleReviewImageClick(image)}
                            >
                              <img
                                src={image.image_url}
                                alt={`Foto ulasan ${imgIndex + 1}`}
                                className="h-20 w-20 sm:h-28 sm:w-28 object-cover rounded-lg hover:opacity-90 transition-opacity"
                                loading="lazy"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = "/placeholder_img.png";
                                }}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Divider antara review */}
                {index < displayedReviews.length - 1 && (
                  <div className="flex justify-center">
                    <div className="w-11/12 h-px bg-[#3C91E6]"></div>
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        )}
      </div>

      {/* Action Buttons - Responsive */}
      <div className="mt-5 px-4 flex flex-col items-center gap-4 sm:gap-6 mb-6 pb-4">
        {reviews.length > 0 && (
          <button
            className="border border-[#3C91E6] text-black font-semibold px-6 sm:px-15 py-2 rounded cursor-pointer hover:bg-[#e0efff] text-sm sm:text-base w-full max-w-xs sm:w-auto"
            onClick={navigateToAllReviews}
          >
            Lihat Semua Ulasan
          </button>
        )}
        <button
          className="bg-[#3C91E6] text-white font-semibold px-6 sm:px-12 py-2 rounded flex items-center justify-center gap-2 cursor-pointer hover:bg-[#337ac2] text-sm sm:text-base w-full max-w-xs sm:w-auto"
          onClick={navigateToAddReview}
        >
          <img src="/icons/add_review.png" alt="Tambah" className="w-5 h-5 sm:w-6 sm:h-6" />
          Tambahkan Ulasan
        </button>
      </div>
    </div>
  );
};

export default PlaceDetail;