import { CreateResumeForm, ProtectedRoute } from '@/components'
import React from 'react'

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
