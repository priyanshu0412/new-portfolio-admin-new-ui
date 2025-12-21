"use client";
import React, { useEffect } from "react";
import { Provider, useDispatch } from "react-redux";
import { store } from "@/store/store";
import { loginSuccess } from "@/store/auth/authSlice";

// ---------------------------------

const AuthInitializer = ({ children }) => {
    const dispatch = useDispatch();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            dispatch(loginSuccess(token));
        }
    }, []);

    return children;
};

const ClientProvider = ({ children }) => {
    return (
        <Provider store={store}>
            <AuthInitializer>{children}</AuthInitializer>
        </Provider>
    );
};

export default ClientProvider;
