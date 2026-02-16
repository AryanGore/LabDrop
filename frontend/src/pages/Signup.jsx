import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { Mail, Lock, Eye, EyeOff, User, ArrowRight, CheckCircle, Sparkles } from 'lucide-react'

function Signup() {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
    })
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)
    const { signup } = useAuth()
    const navigate = useNavigate()

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        })
        setError('')
    }

    const validateForm = () => {
        if (!formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
            setError('All fields are required')
            return false
        }

        if (formData.username.trim().length < 3) {
            setError('Username must be at least 3 characters long')
            return false
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(formData.email)) {
            setError('Please enter a valid email address')
            return false
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters long')
            return false
        }

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match')
            return false
        }

        return true
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')

        if (!validateForm()) {
            return
        }

        setLoading(true)

        try {
            await signup(formData.username, formData.email, formData.password)
            setSuccess(true)

            setTimeout(() => {
                navigate('/login')
            }, 2000)
        } catch (err) {
            setError(err.message)
            setLoading(false)
        }
    }

    if (success) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-cyan-900 to-blue-900 flex items-center justify-center p-4">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-slate-800 border border-cyan-500/20 rounded-2xl shadow-2xl p-8 max-w-md w-full text-center"
                >
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                        className="mb-6 flex justify-center"
                    >
                        <div className="p-5 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full">
                            <CheckCircle className="w-16 h-16 text-white" />
                        </div>
                    </motion.div>
                    <motion.h2
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="text-2xl font-bold text-white mb-2"
                    >
                        Account Created!
                    </motion.h2>
                    <motion.p
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="text-slate-300 mb-4"
                    >
                        Your account has been created successfully.
                    </motion.p>
                    <motion.p
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="text-sm text-cyan-300"
                    >
                        Redirecting to login page...
                    </motion.p>
                </motion.div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-cyan-900 to-blue-900 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Animated cyan background blobs */}
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
                    className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-gradient-to-br from-cyan-400 via-cyan-500 to-blue-500 rounded-full mix-blend-screen filter blur-3xl opacity-40"
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
                    className="absolute -top-32 -right-32 w-[600px] h-[600px] bg-gradient-to-br from-blue-400 via-cyan-400 to-teal-500 rounded-full mix-blend-screen filter blur-3xl opacity-35"
                ></motion.div>
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1.3, 1],
                        x: [0, 80, -70, 0],
                        y: [0, -80, 60, 0],
                        rotate: [0, 120, 240, 360],
                    }}
                    transition={{
                        duration: 28,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="absolute -bottom-32 left-1/4 w-[550px] h-[550px] bg-gradient-to-br from-teal-400 via-cyan-500 to-blue-600 rounded-full mix-blend-screen filter blur-3xl opacity-40"
                ></motion.div>
                <motion.div
                    animate={{
                        scale: [1, 1.25, 1.15, 1],
                        x: [0, -60, 90, 0],
                        y: [0, 70, -50, 0],
                        rotate: [0, -120, -240, -360],
                    }}
                    transition={{
                        duration: 32,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="absolute bottom-1/4 -right-32 w-[480px] h-[480px] bg-gradient-to-br from-cyan-300 via-blue-400 to-indigo-500 rounded-full mix-blend-screen filter blur-3xl opacity-30"
                ></motion.div>
            </div>

            <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="relative z-10 w-full max-w-md mx-auto"
            >
                <div className="bg-slate-800/90 backdrop-blur-xl border border-cyan-500/20 rounded-2xl shadow-2xl overflow-hidden">
                    {/* Header */}
                    <motion.div
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 px-8 py-8 relative overflow-hidden"
                    >
                        <motion.div
                            animate={{
                                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                            }}
                            transition={{
                                duration: 8,
                                repeat: Infinity,
                                ease: "linear"
                            }}
                            className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 via-blue-400/20 to-teal-400/20"
                            style={{ backgroundSize: '200% 200%' }}
                        ></motion.div>
                        <div className="relative z-10">
                            <div className="flex items-center gap-2 mb-2">
                                <Sparkles className="w-8 h-8 text-cyan-300" />
                                <h1 className="text-4xl font-bold text-white">LabDrop</h1>
                            </div>
                            <p className="text-cyan-100 text-sm">Create your account to get started</p>
                        </div>
                    </motion.div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="p-8">
                        {error && (
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg backdrop-blur-sm"
                            >
                                <p className="text-red-400 text-sm font-medium">{error}</p>
                            </motion.div>
                        )}

                        {/* Username Input */}
                        <motion.div
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="mb-5"
                        >
                            <label className="block text-sm font-semibold text-slate-200 mb-2">
                                Username
                            </label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-cyan-400" />
                                <input
                                    type="text"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    placeholder="johndoe"
                                    className="w-full pl-12 pr-4 py-3 bg-slate-700/50 border-2 border-slate-600 text-white placeholder-slate-400 rounded-lg focus:outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/20 transition-all text-sm"
                                    required
                                />
                            </div>
                        </motion.div>

                        {/* Email Input */}
                        <motion.div
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="mb-5"
                        >
                            <label className="block text-sm font-semibold text-slate-200 mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-cyan-400" />
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="you@example.com"
                                    className="w-full pl-12 pr-4 py-3 bg-slate-700/50 border-2 border-slate-600 text-white placeholder-slate-400 rounded-lg focus:outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/20 transition-all text-sm"
                                    required
                                />
                            </div>
                        </motion.div>

                        {/* Password Input */}
                        <motion.div
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="mb-5"
                        >
                            <label className="block text-sm font-semibold text-slate-200 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-cyan-400" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    className="w-full pl-12 pr-12 py-3 bg-slate-700/50 border-2 border-slate-600 text-white placeholder-slate-400 rounded-lg focus:outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/20 transition-all text-sm"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-cyan-400 transition-colors"
                                >
                                    {showPassword ? (
                                        <EyeOff className="w-5 h-5" />
                                    ) : (
                                        <Eye className="w-5 h-5" />
                                    )}
                                </button>
                            </div>
                        </motion.div>

                        {/* Confirm Password Input */}
                        <motion.div
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.6 }}
                            className="mb-6"
                        >
                            <label className="block text-sm font-semibold text-slate-200 mb-2">
                                Confirm Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-cyan-400" />
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    className="w-full pl-12 pr-12 py-3 bg-slate-700/50 border-2 border-slate-600 text-white placeholder-slate-400 rounded-lg focus:outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/20 transition-all text-sm"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-cyan-400 transition-colors"
                                >
                                    {showConfirmPassword ? (
                                        <EyeOff className="w-5 h-5" />
                                    ) : (
                                        <Eye className="w-5 h-5" />
                                    )}
                                </button>
                            </div>
                        </motion.div>

                        {/* Signup Button */}
                        <motion.button
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.7 }}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 text-white font-semibold py-3 rounded-lg hover:from-cyan-700 hover:via-blue-700 hover:to-indigo-700 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-cyan-500/50 hover:shadow-xl hover:shadow-cyan-500/60"
                        >
                            {loading ? (
                                <>
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                                    ></motion.div>
                                    Creating Account...
                                </>
                            ) : (
                                <>
                                    Create Account
                                    <ArrowRight className="w-5 h-5" />
                                </>
                            )}
                        </motion.button>
                    </form>

                    {/* Footer */}
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.8 }}
                        className="px-8 py-6 bg-slate-900/50 border-t border-slate-700 text-center"
                    >
                        <p className="text-slate-300 text-sm">
                            Already have an account?{' '}
                            <Link
                                to="/login"
                                className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors"
                            >
                                Sign in
                            </Link>
                        </p>
                    </motion.div>
                </div>

                {/* Security Info */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.9 }}
                    className="mt-8 text-center"
                >
                    <p className="text-cyan-300 text-xs flex items-center justify-center gap-2">
                        <span className="text-lg">🔒</span>
                        Your data is encrypted and secure
                    </p>
                </motion.div>
            </motion.div>
        </div>
    )
}

export default Signup
