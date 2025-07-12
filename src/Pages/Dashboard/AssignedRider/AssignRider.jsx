import React, { useState, useEffect } from 'react'
import { FaBox, FaUser, FaMapMarkerAlt, FaCalendar, FaSearch, FaFilter, FaMotorcycle, FaUserCheck, FaEye } from 'react-icons/fa'
import useAxiosSecure from '../../../Hook/useAxiosSecure'
import { Link } from 'react-router-dom'
import Swal from 'sweetalert2'

const AssignRider = () => {
  const [parcels, setParcels] = useState([])
  const [riders, setRiders] = useState([])
  const [assignedParcelsCount, setAssignedParcelsCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [ridersLoading, setRidersLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredParcels, setFilteredParcels] = useState([])
  const axiosSecure = useAxiosSecure()

  // Fetch paid parcels
  useEffect(() => {
    fetchPaidParcels()
    fetchActiveRiders()
    fetchAssignedParcelsCount()
  }, [])

  // Filter parcels based on search term
  useEffect(() => {
    const filtered = parcels.filter(parcel =>
      parcel.trackingNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      parcel.senderName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      parcel.receiverName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      parcel.senderRegion?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      parcel.receiverRegion?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredParcels(filtered)
  }, [parcels, searchTerm])

  const fetchAssignedParcelsCount = async () => {
    try {
      const response = await axiosSecure.get('/parcels')
      const assignedCount = response.data.filter(parcel => 
        parcel.assignedRider && 
        parcel.assignedRider !== null && 
        parcel.assignedRider !== undefined
      ).length
      setAssignedParcelsCount(assignedCount)
    } catch (error) {
      console.error('Error fetching assigned parcels count:', error)
    }
  }

  const fetchActiveRiders = async () => {
    try {
      setRidersLoading(true)
      const response = await axiosSecure.get('/riders?status=active')
      console.log('Active riders response:', response.data);
      setRiders(response.data)
    } catch (error) {
      console.error('Error fetching active riders:', error)
      Swal.fire({
        title: 'Warning!',
        text: 'Failed to fetch active riders. Please refresh the page.',
        icon: 'warning',
        confirmButtonColor: '#03373D'
      })
    } finally {
      setRidersLoading(false)
    }
  }

  const fetchPaidParcels = async () => {
    try {
      setLoading(true)
      const response = await axiosSecure.get('/parcels')
      
      // Filter parcels with both paymentStatus "paid" and status "paid" but NO assigned rider
      const unassignedPaidParcels = response.data.filter(parcel => 
        parcel.paymentStatus === 'paid' && 
        parcel.status === 'paid' && 
        (!parcel.assignedRider || parcel.assignedRider === null || parcel.assignedRider === undefined)
      )
      
      setParcels(unassignedPaidParcels)
    } catch (error) {
      console.error('Error fetching unassigned paid parcels:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString()
  }

  const handleAssignRider = async (parcel) => {
    console.log('Starting assignment process for parcel:', parcel.trackingNumber);
    console.log('Available riders:', riders);

    if (riders.length === 0) {
      Swal.fire({
        title: 'No Active Riders',
        text: 'There are no active riders available for assignment. Please ensure riders are registered and active.',
        icon: 'warning',
        confirmButtonColor: '#03373D'
      })
      return
    }

    // Create rider options for the select dropdown
    const riderOptions = riders.reduce((acc, rider) => {
      const riderName = rider.name || rider.fullName || 'Unknown Name';
      const vehicleType = rider.vehicleType || 'Unknown Vehicle';
      const email = rider.email || 'No Email';
      acc[rider._id] = `${riderName} - ${vehicleType} (${email})`;
      return acc;
    }, {})

    console.log('Rider options:', riderOptions);

    const { value: selectedRiderId } = await Swal.fire({
      title: 'Assign Rider',
      html: `
        <div style="text-align: left; margin-bottom: 20px;">
          <h4 style="margin-bottom: 10px; color: #03373D;">Parcel Details:</h4>
          <p style="margin: 5px 0;"><strong>Tracking:</strong> ${parcel.trackingNumber}</p>
          <p style="margin: 5px 0;"><strong>From:</strong> ${parcel.senderRegion} → <strong>To:</strong> ${parcel.receiverRegion}</p>
          <p style="margin: 5px 0;"><strong>Cost:</strong> $${parcel.cost}</p>
          <p style="margin: 5px 0;"><strong>Available Riders:</strong> ${riders.length}</p>
        </div>
      `,
      input: 'select',
      inputOptions: riderOptions,
      inputPlaceholder: 'Select a rider',
      showCancelButton: true,
      confirmButtonText: 'Assign Rider',
      confirmButtonColor: '#03373D',
      cancelButtonColor: '#6c757d',
      inputValidator: (value) => {
        if (!value) {
          return 'Please select a rider'
        }
      }
    })

    if (selectedRiderId) {
      try {
        console.log('Selected rider ID:', selectedRiderId);
        
        // Find the selected rider details
        const selectedRider = riders.find(rider => rider._id === selectedRiderId)
        console.log('Selected rider details:', selectedRider);
        
        if (!selectedRider) {
          throw new Error('Selected rider not found');
        }

        const riderName = selectedRider.name || selectedRider.fullName || 'Unknown Name';
        
        const assignmentData = {
          riderId: selectedRiderId,
          riderName: riderName,
          riderEmail: selectedRider.email,
          riderPhone: selectedRider.phone,
          vehicleType: selectedRider.vehicleType,
          assignedAt: new Date().toISOString(),
          status: 'assigned'
        };

        console.log('Assignment data:', assignmentData);
        
        // Update parcel with assigned rider
        const response = await axiosSecure.patch(`/parcels/${parcel._id}/assign-rider`, assignmentData)

        console.log('Assignment response:', response.data);

        if (response.data.success) {
          Swal.fire({
            title: 'Success!',
            text: `Parcel ${parcel.trackingNumber} has been assigned to ${riderName}`,
            icon: 'success',
            confirmButtonColor: '#03373D'
          })
          
          // Refresh the parcels list
          fetchPaidParcels()
          fetchAssignedParcelsCount()
        } else {
          throw new Error(response.data.message || 'Failed to assign rider')
        }
      } catch (error) {
        console.error('Error assigning rider:', error)
        console.error('Error details:', error.response?.data);
        
        const errorMessage = error.response?.data?.message || error.message || 'Failed to assign rider to parcel';
        Swal.fire({
          title: 'Error!',
          text: errorMessage,
          icon: 'error',
          confirmButtonColor: '#03373D'
        })
      }
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
        <h1 className="text-3xl font-bold text-[#03373D] mb-2">Assign Riders</h1>
        <p className="text-gray-600">Manage rider assignments for unassigned paid parcels ready for delivery</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
        <div className="bg-gradient-to-r from-[#03373D] to-[#03373D]/90 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/80 text-sm">Unassigned Parcels</p>
              <p className="text-2xl font-bold">{parcels.length}</p>
            </div>
            <FaBox className="text-3xl text-[#CAEB66]" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-[#CAEB66] to-[#CAEB66]/90 rounded-xl p-6 text-[#03373D]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#03373D]/80 text-sm">Ready for Assignment</p>
              <p className="text-2xl font-bold">{filteredParcels.length}</p>
            </div>
            <FaUser className="text-3xl text-[#03373D]" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-blue-600 to-blue-500 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/80 text-sm">Active Riders</p>
              <p className="text-2xl font-bold">{ridersLoading ? '...' : riders.length}</p>
            </div>
            <FaMotorcycle className="text-3xl text-white/80" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-green-600 to-green-500 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/80 text-sm">Available for Assignment</p>
              <p className="text-2xl font-bold">{ridersLoading ? '...' : riders.length}</p>
            </div>
            <FaUserCheck className="text-3xl text-white/80" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-purple-600 to-purple-500 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/80 text-sm">Assigned Parcels</p>
              <p className="text-2xl font-bold">{assignedParcelsCount}</p>
              <Link 
                to="/dashboard/assigned-parcels"
                className="text-xs text-white/90 hover:text-white underline mt-1 inline-flex items-center"
              >
                <FaEye className="mr-1" />
                View All
              </Link>
            </div>
            <FaBox className="text-3xl text-white/80" />
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
                placeholder="Search by tracking number, sender, receiver, or region..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#CAEB66] focus:border-transparent"
              />
            </div>
          </div>
          <button
            onClick={() => {
              fetchPaidParcels()
              fetchActiveRiders()
              fetchAssignedParcelsCount()
            }}
            className="px-6 py-3 bg-[#03373D] text-white rounded-lg hover:bg-[#03373D]/90 transition-colors flex items-center space-x-2"
          >
            <FaFilter />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Parcels List */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {filteredParcels.length === 0 ? (
          <div className="p-12 text-center">
            <FaBox className="mx-auto text-6xl text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No Unassigned Paid Parcels Found</h3>
            <p className="text-gray-500">
              {searchTerm ? 'No unassigned parcels match your search criteria.' : 'All paid parcels have been assigned to riders.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tracking Info
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sender Details
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Receiver Details
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment Info
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Delivery Priority
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
                          Weight: {parcel.weight} kg
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {parcel.senderName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {parcel.senderEmail}
                        </div>
                        <div className="text-xs text-gray-400 flex items-center">
                          <FaMapMarkerAlt className="mr-1" />
                          {parcel.senderRegion}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {parcel.receiverName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {parcel.receiverEmail}
                        </div>
                        <div className="text-xs text-gray-400 flex items-center">
                          <FaMapMarkerAlt className="mr-1" />
                          {parcel.receiverRegion}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-green-600">
                          ${parcel.cost}
                        </div>
                        <div className="text-xs text-gray-500 flex items-center">
                          <FaCalendar className="mr-1" />
                          {formatDate(parcel.paymentDate)}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        parcel.deliveryStatus === 'urgent' ? 'bg-red-100 text-red-800' :
                        parcel.deliveryStatus === 'express' ? 'bg-orange-100 text-orange-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {parcel.deliveryStatus === 'standard' ? '🚚 Standard' :
                         parcel.deliveryStatus === 'express' ? '⚡ Express' :
                         parcel.deliveryStatus === 'urgent' ? '🚀 Urgent' :
                         parcel.deliveryStatus || 'Standard'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col space-y-1">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                          {parcel.status}
                        </span>
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                          {parcel.paymentStatus}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        className="bg-[#CAEB66] text-[#03373D] px-4 py-2 rounded-lg hover:bg-[#CAEB66]/90 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={() => handleAssignRider(parcel)}
                        disabled={ridersLoading || riders.length === 0}
                      >
                        {ridersLoading ? 'Loading...' : riders.length === 0 ? 'No Riders' : 'Assign Rider'}
                      </button>
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

export default AssignRider