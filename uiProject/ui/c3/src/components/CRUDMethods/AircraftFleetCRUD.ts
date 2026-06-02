export const fetchAircraftById = async (aircraftId: string): Promise<any> => {
  const response = await fetch('api/8/Aircraft/fetch', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      filter: `id == '${aircraftId}'`,
    }),
  });

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  const data = await response.json();
  return data.objs && data.objs.length > 0 ? data.objs[0] : null;
};

export const fetchAllAircraftCount = async (filter?: string): Promise<number> => {
  const response = await fetch('api/8/Aircraft/fetchCount', {
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

export const fetchAllAircraftWithPagination = async (pageSize: number, offset: number): Promise<any> => {
  const response = await fetch('api/8/Aircraft/fetch', {
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
