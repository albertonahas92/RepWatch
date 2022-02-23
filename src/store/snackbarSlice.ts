/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SnackbarState, State, UserState } from '../types/state';
import { User } from '../types/user';

const initialState: SnackbarState = { open: false, message: '', type: 'success' };

export const snackbarSlice = createSlice({
  name: 'snackbar',
  initialState,
  reducers: {
    setSnackbar: (state: SnackbarState, action: PayloadAction<SnackbarState>) => {
      state.message = action.payload.message;
      state.type = action.payload.type;
      state.open = action.payload.open;
    },
  }
});
export const snackbarSelector = (state: State) => state.snackbar

// Action creators are generated for each case reducer function
export const { setSnackbar } = snackbarSlice.actions;

export default snackbarSlice.reducer;
