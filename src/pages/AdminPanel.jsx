import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import CustomDropdown from "../components/CustomDropdown";
import DeleteDialog from "../components/DeleteDialog"; // Import the new component
import { logout } from "../utils/authUtils";

const AdminPanel = () => {
  const [pendingPlaces, setPendingPlaces] = useState([]);
  const [filteredPlaces, setFilteredPlaces] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [committedSearchQuery, setCommittedSearchQuery] = useState("");
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const [dateDropdownOpen, setDateDropdownOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("Semua");
  const [selectedDateFilter, setSelectedDateFilter] = useState("Semua Tanggal");
  const [currentPage, setCurrentPage] = useState(1);
  // New state for confirmation dialog
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [placeToDelete, setPlaceToDelete] = useState(null);

  const navigate = useNavigate();
  const statusOptions = ["Semua", "Menunggu", "Disetujui", "Ditolak"];
  const dateOptions = ["Semua Tanggal", "Hari Ini", "Minggu Ini", "Bulan Ini"];
  const placesPerPage = 20;

  // Fetch places
  useEffect(() => {
    const fetchPendingPlaces = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem("auth_header");
        if (!token) {
          throw new Error("Authentication token not found");
        }
        const response = await axios.get(
          "https://easygo-api-production-d477.up.railway.app/api/places/admin",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setPendingPlaces(response.data);
        setFilteredPlaces(response.data);
      } catch (err) {
        setError(err.response?.data?.error || "Failed to fetch places");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPendingPlaces();
  }, []);

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Handle Enter key press for search
  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter") {
      setCommittedSearchQuery(searchQuery.trim());
      setCurrentPage(1);
    }
  };

  // Filter places based on status, date, and committed search query
  useEffect(() => {
    let filtered = [...pendingPlaces];

    const statusMap = {
      Menunggu: "pending",
      Disetujui: "approved",
      Ditolak: "rejected",
    };
    if (selectedStatus && selectedStatus !== "Semua") {
      filtered = filtered.filter(
        (place) => place.status === statusMap[selectedStatus]
      );
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selectedDateFilter !== "Semua Tanggal") {
      filtered = filtered.filter((place) => {
        const createdAt = new Date(place.created_at);
        if (selectedDateFilter === "Hari Ini") {
          return createdAt.toDateString() === today.toDateString();
        } else if (selectedDateFilter === "Minggu Ini") {
          const weekStart = new Date(today);
          weekStart.setDate(today.getDate() - today.getDay());
          return createdAt >= weekStart && createdAt <= today;
        } else if (selectedDateFilter === "Bulan Ini") {
          const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
          return createdAt >= monthStart && createdAt <= today;
        }
        return true;
      });
    }

    if (committedSearchQuery) {
      filtered = filtered.filter((place) =>
        place.name.toLowerCase().includes(committedSearchQuery.toLowerCase())
      );
    }

    setFilteredPlaces(filtered);
    setCurrentPage(1);
  }, [pendingPlaces, selectedStatus, selectedDateFilter, committedSearchQuery]);

  // Handler untuk menyetujui tempat
  const handleApprove = async (id) => {
    try {
      const token = localStorage.getItem("auth_header");
      await axios.put(
        `https://easygo-api-production-d477.up.railway.app/api/places/${id}/approve`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setPendingPlaces(
        pendingPlaces.map((place) =>
          place.id === id ? { ...place, status: "approved" } : place
        )
      );
      setIsModalOpen(false);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to approve place");
    }
  };

  // Handler untuk menolak tempat
  const handleReject = async (id) => {
    try {
      const token = localStorage.getItem("auth_header");
      await axios.put(
        `https://easygo-api-production-d477.up.railway.app/api/places/${id}/reject`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setPendingPlaces(
        pendingPlaces.map((place) =>
          place.id === id ? { ...place, status: "rejected" } : place
        )
      );
      setIsModalOpen(false);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to reject place");
    }
  };

  // Handler untuk menghapus tempat dengan konfirmasi
  const handleDelete = async (id, placeName) => {
    // Show the confirmation dialog
    setPlaceToDelete({ id, placeName });
    setIsConfirmDialogOpen(true);
  };

  // Handler untuk konfirmasi penghapusan
  const confirmDelete = async () => {
    if (!placeToDelete) return;

    try {
      const token = localStorage.getItem("auth_header");
      if (!token) {
        throw new Error("Authentication token not found");
      }
      await axios.delete(
        `https://easygo-api-production-d477.up.railway.app/api/places/${placeToDelete.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setPendingPlaces(
        pendingPlaces.filter((place) => place.id !== placeToDelete.id)
      );
      setFilteredPlaces(
        filteredPlaces.filter((place) => place.id !== placeToDelete.id)
      );
      setIsModalOpen(false);
      setIsConfirmDialogOpen(false);
      setPlaceToDelete(null);
    } catch (err) {
      setError(err.response?.data?.error || "Gagal menghapus tempat");
      setIsConfirmDialogOpen(false);
      setPlaceToDelete(null);
    }
  };

  // Handler untuk membatalkan penghapusan
  const cancelDelete = () => {
    setIsConfirmDialogOpen(false);
    setPlaceToDelete(null);
  };

  // Handler untuk membuka modal detail
  const openDetailModal = (place) => {
    setSelectedPlace(place);
    setIsModalOpen(true);
  };

  // Handler untuk toggle dropdown
  const toggleDropdown = (e) => {
    e.stopPropagation();
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Custom dropdown handlers
  const toggleStatusDropdown = (e) => {
    e.stopPropagation();
    setStatusDropdownOpen(!statusDropdownOpen);
    setDateDropdownOpen(false);
  };

  const toggleDateDropdown = (e) => {
    e.stopPropagation();
    setDateDropdownOpen(!dateDropdownOpen);
    setStatusDropdownOpen(false);
  };

  const selectStatus = (status) => {
    setSelectedStatus(status);
    setStatusDropdownOpen(false);
  };

  const selectDateFilter = (dateFilter) => {
    setSelectedDateFilter(dateFilter);
    setDateDropdownOpen(false);
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".dropdown-container")) {
        setIsDropdownOpen(false);
      }
      if (!event.target.closest(".status-dropdown")) {
        setStatusDropdownOpen(false);
      }
      if (!event.target.closest(".date-dropdown")) {
        setDateDropdownOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // Handler untuk logout
  const handleLogout = async () => {
    setError(null);
    try {
      await logout();
    } catch (err) {
      console.error("HandleLogout error:", err);
      setError(err.message || "Gagal logout. Silakan coba lagi.");
    }
  };

  // Pagination logic
  const totalPages = Math.ceil(filteredPlaces.length / placesPerPage);
  const startIndex = (currentPage - 1) * placesPerPage;
  const endIndex = startIndex + placesPerPage;
  const currentPlaces = filteredPlaces.slice(startIndex, endIndex);

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className="min-h-screen bg-[#EFF0F7]">
      {/* Modern Navbar with Glass Effect */}
      <nav className="bg-[#3C91E6] text-white p-4 shadow-2xl backdrop-blur-lg relative z-10">
        <div className="mx-auto px-6 flex justify-between items-center max-w-7xl">
          <div className="flex items-center space-x-3">
            <img
              src="/icons/icon-easygo.png"
              alt="EasyGo Icon"
              className="h-10 w-8"
            />
            <span className="font-bold text-2xl tracking-wide">
              Admin Dashboard
            </span>
          </div>
          <div className="dropdown-container relative flex items-center space-x-0">
            <div className="bg-white/20 px-4 py-2 rounded-2xl backdrop-blur-sm pr-14">
              <span className="text-sm font-medium">Admin</span>
            </div>
            <div
              className="absolute right-0 w-10 h-10 rounded-2xl bg-white text-[#3C91E6] flex items-center justify-center font-bold cursor-pointer shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              onClick={toggleDropdown}
              role="button"
              aria-label="Admin Profile Menu"
            >
              A
            </div>
            {isDropdownOpen && (
              <div className="absolute right-0 top-13 w-48 bg-white rounded-2xl shadow-2xl py-2 z-[100] border border-gray-100 backdrop-blur-lg">
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-[#EFF0F7] rounded-xl transition-all duration-200"
                >
                  <div className="flex items-center space-x-2">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                      />
                    </svg>
                    <span>Logout</span>
                  </div>
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content with Modern Card Layout */}
      <div className="px-6 py-8 max-w-7xl mx-auto">
        {/* Header Card */}
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl p-8 mb-8 border border-white/20">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-[#3C91E6] to-[#8ab6f6] rounded-2xl flex items-center justify-center">
                <img
                  src="/icons/done_ic.png"
                  alt="Done Icon"
                  className="w-6 h-6 text-white"
                />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800 tracking-tight">
                  Persetujuan Tempat
                </h1>
                <p className="text-[#979fcd] font-medium">
                  Kelola dan setujui tempat dengan ramah disabilitas
                </p>
              </div>
            </div>
            <div className="bg-gradient-to-r from-[#3C91E6] to-[#8ab6f6] text-white px-6 py-3 rounded-2xl shadow-lg">
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {filteredPlaces.filter((p) => p.status === "pending").length}
                </div>
                <div className="text-xs opacity-90">Menunggu Persetujuan</div>
              </div>
            </div>
          </div>
        </div>

        {/* Loading and Error States */}
        {isLoading && (
          <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3C91E6] mx-auto mb-4"></div>
            <p className="text-[#979fcd] font-medium">Memuat data...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50/80 backdrop-blur-lg rounded-3xl shadow-xl p-6 mb-8 border border-red-200/50">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-red-500 rounded-xl flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
              <p className="text-red-700 font-medium">{error}</p>
            </div>
          </div>
        )}

        {/* Filter and Search Card */}
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl p-6 mb-8 border border-white/20 relative overflow-visible z-20">
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div className="flex flex-wrap gap-3">
              <CustomDropdown
                className="status-dropdown"
                isOpen={statusDropdownOpen}
                toggle={toggleStatusDropdown}
                selected={selectedStatus}
                options={statusOptions}
                onSelect={selectStatus}
                placeholder="Pilih Status"
              />
              <CustomDropdown
                className="date-dropdown"
                isOpen={dateDropdownOpen}
                toggle={toggleDateDropdown}
                selected={selectedDateFilter}
                options={dateOptions}
                onSelect={selectDateFilter}
                placeholder="Pilih Tanggal"
              />
            </div>
            <div className="relative">
              <input
                type="text"
                placeholder="Cari nama tempat..."
                value={searchQuery}
                onChange={handleSearchChange}
                onKeyDown={handleSearchKeyDown}
                className="bg-white/70 border-2 border-[#c3c7e2] rounded-2xl pl-12 pr-4 py-3 w-64 focus:outline-none focus:ring-2 focus:ring-[#3C91E6] focus:border-transparent transition-all duration-200 hover:shadow-lg"
                aria-label="Search places by name"
              />
              <div className="absolute left-4 top-3.5">
                <svg
                  className="w-5 h-5 text-[#979fcd]"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Modern Table Card */}
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl overflow-hidden border border-white/20 z-10">
          <div className="overflow-x-auto">
            <table className="w-full table-fixed">
              <thead>
                <tr className="bg-[#EFF0F7]">
                  <th className="w-[50px] py-4 px-4 text-center font-semibold text-gray-700 text-sm rounded-tl-3xl">
                    No.
                  </th>
                  <th className="w-[200px] py-4 px-4 text-center font-semibold text-gray-700 text-sm">
                    Nama Tempat
                  </th>
                  <th className="w-[250px] py-4 px-4 text-center font-semibold text-gray-700 text-sm">
                    Alamat
                  </th>
                  <th className="w-[150px] py-4 px-4 text-center font-semibold text-gray-700 text-sm">
                    Tanggal Submit
                  </th>
                  <th className="w-[100px] py-4 px-4 text-center font-semibold text-gray-700 text-sm">
                    Rating
                  </th>
                  <th className="w-[120px] py-4 px-4 text-center font-semibold text-gray-700 text-sm">
                    Status
                  </th>
                  <th className="w-[100px] py-4 px-4 text-center font-semibold text-gray-700 text-sm rounded-tr-3xl">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100/50">
                {currentPlaces.map((place, index) => (
                  <tr
                    key={place.id}
                    className="hover:bg-gradient-to-r hover:from-[#EFF0F7]/30 hover:to-[#c3c7e2]/30 transition-all duration-300"
                  >
                    <td className="py-4 px-4 text-center text-sm font-medium text-gray-600">
                      <div className="text-center">
                        {startIndex + index + 1}
                      </div>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <div className="text-sm font-semibold text-gray-800 text-left">
                        {place.name}
                      </div>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <div className="text-sm text-gray-600 max-w-xs truncate text-left">
                        {place.address}
                      </div>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <div className="text-sm text-gray-600 bg-[#EFF0F7] px-3 py-1 rounded-xl text-left">
                        {place.created_at.split("T")[0]}
                      </div>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <div className="flex items-center bg-yellow-50 px-3 py-1 rounded-xl w-fit text-left">
                        <span className="text-yellow-500 mr-1">★</span>
                        <span className="text-sm font-medium text-yellow-700">
                          {place.average_rating || "N/A"}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span
                        className={`px-4 py-2 rounded-2xl text-xs font-bold uppercase tracking-wide text-left inline-block ${
                          place.status === "approved"
                            ? "bg-green-100 text-green-800 border border-green-200"
                            : place.status === "rejected"
                            ? "bg-red-100 text-red-800 border border-red-200"
                            : "bg-yellow-100 text-yellow-800 border border-yellow-200"
                        }`}
                      >
                        {place.status === "approved"
                          ? "Disetujui"
                          : place.status === "rejected"
                          ? "Ditolak"
                          : "Menunggu"}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <button
                        className="bg-gradient-to-r from-[#3C91E6] to-[#8ab6f6] text-white px-4 py-2 rounded-2xl text-sm font-medium hover:shadow-lg hover:scale-105 transition-all duration-200 cursor-pointer"
                        onClick={() => openDetailModal(place)}
                      >
                        Detail
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modern Pagination */}
        <div className="flex justify-between items-center mt-8">
          <div className="bg-white backdrop-blur-lg rounded-2xl px-4 py-2 shadow-lg border border-white/20">
            <span className="text-sm text-gray-600">
              Menampilkan {startIndex + 1}-
              {Math.min(endIndex, filteredPlaces.length)} dari{" "}
              {filteredPlaces.length} tempat
            </span>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              className={`w-10 h-10 rounded-2xl border-2 border-[#c3c7e2] bg-white/70 text-[#979fcd] hover:bg-[#3C91E6] hover:text-white hover:border-transparent transition-all duration-200 hover:shadow-lg cursor-pointer ${
                currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {"<"}
            </button>
            <button className="w-10 h-10 rounded-2xl bg-[#3C91E6] text-white font-medium shadow-lg">
              {currentPage}
            </button>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className={`w-10 h-10 rounded-2xl border-2 border-[#c3c7e2] bg-white/70 text-[#979fcd] hover:bg-[#3C91E6] hover:text-white hover:border-transparent transition-all duration-200 hover:shadow-lg cursor-pointer ${
                currentPage === totalPages
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
            >
              {">"}
            </button>
          </div>
        </div>
      </div>

      {/* Modal Detail Tempat */}
      {isModalOpen && selectedPlace && (
        <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900">
                  Detail Tempat
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="transform transition-transform duration-200 hover:scale-125 cursor-pointer"
                  aria-label="Close modal"
                >
                  <img src="/icons/close.png" alt="Close" className="w-7 h-7" />
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <img
                    src={
                      (selectedPlace.images &&
                        selectedPlace.images[0]?.image) ||
                      "/api/placeholder/400/320"
                    }
                    alt={selectedPlace.name}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                  <div className="mt-4 grid grid-cols-4 gap-2">
                    {selectedPlace.images &&
                      selectedPlace.images.map((img, idx) => (
                        <img
                          key={idx}
                          src={img.image}
                          alt="Preview"
                          className="w-full h-20 object-cover rounded"
                        />
                      ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold mb-2 text-gray-900">
                    {selectedPlace.name}
                  </h3>
                  <p className="text-gray-600 mb-4">{selectedPlace.address}</p>

                  <div className="flex items-center mb-4">
                    <span className="text-yellow-500 mr-1">★</span>
                    <span className="text-sm text-gray-700">
                      {selectedPlace.average_rating || "N/A"} / 5.0
                    </span>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-medium mb-2 text-gray-900">
                      Fasilitas:
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedPlace.facilities &&
                        selectedPlace.facilities.map((facility, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-[#F7F8FC] text-[#3C91E6] rounded-full text-sm"
                          >
                            {facility.name}
                          </span>
                        ))}
                    </div>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-medium mb-2 text-gray-900">
                      Ulasan Kontributor:
                    </h4>
                    <p className="text-gray-600 bg-[#F7F8FC] p-3 rounded-xl">
                      {(selectedPlace.ratings &&
                        selectedPlace.ratings[0]?.comment) ||
                        "Tidak ada ulasan"}
                    </p>
                  </div>

                  <div className="mt-4">
                    <h4 className="font-medium mb-2 text-gray-900">
                      Informasi Tambahan:
                    </h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-gray-500">Disubmit oleh:</span>
                        <p className="text-gray-700">
                          {(selectedPlace.ratings &&
                            selectedPlace.ratings[0]?.user_id) ||
                            "Unknown"}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-500">Tanggal Submit:</span>
                        <p className="text-gray-700">
                          {selectedPlace.created_at.split("T")[0]}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 flex justify-end space-x-4">
              <button
                onClick={() =>
                  handleDelete(selectedPlace.id, selectedPlace.name)
                }
                className="px-6 py-2 border border-gray-500 text-gray-500 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
              >
                Hapus
              </button>
              <button
                onClick={() => handleReject(selectedPlace.id)}
                className="px-6 py-2 border border-red-500 text-red-500 rounded-xl hover:bg-red-50 transition-colors cursor-pointer"
              >
                Tolak
              </button>
              <button
                onClick={() => handleApprove(selectedPlace.id)}
                className="px-6 py-2 bg-[#3C91E6] text-white rounded-xl hover:bg-[#2b6cad] transition-colors cursor-pointer"
              >
                Setujui
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Dialog */}
      <DeleteDialog
        isOpen={isConfirmDialogOpen}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
        title="Konfirmasi Hapus"
        message={
          placeToDelete
            ? `Apakah Anda yakin ingin menghapus tempat "${placeToDelete.placeName}"? Tindakan ini tidak dapat dibatalkan.`
            : ""
        }
      />
    </div>
  );
};

export default AdminPanel;
