/*
  WindTurbineFilter.tsx

  This component provides a filter interface for selecting wind turbines from a dropdown menu.
  It uses Material-UI components for the dropdown and checkboxes, and maintains the selected turbines in its state.
*/

import React from 'react';
import '@c3/ui/WindTurbine.scss';
import { Select } from '@mui/material';
import { useDispatch } from '@c3/ui/UiSdlUseDispatch';
import { useSelectedState } from '@c3/ui/UiSdlUseData';
import { MenuItem, Checkbox, ListItemText } from '@mui/material';
import { setSelectedTurbines } from '@c3/app/ui/src/slices/turbines';

interface WindTurbineFilterProps {
    turbines: WindTurbine[];
}


const WindTurbineFilter: React.FC<WindTurbineFilterProps> = ({ turbines }) => {
    const dispatch = useDispatch();
    const turbinesState = useSelectedState((state) => state.get('turbines'));
    const selectedTurbines = turbinesState?.selectedIds ?? [];

    const handleChange = (event: any) => {
        const value = event.target.value;
        // console.log('Selected Turbines:', value); // Uncomment this if you want to log the selected turbines
        dispatch(setSelectedTurbines(value));
    };

    return (
        <>
            <div className="filter-container">
                {/* Filter Header */}
                <div className="filter-header">
                    <h3 className="filter-title">Wind Turbine Filter</h3>
                </div>

                {/* Dropdown Selection */}
                <div className="filter-dropdown-section">
                    <label className="filter-label">Select Wind Turbine:</label>

                    <Select
                        labelId="turbine-select-label"
                        multiple
                        value={selectedTurbines}
                        renderValue={(selected) => selected.join(', ')}
                        onChange={handleChange}
                    >
                        {turbines.map((turbine) => (
                            <MenuItem key={turbine.id} value={turbine.id}>
                                <Checkbox checked={selectedTurbines.indexOf(turbine.id) > -1} />
                                <ListItemText primary={turbine.id} />
                            </MenuItem>
                        ))}
                    </Select>
                </div>
            </div>
        </>
    );
};

export default WindTurbineFilter;
