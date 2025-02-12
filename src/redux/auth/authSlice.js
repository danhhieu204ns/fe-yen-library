import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    user: null,
    token: null,
    roles: null,
    expirationTime: null
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (state, action) => {
            const { user, access_token, expire } = action.payload;
            state.user = user;
            state.token = access_token;
            state.roles = user.roles;
            if (expire) {
                state.expirationTime = new Date(expire).getTime(); // Chuyển đổi giá trị expire thành timestamp
            } else {
                console.error("Expire is undefined");
            }
        },
        logOut: (state, action) => {
            state.user = null;
            state.token = null;
            state.roles = null;
            state.expirationTime = null;
        }, 
    },
});

export const { setCredentials, logOut } = authSlice.actions;

export default authSlice.reducer;

export const selectedCurrentUser = (state) => state.auth.user;
export const selectCurrentToken = (state) => state.auth.token;
export const selectCurrentRoles = (state) => state.auth.roles;
export const selectCurrentExpirationTime = (state) => state.auth.expirationTime;
