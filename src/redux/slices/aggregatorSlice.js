import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  aggregatorLoading: false,
  aggregatorMerchantLoading: false,
  aggregatorBankLoading: false,
  aggregatorDocumentLoading: false,
  aggregatorError: null,
  aggregatorMerchantError: null,
  aggregatorBankError: null,
  aggregatorDocumentError: null,
  aggregator: [],
  aggregatorMerchants: [],
  aggregatorBank: [],
  aggregatorDocument: []
};

const aggregatorSlice = createSlice({
  name: 'aggregator',
  initialState,
  reducers: {
    aggregatorStart: (state) => {
      state.aggregatorLoading = true;
      state.aggregatorError = null;
    },
    aggregatorSuccess: (state, action) => {
      state.aggregatorLoading = false;
      state.aggregator = action.payload;
    },
    aggregatorFailure: (state, action) => {
      state.aggregatorLoading = false;
      state.aggregatorError = action.payload;
    },
    aggregatorMerchantStart: (state) => {
      state.aggregatorMerchantLoading = true;
      state.aggregatorMerchantError = null;
    },
    aggregatorBankStart: (state) => {
      state.aggregatorBankLoading = true;
      state.aggregatorBankError = null;
    },
    aggregatorDocumentStart: (state) => {
      state.aggregatorDocumentLoading = true;
      state.aggregatorDocumentError = null;
    },
    aggregatorMerchantSuccess: (state, action) => {
      state.aggregatorMerchantLoading = false;
      state.aggregatorMerchants = action.payload;
    },
    aggregatorBankSuccess: (state, action) => {
      state.aggregatorLoading = false;
      state.aggregatorBank = action.payload;
    },
    aggregatorDocumentSuccess: (state, action) => {
      state.aggregatorDocumentLoading = false;
      state.aggregatorDocument = action.payload;
    },
    aggregatorMerchantFailure: (state, action) => {
      state.aggregatorMerchantLoading = false;
      state.aggregatorMerchantError = action.payload;
    },
    aggregatorBankFailure: (state, action) => {
      state.aggregatorBankLoading = false;
      state.aggregatorBankError = action.payload;
    },
    aggregatorDocumentFailure: (state, action) => {
      state.aggregatorDocumentLoading = false;
      state.aggregatorDocumentError = action.payload;
    },
  },
});

export const { aggregatorStart, aggregatorMerchantStart, aggregatorBankStart, aggregatorDocumentStart, aggregatorSuccess, aggregatorMerchantSuccess, aggregatorBankSuccess, aggregatorDocumentSuccess, aggregatorFailure, aggregatorMerchantFailure, aggregatorBankFailure, aggregatorDocumentFailure } = aggregatorSlice.actions;

export default aggregatorSlice.reducer;