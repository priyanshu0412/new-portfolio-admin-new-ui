"use client"

import React, { useState } from 'react'
import DeleteModal from '@/components/deleteModal'
import ReUseHeadingTitle from '@/components/reUseHeadingTitle'
import Icon from '../../icon';
import Link from 'next/link'
import { useSelector } from 'react-redux';
import { FetchApi } from '@/utils/fetchAPI';
import Cookies from "js-cookie";
import toast from "react-hot-toast";

// -------------------------------------

const TemplateComponent = ({ templates: templatesData }) => {

    const [templates, setTemplates] = useState(templatesData ?? []);
    const [loading, setLoading] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [deleteId, setDeleteId] = useState(null);

    // -------- Live Preview state --------
    const [previewUrl, setPreviewUrl] = useState(null);

    const tokenFromRedux = useSelector((state) => state.auth.token);
    const token = tokenFromRedux || Cookies.get("token");

    // -------- Delete a template --------
    const handleDeleteTemplate = async (id) => {
        try {
            setLoading(true);

            const res = await FetchApi({
                url: `/template/${id}`,
                method: "DELETE",
                token,
            });

            if (res?.success) {
                setOpenDelete(false);
                setDeleteId(null);

                // Re-fetch the updated list
                const updatedList = await FetchApi({
                    url: "/template",
                    token,
                });

                if (updatedList?.success && Array.isArray(updatedList.data)) {
                    setTemplates(updatedList.data);
                }

                toast.success("Template deleted successfully");
            } else {
                toast.error(res?.message || "Failed to delete Template");
            }
        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    // -------- Navigate to edit page --------
    const handleEditTemplate = (id) => {
        window.location.href = `/manage-template/template/edit/${id}`;
    };

    // -------- Format date for display --------
    const formatDate = (dateStr) => {
        if (!dateStr) return "-";
        const date = new Date(dateStr);
        return date.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    return (
        <>
            <div className="flex flex-col w-full min-h-screen h-full">

                {/* Header */}
                <div className="flex md:flex-row flex-col items-start gap-y-6 md:gap-y-0 md:items-center w-full justify-between">
                    <ReUseHeadingTitle
                        title={"Templates"}
                        desc={"Manage your Templates"} />

                    <Link
                        href={"/manage-template/template/create"}
                        className="w-fit gap-x-4 font-semibold text-sm flex justify-center items-center rounded-md px-4 py-2 h-fit bg-[#0F172A] text-white">
                        <Icon icon={"material-symbols:add"} /> Add Template
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
                                        Template Name
                                    </th>

                                    <th className="p-4 text-sm font-semibold border-b border-gray-200">
                                        Category
                                    </th>

                                    <th className="p-4 text-sm font-semibold border-b border-gray-200">
                                        Date
                                    </th>

                                    <th className="p-4 text-sm font-semibold border-b border-gray-200">
                                        Live URL
                                    </th>

                                    <th className="p-4 text-sm font-semibold border-b border-gray-200">
                                        GitHub
                                    </th>

                                    <th className="p-4 text-sm font-semibold border-b border-gray-200">
                                        Actions
                                    </th>

                                </tr>
                            </thead>

                            <tbody className="bg-white">
                                {loading ? (
                                    <tr>
                                        <td colSpan={7} className="text-center p-4 text-gray-500">
                                            Loading...
                                        </td>
                                    </tr>
                                ) : templates.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="text-center p-4 text-gray-500">
                                            No Templates found
                                        </td>
                                    </tr>
                                ) : (
                                    templates.map((item, index) => (
                                        <tr
                                            key={item._id}
                                            className="border-b border-gray-100 hover:bg-gray-50 transition-all"
                                        >
                                            {/* Index */}
                                            <td className="p-4 text-sm font-medium text-gray-700">
                                                {index + 1}
                                            </td>

                                            {/* Template Name */}
                                            <td className="p-4 text-sm font-medium text-gray-800">
                                                {item?.name}
                                            </td>

                                            {/* Category */}
                                            <td className="p-4 text-sm text-gray-600">
                                                {item?.category?.name || "-"}
                                            </td>

                                            {/* Date */}
                                            <td className="p-4 text-sm text-gray-600">
                                                {formatDate(item?.date)}
                                            </td>

                                            {/* Live URL */}
                                            <td className="p-4 text-sm">
                                                {item?.liveUrl ? (
                                                    <button
                                                        onClick={() => setPreviewUrl(item.liveUrl)}
                                                        className="text-blue-600 hover:text-blue-800 underline font-medium transition-colors cursor-pointer"
                                                    >
                                                        Live Preview
                                                    </button>
                                                ) : (
                                                    <span className="text-gray-400">-</span>
                                                )}
                                            </td>

                                            {/* GitHub */}
                                            <td className="p-4 text-sm">
                                                {item?.githubUrl ? (
                                                    <a
                                                        href={item.githubUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-blue-600 hover:text-blue-800 underline font-medium transition-colors"
                                                    >
                                                        View Repo
                                                    </a>
                                                ) : (
                                                    <span className="text-gray-400">-</span>
                                                )}
                                            </td>

                                            {/* Actions */}
                                            <td className="p-4 flex items-center gap-5">
                                                <Icon
                                                    icon="material-symbols:edit"
                                                    className="text-green-600 text-xl cursor-pointer hover:scale-110 transition"
                                                    onClick={() => {
                                                        handleEditTemplate(item._id);
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

            {/* ============== LIVE PREVIEW OVERLAY ============== */}
            {previewUrl && (
                <div className="fixed inset-0 z-[999] flex flex-col bg-black/60 backdrop-blur-sm">

                    {/* Top Bar with exit button */}
                    <div className="flex items-center justify-between px-6 py-3 bg-[#0F172A] text-white shadow-lg">
                        <div className="flex items-center gap-3">
                            <Icon icon="mdi:eye" className="text-xl" />
                            <span className="text-sm font-semibold truncate max-w-md">
                                {previewUrl}
                            </span>
                        </div>

                        <button
                            onClick={() => setPreviewUrl(null)}
                            className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-lg transition-all cursor-pointer"
                        >
                            <Icon icon="mdi:close" className="text-lg" />
                            Exit Preview
                        </button>
                    </div>

                    {/* Iframe */}
                    <div className="flex-1 w-full">
                        <iframe
                            src={previewUrl}
                            className="w-full h-full border-0"
                            title="Live Template Preview"
                            sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
                        />
                    </div>

                </div>
            )}

            {/* Delete Modal */}
            <DeleteModal
                open={openDelete}
                loading={loading}
                onClose={() => setOpenDelete(false)}
                onConfirm={() => handleDeleteTemplate(deleteId)}
                title="Delete Template"
                message="Are you sure you want to delete this Template? This action cannot be undone."
            />
        </>
    )
}

export default TemplateComponent
