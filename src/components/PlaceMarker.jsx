import React from 'react';
import { Marker } from 'react-leaflet';
import L from 'leaflet';

const PlaceMarker = ({ places, onMarkerClick }) => {
  const blueMarkerIcon = new L.Icon({
    iconUrl: 'icons/blue_marker.png',
    iconSize: [45, 45],
    iconAnchor: [22, 45],
  });

  return (
    <>
      {places.map((place, idx) => (
        <Marker
          key={`place-marker-${place.id || idx}`}
          position={[place.latitude, place.longitude]}
          icon={blueMarkerIcon}
          eventHandlers={{
            click: (e) => onMarkerClick(e, place)
          }}
        />
      ))}
    </>
  );
};

export default PlaceMarker;