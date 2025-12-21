import { BlogComponent } from '@/components'
import React from 'react'
import { FetchApi } from "@/utils/fetchAPI";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// ----------------------------

const ManageBlog = async () => {

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) redirect("/login");

    let blogs = [];

    try {
        const res = await FetchApi({
            url: "/blog"
        });

        if (!res.success) {
            redirect("/login");
        }

        blogs = res.data.data;

    } catch (error) {
        redirect("/login");
    }

    return (
        <>
            <BlogComponent blogs={blogs} />
        </>
    )
}

export default ManageBlog
