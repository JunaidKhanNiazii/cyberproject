import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Shield, Send, Search, Lock, Unlock, User, MessageSquare, AlertCircle, RefreshCw } from 'lucide-react';
import { db } from '../firebase/config';
import { collection, query, where, onSnapshot, addDoc, serverTimestamp, doc, getDoc, getDocs } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { encrypt, decrypt } from '../utils/rsa';

const SecureMessages = () => {
    const { user } = useAuth();
    const [users, setUsers] = useState([]);
    const [messages, setMessages] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [messageInput, setMessageInput] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [myPrivateKey, setMyPrivateKey] = useState(null);
    const [isDecrypting, setIsDecrypting] = useState({});

    // Fetch User Directory
    useEffect(() => {
        const q = query(collection(db, 'users'), where('uid', '!=', user.uid));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const usersData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setUsers(usersData);
            setIsLoading(false);
        });
        return unsubscribe;
    }, [user]);

    // Fetch Inbox
    useEffect(() => {
        const q = query(
            collection(db, 'messages'),
            where('recipientId', '==', user.uid)
        );
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const msgData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })).sort((a, b) => b.timestamp?.seconds - a.timestamp?.seconds);
            setMessages(msgData);
        });
        return unsubscribe;
    }, [user]);

    // Fetch My Private Key from Vault
    const fetchKey = async () => {
        try {
            const keyDoc = await getDoc(doc(db, 'users', user.uid, 'vault', 'private_key'));
            if (keyDoc.exists()) {
                setMyPrivateKey(keyDoc.data());
            } else {
                setMyPrivateKey(null);
            }
        } catch (error) {
            console.error("Error fetching private key:", error);
        }
    };

    useEffect(() => {
        fetchKey();
    }, [user]);

    const handleSendMessage = async () => {
        if (!selectedUser || !messageInput || !selectedUser.publicKey) return;

        try {
            const encryptedContent = encrypt(
                messageInput,
                BigInt(selectedUser.publicKey.e),
                BigInt(selectedUser.publicKey.n)
            );

            await addDoc(collection(db, 'messages'), {
                senderId: user.uid,
                senderName: user.displayName || user.email.split('@')[0],
                recipientId: selectedUser.uid,
                content: encryptedContent,
                recipientN: selectedUser.publicKey.n, // Store the N value used for encryption
                timestamp: serverTimestamp()
            });

            setMessageInput('');
            setSelectedUser(null);
        } catch (error) {
            console.error("Encryption/Send failed:", error);
        }
    };

    const handleDecryptMessage = (msgId, encryptedContent, recipientN) => {
        if (!myPrivateKey) {
            alert("No private key found in vault. Please vault your private key in the Dashboard first.");
            return;
        }

        // Optional: Verify modulus match if available
        if (recipientN && recipientN !== myPrivateKey.n) {
            alert("Key Mismatch: This message was encrypted for a different RSA identity. You likely regenerated your keys after this message was sent.");
            return;
        }

        try {
            setIsDecrypting({ ...isDecrypting, [msgId]: true });
            const decrypted = decrypt(
                encryptedContent,
                BigInt(myPrivateKey.d),
                BigInt(myPrivateKey.n)
            );

            setMessages(messages.map(m =>
                m.id === msgId ? { ...m, decryptedContent: decrypted } : m
            ));
        } catch (error) {
            console.error("Decryption failed:", error);
            alert("Decryption Error: The mathematical proof failed. Ensure your current private key is the exact pair for the public key used to send this message.");
        } finally {
            setIsDecrypting({ ...isDecrypting, [msgId]: false });
        }
    };

    const filteredUsers = users.filter(u =>
        u.displayName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 md:mb-12 gap-6">
                <div className="text-left w-full flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 flex items-center gap-3">
                            <MessageSquare className="text-cyber-cyan" /> Secure Messaging Hub
                        </h1>
                        <p className="text-sm md:text-base text-gray-400">P2P Encryption using Recipient Public Keys.</p>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className={`px-4 py-2 rounded-xl flex items-center gap-3 border transition-all ${myPrivateKey ? 'bg-cyber-green/10 border-cyber-green/30 text-cyber-green' : 'bg-red-500/10 border-red-500/30 text-red-500 animate-pulse'}`}>
                            <Shield className="w-4 h-4" />
                            <div className="text-left">
                                <p className="text-[10px] font-black uppercase tracking-wider leading-none mb-1">Decryption Vault</p>
                                <p className="text-[8px] font-mono opacity-80 uppercase tracking-widest font-bold">
                                    {myPrivateKey ? `ACTIVE IDENTITY: ${myPrivateKey.n.substring(0, 10)}...` : 'VOID - NO PRIVATE KEY LOADED'}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={fetchKey}
                            className="p-3 glass rounded-xl text-gray-400 hover:text-white hover:glow-cyan transition-all"
                            title="Refresh Keys"
                        >
                            <RefreshCw className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* User Directory */}
                <div className="lg:col-span-1 glass rounded-2xl border-white/5 flex flex-col h-[600px]">
                    <div className="p-6 border-b border-white/5">
                        <h2 className="font-bold text-white flex items-center gap-2 mb-4">
                            <Search className="w-4 h-4 text-cyber-cyan" /> User Directory
                        </h2>
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search users..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-4 pr-10 text-sm focus:outline-none focus:border-cyber-cyan transition-all"
                            />
                        </div>
                    </div>
                    <div className="flex-grow overflow-y-auto p-4 space-y-2 custom-scrollbar">
                        {isLoading ? (
                            <div className="flex justify-center p-8"><RefreshCw className="animate-spin text-cyber-cyan" /></div>
                        ) : filteredUsers.length > 0 ? (
                            filteredUsers.map(u => (
                                <button
                                    key={u.uid}
                                    onClick={() => setSelectedUser(u)}
                                    className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all border ${selectedUser?.uid === u.uid ? 'bg-cyber-cyan/10 border-cyber-cyan/30' : 'hover:bg-white/5 border-transparent text-gray-400 hover:text-white'}`}
                                >
                                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border border-white/10">
                                        {u.photoURL ? <img src={u.photoURL} className="w-full h-full rounded-full" /> : <User className="w-5 h-5" />}
                                    </div>
                                    <div className="text-left">
                                        <p className="text-sm font-bold truncate max-w-[150px]">{u.displayName}</p>
                                        <div className="flex items-center gap-1">
                                            <div className={`w-1.5 h-1.5 rounded-full ${u.publicKey ? 'bg-cyber-green shadow-[0_0_5px_rgba(16,185,129,0.5)]' : 'bg-gray-600'}`}></div>
                                            <p className="text-[8px] uppercase tracking-widest">{u.publicKey ? 'Identity Set' : 'No Public Key'}</p>
                                        </div>
                                    </div>
                                </button>
                            ))
                        ) : (
                            <p className="text-center text-gray-600 py-8 text-xs">No users found</p>
                        )}
                    </div>
                </div>

                {/* Secure Messaging Area */}
                <div className="lg:col-span-2 space-y-8 h-[600px] flex flex-col">
                    {selectedUser ? (
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="glass rounded-2xl border-white/5 flex flex-col h-full overflow-hidden"
                        >
                            <div className="p-6 border-b border-white/5 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-cyber-cyan/20 flex items-center justify-center text-cyber-cyan border border-cyber-cyan/30">
                                        <Mail className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-white">Encrypt to {selectedUser.displayName}</h3>
                                        <p className="text-[10px] text-cyber-cyan uppercase font-mono tracking-widest">Target: {selectedUser.uid.substring(0, 10)}...</p>
                                    </div>
                                </div>
                                <button onClick={() => setSelectedUser(null)} className="text-gray-500 hover:text-white">Esc</button>
                            </div>

                            {!selectedUser.publicKey && (
                                <div className="p-8 text-center flex-grow flex flex-col items-center justify-center">
                                    <AlertCircle className="w-12 h-12 text-amber-500 mb-4 opacity-50" />
                                    <p className="text-amber-500 font-bold uppercase text-[10px] tracking-widest mb-2">Incompatible Recipient</p>
                                    <p className="text-gray-500 text-xs">This user hasn't published their RSA Identity yet. You cannot send them encrypted mail.</p>
                                </div>
                            )}

                            {selectedUser.publicKey && (
                                <>
                                    <div className="flex-grow p-6 space-y-6">
                                        <div className="p-4 bg-cyber-cyan/[0.03] border border-cyber-cyan/10 rounded-2xl">
                                            <div className="flex items-center gap-2 mb-3">
                                                <Shield className="w-3 h-3 text-cyber-cyan" />
                                                <span className="text-[10px] text-cyber-cyan font-black uppercase tracking-widest">Handshake Active</span>
                                            </div>
                                            <p className="text-xs text-gray-400 font-mono break-all line-clamp-2">
                                                Recipient Public Key (n): {selectedUser.publicKey.n}
                                            </p>
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-2">Sensitive Message</label>
                                            <textarea
                                                value={messageInput}
                                                onChange={(e) => setMessageInput(e.target.value)}
                                                placeholder="Type your secure message here..."
                                                className="w-full h-48 bg-white/5 border border-white/10 rounded-2xl p-6 text-white text-lg placeholder-gray-700 focus:outline-none focus:border-cyber-cyan/50 transition-all resize-none shadow-inner"
                                            />
                                        </div>
                                    </div>
                                    <div className="p-6 bg-white/[0.02]">
                                        <button
                                            onClick={handleSendMessage}
                                            disabled={!messageInput}
                                            className="w-full py-4 bg-cyber-cyan text-cyber-black font-black uppercase tracking-[0.3em] rounded-2xl hover:bg-white transition-all shadow-[0_0_30px_rgba(0,242,255,0.2)] flex items-center justify-center gap-3 disabled:opacity-30"
                                        >
                                            <Send className="w-5 h-5" /> Execute Secure Send
                                        </button>
                                    </div>
                                </>
                            )}
                        </motion.div>
                    ) : (
                        <div className="glass rounded-2xl border-white/5 flex-grow overflow-hidden flex flex-col">
                            <div className="p-6 border-b border-white/5 flex items-center justify-between">
                                <h3 className="font-black text-white uppercase tracking-widest flex items-center gap-2">
                                    <Mail className="w-4 h-4 text-cyber-purple" /> Secure Inbox
                                </h3>
                                {!myPrivateKey && (
                                    <div className="flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/30 rounded-full text-[8px] text-amber-500 font-black uppercase">
                                        <AlertCircle className="w-3 h-3" /> Private Key Missing
                                    </div>
                                )}
                            </div>
                            <div className="flex-grow overflow-y-auto p-6 space-y-4 custom-scrollbar">
                                {messages.length > 0 ? (
                                    messages.map((m) => (
                                        <motion.div
                                            key={m.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="p-5 glass border-white/5 rounded-2xl relative group overflow-hidden"
                                        >
                                            <div className="flex justify-between items-start mb-4">
                                                <div>
                                                    <p className="text-[10px] text-cyber-purple font-black uppercase tracking-widest mb-1">Incoming Transmission</p>
                                                    <p className="text-sm font-bold text-white flex items-center gap-2">
                                                        From: {m.senderName}
                                                        <span className="text-[10px] text-gray-600 font-mono font-normal">[{m.senderId.substring(0, 8)}]</span>
                                                    </p>
                                                </div>
                                                <span className="text-[9px] text-gray-500 font-mono">{m.timestamp?.toDate().toLocaleString()}</span>
                                            </div>

                                            <div className="bg-black/30 rounded-xl p-4 border border-white/5 mb-4 relative overflow-hidden">
                                                {m.decryptedContent ? (
                                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-3">
                                                        <Unlock className="w-4 h-4 text-cyber-green" />
                                                        <p className="text-sm font-bold text-white selection:bg-cyber-green selection:text-black">{m.decryptedContent}</p>
                                                    </motion.div>
                                                ) : (
                                                    <div className="flex flex-col gap-2">
                                                        <div className="flex items-center gap-2 text-[9px] text-gray-600 font-mono">
                                                            <Lock className="w-3 h-3" /> EXECUTING RSA SHIELD...
                                                        </div>
                                                        <p className="text-[10px] font-mono text-gray-700 break-all leading-tight">
                                                            {m.content.substring(0, 150)}...
                                                        </p>
                                                    </div>
                                                )}
                                            </div>

                                            {!m.decryptedContent && (
                                                <button
                                                    onClick={() => handleDecryptMessage(m.id, m.content, m.recipientN)}
                                                    disabled={isDecrypting[m.id] || !myPrivateKey}
                                                    className={`w-full py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${!myPrivateKey ? 'bg-white/5 text-gray-600 cursor-not-allowed' : 'bg-cyber-green/10 border border-cyber-green/30 text-cyber-green hover:bg-cyber-green hover:text-black shadow-lg shadow-cyber-green/10'}`}
                                                >
                                                    {isDecrypting[m.id] ? <RefreshCw className="animate-spin w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                                                    {m.recipientN && m.recipientN !== myPrivateKey?.n ? 'Mismatched Identity' : 'Solve with Private Key'}
                                                </button>
                                            )}
                                            {m.recipientN && myPrivateKey && m.recipientN !== myPrivateKey.n && !m.decryptedContent && (
                                                <p className="mt-2 text-[8px] text-red-500/70 text-center uppercase font-bold tracking-tight">
                                                    Warning: Encrypted for a different key cycle.
                                                </p>
                                            )}
                                        </motion.div>
                                    ))
                                ) : (
                                    <div className="h-full flex flex-col items-center justify-center text-center py-20 opacity-20">
                                        <Mail className="w-16 h-16 mb-4" />
                                        <p className="text-gray-500 font-black uppercase tracking-[0.2em] text-xs">Inbox Empty</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SecureMessages;
