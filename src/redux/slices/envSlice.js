import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    env: 'Test',
};

const envSlice = createSlice({
    name: "env",
    initialState,
    reducers: {
        toggleEnv: (state, action) => {
            state.env = action.payload;
        }
    }
});

export const { setEnv, toggleEnv } = envSlice.actions;

export default envSlice.reducer;
