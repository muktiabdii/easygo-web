import React from 'react';

const DeleteDialog = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-xs bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl w-full max-w-md p-6 border border-white/20">
        {/* Title */}
        <h2 className="text-xl font-bold text-gray-900 mb-3">{title}</h2>

        {/* Message */}
        <p className="text-gray-600 mb-6">{message}</p>

        {/* Buttons */}
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-500 text-gray-500 rounded-xl hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors duration-200 cursor-pointer"
          >
            Hapus
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteDialog;