import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import useAuth from '../../../Hook/useAuth';
import useAxiosSecure from '../../../Hook/useAxiosSecure';
import { 
  FaSearch, 
  FaMapMarkerAlt, 
  FaTruck, 
  FaCheckCircle, 
  FaClock, 
  FaBox,
  FaFileAlt,
  FaRoute,
  FaCalendarAlt,
  FaUser,
  FaPhone,
  FaHome,
  FaExclamationTriangle,
  FaShippingFast
} from 'react-icons/fa';
import Swal from 'sweetalert2';

const Tracking = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [trackingNumber, setTrackingNumber] = useState('');
  const [searchedParcel, setSearchedParcel] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState('');

  // Get user's parcels for quick tracking
  const { data: userParcels = [], isLoading: userParcelsLoading } = useQuery({
    queryKey: ['user-parcels', user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/parcels?email=${user.email}`);
      return res.data;
    },
    enabled: !!user?.email
  });

  const getStatusColor = (status) => {
    const colors = {
      'pending': 'text-yellow-600 bg-yellow-100',
      'paid': 'text-blue-600 bg-blue-100',
      'processing': 'text-purple-600 bg-purple-100',
      'shipped': 'text-indigo-600 bg-indigo-100',
      'in-transit': 'text-orange-600 bg-orange-100',
      'out-for-delivery': 'text-cyan-600 bg-cyan-100',
      'delivered': 'text-green-600 bg-green-100',
      'cancelled': 'text-red-600 bg-red-100'
    };
    return colors[status] || 'text-gray-600 bg-gray-100';
  };

  const getStatusIcon = (status) => {
    const icons = {
      'pending': <FaClock className="text-yellow-600" />,
      'paid': <FaCheckCircle className="text-blue-600" />,
      'processing': <FaBox className="text-purple-600" />,
      'shipped': <FaShippingFast className="text-indigo-600" />,
      'in-transit': <FaTruck className="text-orange-600" />,
      'out-for-delivery': <FaTruck className="text-cyan-600" />,
      'delivered': <FaCheckCircle className="text-green-600" />,
      'cancelled': <FaExclamationTriangle className="text-red-600" />
    };
    return icons[status] || <FaClock className="text-gray-600" />;
  };

  const trackingSteps = [
    { id: 'pending', label: 'Order Placed', description: 'Your parcel booking has been received' },
    { id: 'paid', label: 'Payment Confirmed', description: 'Payment has been processed successfully' },
    { id: 'processing', label: 'Processing', description: 'Your parcel is being prepared for shipment' },
    { id: 'shipped', label: 'Shipped', description: 'Your parcel has been picked up and is in our facility' },
    { id: 'in-transit', label: 'In Transit', description: 'Your parcel is on its way to destination' },
    { id: 'out-for-delivery', label: 'Out for Delivery', description: 'Your parcel is out for final delivery' },
    { id: 'delivered', label: 'Delivered', description: 'Your parcel has been successfully delivered' }
  ];

  const getCurrentStepIndex = (status) => {
    return trackingSteps.findIndex(step => step.id === status);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-BD', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleTrackingSearch = async (e) => {
    e.preventDefault();
    if (!trackingNumber.trim()) {
      setSearchError('Please enter a tracking number');
      return;
    }

    setIsSearching(true);
    setSearchError('');
    setSearchedParcel(null);

    try {
      // Try to find by tracking number using the dedicated endpoint
      try {
        const trackingRes = await axiosSecure.get(`/parcels/track/${trackingNumber.trim()}`);
        if (trackingRes.data.success) {
          setSearchedParcel(trackingRes.data.data);
          return;
        }
      } catch (trackingError) {
        // If tracking endpoint fails, try other methods
      }

      // Fallback: Try to find by parcel ID
      try {
        const parcelRes = await axiosSecure.get(`/parcels/${trackingNumber.trim()}`);
        setSearchedParcel(parcelRes.data);
      } catch (error) {
        setSearchError('Parcel not found. Please check your tracking number and try again.');
      }
    } catch (error) {
      console.error('Tracking search error:', error);
      setSearchError('Unable to search for parcel. Please try again later.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleQuickTrack = (parcel) => {
    setSearchedParcel(parcel);
    setTrackingNumber(parcel.trackingNumber);
    setSearchError('');
  };

  const TrackingProgress = ({ parcel }) => {
    const currentStepIndex = getCurrentStepIndex(parcel.status);
    
    return (
      <div className="mb-6 sm:mb-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 sm:mb-6 text-center">Tracking Progress</h3>
        <div className="relative">
          {/* Progress Line */}
          <div className="absolute left-4 sm:left-6 top-6 sm:top-8 bottom-8 w-0.5 bg-gray-200"></div>
          <div 
            className="absolute left-4 sm:left-6 top-6 sm:top-8 w-0.5 bg-[#03373D] transition-all duration-500"
            style={{ height: `${(currentStepIndex / (trackingSteps.length - 1)) * 100}%` }}
          ></div>
          
          {/* Steps */}
          <div className="space-y-4 sm:space-y-6">
            {trackingSteps.map((step, index) => {
              const isCompleted = index <= currentStepIndex;
              const isCurrent = index === currentStepIndex;
              
              return (
                <div key={step.id} className="relative flex items-start">
                  {/* Step Circle */}
                  <div className={`relative z-10 flex items-center justify-center w-8 h-8 sm:w-12 sm:h-12 rounded-full border-2 ${
                    isCompleted 
                      ? 'bg-[#03373D] border-[#03373D] text-white' 
                      : 'bg-white border-gray-300 text-gray-400'
                  }`}>
                    {isCompleted ? (
                      <FaCheckCircle className="w-4 h-4 sm:w-6 sm:h-6" />
                    ) : (
                      <FaClock className="w-4 h-4 sm:w-6 sm:h-6" />
                    )}
                  </div>
                  
                  {/* Step Content */}
                  <div className="ml-4 sm:ml-6 flex-1">
                    <div className={`font-medium text-sm sm:text-base ${isCompleted ? 'text-[#03373D]' : 'text-gray-500'}`}>
                      {step.label}
                      {isCurrent && (
                        <span className="ml-2 inline-flex items-center px-2 sm:px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#CAEB66] text-[#03373D]">
                          Current
                        </span>
                      )}
                    </div>
                    <div className={`text-xs sm:text-sm mt-1 ${isCompleted ? 'text-gray-700' : 'text-gray-500'}`}>
                      {step.description}
                    </div>
                    {isCurrent && (
                      <div className="text-xs text-gray-500 mt-1">
                        Last updated: {formatDate(parcel.updatedAt || parcel.creation_date)}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  const ParcelDetails = ({ parcel }) => (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-[#03373D] px-4 sm:px-6 py-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            {parcel.type === 'document' ? (
              <FaFileAlt className="text-[#CAEB66] text-xl sm:text-2xl flex-shrink-0" />
            ) : (
              <FaBox className="text-[#CAEB66] text-xl sm:text-2xl flex-shrink-0" />
            )}
            <div className="min-w-0 flex-1">
              <h2 className="text-white text-lg font-semibold truncate">{parcel.title}</h2>
              <p className="text-[#CAEB66] text-sm truncate">Tracking: {parcel.trackingNumber}</p>
            </div>
          </div>
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(parcel.status)} self-start sm:self-auto`}>
            <div className="flex items-center space-x-2">
              {getStatusIcon(parcel.status)}
              <span className="capitalize">{parcel.status}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-6">
        <TrackingProgress parcel={parcel} />

        {/* Parcel Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6">
          {/* Pickup Details */}
          <div className="bg-blue-50 p-3 sm:p-4 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-3 flex items-center text-sm sm:text-base">
              <FaMapMarkerAlt className="mr-2" />
              Pickup Details
            </h4>
            <div className="space-y-2 text-xs sm:text-sm">
              <p className="flex items-start">
                <FaUser className="inline mr-2 text-blue-600 mt-0.5 flex-shrink-0" />
                <span><strong>Name:</strong> {parcel.senderName}</span>
              </p>
              <p className="flex items-start">
                <FaPhone className="inline mr-2 text-blue-600 mt-0.5 flex-shrink-0" />
                <span><strong>Contact:</strong> {parcel.senderContact}</span>
              </p>
              <p className="flex items-start">
                <FaMapMarkerAlt className="inline mr-2 text-blue-600 mt-0.5 flex-shrink-0" />
                <span><strong>Location:</strong> {parcel.senderRegion} - {parcel.senderServiceCenter}</span>
              </p>
              <p className="flex items-start">
                <FaHome className="inline mr-2 text-blue-600 mt-0.5 flex-shrink-0" />
                <span><strong>Address:</strong> {parcel.senderAddress}</span>
              </p>
            </div>
          </div>

          {/* Delivery Details */}
          <div className="bg-green-50 p-3 sm:p-4 rounded-lg">
            <h4 className="font-semibold text-green-800 mb-3 flex items-center text-sm sm:text-base">
              <FaTruck className="mr-2" />
              Delivery Details
            </h4>
            <div className="space-y-2 text-xs sm:text-sm">
              <p className="flex items-start">
                <FaUser className="inline mr-2 text-green-600 mt-0.5 flex-shrink-0" />
                <span><strong>Name:</strong> {parcel.receiverName}</span>
              </p>
              <p className="flex items-start">
                <FaPhone className="inline mr-2 text-green-600 mt-0.5 flex-shrink-0" />
                <span><strong>Contact:</strong> {parcel.receiverContact}</span>
              </p>
              <p className="flex items-start">
                <FaMapMarkerAlt className="inline mr-2 text-green-600 mt-0.5 flex-shrink-0" />
                <span><strong>Location:</strong> {parcel.receiverRegion} - {parcel.receiverServiceCenter}</span>
              </p>
              <p className="flex items-start">
                <FaHome className="inline mr-2 text-green-600 mt-0.5 flex-shrink-0" />
                <span><strong>Address:</strong> {parcel.receiverAddress}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
          <div className="text-center">
            <p className="text-xs sm:text-sm text-gray-600">Booking Date</p>
            <p className="font-semibold flex items-center justify-center text-sm sm:text-base">
              <FaCalendarAlt className="mr-2 text-gray-400" />
              {formatDate(parcel.creation_date)}
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs sm:text-sm text-gray-600">Delivery Cost</p>
            <p className="font-semibold text-[#03373D] text-lg">৳{parcel.cost}</p>
          </div>
          <div className="text-center">
            <p className="text-xs sm:text-sm text-gray-600">Package Type</p>
            <p className="font-semibold capitalize text-sm sm:text-base">
              {parcel.type === 'document' ? '📄 Document' : '📦 Non-Document'}
              {parcel.weight && ` (${parcel.weight}kg)`}
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-4 sm:space-y-6 px-2 sm:px-4 md:px-0">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl md:text-3xl font-bold text-[#03373D]">Package Tracking</h1>
        <p className="text-gray-600 mt-2 text-sm sm:text-base">Track your parcels in real-time</p>
      </div>

      {/* Search Section */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Track Your Parcel</h2>
        
        <form onSubmit={handleTrackingSearch} className="mb-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <input
                type="text"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                placeholder="Enter tracking number"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#CAEB66] focus:border-transparent text-sm sm:text-base"
              />
            </div>
            <button
              type="submit"
              disabled={isSearching}
              className="bg-[#03373D] text-white px-6 py-3 rounded-lg hover:bg-[#044a52] focus:outline-none focus:ring-2 focus:ring-[#CAEB66] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
            >
              {isSearching ? (
                <div className="w-5 h-5 sm:w-6 sm:h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <FaSearch className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="ml-2 sm:hidden">Search</span>
                </>
              )}
            </button>
          </div>
        </form>

        {searchError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
            <p className="text-red-600 text-sm">{searchError}</p>
          </div>
        )}
      </div>

      {/* Quick Track Section - User's Recent Parcels */}
      {user && userParcels.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Track - Your Recent Parcels</h2>
          
          {userParcelsLoading ? (
            <div className="text-center py-8">
              <div className="w-8 h-8 border-2 border-[#03373D] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Loading your parcels...</p>
            </div>
          ) : (
            <div className="grid gap-3">
              {userParcels.slice(0, 5).map((parcel) => (
                <div
                  key={parcel._id}
                  onClick={() => handleQuickTrack(parcel)}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors gap-3 sm:gap-0"
                >
                  <div className="flex items-center space-x-3">
                    {parcel.type === 'document' ? (
                      <FaFileAlt className="text-blue-600 flex-shrink-0" />
                    ) : (
                      <FaBox className="text-orange-600 flex-shrink-0" />
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-sm truncate">{parcel.title}</p>
                      <p className="text-xs text-gray-500 truncate">{parcel.trackingNumber}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between sm:justify-end space-x-3">
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(parcel.status)}`}>
                      {parcel.status}
                    </div>
                    <FaRoute className="text-gray-400 flex-shrink-0" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tracking Results */}
      {searchedParcel && (
        <ParcelDetails parcel={searchedParcel} />
      )}

      {/* No Results Message */}
      {!searchedParcel && trackingNumber && !isSearching && !searchError && (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 sm:p-8 text-center">
          <FaExclamationTriangle className="text-3xl sm:text-4xl text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-800 mb-2">No Results Found</h3>
          <p className="text-gray-600 text-sm sm:text-base">
            Please check your tracking number and try again. Make sure you've entered the complete tracking number.
          </p>
        </div>
      )}

      {/* Help Section */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 sm:p-6">
        <h3 className="text-lg font-semibold text-blue-800 mb-3">Need Help?</h3>
        <div className="text-xs sm:text-sm text-blue-700 space-y-2">
          <p>• Tracking numbers are usually in the format: PRO1234567890123</p>
          <p>• You can also use your parcel ID for tracking</p>
          <p>• Updates may take a few minutes to reflect in the system</p>
          <p>• For assistance, contact our support team</p>
        </div>
      </div>
    </div>
  );
};

export default Tracking;