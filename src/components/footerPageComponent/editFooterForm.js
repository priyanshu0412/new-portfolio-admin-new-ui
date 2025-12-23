"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import ReUseHeadingTitle from '../reUseHeadingTitle';
import Icon from '../icon';
import { toast } from "react-hot-toast";
import { FetchApi } from '@/utils/fetchAPI';
import Cookies from "js-cookie";
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { useForm, useFieldArray } from "react-hook-form";
import convertToArray from '@/utils/convertToArray';

// ------------------------------

const EditFooterForm = ({ footer }) => {

    const router = useRouter();
    const tokenFromRedux = useSelector((state) => state.auth.token);
    const token = tokenFromRedux || Cookies.get("token");
    const [loading, setLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        control,
        reset
    } = useForm({
        defaultValues: {
            email: "",
            phone: "",
            content: "",
            location: "",
            services: "",
            followLinks: [{ icon: "", url: "" }],
            socialLinks: [{ icon: "", url: "" }],
        }
    });

    // Follow Links Array
    const {
        fields: followFields,
        append: addFollow,
        remove: removeFollow
    } = useFieldArray({
        control,
        name: "followLinks",
    });

    // Social Links Array
    const {
        fields: socialFields,
        append: addSocial,
        remove: removeSocial
    } = useFieldArray({
        control,
        name: "socialLinks",
    });

    useEffect(() => {
        if (footer) {
            reset({
                email: footer.email,
                phone: footer.phone,
                content: footer.content,
                location: footer.location,
                services: footer.services.join(", "),
                followLinks: footer.followMeLinks,
                socialLinks: footer.socialLinks,
            });
        }
    }, [footer, reset]);

    const onSubmit = async (data) => {

        if (!token) {
            toast.error("You are not authenticated!");
            return;
        }

        setLoading(true);

        try {

            const res = await FetchApi({
                url: `/footerContent/${footer._id}`,
                method: "PATCH",
                data: {
                    email: data.email,
                    phone: data.phone,
                    content: data.content,
                    location: data.location,
                    services: convertToArray(data.services),
                    followMeLinks: data.followLinks,
                    socialLinks: data.socialLinks,
                },
                token,
            });

            setLoading(false);

            if (res.success) {
                toast.success("Footer Content Updated successfully!");
                setTimeout(() => {
                    router.push("/manage-footer");
                }, 1000);
            } else {
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
                        href={"/manage-footer"}
                        className="w-fit gap-x-4 font-semibold text-sm flex justify-center items-center rounded-md px-4 py-2 h-fit border-2 border-black bg-white text-black"
                    >
                        <Icon icon={"lets-icons:back"} /> Back
                    </Link>

                    <ReUseHeadingTitle
                        title={"Edit Your Footer"}
                        desc={"Edit your Footer here and manage all your versions in one place."}
                    />
                </div>

                {/* Form */}
                <div className="mt-8 w-full bg-white border border-gray-200 rounded-xl shadow-md p-6 overflow-hidden">

                    <form onSubmit={handleSubmit(onSubmit)} className="w-full flex flex-col gap-y-6">

                        {/* Email / Phone */}
                        <div className="flex flex-col md:flex-row w-full items-center justify-between gap-y-2">
                            <div className='flex flex-col w-[48%] gap-y-2'>
                                <label className="text-sm font-semibold">Email *</label>
                                <input
                                    type="email"
                                    placeholder="Email"
                                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300"
                                    {...register("email", { required: "Email is required" })}
                                />
                                {errors.email && <p className="text-xs text-red-600">{errors.email.message}</p>}
                            </div>

                            <div className='flex flex-col w-[48%] gap-y-2'>
                                <label className="text-sm font-semibold">Phone *</label>
                                <input
                                    type="text"
                                    placeholder="Phone"
                                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300"
                                    {...register("phone", { required: "Phone is required" })}
                                />
                                {errors.phone && <p className="text-xs text-red-600">{errors.phone.message}</p>}
                            </div>
                        </div>

                        {/* Location */}
                        <div className="flex flex-col gap-y-2">
                            <label className="text-sm font-semibold">Location *</label>
                            <input
                                placeholder="Location"
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-300"
                                {...register("location", { required: "Location is required" })}
                            />
                            {errors.location && <p className="text-xs text-red-600">{errors.location.message}</p>}
                        </div>

                        {/* Content / Services */}
                        <div className="flex flex-col md:flex-row w-full items-center justify-between gap-y-2">
                            <div className='flex flex-col w-[48%] gap-y-2'>
                                <label className="text-sm font-semibold">Content *</label>
                                <textarea
                                    rows={2}
                                    placeholder="Footer content..."
                                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300"
                                    {...register("content", { required: "Content is required" })}
                                />
                                {errors.content && <p className="text-xs text-red-600">{errors.content.message}</p>}
                            </div>

                            <div className='flex flex-col w-[48%] gap-y-2'>
                                <label className="text-sm font-semibold">Services (comma separated) *</label>
                                <textarea
                                    rows={2}
                                    placeholder="React, NodeJS, MongoDB"
                                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300"
                                    {...register("services", { required: "Services is required" })}
                                />
                                {errors.services && <p className="text-xs text-red-600">{errors.services.message}</p>}
                            </div>
                        </div>

                        {/* Follow Me Link */}
                        <div className='flex flex-col gap-y-2 w-full'>
                            <label className="text-sm font-semibold">Follow Me Links *</label>

                            {followFields.map((field, index) => (
                                <div key={field.id} className='w-full flex justify-between items-start'>

                                    {/* Icon */}
                                    <div className='w-[45%] flex flex-col gap-y-2'>
                                        <input
                                            placeholder="Icon"
                                            className="w-full px-4 py-2.5 rounded-lg border border-gray-300"
                                            {...register(`followLinks.${index}.icon`, { required: "Icon is required" })}
                                        />
                                        {errors.followLinks?.[index]?.icon && (
                                            <p className="text-xs text-red-600">{errors.followLinks[index].icon.message}</p>
                                        )}
                                    </div>

                                    {/* URL */}
                                    <div className='w-[45%] flex flex-col gap-y-2'>
                                        <input
                                            placeholder="URL"
                                            className="w-full px-4 py-2.5 rounded-lg border border-gray-300"
                                            {...register(`followLinks.${index}.url`, { required: "URL is required" })}
                                        />
                                        {errors.followLinks?.[index]?.url && (
                                            <p className="text-xs text-red-600">{errors.followLinks[index].url.message}</p>
                                        )}
                                    </div>

                                    {/* Remove */}
                                    <div className='w-[5%] flex justify-center pt-3'>
                                        <Icon
                                            icon={"material-symbols:delete"}
                                            className="text-red-500 cursor-pointer"
                                            height={22}
                                            width={22}
                                            onClick={() => removeFollow(index)}
                                        />
                                    </div>
                                </div>
                            ))}

                            <div className='pt-2'>
                                <button
                                    type="button"
                                    onClick={() => addFollow({ icon: "", url: "" })}
                                    className="px-4 py-2 text-sm font-semibold rounded-lg text-white justify-center items-center flex gap-x-2 bg-[#0F172A]"
                                >
                                    <Icon icon={"gridicons:add"} /> Add more Follow links
                                </button>
                            </div>
                        </div>

                        {/* Social Link */}
                        <div className='flex flex-col gap-y-2 w-full'>
                            <label className="text-sm font-semibold">Social Links *</label>

                            {socialFields.map((field, index) => (
                                <div key={field.id} className='w-full flex justify-between items-start'>

                                    {/* Icon */}
                                    <div className='w-[45%] flex flex-col gap-y-2'>
                                        <input
                                            placeholder="Icon"
                                            className="w-full px-4 py-2.5 rounded-lg border border-gray-300"
                                            {...register(`socialLinks.${index}.icon`, { required: "Icon is required" })}
                                        />
                                        {errors.socialLinks?.[index]?.icon && (
                                            <p className="text-xs text-red-600">{errors.socialLinks[index].icon.message}</p>
                                        )}
                                    </div>

                                    {/* URL */}
                                    <div className='w-[45%] flex flex-col gap-y-2'>
                                        <input
                                            placeholder="URL"
                                            className="w-full px-4 py-2.5 rounded-lg border border-gray-300"
                                            {...register(`socialLinks.${index}.url`, { required: "URL is required" })}
                                        />
                                        {errors.socialLinks?.[index]?.url && (
                                            <p className="text-xs text-red-600">{errors.socialLinks[index].url.message}</p>
                                        )}
                                    </div>

                                    {/* Remove */}
                                    <div className='w-[5%] flex justify-center pt-3'>
                                        <Icon
                                            icon={"material-symbols:delete"}
                                            className="text-red-500 cursor-pointer"
                                            height={22}
                                            width={22}
                                            onClick={() => removeSocial(index)}
                                        />
                                    </div>
                                </div>
                            ))}

                            <div className='pt-2'>
                                <button
                                    type="button"
                                    onClick={() => addSocial({ icon: "", url: "" })}
                                    className="px-4 py-2 text-sm font-semibold rounded-lg text-white flex justify-center items-center gap-x-2 bg-[#0F172A]"
                                >
                                    <Icon icon={"gridicons:add"} /> Add more Social links
                                </button>
                            </div>
                        </div>

                        {/* Buttons */}
                        <div className="flex gap-x-4 mt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className={`px-4 py-2 text-sm font-semibold rounded-lg text-white bg-[#0F172A] ${loading ? "opacity-50 cursor-not-allowed" : "hover:bg-[#1e293b]"}`}
                            >
                                {loading ? "Uploading..." : "Update Footer"}
                            </button>

                            <Link
                                href={"/manage-footer"}
                                className="px-4 py-2 text-sm font-semibold rounded-lg text-white bg-[#0F172A] hover:bg-[#1e293b]"
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

export default EditFooterForm;
