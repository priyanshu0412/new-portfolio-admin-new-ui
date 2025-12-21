"use client"
import Icon from '@/components/icon'
import ReUseHeadingTitle from '@/components/reUseHeadingTitle'
import { FetchApi } from '@/utils/fetchAPI'
import Image from 'next/image'
import Link from 'next/link'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import Cookies from "js-cookie";
import { useRouter } from 'next/navigation';
import { useForm } from "react-hook-form";
import { Editor } from "@tinymce/tinymce-react";
import { toast } from "react-hot-toast";
import convertToArray from '@/utils/convertToArray'

// ------------------------------

const CreateBlogForm = ({ blogCategory, blogs }) => {

    const router = useRouter();
    const tokenFromRedux = useSelector((state) => state.auth.token);
    const token = tokenFromRedux || Cookies.get("token");
    const [loading, setLoading] = useState(false);
    const [thumbnail, setThumbnail] = useState(null);
    const [preview, setPreview] = useState(null);
    const [editorContent, setEditorContent] = useState("");
    const [editorLoading, setEditorLoading] = useState(true);

    const {
        register,
        handleSubmit,
    } = useForm();

    const handleThumbnailChange = (e) => {
        const file = e.target.files[0];
        setThumbnail(file);

        if (file) {
            const url = URL.createObjectURL(file);
            setPreview(url);
        }
    };

    const onSubmit = async (data) => {

        if (!token) {
            toast.error("You are not authenticated!");
            return;
        }

        setLoading(true);

        try {
            const formData = new FormData();

            formData.append("title", data.blogTitle);
            formData.append("date", data.publishDate || "");
            formData.append("readTime", data.readTime);
            formData.append("desc", data.blogDescription);
            formData.append("content", editorContent);
            formData.append("category", data.blogCategory);
            formData.append("tags", JSON.stringify(convertToArray(data.tags)));
            if (data.relatedBlogs && data.relatedBlogs.length > 0) {
                data.relatedBlogs.forEach(id => {
                    formData.append("relatedBlogs[]", id);
                });
            }
            formData.append("isFeatured", data?.isFeaturedBlog)
            formData.append("shareLink", data?.shareLink)
            formData.append("authorName", data?.authorName)
            formData.append("authorGithubLink", data.authorGithub)
            formData.append("authorDesc", data.authorBio)
            formData.append("authorPortfolioLink", data.authorPortfolio)
            formData.append("authorOtherProfileLink", data.otherSocialLink)


            if (thumbnail) {
                formData.append("thumbnailImg", thumbnail);
            }

            const res = await FetchApi({
                url: "/blog",
                method: "POST",
                data: formData,
                token,
            });

            setLoading(false);

            if (res.success) {
                toast.success("Blog added successfully!");
                router.push("/manage-blog/blog");
            } else {
                toast.error(res?.data?.message || "Something went wrong!");
            }

        } catch (error) {
            setLoading(false);
            toast.error("Something went wrong!");
        }
    };

    return (
        <>
            <div className="flex flex-col w-full min-h-screen h-full">

                {/* Header */}
                <div className="flex flex-col items-start gap-y-6 w-full justify-between">
                    <Link
                        href={"/manage-blog/blog"}
                        className="w-fit gap-x-4 font-semibold text-sm flex justify-center items-center rounded-md px-4 py-2 h-fit border-2 border-black bg-white text-black"
                    >
                        <Icon icon={"lets-icons:back"} /> Back
                    </Link>

                    <ReUseHeadingTitle
                        title={"Add Your Blog"}
                        desc={"Add your Blog here and manage all your versions in one place."}
                    />
                </div>

                {/* Form */}
                <div className="mt-8 w-full bg-white border border-gray-200 rounded-xl shadow-md p-6 overflow-hidden">

                    <form onSubmit={handleSubmit(onSubmit)} className="w-full flex flex-col gap-y-6">

                        {/* Blog Title */}
                        <div className="flex flex-col w-full gap-y-2">
                            <label className="text-sm font-semibold">Title</label>
                            <input
                                type="text"
                                placeholder="Title"
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-300"
                                {...register("blogTitle")}
                            />
                        </div>

                        {/* Publish Date / Read Min */}
                        <div className='flex justify-between items-center gap-y-2'>
                            <div className="flex flex-col w-[48%] gap-y-2">
                                <label className="text-sm font-semibold">Publish Date</label>
                                <input
                                    type="date"
                                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300"
                                    {...register("publishDate")}
                                />
                            </div>
                            <div className="flex flex-col w-[48%] gap-y-2">
                                <label className="text-sm font-semibold">Read Time (Minutes)</label>
                                <input
                                    type="text"
                                    placeholder='5'
                                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300"
                                    {...register("readTime")}
                                />
                            </div>
                        </div>

                        {/* Description */}
                        <div className="flex flex-col gap-y-2">
                            <label className="text-sm font-semibold">Description</label>
                            <textarea
                                rows={4}
                                cols={4}
                                placeholder="Description"
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-300"
                                {...register("blogDescription")}
                            />
                        </div>

                        {/* Blog Content */}
                        <div className="flex flex-col gap-y-2">
                            <label className="text-sm font-semibold">Blog Content *</label>

                            {editorLoading && (
                                <div className=" flex items-center justify-center">
                                    <p>Loading</p>
                                </div>
                            )}
                            <Editor
                                apiKey={process.env.NEXT_PUBLIC_EDITOR_API_KEY}
                                onInit={() => setEditorLoading(false)}

                                init={{
                                    height: 600,
                                    menubar: "file edit view insert format tools table help",
                                    skin: "oxide",
                                    content_css: "default",
                                    plugins: [
                                        "advlist",
                                        "autolink",
                                        "lists",
                                        "link",
                                        "image",
                                        "charmap",
                                        "preview",
                                        "anchor",
                                        "searchreplace",
                                        "visualblocks",
                                        "code",
                                        "fullscreen",
                                        "insertdatetime",
                                        "media",
                                        "table",
                                        "help",
                                        "wordcount",
                                        "emoticons",
                                        "codesample",
                                        "pagebreak",
                                        "nonbreaking",
                                        "directionality",
                                    ],
                                    toolbar: [
                                        "undo redo | blocks fontselect fontsizeselect | " +
                                        "bold italic underline strikethrough forecolor backcolor | " +
                                        "alignleft aligncenter alignright alignjustify | " +
                                        "bullist numlist outdent indent | " +
                                        "blockquote subscript superscript | " +
                                        "link image media table emoticons codesample charmap | " +
                                        "removeformat code preview fullscreen",
                                    ].join(" "),
                                    toolbar_mode: "sliding",
                                    branding: false,
                                    elementpath: false,
                                    content_style: `
          body {
            font-family: 'Inter', sans-serif;
            font-size: 16px;
            line-height: 1.7;
            color: #1f2937;
            background-color: #ffffff;
            padding: 1.5rem;
          }
          h1, h2, h3, h4, h5, h6 {
            font-weight: 700;
            color: #111827;
            margin-top: 1.5rem;
            margin-bottom: 0.75rem;
          }
          p {
            margin-bottom: 1rem;
          }
          a {
            color: #2563eb;
            text-decoration: underline;
          }
          blockquote {
            border-left: 4px solid #60a5fa;
            padding-left: 1rem;
            color: #374151;
            font-style: italic;
            background: #f3f4f6;
            border-radius: 0.375rem;
          }
          code {
            background: #f9fafb;
            color: #d97706;
            padding: 2px 5px;
            border-radius: 0.25rem;
            font-family: 'Fira Code', monospace;
          }
          table {
            border-collapse: collapse;
            width: 100%;
            margin: 1rem 0;
          }
          table, th, td {
            border: 1px solid #e5e7eb;
            padding: 0.5rem;
          }
          th {
            background-color: #f9fafb;
            font-weight: 600;
          }
        `,
                                }}
                                onEditorChange={(content) => setEditorContent(content)}
                            />

                        </div>

                        {/* Category / Tags */}
                        <div className="flex flex-col md:flex-row w-full items-center justify-between gap-y-2">
                            <div className='flex flex-col w-[48%] gap-y-2'>
                                <label className="text-sm font-semibold">Category</label>

                                <select
                                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300"
                                    {...register("blogCategory")}
                                >
                                    <option value="">Select Category</option>

                                    {blogCategory?.map((item) => (
                                        <option key={item._id} value={item._id}>
                                            {item.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className='flex flex-col w-[48%] gap-y-2'>
                                <label className="text-sm font-semibold">Tags (Comma Separated)</label>
                                <textarea
                                    rows={2}
                                    placeholder="LifeStyle, Learning, JWT"
                                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300"
                                    {...register("tags")}
                                />
                            </div>
                        </div>

                        {/* Related Blogs */}
                        <div className="flex flex-col gap-y-2">
                            <label className="text-sm font-semibold">Related Blogs</label>

                            <div className="border border-gray-300 rounded-lg max-h-[260px] overflow-y-auto divide-y">
                                {blogs?.map((blog) => (
                                    <label
                                        key={blog._id}
                                        className="flex items-start gap-3 p-3 cursor-pointer hover:bg-gray-50"
                                    >
                                        <input
                                            type="checkbox"
                                            value={blog._id}
                                            {...register("relatedBlogs")}
                                            className="mt-1 accent-black"
                                        />

                                        <div className="flex flex-col gap-1">
                                            {/* Title */}
                                            <span className="text-sm font-medium text-gray-900">
                                                {blog.title}
                                            </span>

                                            {/* Meta Info */}
                                            <div className="flex items-center gap-2 text-xs text-gray-500">
                                                <span className="px-2 py-0.5 rounded bg-gray-100">
                                                    {blog.category[0]?.name || "Uncategorized"}
                                                </span>
                                                <span>•</span>
                                                <span>{blog.readTime} min read</span>
                                            </div>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Thumbnail Image / Is Featured */}
                        <div className="flex flex-col md:flex-row w-full items-start justify-between gap-y-2">
                            <div className='flex flex-col w-[48%] gap-y-2'>
                                <label className="text-sm font-semibold">Thumbnail Image</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleThumbnailChange}
                                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-800 placeholder-gray-400 shadow-sm"
                                />
                                <p className="text-xs">Upload your Blog Thumbnail Image</p>
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
                                    {...register("isFeaturedBlog")}
                                    className="w-4 h-4 rounded border-gray-300"
                                />
                                <span className="text-md font-semibold">Set as Featured Blog</span>
                            </div>
                        </div>

                        {/* Share Link */}
                        <div className="flex flex-col gap-y-2">
                            <label className="text-sm font-semibold">Share Link</label>
                            <input
                                type='text'
                                placeholder="Sharable Link"
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-300"
                                {...register("shareLink")}
                            />
                        </div>

                        {/* Author Name / Author Github */}
                        <div className="flex flex-col md:flex-row w-full items-center justify-between gap-y-2">
                            <div className='flex flex-col w-[48%] gap-y-2'>
                                <label className="text-sm font-semibold">Author Name</label>
                                <input
                                    type="text"
                                    placeholder="Author Name"
                                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300"
                                    {...register("authorName")}
                                />
                            </div>

                            <div className='flex flex-col w-[48%] gap-y-2'>
                                <label className="text-sm font-semibold">Author Github </label>
                                <input
                                    type="text"
                                    placeholder="Author Github"
                                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300"
                                    {...register("authorGithub")}
                                />
                            </div>
                        </div>

                        {/* Author Bio */}
                        <div className="flex flex-col gap-y-2">
                            <label className="text-sm font-semibold">Author Bio</label>
                            <textarea
                                rows={4}
                                cols={4}
                                placeholder="Author Bio"
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-300"
                                {...register("authorBio")}
                            />
                        </div>

                        {/* Author Portfolio / Other Social Link */}
                        <div className="flex flex-col md:flex-row w-full items-center justify-between gap-y-2">
                            <div className='flex flex-col w-[48%] gap-y-2'>
                                <label className="text-sm font-semibold">Author Portfolio </label>
                                <input
                                    type="text"
                                    placeholder="Author Portfolio"
                                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300"
                                    {...register("authorPortfolio")}
                                />
                            </div>
                            <div className='flex flex-col w-[48%] gap-y-2'>
                                <label className="text-sm font-semibold">Other Social Link </label>
                                <input
                                    type="text"
                                    placeholder="Author Other Link"
                                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300"
                                    {...register("otherSocialLink")}
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
                                {loading ? "Uploading..." : "Publish Blog"}
                            </button>

                            <Link
                                href={"/manage-blog/blog"}
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

export default CreateBlogForm
