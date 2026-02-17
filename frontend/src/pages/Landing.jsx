import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import { ArrowRight, LogIn, UploadCloud, Shield, Database, CheckCircle, ArrowUp } from 'lucide-react';

const Landing = () => {
    const navigate = useNavigate();

    // int this we have typing animation state
    const [text, setText] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);
    const [loopNum, setLoopNum] = useState(0);
    const [typingSpeed, setTypingSpeed] = useState(150);

    const toRotate = ["LabDrop"];
    const period = 2000;

    useEffect(() => {
        let ticker = setInterval(() => {
            tick();
        }, typingSpeed);
        return () => { clearInterval(ticker) };
    }, [text]);

    const tick = () => {
        let i = loopNum % toRotate.length;
        let fullText = toRotate[i];
        let updatedText = isDeleting ? fullText.substring(0, text.length - 1) : fullText.substring(0, text.length + 1);

        setText(updatedText);

        if (isDeleting) setTypingSpeed(50);

        if (!isDeleting && updatedText === fullText) {
            setIsDeleting(true);
            setTypingSpeed(period);
        } else if (isDeleting && updatedText === '') {
            setIsDeleting(false);
            setLoopNum(loopNum + 1);
            setTypingSpeed(150);
        }
    };

    // Text State
    const rotatingTexts = [
        "Secure Cloud Storage",
        "Smart Assignment Backup",
        "Never Lose Your Work Again",
        "Smart Solution for College Students"
    ];
    const [rotateIndex, setRotateIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setRotateIndex((prev) => (prev + 1) % rotatingTexts.length);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    // Backup Card Simulation State
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isBackupComplete, setIsBackupComplete] = useState(false);

    useEffect(() => {
        let progressInterval;
        const startSimulation = () => {
            setUploadProgress(0);
            setIsBackupComplete(false);
            progressInterval = setInterval(() => {
                setUploadProgress((prev) => {
                    if (prev >= 100) {
                        clearInterval(progressInterval);
                        setIsBackupComplete(true);
                        setTimeout(startSimulation, 3000);
                        return 100;
                    }
                    return prev + 1;
                });
            }, 50);
        };
        startSimulation();
        return () => clearInterval(progressInterval);
    }, []);

    // --- Mouse Spotlight Logic ---
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const springConfig = { damping: 25, stiffness: 700 };
    const springX = useSpring(mouseX, springConfig);
    const springY = useSpring(mouseY, springConfig);

    useEffect(() => {
        const handleMouseMove = (e) => {
            mouseX.set(e.clientX);
            mouseY.set(e.clientY);
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    // --- Complex Background Elements ---
    const geometricShapes = Array.from({ length: 5 }).map((_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 100 + 50,
        rotation: Math.random() * 360,
        duration: Math.random() * 30 + 20,
        delay: Math.random() * 10
    }));

    const dataLines = Array.from({ length: 8 }).map((_, i) => ({
        id: i,
        x: Math.random() * 100,
        height: Math.random() * 200 + 100,
        duration: Math.random() * 5 + 3,
        delay: Math.random() * 5
    }));

    const particles = Array.from({ length: 25 }).map((_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 3 + 1,
        duration: Math.random() * 20 + 10,
        delay: Math.random() * 5
    }));

    // --- Interactive Project Description Logic ---
    const descriptionText = "In colleges, students often lose their assignments due to system crashes, misplaced files, or accidental deletion. LabDrop solves this problem by providing a secure cloud-based backup system where students can upload, organize, and safely store their academic work.";

    // Keyword Analysis
    const problemKeywords = ["lose", "crashes", "misplaced", "deletion", "problem", "accidental"];
    const solutionKeywords = ["LabDrop", "solves", "secure", "cloud-based", "backup", "upload", "organize", "safely", "store"];

    const getWordStyle = (word) => {
        const cleanWord = word.replace(/[.,]/g, ''); // Remove punctuation for checking
        if (solutionKeywords.includes(cleanWord)) {
            return "text-cyan-400 font-medium drop-shadow-[0_0_8px_rgba(34,211,238,0.5)] cursor-pointer";
        }
        if (problemKeywords.includes(cleanWord)) {
            return "text-rose-300/90 font-medium decoration-rose-500/30 underline-offset-4 cursor-pointer";
        }
        return "text-slate-300";
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.02, delayChildren: 0.5 }
        }
    };

    const wordVariants = {
        hidden: { opacity: 0, y: 10, filter: 'blur(5px)' },
        visible: { opacity: 1, y: 0, filter: 'blur(0px)' }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-950 relative overflow-hidden flex items-center justify-center p-4">

            {/* Interactive Spotlight */}
            <motion.div
                className="absolute top-0 left-0 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none mix-blend-screen z-0"
                style={{ x: springX, y: springY, translateX: "-50%", translateY: "-50%" }}
            />

            {/* --- Layered Parallax Background --- */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
            <div className="absolute inset-0" style={{ backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255, 255, 255, 0.05) 1px, transparent 0)`, backgroundSize: '40px 40px' }}></div>


            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    animate={{ scale: [1, 1.2, 1], x: [0, 50, 0], y: [0, 30, 0], rotate: [0, 10, 0], opacity: [0.3, 0.5, 0.3] }}
                    transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -top-[20%] -left-[10%] w-[80vw] h-[80vw] bg-gradient-to-br from-cyan-600/10 via-blue-600/10 to-indigo-600/10 rounded-full blur-[100px]"
                />
                <motion.div
                    animate={{ scale: [1, 1.3, 1], x: [0, -50, 0], y: [0, -50, 0], rotate: [0, -10, 0], opacity: [0.2, 0.4, 0.2] }}
                    transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -bottom-[20%] -right-[10%] w-[80vw] h-[80vw] bg-gradient-to-br from-blue-700/10 via-purple-700/10 to-pink-700/10 rounded-full blur-[100px]"
                />
            </div>

            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {geometricShapes.map((shape) => (
                    <motion.div
                        key={shape.id}
                        className="absolute border border-cyan-500/10 rounded-xl"
                        style={{ left: `${shape.x}%`, top: `${shape.y}%`, width: shape.size, height: shape.size }}
                        animate={{ rotate: [0, 360], y: [0, -100], opacity: [0, 0.2, 0] }}
                        transition={{ duration: shape.duration, repeat: Infinity, delay: shape.delay, ease: "linear" }}
                    />
                ))}
                {dataLines.map((line) => (
                    <motion.div
                        key={line.id}
                        className="absolute w-[1px] bg-gradient-to-b from-transparent via-cyan-400/30 to-transparent"
                        style={{ left: `${line.x}%`, height: line.height, top: '-10%' }}
                        animate={{ y: ['0vh', '110vh'], opacity: [0, 1, 0] }}
                        transition={{ duration: line.duration, repeat: Infinity, delay: line.delay, ease: "linear" }}
                    />
                ))}
            </div>

            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {particles.map((particle) => (
                    <motion.div
                        key={particle.id}
                        className="absolute rounded-full bg-cyan-200/20 blur-[1px]"
                        style={{ left: `${particle.x}%`, top: `${particle.y}%`, width: particle.size, height: particle.size }}
                        animate={{ y: [0, -50], x: [0, Math.random() * 20 - 10], opacity: [0, 0.6, 0] }}
                        transition={{ duration: particle.duration, repeat: Infinity, delay: particle.delay, ease: "easeInOut" }}
                    />
                ))}
            </div>

            {/* Main Content Container */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="relative z-10 w-full max-w-7xl mx-auto px-4"
            >
                {/* Hero Panel - Open Layout */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-12 md:gap-24 relative w-full text-center md:text-left">

                    {/* Left Column: Text Content */}
                    <div className="flex-1 space-y-10 relative z-10">
                        <div>
                            {/* Typing Effect for LabDrop */}
                            <div className="h-24 md:h-32 flex items-center justify-center md:justify-start">
                                <h1 className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-400 to-indigo-400 tracking-tight drop-shadow-2xl">
                                    {text}
                                    <span className="animate-pulse text-cyan-400">|</span>
                                </h1>
                            </div>

                            {/* Rotating Animated Text */}
                            <div className="h-10 mt-4 overflow-hidden relative">
                                <AnimatePresence mode='wait'>
                                    <motion.div
                                        key={rotateIndex}
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        exit={{ y: -20, opacity: 0 }}
                                        transition={{ duration: 0.4 }}
                                        className="text-2xl md:text-3xl text-cyan-200/90 font-light tracking-wide absolute w-full"
                                    >
                                        {rotatingTexts[rotateIndex]}
                                    </motion.div>
                                </AnimatePresence>
                            </div>
                        </div>

                        {/* Interactive Project Description */}
                        <motion.div
                            className="bg-white/5 border border-white/5 rounded-2xl p-8 backdrop-blur-md shadow-inner group transition-all hover:bg-white/10 hover:border-white/10"
                        >
                            <motion.p
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                                className="leading-relaxed text-lg md:text-xl font-light flex flex-wrap gap-x-2 justify-center md:justify-start"
                            >
                                {descriptionText.split(" ").map((word, index) => (
                                    <motion.span
                                        key={index}
                                        variants={wordVariants}
                                        className={`inline-block transition-transform duration-200 hover:scale-110 ${getWordStyle(word)}`}
                                    >
                                        {word}
                                    </motion.span>
                                ))}
                            </motion.p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1.5, duration: 0.5 }}
                            className="flex flex-col sm:flex-row gap-6 pt-6 justify-center md:justify-start"
                        >
                            <motion.button
                                whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(6,182,212,0.4)" }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => navigate('/signup')}
                                className="px-10 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-lg font-bold rounded-xl shadow-lg flex items-center justify-center gap-3 group transition-all"
                            >
                                Get Started
                                <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                            </motion.button>

                            <motion.button
                                whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.05)" }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => navigate('/login')}
                                className="px-10 py-4 border border-cyan-400/30 text-cyan-300 text-lg font-semibold rounded-xl hover:border-cyan-400/60 hover:text-cyan-200 transition-all flex items-center justify-center gap-3 backdrop-blur-sm"
                            >
                                <LogIn className="w-6 h-6" />
                                Login
                            </motion.button>
                        </motion.div>
                    </div>

                    {/* Right Column: Animated Backup Card */}
                    <div className="w-full md:w-1/3 flex justify-center perspective-1000">
                        <motion.div
                            whileHover={{ scale: 1.05, rotateY: 5 }}
                            className="relative w-full max-w-sm"
                        >
                            <div className="absolute inset-0 bg-cyan-500/20 rounded-3xl blur-[60px] transform skew-y-6 animate-pulse"></div>

                            <div className="bg-slate-900/60 border border-cyan-500/20 p-8 rounded-3xl shadow-2xl relative z-10 backdrop-blur-3xl overflow-hidden ring-1 ring-white/10">

                                <div className="h-40 flex items-center justify-center mb-6 relative">
                                    <AnimatePresence mode='wait'>
                                        {!isBackupComplete ? (
                                            <motion.div
                                                key="uploading"
                                                initial={{ scale: 0.8, opacity: 0 }}
                                                animate={{ scale: 1, opacity: 1 }}
                                                exit={{ scale: 0.8, opacity: 0 }}
                                                className="relative"
                                            >
                                                <motion.div
                                                    animate={{ y: [-10, 10, -10] }}
                                                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                                >
                                                    <UploadCloud className="w-32 h-32 text-cyan-400 drop-shadow-[0_0_20px_rgba(34,211,238,0.4)]" />
                                                </motion.div>
                                                <motion.div
                                                    className="absolute inset-0 flex items-center justify-center pt-2"
                                                    animate={{ y: [5, -15, 5], opacity: [0, 1, 0] }}
                                                    transition={{ duration: 1.5, repeat: Infinity }}
                                                >
                                                    <ArrowUp className="w-10 h-10 text-white" />
                                                </motion.div>
                                            </motion.div>
                                        ) : (
                                            <motion.div
                                                key="complete"
                                                initial={{ scale: 0.5, opacity: 0 }}
                                                animate={{ scale: 1, opacity: 1 }}
                                                className="relative"
                                            >
                                                <motion.div
                                                    animate={{ scale: [1, 1.1, 1] }}
                                                    transition={{ duration: 2, repeat: Infinity }}
                                                >
                                                    <Shield className="w-32 h-32 text-emerald-400 drop-shadow-[0_0_25px_rgba(52,211,153,0.5)]" />
                                                </motion.div>
                                                <motion.div
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                    transition={{ delay: 0.2, type: "spring" }}
                                                    className="absolute -bottom-2 -right-2 bg-slate-900 rounded-full p-2 border border-slate-700"
                                                >
                                                    <CheckCircle className="w-8 h-8 text-emerald-400 fill-emerald-900/30" />
                                                </motion.div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                <div className="space-y-4">
                                    <div className="h-4 bg-slate-800 rounded-full w-full overflow-hidden border border-slate-700/50 relative">
                                        <motion.div
                                            className={`h-full rounded-full ${isBackupComplete ? 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]' : 'bg-gradient-to-r from-cyan-500 to-blue-600 shadow-[0_0_15px_rgba(6,182,212,0.5)]'}`}
                                            animate={{ width: `${uploadProgress}%` }}
                                            transition={{ ease: "linear" }}
                                        />
                                    </div>

                                    <div className="flex justify-between items-center">
                                        <motion.span
                                            className={`text-sm font-semibold transition-colors duration-300 ${isBackupComplete ? 'text-emerald-400' : 'text-cyan-400'}`}
                                        >
                                            {isBackupComplete ? "Backup Complete" : "Backing up..."}
                                        </motion.span>
                                        <span className="text-slate-400 text-xs font-mono">{uploadProgress}%</span>
                                    </div>

                                    <div className="flex justify-center gap-6 mt-6 pt-6 border-t border-white/5">
                                        {!isBackupComplete ? (
                                            <motion.div animate={{ rotate: 360 }} transition={{ duration: 3, repeat: Infinity, ease: "linear" }}>
                                                <Database className="w-6 h-6 text-blue-400" />
                                            </motion.div>
                                        ) : (
                                            <Database className="w-6 h-6 text-emerald-400" />
                                        )}
                                        <span className="text-slate-400 text-xs flex items-center gap-2">
                                            {isBackupComplete ? <span className="text-emerald-400">●</span> : <span className="text-blue-400 animate-pulse">●</span>}
                                            {isBackupComplete ? "100% Secure" : "Encrypting..."}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                </div>
            </motion.div>
        </div>
    );
};

export default Landing;
