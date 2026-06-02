```
//UiRoute.csv

targetModuleName,targetPageName,name,urlPath
WindTurbine,HomePage,/windturbine,/windturbine
WindTurbine,HomePage,/,/



// WindTurbine.HomePage.tsx

import React from 'react';
import { MapContainer, TileLayer, ZoomControl } from 'react-leaflet';
import { fetchAllTurbines } from '@c3/app/ui/src/components/CRUDMethods/WindTurbineCRUD';
import { useEffect } from 'react';
import { useState } from 'react';
import { windTurbineIcon } from '@c3/app/ui/src/components/icons/MapIcons'; // Import the wind turbine icon
import { Marker, Popup } from 'react-leaflet'; // Import the Marker component from react-leaflet
import 'leaflet/dist/leaflet.css';
import '@c3/ui/WindTurbine.scss'; // Custom styles for this application

const WindTurbineHomePage: React.FC = () => {
    
  const [turbines, setTurbines] = useState([]);

    useEffect(() => {
    // Fetch wind turbine data using CRUD method
    const loadTurbines = async () => {
      try {
        const turbineData = await fetchAllTurbines();
        console.log('Success:', turbineData);
        setTurbines(turbineData);// Store the fetched data in state

      } catch (error) {
        console.error('Error fetching wind turbine data:', error);
      } 
    };

    loadTurbines();
  }, []);
  return (
   <MapContainer center={[39.8, -98.5]} zoom={4} className="map-container" zoomControl={false}>
        <ZoomControl position="bottomleft" />


        {/* OpenStreetMap Tile Layer */}
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />

        {/* Wind Turbine Markers */}
        {(turbines).map((turbine) => (
          <Marker key={turbine.id} position={[turbine.latitude, turbine.longitude]} icon={windTurbineIcon}>
            <Popup>
              <div className="popup-content">
                <h3 className="popup-title">Wind Turbine {turbine.id}</h3>
                <div className="popup-section">
                  <strong>Status:</strong>{' '}
                  <span className={turbine.active !== false ? 'popup-status-active' : 'popup-status-inactive'}>
                    {turbine.active !== false ? 'Active' : 'Inactive'}
                  </span>
                </div>
                {turbine.powerData && (
                  <div className="popup-section">
                    <strong>Power Output:</strong> {turbine.powerData} kW
                  </div>
                )}
                {turbine.manufacturerName && (
                  <div className="popup-section">
                    <strong>Manufacturer:</strong> {turbine.manufacturerName}
                  </div>
                )}
                <button
                  onClick={() => handleViewDetails(turbine)}
                  className="view-details-btn"
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = '#1d4ed8';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = '#2563eb';
                  }}
                >
                  View Details
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

  );
};

export default WindTurbineHomePage;

```