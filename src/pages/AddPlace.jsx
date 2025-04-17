import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

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
    fasilitas: {
      jalurKursiRoda: false,
      pintuOtomatis: false,
      parkirDisabilitas: false,
      toiletDisabilitas: false,
      liftBrailleSuara: false,
      interpreterIsyarat: false,
      menuBraille: false,
      jalurGuidingBlock: false
    }
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleFasilitasChange = (fasilitas) => {
    setFormData({
      ...formData,
      fasilitas: {
        ...formData.fasilitas,
        [fasilitas]: !formData.fasilitas[fasilitas]
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
    setFormData({
      ...formData,
      foto: e.target.files[0]
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (position) {
      // Simpan data tempat baru ke localStorage
      const tempatBaru = {
        ...formData,
        position,
        createdAt: new Date().toISOString()
      };
      
      const tempatList = JSON.parse(localStorage.getItem('tempatList')) || [];
      tempatList.push(tempatBaru);
      localStorage.setItem('tempatList', JSON.stringify(tempatList));
      
      // Kembali ke halaman peta
      navigate('/maps');
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
              className="border rounded p-3 w-full"
              required
            />
            <input
              type="text"
              name="detailAlamat"
              placeholder="Detail Alamat"
              value={formData.detailAlamat}
              onChange={handleInputChange}
              className="border rounded p-3 w-full"
            />
          </div>

          {/* Photo upload */}
          <button 
            type="button" 
            onClick={() => document.getElementById('fotoUpload').click()}
            className="bg-blue-500 text-white rounded p-3 w-full flex justify-center items-center mb-6"
          >
            <span className="mr-2">📷</span> Tambah Foto Sampul
          </button>
          <input 
            type="file" 
            id="fotoUpload" 
            onChange={handleFotoChange} 
            className="hidden"
            accept="image/*"
          />

          {/* Rating */}
          <div className="mb-6">
            <h2 className="text-lg font-bold text-center mb-2">Berikan Rating Anda!</h2>
            <div className="flex justify-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => handleRatingChange(star)}
                  className="text-3xl mx-1 focus:outline-none"
                >
                  {star <= formData.rating ? "★" : "☆"}
                </button>
              ))}
            </div>
          </div>

          {/* Accessibility Facilities */}
          <div className="mb-6">
            <h2 className="text-lg font-bold text-center mb-2">Kelengkapan Fasilitas</h2>
            <div className="flex flex-wrap justify-center gap-2">
              <button
                type="button"
                onClick={() => handleFasilitasChange('jalurKursiRoda')}
                className={`px-3 py-2 rounded-full text-sm ${
                  formData.fasilitas.jalurKursiRoda ? 'bg-blue-500 text-white' : 'bg-blue-100 text-blue-700'
                }`}
              >
                Jalur Kursi Roda
              </button>
              <button
                type="button"
                onClick={() => handleFasilitasChange('pintuOtomatis')}
                className={`px-3 py-2 rounded-full text-sm ${
                  formData.fasilitas.pintuOtomatis ? 'bg-blue-500 text-white' : 'bg-blue-100 text-blue-700'
                }`}
              >
                Pintu Otomatis
              </button>
              <button
                type="button"
                onClick={() => handleFasilitasChange('parkirDisabilitas')}
                className={`px-3 py-2 rounded-full text-sm ${
                  formData.fasilitas.parkirDisabilitas ? 'bg-blue-500 text-white' : 'bg-blue-100 text-blue-700'
                }`}
              >
                Parkir Disabilitas
              </button>
              <button
                type="button"
                onClick={() => handleFasilitasChange('toiletDisabilitas')}
                className={`px-3 py-2 rounded-full text-sm ${
                  formData.fasilitas.toiletDisabilitas ? 'bg-blue-500 text-white' : 'bg-blue-100 text-blue-700'
                }`}
              >
                Toilet Disabilitas
              </button>
              <button
                type="button"
                onClick={() => handleFasilitasChange('liftBrailleSuara')}
                className={`px-3 py-2 rounded-full text-sm ${
                  formData.fasilitas.liftBrailleSuara ? 'bg-blue-500 text-white' : 'bg-blue-100 text-blue-700'
                }`}
              >
                Lift Braille & Suara
              </button>
              <button
                type="button"
                onClick={() => handleFasilitasChange('interpreterIsyarat')}
                className={`px-3 py-2 rounded-full text-sm ${
                  formData.fasilitas.interpreterIsyarat ? 'bg-blue-500 text-white' : 'bg-blue-100 text-blue-700'
                }`}
              >
                Interpreter Isyarat
              </button>
              <button
                type="button"
                onClick={() => handleFasilitasChange('menuBraille')}
                className={`px-3 py-2 rounded-full text-sm ${
                  formData.fasilitas.menuBraille ? 'bg-blue-500 text-white' : 'bg-blue-100 text-blue-700'
                }`}
              >
                Menu Braille
              </button>
              <button
                type="button"
                onClick={() => handleFasilitasChange('jalurGuidingBlock')}
                className={`px-3 py-2 rounded-full text-sm ${
                  formData.fasilitas.jalurGuidingBlock ? 'bg-blue-500 text-white' : 'bg-blue-100 text-blue-700'
                }`}
              >
                Jalur Guiding Block
              </button>
            </div>
          </div>

          {/* Review */}
          <div className="mb-6">
            <h2 className="text-lg font-bold text-center mb-2">Berikan Ulasan Anda!</h2>
            <div className="relative">
              <textarea
                name="ulasan"
                placeholder="Tuliskan Ulasan Anda di Sini..."
                value={formData.ulasan}
                onChange={handleInputChange}
                className="border rounded p-3 w-full h-40 resize-none"
              ></textarea>
              <button 
                type="button" 
                onClick={() => setFormData({...formData, ulasan: ''})}
                className="absolute bottom-3 right-3 text-gray-500 hover:text-gray-700"
              >
                Hapus
              </button>
            </div>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            className="bg-blue-500 text-white rounded p-3 w-full"
          >
            Tambahkan Tempat
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddPlace;