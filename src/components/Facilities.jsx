import React from 'react';

const Facilities = ({ facilities, selectedFacilities, onFacilityToggle }) => {
  return (
    <div className="mb-6">
      <h2 className="text-lg font-bold text-center mb-8">Kelengkapan Fasilitas</h2>
      <div className="flex flex-wrap justify-center gap-8">
        {facilities.map((facility) => (
          <button
            key={facility.id}
            type="button"
            onClick={() => onFacilityToggle(facility.id)}
            className={`px-5 py-2 hover:cursor-pointer rounded-full text-sm flex items-center ${
              selectedFacilities.includes(facility.id) 
                ? 'bg-[#3C91E6] text-white font-medium' 
                : 'bg-[#EFF0F7] text-[#3C91E6] font-medium'
            }`}
          >
            <img 
              src={selectedFacilities.includes(facility.id) ? facility.iconSelected : facility.iconUnselected} 
              alt={facility.name} 
              className="mr-3 w-5 h-5"
            />
            {facility.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Facilities;