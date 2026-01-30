import { useState } from 'react';
import { User, Building2, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Welcome() {
    const navigate = useNavigate();
    const [hoveredSide, setHoveredSide] = useState<'personal' | 'company' | null>(null);

    const containerVariants = {
        initial: { opacity: 0 },
        animate: { opacity: 1, transition: { duration: 0.8 } },
        exit: { opacity: 0 }
    };

    const sideVariants = {
        rest: { flex: 1 },
        hover: { flex: 2.5 },
        shrink: { flex: 0.6 }
    };

    // Mobile fallback for simple stacking
    const isMobile = window.innerWidth < 768;

    return (
        <motion.div
            variants={containerVariants}
            initial="initial"
            animate="animate"
            className="h-screen w-full flex flex-col md:flex-row bg-black overflow-hidden"
        >
            {/* Personal Section */}
            <motion.div
                className="relative flex items-center justify-center overflow-hidden cursor-pointer md:h-full h-1/2 border-b md:border-b-0 md:border-r border-white/10 group"
                variants={isMobile ? {} : sideVariants}
                animate={isMobile ? 'rest' : (hoveredSide === 'personal' ? 'hover' : hoveredSide === 'company' ? 'shrink' : 'rest')}
                transition={{ type: "spring", stiffness: 100, damping: 20 }}
                onMouseEnter={() => setHoveredSide('personal')}
                onMouseLeave={() => setHoveredSide(null)}
                onClick={() => navigate('/personal')}
            >
                {/* Background Image */}
                <motion.div
                    className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=1600')] bg-cover bg-center"
                    animate={{ scale: hoveredSide === 'personal' ? 1.05 : 1.1 }}
                    transition={{ duration: 0.8 }}
                >
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-500" />
                </motion.div>

                {/* Content */}
                <div className="relative z-20 flex flex-col items-center justify-center text-center p-8 w-full max-w-lg">
                    <motion.div
                        animate={{ y: hoveredSide === 'personal' ? -10 : 0 }}
                        className="mb-6 p-5 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-300"
                    >
                        <User size={32} />
                    </motion.div>

                    <h2 className="text-4xl md:text-6xl font-black text-white mb-4 tracking-tight">PERSONAL</h2>

                    <motion.p
                        className="text-gray-300 text-lg mb-8 max-w-xs font-light"
                        animate={{ opacity: hoveredSide === 'company' ? 0 : 1 }}
                    >
                        Curated lifestyle essentials for you
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: hoveredSide === 'personal' ? 1 : 0, y: hoveredSide === 'personal' ? 0 : 20 }}
                        className="flex items-center gap-2 text-emerald-400 font-bold tracking-widest uppercase text-sm"
                    >
                        Enter Shop <ArrowRight size={16} />
                    </motion.div>
                </div>
            </motion.div>

            {/* Company Section */}
            <motion.div
                className="relative flex items-center justify-center overflow-hidden cursor-pointer md:h-full h-1/2 group"
                variants={isMobile ? {} : sideVariants}
                animate={isMobile ? 'rest' : (hoveredSide === 'company' ? 'hover' : hoveredSide === 'personal' ? 'shrink' : 'rest')}
                transition={{ type: "spring", stiffness: 100, damping: 20 }}
                onMouseEnter={() => setHoveredSide('company')}
                onMouseLeave={() => setHoveredSide(null)}
                onClick={() => navigate('/company')}
            >
                {/* Background Image */}
                <motion.div
                    className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1600')] bg-cover bg-center"
                    animate={{ scale: hoveredSide === 'company' ? 1.05 : 1.1 }}
                    transition={{ duration: 0.8 }}
                >
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-500" />
                </motion.div>

                {/* Content */}
                <div className="relative z-20 flex flex-col items-center justify-center text-center p-8 w-full max-w-lg">
                    <motion.div
                        animate={{ y: hoveredSide === 'company' ? -10 : 0 }}
                        className="mb-6 p-5 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300"
                    >
                        <Building2 size={32} />
                    </motion.div>

                    <h2 className="text-4xl md:text-6xl font-black text-white mb-4 tracking-tight">BUSINESS</h2>

                    <motion.p
                        className="text-gray-300 text-lg mb-8 max-w-xs font-light"
                        animate={{ opacity: hoveredSide === 'personal' ? 0 : 1 }}
                    >
                        Procurement solutions tailored for scale
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: hoveredSide === 'company' ? 1 : 0, y: hoveredSide === 'company' ? 0 : 20 }}
                        className="flex items-center gap-2 text-blue-400 font-bold tracking-widest uppercase text-sm"
                    >
                        Enter Portal <ArrowRight size={16} />
                    </motion.div>
                </div>
            </motion.div>

            {/* Stylized OR Badge */}
            <motion.div
                animate={{ scale: hoveredSide ? 0 : 1, opacity: hoveredSide ? 0 : 1 }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none hidden md:block"
            >
                <div className="bg-black/50 backdrop-blur-xl border border-white/10 w-16 h-16 rounded-full flex items-center justify-center">
                    <span className="text-white/60 font-mono text-xs">OR</span>
                </div>
            </motion.div>

            {/* Logo Overlay */}
            <div className="absolute top-8 left-0 right-0 z-40 flex justify-center pointer-events-none">
                <span className="text-white/30 font-bold tracking-[0.5em] text-sm md:text-base uppercase">Select Your Experience</span>
            </div>

        </motion.div>
    );
}
