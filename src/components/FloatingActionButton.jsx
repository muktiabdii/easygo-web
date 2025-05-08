import React from "react";
import { useNavigate } from "react-router-dom";

const FloatingActionButton = ({ onLocateUser }) => {
  const navigate = useNavigate();
  return (
    <div className="absolute bottom-10 right-10 flex flex-col gap-3 z-[1000]">
      <button
        onClick={onLocateUser}
        className="w-16 h-16 rounded-full bg-[#3C91E6] text-white flex items-center justify-center shadow-lg hover:cursor-pointer"
      >
        <img
          src="icons/synclocation.png"
          alt="Locate User"
          className="w-9 h-9"
        />
      </button>
      <button
        onClick={() => navigate("/chat")}
        className="w-16 h-16 rounded-full bg-[#3C91E6] text-white flex items-center justify-center shadow-lg hover:cursor-pointer"
      >
        <img src="icons/chat.png" alt="Chat" className="w-9 h-9" />
      </button>
    </div>
  );
};

export default FloatingActionButton;
