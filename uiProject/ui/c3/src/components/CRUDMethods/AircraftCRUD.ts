// Aircraft CRUD methods

export const fetchAircraftCountWithFilter = async (baseId: string, filter: string): Promise<number> => {
  /*
    TODO 4.1: Implement the fetchAircraftCountWithFilter function to retrieve the count of Aircraft Types
          at a specific Base matching the provided filter.  This function should send a POST request to the
          'api/8/Aircraft/fetchCount' endpoint with a filter that combines the baseId and the provided filter,
          and return the count of matching Aircraft Types.
  */

  const response = await fetch('api/8/Aircraft/fetchCount', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      filter: `location == '${baseId}' && ${filter}`,
    }),
  });

  const data = await response.json();
  return data || 0;
};

export const fetchAircraftWithPagination = async (baseId: string, pageSize: number, offset: number): Promise<any> => {
  /*
    TODO 5.1: Implement the fetchAircraftWithPagination function to retrieve a paginated list of Aircraft Types
          at a specific Base. This function should send a POST request to the 'api/8/Aircraft/fetch' endpoint
          with a filter for the specified baseId, and return the list of Aircraft Types.
          It should use the limit and offset arguments for pagination.
  */

  const response = await fetch('api/8/Aircraft/fetch', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      filter: `location == '${baseId}'`,
      limit: pageSize,
      offset: offset,
    }),
  });

  const data = await response.json();

  return data.objs || [];
};
