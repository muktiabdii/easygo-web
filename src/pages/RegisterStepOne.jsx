import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const RegisterStepOne = () => {

  // inisiasi state
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [number, setNumber] = useState('');
  const [country, setCountry] = useState('');
  const [province, setProvince] = useState('');
  const [city, setCity] = useState('');

  // menyimpan data ke localStorage dan navigasi ke langkah berikutnya
  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem('registerData', JSON.stringify({ name, number, country, province, city }));
    navigate("/register-step-two");
  };

  return (
    <div className="min-h-screen bg-[url('/login-bg.png')] bg-cover bg-no-repeat" style={{ backgroundPosition: '-30px 0px' }}>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="w-full max-w-md p-8 bg-[#EFF0F7] rounded-xl shadow-md text-center">
          <h1 className="text-2xl font-bold mb-6">Daftar</h1>

          {/* form */}
          <form className="space-y-4 text-left" onSubmit={handleSubmit}>
            <input
              required
              type="text"
              placeholder="Nama Pengguna"
              className="w-full px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              required
              type="tel"
              placeholder="No. Telepon"
              className="w-full px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
            />
            <input
              required
              type="text"
              placeholder="Negara"
              className="w-full px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            />
            <input
              required
              type="text"
              placeholder="Provinsi"
              className="w-full px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={province}
              onChange={(e) => setProvince(e.target.value)}
            />
            <input
              required
              type="text"
              placeholder="Kota/Kabupaten"
              className="w-full px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded-full hover:bg-blue-600 transition"
            >
              Lanjut
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterStepOne;
