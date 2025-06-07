import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import NavbarBack from "../components/NavbarBack";

// Animation variants (fade only)
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

const AllReview = () => {
  const location = useLocation();
  const { state } = location;

  // Extract data from state, with fallbacks
  const placeName = state?.placeName || "Nama tempat tidak tersedia";
  const placeAddress =
    state?.placeAddress || "Alamat tempat tidak tersedia";
  const reviews = state?.reviews || [];
  const facilities = state?.facilities || [];

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 4;
  const [selectedReviewImage, setSelectedReviewImage] = useState(null);

  // Calculate statistics dynamically
  const calculateStatistics = () => {
    const totalReviews = reviews.length;
    const ratingCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };

    reviews.forEach((review) => {
      if (review.rating >= 1 && review.rating <= 5) {
        ratingCounts[Math.floor(review.rating)] += 1;
      }
    });

    return Object.entries(ratingCounts)
      .map(([bintang, jumlah]) => ({
        bintang: parseInt(bintang),
        jumlah,
        persentase:
          totalReviews > 0
            ? ((jumlah / totalReviews) * 100).toFixed(1) + "%"
            : "0%",
      }))
      .sort((a, b) => b.bintang - a.bintang);
  };

  const statistik = calculateStatistics();

  // Calculate average rating
  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce((sum, review) => sum + review.rating, 0) /
          reviews.length
        ).toFixed(1)
      : "0.0";

  // Pagination logic
  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = reviews.slice(indexOfFirstReview, indexOfLastReview);
  const totalPages = Math.ceil(reviews.length / reviewsPerPage);

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Generate pagination buttons
  const renderPagination = () => {
    const pageNumbers = [];
    const maxVisiblePages = window.innerWidth < 768 ? 5 : 7; // Reduce visible pages on mobile

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
      let endPage = Math.min(totalPages, currentPage + Math.floor(maxVisiblePages / 2));

      if (endPage - startPage < maxVisiblePages - 1) {
        if (currentPage <= Math.floor(maxVisiblePages / 2)) {
          endPage = maxVisiblePages;
        } else {
          startPage = totalPages - maxVisiblePages + 1;
        }
      }

      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }
    }

    return (
      <div className="flex justify-center items-center gap-1 sm:gap-2 mt-8 sm:mt-14 text-sm sm:text-base text-gray-700">
        <button
          className="px-2 py-1 sm:px-3 sm:py-2 hover:text-blue-600 disabled:opacity-50"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          {"<"}
        </button>
        {pageNumbers.map((num) => (
          <button
            key={num}
            className={`px-2 py-1 sm:px-3 sm:py-2 rounded text-sm sm:text-base ${
              num === currentPage
                ? "bg-blue-100 text-blue-600 font-bold"
                : "hover:text-blue-600"
            }`}
            onClick={() => handlePageChange(num)}
          >
            {num}
          </button>
        ))}
        {totalPages > maxVisiblePages && currentPage < totalPages - 2 && (
          <span className="px-1">...</span>
        )}
        {totalPages > maxVisiblePages && currentPage < totalPages - Math.floor(maxVisiblePages / 2) && (
          <button
            className="px-2 py-1 sm:px-3 sm:py-2 hover:text-blue-600 text-sm sm:text-base"
            onClick={() => handlePageChange(totalPages)}
          >
            {totalPages}
          </button>
        )}
        <button
          className="px-2 py-1 sm:px-3 sm:py-2 hover:text-blue-600 disabled:opacity-50"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          {">"}
        </button>
      </div>
    );
  };

  // Helper to get confirmed facilities from review
  const getReviewFacilities = (review) => {
    return review.confirmed_facilities?.slice(0, 4) || [];
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

  // Handle review image click
  const handleReviewImageClick = (image) => {
    setSelectedReviewImage(image);
  };

  // Close modal
  const closeModal = () => {
    setSelectedReviewImage(null);
  };

  return (
    <div>
      <NavbarBack title={placeName} showAvatar={false} />

      <div className="min-h-screen bg-white py-6 sm:py-10 px-4">
        <h2 className="text-2xl sm:text-4xl font-bold text-center text-[#3C91E6] mt-12 sm:mt-18 mb-8 sm:mb-12">
          Ulasan
        </h2>

        {/* Header Ulasan */}
        <div className="max-w-6xl mx-auto mb-6 sm:mb-8 relative">
          {/* Gray container name and address */}
          <div className="bg-[#EFF0F7] rounded-2xl pt-4 sm:pt-6 px-4 sm:px-6 pb-16 sm:pb-24">
            <h3 className="text-lg sm:text-[26px] font-bold text-gray-800 leading-tight">
              {placeName}
            </h3>
            <p className="text-sm sm:text-base text-black mb-2 mt-2">
              {placeAddress}
            </p>
          </div>

          {/* White container for ratings */}
          <div className="bg-white border border-[#3C91E6] rounded-2xl p-3 sm:p-4 mt-[-60px] sm:mt-[-80px]">
            <div className="flex flex-col lg:flex-row justify-between gap-4 lg:gap-x-2">
              {/* Rating Kiri */}
              <div className="flex-1 mb-4 lg:mb-0">
                <div className="flex items-center justify-center lg:justify-start">
                  <span className="text-yellow-500 text-3xl sm:text-5xl mr-2">★</span>
                  <span className="text-2xl sm:text-3xl font-bold">{averageRating}</span>
                  <span className="text-gray-700 text-sm sm:text-base font-normal ml-1">
                    / 5.0
                  </span>
                </div>
                <div className="text-center lg:text-left mt-2 sm:mt-3">
                  <p className="text-sm sm:text-base text-black font-semibold">
                    {parseFloat(
                      statistik.find((s) => s.bintang === 5)?.persentase || 0
                    ).toFixed(1)}
                    % orang merasa puas
                  </p>
                  <p className="text-sm sm:text-base text-black mt-1">
                    {reviews.length} rating • {reviews.length} ulasan
                  </p>
                </div>
              </div>

              {/* Statistik Bintang */}
              <div className="flex-1 lg:flex-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm text-black">
                  {/* Mobile: Show all stats in single column, Desktop: Split into 2 columns */}
                  <div className="flex flex-col gap-2 sm:gap-1">
                    {statistik.slice(0, window.innerWidth < 640 ? 5 : 3).map((item) => (
                      <div key={item.bintang} className="flex items-center gap-1 justify-center sm:justify-start">
                        <span className="text-yellow-500 text-lg sm:text-2xl">★</span>
                        <span className="text-xs sm:text-sm">
                          {item.bintang}: {item.jumlah} ulasan ({item.persentase})
                        </span>
                      </div>
                    ))}
                  </div>
                  {/* Only show second column on desktop */}
                  <div className="hidden sm:flex flex-col gap-1">
                    {statistik.slice(3).map((item) => (
                      <div key={item.bintang} className="flex items-center gap-1">
                        <span className="text-yellow-500 text-2xl">★</span>
                        <span className="text-sm">
                          {item.bintang}: {item.jumlah} ulasan ({item.persentase})
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Daftar Ulasan */}
        <div className="max-w-6xl mx-auto border-[#3C91E6] border-2 rounded-2xl p-3 sm:p-4">
          {currentReviews.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Belum ada ulasan untuk tempat ini.
            </div>
          ) : (
            currentReviews.map((item, idx) => (
              <div key={item.id || idx}>
                {idx !== 0 && <hr className="my-3 sm:my-4 border-[#3C91E6]" />}
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 py-4 sm:py-6">
                  {/* Icon User */}
                  <div className="flex sm:block justify-center sm:justify-start">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 flex-shrink-0 flex justify-center items-center">
                      <img
                        src={item.user?.profile_image || "/icons/user.png"}
                        alt={item.user?.name || "Pengguna"}
                        className="w-12 h-12 sm:w-13 sm:h-13 rounded-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "/icons/user.png";
                        }}
                      />
                    </div>
                  </div>

                  {/* Isi Review */}
                  <div className="flex-1 space-y-3 sm:space-y-4">
                    {/* Nama & Rating */}
                    <div className="text-center sm:text-left">
                      <p className="font-semibold text-gray-800 text-lg sm:text-xl">
                        {item.user?.name || "Pengguna"}
                      </p>
                      <div className="text-yellow-500 text-2xl sm:text-3xl mt-1 flex justify-center sm:justify-start">
                        {Array(Math.floor(item.rating))
                          .fill("★")
                          .map((star, i) => (
                            <span key={i} className="mr-1 sm:mr-2">
                              {star}
                            </span>
                          ))}
                      </div>
                    </div>

                    {/* Fasilitas */}
                    {getReviewFacilities(item).length > 0 && (
                      <div>
                        <ul className="text-sm sm:text-base text-gray-700 space-y-2">
                          {getReviewFacilities(item).map((fasilitas, i) => (
                            <li key={i} className="flex items-center justify-center sm:justify-start">
                              <div className="w-30 sm:w-32 mr-2 text-center sm:text-left">
                                <span className="text-xs sm:text-sm">{fasilitas.name}</span>
                              </div>
                              <img
                                src="/icons/check_rounded_bk.png"
                                alt="Centang"
                                className="w-4 h-4 sm:w-5 sm:h-5"
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
                      <h4 className="text-xs sm:text-sm font-medium text-gray-500 mb-2 text-center sm:text-left">
                        Ulasan:
                      </h4>
                      <p className="text-base sm:text-xl text-black text-center sm:text-left leading-relaxed">
                        {item.comment
                          ? `${item.comment}`
                          : "Tidak ada komentar"}
                      </p>
                    </div>

                    {/* Foto-foto Ulasan */}
                    {getReviewImages(item).length > 0 && (
                      <div className="mt-4">
                        <div className="flex flex-wrap gap-2 sm:gap-3 justify-center sm:justify-start">
                          {getReviewImages(item).map((image, imgIndex) => (
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
              </div>
            ))
          )}
        </div>

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
                className="relative max-w-4xl w-full h-full max-h-[90vh] flex items-center justify-center"
                onClick={(e) => e.stopPropagation()}
                variants={fadeModalVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <img
                  src={selectedReviewImage.image_url}
                  alt="Preview ulasan"
                  className="max-w-full max-h-full object-contain rounded-lg"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/placeholder_img.png";
                  }}
                />
                {/* Close button for mobile */}
                <button
                  onClick={closeModal}
                  className="absolute top-4 right-4 bg-black bg-opacity-50 text-white rounded-full w-8 h-8 flex items-center justify-center sm:hidden"
                >
                  ×
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pagination */}
        {reviews.length > 0 && renderPagination()}
      </div>
    </div>
  );
};

export default AllReview;