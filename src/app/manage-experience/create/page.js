import React from 'react'
import { CreateExpForm, ProtectedRoute } from '@/components'

// ----------------------------------------

const CreateExpPage = () => {
    return (
        <>
            <ProtectedRoute>
                <CreateExpForm />
            </ProtectedRoute>
        </>
    )
}

export default CreateExpPage
