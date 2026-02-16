import React, { createContext, useContext, useState, useEffect } from 'react'
import authService from '../services/authService'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [accessToken, setAccessToken] = useState(null)

  useEffect(() => {
    // Check if user is logged in and try to refresh token
    const initAuth = async () => {
      const storedUser = localStorage.getItem('user')
      const storedToken = localStorage.getItem('accessToken')

      if (storedUser && storedToken) {
        try {
          setUser(JSON.parse(storedUser))
          setAccessToken(storedToken)
          setIsAuthenticated(true)

          // Try to refresh the token to ensure it's valid
          try {
            const response = await authService.refreshToken()
            const newToken = response.data.token
            localStorage.setItem('accessToken', newToken)
            setAccessToken(newToken)
          } catch (refreshError) {
            // If refresh fails, clear auth state
            console.error('Token refresh failed:', refreshError)
            logout()
          }
        } catch (error) {
          console.error('Error parsing user data:', error)
          localStorage.removeItem('user')
          localStorage.removeItem('accessToken')
        }
      }
      setLoading(false)
    }

    initAuth()
  }, [])

  const signup = async (username, email, password) => {
    try {
      console.log('Attempting signup with:', { username, email });
      const response = await authService.signup(username, email, password)
      console.log('Signup successful:', response);
      // Signup successful, but don't auto-login - redirect to login page
      return { success: true, data: response.data }
    } catch (error) {
      console.error('Signup error details:', error);
      console.error('Error response:', error.response);
      console.error('Error message:', error.message);

      const errorMessage = error.response?.data?.message || error.message || 'Signup failed. Please try again.'
      throw new Error(errorMessage)
    }
  }

  const login = async (email, password) => {
    try {
      const response = await authService.login(email, password)
      const { token, user: userData } = response.data

      // Store token and user data
      localStorage.setItem('accessToken', token)
      localStorage.setItem('user', JSON.stringify(userData))

      setAccessToken(token)
      setUser(userData)
      setIsAuthenticated(true)

      return { success: true, data: userData }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Login failed. Please check your credentials.'
      throw new Error(errorMessage)
    }
  }

  const logout = async () => {
    try {
      await authService.logout()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      // Clear local state regardless of API call success
      setUser(null)
      setAccessToken(null)
      setIsAuthenticated(false)
      localStorage.removeItem('user')
      localStorage.removeItem('accessToken')
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, isAuthenticated, accessToken, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
