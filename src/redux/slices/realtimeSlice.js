import { createSlice } from '@reduxjs/toolkit';
import { 
  processRealtimeAnalytics, 
  processRealtimeLumpsum, 
  processRealtimeGraph, 
  processRealtimeTransactions 
} from '@/utils/processRealtimeData';

const initialState = {
  isConnected: false,
  lastUpdate: null,
  realtimeAnalytics: null,
  realtimeLumpsum: null,
  realtimeGraph: null,
  realtimeTransactions: null,
  useRealtime: false, // Flag to determine if we should use realtime or API data
};

const realtimeSlice = createSlice({
  name: 'realtime',
  initialState,
  reducers: {
    setConnectionStatus: (state, action) => {
      state.isConnected = action.payload;
      // If disconnected, disable realtime usage
      if (!action.payload) {
        state.useRealtime = false;
      }
    },
    
    updateRealtimeAnalytics: (state, action) => {
      const processedData = processRealtimeAnalytics(action.payload);
      if (processedData) {
        state.realtimeAnalytics = processedData;
        state.lastUpdate = new Date().toISOString();
        state.useRealtime = true;
      }
    },
    
    updateRealtimeLumpsum: (state, action) => {
      const processedData = processRealtimeLumpsum(action.payload);
      if (processedData) {
        state.realtimeLumpsum = processedData;
        state.lastUpdate = new Date().toISOString();
        state.useRealtime = true;
      }
    },
    
    updateRealtimeGraph: (state, action) => {
      const processedData = processRealtimeGraph(action.payload);
      if (processedData) {
        state.realtimeGraph = processedData;
        state.lastUpdate = new Date().toISOString();
        state.useRealtime = true;
      }
    },
    
    updateRealtimeTransactions: (state, action) => {
      const processedData = processRealtimeTransactions(action.payload);
      if (processedData) {
        state.realtimeTransactions = processedData;
        state.lastUpdate = new Date().toISOString();
        state.useRealtime = true;
      }
    },
    
    clearRealtimeData: (state) => {
      state.realtimeAnalytics = null;
      state.realtimeLumpsum = null;
      state.realtimeGraph = null;
      state.realtimeTransactions = null;
      state.useRealtime = false;
      state.lastUpdate = null;
    },
    
    fallbackToApi: (state) => {
      state.useRealtime = false;
    },
  },
});

export const {
  setConnectionStatus,
  updateRealtimeAnalytics,
  updateRealtimeLumpsum,
  updateRealtimeGraph,
  updateRealtimeTransactions,
  clearRealtimeData,
  fallbackToApi,
} = realtimeSlice.actions;

export default realtimeSlice.reducer;
