import React, { useState } from 'react'
import useAuth from '../../../Hook/useAuth'
import { useQuery } from '@tanstack/react-query'
import useAxiosSecure from '../../../Hook/useAxiosSecure'
import Swal from 'sweetalert2'
import { 
  FaEye, 
  FaCreditCard, 
  FaTrash, 
  FaFileAlt, 
  FaBox, 
  FaBoxes, 
  FaCheckCircle, 
  FaDollarSign,
  FaPaperPlane
} from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'

const MyParcels = () => {
  const { user } = useAuth()
  const axiosSecure = useAxiosSecure()
  const [selectedParcel, setSelectedParcel] = useState(null)
  const navigate = useNavigate()

  const { data: parcels = [], refetch } = useQuery({
    queryKey: ['my-parcels', user.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/parcels?email=${user.email}`)
      return res.data
    }
  })

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-BD', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusBadge = (status) => {
    const statusConfig = {
      'paid': { bg: 'bg-green-100', text: 'text-green-800', label: 'Paid' },
      'unpaid': { bg: 'bg-red-100', text: 'text-red-800', label: 'Unpaid' },
      'pending': { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pending' },
      'processing': { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Processing' },
      'delivered': { bg: 'bg-purple-100', text: 'text-purple-800', label: 'Delivered' }
    }
    
    const config = statusConfig[status] || statusConfig['pending']
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    )
  }

  const handleViewDetails = (parcel) => {
    Swal.fire({
      title: '📦 Parcel Details',
      html: `
        <div style="text-align: left; max-width: 500px; margin: 0 auto;">
          <!-- Parcel Info -->
          <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
            <h4 style="margin: 0 0 10px 0; color: #2c3e50;">📋 Parcel Information</h4>
            <p style="margin: 5px 0;"><strong>Title:</strong> ${parcel.title}</p>
            <p style="margin: 5px 0;"><strong>Type:</strong> ${parcel.type === 'document' ? '📄 Document' : '📦 Non-Document'}</p>
            <p style="margin: 5px 0;"><strong>Tracking:</strong> ${parcel.trackingNumber}</p>
            ${parcel.weight ? `<p style="margin: 5px 0;"><strong>Weight:</strong> ${parcel.weight} kg</p>` : ''}
            <p style="margin: 5px 0;"><strong>Cost:</strong> ৳${parcel.cost}</p>
            <p style="margin: 5px 0;"><strong>Status:</strong> ${parcel.status}</p>
          </div>
          
          <!-- Pickup Info -->
          <div style="background: #fff3cd; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
            <h4 style="margin: 0 0 10px 0; color: #856404;">📍 Pickup Information</h4>
            <p style="margin: 5px 0;"><strong>Name:</strong> ${parcel.senderName}</p>
            <p style="margin: 5px 0;"><strong>Contact:</strong> ${parcel.senderContact}</p>
            <p style="margin: 5px 0;"><strong>Location:</strong> ${parcel.senderRegion} - ${parcel.senderServiceCenter}</p>
            <p style="margin: 5px 0;"><strong>Address:</strong> ${parcel.senderAddress}</p>
            ${parcel.pickupInstruction ? `<p style="margin: 5px 0;"><strong>Instructions:</strong> ${parcel.pickupInstruction}</p>` : ''}
          </div>
          
          <!-- Delivery Info -->
          <div style="background: #d1ecf1; padding: 15px; border-radius: 8px;">
            <h4 style="margin: 0 0 10px 0; color: #0c5460;">🎯 Delivery Information</h4>
            <p style="margin: 5px 0;"><strong>Name:</strong> ${parcel.receiverName}</p>
            <p style="margin: 5px 0;"><strong>Contact:</strong> ${parcel.receiverContact}</p>
            <p style="margin: 5px 0;"><strong>Location:</strong> ${parcel.receiverRegion} - ${parcel.receiverServiceCenter}</p>
            <p style="margin: 5px 0;"><strong>Address:</strong> ${parcel.receiverAddress}</p>
            ${parcel.deliveryInstruction ? `<p style="margin: 5px 0;"><strong>Instructions:</strong> ${parcel.deliveryInstruction}</p>` : ''}
          </div>
        </div>
      `,
      width: '700px',
      confirmButtonColor: '#03373D',
      confirmButtonText: 'Close'
    })
  }

  const handlePayment = (id) => {
    navigate(`/dashboard/payment/${id}`);
    console.log(id);
  }

  const handleDelete = (parcel) => {
    Swal.fire({
      title: '🗑️ Delete Parcel',
      text: `Are you sure you want to delete "${parcel.title}"? This action cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e74c3c',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Yes, Delete',
      cancelButtonText: 'Cancel'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          // Delete parcel from database
          const response = await axiosSecure.delete(`/parcels/${parcel._id}`)
          
          if (response.data.success) {
            // Refresh the parcels list
            refetch()
            
            Swal.fire({
              icon: 'success',
              title: 'Deleted!',
              text: 'Parcel has been deleted successfully.',
              confirmButtonColor: '#03373D'
            })
          } else {
            throw new Error('Failed to delete parcel')
          }
        } catch (error) {
          console.error('Delete error:', error)
          Swal.fire({
            icon: 'error',
            title: 'Delete Failed',
            text: 'There was an error deleting the parcel. Please try again.',
            confirmButtonColor: '#e74c3c'
          })
        }
      }
    })
  }

  if (parcels.length === 0) {
    return (
      <div className="text-center py-8 md:py-12 px-4">
        <div className="w-20 h-20 md:w-24 md:h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <FaBoxes className="text-3xl md:text-4xl text-gray-400" />
        </div>
        <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-2">No Parcels Found</h3>
        <p className="text-sm md:text-base text-gray-600 mb-6">You haven't sent any parcels yet.</p>
        <a
          href="/sendParcel"
          className="inline-flex items-center px-4 md:px-6 py-2 md:py-3 bg-[#03373D] text-white rounded-lg hover:bg-opacity-90 transition-colors text-sm md:text-base"
        >
          <FaPaperPlane className="mr-2" />
          Send Your First Parcel
        </a>
      </div>
    )
  }

  return (
    <div className="space-y-4 md:space-y-6 px-2 md:px-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-[#03373D]">My Parcels</h1>
          <p className="text-sm md:text-base text-gray-600">Manage and track all your parcels</p>
        </div>
        <div className="bg-[#CAEB66] px-3 md:px-4 py-2 rounded-lg self-start sm:self-auto">
          <span className="text-[#03373D] font-semibold text-sm md:text-base">
            Total: {parcels.length} parcels
          </span>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="block lg:hidden space-y-4">
        {parcels.map((parcel) => (
          <div key={parcel._id} className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
            <div className="p-4">
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  {parcel.type === 'document' ? (
                    <FaFileAlt className="text-2xl text-blue-600" />
                  ) : (
                    <FaBox className="text-2xl text-orange-600" />
                  )}
                  <div>
                    <h3 className="font-medium text-gray-800 truncate max-w-[200px]">
                      {parcel.title}
                    </h3>
                    <p className="text-xs text-gray-500">{parcel.trackingNumber}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-[#03373D] text-lg">৳{parcel.cost}</p>
                  {getStatusBadge(parcel.status === 'pending' ? 'unpaid' : 'paid')}
                </div>
              </div>

              {/* Info */}
              <div className="text-xs text-gray-600 mb-4">
                <p className="mb-1">
                  <span className="font-medium">Created:</span> {formatDate(parcel.creation_date)}
                </p>
                <p className="mb-1">
                  <span className="font-medium">Type:</span> {parcel.type === 'document' ? 'Document' : 'Non-Document'}
                </p>
                <p className="mb-1">
                  <span className="font-medium">From:</span> {parcel.senderRegion} → {parcel.receiverRegion}
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-gray-100">
                {/* View Details */}
                <button
                  onClick={() => handleViewDetails(parcel)}
                  className="flex items-center space-x-1 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-sm"
                >
                  <FaEye className="w-4 h-4" />
                  <span>View</span>
                </button>
                
                {/* Pay Button */}
                {parcel.status === 'pending' && (
                  <button
                    onClick={() => handlePayment(parcel._id)}
                    className="flex items-center space-x-1 px-3 py-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors text-sm"
                  >
                    <FaCreditCard className="w-4 h-4" />
                    <span>Pay</span>
                  </button>
                )}
                
                {/* Delete Button */}
                <button
                  onClick={() => handleDelete(parcel)}
                  className="flex items-center space-x-1 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm"
                >
                  <FaTrash className="w-4 h-4" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#03373D] text-white">
              <tr>
                <th className="px-4 xl:px-6 py-4 text-left font-semibold text-sm">Type</th>
                <th className="px-4 xl:px-6 py-4 text-left font-semibold text-sm">Title</th>
                <th className="px-4 xl:px-6 py-4 text-left font-semibold text-sm">Created At</th>
                <th className="px-4 xl:px-6 py-4 text-left font-semibold text-sm">Cost</th>
                <th className="px-4 xl:px-6 py-4 text-left font-semibold text-sm">Payment Status</th>
                <th className="px-4 xl:px-6 py-4 text-center font-semibold text-sm">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {parcels.map((parcel) => (
                <tr key={parcel._id} className="hover:bg-gray-50 transition-colors">
                  {/* Type */}
                  <td className="px-4 xl:px-6 py-4">
                    <div className="flex items-center space-x-2">
                      {parcel.type === 'document' ? (
                        <FaFileAlt className="text-xl xl:text-2xl text-blue-600" />
                      ) : (
                        <FaBox className="text-xl xl:text-2xl text-orange-600" />
                      )}
                      <span className="font-medium text-gray-800 capitalize text-sm">
                        {parcel.type}
                      </span>
                    </div>
                  </td>
                  
                  {/* Title */}
                  <td className="px-4 xl:px-6 py-4">
                    <div>
                      <p className="font-medium text-gray-800 truncate max-w-[150px] xl:max-w-[200px] text-sm">
                        {parcel.title}
                      </p>
                      <p className="text-xs text-gray-500">
                        {parcel.trackingNumber}
                      </p>
                    </div>
                  </td>
                  
                  {/* Created At */}
                  <td className="px-4 xl:px-6 py-4">
                    <p className="text-xs xl:text-sm text-gray-800">
                      {formatDate(parcel.creation_date)}
                    </p>
                  </td>
                  
                  {/* Cost */}
                  <td className="px-4 xl:px-6 py-4">
                    <p className="font-semibold text-[#03373D] text-sm xl:text-base">
                      ৳{parcel.cost}
                    </p>
                  </td>
                  
                  {/* Payment Status */}
                  <td className="px-4 xl:px-6 py-4">
                    {getStatusBadge(parcel.status === 'pending' ? 'unpaid' : 'paid')}
                  </td>
                  
                  {/* Actions */}
                  <td className="px-4 xl:px-6 py-4">
                    <div className="flex items-center justify-center space-x-1 xl:space-x-2">
                      {/* View Details */}
                      <button
                        onClick={() => handleViewDetails(parcel)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <FaEye className="w-4 h-4" />
                      </button>
                      
                      {/* Pay Button */}
                      {parcel.status === 'pending' && (
                        <button
                          onClick={() => handlePayment(parcel)}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Pay Now"
                        >
                          <FaCreditCard className="w-4 h-4" />
                        </button>
                      )}
                      
                      {/* Delete Button */}
                      <button
                        onClick={() => handleDelete(parcel)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <FaTrash className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        <div className="bg-white rounded-lg p-4 md:p-6 shadow-md border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs md:text-sm text-gray-600">Total Parcels</p>
              <p className="text-xl md:text-2xl font-bold text-gray-800">{parcels.length}</p>
            </div>
            <FaBoxes className="text-2xl md:text-3xl text-blue-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-4 md:p-6 shadow-md border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs md:text-sm text-gray-600">Paid Parcels</p>
              <p className="text-xl md:text-2xl font-bold text-gray-800">
                {parcels.filter(p => p.status !== 'pending').length}
              </p>
            </div>
            <FaCheckCircle className="text-2xl md:text-3xl text-green-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-4 md:p-6 shadow-md border-l-4 border-orange-500 sm:col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs md:text-sm text-gray-600">Total Cost</p>
              <p className="text-xl md:text-2xl font-bold text-gray-800">
                ৳{parcels.reduce((sum, p) => sum + p.cost, 0)}
              </p>
            </div>
            <FaDollarSign className="text-2xl md:text-3xl text-orange-500" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default MyParcels