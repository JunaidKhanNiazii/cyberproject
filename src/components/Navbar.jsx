import React, { useState } from 'react';
import { Shield, Menu, X, Key, LogOut, User, LogIn } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { user, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Dashboard', path: '/dashboard' },
        { name: 'Learning Mode', path: '/learning' },
        { name: 'Secure Messaging', path: '/secure-messages' },
        { name: 'Services', path: '/services' },
        { name: 'About', path: '/about' },
        { name: 'Contact', path: '/contact' },
    ];

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (error) {
            console.error('Failed to log out', error);
        }
    };

    return (
        <nav className="fixed w-full z-50 glass border-b border-white/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center gap-2 group">
                            <Shield className="w-8 h-8 text-cyber-cyan group-hover:glow-cyan transition-all" />
                            <span className="text-xl font-bold tracking-tighter text-white">
                                RSA <span className="text-cyber-cyan">ENGINE</span>
                            </span>
                        </Link>
                    </div>

                    <div className="hidden md:flex items-center space-x-4">
                        <div className="flex items-baseline space-x-6">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    to={link.path}
                                    className={`px-3 py-2 rounded-md text-sm font-medium transition-all ${location.pathname === link.path
                                        ? 'text-cyber-cyan glow-cyan'
                                        : 'text-gray-300 hover:text-white hover:bg-white/5'
                                        }`}
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </div>

                        <div className="h-6 w-px bg-white/10 mx-2"></div>

                        {user ? (
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2 px-3 py-1.5 glass border-white/5 rounded-full">
                                    {user.photoURL ? (
                                        <img src={user.photoURL} alt="Profile" className="w-6 h-6 rounded-full border border-cyber-cyan/50" />
                                    ) : (
                                        <div className="w-6 h-6 rounded-full bg-cyber-purple/20 flex items-center justify-center border border-cyber-purple/50">
                                            <User className="w-3 h-3 text-cyber-purple" />
                                        </div>
                                    )}
                                    <span className="text-[10px] font-black text-white uppercase tracking-wider max-w-[80px] truncate">
                                        {user.displayName || user.email.split('@')[0]}
                                    </span>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="p-2 text-gray-500 hover:text-red-500 transition-colors"
                                    title="Logout"
                                >
                                    <LogOut className="w-4 h-4" />
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-3">
                                <Link
                                    to="/login"
                                    className="text-gray-400 hover:text-white text-sm font-bold transition-all px-4 py-2"
                                >
                                    LOGIN
                                </Link>
                                <Link
                                    to="/signup"
                                    className="bg-cyber-cyan/10 border border-cyber-cyan/30 text-cyber-cyan px-4 py-2 rounded-lg text-sm font-bold hover:bg-cyber-cyan hover:text-cyber-black transition-all flex items-center gap-2"
                                >
                                    <LogIn className="w-4 h-4" />
                                    SIGN UP
                                </Link>
                            </div>
                        )}
                    </div>

                    <div className="md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="text-gray-300 hover:text-white p-2"
                        >
                            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.4, ease: "circOut" }}
                        className="md:hidden glass border-b border-white/10 overflow-hidden"
                    >
                        <div className="px-4 pt-4 pb-8 space-y-2">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    to={link.path}
                                    onClick={() => setIsOpen(false)}
                                    className={`block px-4 py-3 rounded-xl text-lg font-bold transition-all ${location.pathname === link.path
                                        ? 'text-cyber-cyan bg-cyber-cyan/5'
                                        : 'text-gray-300 hover:text-white hover:bg-white/5'
                                        }`}
                                >
                                    {link.name}
                                </Link>
                            ))}
                            <div className="pt-4 border-t border-white/5">
                                {user ? (
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3 px-4 py-2">
                                            {user.photoURL ? (
                                                <img src={user.photoURL} alt="Profile" className="w-8 h-8 rounded-full border border-cyber-cyan/50" />
                                            ) : (
                                                <div className="w-8 h-8 rounded-full bg-cyber-purple/20 flex items-center justify-center border border-cyber-purple/50">
                                                    <User className="w-4 h-4 text-cyber-purple" />
                                                </div>
                                            )}
                                            <span className="text-sm font-black text-white uppercase tracking-wider">
                                                {user.displayName || user.email.split('@')[0]}
                                            </span>
                                        </div>
                                        <button
                                            onClick={() => { handleLogout(); setIsOpen(false); }}
                                            className="w-full text-left px-4 py-4 rounded-xl text-lg font-black text-red-500 bg-red-500/5 hover:bg-red-500/10 flex items-center gap-3"
                                        >
                                            <LogOut className="w-5 h-5" />
                                            Sign Out
                                        </button>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-2 gap-4">
                                        <Link
                                            to="/login"
                                            onClick={() => setIsOpen(false)}
                                            className="text-center px-4 py-4 rounded-xl text-sm font-black text-gray-400 border border-white/10"
                                        >
                                            LOGIN
                                        </Link>
                                        <Link
                                            to="/signup"
                                            onClick={() => setIsOpen(false)}
                                            className="text-center px-4 py-4 rounded-xl text-sm font-black text-cyber-cyan bg-cyber-cyan/10 border border-cyber-cyan/30"
                                        >
                                            SIGN UP
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
