"use client"

import React, { useState } from 'react'
import Icon from '../icon'
import Link from 'next/link'
import ReUseHeadingTitle from '../reUseHeadingTitle'
import DeleteModal from '../deleteModal'
import { FetchApi } from '@/utils/fetchAPI'
import toast from "react-hot-toast";
import { useSelector } from 'react-redux'
import Cookies from "js-cookie";
import AddSubscriberModal from '../addSubscriberModal'

// --------------------------------------

const SubscriberPageComponent = ({ subscribers: subscribersData }) => {

    const [subscribers, setSubscribers] = useState(subscribersData ?? []);
    const [loading, setLoading] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [userEmail, setUserEmail] = useState(null);
    const tokenFromRedux = useSelector((state) => state.auth.token);
    const token = tokenFromRedux || Cookies.get("token");
    const [modalType, setModalType] = useState(null);
    const [openAddModal, setOpenAddModal] = useState(false);


    const handleUnsubUser = async (email) => {
        try {
            setLoading(true);

            const res = await FetchApi({
                url: `/subscribe/unsubscribe`,
                method: "POST",
                data: {
                    email
                }
            });

            if (res?.success) {

                setOpenDelete(false);
                setUserEmail(null);

                const updatedList = await FetchApi({
                    url: "/subscribe/list",
                    token,
                });

                if (updatedList?.success) {
                    setSubscribers(updatedList.data);
                }

                toast.success("User Unsubscribe successfully");

            } else {
                toast.error(res?.message || "Failed to Unsubscribe User");
            }
        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    const handleSubscribeUser = async (email) => {
        try {
            setLoading(true);

            const res = await FetchApi({
                url: `/subscribe/subscribe`,
                method: "POST",
                data: {
                    email,
                    addedManually: true
                },
            });

            if (res?.success) {
                setOpenDelete(false);
                setUserEmail(null);

                const updatedList = await FetchApi({
                    url: "/subscribe/list",
                    token,
                });

                if (updatedList?.success) setSubscribers(updatedList.data);

                toast.success("User Subscribed Successfully");
            }

        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    const handleAddSubscriber = async (email) => {
        try {
            setLoading(true);

            const res = await FetchApi({
                url: "/subscribe/subscribe",
                method: "POST",
                data: {
                    email,
                    addedManually: true
                },
            });

            if (res?.success) {
                toast.success("Subscriber added!");

                const updatedList = await FetchApi({
                    url: "/subscribe/list",
                    token
                });

                if (updatedList?.success) setSubscribers(updatedList.data);

                setOpenAddModal(false);
            }
        } catch (err) {
            toast.error("Failed to add subscriber");
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
                        title={"News Letter"}
                        desc={"Manage your Subscriber"} />

                    <div className='flex justify-center items-center gap-x-4'>
                        <button
                            onClick={() => {
                                setOpenAddModal(true);
                            }}
                            className="w-fit gap-x-4 font-semibold text-sm flex justify-center items-center rounded-md px-4 py-2 h-fit bg-[#0F172A] text-white">
                            <Icon icon={"mingcute:user-add-fill"} /> Add Subscriber
                        </button>

                        <Link
                            href={"/newsletter"}
                            className="w-fit gap-x-4 font-semibold text-sm flex justify-center items-center rounded-md px-4 py-2 h-fit bg-[#0F172A] text-white">
                            <Icon icon={"material-symbols:add"} /> Create NewsLetter
                        </Link>
                    </div>

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
                                        Status
                                    </th>

                                    <th className="p-4 text-sm font-semibold border-b border-gray-200">
                                        Added Manual
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
                                ) : subscribers.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="text-center p-4 text-gray-500">
                                            No Subscribers found
                                        </td>
                                    </tr>
                                ) : (
                                    subscribers.map((item, index) => (
                                        <tr
                                            key={item._id}
                                            className="border-b border-gray-100 hover:bg-gray-50 transition-all"
                                        >
                                            <td className="p-4 text-sm font-medium text-gray-700">
                                                {index + 1}
                                            </td>
                                            <td className={`p-4 text-sm font-medium text-gray-800`}>
                                                {item?.email}
                                            </td>
                                            <td className={`p-4 font-semibold text-sm ${item?.subscribed ? "text-green-500" : "text-red-500"}`}>
                                                {item?.subscribed ? "Subscribed" : "Unsubscribed"}
                                            </td>
                                            <td className={`p-4 text-sm ${item?.addedManually ? "text-green-500" : "text-red-500"}`}>
                                                {item?.addedManually ?
                                                    (
                                                        <Icon
                                                            height={30}
                                                            width={30}
                                                            icon={"gg:check-o"} />
                                                    ) : (
                                                        <Icon
                                                            height={35}
                                                            width={35}
                                                            icon={"typcn:delete-outline"} />
                                                    )
                                                }
                                            </td>
                                            <td className="p-4 text-sm text-gray-600">
                                                {item?.subscribed ? (
                                                    <button
                                                        onClick={() => {
                                                            setUserEmail(item.email);
                                                            setOpenDelete(true);
                                                            setModalType("unsubscribe");
                                                        }}
                                                        className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium 
                       bg-red-500 text-white rounded-lg shadow-sm
                       hover:bg-red-600 active:scale-95 transition-all"
                                                    >
                                                        <Icon icon="mdi:account-remove" width={18} />
                                                        Unsubscribe
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={() => {
                                                            setUserEmail(item.email);
                                                            setOpenDelete(true);
                                                            setModalType("subscribe");
                                                        }}
                                                        className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium
                       bg-green-500 text-white rounded-lg shadow-sm
                       hover:bg-green-600 active:scale-95 transition-all"
                                                    >
                                                        <Icon icon="mdi:account-plus" width={18} />
                                                        Subscribe
                                                    </button>
                                                )}
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
                onClose={() => setOpenDelete(false)}
                onConfirm={() =>
                    modalType === "unsubscribe"
                        ? handleUnsubUser(userEmail)
                        : handleSubscribeUser(userEmail)
                }
                loading={loading}
                title={
                    modalType === "unsubscribe"
                        ? "Unsubscribe User"
                        : "Subscribe User"
                }
                message={
                    modalType === "unsubscribe"
                        ? "Are you sure you want to Unsubscribe this user?"
                        : "Are you sure you want to Subscribe this user?"
                }
                confirmText={
                    modalType === "unsubscribe"
                        ? "Unsubscribe"
                        : "Subscribe"
                }
                confirmIcon={
                    modalType === "unsubscribe"
                        ? "mdi:account-remove"
                        : "mdi:account-plus"
                }
                confirmColor={
                    modalType === "unsubscribe"
                        ? "bg-red-600 hover:bg-red-700"
                        : "bg-green-600 hover:bg-green-700"
                }
            />

            {/* Add Subscriber Modal */}
            <AddSubscriberModal
                open={openAddModal}
                onClose={() => setOpenAddModal(false)}
                loading={loading}
                onSubmit={(email) => handleAddSubscriber(email)}
            />

        </>
    )
}

export default SubscriberPageComponent
