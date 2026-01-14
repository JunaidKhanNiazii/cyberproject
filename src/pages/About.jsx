import React from 'react';
import { motion } from 'framer-motion';
import { Target, Key, Lock, Zap, BookOpen, Calculator, ShieldCheck } from 'lucide-react';

const About = () => {
    const rsaSteps = [
        {
            title: "1. Key Generation",
            icon: <Key className="w-6 h-6" />,
            content: "Choose two distinct prime numbers p and q. Compute n = pq. N is the modulus for both keys."
        },
        {
            title: "2. Totient Calculation",
            icon: <Calculator className="w-6 h-6" />,
            content: "Calculate Carmichael's totient function φ(n) = (p-1)(q-1). This is used to derive e and d."
        },
        {
            title: "3. Choose Public Exponent",
            icon: <Target className="w-6 h-6" />,
            content: "Choose an integer e such that 1 < e < φ(n) and gcd(e, φ(n)) = 1. Common choice is 65537."
        },
        {
            title: "4. Compute Private Key",
            icon: <ShieldCheck className="w-6 h-6" />,
            content: "Determine d as d ≡ e⁻¹ (mod φ(n)). D is the modular multiplicative inverse of e."
        },
        {
            title: "5. Encryption",
            icon: <Lock className="w-6 h-6" />,
            content: "Convert text to integer m. Ciphertext c is computed as c ≡ m^e (mod n)."
        },
        {
            title: "6. Decryption",
            icon: <Zap className="w-6 h-6" />,
            content: "Recover message m from c by computing m ≡ c^d (mod n)."
        }
    ];

    return (
        <div className="max-w-6xl mx-auto px-4 py-20">
            <div className="mb-20">
                <h1 className="text-5xl font-bold text-white mb-8 tracking-tight">Understanding RSA</h1>
                <div className="prose prose-invert max-w-none text-gray-400">
                    <p className="text-xl leading-relaxed mb-6">
                        RSA (Rivest–Shamir–Adleman) is one of the first public-key cryptosystems and is widely used for secure data transmission. In such a cryptosystem, the encryption key is public and distinct from the decryption key which is kept secret.
                    </p>
                    <div className="p-8 glass rounded-3xl border-cyber-cyan/20 my-12 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-5 rotate-12">
                            <ShieldCheck className="w-64 h-64 text-cyber-cyan" />
                        </div>
                        <h2 className="text-2xl font-bold text-cyber-cyan mb-4 flex items-center gap-2">
                            <BookOpen className="w-6 h-6" /> Mathematical Foundation
                        </h2>
                        <p className="mb-4 relative z-10 leading-relaxed">
                            The security of RSA relies on the practical difficulty of factoring the product of two large prime numbers, the "factoring problem". Breaking RSA encryption is known as the RSA problem. It is currently unknown whether it is as difficult as the factoring problem.
                        </p>
                        <code className="block bg-black/40 p-4 rounded-xl font-mono text-cyber-purple text-lg border border-white/5">
                            Public Key = (e, n) <br />
                            Private Key = (d, n)
                        </code>
                    </div>
                </div>
            </div>

            <div className="mb-24">
                <h2 className="text-3xl font-bold text-white mb-12 text-center">The Algorithm Lifecycle</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {rsaSteps.map((step, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="p-8 glass rounded-2xl border-white/5 hover:border-cyber-purple/30 transition-all"
                        >
                            <div className="w-12 h-12 bg-cyber-purple/10 rounded-xl flex items-center justify-center text-cyber-purple mb-6">
                                {step.icon}
                            </div>
                            <h3 className="text-xl font-bold text-white mb-4">{step.title}</h3>
                            <p className="text-gray-400 text-sm leading-relaxed">{step.content}</p>
                        </motion.div>
                    ))}
                </div>
            </div>

            <div className="text-center p-12 glass rounded-3xl border-cyber-green/20">
                <h2 className="text-2xl font-bold text-white mb-4">Historical Context</h2>
                <p className="text-gray-400 max-w-2xl mx-auto leading-relaxed">
                    Described in 1977 by Ron Rivest, Adi Shamir, and Leonard Adleman at MIT, the algorithm became public domain after a patent expiration in 2000. It remains the backbone of TLS/SSL and secure email protocols worldwide.
                </p>
            </div>
        </div>
    );
};

export default About;
