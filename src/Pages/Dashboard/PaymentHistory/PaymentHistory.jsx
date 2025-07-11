import React from 'react';
import { useQuery } from '@tanstack/react-query';
import useAuth from '../../../Hook/useAuth';
import useAxiosSecure from '../../../Hook/useAxiosSecure';
import { FaCreditCard, FaEye, FaCalendarAlt, FaReceipt } from 'react-icons/fa';
import Swal from 'sweetalert2';

const PaymentHistory = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const { data: payments = [], isLoading, error } = useQuery({
    queryKey: ['payment-history', user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/payments?email=${user.email}`);
      return res.data;
    },
    enabled: !!user?.email
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-BD', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount) => {
    return `৳${parseFloat(amount).toFixed(2)}`;
  };

  const handleViewDetails = (payment) => {
    Swal.fire({
      title: '💳 Payment Details',
      html: `
        <div style="text-align: left; max-width: 500px; margin: 0 auto;">
          <!-- Payment Info -->
          <div style="background: #e8f5e8; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
            <h4 style="margin: 0 0 10px 0; color: #2e7d32;">💰 Payment Information</h4>
            <p style="margin: 5px 0;"><strong>Amount:</strong> ${formatCurrency(payment.paymentAmount)}</p>
            <p style="margin: 5px 0;"><strong>Payment ID:</strong> ${payment.paymentIntentId}</p>
            <p style="margin: 5px 0;"><strong>Status:</strong> <span style="color: #2e7d32; font-weight: bold;">${payment.paymentStatus}</span></p>
            <p style="margin: 5px 0;"><strong>Date:</strong> ${formatDate(payment.paymentDate)}</p>
          </div>
          
          <!-- Parcel Info -->
          <div style="background: #f3e5f5; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
            <h4 style="margin: 0 0 10px 0; color: #7b1fa2;">📦 Parcel Information</h4>
            <p style="margin: 5px 0;"><strong>Title:</strong> ${payment.parcelTitle}</p>
            <p style="margin: 5px 0;"><strong>Tracking:</strong> ${payment.parcelTrackingNumber}</p>
            <p style="margin: 5px 0;"><strong>From:</strong> ${payment.senderName}</p>
            <p style="margin: 5px 0;"><strong>To:</strong> ${payment.receiverName}</p>
          </div>
          
          <!-- Route Info -->
          <div style="background: #e3f2fd; padding: 15px; border-radius: 8px;">
            <h4 style="margin: 0 0 10px 0; color: #1976d2;">🚚 Route Information</h4>
            <p style="margin: 5px 0;"><strong>From:</strong> ${payment.senderRegion}</p>
            <p style="margin: 5px 0;"><strong>To:</strong> ${payment.receiverRegion}</p>
          </div>
        </div>
      `,
      width: '700px',
      confirmButtonColor: '#03373D',
      confirmButtonText: 'Close'
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[#03373D] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading payment history...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
        <h3 className="text-red-800 font-semibold mb-2">Error Loading Payment History</h3>
        <p className="text-red-600 text-sm">Failed to load payment history. Please try again.</p>
      </div>
    );
  }

  if (payments.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-8 text-center">
        <FaReceipt className="text-4xl text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-800 mb-2">No Payment History</h3>
        <p className="text-gray-600">You haven't made any payments yet. Your payment history will appear here once you make your first payment.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6 px-2 md:px-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-[#03373D]">Payment History</h1>
          <p className="text-sm md:text-base text-gray-600">View all your payment transactions</p>
        </div>
        <div className="bg-[#CAEB66] px-3 md:px-4 py-2 rounded-lg self-start sm:self-auto">
          <span className="text-[#03373D] font-semibold text-sm md:text-base">
            Total Payments: {payments.length}
          </span>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="block lg:hidden space-y-4">
        {payments.map((payment) => (
          <div key={payment._id} className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
            <div className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <FaCreditCard className="text-2xl text-green-600" />
                  <div>
                    <h3 className="font-medium text-gray-800 truncate max-w-[200px]">
                      {payment.parcelTitle}
                    </h3>
                    <p className="text-xs text-gray-500">{payment.parcelTrackingNumber}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-[#03373D] text-lg">{formatCurrency(payment.paymentAmount)}</p>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {payment.paymentStatus}
                  </span>
                </div>
              </div>

              <div className="text-xs text-gray-600 mb-4">
                <p className="mb-1">
                  <span className="font-medium">Date:</span> {formatDate(payment.paymentDate)}
                </p>
                <p className="mb-1">
                  <span className="font-medium">From:</span> {payment.senderRegion} → {payment.receiverRegion}
                </p>
                <p className="mb-1">
                  <span className="font-medium">Payment ID:</span> {payment.paymentIntentId.substring(0, 20)}...
                </p>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-gray-100">
                <button
                  onClick={() => handleViewDetails(payment)}
                  className="flex items-center space-x-1 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-sm"
                >
                  <FaEye className="w-4 h-4" />
                  <span>View Details</span>
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
                <th className="px-4 xl:px-6 py-4 text-left font-semibold text-sm">Parcel</th>
                <th className="px-4 xl:px-6 py-4 text-left font-semibold text-sm">Amount</th>
                <th className="px-4 xl:px-6 py-4 text-left font-semibold text-sm">Date</th>
                <th className="px-4 xl:px-6 py-4 text-left font-semibold text-sm">Status</th>
                <th className="px-4 xl:px-6 py-4 text-left font-semibold text-sm">Route</th>
                <th className="px-4 xl:px-6 py-4 text-center font-semibold text-sm">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {payments.map((payment) => (
                <tr key={payment._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 xl:px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <FaCreditCard className="text-xl text-green-600" />
                      <div>
                        <p className="font-medium text-gray-800 truncate max-w-[150px] xl:max-w-[200px] text-sm">
                          {payment.parcelTitle}
                        </p>
                        <p className="text-xs text-gray-500">
                          {payment.parcelTrackingNumber}
                        </p>
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-4 xl:px-6 py-4">
                    <p className="font-semibold text-[#03373D] text-sm xl:text-base">
                      {formatCurrency(payment.paymentAmount)}
                    </p>
                  </td>
                  
                  <td className="px-4 xl:px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <FaCalendarAlt className="text-gray-400 text-xs" />
                      <p className="text-xs xl:text-sm text-gray-800">
                        {formatDate(payment.paymentDate)}
                      </p>
                    </div>
                  </td>
                  
                  <td className="px-4 xl:px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {payment.paymentStatus}
                    </span>
                  </td>
                  
                  <td className="px-4 xl:px-6 py-4">
                    <p className="text-xs xl:text-sm text-gray-800">
                      {payment.senderRegion} → {payment.receiverRegion}
                    </p>
                  </td>
                  
                  <td className="px-4 xl:px-6 py-4">
                    <div className="flex items-center justify-center">
                      <button
                        onClick={() => handleViewDetails(payment)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <FaEye className="w-4 h-4" />
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
        <div className="bg-white rounded-lg p-4 md:p-6 shadow-md border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs md:text-sm text-gray-600">Total Payments</p>
              <p className="text-xl md:text-2xl font-bold text-gray-800">{payments.length}</p>
            </div>
            <FaReceipt className="text-2xl md:text-3xl text-green-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-4 md:p-6 shadow-md border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs md:text-sm text-gray-600">Total Amount</p>
              <p className="text-xl md:text-2xl font-bold text-gray-800">
                {formatCurrency(payments.reduce((sum, p) => sum + parseFloat(p.paymentAmount), 0))}
              </p>
            </div>
            <FaCreditCard className="text-2xl md:text-3xl text-blue-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-4 md:p-6 shadow-md border-l-4 border-purple-500 sm:col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs md:text-sm text-gray-600">Average Payment</p>
              <p className="text-xl md:text-2xl font-bold text-gray-800">
                {payments.length > 0 
                  ? formatCurrency(payments.reduce((sum, p) => sum + parseFloat(p.paymentAmount), 0) / payments.length)
                  : '৳0.00'
                }
              </p>
            </div>
            <FaCalendarAlt className="text-2xl md:text-3xl text-purple-500" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentHistory;