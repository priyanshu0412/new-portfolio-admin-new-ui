"use client";
import React, { useState } from "react";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/store/auth/authSlice";


// ---------------------------------------------------

const Sidebar = () => {

    const pathname = usePathname();
    const [openSidebar, setOpenSidebar] = useState(false);
    const [openUserMenu, setOpenUserMenu] = useState(false);
    const [openBlogs, setOpenBlogs] = useState(false);
    const [openSkills, setOpenSkills] = useState(false);
    const dispatch = useDispatch();
    const userAuth = useSelector((state) => state.auth.isAuthenticated);


    return (
        <>
            <nav className="fixed top-0 z-50 w-full bg-[#0F172A] border-b border-gray-700 text-white">
                <div className="px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setOpenSidebar(true)}
                            className="sm:hidden text-white bg-gray-700/40 p-2 rounded-md"
                        >
                            <Icon icon="material-symbols:menu-rounded" width="28" />
                        </button>

                        <h1 className="text-xl font-bold">Priyanshu</h1>
                    </div>

                    {/* RIGHT USER PROFILE */}
                    <div className="relative">
                        <button
                            onClick={() => setOpenUserMenu(!openUserMenu)}
                            className="w-9 h-9 flex items-center justify-center bg-gray-600 rounded-full text-white text-lg font-semibold"
                        >
                            U
                        </button>

                        {/* USER DROPDOWN */}
                        {openUserMenu && (
                            <div className="absolute right-0 mt-2 w-44 bg-[#1E293B] border border-gray-700 rounded-lg shadow-lg text-sm">
                                <div className="px-4 py-3 border-b border-gray-700">
                                    <p className="font-medium">Priyanshu</p>
                                    <p className="text-gray-300 text-xs">admin</p>
                                </div>

                                {
                                    userAuth ? (
                                        <div className="p-2">
                                            <button
                                                onClick={() => dispatch(logout())}
                                                className="px-3 py-2 rounded hover:bg-gray-700 cursor-pointer">
                                                Logout
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="p-2">
                                            <Link
                                                href="/login"
                                                className="px-3 py-2 rounded hover:bg-gray-700 cursor-pointer">
                                                Logout
                                            </Link>
                                        </div>
                                    )
                                }

                            </div>
                        )}
                    </div>
                </div>
            </nav>

            {/* SIDEBAR */}
            <aside
                className={`fixed top-0 left-0 z-40 w-64 h-full bg-[#0F172A] border-r border-gray-700 text-white p-4 pt-20 transform transition-transform duration-300
                    ${openSidebar ? "translate-x-0" : "-translate-x-full sm:translate-x-0"}`}
            >
                <ul className="space-y-3">

                    {/* Dashboard */}
                    <li>
                        <Link
                            href="/"
                            className={`flex items-center gap-3 p-2 rounded hover:bg-gray-700 cursor-pointer ${pathname === "/" ? "bg-gray-700" : ""}`}
                        >
                            <Icon
                                icon={"material-symbols:dashboard-rounded"}
                                width="22"
                            />
                            <span>Dashboard</span>
                        </Link>
                    </li>

                    {/* Blogs */}
                    <li className="text-white">
                        <div
                            onClick={() => setOpenBlogs(!openBlogs)}
                            className={`flex items-center justify-between p-2 rounded hover:bg-gray-700 cursor-pointer`}
                        >
                            <div className="flex items-center gap-3">
                                <Icon icon="mdi:blog" width="22" />
                                <span>Blogs</span>
                            </div>
                            <Icon
                                icon={"mdi:chevron-down"}
                                width="22"
                                className={`transition-transform ${openBlogs ? "rotate-180" : ""}`}
                            />
                        </div>

                        {/* Dropdown list */}
                        {openBlogs && (
                            <ul className="ml-10 flex flex-col mt-1 space-y-1">
                                <Link
                                    href={"/manage-blog/category"}
                                    className={`p-1.5 text-sm rounded hover:bg-gray-700 cursor-pointer ${pathname === "/manage-blog/category" ? "bg-gray-700" : ""}`}>
                                    Blog Category
                                </Link>
                                <Link
                                    href={"/manage-blog/blog"}
                                    className={`p-1.5 text-sm rounded hover:bg-gray-700 cursor-pointer ${pathname === "/manage-blog/blog" ? "bg-gray-700" : ""}`}>
                                    Blog
                                </Link>
                            </ul>
                        )}
                    </li>

                    {/* Project */}
                    <li>
                        <Link
                            href={"/manage-project"}
                            className={`flex items-center gap-3 p-2 rounded hover:bg-gray-700 cursor-pointer ${pathname === "/manage-project" ? "bg-gray-700" : ""}`}
                        >
                            <Icon
                                icon={"streamline:projector-board"}
                                width="22" />
                            <span>Project</span>
                        </Link>
                    </li>

                    {/* Skills */}
                    <li>
                        <Link
                            href={"/manage-skill"}
                            className={`flex items-center gap-3 p-2 rounded hover:bg-gray-700 cursor-pointer ${pathname === "/manage-skill" ? "bg-gray-700" : ""}`}
                        >
                            <Icon icon="hugeicons:ai-idea" width="22" />
                            <span>Skills</span>
                        </Link>
                    </li>

                    {/* Experience */}
                    <li>
                        <Link
                            href={"/manage-experience"}
                            className={`flex items-center gap-3 p-2 rounded hover:bg-gray-700 cursor-pointer ${pathname === "/manage-experience" ? "bg-gray-700" : ""}`}
                        >
                            <Icon icon="lsicon:education-filled" width="22" />
                            <span>Experience</span>
                        </Link>
                    </li>

                    {/* Subscriber */}
                    <li>
                        <Link
                            href={"/manage-subscriber"}
                            className={`flex items-center gap-3 p-2 rounded hover:bg-gray-700 cursor-pointer ${pathname === "/manage-subscriber" ? "bg-gray-700" : ""}`}
                        >
                            <Icon icon="mynaui:users" width="22" />
                            <span>Subscriber</span>
                        </Link>
                    </li>

                    {/* Resume */}
                    <li>
                        <Link
                            href={"/manage-resume"}
                            className={`flex items-center gap-3 p-2 rounded hover:bg-gray-700 cursor-pointer ${pathname.includes("/manage-resume") ? "bg-gray-700" : ""}`}
                        >
                            <Icon
                                icon="qlementine-icons:resume-16"
                                width="22" />
                            <span>Resume</span>
                        </Link>
                    </li>

                    {/* Footer */}
                    <li>
                        <Link
                            href={"/manage-footer"}
                            className={`flex items-center gap-3 p-2 rounded hover:bg-gray-700 cursor-pointer ${pathname === "/manage-footer" ? "bg-gray-700" : ""}`}
                        >
                            <Icon
                                icon="gravity-ui:layout-footer"
                                width="22" />
                            <span>Footer</span>
                        </Link>
                    </li>
                </ul>
            </aside>

            {/* BACKDROP for mobile */}
            {openSidebar && (
                <div
                    onClick={() => setOpenSidebar(false)}
                    className="fixed inset-0 bg-black/40 sm:hidden"
                ></div>
            )}
        </>
    );
};

export default Sidebar;
