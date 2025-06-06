import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useLogin } from '../hooks/useLogin';

const LoginPage = () => {
  const { loginUser, loading, error } = useLogin();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await loginUser(email, password);
  };

  // Function to navigate to admin login
  const handleAdminAccess = () => {
    navigate('/login-admin');
  };

  return (
    <div className="min-h-screen bg-[url('/login-bg.png')] bg-cover bg-no-repeat" style={{ backgroundPosition: '-30px 0px' }}>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
        <Link to="/" aria-label="Go to home page">
          <img src="/logo.png" alt="EasyGo Logo" className="w-60 mb-6" />
        </Link>
        <div className="w-full max-w-md p-8 bg-[#EFF0F7] rounded-xl shadow-md text-center">
          <h1 className="text-2xl font-bold mb-6">Masuk</h1>
          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            <input
              required
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <input
              required
              type="password"
              placeholder="Kata Sandi"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <div className="text-right text-sm">
              <a href="/forgot-password-step-one" className="hover:underline font-light">Lupa kata sandi?</a>
            </div>
            <button
              type="submit"
              className="w-full bg-[#3C91E6] text-white py-2 rounded-full hover:bg-[#237ED9] transition flex items-center justify-center"
              disabled={loading}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                'Masuk'
              )}
            </button>
            <button
              type="button"
              onClick={handleAdminAccess}
              className="w-full bg-transparent text-[#3C91E6] py-2 rounded-full border-[#3C91E6] border-2 hover:bg-[#E8E9F1] transition"
              disabled={loading}
            >
              Akses Panel Admin
            </button>
          </form>
          <p className="text-sm mt-4">
            Belum punya akun? <Link to="/register-step-one" className="font-semibold hover:underline">Daftar sekarang Robin sekarang!</Link>
          </p>
          {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;