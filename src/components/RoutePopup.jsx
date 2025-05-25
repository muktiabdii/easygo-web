import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CustomNotification from "./CustomNotification";

const RoutePopup = ({ onApply, onCancel, currentLocation, places, onLocateUser }) => {
  const [start, setStart] = useState("");
  const [destination, setDestination] = useState("");
  const [currentLocationField, setCurrentLocationField] = useState(null); // Tracks which field uses current location: "start", "destination", or null
  const [startSuggestions, setStartSuggestions] = useState([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState([]);
  const [locationWarning, setLocationWarning] = useState(null);
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    if (currentLocationField === "start" && currentLocation) {
      setStart("Lokasi Sekarang");
    } else if (currentLocationField === "destination" && currentLocation) {
      setDestination("Lokasi Sekarang");
    } else {
      if (currentLocationField !== "start") setStart("");
      if (currentLocationField !== "destination") setDestination("");
    }
  }, [currentLocationField, currentLocation]);

  // Handle toggle change with warning
  const handleToggleLocation = () => {
    console.log("Toggle clicked, currentLocation:", currentLocation);
    if (!currentLocation || currentLocation === undefined) {
      setLocationWarning(
        <span>
          Aktifkan lokasi anda dulu dengan tombol{" "}
          <img
            src="/icons/synclocation-bk.png"
            alt="Location Icon"
            className="h-5 w-5 mx-1 mb-1 inline-block"
          />
          di pojok dashboard
        </span>
      );
      console.log("Setting warning:", locationWarning);
      setTimeout(() => {
        setLocationWarning(null);
        console.log("Clearing warning");
      }, 3000);
      return;
    }
    setCurrentLocationField((prev) => (prev === "start" ? null : "start"));
  };

  // Handle Start input change with suggestions
  const handleStartChange = (e) => {
    const value = e.target.value;
    setStart(value);
    if (currentLocationField === "start" && value !== "Lokasi Sekarang") {
      setCurrentLocationField(null);
    }
    if (value.trim() && currentLocationField !== "start") {
      const matches = places.filter((place) =>
        place.name.toLowerCase().includes(value.toLowerCase())
      );
      setStartSuggestions(matches.slice(0, 5));
    } else {
      setStartSuggestions([]);
    }
  };

  // Handle Destination input change with suggestions
  const handleDestinationChange = (e) => {
    const value = e.target.value;
    setDestination(value);
    if (currentLocationField === "destination" && value !== "Lokasi Sekarang") {
      setCurrentLocationField(null);
    }
    if (value.trim() && currentLocationField !== "destination") {
      const matches = places.filter((place) =>
        place.name.toLowerCase().includes(value.toLowerCase())
      );
      setDestinationSuggestions(matches.slice(0, 5));
    } else {
      setDestinationSuggestions([]);
    }
  };

  // Clear Start input
  const handleClearStart = () => {
    setStart("");
    setStartSuggestions([]);
    setCurrentLocationField((prev) => (prev === "start" ? null : prev));
  };

  // Clear Destination input
  const handleClearDestination = () => {
    setDestination("");
    setDestinationSuggestions([]);
    setCurrentLocationField((prev) => (prev === "destination" ? null : prev));
  };

  // Swap Start and Destination
  const handleSwap = () => {
    if (currentLocationField === "start") {
      // Swap: current location moves to destination
      setStart(destination);
      setDestination("Lokasi Sekarang");
      setCurrentLocationField("destination");
    } else if (currentLocationField === "destination") {
      // Swap: current location moves to start
      setDestination(start);
      setStart("Lokasi Sekarang");
      setCurrentLocationField("start");
    } else {
      // Simple swap of start and destination
      setStart(destination);
      setDestination(start);
    }
  };

  // Handle Apply button
  const handleApply = async () => {
    if (!start.trim() || !destination.trim()) {
      alert("Harap isi Start dan Tujuan.");
      return;
    }

    let startCoords = null;
    let destCoords = null;

    // Resolve Start coordinates
    if (currentLocationField === "start" && start === "Lokasi Sekarang") {
      startCoords = currentLocation;
    } else {
      const matchedStart = places.find(
        (place) => place.name.toLowerCase() === start.toLowerCase()
      );
      if (matchedStart) {
        startCoords = {
          lat: matchedStart.latitude,
          lng: matchedStart.longitude,
        };
      } else {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            start
          )}&countrycodes=ID`
        );
        const results = await response.json();
        if (results.length > 0) {
          startCoords = {
            lat: parseFloat(results[0].lat),
            lng: parseFloat(results[0].lon),
          };
        }
      }
    }

    // Resolve Destination coordinates
    if (currentLocationField === "destination" && destination === "Lokasi Sekarang") {
      destCoords = currentLocation;
    } else {
      const matchedDest = places.find(
        (place) => place.name.toLowerCase() === destination.toLowerCase()
      );
      if (matchedDest) {
        destCoords = { lat: matchedDest.latitude, lng: matchedDest.longitude };
      } else {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            destination
          )}&countrycodes=ID`
        );
        const results = await response.json();
        if (results.length > 0) {
          destCoords = {
            lat: parseFloat(results[0].lat),
            lng: parseFloat(results[0].lon),
          };
        }
      }
    }

    if (!startCoords || !destCoords) {
      alert("Tidak dapat menemukan lokasi untuk Start atau Tujuan.");
      return;
    }

    setIsOpen(false);
    setTimeout(() => {
      onApply(startCoords, destCoords);
    }, 300);
  };

  // Handle Cancel button
  const handleCancel = () => {
    setIsOpen(false);
    setTimeout(() => {
      onCancel();
    }, 300);
  };

  // Animation for the backdrop
  const backdropVariants = {
    hidden: { opacity: 0, backdropFilter: "blur(0px)" },
    visible: {
      opacity: 1,
      backdropFilter: "blur(4px)",
      transition: { duration: 0.3, ease: "easeInOut" },
    },
    exit: {
      opacity: 0,
      backdropFilter: "blur(0px)",
      transition: { duration: 0.3, ease: "easeInOut" },
    },
  };

  // Animation variants for the popup
  const popupVariants = {
    hidden: { y: "100vh", opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.4, ease: "easeOut" },
    },
    exit: {
      y: "100vh",
      opacity: 0,
      transition: { duration: 0.3, ease: "easeIn" },
    },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center z-[1002]"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <motion.div
            className="bg-white rounded-xl p-6 w-100 shadow-lg"
            variants={popupVariants}
          >
            <h2 className="text-2xl font-semibold mb-6 text-[#3C91E6] text-center">
              Atur Rute
            </h2>

            {/* Use My Location Toggle */}
            <div className="flex items-center justify-between mb-4 pl-4 pr-2">
              <label className="text-sm text-gray-700">
                Gunakan lokasi saya saat ini
              </label>
              <button
                onClick={handleToggleLocation}
                className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#3C91E6] ${
                  currentLocationField ? "bg-[#3C91E6]" : "bg-gray-200"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                    currentLocationField ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            {/* Location Warning Notification */}
            {locationWarning && (
              <div className="fixed top-16 left-1/2 transform -translate-x-1/2 z-[1005] max-w-md w-full">
                <CustomNotification
                  title="Peringatan"
                  type="warning"
                  onClose={() => setLocationWarning(null)}
                >
                  {locationWarning}
                </CustomNotification>
              </div>
            )}

            {/* Start Input */}
            <div className="mb-3">
              <div className="relative">
                <input
                  type="text"
                  value={start}
                  onChange={handleStartChange}
                  placeholder="Masukkan lokasi awal"
                  className="w-full p-2 pr-10 border border-[#3C91E6] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#3C91E6]"
                  disabled={currentLocationField === "start"}
                />
                {start && currentLocationField !== "start" && (
                  <button
                    onClick={handleClearStart}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 text-[#3C91E6] hover:text-[#357FCC] focus:outline-none z-[1003] cursor-pointer hover:scale-125 transition-transform"
                  >
                    <img
                      src="/icons/delete_ic.png"
                      alt="Clear Start"
                      className="h-3 w-3"
                    />
                  </button>
                )}
              </div>
              {startSuggestions.length > 0 && currentLocationField !== "start" && (
                <div className="mt-1 bg-white border border-gray-200 rounded-md shadow-sm">
                  {startSuggestions.map((place) => (
                    <div
                      key={place.id}
                      className="p-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                      onClick={() => {
                        setStart(place.name);
                        setStartSuggestions([]);
                      }}
                    >
                      {place.name}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Swap Button */}
            <div className="mb-3">
              <button
                onClick={handleSwap}
                className="w-full h-8 bg-gray-100 rounded-xl hover:bg-gray-200 flex items-center justify-center space-x-2 cursor-pointer"
              >
                <img src="/icons/swap_ic.png" alt="Swap" className="h-4 w-4" />
                <span className="text-sm text-gray-600 font-semibold">Swap</span>
              </button>
            </div>

            {/* Destination Input */}
            <div className="mb-6">
              <div className="relative">
                <input
                  type="text"
                  value={destination}
                  onChange={handleDestinationChange}
                  placeholder="Masukkan tujuan"
                  className="w-full p-2 pr-10 border border-[#3C91E6] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#3C91E6]"
                  disabled={currentLocationField === "destination"}
                />
                {destination && currentLocationField !== "destination" && (
                  <button
                    onClick={handleClearDestination}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 text-[#3C91E6] hover:text-[#357FCC] focus:outline-none z-[1003] cursor-pointer hover:scale-125 transition-transform"
                  >
                    <img
                      src="/icons/delete_ic.png"
                      alt="Clear Destination"
                      className="h-3 w-3"
                    />
                  </button>
                )}
              </div>
              {destinationSuggestions.length > 0 && currentLocationField !== "destination" && (
                <div className="mt-1 bg-white border border-gray-200 rounded-md shadow-sm">
                  {destinationSuggestions.map((place) => (
                    <div
                      key={place.id}
                      className="p-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                      onClick={() => {
                        setDestination(place.name);
                        setDestinationSuggestions([]);
                      }}
                    >
                      {place.name}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Buttons */}
            <div className="flex justify-center space-x-3 mb-4">
              <button
                onClick={handleCancel}
                className="px-8 py-2 bg-gray-200 text-[#E63C3C] font-semibold rounded-xl hover:bg-gray-300 cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={handleApply}
                className="px-4 py-2 bg-[#3C91E6] text-white font-semibold rounded-xl hover:bg-[#357FCC] cursor-pointer"
              >
                Terapkan
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default RoutePopup;