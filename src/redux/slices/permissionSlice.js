import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  permissionsLoading: false,
  permissionsError: null,
  permissions: [],
  aggregatorPermissionsLoading: false,
  aggregatorPermissionsError: null,
  aggregatorPermissions: [],
  updatePermissionsLoading: false,
  updatePermissionsError: null,
  updatePermissions: [],
};

const permissionsSlice = createSlice({
  name: 'permissions',
  initialState,
  reducers: {
    permissionsStart: (state) => {
      state.permissionsLoading = true;
      state.permissionsError = null;
    },
    permissionsSuccess: (state, action) => {
      state.permissionsLoading = false;
      state.permissions = action.payload;
    },
    permissionsFailure: (state, action) => {
      state.permissionsLoading = false;
      state.permissionsError = action.payload;
    },
    aggregatorPermissionsStart: (state) => {
      state.aggregatorPermissionsLoading = true;
      state.aggregatorPermissionsError = null;
    },
    aggregatorPermissionsSuccess: (state, action) => {
      state.aggregatorPermissionsLoading = false;
      state.aggregatorPermissions = action.payload;
    },
    aggregatorPermissionsFailure: (state, action) => {
      state.aggregatorPermissionsLoading = false;
      state.aggregatorPermissionsError = action.payload;
    },
    updatePermissionsStart: (state) => {
      state.updatePermissionsLoading = true;
      state.updatePermissionsError = null;
    },
    updatePermissionsSuccess: (state, action) => {
      state.updatePermissionsLoading = false;
      state.updatePermissions = action.payload;
    },
    updatePermissionsFailure: (state, action) => {
      state.updatePermissionsLoading = false;
      state.updatePermissionsError = action.payload;
    },
  },
});

export const { permissionsStart, permissionsSuccess, permissionsFailure, aggregatorPermissionsStart, aggregatorPermissionsSuccess, aggregatorPermissionsFailure, updatePermissionsStart, updatePermissionsSuccess, updatePermissionsFailure } = permissionsSlice.actions;

export default permissionsSlice.reducer;