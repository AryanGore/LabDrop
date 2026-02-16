import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'
import Dashboard from '../components/Dashboard'
import UploadModal from '../components/UploadModal'

function Home() {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="w-screen min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50 overflow-x-hidden">
      <Navbar
        user={user}
        onUploadClick={() => setIsUploadModalOpen(true)}
        onLogout={handleLogout}
      />
      <Dashboard />
      {isUploadModalOpen && (
        <UploadModal onClose={() => setIsUploadModalOpen(false)} />
      )}
    </div>
  )
}

export default Home
