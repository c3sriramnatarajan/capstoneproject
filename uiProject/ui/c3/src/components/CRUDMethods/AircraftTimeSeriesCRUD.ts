export const fetchSeriesByAircraftId = async (aircraftId: string): Promise<any[]> => {
  const response = await fetch('api/8/SensorMeasurementSeries/fetch', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      filter: `sensor.aircraft == '${aircraftId}'`,
      include: 'id, name, unit',
    }),
  });

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  const data = await response.json();
  return data.objs || [];
};

export const fetchMeasurements = async (seriesId: string, limit: number = -1): Promise<any[]> => {
  const response = await fetch('api/8/SensorMeasurement/fetch', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      filter: `parent == '${seriesId}'`,
      limit,
      order: 'ascending(start)',
    }),
  });

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  const data = await response.json();
  return data.objs || [];
};
