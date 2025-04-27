import React from 'react';

const Popup = ({ selectedPlace, popupPosition, handleClosePopup, handleAddPlace, handleViewDetail }) => {
  const getImageUrl = (place) => {
    if (place.images && place.images.length > 0) {
      return place.images[0].image;
    }
    return '/placeholder_img.png'; 
  };

  const renderRatingStars = (rating = 0) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <div className="flex items-center">
        <div className="flex text-xl">
          {/* Bintang penuh */}
          {[...Array(fullStars)].map((_, i) => (
            <span key={`full-${i}`} className="text-yellow-400">★</span>
          ))}
          
          {/* Bintang setengah */}
          {hasHalfStar && (
            <span key="half" className="text-yellow-400">★</span>
          )}
          
          {/* Bintang kosong */}
          {[...Array(emptyStars)].map((_, i) => (
            <span key={`empty-${i}`} className="text-gray-300">★</span>
          ))}
        </div>
        <span className="text-sm ml-2 text-gray-700 font-medium">
          {rating.toFixed(1)}
        </span>
      </div>
    );
  };

  return (
    <div
      className="absolute z-[1000] bg-white rounded-2xl shadow-lg overflow-hidden"
      style={{
        left: `${popupPosition.pixel.x + 30}px`, 
        top: `${popupPosition.pixel.y - 20}px`,  
        width: '250px',
        maxWidth: '90vw',
        transform: 'translateY(-50%)',
      }}
    >
      <button
        className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 z-10"
        onClick={handleClosePopup}
        style={{ fontSize: '30px', width: '20px', height: '20px', lineHeight: '18px', cursor: 'pointer' }}
      >
        ×
      </button>

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
                  e.target.src = '/placeholder_img.png'; 
                }}
              />
            </div>
          )}
          
          <div className="p-4">
            <h3 className="text-xl font-semibold text-blue-500 mb-2">{selectedPlace.name}</h3>
            
            {renderRatingStars(selectedPlace.average_rating || 0)}
            
            <div className="mt-4 space-y-2">
              {selectedPlace.facilities && selectedPlace.facilities.map(facility => (
                <div key={facility.id} className="flex items-center">
                  <span className="text-green-500 mr-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6L9 17l-5-5"></path>
                    </svg>
                  </span>
                  <span>{facility.name}</span>
                </div>
              ))}
            </div>
            
            <div className="mt-4 text-center">
              <button
                onClick={handleViewDetail}
                className="text-blue-500 font-medium"
              >
                Lihat Detail
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-6">
          <p className="font-semibold m-0 text-lg">Tempat ini belum ada di EasyGo</p>
          <p className="text-sm mt-1 mb-3 font-bold">Ingin menambahkannya?</p>
          <button
            onClick={handleAddPlace}
            className="text-sm text-[#3C91E6] block mx-auto mt-6"
            style={{ cursor: 'pointer' }}
          >
            <span className="text-black font-normal">+</span>{' '}
            <span className="underline font-bold">Tambah Tempat</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default Popup;