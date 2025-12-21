import React from 'react'
import { FetchApi } from '@/utils/fetchAPI';
import { redirect } from 'next/navigation';
import { EditFooterForm } from '@/components';

// ---------------------------------------------

const ManageFooter = async ({ params }) => {

    const { id } = await params

    let footer = [];

    try {
        const res = await FetchApi({
            url: `/footerContent/${id}`,
        });

        if (!res.success) {
            redirect("/login");
        }

        footer = res?.data?.data;


    } catch (error) {
        redirect("/login");
    }

    return (
        <>
            <EditFooterForm footer={footer} />
        </>
    )
}

export default ManageFooter
