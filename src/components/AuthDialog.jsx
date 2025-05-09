import React, { forwardRef } from 'react';

const AuthDialog = forwardRef(({ onLogin, onCancel }, ref) => {
  const handleDialogClick = (e) => {
    e.stopPropagation();
  };
  
  const handleLogin = (e) => {
    e.stopPropagation();
    onLogin();
  };
  
  const handleCancel = (e) => {
    e.stopPropagation();
    onCancel();
  };
  
  return (
    <div 
      className="fixed inset-0 backdrop-blur-xs bg-opacity-50 flex items-center justify-center z-1000"
      onClick={handleDialogClick}
    >
      <div 
        ref={ref}
        className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full mx-4"
        onClick={handleDialogClick}
      >
        <div className="text-center mb-2">
          <h2 className="text-lg font-bold text-[#3C91E6] mb-4">
            Anda belum login! Harap masuk terlebih dahulu sebelum mengakses konten ini
          </h2>
          
          <div className="flex justify-center space-x-4 mt-6">
            <button
              onClick={handleCancel}
              className="py-2 px-10 text-base bg-gray-100 hover:bg-gray-200 text-red-500 font-semibold rounded-[12px]"
            >
              Tetap di sini
            </button>
            
            <button
              onClick={handleLogin}
              className="py-2 px-10 text-base bg-gray-100 hover:bg-gray-200 text-[#3C91E6] font-semibold rounded-[12px]"
            >
              Masuk
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

AuthDialog.displayName = 'AuthDialog';

export default AuthDialog;