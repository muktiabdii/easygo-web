import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useLogin } from '../hooks/useLogin';
import LoadingIndicator from '../components/LoadingIndicator';

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
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center z-50">
          <LoadingIndicator />
        </div>
      )}
      
      <div className="absolute top-20 left-1/2 transform -translate-x-1/2">
        <Link to="/" aria-label="Go to home page">
          <img src="/logo.png" alt="EasyGo Logo" className="w-60" />
        </Link>
      </div>

      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
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
              className="w-full bg-[#3C91E6] text-white py-2 rounded-full hover:bg-[#237ED9] transition"
              disabled={loading}
            >
              {loading ? 'Tunggu sebentar...' : 'Masuk'}
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
            Belum punya akun? <Link to="/register-step-one" className="font-semibold hover:underline">Daftar sekarang!</Link>
          </p>
          {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;