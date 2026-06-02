import React from 'react';
import { Card, CardContent, Box, Avatar, IconButton, Typography, LinearProgress } from '@mui/material';
import { Edit } from '@mui/icons-material';
import '@c3/ui/WindTurbine.scss';

const ModernMetricCard = ({
  icon,
  title,
  value,
  unit,
  colorKey,
  field,
}: {
  icon: React.ReactNode;
  title: string;
  value: number;
  unit: string;
  colorKey: string;
  field: string;
}) => {
  return (
    <Card className={`modern-metric-card metric-card-${colorKey}`}>
      <CardContent className="metric-card-content">
        <Box className="metric-card-header">
          <Avatar className={`metric-card-avatar avatar-${colorKey}`}>{icon}</Avatar>
        </Box>

        <Typography variant="h6" className="metric-card-title">
          {title}
        </Typography>

        <Typography variant="h3" className={`metric-card-value value-${colorKey}`}>
          {value}
          {unit}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default ModernMetricCard;
