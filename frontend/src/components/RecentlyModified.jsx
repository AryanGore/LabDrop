import React from 'react'
import { FileText, Image, Video, Music, ChevronRight } from 'lucide-react'

function RecentlyModified() {
  const recentFiles = [
    { id: 1, name: 'Q1 Business Report', type: 'document', icon: FileText, size: '2.4 MB', date: '2 hours ago' },
    { id: 2, name: 'Brand Guidelines 2024', type: 'image', icon: Image, size: '8.7 MB', date: '5 hours ago' },
    { id: 3, name: 'Product Demo Video', type: 'video', icon: Video, size: '156 MB', date: '1 day ago' },
    { id: 4, name: 'Meeting Podcast', type: 'audio', icon: Music, size: '48 MB', date: '2 days ago' },
  ]

  return (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Recently Modified</h2>
          <p className="text-sm text-gray-600 mt-1">Your most recent files and updates</p>
        </div>
        <a href="#" className="text-purple-600 text-sm font-semibold hover:text-purple-700 flex items-center gap-1 hover:gap-2 transition-all">
          View all
          <ChevronRight className="w-4 h-4" />
        </a>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {recentFiles.map((file) => {
          const IconComponent = file.icon
          return (
            <div
              key={file.id}
              className="group p-5 bg-white border border-gray-100 rounded-xl hover:shadow-lg hover:border-purple-200 transition-all duration-300 cursor-pointer hover:scale-105 transform"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-purple-100 to-purple-50 rounded-lg group-hover:shadow-md transition-all">
                  <IconComponent className="w-6 h-6 text-purple-600" />
                </div>
                <div className="px-2 py-1 bg-gray-100 rounded text-xs font-semibold text-gray-700 group-hover:bg-purple-100 group-hover:text-purple-700 transition-colors">
                  New
                </div>
              </div>
              <p className="text-sm font-semibold text-gray-900 truncate group-hover:text-purple-600 transition-colors">{file.name}</p>
              <p className="text-xs text-gray-500 mt-2">{file.size}</p>
              <p className="text-xs text-gray-400 mt-1">{file.date}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default RecentlyModified

