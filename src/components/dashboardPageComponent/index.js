"use client"
import React, { useEffect, useState } from 'react'
import Icon from '../icon'
import { useSelector } from 'react-redux';
import Cookies from "js-cookie"
import { FetchApi } from '@/utils/fetchAPI';

// ------------------------------------------

const DashboardPageComponent = () => {

    const tokenFromRedux = useSelector((state) => state.auth.token);
    const token = tokenFromRedux || Cookies.get("token");

    const [counts, setCounts] = useState({
        blogs: 0,
        projects: 0,
        subscribers: 0,
        skills: 0,
    });

    const fetchDashboardCounts = async () => {
        try {
            const [
                blogRes,
                projectRes,
                subscriberRes,
                skillRes
            ] = await Promise.all([
                FetchApi({ url: "/dashboard/blogs", token }),
                FetchApi({ url: "/dashboard/projects", token }),
                FetchApi({ url: "/dashboard/subscribers", token }),
                FetchApi({ url: "/dashboard/skills", token }),
            ]);

            setCounts({
                blogs: blogRes?.data?.count || 0,
                projects: projectRes?.data?.count || 0,
                subscribers: subscriberRes?.data?.count || 0,
                skills: skillRes?.data?.count || 0,
            });

        } catch (error) {
            console.error("Dashboard count error", error);
        }
    };

    useEffect(() => {
        if (token) {
            fetchDashboardCounts();
        }
    }, [token]);


    return (
        <>
            <div className='flex flex-col w-full min-h-screen h-full'>

                {/* Title Desc  */}
                <div className='flex flex-col pt-4 gap-y-2'>
                    <p className='text-4xl font-semibold'>
                        Dashboard
                    </p>
                    <p className='text-gray-600'>
                        Welcome back! Here&apos;s an overview of your content.
                    </p>
                </div>

                {/* Stats Cards */}
                <div className='pt-8 w-full gap-y-8 flex flex-wrap justify-between'>

                    {/* Blog Card */}
                    <div className='sm:w-[280px] w-full flex justify-between items-center px-6 py-5 rounded-xl bg-blue-100 border border-blue-200 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1'>

                        <div className='flex flex-col gap-y-1'>
                            <p className='text-gray-700 font-semibold text-sm tracking-wide'>
                                Blogs
                            </p>
                            <p className='text-3xl font-bold text-gray-900'>
                                {counts.blogs}
                            </p>
                        </div>

                        <div className='w-12 h-12 rounded-full bg-blue-600 flex justify-center items-center shadow-md'>
                            <Icon
                                icon={"dashicons:welcome-write-blog"}
                                height={26}
                                width={26}
                                className={"text-white"}
                            />
                        </div>
                    </div>


                    {/* Projects Card */}
                    <div className='sm:w-[280px] w-full flex justify-between items-center px-6 py-5 rounded-xl bg-purple-100 border border-purple-200 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1'>

                        <div className='flex flex-col gap-y-1'>
                            <p className='text-gray-700 font-semibold text-sm tracking-wide'>
                                Projects
                            </p>
                            <p className='text-3xl font-bold text-gray-900'>
                                {counts.projects}
                            </p>
                        </div>

                        <div className='w-12 h-12 rounded-full bg-purple-600 flex justify-center items-center shadow-md'>
                            <Icon
                                icon={"material-symbols:earbud-case-sharp"}
                                height={26}
                                width={26}
                                className={"text-white"}
                            />
                        </div>
                    </div>


                    {/* Subscribers Card */}
                    <div className='sm:w-[280px] w-full flex justify-between items-center px-6 py-5 rounded-xl bg-green-100 border border-green-200 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1'>

                        <div className='flex flex-col gap-y-1'>
                            <p className='text-gray-700 font-semibold text-sm tracking-wide'>
                                Subscribers
                            </p>
                            <p className='text-3xl font-bold text-gray-900'>
                                {counts.subscribers}
                            </p>
                        </div>

                        <div className='w-12 h-12 rounded-full bg-green-600 flex justify-center items-center shadow-md'>
                            <Icon
                                icon={"mdi:users"}
                                height={26}
                                width={26}
                                className={"text-white"}
                            />
                        </div>
                    </div>


                    {/* Skills Card */}
                    <div className='sm:w-[280px] w-full flex justify-between items-center px-6 py-5 rounded-xl bg-orange-100 border border-orange-200 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1'>

                        <div className='flex flex-col gap-y-1'>
                            <p className='text-gray-700 font-semibold text-sm tracking-wide'>
                                Skills
                            </p>
                            <p className='text-3xl font-bold text-gray-900'>
                                {counts.skills}
                            </p>
                        </div>

                        <div className='w-12 h-12 rounded-full bg-orange-600 flex justify-center items-center shadow-md'>
                            <Icon
                                icon={"mdi:tools"}
                                height={26}
                                width={26}
                                className={"text-white"}
                            />
                        </div>
                    </div>

                </div>

                {/* Quick Actions  */}
                <div className='pt-8 flex-col sm:flex-row w-full gap-y-8 flex justify-between'>
                    <div className='sm:w-[48%] w-full p-5 rounded-xl border border-gray-300 bg-white shadow-sm'>

                        <p className='text-lg font-semibold text-gray-800 mb-2'>
                            Quick Actions
                        </p>

                        <div className='flex flex-col gap-y-3'>
                            <div className='w-full p-4 rounded-lg bg-gradient-to-r from-[#6EE7B7] to-[#3B82F6] text-white border border-gray-200 hover:shadow-md hover:scale-[1.01] transition-all duration-300 cursor-pointer font-medium'>
                                Create Blog Category
                            </div>

                            <div className='w-full p-4 rounded-lg bg-gradient-to-r from-[#FDE68A] to-[#F97316] text-gray-900 border border-gray-200 hover:shadow-md hover:scale-[1.01] transition-all duration-300 cursor-pointer font-medium'>
                                Create Blog
                            </div>

                            <div className='w-full p-4 rounded-lg bg-gradient-to-r from-[#A78BFA] to-[#EC4899] text-white border border-gray-200 hover:shadow-md hover:scale-[1.01] transition-all duration-300 cursor-pointer font-medium'>
                                Create Project
                            </div>

                            <div className='w-full p-4 rounded-lg bg-gradient-to-r from-[#220479] to-[#30ba6c] text-white border border-gray-200 hover:shadow-md hover:scale-[1.01] transition-all duration-300 cursor-pointer font-medium'>
                                Manage Subscriber
                            </div>


                        </div>
                    </div>

                    <div className='sm:w-[48%] w-full p-5 rounded-xl border border-gray-300 bg-white shadow-sm'>

                        <p className='text-lg font-semibold text-gray-800 mb-2'>
                            Quick Actions
                        </p>

                        <div className='flex flex-col gap-y-3'>

                            <div className='w-full p-4 rounded-lg bg-gradient-to-r from-[#34D399] to-[#10B981] text-white border border-gray-200 hover:shadow-md hover:scale-[1.01] transition-all duration-300 cursor-pointer font-medium'>
                                Create Skills
                            </div>

                            <div className='w-full p-4 rounded-lg bg-gradient-to-r from-[#60A5FA] to-[#2563EB] text-white border border-gray-200 hover:shadow-md hover:scale-[1.01] transition-all duration-300 cursor-pointer font-medium'>
                                Create Experience
                            </div>

                            <div className='w-full p-4 rounded-lg bg-gradient-to-r from-[#F43F5E] to-[#FB7185] text-white border border-gray-200 hover:shadow-md hover:scale-[1.01] transition-all duration-300 cursor-pointer font-medium'>
                                Create Footer
                            </div>

                            <div className='w-full p-4 rounded-lg bg-gradient-to-r from-[#c5793f] to-[#1f23a5] text-white border border-gray-200 hover:shadow-md hover:scale-[1.01] transition-all duration-300 cursor-pointer font-medium'>
                                Create Resume
                            </div>

                        </div>
                    </div>
                </div>

            </div>
        </>
    )
}

export default DashboardPageComponent
