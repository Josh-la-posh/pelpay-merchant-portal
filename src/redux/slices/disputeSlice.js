import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  disputeLoading: false,
  disputeError: null,
  disputes: []
};

const disputeSlice = createSlice({
  name: 'dispute',
  initialState,
  reducers: {
    disputeStart: (state) => {
      state.disputeLoading = true;
      state.disputeError = null;
    },
    disputeSuccess: (state, action) => {
      state.disputeLoading = false;
      state.disputes = action.payload;
    },
    disputeFailure: (state, action) => {
      state.disputeLoading = false;
      state.disputeError = action.payload;
    }
  },
});

export const { disputeStart, disputeSuccess, disputeFailure } = disputeSlice.actions;

export default disputeSlice.reducer;