"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { loginSuccess } from "@/store/auth/authSlice";
import { FetchApi } from "@/utils/fetchAPI";
import { useRouter } from "next/navigation";
import Icon from "../icon";

// ----------------------------------------------
const LoginPageComponent = () => {
    const router = useRouter();
    const dispatch = useDispatch();

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const onSubmit = async (data) => {
        setError("");
        setSuccess("");
        setLoading(true);

        const res = await FetchApi({
            url: "/user/login",
            method: "POST",
            data,
        });

        setLoading(false);

        if (!res.success) {
            setError(res.data?.message || "Invalid credentials");
        } else {
            dispatch(loginSuccess(res.data.token));
            setSuccess("Login successful!");
            router.push("/");
        }
    };

    return (
        <div className="w-full flex justify-center items-center min-h-screen h-full bg-gradient-to-r from-[#0f172a] to-[#334155]">
            <div className="max-w-[1200px] w-full flex justify-center items-center px-8 md:px-0">
                <div className="max-w-md w-full bg-white rounded-2xl p-8 shadow-2xl flex flex-col gap-y-8">
                    {/* Header */}
                    <div className="flex flex-col justify-center items-center gap-y-3">
                        <div className="w-16 h-16 rounded-full bg-gray-100 flex justify-center items-center shadow-md">
                            <Icon icon={"mdi:shield-account-outline"} className="text-4xl text-[#0f172a]" />
                        </div>
                        <h2 className="text-2xl font-semibold text-gray-800">Admin Login</h2>
                        <p className="text-gray-500 text-sm">Enter your credentials to continue</p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit(onSubmit)} className="w-full flex flex-col gap-y-5">
                        {/* Email */}
                        <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-x-3 bg-gray-100 px-4 py-3 rounded-lg border border-gray-300">
                                <Icon icon={"mdi:email-outline"} className="text-gray-600 text-xl" />
                                <input
                                    {...register("email", { required: "Email is required" })}
                                    type="email"
                                    placeholder="Email Address"
                                    className="bg-transparent w-full outline-none text-gray-700"
                                />
                            </div>
                            {errors.email && (
                                <p className="text-xs text-red-600">{errors.email.message}</p>
                            )}
                        </div>

                        {/* Password */}
                        <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-x-3 bg-gray-100 px-4 py-3 rounded-lg border border-gray-300 relative">
                                <Icon icon={"mdi:lock-outline"} className="text-gray-600 text-xl" />
                                <input
                                    {...register("password", { required: "Password is required" })}
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Password"
                                    className="bg-transparent w-full outline-none text-gray-700"
                                />
                                <Icon
                                    icon={showPassword ? "mdi:eye-off-outline" : "mdi:eye-outline"}
                                    className="text-gray-600 text-xl cursor-pointer"
                                    onClick={() => setShowPassword(!showPassword)}
                                />
                            </div>
                            {errors.password && (
                                <p className="text-xs text-red-600">{errors.password.message}</p>
                            )}
                        </div>

                        {/* Error/Success Message */}
                        {error && <div className="text-red-600 text-center text-sm">{error}</div>}
                        {success && <div className="text-green-600 text-center text-sm">{success}</div>}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="w-full bg-[#0f172a] hover:bg-[#1e293b] transition-all text-white py-3 rounded-lg font-medium shadow-lg"
                        >
                            {loading ? "Logging in..." : "Login"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default LoginPageComponent;
