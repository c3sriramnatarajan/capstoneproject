// WindTurbine CRUD Methods
export const fetchAllTurbines = async (): Promise<any[]> => {
  const response = await fetch('api/8/WindTurbine/fetch', {
    // the endpoint follows the pattern /api/8/{TypeName}/{Operation}
    method: 'POST', // WindTurbine.fetch uses POST method
    headers: {
      'Content-Type': 'application/json', // specify JSON content type
    },
    body: JSON.stringify({}), // WindTurbine.fetch() does not require any parameters
  });

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  const data = await response.json(); // parse JSON response
  return data.objs || [];
};

export const fetchTurbineById = async (turbineId: string): Promise<any> => {
  const response = await fetch('api/8/WindTurbine/fetch', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      filter: `id == '${turbineId}'`,
    }),
  });

  if (!response.ok) {
    throw new Error('Network response was not ok for turbine data');
  }

  const data = await response.json();
  return data.objs?.[0] || null;
};
