import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    complianceLoading: false,
    complianceError: null,
    complianceData: [],

};

const complianceSlice = createSlice({
    name: 'compliance',
    initialState,
    reducers:{
    complianceStart: (state) => {
        state.complianceLoading = true;
        state.complianceError = null;
    },
    complianceSuccess: (state, action) => {
        state.complianceLoading = false;
        state.complianceData = action.payload?.data ?? action.payload;
    },
    complianceFailure: (state, action) => {
        state.complianceLoading = false;
        state.complianceError = action.payload;
    },
  },

});

export const { complianceStart, complianceSuccess, complianceFailure } = complianceSlice.actions;

export default complianceSlice.reducer;