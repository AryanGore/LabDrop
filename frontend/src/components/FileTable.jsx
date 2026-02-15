import React, { useState } from 'react'
import {
  FileText,
  Image,
  Video,
  Music,
  Archive,
  MoreVertical,
  Download,
  Share2,
  Trash2,
  Eye
} from 'lucide-react'

function FileTable({ selectedCategory }) {
  const [hoveredRow, setHoveredRow] = useState(null)
  const [openMenu, setOpenMenu] = useState(null)

  const files = [
    { id: 1, name: 'Quarterly Report.pdf', owner: 'You', size: '2.4 MB', modified: '2 days ago', type: 'documents', icon: FileText },
    { id: 2, name: 'Team Presentation.pptx', owner: 'Aryan Gore', size: '5.8 MB', modified: '5 days ago', type: 'documents', icon: FileText },
    { id: 3, name: 'Logo Design v3.png', owner: 'Prathmesh Jugati', size: '1.2 MB', modified: '1 week ago', type: 'images', icon: Image },
    { id: 4, name: 'Meeting Recording.mp4', owner: 'Humanshu Ise', size: '145 MB', modified: '2 weeks ago', type: 'videos', icon: Video },
    { id: 5, name: 'Podcast Episode 5.mp3', owner: 'Shrey Jagtap', size: '45 MB', modified: '3 weeks ago', type: 'audio', icon: Music },
    { id: 6, name: 'Project Archive.zip', owner: 'You', size: '320 MB', modified: '1 month ago', type: 'zip', icon: Archive }
  ]

  const filteredFiles = selectedCategory
    ? files.filter((file) => file.type === selectedCategory)
    : files

  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-lg">
      <table className="w-full">
        <thead>
          <tr className="border-b bg-gray-50">
            <th className="px-8 py-5 text-left text-sm font-semibold">File Name</th>
            <th className="px-8 py-5 text-left text-sm font-semibold">Owner</th>
            <th className="px-8 py-5 text-left text-sm font-semibold">Size</th>
            <th className="px-8 py-5 text-left text-sm font-semibold">Modified</th>
            <th className="px-8 py-5 text-right text-sm font-semibold">Actions</th>
          </tr>
        </thead>

        <tbody>
          {filteredFiles.map((file) => {
            const IconComponent = file.icon

            return (
              <tr
                key={file.id}
                onMouseEnter={() => setHoveredRow(file.id)}
                onMouseLeave={() => setHoveredRow(null)}
                className={`border-b transition ${
                  hoveredRow === file.id
                    ? 'bg-purple-50'
                    : 'hover:bg-gray-50'
                }`}
              >
                {/* File name */}
                <td className="px-8 py-5">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-gray-100 rounded-lg">
                      <IconComponent className="w-5 h-5 text-purple-600" />
                    </div>
                    <span className="text-sm font-medium">{file.name}</span>
                  </div>
                </td>

                {/* Owner */}
                <td className="px-8 py-5">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 bg-indigo-600 rounded-full text-white text-xs flex items-center justify-center">
                      {file.owner.charAt(0)}
                    </div>
                    <span className="text-sm">{file.owner}</span>
                  </div>
                </td>

                {/* Size */}
                <td className="px-8 py-5 text-sm text-gray-600">{file.size}</td>

                {/* Modified */}
                <td className="px-8 py-5">
                  <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs">
                    {file.modified}
                  </span>
                </td>

                {/* Actions */}
                <td className="px-8 py-5 text-right">
                  <div className="flex justify-end items-center gap-2">

                    {/* Hover icons */}
                    {hoveredRow === file.id && (
                      <div className="flex gap-2">
                        <button className="p-2 rounded-lg text-purple-600 hover:bg-purple-100">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-2 rounded-lg text-green-600 hover:bg-green-100">
                          <Download className="w-4 h-4" />
                        </button>
                        <button className="p-2 rounded-lg text-blue-600 hover:bg-blue-100">
                          <Share2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}

                    {/* 3-dot menu */}
                    <div className="relative">
                      <button
                        onClick={() =>
                          setOpenMenu(openMenu === file.id ? null : file.id)
                        }
                        className="p-2 rounded-lg text-purple-500 hover:text-purple-500"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>

                      {openMenu === file.id && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border z-10">
                          <button className="w-full px-4 py-2.5 flex items-center gap-3 text-sm hover:bg-purple-50 [&>svg]:text-purple-600">
                            <Eye className="w-4 h-4" />
                            Preview
                          </button>

                          <button className="w-full px-4 py-2.5 flex items-center gap-3 text-sm hover:bg-green-50 [&>svg]:text-green-600">
                            <Download className="w-4 h-4" />
                            Download
                          </button>

                          <button className="w-full px-4 py-2.5 flex items-center gap-3 text-sm hover:bg-blue-50 [&>svg]:text-blue-600">
                            <Share2 className="w-4 h-4" />
                            Share
                          </button>

                          <button className="w-full px-4 py-2.5 flex items-center gap-3 text-sm text-red-600 hover:bg-red-50 border-t [&>svg]:text-red-600">
                            <Trash2 className="w-4 h-4" />
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>

      {filteredFiles.length === 0 && (
        <div className="py-16 text-center text-gray-500">
          No files found
        </div>
      )}
    </div>
  )
}

export default FileTable
