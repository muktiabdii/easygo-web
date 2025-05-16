import React from "react";

const Review = ({
  review,
  onReviewChange,
  onClear,
  images = [],
  onRemoveImage,
  totalImages = 0,
  showImagePreviews = false,
}) => {
  return (
    <div className="mb-6">
      <h2 className="text-2xl font-bold text-center mb-4 mt-8">
        Berikan Ulasan Anda!
      </h2>
      <div className="relative">
        <textarea
          name="ulasan"
          placeholder="Tuliskan Ulasan Anda di Sini..."
          value={review}
          onChange={onReviewChange}
          className="border-2 border-[#3C91E6] rounded-lg p-3 w-full h-80 resize-none focus:outline-none focus:border-3"
        ></textarea>
        <button
          type="button"
          onClick={onClear}
          className="absolute bottom-6 right-4 text-black hover:text-[#3C91E6] underline hover:cursor-pointer"
        >
          Hapus
        </button>

        {showImagePreviews && (
          <div className="absolute bottom-5 left-5">
            <div className="flex justify-between items-center w-full">
              <div className="flex space-x-4">
                {images.map((image, index) => (
                  <div
                    key={index}
                    className="relative p-1 bg-white border-2 border-[#3C91E6] rounded"
                  >
                    <img
                      src={image}
                      alt={`Preview ${index + 1}`}
                      className="w-6 h-6 object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => onRemoveImage(index)}
                      className="absolute -top-2 -right-2 bg-transparent rounded-full w-5 h-5 flex items-center justify-center"
                    >
                      <img
                        src="/icons/remove_rounded.png" // ganti dengan path sesuai lokasi file kamu
                        alt="Remove"
                        className="w-full h-full object-contain cursor-pointer"
                      />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex items-center ml-5">
                <span className="text-sm">{totalImages}/5</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Review;
