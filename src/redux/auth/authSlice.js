import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    user: null,
    token: null,
    role: null
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (state, action) => {
            const { user, access_token, role } = action.payload;
            state.user = user;
            state.token = access_token;
            state.role = role;
        },
        logOut: (state, action) => {
            state.user = null;
            state.token = null;
            state.role = null
        }, 
    },
});

export const { setCredentials, logOut } = authSlice.actions;

export default authSlice.reducer;

export const selectedCurrentUser = (state) => state.auth.user;
export const selectCurrentToken = (state) => state.auth.token;
export const selectCurrentRole = (state) => state.auth.role;
