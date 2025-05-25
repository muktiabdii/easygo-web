import React from "react";

const CustomDropdown = ({
  isOpen,
  toggle,
  selected,
  options,
  onSelect,
  className = "",
  placeholder = "",
}) => (
  <div className={`relative ${className}`}>
    <button
      onClick={toggle}
      className="bg-white/70 border-2 border-[#c3c7e2] rounded-2xl px-4 py-3 text-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#3C91E6] focus:border-transparent transition-all duration-200 hover:shadow-lg flex items-center justify-between w-full min-w-[140px]"
    >
      <span className="text-gray-700">{selected || placeholder}</span>
      <svg
        className={`w-4 h-4 text-[#979fcd] transition-transform duration-200 ${
          isOpen ? "rotate-180" : ""
        }`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 9l-7 7-7-7"
        />
      </svg>
    </button>

    {isOpen && (
      <div className="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 py-2 z-[60] max-h-60 overflow-y-auto">
        {options.map((option, index) => (
          <button
            key={index}
            onClick={() => onSelect(option)}
            className={`block w-full text-left px-4 py-3 text-sm cursor-pointer transition-all duration-200 hover:bg-[#EFF0F7] hover:text-[#3C91E6] ${
              selected === option
                ? "bg-[#3C91E6]/10 text-[#3C91E6] font-medium"
                : "text-gray-700"
            }`}
          >
            {option}
          </button>
        ))}
      </div>
    )}
  </div>
);

export default CustomDropdown;