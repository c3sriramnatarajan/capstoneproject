export const fetchAllBaseCount = async (filter?: string): Promise<number> => {
  const response = await fetch('api/8/Base/fetchCount', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      filter: filter || undefined,
    }),
  });

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  const data = await response.json();
  return data || 0;
};

export const fetchAllBasesWithPagination = async (pageSize: number, offset: number): Promise<any[]> => {
  const response = await fetch('api/8/Base/fetch', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      limit: pageSize,
      offset: offset,
    }),
  });

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  const data = await response.json();
  return data.objs || [];
};
