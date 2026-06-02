import {
  Paper,
  Chip,
  Stack,
  Avatar,
  Box,
  Typography,
  Button,
  Badge,
  IconButton,
  Tooltip as MuiTooltip,
  Divider,
} from '@mui/material';
import { WindPower, Build, Update, Edit } from '@mui/icons-material';
import React from 'react';
import '@c3/ui/WindTurbine.scss';

interface WindTurbineHeader {
  turbineData: any;
}

const WindTurbineHeader: React.FC<WindTurbineHeader> = ({ turbineData }) => {
  return (
    <Paper className="wt-header-paper">
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2} className="wt-header-stack">
        <Box className="wt-header-avatarbox">
          <Avatar className="wt-header-avatar">
            <WindPower className="wt-header-avataricon" />
          </Avatar>
          <Box className="wt-header-titlebox">
            <Typography variant="h3" sx={{ fontWeight: 700 }}>
              {`Wind Turbine ${turbineData.id}`}
            </Typography>
          </Box>
        </Box>

        <Stack direction="row" spacing={2} alignItems="flex-start" className="wt-header-statusstack">
          <Badge
            overlap="circular"
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            className="wt-header-badge"
          >
            <Chip
              label={turbineData.active ? 'ACTIVE' : 'INACTIVE'}
              className={turbineData.active ? 'wt-header-chip-active' : 'wt-header-chip-inactive'}
            />
          </Badge>
        </Stack>
      </Stack>
    </Paper>
  );
};
export default WindTurbineHeader;
