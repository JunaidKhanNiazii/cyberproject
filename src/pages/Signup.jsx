import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, User, UserPlus, Chrome, AlertCircle, ArrowRight } from 'lucide-react';

const Signup = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { signup, loginWithGoogle } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            return setError('Passwords do not match');
        }

        try {
            setError('');
            setLoading(true);
            await signup(email, password);
            navigate('/dashboard');
        } catch (err) {
            setError('Failed to create an account. ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        try {
            setError('');
            setLoading(true);
            await loginWithGoogle();
            navigate('/dashboard');
        } catch (err) {
            setError('Failed to sign in with Google.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-32 relative overflow-hidden">
            <div className="absolute inset-0 z-0">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyber-purple/5 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyber-cyan/5 rounded-full blur-[120px] animate-pulse delay-700"></div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md relative z-10"
            >
                <div className="glass p-10 rounded-[2.5rem] border-white/5 shadow-2xl">
                    <div className="text-center mb-10">
                        <div className="w-16 h-16 bg-cyber-purple/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-cyber-purple/20">
                            <UserPlus className="w-8 h-8 text-cyber-purple" />
                        </div>
                        <h2 className="text-3xl font-black text-white uppercase tracking-tight">Create Account</h2>
                        <p className="text-gray-500 text-sm mt-2 font-medium tracking-wide">JOIN THE SECURE NETWORK</p>
                    </div>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-500 text-xs font-bold uppercase tracking-wider"
                        >
                            <AlertCircle className="w-4 h-4" /> {error}
                        </motion.div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-2 block ml-1">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                <input
                                    type="text"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white text-sm focus:outline-none focus:border-cyber-purple focus:bg-white/10 transition-all font-mono"
                                    placeholder="Enter your name"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-2 block ml-1">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white text-sm focus:outline-none focus:border-cyber-purple focus:bg-white/10 transition-all font-mono"
                                    placeholder="your@email.com"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-2 block ml-1">Password</label>
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-4 text-white text-sm focus:outline-none focus:border-cyber-purple transition-all font-mono"
                                    placeholder="••••"
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-2 block ml-1">Confirm</label>
                                <input
                                    type="password"
                                    required
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-4 text-white text-sm focus:outline-none focus:border-cyber-purple transition-all font-mono"
                                    placeholder="••••"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full mt-4 bg-cyber-purple text-white py-4 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-white hover:text-cyber-black transition-all shadow-[0_0_30px_rgba(188,19,254,0.2)] flex items-center justify-center gap-2 group disabled:opacity-50"
                        >
                            <UserPlus className="w-4 h-4" />
                            Create New Account
                        </button>
                    </form>

                    <button
                        onClick={handleGoogleSignIn}
                        disabled={loading}
                        className="w-full mt-8 bg-white/5 border border-white/10 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-white/10 transition-all flex items-center justify-center gap-3 group disabled:opacity-50"
                    >
                        <Chrome className="w-4 h-4 text-cyber-cyan group-hover:rotate-12 transition-transform" />
                        Sign up with Google
                    </button>

                    <p className="text-center mt-10 text-[10px] font-bold tracking-[0.1em] text-gray-500 uppercase">
                        Already have an account? <Link to="/login" className="text-cyber-purple hover:underline hover:text-white transition-colors">Authenticate <ArrowRight className="inline w-3 h-3 ml-1" /></Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default Signup;
