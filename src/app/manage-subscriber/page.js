import React from 'react'
import { SubscriberPageComponent } from '@/components'
import { FetchApi } from "@/utils/fetchAPI";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// -----------------------------------

const ManageSubscriber = async () => {

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) redirect("/login");

    let subscribers = [];

    try {
        const res = await FetchApi({
            url: "/subscribe/list",
            token,
        });

        if (!res.success) {
            redirect("/login");
        }

        subscribers = res.data;

    } catch (error) {
        redirect("/login");
    }

    return (
        <>
            <SubscriberPageComponent subscribers={subscribers} />
        </>
    )
}

export default ManageSubscriber
