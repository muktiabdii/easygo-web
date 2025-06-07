import React, { useState, useRef, useEffect } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import { LatLngBounds } from 'leaflet';
import Navbar from '../components/Navbar';
import MarkerManager from '../components/MarkerManager';
import LocationMarker from '../components/LocationMarker';
import FloatingActionButton from '../components/FloatingActionButton';
import LoadingIndicator from '../components/LoadingIndicator';
import RoutingMachine from '../components/RoutingMachine';

const Dashboard = () => {
  const [places, setPlaces] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [activeFilters, setActiveFilters] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [start, setStart] = useState(null);
  const [destination, setDestination] = useState(null);
  const [routeDistance, setRouteDistance] = useState(null);
  const mapRef = useRef(null);

  // Indonesia bounds
  const indonesiaBounds = new LatLngBounds(
    [-11.0, 95.0], // Southwest (Aceh/Andaman)
    [6.0, 141.0]   // Northeast (Papua)
  );

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('http://easygo-api-production-d477.up.railway.app/api/places');
        if (response.ok) {
          const fetchedPlaces = await response.json();
          setPlaces(fetchedPlaces);
        } else {
          console.error('Failed to fetch places');
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlaces();
  }, []);

  const handleLocateUser = () => {
    if (mapRef.current) {
      mapRef.current.locate({ setView: true, maxZoom: 16 });
    }
  };

  const handleSearchInput = (e) => {
    setSearchQuery(e.target.value);
    if (e.target.value === '') {
      setIsSearchActive(false);
    }
  };

  const handleSearchSubmit = () => {
    if (!searchQuery.trim()) return;
    setIsSearchActive(true);
  };

  const handleRouteSubmit = (startCoords, destCoords) => {
    setStart(startCoords);
    setDestination(destCoords);
  };

  const handleClearRoute = () => {
    setStart(null);
    setDestination(null);
    setRouteDistance(null);
    setIsSearchActive(false);
  };

  const handleFilterChange = (selectedFilters) => {
    setActiveFilters(selectedFilters);
  };

  const handleLocationFound = (location) => {
    setCurrentLocation(location);
  };

  const handleRouteFound = ({ distance }) => {
    setRouteDistance(distance);
  };

  const handleDestinationSelect = (coords) => {
    if (currentLocation) {
      setStart(currentLocation);
      setDestination(coords);
    } 
  };

  return (
    <div className="w-full h-screen relative">
      {isLoading && (
        <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-[1000] backdrop-blur-sm">
          <LoadingIndicator />
        </div>
      )}

      <Navbar
        onSearchChange={handleSearchInput}
        onSearchSubmit={handleSearchSubmit}
        onRouteSubmit={handleRouteSubmit}
        onClearRoute={handleClearRoute}
        onFilterChange={handleFilterChange}
        hideBackground={true}
        routeDistance={routeDistance}
        currentLocation={currentLocation}
        places={places}
      />

      <div className="w-full h-full">
        <MapContainer
          center={[-7.982298, 112.630783]}
          zoom={12}
          scrollWheelZoom={true}
          className="w-full h-full"
          zoomControl={false}
          ref={mapRef}
          maxBounds={indonesiaBounds}
          maxBoundsViscosity={1.0}
          minZoom={5}
        >
          <TileLayer
            attribution='© <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            noWrap={true}
            maxNativeZoom={18}
          />
          <MarkerManager
            places={places}
            searchQuery={searchQuery}
            isSearchActive={isSearchActive}
            activeFilters={activeFilters}
            onDestinationSelect={handleDestinationSelect}
          />
          <LocationMarker onLocationFound={handleLocationFound} />
          {start && destination && (
            <RoutingMachine
              start={start}
              end={destination}
              onRouteFound={handleRouteFound}
            />
          )}
        </MapContainer>
      </div>

      <FloatingActionButton onLocateUser={handleLocateUser} />
    </div>
  );
};

export default Dashboard;