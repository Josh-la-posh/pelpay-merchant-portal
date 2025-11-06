// src/features/auth/authSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isLoggedIn: false,
  loading: false,
  error: null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state) => {
      state.loading = false;
      state.isLoggedIn = true;
    },
    loginFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.isLoggedIn = false;
      localStorage.removeItem('RolePermission');
      localStorage.removeItem('roles');
    }
  },
});

export const { loginStart, loginSuccess, loginFailure, logout } = authSlice.actions;

export default authSlice.reducer;