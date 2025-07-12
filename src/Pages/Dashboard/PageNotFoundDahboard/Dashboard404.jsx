import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaBox, FaExclamationTriangle, FaArrowLeft } from 'react-icons/fa';

const Dashboard404 = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-lg w-full text-center">
        {/* 404 Icon */}
        <div className="mb-8">
          <div className="relative inline-block">
            <FaExclamationTriangle className="text-8xl text-[#CAEB66] animate-bounce" />
            <div className="absolute -top-2 -right-2 bg-[#03373D] text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
              !
            </div>
          </div>
        </div>

        {/* Error Message */}
        <div className="mb-8">
          <h1 className="text-6xl font-bold text-[#03373D] mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-[#03373D] mb-4">
            Page Not Found
          </h2>
          <p className="text-gray-600 text-lg mb-2">
            Oops! The dashboard page you're looking for doesn't exist.
          </p>
          <p className="text-gray-500">
            It might have been moved, deleted, or you entered the wrong URL.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/dashboard/myParcels"
              className="flex items-center justify-center space-x-2 bg-[#CAEB66] text-[#03373D] px-6 py-3 rounded-lg font-semibold hover:bg-opacity-90 hover:transform hover:scale-105 transition-all duration-300 shadow-lg"
            >
              <FaBox className="text-lg" />
              <span>My Parcels</span>
            </Link>
            
            <Link
              to="/dashboard"
              className="flex items-center justify-center space-x-2 bg-[#03373D] text-white px-6 py-3 rounded-lg font-semibold hover:bg-opacity-90 hover:transform hover:scale-105 transition-all duration-300 shadow-lg"
            >
              <FaHome className="text-lg" />
              <span>Dashboard Home</span>
            </Link>
          </div>

          <div className="pt-4">
            <button
              onClick={() => window.history.back()}
              className="flex items-center justify-center space-x-2 text-gray-600 hover:text-[#03373D] transition-colors duration-200 mx-auto"
            >
              <FaArrowLeft className="text-sm" />
              <span>Go Back</span>
            </button>
          </div>
        </div>

        {/* Additional Help */}
        <div className="mt-12 p-6 bg-white rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-[#03373D] mb-3">
            Need Help?
          </h3>
          <p className="text-gray-600 text-sm mb-4">
            If you believe this is an error, please contact our support team.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <Link
              to="/dashboard/myParcels"
              className="text-[#03373D] hover:text-[#CAEB66] transition-colors duration-200"
            >
              View My Parcels
            </Link>
            <span className="text-gray-300">•</span>
            <Link
              to="/dashboard/tracking"
              className="text-[#03373D] hover:text-[#CAEB66] transition-colors duration-200"
            >
              Track Parcel
            </Link>
            <span className="text-gray-300">•</span>
            <Link
              to="/dashboard/payments"
              className="text-[#03373D] hover:text-[#CAEB66] transition-colors duration-200"
            >
              Payment History
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard404;