"use client"

import { DashboardPageComponent, ProtectedRoute } from '@/components'
import React from 'react'

// --------------------------------------

const Home = () => {
  return (
    <>
      <ProtectedRoute>
        <DashboardPageComponent />
      </ProtectedRoute>
    </>
  )
}

export default Home
