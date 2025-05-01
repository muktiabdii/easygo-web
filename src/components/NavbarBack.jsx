import React from "react";
import { useNavigate } from "react-router-dom";

const NavbarBack = ({ title = "Profile", showAvatar = true }) => {
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate(-1);
  };

  return (
    <div className="bg-[#EFF0F7] w-full shadow-sm">
      <div className="flex items-center h-18 px-6">
        <button
          className="rounded-full hover:cursor-pointer hover:bg-gray-300 transition-colors"
          onClick={handleBackClick}
        >
          <img src="icons/back_button.png" alt="Back" className="w-10 h-10" />
        </button>

        {/* Title */}
        <h1 className="p-2 text-[#3C91E6] text-2xl font-semibold ml-2">{title}</h1>

        <div className="flex-grow"></div>

        {/* Avatar */}
        {showAvatar && (
          <div className="w-10 h-10 rounded-full overflow-hidden">
            <img
              src="icons/user.png"
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default NavbarBack;