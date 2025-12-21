import React from "react";
import { EditProjectForm } from "@/components";
import { FetchApi } from "@/utils/fetchAPI";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// ------------------------------

const EditProjectPage = async ({ params }) => {

    const { id } = await params
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) redirect("/login");

    let project = [];

    try {
        const res = await FetchApi({
            url: `/project/${id}`,
            token,
        });

        if (!res.success) {
            redirect("/login");
        }

        project = res.data;

    } catch (error) {
        redirect("/login");
    }


    return <EditProjectForm project={project} />;
};

export default EditProjectPage;
