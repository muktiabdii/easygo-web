import React, { useState, useRef, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Circle, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useNavigate } from 'react-router-dom';

const customLocationIcon = new L.Icon({
  iconUrl: 'icons/mylocation.png', 
  iconSize: [80, 80], 
});

const LocationMarker = () => {
  const [position, setPosition] = useState(null);
  const [accuracy, setAccuracy] = useState(0);
  const map = useMap();

  const locateUser = () => {
    map.locate({ setView: true, maxZoom: 16, watch: true }); 
  };

  useMapEvents({
    locationfound(e) {
      setPosition(e.latlng);
      setAccuracy(e.accuracy);
      map.flyTo(e.latlng, map.getZoom());
    }
  });

  return position === null ? null : (
    <>
      <Marker
        position={position}
        icon={customLocationIcon} 
      />
    </>
  );
};

const MarkerManager = ({ onAddMarker, places }) => {
  const [previewPosition, setPreviewPosition] = useState(null);
  const [popupPosition, setPopupPosition] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState(null);
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
        setSelectedPlace(null);
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
    setSelectedPlace(null);
  };

  const handleMarkerClick = (e, place) => {
    e.originalEvent.stopPropagation();
    const pixelPosition = map.latLngToContainerPoint(L.latLng(place.latitude, place.longitude));
    setPopupPosition({
      latlng: L.latLng(place.latitude, place.longitude),
      pixel: {
        x: pixelPosition.x,
        y: pixelPosition.y
      }
    });
    setIsPopupOpen(true);
    setSelectedPlace(place);
    setPreviewPosition(null); 
  };

  // Handle view detail click
  const handleViewDetail = (e) => {
    e.stopPropagation();
    console.log('View detail for:', selectedPlace);
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

  const renderRatingStars = (rating = 4.9) => {
    return (
      <div className="flex items-center">
        <div className="text-xl flex text-yellow-400">
          {"★★★★★".split('').map((star, index) => (
            <span key={index}>{star}</span>
          ))}
        </div>
        <span className="text-sm ml-2 text-gray-700 font-medium">{rating}</span>
      </div>
    );
  };

  return (
    <>
      {previewPosition && (
        <Marker
          position={previewPosition}
          icon={new L.Icon({
            iconUrl: 'icons/red_marker.png',
            iconSize: [45, 45],
            iconAnchor: [22, 45],
          })}
          ref={markerRef}
        />
      )}

      {places.map((place, idx) => (
        <Marker
          key={`place-marker-${place.id || idx}`}
          position={[place.latitude, place.longitude]}
          icon={new L.Icon({
            iconUrl: 'icons/blue_marker.png',
            iconSize: [45, 45],
            iconAnchor: [22, 45],
          })}
          eventHandlers={{
            click: (e) => handleMarkerClick(e, place)
          }}
        />
      ))}

      {popupPosition && (
        <div
          className="absolute z-[1000] bg-white rounded-2xl shadow-lg overflow-hidden"
          style={{
            left: `${popupPosition.pixel.x + 30}px`,
            top: `${
              popupPosition.pixel.y - (selectedPlace ? 200 : 100)
            }px`,            
            width: '250px',
            maxWidth: '90vw',
          }}
        >
          <button
            className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 z-10"
            onClick={handleClosePopup}
            style={{ fontSize: '16px', width: '20px', height: '20px', lineHeight: '18px', cursor: 'pointer' }}
          >
            ×
          </button>

          {selectedPlace ? (
            <div>
              {/* Place image */}
              {selectedPlace.images && selectedPlace.images.length > 0 && (
                <div className="w-full h-40 overflow-hidden">
                  <img 
                    src={selectedPlace.images[0].image_url} 
                    alt={selectedPlace.name} 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/placeholder_img.png'; 
                    }}
                  />
                </div>
              )}
              
              <div className="p-4">
                {/* Place name */}
                <h3 className="text-xl font-semibold text-blue-500 mb-2">{selectedPlace.name}</h3>
                
                {/* Rating stars */}
                {renderRatingStars(4.9)}
                
                {/* List Facility */}
                <div className="mt-4 space-y-2">
                  {selectedPlace.facilities && selectedPlace.facilities.map(facility => (
                    <div key={facility.id} className="flex items-center">
                      <span className="text-green-500 mr-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20 6L9 17l-5-5"></path>
                        </svg>
                      </span>
                      <span>{facility.name}</span>
                    </div>
                  ))}
                </div>
                
                {/* Lihat Detail button */}
                <div className="mt-4 text-center">
                  <button
                    onClick={handleViewDetail}
                    className="text-blue-500 font-medium"
                  >
                    Lihat Detail
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-6">
              <p className="font-semibold m-0 text-lg">Tempat ini belum ada di EasyGo</p>
              <p className="text-sm mt-1 mb-3 font-bold">Ingin menambahkannya?</p>
              <button
                onClick={handleAddPlace}
                className="text-sm text-[#3C91E6] block mx-auto mt-6"
                style={{ cursor: 'pointer' }}
              >
                <span className="text-black font-normal">+</span>{' '}
                <span className="underline font-bold">Tambah Tempat</span>
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
};

const Maps = () => {
  const [places, setPlaces] = useState([]);
  const mapRef = useRef(null);
  const locationButtonRef = useRef(null);

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/places');
        if (response.ok) {
          const fetchedPlaces = await response.json();
          setPlaces(fetchedPlaces);
        } else {
          console.error('Failed to fetch places');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };
  
    fetchPlaces();
  }, []);

  const handleLocateUser = () => {
    if (mapRef.current) {
      mapRef.current.locate({ setView: true, maxZoom: 16, watch: true }); 
    }
  };

  return (
    <div className="w-full h-screen relative">

      {/* Main Map Container */}
      <div className="w-full h-full">
        <MapContainer
          center={[-7.982298, 112.630783]}
          zoom={15}
          scrollWheelZoom={true}
          className="w-full h-full"
          zoomControl={false} 
          ref={mapRef}
        >
          <TileLayer
            attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <MarkerManager places={places} />
          <LocationMarker />
        </MapContainer>
      </div>

      {/* Floating Action Buttons */}
      <div className="absolute bottom-10 right-10 flex flex-col gap-3 z-[1000]">
        <button
          onClick={handleLocateUser}
          className="w-16 h-16 rounded-full bg-blue-500 text-white flex items-center justify-center shadow-lg hover:cursor-pointer"
          ref={locationButtonRef}
>
          <img src="icons/synclocation.png" alt="Locate User" className="w-9 h-9" />
        </button>
        <button className="w-16 h-16 rounded-full bg-blue-500 text-white flex items-center justify-center shadow-lg">
        <img src="icons/chat.png" alt="Locate User" className="w-9 h-9" />
        </button>
      </div>
    </div>
  );
};

export default Maps;