# Simple Stripe Payment Integration Guide

## 📋 What This Is
A complete guide to add Stripe payments to any React + Node.js project.

---

## 🚀 Step 1: Install Required Packages

### Frontend (React)
```bash
npm install @stripe/stripe-js @stripe/react-stripe-js
```

### Backend (Node.js)
```bash
npm install stripe express cors
```

---

## 🔧 Step 2: Get Stripe Keys

1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Create account or login
3. Get your keys from **Developers > API Keys**

### Environment Files

#### Frontend (.env)
```env
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
```

#### Backend (.env)
```env
STRIPE_SECRET_KEY=sk_test_your_key_here
```

---

## 💻 Step 3: Frontend Setup

### Main Payment Component
```jsx
// PaymentWrapper.jsx
import React from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import PaymentForm from './PaymentForm';

// Initialize Stripe with your publishable key
// This creates a promise that resolves to a Stripe instance
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

const PaymentWrapper = () => {
  return (
    // Elements provider makes Stripe available to all child components
    // This wrapper is required for Stripe components to work
    <Elements stripe={stripePromise}>
      <PaymentForm />
    </Elements>
  );
};

export default PaymentWrapper;
```

### Payment Form Component
```jsx
// PaymentForm.jsx
import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const PaymentForm = () => {
  // useStripe gives us access to the Stripe instance
  const stripe = useStripe();
  // useElements gives us access to Elements (like CardElement)
  const elements = useElements();
  
  // State to manage form status
  const [loading, setLoading] = useState(false);     // Show loading spinner
  const [error, setError] = useState(null);         // Display error messages
  const [success, setSuccess] = useState(false);    // Show success message

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);   // Start loading spinner
    setError(null);     // Clear any previous errors

    // Don't proceed if Stripe hasn't loaded yet
    if (!stripe || !elements) return;

    // Get the card element that contains the card details
    const card = elements.getElement(CardElement);

    try {
      // Step 1: Create payment intent on your backend
      // This tells Stripe how much to charge and gets a client secret
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: 1000 }) // $10.00 in cents (1000 cents = $10)
      });

      const { clientSecret } = await response.json();

      // Step 2: Confirm payment with Stripe using the client secret
      // This processes the actual payment with the card details
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card } // Use the card details from CardElement
      });

      if (error) {
        // Payment failed - show error message
        setError(error.message);
      } else if (paymentIntent.status === 'succeeded') {
        // Payment successful - show success message
        setSuccess(true);
      }
    } catch (err) {
      // Network or other errors
      setError('Payment failed');
    }

    setLoading(false); // Stop loading spinner
  };

  // If payment was successful, show success message
  if (success) {
    return <div>✅ Payment Successful!</div>;
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* Stripe's secure card input component */}
      <CardElement />
      
      {/* Show error message if there's an error */}
      {error && <div style={{color: 'red'}}>{error}</div>}
      
      {/* Submit button - disabled until Stripe loads or while processing */}
      <button type="submit" disabled={!stripe || loading}>
        {loading ? 'Processing...' : 'Pay Now'}
      </button>
    </form>
  );
};

export default PaymentForm;
```

---

## 🖥️ Step 4: Backend Setup

### Basic Server Setup
```javascript
// server.js
const express = require('express');
const cors = require('cors');
// Initialize Stripe with your secret key from environment variables
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const app = express();

// Enable CORS to allow requests from your frontend
app.use(cors());

// Parse JSON bodies for API requests
app.use(express.json());

// Your payment routes will go here...

// Start the server on port 5000
app.listen(5000, () => {
  console.log('Server running on port 5000');
});
```

### Payment Intent API
```javascript
// Create payment intent endpoint
app.post('/api/create-payment-intent', async (req, res) => {
  try {
    // Get the payment amount from the request body
    const { amount } = req.body;

    // Create a payment intent with Stripe
    // This represents an intention to collect payment
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,        // Amount in cents (1000 = $10.00)
      currency: 'usd'       // Currency code
    });

    // Send back the client secret to the frontend
    // The frontend needs this to confirm the payment
    res.send({
      clientSecret: paymentIntent.client_secret
    });
  } catch (error) {
    // If something goes wrong, send error back to frontend
    res.status(400).send({ error: error.message });
  }
});
```

