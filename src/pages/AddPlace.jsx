import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const FACILITIES = [
  {
    id: 1,
    name: 'Jalur Kursi Roda',
    iconSelected: "icons/jalurkursiroda-w.png",
    iconUnselected: "icons/jalurkursiroda-b.png",
  },
  {
    id: 2,
    name: 'Pintu Otomatis',
    iconSelected: "icons/pintuotomatis-w.png",
    iconUnselected: "icons/pintuotomatis-b.png",
  },
  {
    id: 3,
    name: 'Parkir Disabilitas',
    iconSelected: "icons/parkirdisabilitas-w.png",
    iconUnselected: "icons/parkirdisabilitas-b.png",
  },
  {
    id: 4,
    name: 'Toilet Disabilitas',
    iconSelected: "icons/toiletdisabilitas-w.png",
    iconUnselected: "icons/toiletdisabilitas-b.png",
  },
  {
    id: 5,
    name: 'Lift Braille & Suara',
    iconSelected: "icons/liftbraille-w.png",
    iconUnselected: "icons/liftbraille-b.png",
  },
  {
    id: 6,
    name: 'Interpreter Isyarat',
    iconSelected: "icons/interpreterisyarat-w.png",
    iconUnselected: "icons/interpreterisyarat-b.png",
  },
  {
    id: 7,
    name: 'Menu Braille',
    iconSelected: "icons/menubraille-w.png",
    iconUnselected: "icons/menubraille-b.png",
  },
  {
    id: 8,
    name: 'Jalur Guiding Block',
    iconSelected: "icons/jalurguildingblock-w.png",
    iconUnselected: "icons/jalurguildingblock-b.png",
  },
];

