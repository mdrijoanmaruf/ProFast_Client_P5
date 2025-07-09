import React from 'react'
import {loadStripe} from '@stripe/stripe-js';
import PaymentForm from './PaymentForm';
import { Elements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe('pk_test_TYooMQauvdEDq54NiTphI7jx');

const Payment = () => {
  return (
    <Elements stripe = {stripePromise}>
      <PaymentForm></PaymentForm>
    </Elements>
  )
}

export default Payment