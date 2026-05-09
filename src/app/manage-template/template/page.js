import React from 'react'
import { TemplateComponent } from '@/components'
import { FetchApi } from "@/utils/fetchAPI";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// --------------------------------------

const ManageTemplate = async () => {

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) redirect("/login");

    let templates = [];

    try {
        const res = await FetchApi({
            url: "/template"
        });

        if (!res.success) {
            redirect("/login");
        }

        templates = res.data;

    } catch (error) {
        redirect("/login");
    }

    return (
        <>
            <TemplateComponent templates={templates} />
        </>
    )
}

export default ManageTemplate
