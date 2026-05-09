import React from 'react'
import { TemplateCategoryComponent } from '@/components'
import { FetchApi } from "@/utils/fetchAPI";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// --------------------------------------

const ManageTemplateCategory = async () => {

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) redirect("/login");

    let templateCategory = [];

    try {
        const res = await FetchApi({
            url: "/templateCategory"
        });

        if (!res.success) {
            redirect("/login");
        }

        templateCategory = res.data;

    } catch (error) {
        redirect("/login");
    }

    return (
        <>
            <TemplateCategoryComponent templateCategory={templateCategory} />
        </>
    )
}

export default ManageTemplateCategory
