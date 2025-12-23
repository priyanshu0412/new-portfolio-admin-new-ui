"use client"
import React from 'react'
import { CreateBlogCategoryForm, ProtectedRoute } from '@/components';

// ------------------------------

const CreateBlogCategory = () => {

    return (
        <>
            <ProtectedRoute>
                <CreateBlogCategoryForm />
            </ProtectedRoute>
        </>
    )
}

export default CreateBlogCategory
