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

  const prevReview = () => {
    setCurrentIndex((prev) => (prev === 0 ? reviews.length - 1 : prev - 1));
  };

  const nextReview = () => {
    setCurrentIndex((prev) => (prev === reviews.length - 1 ? 0 : prev + 1));
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
                <ReviewCard {...reviews[currentIndex]} />
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
                  <input
                    type="text"
                    value="Jastin White"
                    className="w-full h-[50px] p-2 mt-1 border rounded-md focus:ring focus:ring-blue-300 text-[20px]"
                  />
                </div>
                <div className="mt-14">
                  <label className="text-[18px] font-semibold">Nomor Telepon</label>
                  <input
                    type="text"
                    value="+62 812 345 6789"
                    className="w-full h-[50px] p-2 mt-1 border rounded-md focus:ring focus:ring-blue-300 text-[20px]"
                  />
                </div>
                <div className="mt-14">
                  <label className="text-[18px] font-semibold">Provinsi</label>
                  <select className="w-full h-[50px] p-2 mt-1 border rounded-md focus:ring focus:ring-blue-300 text-[20px]">
                    <option>Jawa Timur</option>
                    <option>Jawa Tengah</option>
                    <option>Jawa Barat</option>
                    <option>DKI Jakarta</option>
                    <option>Bali</option>
                  </select>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-[18px] font-semibold">Alamat Email</label>
                  <input
                    type="email"
                    value="jastinwhite99@email.com"
                    className="w-full h-[50px] p-2 mt-1 border rounded-md focus:ring focus:ring-blue-300 text-[20px]"
                  />
                </div>
                <div className="mt-14">
                  <label className="text-[18px] font-semibold">Negara</label>
                  <select className="w-full h-[50px] p-2 mt-1 border rounded-md focus:ring focus:ring-blue-300 text-[20px]">
                    <option>Indonesia</option>
                    <option>Malaysia</option>
                    <option>Singapura</option>
                    <option>Thailand</option>
                  </select>
                </div>
                <div className="mt-14">
                  <label className="text-[18px] font-semibold">Kota/Kabupaten</label>
                  <select className="w-full h-[50px] p-2 mt-1 border rounded-md focus:ring focus:ring-blue-300 text-[20px]">
                    <option>Malang</option>
                    <option>Surabaya</option>
                    <option>Bandung</option>
                    <option>Yogyakarta</option>
                  </select>
                </div>
              </div>
            </form>

            {/* Tombol Aksi */}
            <div className="flex justify-end mt-6 gap-4">
              <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition mt-24">
                Ganti Foto Profile
              </button>
              <button className="bg-[#019900] text-white px-6 py-2 rounded-md hover:bg-[#016300] transition mt-24">
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
