import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    env: 'Live',
    token: false
};

const envSlice = createSlice({
    name: "env",
    initialState,
    reducers: {
        setEnv: (state, action) => {
            state.env = action.payload;
        },
        toggleEnv: (state, action) => {
            state.env = action.payload;
        },
        setToken: (state, action) => {
            state.token = action.payload;
        },
        tokenToggle: (state, action) => {
            state.token = action.payload;
        },
    }
});

export const { setEnv, toggleEnv, setToken, tokenToggle } = envSlice.actions;

export default envSlice.reducer;
