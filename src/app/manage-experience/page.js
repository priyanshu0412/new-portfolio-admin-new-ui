import React from 'react'
import { ExpPageComponent } from '@/components'
import { FetchApi } from "@/utils/fetchAPI";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// ----------------------------------

const ManageExperience = async () => {

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) redirect("/login");

    let experience = [];

    try {
        const res = await FetchApi({
            url: "/exp"
        });

        if (!res.success) {
            redirect("/login");
        }

        experience = res.data;

    } catch (error) {
        redirect("/login");
    }

    return (
        <>
            <ExpPageComponent experience={experience} />
        </>
    )
}

export default ManageExperience
