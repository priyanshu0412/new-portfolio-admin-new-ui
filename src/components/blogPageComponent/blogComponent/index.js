"use client"

import React, { useState } from 'react'
import DeleteModal from '@/components/deleteModal'
import Icon from '@/components/icon'
import ReUseHeadingTitle from '@/components/reUseHeadingTitle'
import { FetchApi } from '@/utils/fetchAPI'
import Link from 'next/link'
import { useSelector } from 'react-redux'
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import Image from 'next/image'

// ------------------------------

const BlogComponent = ({ blogs: blogsData }) => {

    const [blogs, setBlogs] = useState(blogsData ?? []);
    const [loading, setLoading] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const tokenFromRedux = useSelector((state) => state.auth.token);
    const token = tokenFromRedux || Cookies.get("token");

    const handleBlog = async (id) => {
        try {
            setLoading(true);

            const res = await FetchApi({
                url: `/blog/${id}`,
                method: "DELETE",
                token,
            });

            if (res?.success) {

                setOpenDelete(false);
                setDeleteId(null);

                const updatedList = await FetchApi({
                    url: "/blog",
                    token,
                });

                if (updatedList?.success) {
                    setBlogs(updatedList.data.data);
                }

                toast.success("Blog deleted successfully");

            } else {
                toast.error(res?.message || "Failed to delete Blog");
            }
        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    const handleEditBlog = (id) => {
        window.location.href = `/manage-blog/blog/edit/${id}`;
    };

    return (
        <>
            <div className="flex flex-col w-full min-h-screen h-full">

                {/* Header */}
                <div className="flex md:flex-row flex-col items-start gap-y-6 md:gap-y-0 md:items-center w-full justify-between">
                    <ReUseHeadingTitle
                        title={"Blogs"}
                        desc={"Manage your Blogs"} />

                    <Link
                        href={"/manage-blog/blog/create"}
                        className="w-fit gap-x-4 font-semibold text-sm flex justify-center items-center rounded-md px-4 py-2 h-fit bg-[#0F172A] text-white">
                        <Icon icon={"material-symbols:add"} /> Add Blog
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
                                        Thumbnail Image
                                    </th>

                                    <th className="p-4 text-sm font-semibold border-b border-gray-200">
                                        Title
                                    </th>

                                    <th className="p-4 text-sm font-semibold border-b border-gray-200">
                                        Short Desc
                                    </th>

                                    <th className="p-4 text-sm font-semibold border-b border-gray-200">
                                        Category
                                    </th>

                                    <th className="p-4 text-sm font-semibold border-b border-gray-200">
                                        Read Time
                                    </th>

                                    <th className="p-4 text-sm font-semibold border-b border-gray-200">
                                        Publish Date
                                    </th>

                                    <th className="p-4 text-sm font-semibold border-b border-gray-200">
                                        Author
                                    </th>

                                    <th className="p-4 text-sm font-semibold border-b border-gray-200">
                                        Is Featured
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
                                ) : blogs.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="text-center p-4 text-gray-500">
                                            No Blog found
                                        </td>
                                    </tr>
                                ) : (
                                    blogs.map((item, index) => (
                                        <tr
                                            key={item._id}
                                            className="border-b border-gray-100 hover:bg-gray-50 transition-all"
                                        >
                                            <td className="p-4 text-sm font-medium text-gray-700">
                                                {index + 1}
                                            </td>
                                            {/* Image  */}
                                            <td className="p-4 text-sm font-medium text-gray-800">
                                                <Image
                                                    src={item?.thumbnailImg || "/no-image.png"}
                                                    width={250}
                                                    height={250}
                                                    alt='project image'
                                                />
                                            </td>
                                            <td className="p-4 text-sm">
                                                {item?.title}
                                            </td>
                                            <td className="p-4 text-sm text-gray-600">
                                                {item?.desc}
                                            </td>
                                            {/* Category  */}
                                            <td className="p-4 text-sm text-gray-600">
                                                {item?.category[0]?.name}
                                            </td>
                                            <td className="p-4 text-sm text-gray-600">
                                                {item?.readTime} Min
                                            </td>
                                            {/* Publish Date */}
                                            <td className="p-4 text-sm text-gray-600">
                                                {new Date(item.date).toLocaleString("en-US", {
                                                    year: "numeric",
                                                    month: "2-digit",
                                                    day: "2-digit",
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                    hour12: true,
                                                }).replace(",", " |")}
                                            </td>
                                            <td className="p-4 text-sm text-gray-600">
                                                {item?.authorName}
                                            </td>
                                            <td className="p-4 text-sm text-gray-600">
                                                {item.isFeatured ? (
                                                    <Icon
                                                        icon="mdi:pin"
                                                        className="text-green-600 text-xl"
                                                    />
                                                ) : (
                                                    <Icon
                                                        icon="mdi:pin-outline"
                                                        className="text-gray-400 text-xl"
                                                    />
                                                )}
                                            </td>

                                            <td className="p-4 flex items-center gap-5">
                                                <Icon
                                                    icon="material-symbols:edit"
                                                    className="text-green-600 text-xl cursor-pointer hover:scale-110 transition"
                                                    onClick={() => {
                                                        handleEditBlog(item._id);
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
                onConfirm={() => handleBlog(deleteId)}
                title="Delete Blog"
                message="Are you sure you want to delete this Blog? This action cannot be undone."
            />
        </>
    )
}

export default BlogComponent
