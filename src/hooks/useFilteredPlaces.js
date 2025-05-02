import { useState, useEffect } from 'react';
import L from 'leaflet';

const useFilteredPlaces = (places, searchQuery, activeFilters, isSearchActive, map) => {
  const [filteredPlaces, setFilteredPlaces] = useState([]);

  useEffect(() => {
    if (!places) return;
    
    if (isSearchActive || (activeFilters && activeFilters.length > 0)) {
      let filtered = [...places];
      
      if (searchQuery && searchQuery.trim() !== '' && isSearchActive) {
        filtered = filterPlacesBySearchQuery(filtered, searchQuery);
      }
      
      if (activeFilters && activeFilters.length > 0) {
        filtered = filterPlacesByFilters(filtered, activeFilters);
      }
      
      setFilteredPlaces(filtered);
      
      if (filtered.length > 0 && isSearchActive) {
        fitMapToBounds(filtered, map);
      }
    } else {
      setFilteredPlaces(places);
    }
  }, [places, searchQuery, activeFilters, isSearchActive, map]);

  return { filteredPlaces };
};

// Utility functions
const filterPlacesBySearchQuery = (places, searchQuery) => {
  const query = searchQuery.toLowerCase();
  return places.filter(place => {
    if (place.name && place.name.toLowerCase().includes(query)) return true;
    if (place.address && place.address.toLowerCase().includes(query)) return true;
    if (place.description && place.description.toLowerCase().includes(query)) return true;
    
    const accessibilityTerms = {
      'kursi roda': ['jalur kursi roda', 'ramp', 'wheelchair'],
      'disabilitas': ['disabilitas', 'disability', 'difabel'],
      'braille': ['braille', 'tuna netra', 'blind'],
      'toilet': ['toilet disabilitas', 'accessible toilet'],
      'parkir': ['parkir disabilitas', 'accessible parking'],
      'lift': ['lift braille', 'lift suara', 'elevator'],
      'isyarat': ['interpreter isyarat', 'sign language'],
      'guiding': ['guiding block', 'jalur guiding']
    };
    
    if (place.facilities && place.facilities.length > 0) {
      for (const [term, keywords] of Object.entries(accessibilityTerms)) {
        if (query.includes(term)) {
          return place.facilities.some(facility => 
            keywords.some(keyword => 
              facility.name.toLowerCase().includes(keyword)
            )
          );
        }
      }
      return place.facilities.some(facility => 
        facility.name.toLowerCase().includes(query)
      );
    }
    return false;
  });
};

const filterPlacesByFilters = (places, activeFilters) => {
  return places.filter(place => {
    if (!place.facilities || place.facilities.length === 0) return false;
    return activeFilters.some(filterLabel => {
      const facilityPatterns = {
        "Lift Braille & Suara": ["lift", "braille", "suara"],
        "Interpreter Isyarat": ["interpreter", "isyarat", "sign language"],
        "Jalur Kursi Roda": ["kursi roda", "wheelchair", "ramp"],
        "Pintu Otomatis": ["pintu otomatis", "automatic door"],
        "Parkir Disabilitas": ["parkir", "disabilitas", "parking"],
        "Toilet Disabilitas": ["toilet", "disabilitas"],
        "Jalur Guiding Block": ["guiding block", "jalur"],
        "Menu Braille": ["menu", "braille"]
      };
      const patterns = facilityPatterns[filterLabel] || [];
      return place.facilities.some(facility => 
        patterns.some(pattern => 
          facility.name.toLowerCase().includes(pattern)
        )
      );
    });
  });
};

const fitMapToBounds = (places, map) => {
  const bounds = L.latLngBounds(places.map(place => [place.latitude, place.longitude]));
  if (bounds.isValid()) {
    map.fitBounds(bounds, { padding: [50, 50] });
  }
};

export default useFilteredPlaces;

