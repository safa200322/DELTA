import React, { useState, useEffect, useRef } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Input, Label, Spinner } from 'reactstrap';
import 'leaflet/dist/leaflet.css';
import './LocationPickerModal.css';
import L from 'leaflet';

// Fix for default markers in Leaflet with webpack
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const LocationPickerModal = ({ isOpen, toggle, onLocationSelect, title = "Select Location" }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const [selectedAddress, setSelectedAddress] = useState('');
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [mapReady, setMapReady] = useState(false);

  // Default location (Cyprus - Larnaca)
  const defaultLat = 34.9158;
  const defaultLng = 33.6293;

  useEffect(() => {
    console.log('LocationPickerModal useEffect triggered:', { isOpen, mapRefCurrent: !!mapRef.current, mapInstanceRefCurrent: !!mapInstanceRef.current });

    if (!isOpen) {
      // Clean up when modal closes
      if (mapInstanceRef.current) {
        console.log('Cleaning up map instance on modal close');
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        markerRef.current = null;
        setMapReady(false);
      }
      return;
    }

    // If modal is open, try to initialize map with retries
    console.log('Modal is open, attempting to initialize map...');

    let retryCount = 0;
    const maxRetries = 10;
    const retryInterval = 200;

    const tryInitializeMap = () => {
      console.log(`Attempt ${retryCount + 1}: Checking for mapRef...`);

      if (mapRef.current) {
        console.log('mapRef found! Initializing map...');
        initializeMapWithRetry();
        return;
      }

      retryCount++;
      if (retryCount < maxRetries) {
        console.log(`mapRef not available yet, retrying in ${retryInterval}ms...`);
        setTimeout(tryInitializeMap, retryInterval);
      } else {
        console.error('Failed to find mapRef after maximum retries');
      }
    };

    // Start trying to initialize the map
    tryInitializeMap();
  }, [isOpen]);

  const initializeMapWithRetry = () => {
    let timer;

    // Clean up any existing map first
    if (mapInstanceRef.current) {
      console.log('Cleaning up existing map instance');
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
      markerRef.current = null;
    }

    setMapReady(false);

    // Delay to ensure modal is fully rendered
    timer = setTimeout(() => {
      try {
        console.log('Timer fired, checking mapRef again...');
        console.log('Map container:', mapRef.current);

        if (!mapRef.current) {
          console.warn('mapRef still not available after timeout');
          return;
        }

        console.log('Container dimensions:', mapRef.current.offsetWidth, mapRef.current.offsetHeight);

        if (mapRef.current.offsetWidth === 0 || mapRef.current.offsetHeight === 0) {
          console.warn('Map container has zero dimensions, retrying...');
          // Retry after another delay
          setTimeout(() => {
            if (mapRef.current && mapRef.current.offsetWidth > 0) {
              console.log('Retrying map initialization with proper dimensions');
              initializeMap();
            }
          }, 500);
          return;
        }

        initializeMap();

      } catch (error) {
        console.error('Error in map initialization timer:', error);
      }
    }, 300);

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  };

  const initializeMap = () => {
    try {
      console.log('Starting map initialization...');

      // Initialize map
      mapInstanceRef.current = L.map(mapRef.current, {
        center: [defaultLat, defaultLng],
        zoom: 10,
        zoomControl: true,
        attributionControl: true
      });

      console.log('Map instance created:', mapInstanceRef.current);

      // Add OpenStreetMap tiles with error handling
      const tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 18,
        errorTileUrl: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 256 256"%3E%3Crect width="256" height="256" fill="%23f0f0f0"/%3E%3Ctext x="128" y="128" text-anchor="middle" fill="%23999" font-size="14"%3EMap tile unavailable%3C/text%3E%3C/svg%3E'
      });

      let tilesLoaded = false;
      let tileErrorCount = 0;

      tileLayer.on('tileerror', function (error) {
        console.error('Tile loading error:', error);
        tileErrorCount++;
        if (tileErrorCount > 5) {
          console.error('Too many tile errors, map may not load properly');
        }
      });

      tileLayer.on('tileload', function () {
        if (!tilesLoaded) {
          console.log('First tile loaded successfully');
          tilesLoaded = true;
          setTimeout(() => setMapReady(true), 500);
        }
      });

      tileLayer.addTo(mapInstanceRef.current);
      console.log('Tiles added to map');

      // Force map to resize
      setTimeout(() => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.invalidateSize();
          console.log('Map size invalidated');
        }
      }, 100);

      // Add click event listener
      mapInstanceRef.current.on('click', handleMapClick);

      // Add initial marker
      setTimeout(() => {
        addMarker(defaultLat, defaultLng);
        reverseGeocode(defaultLat, defaultLng);
      }, 500);

      // Fallback: show map after 3 seconds even if tiles don't fully load
      setTimeout(() => {
        if (!mapReady) {
          console.log('Showing map after timeout');
          setMapReady(true);
        }
      }, 3000);

    } catch (error) {
      console.error('Error initializing map:', error);
    }
  };

  // Cleanup when component unmounts or modal closes
  useEffect(() => {
    return () => {
      if (mapInstanceRef.current) {
        try {
          mapInstanceRef.current.remove();
          mapInstanceRef.current = null;
          markerRef.current = null;
          console.log('Map cleaned up');
        } catch (error) {
          console.error('Error cleaning up map:', error);
        }
      }
    };
  }, []);

  const addMarker = (lat, lng) => {
    if (mapInstanceRef.current) {
      // Remove existing marker
      if (markerRef.current) {
        mapInstanceRef.current.removeLayer(markerRef.current);
      }

      // Add new marker
      markerRef.current = L.marker([lat, lng], {
        draggable: true
      }).addTo(mapInstanceRef.current);

      // Add drag event listener
      markerRef.current.on('dragend', (e) => {
        const position = e.target.getLatLng();
        reverseGeocode(position.lat, position.lng);
      });
    }
  };

  const handleMapClick = (e) => {
    const { lat, lng } = e.latlng;
    addMarker(lat, lng);
    reverseGeocode(lat, lng);
  };

  const reverseGeocode = async (lat, lng) => {
    setIsGeocoding(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
      );
      const data = await response.json();

      if (data && data.display_name) {
        setSelectedAddress(data.display_name);
      } else {
        setSelectedAddress(`${lat.toFixed(6)}, ${lng.toFixed(6)}`);
      }
    } catch (error) {
      console.error('Reverse geocoding failed:', error);
      setSelectedAddress(`${lat.toFixed(6)}, ${lng.toFixed(6)}`);
    } finally {
      setIsGeocoding(false);
    }
  };

  const searchLocation = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&countrycodes=cy&addressdetails=1`
      );
      const data = await response.json();
      setSearchResults(data || []);
    } catch (error) {
      console.error('Search failed:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearchInputChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);

    // Debounce search
    const timeoutId = setTimeout(() => {
      searchLocation(value);
    }, 300);

    return () => clearTimeout(timeoutId);
  };

  const selectSearchResult = (result) => {
    const lat = parseFloat(result.lat);
    const lng = parseFloat(result.lon);

    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([lat, lng], 15);
      addMarker(lat, lng);
      setSelectedAddress(result.display_name);
      setSearchQuery('');
      setSearchResults([]);
    }
  };

  const handleConfirm = () => {
    if (selectedAddress && onLocationSelect) {
      onLocationSelect(selectedAddress);
    }
    toggle();
  };

  const handleCancel = () => {
    setSelectedAddress('');
    setSearchQuery('');
    setSearchResults([]);
    setMapReady(false);
    toggle();
  };

  return (
    <Modal isOpen={isOpen} toggle={handleCancel} size="lg">
      <ModalHeader toggle={handleCancel}>
        <i className="ri-map-pin-2-line me-2"></i>
        {title}
      </ModalHeader>
      <ModalBody>
        {/* Search Bar */}
        <div className="mb-3 position-relative">
          <Label for="locationSearch" className="form-label fw-semibold">
            Search for a location
          </Label>
          <Input
            type="text"
            id="locationSearch"
            placeholder="Enter address, city, or landmark..."
            value={searchQuery}
            onChange={handleSearchInputChange}
            className="form-control"
          />
          {isSearching && (
            <div className="position-absolute end-0 top-50 translate-middle-y me-3">
              <Spinner size="sm" />
            </div>
          )}

          {/* Search Results */}
          {searchResults.length > 0 && (
            <div className="search-results position-absolute w-100 bg-white border border-top-0 shadow-sm" style={{ zIndex: 1000, maxHeight: '200px', overflowY: 'auto' }}>
              {searchResults.map((result, index) => (
                <div
                  key={index}
                  className="p-2 border-bottom cursor-pointer hover-bg-light"
                  onClick={() => selectSearchResult(result)}
                  style={{ cursor: 'pointer' }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#f8f9fa'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                >
                  <small className="text-muted d-block">
                    <i className="ri-map-pin-line me-1"></i>
                    {result.display_name}
                  </small>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Map Container */}
        <div
          ref={mapRef}
          style={{
            height: '400px',
            width: '100%',
            borderRadius: '8px',
            position: 'relative',
            backgroundColor: '#f5f5f5',
            border: '1px solid #ddd',
            overflow: 'hidden'
          }}
          className="map-container"
        >
          {/* Loading overlay */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(248,249,250,0.95)',
              zIndex: 1000,
              transition: 'opacity 0.3s ease'
            }}
            className={mapReady ? 'd-none' : ''}
          >
            <div className="text-center">
              <Spinner color="primary" style={{ width: '2rem', height: '2rem' }} />
              <p className="mt-3 text-muted mb-1">Loading interactive map...</p>
              <small className="text-muted">Connecting to OpenStreetMap</small>
            </div>
          </div>
        </div>

        {/* Selected Address Display */}
        <div className="mt-3">
          <Label className="form-label fw-semibold">Selected Location</Label>
          <div className="d-flex align-items-center gap-2">
            {isGeocoding ? (
              <div className="d-flex align-items-center gap-2">
                <Spinner size="sm" />
                <span className="text-muted">Getting address...</span>
              </div>
            ) : (
              <div className="form-control bg-light">
                <i className="ri-map-pin-2-line text-primary me-2"></i>
                {selectedAddress || 'Click on the map to select a location'}
              </div>
            )}
          </div>
        </div>

        <div className="mt-2">
          <small className="text-muted">
            <i className="ri-information-line me-1"></i>
            Click on the map or drag the marker to select a location. You can also search for a specific address above.
          </small>
        </div>
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={handleCancel}>
          Cancel
        </Button>
        <Button
          color="primary"
          onClick={handleConfirm}
          disabled={!selectedAddress || isGeocoding}
        >
          <i className="ri-check-line me-1"></i>
          Confirm Location
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default LocationPickerModal;
