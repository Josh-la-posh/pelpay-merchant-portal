import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  rolesLoading: false,
  rolesError: null,
  roles: [],
  userRolesLoading: false,
  userRolesError: null,
  userRoles: [],
  updateRolesLoading: false,
  updateRolesError: null,
  updateRoles: [],
};

const rolesSlice = createSlice({
  name: 'roles',
  initialState,
  reducers: {
    rolesStart: (state) => {
      state.rolesLoading = true;
      state.rolesError = null;
    },
    rolesSuccess: (state, action) => {
      state.rolesLoading = false;
      state.roles = action.payload;
    },
    rolesFailure: (state, action) => {
      state.rolesLoading = false;
      state.rolesError = action.payload;
    },
    userRolesStart: (state) => {
      state.userRolesLoading = true;
      state.userRolesError = null;
    },
    userRolesSuccess: (state, action) => {
      state.userRolesLoading = false;
      state.userRoles = action.payload;
    },
    userRolesFailure: (state, action) => {
      state.userRolesLoading = false;
      state.userRolesError = action.payload;
    },
    updateRolesStart: (state) => {
      state.updateRolesLoading = true;
      state.updateRolesError = null;
    },
    updateRolesSuccess: (state, action) => {
      state.updateRolesLoading = false;
      state.updateRoles = action.payload;
    },
    updateRolesFailure: (state, action) => {
      state.updateRolesLoading = false;
      state.updateRolesError = action.payload;
    },
  },
});

export const { rolesStart, rolesSuccess, rolesFailure, userRolesStart, userRolesSuccess, userRolesFailure, updateRolesStart, updateRolesSuccess, updateRolesFailure } = rolesSlice.actions;

export default rolesSlice.reducer;