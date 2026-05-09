import React from 'react'
import { CreateTemplateForm } from '@/components'
import { FetchApi } from "@/utils/fetchAPI";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// --------------------------------------

const CreateTemplate = async () => {

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) redirect("/login");

    let categories = [];

    try {
        // Fetch categories for the dropdown
        const catRes = await FetchApi({
            url: "/templateCategory"
        });

        if (catRes.success) {
            categories = catRes.data;
        }
    } catch (error) {
        console.error("Failed to fetch categories:", error);
    }

    return (
        <>
            <CreateTemplateForm categories={categories} />
        </>
    )
}

export default CreateTemplate
