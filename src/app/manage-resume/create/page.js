import React from 'react'
import { CreateResumeForm, ProtectedRoute } from '@/components'

// -----------------------------------------

const CreateResumePage = () => {
    return (
        <>
            <ProtectedRoute>
                <CreateResumeForm />
            </ProtectedRoute>
        </>
    )
}

export default CreateResumePage
