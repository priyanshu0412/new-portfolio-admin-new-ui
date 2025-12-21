"use client";
import React, { useState } from "react";
import ReUseHeadingTitle from "../reUseHeadingTitle";
import Icon from "../icon";
import Link from "next/link";
import DeleteModal from "../deleteModal";
import { FetchApi } from "@/utils/fetchAPI";
import Cookies from "js-cookie";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

// -----------------------------------

const ResumePageComponent = ({ initialResumes }) => {

    const [resumes, setResumes] = useState(initialResumes ?? []);
    const [loading, setLoading] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const tokenFromRedux = useSelector((state) => state.auth.token);
    const token = tokenFromRedux || Cookies.get("token");

    const handleDeleteResume = async (id) => {
        try {
            setLoading(true);

            const res = await FetchApi({
                url: `/resume/${id}`,
                method: "DELETE",
                token,
            });

            if (res?.success) {

                setOpenDelete(false);
                setDeleteId(null);

                const updatedList = await FetchApi({
                    url: "/resume",
                    token,
                });

                if (updatedList?.success && Array.isArray(updatedList.data)) {
                    setResumes(updatedList.data);
                }

                toast.success("Resume deleted successfully");

            } else {
                toast.error(res?.message || "Failed to delete resume");
            }
        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    const handleSetActive = async (id) => {
        try {
            setLoading(true);

            const res = await FetchApi({
                url: `/resume/set-active/${id}`,
                method: "PUT",
                token,
            });

            if (res?.success) {
                const updated = await FetchApi({
                    url: "/resume",
                    token,
                });

                if (updated?.success && Array.isArray(updated.data)) {
                    setResumes(updated.data);
                }

                toast.success("Resume status updated");
            } else {
                toast.error(res?.message || "Failed to update status");
            }
        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="flex flex-col w-full min-h-screen h-full">

                {/* Header */}
                <div className="flex md:flex-row flex-col items-start gap-y-6 md:gap-y-0 md:items-center w-full justify-between">
                    <ReUseHeadingTitle
                        title={"Resumes"}
                        desc={"Manage your resume files"} />

                    <Link
                        href={"/manage-resume/create"}
                        className="w-fit gap-x-4 font-semibold text-sm flex justify-center items-center rounded-md px-4 py-2 h-fit bg-[#0F172A] text-white">
                        <Icon icon={"material-symbols:add"} /> Add Resume
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
                                        Name
                                    </th>

                                    <th className="p-4 text-sm font-semibold border-b border-gray-200">
                                        Preview
                                    </th>

                                    <th className="p-4 text-sm font-semibold border-b border-gray-200">
                                        Updated
                                    </th>

                                    <th className="p-4 text-sm font-semibold border-b border-gray-200">
                                        Active
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
                                ) : resumes.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="text-center p-4 text-gray-500">
                                            No resumes found
                                        </td>
                                    </tr>
                                ) : (
                                    resumes.map((item, index) => (
                                        <tr
                                            key={item._id}
                                            className="border-b border-gray-100 hover:bg-gray-50 transition-all"
                                        >
                                            <td className="p-4 text-sm font-medium text-gray-700">
                                                {index + 1}
                                            </td>
                                            <td className="p-4 text-sm font-medium text-gray-800">
                                                {item.name}
                                            </td>
                                            <td className="p-4 text-sm">
                                                <a
                                                    href={`https://docs.google.com/gview?url=${encodeURIComponent(
                                                        item.url
                                                    )}&embedded=true`}
                                                    target="_blank"
                                                    className="text-blue-500 font-semibold"
                                                >
                                                    View PDF
                                                </a>
                                            </td>
                                            <td className="p-4 text-sm text-gray-600">
                                                {new Date(item.updatedAt).toLocaleString("en-US", {
                                                    year: "numeric",
                                                    month: "2-digit",
                                                    day: "2-digit",
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                    hour12: true,
                                                }).replace(",", " |")}
                                            </td>
                                            <td className="p-4">
                                                {item.isActive ? (
                                                    <Icon
                                                        icon="mdi:pin"
                                                        className="text-green-600 text-xl cursor-pointer hover:scale-110 transition"
                                                        onClick={() => handleSetActive(item._id)}
                                                    />
                                                ) : (
                                                    <Icon
                                                        icon="mdi:pin-outline"
                                                        className="text-gray-400 text-xl cursor-pointer hover:scale-110 transition"
                                                        onClick={() => handleSetActive(item._id)}
                                                    />
                                                )}
                                            </td>

                                            <td className="p-4 flex items-center gap-5">
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
                onConfirm={() => handleDeleteResume(deleteId)}
                title="Delete Resume"
                message="Are you sure you want to delete this resume? This action cannot be undone."
            />
        </>
    );
};

export default ResumePageComponent;
