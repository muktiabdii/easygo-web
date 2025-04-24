import React, { useState } from 'react'

const filterOptions = [
  { label: "Lift Braille & Suara", icon: "/icons/lift.png" },
  { label: "Interpreter Isyarat", icon: "/icons/interpreter.png" },
  { label: "Jalur Kursi Roda", icon: "/icons/kursi-roda.png" },
  { label: "Pintu Otomatis", icon: "/icons/pintu.png" },
  { label: "Parkir Disabilitas", icon: "/icons/parkir.png" },
  { label: "Toilet Disabilitas", icon: "/icons/toilet.png" },
  { label: "Jalur Guiding Block", icon: "/icons/guiding-block.png" },
  { label: "Menu Braille", icon: "/icons/menu-braille.png" },
]

const Navbar = ({ onSearchChange }) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [selectedFilters, setSelectedFilters] = useState([])

  const toggleFilter = () => setIsFilterOpen(!isFilterOpen)

  const handleCheckboxChange = (label) => {
    setSelectedFilters((prev) =>
      prev.includes(label)
        ? prev.filter((item) => item !== label)
        : [...prev, label]
    )
  }

  return (
    <>
      {isFilterOpen && (
        <div
          className="fixed inset-0 backdrop-blur-sm bg-white/5 z-40"
          onClick={toggleFilter}
        />
      )}

      <div
        className={`fixed top-0 left-0 h-full w-72 bg-[#3C91E6] text-white z-50 shadow-lg transform transition-transform duration-300 ${
          isFilterOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-4">
          <div className="flex items-center mb-4">
            <img src="/icons/filter.png" alt="Filter" className="h-6 w-6 mr-2" />
            <span className="font-semibold text-lg">Filter Aksesibilitas</span>
          </div>

          <div className="space-y-1 max-h-[calc(100vh-100px)] overflow-y-auto">
            {filterOptions.map((filter) => (
              <label
                key={filter.label}
                className="flex items-center justify-between p-2 rounded-md cursor-pointer hover:bg-[#357FCC] transition-colors duration-200"
              >
                <div className="flex items-center space-x-3">
                  <img src={filter.icon} alt={filter.label} className="h-6 w-6" />
                  <span className="text-sm">{filter.label}</span>
                </div>
                <input
                  type="checkbox"
                  checked={selectedFilters.includes(filter.label)}
                  onChange={() => handleCheckboxChange(filter.label)}
                />
              </label>
            ))}
          </div>
        </div>
      </div>

      <nav className="bg-transparent p-4 flex items-center justify-between w-full">
        <div className="flex items-center space-x-4">
          <button onClick={toggleFilter}>
            <img
              src="/icons/filter-bt.png"
              alt="Filter"
              className="h-10 w-10 object-contain"
            />
          </button>

          <img src="/logo.png" alt="EasyGo Logo" className="h-10" />

          <div className="relative ml-4 w-100">
            <input
              type="text"
              placeholder="Cari fasilitas aksesibilitas.."
              className="w-full pl-4 pr-20 py-2 bg-white rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#3C91E6]"
              onChange={onSearchChange}
            />
            <img
              src="/icons/search.png"
              alt="Search"
              className="absolute right-10 top-2.5 h-5 w-5 text-gray-500"
            />
            <img
              src="/icons/mic.png"
              alt="Mic"
              className="absolute right-3 top-2.5 h-5 w-5 text-gray-500"
            />
          </div>
        </div>

        <div className="flex items-center space-x-6">
          <button className="text-white bg-[#3C91E6] px-8 py-2 rounded-full text-sm">Tentang</button>
          <button className="text-white bg-[#3C91E6] px-8 py-2 rounded-full text-sm">Pedoman</button>
          <img src="/icons/user.png" alt="User" className="h-10 w-10 object-contain" />
        </div>
      </nav>
    </>
  )
}

export default Navbar
