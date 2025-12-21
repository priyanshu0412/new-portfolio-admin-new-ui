"use client";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const ProtectedRoute = ({ children }) => {
    const router = useRouter();
    const isAuthenticated = useSelector(
        (state) => state.auth.isAuthenticated
    );

    useEffect(() => {
        if (!isAuthenticated) {
            router.replace("/login");
        }
    }, [isAuthenticated]);

    if (!isAuthenticated) return null;

    return children;
};

export default ProtectedRoute;
