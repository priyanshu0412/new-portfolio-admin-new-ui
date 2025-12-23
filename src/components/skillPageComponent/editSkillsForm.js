"use client"

import React, { useEffect, useState } from 'react'
import Link from 'next/link';
import Icon from '../icon';
import ReUseHeadingTitle from '../reUseHeadingTitle';
import { useSelector } from 'react-redux'
import { useForm, useFieldArray } from "react-hook-form";
import Cookies from "js-cookie";
import { useRouter } from 'next/navigation'
import { toast } from "react-hot-toast";
import { FetchApi } from '@/utils/fetchAPI';

// -----------------------------------

const EditSkillsForm = ({ skills }) => {

    const router = useRouter();
    const tokenFromRedux = useSelector((state) => state.auth.token);
    const token = tokenFromRedux || Cookies.get("token");
    const [loading, setLoading] = useState(false);

    const {
        register,
        handleSubmit,
        control,
        reset,
        formState: { errors },
    } = useForm({
        defaultValues: {
            category: "",
            skillsList: []
        }
    });



    const { fields, append, remove } = useFieldArray({
        control,
        name: "skillsList",
    });

    const onSubmit = async (data) => {

        if (!token) {
            toast.error("You are not authenticated!");
            return;
        }

        setLoading(true);

        try {
            const res = await FetchApi({
                url: `/skills/${skills._id}`,
                method: "PUT",
                token,
                data: {
                    category: data.category,
                    skills: data.skillsList,
                },
            });

            setLoading(false);

            if (res.success) {
                toast.success("Skill added successfully!");
                setTimeout(() => {
                    router.push("/manage-skill");
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

    useEffect(() => {
        if (skills) {
            reset({
                category: skills.category,
                skillsList: skills.skills.map((item) => ({
                    _id: item._id,
                    name: item.name,
                    icon: item.icon,
                    level: item.level
                }))
            });
        }
    }, [skills, reset]);

    return (
        <>
            <div className="flex flex-col w-full min-h-screen h-full">
                {/* Header */}
                <div className="flex flex-col items-start gap-y-6 w-full justify-between">
                    <Link
                        href={"/manage-skill"}
                        className="w-fit gap-x-4 font-semibold text-sm flex justify-center items-center rounded-md px-4 py-2 h-fit border-2 border-black bg-white text-black"
                    >
                        <Icon icon={"lets-icons:back"} /> Back
                    </Link>
                    <ReUseHeadingTitle
                        title={"Edit Your Skills"}
                        desc={
                            "Edit your Skills here and manage all your versions in one place."
                        }
                    />
                </div>

                {/* Form */}
                <div className="mt-8 w-full bg-white border border-gray-200 rounded-xl shadow-md p-6 overflow-hidden">
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="w-full flex flex-col gap-y-6"
                    >
                        {/* Category */}
                        <div className="flex flex-col w-full gap-y-2">
                            <label className="text-sm font-semibold">Category *</label>
                            <input
                                type="text"
                                placeholder="Category"
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-800 placeholder-gray-400 shadow-sm"
                                {...register("category", { required: "Category is required" })}
                            />
                            {errors.category && (
                                <p className="text-xs text-red-600">{errors.category.message}</p>
                            )}
                        </div>

                        {/* Skill Name | Icon | Level */}
                        <div className='flex flex-col gap-y-2 w-full'>
                            <label className="text-sm font-semibold">Skill *</label>

                            {fields.map((item, index) => (
                                <div
                                    key={item.id}
                                    className="w-full flex justify-between gap-x-4 items-start"
                                >
                                    {/* Skill Name */}
                                    <input
                                        type="text"
                                        placeholder="Skill Name (React / Node / JS)"
                                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300"
                                        {...register(`skillsList.${index}.name`, {
                                            required: "Skill name required",
                                        })}
                                    />

                                    {/* Icon */}
                                    <input
                                        type="text"
                                        placeholder="Iconify Icon Name"
                                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300"
                                        {...register(`skillsList.${index}.icon`, {
                                            required: "Icon required",
                                        })}
                                    />

                                    {/* Level */}
                                    <select
                                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300"
                                        {...register(`skillsList.${index}.level`, {
                                            required: "Select level",
                                        })}
                                    >
                                        <option value="">Level</option>
                                        <option value="Beginner">Beginner</option>
                                        <option value="Intermediate">Intermediate</option>
                                        <option value="Advanced">Advanced</option>
                                        <option value="Expert">Expert</option>
                                    </select>

                                    <div>
                                        <Icon
                                            icon={"material-symbols:delete"}
                                            className="text-red-500 cursor-pointer mt-2"
                                            height={25}
                                            width={25}
                                            onClick={() => remove(index)}
                                        />
                                    </div>
                                </div>
                            ))}

                            <button
                                type="button"
                                onClick={() => append({ name: "", icon: "", level: "" })}
                                className="px-4 py-2 w-fit justify-center items-center text-sm font-semibold rounded-lg text-white flex gap-x-2 bg-[#0F172A]"
                            >
                                <Icon icon={"gridicons:add"} /> Add More Skills
                            </button>

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
                                {loading ? "Uploading..." : "Update Skills"}
                            </button>

                            <Link
                                href={"/manage-skill"}
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

export default EditSkillsForm
