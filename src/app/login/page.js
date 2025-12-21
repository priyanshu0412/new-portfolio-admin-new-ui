import React from 'react'
import { LoginPageComponent, PublicRoute } from '@/components'

// --------------------------------------------

const LoginPage = () => {
    return (
        <>
            <PublicRoute>
                <LoginPageComponent />
            </PublicRoute>
        </>
    )
}

export default LoginPage
