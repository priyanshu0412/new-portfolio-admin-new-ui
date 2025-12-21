import React from 'react'
import { EditExpForm } from '@/components';
import { redirect } from "next/navigation";
import { FetchApi } from '@/utils/fetchAPI';

// ---------------------------

const EditExpPage = async ({ params }) => {

    const { id } = await params;

    let experience = {};

    try {
        const res = await FetchApi({
            url: `/exp/${id}`,
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
            <EditExpForm experience={experience} />
        </>
    )
}

export default EditExpPage
