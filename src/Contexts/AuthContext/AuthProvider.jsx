import React from 'react'

const AuthProvider = ({children}) => {

  const authInfo = {

  }
  return (
    <AuthContext value = {authInfo}>
      {children}
    </AuthContext>
  )
}

export default AuthProvider