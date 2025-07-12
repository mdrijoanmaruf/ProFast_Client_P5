import React, { useState, useEffect } from 'react';
import { 
  FaUser, 
  FaEnvelope, 
  FaPhone, 
  FaMapMarkerAlt, 
  FaMotorcycle,
  FaCar,
  FaBicycle,
  FaTruck,
  FaCheck,
  FaTimes,
  FaClock,
  FaCalendarAlt,
  FaIdCard
} from 'react-icons/fa';
import useAxiosSecure from '../../../Hook/useAxiosSecure';
import Swal from 'sweetalert2';

const PendingRiders = () => {
  const [pendingRiders, setPendingRiders] = useState([]);
  const [loading, setLoading] = useState(true);
  const axiosSecure = useAxiosSecure();

  // Vehicle icons mapping
  const vehicleIcons = {
    motorcycle: FaMotorcycle,
    bicycle: FaBicycle,
    car: FaCar,
    truck: FaTruck
  };

  useEffect(() => {
    fetchPendingRiders();
  }, []);

  const fetchPendingRiders = async () => {
    try {
      setLoading(true);
      const response = await axiosSecure.get('/riders?status=pending');
      setPendingRiders(response.data);
    } catch (error) {
      console.error('Error fetching pending riders:', error);
      Swal.fire({
        title: 'Error!',
        text: 'Failed to fetch pending riders',
        icon: 'error',
        confirmButtonColor: '#03373D'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (riderId, newStatus) => {
    try {
      const result = await Swal.fire({
        title: `${newStatus === 'active' ? 'Activate' : 'Set Pending'} Rider?`,
        text: `Are you sure you want to ${newStatus === 'active' ? 'activate' : 'set as pending'} this rider?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: newStatus === 'active' ? '#CAEB66' : '#03373D',
        cancelButtonColor: '#d33',
        confirmButtonText: `Yes, ${newStatus === 'active' ? 'Activate' : 'Set Pending'}!`
      });

      if (result.isConfirmed) {
        await axiosSecure.patch(`/riders/${riderId}/status`, { status: newStatus });
        
        Swal.fire({
          title: 'Success!',
          text: `Rider has been ${newStatus === 'active' ? 'activated' : 'set as pending'} successfully`,
          icon: 'success',
          confirmButtonColor: '#CAEB66'
        });

        // Remove from pending list if activated
        if (newStatus === 'active') {
          setPendingRiders(prev => prev.filter(rider => rider._id !== riderId));
        } else {
          fetchPendingRiders(); // Refresh list
        }
      }
    } catch (error) {
      console.error('Error updating rider status:', error);
      Swal.fire({
        title: 'Error!',
        text: 'Failed to update rider status',
        icon: 'error',
        confirmButtonColor: '#03373D'
      });
    }
  };

  const handleReject = async (riderId) => {
    try {
      const result = await Swal.fire({
        title: 'Reject Rider?',
        text: 'This will permanently delete the rider application. This action cannot be undone!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#03373D',
        confirmButtonText: 'Yes, Reject!'
      });

      if (result.isConfirmed) {
        await axiosSecure.delete(`/riders/${riderId}`);
        
        Swal.fire({
          title: 'Rejected!',
          text: 'Rider application has been rejected and deleted',
          icon: 'success',
          confirmButtonColor: '#CAEB66'
        });

        // Remove from list
        setPendingRiders(prev => prev.filter(rider => rider._id !== riderId));
      }
    } catch (error) {
      console.error('Error rejecting rider:', error);
      Swal.fire({
        title: 'Error!',
        text: 'Failed to reject rider',
        icon: 'error',
        confirmButtonColor: '#03373D'
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#CAEB66]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#03373D]">Pending Riders</h1>
            <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">
              Review and manage rider applications waiting for approval
            </p>
          </div>
          <div className="bg-[#CAEB66]/10 px-3 sm:px-4 py-2 rounded-lg self-start sm:self-auto">
            <span className="text-[#03373D] font-semibold text-sm sm:text-base">
              {pendingRiders.length} Pending Applications
            </span>
          </div>
        </div>
      </div>

      {/* Riders List */}
      {pendingRiders.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-8 sm:p-12 text-center border border-gray-200">
          <FaClock className="text-5xl sm:text-6xl text-gray-300 mx-auto mb-3 sm:mb-4" />
          <h3 className="text-lg sm:text-xl font-semibold text-gray-600 mb-2">
            No Pending Applications
          </h3>
          <p className="text-gray-500 text-sm sm:text-base px-4">
            All rider applications have been processed. New applications will appear here.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:gap-6">
          {pendingRiders.map((rider) => {
            const VehicleIcon = vehicleIcons[rider.vehicleType] || FaMotorcycle;
            
            return (
              <div key={rider._id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-4 sm:p-6">
                  {/* Mobile Layout */}
                  <div className="block sm:hidden space-y-4">
                    {/* Header - Mobile */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-[#CAEB66]/20 rounded-full flex items-center justify-center">
                          <FaUser className="text-lg text-[#03373D]" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-[#03373D]">
                            {rider.fullName}
                          </h3>
                        </div>
                      </div>
                      <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-semibold">
                        Pending
                      </span>
                    </div>

                    {/* Application Date - Mobile */}
                    <div className="text-gray-600 flex items-center gap-2 text-sm">
                      <FaCalendarAlt className="text-xs text-[#CAEB66]" />
                      Applied on {new Date(rider.createdAt).toLocaleDateString()}
                    </div>

                    {/* Contact Info - Mobile */}
                    <div className="space-y-2">
                      <h4 className="font-semibold text-[#03373D] text-sm">Contact</h4>
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2 text-gray-600 text-sm">
                          <FaEnvelope className="text-[#CAEB66] text-xs flex-shrink-0" />
                          <span className="truncate">{rider.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600 text-sm">
                          <FaPhone className="text-[#CAEB66] text-xs flex-shrink-0" />
                          <span>{rider.phone}</span>
                        </div>
                        <div className="flex items-start gap-2 text-gray-600 text-sm">
                          <FaMapMarkerAlt className="text-[#CAEB66] text-xs flex-shrink-0 mt-0.5" />
                          <span className="line-clamp-2">{rider.address}</span>
                        </div>
                      </div>
                    </div>

                    {/* Vehicle Info - Mobile */}
                    <div className="space-y-2">
                      <h4 className="font-semibold text-[#03373D] text-sm">Vehicle</h4>
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2 text-gray-600 text-sm">
                          <VehicleIcon className="text-[#CAEB66] text-xs" />
                          <span className="capitalize">{rider.vehicleType}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600 text-sm">
                          <FaIdCard className="text-[#CAEB66] text-xs" />
                          <span>{rider.vehicleModel}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600 text-sm">
                          <FaIdCard className="text-[#CAEB66] text-xs" />
                          <span>Plate: {rider.licensePlate}</span>
                        </div>
                      </div>
                    </div>

                    {/* Personal Details - Mobile */}
                    <div className="space-y-2">
                      <h4 className="font-semibold text-[#03373D] text-sm">Details</h4>
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2 text-gray-600 text-sm">
                          <FaCalendarAlt className="text-[#CAEB66] text-xs" />
                          <span>DOB: {new Date(rider.dateOfBirth).toLocaleDateString()}</span>
                        </div>
                        {rider.preferredAreas && (
                          <div className="flex items-start gap-2 text-gray-600 text-sm">
                            <FaMapMarkerAlt className="text-[#CAEB66] text-xs mt-0.5" />
                            <span className="line-clamp-2">Preferred: {rider.preferredAreas}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Experience - Mobile */}
                    {rider.experience && (
                      <div className="space-y-2">
                        <h4 className="font-semibold text-[#03373D] text-sm">Experience</h4>
                        <p className="text-gray-600 text-xs bg-gray-50 p-2 rounded-lg line-clamp-3">
                          {rider.experience}
                        </p>
                      </div>
                    )}

                    {/* Action Buttons - Mobile */}
                    <div className="space-y-2 pt-3 border-t border-gray-200">
                      <button
                        onClick={() => handleStatusUpdate(rider._id, 'active')}
                        className="w-full flex items-center justify-center gap-2 bg-[#CAEB66] text-[#03373D] px-4 py-2.5 rounded-lg font-semibold hover:bg-opacity-90 transition-all duration-200 shadow-sm text-sm"
                      >
                        <FaCheck className="text-xs" />
                        Activate
                      </button>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => handleStatusUpdate(rider._id, 'pending')}
                          className="flex items-center justify-center gap-2 bg-[#03373D] text-white px-3 py-2 rounded-lg font-semibold hover:bg-opacity-90 transition-all duration-200 shadow-sm text-sm"
                        >
                          <FaClock className="text-xs" />
                          Keep Pending
                        </button>
                        
                        <button
                          onClick={() => handleReject(rider._id)}
                          className="flex items-center justify-center gap-2 bg-red-500 text-white px-3 py-2 rounded-lg font-semibold hover:bg-red-600 transition-all duration-200 shadow-sm text-sm"
                        >
                          <FaTimes className="text-xs" />
                          Reject
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Desktop Layout */}
                  <div className="hidden sm:block">
                    {/* Header - Desktop */}
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-[#CAEB66]/20 rounded-full flex items-center justify-center">
                          <FaUser className="text-2xl text-[#03373D]" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-[#03373D]">
                            {rider.fullName}
                          </h3>
                          <p className="text-gray-600 flex items-center gap-2">
                            <FaCalendarAlt className="text-sm" />
                            Applied on {new Date(rider.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      
                      {/* Status Badge - Desktop */}
                      <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-semibold">
                        Pending Review
                      </span>
                    </div>

                    {/* Personal Information - Desktop */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                      <div className="space-y-3">
                        <h4 className="font-semibold text-[#03373D] border-b border-gray-200 pb-2">
                          Contact Information
                        </h4>
                        <div className="space-y-2">
                          <div className="flex items-center gap-3 text-gray-600">
                            <FaEnvelope className="text-[#CAEB66]" />
                            <span className="text-sm">{rider.email}</span>
                          </div>
                          <div className="flex items-center gap-3 text-gray-600">
                            <FaPhone className="text-[#CAEB66]" />
                            <span className="text-sm">{rider.phone}</span>
                          </div>
                          <div className="flex items-start gap-3 text-gray-600">
                            <FaMapMarkerAlt className="text-[#CAEB66] mt-1" />
                            <span className="text-sm">{rider.address}</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <h4 className="font-semibold text-[#03373D] border-b border-gray-200 pb-2">
                          Personal Details
                        </h4>
                        <div className="space-y-2">
                          <div className="flex items-center gap-3 text-gray-600">
                            <FaCalendarAlt className="text-[#CAEB66]" />
                            <span className="text-sm">
                              DOB: {new Date(rider.dateOfBirth).toLocaleDateString()}
                            </span>
                          </div>
                          {rider.preferredAreas && (
                            <div className="flex items-start gap-3 text-gray-600">
                              <FaMapMarkerAlt className="text-[#CAEB66] mt-1" />
                              <span className="text-sm">
                                Preferred Areas: {rider.preferredAreas}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="space-y-3">
                        <h4 className="font-semibold text-[#03373D] border-b border-gray-200 pb-2">
                          Vehicle Information
                        </h4>
                        <div className="space-y-2">
                          <div className="flex items-center gap-3 text-gray-600">
                            <VehicleIcon className="text-[#CAEB66]" />
                            <span className="text-sm capitalize">{rider.vehicleType}</span>
                          </div>
                          <div className="flex items-center gap-3 text-gray-600">
                            <FaIdCard className="text-[#CAEB66]" />
                            <span className="text-sm">{rider.vehicleModel}</span>
                          </div>
                          <div className="flex items-center gap-3 text-gray-600">
                            <FaIdCard className="text-[#CAEB66]" />
                            <span className="text-sm">Plate: {rider.licensePlate}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Experience - Desktop */}
                    {rider.experience && (
                      <div className="mb-6">
                        <h4 className="font-semibold text-[#03373D] border-b border-gray-200 pb-2 mb-3">
                          Experience
                        </h4>
                        <p className="text-gray-600 text-sm bg-gray-50 p-3 rounded-lg">
                          {rider.experience}
                        </p>
                      </div>
                    )}

                    {/* Action Buttons - Desktop */}
                    <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200">
                      <button
                        onClick={() => handleStatusUpdate(rider._id, 'active')}
                        className="flex items-center gap-2 bg-[#CAEB66] text-[#03373D] px-4 py-2 rounded-lg font-semibold hover:bg-opacity-90 hover:transform hover:scale-105 transition-all duration-200 shadow-sm"
                      >
                        <FaCheck className="text-sm" />
                        Activate
                      </button>
                      
                      <button
                        onClick={() => handleStatusUpdate(rider._id, 'pending')}
                        className="flex items-center gap-2 bg-[#03373D] text-white px-4 py-2 rounded-lg font-semibold hover:bg-opacity-90 hover:transform hover:scale-105 transition-all duration-200 shadow-sm"
                      >
                        <FaClock className="text-sm" />
                        Keep Pending
                      </button>
                      
                      <button
                        onClick={() => handleReject(rider._id)}
                        className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-600 hover:transform hover:scale-105 transition-all duration-200 shadow-sm"
                      >
                        <FaTimes className="text-sm" />
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default PendingRiders;