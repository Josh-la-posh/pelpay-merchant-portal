// src/features/auth/authSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  lumpsumLoading: false,
  graphLoading: false,
  lumpsumError: null,
  graphError: null,
  lumpsum: [],
  graph: [],
  transactionLoading: false,
  transactionError: null,
  transactions: [],
  analyticsLoading: false,
  analyticsError: null,
  analytics: {}
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    lumpsumStart: (state) => {
      state.lumpsumLoading = true;
      state.lumpsumError = null;
    },
    lumpsumSuccess: (state, action) => {
      state.lumpsumLoading = false;
      state.lumpsum = action.payload;
    },
    lumpsumFailure: (state, action) => {
      state.lumpsumLoading = false;
      state.lumpsumError = action.payload;
    },
    graphStart: (state) => {
      state.graphLoading = true;
      state.graphError = null;
    },
    graphSuccess: (state, action) => {
      state.graphLoading = false;
      state.graph = action.payload;
    },
    graphFailure: (state, action) => {
      state.graphLoading = false;
      state.graphError = action.payload;
    },
    transactionStart: (state) => {
      state.transactionLoading = true;
      state.transactionError = null;
    },
    transactionSuccess: (state, action) => {
      state.transactionLoading = false;
      state.transactions = action.payload?.data ?? action.payload;
    },
    transactionFailure: (state, action) => {
      state.transactionLoading = false;
      state.transactionError = action.payload;
    },
    analyticsStart: (state) => {
      state.analyticsLoading = true;
      state.analyticsError = null;
    },
    analyticsSuccess: (state, action) => {
      state.analyticsLoading = false;
      state.analytics = action.payload?.data ?? action.payload;
    },
    analyticsFailure: (state, action) => {
      state.analyticsLoading = false;
      state.analyticsError = action.payload;
    }
  },
});

export const { lumpsumStart, lumpsumSuccess, lumpsumFailure, graphStart, graphSuccess, graphFailure, transactionStart, transactionSuccess, transactionFailure, analyticsStart, analyticsSuccess, analyticsFailure } = dashboardSlice.actions;

export default dashboardSlice.reducer;