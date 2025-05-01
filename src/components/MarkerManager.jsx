import React, { useState, useRef, useEffect } from 'react';
import { useMap, useMapEvents } from 'react-leaflet';
import { useNavigate } from 'react-router-dom';
import L from 'leaflet';
import '../MarkerStyles.css';
import Popup from './Popup';
import PreviewMarker from './PreviewMarker';
import PlaceMarkers from './PlaceMarker';
import useFilteredPlaces from '../hooks/useFilteredPlaces';
import useCustomMarkers from '../hooks/useCustomMarkers';

const MarkerManager = ({ places, searchQuery = '', activeFilters = [], isSearchActive = false }) => {
  const [previewPosition, setPreviewPosition] = useState(null);
  const [popupPosition, setPopupPosition] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [justClosedPopup, setJustClosedPopup] = useState(false);
  
  const map = useMap();
  const navigate = useNavigate();
  
  // Custom hooks
  const { filteredPlaces } = useFilteredPlaces(places, searchQuery, activeFilters, isSearchActive, map);
  useCustomMarkers(filteredPlaces, map, isSearchActive, searchQuery, handleMarkerClick);

  function handleMarkerClick(e, place) {
    L.DomEvent.stopPropagation(e);
    const latlng = L.latLng(place.latitude, place.longitude);
    
    flyToLocation(latlng);
    openPopup(latlng, place);
  }

  const flyToLocation = (latlng) => {
    map.flyTo(latlng, 16, { 
      animate: true,
      duration: 0.5 
    });
  };

  const openPopup = (latlng, place = null) => {
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
    setPreviewPosition(place ? null : latlng);
  };

  // Map click events
  useMapEvents({
    click(e) {
      if (isPopupOpen) return;
      if (justClosedPopup) {
        setJustClosedPopup(false);
        return;
      }
      
      const latlng = e.latlng;
      flyToLocation(latlng);
      openPopup(latlng);
    }
  });

  const handleAddPlace = (e) => {
    e.stopPropagation();
    if (previewPosition) {
      navigate('/tambah-tempat', { state: { position: previewPosition } });
    }
  };

  const handleClosePopup = (e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    
    setJustClosedPopup(true);
    
    if (window.popupCloseTimeout) {
      clearTimeout(window.popupCloseTimeout);
    }
    
    window.popupCloseTimeout = setTimeout(() => {
      setJustClosedPopup(false);
    }, 300); 
    
    setPreviewPosition(null);
    setPopupPosition(null);
    setIsPopupOpen(false);
    setSelectedPlace(null);
  };

  const handleViewDetail = (e) => {
    e.stopPropagation();
    if (selectedPlace) {
      navigate("/place-detail", { state: { placeName: selectedPlace.name } });
    }
  };

  // Update popup position on map movement
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

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (window.popupCloseTimeout) {
        clearTimeout(window.popupCloseTimeout);
      }
    };
  }, []);

  return (
    <>
      {/* Preview marker for adding new places */}
      {previewPosition && <PreviewMarker position={previewPosition} />}

      {/* Regular place markers */}
      {!isSearchActive && (
        <PlaceMarkers 
          places={filteredPlaces} 
          onMarkerClick={handleMarkerClick} 
        />
      )}

      {/* Popup component */}
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