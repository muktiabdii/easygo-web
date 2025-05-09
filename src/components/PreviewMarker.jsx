import React from 'react';
import { Marker } from 'react-leaflet';
import L from 'leaflet';

const PreviewMarker = ({ position }) => {
  const redMarkerIcon = new L.Icon({
    iconUrl: 'icons/red_marker.png',
    iconSize: [45, 45],
    iconAnchor: [22, 45],
  });

  return <Marker position={position} icon={redMarkerIcon} />;
};

export default PreviewMarker;
