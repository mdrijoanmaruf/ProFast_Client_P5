import React from 'react'
import useAuth from '../Hook/useAuth'
import useUserRole from '../Hook/useUserRole'
import { Navigate } from 'react-router-dom'

const AdminRoute = ({ children }) => {
    const { user, loading } = useAuth()
    const { role, isLoading: roleLoading } = useUserRole()

    // Show loading while checking authentication and role
    if (loading || roleLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#03373D] mx-auto"></div>
                    <p className="mt-4 text-[#03373D]">Verifying access...</p>
                </div>
            </div>
        )
    }

    // Redirect to login if not authenticated
    if (!user) {
        return <Navigate to="/login" replace />
    }

    // Redirect to forbidden page if not admin
    if (role !== 'admin') {
        return <Navigate to="/forbidden" replace />
    }

    // Render children if user is authenticated and has admin role
    return children
}

export default AdminRoute