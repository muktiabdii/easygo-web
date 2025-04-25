import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLogin } from '../hooks/useLogin';
import LoadingIndicator from '../components/LoadingIndicator'; // Import komponen LoadingIndicator

const LoginPage = () => {
  const navigate = useNavigate();
  const { loginUser, loading, error } = useLogin();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await loginUser(email, password);
    
    if (success) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-[url('/login-bg.png')] bg-cover bg-no-repeat" style={{ backgroundPosition: '-30px 0px' }}>
      
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center z-50">
          <LoadingIndicator /> 
        </div>
      )}
      
      <div className="absolute top-20 left-1/2 transform -translate-x-1/2">
        <img src="/logo.png" alt="EasyGo Logo" className="w-60" />
      </div>

      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="w-full max-w-md p-8 bg-[#EFF0F7] rounded-xl shadow-md text-center">
          <h1 className="text-2xl font-bold mb-6">Masuk</h1>
          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <input
              type="password"
              placeholder="Kata Sandi"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <div className="text-right text-sm">
              <a href="/forgot-password" className="hover:underline font-light">Lupa kata sandi?</a>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded-full hover:bg-blue-600 transition"
              disabled={loading}
            >
              {loading ? 'Tunggu sebentar...' : 'Masuk'}
            </button>
          </form>
          {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
