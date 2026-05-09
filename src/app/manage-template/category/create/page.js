"use client"
import React from 'react'
import { CreateTemplateCategoryForm, ProtectedRoute } from '@/components';

// ------------------------------

const CreateTemplateCategory = () => {

    return (
        <>
            <ProtectedRoute>
                <CreateTemplateCategoryForm />
            </ProtectedRoute>
        </>
    )
}

export default CreateTemplateCategory
