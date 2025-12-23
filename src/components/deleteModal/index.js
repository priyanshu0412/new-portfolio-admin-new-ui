"use client";

import React from "react";
import Icon from "../icon";

// -------------------------------------

const DeleteModal = ({
    open,
    onClose,
    onConfirm,
    title,
    message,
    loading,
    confirmText = "Delete",
    confirmIcon = "mdi:delete",
    confirmColor = "bg-red-600 hover:bg-red-700",
}) => {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-[999] flex justify-center items-center bg-black/40 backdrop-blur-[2px] transition-all">

            <div className="bg-white w-[90%] max-w-md p-6 rounded-2xl shadow-xl animate-scaleFade">

                <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                    <Icon icon="mdi:alert-circle" className="text-red-500 text-2xl" />
                    {title}
                </h2>

                <p className="text-gray-600 mt-2 text-sm leading-relaxed">
                    {message}
                </p>

                <div className="flex justify-end gap-3 mt-6">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-lg border text-gray-700 hover:bg-gray-100 transition text-sm font-medium"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={onConfirm}
                        disabled={loading}
                        className={`px-4 py-2 rounded-lg text-white transition text-sm font-semibold flex items-center gap-2 ${confirmColor}`}
                    >
                        <Icon icon={confirmIcon} />
                        {loading ? "Processing..." : confirmText}
                    </button>
                </div>

            </div>
        </div>
    );
};

export default DeleteModal;
