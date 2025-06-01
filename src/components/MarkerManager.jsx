import React, { useState, useRef, useEffect } from "react";
import { useMap, useMapEvents } from "react-leaflet";
import { useNavigate } from "react-router-dom";
import L from "leaflet";
import Popup from "./Popup";
import PreviewMarker from "./PreviewMarker";
import PlaceMarkers from "./PlaceMarker";
import useFilteredPlaces from "../hooks/useFilteredPlaces";
import useCustomMarkers from "../hooks/useCustomMarkers";
import { isAuthenticated } from "../utils/authUtils";
import ConfirmDialog from "./ConfirmDialog";

const MarkerManager = ({
  places,
  searchQuery = "",
  activeFilters = [],
  isSearchActive = false,
  onDestinationSelect, // New prop for selecting destination
}) => {
  const [previewPosition, setPreviewPosition] = useState(null);
  const [popupPosition, setPopupPosition] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [justClosedPopup, setJustClosedPopup] = useState(false);
  const authDialogRef = useRef(null);
  const [showAuthDialog, setShowAuthDialog] = useState(false);

  const map = useMap();
  const navigate = useNavigate();

  const { filteredPlaces } = useFilteredPlaces(
    places,
    searchQuery,
    activeFilters,
    isSearchActive,
    map
  );
  useCustomMarkers(
    filteredPlaces,
    map,
    isSearchActive,
    searchQuery,
    handleMarkerClick
  );

  function handleMarkerClick(e, place) {
    L.DomEvent.stopPropagation(e);
    const latlng = L.latLng(place.latitude, place.longitude);

    flyToLocation(latlng);
    openPopup(latlng, place);
    if (onDestinationSelect) {
      onDestinationSelect({ lat: place.latitude, lng: place.longitude });
    }
  }

  const flyToLocation = (latlng) => {
    map.flyTo(latlng, 16, {
      animate: true,
      duration: 0.5,
    });
  };

  const openPopup = (latlng, place = null) => {
    const pixelPosition = map.latLngToContainerPoint(latlng);
    setPopupPosition({
      latlng: latlng,
      pixel: {
        x: pixelPosition.x,
        y: pixelPosition.y,
      },
    });

    setIsPopupOpen(true);
    setSelectedPlace(place);
    setPreviewPosition(place ? null : latlng);
  };

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
    },
  });

  const handleAddPlace = (e) => {
    e.stopPropagation();

    if (isAuthenticated()) {
      if (previewPosition) {
        navigate("/tambah-tempat", { state: { position: previewPosition } });
      } else {
        navigate("/tambah-tempat");
      }
    } else {
      setShowAuthDialog(true);
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

  const handleLogin = () => {
    setShowAuthDialog(false);
    navigate("/login");
  };

  const handleCancelAuth = () => {
    setShowAuthDialog(false);
  };

  useEffect(() => {
    if (!popupPosition) return;

    const updatePopupPosition = () => {
      const newPixelPos = map.latLngToContainerPoint(popupPosition.latlng);
      setPopupPosition((prev) => ({
        ...prev,
        pixel: {
          x: newPixelPos.x,
          y: newPixelPos.y,
        },
      }));
    };

    map.on("zoom", updatePopupPosition);
    map.on("move", updatePopupPosition);

    return () => {
      map.off("zoom", updatePopupPosition);
      map.off("move", updatePopupPosition);
    };
  }, [map, popupPosition]);

  useEffect(() => {
    return () => {
      if (window.popupCloseTimeout) {
        clearTimeout(window.popupCloseTimeout);
      }
    };
  }, []);

  return (
    <>
      {previewPosition && <PreviewMarker position={previewPosition} />}

      {!isSearchActive && (
        <PlaceMarkers
          places={filteredPlaces}
          onMarkerClick={handleMarkerClick}
        />
      )}

      {isPopupOpen && popupPosition && (
        <Popup
          selectedPlace={selectedPlace}
          popupPosition={popupPosition}
          handleClosePopup={handleClosePopup}
          handleAddPlace={handleAddPlace}
          handleViewDetail={handleViewDetail}
        />
      )}

      {showAuthDialog && (
        <ConfirmDialog
          ref={authDialogRef}
          isOpen={showAuthDialog}
          onConfirm={handleLogin}
          onCancel={handleCancelAuth}
          message="Harap login untuk mengakses konten ini. Ingin masuk sekarang?"
          confirmLabel="Masuk"
          cancelLabel="Batal"
          confirmColor="text-[#3C91E6]"
          cancelColor="text-red-500"
        />
      )}
    </>
  );
};

export default MarkerManager;
