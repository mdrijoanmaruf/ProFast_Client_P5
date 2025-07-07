import React from 'react'
import { Link } from 'react-router-dom'
import errorImg from '../../assets/error.png'

const ErrorPage = () => {
  return (
    <div className='bg-white mt-6 rounded-2xl p-8 text-center min-h-[600px] flex flex-col items-center justify-center'>
        <img 
          src={errorImg} 
          alt="Error 404" 
          className='w-80 h-auto mb-6'
        />
        <div>
            <h1 className='text-6xl font-bold text-[#03373D] mb-4'>404</h1>
            <h2 className='text-2xl font-semibold text-[#03373D] mb-4'>Page Not Found</h2>
            <p className='text-gray-600 mb-8 text-lg'>The page you are looking for does not exist.</p>
            <Link to="/">
                <button className='bg-[#CAEB66] text-[#03373D] px-8 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-all duration-300'>
                    Go Home
                </button>
            </Link>
        </div>
    </div>
  )
}

export default ErrorPage