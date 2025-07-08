import React from 'react'
import useAuth from '../Hook/useAuth'
import { Navigate, useLocation } from 'react-router-dom'

const PrivateRoutes = ({children}) => {
    const {user , loading} = useAuth()
    const location = useLocation();

    if(loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-[#03373D] via-[#03373D] to-[#1a5a62] flex items-center justify-center ">
                <div className="text-center">
                    {/* Animated Logo/Brand */}
                    <div className="mb-8">
                        <div className="w-20 h-20 mx-auto mb-4 bg-[#CAEB66] rounded-full flex items-center justify-center animate-pulse">
                            <span className="text-3xl font-bold text-[#03373D]">P</span>
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2">ProFast</h2>
                        <p className="text-[#CAEB66] text-sm">Loading your dashboard...</p>
                    </div>

                    {/* Modern Spinner */}
                    <div className="relative w-16 h-16 mx-auto mb-6">
                        <div className="absolute inset-0 border-4 border-[#CAEB66]/20 rounded-full"></div>
                        <div className="absolute inset-0 border-4 border-transparent border-t-[#CAEB66] rounded-full animate-spin"></div>
                        <div className="absolute inset-2 border-2 border-transparent border-t-white rounded-full animate-spin" style={{animationDirection: 'reverse', animationDuration: '1.5s'}}></div>
                    </div>

                    {/* Loading Text Animation */}
                    <div className="flex items-center justify-center space-x-1">
                        <span className="text-white text-sm">Authenticating</span>
                        <div className="flex space-x-1">
                            <div className="w-1 h-1 bg-[#CAEB66] rounded-full animate-bounce" style={{animationDelay: '0s'}}></div>
                            <div className="w-1 h-1 bg-[#CAEB66] rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                            <div className="w-1 h-1 bg-[#CAEB66] rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-64 h-1 bg-white/20 rounded-full mx-auto mt-6 overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-[#CAEB66] to-white rounded-full animate-pulse"></div>
                    </div>
                </div>
            </div>
        )
    }

    if(!user) {
        return <Navigate to='/login' state={{from: location}} replace></Navigate>
    }
  return children;
}

export default PrivateRoutes