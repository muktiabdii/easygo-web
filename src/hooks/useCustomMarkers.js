import { useRef, useEffect } from 'react';
import L from 'leaflet';

const useCustomMarkers = (filteredPlaces, map, isSearchActive, searchQuery, onMarkerClick) => {
  const customMarkersRef = useRef({});

  useEffect(() => {
    Object.values(customMarkersRef.current).forEach(marker => {
      if (marker && marker.remove) {
        marker.remove();
      }
    });
    customMarkersRef.current = {};

    if (!map || !filteredPlaces) return;

    const isSearchResult = isSearchActive && searchQuery && searchQuery.trim() !== '';
    
    if (isSearchResult) {
      filteredPlaces.forEach((place, idx) => {
        const markerKey = `custom-marker-${place.id || idx}`;
        const marker = createCustomMarker(place, map, (e) => {
          onMarkerClick(e, place);
        });
        customMarkersRef.current[markerKey] = marker;
      });
    }
    
    return () => {
      Object.values(customMarkersRef.current).forEach(marker => {
        if (marker && marker.remove) {
          marker.remove();
        }
      });
      customMarkersRef.current = {};
    };
  }, [filteredPlaces, map, isSearchActive, searchQuery, onMarkerClick]);
};

const createCustomMarker = (place, map, onClick) => {

  const markerEl = document.createElement('div');
  markerEl.className = 'custom-marker-container';
  
  const tooltipEl = document.createElement('div');
  tooltipEl.className = 'custom-tooltip-container';
  
  const tooltipContent = document.createElement('div');
  tooltipContent.className = 'custom-tooltip-content';
  
  const iconContainer = document.createElement('div');
  iconContainer.className = 'app-icon';
  const appLogo = document.createElement('img');
  appLogo.src = 'icons/logo-easygo.png';
  iconContainer.appendChild(appLogo);
  
  const placeNameEl = document.createElement('div');
  placeNameEl.className = 'place-name';
  placeNameEl.textContent = place.name;
  
  const pointerEl = document.createElement('div');
  pointerEl.className = 'tooltip-pointer';
  
  tooltipContent.appendChild(iconContainer);
  tooltipContent.appendChild(placeNameEl);
  tooltipEl.appendChild(tooltipContent);
  tooltipEl.appendChild(pointerEl);
  
  markerEl.appendChild(tooltipEl);
  
  const customIcon = L.divIcon({
    html: markerEl,
    className: 'custom-div-icon',
    iconSize: [12, 12],
    iconAnchor: [0, 0]
  });
  
  const marker = L.marker([place.latitude, place.longitude], {
    icon: customIcon,
    interactive: true,
    zIndexOffset: 1000
  }).addTo(map);
  
  marker.on('click', (e) => {
    L.DomEvent.stopPropagation(e);
    onClick(e, place);
  });
  
  return marker;
};

export default useCustomMarkers;