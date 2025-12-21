import React from 'react'
import { BlogCategoryComponent } from '@/components'
import { FetchApi } from "@/utils/fetchAPI";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// --------------------------------------

const ManageBlogCategory = async () => {

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) redirect("/login");

    let blogCategory = [];

    try {
        const res = await FetchApi({
            url: "/blogCategory"
        });

        if (!res.success) {
            redirect("/login");
        }

        blogCategory = res.data;

    } catch (error) {
        redirect("/login");
    }


    return (
        <>
            <BlogCategoryComponent blogCategory={blogCategory} />
        </>
    )
}

export default ManageBlogCategory
