import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    complianceLoading: false,
    complianceError: null,
    complianceData: {},
    complianceSuccess: null,
    step: 0,
};

const complianceSlice = createSlice({
    name: 'compliance',
    initialState,
    reducers:{
    complianceStart: (state) => {

        state.complianceSuccess = null;
        state.complianceLoading = true;
        state.complianceError = null;
    },
    complianceSuccess: (state, action) => {
        console.log("Compliance Success Data: ", action.payload)
                // console.log("I am working noww")
        state.complianceLoading = false;
        state.complianceData = action.payload?.data ?? action.payload;
        state.complianceSuccess = true;
    },
    complianceFailure: (state, action) => {
        state.complianceLoading = false;
        state.complianceError = action.payload;
    },
    complianceStep: (state, action) => {
        console.log("Compliance Steps: ", action.payload);
        state.step = action.payload;
    }
    
  },

});

export const { complianceStart, complianceSuccess, complianceFailure, complianceStep } = complianceSlice.actions;

export default complianceSlice.reducer;