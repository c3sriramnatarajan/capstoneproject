import React, { useState, useEffect } from 'react';

import PageContainer from '@c3/app/ui/src/components/container/PageContainer';
import ContentSection from '@c3/app/ui/src/components/container/ContentSection';
import KPIStatsContainer from '@c3/app/ui/src/components/stats/KPIStatsContainer';
import KPIStatsTile from '@c3/app/ui/src/components/stats/KPIStatsTile';
import AircraftFleetPaginatedTable from '@c3/app/ui/src/components/table/AircraftFleetPaginatedTable';
import LoadingAnimation from '@c3/app/ui/src/components/misc/LoadingAnimation';
import ErrorModal from '@c3/app/ui/src/components/misc/ErrorModal';
import { fetchAllAircraftCount } from '@c3/app/ui/src/components/CRUDMethods/AircraftFleetCRUD';

const AircraftsPage = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  const [totalAircraft, setTotalAircraft] = useState<number>(0);
  const [readyCount, setReadyCount] = useState<number>(0);
  const [deployedCount, setDeployedCount] = useState<number>(0);
  const [maintenanceCount, setMaintenanceCount] = useState<number>(0);
  const [groundedCount, setGroundedCount] = useState<number>(0);

  useEffect(() => {
    const loadCounts = async () => {
      try {
        const [total, ready, deployed, maintenance, grounded] = await Promise.all([
          fetchAllAircraftCount(),
          fetchAllAircraftCount("status == 'Ready'"),
          fetchAllAircraftCount("status == 'Deployed'"),
          fetchAllAircraftCount("status == 'In Maintenance'"),
          fetchAllAircraftCount("status == 'Grounded'"),
        ]);

        setTotalAircraft(total);
        setReadyCount(ready);
        setDeployedCount(deployed);
        setMaintenanceCount(maintenance);
        setGroundedCount(grounded);
      } catch (error) {
        console.error('An error occurred: ', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    loadCounts();
  }, []);

  if (error) {
    return (
      <PageContainer currentPath="/aircrafts">
        <ErrorModal errorMessage={error} />
      </PageContainer>
    );
  }

  if (loading) {
    return (
      <PageContainer currentPath="/aircrafts">
        <LoadingAnimation />
      </PageContainer>
    );
  }

  return (
    <PageContainer currentPath="/aircrafts">
      <div
        style={{
          padding: '24px',
          backgroundColor: '#fff',
          minHeight: '100vh',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        }}
      >
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
            Aircrafts
          </h1>
          <p style={{ color: '#666', fontSize: '1.125rem', margin: 0, lineHeight: '1.6' }}>
            Overview of all aircraft in the fleet, their current status, and operational metrics.
          </p>
        </div>

        <KPIStatsContainer>
          <KPIStatsTile title="Total Aircraft" value={totalAircraft} showVerticalBarToRight={true} />
          <KPIStatsTile title="Ready" value={readyCount} showVerticalBarToRight={true} />
          <KPIStatsTile title="Deployed" value={deployedCount} showVerticalBarToRight={true} />
          <KPIStatsTile title="In Maintenance" value={maintenanceCount} showVerticalBarToRight={true} />
          <KPIStatsTile title="Grounded" value={groundedCount} showVerticalBarToRight={false} />
        </KPIStatsContainer>

        <ContentSection title="Aircrafts Data" noPadding>
          <div style={{ padding: '0 24px 0 24px' }}>
            <AircraftFleetPaginatedTable />
          </div>
        </ContentSection>
      </div>
    </PageContainer>
  );
};

export default AircraftsPage;
