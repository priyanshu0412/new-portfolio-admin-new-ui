"use client"
import React, { useEffect, useState } from 'react'

// ---------------------------------------

const AddSubscriberModal = ({ open, onClose, onSubmit, loading }) => {

    const [email, setEmail] = useState("");

    useEffect(() => {
        if (!open) {
            setEmail("");
        }
    }, [open]);

    if (!open) return null;

    return (
        <>
            <div className="fixed inset-0 z-[999] flex justify-center items-center bg-black/40 backdrop-blur-sm">
                <div className="bg-white w-[90%] max-w-md p-6 rounded-2xl shadow-xl">

                    <h2 className="text-xl font-semibold text-gray-900">
                        Add Subscriber
                    </h2>

                    <p className="text-gray-600 mt-1 text-sm">
                        Enter user email to add as subscriber.
                    </p>

                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full mt-4 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black/60"
                        placeholder="Enter user email"
                    />

                    <div className="flex justify-end gap-3 mt-6">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 rounded-lg border text-gray-700 hover:bg-gray-100 text-sm font-medium"
                        >
                            Cancel
                        </button>

                        <button
                            onClick={() => onSubmit(email)}
                            disabled={loading || !email}
                            className="px-4 py-2 rounded-lg bg-black text-white hover:bg-black/80 text-sm font-semibold"
                        >
                            {loading ? "Adding..." : "Add Subscriber"}
                        </button>
                    </div>

                </div>
            </div>
        </>
    )
}

export default AddSubscriberModal
