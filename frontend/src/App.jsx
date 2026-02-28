import React, { useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Signup from './pages/Signup'
import Login from './pages/Login'
import Home from './pages/Home'
import Landing from './pages/Landing'
import Loading from './pages/Loading'

// Wrapper component to handle loading and auth routing
function AppRoutes() {
  const { isAuthenticated, loading } = useAuth()
  const [showSplash, setShowSplash] = useState(true)

  useEffect(() => {
    // Show splash screen for 10 seconds on initial load
    const splashTimer = setTimeout(() => {
      setShowSplash(false)
    }, 10000)

    return () => clearTimeout(splashTimer)
  }, [])

  // Show loading/splash screen for 2.5 seconds regardless of auth status
  if (showSplash) {
    return <Loading />
  }

  return (
    <Routes>
      {/* If authenticated, redirect to dashboard */}
      <Route
        path="/"
        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Landing />}
      />
      
      {/* Public Routes */}
      <Route path="/signup" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Signup />} />
      <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />} />

      {/* Protected Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />

      {/* Redirect all other routes to landing */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  )
}

export default App
