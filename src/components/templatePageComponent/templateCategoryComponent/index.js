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

const TemplateCategoryComponent = ({ templateCategory: templateCategoryData }) => {

    const [templateCategory, setTemplateCategory] = useState(templateCategoryData ?? []);
    const [loading, setLoading] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const tokenFromRedux = useSelector((state) => state.auth.token);
    const token = tokenFromRedux || Cookies.get("token");

    // -------- Delete a template category --------
    const handleDeleteTemplateCategory = async (id) => {
        try {
            setLoading(true);

            const res = await FetchApi({
                url: `/templateCategory/${id}`,
                method: "DELETE",
                token,
            });

            if (res?.success) {
                setOpenDelete(false);
                setDeleteId(null);

                // Re-fetch the updated list
                const updatedList = await FetchApi({
                    url: "/templateCategory",
                    token,
                });

                if (updatedList?.success && Array.isArray(updatedList.data)) {
                    setTemplateCategory(updatedList.data);
                }

                toast.success("Template Category deleted successfully");
            } else {
                toast.error(res?.message || "Failed to delete Template Category");
            }
        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    // -------- Navigate to edit page --------
    const handleEditTemplateCategory = (id) => {
        window.location.href = `/manage-template/category/edit/${id}`;
    };

    return (
        <>
            <div className="flex flex-col w-full min-h-screen h-full">

                {/* Header */}
                <div className="flex md:flex-row flex-col items-start gap-y-6 md:gap-y-0 md:items-center w-full justify-between">
                    <ReUseHeadingTitle
                        title={"Template Category"}
                        desc={"Manage your Template Categories"} />

                    <Link
                        href={"/manage-template/category/create"}
                        className="w-fit gap-x-4 font-semibold text-sm flex justify-center items-center rounded-md px-4 py-2 h-fit bg-[#0F172A] text-white">
                        <Icon icon={"material-symbols:add"} /> Add Template Category
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
                                        Category
                                    </th>

                                    <th className="p-4 text-sm font-semibold border-b border-gray-200">
                                        Description
                                    </th>

                                    <th className="p-4 text-sm font-semibold border-b border-gray-200">
                                        Actions
                                    </th>

                                </tr>
                            </thead>

                            <tbody className="bg-white">
                                {loading ? (
                                    <tr>
                                        <td colSpan={4} className="text-center p-4 text-gray-500">
                                            Loading...
                                        </td>
                                    </tr>
                                ) : templateCategory.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="text-center p-4 text-gray-500">
                                            No Template Category found
                                        </td>
                                    </tr>
                                ) : (
                                    templateCategory.map((item, index) => (
                                        <tr
                                            key={item._id}
                                            className="border-b border-gray-100 hover:bg-gray-50 transition-all"
                                        >
                                            <td className="p-4 text-sm font-medium text-gray-700">
                                                {index + 1}
                                            </td>
                                            <td className="p-4 text-sm font-medium text-gray-800">
                                                {item?.name}
                                            </td>
                                            <td className="p-4 text-sm">
                                                {item?.description?.length > 50
                                                    ? item.description.substring(0, 50) + "..."
                                                    : item?.description}
                                            </td>
                                            <td className="p-4 flex items-center gap-5">
                                                <Icon
                                                    icon="material-symbols:edit"
                                                    className="text-green-600 text-xl cursor-pointer hover:scale-110 transition"
                                                    onClick={() => {
                                                        handleEditTemplateCategory(item._id);
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

            {/* Delete Modal */}
            <DeleteModal
                open={openDelete}
                loading={loading}
                onClose={() => setOpenDelete(false)}
                onConfirm={() => handleDeleteTemplateCategory(deleteId)}
                title="Delete Template Category"
                message="Are you sure you want to delete this Template Category? This action cannot be undone."
            />
        </>
    )
}

export default TemplateCategoryComponent
