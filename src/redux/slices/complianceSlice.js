import { createSlice } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from 'uuid';

const initialState = {
    complianceLoading: false,
    complianceError: null,
    complianceData: {},
    complianceSuccess: null,
    step: 0,
    businessRepresentatives: [],
};

const complianceSlice = createSlice({
    name: 'compliance',
    initialState,
    reducers: {
        complianceStart: (state) => {
            state.complianceSuccess = null;
            state.complianceLoading = true;
            state.complianceError = null;
        },
        complianceSuccess: (state, action) => {
            state.complianceLoading = false;
            state.complianceData = action.payload?.data ?? action.payload;
            state.complianceSuccess = true;
        },
        complianceFailure: (state, action) => {
            state.complianceLoading = false;
            state.complianceError = action.payload;
        },
        complianceStep: (state, action) => {
            state.step = action.payload;
        },
        setBusinessRepresentatives: (state, action) => {
            state.businessRepresentatives = action.payload; // set business representatives in state
        },
        addBusinessRepresentative: (state, action) => {
            const newRep = { ...action.payload, id: uuidv4() };
            state.businessRepresentatives.push(newRep);
        },
        updateBusinessRepresentative: (state, action) => {
            state.businessRepresentatives = state.businessRepresentatives.map(rep =>
                rep.id === action.payload.id ? { ...rep, ...action.payload } : rep
            );
        },
    },

});

export const {
  complianceStart,
  complianceSuccess,
  complianceFailure,
  complianceStep,
  setBusinessRepresentatives,
  addBusinessRepresentative,
  updateBusinessRepresentative,
} = complianceSlice.actions;

export default complianceSlice.reducer;