import React, { useState, useRef, useEffect } from 'react';
import { Marker, useMap, useMapEvents } from 'react-leaflet';
import { useNavigate } from 'react-router-dom';
import L from 'leaflet';
import Popup from './Popup'; 

const MarkerManager = ({ places }) => {
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
        const latlng = e.latlng;
        setPreviewPosition(latlng);
        
        const pixelPosition = map.latLngToContainerPoint(latlng);
        setPopupPosition({
          latlng: latlng,
          pixel: {
            x: pixelPosition.x,
            y: pixelPosition.y
          }
        });
        
        setIsPopupOpen(true);
        setSelectedPlace(null);
        
        map.flyTo(latlng, 16, { 
          animate: true,
          duration: 0.5 
        });
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
    const latlng = L.latLng(place.latitude, place.longitude);
    
    map.flyTo(latlng, 16, { 
      animate: true,
      duration: 0.5 
    });
  
    const pixelPosition = map.latLngToContainerPoint(latlng);
    setPopupPosition({
      latlng: latlng,
      pixel: {
        x: pixelPosition.x,
        y: pixelPosition.y
      }
    });
    
    setIsPopupOpen(true);
    setSelectedPlace(place);
    setPreviewPosition(null); 
  };

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

      {isPopupOpen && popupPosition && (
        <Popup
          selectedPlace={selectedPlace}
          popupPosition={popupPosition}
          handleClosePopup={handleClosePopup}
          handleAddPlace={handleAddPlace}
          handleViewDetail={handleViewDetail}
        />
      )}
    </>
  );
};

export default MarkerManager;