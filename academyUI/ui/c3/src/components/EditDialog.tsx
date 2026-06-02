import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  alpha,
} from '@mui/material';
import { Save, Cancel } from '@mui/icons-material';
import { useState } from 'react';

interface EditDialogProps {
  open: boolean;
  field: string;
  value: any;
  onClose: () => void;
  onSave: () => void;
  onChange: (newValue: any) => void;
  getFieldType: (field: string) => string;
  statusOptions?: string[];
  colors: any;
}

const EditDialog: React.FC<EditDialogProps> = ({
  open,
  field,
  value,
  onClose,
  onSave,
  onChange,
  getFieldType,
  statusOptions = ['ACTIVE', 'INACTIVE'],
  colors,
}) => {
  const fieldType = getFieldType ? getFieldType(field) : 'text';

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 4,
          background: colors.white,
          border: `1px solid ${colors.lighter}`,
        },
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Typography variant="h5" sx={{ fontWeight: 600, color: colors.primary }}>
          Edit {field}
        </Typography>
      </DialogTitle>
      <DialogContent sx={{ pt: 2 }}>
        {fieldType === 'select' ? (
          <FormControl fullWidth margin="normal">
            <InputLabel>Status</InputLabel>
            <Select value={value} onChange={(e) => onChange(e.target.value)} label="Status" sx={{ borderRadius: 2 }}>
              {statusOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {option.charAt(0).toUpperCase() + option.slice(1)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        ) : (
          <TextField
            fullWidth
            margin="normal"
            label={field}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            type={fieldType}
            InputLabelProps={fieldType === 'date' ? { shrink: true } : undefined}
            sx={{
              '& .MuiOutlinedInput-root': { borderRadius: 2 },
            }}
          />
        )}
      </DialogContent>
      <DialogActions sx={{ p: 3, gap: 1 }}>
        <Button
          onClick={onClose}
          startIcon={<Cancel />}
          sx={{
            borderRadius: 2,
            color: colors.tertiary,
            '&:hover': {
              backgroundColor: alpha(colors.light, 0.1),
            },
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={onSave}
          variant="contained"
          startIcon={<Save />}
          sx={{
            borderRadius: 2,
            bgcolor: colors.primary,
            color: colors.white,
            '&:hover': {
              bgcolor: colors.secondary,
            },
          }}
        >
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditDialog;
