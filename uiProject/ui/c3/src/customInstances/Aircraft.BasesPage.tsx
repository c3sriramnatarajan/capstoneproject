import React, { useState, useEffect } from 'react';

import PageContainer from '@c3/app/ui/src/components/container/PageContainer';
import ContentSection from '@c3/app/ui/src/components/container/ContentSection';
import KPIStatsContainer from '@c3/app/ui/src/components/stats/KPIStatsContainer';
import KPIStatsTile from '@c3/app/ui/src/components/stats/KPIStatsTile';
import BaseFleetPaginatedTable from '@c3/app/ui/src/components/table/BaseFleetPaginatedTable';
import LoadingAnimation from '@c3/app/ui/src/components/misc/LoadingAnimation';
import ErrorModal from '@c3/app/ui/src/components/misc/ErrorModal';
import { fetchAllBaseCount } from '@c3/app/ui/src/components/CRUDMethods/BaseFleetCRUD';
import { fetchAllAircraftCount } from '@c3/app/ui/src/components/CRUDMethods/AircraftFleetCRUD';

const BasesPage = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  const [totalBases, setTotalBases] = useState<number>(0);
  const [totalAircraft, setTotalAircraft] = useState<number>(0);

  useEffect(() => {
    const loadCounts = async () => {
      try {
        const [bases, aircraft] = await Promise.all([fetchAllBaseCount(), fetchAllAircraftCount()]);

        setTotalBases(bases);
        setTotalAircraft(aircraft);
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
      <PageContainer currentPath="/bases">
        <ErrorModal errorMessage={error} />
      </PageContainer>
    );
  }

  if (loading) {
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
            Bases
          </h1>
          <p style={{ color: '#666', fontSize: '1.125rem', margin: 0, lineHeight: '1.6' }}>
            Overview of all bases, their locations, and assigned aircraft.
          </p>
        </div>

        <KPIStatsContainer>
          <KPIStatsTile title="Total Bases" value={totalBases} showVerticalBarToRight={true} />
          <KPIStatsTile title="Total Aircraft" value={totalAircraft} showVerticalBarToRight={false} />
        </KPIStatsContainer>

        <ContentSection title="Bases Data" noPadding>
          <div style={{ padding: '0 24px 0 24px' }}>
            <BaseFleetPaginatedTable />
          </div>
        </ContentSection>
      </div>
    </PageContainer>
  );
};

export default BasesPage;
