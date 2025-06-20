import React from 'react'
import logo from '../../assets/logo.png'

const Logo = () => {
  return (
    <div className='flex items-end'>
        <img className='mb-2' src={logo} alt="" />
        <p className='font-bold text-[28px] -ml-4 text-gray-700'>ProFast</p>
    </div>
  )
}

export default Logo