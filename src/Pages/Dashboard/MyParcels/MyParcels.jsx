import React, { useState } from 'react'
import useAuth from '../../../Hook/useAuth'
import { useQuery } from '@tanstack/react-query'
import useAxiosSecure from '../../../Hook/useAxiosSecure'
import Swal from 'sweetalert2'

const MyParcels = () => {
  const { user } = useAuth()
  const axiosSecure = useAxiosSecure()
  const [selectedParcel, setSelectedParcel] = useState(null)

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

  const handlePayment = (parcel) => {
    Swal.fire({
      title: '💳 Payment',
      text: `Process payment of ৳${parcel.cost} for parcel "${parcel.title}"?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#27ae60',
      cancelButtonColor: '#e74c3c',
      confirmButtonText: 'Pay Now',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        // TODO: Implement payment logic
        Swal.fire('Success!', 'Payment processed successfully!', 'success')
      }
    })
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
    }).then((result) => {
      if (result.isConfirmed) {
        // TODO: Implement delete logic
        Swal.fire('Deleted!', 'Parcel has been deleted.', 'success')
      }
    })
  }

  if (parcels.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-24 h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <span className="text-4xl">📦</span>
        </div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">No Parcels Found</h3>
        <p className="text-gray-600 mb-6">You haven't sent any parcels yet.</p>
        <a
          href="/sendParcel"
          className="inline-flex items-center px-6 py-3 bg-[#03373D] text-white rounded-lg hover:bg-opacity-90 transition-colors"
        >
          <span className="mr-2">📮</span>
          Send Your First Parcel
        </a>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#03373D]">My Parcels</h1>
          <p className="text-gray-600">Manage and track all your parcels</p>
        </div>
        <div className="bg-[#CAEB66] px-4 py-2 rounded-lg">
          <span className="text-[#03373D] font-semibold">Total: {parcels.length} parcels</span>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#03373D] text-white">
              <tr>
                <th className="px-6 py-4 text-left font-semibold">Type</th>
                <th className="px-6 py-4 text-left font-semibold">Title</th>
                <th className="px-6 py-4 text-left font-semibold">Created At</th>
                <th className="px-6 py-4 text-left font-semibold">Cost</th>
                <th className="px-6 py-4 text-left font-semibold">Payment Status</th>
                <th className="px-6 py-4 text-center font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {parcels.map((parcel) => (
                <tr key={parcel._id} className="hover:bg-gray-50 transition-colors">
                  {/* Type */}
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl">
                        {parcel.type === 'document' ? '📄' : '📦'}
                      </span>
                      <span className="font-medium text-gray-800 capitalize">
                        {parcel.type}
                      </span>
                    </div>
                  </td>
                  
                  {/* Title */}
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-gray-800 truncate max-w-[200px]">
                        {parcel.title}
                      </p>
                      <p className="text-sm text-gray-500">
                        {parcel.trackingNumber}
                      </p>
                    </div>
                  </td>
                  
                  {/* Created At */}
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-800">
                      {formatDate(parcel.creation_date)}
                    </p>
                  </td>
                  
                  {/* Cost */}
                  <td className="px-6 py-4">
                    <p className="font-semibold text-[#03373D]">
                      ৳{parcel.cost}
                    </p>
                  </td>
                  
                  {/* Payment Status */}
                  <td className="px-6 py-4">
                    {getStatusBadge(parcel.status === 'pending' ? 'unpaid' : 'paid')}
                  </td>
                  
                  {/* Actions */}
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center space-x-2">
                      {/* View Details */}
                      <button
                        onClick={() => handleViewDetails(parcel)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                      
                      {/* Pay Button */}
                      {parcel.status === 'pending' && (
                        <button
                          onClick={() => handlePayment(parcel)}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Pay Now"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                          </svg>
                        </button>
                      )}
                      
                      {/* Delete Button */}
                      <button
                        onClick={() => handleDelete(parcel)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg p-6 shadow-md border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Parcels</p>
              <p className="text-2xl font-bold text-gray-800">{parcels.length}</p>
            </div>
            <span className="text-3xl">📦</span>
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-6 shadow-md border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Paid Parcels</p>
              <p className="text-2xl font-bold text-gray-800">
                {parcels.filter(p => p.status !== 'pending').length}
              </p>
            </div>
            <span className="text-3xl">✅</span>
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-6 shadow-md border-l-4 border-orange-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Cost</p>
              <p className="text-2xl font-bold text-gray-800">
                ৳{parcels.reduce((sum, p) => sum + p.cost, 0)}
              </p>
            </div>
            <span className="text-3xl">💰</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MyParcels