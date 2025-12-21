"use client";
import React, { useState } from 'react'
import DeleteModal from '../deleteModal';
import ReUseHeadingTitle from '../reUseHeadingTitle';
import Link from 'next/link';
import Icon from '../icon';
import { useSelector } from 'react-redux';
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import { FetchApi } from '@/utils/fetchAPI';

// -------------------------------------

const ExpPageComponent = ({ experience: experienceData }) => {

    const [experience, setExperience] = useState(experienceData ?? []);
    const [loading, setLoading] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const tokenFromRedux = useSelector((state) => state.auth.token);
    const token = tokenFromRedux || Cookies.get("token");

    const handleDeleteExp = async (id) => {
        try {
            setLoading(true);

            const res = await FetchApi({
                url: `/exp/${id}`,
                method: "DELETE",
                token,
            });

            if (res?.success) {

                setOpenDelete(false);
                setDeleteId(null);

                const updatedList = await FetchApi({
                    url: "/exp",
                    token,
                });

                if (updatedList?.success && Array.isArray(updatedList.data)) {
                    setExperience(updatedList.data);
                }

                toast.success("Experience deleted successfully");

            } else {
                toast.error(res?.message || "Failed to delete Experience");
            }
        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    const handleEditExperience = (id) => {
        window.location.href = `/manage-experience/edit/${id}`;
    };


    return (
        <>
            <div className="flex flex-col w-full min-h-screen h-full">

                {/* Header */}
                <div className="flex md:flex-row flex-col items-start gap-y-6 md:gap-y-0 md:items-center w-full justify-between">
                    <ReUseHeadingTitle
                        title={"Experience"}
                        desc={"Manage your Experience"} />

                    <Link
                        href={"/manage-experience/create"}
                        className="w-fit gap-x-4 font-semibold text-sm flex justify-center items-center rounded-md px-4 py-2 h-fit bg-[#0F172A] text-white">
                        <Icon icon={"material-symbols:add"} /> Add Experience
                    </Link>
                </div>

                {/* Table */}
                <div className="mt-8 bg-white border border-gray-200 rounded-xl shadow-md p-6 overflow-hidden">
                    <div className="overflow-x-auto rounded-lg border border-gray-200">
                        <table className="min-w-full border-collapse">
                            <thead className="bg-gray-50 sticky top-0 z-10">
                                <tr className="text-left text-gray-700">

                                    <th className="p-4 text-sm font-semibold border-b border-gray-200">
                                        ID
                                    </th>

                                    <th className="p-4 text-sm font-semibold border-b border-gray-200">
                                        Company Name
                                    </th>

                                    <th className="p-4 text-sm font-semibold border-b border-gray-200">
                                        Designation
                                    </th>

                                    <th className="p-4 text-sm font-semibold border-b border-gray-200">
                                        Start Year
                                    </th>

                                    <th className="p-4 text-sm font-semibold border-b border-gray-200">
                                        End Year
                                    </th>

                                    <th className="p-4 text-sm font-semibold border-b border-gray-200">
                                        Actions
                                    </th>

                                </tr>
                            </thead>

                            <tbody className="bg-white">
                                {loading ? (
                                    <tr>
                                        <td colSpan={6} className="text-center p-4 text-gray-500">
                                            Loading...
                                        </td>
                                    </tr>
                                ) : experience.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="text-center p-4 text-gray-500">
                                            No Experience found
                                        </td>
                                    </tr>
                                ) : (
                                    experience.map((item, index) => (
                                        <tr
                                            key={item._id}
                                            className="border-b border-gray-100 hover:bg-gray-50 transition-all"
                                        >
                                            <td className="p-4 text-sm font-medium text-gray-700">
                                                {index + 1}
                                            </td>
                                            <td className="p-4 text-sm font-medium text-gray-800">
                                                {item?.company}
                                            </td>
                                            <td className="p-4 text-sm">
                                                {item?.designation}
                                            </td>
                                            <td className="p-4 text-sm text-gray-600">
                                                {item?.startYear}
                                            </td>
                                            <td className="p-4 text-sm text-gray-600">
                                                {item?.endYear}
                                            </td>

                                            <td className="p-4 flex items-center gap-5">
                                                <Icon
                                                    icon="material-symbols:edit"
                                                    className="text-green-600 text-xl cursor-pointer hover:scale-110 transition"
                                                    onClick={() => {
                                                        handleEditExperience(item._id);
                                                    }}
                                                />
                                                <Icon
                                                    icon="mdi:delete-outline"
                                                    className="text-red-600 text-xl cursor-pointer hover:scale-110 transition"
                                                    onClick={() => {
                                                        setDeleteId(item._id);
                                                        setOpenDelete(true);
                                                    }}
                                                />
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Delete Model  */}
            <DeleteModal
                open={openDelete}
                loading={loading}
                onClose={() => setOpenDelete(false)}
                onConfirm={() => handleDeleteExp(deleteId)}
                title="Delete Experience"
                message="Are you sure you want to delete this Experience? This action cannot be undone."
            />
        </>
    )
}

export default ExpPageComponent
