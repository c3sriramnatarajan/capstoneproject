import React, { useEffect, useState } from 'react';

import { fetchAllBasesWithPagination } from '@c3/app/ui/src/components/CRUDMethods/BaseFleetCRUD';
import LoadingAnimation from '@c3/app/ui/src/components/misc/LoadingAnimation';
import ErrorModal from '@c3/app/ui/src/components/misc/ErrorModal';
import PageButton from '@c3/app/ui/src/components/table/PageButton';
import { Base } from '@c3/types';
import { useDispatch } from '@c3/ui/UiSdlUseDispatch';

const BaseFleetPaginatedTable = () => {
  const dispatch = useDispatch();
  const [page, setPage] = useState<number>(0);
  const [baseData, setBaseData] = useState<Base[]>();
  const [hasNextPage, setHasNextPage] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const PAGE_SIZE = 10;

  const tableHeaders = ['ID', 'Name', 'Latitude', 'Longitude'];

  useEffect(() => {
    const loadPaginatedBases = async () => {
      setLoading(true);

      try {
        const data = await fetchAllBasesWithPagination(PAGE_SIZE + 1, page * PAGE_SIZE);
        setHasNextPage(data.length > PAGE_SIZE);
        setBaseData(data.slice(0, PAGE_SIZE));
      } catch (error) {
        console.error('Error occurred fetching paginated data: ', error.message);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    loadPaginatedBases();
  }, [page]);

  const handleBaseClick = (baseId: string) => {
    dispatch({
      type: 'GLOBAL_REDIRECT',
      payload: { url: `/bases/${baseId}` },
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
          {baseData &&
            baseData.map((base) => {
              return (
                <tr
                  key={base.id}
                  onClick={() => handleBaseClick(base.id)}
                  style={{ borderBottom: '1px solid #f0f0f0', cursor: 'pointer', transition: 'background-color 0.15s' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#f8f9fa';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <td style={{ padding: '12px 16px', fontSize: '14px', color: '#1565c0', fontWeight: 500 }}>
                    {base.id}
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: '14px', color: '#333' }}>{base.name}</td>
                  <td style={{ padding: '12px 16px', fontSize: '14px', color: '#333' }}>
                    {base.latitude?.toFixed(4)}°
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: '14px', color: '#333' }}>
                    {base.longitude?.toFixed(4)}°
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
          <PageButton updateCurrentPage={() => setPage((prev) => prev + 1)} disabled={!hasNextPage} icon="›" />
        </div>
      </div>
    </div>
  );
};

export default BaseFleetPaginatedTable;
