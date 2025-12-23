"use client"

import React, { useState } from 'react'
import Link from 'next/link'
import Icon from '../icon'
import { useRouter } from 'next/navigation'
import { useSelector } from 'react-redux'
import { useForm } from "react-hook-form";
import Cookies from "js-cookie";
import ReUseHeadingTitle from '../reUseHeadingTitle'
import { toast } from "react-hot-toast";
import { FetchApi } from '@/utils/fetchAPI'
import convertToArray from '@/utils/convertToArray'

// --------------------------------------

const CreateExpForm = () => {

    const router = useRouter();
    const tokenFromRedux = useSelector((state) => state.auth.token);
    const token = tokenFromRedux || Cookies.get("token");
    const [loading, setLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const onSubmit = async (data) => {

        if (!token) {
            toast.error("You are not authenticated!");
            return;
        }

        setLoading(true);

        try {
            const res = await FetchApi({
                url: "/exp/create",
                method: "POST",
                data: {
                    designation: data.designation,
                    company: data.company,
                    desc: data.description,
                    startYear: data.start_year,
                    endYear: data.end_year,
                    keyAchievement: convertToArray(data.key_achievements),
                    learn: convertToArray(data.learn)
                },
                token,
            });

            setLoading(false);

            if (res.success) {
                toast.success("Experience added successfully!");
                setTimeout(() => {
                    router.push("/manage-experience");
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
                        href={"/manage-experience"}
                        className="w-fit gap-x-4 font-semibold text-sm flex justify-center items-center rounded-md px-4 py-2 h-fit border-2 border-black bg-white text-black"
                    >
                        <Icon icon={"lets-icons:back"} /> Back
                    </Link>
                    <ReUseHeadingTitle
                        title={"Add Your Experience"}
                        desc={
                            "Add your Experience here and manage all your versions in one place."
                        }
                    />
                </div>

                {/* Form */}
                <div className="mt-8 w-full bg-white border border-gray-200 rounded-xl shadow-md p-6 overflow-hidden">
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="w-full flex flex-col gap-y-6"
                    >
                        {/* Designation / Company */}
                        <div className="flex flex-col md:flex-row w-full items-center justify-between gap-y-2">
                            <div className='flex flex-col w-[48%] gap-y-2'>
                                <label className="text-sm font-semibold">Designation *</label>
                                <input
                                    type="text"
                                    placeholder="Designation"
                                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-800 placeholder-gray-400 shadow-sm"
                                    {...register("designation", { required: "Designation is required" })}
                                />
                                {errors.designation && (
                                    <p className="text-xs text-red-600">{errors.designation.message}</p>
                                )}
                            </div>
                            <div className='flex flex-col w-[48%] gap-y-2'>
                                <label className="text-sm font-semibold">Company *</label>
                                <input
                                    type="text"
                                    placeholder="Company"
                                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-800 placeholder-gray-400 shadow-sm"
                                    {...register("company", { required: "Company is required" })}
                                />
                                {errors.company && (
                                    <p className="text-xs text-red-600">{errors.company.message}</p>
                                )}
                            </div>
                        </div>

                        {/* Description */}
                        <div className="flex flex-col gap-y-2">
                            <label className="text-sm font-semibold">Description *</label>
                            <textarea
                                rows={4}
                                cols={4}
                                placeholder="Description"
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-800 placeholder-gray-400 shadow-sm"
                                {...register("description", { required: "Description is required" })}
                            />
                            {errors.description && (
                                <p className="text-xs text-red-600">{errors.description.message}</p>
                            )}
                        </div>

                        {/* Start Year / End Year */}
                        <div className="flex flex-col md:flex-row w-full items-center justify-between gap-y-2">
                            <div className='flex flex-col w-[48%] gap-y-2'>
                                <label className="text-sm font-semibold">Start Year *</label>
                                <input
                                    type="text"
                                    placeholder="Start Year"
                                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-800 placeholder-gray-400 shadow-sm"
                                    {...register("start_year", { required: "Start Year is required" })}
                                />
                                {errors.start_year && (
                                    <p className="text-xs text-red-600">{errors.start_year.message}</p>
                                )}
                            </div>
                            <div className='flex flex-col w-[48%] gap-y-2'>
                                <label className="text-sm font-semibold">End Year</label>
                                <input
                                    type="text"
                                    placeholder="End Year"
                                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-800 placeholder-gray-400 shadow-sm"
                                    {...register("end_year")}
                                />
                            </div>
                        </div>

                        {/* Key Achievements / Learn */}
                        <div className="flex flex-col md:flex-row w-full items-center justify-between gap-y-2">
                            <div className='flex flex-col w-[48%] gap-y-2'>
                                <label className="text-sm font-semibold">
                                    Key Achievements (comma separated) *
                                </label>
                                <textarea
                                    rows={2}
                                    placeholder="e.g. Improved system performance, Led project, Automated tasks"
                                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white 
                 text-gray-800 placeholder-gray-400 shadow-sm focus:border-blue-500 
                 focus:ring-2 focus:ring-blue-200"
                                    {...register("key_achievements", { required: "Key Achievements is required" })}
                                />
                                {errors.key_achievements && (
                                    <p className="text-xs text-red-600">{errors.key_achievements.message}</p>
                                )}
                            </div>
                            <div className='flex flex-col w-[48%] gap-y-2'>
                                <label className="text-sm font-semibold">
                                    Learnings (comma separated) *
                                </label>
                                <textarea
                                    rows={2}
                                    placeholder="e.g. Team leadership, React, MongoDB, Communication"
                                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white 
                 text-gray-800 placeholder-gray-400 shadow-sm focus:border-blue-500 
                 focus:ring-2 focus:ring-blue-200"
                                    {...register("learn", { required: "Learn is required" })}
                                />
                                {errors.learn && (
                                    <p className="text-xs text-red-600">{errors.learn.message}</p>
                                )}
                            </div>
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
                                {loading ? "Uploading..." : "Add Experience"}
                            </button>

                            <Link
                                href={"/manage-experience"}
                                className="px-4 py-2 text-sm font-semibold rounded-lg text-white bg-[#0F172A] shadow-lg hover:bg-[#1e293b]"
                            >
                                Cancel
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}

export default CreateExpForm
