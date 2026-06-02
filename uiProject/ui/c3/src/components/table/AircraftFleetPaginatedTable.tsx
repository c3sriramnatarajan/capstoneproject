import React, { useEffect, useState } from 'react';

import { fetchAllAircraftWithPagination } from '@c3/app/ui/src/components/CRUDMethods/AircraftFleetCRUD';
import LoadingAnimation from '@c3/app/ui/src/components/misc/LoadingAnimation';
import ErrorModal from '@c3/app/ui/src/components/misc/ErrorModal';
import PageButton from '@c3/app/ui/src/components/table/PageButton';
import { Aircraft } from '@c3/types';
import { useDispatch } from '@c3/ui/UiSdlUseDispatch';

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  Ready: { bg: '#e6f4ea', text: '#1e7e34' },
  Deployed: { bg: '#e3f2fd', text: '#1565c0' },
  'In Maintenance': { bg: '#fff3e0', text: '#e65100' },
  Grounded: { bg: '#fce4ec', text: '#c62828' },
};

const AircraftFleetPaginatedTable = () => {
  const dispatch = useDispatch();
  const [page, setPage] = useState<number>(0);
  const [aircraftData, setAircraftData] = useState<Aircraft[]>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const PAGE_SIZE = 10;

  const tableHeaders = ['ID', 'Model', 'Registration Number', 'Status'];

  useEffect(() => {
    const loadPaginatedAircraft = async () => {
      setLoading(true);

      try {
        const data = await fetchAllAircraftWithPagination(PAGE_SIZE, page * PAGE_SIZE);
        setAircraftData(data);
      } catch (error) {
        console.error('Error occurred fetching paginated data: ', error.message);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    loadPaginatedAircraft();
  }, [page]);

  const handleAircraftClick = (aircraftId: string) => {
    dispatch({
      type: 'GLOBAL_REDIRECT',
      payload: { url: `/aircrafts/${aircraftId}` },
    });
  };

  if (loading) {
    return <LoadingAnimation />;
  }

  if (error) {
    return <ErrorModal errorMessage={error} />;
  }

  return (
    <div style={{ backgroundColor: 'white', borderRadius: '8px', overflow: 'hidden', border: '1px solid #e5e5e5' }}>
      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          fontFamily: 'Inter, Helvetica Neue, Arial, Helvetica, sans-serif',
        }}
      >
        <thead>
          <tr style={{ backgroundColor: '#fafafa' }}>
            {tableHeaders.map((header) => {
              return (
                <th
                  key={header}
                  style={{
                    textAlign: 'left',
                    padding: '12px 16px',
                    fontWeight: 600,
                    fontSize: '13px',
                    color: '#555',
                    borderBottom: '1px solid #e5e5e5',
                  }}
                >
                  {header}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {aircraftData &&
            aircraftData.map((ac) => {
              const statusStyle = STATUS_COLORS[ac.status] || { bg: '#f5f5f5', text: '#333' };
              return (
                <tr
                  key={ac.id}
                  onClick={() => handleAircraftClick(ac.id)}
                  style={{ borderBottom: '1px solid #f0f0f0', cursor: 'pointer', transition: 'background-color 0.15s' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#f8f9fa';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <td style={{ padding: '12px 16px', fontSize: '14px', color: '#1565c0', fontWeight: 500 }}>{ac.id}</td>
                  <td style={{ padding: '12px 16px', fontSize: '14px', color: '#333' }}>{ac.model}</td>
                  <td style={{ padding: '12px 16px', fontSize: '14px', color: '#333' }}>
                    {ac.registrationNumber || 'N/A'}
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: '14px' }}>
                    <span
                      style={{
                        display: 'inline-block',
                        padding: '4px 12px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: 600,
                        backgroundColor: statusStyle.bg,
                        color: statusStyle.text,
                      }}
                    >
                      {ac.status}
                    </span>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '16px',
          borderTop: '1px solid #e5e5e5',
          backgroundColor: '#fafafa',
        }}
      >
        <div style={{ fontSize: '13px', color: '#666' }}>Rows per page: {PAGE_SIZE}</div>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <PageButton updateCurrentPage={() => setPage((prev) => prev - 1)} disabled={page === 0} icon="‹" />
          <span style={{ fontSize: '13px', color: '#666' }}>{page + 1}</span>
          <PageButton
            updateCurrentPage={() => setPage((prev) => prev + 1)}
            disabled={!aircraftData || aircraftData.length < PAGE_SIZE}
            icon="›"
          />
        </div>
      </div>
    </div>
  );
};

export default AircraftFleetPaginatedTable;
