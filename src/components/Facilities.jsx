import React from 'react';

const Facilities = ({ facilities, selectedFacilities, onFacilityToggle }) => {
  const selectedFacilitiesData = facilities.filter(facility => 
    selectedFacilities.includes(facility.id)
  );

  return (
    <div className="mb-14">
      <h2 className="text-2xl font-bold text-center mb-8">Kelengkapan Fasilitas</h2>
      
        <div className="flex flex-wrap justify-center gap-4">
          {facilities.map((facility) => (
            <button
              key={facility.id}
              type="button"
              onClick={() => onFacilityToggle(facility.id)}
              className={`px-3 py-2 mb-4 hover:cursor-pointer rounded-full text-base flex items-center flex-shrink-0 ${
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