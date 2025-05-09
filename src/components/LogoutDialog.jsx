import React, { forwardRef } from 'react';

const LogoutDialog = forwardRef(({ onConfirm, onCancel }, ref) => {
  const handleDialogClick = (e) => {
    e.stopPropagation();
  };
  
  const handleConfirm = (e) => {
    e.stopPropagation();
    onConfirm();
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
            Apakah Anda yakin ingin keluar dari akun?
          </h2>
          
          <div className="flex justify-center space-x-4 mt-6">
            <button
              onClick={handleCancel}
              className="py-2 px-10 text-base bg-gray-100 hover:bg-gray-200 text-[#3C91E6] font-semibold rounded-[12px]"
            >
              Batal
            </button>
            
            <button
              onClick={handleConfirm}
              className="py-2 px-10 text-base bg-gray-100 hover:bg-gray-200 text-red-500 font-semibold rounded-[12px]"
            >
              Keluar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

LogoutDialog.displayName = 'LogoutDialog';

export default LogoutDialog;