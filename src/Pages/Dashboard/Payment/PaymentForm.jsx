import React, { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { FaCreditCard, FaLock, FaCheckCircle } from "react-icons/fa";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../Hook/useAxiosSecure";
import useAuth from "../../../Hook/useAuth";
import Swal from "sweetalert2";

// Initialize Stripe with error handling
const stripePromise = loadStripe(import.meta.env.VITE_PaymentKey).catch(error => {
  console.error('Stripe failed to load:', error);
  return null;
});

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const { parcelId } = useParams();
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const navigate = useNavigate();
  console.log(parcelId);

  const { isPending, isError, data : parcelInfo= {} } = useQuery({
    queryKey: ["parcels", parcelId],
    queryFn: async () => {
      const res = await axiosSecure.get(`/parcels/${parcelId}`);
      return res.data;
    },
  });

  if (isPending) {
    return "Loading ....."
  }

  console.log("Parcel info : ",parcelInfo);
  const price = parcelInfo.cost;
  const amountInCents = Math.round(price * 100); // Ensure it's an integer

  // Validation for price
  if (!price || price <= 0) {
    return (
      <div className="max-w-md mx-auto bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
        <h3 className="text-red-800 font-semibold mb-2">Invalid Payment Amount</h3>
        <p className="text-red-600 text-sm">
          Unable to process payment. The parcel cost is invalid.
        </p>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);
    setError(null);

    if (!stripe || !elements) {
      setError('Stripe failed to load. Please disable ad blockers and refresh the page.');
      setProcessing(false);
      return;
    }

    const card = elements.getElement(CardElement);

    if (!card) {
      setError('Card element not found. Please refresh the page.');
      setProcessing(false);
      return;
    }

    try {
      // Step 1: Create payment intent
      const res = await axiosSecure.post('/create-payment-intent', {
        amount: amountInCents,
        parcelId
      });

      const { clientSecret } = res.data;

      // Step 2: Confirm payment with the client secret
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: card,
          billing_details: {
            name: 'Customer', // You can get this from user context
          },
        }
      });

      if (error) {
        let errorMessage = error.message;
        if (error.message.includes('blocked') || error.message.includes('fetch')) {
          errorMessage = 'Payment blocked by browser. Please disable ad blockers and try again.';
        }
        
        // Show error Sweet Alert
        await Swal.fire({
          title: 'Payment Failed',
          text: errorMessage,
          icon: 'error',
          confirmButtonText: 'Try Again',
          confirmButtonColor: '#03373D'
        });
        
        setError(errorMessage);
        setProcessing(false);
      } else if (paymentIntent.status === 'succeeded') {
        console.log("Payment successful:", paymentIntent);
        
        // Step 3: Update parcel status in backend after successful payment
        try {
          const updateResponse = await axiosSecure.patch(`/parcels/${parcelId}/payment`, {
            paymentIntentId: paymentIntent.id,
            status: 'paid',
            paymentAmount: price,
            paymentDate: new Date().toISOString(),
            userEmail: user?.email
          });
          
          if (updateResponse.data.success) {
            console.log("Parcel status updated successfully");
            
            // Show success Sweet Alert
            await Swal.fire({
              title: 'Payment Successful!',
              text: `Your payment of ৳${price} has been processed successfully. Your parcel status has been updated.`,
              icon: 'success',
              confirmButtonText: 'Go to My Parcels',
              confirmButtonColor: '#03373D',
              showCancelButton: true,
              cancelButtonText: 'Stay Here',
              cancelButtonColor: '#6c757d',
              allowOutsideClick: false
            }).then((result) => {
              if (result.isConfirmed) {
                navigate('/dashboard/myParcels');
              }
            });
            
            setSuccess(true);
          } else {
            throw new Error('Failed to update parcel status');
          }
        } catch (updateError) {
          console.error("Failed to update parcel status:", updateError);
          
          // Show warning that payment succeeded but status update failed
          await Swal.fire({
            title: 'Payment Successful',
            text: 'Your payment was processed successfully, but there was an issue updating the parcel status. Please contact support if needed.',
            icon: 'warning',
            confirmButtonText: 'OK',
            confirmButtonColor: '#03373D'
          });
          
          setSuccess(true);
        }
        
        setProcessing(false);
      }
    } catch (error) {
      console.error('Payment error:', error);
      
      let errorMessage = 'Payment failed. Please try again.';
      if (error.message.includes('blocked') || error.message.includes('fetch')) {
        errorMessage = 'Payment blocked by browser. Please disable ad blockers and try again.';
      }
      
      // Show error Sweet Alert
      await Swal.fire({
        title: 'Payment Error',
        text: errorMessage,
        icon: 'error',
        confirmButtonText: 'Try Again',
        confirmButtonColor: '#03373D'
      });
      
      setError(errorMessage);
      setProcessing(false);
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: "16px",
        color: "#424770",
        "::placeholder": {
          color: "#aab7c4",
        },
        fontFamily: "system-ui, -apple-system, sans-serif",
      },
      invalid: {
        color: "#9e2146",
      },
    },
  };
  return (
    <div className="max-w-md mx-auto bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#03373D] to-[#044a52] px-6 py-4">
        <div className="flex items-center space-x-3">
          <FaCreditCard className="text-[#CAEB66] text-xl" />
          <h2 className="text-white text-lg font-semibold">Payment Details</h2>
        </div>
        <p className="text-[#CAEB66] text-sm mt-1">
          Complete your parcel pickup payment
        </p>
      </div>

      {/* Form Content */}
      <div className="px-6 py-6">
        {success ? (
          <div className="text-center py-8">
            <FaCheckCircle className="text-green-500 text-4xl mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Payment Successful!
            </h3>
            <p className="text-gray-600">
              Your parcel pickup payment has been processed successfully.
            </p>
          </div>
        ) : (
          <>
            {/* Payment Amount */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 font-medium">
                  Parcel Pickup Fee
                </span>
                <span className="text-2xl font-bold text-[#03373D]">
                  {price} BDT
                </span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Card Element Container */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Card Information
                </label>
                <div className="relative">
                  <div className="border border-gray-300 rounded-lg p-4 bg-white focus-within:ring-2 focus-within:ring-[#CAEB66] focus-within:border-[#CAEB66] transition-all duration-200">
                    <CardElement options={cardElementOptions} />
                  </div>
                </div>
              </div>

              {/* Security Notice */}
              <div className="flex items-center space-x-2 text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
                <FaLock className="text-blue-600" />
                <span>Your payment information is secure and encrypted</span>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={!stripe || processing}
                className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-all duration-200 ${
                  !stripe || processing
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-[#03373D] hover:bg-[#044a52] active:scale-95"
                } focus:outline-none focus:ring-2 focus:ring-[#CAEB66] focus:ring-offset-2`}
              >
                {processing ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Processing...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2">
                    <FaCreditCard />
                    <span>Pay {price} BDT for Parcel Pickup</span>
                  </div>
                )}
              </button>
            </form>
          </>
        )}
      </div>

      {/* Footer */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
        <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
          <span>Powered by Stripe</span>
          <span>•</span>
          <span>SSL Secured</span>
          <span>•</span>
          <span>PCI Compliant</span>
        </div>
      </div>
    </div>
  );
};

// Main PaymentForm component with Elements provider
const PaymentForm = () => {
  const [stripeLoadError, setStripeLoadError] = useState(false);
  const [stripeLoaded, setStripeLoaded] = useState(false);

  React.useEffect(() => {
    stripePromise.then((stripe) => {
      if (stripe) {
        setStripeLoaded(true);
      } else {
        setStripeLoadError(true);
      }
    }).catch(() => {
      setStripeLoadError(true);
    });
  }, []);

  if (!stripeLoaded && !stripeLoadError) {
    return (
      <div className="max-w-md mx-auto bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
        <div className="text-center py-8">
          <div className="w-8 h-8 border-2 border-[#03373D] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading payment system...</p>
        </div>
      </div>
    );
  }

  return (
    <Elements stripe={stripePromise} onReady={() => console.log('Stripe loaded successfully')}>
      {stripeLoadError ? (
        <div className="max-w-md mx-auto bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
          <h3 className="text-red-800 font-semibold mb-2">Payment System Blocked</h3>
          <p className="text-red-600 text-sm mb-4">
            It looks like an ad blocker is preventing the payment system from loading.
          </p>
          <div className="text-left text-sm text-red-600">
            <p className="font-medium mb-2">To fix this:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Disable ad blockers (uBlock Origin, Adblock Plus, etc.)</li>
              <li>Try using incognito/private mode</li>
              <li>Whitelist *.stripe.com in your ad blocker</li>
              <li>Refresh the page after making changes</li>
            </ul>
          </div>
        </div>
      ) : (
        <CheckoutForm />
      )}
    </Elements>
  );
};

export default PaymentForm;
