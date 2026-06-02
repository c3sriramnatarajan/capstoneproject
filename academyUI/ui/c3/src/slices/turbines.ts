/*
  turbines.ts
 */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface TurbinesState {
    selectedIds: string[];
}

export const turbinesSlice = createSlice({
    name: 'turbines',
    initialState: { selectedIds: [] } as TurbinesState,
    reducers: {
        setSelectedTurbines: (state, action: PayloadAction<string[]>) => {
            state.selectedIds = action.payload;
        },
    },
});

export const { setSelectedTurbines } = turbinesSlice.actions;
export default turbinesSlice.reducer;