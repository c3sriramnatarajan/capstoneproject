import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from '@mui/material';
import '@c3/ui/WindTurbine.scss';

const STATUS_OPTIONS = ['Open', 'In Progress', 'Resolved', 'Closed'];

const TECHNICIANS = [
  'John Smith',
  'Sarah Johnson',
  'Mike Wilson',
  'Emily Davis',
  'Sarah Wilson',
  'Mike Johnson',
  'Jane Doe',
];

interface WorkOrder {
  title: string;
  description: string;
  status: string;
  assignedTo: string;
  dueDate: string;
  estimatedHours: number | null;
}

interface WorkOrderModalProps {
  open: boolean;
  workOrder: WorkOrder;
  onClose: () => void;
  onSave: () => void;
  onChange?: (field: string) => (event: any) => void;
  onNumberChange?: (field: string, value: number | null) => void;
  isEdit?: boolean;
}

const WorkOrderModal: React.FC<WorkOrderModalProps> = ({
  open,
  workOrder,
  onClose,
  onSave,
  onChange,
  onNumberChange,
  isEdit = false,
}) => {
  // Text/select/datetime field changes (mirrors onNumberChange guards for optional parent handler)
  const fieldOnChange = (field: string) => {
    if (!onChange) {
      return () => {};
    }
    return onChange(field);
  };

  // Handle number field changes
  const handleNumberChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    // Allow empty string (user cleared the field)
    if (value === '') {
      if (onNumberChange) {
        onNumberChange(field, null);
      }
      return;
    }

    // Parse and validate the number
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue >= 0 && onNumberChange) {
      onNumberChange(field, numValue);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth className="work-order-modal">
      <DialogTitle className="work-order-modal-title">
        {isEdit ? 'Edit Work Order' : 'Create New Work Order'}
      </DialogTitle>
      <DialogContent className="work-order-modal-content">
        <Grid container spacing={3} className="work-order-modal-grid">
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Title"
              value={workOrder.title}
              onChange={fieldOnChange('title')}
              required
              variant="outlined"
              className="work-order-modal-textfield"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Description"
              value={workOrder.description}
              onChange={fieldOnChange('description')}
              required
              multiline
              rows={3}
              variant="outlined"
              className="work-order-modal-textfield"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={workOrder.status}
                onChange={fieldOnChange('status')}
                label="Status"
                className="work-order-modal-select"
                MenuProps={{
                  className: 'work-order-modal-select-menu',
                  anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'left',
                  },
                  transformOrigin: {
                    vertical: 'top',
                    horizontal: 'left',
                  },
                }}
              >
                {STATUS_OPTIONS.map((status) => (
                  <MenuItem key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Assigned To</InputLabel>
              <Select
                value={workOrder.assignedTo}
                onChange={fieldOnChange('assignedTo')}
                label="Assigned To"
                className="work-order-modal-select"
                MenuProps={{
                  className: 'work-order-modal-select-menu',
                  anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'left',
                  },
                  transformOrigin: {
                    vertical: 'top',
                    horizontal: 'left',
                  },
                }}
              >
                {TECHNICIANS.map((technician) => (
                  <MenuItem key={technician} value={technician}>
                    {technician}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Due Date"
              type="datetime-local"
              value={workOrder.dueDate}
              onChange={fieldOnChange('dueDate')}
              InputLabelProps={{
                shrink: true,
              }}
              variant="outlined"
              className="work-order-modal-textfield"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Estimated Hours"
              type="number"
              value={workOrder.estimatedHours ?? ''}
              onChange={handleNumberChange('estimatedHours')}
              variant="outlined"
              className="work-order-modal-textfield"
              inputProps={{
                min: 0,
                step: 0.5,
              }}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions className="work-order-modal-actions">
        <Button onClick={onClose} variant="outlined" className="work-order-modal-btn-cancel">
          Cancel
        </Button>
        <Button
          onClick={onSave}
          variant="contained"
          disabled={!workOrder.title || !workOrder.description}
          className="work-order-modal-btn-save"
        >
          {isEdit ? 'Save Edit' : 'Create Work Order'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default WorkOrderModal;
