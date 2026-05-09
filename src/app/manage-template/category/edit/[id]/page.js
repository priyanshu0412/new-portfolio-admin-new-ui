import React from 'react'
import { EditTemplateCategoryForm } from '@/components'
import { FetchApi } from "@/utils/fetchAPI";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// --------------------------------------

const EditTemplateCategory = async ({ params }) => {

    const { id } = await params;
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) redirect("/login");

    let templateCategory;

    try {
        const templateCategoryRes = await FetchApi({
            url: `/templateCategory/${id}`
        })

        if (!templateCategoryRes.success) redirect("/login");
        templateCategory = templateCategoryRes.data;

    } catch (error) {
        redirect("/login");
    }

    return (
        <>
            <EditTemplateCategoryForm templateCategory={templateCategory} />
        </>
    )
}

export default EditTemplateCategory
