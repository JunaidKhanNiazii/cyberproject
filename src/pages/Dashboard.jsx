import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Key, Shield, Lock, Unlock, Copy, RefreshCw, Cpu, Activity, AlertCircle, CheckCircle } from 'lucide-react';
import { generateRSA, encrypt, decrypt, calculateRSA, generateRandomPrime, isPrime } from '../utils/rsa';

const Dashboard = () => {
    const [keys, setKeys] = useState(null);
    const [plaintext, setPlaintext] = useState('');
    const [ciphertext, setCiphertext] = useState('');
    const [decryptedText, setDecryptedText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [copyStatus, setCopyStatus] = useState('');
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [keyMode, setKeyMode] = useState('auto'); // 'auto' or 'manual'

    // Manual Prime State
    const [manualP, setManualP] = useState('');
    const [manualQ, setManualQ] = useState('');
    const [manualE, setManualE] = useState('65537');
    const [error, setError] = useState('');

    const handleGenerateKeys = () => {
        setIsLoading(true);
        setError('');
        setTimeout(() => {
            const newKeys = generateRSA();
            setKeys(newKeys);
            setManualP(newKeys.p.toString());
            setManualQ(newKeys.q.toString());
            setIsLoading(false);
        }, 800);
    };

    const handleRollPrime = (type) => {
        const prime = generateRandomPrime();
        if (type === 'p') setManualP(prime.toString());
        else setManualQ(prime.toString());
    };

    const handleCalculateFromPrimes = () => {
        if (!manualP || !manualQ) {
            setError('Both P and Q are required');
            return;
        }

        const p = BigInt(manualP);
        const q = BigInt(manualQ);

        if (!isPrime(p) || !isPrime(q)) {
            setError('Both inputs must be prime numbers');
            return;
        }

        if (p === q) {
            setError('P and Q must be different primes');
            return;
        }

        try {
            const newKeys = calculateRSA(p, q, BigInt(manualE));
            setKeys(newKeys);
            setError('');
            setKeyMode('auto'); // Switch to auto to show the dashboard
        } catch (err) {
            setError('Calculation failed. Ensure math validity.');
        }
    };

    const handleEncrypt = () => {
        if (!plaintext || !keys) return;

        try {
            const result = encrypt(plaintext, keys.e, keys.n);
            setCiphertext(result);
        } catch (error) {
            console.error("Encryption failed", error);
        }
    };

    const handleDecrypt = () => {
        if (!ciphertext || !keys) return;

        try {
            const result = decrypt(ciphertext, keys.d, keys.n);
            setDecryptedText(result);
            if (result === plaintext && plaintext !== '') {
                setTimeout(() => setShowSuccessModal(true), 500);
            }
        } catch (error) {
            console.error("Decryption failed", error);
        }
    };

    const copyToClipboard = (text, type) => {
        navigator.clipboard.writeText(text);
        setCopyStatus(type);
        setTimeout(() => setCopyStatus(''), 2000);
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-12">
            {/* Success Modal */}
            <AnimatePresence>
                {showSuccessModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowSuccessModal(false)}
                            className="absolute inset-0 bg-cyber-black/80 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="relative glass-cyan max-w-md w-full p-10 rounded-[2.5rem] text-center border-cyber-cyan shadow-[0_0_50px_rgba(0,242,255,0.2)]"
                        >
                            <div className="w-20 h-20 bg-cyber-cyan/20 rounded-full flex items-center justify-center text-cyber-cyan mx-auto mb-6 shadow-[0_0_20px_rgba(0,242,255,0.3)]">
                                <CheckCircle className="w-10 h-10" />
                            </div>
                            <h2 className="text-3xl font-bold text-white mb-2">Message Verified</h2>
                            <p className="text-gray-400 mb-8">Decryption match confirmed. The recovered plaintext is identical to the original input.</p>
                            <button
                                onClick={() => setShowSuccessModal(false)}
                                className="w-full py-4 bg-cyber-cyan text-cyber-black font-bold rounded-2xl hover:bg-white transition-all"
                            >
                                Acknowledge
                            </button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
                <div>
                    <h1 className="text-4xl font-bold text-white mb-2">Cryptography Dashboard</h1>
                    <p className="text-gray-400">Manage RSA components and perform secure cryptographic operations.</p>
                </div>
                <div className="flex gap-4">
                    <div className="flex items-center gap-2 px-3 py-1.5 glass rounded-lg border-cyber-green/30 text-cyber-green text-xs font-mono">
                        <Activity className="w-3 h-3" /> SYSTEM STATUS: OPTIMAL
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Key Generator Panel */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="lg:col-span-1 glass rounded-2xl border-white/5 flex flex-col"
                >
                    <div className="p-6 border-b border-white/5 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Key className="w-5 h-5 text-cyber-cyan" />
                            <h2 className="font-bold text-white">RSA Key Control</h2>
                        </div>
                        <div className="flex p-1 bg-white/5 rounded-lg border border-white/10 scale-90">
                            <button
                                onClick={() => setKeyMode('auto')}
                                className={`px-3 py-1 rounded text-[10px] font-bold transition-all ${keyMode === 'auto' ? 'bg-cyber-cyan text-cyber-black' : 'text-gray-500 hover:text-white'}`}
                            >
                                AUTO
                            </button>
                            <button
                                onClick={() => setKeyMode('manual')}
                                className={`px-3 py-1 rounded text-[10px] font-bold transition-all ${keyMode === 'manual' ? 'bg-cyber-cyan text-cyber-black' : 'text-gray-500 hover:text-white'}`}
                            >
                                MANUAL
                            </button>
                        </div>
                    </div>

                    <div className="p-6 flex-grow">
                        {keyMode === 'auto' ? (
                            !keys ? (
                                <div className="h-full flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-white/5 rounded-xl">
                                    <Shield className="w-12 h-12 text-gray-600 mb-4" />
                                    <p className="text-gray-500 text-sm mb-6">No active key pair found. Generate new keys to start.</p>
                                    <button
                                        onClick={handleGenerateKeys}
                                        className="w-full py-3 bg-cyber-cyan/10 border border-cyber-cyan/50 text-cyber-cyan rounded-lg font-bold hover:bg-cyber-cyan hover:text-cyber-black transition-all"
                                    >
                                        Generate Initial Keys
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    <div>
                                        <label className="text-xs font-mono text-gray-500 uppercase tracking-widest block mb-2 font-bold">Public Key (e, n)</label>
                                        <div className="space-y-2">
                                            <div className="p-3 glass rounded-lg font-mono text-xs text-cyber-cyan break-all relative group">
                                                <span className="opacity-50 mr-2">e:</span> {keys.e.toString()}
                                            </div>
                                            <div className="p-3 glass rounded-lg font-mono text-xs text-white break-all relative group">
                                                <span className="opacity-50 mr-2">n:</span> {keys.n.toString()}
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-xs font-mono text-gray-500 uppercase tracking-widest block mb-2 font-bold">Private Key (d, n)</label>
                                        <div className="p-3 glass rounded-lg font-mono text-xs text-cyber-purple break-all relative group">
                                            <span className="opacity-50 mr-2">d:</span> {keys.d.toString().substring(0, 50)}...
                                        </div>
                                    </div>
                                    <button
                                        onClick={handleGenerateKeys}
                                        disabled={isLoading}
                                        className="w-full py-2 bg-white/5 border border-white/10 text-gray-400 rounded-lg text-xs font-bold hover:bg-white/10 hover:text-white transition-all flex items-center justify-center gap-2"
                                    >
                                        <RefreshCw className={`w-3 h-3 ${isLoading ? 'animate-spin' : ''}`} /> REGENERATE SYSTEM KEYS
                                    </button>
                                </div>
                            )
                        ) : (
                            <div className="space-y-6">
                                {error && (
                                    <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2 text-red-500 text-[10px] font-bold uppercase tracking-wider">
                                        <AlertCircle className="w-3 h-3" /> {error}
                                    </div>
                                )}

                                <div className="space-y-4">
                                    <div>
                                        <div className="flex items-center justify-between mb-2">
                                            <label className="text-[10px] font-mono text-gray-500 uppercase tracking-[0.2em] font-bold">Prime P</label>
                                            <button
                                                onClick={() => handleRollPrime('p')}
                                                className="text-[10px] text-cyber-cyan hover:underline font-bold"
                                            >
                                                ROLL AUTO
                                            </button>
                                        </div>
                                        <input
                                            type="text"
                                            value={manualP}
                                            onChange={(e) => setManualP(e.target.value.replace(/\D/g, ''))}
                                            placeholder="Enter first prime..."
                                            className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-xs font-mono text-white focus:outline-none focus:border-cyber-cyan transition-all"
                                        />
                                    </div>

                                    <div>
                                        <div className="flex items-center justify-between mb-2">
                                            <label className="text-[10px] font-mono text-gray-500 uppercase tracking-[0.2em] font-bold">Prime Q</label>
                                            <button
                                                onClick={() => handleRollPrime('q')}
                                                className="text-[10px] text-cyber-cyan hover:underline font-bold"
                                            >
                                                ROLL AUTO
                                            </button>
                                        </div>
                                        <input
                                            type="text"
                                            value={manualQ}
                                            onChange={(e) => setManualQ(e.target.value.replace(/\D/g, ''))}
                                            placeholder="Enter second prime..."
                                            className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-xs font-mono text-white focus:outline-none focus:border-cyber-cyan transition-all"
                                        />
                                    </div>

                                    <div>
                                        <label className="text-[10px] font-mono text-gray-500 uppercase tracking-[0.2em] block mb-2 font-bold">Public Exponent (e)</label>
                                        <input
                                            type="text"
                                            value={manualE}
                                            onChange={(e) => setManualE(e.target.value.replace(/\D/g, ''))}
                                            className="w-full bg-white/10 border border-white/10 rounded-lg p-3 text-xs font-mono text-cyber-cyan focus:outline-none"
                                        />
                                    </div>
                                </div>

                                <button
                                    onClick={handleCalculateFromPrimes}
                                    className="w-full py-4 bg-cyber-cyan text-cyber-black font-black uppercase tracking-widest rounded-xl hover:bg-white transition-all shadow-[0_0_20px_rgba(0,242,255,0.2)]"
                                >
                                    Calculate & Apply
                                </button>

                                <div className="p-4 bg-amber-500/5 rounded-xl border border-amber-500/20">
                                    <p className="text-[9px] text-amber-500/70 leading-relaxed uppercase font-bold tracking-tight">
                                        Manual Entry Notice: The system will derive N, Phi, and D automatically from your chosen primes. Values must be prime to ensure cryptographic integrity.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </motion.div>

                {/* Cryptography Operations */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Encryption Panel */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="glass rounded-2xl border-white/5"
                    >
                        <div className="p-6 border-b border-white/5 flex items-center gap-3">
                            <Lock className="w-5 h-5 text-cyber-purple" />
                            <h2 className="font-bold text-white">Encryption Engine</h2>
                        </div>
                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="text-sm font-medium text-gray-400 block mb-2">Input Plaintext</label>
                                <textarea
                                    value={plaintext}
                                    onChange={(e) => setPlaintext(e.target.value)}
                                    placeholder="Enter message to encrypt..."
                                    className="w-full h-32 bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder-gray-600 focus:outline-none focus:border-cyber-purple/50 transition-all resize-none font-mono"
                                />
                                <button
                                    onClick={handleEncrypt}
                                    disabled={!keys || !plaintext}
                                    className="w-full mt-4 py-3 bg-cyber-purple/20 border border-cyber-purple/40 text-cyber-purple rounded-lg font-bold hover:bg-cyber-purple hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                                >
                                    Encrypt Message
                                </button>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-400 block mb-2">Resulting Ciphertext</label>
                                <div className="w-full h-32 glass rounded-xl p-4 font-mono text-sm text-cyber-purple break-all overflow-y-auto">
                                    {ciphertext || <span className="text-gray-700 italic">Binary output will appear here...</span>}
                                </div>
                                {ciphertext && (
                                    <button
                                        onClick={() => copyToClipboard(ciphertext, 'cipher')}
                                        className="w-full mt-4 py-2 text-xs font-mono text-gray-500 hover:text-white transition-colors flex items-center justify-center gap-2"
                                    >
                                        <Copy className="w-3 h-3" /> COPY CIPHERTEXT
                                    </button>
                                )}
                            </div>
                        </div>
                    </motion.div>

                    {/* Decryption Panel */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="glass rounded-2xl border-white/5"
                    >
                        <div className="p-6 border-b border-white/5 flex items-center gap-3">
                            <Unlock className="w-5 h-5 text-cyber-green" />
                            <h2 className="font-bold text-white">Decryption Module</h2>
                        </div>
                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="text-sm font-medium text-gray-400 block mb-2">Encoded Ciphertext</label>
                                <textarea
                                    value={ciphertext}
                                    onChange={(e) => setCiphertext(e.target.value)}
                                    placeholder="Paste ciphertext here..."
                                    className="w-full h-32 bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder-gray-600 focus:outline-none focus:border-cyber-green/50 transition-all resize-none font-mono"
                                />
                                <button
                                    onClick={handleDecrypt}
                                    disabled={!keys || !ciphertext}
                                    className="w-full mt-4 py-3 bg-cyber-green/20 border border-cyber-green/40 text-cyber-green rounded-lg font-bold hover:bg-cyber-green hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                                >
                                    Decrypt Ciphertext
                                </button>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-400 block mb-2">Recovered Plaintext</label>
                                <div className="w-full h-32 glass border-cyber-green/20 rounded-xl p-4 font-bold text-white flex items-center justify-center">
                                    {decryptedText || <span className="text-gray-700 font-normal italic">Decrypted message will show here...</span>}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {!keys && (
                <div className="mt-8 flex items-center gap-3 p-4 glass rounded-xl border-amber-500/20 text-amber-500/80 text-sm">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <p>Warning: System is in demonstration mode. Cryptographic operations are performed with educational-grade bit depths to ensure visibility of mathematical mechanics.</p>
                </div>
            )}

            {/* Toast Notification for Copy */}
            {copyStatus && (
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="fixed bottom-8 right-8 px-6 py-3 glass border-cyber-cyan text-cyber-cyan rounded-full font-bold shadow-2xl z-50"
                >
                    Copied {copyStatus.toUpperCase()} to clipboard
                </motion.div>
            )}
        </div>
    );
};

export default Dashboard;
