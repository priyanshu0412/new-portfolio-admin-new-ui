"use client"

import React from 'react'

// ------------------------------------

const ReUseHeadingTitle = ({ title, desc }) => {
    return (
        <>
            <div className='flex flex-col w-fit pt-2 gap-y-1'>
                <p className='text-3xl font-bold'>
                    {title}
                </p>
                <p className='text-gray-600'>
                    {desc}
                </p>
            </div>

        </>
    )
}

export default ReUseHeadingTitle
