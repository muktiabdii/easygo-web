import React, { useState, useRef, useEffect } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import Navbar from '../components/Navbar';
import MarkerManager from '../components/MarkerManager';
import LocationMarker from '../components/LocationMarker';
import FloatingActionButton from '../components/FloatingActionButton';
import LoadingIndicator from '../components/LoadingIndicator'; 

const Dashboard = () => {
  const [places, setPlaces] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [activeFilters, setActiveFilters] = useState([]);
  const [isLoading, setIsLoading] = useState(true); 
  const mapRef = useRef(null);

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        setIsLoading(true); 
        const response = await fetch('http://127.0.0.1:8000/api/places');
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
      mapRef.current.locate({ setView: true, maxZoom: 16, watch: true });
    }
  };

  const handleSearchInput = (e) => {
    setSearchQuery(e.target.value);
    if (e.target.value === '') {
      setIsSearchActive(false);
    }
  };

  const handleSearchSubmit = () => {
    setIsSearchActive(true);
  };

  const handleFilterChange = (selectedFilters) => {
    setActiveFilters(selectedFilters);
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
        onFilterChange={handleFilterChange}
        hideBackground={true}
      />

      <div className="w-full h-full">
        <MapContainer
          center={[-7.982298, 112.630783]}
          zoom={12}
          scrollWheelZoom={true}
          className="w-full h-full"
          zoomControl={false}
          ref={mapRef}
        >
          <TileLayer
            attribution='© <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <MarkerManager
            places={places}
            searchQuery={searchQuery}
            isSearchActive={isSearchActive}
            activeFilters={activeFilters}
          />
          <LocationMarker />
        </MapContainer>
      </div>

      <FloatingActionButton onLocateUser={handleLocateUser} />
    </div>
  );
};

export default Dashboard;