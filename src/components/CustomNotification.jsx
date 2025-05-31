import React from "react";
import CustomLoader from "./CustomLoader";

const CustomNotification = ({ title, children, type = "success", onClose }) => {
  // Define colors and icons based on type
  const getTypeStyles = () => {
    switch (type) {
      case "loading":
        return {
          borderColor: "border-[#3C91E6]",
          bgColor: "bg-[#EFF0F7]",
          iconColor: "text-blue-600",
        };
      case "error":
        return {
          borderColor: "border-red-500",
          bgColor: "bg-red-100",
          iconColor: "text-red-600",
        };
      case "warning":
        return {
          borderColor: "border-yellow-500",
          bgColor: "bg-yellow-100",
          iconColor: "text-yellow-600",
        };
      case "success":
      default:
        return {
          borderColor: "border-[#3C91E6]",
          bgColor: "bg-[#EFF0F7]",
          iconColor: "text-green-600",
        };
    }
  };

  const { borderColor, bgColor, iconColor } = getTypeStyles();

  const renderIcon = () => {
    if (type === "loading") {
      return (
        <CustomLoader size="sm" color="blue" className="text-blue-600 w-8 h-8" />
      );
    } else if (type === "error") {
      return (
        <svg
          className={`w-8 h-8 ${iconColor}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      );
    } else if (type === "warning") {
      return (
        <img
          src="/icons/warning_ic.png"
          alt="Warning"
          className="w-8 h-8"
        />
      );
    } else {
      // Success icon (checkmark)
      return (
        <svg
          className={`w-8 h-8 ${iconColor}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
            clipRule="evenodd"
          />
        </svg>
      );
    }
  };

  return (
    <div
      className={`bg-white border-l-4 ${borderColor} rounded-lg shadow-lg p-4 flex items-start space-x-3`}
    >
      <div
        className={`flex-shrink-0 w-12 h-12 rounded-full ${bgColor} flex items-center justify-center`}
      >
        {renderIcon()}
      </div>
      <div className="flex-1">
        <h4 className="text-sm font-medium text-gray-900">{title}</h4>
        <p className="text-sm text-gray-600 mt-1">{children}</p>
      </div>
      {type !== "loading" && (
        <button
          onClick={onClose}
          className="flex-shrink-0 text-gray-400 hover:text-gray-600 cursor-pointer"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      )}
    </div>
  );
};

export default CustomNotification;