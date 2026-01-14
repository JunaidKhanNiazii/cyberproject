import React from 'react';
import { Shield, Github, Twitter, Linkedin } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="glass border-t border-white/10 pt-12 pb-8 mt-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    <div className="col-span-1 md:col-span-2">
                        <Link to="/" className="flex items-center gap-2 mb-4">
                            <Shield className="w-8 h-8 text-cyber-cyan" />
                            <span className="text-xl font-bold tracking-tighter text-white">
                                RSA <span className="text-cyber-cyan">ENGINE</span>
                            </span>
                        </Link>
                        <p className="text-gray-400 max-w-sm">
                            Advanced cryptographic engine for secure key generation and data protection.
                            Built with mathematical precision and modern security standards.
                        </p>
                    </div>

                    <div>
                        <h4 className="text-white font-bold mb-4">Platform</h4>
                        <ul className="space-y-2 text-gray-400">
                            <li><Link to="/" className="hover:text-cyber-cyan transition-colors">Home</Link></li>
                            <li><Link to="/dashboard" className="hover:text-cyber-cyan transition-colors">Dashboard</Link></li>
                            <li><Link to="/services" className="hover:text-cyber-cyan transition-colors">Services</Link></li>
                            <li><Link to="/about" className="hover:text-cyber-cyan transition-colors">About RSA</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-bold mb-4">Connect</h4>
                        <div className="flex space-x-4">
                            <a href="#" className="p-2 glass rounded-full hover:text-cyber-cyan transition-all">
                                <Github className="w-5 h-5" />
                            </a>
                            <a href="#" className="p-2 glass rounded-full hover:text-cyber-cyan transition-all">
                                <Twitter className="w-5 h-5" />
                            </a>
                            <a href="#" className="p-2 glass rounded-full hover:text-cyber-cyan transition-all">
                                <Linkedin className="w-5 h-5" />
                            </a>
                        </div>
                    </div>
                </div>

                <div className="border-t border-white/5 pt-8 flex flex-col md:row items-center justify-between gap-4">
                    <p className="text-gray-500 text-sm">
                        © 2026 RSA Cryptography Engine. All rights reserved.
                    </p>
                    <div className="flex items-center gap-2 text-xs font-mono text-gray-600 bg-white/5 px-3 py-1 rounded-full uppercase tracking-widest">
                        <span className="w-2 h-2 rounded-full bg-cyber-green animate-pulse"></span>
                        Educational Cryptography Tool
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
