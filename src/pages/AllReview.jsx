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
    const maxVisiblePages = 7;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      let startPage = Math.max(1, currentPage - 3);
      let endPage = Math.min(totalPages, currentPage + 3);

      if (endPage - startPage < maxVisiblePages - 1) {
        if (currentPage <= 4) {
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
      <div className="flex justify-center items-center gap-2 mt-14 text-m text-gray-700">
        <button
          className="px-2 py-1 hover:text-blue-600"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          {"<"}
        </button>
        {pageNumbers.map((num) => (
          <button
            key={num}
            className={`px-3 py-1 rounded ${
              num === currentPage
                ? "bg-blue-100 text-blue-600 font-bold"
                : "hover:text-blue-600"
            }`}
            onClick={() => handlePageChange(num)}
          >
            {num}
          </button>
        ))}
        {totalPages > maxVisiblePages && currentPage < totalPages - 3 && (
          <span>...</span>
        )}
        {totalPages > maxVisiblePages && (
          <button
            className="px-3 py-1 hover:text-blue-600"
            onClick={() => handlePageChange(totalPages)}
          >
            {totalPages}
          </button>
        )}
        <button
          className="px-2 py-1 hover:text-blue-600"
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

      <div className="min-h-screen bg-white py-10 px-4">
        <h2 className="text-4xl font-bold text-center text-[#3C91E6] mt-18 mb-12">
          Ulasan
        </h2>

        {/* Header Ulasan */}
        <div className="max-w-6xl mx-auto mb-8 relative">
          {/* Gray container for university name and address */}
          <div className="bg-[#EFF0F7] rounded-2xl pt-6 px-6 pb-24">
            <h3 className="text-[26px] font-bold text-gray-800">{placeName}</h3>
            <p className="text-l text-black mb-2">{placeAddress}</p>
          </div>

          {/* White container for ratings */}
          <div className="w-6xl ml-0 bg-white border border-[#3C91E6] rounded-2xl p-4 mt-[-80px] mx-4 flex flex-col md:flex-row justify-between gap-x-2">
            {/* Rating Kiri */}
            <div className="flex-1 ml-2 mb-4">
              <div className="flex items-center">
                <span className="text-yellow-500 text-5xl mr-2">★</span>
                <span className="text-3xl font-bold">{averageRating}</span>
                <span className="text-gray-700 text-base font-normal ml-1">
                  / 5.0
                </span>
              </div>
              <p className="text-base text-black mt-3 font-semibold">
                {parseFloat(
                  statistik.find((s) => s.bintang === 5)?.persentase || 0
                ).toFixed(1)}
                % orang merasa puas
              </p>
              <p className="text-base text-black mt-1">
                {reviews.length} rating • {reviews.length} ulasan
              </p>
            </div>

            {/* Statistik Bintang */}
            <div className="flex-2 grid grid-cols-2 gap-x-1 text-m text-black mb-2">
              <div className="flex flex-col gap-2">
                {statistik.slice(0, 3).map((item) => (
                  <div key={item.bintang} className="flex items-center gap-1">
                    <span className="text-yellow-500 text-3xl">★</span>
                    <span>
                      {item.bintang}: {item.jumlah} ulasan ({item.persentase})
                    </span>
                  </div>
                ))}
              </div>
              <div className="flex flex-col gap-2">
                {statistik.slice(3).map((item) => (
                  <div key={item.bintang} className="flex items-center gap-1">
                    <span className="text-yellow-500 text-3xl">★</span>
                    <span>
                      {item.bintang}: {item.jumlah} ulasan ({item.persentase})
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Daftar Ulasan */}
        <div className="max-w-6xl mx-auto border-[#3C91E6] border-2 rounded-2xl p-4">
          {currentReviews.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Belum ada ulasan untuk tempat ini.
            </div>
          ) : (
            currentReviews.map((item, idx) => (
              <div key={item.id || idx}>
                {idx !== 0 && <hr className="my-4 border-[#3C91E6]" />}
                <div className="flex gap-2 py-6">
                  {/* Icon User */}
                  <div className="w-16 flex-shrink-0 flex justify-center items-start pt-2 ml-4">
                    <img
                      src={item.user?.profile_image || "/icons/user.png"}
                      alt={item.user?.name || "Pengguna"}
                      className="w-13 h-13 rounded-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/icons/user.png";
                      }}
                    />
                  </div>

                  {/* Isi Review */}
                  <div className="flex-1 pl-4 space-y-4">
                    {/* Nama & Rating */}
                    <div>
                      <p className="font-semibold text-gray-800 text-xl">
                        {item.user?.name || "Pengguna"}
                      </p>
                      <div className="text-yellow-500 text-3xl">
                        {Array(Math.floor(item.rating))
                          .fill("★")
                          .map((star, i) => (
                            <span key={i} className="mr-2">
                              {star}
                            </span>
                          ))}
                      </div>
                    </div>

                    {/* Fasilitas */}
                    {getReviewFacilities(item).length > 0 && (
                      <div>
                        <ul className="text-base text-gray-700 space-y-2">
                          {getReviewFacilities(item).map((fasilitas, i) => (
                            <li key={i} className="flex items-center">
                              <div style={{ width: "125px" }} className="mr-2">
                                <span>{fasilitas.name}</span>
                              </div>
                              <img
                                src="/icons/check_rounded_bk.png"
                                alt="Centang"
                                className="w-5 h-5"
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
                      <h4 className="text-sm font-medium text-gray-500 mb-2">
                        Ulasan:
                      </h4>
                      <p className="text-xl text-black">
                        {item.comment
                          ? `${item.comment}`
                          : "Tidak ada komentar"}
                      </p>
                    </div>

                    {/* Foto-foto Ulasan */}
                    {getReviewImages(item).length > 0 && (
                      <div className="mt-4">
                        <div className="flex flex-wrap gap-3">
                          {getReviewImages(item).map((image, imgIndex) => (
                            <div
                              key={image.id || imgIndex}
                              className="cursor-pointer rounded-lg overflow-hidden"
                              onClick={() => handleReviewImageClick(image)}
                            >
                              <img
                                src={image.image_url}
                                alt={`Foto ulasan ${imgIndex + 1}`}
                                className="h-28 w-28 object-cover rounded-lg hover:opacity-90 transition-opacity"
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

        {/* Pagination */}
        {reviews.length > 0 && renderPagination()}
      </div>
    </div>
  );
};

export default AllReview;