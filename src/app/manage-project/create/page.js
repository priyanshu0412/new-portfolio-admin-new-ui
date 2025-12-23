import React from 'react'
import { CreateProjectForm, ProtectedRoute } from '@/components'

// --------------------------------------

const CreateProjectPage = () => {
    return (
        <>
            <ProtectedRoute>
                <CreateProjectForm />
            </ProtectedRoute>
        </>
    )
}

export default CreateProjectPage
