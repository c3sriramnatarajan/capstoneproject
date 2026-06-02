import React from 'react';
import { Grid, Box, Typography, IconButton } from '@mui/material';
import { WindPower, LocationOn, Engineering, ElectricBolt, Schedule, Edit } from '@mui/icons-material';
import '@c3/ui/WindTurbine.scss';
const TurbineDetailsTab = ({ turbineData }: { turbineData: any }) => (
  <Grid container spacing={4}>
    <Grid item xs={12} md={4}>
      <Box className="turbine-details-field field-primary">
        <Typography variant="subtitle1" className="turbine-details-field-label">
          Turbine ID
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 1 }}>
          <WindPower fontSize="small" sx={{ mr: 1 }} />
          <Typography variant="h6">{turbineData.id || 'Not set'}</Typography>
        </Box>
      </Box>
    </Grid>
    <Grid item xs={12} md={4}>
      <Box className="turbine-details-field field-secondary">
        <Typography variant="subtitle1" className="turbine-details-field-label">
          Country
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 1 }}>
          <LocationOn fontSize="small" sx={{ mr: 1 }} />
          <Typography variant="h6">{turbineData.country || 'Not set'}</Typography>
        </Box>
      </Box>
    </Grid>
    <Grid item xs={12} md={4}>
      <Box className="turbine-details-field field-tertiary">
        <Typography variant="subtitle1" className="turbine-details-field-label">
          Manufacturer
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 1 }}>
          <Engineering fontSize="small" sx={{ mr: 1 }} />
          <Typography variant="h6">{turbineData.manufacturerName || 'Not set'}</Typography>
        </Box>
      </Box>
    </Grid>
    <Grid item xs={12} md={4}>
      <Box className="turbine-details-field field-quaternary">
        <Typography variant="subtitle1" className="turbine-details-field-label">
          Total Generated
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 1 }}>
          <ElectricBolt fontSize="small" sx={{ mr: 1 }} />
          <Typography variant="h6">{turbineData.totalGenerated || 'Not set'} MWh</Typography>
        </Box>
      </Box>
    </Grid>
    <Grid item xs={12} md={4}>
      <Box className="turbine-details-field field-primary">
        <Typography variant="subtitle1" className="turbine-details-field-label">
          Install Date
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 1 }}>
          <Schedule fontSize="small" sx={{ mr: 1 }} />
          <Typography variant="h6">{turbineData.installationDate || 'Not set'}</Typography>
        </Box>
      </Box>
    </Grid>
    <Grid item xs={12} md={4}>
      <Box className="turbine-details-field field-secondary">
        <Typography variant="subtitle1" className="turbine-details-field-label">
          Build Date
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 1 }}>
          <Schedule fontSize="small" sx={{ mr: 1 }} />
          <Typography variant="h6">{turbineData.buildDate || 'Not set'}</Typography>
        </Box>
      </Box>
    </Grid>
  </Grid>
);

export default TurbineDetailsTab;
