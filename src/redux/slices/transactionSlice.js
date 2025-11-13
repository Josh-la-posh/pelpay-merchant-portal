import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  transactionLoading: false,
  transactionError: null,
  transactions: [],
  transactionPageSize: 20,
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
      // if (action.payload.pageNumber != null && 
      //     !isNaN(action.payload.pageNumber) && 
      //     action.payload.pageNumber > 0) {
      //   state.transactionPageNumber = action.payload.pageNumber;
      // }
      // if (action.payload.pageSize != null && 
      //     !isNaN(action.payload.pageSize) && 
      //     action.payload.pageSize > 0) {
      //   state.transactionPageSize = action.payload.pageSize;
      // }
      // if (action.payload.totalSize != null && !isNaN(action.payload.totalSize)) {
      //   state.transactionTotalSize = action.payload.totalSize;
      // }
    },
    transactionFailure: (state, action) => {
      state.transactionLoading = false;
      state.transactionError = action.payload;
    },
    setTransactionPageNumber: (state, action) => {
      state.transactionPageNumber = action.payload;
    },
    setTransactionPageSize: (state, action) => {
      state.transactionPageSize = action.payload;
      state.transactionPageNumber = 1;
    },
  },
});

export const { transactionStart, transactionSuccess, transactionFailure, transactionSecondSuccess,  setTransactionPageNumber, setTransactionPageSize, } = transactionSlice.actions;

export default transactionSlice.reducer;