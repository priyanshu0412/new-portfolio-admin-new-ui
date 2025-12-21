import React from 'react'
import { SkillPageComponent } from '@/components'
import { FetchApi } from "@/utils/fetchAPI";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

// ------------------------------------

const ManageSkillPage = async () => {

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) redirect("/login");


    let skills = [];

    try {
        const res = await FetchApi({
            url: "/skills",
        });

        if (!res.success) {
            redirect("/login");
        }

        skills = res.data;

    } catch (error) {
        redirect("/login");
    }


    return (
        <>
            <SkillPageComponent skills={skills} />
        </>
    )
}

export default ManageSkillPage
