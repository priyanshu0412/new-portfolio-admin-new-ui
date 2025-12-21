import React from 'react'
import { FetchApi } from "@/utils/fetchAPI";
import { redirect } from "next/navigation";
import { ProjectPageComponent } from '@/components'

// -------------------------------------

const ManageProject = async () => {

    let project = [];

    try {
        const res = await FetchApi({
            url: "/project",
        });

        if (!res.success) {
            redirect("/login");
        }

        project = res.data.projects;

    } catch (error) {
        redirect("/login");
    }

    return (
        <>
            <ProjectPageComponent project={project} />
        </>
    )
}

export default ManageProject
