"use client"
import { usePathname } from 'next/navigation';
import React from 'react'
import Sidebar from '../sidebar';

// ----------------------------------

const SidebarWrapper = ({ children }) => {
    const pathname = usePathname();

    const hideSidebarRoutes = ["/login", "/signup"];
    const shouldHideSidebar = hideSidebarRoutes.includes(pathname);
    return (
        <>
            {!shouldHideSidebar && <Sidebar />}

            <main
                className={
                    shouldHideSidebar
                        ? "p-0"
                        : "sm:ml-64 ml-0 mt-[64px] p-6"
                }
            >
                {children}
            </main>
        </>
    )
}

export default SidebarWrapper
