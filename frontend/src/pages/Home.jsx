import React, { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import {
  Upload,
  LogOut,
  User,
  Folder,
  File,
  FileText,
  FileImage,
  FileVideo,
  FileAudio,
  FileArchive,
  Sparkles,
  Cloud,
  FolderPlus,
  Home as HomeIcon,
  ChevronRight,
  MoreVertical,
  Edit2,
  Trash2,
  X,
  Download
} from 'lucide-react'
import api from '../services/api'

function Home() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [showWelcome, setShowWelcome] = useState(true)
  const [isDragging, setIsDragging] = useState(false)
  const [files, setFiles] = useState([])
  const [folders, setFolders] = useState([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [currentFolderId, setCurrentFolderId] = useState(null)
  const [breadcrumbs, setBreadcrumbs] = useState([{ id: null, name: 'Home' }])
  const [showCreateFolder, setShowCreateFolder] = useState(false)
  const [newFolderName, setNewFolderName] = useState('')
  const [isExpanded, setIsExpanded] = useState(false)
  const [contextMenu, setContextMenu] = useState(null)
  const [renameItem, setRenameItem] = useState(null)
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [previewFile, setPreviewFile] = useState(null)

  // Hide welcome message after 2 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowWelcome(false)
    }, 2000)
    return () => clearTimeout(timer)
  }, [])

  // Fetch files and folders on mount or when folder changes
  useEffect(() => {
    fetchContents()
  }, [currentFolderId])

  // Close context menu on click outside
  useEffect(() => {
    const handleClick = () => setContextMenu(null)
    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [])

  const fetchContents = async () => {
    try {
      setLoading(true)
      const endpoint = currentFolderId
        ? `/api/v1/folder/${currentFolderId}`
        : '/api/v1/folder/'
      const response = await api.get(endpoint)
      const data = response.data.data
      setFolders(data.folders || [])
      setFiles(data.files || [])
    } catch (error) {
      console.error('Error fetching contents:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const handleDragOver = useCallback((e) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback(async (e) => {
    e.preventDefault()
    setIsDragging(false)

    const items = e.dataTransfer.items
    if (!items) return

    const filesWithPaths = []

    // Process all dropped items
    for (let i = 0; i < items.length; i++) {
      const item = items[i].webkitGetAsEntry()
      if (item) {
        await traverseFileTree(item, '', filesWithPaths)
      }
    }

    if (filesWithPaths.length > 0) {
      await uploadFiles(filesWithPaths)
    }
  }, [currentFolderId])

  // Recursively traverse folder structure
  const traverseFileTree = async (item, path, filesArray) => {
    return new Promise((resolve) => {
      if (item.isFile) {
        item.file((file) => {
          filesArray.push({
            file: file,
            path: path + file.name
          })
          resolve()
        })
      } else if (item.isDirectory) {
        const dirReader = item.createReader()
        dirReader.readEntries(async (entries) => {
          for (const entry of entries) {
            await traverseFileTree(entry, path + item.name + '/', filesArray)
          }
          resolve()
        })
      }
    })
  }

  const handleFileSelect = async (e) => {
    const selectedFiles = Array.from(e.target.files)
    if (selectedFiles.length === 0) return

    const filesWithPaths = selectedFiles.map(file => ({
      file: file,
      path: file.webkitRelativePath || file.name
    }))

    await uploadFiles(filesWithPaths)
  }

  const uploadFiles = async (filesWithPaths) => {
    try {
      setUploading(true)
      setUploadProgress(0)

      const formData = new FormData()

      // Add files and their paths
      filesWithPaths.forEach(({ file, path }) => {
        formData.append('files', file)
        formData.append('paths', path)
      })

      // Add current folder ID if navigated into a folder
      if (currentFolderId) {
        formData.append('folderId', currentFolderId)
      }

      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90))
      }, 200)

      const response = await api.post('/drop/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      clearInterval(progressInterval)
      setUploadProgress(100)

      // Refresh contents
      await fetchContents()

      setTimeout(() => {
        setUploading(false)
        setUploadProgress(0)
        showSuccess('Files uploaded successfully!')
      }, 1000)
    } catch (error) {
      console.error('Upload error:', error)
      setUploading(false)
      setUploadProgress(0)
    }
  }

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) return

    try {
      const payload = {
        name: newFolderName,
        ...(currentFolderId && { parentId: currentFolderId })
      }

      await api.post('/api/v1/folder/create', payload)
      setNewFolderName('')
      setShowCreateFolder(false)
      await fetchContents()
      showSuccess('Folder created successfully!')
    } catch (error) {
      console.error('Error creating folder:', error)
      if (error.response?.data?.message) {
        showError(error.response.data.message)
      } else {
        showError('Folder with this name already exists in current path')
      }
    }
  }

  const handleRenameFolder = async (folderId, newName) => {
    try {
      await api.patch(`/api/v1/folder/rename/${folderId}`, { name: newName })
      setRenameItem(null)
      await fetchContents()
    } catch (error) {
      console.error('Error renaming folder:', error)
      showError('Failed to rename folder')
    }
  }

  const handleDeleteFolder = async (folderId) => {
    if (!window.confirm('Are you sure you want to delete this folder?')) return

    try {
      await api.delete(`/api/v1/folder/${folderId}`)
      await fetchContents()
    } catch (error) {
      console.error('Error deleting folder:', error)
      showError('Failed to delete folder')
    }
  }

  const handleRenameFile = async (fileId, newName) => {
    try {
      await api.patch(`/api/v1/file/rename/${fileId}`, { newName: newName })
      setRenameItem(null)
      await fetchContents()
    } catch (error) {
      console.error('Error renaming file:', error)
      showError('Failed to rename file')
    }
  }

  const handleDeleteFile = async (fileId) => {
    if (!window.confirm('Are you sure you want to delete this file?')) return

    try {
      await api.delete(`/api/v1/file/${fileId}`)
      await fetchContents()
    } catch (error) {
      console.error('Error deleting file:', error)
      showError('Failed to delete file')
    }
  }

  const showError = (message) => {
    setErrorMessage(message)
    setTimeout(() => setErrorMessage(''), 3000)
  }

  const showSuccess = (message) => {
    setSuccessMessage(message)
    setTimeout(() => setSuccessMessage(''), 3000)
  }

  const handleDownloadFile = async (fileId, fileName) => {
    try {
      const response = await api.get(`/download/${fileId}`)
      let downloadUrl = response.data.data.downloadUrl

      // Add Cloudinary download parameters to preserve filename
      // Format: /upload/fl_attachment/v123.../path
      if (downloadUrl.includes('/upload/')) {
        // Simply add fl_attachment flag to force download
        downloadUrl = downloadUrl.replace('/upload/', '/upload/fl_attachment/')
      }

      // Create a temporary anchor element to trigger download
      const link = document.createElement('a')
      link.href = downloadUrl
      link.download = fileName
      link.target = '_blank'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      showSuccess('Download completed successfully!')
    } catch (error) {
      console.error('Error downloading file:', error)
      showError('Failed to download file')
    }
  }

  const handleFileClick = async (file) => {
    try {
      const response = await api.get(`/download/${file._id}`)
      const fileUrl = response.data.data.downloadUrl
      setPreviewFile({ ...file, url: fileUrl })
    } catch (error) {
      console.error('Error getting file URL:', error)
      showError('Failed to preview file')
    }
  }

  const navigateToFolder = (folder) => {
    setCurrentFolderId(folder._id)
    setBreadcrumbs([...breadcrumbs, { id: folder._id, name: folder.name }])
  }

  const navigateToBreadcrumb = (index) => {
    const crumb = breadcrumbs[index]
    setCurrentFolderId(crumb.id)
    setBreadcrumbs(breadcrumbs.slice(0, index + 1))
  }

  const handleContextMenu = (e, item, type) => {
    e.preventDefault()
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      item,
      type
    })
  }

  const getFileIcon = (fileName, large = false) => {
    const ext = fileName.split('.').pop().toLowerCase()
    const size = large ? "w-24 h-24" : "w-6 h-6"

    if (['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'].includes(ext)) {
      return <FileImage className={size} fill="currentColor" />
    } else if (['mp4', 'avi', 'mov', 'mkv'].includes(ext)) {
      return <FileVideo className={size} fill="currentColor" />
    } else if (['mp3', 'wav', 'ogg', 'flac'].includes(ext)) {
      return <FileAudio className={size} fill="currentColor" />
    } else if (['zip', 'rar', '7z', 'tar', 'gz'].includes(ext)) {
      return <FileArchive className={size} fill="currentColor" />
    } else if (['txt', 'md', 'doc', 'docx', 'pdf'].includes(ext)) {
      return <FileText className={size} fill="currentColor" />
    } else {
      return <File className={size} fill="currentColor" />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-cyan-900 to-blue-900 relative overflow-hidden">
      {/* Animated background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.3, 1.1, 1],
            x: [0, 120, -50, 0],
            y: [0, 80, -40, 0],
            rotate: [0, 90, 180, 360],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-gradient-to-br from-cyan-400 via-cyan-500 to-blue-500 rounded-full mix-blend-screen filter blur-3xl opacity-20"
        ></motion.div>
        <motion.div
          animate={{
            scale: [1, 1.4, 1.2, 1],
            x: [0, -100, 80, 0],
            y: [0, 100, -60, 0],
            rotate: [0, -90, -180, -360],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute -top-32 -right-32 w-[600px] h-[600px] bg-gradient-to-br from-blue-400 via-cyan-400 to-teal-500 rounded-full mix-blend-screen filter blur-3xl opacity-15"
        ></motion.div>
      </div>

      {/* Success Notification */}
      <AnimatePresence>
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-24 right-6 z-50 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3"
          >
            <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-white"></div>
            </div>
            <p>{successMessage}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error Notification */}
      <AnimatePresence>
        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-24 left-1/2 transform -translate-x-1/2 z-50 bg-red-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3"
          >
            <X className="w-5 h-5" />
            <p>{errorMessage}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Context Menu */}
      <AnimatePresence>
        {contextMenu && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            style={{ top: contextMenu.y, left: contextMenu.x }}
            className="fixed z-50 bg-slate-800 border border-cyan-500/20 rounded-lg shadow-xl overflow-hidden min-w-[160px]"
          >
            {contextMenu.type === 'file' && (
              <button
                onClick={() => {
                  handleDownloadFile(contextMenu.item._id, contextMenu.item.name)
                  setContextMenu(null)
                }}
                className="w-full px-4 py-2 text-left text-white hover:bg-slate-700 flex items-center gap-2 transition-colors"
              >
                <Download className="w-4 h-4" />
                Download
              </button>
            )}
            <button
              onClick={() => {
                setRenameItem(contextMenu.item)
                setContextMenu(null)
              }}
              className="w-full px-4 py-2 text-left text-white hover:bg-slate-700 flex items-center gap-2 transition-colors"
            >
              <Edit2 className="w-4 h-4" />
              Rename
            </button>
            <button
              onClick={() => {
                if (contextMenu.type === 'folder') {
                  handleDeleteFolder(contextMenu.item._id)
                } else {
                  handleDeleteFile(contextMenu.item._id)
                }
                setContextMenu(null)
              }}
              className="w-full px-4 py-2 text-left text-red-400 hover:bg-slate-700 flex items-center gap-2 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Rename Modal */}
      <AnimatePresence>
        {renameItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm"
            onClick={() => setRenameItem(null)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-slate-800 border border-cyan-500/20 rounded-2xl p-6 max-w-md w-full mx-4"
            >
              <h3 className="text-xl font-bold text-white mb-4">Rename {renameItem.type || 'Item'}</h3>
              <input
                type="text"
                defaultValue={renameItem.name}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    const newName = e.target.value
                    if (renameItem.type === 'folder') {
                      handleRenameFolder(renameItem._id, newName)
                    } else {
                      handleRenameFile(renameItem._id, newName)
                    }
                  }
                }}
                placeholder="New name"
                className="w-full px-4 py-3 bg-slate-700 border-2 border-slate-600 text-white placeholder-slate-400 rounded-lg focus:outline-none focus:border-cyan-500 mb-4"
                autoFocus
              />
              <div className="flex gap-3">
                <motion.button
                  whileHover={{ boxShadow: '0 0 15px rgba(34, 211, 238, 0.5)' }}
                  whileTap={{ scale: 0.95 }}
                  onClick={(e) => {
                    const input = e.target.closest('.bg-slate-800').querySelector('input')
                    const newName = input.value
                    if (renameItem.type === 'folder') {
                      handleRenameFolder(renameItem._id, newName)
                    } else {
                      handleRenameFile(renameItem._id, newName)
                    }
                  }}
                  className="flex-1 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition-colors"
                >
                  Rename
                </motion.button>
                <motion.button
                  whileHover={{ boxShadow: '0 0 15px rgba(100, 116, 139, 0.5)' }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setRenameItem(null)}
                  className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
                >
                  Cancel
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* File Preview Modal */}
      <AnimatePresence>
        {previewFile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/90 backdrop-blur-sm p-4"
            onClick={() => setPreviewFile(null)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-slate-800 border border-cyan-500/20 rounded-2xl max-w-5xl w-full max-h-[90vh] flex flex-col overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-slate-700">
                <div className="flex items-center gap-3">
                  <div className="text-cyan-400">
                    {getFileIcon(previewFile.name, false)}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">{previewFile.name}</h3>
                    <p className="text-slate-400 text-sm">{(previewFile.size / 1024).toFixed(1)} KB</p>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setPreviewFile(null)}
                  className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6 text-slate-400 hover:text-white" />
                </motion.button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-auto p-6 bg-slate-900/50">
                {(() => {
                  const ext = previewFile.name.split('.').pop().toLowerCase()

                  // Images
                  if (['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'].includes(ext)) {
                    console.log('Rendering image with URL:', previewFile.url)
                    return (
                      <div className="flex items-center justify-center w-full">
                        <img
                          src={previewFile.url}
                          alt={previewFile.name}
                          onLoad={() => console.log('Image loaded successfully')}
                          onError={(e) => console.error('Image failed to load:', e)}
                          className="max-w-full max-h-[70vh] object-contain rounded-lg shadow-lg"
                        />
                      </div>
                    )
                  }

                  // Videos
                  if (['mp4', 'avi', 'mov', 'mkv', 'webm'].includes(ext)) {
                    return (
                      <video
                        src={previewFile.url}
                        controls
                        className="max-w-full h-auto mx-auto rounded-lg"
                      >
                        Your browser does not support video playback.
                      </video>
                    )
                  }

                  // PDFs
                  if (ext === 'pdf') {
                    return (
                      <iframe
                        src={previewFile.url}
                        className="w-full h-[70vh] rounded-lg"
                        title={previewFile.name}
                      />
                    )
                  }

                  // Audio
                  if (['mp3', 'wav', 'ogg', 'flac'].includes(ext)) {
                    return (
                      <div className="flex flex-col items-center justify-center h-64">
                        <FileAudio className="w-24 h-24 text-cyan-400 mb-6" />
                        <audio
                          src={previewFile.url}
                          controls
                          className="w-full max-w-md"
                        >
                          Your browser does not support audio playback.
                        </audio>
                      </div>
                    )
                  }

                  // Other files - show download option
                  return (
                    <div className="flex flex-col items-center justify-center h-64 text-center">
                      <File className="w-24 h-24 text-slate-500 mb-4" />
                      <p className="text-slate-400 mb-6">Preview not available for this file type</p>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleDownloadFile(previewFile._id, previewFile.name)}
                        className="px-6 py-3 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg flex items-center gap-2 transition-colors"
                      >
                        <Download className="w-5 h-5" />
                        Download File
                      </motion.button>
                    </div>
                  )
                })()}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Welcome Message */}
      <AnimatePresence>
        {showWelcome && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/90 backdrop-blur-sm"
          >
            <motion.div
              initial={{ y: 20 }}
              animate={{ y: 0 }}
              className="text-center"
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 0.5, repeat: 3 }}
              >
                <Sparkles className="w-20 h-20 text-cyan-400 mx-auto mb-4" />
              </motion.div>
              <h1 className="text-5xl font-bold text-white mb-2">
                Welcome, {user?.username}!
              </h1>
              <p className="text-cyan-300 text-lg">Let's get started with LabDrop</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Bar */}
      <motion.div
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="relative z-10 bg-slate-800/90 backdrop-blur-xl border-b border-cyan-500/20 px-6 py-4"
      >
        <div className="flex items-center justify-between">
          {/* Left: Logo */}
          <motion.div
            className="flex items-center gap-3 cursor-pointer"
            whileHover="hover"
          >
            <motion.div
              variants={{
                hover: {
                  rotate: [0, -10, 10, -10, 10, 0],
                  scale: [1, 1.2, 1.2, 1.2, 1.2, 1],
                }
              }}
              transition={{ duration: 0.6 }}
            >
              <Sparkles className="w-8 h-8 text-cyan-400" />
            </motion.div>
            <h1 className="text-2xl font-bold text-white">LabDrop</h1>
          </motion.div>

          {/* Right: User Info & Logout */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-700/50 rounded-lg border border-slate-600">
              <User className="w-5 h-5 text-cyan-400" />
              <span className="text-white font-medium">{user?.username}</span>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Main Content - Split Screen */}
      <div className="relative z-10 h-[calc(100vh-80px)] flex flex-col">
        {/* Top Section: Drag & Drop Upload */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={isExpanded ? "h-0 overflow-hidden" : "flex-1 p-4"}
        >
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`h-full rounded-2xl transition-all duration-500 flex flex-col items-center justify-center relative overflow-hidden ${isDragging
              ? 'border-4 border-solid border-cyan-400 bg-cyan-500/10 shadow-[0_0_30px_rgba(34,211,238,0.6)]'
              : 'border-4 border-dashed border-slate-600 bg-slate-800/50'
              }`}
          >
            {uploading ? (
              <div className="text-center w-full max-w-md px-4 relative z-10">
                <p className="text-white text-lg font-semibold mb-4">Uploading files...</p>
                <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${uploadProgress}%` }}
                    className="h-full bg-gradient-to-r from-cyan-500 to-blue-500"
                  />
                </div>
                <p className="text-cyan-300 text-sm mt-2">{uploadProgress}%</p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center relative z-10 w-full">
                <motion.div
                  animate={isDragging ? { scale: [1, 1.2, 1] } : {}}
                  transition={{ duration: 0.5, repeat: isDragging ? Infinity : 0 }}
                >
                  <Cloud className={`w-20 h-20 mb-4 ${isDragging ? 'text-cyan-400' : 'text-slate-500'}`} />
                </motion.div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  {isDragging ? 'Drop files or folders here' : 'Drag & Drop Files or Folders'}
                </h2>
                <p className="text-slate-400 mb-6">or click to browse</p>
                <input
                  type="file"
                  multiple
                  webkitdirectory=""
                  directory=""
                  onChange={handleFileSelect}
                  className="hidden"
                  id="folder-input"
                />
                <input
                  type="file"
                  multiple
                  onChange={handleFileSelect}
                  className="hidden"
                  id="file-input"
                />
                <div className="flex gap-4">
                  <label htmlFor="file-input">
                    <motion.div
                      whileHover={{ scale: 1.05, borderColor: 'rgb(34, 211, 238)' }}
                      whileTap={{ scale: 0.95 }}
                      className="px-6 py-3 bg-transparent border-2 border-slate-600 text-white rounded-lg font-semibold cursor-pointer flex items-center gap-2 hover:border-cyan-400 transition-colors"
                    >
                      <Upload className="w-5 h-5" />
                      Choose Files
                    </motion.div>
                  </label>
                  <label htmlFor="folder-input">
                    <motion.div
                      whileHover={{ scale: 1.05, borderColor: 'rgb(34, 211, 238)' }}
                      whileTap={{ scale: 0.95 }}
                      className="px-6 py-3 bg-transparent border-2 border-slate-600 text-white rounded-lg font-semibold cursor-pointer flex items-center gap-2 hover:border-cyan-400 transition-colors"
                    >
                      <Folder className="w-5 h-5" />
                      Choose Folder
                    </motion.div>
                  </label>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Bottom Section: Files & Folders */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className={isExpanded ? "flex-1 p-4 overflow-hidden" : "flex-1 p-4 overflow-hidden"}
        >
          <div className="bg-slate-800/70 backdrop-blur-xl border border-cyan-500/20 rounded-2xl p-6 h-full flex flex-col">
            {/* Header with Expand Toggle */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Folder className="w-6 h-6 text-cyan-400" />
                <h2 className="text-2xl font-bold text-white">Your Files & Folders</h2>
              </div>
              <motion.button
                whileHover={{ boxShadow: '0 0 15px rgba(34, 211, 238, 0.5)' }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-2 bg-transparent border-2 border-slate-600 hover:border-cyan-400 text-cyan-400 rounded-lg transition-all"
                title={isExpanded ? "Collapse" : "Expand"}
              >
                <motion.div
                  animate={{ rotate: isExpanded ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChevronRight className="w-5 h-5 transform rotate-90" />
                </motion.div>
              </motion.button>
            </div>

            {/* Breadcrumb Navigation */}
            <div className="flex items-center gap-2 mb-4 overflow-x-auto">
              {breadcrumbs.map((crumb, index) => (
                <React.Fragment key={crumb.id || 'home'}>
                  <motion.button
                    whileHover={{ textShadow: '0 0 10px rgba(34, 211, 238, 0.8)' }}
                    onClick={() => navigateToBreadcrumb(index)}
                    className={`flex items-center gap-2 px-3 py-1 rounded transition-all ${index === breadcrumbs.length - 1
                      ? 'text-cyan-400'
                      : 'text-slate-400 hover:text-slate-200'
                      }`}
                  >
                    {index === 0 && <HomeIcon className="w-4 h-4" />}
                    {crumb.name}
                  </motion.button>
                  {index < breadcrumbs.length - 1 && (
                    <ChevronRight className="w-4 h-4 text-slate-500" />
                  )}
                </React.Fragment>
              ))}
            </div>

            {/* Create Folder Modal */}
            <AnimatePresence>
              {showCreateFolder && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm"
                  onClick={() => setShowCreateFolder(false)}
                >
                  <motion.div
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0.9 }}
                    onClick={(e) => e.stopPropagation()}
                    className="bg-slate-800 border border-cyan-500/20 rounded-2xl p-6 max-w-md w-full mx-4"
                  >
                    <h3 className="text-xl font-bold text-white mb-4">Create New Folder</h3>
                    <input
                      type="text"
                      value={newFolderName}
                      onChange={(e) => setNewFolderName(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleCreateFolder()}
                      placeholder="Folder name"
                      className="w-full px-4 py-3 bg-slate-700 border-2 border-slate-600 text-white placeholder-slate-400 rounded-lg focus:outline-none focus:border-cyan-500 mb-4"
                      autoFocus
                    />
                    <div className="flex gap-3">
                      <motion.button
                        whileHover={{ boxShadow: '0 0 15px rgba(34, 211, 238, 0.5)' }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleCreateFolder}
                        className="flex-1 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition-colors"
                      >
                        Create
                      </motion.button>
                      <motion.button
                        whileHover={{ boxShadow: '0 0 15px rgba(100, 116, 139, 0.5)' }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowCreateFolder(false)}
                        className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
                      >
                        Cancel
                      </motion.button>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Files and Folders Grid */}
            {loading ? (
              <div className="flex items-center justify-center flex-1">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full"
                />
              </div>
            ) : (
              <div
                className="grid gap-6 flex-1 overflow-y-auto pr-2"
                style={{
                  gridTemplateColumns: 'repeat(auto-fill, 120px)',
                  justifyItems: 'start',
                  scrollBehavior: 'smooth'
                }}
              >
                {/* Folders */}
                {folders.map((folder) => (
                  <motion.div
                    key={folder._id}
                    onClick={() => navigateToFolder(folder)}
                    onContextMenu={(e) => handleContextMenu(e, { ...folder, type: 'folder' }, 'folder')}
                    className="flex flex-col items-center cursor-pointer group"
                  >
                    <div className="relative">
                      <Folder className="w-24 h-24 text-slate-400 group-hover:text-cyan-400 transition-colors" fill="currentColor" />
                    </div>
                    <p className="text-slate-300 group-hover:text-cyan-400 text-sm font-medium truncate mt-2 w-full text-center transition-colors">{folder.name}</p>
                    <p className="text-slate-500 text-xs mt-1">
                      {folder.files?.length || 0} items
                    </p>
                  </motion.div>
                ))}

                {/* Files */}
                {files.map((file) => (
                  <motion.div
                    key={file._id}
                    onClick={() => handleFileClick(file)}
                    onContextMenu={(e) => handleContextMenu(e, { ...file, type: 'file' }, 'file')}
                    className="flex flex-col items-center cursor-pointer group"
                  >
                    <div className="relative text-slate-400 group-hover:text-cyan-400 transition-colors">
                      {getFileIcon(file.name, true)}
                    </div>
                    <p className="text-slate-300 group-hover:text-cyan-400 text-sm font-medium truncate mt-2 w-full text-center transition-colors">{file.name}</p>
                    <p className="text-slate-500 text-xs mt-1">
                      {(file.size / 1024).toFixed(1)} KB
                    </p>
                  </motion.div>
                ))}

                {/* Create Folder Button */}
                <motion.div
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowCreateFolder(true)}
                  className="flex flex-col items-center cursor-pointer group"
                >
                  <div className="w-24 h-24 border-2 border-dashed border-slate-600 group-hover:border-cyan-400 rounded-lg flex items-center justify-center transition-colors">
                    <FolderPlus className="w-12 h-12 text-slate-600 group-hover:text-cyan-400 transition-colors" />
                  </div>
                  <p className="text-slate-400 group-hover:text-cyan-400 text-sm font-medium mt-2 transition-colors">New Folder</p>
                </motion.div>

                {/* Empty State */}
                {folders.length === 0 && files.length === 0 && (
                  <div className="col-span-full flex flex-col items-center justify-center py-16">
                    <Cloud className="w-20 h-20 text-slate-600 mb-4" />
                    <p className="text-slate-400 text-lg">No files yet</p>
                    <p className="text-slate-500 text-sm">Upload some files to get started</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Home
