import React from 'react'
import { EditTemplateForm } from '@/components'
import { FetchApi } from "@/utils/fetchAPI";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// --------------------------------------

const EditTemplate = async ({ params }) => {

    const { id } = await params;
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) redirect("/login");

    let template;
    let categories = [];

    try {
        // Fetch the template data
        const templateRes = await FetchApi({
            url: `/template/${id}`
        });

        if (!templateRes.success) redirect("/login");
        template = templateRes.data;

        // Fetch categories for the dropdown
        const catRes = await FetchApi({
            url: "/templateCategory"
        });

        if (catRes.success) {
            categories = catRes.data;
        }

    } catch (error) {
        redirect("/login");
    }

    return (
        <>
            <EditTemplateForm template={template} categories={categories} />
        </>
    )
}

export default EditTemplate
