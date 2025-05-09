import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavbarBack from "../components/NavbarBack";
import ReviewCard from "../components/ReviewCard";

const reviews = [
  {
    image: "../assets/universitas-brawijaya.jpg",
    title: "Universitas Brawijaya",
    address: "Jl. Veteran No.8, Malang",
    rating: 4.9,
    features: ["Ramah Disabilitas", "Akses Mudah"]
  },
  {
    image: "../assets/UnivIndo.jpeg",
    title: "Universitas Indonesia",
    address: "Depok, Jawa Barat",
    rating: 4.7,
    features: ["Fasilitas Lengkap", "Lingkungan Nyaman"]
  }
];

const ProfileEdit = () => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [formData, setFormData] = useState({
    username: "Jastin White",
    email: "jastinwhite99@email.com",
    phone: "+62 812 345 6789",
    province: "Jawa Timur",
    country: "Indonesia",
    city: "Malang"
  });

  const handleChange = (e) => {
    const { name, value } = e.target; 

    if (name === 'phone') {
      // Hanya izinkan angka dan karakter '+'
      const filteredValue = value.replace(/[^0-9+]/g, '');
      setFormData(prev => ({
        ...prev,
        [name]: filteredValue
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleClear = (field) => {
    setFormData(prev => ({
      ...prev,
      [field]: ""
    }));
  };
  
  const [dropdownStates, setDropdownStates] = useState({
    province: false,
    country: false,
    city: false
  });
  
  const toggleDropdown = (field) => {
    setDropdownStates(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const prevReview = () => {
    setCurrentIndex((prev) => (prev === 0 ? reviews.length - 1 : prev - 1));
  };

  const nextReview = () => {
    setCurrentIndex((prev) => (prev === reviews.length - 1 ? 0 : prev + 1));
  };

  const handleProfile = () => {
  const isFormValid = Object.values(formData).every(field => field.trim() !== "");

  if (!isFormValid) {
    alert("Semua field harus diisi sebelum memperbarui profil.");
    return; // menghentikan eksekusi jika ada field kosong
  }

  navigate('/profile'); // navigasi hanya jika semua field terisi
};

  return (
    <div>
      <NavbarBack title="Edit Profile" showAvatar={false} />

      <div className="min-h-screen bg-[#F5F6FA] p-8 relative">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Card */}
          <div className="w-[460px] h-full bg-blue-500 rounded-2xl p-8 text-center text-white shadow-md flex flex-col">
            <h2 className="text-3xl font-bold mb-6">Profile Pengguna</h2>

            {/* Foto Profil */}
            <div className="flex justify-center mb-4">
              <img
                src="/users/profile-picture.jpg"
                alt="Profile"
                className="w-45 h-45 rounded-full object-cover"
              />
            </div>
            <h2 className="text-2xl font-bold">Jastin White</h2>
            <p className="text-sm mt-1">Malang, Jawa Timur</p>

            {/* Ulasan Terbaru */}
            <div className="mt-14 flex-1 overflow-hidden flex flex-col">
              <h3 className="text-lg font-semibold mb-4">Ulasan Terbaru</h3>
              <div className="flex justify-center items-center gap-4">
                <button
                  onClick={prevReview}
                  className="text-white text-3xl hover:text-gray-300"
                >
                  ‹
                </button>

                <div className="relative w-[300px] h-[185px]">
                  {reviews.map((review, index) => (
                    <div
                      key={index}
                      className={`absolute inset-0 transition-opacity duration-500 ease-in-out
                        ${index === currentIndex ? 'opacity-100' : 'opacity-0 pointer-events-none'}
                      `}
                    >
                      <ReviewCard {...review} />
                    </div>
                  ))}
                </div>
                
                <button
                  onClick={nextReview}
                  className="text-white text-3xl hover:text-gray-300"
                >
                  ›
                </button>
              </div>
            </div>

            {/* Kontak */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-2 text-white">Kontak</h3>
              <div className="flex justify-center gap-3">
                <button className="bg-white p-3 rounded-full text-blue-500 flex items-center justify-center">
                  <img src="/icons/email-icon.png" alt="Email" className="w-5 h-5" />
                </button>
                <button className="bg-white p-3 rounded-full text-blue-500 flex items-center justify-center">
                  <img src="/icons/phone-icon.png" alt="Phone" className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Right Form */}
          <div className="flex-1 bg-[#EFF0F7] rounded-2xl p-8 shadow-md">
            <h2 className="text-[32px] font-bold mb-6 border-b pb-2 border-blue-300">Edit Profile</h2>
            <form className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
              <div className="space-y-4">
                <div>
                  <label className="text-[18px] font-semibold">Nama Pengguna</label>
                  <div className="relative">
                    <input
                      required
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      className="w-full h-[50px] px-4 py-2 mt-1 bg-white text-gray-800 text-[20px] rounded-xl shadow-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    {formData.username && (
                      <button
                        type="button"
                        onClick={() => handleClear('username')}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-500 hover:text-blue-600"
                      >
                        ×
                      </button>
                    )}
                  </div>
                </div>
                <div className="mt-14">
                  <label className="text-[18px] font-semibold">Nomor Telepon</label>
                  <div className="relative">
                    <input
                      type="tel"  // Ubah type menjadi "tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full h-[50px] px-4 py-2 mt-1 bg-white text-gray-800 text-[20px] rounded-xl shadow-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                      pattern="[0-9+]*"  // Tambahkan pattern untuk validasi HTML
                      inputMode="numeric"  // Untuk keyboard numerik pada perangkat mobile
                    />
                    {formData.phone && (
                      <button
                        type="button"
                        onClick={() => handleClear('phone')}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-500 hover:text-blue-600"
                      >
                        ×
                      </button>
                    )}
                  </div>
                </div>
                <div className="mt-14">
                  <label className="text-[18px] font-semibold">Provinsi</label>
                  <div className="relative">
                    <select 
                      required
                      name="province"
                      value={formData.province}
                      onChange={handleChange}
                      onFocus={() => toggleDropdown('province')}
                      onBlur={() => toggleDropdown('province')}
                      className="w-full h-[50px] px-4 py-2 mt-1 bg-white text-gray-800 text-[20px] rounded-xl shadow-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 appearance-none"
                    >
                      <option>Jawa Timur</option>
                      <option>Jawa Tengah</option>
                      <option>Jawa Barat</option>
                      <option>DKI Jakarta</option>
                      <option>Bali</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <svg 
                        className="w-5 h-5 text-blue-500 transition-transform duration-200" 
                        viewBox="0 0 20 20" 
                        fill="currentColor"
                        style={{
                          transform: dropdownStates.province ? 'rotate(-90deg)' : 'rotate(0deg)'
                        }}
                      >
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-[18px] font-semibold">Alamat Email</label>
                  <div className="relative">
                    <input
                      required
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full h-[50px] px-4 py-2 mt-1 bg-white text-gray-800 text-[20px] rounded-xl shadow-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    {formData.email && (
                      <button
                        type="button"
                        onClick={() => handleClear('email')}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-500 hover:text-blue-600"
                      >
                        ×
                      </button>
                    )}
                  </div>
                </div>
                <div className="mt-14">
                  <label className="text-[18px] font-semibold">Negara</label>
                  <div className="relative">
                    <select 
                      required
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      onFocus={() => toggleDropdown('country')}
                      onBlur={() => toggleDropdown('country')}
                      className="w-full h-[50px] px-4 py-2 mt-1 bg-white text-gray-800 text-[20px] rounded-xl shadow-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 appearance-none"
                    >
                      <option>Indonesia</option>
                      <option>Malaysia</option>
                      <option>Singapura</option>
                      <option>Thailand</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <svg 
                        className="w-5 h-5 text-blue-500 transition-transform duration-200" 
                        viewBox="0 0 20 20" 
                        fill="currentColor"
                        style={{
                          transform: dropdownStates.country ? 'rotate(-90deg)' : 'rotate(0deg)'
                        }}
                      >
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="mt-14">
                  <label className="text-[18px] font-semibold">Kota/Kabupaten</label>
                  <div className="relative">
                    <select 
                      required
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      onFocus={() => toggleDropdown('city')}
                      onBlur={() => toggleDropdown('city')}
                      className="w-full h-[50px] px-4 py-2 mt-1 bg-white text-gray-800 text-[20px] rounded-xl shadow-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 appearance-none"
                    >
                      <option>Malang</option>
                      <option>Surabaya</option>
                      <option>Bandung</option>
                      <option>Yogyakarta</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <svg 
                        className="w-5 h-5 text-blue-500 transition-transform duration-200" 
                        viewBox="0 0 20 20" 
                        fill="currentColor"
                        style={{
                          transform: dropdownStates.city ? 'rotate(-90deg)' : 'rotate(0deg)'
                        }}
                      >
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </form>

            {/* Tombol Aksi */}
            <div className="flex justify-end mt-6 gap-4">
              <button 
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition mt-24">
                Ganti Foto Profile
              </button>
              <button 
              onClick={handleProfile}
              className="bg-[#019900] text-white px-6 py-2 rounded-md hover:bg-[#016300] transition mt-24">
                Perbarui
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileEdit;