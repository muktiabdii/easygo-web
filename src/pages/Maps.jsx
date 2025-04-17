import React, { useState, useRef, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Circle, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useNavigate } from 'react-router-dom';

// Ikon kustom untuk marker lokasi saat ini
const customLocationIcon = new L.Icon({
  iconUrl: '/mylocation.png', // Path ke file PNG Anda
  iconSize: [80, 80], // Ukuran ikon (lebar, tinggi)
});

// Komponen untuk menangani lokasi pengguna dan centering peta
const LocationMarker = () => {
  const [position, setPosition] = useState(null);
  const [accuracy, setAccuracy] = useState(0);
  const map = useMap();

  const locateUser = () => {
    map.locate({ setView: true, maxZoom: 16, watch: true }); // Aktifkan mode watch untuk pelacakan real-time
  };

  useMapEvents({
    locationfound(e) {
      setPosition(e.latlng);
      setAccuracy(e.accuracy);
      map.flyTo(e.latlng, map.getZoom()); // Pindahkan peta ke posisi pengguna
    }
  });

  return position === null ? null : (
    <>
      <Marker
        position={position}
        icon={customLocationIcon} // Gunakan ikon kustom
      />
    </>
  );
};

// Komponen untuk mengelola marker dan popup
const MarkerManager = ({ onAddMarker }) => {
  const [previewPosition, setPreviewPosition] = useState(null);
  const [popupPosition, setPopupPosition] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const map = useMap();
  const markerRef = useRef(null);
  const navigate = useNavigate();

  useMapEvents({
    click(e) {
      if (!isPopupOpen) {
        const pixelPosition = map.latLngToContainerPoint(e.latlng);
        setPreviewPosition(e.latlng);
        setPopupPosition({
          latlng: e.latlng,
          pixel: {
            x: pixelPosition.x,
            y: pixelPosition.y
          }
        });
        setIsPopupOpen(true);
      }
    }
  });

  const handleAddPlace = (e) => {
    e.stopPropagation();
    if (previewPosition) {
      navigate('/tambah-tempat', { state: { position: previewPosition } });
    }
  };

  const handleClosePopup = (e) => {
    e.stopPropagation();
    setPreviewPosition(null);
    setPopupPosition(null);
    setIsPopupOpen(false);
  };

  useEffect(() => {
    if (!popupPosition) return;

    const updatePopupPosition = () => {
      const newPixelPos = map.latLngToContainerPoint(popupPosition.latlng);
      setPopupPosition(prev => ({
        ...prev,
        pixel: {
          x: newPixelPos.x,
          y: newPixelPos.y
        }
      }));
    };

    map.on('zoom', updatePopupPosition);
    map.on('move', updatePopupPosition);

    return () => {
      map.off('zoom', updatePopupPosition);
      map.off('move', updatePopupPosition);
    };
  }, [map, popupPosition]);

  return (
    <>
      {previewPosition && (
        <Marker
          position={previewPosition}
          icon={new L.Icon({
            iconUrl: '/red_marker.png',
            iconSize: [45, 45],
            iconAnchor: [22, 45],
          })}
          ref={markerRef}
        />
      )}

      {popupPosition && (
        <div
          className="absolute z-[1000] bg-white p-4 rounded-xl shadow-lg text-sm"
          style={{
            left: `${popupPosition.pixel.x + 30}px`,
            top: `${popupPosition.pixel.y - 90}px`,
            width: '220px',
          }}
        >
          <button
            className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
            onClick={handleClosePopup}
            style={{ fontSize: '16px', width: '20px', height: '20px', lineHeight: '18px', cursor: 'pointer' }}
          >
            ×
          </button>

          <p className="font-semibold m-0">Tempat ini belum ada di EasyGo</p>
          <p className="mt-1 mb-3">Ingin menambahkannya?</p>
          <button
            onClick={handleAddPlace}
            className="text-blue-600 font-medium underline"
            style={{ cursor: 'pointer' }}
          >
            + Tambah Tempat
          </button>
        </div>
      )}
    </>
  );
};

// Komponen utama Maps
const Maps = () => {
  const [addedMarkers, setAddedMarkers] = useState([]);
  const mapRef = useRef(null);
  const locationButtonRef = useRef(null);

  useEffect(() => {
    const tempatList = JSON.parse(localStorage.getItem('tempatList')) || [];
    const positions = tempatList.map(tempat => tempat.position);
    setAddedMarkers(positions);
  }, []);

  const handleAddMarker = (position) => {
    setAddedMarkers([...addedMarkers, position]);
  };

  const handleLocateUser = () => {
    if (mapRef.current) {
      mapRef.current.locate({ setView: true, maxZoom: 16, watch: true }); // Aktifkan mode watch
    }
  };

  return (
    <div className="w-full h-screen relative">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-[1000] flex items-center p-3 gap-2">
        <div className="flex items-center">
          <div className="bg-blue-500 rounded-full p-2 mr-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z"/>
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-blue-500">EasyGo</h1>
        </div>

        <div className="flex-1 relative ml-2 mr-2">
          <div className="flex items-center bg-white rounded-full shadow-md px-3 py-2">
            <input
              type="text"
              placeholder="Cari fasilitas aksebilitas..."
              className="flex-1 bg-transparent border-none outline-none"
            />
            <button className="text-gray-500 mr-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </button>
            <button className="text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
                <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                <line x1="12" y1="19" x2="12" y2="23"></line>
                <line x1="8" y1="23" x2="16" y2="23"></line>
              </svg>
            </button>
          </div>
        </div>

        <div className="flex gap-2">
          <button className="bg-blue-500 text-white px-3 py-2 rounded-md">Pedoman</button>
          <button className="bg-blue-500 text-white px-3 py-2 rounded-md">Tentang</button>
          <div className="w-8 h-8 rounded-full bg-gray-300 overflow-hidden">
            <img src="/profile-placeholder.png" alt="Profile" className="w-full h-full object-cover" />
          </div>
        </div>
      </div>

      {/* Main Map Container */}
      <div className="w-full h-full">
        <MapContainer
          center={[-7.982298, 112.630783]}
          zoom={15}
          scrollWheelZoom={true}
          className="w-full h-full"
          zoomControl={false} // Nonaktifkan kontrol zoom bawaan
          ref={mapRef}
        >
          <TileLayer
            attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <MarkerManager onAddMarker={handleAddMarker} />
          <LocationMarker />

          {addedMarkers.map((position, idx) => (
            <Marker
              key={`added-marker-${idx}`}
              position={position}
              icon={new L.Icon({
                iconUrl: '/blue_marker.png',
                iconSize: [45, 45],
                iconAnchor: [22, 45],
              })}
            />
          ))}
        </MapContainer>
      </div>

      {/* Floating Action Buttons */}
      <div className="absolute bottom-6 right-6 flex flex-col gap-3 z-[1000]">
        <button
          onClick={handleLocateUser}
          className="w-12 h-12 rounded-full bg-blue-500 text-white flex items-center justify-center shadow-lg"
          ref={locationButtonRef}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <circle cx="12" cy="12" r="1"></circle>
            <line x1="12" y1="2" x2="12" y2="22"></line>
            <line x1="2" y1="12" x2="22" y2="12"></line>
          </svg>
        </button>
        <button className="w-12 h-12 rounded-full bg-blue-500 text-white flex items-center justify-center shadow-lg">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Maps;