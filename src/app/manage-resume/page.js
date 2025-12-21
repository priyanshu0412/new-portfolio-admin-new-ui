import React from 'react';
import { ResumePageComponent } from "@/components";
import { FetchApi } from "@/utils/fetchAPI";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// ---------------------------------------------

const ManageResume = async () => {

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) redirect("/login");

    let resumes = [];

    try {
        const res = await FetchApi({
            url: "/resume",
            token,
        });

        if (!res.success) {
            redirect("/login");
        }

        if (Array.isArray(res.data)) {
            resumes = res.data;
        }

    } catch (error) {
        redirect("/login");
    }

    return (
        <>
            <ResumePageComponent initialResumes={resumes} />
        </>
    )

}

export default ManageResume
