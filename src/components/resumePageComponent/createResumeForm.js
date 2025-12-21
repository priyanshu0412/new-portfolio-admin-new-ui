"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import ReUseHeadingTitle from "../reUseHeadingTitle";
import Icon from "../icon";
import Link from "next/link";
import { FetchApi } from "@/utils/fetchAPI";
import Cookies from "js-cookie";
import { toast } from "react-hot-toast";

// --------------------------------------

const CreateResumeForm = () => {

    const router = useRouter();

    const tokenFromRedux = useSelector((state) => state.auth.token);
    const token = tokenFromRedux || Cookies.get("token");

    const [loading, setLoading] = useState(false);
    const [filePreview, setFilePreview] = useState(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
        reset,
    } = useForm();

    const watchedFile = watch("resume");

    useEffect(() => {
        if (watchedFile && watchedFile[0]) {
            const fileURL = URL.createObjectURL(watchedFile[0]);
            setFilePreview(fileURL);

            return () => URL.revokeObjectURL(fileURL);
        }
    }, [watchedFile]);

    const onSubmit = async (data) => {
        if (!token) {
            toast.error("You are not authenticated!");
            return;
        }

        setLoading(true);

        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("resume", data.resume[0]);
        formData.append("isActive", data.isActive ? true : false);

        try {
            const res = await FetchApi({
                url: "/resume/upload",
                method: "POST",
                data: formData,
                token,
            });

            setLoading(false);

            if (res.success) {
                toast.success("Resume added successfully!");
                setTimeout(() => {
                    router.push("/manage-resume");
                }, 1000);
            }
            else {
                toast.error(res.data?.message || "Something went wrong!");
            }
        } catch (error) {
            setLoading(false);
            toast.error("Something went wrong!");
        }
    };

    return (
        <>
            <div className="flex flex-col w-full min-h-screen h-full">
                {/* Header */}
                <div className="flex flex-col items-start gap-y-6 w-full justify-between">
                    <Link
                        href={"/manage-resume"}
                        className="w-fit gap-x-4 font-semibold text-sm flex justify-center items-center rounded-md px-4 py-2 h-fit border-2 border-black bg-white text-black"
                    >
                        <Icon icon={"lets-icons:back"} /> Back
                    </Link>
                    <ReUseHeadingTitle
                        title={"Upload Resume"}
                        desc={
                            "Add your resume here and manage all your versions in one place."
                        }
                    />
                </div>

                {/* Form */}
                <div className="mt-8 w-full bg-white border border-gray-200 rounded-xl shadow-md p-6 overflow-hidden">
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="w-full flex flex-col gap-y-6"
                    >
                        {/* Name */}
                        <div className="flex flex-col gap-y-2">
                            <label className="text-sm font-semibold">Name *</label>
                            <input
                                type="text"
                                placeholder="My Resume 2024"
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-800 placeholder-gray-400 shadow-sm"
                                {...register("name", { required: "Name is required" })}
                            />
                            {errors.name && (
                                <p className="text-xs text-red-600">{errors.name.message}</p>
                            )}
                        </div>

                        {/* File Upload */}
                        <div className="flex flex-col gap-y-2">
                            <label className="text-sm font-semibold">Resume *</label>
                            <input
                                type="file"
                                accept=".pdf"
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-800 placeholder-gray-400 shadow-sm"
                                {...register("resume", { required: "Resume file is required" })}
                            />
                            {errors.resume && (
                                <p className="text-xs text-red-600">{errors.resume.message}</p>
                            )}
                            <p className="text-xs">Upload your resume PDF</p>
                        </div>

                        {/* File Preview */}
                        {filePreview && (
                            <div className="mt-2 border border-gray-200 rounded p-2">
                                <embed
                                    src={filePreview}
                                    type="application/pdf"
                                    width="100%"
                                    height="300px"
                                />
                            </div>
                        )}

                        {/* Active Checkbox */}
                        <div className="flex items-center gap-x-3">
                            <input
                                type="checkbox"
                                {...register("isActive")}
                                className="w-4 h-4 rounded border-gray-300"
                            />
                            <span className="text-md font-semibold">Set as active resume</span>
                        </div>

                        {/* Buttons */}
                        <div className="flex gap-x-4 mt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className={`px-4 py-2 text-sm font-semibold rounded-lg text-white bg-[#0F172A] shadow-lg transition-all ${loading
                                    ? "opacity-50 cursor-not-allowed"
                                    : "hover:bg-[#1e293b]"
                                    }`}
                            >
                                {loading ? "Uploading..." : "Add Resume"}
                            </button>

                            <Link
                                href={"/manage-resume"}
                                className="px-4 py-2 text-sm font-semibold rounded-lg text-white bg-[#0F172A] shadow-lg hover:bg-[#1e293b]"
                            >
                                Cancel
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default CreateResumeForm;
