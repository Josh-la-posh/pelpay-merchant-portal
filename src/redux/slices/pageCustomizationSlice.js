import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    pageCustomizationLoading: false,
    pageCustomizationError: null,
    pageCustomization: []
}

const pageCustomizationSlice = createSlice ({
    name: 'pageCustomization',
    initialState,
    reducers:{
        pageCustomizationStart: (state) => {
            state.pageCustomizationLoading = true;
            state.pageCustomizationError = null;
        },
        pageCustomizationSuccess: (state, action) => {
            state.pageCustomizationLoading = false;
            state.pageCustomization = action.payload.data ?? action.payload;
        },
        pageCustomizationFailure: (state, action) => {
            state.pageCustomizationLoading = false;
            state.pageCustomizationError = action.payload;
        }
    }
});


export const {pageCustomizationStart, pageCustomizationSuccess, pageCustomizationFailure} = pageCustomizationSlice.actions;

export default pageCustomizationSlice.reducer;