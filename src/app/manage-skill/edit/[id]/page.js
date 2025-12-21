import React from 'react'
import { EditSkillsForm } from '@/components'
import { redirect } from "next/navigation";
import { FetchApi } from '@/utils/fetchAPI';

// ------------------------------------

const EditSkillPage = async ({ params }) => {

    const { id } = await params;

    let skills = {};

    try {
        const res = await FetchApi({
            url: `/skills/${id}`,
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
            <EditSkillsForm skills={skills} />
        </>
    )
}

export default EditSkillPage
