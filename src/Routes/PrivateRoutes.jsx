import React from 'react'
import useAuth from '../Hook/useAuth'
import { Navigate } from 'react-router-dom'

const PrivateRoutes = ({children}) => {
    const {user , loading} = useAuth()

    if(loading) {
        return <span className="loading loading-bars loading-xl"></span>
    }

    if(!user) {
        return <Navigate to='/login'></Navigate>
    }
  return children;
}

export default PrivateRoutes