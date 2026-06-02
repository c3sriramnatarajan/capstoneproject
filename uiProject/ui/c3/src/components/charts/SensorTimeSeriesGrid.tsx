import React, { useEffect, useState } from 'react';

import LoadingAnimation from '@c3/app/ui/src/components/misc/LoadingAnimation';
import TimeSeriesChart from '@c3/app/ui/src/components/charts/TimeSeriesChart';
import {
  fetchSeriesByAircraftId,
  fetchMeasurements,
} from '@c3/app/ui/src/components/CRUDMethods/AircraftTimeSeriesCRUD';

const SERIES_COLORS: Record<string, string> = {
  'Fan Rotation Speed': '#1565c0',
  'Oil Pressure': '#e65100',
  'Oil Temperature': '#c62828',
  Vibration: '#7b1fa2',
};

interface SeriesChartData {
  seriesId: string;
  name: string;
  unit: string;
  chartData: { date: string; value: number }[];
}

interface SensorTimeSeriesGridProps {
  aircraftId: string;
}

const SensorTimeSeriesGrid = ({ aircraftId }: SensorTimeSeriesGridProps) => {
  const [timeSeriesData, setTimeSeriesData] = useState<SeriesChartData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadTimeSeries = async () => {
      setLoading(true);
      try {
        const seriesList = await fetchSeriesByAircraftId(aircraftId);

        const chartDataList: SeriesChartData[] = await Promise.all(
          seriesList.map(async (s: any) => {
            const measurements = await fetchMeasurements(s.id);
            const chartData = measurements.map((m: any) => ({
              date: m.start,
              value: m.measurement,
            }));

            return { seriesId: s.id, name: s.name, unit: s.unit, chartData };
          })
        );

        setTimeSeriesData(chartDataList);
      } catch (error) {
        console.error('Error loading time series data: ', error);
      } finally {
        setLoading(false);
      }
    };

    if (aircraftId) {
      loadTimeSeries();
    }
  }, [aircraftId]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '48px 0' }}>
        <LoadingAnimation />
      </div>
    );
  }

  if (timeSeriesData.length === 0) {
    return null;
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
      {timeSeriesData.map((series) => (
        <TimeSeriesChart
          key={series.seriesId}
          title={series.name}
          unit={series.unit}
          color={SERIES_COLORS[series.name] || '#333'}
          data={series.chartData}
        />
      ))}
    </div>
  );
};

export default SensorTimeSeriesGrid;
