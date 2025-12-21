import { createSlice } from "@reduxjs/toolkit";

const tokenFromStorage =
    typeof window !== "undefined"
        ? localStorage.getItem("token")
        : null;

const initialState = {
    token: tokenFromStorage || null,
    isAuthenticated: !!tokenFromStorage,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        loginSuccess: (state, action) => {
            state.token = action.payload;
            state.isAuthenticated = true;
            if (typeof window !== "undefined") {
                localStorage.setItem("token", action.payload);
            }
        },
        logout: (state) => {
            state.token = null;
            state.isAuthenticated = false;
            if (typeof window !== "undefined") {
                localStorage.removeItem("token");
                document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            }
        },
    },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
