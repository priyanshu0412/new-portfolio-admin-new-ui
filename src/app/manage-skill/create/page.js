import React from 'react'
import { CreateSkillsForm, ProtectedRoute } from '@/components'

// ---------------------------------

const CreateSkillPage = () => {
    return (
        <>
            <ProtectedRoute>
                <CreateSkillsForm />
            </ProtectedRoute>
        </>
    )
}

export default CreateSkillPage
