"use client"

import { ReUseHeadingTitle, SelectRecipientsModal } from '@/components'
import Link from 'next/link'
import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import Cookies from "js-cookie";
import { Icon } from '@iconify/react';
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { FetchApi } from '@/utils/fetchAPI'
import { useRouter } from 'next/navigation'
import { Editor } from "@tinymce/tinymce-react";

// -----------------------------------------------

const CreateNewsLetterPage = () => {

    const router = useRouter();
    const tokenFromRedux = useSelector((state) => state.auth.token);
    const token = tokenFromRedux || Cookies.get("token");
    const [loading, setLoading] = useState(false);
    const [subject, setSubject] = useState("");
    const [content, setContent] = useState("");
    const [openRecipientModal, setOpenRecipientModal] = useState(false);
    const [editorLoaded, setEditorLoaded] = useState(false);



    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const onSubmit = (data) => {

        if (!content || content.trim() === "") {
            toast.error("Content is required");
            return;
        }

        setSubject(data.subject);
        setContent(content);
        setOpenRecipientModal(true);
    };


    const handleSendNewsletter = async ({ subject, content, recipients, sendToAll }) => {
        setLoading(true);

        try {
            const res = await FetchApi({
                url: "/subscribe/send-newsletter",
                method: "POST",
                data: {
                    subject,
                    content,
                    recipients,
                    sendToAll
                },
                token
            });

            if (res.success) {
                toast.success("Newsletter sent!");
                router.push("/manage-subscriber");
            } else {
                toast.error("Failed to send newsletter");
            }
        } finally {
            setLoading(false);
        }
    };


    return (
        <>
            <div className="flex flex-col w-full min-h-screen h-full">
                {/* Header */}
                <div className="flex flex-col items-start gap-y-6 w-full justify-between">
                    <Link
                        href={"/manage-subscriber"}
                        className="w-fit gap-x-4 font-semibold text-sm flex justify-center items-center rounded-md px-4 py-2 h-fit border-2 border-black bg-white text-black"
                    >
                        <Icon icon={"lets-icons:back"} /> Back
                    </Link>
                    <ReUseHeadingTitle
                        title={"Create News Letter"}
                        desc={
                            "Create your News Letter here and manage all your versions in one place."
                        }
                    />
                </div>

                {/* Form */}
                <div className="mt-8 w-full bg-white border border-gray-200 rounded-xl shadow-md p-6 overflow-hidden">
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="w-full flex flex-col gap-y-6"
                    >
                        {/* Subject */}
                        <div className="flex flex-col w-full items-start gap-y-4">
                            <label className="text-sm font-semibold">Subject *</label>
                            <input
                                type="text"
                                placeholder="Subject"
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-800 placeholder-gray-400 shadow-sm"
                                {...register("subject", { required: "Subject is required" })}
                            />
                            {errors.subject && (
                                <p className="text-xs text-red-600">{errors.subject.message}</p>
                            )}
                        </div>

                        {/* Content  */}
                        {/* Content */}
                        <div className="flex flex-col w-full items-start gap-y-4">
                            <label className="text-sm font-semibold">Content *</label>

                            {/* Editor Loading State */}
                            {!editorLoaded && (
                                <div className="w-full h-[300px] rounded-lg border border-gray-300 bg-gray-100 animate-pulse flex items-center justify-center text-gray-500">
                                    Loading editor...
                                </div>
                            )}

                            <Editor
                                apiKey={process.env.NEXT_PUBLIC_EDITOR_API_KEY}
                                value={content}
                                init={{
                                    height: 300,
                                    menubar: false,
                                    plugins: ["link", "lists", "autolink", "code", "preview"],
                                    toolbar:
                                        "undo redo | bold italic underline | alignleft aligncenter alignright | bullist numlist | link | code preview",
                                    branding: false,
                                }}
                                onEditorChange={(newValue) => setContent(newValue)}
                                onInit={() => setEditorLoaded(true)}
                            />



                            {errors.content && (
                                <p className="text-xs text-red-600">{errors.content.message}</p>
                            )}
                        </div>


                        {/* Buttons */}
                        <div className="flex gap-x-4 mt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className={`px-4 py-2 text-sm font-semibold rounded-lg text-white bg-[#0F172A] shadow-lg transition-all ${loading
                                    ? "opacity-50 cursor-not-allowed"
                                    : "hover:bg-[#1e293b]"
                                    }`}
                            >
                                {loading ? "Sending..." : "Next → Select Recipients"}
                            </button>

                            <Link
                                href={"/manage-subscriber"}
                                className="px-4 py-2 text-sm font-semibold rounded-lg text-white bg-[#0F172A] shadow-lg hover:bg-[#1e293b]"
                            >
                                Cancel
                            </Link>
                        </div>
                    </form>
                </div>
            </div>

            <SelectRecipientsModal
                open={openRecipientModal}
                onClose={() => setOpenRecipientModal(false)}
                subject={subject}
                content={content}
                token={token}
                onSend={handleSendNewsletter}
            />

        </>
    )
}

export default CreateNewsLetterPage
