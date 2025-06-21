import React, { useEffect, useState } from 'react'
import { AuthContext } from './AuthContext'
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { auth } from '../../Firebase/Firebase.init'

const AuthProvider = ({children}) => {

  const [user , setUser] = useState(null)
  const [loading , setLoading] = useState(true)

  const createUser = (email , password) => {
    setLoading(true)
    return createUserWithEmailAndPassword(auth , email , password)
  }

  const signIn = (email , password) => {
    setLoading(true)
    return signInWithEmailAndPassword(auth, email , password)
  }

  const logOut = () => {
    setLoading(true)
    return signOut(auth)
  }

  useEffect(() => {
    const unSubscribe = onAuthStateChanged(auth , (currentUser) => {
      setUser(currentUser);
      console.log("User in the onAuthStateChange : " , currentUser);
      setLoading(false)
    })
    return () => {
      unSubscribe()
    }
  }, [])

  const authInfo = {
    user ,
    loading,
    createUser,
    signIn,
    logOut,
    
  }
  return (
    <AuthContext value = {authInfo}>
      {children}
    </AuthContext>
  )
}

export default AuthProvider