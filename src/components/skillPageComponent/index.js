"use client"

import React, { useState } from 'react'
import DeleteModal from '../deleteModal'
import Icon from '../icon'
import ReUseHeadingTitle from '../reUseHeadingTitle'
import Link from 'next/link'
import { useSelector } from 'react-redux'
import { FetchApi } from '@/utils/fetchAPI'
import Cookies from "js-cookie";
import toast from "react-hot-toast";

// ----------------------------------------

const SkillPageComponent = ({ skills: skillsData }) => {

    const [skills, setSkills] = useState(skillsData ?? []);
    const [loading, setLoading] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const tokenFromRedux = useSelector((state) => state.auth.token);
    const token = tokenFromRedux || Cookies.get("token");

    const handleDeleteSkillCategory = async (id) => {
        try {
            setLoading(true);

            const res = await FetchApi({
                url: `/skills/${id}`,
                method: "DELETE",
                token,
            });

            if (res?.success) {

                setOpenDelete(false);
                setDeleteId(null);

                const updatedList = await FetchApi({
                    url: "/skills",
                    token,
                });

                if (updatedList?.success && Array.isArray(updatedList.data)) {
                    setSkills(updatedList.data);
                }

                toast.success("Skill Category deleted successfully");

            } else {
                toast.error(res?.message || "Failed to delete Skill Category");
            }
        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    const handleEditSkillsWithCategory = (id) => {
        window.location.href = `/manage-skill/edit/${id}`;
    };

    return (
        <>
            <div className="flex flex-col w-full min-h-screen h-full">

                {/* Header */}
                <div className="flex md:flex-row flex-col items-start gap-y-6 md:gap-y-0 md:items-center w-full justify-between">
                    <ReUseHeadingTitle
                        title={"Skills"}
                        desc={"Manage your Skills"} />

                    <Link
                        href={"/manage-skill/create"}
                        className="w-fit gap-x-4 font-semibold text-sm flex justify-center items-center rounded-md px-4 py-2 h-fit bg-[#0F172A] text-white">
                        <Icon icon={"material-symbols:add"} /> Add Skills
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
                                        Category Name
                                    </th>

                                    <th className="p-4 text-sm font-semibold border-b border-gray-200">
                                        Skill : Proficiency Level
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
                                ) : skills.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="text-center p-4 text-gray-500">
                                            No Skills found
                                        </td>
                                    </tr>
                                ) : (
                                    skills.map((item, index) => (
                                        <tr
                                            key={item._id}
                                            className="border-b border-gray-100 hover:bg-gray-50 transition-all"
                                        >
                                            <td className="p-4 text-sm font-medium text-gray-700">
                                                {index + 1}
                                            </td>
                                            <td className="p-4 text-sm font-medium text-gray-800">
                                                {item?.category}
                                            </td>
                                            <td className="p-4 text-sm">
                                                <div className="flex flex-wrap gap-2">
                                                    {item?.skills.length === 0 ? (
                                                        "No Skills"
                                                    ) : (
                                                        item.skills.map((ele, index) => (
                                                            <span
                                                                key={index}
                                                                className="px-2 py-1 bg-gray-100 rounded-lg text-xs border"
                                                            >
                                                                {ele?.name} • {ele?.level}
                                                            </span>
                                                        ))
                                                    )}
                                                </div>
                                            </td>


                                            <td className="p-4 flex items-center gap-5">
                                                <Icon
                                                    icon="material-symbols:edit"
                                                    className="text-green-600 text-xl cursor-pointer hover:scale-110 transition"
                                                    onClick={() => {
                                                        handleEditSkillsWithCategory(item._id);
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
                onConfirm={() => handleDeleteSkillCategory(deleteId)}
                title="Delete Skill Category"
                message="Are you sure you want to delete this whole Skill Category? This action cannot be undone."
            />
        </>
    )
}

export default SkillPageComponent
