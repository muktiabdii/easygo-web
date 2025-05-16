import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const Popup = ({
  selectedPlace,
  popupPosition,
  handleClosePopup,
  handleAddPlace,
  handleViewDetail,
}) => {
  const popupRef = useRef(null);
  const navigate = useNavigate(); // Add navigate hook

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        handleClosePopup();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleClosePopup]);

  const getImageUrl = (place) => {
    if (place.images && place.images.length > 0) {
      return place.images[0].image;
    }
    return "/placeholder_img.png";
  };

  const renderRatingStars = (rating = 0) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <div className="flex items-center">
        <div className="flex text-xl">
          {[...Array(fullStars)].map((_, i) => (
            <span key={`full-${i}`} className="text-yellow-400">
              ★
            </span>
          ))}
          {hasHalfStar && (
            <span key="half" className="text-yellow-400">
              ★
            </span>
          )}
          {[...Array(emptyStars)].map((_, i) => (
            <span key={`empty-${i}`} className="text-gray-300">
              ★
            </span>
          ))}
        </div>
        <span className="text-sm ml-2 text-gray-700 font-medium">
          {rating.toFixed(1)}
        </span>
      </div>
    );
  };

  // Modified handleViewDetail to pass selectedPlace
  const onViewDetail = (e) => {
    e.stopPropagation();
    if (selectedPlace) {
      navigate("/place-detail", {
        state: { selectedPlace }, // Pass the entire selectedPlace object
      });
    }
  };

  return (
    <div
      ref={popupRef}
      className="absolute z-[1000] bg-white rounded-2xl shadow-lg overflow-hidden"
      style={{
        left: `${popupPosition.pixel.x + 30}px`,
        top: `${popupPosition.pixel.y - 20}px`,
        width: "250px",
        maxWidth: "90vw",
        transform: "translateY(-50%)",
      }}
    >
      {selectedPlace ? (
        <div>
          {selectedPlace.images && selectedPlace.images.length > 0 && (
            <div className="w-full h-40 overflow-hidden">
              <img
                src={getImageUrl(selectedPlace)}
                alt={selectedPlace.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/placeholder_img.png";
                }}
              />
            </div>
          )}

          <div className="p-4">
            <h3 className="text-xl font-semibold text-[#3C91E6] text--500 mb-2">
              {selectedPlace.name}
            </h3>

            {renderRatingStars(selectedPlace.average_rating || 0)}

            <div className="mt-4 space-y-2">
              {selectedPlace.facilities &&
                selectedPlace.facilities.map((facility) => (
                  <div key={facility.id} className="flex items-center">
                    <span className="mr-2">
                      <img
                        src="icons/check_ic.png"
                        alt="Check Icon"
                        width="14"
                        height="11"
                      />
                    </span>
                    <span className="font-medium text-[14px]">{facility.name}</span>
                  </div>
                ))}
            </div>

            <div className="mt-4 text-center">
              <button
                onClick={onViewDetail} // Use the new handler
                className="text-[#3C91E6] font-medium text-[14px] underline cursor-pointer hover:text-blue-700"
              >
                Lihat Detail
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-6">
          <p className="font-semibold m-0 text-lg">
            Tempat ini belum ada di EasyGo
          </p>
          <p className="text-sm mt-1 mb-3 font-bold">Ingin menambahkannya?</p>
          <button
            onClick={handleAddPlace}
            className="text-sm text-[#3C91E6] block mx-auto mt-6"
            style={{ cursor: "pointer" }}
          >
            <span className="text-black font-normal">+</span>{" "}
            <span className="underline font-bold hover:text-blue-600">Tambah Tempat</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default Popup;