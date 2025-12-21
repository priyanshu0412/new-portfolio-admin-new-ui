import { FooterPageComponent } from '@/components'
import { FetchApi } from '@/utils/fetchAPI';
import { redirect } from 'next/navigation';
import React from 'react'

// ---------------------------------------------

const ManageFooter = async () => {

    let footer = [];

    try {
        const res = await FetchApi({
            url: "/footerContent",
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
            <FooterPageComponent footer={footer} />
        </>
    )
}

export default ManageFooter
