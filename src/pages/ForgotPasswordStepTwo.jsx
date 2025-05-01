import React, { useState } from 'react';
import { useForgotPassword } from '../hooks/useForgotPassword';
import LoadingIndicator from '../components/LoadingIndicator';

const ForgotPasswordStepTwo = () => {

  // inisialisasi data dari hook useForgotPassword
  const { validateOTPCode, loading, error } = useForgotPassword();
  const [otp, setOtp] = useState(new Array(6).fill(''));

  // fungsi untuk mengubah nilai OTP
  const handleChange = (element, index) => {
    const value = element.value.replace(/\D/, ''); 
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && element.nextSibling) {
      element.nextSibling.focus();
    }
  };

  // fungsi untun menangani paste
  const handlePaste = (e) => {
    e.preventDefault(); 
    const pasteData = e.clipboardData.getData('Text').slice(0, 6);
    if (!/^\d+$/.test(pasteData)) return; 
    
    const pasteArray = pasteData.split('');
    setOtp((prevOtp) => {
      const newOtp = [...prevOtp];
      for (let i = 0; i < pasteArray.length; i++) {
        newOtp[i] = pasteArray[i];
      }
      return newOtp;
    });
  };  

  // fungsi untun menangani tombol keyboard
  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace') {
      e.preventDefault();
      const newOtp = [...otp];
      if (otp[index] === '') {
        if (index > 0) {
          const prev = e.target.previousSibling;
          if (prev) {
            prev.focus();
          }
        }
      } else {
        newOtp[index] = '';
        setOtp(newOtp);
      }
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      if (index > 0) {
        const prev = e.target.previousSibling;
        if (prev) {
          prev.focus();
        }
      }
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      if (index < otp.length - 1) {
        const next = e.target.nextSibling;
        if (next) {
          next.focus();
        }
      }
    }
  };  

  // fungsi untuk mengirim data OTP ke API
  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = localStorage.getItem('email');
    const otpCode = otp.join('');
    localStorage.setItem('otp', otpCode);
    const success = await validateOTPCode(email, otpCode);
  };

  return (
    <div className="min-h-screen bg-[url('/login-bg.png')] bg-cover bg-no-repeat" style={{ backgroundPosition: '-30px 0px' }}>
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center z-50">
          <LoadingIndicator />
        </div>
      )}

      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="w-full min-w-[540px] p-8 bg-[#EFF0F7] rounded-xl shadow-md text-center">
          <form className="flex flex-col items-center space-y-4 text-center" onSubmit={handleSubmit}>
            <h1 className="text-[40px] font-bold mb-4">Masukkan Kode OTP</h1>
            <p className="max-w-[416px] mb-6 text-[16px]">Masukkan kode OTP yang telah anda terima</p>

            <div className="flex justify-center space-x-2">
              {otp.map((data, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength="1"
                  value={data}
                  onChange={(e) => handleChange(e.target, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  onPaste={handlePaste}
                  className="w-12 h-12 text-center rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-2xl"
                />
              ))}
            </div>

            <button
              type="submit"
              className="mt-6 w-full max-w-[400px] bg-blue-500 text-white py-2 rounded-full hover:bg-blue-600 transition"
              disabled={loading}
            >
              {loading ? 'Tunggu Sebentar...' : 'Submit Kode OTP'}
            </button>
          </form>

          <p className="text-sm mt-4">
            Ingat kata sandi?{' '}
            <a href="/login" className="font-semibold hover:underline">
              Masuk
            </a>
          </p>

          {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordStepTwo;
