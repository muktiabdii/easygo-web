import React, { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet-routing-machine';

const RoutingMachine = ({ start, end, onRouteFound }) => {
  const map = useMap();

  useEffect(() => {
    if (!start || !end) return;

    const routingControl = L.Routing.control({
      waypoints: [
        L.latLng(start.lat, start.lng),
        L.latLng(end.lat, end.lng),
      ],
      routeWhileDragging: true,
      lineOptions: {
        styles: [{ color: '#3C91E6', weight: 4 }],
      },
      show: false, 
      addWaypoints: false,
      fitSelectedRoutes: true,
      showAlternatives: false,
      createMarker: () => null,
      collapsible: false,
      hide: true, 
    }).addTo(map);

    setTimeout(() => {
      const container = routingControl.getContainer();
      if (container) {
        container.style.display = 'none';
      }
    }, 100);

    routingControl.on('routesfound', (e) => {
      const route = e.routes[0];
      const distance = (route.summary.totalDistance / 1000).toFixed(2);
      if (onRouteFound) {
        onRouteFound({ distance });
      }
    });

    return () => {
      map.removeControl(routingControl);
    };
  }, [map, start, end, onRouteFound]);

  return null;
};

export default RoutingMachine;