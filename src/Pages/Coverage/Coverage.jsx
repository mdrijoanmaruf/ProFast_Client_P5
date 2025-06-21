import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { FaSearch, FaMapMarkerAlt } from 'react-icons/fa';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import coverageData from './Data.json';

// Fix for default markers in React Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Component to handle map updates
const MapUpdater = ({ center, zoom }) => {
  const map = useMap();
  
  useEffect(() => {
    if (center) {
      map.setView(center, zoom);
    }
  }, [center, zoom, map]);
  
  return null;
};

const Coverage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState(coverageData);
  const [selectedRegion, setSelectedRegion] = useState('All');
  const [mapCenter, setMapCenter] = useState([23.6850, 90.3563]);
  const [mapZoom, setMapZoom] = useState(7);
  const [searchResults, setSearchResults] = useState([]);
  const mapRef = useRef();

  // Create enhanced data with all searchable fields
  const enhancedData = coverageData.map(item => ({
    ...item,
    // Add mock data for complete functionality
    district: item.district || `District ${Math.floor(item.latitude * 10)}`,
    city: item.city || `City ${Math.floor(item.longitude * 10)}`,
    region: item.region || 'Dhaka',
    status: item.status || 'Active',
    covered_area: item.covered_area || [`Area ${Math.floor(Math.random() * 100)}`]
  }));

  // Get unique regions for filter
  const regions = ['All', ...new Set(enhancedData.map(item => item.region))];

  // Filter data based on search term and region
  useEffect(() => {
    let filtered = enhancedData;

    // Filter by region
    if (selectedRegion !== 'All') {
      filtered = filtered.filter(item => item.region === selectedRegion);
    }

    // Filter by search term
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(item => {
        const districtMatch = item.district?.toLowerCase().includes(searchLower);
        const cityMatch = item.city?.toLowerCase().includes(searchLower);
        const regionMatch = item.region?.toLowerCase().includes(searchLower);
        const areaMatch = item.covered_area?.some(area => 
          area.toLowerCase().includes(searchLower)
        );
        
        return districtMatch || cityMatch || regionMatch || areaMatch;
      });
    }

    setFilteredData(filtered);
    setSearchResults(filtered);
  }, [searchTerm, selectedRegion]);

  const handleSearch = (e) => {
    e.preventDefault();
    
    if (searchTerm.trim() && searchResults.length > 0) {
      // Get the first matching result
      const firstResult = searchResults[0];
      
      if (firstResult && firstResult.latitude && firstResult.longitude) {
        // Zoom to the location
        const newCenter = [firstResult.latitude, firstResult.longitude];
        setMapCenter(newCenter);
        setMapZoom(12); // Zoom in closer for search results
        
        // Optional: Show a temporary message
        console.log(`Zooming to: ${firstResult.district}`);
      }
    } else if (!searchTerm.trim()) {
      // Reset to Bangladesh view if search is cleared
      setMapCenter([23.6850, 90.3563]);
      setMapZoom(7);
    }
  };

  const handleLocationClick = (location) => {
    if (location.latitude && location.longitude) {
      const newCenter = [location.latitude, location.longitude];
      setMapCenter(newCenter);
      setMapZoom(12);
    }
  };

  const resetMapView = () => {
    setMapCenter([23.6850, 90.3563]);
    setMapZoom(7);
    setSearchTerm('');
    setSelectedRegion('All');
  };

  return (
    <div className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl lg:text-5xl font-bold text-[#03373D] mb-6">
            We are available in 64 districts
          </h2>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <form onSubmit={handleSearch} className="relative">
              <div className="flex">
                <input
                  type="text"
                  placeholder="Search district, city, or area..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-6 py-4 pr-16 text-lg border border-gray-300 rounded-l-full focus:outline-none focus:ring-2 focus:ring-[#CAEB66] focus:border-transparent"
                />
                <button
                  type="submit"
                  className="px-8 py-4 bg-[#CAEB66] text-[#03373D] font-semibold rounded-r-full hover:bg-opacity-90 transition-all duration-300 flex items-center gap-2"
                >
                  <FaSearch />
                  Search
                </button>
              </div>
            </form>
            
            {/* Search Results Info */}
            {searchTerm && (
              <div className="mt-2 text-sm text-gray-600">
                {searchResults.length > 0 ? (
                  <p>Found {searchResults.length} location(s) matching "{searchTerm}"</p>
                ) : (
                  <p>No locations found for "{searchTerm}"</p>
                )}
              </div>
            )}
          </div>

          {/* Control Buttons */}
          <div className="flex justify-center gap-4 mb-8">
            <button
              onClick={resetMapView}
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 transition-all duration-300"
            >
              Reset Map View
            </button>
          </div>

          {/* Region Filter */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {regions.map(region => (
              <button
                key={region}
                onClick={() => setSelectedRegion(region)}
                className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                  selectedRegion === region
                    ? 'bg-[#CAEB66] text-[#03373D]'
                    : 'bg-white text-[#03373D] border border-gray-300 hover:bg-[#CAEB66] hover:text-[#03373D]'
                }`}
              >
                {region}
              </button>
            ))}
          </div>
        </div>

        {/* Statistics */}
        <div className="text-center mb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-3xl font-bold text-[#CAEB66] mb-2">
                {enhancedData.length}
              </h3>
              <p className="text-[#03373D] font-medium">Total Districts</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-3xl font-bold text-[#CAEB66] mb-2">
                {regions.length - 1}
              </h3>
              <p className="text-[#03373D] font-medium">Regions Covered</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-3xl font-bold text-[#CAEB66] mb-2">
                {filteredData.length}
              </h3>
              <p className="text-[#03373D] font-medium">Showing Results</p>
            </div>
          </div>
        </div>

        {/* Map Section */}
        <div className="mb-12">
          <h3 className="text-3xl font-bold text-[#03373D] text-center mb-8">
            We deliver almost all over Bangladesh
          </h3>
          
          <div className="bg-white rounded-lg shadow-lg p-4">
            <MapContainer
              ref={mapRef}
              center={mapCenter}
              zoom={mapZoom}
              style={{ height: '600px', width: '100%' }}
              className="rounded-lg"
            >
              {/* Map Updater Component */}
              <MapUpdater center={mapCenter} zoom={mapZoom} />
              
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              
              {filteredData.map((location, index) => (
                location.latitude && location.longitude && (
                  <Marker
                    key={index}
                    position={[location.latitude, location.longitude]}
                  >
                    <Popup>
                      <div className="p-2">
                        <h4 className="font-bold text-[#03373D] mb-2">
                          {location.district}
                        </h4>
                        <p className="text-sm text-gray-600 mb-2">
                          <strong>Region:</strong> {location.region}
                        </p>
                        <p className="text-sm text-gray-600 mb-2">
                          <strong>City:</strong> {location.city}
                        </p>
                        <p className="text-sm text-gray-600 mb-2">
                          <strong>Status:</strong> 
                          <span className="ml-1 px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                            {location.status}
                          </span>
                        </p>
                        <div className="text-sm text-gray-600">
                          <strong>Coordinates:</strong> {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                )
              ))}
            </MapContainer>
          </div>
        </div>

        {/* Coverage List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredData.map((location, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300 cursor-pointer"
              onClick={() => handleLocationClick(location)}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h4 className="text-xl font-bold text-[#03373D] mb-1">
                    {location.district}
                  </h4>
                  <p className="text-gray-600 flex items-center gap-1">
                    <FaMapMarkerAlt className="text-[#CAEB66]" />
                    {location.region} Region
                  </p>
                </div>
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                  {location.status}
                </span>
              </div>
              
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">
                  <strong>City:</strong> {location.city}
                </p>
                <p className="text-sm text-gray-600 mb-2">
                  <strong>Coordinates:</strong> {location.latitude?.toFixed(4)}, {location.longitude?.toFixed(4)}
                </p>
              </div>
              
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  handleLocationClick(location);
                }}
                className="w-full py-2 bg-[#03373D] text-white rounded-lg hover:bg-opacity-90 transition-all duration-300"
              >
                View on Map
              </button>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredData.length === 0 && (
          <div className="text-center py-12">
            <FaMapMarkerAlt className="text-6xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-600 mb-2">
              No locations found
            </h3>
            <p className="text-gray-500">
              Try adjusting your search terms or selected region
            </p>
            <button
              onClick={resetMapView}
              className="mt-4 px-6 py-2 bg-[#CAEB66] text-[#03373D] rounded-lg hover:bg-opacity-90 transition-all duration-300"
            >
              Reset Search
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Coverage;