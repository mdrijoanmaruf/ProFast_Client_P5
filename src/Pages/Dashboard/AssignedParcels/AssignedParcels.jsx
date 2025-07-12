import React, { useState, useEffect } from 'react'
import { FaBox, FaUser, FaMapMarkerAlt, FaCalendar, FaSearch, FaFilter, FaMotorcycle, FaCheckCircle, FaPhone, FaEnvelope } from 'react-icons/fa'
import useAxiosSecure from '../../../Hook/useAxiosSecure'

const AssignedParcels = () => {
  const [assignedParcels, setAssignedParcels] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredParcels, setFilteredParcels] = useState([])
  const axiosSecure = useAxiosSecure()

  // Fetch assigned parcels
  useEffect(() => {
    fetchAssignedParcels()
  }, [])

  // Filter parcels based on search term
  useEffect(() => {
    const filtered = assignedParcels.filter(parcel =>
      parcel.trackingNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      parcel.senderName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      parcel.receiverName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      parcel.assignedRider?.riderName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      parcel.assignedRider?.riderEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      parcel.senderRegion?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      parcel.receiverRegion?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredParcels(filtered)
  }, [assignedParcels, searchTerm])

  const fetchAssignedParcels = async () => {
    try {
      setLoading(true)
      const response = await axiosSecure.get('/parcels')
      
      // Filter parcels that have assigned riders
      const parcelsWithRiders = response.data.filter(parcel => 
        parcel.assignedRider && 
        parcel.assignedRider !== null && 
        parcel.assignedRider !== undefined
      )
      
      setAssignedParcels(parcelsWithRiders)
    } catch (error) {
      console.error('Error fetching assigned parcels:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString()
  }

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered':
        return 'bg-green-100 text-green-800'
      case 'in-transit':
      case 'in_transit':
        return 'bg-blue-100 text-blue-800'
      case 'assigned':
        return 'bg-yellow-100 text-yellow-800'
      case 'picked-up':
      case 'picked_up':
        return 'bg-purple-100 text-purple-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#03373D]"></div>
      </div>
    )
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#03373D] mb-2">Assigned Parcels</h1>
        <p className="text-gray-600">View all parcels that have been assigned to riders</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-r from-[#03373D] to-[#03373D]/90 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/80 text-sm">Total Assigned</p>
              <p className="text-2xl font-bold">{assignedParcels.length}</p>
            </div>
            <FaCheckCircle className="text-3xl text-[#CAEB66]" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-[#CAEB66] to-[#CAEB66]/90 rounded-xl p-6 text-[#03373D]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#03373D]/80 text-sm">Currently Filtered</p>
              <p className="text-2xl font-bold">{filteredParcels.length}</p>
            </div>
            <FaBox className="text-3xl text-[#03373D]" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-blue-600 to-blue-500 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/80 text-sm">Active Riders</p>
              <p className="text-2xl font-bold">
                {new Set(assignedParcels.map(p => p.assignedRider?.riderId)).size}
              </p>
            </div>
            <FaMotorcycle className="text-3xl text-white/80" />
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by tracking number, sender, receiver, rider name, or region..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#CAEB66] focus:border-transparent"
              />
            </div>
          </div>
          <button
            onClick={fetchAssignedParcels}
            className="px-6 py-3 bg-[#03373D] text-white rounded-lg hover:bg-[#03373D]/90 transition-colors flex items-center space-x-2"
          >
            <FaFilter />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Assigned Parcels List */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {filteredParcels.length === 0 ? (
          <div className="p-12 text-center">
            <FaBox className="mx-auto text-6xl text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No Assigned Parcels Found</h3>
            <p className="text-gray-500">
              {searchTerm ? 'No assigned parcels match your search criteria.' : 'No parcels have been assigned to riders yet.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Parcel Info
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Route
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Assigned Rider
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Assignment Info
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredParcels.map((parcel) => (
                  <tr key={parcel._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {parcel.trackingNumber}
                        </div>
                        <div className="text-sm text-gray-500">
                          {parcel.title}
                        </div>
                        <div className="text-xs text-gray-400">
                          Cost: ${parcel.cost} | Weight: {parcel.weight || 'N/A'} kg
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm">
                        <div className="flex items-center text-gray-900 mb-1">
                          <FaMapMarkerAlt className="mr-1 text-blue-500" />
                          <span className="font-medium">{parcel.senderRegion}</span>
                        </div>
                        <div className="flex items-center text-gray-900">
                          <FaMapMarkerAlt className="mr-1 text-green-500" />
                          <span className="font-medium">{parcel.receiverRegion}</span>
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                          {parcel.senderName} → {parcel.receiverName}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="bg-[#03373D] w-10 h-10 rounded-full flex items-center justify-center mr-3">
                          <FaMotorcycle className="text-[#CAEB66]" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {parcel.assignedRider?.riderName || 'Unknown Rider'}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center">
                            <FaEnvelope className="mr-1" />
                            {parcel.assignedRider?.riderEmail || 'N/A'}
                          </div>
                          <div className="text-xs text-gray-400 flex items-center">
                            <FaPhone className="mr-1" />
                            {parcel.assignedRider?.riderPhone || 'N/A'}
                          </div>
                          <div className="text-xs text-blue-600 font-medium">
                            {parcel.assignedRider?.vehicleType || 'N/A'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm text-gray-900">
                          <FaCalendar className="inline mr-1" />
                          {formatDate(parcel.assignedAt || parcel.assignedRider?.assignedAt)}
                        </div>
                        <div className="text-xs text-gray-500">
                          Assigned on
                        </div>
                        {parcel.deliveryStatus && (
                          <div className="mt-1">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              parcel.deliveryStatus === 'urgent' ? 'bg-red-100 text-red-800' :
                              parcel.deliveryStatus === 'express' ? 'bg-orange-100 text-orange-800' :
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {parcel.deliveryStatus === 'standard' ? '🚚 Standard' :
                               parcel.deliveryStatus === 'express' ? '⚡ Express' :
                               parcel.deliveryStatus === 'urgent' ? '🚀 Urgent' :
                               parcel.deliveryStatus}
                            </span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col space-y-1">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(parcel.status)}`}>
                          {parcel.status || 'assigned'}
                        </span>
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                          {parcel.paymentStatus || 'paid'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex flex-col space-y-2">
                        <button
                          className="bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 transition-colors text-xs"
                          onClick={() => {
                            // TODO: Implement track parcel functionality
                            console.log('Track parcel:', parcel.trackingNumber)
                          }}
                        >
                          Track
                        </button>
                        <button
                          className="bg-gray-600 text-white px-3 py-1 rounded-md hover:bg-gray-700 transition-colors text-xs"
                          onClick={() => {
                            // TODO: Implement view details functionality
                            console.log('View details:', parcel._id)
                          }}
                        >
                          Details
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default AssignedParcels
