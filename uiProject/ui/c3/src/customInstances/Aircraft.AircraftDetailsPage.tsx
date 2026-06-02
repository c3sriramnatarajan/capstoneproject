import React, { useEffect, useState } from 'react';

import PageContainer from '@c3/app/ui/src/components/container/PageContainer';
import ContentSection from '@c3/app/ui/src/components/container/ContentSection';
import KPIStatsContainer from '@c3/app/ui/src/components/stats/KPIStatsContainer';
import KPIStatsTile from '@c3/app/ui/src/components/stats/KPIStatsTile';
import LoadingAnimation from '@c3/app/ui/src/components/misc/LoadingAnimation';
import ErrorModal from '@c3/app/ui/src/components/misc/ErrorModal';
import OperationsPaginatedTable from '@c3/app/ui/src/components/table/OperationsPaginatedTable';
import SensorTimeSeriesGrid from '@c3/app/ui/src/components/charts/SensorTimeSeriesGrid';
import { fetchAircraftById } from '@c3/app/ui/src/components/CRUDMethods/AircraftFleetCRUD';
import { fetchBaseById } from '@c3/app/ui/src/components/CRUDMethods/BaseCRUD';
import { fetchCountWithFilter } from '@c3/app/ui/src/components/CRUDMethods/OperationCRUD';

import { type ImmutableReduxState } from '@c3/app/ui/src/types/types';
import { Aircraft, Base } from '@c3/types';
import { useSelectedState } from '@c3/ui/UiSdlUseData';
import { useDispatch } from '@c3/ui/UiSdlUseDispatch';

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  Ready: { bg: '#e6f4ea', text: '#1e7e34' },
  Deployed: { bg: '#e3f2fd', text: '#1565c0' },
  'In Maintenance': { bg: '#fff3e0', text: '#e65100' },
  Grounded: { bg: '#fce4ec', text: '#c62828' },
};

const AircraftDetailsPage = () => {
  const aircraftIdSelector = (state: ImmutableReduxState) => {
    return state.getIn(['pageParams', 'aircraftId']);
  };

  const selectedAircraftId = useSelectedState(aircraftIdSelector, true);
  const dispatch = useDispatch();

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  const [aircraft, setAircraft] = useState<Aircraft | null>(null);
  const [base, setBase] = useState<Base | null>(null);
  const [completedOps, setCompletedOps] = useState<number>(0);
  const [inProgressOps, setInProgressOps] = useState<number>(0);
  const [plannedOps, setPlannedOps] = useState<number>(0);

  useEffect(() => {
    const loadAircraftDetails = async () => {
      try {
        const aircraftData = await fetchAircraftById(selectedAircraftId);
        setAircraft(aircraftData);

        if (aircraftData?.location) {
          const locationId =
            typeof aircraftData.location === 'object' ? aircraftData.location.id : aircraftData.location;
          const baseData = await fetchBaseById(locationId);
          setBase(baseData);
        }

        const aircraftFilter = `aircraft == '${selectedAircraftId}'`;
        const [completed, inProgress, planned] = await Promise.all([
          fetchCountWithFilter(`${aircraftFilter} && status == 'Completed'`),
          fetchCountWithFilter(`${aircraftFilter} && status == 'In Progress'`),
          fetchCountWithFilter(`${aircraftFilter} && status == 'Planned'`),
        ]);

        setCompletedOps(completed);
        setInProgressOps(inProgress);
        setPlannedOps(planned);
      } catch (error) {
        console.error('An error occurred: ', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    loadAircraftDetails();
  }, [selectedAircraftId]);

  const handleBaseClick = (baseId: string) => {
    dispatch({
      type: 'GLOBAL_REDIRECT',
      payload: { url: `/bases/${baseId}` },
    });
  };

  if (error) {
    return (
      <PageContainer currentPath="/aircrafts">
        <ErrorModal errorMessage={error} />
      </PageContainer>
    );
  }

  if (loading || !aircraft) {
    return (
      <PageContainer currentPath="/aircrafts">
        <LoadingAnimation />
      </PageContainer>
    );
  }

  const locationId =
    typeof aircraft.location === 'object' && aircraft.location?.id ? aircraft.location.id : aircraft.location || 'N/A';
  const baseName = base?.name || locationId;
  const statusStyle = STATUS_COLORS[aircraft.status] || { bg: '#f5f5f5', text: '#333' };
  const totalOps = completedOps + inProgressOps + plannedOps;

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
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '12px' }}>
            <h1
              style={{
                fontWeight: 700,
                margin: 0,
                color: '#000000',
                fontSize: '2.5rem',
                letterSpacing: '-0.02em',
              }}
            >
              {aircraft.model}
            </h1>
            <span
              style={{
                display: 'inline-block',
                padding: '6px 16px',
                borderRadius: '16px',
                fontSize: '14px',
                fontWeight: 600,
                backgroundColor: statusStyle.bg,
                color: statusStyle.text,
              }}
            >
              {aircraft.status}
            </span>
          </div>
          <p style={{ color: '#666', fontSize: '1.125rem', margin: 0, lineHeight: '1.6' }}>
            Detailed information and operational history for aircraft {aircraft.id}.
          </p>
        </div>

        <div style={{ display: 'flex', marginBottom: '32px', gap: '24px', alignItems: 'center', flexWrap: 'wrap' }}>
          <h2 style={{ fontWeight: 600, margin: 0, color: '#000000', fontSize: '1.125rem', letterSpacing: '-0.01em' }}>
            Aircraft ID: {aircraft.id}
          </h2>
          <div style={{ borderLeft: '2px solid #d0d0d0', height: '28px' }}></div>
          <h2 style={{ fontWeight: 600, margin: 0, color: '#000000', fontSize: '1.125rem', letterSpacing: '-0.01em' }}>
            Model: {aircraft.model}
          </h2>
          <div style={{ borderLeft: '2px solid #d0d0d0', height: '28px' }}></div>
          <h2 style={{ fontWeight: 600, margin: 0, color: '#000000', fontSize: '1.125rem', letterSpacing: '-0.01em' }}>
            Registration: {aircraft.registrationNumber || 'N/A'}
          </h2>
          <div style={{ borderLeft: '2px solid #d0d0d0', height: '28px' }}></div>
          <h2
            style={{
              fontWeight: 600,
              margin: 0,
              color: '#1565c0',
              fontSize: '1.125rem',
              letterSpacing: '-0.01em',
              cursor: 'pointer',
            }}
            onClick={() => handleBaseClick(locationId)}
          >
            Base: {baseName} ({locationId})
          </h2>
        </div>

        <KPIStatsContainer>
          <KPIStatsTile title="Total Operations" value={totalOps} showVerticalBarToRight={true} />
          <KPIStatsTile title="Completed" value={completedOps} showVerticalBarToRight={true} />
          <KPIStatsTile title="In Progress" value={inProgressOps} showVerticalBarToRight={true} />
          <KPIStatsTile title="Planned" value={plannedOps} showVerticalBarToRight={false} />
        </KPIStatsContainer>

        <SensorTimeSeriesGrid aircraftId={selectedAircraftId} />

        <ContentSection title="Operations" noPadding>
          <div style={{ padding: '0 24px 0 24px' }}>
            <OperationsPaginatedTable filter={`aircraft == '${selectedAircraftId}'`} />
          </div>
        </ContentSection>
      </div>
    </PageContainer>
  );
};

export default AircraftDetailsPage;
