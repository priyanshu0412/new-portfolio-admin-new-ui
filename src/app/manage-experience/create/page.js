import { CreateExpForm, ProtectedRoute } from '@/components'
import React from 'react'

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
