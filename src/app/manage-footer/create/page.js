import React from 'react'
import { CreateFooterForm, ProtectedRoute } from '@/components'

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
