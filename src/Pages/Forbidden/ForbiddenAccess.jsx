import React from 'react'
import { Link } from 'react-router-dom'
import { FaLock, FaHome, FaArrowLeft } from 'react-icons/fa'
import useAuth from '../../Hook/useAuth'

const ForbiddenAccess = () => {
  const { user } = useAuth()

  return (
    <div className="min-h-screen  flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Error Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          {/* Lock Icon */}
          <div className="mx-auto w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6">
            <FaLock className="text-red-500 text-3xl" />
          </div>

          {/* Error Code */}
          <h1 className="text-6xl font-bold text-gray-800 mb-4">403</h1>
          
          {/* Error Message */}
          <h2 className="text-2xl font-semibold text-gray-700 mb-3">
            Access Forbidden
          </h2>
          
          <p className="text-gray-500 mb-2">
            Sorry, you don't have permission to access this page.
          </p>
          
          {user && (
            <p className="text-sm text-gray-400 mb-6">
              Logged in as: <span className="font-medium">{user.email}</span>
            </p>
          )}

          {/* Action Buttons */}
          <div className="space-y-3">
            <Link
              to="/dashboard"
              className="w-full bg-[#03373D] text-white py-3 px-6 rounded-lg font-medium hover:bg-[#03373D]/90 transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              <FaArrowLeft className="text-sm" />
              <span>Back to Dashboard</span>
            </Link>
            
            <Link
              to="/"
              className="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-200 transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              <FaHome className="text-sm" />
              <span>Go to Homepage</span>
            </Link>
          </div>

          {/* Additional Info */}
          <div className="mt-8 pt-6 border-t border-gray-100">
            <p className="text-xs text-gray-400">
              If you believe this is an error, please contact the administrator.
            </p>
          </div>
        </div>

        {/* Bottom Message */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-500">
            Need admin access? Contact your system administrator.
          </p>
        </div>
      </div>
    </div>
  )
}

export default ForbiddenAccess