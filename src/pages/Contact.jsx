import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Mail, User, MessageSquare, CheckCircle, ArrowRight } from 'lucide-react';

const Contact = () => {
    const [formState, setFormState] = useState('idle'); // idle, sending, success

    const handleSubmit = (e) => {
        e.preventDefault();
        setFormState('sending');
        setTimeout(() => {
            setFormState('success');
        }, 2000);
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-20">
            <div className="text-center mb-16">
                <h1 className="text-5xl font-bold text-white mb-6">Secure Contact</h1>
                <p className="text-xl text-gray-400">Have questions about the RSA Engine? Reach out to our technical team.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                <div className="md:col-span-1 space-y-8">
                    <div className="p-6 glass rounded-2xl border-white/5">
                        <div className="w-10 h-10 bg-cyber-cyan/10 rounded-lg flex items-center justify-center text-cyber-cyan mb-4">
                            <Mail className="w-5 h-5" />
                        </div>
                        <h3 className="text-white font-bold mb-2">Technical Support</h3>
                        <p className="text-gray-400 text-sm">support@rsa-engine.io</p>
                    </div>

                    <div className="p-6 glass rounded-2xl border-white/5">
                        <div className="w-10 h-10 bg-cyber-purple/10 rounded-lg flex items-center justify-center text-cyber-purple mb-4">
                            <MessageSquare className="w-5 h-5" />
                        </div>
                        <h3 className="text-white font-bold mb-2">Community</h3>
                        <p className="text-gray-400 text-sm">Join our discord research group</p>
                    </div>
                </div>

                <div className="md:col-span-2">
                    <AnimatePresence mode="wait">
                        {formState !== 'success' ? (
                            <motion.form
                                key="form"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                onSubmit={handleSubmit}
                                className="p-8 glass rounded-3xl border-white/5 space-y-6"
                            >
                                <div>
                                    <label className="text-sm font-medium text-gray-400 block mb-2">Security ID / Full Name</label>
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600" />
                                        <input
                                            required
                                            type="text"
                                            placeholder="Enter identity..."
                                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-cyber-cyan/50 transition-all font-mono"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-gray-400 block mb-2">Communication Channel (Email)</label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600" />
                                        <input
                                            required
                                            type="email"
                                            placeholder="Enter email address..."
                                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-cyber-cyan/50 transition-all font-mono"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-gray-400 block mb-2">Transmission Message</label>
                                    <textarea
                                        required
                                        placeholder="Enter your message..."
                                        className="w-full h-32 bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-cyber-cyan/50 transition-all resize-none font-mono"
                                    />
                                </div>

                                <button
                                    disabled={formState === 'sending'}
                                    type="submit"
                                    className="w-full py-4 bg-cyber-cyan text-cyber-black font-bold rounded-xl hover:bg-white transition-all flex items-center justify-center gap-2 group shadow-lg shadow-cyber-cyan/10"
                                >
                                    {formState === 'sending' ? (
                                        <span className="flex items-center gap-2">
                                            <RefreshCw className="w-5 h-5 animate-spin" /> ENCRYPTING...
                                        </span>
                                    ) : (
                                        <>
                                            SEND SECURE MESSAGE <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                        </>
                                    )}
                                </button>
                            </motion.form>
                        ) : (
                            <motion.div
                                key="success"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="p-12 glass rounded-3xl border-cyber-green/30 text-center space-y-6"
                            >
                                <div className="w-20 h-20 bg-cyber-green/10 rounded-full flex items-center justify-center text-cyber-green mx-auto">
                                    <CheckCircle className="w-10 h-10" />
                                </div>
                                <h2 className="text-3xl font-bold text-white">Transmission Successful</h2>
                                <p className="text-gray-400">Your message has been encrypted and sent to our secure servers. We will respond through your provided communication channel.</p>
                                <button
                                    onClick={() => setFormState('idle')}
                                    className="px-8 py-3 glass text-cyber-green hover:bg-cyber-green/10 transition-all rounded-xl font-bold inline-flex items-center gap-2"
                                >
                                    SEND ANOTHER <ArrowRight className="w-4 h-4" />
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default Contact;
