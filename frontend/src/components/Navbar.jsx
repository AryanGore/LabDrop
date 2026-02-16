import React, { useState } from 'react'
import { Search, Bell, Settings, LogOut, ChevronDown } from 'lucide-react'

function Navbar({ user, onUploadClick, onLogout }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [isProfileOpen, setIsProfileOpen] = useState(false)

  return (
    <nav className="w-screen bg-white border-b border-gray-100 sticky top-0 z-40 shadow-sm">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
        <div className="flex items-center justify-between gap-4 sm:gap-6 lg:gap-8">
          {/* Logo */}
          <div className="flex-shrink-0">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 sm:w-10 h-8 sm:h-10 bg-gradient-to-br from-purple-600 to-purple-700 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white text-base sm:text-lg font-bold">L</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-purple-600 to-purple-700 bg-clip-text text-transparent">
                LabDrop
              </h1>
            </div>
          </div>

          {/* Search Input - Hidden on mobile */}
          <div className="hidden sm:flex flex-1 max-w-2xl">
            <div className="relative group w-full">
              <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 sm:w-5 h-4 sm:h-5 group-focus-within:text-purple-600 transition-colors" />
              <input
                type="text"
                placeholder="Search files, folders, or people..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 sm:pl-12 pr-4 py-2 sm:py-2.5 border border-gray-200 rounded-full bg-gray-50 focus:bg-white focus:outline-none focus:border-purple-300 focus:ring-2 focus:ring-purple-100 text-xs sm:text-sm transition-all placeholder-gray-500"
              />
            </div>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-3 sm:gap-4 lg:gap-6 ml-auto">
            {/* Notification Icon */}
            <button className="p-2 sm:p-2.5 hover:bg-gray-100 rounded-lg transition-colors relative group">
              <Bell className="w-4 sm:w-5 h-4 sm:h-5 text-gray-600 group-hover:text-purple-600 transition-colors" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* User Avatar & Profile */}
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-1.5 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <div className="w-7 sm:w-9 h-7 sm:h-9 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center shadow-md flex-shrink-0">
                  <span className="text-white text-xs sm:text-sm font-semibold">{user?.avatar || 'U'}</span>
                </div>
                <div className="hidden lg:block text-left">
                  <p className="text-xs sm:text-sm font-semibold text-gray-900">{user?.name || 'User'}</p>
                  <p className="text-xs text-gray-500 truncate max-w-xs">{user?.email || 'user@example.com'}</p>
                </div>
                <ChevronDown className="hidden sm:block w-4 h-4 text-gray-600" />
              </button>

              {/* Profile Dropdown */}
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 sm:w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-semibold text-gray-900">{user?.name || 'User'}</p>
                    <p className="text-xs text-gray-500 truncate">{user?.email || 'user@example.com'}</p>
                  </div>
                  <button className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors">
                    <Settings className="w-4 h-4" />
                    Settings
                  </button>
                  <button
                    onClick={() => {
                      setIsProfileOpen(false)
                      onLogout && onLogout()
                    }}
                    className="w-full px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors border-t border-gray-100"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              )}
            </div>

            {/* Buttons */}
            <div className="flex gap-2 sm:gap-3 pl-2 sm:pl-3 lg:pl-6 border-l border-gray-200">
              <button
                onClick={onUploadClick}
                className="px-3 sm:px-5 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:shadow-lg hover:shadow-purple-200 transition-all font-medium text-xs sm:text-sm flex items-center gap-1 sm:gap-2 hover:scale-105 transform whitespace-nowrap"
              >
                <span>+</span>
                <span className="hidden sm:inline">Upload</span>
              </button>
              <button className="hidden sm:block px-5 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm">
                Create
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Search - Shown only on mobile */}
        <div className="sm:hidden mt-3">
          <div className="relative group w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 group-focus-within:text-purple-600 transition-colors" />
            <input
              type="text"
              placeholder="Search files..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-full bg-gray-50 focus:bg-white focus:outline-none focus:border-purple-300 focus:ring-2 focus:ring-purple-100 text-xs transition-all placeholder-gray-500"
            />
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar

