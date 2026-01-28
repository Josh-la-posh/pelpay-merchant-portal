import {createSlice} from '@reduxjs/toolkit';

const initialState = {
    activityLoading: false,
    activityError: null,
    activities: [],
    activityPageSize: 20,
    activityPageNumber: 1,
    activityTotalSize: 0,
};

const activitySlice = createSlice({
    name: 'activity',
    initialState,
    reducers: {
        activityStart: (state) => {
            state.activityLoading = true;
            state.activityError = null;
        },
        activitySuccess: (state, action) => {
            state.activityLoading = false;
            state.activities = action.payload.data ?? action.payload;
            // state.activityPageNumber = action.payload.pageNumber;
            // state.activityPageSize = action.payload.pageSize;
            // state.activityTotalSize = action.payload.totalSize;
        },
        activityFailure: (state, action) => {
            state.activityLoading = false;
            state.activityError = action.payload;
        },
        setActivityPageNumber: (state, action) => {
            state.activityPageNumber = action.payload;
        },
        setActivityPageSize: (state, action) => {
            state.activityPageSize = action.payload;
            state.activityPageNumber = 1;
        },
    },
});

export const { activityStart, activitySuccess, activityFailure, activitySecondSuccess, setActivityPageNumber, setActivityPageSize, } = activitySlice.actions;

export default activitySlice.reducer;