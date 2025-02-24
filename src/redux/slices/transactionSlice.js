import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  transactionLoading: false,
  transactionError: null,
  transactions: [],
  transactionPageSize: 10,
  transactionPageNumber: 1,
  transactionTotalSize: 0,
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
      state.transactions = action.payload?.data ?? action.payload;
    },
    transactionSecondSuccess: (state, action) => {
      state.transactionPageNumber = action.payload.pageNumber;
      state.transactionPageSize = action.payload.pageSize;
      state.transactionTotalSize = action.payload.totalSize;
    },
    transactionFailure: (state, action) => {
      state.transactionLoading = false;
      state.transactionError = action.payload;
    }
  },
});

export const { transactionStart, transactionSuccess, transactionFailure, transactionSecondSuccess } = transactionSlice.actions;

export default transactionSlice.reducer;