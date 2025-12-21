"use client"

import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import { toast } from "react-hot-toast";
import { FetchApi } from '@/utils/fetchAPI';
import Cookies from "js-cookie";
import { useForm, useFieldArray } from "react-hook-form";
import Link from 'next/link';
import Image from 'next/image';
import ReUseHeadingTitle from '../reUseHeadingTitle';
import { useRouter } from 'next/navigation';
import Icon from '../icon';
import { Editor } from "@tinymce/tinymce-react";
import convertToArray from '@/utils/convertToArray'

// -----------------------------------

const EditProjectForm = ({ project }) => {

    const router = useRouter();
    const tokenFromRedux = useSelector((state) => state.auth.token);
    const token = tokenFromRedux || Cookies.get("token");

    const [thumbnail, setThumbnail] = useState(null);
    const [preview, setPreview] = useState(project?.thumbnailImg || null);
    const [editorContent, setEditorContent] = useState(project?.aboutProjectContent || "");
    const [editorLoading, setEditorLoading] = useState(true);
    const [loading, setLoading] = useState(false);

    const {
        register,
        handleSubmit,
        control,
    } = useForm({
        defaultValues: {
            title: project?.title,
            description: project?.desc,
            techUsed: project?.techUsed?.join(", "),
            category: project?.category,
            tags: project?.tags?.join(", "),
            keyFeatures: project?.keyFeatures?.join(", "),
            gitHubLink: project?.githubLink,
            livePreviewLink: project?.livePreviewLink,
            isFeaturedProject: project?.isFeatured,
            client: project?.client,
            completed: project?.completeDate?.slice(0, 10),
            qaList: project?.technicalChallengesAndSolutions || [{ question: "", answer: "" }]
        },
    });

    const { fields: qaFields, append: addQA, remove: removeQA } = useFieldArray({
        control,
        name: "qaList",
    });

    const handleThumbnailChange = (e) => {
        const file = e.target.files[0];
        setThumbnail(file);

        if (file) {
            setPreview(URL.createObjectURL(file));
        }
    };

    const onSubmit = async (data) => {
        setLoading(true);

        const formData = new FormData();
        formData.append("title", data.title);
        formData.append("desc", data.description);
        formData.append("techUsed", JSON.stringify(convertToArray(data.techUsed)));
        formData.append("category", data.category);
        formData.append("tags", JSON.stringify(convertToArray(data.tags)));
        formData.append("githubLink", data.gitHubLink || "");
        formData.append("livePreviewLink", data.livePreviewLink || "");
        formData.append("keyFeatures", JSON.stringify(convertToArray(data.keyFeatures)));
        formData.append("isFeatured", data.isFeaturedProject);
        formData.append("client", data.client || "");
        formData.append("completeDate", data.completed || "");
        formData.append("technicalChallengesAndSolutions", JSON.stringify(data.qaList));
        formData.append("aboutProjectContent", editorContent);

        if (thumbnail) {
            formData.append("thumbnailImg", thumbnail);
        }

        const res = await FetchApi({
            url: `/project/${project._id}`,
            method: "PATCH",
            data: formData,
            token,
        });

        setLoading(false);

        if (res.success) {
            toast.success("Project updated successfully!");
            router.push("/manage-project");
        } else {
            toast.error("Failed to update!");
        }
    };


    return (
        <>
            <div className="flex flex-col w-full min-h-screen h-full">

                {/* Header */}
                <div className="flex flex-col items-start gap-y-6 w-full justify-between">
                    <Link
                        href={"/manage-project"}
                        className="w-fit gap-x-4 font-semibold text-sm flex justify-center items-center rounded-md px-4 py-2 h-fit border-2 border-black bg-white text-black"
                    >
                        <Icon icon={"lets-icons:back"} /> Back
                    </Link>

                    <ReUseHeadingTitle
                        title={"Edit Your Project"}
                        desc={"Edit your Project here and manage all your versions in one place."}
                    />
                </div>

                {/* Form */}
                <div className="mt-8 w-full bg-white border border-gray-200 rounded-xl shadow-md p-6 overflow-hidden">

                    <form onSubmit={handleSubmit(onSubmit)} className="w-full flex flex-col gap-y-6">

                        {/* Title / Category */}
                        <div className="flex flex-col md:flex-row w-full items-center justify-between gap-y-2">
                            <div className='flex flex-col w-[48%] gap-y-2'>
                                <label className="text-sm font-semibold">Title *</label>
                                <input
                                    type="text"
                                    placeholder="Title"
                                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300"
                                    {...register("title")}
                                />
                            </div>

                            <div className='flex flex-col w-[48%] gap-y-2'>
                                <label className="text-sm font-semibold">Category *</label>

                                <select
                                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300"
                                    {...register("category")}
                                >
                                    <option value="">Select Category</option>
                                    <option value="Fullstack">Fullstack</option>
                                    <option value="Frontend">Frontend</option>
                                    <option value="Backend">Backend</option>
                                </select>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="flex flex-col gap-y-2">
                            <label className="text-sm font-semibold">Description *</label>
                            <textarea
                                rows={4}
                                cols={4}
                                placeholder="Description"
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-300"
                                {...register("description")}
                            />
                        </div>

                        {/* Tech Used / Tags */}
                        <div className="flex flex-col md:flex-row w-full items-center justify-between gap-y-2">
                            <div className='flex flex-col w-[48%] gap-y-2'>
                                <label className="text-sm font-semibold">Tech Used (Comma Separated) *</label>
                                <textarea
                                    rows={2}
                                    placeholder="React , Node , MongoDB"
                                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300"
                                    {...register("techUsed")}
                                />
                            </div>

                            <div className='flex flex-col w-[48%] gap-y-2'>
                                <label className="text-sm font-semibold">Tags (Comma Separated) *</label>
                                <textarea
                                    rows={2}
                                    placeholder="LifeStyle, Learning, JWT"
                                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300"
                                    {...register("tags")}
                                />
                            </div>
                        </div>

                        {/* Key Features */}
                        <div className="flex flex-col gap-y-2">
                            <label className="text-sm font-semibold">Key Features (Comma Separated) *</label>
                            <textarea
                                rows={4}
                                cols={4}
                                placeholder="Feature 1 , Feature 2"
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-300"
                                {...register("keyFeatures")}
                            />
                        </div>

                        {/* Technical Challenges & Solutions */}
                        <div className='flex flex-col gap-y-2 w-full'>
                            <label className="text-sm font-semibold">Technical Challenges & Solutions *</label>

                            {qaFields.map((field, index) => (
                                <div key={field.id} className='w-full flex justify-between items-start'>

                                    <div className='w-[45%] flex flex-col gap-y-2'>
                                        <textarea
                                            rows={2}
                                            placeholder="Question"
                                            className="w-full px-4 py-2.5 rounded-lg border border-gray-300"
                                            {...register(`qaList.${index}.question`)}
                                        />
                                    </div>

                                    <div className='w-[45%] flex flex-col gap-y-2'>
                                        <textarea
                                            rows={2}
                                            placeholder="Answer"
                                            className="w-full px-4 py-2.5 rounded-lg border border-gray-300"
                                            {...register(`qaList.${index}.answer`)}
                                        />
                                    </div>

                                    <div className='w-[5%] flex justify-center pt-3'>
                                        <Icon
                                            icon={"material-symbols:delete"}
                                            className="text-red-500 cursor-pointer"
                                            height={22}
                                            width={22}
                                            onClick={() => removeQA(index)}
                                        />
                                    </div>
                                </div>
                            ))}

                            <div className='pt-2'>
                                <button
                                    type="button"
                                    onClick={() => addQA({ question: "", answer: "" })}
                                    className="px-4 py-2 justify-center items-center text-sm font-semibold rounded-lg text-white flex gap-x-2 bg-[#0F172A]"
                                >
                                    <Icon icon={"gridicons:add"} /> Add Question & Answer
                                </button>
                            </div>

                        </div>

                        {/* Project Content */}
                        <div className="flex flex-col gap-y-2">
                            <label className="text-sm font-semibold">Project Content *</label>

                            {editorLoading && (
                                <div className=" flex items-center justify-center">
                                    <p>Loading</p>
                                </div>
                            )}
                            <Editor
                                apiKey={process.env.NEXT_PUBLIC_EDITOR_API_KEY}
                                initialValue={project?.aboutProjectContent || ""}
                                onInit={() => setEditorLoading(false)}
                                init={{
                                    height: 200,
                                    menubar: false,
                                    plugins:
                                        "advlist autolink lists link image charmap preview anchor " +
                                        "searchreplace visualblocks code fullscreen " +
                                        "insertdatetime media table code help wordcount",

                                    toolbar:
                                        "undo redo | formatselect | bold italic backcolor | " +
                                        "alignleft aligncenter alignright alignjustify | " +
                                        "bullist numlist outdent indent | removeformat | help",
                                }}
                                onEditorChange={(content) => setEditorContent(content)}
                            />

                        </div>

                        {/* Github Link / Live Preview Link */}
                        <div className="flex flex-col md:flex-row w-full items-center justify-between gap-y-2">
                            <div className='flex flex-col w-[48%] gap-y-2'>
                                <label className="text-sm font-semibold">Github Link </label>
                                <input
                                    type="text"
                                    placeholder="Github Link"
                                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300"
                                    {...register("gitHubLink")}
                                />
                            </div>

                            <div className='flex flex-col w-[48%] gap-y-2'>
                                <label className="text-sm font-semibold">Live Preview Link </label>
                                <input
                                    type="text"
                                    placeholder="Live Preview Link"
                                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300"
                                    {...register("livePreviewLink")}
                                />
                            </div>
                        </div>

                        {/* Thumbnail Image / Is Featured */}
                        <div className="flex flex-col md:flex-row w-full items-start justify-between gap-y-2">
                            <div className='flex flex-col w-[48%] gap-y-2'>
                                <label className="text-sm font-semibold">Thumbnail Image *</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleThumbnailChange}
                                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-800 placeholder-gray-400 shadow-sm"
                                />
                                <p className="text-xs">Upload your Project Thumbnail Image</p>
                                {/* Image Preview */}
                                {preview && (
                                    <div className="mt-3 w-full h-40 rounded-lg overflow-hidden border">
                                        <Image
                                            width={300}
                                            height={300}
                                            alt='...'
                                            src={preview}
                                            className="w-full h-full object-cover" />
                                    </div>
                                )}
                            </div>

                            <div className='flex justify-start items-center w-[48%] gap-x-2'>
                                <input
                                    type="checkbox"
                                    {...register("isFeaturedProject")}
                                    className="w-4 h-4 rounded border-gray-300"
                                />
                                <span className="text-md font-semibold">Set as Featured Project</span>
                            </div>
                        </div>


                        {/* Client / Completed */}
                        <div className="flex flex-col md:flex-row w-full items-center justify-between gap-y-2">
                            <div className='flex flex-col w-[48%] gap-y-2'>
                                <label className="text-sm font-semibold">Client</label>
                                <input
                                    type='text'
                                    placeholder="Client"
                                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300"
                                    {...register("client")}
                                />
                            </div>

                            <div className='flex flex-col w-[48%] gap-y-2'>
                                <label className="text-sm font-semibold">Project Completed</label>
                                <input
                                    type='date'
                                    placeholder="5/4/200"
                                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300"
                                    {...register("completed")}
                                />
                            </div>
                        </div>

                        {/* Buttons */}
                        <div className="flex gap-x-4 mt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className={`px-4 py-2 text-sm font-semibold rounded-lg text-white bg-[#0F172A] ${loading ? "opacity-50 cursor-not-allowed" : "hover:bg-[#1e293b]"}`}
                            >
                                {loading ? "Uploading..." : "Update Project"}
                            </button>

                            <Link
                                href={"/manage-project"}
                                className="px-4 py-2 text-sm font-semibold rounded-lg text-white bg-[#0F172A] hover:bg-[#1e293b]"
                            >
                                Cancel
                            </Link>
                        </div>

                    </form>
                </div>

            </div>
        </>
    )
}

export default EditProjectForm
