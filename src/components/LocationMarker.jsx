import React, { useState } from 'react';
import { Marker, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';

const customLocationIcon = new L.Icon({
  iconUrl: '/icons/mylocation.png',
  iconSize: [80, 80],
});

const LocationMarker = ({ onLocationFound }) => {
  const [position, setPosition] = useState(null);
  const map = useMap();

  useMapEvents({
    locationfound(e) {
      setPosition(e.latlng);
      map.flyTo(e.latlng, map.getZoom());
      if (onLocationFound) {
        onLocationFound({ lat: e.latlng.lat, lng: e.latlng.lng });
      }
    },
  });

  const locateUser = () => {
    map.locate({ setView: true, maxZoom: 16, watch: true });
  };

  return position === null ? null : (
    <Marker position={position} icon={customLocationIcon} />
  );
};

export default LocationMarker;