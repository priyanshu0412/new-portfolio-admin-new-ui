import React from 'react'
import { EditBlogCategoryForm } from '@/components'
import { FetchApi } from "@/utils/fetchAPI";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// --------------------------------------

const EditBlogCategory = async ({ params }) => {

    const { id } = await params;
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) redirect("/login");

    let blogCategory;

    try {

        const blogCategoryRes = await FetchApi({
            url: `/blogCategory/${id}`
        })

        if (!blogCategoryRes.success) redirect("/login");
        blogCategory = blogCategoryRes.data;

    } catch (error) {
        redirect("/login");
    }

    return (
        <>
            <EditBlogCategoryForm blogCategory={blogCategory} />
        </>
    )
}

export default EditBlogCategory
