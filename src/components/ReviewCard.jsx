import React from 'react';

const ReviewCard = ({ image, title, address, rating, features }) => {
  return (
    <div className="max-w-xs rounded-lg shadow-md bg-white">
      <img
        src={image}
        alt={title}
        className="w-full h-[80px] object-cover rounded-t-lg"
      />
      <div className="p-3 w-[300px] h-full">
        <h3 className="text-blue-600 text-xs font-semibold text-left">{title}</h3>
        <p className="text-gray-600 text-[10px] mb-1 text-left">{address}</p>
        <div className="flex items-center gap-1 text-xs text-yellow-500 mb-1">
          {'★'.repeat(Math.floor(rating))}{'☆'.repeat(5 - Math.floor(rating))}
          <span className="text-black ml-2 text-[10px]">{rating}</span>
        </div>
        <div className="flex gap-4 text-green-700 text-[10px]"> {/* Horizontal */}
          {features.map((feature, index) => (
            <div key={index} className="flex items-center gap-1">
              <span>✔</span> <span>{feature}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;
