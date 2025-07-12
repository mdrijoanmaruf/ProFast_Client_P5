import React from 'react'
import axios from 'axios'
import useAuth from './useAuth'
import { useNavigate } from 'react-router-dom'

const axiosSecure = axios.create({
    baseURL : `http://localhost:5000`
})

const useAxiosSecure = () => {
  const { user, logOut } = useAuth()
  const navigate = useNavigate()

  // Request interceptor - Add JWT token
  axiosSecure.interceptors.request.use(async (config) => {
    if (user) {
      try {
        // Get fresh Firebase ID token
        const token = await user.getIdToken()
        config.headers.authorization = `Bearer ${token}`
      } catch (error) {
        console.error('Error getting token:', error)
      }
    }
    return config
  }, (error) => {
    return Promise.reject(error)
  })

  // Response interceptor - Handle errors
  axiosSecure.interceptors.response.use((res) => {
    return res
  }, async (error) => {
    const status = error.response?.status
    
    if (status === 403) {
      // Forbidden - redirect to forbidden page
      navigate('/forbidden')
    } else if (status === 401) {
      // Unauthorized - logout and redirect to login
      try {
        await logOut()
        navigate('/login')
      } catch (logoutError) {
        console.error('Logout error:', logoutError)
        navigate('/login')
      }
    }
    
    return Promise.reject(error)
  })
  
  return axiosSecure
}

export default useAxiosSecure