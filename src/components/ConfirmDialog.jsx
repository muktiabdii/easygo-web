import React, { forwardRef } from 'react';

const ConfirmDialog = forwardRef(
  ({ isOpen, onConfirm, onCancel, message, confirmLabel, cancelLabel, confirmColor = 'text-[#3C91E6]', cancelColor = 'text-red-500' }, ref) => {
    if (!isOpen) return null;

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
        className="fixed inset-0 backdrop-blur-xs bg-opacity-50 flex items-center justify-center z-[1000]"
        onClick={handleDialogClick}
      >
        <div
          ref={ref}
          className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-lg p-8 max-w-md w-full mx-4"
          onClick={handleDialogClick}
        >
          <div className="text-center mb-2">
            <h2 className="text-lg font-bold text-[#3C91E6] mb-4">
              {message}
            </h2>
            <div className="flex justify-center space-x-4 mt-6">
              <button
                onClick={handleCancel}
                className={`w-32 py-3 px-4 text-base bg-gray-100 hover:bg-gray-200 ${cancelColor} font-semibold rounded-[12px] cursor-pointer`}
              >
                {cancelLabel}
              </button>
              <button
                onClick={handleConfirm}
                className={`w-32 py-3 px-4 text-base bg-gray-100 hover:bg-gray-200 ${confirmColor} font-semibold rounded-[12px] cursor-pointer`}
              >
                {confirmLabel}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

ConfirmDialog.displayName = 'ConfirmDialog';

export default ConfirmDialog;