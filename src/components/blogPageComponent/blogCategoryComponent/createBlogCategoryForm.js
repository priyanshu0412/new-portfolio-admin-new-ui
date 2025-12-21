"use client"

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSelector } from 'react-redux'
import { useForm } from "react-hook-form";
import Cookies from "js-cookie";
import Link from 'next/link'
import { toast } from "react-hot-toast";
import ReUseHeadingTitle from '@/components/reUseHeadingTitle';
import Icon from '@/components/icon';
import { FetchApi } from '@/utils/fetchAPI';

// ----------------------------------

const CreateBlogCategoryForm = () => {

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
                url: "/blogCategory",
                method: "POST",
                data: {
                    name: data.name,
                    description: data.description
                },
                token,
            });

            setLoading(false);

            if (res.success) {
                toast.success("Blog Category added successfully!");
                setTimeout(() => {
                    router.push("/manage-blog/category");
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
                        href={"/manage-blog/category"}
                        className="w-fit gap-x-4 font-semibold text-sm flex justify-center items-center rounded-md px-4 py-2 h-fit border-2 border-black bg-white text-black"
                    >
                        <Icon icon={"lets-icons:back"} /> Back
                    </Link>
                    <ReUseHeadingTitle
                        title={"Add Your Blog Category"}
                        desc={
                            "Add your Blog Category here and manage all your versions in one place."
                        }
                    />
                </div>

                {/* Form */}
                <div className="mt-8 w-full bg-white border border-gray-200 rounded-xl shadow-md p-6 overflow-hidden">
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="w-full flex flex-col gap-y-6"
                    >

                        <div className="flex flex-col w-full items-center justify-between gap-y-6">
                            {/* Category Name */}
                            <div className='flex flex-col w-full gap-y-2'>
                                <label className="text-sm font-semibold">Category Name *</label>
                                <input
                                    type="text"
                                    placeholder="Category Name"
                                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-800 placeholder-gray-400 shadow-sm"
                                    {...register("name", { required: "Category Name is required" })}
                                />
                                {errors.name && (
                                    <p className="text-xs text-red-600">{errors.name.message}</p>
                                )}
                            </div>
                            {/* Description  */}
                            <div className='flex flex-col w-full gap-y-2'>
                                <label className="text-sm font-semibold">Description *</label>
                                <input
                                    type="text"
                                    placeholder="Description"
                                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-800 placeholder-gray-400 shadow-sm"
                                    {...register("description", { required: "Description is required" })}
                                />
                                {errors.description && (
                                    <p className="text-xs text-red-600">{errors.description.message}</p>
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
                                {loading ? "Uploading..." : "Add Blog Category"}
                            </button>

                            <Link
                                href={"/manage-blog/category"}
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

export default CreateBlogCategoryForm
