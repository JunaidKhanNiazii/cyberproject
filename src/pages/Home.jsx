import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Key, Lock, ArrowRight, Zap, Target, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import MatrixBackground from '../components/MatrixBackground';

const Home = () => {
    return (
        <div className="relative bg-cyber-black overflow-hidden">
            {/* Professional Hacker YouTube Video Background Layer */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden h-screen bg-black">
                <div className="absolute inset-0 w-full h-full scale-150 grayscale contrast-125 opacity-20">
                    <iframe
                        src="https://www.youtube.com/embed/o4ltIYhVfx8?autoplay=1&mute=1&loop=1&playlist=o4ltIYhVfx8&controls=0&showinfo=0&autohide=1&modestbranding=1&rel=0&mute=1"
                        title="Background Video"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        className="w-full h-full"
                    ></iframe>
                </div>
                <div className="absolute inset-0 bg-gradient-to-b from-cyber-black via-transparent to-cyber-black z-10"></div>

                {/* High-Performance Canvas Matrix Overlay */}
                <MatrixBackground />

                {/* Visual Decorative Overlay */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,242,255,0.05),transparent_70%)] z-20"></div>
            </div>

            {/* Hero Section - Split View (Content Left, Visuals Right) */}
            <section className="relative min-h-screen flex items-center justify-center px-4 py-20 md:py-32 overflow-hidden z-10">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full">
                    {/* Left Side: Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="relative z-20 flex flex-col items-center lg:items-start text-center lg:text-left"
                    >
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-cyber-cyan/5 border border-cyber-cyan/20 text-cyber-cyan text-[10px] font-black uppercase tracking-[0.3em] mb-8 shadow-[0_0_20px_rgba(0,242,255,0.1)]"
                        >
                            <div className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyber-cyan opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyber-cyan shadow-[0_0_10px_#00f2ff]"></span>
                            </div>
                            Neural Protocol v4.0
                        </motion.div>

                        <h1 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight uppercase leading-tight">
                            Secure <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyber-cyan to-cyber-blue drop-shadow-[0_0_15px_rgba(0,242,255,0.3)]">RSA Engine</span>
                        </h1>

                        <p className="text-sm md:text-base text-gray-400 mb-10 max-w-lg leading-relaxed font-medium">
                            Enterprise-grade cryptographic foundations. Generate keys and encrypt data with mathematical precision.
                        </p>

                        <div className="flex flex-wrap gap-4 items-center justify-center lg:justify-start mb-12">
                            <Link
                                to="/dashboard"
                                className="relative px-8 py-4 bg-cyber-cyan text-cyber-black font-black uppercase tracking-widest rounded-xl flex items-center gap-3 hover:bg-white transition-all shadow-[0_0_30px_rgba(0,242,255,0.2)] hover:shadow-[0_0_50px_rgba(0,242,255,0.4)] group overflow-hidden text-sm"
                            >
                                <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 skew-x-12"></div>
                                <span className="relative z-10">Initialize</span>
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform relative z-10" />
                            </Link>

                            <Link
                                to="/learning"
                                className="px-8 py-4 glass border-white/10 text-white font-black uppercase tracking-widest rounded-xl flex items-center gap-3 hover:bg-white/5 hover:border-cyber-cyan/30 transition-all group text-sm"
                            >
                                <BookOpen className="w-4 h-4 text-cyber-cyan group-hover:rotate-12 transition-transform" />
                                Learn
                            </Link>
                        </div>
                    </motion.div>

                    {/* Right Side: Enhanced Interactive Animation */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, x: 50 }}
                        animate={{ opacity: 1, scale: 1, x: 0 }}
                        transition={{ duration: 1.2, ease: "circOut", delay: 0.3 }}
                        className="relative z-20 flex justify-center"
                    >
                        <div className="relative group/centerpiece scale-75 md:scale-90 lg:scale-100">
                            {/* Outer Pulsing Glow */}
                            <div className="absolute -inset-20 bg-cyber-cyan/10 rounded-full blur-[100px] animate-pulse pointer-events-none"></div>

                            <div className="relative p-1 bg-gradient-to-br from-cyber-cyan/20 via-transparent to-cyber-purple/20 rounded-[3rem] backdrop-blur-[2px]">
                                <div className="glass p-8 md:p-16 rounded-[2.8rem] border-white/5 shadow-2xl relative overflow-hidden flex flex-col items-center">
                                    {/* Scanning Line Effect */}
                                    <motion.div
                                        animate={{ y: ["-100%", "200%"] }}
                                        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                                        className="absolute inset-0 bg-gradient-to-b from-transparent via-cyber-cyan/10 to-transparent h-1/2 pointer-events-none z-10"
                                    ></motion.div>

                                    <div className="absolute inset-0 bg-gradient-to-tr from-cyber-black/95 to-transparent pointer-events-none"></div>

                                    {/* Floating Data Nodes */}
                                    {[...Array(6)].map((_, i) => (
                                        <motion.div
                                            key={i}
                                            animate={{
                                                y: [0, -20, 0],
                                                opacity: [0.2, 0.5, 0.2]
                                            }}
                                            transition={{
                                                duration: 3 + i,
                                                repeat: Infinity,
                                                delay: i * 0.5
                                            }}
                                            className="absolute w-1 h-1 bg-cyber-cyan rounded-full shadow-[0_0_10px_#00f2ff]"
                                            style={{
                                                top: `${20 + i * 12}%`,
                                                left: `${15 + (i % 3) * 30}%`
                                            }}
                                        />
                                    ))}

                                    <motion.div
                                        animate={{
                                            rotateY: [0, 15, 0],
                                            rotateX: [0, 10, 0]
                                        }}
                                        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                                        className="relative z-20"
                                    >
                                        <div className="relative">
                                            <Shield className="w-40 h-40 md:w-56 h-56 text-cyber-cyan mx-auto drop-shadow-[0_0_50px_rgba(0,242,255,0.3)] group-hover/centerpiece:scale-105 transition-transform duration-500" />
                                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                                                <motion.div
                                                    animate={{ opacity: [0.1, 0.3, 0.1] }}
                                                    transition={{ duration: 2, repeat: Infinity }}
                                                >
                                                    <Lock className="w-10 h-10 md:w-14 h-14 text-white" />
                                                </motion.div>
                                            </div>
                                        </div>

                                        {/* Dynamic Geometry Rings */}
                                        <motion.div
                                            animate={{ rotate: 360, scale: [1, 1.05, 1] }}
                                            transition={{ rotate: { duration: 20, repeat: Infinity, ease: "linear" }, scale: { duration: 4, repeat: Infinity } }}
                                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[12rem] h-[12rem] md:w-[18rem] md:h-[18rem] border-2 border-dashed border-cyber-cyan/20 rounded-full"
                                        ></motion.div>

                                        <motion.div
                                            animate={{ rotate: -360 }}
                                            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[16rem] h-[16rem] md:w-[22rem] md:h-[22rem] border border-cyber-purple/15 rounded-full"
                                        ></motion.div>

                                        <motion.div
                                            animate={{ rotate: 180, opacity: [0.1, 0.2, 0.1] }}
                                            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[20rem] h-[20rem] md:w-[26rem] md:h-[26rem] border border-white/5 rounded-full blur-[1px]"
                                        ></motion.div>
                                    </motion.div>

                                    <div className="mt-8 md:mt-12 grid grid-cols-2 gap-4 md:gap-6 relative z-20 w-full max-w-xs">
                                        <div className="p-4 md:p-5 bg-white/5 rounded-2xl border border-white/10 hover:border-cyber-cyan/40 transition-all group/stat flex flex-col items-center backdrop-blur-md">
                                            <div className="text-cyber-cyan font-mono text-xl md:text-2xl font-black group-hover/stat:scale-110 transition-transform">4096</div>
                                            <div className="text-gray-500 text-[8px] md:text-[9px] font-black uppercase tracking-[0.2em] mt-2 text-center">Depth</div>
                                        </div>
                                        <div className="p-4 md:p-5 bg-white/5 rounded-2xl border border-white/10 hover:border-cyber-purple/40 transition-all group/stat flex flex-col items-center backdrop-blur-md">
                                            <div className="text-cyber-purple font-mono text-xl md:text-2xl font-black group-hover/stat:scale-110 transition-transform">SEC</div>
                                            <div className="text-gray-500 text-[8px] md:text-[9px] font-black uppercase tracking-[0.2em] mt-2 text-center">Neural</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-24 px-4 bg-black/50">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-white mb-4 tracking-tight">Advanced Security Components</h2>
                        <p className="text-gray-400">Professional-grade implementation of the RSA cryptosystem.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: <Key className="w-8 h-8 text-cyber-cyan" />,
                                title: "Secure Key Generation",
                                desc: "Generate high-entropy public/private key pairs using cryptographically secure random numbers."
                            },
                            {
                                icon: <Zap className="w-8 h-8 text-cyber-purple" />,
                                title: "Miller–Rabin Primality",
                                desc: "Robust primality testing ensuring p and q are genuine primes for maximum security."
                            },
                            {
                                icon: <Lock className="w-8 h-8 text-cyber-green" />,
                                title: "Message Protection",
                                desc: "End-to-end encryption using individual public keys and private key decryption."
                            },
                        ].map((feature, idx) => (
                            <motion.div
                                key={idx}
                                whileHover={{ y: -10 }}
                                className="p-8 glass rounded-2xl border-white/5 hover:border-cyber-cyan/50 transition-all"
                            >
                                <div className="mb-6">{feature.icon}</div>
                                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                                <p className="text-gray-400 leading-relaxed">{feature.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Workflow Visualization */}
            <section className="py-24 px-4">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl font-bold text-white tracking-tight">Operational Workflow</h2>
                    </div>

                    <div className="relative">
                        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-cyber-cyan/20 -translate-x-1/2 hidden md:block"></div>

                        {[
                            { step: "01", title: "Generate Primes", icon: <Target className="w-6 h-6" />, desc: "Select two large prime numbers p and q." },
                            { step: "02", title: "Compute Keys", icon: <Key className="w-6 h-6" />, desc: "Calculate modulus n and Euler's totient φ(n)." },
                            { step: "03", title: "Encrypt Message", icon: <Lock className="w-6 h-6" />, desc: "Transform plaintext into ciphertext using public key e." },
                            { step: "04", title: "Decrypt Securely", icon: <Zap className="w-6 h-6" />, desc: "Recover message using private decryption key d." },
                        ].map((item, idx) => (
                            <div key={idx} className={`flex flex-col md:flex-row items-center gap-8 mb-20 ${idx % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                                <div className="flex-1 text-center md:text-left px-4">
                                    <div className={`flex items-center gap-4 mb-4 justify-center ${idx % 2 === 0 ? 'md:justify-start' : 'md:justify-end'}`}>
                                        <span className="text-5xl font-black text-cyber-cyan/20 font-mono tracking-tighter">{item.step}</span>
                                        <h4 className="text-2xl font-bold text-white">{item.title}</h4>
                                    </div>
                                    <p className={`text-gray-400 ${idx % 2 === 0 ? 'md:text-left' : 'md:text-right'}`}>{item.desc}</p>
                                </div>
                                <div className="relative z-10 w-12 h-12 flex items-center justify-center bg-cyber-cyan rounded-full shadow-[0_0_20px_rgba(0,242,255,0.5)] text-cyber-black">
                                    {item.icon}
                                </div>
                                <div className="flex-1 hidden md:block"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 px-4">
                <div className="max-w-5xl mx-auto p-12 glass rounded-3xl border-cyber-purple/30 relative overflow-hidden text-center">
                    <div className="absolute inset-0 bg-cyber-purple/5 blur-3xl pointer-events-none"></div>
                    <h2 className="text-4xl font-bold text-white mb-6 relative z-10">Ready to secure your communications?</h2>
                    <p className="text-xl text-gray-400 mb-10 relative z-10">Start generating your RSA keys in our advanced cryptosystem dashboard.</p>
                    <Link
                        to="/dashboard"
                        className="inline-flex items-center gap-2 px-10 py-5 bg-cyber-purple text-white font-bold rounded-xl hover:bg-white hover:text-cyber-black transition-all shadow-xl shadow-cyber-purple/20 group relative z-10"
                    >
                        Access Dashboard
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default Home;
