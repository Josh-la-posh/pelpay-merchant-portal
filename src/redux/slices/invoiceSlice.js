import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  invoiceLoading: false,
  invoiceError: null,
  invoice: []
};

const invoiceSlice = createSlice({
  name: 'invoice',
  initialState,
  reducers: {
    invoiceStart: (state) => {
      state.invoiceLoading = true;
      state.invoiceError = null;
    },
    invoiceSuccess: (state, action) => {
      state.invoiceLoading = false;
      state.invoice = action.payload;
    },
    invoiceFailure: (state, action) => {
      state.invoiceLoading = false;
      state.invoiceError = action.payload;
    }
  },
});

export const { invoiceStart, invoiceSuccess, invoiceFailure } = invoiceSlice.actions;

export default invoiceSlice.reducer;