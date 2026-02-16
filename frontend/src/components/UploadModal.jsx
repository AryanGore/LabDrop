import React, { useRef, useState } from 'react'
import { Upload, X, CheckCircle } from 'lucide-react'

function UploadModal({ onClose }) {
  const [isDragActive, setIsDragActive] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(null)
  const inputRef = useRef(null)

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragActive(true)
    } else if (e.type === 'dragleave') {
      setIsDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragActive(false)
    const files = e.dataTransfer.files
    simulateUpload(files)
  }

  const simulateUpload = (files) => {
    if (files.length > 0) {
      setUploadProgress(0)
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev === 100) {
            clearInterval(interval)
            return 100
          }
          return prev + Math.random() * 30
        })
      }, 200)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-8 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Upload File</h2>
            <p className="text-sm text-gray-600 mt-1">Add new files to your storage</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600 hover:text-gray-900"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-8">
          {uploadProgress === null ? (
            <>
              {/* Drag & Drop Area */}
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => inputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-300 ${
                  isDragActive
                    ? 'border-purple-500 bg-purple-50 scale-105'
                    : 'border-purple-200 bg-purple-50/50 hover:border-purple-400 hover:bg-purple-100'
                }`}
              >
                <div className="flex justify-center mb-6">
                  <div className={`p-5 rounded-full transition-all ${
                    isDragActive
                      ? 'bg-purple-600 scale-110'
                      : 'bg-gradient-to-br from-purple-500 to-purple-600'
                  }`}>
                    <Upload className={`w-10 h-10 ${isDragActive ? 'text-white animate-bounce' : 'text-white'}`} />
                  </div>
                </div>
                <p className="text-sm text-gray-700 mb-2 font-semibold">
                  {isDragActive ? 'Drop your files here' : 'Drop your files here, or'}
                </p>
                <p className="text-purple-600 font-bold hover:text-purple-700 transition-colors">
                  click to browse
                </p>
                <input
                  ref={inputRef}
                  type="file"
                  multiple
                  className="hidden"
                  onChange={(e) => simulateUpload(e.target.files)}
                />
              </div>

              {/* File Info */}
              <div className="mt-6 space-y-4">
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-xs text-blue-900 font-semibold">
                    ✓ Supported formats: PDF, DOC, DOCX, XLS, XLSX, PNG, JPG, MP4, MP3, ZIP
                  </p>
                </div>
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-xs text-green-900 font-semibold">
                    ✓ Maximum file size: 500 MB per file
                  </p>
                </div>
              </div>

              {/* Continue Button */}
              <button
                onClick={onClose}
                className="w-full mt-8 px-4 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl hover:shadow-lg hover:shadow-purple-200 transition-all font-bold text-sm hover:scale-105 transform"
              >
                Continue
              </button>
            </>
          ) : (
            <>
              {/* Upload Progress */}
              <div className="text-center py-8">
                {uploadProgress < 100 ? (
                  <>
                    <div className="mb-6 flex justify-center">
                      <div className="relative w-24 h-24 flex items-center justify-center">
                        <svg className="w-24 h-24 transform -rotate-90">
                          <circle
                            cx="48"
                            cy="48"
                            r="44"
                            fill="none"
                            stroke="#e5e7eb"
                            strokeWidth="8"
                          />
                          <circle
                            cx="48"
                            cy="48"
                            r="44"
                            fill="none"
                            stroke="url(#gradient)"
                            strokeWidth="8"
                            strokeDasharray={`${276 * (uploadProgress / 100)} 276`}
                            strokeLinecap="round"
                            className="transition-all duration-300"
                          />
                          <defs>
                            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%">
                              <stop offset="0%" stopColor="#9333ea" />
                              <stop offset="100%" stopColor="#7e22ce" />
                            </linearGradient>
                          </defs>
                        </svg>
                        <div className="absolute text-center">
                          <p className="text-2xl font-bold text-purple-600">{Math.round(uploadProgress)}%</p>
                          <p className="text-xs text-gray-600 mt-1">Uploading</p>
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-700 font-semibold mb-2">Uploading your files</p>
                    <p className="text-sm text-gray-600">Please wait while we process your files</p>
                  </>
                ) : (
                  <>
                    <div className="mb-6 flex justify-center">
                      <div className="p-5 bg-green-100 rounded-full animate-bounce">
                        <CheckCircle className="w-12 h-12 text-green-600" />
                      </div>
                    </div>
                    <p className="text-lg font-bold text-gray-900 mb-2">Upload Successful!</p>
                    <p className="text-sm text-gray-600 mb-6">Your files have been uploaded successfully</p>
                    <button
                      onClick={onClose}
                      className="w-full px-4 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:shadow-lg transition-all font-bold text-sm hover:scale-105 transform"
                    >
                      Done
                    </button>
                  </>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default UploadModal

