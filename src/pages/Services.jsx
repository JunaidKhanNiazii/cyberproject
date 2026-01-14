import React from 'react';
import { motion } from 'framer-motion';
import { Key, Lock, BookOpen, Shield, Code, BarChart, Server, Globe } from 'lucide-react';

const Services = () => {
    const services = [
        {
            icon: <Key className="w-10 h-10 text-cyber-cyan" />,
            title: "RSA Key Pair Generation",
            desc: "Instant generation of cryptographically secure public and private key pairs with custom bit lengths (1024 to 4096 bits)."
        },
        {
            icon: <Lock className="w-10 h-10 text-cyber-purple" />,
            title: "Secure Message Encryption",
            desc: "State-of-the-art encryption module protecting sensitive data from unauthorized access using individual public keys."
        },
        {
            icon: <BookOpen className="w-10 h-10 text-cyber-blue" />,
            title: "Educational Tools",
            desc: "Visual demonstrations of primality tests, modular arithmetic, and the mathematical foundations of the RSA algorithm."
        },
        {
            icon: <Code className="w-10 h-10 text-cyber-green" />,
            title: "Cryptographic API",
            desc: "Seamless integration of RSA functions into your existing developer workflow for rapid secure application development."
        },
        {
            icon: <BarChart className="w-10 h-10 text-amber-500" />,
            title: "Performance Analysis",
            desc: "Real-time metrics on generation speed and encryption overhead for different security parameters."
        },
        {
            icon: <Server className="w-10 h-10 text-rose-500" />,
            title: "Secure Key Storage",
            desc: "Optional local file-based storage for managing your key collection securely without cloud dependencies."
        }
    ];

    return (
        <div className="max-w-7xl mx-auto px-4 py-20">
            <div className="text-center mb-20">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="inline-block px-4 py-1.5 glass rounded-full border-cyber-cyan/30 text-cyber-cyan text-xs font-mono mb-4 uppercase tracking-[0.2em]"
                >
                    Professional Solutions
                </motion.div>
                <h1 className="text-5xl font-bold text-white mb-6 tracking-tight">Cryptographic Services</h1>
                <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                    We provide a comprehensive suite of RSA-based tools designed for students, researchers, and security professionals.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {services.map((service, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        whileHover={{ y: -5, scale: 1.02 }}
                        className="p-8 glass rounded-3xl border-white/5 hover:border-cyber-cyan/30 transition-all group relative overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-cyber-cyan/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="mb-6 relative z-10 p-3 inline-block rounded-2xl bg-white/5 group-hover:bg-cyber-cyan/10 transition-colors">
                            {service.icon}
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-4 relative z-10 group-hover:text-cyber-cyan transition-colors">{service.title}</h3>
                        <p className="text-gray-400 leading-relaxed relative z-10">{service.desc}</p>
                    </motion.div>
                ))}
            </div>

            {/* Trust Quote */}
            <div className="mt-24 p-12 glass border-dashed border-white/10 rounded-3xl text-center max-w-4xl mx-auto">
                <Shield className="w-16 h-16 text-cyber-cyan mx-auto mb-6 opacity-50" />
                <p className="text-2xl text-white font-medium italic mb-4">
                    "Security is not a product, but a process. Our mission is to make the process of cryptographic implementation accessible and mathematically transparent."
                </p>
                <div className="text-cyber-cyan font-mono text-sm uppercase tracking-widest">RSA Engineering Lead</div>
            </div>
        </div>
    );
};

export default Services;