### Webhook (Optional)
```javascript
// Handle Stripe webhook events
app.post('/api/webhook', express.raw({type: 'application/json'}), (req, res) => {
  // Get the signature from Stripe to verify the webhook is genuine
  const sig = req.headers['stripe-signature'];
  
  try {
    // Verify the webhook signature and parse the event
    const event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    
    // Handle successful payment event
    if (event.type === 'payment_intent.succeeded') {
      console.log('Payment successful!');
      // This is where you'd update your database
      // Mark order as paid, send confirmation email, etc.
    }
    
    // Always respond with 200 to acknowledge receipt
    res.json({received: true});
  } catch (err) {
    // If signature verification fails, reject the webhook
    res.status(400).send(`Webhook Error: ${err.message}`);
  }
});
```

---

## 🔄 How It Works

```
1. User fills out payment form
   → CardElement collects card details securely

2. Frontend creates payment intent (backend call)
   → POST to /api/create-payment-intent with amount
   → Backend creates PaymentIntent with Stripe
   → Returns client_secret to frontend

3. Stripe processes card details
   → Frontend calls stripe.confirmCardPayment()
   → Stripe validates card and processes payment
   → Returns success or error

4. Payment confirmed or rejected
   → If successful: paymentIntent.status = 'succeeded'
   → If failed: error object with details

5. Success/error message shown
   → Update UI based on result
   → Show confirmation or error message

6. (Optional) Webhook updates your database
   → Stripe sends event to your webhook
   → Update order status, send emails, etc.
```

---

## 🧪 Testing

### Test Card Numbers
```
✅ Success:     4242 4242 4242 4242
❌ Declined:    4000 0000 0000 0002
🔐 3D Secure:   4000 0025 0000 3155

Expiry: Any future date (12/30)
CVC: Any 3 digits (123)
```

### Test Steps
1. **Use test keys** (start with `pk_test_` and `sk_test_`)
   → Never use live keys during development

2. **Enter test card number** 
   → 4242 4242 4242 4242 for successful payments

3. **Fill any future expiry date**
   → Example: 12/30 (December 2030)

4. **Use any 3-digit CVC**
   → Example: 123 or 456

5. **Click pay and see result**
   → Should see success message or specific error

---

## 🔒 Security Notes

- ✅ Never store card details
- ✅ Use HTTPS in production
- ✅ Keep secret keys secure
- ✅ Validate amounts on backend
- ✅ Use environment variables

---

## 🚨 Common Issues

### "Stripe not loading"
- Check your publishable key
- Disable ad blockers
- Try incognito mode

### "Payment declined"
- Use correct test card numbers
- Check amount (minimum $0.50)
- Verify keys are correct

---

## 🚀 Going Live

1. **Get Live Keys**: Replace `pk_test_` with `pk_live_` keys
   → Go to Stripe Dashboard > Developers > API Keys
   → Copy live keys to your production environment

2. **Add Domain**: Add your domain to Stripe settings
   → Stripe Dashboard > Settings > Account Details
   → Add your website URL for security

3. **Enable HTTPS**: Required for live payments
   → Stripe requires SSL certificates in production
   → Use services like Let's Encrypt for free SSL

4. **Test Everything**: Test with real small amounts first
   → Try $0.50 payments to verify everything works
   → Check that webhooks fire correctly

---

## 📚 Basic Integration Checklist

- [ ] Install Stripe packages
- [ ] Get API keys from Stripe
- [ ] Set up environment variables
- [ ] Create payment form component
- [ ] Add backend payment intent endpoint
- [ ] Test with test cards
- [ ] Style your payment form
- [ ] Add error handling
- [ ] Test on different devices
- [ ] Ready for production!

---

## 💡 Tips

- **Start Simple**: Get basic payment working first
- **Test Everything**: Use all test card numbers
- **Read Docs**: [Stripe Documentation](https://stripe.com/docs) is excellent
- **Use Webhooks**: For important business logic
- **Monitor Payments**: Check Stripe dashboard regularly

