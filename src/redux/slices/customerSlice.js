import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  customerLoading: false,
  customerError: null,
  customers: []
};

const customerSlice = createSlice({
  name: 'customer',
  initialState,
  reducers: {
    customerStart: (state) => {
      state.customerLoading = true;
      state.customerError = null;
    },
    customerSuccess: (state, action) => {
      state.loading = false;
      state.customers = action.payload
    },
    customerFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { customerStart, customerSuccess, customerFailure } = customerSlice.actions;

export default customerSlice.reducer;