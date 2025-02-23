import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  merchantLoading: false,
  merchantError: null,
  merchant: [],
  merchantDocumentLoading: false,
  merchantDocumentError: null,
  merchantDocument: [],
  merchantCredentialsLoading: false,
  merchantCredentialsError: null,
  merchantCredentials: {},
  merchantAccountLoading: false,
  merchantAccountError: null,
  merchantAccount: [],
  merchantAddressLoading: false,
  merchantAddressError: null,
  merchantAddress: [],
  merchantContactLoading: false,
  merchantContactError: null,
  merchantContact: [],
  merchantDomainLoading: false,
  merchantDomainError: null,
  merchantDomain: [],
  merchantProfileLoading: false,
  merchantProfileError: null,
  merchantProfile: [],
  merchantBusinessTypes: [],
  merchantRegistrationTypes: [],
  merchantDocumentTypeLoading: false,
  merchantDocumentTypeError: null,
  merchantDocumentType: [],
};

const merchantSlice = createSlice({
  name: 'merchant',
  initialState,
  reducers: {
    merchantStart: (state) => {
      state.merchantLoading = true;
      state.merchantError = null;
    },
    merchantSuccess: (state, action) => {
      state.merchantLoading = false;
      state.merchant = action.payload;
    },
    merchantFailure: (state, action) => {
      state.merchantLoading = false;
      state.merchantError = action.payload;
    },
    merchantDocumentStart: (state) => {
      state.merchantDocumentLoading = true;
      state.merchantDocumentError = null;
    },
    merchantDocumentSuccess: (state, action) => {
      state.merchantDocumentLoading = false;
      state.merchantDocument = action.payload;
    },
    merchantDocumentFailure: (state, action) => {
      state.merchantDocumentLoading = false;
      state.merchantDocumentError = action.payload;
    },
    merchantDocumentTypeStart: (state) => {
      state.merchantDocumentTypeLoading = true;
      state.merchantDocumentTypeError = null;
    },
    merchantDocumentTypeSuccess: (state, action) => {
      state.merchantDocumentTypeLoading = false;
      state.merchantDocumentType = action.payload;
    },
    merchantDocumentTypeFailure: (state, action) => {
      state.merchantDocumentTypeLoading = false;
      state.merchantDocumentTypeError = action.payload;
    },
    merchantAccountStart: (state) => {
      state.merchantAccountLoading = true;
      state.merchantAccountError = null;
    },
    merchantAccountSuccess: (state, action) => {
      state.merchantAccountLoading = false;
      state.merchantAccount = action.payload;
    },
    merchantAccountFailure: (state, action) => {
      state.merchantAccountLoading = false;
      state.merchantAccountError = action.payload;
    },
    merchantAddressStart: (state) => {
      state.merchantAddressLoading = true;
      state.merchantAddressError = null;
    },
    merchantAddressSuccess: (state, action) => {
      state.merchantAddressLoading = false;
      state.merchantAddress = action.payload;
    },
    merchantAddressFailure: (state, action) => {
      state.merchantAddressLoading = false;
      state.merchantAddressError = action.payload;
    },
    merchantContactStart: (state) => {
      state.merchantContactLoading = true;
      state.merchantContactError = null;
    },
    merchantContactSuccess: (state, action) => {
      state.merchantContactLoading = false;
      state.merchantContact = action.payload;
    },
    merchantContactFailure: (state, action) => {
      state.merchantContactLoading = false;
      state.merchantContactError = action.payload;
    },
    merchantDomainStart: (state) => {
      state.merchantDomainLoading = true;
      state.merchantDomainError = null;
    },
    merchantDomainSuccess: (state, action) => {
      state.merchantDomainLoading = false;
      state.merchantDomain = action.payload;
    },
    merchantDomainFailure: (state, action) => {
      state.merchantDomainLoading = false;
      state.merchantDomainError = action.payload;
    },
    merchantProfileStart: (state) => {
      state.merchantProfileLoading = true;
      state.merchantProfileError = null;
    },
    merchantProfileSuccess: (state, action) => {
      state.merchantProfileLoading = false;
      state.merchantProfile = action.payload;
    },
    merchantProfileFailure: (state, action) => {
      state.merchantProfileLoading = false;
      state.merchantProfileError = action.payload;
    },
    merchantBusinessTypesSucess: (state, action) => {
      state.merchantBusinessTypes = action.payload;
    },
    merchantRegistrationTypesSucess: (state, action) => {
      state.merchantRegistrationTypes = action.payload;
    },
    merchantCredentialsStart: (state) => {
      state.merchantCredentialsLoading = true;
      state.merchantCredentialsError = null;
    },
    merchantCredentialsSuccess: (state, action) => {
      state.merchantCredentialsLoading = false;
      state.merchantCredentials = action.payload;
    },
    merchantCredentialsFailure: (state, action) => {
      state.merchantCredentialsLoading = false;
      state.merchantCredentialsError = action.payload;
    },
  },
});

export const { merchantStart, merchantSuccess, merchantFailure, merchantDocumentStart, merchantDocumentSuccess, merchantDocumentFailure, merchantDocumentTypeStart, merchantDocumentTypeSuccess, merchantDocumentTypeFailure, merchantAccountStart, merchantAccountSuccess, merchantAccountFailure, merchantAddressStart, merchantAddressSuccess, merchantAddressFailure, merchantContactStart, merchantContactSuccess, merchantContactFailure, merchantDomainStart, merchantDomainSuccess, merchantDomainFailure, merchantProfileStart, merchantProfileSuccess, merchantProfileFailure, merchantBusinessTypesSucess, merchantRegistrationTypesSucess, merchantCredentialsStart, merchantCredentialsSuccess, merchantCredentialsFailure } = merchantSlice.actions;

export default merchantSlice.reducer;