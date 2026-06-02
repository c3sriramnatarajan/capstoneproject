/*
    WindTurbine.HomePage.tsx
    This is the main page component for the Wind Turbine application. It renders a map using Leaflet.
*/
import React from 'react';
import { MapContainer, TileLayer, ZoomControl } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import '@c3/ui/WindTurbine.scss'; // Custom styles for this application
import { fetchAllTurbines } from '@c3/app/ui/src/components/CRUDMethods/WindTurbineCRUD';
import { useEffect } from 'react';
import { useState } from 'react';
import { windTurbineIcon } from '@c3/app/ui/src/components/icons/MapIcons'; // Import the wind turbine icon
import { Marker } from 'react-leaflet'; // Import the Marker component from react-leaflet
import WindTurbinePopup from '@c3/app/ui/src/components/WindTurbinePopup';
import WindTurbineFilter from '@c3/app/ui/src/components/WindTurbineFilter';
import { useSelectedState } from '@c3/ui/UiSdlUseData';

const WindTurbineHomePage = () => {
  const [turbines, setTurbines] = useState([]);

  const [filteredTurbines, setFilteredTurbines] = useState<WindTurbine[]>([]);
  const turbinesState = useSelectedState((state) => state.get('turbines'));
  useEffect(() => {

    // Fetch wind turbine data using CRUD method
    const loadTurbines = async () => {
      try {
        const turbineData = await fetchAllTurbines();
        console.log('Success:', turbineData);
        setTurbines(turbineData); // Store the fetched data in state

      } catch (error) {
        console.error('Error fetching wind turbine data:', error);
      }
    };

    loadTurbines();
  }, []);

  useEffect(() => {
    if (!turbinesState?.selectedIds?.length) {
      setFilteredTurbines(turbines);
      return;
    }
    const filtered = turbines.filter((turbine) => turbinesState.selectedIds.includes(turbine.id));
    setFilteredTurbines(filtered);
  }, [turbines, turbinesState]);
  return (
    <>
      <MapContainer
        center={[39.8, -98.5]}
        zoom={4}
        className="map-container"
        zoomControl={false}
        attributionControl={true}
        {...{} as any} // This avoids the prop warning for using an older version of React 
      >
        <WindTurbineFilter turbines={turbines} />
        <ZoomControl position="bottomleft" />

        {/* OpenStreetMap Tile Layer */}
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          {...{} as any}
        />

        {/* Wind Turbine Markers */}
        {(filteredTurbines.length > 0 ? filteredTurbines : turbines).map((turbine) => (
          <Marker
            key={turbine.id}
            position={[turbine.latitude, turbine.longitude]}
            icon={windTurbineIcon}
            {...{} as any}> {/* This avoids the prop warning for using an older version of React */}
            <WindTurbinePopup turbine={turbine} />
          </Marker>
        ))}

      </MapContainer>
    </>
  );
};

export default WindTurbineHomePage;