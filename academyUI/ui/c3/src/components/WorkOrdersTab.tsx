import React from 'react';
import { Box, Typography, Paper, Button, Stack, IconButton, Tooltip as MuiTooltip } from '@mui/material';
import { Edit, Delete, Add, Person } from '@mui/icons-material';
import '@c3/ui/WindTurbine.scss';

/** Maps status text to a single BEM-style class token (e.g. "In Progress" → "In-Progress" for SCSS). */
const workOrderStatusToClassSuffix = (status: string) => status.replace(/\s+/g, '-');

const WorkOrdersTab = ({
  workOrders,
  handleEditWorkOrder,
  handleDeleteWorkOrder,
  handleWorkOrderOpenModal,
}: {
  workOrders: any[];
  handleEditWorkOrder: (order: any) => void;
  handleDeleteWorkOrder: (id: string) => void;
  handleWorkOrderOpenModal: () => void;
}) => (
  <Box className="work-orders-container">
    <Box className="work-orders-header">
      <Typography variant="h6" className="work-orders-title">
        Work Orders
      </Typography>
      <MuiTooltip title="Create Work Order">
        <IconButton color="primary" onClick={handleWorkOrderOpenModal} className="work-orders-add-btn">
          <Add />
        </IconButton>
      </MuiTooltip>
    </Box>
    <Stack spacing={2} className="work-orders-stack">
      {workOrders.map((order) => (
        <Paper key={order.id} className="work-order-card">
          <Box className="work-order-header">
            <Typography variant="h6" className="work-order-title">
              {order.title}
            </Typography>
            <Box className="work-order-actions">
              <Button
                variant="outlined"
                size="small"
                startIcon={<Edit />}
                onClick={() => handleEditWorkOrder(order)}
                className="work-order-edit-btn"
              >
                Edit
              </Button>
              <Button
                variant="outlined"
                color="error"
                size="small"
                startIcon={<Delete />}
                onClick={() => handleDeleteWorkOrder(order.id)}
                className="work-order-delete-btn"
              >
                Delete
              </Button>
            </Box>
          </Box>

          <Box className="work-order-meta">
            <Box
              className={`work-order-priority work-order-priority-${workOrderStatusToClassSuffix(order.status)}`}
            >
              {order.status}
            </Box>

            <Box className="work-order-assignee">
              <Person className="work-order-assignee-icon" />
              <Typography variant="body2" className="work-order-assignee-name">
                {order.assignedTo}
              </Typography>
            </Box>

            <Box className="work-order-due-date">
              <Typography variant="body2">
                Due: {order.dueDate ? new Date(order.dueDate).toLocaleString() : 'Not set'}
              </Typography>
            </Box>
          </Box>

          <Typography variant="body2" className="work-order-description">
            {order.description}
          </Typography>
        </Paper>
      ))}
    </Stack>
  </Box>
);

export default WorkOrdersTab;
