import { CreateFooterForm, ProtectedRoute } from '@/components'
import React from 'react'

// --------------------------------

const CreateFooterPage = () => {
    return (
        <>
            <ProtectedRoute>
                <CreateFooterForm />
            </ProtectedRoute>
        </>
    )
}

export default CreateFooterPage