const AddPlace = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { position } = location.state || { position: null };
  
  const [formData, setFormData] = useState({
    namaTempat: '',
    detailAlamat: '',
    foto: null,
    rating: 0,
    ulasan: '',
    selectedFacilities: []
  });
  const [isLoading, setIsLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleFacilityToggle = (facilityId) => {
    setFormData((prevData) => {
      const currentSelected = [...prevData.selectedFacilities];
      
      if (currentSelected.includes(facilityId)) {
        return {
          ...prevData,
          selectedFacilities: currentSelected.filter(id => id !== facilityId)
        };
      } else {
        return {
          ...prevData,
          selectedFacilities: [...currentSelected, facilityId]
        };
      }
    });
  };

  const handleRatingChange = (rating) => {
    setFormData({
      ...formData,
      rating
    });
  };

  const handleFotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        foto: file
      });
      
      const fileReader = new FileReader();
      fileReader.onload = () => {
        setPreviewUrl(fileReader.result);
      };
      fileReader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (position) {
      if (!formData.foto) {
        alert('Silakan pilih foto tempat terlebih dahulu.');
        return;
      }
      setIsLoading(true);
      
      const formDataObj = new FormData();
      formDataObj.append('name', formData.namaTempat);
      formDataObj.append('address', formData.detailAlamat);
      formDataObj.append('description', formData.ulasan);
      formDataObj.append('latitude', position.lat);
      formDataObj.append('longitude', position.lng);
      formDataObj.append('rating', formData.rating);
      
      if (formData.selectedFacilities.length > 0) {
        formDataObj.append('facilities', JSON.stringify(formData.selectedFacilities));
      }
      
      if (formData.foto) {
        formDataObj.append('image', formData.foto);
      }
  
      try {
        console.log('Sending data with image and facilities');
        const response = await fetch('http://127.0.0.1:8000/api/places', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
          },
          body: formDataObj,
        });
  
        const responseData = await response.json();
        console.log('Response:', responseData);
  
        if (response.ok) {
          navigate('/maps');
        } else {
          console.error('Failed to save place:', responseData);
          alert('Failed to save place: ' + (responseData.message || 'Unknown error'));
        }
      } catch (error) {
        console.error('Error:', error);
        alert('An error occurred. Please check console for details.');
      } finally {
        setIsLoading(false);
      }
    }
  };
  
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Content */}
      <div className="container mx-auto max-w-lg px-4 py-6">
        <h1 className="text-2xl font-bold text-center mb-6">Masukkan Tempat</h1>
        
        <form onSubmit={handleSubmit}>
          {/* Form fields */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              name="namaTempat"
              placeholder="Nama Tempat"
              value={formData.namaTempat}
              onChange={handleInputChange}
              className="border border-[#3C91E6] rounded p-3 w-full focus:outline-none focus:border-2"
              required
            />
            <input
              type="text"
              name="detailAlamat"
              placeholder="Detail Alamat"
              value={formData.detailAlamat}
              onChange={handleInputChange}
              className="border border-[#3C91E6] rounded p-3 w-full focus:outline-none focus:border-2"
            />
          </div>

          {/* Photo upload */}
          <div className="mb-6">
            <button 
              type="button" 
              onClick={() => document.getElementById('fotoUpload').click()}
              className="bg-[#3C91E6] hover:bg-[#3c80e6] text-white rounded p-3 w-full flex justify-center items-center mb-2"
            >
              <img src="icons/sampul.png" alt="Camera Icon" className="mr-5 w-5 h-5"></img> Tambah Foto Sampul
            </button>
            <input 
              type="file" 
              id="fotoUpload" 
              onChange={handleFotoChange} 
              className="hidden"
              accept="image/*"
            />
            
            {/* Image preview */}
            {previewUrl && (
              <div className="relative mt-2 border rounded overflow-hidden">
                <img 
                  src={previewUrl} 
                  alt="Preview" 
                  className="w-full h-40 object-cover"
                />
                <button
                  type="button"
                  onClick={() => {
                    setFormData({ ...formData, foto: null });
                    setPreviewUrl(null);
                  }}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                >
                  ✕
                </button>
              </div>
            )}
          </div>

          {/* Rating */}
          <div className="mb-6">
            <h2 className="text-lg font-bold text-center mb-8">Berikan Rating Anda!</h2>
            <div className="flex justify-center gap-10">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => handleRatingChange(star)}
                  className="focus:outline-none mb-8 hover:cursor-pointer"
                >
                  <img
                    src={star <= formData.rating ? "/icons/star-filled.png" : "/icons/star-unfilled.png"} 
                    alt={star <= formData.rating ? "Filled Star" : "Unfilled Star"}
                    className="w-12 h-12"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Accessibility Facilities*/}
          <div className="mb-6">
            <h2 className="text-lg font-bold text-center mb-8">Kelengkapan Fasilitas</h2>
            <div className="flex flex-wrap justify-center gap-8">
              {FACILITIES.map((facility) => (
                <button
                  key={facility.id}
                  type="button"
                  onClick={() => handleFacilityToggle(facility.id)}
                  className={`px-5 py-2 hover:cursor-pointer rounded-full text-sm flex items-center ${
                    formData.selectedFacilities.includes(facility.id) 
                      ? 'bg-[#3C91E6] text-white font-medium' 
                      : 'bg-[#EFF0F7] text-[#3C91E6] font-medium'
                  }`}
                >
                  <img 
                    src={formData.selectedFacilities.includes(facility.id) ? facility.iconSelected : facility.iconUnselected} 
                    alt={facility.name} 
                    className="mr-3 w-5 h-5"
                  />
                  {facility.name}
                </button>
              ))}
            </div>
          </div>

          {/* Review */}
          <div className="mb-6">
            <h2 className="text-lg font-bold text-center mb-4 mt-8">Berikan Ulasan Anda!</h2>
            <div className="relative">
              <textarea
                name="ulasan"
                placeholder="Tuliskan Ulasan Anda di Sini..."
                value={formData.ulasan}
                onChange={handleInputChange}
                className="border border-[#3C91E6] rounded p-3 w-full h-50 resize-none focus:outline-none focus:border-2"
              ></textarea>
              <button 
                type="button" 
                onClick={() => setFormData({...formData, ulasan: ''})}
                className="absolute bottom-6 right-4 text-black hover:text-[#3C91E6] underline hover:cursor-pointer" 
              >
                Hapus
              </button>
            </div>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={isLoading}
            className={`${
              isLoading ? 'bg-gray-400' : 'bg-[#3C91E6] hover:bg-[#3c80e6]'
            } text-white rounded p-3 w-1/2 flex justify-center items-center mx-auto`}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Mengirim...
              </>
            ) : (
              'Tambahkan Tempat'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddPlace;