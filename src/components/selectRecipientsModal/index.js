"use client"
import { FetchApi } from '@/utils/fetchAPI';
import React, { useEffect, useState } from 'react'
import { toast } from "react-hot-toast";

// -----------------------------------

const SelectRecipientsModal = ({
    open,
    onClose,
    subject,
    content,
    token,
    onSend
}) => {

    const [loading, setLoading] = useState(false);
    const [subscribers, setSubscribers] = useState([]);
    const [selected, setSelected] = useState([]);
    const [sendToAll, setSendToAll] = useState(false);

    // Fetch list
    useEffect(() => {
        if (open) fetchSubscribers();
    }, [open]);

    const fetchSubscribers = async () => {
        try {
            setLoading(true);
            const res = await FetchApi({
                url: "/subscribe/list",
                token
            });

            if (res.success) {
                setSubscribers(res.data);
            }
        } catch (err) {
            toast.error("Failed to load subscribers");
        } finally {
            setLoading(false);
        }
    };

    const toggleSelect = (email) => {
        if (selected.includes(email)) {
            setSelected(selected.filter((e) => e !== email));
        } else {
            setSelected([...selected, email]);
        }
    };

    const handleSend = async () => {
        try {
            setLoading(true);
            await onSend({
                subject,
                content,
                recipients: selected,
                sendToAll
            });
        } finally {
            setLoading(false);
        }
    };

    if (!open) return null;

    return (
        <>
            <div className="fixed inset-0 z-[999] bg-black/40 backdrop-blur-sm flex justify-center items-center">
                <div className="bg-white w-[90%] max-w-xl p-6 rounded-2xl shadow-xl">

                    <h2 className="text-xl font-semibold">Select Recipients</h2>

                    {/* Send to All Toggle */}
                    <div className="flex items-center gap-3 mt-4">
                        <input
                            type="checkbox"
                            checked={sendToAll}
                            onChange={() => setSendToAll(!sendToAll)}
                            className="w-5 h-5"
                        />
                        <span className="text-sm font-medium">Send to All Subscribers</span>
                    </div>

                    {/* Subscriber List */}
                    {!sendToAll && (
                        <div className="mt-4 max-h-64 overflow-y-auto border rounded-lg p-3">
                            {loading ? (
                                <p className="text-gray-500 text-center">Loading...</p>
                            ) : subscribers.length === 0 ? (
                                <p className="text-gray-500 text-center">No subscribers found</p>
                            ) : (
                                subscribers.map((item) => (
                                    <div key={item.email} className="flex items-center justify-between py-2 border-b">
                                        <div>
                                            <p className="font-medium text-sm">{item.email}</p>
                                            <p className={`text-xs ${item.subscribed ? "text-green-500" : "text-red-500"}`}>
                                                {item.subscribed ? "Subscribed" : "Unsubscribed"}
                                            </p>
                                        </div>

                                        <input
                                            type="checkbox"
                                            checked={selected.includes(item.email)}
                                            onChange={() => toggleSelect(item.email)}
                                            className="w-5 h-5"
                                        />
                                    </div>
                                ))
                            )}
                        </div>
                    )}

                    {/* Buttons */}
                    <div className="flex justify-end gap-3 mt-6">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 rounded-lg border text-gray-700 hover:bg-gray-100 text-sm"
                        >
                            Cancel
                        </button>

                        <button
                            onClick={handleSend}
                            className="px-4 py-2 rounded-lg bg-black text-white hover:bg-black/80 text-sm"
                        >
                            {loading ? "Sending..." : "Send Newsletter"}
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default SelectRecipientsModal
