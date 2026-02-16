import React, { useState } from 'react'
import RecentlyModified from './RecentlyModified'
import CategoryFilters from './CategoryFilters'
import FileTable from './FileTable'
import { Info } from 'lucide-react'

function Dashboard() {
  const [selectedCategory, setSelectedCategory] = useState(null)

  return (
    <main className="w-screen min-h-[calc(100vh-80px)] px-4 sm:px-6 lg:px-8 py-6 sm:py-8 bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="w-full">
        {/* Header Section */}
        <div className="mb-8 sm:mb-12">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
            <div className="flex-1">
              <h1 className="text-3xl sm:text-4xl lg:text-4xl font-bold text-gray-900 mb-2">All Files</h1>
              <p className="text-gray-600 text-sm sm:text-base flex items-center gap-2">
                <Info className="w-4 h-4" />
                All your files are organized and displayed below
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl sm:text-3xl font-bold text-purple-600">24</p>
              <p className="text-xs sm:text-sm text-gray-600">Total Files</p>
            </div>
          </div>
        </div>

        {/* Recently Modified Section */}
        <RecentlyModified />

        {/* Category Filters */}
        <CategoryFilters selectedCategory={selectedCategory} onCategoryChange={setSelectedCategory} />

        {/* File Table */}
        <FileTable selectedCategory={selectedCategory} />
      </div>
    </main>
  )
}

export default Dashboard
