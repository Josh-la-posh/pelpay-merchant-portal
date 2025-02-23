import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  transactionLoading: false,
  transactionError: null,
  transactions: []
};

const transactionSlice = createSlice({
  name: 'transaction',
  initialState,
  reducers: {
    transactionStart: (state) => {
      state.transactionLoading = true;
      state.transactionError = null;
    },
    transactionSuccess: (state, action) => {
      state.transactionLoading = false;
      state.transactions = action.payload;
    },
    transactionFailure: (state, action) => {
      state.transactionLoading = false;
      state.transactionError = action.payload;
    }
  },
});

export const { transactionStart, transactionSuccess, transactionFailure } = transactionSlice.actions;

export default transactionSlice.reducer;