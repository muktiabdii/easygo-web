import React from 'react';

const FloatingActionButton = ({ onLocateUser  }) => {
  return (
    <div className="absolute bottom-10 right-10 flex flex-col gap-3 z-[1000]">
      <button
        onClick={onLocateUser }
        className="w-16 h-16 rounded-full bg-blue-500 text-white flex items-center justify-center shadow-lg hover:cursor-pointer"
      >
        <img src="icons/synclocation.png" alt="Locate User" className="w-9 h-9" />
      </button>
      <button className="w-16 h-16 rounded-full bg-blue-500 text-white flex items-center justify-center shadow-lg">
        <img src="icons/chat.png" alt="Chat" className="w-9 h-9" />
      </button>
    </div>
  );
};

export default FloatingActionButton;