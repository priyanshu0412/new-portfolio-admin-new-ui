"use client"

import React, { useState } from 'react'
import DeleteModal from '../deleteModal';
import ReUseHeadingTitle from '../reUseHeadingTitle';
import Link from 'next/link';
import Icon from '../icon';
import { FetchApi } from '@/utils/fetchAPI';
import { useSelector } from 'react-redux';
import Cookies from "js-cookie";
import toast from 'react-hot-toast';

// ----------------------------

const FooterPageComponent = ({ footer: footerData }) => {

    const [footer, setFooter] = useState(footerData ?? []);
    const [loading, setLoading] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const tokenFromRedux = useSelector((state) => state.auth.token);
    const token = tokenFromRedux || Cookies.get("token");

    const handleDeleteFooter = async (id) => {
        try {
            setLoading(true);

            const res = await FetchApi({
                url: `/footerContent/${id}`,
                method: "DELETE",
                token,
            });

            if (res?.success) {

                setOpenDelete(false);
                setDeleteId(null);

                const updatedList = await FetchApi({
                    url: "/footerContent",
                });

                if (updatedList?.success) {
                    setFooter(updatedList.data.data);
                }

                toast.success("Footer deleted successfully");

            } else {
                toast.error(res?.message || "Failed to delete Footer");
            }
        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    const handleEditFooter = (id) => {
        window.location.href = `/manage-footer/edit/${id}`;
    }

    return (
        <>
            <div className="flex flex-col w-full min-h-screen h-full">

                {/* Header */}
                <div className="flex md:flex-row flex-col items-start gap-y-6 md:gap-y-0 md:items-center w-full justify-between">
                    <ReUseHeadingTitle
                        title={"Footer"}
                        desc={"Manage your Footer Content"} />

                    <Link
                        href={"/manage-footer/create"}
                        className="w-fit gap-x-4 font-semibold text-sm flex justify-center items-center rounded-md px-4 py-2 h-fit bg-[#0F172A] text-white">
                        <Icon icon={"material-symbols:add"} /> Add Footer
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
                                        Email
                                    </th>

                                    <th className="p-4 text-sm font-semibold border-b border-gray-200">
                                        Phone
                                    </th>

                                    <th className="p-4 text-sm font-semibold border-b border-gray-200">
                                        Location
                                    </th>

                                    <th className="p-4 text-sm font-semibold border-b border-gray-200">
                                        Follow Links
                                    </th>

                                    <th className="p-4 text-sm font-semibold border-b border-gray-200">
                                        Social Link
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
                                ) : footer.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="text-center p-4 text-gray-500">
                                            No Footer found
                                        </td>
                                    </tr>
                                ) : (
                                    footer.map((item, index) => (
                                        <tr
                                            key={item._id}
                                            className="border-b border-gray-100 hover:bg-gray-50 transition-all"
                                        >
                                            <td className="p-4 text-sm font-medium text-gray-700">
                                                {index + 1}
                                            </td>
                                            <td className="p-4 text-sm font-medium text-gray-800">
                                                {item?.email}
                                            </td>
                                            <td className="p-4 text-sm font-medium text-gray-800">
                                                {item?.phone}
                                            </td>
                                            <td className="p-4 text-sm font-medium text-gray-800">
                                                {item?.location}
                                            </td>
                                            <td className="p-4 text-sm font-medium text-gray-800">
                                                <div className='flex gap-x-4 items-center'>
                                                    {item?.followMeLinks.map((ele, index) => {
                                                        return (
                                                            <Link key={index} href={ele?.url}>
                                                                <Icon
                                                                    icon={ele?.icon}
                                                                    className={"hover:scale-110 transition-all duration-300"}
                                                                    height={18}
                                                                    width={18}
                                                                />
                                                            </Link>
                                                        )
                                                    })}
                                                </div>
                                            </td>
                                            <td className="p-4 text-sm font-medium text-gray-800">
                                                <div className='flex gap-x-4  items-center'>
                                                    {item?.socialLinks.map((ele, index) => {
                                                        return (
                                                            <Link key={index} href={ele?.url}>
                                                                <Icon
                                                                    icon={ele?.icon}
                                                                    className={"hover:scale-110 transition-all duration-300"}
                                                                    height={18}
                                                                    width={18}
                                                                />
                                                            </Link>
                                                        )
                                                    })}
                                                </div>
                                            </td>

                                            <td className="p-4 flex items-center gap-5">
                                                <Icon
                                                    icon="material-symbols:edit"
                                                    className="text-green-600 text-xl cursor-pointer hover:scale-110 transition"
                                                    onClick={() => {
                                                        handleEditFooter(item?._id)
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
                onConfirm={() => handleDeleteFooter(deleteId)}
                title="Delete Footer"
                message="Are you sure you want to delete this Footer? This action cannot be undone."
            />
        </>
    )
}

export default FooterPageComponent
