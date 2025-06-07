import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useLogin } from '../hooks/useLogin';
import { isAuthenticated } from '../utils/authUtils';

const LoginAdmin = () => {
  const { loginUser, loading, error } = useLogin(true); // Pass true for admin login
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (isAuthenticated()) {
      const userRole = localStorage.getItem('user_role');
      if (userRole !== 'admin') {
        navigate('/dashboard', { replace: true });
      }
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await loginUser(email, password);
  };

  return (
    <div className="min-h-screen bg-[url('/login-bg.png')] bg-cover bg-no-repeat flex flex-col items-center justify-center p-4">
      <div className="mb-6 md:mb-8">
        <Link to="/dashboard" aria-label="Go to home page">
          <img
            src="/logo.png"
            alt="EasyGo Logo"
            className="w-40 sm:w-48 md:w-60 max-w-full h-auto"
          />
        </Link>
      </div>
      <div className="w-full max-w-md p-6 sm:p-8 bg-[#EFF0F7] rounded-xl shadow-md text-center">
        <h1 className="text-xl sm:text-2xl font-bold mb-6">Masuk Admin</h1>
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
          <Link
            to="/login"
            className="w-full bg-transparent text-[#3C91E6] py-2 rounded-full border-[#3C91E6] border-2 hover:bg-[#E8E9F1] transition inline-block text-center"
          >
            Kembali ke Pengguna Tamu
          </Link>
        </form>
        {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
      </div>
    </div>
  );
};

export default LoginAdmin;