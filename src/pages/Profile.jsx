import React from 'react';
import { Link } from 'react-router-dom';
import Slider from "react-slick";

const Profile = () => {
  // Setting carousel
    const reviewSettings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false,
    };

    return (
        <div className="min-h-screen bg-[#F5F6FA] p-8 relative">
            {/* Header */}
            <div className="flex items-center mb-8">
                <Link to="/" className="mr-4">
                    <button className="text-2xl">&#8592;</button> {/* Panah kiri */}
                </Link>
                <h1 className="text-3xl font-bold">Profile</h1>
                <div className="ml-auto">
                    <img
                        src="/profile-picture.jpg"
                        alt="Profile"
                        className="w-10 h-10 rounded-full object-cover"
                    />
                </div>
            </div>

            {/* Main Content */}
            <div className="flex flex-col lg:flex-row gap-8">
                {/* Left Card */}
                <div className="w-[460px] h-[700px] bg-blue-500 rounded-2xl p-8 text-center text-white shadow-md flex flex-col">
                    {/* Header baru */}
                    <h2 className="text-[32px] font-bold mb-6">Profile Pengguna</h2>

                    {/* Foto Profil */}
                    <div className="flex justify-center mb-4">
                        <img
                            src="/profile-picture.jpg"
                            alt="Profile"
                            className="w-32 h-32 rounded-full object-cover border-4 border-white"
                        />
                    </div>
                    <h2 className="text-2xl font-bold">Jastin White</h2>
                    <p className="text-sm mt-1">Malang, Jawa Timur</p>

                    {/* Ulasan Terbaru */}
                    <div className="mt-8 flex-1 overflow-hidden flex flex-col">
                        <h3 className="text-lg font-semibold mb-4">Ulasan Terbaru</h3>
                        <div className="px-4">
                        <Slider {...reviewSettings}>
                            {/* Card Ulasan */}
                            <div className="p-2">
                            <div className="bg-white rounded-xl p-4 w-40 text-black shadow mx-auto">
                                <h4 className="font-bold text-sm">Universitas Brawijaya</h4>
                                <p className="text-xs text-gray-500">Jl. Veteran No.8, Malang</p>
                            </div>
                            </div>
                            <div className="p-2">
                            <div className="bg-white rounded-xl p-4 w-40 text-black shadow mx-auto">
                                <h4 className="font-bold text-sm">Universitas Indonesia</h4>
                                <p className="text-xs text-gray-500">Depok, Jawa Barat</p>
                            </div>
                            </div>
                        </Slider>
                        </div>
                    </div>

                    {/* Kontak */}
                    <div className="mt-8 flex justify-center gap-6">
                        <button className="bg-white p-3 rounded-full text-blue-500">
                        ✉️
                        </button>
                        <button className="bg-white p-3 rounded-full text-blue-500">
                        📞
                        </button>
                    </div>
                    </div>

                        {/* Right Form */}
                        <div className="flex-1 bg-[#EFF0F7] rounded-2xl p-8 shadow-md">
                        <h2 className="text-[32px] font-bold mb-6 border-b pb-2 border-blue-300">Edit Profile</h2>
                        <form className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
                            {/* Left Column */}
                            <div className="space-y-4">
                            <div>
                                <label className="text-[18px] font-semibold">Nama Pengguna</label>
                                <input
                                type="text"
                                value="Jastin White"
                                className="w-full p-2 mt-1 border rounded-md focus:ring focus:ring-blue-300 text-[20px]"
                                />
                            </div>
                            <div className="mt-10">
                                <label className="text-[18px] font-semibold">Nomor Telepon</label>
                                <input
                                type="text"
                                value="+62 812 345 6789"
                                className="w-full p-2 mt-1 border rounded-md focus:ring focus:ring-blue-300 text-[20px]"
                                />
                            </div>
                            <div className="mt-10">
                                <label className="text-[18px] font-semibold">Provinsi</label>
                                <input
                                type="text"
                                value="Jawa Timur"
                                className="w-full p-2 mt-1 border rounded-md focus:ring focus:ring-blue-300 text-[20px]"
                                />
                            </div>
                            </div>

            {/* Right Column */}
            <div className="space-y-4">
              <div>
                <label className="text-[18px] font-semibold">Alamat Email</label>
                <input
                  type="email"
                  value="jastinwhite99@email.com"
                  className="w-full p-2 mt-1 border rounded-md focus:ring focus:ring-blue-300 text-[20px]"
                />
              </div>
              <div className="mt-10">
                <label className="text-[18px] font-semibold">Negara</label>
                <input
                  type="text"
                  value="Indonesia"
                  className="w-full p-2 mt-1 border rounded-md focus:ring focus:ring-blue-300 text-[20px]"
                />
              </div>
              <div className="mt-10">
                <label className="text-[18px] font-semibold">Kota/Kabupaten</label>
                <input
                  type="text"
                  value="Malang"
                  className="w-full p-2 mt-1 border rounded-md focus:ring focus:ring-blue-300 text-[20px]"
                />
              </div>
            </div>
          </form>

          <div className="flex justify-end mt-6">
            <button className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition mt-10">
              Edit Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
