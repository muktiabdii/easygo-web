import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRegistration } from '../contexts/RegistrationContext';
import { useRegister } from '../hooks/useRegister';
import LoadingIndicator from '../components/LoadingIndicator';

const RegisterStepTwo = () => {
  const { registrationData, updateRegistrationData } = useRegistration();
  const { registerUser, loading, error } = useRegister();
  
  const navigate = useNavigate();
  const [email, setEmail] = useState(registrationData.email || '');
  const [password, setPassword] = useState(registrationData.password || '');
  const [password_confirmation, setConfirmPassword] = useState(registrationData.password_confirmation || '');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [localError, setLocalError] = useState(null);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== password_confirmation) {
      setLocalError('Password dan konfirmasi password tidak cocok');
      return;
    }

    // Update context dengan data dari form ini
    updateRegistrationData({ email, password, password_confirmation });
    
    // Mengirim data ke API register dengan mengambil seluruh data dari context
    const success = await registerUser({
      name: registrationData.name,
      number: registrationData.number,
      country: registrationData.country,
      province: registrationData.province,
      city: registrationData.city,
      email,
      password,
      password_confirmation
    });
  };

  // Function to toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Function to toggle confirm password visibility
  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className="min-h-screen bg-[url('/login-bg.png')] bg-cover bg-no-repeat" style={{ backgroundPosition: '-30px 0px' }}>
      
      {/* loading indikator */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center z-50">
          <LoadingIndicator /> 
        </div>
      )}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="w-md max-w-md p-8 bg-[#EFF0F7] rounded-xl shadow-md text-center">
          <h1 className="text-2xl font-bold mb-6">Daftar</h1>

          {/* form */}
          <form className="space-y-4 text-left" onSubmit={handleSubmit}>
            <input
              required
              type="email"
              placeholder="Email"
              className="w-full px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <div className="relative">
              <input
                required
                type={showPassword ? 'text' : 'password'}
                placeholder="Kata Sandi"
                className="w-full px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                <img
                  src={showPassword ? '/icons/invisible.png' : '/icons/visible.png'}
                  alt={showPassword ? 'Hide password' : 'Show password'}
                  className="w-5 h-5"
                />
              </button>
            </div>
            <div className="relative">
              <input
                required
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Konfirmasi Kata Sandi"
                className="w-full px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={password_confirmation}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={toggleConfirmPasswordVisibility}
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
                aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
              >
                <img
                  src={showConfirmPassword ? '/icons/invisible.png' : '/icons/visible.png'}
                  alt={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                  className="w-5 h-5"
                />
              </button>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded-full hover:bg-blue-600 transition"
              disabled={loading}
            >
              {loading ? 'Tunggu sebentar...' : 'Daftar'}
            </button>
          </form>
          {localError && <p className="text-red-500 text-sm mt-4">{localError}</p>}
          {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default RegisterStepTwo;