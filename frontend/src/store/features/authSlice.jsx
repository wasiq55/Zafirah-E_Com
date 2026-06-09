import { createSlice } from "@reduxjs/toolkit";

export const authSlice = createSlice({
    name: 'auth',
    initialState:{
        user: null,
        isLoggedIn: false,
        isLoading: true
    },
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
            state.isLoggedIn = true;
            state.isLoading = false;
        },
        removeUser: (state) => {
            state.user = null;
            state.isLoggedIn = false;
        },
        updateUserRole: (state, action) => {
            if (state.user) {
                state.user.role = action.payload;
            }
        }
    }
})

export const {setUser, removeUser, updateUserRole} = authSlice.actions;
export default authSlice.reducer;

