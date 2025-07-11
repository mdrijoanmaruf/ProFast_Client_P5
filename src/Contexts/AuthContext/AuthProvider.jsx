import React, { useEffect, useState } from 'react'
import { AuthContext } from './AuthContext'
import { createUserWithEmailAndPassword, GithubAuthProvider, GoogleAuthProvider, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut, updateProfile } from 'firebase/auth'
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

  const updateUserProfile = profileInfo => {
    return updateProfile(auth.currentUser , profileInfo);
  }

  const logOut = () => {
    setLoading(true)
    return signOut(auth)
  }

  const googleProvider = new GoogleAuthProvider();
  const singInWithGoogle = () => {
    setLoading(true)
    return signInWithPopup(auth, googleProvider)
  }

  const githubProvider = new GithubAuthProvider()
  const signInWithGithub = () => {
    setLoading(true)
    return signInWithPopup(auth, githubProvider)
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
    updateUserProfile,
    signIn,
    logOut,
    signInWithGithub,
    singInWithGoogle
  }
  return (
    <AuthContext value = {authInfo}>
      {children}
    </AuthContext>
  )
}

export default AuthProvider