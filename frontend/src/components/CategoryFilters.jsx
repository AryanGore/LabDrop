import React from 'react'
import { FileText, Image, Video, Music, Archive, X } from 'lucide-react'

function CategoryFilters({ selectedCategory, onCategoryChange }) {
  const categories = [
    { id: 'documents', label: 'Documents', icon: FileText, color: 'blue', count: 8 },
    { id: 'images', label: 'Images', icon: Image, color: 'pink', count: 5 },
    { id: 'videos', label: 'Videos', icon: Video, color: 'red', count: 3 },
    { id: 'audio', label: 'Audio', icon: Music, color: 'green', count: 2 },
    { id: 'zip', label: 'Archives', icon: Archive, color: 'yellow', count: 6 },
  ]

  const colorMap = {
    blue: 'from-blue-500 to-blue-600',
    pink: 'from-pink-500 to-pink-600',
    red: 'from-red-500 to-red-600',
    green: 'from-green-500 to-green-600',
    yellow: 'from-yellow-500 to-yellow-600',
  }

  const colorBgMap = {
    blue: 'from-blue-50 to-blue-100',
    pink: 'from-pink-50 to-pink-100',
    red: 'from-red-50 to-red-100',
    green: 'from-green-50 to-green-100',
    yellow: 'from-yellow-50 to-yellow-100',
  }

  return (
    <div className="mb-10">
      <div className="flex items-center gap-3 mb-5">
        <h3 className="text-lg font-bold text-gray-900">Filter by Category</h3>
        {selectedCategory && (
          <button
            onClick={() => onCategoryChange(null)}
            className="flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium hover:bg-purple-200 transition-colors"
          >
            Clear
            <X className="w-3 h-3" />
          </button>
        )}
      </div>

      <div className="flex gap-3 overflow-x-auto pb-3 scrollbar-hide">
        {categories.map((category) => {
          const IconComponent = category.icon
          const isSelected = selectedCategory === category.id
          const gradient = colorMap[category.color]
          const bgGradient = colorBgMap[category.color]

          return (
            <button
              key={category.id}
              onClick={() => onCategoryChange(isSelected ? null : category.id)}
              className={`flex items-center gap-3 px-5 py-3 rounded-full whitespace-nowrap transition-all font-medium text-sm group ${
                isSelected
                  ? `bg-gradient-to-r ${gradient} text-white shadow-lg shadow-purple-200 scale-105`
                  : `bg-white border border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50`
              }`}
            >
              <div className={`p-2 rounded-lg transition-all ${
                isSelected
                  ? 'bg-white/20'
                  : `bg-gradient-to-br ${bgGradient}`
              }`}>
                <IconComponent className={`w-5 h-5 ${isSelected ? 'text-white' : 'text-gray-700'}`} />
              </div>
              <div className="flex flex-col items-start">
                <span>{category.label}</span>
                <span className={`text-xs font-normal ${isSelected ? 'text-white/80' : 'text-gray-500'}`}>
                  {category.count} files
                </span>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default CategoryFilters

