"use client"

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSelector } from 'react-redux'
import { useForm } from "react-hook-form";
import Cookies from "js-cookie";
import Link from 'next/link'
import { toast } from "react-hot-toast";
import ReUseHeadingTitle from '@/components/reUseHeadingTitle';
import Icon from '@/components/icon';
import { FetchApi } from '@/utils/fetchAPI';

// ----------------------------------------------

const EditTemplateCategoryForm = ({ templateCategory }) => {

    const router = useRouter();
    const tokenFromRedux = useSelector((state) => state.auth.token);
    const token = tokenFromRedux || Cookies.get("token");
    const [loading, setLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
    } = useForm();

    // -------- Submit handler --------
    const onSubmit = async (data) => {
        if (!token) {
            toast.error("You are not authenticated!");
            return;
        }

        setLoading(true);

        try {
            const res = await FetchApi({
                url: `/templateCategory/${templateCategory._id}`,
                method: "PATCH",
                data: {
                    name: data.name,
                    description: data.description,
                },
                token,
            });

            setLoading(false);

            if (res.success) {
                toast.success("Template Category updated successfully!");
                setTimeout(() => {
                    router.push("/manage-template/category");
                }, 1000);
            } else {
                toast.error(res.data?.message || "Something went wrong!");
            }
        } catch (error) {
            setLoading(false);
            toast.error("Something went wrong!");
        }
    };

    // -------- Pre-fill form values --------
    useEffect(() => {
        if (templateCategory) {
            setValue("name", templateCategory.name);
            setValue("description", templateCategory.description);
        }
    }, [templateCategory, setValue]);

    return (
        <>
            <div className="flex flex-col w-full min-h-screen h-full">

                {/* Header */}
                <div className="flex flex-col items-start gap-y-6 w-full justify-between">
                    <Link
                        href={"/manage-template/category"}
                        className="w-fit gap-x-4 font-semibold text-sm flex justify-center items-center rounded-md px-4 py-2 h-fit border-2 border-black bg-white text-black"
                    >
                        <Icon icon={"lets-icons:back"} /> Back
                    </Link>
                    <ReUseHeadingTitle
                        title={"Update Your Template Category"}
                        desc={"Update your Template Category here and manage all your categories in one place."}
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

                            {/* Description */}
                            <div className='flex flex-col w-full gap-y-2'>
                                <label className="text-sm font-semibold">Description</label>
                                <input
                                    type="text"
                                    placeholder="Description"
                                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-800 placeholder-gray-400 shadow-sm"
                                    {...register("description")}
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
                                {loading ? "Uploading..." : "Update Category"}
                            </button>

                            <Link
                                href={"/manage-template/category"}
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

export default EditTemplateCategoryForm
