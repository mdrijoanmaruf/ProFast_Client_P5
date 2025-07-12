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
  FaCheckCircle,
  FaClock,
  FaCalendarAlt,
  FaIdCard,
  FaUserCheck
} from 'react-icons/fa';
import useAxiosSecure from '../../../Hook/useAxiosSecure';
import Swal from 'sweetalert2';

const ActiveRiders = () => {
  const [activeRiders, setActiveRiders] = useState([]);
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
    fetchActiveRiders();
  }, []);

  const fetchActiveRiders = async () => {
    try {
      setLoading(true);
      const response = await axiosSecure.get('/riders?status=active');
      setActiveRiders(response.data);
    } catch (error) {
      console.error('Error fetching active riders:', error);
      Swal.fire({
        title: 'Error!',
        text: 'Failed to fetch active riders',
        icon: 'error',
        confirmButtonColor: '#03373D'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeactivate = async (riderId) => {
    try {
      const result = await Swal.fire({
        title: 'Deactivate Rider?',
        text: 'This will move the rider back to pending status.',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#03373D',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, Deactivate!'
      });

      if (result.isConfirmed) {
        await axiosSecure.patch(`/riders/${riderId}/status`, { status: 'pending' });
        
        Swal.fire({
          title: 'Success!',
          text: 'Rider has been moved to pending status',
          icon: 'success',
          confirmButtonColor: '#CAEB66'
        });

        // Remove from active list
        setActiveRiders(prev => prev.filter(rider => rider._id !== riderId));
      }
    } catch (error) {
      console.error('Error deactivating rider:', error);
      Swal.fire({
        title: 'Error!',
        text: 'Failed to deactivate rider',
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
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[#03373D]">Active Riders</h1>
            <p className="text-gray-600 mt-2">
              Currently active riders available for deliveries
            </p>
          </div>
          <div className="bg-green-100 px-4 py-2 rounded-lg">
            <span className="text-green-800 font-semibold">
              {activeRiders.length} Active Riders
            </span>
          </div>
        </div>
      </div>

      {/* Riders List */}
      {activeRiders.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center border border-gray-200">
          <FaUserCheck className="text-6xl text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            No Active Riders
          </h3>
          <p className="text-gray-500">
            No riders are currently active. Activate pending riders to see them here.
          </p>
        </div>
      ) : (
        <div className="grid gap-6">
          {activeRiders.map((rider) => {
            const VehicleIcon = vehicleIcons[rider.vehicleType] || FaMotorcycle;
            
            return (
              <div key={rider._id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                        <FaUser className="text-2xl text-green-600" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-[#03373D] flex items-center gap-2">
                          {rider.fullName}
                          <FaCheckCircle className="text-green-500 text-lg" />
                        </h3>
                        <p className="text-gray-600 flex items-center gap-2">
                          <FaCalendarAlt className="text-sm" />
                          Activated on {rider.updatedAt ? new Date(rider.updatedAt).toLocaleDateString() : 'N/A'}
                        </p>
                      </div>
                    </div>
                    
                    {/* Status Badge */}
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-2">
                      <FaCheckCircle className="text-xs" />
                      Active
                    </span>
                  </div>

                  {/* Personal Information */}
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

                  {/* Experience */}
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

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200">
                    <div className="flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-lg font-semibold">
                      <FaCheckCircle className="text-sm" />
                      Currently Active
                    </div>
                    
                    <button
                      onClick={() => handleDeactivate(rider._id)}
                      className="flex items-center gap-2 bg-[#03373D] text-white px-4 py-2 rounded-lg font-semibold hover:bg-opacity-90 hover:transform hover:scale-105 transition-all duration-200 shadow-sm"
                    >
                      <FaClock className="text-sm" />
                      Move to Pending
                    </button>
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

export default ActiveRiders;