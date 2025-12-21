import React from 'react'
import { EditBlogForm } from '@/components'
import { FetchApi } from "@/utils/fetchAPI";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// ---------------------------------

const EditBlog = async ({ params }) => {

    const { id } = await params;
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) redirect("/login");

    let blogCategory = [];
    let blogs = [];
    let editBlog = {};

    try {
        const categoryRes = await FetchApi({
            url: "/blogCategory"
        });

        if (!categoryRes.success) redirect("/login");
        blogCategory = categoryRes.data;

        const blogRes = await FetchApi({
            url: "/blog"
        });

        if (!blogRes.success) redirect("/login");
        blogs = blogRes.data.data;

        const editBlogRes = await FetchApi({
            url: `/blog/${id}`
        })

        if (!editBlogRes.success) redirect("/login");
        editBlog = editBlogRes.data.data;

    } catch (error) {
        redirect("/login");
    }


    return (
        <>
            <EditBlogForm
                blogCategory={blogCategory}
                blogs={blogs}
                editBlog={editBlog}
            />
        </>
    )
}

export default EditBlog
