import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, ZoomControl } from 'react-leaflet';

import { windTurbineIcon } from '@c3/app/ui/src/components/icons/MapIcons';
import BasePopup from '@c3/app/ui/src/components/map/BasePopup';
import LoadingAnimation from '@c3/app/ui/src/components/misc/LoadingAnimation';
import ErrorModal from '@c3/app/ui/src/components/misc/ErrorModal';
import ContentSection from '@c3/app/ui/src/components/container/ContentSection';
import PageContainer from '@c3/app/ui/src/components/container/PageContainer';
import { type ImmutableReduxState } from '@c3/app/ui/src/types/types';
import { Base } from '@c3/types';
import { useSelectedState } from '@c3/ui/UiSdlUseData';
import { fetchAircraftCountWithFilter } from '@c3/app/ui/src/components/CRUDMethods/AircraftCRUD';
import KPIStatsContainer from '@c3/app/ui/src/components/stats/KPIStatsContainer';
import KPIStatsTile from '@c3/app/ui/src/components/stats/KPIStatsTile';
import AircraftPaginatedTable from '@c3/app/ui/src/components/table/AircraftPaginatedTable';

/*
  TODO 3.3.1: Import the function `fetchBaseById` from the Base CRUD methods
        to retrieve the Base by ID.
*/
import { fetchBaseById } from '@c3/app/ui/src/components/CRUDMethods/BaseCRUD';
/*
  TODO 4.2.1: Import the function `fetchAircraftCountWithFilter` from the Aircraft CRUD methods
        to retrieve counts of aircraft based on status filters.
*/

/*
  TODO 4.3.1: Import the KPIStatsContainer and KPIStatsTile components to display statistics.
*/

/*
  TODO 5.3.1: Import the AircraftPaginatedTable component to display the list of aircraft.
*/

import 'leaflet/dist/leaflet.css';

const AircraftBaseDetailsPage = () => {
  /*
    TODO 3.1: Define a selector to get the selected base ID from the Redux state.
              Read in using the Redux route `/pageParams/baseId`.
  */
  const baseIdSelector = (state: ImmutableReduxState) => {
    return state.getIn(['pageParams', 'baseId']); // Replace '...' with the correct path to the baseId in the state
  };

  const selectedBaseIdFromState = useSelectedState(baseIdSelector, true);

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  const [base, setBase] = useState<Base | null>(null);

  const [numReadyAircraft, setNumReadyAircraft] = useState<number>(0);
  const [numInMaintenanceAircraft, setNumInMaintenanceAircraft] = useState<number>(0);
  const [numGroundedAircraft, setNumGroundedAircraft] = useState<number>(0);
  const [numDeployedAircraft, setNumDeployedAircraft] = useState<number>(0);

  useEffect(() => {
    const loadBase = async () => {
      try {
        /* 
          TODO 3.3.2: Implement the logic to load the Base details using the ID
                obtained from the Redux state. Use the fetchBaseById function
                to retrieve the Base data and update the component state accordingly.
        */
        const baseData = await fetchBaseById(selectedBaseIdFromState);
        setBase(baseData);

        setNumReadyAircraft(await fetchAircraftCountWithFilter(selectedBaseIdFromState, "status == 'Ready'"));
        setNumInMaintenanceAircraft(await fetchAircraftCountWithFilter(selectedBaseIdFromState, "status == 'In Maintenance'"));
        setNumGroundedAircraft(await fetchAircraftCountWithFilter(selectedBaseIdFromState, "status == 'Grounded'"));
        setNumDeployedAircraft(await fetchAircraftCountWithFilter(selectedBaseIdFromState, "status == 'Deployed'"));
        /*
          TODO 4.2.2: Implement the logic to load aircraft counts based on their statuses. Use the
                fetchAircraftCountWithFilter function to get counts for each status:
                'Ready', 'In Maintenance', 'Grounded', and 'Deployed'. Update the
                component state with these counts.
        */



      } catch (error) {
        console.error('An error occurred: ', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    loadBase();
  }, [selectedBaseIdFromState]);

  if (error) {
    return (
      <PageContainer currentPath="/bases">
        <ErrorModal errorMessage={error} />
      </PageContainer>
    );
  }

  if (loading || !base) {
    return (
      <PageContainer currentPath="/bases">
        <LoadingAnimation />
      </PageContainer>
    );
  }

  return (
    <PageContainer currentPath="/bases">
      <div
        style={{
          padding: '24px',
          backgroundColor: '#fff',
          minHeight: '100vh',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        }}
      >
        {/* Header Section */}
        <div style={{ marginBottom: '32px' }}>
          <h1
            style={{
              fontWeight: 700,
              margin: '0 0 12px 0',
              color: '#000000',
              fontSize: '2.5rem',
              letterSpacing: '-0.02em',
            }}
          >
            {base.name}
          </h1>
          <p style={{ color: '#666', fontSize: '1.125rem', margin: 0, lineHeight: '1.6' }}>
            Detailed information about {base.name} operations and statistics.
          </p>
        </div>

        <div style={{ display: 'flex', marginBottom: '32px', gap: '24px', alignItems: 'center' }}>
          <h2 style={{ fontWeight: 600, margin: 0, color: '#000000', fontSize: '1.125rem', letterSpacing: '-0.01em' }}>
            Base ID: {base.id}
          </h2>
          <div style={{ borderLeft: '2px solid #d0d0d0', height: '28px' }}></div>
          <h2 style={{ fontWeight: 600, margin: 0, color: '#000000', fontSize: '1.125rem', letterSpacing: '-0.01em' }}>
            Latitude: {base.latitude.toFixed(4)}°
          </h2>
          <div style={{ borderLeft: '2px solid #d0d0d0', height: '28px' }}></div>
          <h2 style={{ fontWeight: 600, margin: 0, color: '#000000', fontSize: '1.125rem', letterSpacing: '-0.01em' }}>
            Longitude: {base.longitude.toFixed(4)}°
          </h2>
        </div>

        {/* Statistics Cards */}
        <KPIStatsContainer>
          <KPIStatsTile
            title="Number of Ready Aircraft"
            value={numReadyAircraft}
            showVerticalBarToRight={true}
          />
          <KPIStatsTile
            title="Number of In Maintenance Aircraft"
            value={numInMaintenanceAircraft}
            showVerticalBarToRight={true}
          />
          <KPIStatsTile
            title="Number of Grounded Aircraft"
            value={numGroundedAircraft}
            showVerticalBarToRight={true}
          />
          <KPIStatsTile
            title="Number of Deployed Aircraft"
            value={numDeployedAircraft}
            showVerticalBarToRight={false}
          />
        </KPIStatsContainer>

        {/* Map Section */}
        <ContentSection title="Base Location">
          <div style={{ height: '500px', width: '100%' }}>
            <MapContainer
              center={[base.latitude, base.longitude]}
              zoom={10}
              style={{ height: '100%', width: '100%' }}
              zoomControl={false}
            >
              <ZoomControl position="bottomleft" />
              <TileLayer
                url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
              />
              <Marker position={[base.latitude, base.longitude]} icon={windTurbineIcon}>
                <BasePopup base={base} />
              </Marker>
            </MapContainer>
          </div>
        </ContentSection>

        <ContentSection title="Aircraft" noPadding>
          <div style={{ padding: '0 24px 0 24px' }}>
            <AircraftPaginatedTable baseId={selectedBaseIdFromState} />
          </div>
        </ContentSection>
      </div>
    </PageContainer>
  );
};

export default AircraftBaseDetailsPage;
