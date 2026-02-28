import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Cloud, Shield, Lock } from 'lucide-react';

const Loading = () => {
    // Letter animation 
    const letterVariants = {
        hidden: { opacity: 0, y: 40, filter: 'blur(10px)' },
        visible: (i) => ({
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            transition: {
                delay: i * 0.15,
                duration: 0.8,
                ease: [0.34, 1.56, 0.64, 1],
            },
        }),
    };

    const labLetters = ['L', 'a', 'b'];
    const dropLetters = ['D', 'r', 'o', 'p'];

    // Cloud icon animation instead of water drop
    const cloudPulseVariants = {
        animate: (i) => ({
            y: [0, -15, 0],
            opacity: [0.6, 1, 0.6],
            scale: [0.95, 1.05, 0.95],
            transition: {
                delay: (labLetters.length + 2) * 0.15 + 0.5,
                duration: 2.5,
                repeat: Infinity,
                repeatDelay: 2,
                ease: 'easeInOut',
            },
        }),
    };

    // Scanning line animation
    const scanLineVariants = {
        animate: {
            x: ['-100%', '100%'],
            opacity: [0, 0.8, 0],
            transition: {
                delay: 1.5,
                duration: 2,
                repeat: Infinity,
                repeatDelay: 2.5,
                ease: 'easeInOut',
            },
        },
    };

    // Smooth progress bar
    const progressVariants = {
        animate: {
            width: ['0%', '100%'],
            transition: {
                delay: 1.2,
                duration: 8.5,
                ease: 'easeInOut',
            },
        },
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-950 flex items-center justify-center overflow-hidden relative">
            
            {/* Dynamic Background Orbs - Matching Website Theme */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {/* Primary cyan blob */}
                <motion.div
                    animate={{
                        scale: [1, 1.3, 1.1, 1],
                        x: [0, 100, -50, 0],
                        y: [0, 50, -30, 0],
                        rotate: [0, 90, 180, 360],
                    }}
                    transition={{
                        duration: 25,
                        repeat: Infinity,
                        ease: 'easeInOut',
                    }}
                    className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-gradient-to-br from-cyan-500/20 via-cyan-600/15 to-blue-600/10 rounded-full mix-blend-screen filter blur-3xl"
                />
                
                {/* Secondary blue blob */}
                <motion.div
                    animate={{
                        scale: [1, 1.4, 1.2, 1],
                        x: [0, -80, 60, 0],
                        y: [0, 80, -50, 0],
                        rotate: [0, -90, -180, -360],
                    }}
                    transition={{
                        duration: 28,
                        repeat: Infinity,
                        ease: 'easeInOut',
                    }}
                    className="absolute -top-40 -right-40 w-[700px] h-[700px] bg-gradient-to-br from-blue-500/20 via-cyan-500/15 to-teal-600/10 rounded-full mix-blend-screen filter blur-3xl"
                />

                {/* Tertiary teal blob */}
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1.3, 1],
                        x: [0, 70, -80, 0],
                        y: [0, -60, 40, 0],
                        rotate: [0, 120, 240, 360],
                    }}
                    transition={{
                        duration: 30,
                        repeat: Infinity,
                        ease: 'easeInOut',
                    }}
                    className="absolute -bottom-40 left-1/4 w-[650px] h-[650px] bg-gradient-to-br from-teal-500/15 via-cyan-600/10 to-blue-700/10 rounded-full mix-blend-screen filter blur-3xl"
                />

                {/* Fourth accent blob */}
                <motion.div
                    animate={{
                        scale: [1, 1.25, 1.15, 1],
                        x: [0, -60, 90, 0],
                        y: [0, 60, -40, 0],
                        rotate: [0, -120, -240, -360],
                    }}
                    transition={{
                        duration: 32,
                        repeat: Infinity,
                        ease: 'easeInOut',
                    }}
                    className="absolute bottom-1/3 -right-40 w-[550px] h-[550px] bg-gradient-to-br from-cyan-400/15 via-blue-500/10 to-indigo-600/8 rounded-full mix-blend-screen filter blur-3xl"
                />
            </div>

            {/* Noise texture overlay */}
            <div className="absolute inset-0 opacity-10 pointer-events-none" style={{
                backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255, 255, 255, 0.05) 1px, transparent 0)`,
                backgroundSize: '50px 50px'
            }}></div>

            {/* Main Content */}
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="relative z-10 flex flex-col items-center justify-center gap-16 px-4"
            >
                {/* Logo Container */}
                <motion.div className="relative">
                    {/* Main LabDrop Text */}
                    <div className="flex items-center gap-3">
                        {/* "Lab" */}
                        <motion.div className="flex gap-1">
                            {labLetters.map((letter, i) => (
                                <motion.span
                                    key={`lab-${i}`}
                                    custom={i}
                                    variants={letterVariants}
                                    initial="hidden"
                                    animate="visible"
                                    className="text-7xl md:text-8xl lg:text-9xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-cyan-400 to-blue-400"
                                >
                                    {letter}
                                </motion.span>
                            ))}
                        </motion.div>

                        {/* "Drop" with special cloud icon on "o" */}
                        <motion.div className="flex gap-1 items-center">
                            {dropLetters.map((letter, i) => {
                                const globalIndex = labLetters.length + i;

                                if (letter === 'o') {
                                    return (
                                        <motion.div
                                            key={`drop-${i}`}
                                            custom={globalIndex}
                                            variants={letterVariants}
                                            initial="hidden"
                                            animate="visible"
                                            className="relative inline-flex items-center justify-center"
                                        >
                                            {/* Cloud Icon replacing "o" */}
                                            <motion.div
                                                custom={globalIndex}
                                                variants={cloudPulseVariants}
                                                animate="animate"
                                                className="text-cyan-400 drop-shadow-lg"
                                            >
                                                <Cloud size={90} strokeWidth={1.5} fill="currentColor" fillOpacity={0.2} />
                                            </motion.div>

                                            {/* Subtle glow around cloud */}
                                            <motion.div
                                                className="absolute inset-0 rounded-full"
                                                animate={{
                                                    boxShadow: [
                                                        '0 0 30px rgba(34, 211, 238, 0.4)',
                                                        '0 0 50px rgba(34, 211, 238, 0.6)',
                                                        '0 0 30px rgba(34, 211, 238, 0.4)',
                                                    ],
                                                }}
                                                transition={{
                                                    delay: globalIndex * 0.15 + 0.5,
                                                    duration: 2.5,
                                                    repeat: Infinity,
                                                    repeatDelay: 2,
                                                }}
                                            />
                                        </motion.div>
                                    );
                                }

                                return (
                                    <motion.span
                                        key={`drop-${i}`}
                                        custom={globalIndex}
                                        variants={letterVariants}
                                        initial="hidden"
                                        animate="visible"
                                        className="text-7xl md:text-8xl lg:text-9xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-cyan-400 to-blue-400"
                                    >
                                        {letter}
                                    </motion.span>
                                );
                            })}
                        </motion.div>
                    </div>

                    {/* Scanning highlight line */}
                    <motion.div
                        variants={scanLineVariants}
                        animate="animate"
                        className="absolute -bottom-8 left-0 h-1 w-full bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent blur-md"
                    />
                </motion.div>

                {/* Status Text */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.5, duration: 0.8 }}
                    className="text-center space-y-3"
                >
                    <p className="text-cyan-200/80 text-sm font-medium tracking-widest uppercase">
                        Initializing Secure Cloud
                    </p>
                    <p className="text-slate-400/60 text-xs font-light">
                        Setting up your personal assignment backup
                    </p>
                </motion.div>

                {/* Progress Bar */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2, duration: 0.8 }}
                    className="w-72 md:w-96 h-1 bg-slate-700/50 rounded-full overflow-hidden backdrop-blur-sm border border-cyan-400/20"
                >
                    <motion.div
                        className="h-full bg-gradient-to-r from-cyan-500/0 via-cyan-400 to-cyan-500/0"
                        variants={progressVariants}
                        animate="animate"
                    />
                </motion.div>

                {/* Smooth Loading Dots */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.4, duration: 0.6 }}
                    className="flex gap-2 items-center"
                >
                    {[0, 1, 2].map((i) => (
                        <motion.div
                            key={i}
                            animate={{
                                scale: [1, 1.3, 1],
                                opacity: [0.4, 1, 0.4],
                            }}
                            transition={{
                                delay: 1.6 + i * 0.2,
                                duration: 1.4,
                                repeat: Infinity,
                                ease: 'easeInOut',
                            }}
                            className="w-2 h-2 rounded-full bg-gradient-to-br from-cyan-400 to-blue-400"
                        />
                    ))}
                </motion.div>

                {/* Feature Icons */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 2.5, duration: 0.8 }}
                    className="flex gap-8 mt-8"
                >
                    <motion.div
                        animate={{ y: [0, -8, 0] }}
                        transition={{ delay: 2.7, duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                        className="text-cyan-400/70 flex flex-col items-center gap-2"
                    >
                        <Cloud size={32} strokeWidth={1.5} />
                        <span className="text-xs text-slate-400 font-light">Cloud Storage</span>
                    </motion.div>
                    <motion.div
                        animate={{ y: [0, -8, 0] }}
                        transition={{ delay: 2.85, duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                        className="text-cyan-400/70 flex flex-col items-center gap-2"
                    >
                        <Shield size={32} strokeWidth={1.5} />
                        <span className="text-xs text-slate-400 font-light">Secured</span>
                    </motion.div>
                    <motion.div
                        animate={{ y: [0, -8, 0] }}
                        transition={{ delay: 3.0, duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                        className="text-cyan-400/70 flex flex-col items-center gap-2"
                    >
                        <Lock size={32} strokeWidth={1.5} />
                        <span className="text-xs text-slate-400 font-light">Private</span>
                    </motion.div>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default Loading;
