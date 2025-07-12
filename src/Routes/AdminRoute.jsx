import React from 'react'
import useAuth from '../Hook/useAuth'

const AdminRoute = () => {
    const {user , loading} = useAuth()
    
  return (
    <div>AdminRoute</div>
  )
}

export default AdminRoute