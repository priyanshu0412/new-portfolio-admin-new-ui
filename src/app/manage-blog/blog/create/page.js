import React from 'react'
import { CreateBlogForm } from '@/components'
import { FetchApi } from "@/utils/fetchAPI";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// ---------------------------------

const CreateBlog = async () => {

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) redirect("/login");

    let blogCategory = [];
    let blogs = [];

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

    } catch (error) {
        redirect("/login");
    }


    return (
        <>
            <CreateBlogForm
                blogCategory={blogCategory}
                blogs={blogs}
            />
        </>
    )
}

export default CreateBlog
