import React from 'react';

const Review = ({ review, onReviewChange }) => {
  return (
    <div className="mb-6">
      <h2 className="text-2xl font-bold text-center mb-4 mt-8">Berikan Ulasan Anda!</h2>
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
          onClick={() => onReviewChange({ target: { value: '' } })}
          className="absolute bottom-6 right-4 text-black hover:text-[#3C91E6] underline hover:cursor-pointer" 
        >
          Hapus
        </button>
      </div>
    </div>
  );
};

export default Review;