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

const BlogCategoryComponent = ({ blogCategory: blogCategoryData }) => {

    const [blogCategory, setBlogCategory] = useState(blogCategoryData ?? []);
    const [loading, setLoading] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const tokenFromRedux = useSelector((state) => state.auth.token);
    const token = tokenFromRedux || Cookies.get("token");

    const handleDeleteBlogCategory = async (id) => {
        try {
            setLoading(true);

            const res = await FetchApi({
                url: `/blogCategory/${id}`,
                method: "DELETE",
                token,
            });

            if (res?.success) {

                setOpenDelete(false);
                setDeleteId(null);

                const updatedList = await FetchApi({
                    url: "/blogCategory",
                    token,
                });

                if (updatedList?.success && Array.isArray(updatedList.data)) {
                    setBlogCategory(updatedList.data);
                }

                toast.success("Blog Category deleted successfully");

            } else {
                toast.error(res?.message || "Failed to delete Blog Category");
            }
        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    const handleEditBlogCategory = (id) => {
        window.location.href = `/manage-blog/category/edit/${id}`;
    };

    return (
        <>
            <div className="flex flex-col w-full min-h-screen h-full">

                {/* Header */}
                <div className="flex md:flex-row flex-col items-start gap-y-6 md:gap-y-0 md:items-center w-full justify-between">
                    <ReUseHeadingTitle
                        title={"Blog Category"}
                        desc={"Manage your Blog Category"} />

                    <Link
                        href={"/manage-blog/category/create"}
                        className="w-fit gap-x-4 font-semibold text-sm flex justify-center items-center rounded-md px-4 py-2 h-fit bg-[#0F172A] text-white">
                        <Icon icon={"material-symbols:add"} /> Add Blog Category
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
                                        Cateogry
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
                                        <td colSpan={6} className="text-center p-4 text-gray-500">
                                            Loading...
                                        </td>
                                    </tr>
                                ) : blogCategory.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="text-center p-4 text-gray-500">
                                            No Blog Category found
                                        </td>
                                    </tr>
                                ) : (
                                    blogCategory.map((item, index) => (
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
                                                        handleEditBlogCategory(item._id);
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
                onConfirm={() => handleDeleteBlogCategory(deleteId)}
                title="Delete Blog Cateogry"
                message="Are you sure you want to delete this Blog Cateogry? This action cannot be undone."
            />
        </>
    )
}

export default BlogCategoryComponent
