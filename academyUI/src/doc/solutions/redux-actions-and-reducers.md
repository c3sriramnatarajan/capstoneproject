```
// ui/c3/meta/WindTurbine.ApplicationState.json
{
"type": "ApplicationStateWindTurbine",
"selectedTurbines": []
}

// src/applicationState/ApplicationStateWindTurbine.ts
export function windTurbineFilterChangeAction(stateId: string, selectedTurbines: [string]) {
  return {
    type: stateId + '.WIND_TURBINE_FILTER_CHANGE',
    payload: {
      stateId,
      selectedTurbines,
    },
  };
}

import { setConfigInApplicationState } from '@c3/ui/UiSdlApplicationState';

export function windTurbineFilterChangeReducer(state: any, action: any) {
  return setConfigInApplicationState(
    action.payload.stateId,
    state,
    ['selectedTurbines'],
    [...action.payload.selectedTurbines]
  );
}



// src/applicationState/ApplicationStateWindTurbine.c3typ
@typeScript
type ApplicationStateWindTurbine mixes UiSdlApplicationState {
  selectedTurbines: [string];

    @uiSdlActionCreator(actionType='WIND_TURBINE_FILTER_CHANGE')
    windTurbineFilterChangeAction: private function(stateId: string, selectedTurbines: [string]): UiSdlReduxAction ts-client
    
    @uiSdlReducer(actionType='WIND_TURBINE_FILTER_CHANGE')
    windTurbineFilterChangeReducer: private function(state: !UiSdlReduxState, action: UiSdlReduxAction): UiSdlReduxAction ts-client
}


// WindTurbineFilter.tsx

import React, { useState } from 'react';
import '@c3/ui/WindTurbine.scss';
import { windTurbineFilterChangeAction } from '@c3/ui/ApplicationStateWindTurbine';
import AppState from '@c3/ui/components/WindTurbine.ApplicationState'
import { Select, MenuItem, Checkbox, ListItemText } from '@mui/material';
import { useDispatch } from '@c3/ui/UiSdlUseDispatch';

interface WindTurbineFilterProps {
  turbines: WindTurbine[];
}

const WindTurbineFilter: React.FC<WindTurbineFilterProps> = ({ turbines }) => {
  const [selectedTurbines, setSelectedTurbines] = useState<string[]>([]);
  const dispatch = useDispatch();
  const APPLICATION_STATE_ID = 'WindTurbine.ApplicationState';


  const handleChange = (event: any) => {
      const value = event.target.value;
  
      console.log('Selected Turbines:', value);
  
      setSelectedTurbines(value); // Store selected turbines in state
      dispatch(windTurbineFilterChangeAction(APPLICATION_STATE_ID, value));
    };
  return (
    <> 
        <AppState />

      <div className="filter-container">
        {/* Filter Header */}
        <div className="filter-header">
          <h3 className="filter-title">Wind Turbine Filter</h3>
        </div>

        {/* Dropdown Selection */}
        <div className="filter-dropdown-section">
          <label className="filter-label">Select Wind Turbine:</label>

          <Select
            labelId="turbine-select-label"
            multiple
            onChange={handleChange}
            value={selectedTurbines}
            renderValue={(selected) => selected.join(', ')}
          >
            {turbines.map((turbine) => (
              <MenuItem key={turbine.id} value={turbine.id}>
                <Checkbox checked={selectedTurbines.indexOf(turbine.id) > -1} />
                <ListItemText primary={turbine.id} />
              </MenuItem>
            ))}
          </Select>
        </div>
      </div>
    </>
  );
};

export default WindTurbineFilter;


// WindTurbine.HomePage.tsx

import React from 'react';
import { MapContainer, TileLayer, ZoomControl } from 'react-leaflet';
import { fetchAllTurbines } from '@c3/app/ui/src/components/CRUDMethods/WindTurbineCRUD';
import { useEffect } from 'react';
import { useSelectedState } from '@c3/ui/UiSdlUseData';

import WindTurbineFilter from '@c3/app/ui/src/components/WindTurbineFilter';
import { useState } from 'react';
import { UiSdlReduxState, WindTurbine, FetchResult } from '@c3/types';
import { windTurbineIcon } from '@c3/app/ui/src/components/icons/MapIcons'; // Import the wind turbine icon
import { Marker, Popup } from 'react-leaflet'; // Import the Marker component from react-leaflet
import 'leaflet/dist/leaflet.css';
import '@c3/ui/WindTurbine.scss'; // Custom styles for this application

const WindTurbineHomePage: React.FC = () => {
    
  const [turbines, setTurbines] = useState([]);
  const [filteredTurbines, setFilteredTurbines] = useState<WindTurbine[]>([]);

  type ImmutableReduxState = Map<keyof UiSdlReduxState, UiSdlReduxState[keyof UiSdlReduxState]>;

  // Define the application state ID (Same as the instance name created earlier)
  const APPLICATION_STATE_ID = 'WindTurbine.ApplicationState';

  const turbineDataSelector = (state: ImmutableReduxState) => {
    // Access turbine-specific data from state
    return state.getIn(['metadata', 'applications', 'byId', APPLICATION_STATE_ID, 'selectedTurbines']) || null;
  };

  const turbineData = useSelectedState(turbineDataSelector, (prev: any, next: any) => prev === next);

    useEffect(() => {
    const filteredTurbines = turbines.filter((turbine) => turbineData.toArray().includes(turbine.id)); 
    setFilteredTurbines(filteredTurbines);
  }, [turbineData]);

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
        
        <WindTurbineFilter turbines={turbines} />

        <ZoomControl position="bottomleft" />
        {/* OpenStreetMap Tile Layer */}
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />

        {/* Wind Turbine Markers */}
        {(filteredTurbines.length > 0 ? filteredTurbines : turbines).map((turbine) => (
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