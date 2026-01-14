import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Play, Pause, SkipForward, RotateCcw,
    Target, Key, Calculator, Lock, Unlock,
    CheckCircle, AlertCircle, Sparkles, ArrowRight,
    RefreshCw, Cpu, BookOpen, Fingerprint
} from 'lucide-react';
import { isPrime, encrypt, decrypt } from '../utils/rsa';

const LearningMode = () => {
    const [step, setStep] = useState(0);
    const [autoPlay, setAutoPlay] = useState(false);
    const [p, setP] = useState('');
    const [q, setQ] = useState('');
    const [pValid, setPValid] = useState(null);
    const [qValid, setQValid] = useState(null);
    const [n, setN] = useState(null);
    const [phi, setPhi] = useState(null);
    const [e] = useState(65537n);
    const [d, setD] = useState(null);
    const [m, setM] = useState('HI');
    const [c, setC] = useState('');
    const [recovered, setRecovered] = useState('');
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [hasShownModal, setHasShownModal] = useState(false);
    const [primeMode, setPrimeMode] = useState('auto');
    const [keySize, setKeySize] = useState('educational');

    const autoPlayTimer = useRef(null);

    const steps = [
        { module: "Module I: Key Generation", title: "Key Generation Center", desc: "Configure your primes and generate the public/private key pair foundation." },
        { module: "Module II: Encryption", title: "Step 1: Message Input", desc: "Define the plaintext message you want to secure." },
        { module: "Module II: Encryption", title: "Step 2: ASCII Conversion", desc: "Transform text characters into numerical values for mathematical processing." },
        { module: "Module II: Encryption", title: "Step 3: Cipher Computation", desc: "Apply the modular exponentiation formula to create ciphertext." },
        { module: "Module III: Decryption", title: "Step 4: Decode Setup", desc: "Prepare the ciphertext and private key for recovery." },
        { module: "Module III: Decryption", title: "Step 5: Message Recovery", desc: "Compute the reverse modular formula to retrieve numerical values." },
        { module: "Module III: Decryption", title: "Step 6: ASCII to Text", desc: "Transform numerical values back into readable characters." },
        { module: "Module III: Decryption", title: "Step 7: Final Match", desc: "Verify the recovered message against the original plaintext." }
    ];

    useEffect(() => {
        if (autoPlay) {
            if (step < steps.length - 1) {
                autoPlayTimer.current = setTimeout(() => {
                    if (step === 0 && (!pValid || !qValid)) {
                        handleRandomPrimes();
                    } else {
                        setStep(s => s + 1);
                    }
                }, 4000);
            } else {
                setAutoPlay(false);
            }
        } else {
            clearTimeout(autoPlayTimer.current);
        }
        return () => clearTimeout(autoPlayTimer.current);
    }, [autoPlay, step, pValid, qValid]);

    const handlePChange = (val) => {
        const num = val.replace(/\D/g, '');
        setP(num);
        if (num) setPValid(isPrime(BigInt(num)));
        else setPValid(null);
    };

    const handleQChange = (val) => {
        const num = val.replace(/\D/g, '');
        setQ(num);
        if (num) setQValid(isPrime(BigInt(num)));
        else setQValid(null);
    };

    const handleRandomPrimes = () => {
        if (keySize === 'educational') {
            const primes = [101, 103, 107, 109, 113, 127, 131, 137, 139, 149, 151, 157, 163, 167, 173, 179, 181, 191, 193, 197, 199];
            const p1 = BigInt(primes[Math.floor(Math.random() * primes.length)]);
            let q1 = BigInt(primes[Math.floor(Math.random() * primes.length)]);
            while (p1 === q1) q1 = BigInt(primes[Math.floor(Math.random() * primes.length)]);
            setP(p1.toString());
            setQ(q1.toString());
        } else {
            setP("32416190071");
            setQ("32416190141");
        }
        setPValid(true);
        setQValid(true);
    };

    useEffect(() => {
        if (step >= 0 && pValid && qValid) {
            const valP = BigInt(p);
            const valQ = BigInt(q);
            setN(valP * valQ);
            const valPhi = (valP - 1n) * (valQ - 1n);
            setPhi(valPhi);

            const extendedGCD = (a, b) => {
                if (a === 0n) return [b, 0n, 1n];
                let [g, x1, y1] = extendedGCD(b % a, a);
                let x = y1 - (b / a) * x1;
                let y = x1;
                return [g, x, y];
            };
            let [, x] = extendedGCD(e, valPhi);
            setD((x % valPhi + valPhi) % valPhi);
        }
        if (step >= 3 && n) setC(encrypt(m, e, n));
        if (step >= 6 && d && n && c) {
            const result = decrypt(c, d, n);
            setRecovered(result);
            if (step === 7 && result === m && !hasShownModal) {
                setHasShownModal(true);
                setTimeout(() => setShowSuccessModal(true), 1500);
            }
        }
    }, [step, p, q, n, phi, e, m, c, d, pValid, qValid, hasShownModal]);

    const renderVisuals = () => {
        switch (step) {
            case 0:
                return (
                    <div className="flex flex-col items-center gap-6 py-4 w-full max-w-4xl">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
                            <div className="glass p-5 md:p-6 rounded-2xl md:rounded-[2rem] border-white/5 space-y-6">
                                <div className="flex items-center justify-between mb-2 md:mb-4">
                                    <div className="flex items-center gap-2">
                                        <Target className="w-4 h-4 text-cyber-cyan" />
                                        <span className="text-[10px] font-black uppercase tracking-widest text-cyber-cyan">Prime Center</span>
                                    </div>
                                    <div className="flex gap-1 md:gap-2">
                                        <div className="flex p-0.5 md:p-1 bg-white/5 rounded-lg border border-white/10 scale-75 md:scale-90">
                                            <button onClick={() => setPrimeMode('auto')} className={`px-2 md:px-4 py-1 rounded-md md:rounded-lg text-[10px] md:text-xs font-bold transition-all ${primeMode === 'auto' ? 'bg-cyber-cyan text-cyber-black shadow-lg shadow-cyber-cyan/30' : 'text-gray-500 hover:text-white'}`}>AUTO</button>
                                            <button onClick={() => setPrimeMode('manual')} className={`px-2 md:px-4 py-1 rounded-md md:rounded-lg text-[10px] md:text-xs font-bold transition-all ${primeMode === 'manual' ? 'bg-cyber-cyan text-cyber-black shadow-lg shadow-cyber-cyan/30' : 'text-gray-500 hover:text-white'}`}>MANUAL</button>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-around items-center gap-2">
                                    <div className="flex flex-col items-center gap-2">
                                        <label className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Prime P</label>
                                        <input
                                            type="text"
                                            value={p}
                                            onChange={(e) => handlePChange(e.target.value)}
                                            readOnly={primeMode === 'auto'}
                                            placeholder="P"
                                            className={`w-16 h-16 md:w-24 md:h-24 bg-white/5 border-2 rounded-2xl md:rounded-3xl text-center text-xl md:text-2xl font-black font-mono focus:outline-none transition-all ${pValid ? 'border-cyber-cyan/50 text-cyber-cyan glow-cyan' : 'border-white/10 text-gray-600'}`}
                                        />
                                    </div>
                                    <span className="text-xl font-bold text-white/10 mt-6">×</span>
                                    <div className="flex flex-col items-center gap-2">
                                        <label className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Prime Q</label>
                                        <input
                                            type="text"
                                            value={q}
                                            onChange={(e) => handleQChange(e.target.value)}
                                            readOnly={primeMode === 'auto'}
                                            placeholder="Q"
                                            className={`w-16 h-16 md:w-24 md:h-24 bg-white/5 border-2 rounded-2xl md:rounded-3xl text-center text-xl md:text-2xl font-black font-mono focus:outline-none transition-all ${qValid ? 'border-cyber-purple/50 text-cyber-purple glow-blue' : 'border-white/10 text-gray-600'}`}
                                        />
                                    </div>
                                </div>
                                {primeMode === 'auto' && (
                                    <button onClick={handleRandomPrimes} className="w-full py-3 bg-cyber-cyan/10 border border-cyber-cyan/30 text-cyber-cyan rounded-xl md:rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-cyber-cyan hover:text-cyber-black transition-all flex items-center justify-center gap-2">
                                        <RefreshCw className="w-3 h-3" /> Auto-Generate Foundation
                                    </button>
                                )}
                            </div>
                            <div className="glass p-5 md:p-6 rounded-2xl md:rounded-[2rem] border-white/5 grid grid-cols-2 gap-3 md:gap-4">
                                <div className="col-span-2 flex items-center gap-2 mb-1 md:mb-2">
                                    <Calculator className="w-4 h-4 text-cyber-purple" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-cyber-purple">Real-time Engine</span>
                                </div>
                                <div className="p-3 md:p-4 bg-white/5 rounded-xl md:rounded-2xl border border-white/5 overflow-hidden">
                                    <span className="text-[8px] md:text-[9px] text-gray-500 font-bold uppercase block mb-1">Modulus (n)</span>
                                    <div className="text-sm md:text-xl font-mono font-black text-white truncate">{n?.toString() || '?'}</div>
                                    <span className="text-[7px] md:text-[8px] text-cyber-cyan/50 font-mono">p * q</span>
                                </div>
                                <div className="p-3 md:p-4 bg-white/5 rounded-xl md:rounded-2xl border border-white/5 overflow-hidden">
                                    <span className="text-[8px] md:text-[9px] text-gray-500 font-bold uppercase block mb-1">Totient (φ)</span>
                                    <div className="text-sm md:text-xl font-mono font-black text-white truncate">{phi?.toString() || '?'}</div>
                                    <span className="text-[7px] md:text-[8px] text-cyber-purple/50 font-mono">(p-1)*(q-1)</span>
                                </div>
                                <div className="p-3 md:p-4 bg-cyber-purple/5 rounded-xl md:rounded-2xl border border-cyber-purple/20 shadow-[0_0_20px_rgba(168,85,247,0.1)]">
                                    <span className="text-[8px] md:text-[9px] text-cyber-purple font-black uppercase block mb-1">Public Key (e)</span>
                                    <div className="text-sm md:text-xl font-mono font-black text-white">{e.toString()}</div>
                                    <span className="text-[7px] md:text-[8px] text-white/30 font-mono">Input for encryption</span>
                                </div>
                                <div className="p-3 md:p-4 bg-cyber-green/5 rounded-xl md:rounded-2xl border border-cyber-green/20 shadow-[0_0_20px_rgba(16,185,129,0.1)] overflow-hidden">
                                    <span className="text-[8px] md:text-[9px] text-cyber-green font-black uppercase block mb-1">Private Key (d)</span>
                                    <div className="text-sm md:text-xl font-mono font-black text-white truncate">{d?.toString() || '?'}</div>
                                    <span className="text-[7px] md:text-[8px] text-white/30 font-mono">Secret for decryption</span>
                                </div>
                            </div>
                        </div>
                        <div className="mt-2 md:mt-4 px-6 md:px-8 py-3 bg-cyber-cyan/5 border border-cyber-cyan/20 rounded-xl md:rounded-2xl w-full">
                            <p className="text-[8px] md:text-[10px] text-cyber-cyan font-black uppercase tracking-widest text-center">
                                Status: Key Foundation Solidified. Ready for Cryptographic Operations.
                            </p>
                        </div>
                    </div>
                );
            case 1:
                return (
                    <div className="py-6 flex flex-col items-center gap-6 w-full max-w-3xl text-center">
                        <div className="w-full glass-cyan p-10 rounded-[3rem] border-white/10 shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-10"><BookOpen className="w-12 h-12" /></div>
                            <div className="flex flex-col items-center gap-2 mb-8">
                                <span className="text-[10px] text-cyber-cyan font-black uppercase tracking-[0.5em] mb-2 border border-cyber-cyan/30 px-4 py-1 rounded-full">User Task</span>
                                <h3 className="text-2xl font-black text-white uppercase tracking-tight">Set Plaintext Message</h3>
                            </div>
                            <input
                                type="text"
                                value={m}
                                onChange={(e) => setM(e.target.value.toUpperCase().substring(0, 10))}
                                placeholder="ENTER MESSAGE"
                                className="w-full bg-white/5 border-2 border-white/10 rounded-3xl px-8 py-6 text-4xl font-black text-white placeholder-white/5 focus:outline-none focus:border-cyber-cyan transition-all tracking-[0.2em] text-center uppercase"
                            />
                            <div className="mt-8 flex items-center justify-center gap-4 text-gray-500 text-xs font-bold">
                                <span className="px-3 py-1 bg-white/5 rounded-lg border border-white/5">LIMIT: 10 CHARS</span>
                                <span className="px-3 py-1 bg-white/5 rounded-lg border border-white/5">ENCRYPTION: PER CHARACTER</span>
                            </div>
                        </div>
                    </div>
                );
            case 2:
                return (
                    <div className="py-6 flex flex-col items-center gap-8 w-full max-w-4xl text-center">
                        <div className="flex flex-col items-center gap-1 mb-4">
                            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">System Operation</span>
                            <h3 className="text-xl font-bold text-white uppercase">Mapping Characters to ASCII</h3>
                        </div>
                        <div className="flex flex-wrap gap-4 justify-center">
                            {m.split('').map((char, i) => (
                                <motion.div key={i} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: i * 0.1 }} className="flex flex-col items-center gap-2">
                                    <div className="w-16 h-16 glass rounded-2xl flex items-center justify-center text-2xl font-black text-cyber-cyan border-2 border-cyber-cyan/20">{char}</div>
                                    <ArrowRight className="w-4 h-4 text-gray-600 rotate-90" />
                                    <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-xl font-mono font-bold text-white border border-white/10 shadow-lg">{char.charCodeAt(0)}</div>
                                </motion.div>
                            ))}
                        </div>
                        <div className="mt-8 p-6 glass rounded-2xl border-white/5 max-w-lg">
                            <p className="text-xs text-gray-400 leading-relaxed">RSA handles math, not text. Every character is converted into its standard <span className="text-cyber-cyan font-bold">ASCII numerical value</span> before encryption begins.</p>
                        </div>
                    </div>
                );
            case 3:
                return (
                    <div className="py-4 md:py-6 flex flex-col items-center gap-6 md:gap-8 w-full max-w-4xl text-center">
                        <div className="w-full bg-cyber-purple/5 border border-cyber-purple/20 rounded-3xl md:rounded-[3rem] p-6 md:p-10 text-center shadow-2xl relative overflow-hidden">
                            <div className="absolute -bottom-10 -left-10 opacity-5 rotate-12"><Lock className="w-24 h-24 md:w-40 md:h-40 text-cyber-purple" /></div>
                            <h3 className="text-[10px] font-black text-cyber-purple uppercase mb-6 md:mb-8 flex items-center justify-center gap-3 tracking-[0.3em]">
                                <Cpu className="w-4 h-4 md:w-5 md:h-5" /> Phase II Logic: Modular Exponentiation
                            </h3>
                            <div className="flex items-center justify-center gap-3 md:gap-6 text-xl md:text-4xl font-mono font-black text-white mb-8 md:mb-10">
                                <span className="text-cyber-cyan">m</span>
                                <span className="text-gray-500">^</span>
                                <span className="text-cyber-purple">e</span>
                                <span className="text-gray-500">mod</span>
                                <span className="text-gray-400">n</span>
                                <span className="text-gray-500">=</span>
                                <span className="text-cyber-purple">c</span>
                            </div>
                            <div className="flex flex-wrap gap-2 md:gap-4 justify-center">
                                {m.split('').map((char, i) => (
                                    <div key={i} className="flex flex-col items-center gap-1 p-2 md:p-4 bg-white/5 rounded-xl md:rounded-2xl border border-white/5 min-w-[80px] md:min-w-[120px]">
                                        <div className="text-[8px] md:text-[10px] text-cyber-cyan font-mono font-bold">{char} ({char.charCodeAt(0)})</div>
                                        <div className="text-sm md:text-lg font-mono font-black text-white truncate w-full">→ {c.split(',')[i]?.substring(0, 6)}...</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="px-6 md:px-8 py-3 md:py-4 bg-cyber-purple/10 border border-cyber-purple/30 rounded-xl md:rounded-2xl">
                            <span className="text-[10px] text-cyber-purple font-black uppercase tracking-widest">Output: Ciphertext Encrypted</span>
                        </div>
                    </div>
                );
            case 4:
                return (
                    <div className="py-4 md:py-6 flex flex-col items-center gap-6 md:gap-8 w-full max-w-3xl text-center">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 w-full">
                            <div className="glass p-6 md:p-8 rounded-2xl md:rounded-3xl border-white/5 shadow-xl relative overflow-hidden text-left">
                                <div className="absolute top-0 right-0 p-4 opacity-10"><Fingerprint className="w-10 h-10 md:w-12 md:h-12" /></div>
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-4">Input: Ciphertext (C)</label>
                                <div className="text-[10px] md:text-xs font-mono text-cyber-purple break-all bg-white/5 p-4 rounded-xl h-24 md:h-32 overflow-y-auto shadow-inner border border-white/5">
                                    {c}
                                </div>
                            </div>
                            <div className="glass p-6 md:p-8 rounded-2xl md:rounded-3xl border-white/5 shadow-xl relative overflow-hidden text-left">
                                <div className="absolute top-0 right-0 p-4 opacity-10"><Unlock className="w-10 h-10 md:w-12 md:h-12 text-cyber-green" /></div>
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-4">Input: Private Key</label>
                                <div className="space-y-3 md:space-y-4">
                                    <div>
                                        <span className="text-[8px] text-gray-500 uppercase block mb-1">Secret (d)</span>
                                        <div className="text-[10px] md:text-xs font-mono text-cyber-green bg-white/5 p-2 md:p-3 rounded-lg truncate">{d?.toString()}</div>
                                    </div>
                                    <div>
                                        <span className="text-[8px] text-gray-500 uppercase block mb-1">Modulus (n)</span>
                                        <div className="text-[10px] md:text-xs font-mono text-white/50 bg-white/5 p-2 md:p-3 rounded-lg truncate">{n?.toString()}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 5:
                return (
                    <div className="py-4 md:py-6 flex flex-col items-center gap-6 md:gap-8 w-full max-w-4xl text-center">
                        <div className="w-full bg-cyber-green/5 border border-cyber-green/20 rounded-3xl md:rounded-[3rem] p-6 md:p-10 text-center shadow-2xl relative overflow-hidden">
                            <div className="absolute -bottom-10 -right-10 opacity-5 -rotate-12"><Unlock className="w-24 h-24 md:w-40 md:h-40 text-cyber-green" /></div>
                            <h3 className="text-[10px] font-black text-cyber-green uppercase mb-6 md:mb-8 flex items-center justify-center gap-3 tracking-[0.3em]">
                                <Cpu className="w-4 h-4 md:w-5 md:h-5" /> Step 5: Decryption Math
                            </h3>
                            <div className="flex items-center justify-center gap-3 md:gap-6 text-xl md:text-4xl font-mono font-black text-white mb-8 md:mb-10">
                                <span className="text-cyber-purple">c</span>
                                <span className="text-gray-500">^</span>
                                <span className="text-cyber-green">d</span>
                                <span className="text-gray-500">mod</span>
                                <span className="text-gray-400">n</span>
                                <span className="text-gray-500">=</span>
                                <span className="text-cyber-cyan">m</span>
                            </div>
                            <div className="flex flex-wrap gap-2 md:gap-3 justify-center">
                                {c.split(',').map((num, i) => (
                                    <div key={i} className="px-3 md:px-4 py-2 md:py-3 bg-white/5 rounded-lg md:rounded-xl border border-white/10 text-[10px] md:text-xs font-mono text-white shadow-sm">
                                        {num.substring(0, 6)}.. ^ d mod n
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="px-6 md:px-8 py-3 md:py-4 bg-cyber-green/10 border border-cyber-green/30 rounded-xl md:rounded-2xl">
                            <span className="text-[10px] text-cyber-green font-black uppercase tracking-widest">Transformation: Restoring Secret Foundation</span>
                        </div>
                    </div>
                );
            case 6:
                return (
                    <div className="py-4 md:py-6 flex flex-col items-center gap-6 md:gap-8 w-full max-w-4xl text-center">
                        <div className="flex flex-col items-center gap-1 mb-4">
                            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">System Operation</span>
                            <h3 className="text-lg md:text-xl font-bold text-white uppercase">ASCII to Character</h3>
                        </div>
                        <div className="flex flex-wrap gap-3 md:gap-4 justify-center">
                            {recovered.split('').map((char, i) => (
                                <motion.div key={i} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: i * 0.1 }} className="flex flex-col items-center gap-2">
                                    <div className="w-12 h-12 md:w-16 md:h-16 bg-white/5 rounded-xl md:rounded-2xl flex items-center justify-center text-lg md:text-xl font-mono font-bold text-white border border-white/10 shadow-lg">{char.charCodeAt(0)}</div>
                                    <ArrowRight className="w-3 h-3 md:w-4 md:h-4 text-gray-600 rotate-90" />
                                    <div className="w-12 h-12 md:w-16 md:h-16 glass rounded-xl md:rounded-2xl flex items-center justify-center text-xl md:text-2xl font-black text-cyber-green border-2 border-cyber-green/20">{char}</div>
                                </motion.div>
                            ))}
                        </div>
                        <div className="mt-6 md:mt-8 p-4 md:p-6 glass rounded-2xl border-white/5 max-w-lg">
                            <p className="text-[10px] md:text-xs text-gray-400 leading-relaxed">The decryption math returned numerical codes. Now, the system maps these <span className="text-cyber-green font-bold">ASCII values</span> back to their original characters.</p>
                        </div>
                    </div>
                );
            case 7:
                return (
                    <div className="py-4 md:py-6 flex flex-col items-center gap-6 md:gap-8 w-full max-w-4xl text-center">
                        <div className="flex flex-col items-center gap-1 mb-2">
                            <span className="text-[10px] text-cyber-cyan font-black uppercase tracking-[0.5em] mb-4">Integrity: Analysis Result</span>
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="px-10 md:px-16 py-6 md:py-10 glass-cyan border-cyber-green/50 rounded-3xl md:rounded-[4rem] text-4xl md:text-7xl font-black text-white glow-cyan tracking-[0.4em] uppercase shadow-[0_0_60px_rgba(34,211,238,0.3)] border-2 mb-8"
                            >
                                {recovered}
                            </motion.div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 md:gap-8 w-full max-w-lg mt-4">
                            <div className="p-4 md:p-6 glass rounded-xl md:rounded-2xl border-white/5">
                                <span className="text-[8px] text-gray-500 uppercase block mb-1">Decoded ASCII</span>
                                <div className="flex gap-2 justify-center">
                                    {recovered.split('').map((char, i) => (
                                        <span key={i} className="text-[10px] font-mono text-white/50">{char.charCodeAt(0)}</span>
                                    ))}
                                </div>
                            </div>
                            <div className="p-4 md:p-6 glass rounded-xl md:rounded-2xl border-cyber-green/20">
                                <span className="text-[8px] text-cyber-green uppercase block mb-1">Integrity Check</span>
                                <div className="flex items-center justify-center gap-2 text-cyber-green text-[10px] md:text-xs font-bold">
                                    <CheckCircle className="w-3 h-3 md:w-4 md:h-4" /> SECURE MATCH
                                </div>
                            </div>
                        </div>
                    </div>
                );
            default: return null;
        }
    };

    return (
        <div className="max-w-6xl mx-auto px-4 py-6 md:py-8 flex flex-col min-h-[85vh]">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 md:mb-10 gap-6">
                <div className="text-center md:text-left">
                    <h1 className="text-2xl md:text-4xl font-black text-white mb-2 flex items-center justify-center md:justify-start gap-3 tracking-tighter">
                        <Sparkles className="w-6 h-6 md:w-8 md:h-8 text-cyber-cyan" /> RSA LEARNING MODE
                    </h1>
                    <div className="flex items-center justify-center md:justify-start gap-4 text-[9px] md:text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                        <span>Current Focus: {steps[step].module}</span>
                        <div className="w-1 h-1 rounded-full bg-white/20"></div>
                        <span>Simulation Active</span>
                    </div>
                </div>

                <div className="flex gap-4 p-1 md:p-1.5 glass rounded-xl md:rounded-2xl border-white/10 shadow-xl">
                    <button
                        onClick={() => setAutoPlay(!autoPlay)}
                        className={`px-4 md:px-6 py-2 md:py-2.5 rounded-lg md:rounded-xl text-[10px] md:text-xs font-black transition-all flex items-center gap-2 ${autoPlay ? 'bg-rose-500/20 text-rose-500 border border-rose-500/30' : 'bg-cyber-cyan text-cyber-black'}`}
                    >
                        {autoPlay ? <Pause className="w-3 h-3 md:w-4 md:h-4" /> : <Play className="w-3 h-3 md:w-4 md:h-4" />}
                        {autoPlay ? 'PAUSE' : 'AUTO-PLAY'}
                    </button>
                    <button
                        onClick={() => { setStep(0); setAutoPlay(false); setHasShownModal(false); }}
                        className="p-2 md:p-2.5 glass-cyan rounded-lg md:rounded-xl text-white hover:glow-cyan transition-all border border-white/10"
                        title="Reset Tutorial"
                    >
                        <RotateCcw className="w-4 h-4 md:w-5 md:h-5" />
                    </button>
                </div>
            </div>

            <div className="flex-grow glass rounded-3xl md:rounded-[3.5rem] relative overflow-hidden flex flex-col items-center justify-center p-6 md:p-8 min-h-[450px] md:min-h-[500px] shadow-2xl bg-gradient-to-br from-white/[0.02] to-transparent">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={step}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="w-full flex flex-col items-center"
                    >
                        <div className="text-center mb-8 md:mb-12">
                            <div className="text-cyber-cyan text-[8px] md:text-[10px] font-black uppercase tracking-[0.3em] md:tracking-[0.5em] mb-4 border-2 border-cyber-cyan/30 px-4 md:px-6 py-1.5 md:py-2 rounded-full inline-block bg-cyber-cyan/5 shadow-[0_0_20px_rgba(0,242,255,0.15)]">
                                {steps[step].module}
                            </div>
                            <h2 className="text-3xl md:text-5xl font-black text-white mb-2 uppercase tracking-tighter">
                                {steps[step].title}
                            </h2>
                            <p className="text-gray-400 text-xs md:text-sm max-w-lg mx-auto leading-relaxed border-t border-white/5 pt-4 md:pt-6 mt-4 mb-6 md:mb-8">
                                {steps[step].desc}
                            </p>

                            <div className="flex flex-col md:flex-row justify-center gap-4 md:gap-6 items-center">
                                <button
                                    onClick={() => setStep(Math.max(0, step - 1))}
                                    disabled={step === 0}
                                    className="w-full md:w-auto px-6 md:px-8 py-2.5 md:py-3 glass rounded-xl md:rounded-2xl text-[10px] font-black text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all uppercase tracking-widest border border-white/10 shadow-lg"
                                >
                                    Previous Step
                                </button>

                                <div className="flex gap-2 md:gap-3">
                                    {steps.map((_, i) => (
                                        <div
                                            key={i}
                                            className={`h-1.5 md:h-2 rounded-full transition-all duration-500 ${i === step ? 'w-8 md:w-12 bg-cyber-cyan glow-cyan' : i < step ? 'w-3 md:w-4 bg-cyber-green/50' : 'w-1.5 md:w-2 bg-white/10'}`}
                                        />
                                    ))}
                                </div>

                                <button
                                    onClick={() => setStep(Math.min(steps.length - 1, step + 1))}
                                    disabled={step === steps.length - 1}
                                    className="w-full md:w-auto px-8 md:px-10 py-2.5 md:py-3 bg-cyber-cyan text-cyber-black rounded-xl md:rounded-2xl text-[10px] font-black hover:scale-105 transition-all shadow-xl shadow-cyber-cyan/30 uppercase tracking-[0.2em]"
                                >
                                    Next Step
                                </button>
                            </div>
                        </div>
                        {renderVisuals()}
                    </motion.div>
                </AnimatePresence>

                <div className="mt-auto w-full pt-4 md:pt-6 border-t border-white/5 flex flex-col items-center">
                    <div className="bg-white/5 px-4 md:px-6 py-2.5 md:py-3 rounded-xl md:rounded-2xl border border-white/5 max-w-2xl text-center">
                        <div className="flex items-center justify-center gap-2 mb-1.5 md:mb-2">
                            <BookOpen className="w-3.5 h-3.5 md:w-4 md:h-4 text-cyber-cyan" />
                            <span className="text-[9px] md:text-[10px] font-black text-cyber-cyan uppercase tracking-widest">Learning Insight</span>
                        </div>
                        <p className="text-[10px] md:text-[11px] text-gray-400 leading-relaxed font-medium">
                            {step === 0 && "Key Generation is the foundation. Primes P and Q must be secret and large for real security."}
                            {step === 1 && "Start by choosing a message. RSA will encrypt each individual character's numerical value."}
                            {step === 2 && "ASCII is the bridge between text and math. Every 'A' is 65, every 'B' is 66, and so on."}
                            {step === 3 && "This is where the magic happens! We raise the number to the power of 'e' then take the remainder."}
                            {step === 4 && "To decrypt, you need the private key (d) which can only be derived if you know the original primes."}
                            {step === 5 && "Decryption is the 'inverse' of encryption. Mathematical symmetry allows us to reverse the lock."}
                            {step === 6 && "Numbers are meaningless to humans. We map the solved math back to characters using the ASCII table."}
                            {step === 7 && "The loop is complete. If the recovered text matches the original, the secure channel worked!"}
                        </p>
                    </div>
                </div>
            </div>

            <div className="mt-8 md:mt-10 flex flex-col md:flex-row justify-center gap-4 md:gap-8">
                <div className="flex items-center gap-3 px-4 md:px-6 py-3 md:py-4 glass rounded-xl md:rounded-2xl border-white/5">
                    <div className="p-2.5 md:p-3 bg-cyber-cyan/10 rounded-lg md:rounded-xl"><Lock className="w-4 h-4 md:w-5 md:h-5 text-cyber-cyan" /></div>
                    <div>
                        <div className="text-[9px] md:text-[10px] font-black text-gray-500 uppercase tracking-widest">Public Layer</div>
                        <div className="text-white font-mono text-[10px] md:text-xs">{e.toString()}, {n?.toString().substring(0, 10)}...</div>
                    </div>
                </div>
                <div className="flex items-center gap-3 px-4 md:px-6 py-3 md:py-4 glass rounded-xl md:rounded-2xl border-white/5">
                    <div className="p-2.5 md:p-3 bg-cyber-green/10 rounded-lg md:rounded-xl"><Unlock className="w-4 h-4 md:w-5 md:h-5 text-cyber-green" /></div>
                    <div>
                        <div className="text-[9px] md:text-[10px] font-black text-gray-500 uppercase tracking-widest">Private Layer</div>
                        <div className="text-white font-mono text-[10px] md:text-xs">{d?.toString().substring(0, 10)}...</div>
                    </div>
                </div>
            </div>

            {showSuccessModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="glass-cyan p-8 md:p-12 rounded-[2.5rem] md:rounded-[4rem] text-center max-w-lg border-2 border-cyber-green/50 shadow-[0_0_100px_rgba(34,211,238,0.2)]">
                        <div className="w-16 h-16 md:w-24 md:h-24 bg-cyber-green/20 rounded-full flex items-center justify-center mx-auto mb-6 md:mb-8 shadow-[0_0_40px_rgba(16,185,129,0.3)]">
                            <CheckCircle className="w-8 h-8 md:w-12 md:h-12 text-cyber-green" />
                        </div>
                        <h2 className="text-2xl md:text-4xl font-black text-white mb-4 uppercase tracking-tighter">RSA Verified</h2>
                        <p className="text-gray-400 text-sm md:text-lg mb-8 md:mb-10 leading-relaxed">
                            The message <span className="text-cyber-cyan font-bold">"{m}"</span> was successfully transformed and recovered using RSA.
                        </p>
                        <button onClick={() => setShowSuccessModal(false)} className="w-full py-4 md:py-5 bg-cyber-cyan text-cyber-black rounded-2xl md:rounded-3xl font-black uppercase tracking-widest md:tracking-[0.3em] hover:scale-105 transition-all shadow-xl shadow-cyber-cyan/30">
                            Dismiss
                        </button>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default LearningMode;
