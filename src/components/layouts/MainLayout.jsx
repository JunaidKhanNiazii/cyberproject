import React from 'react';
import Navbar from '../Navbar';
import Footer from '../Footer';
import { motion } from 'framer-motion';

const MainLayout = ({ children }) => {
    return (
        <div className="min-h-screen bg-cyber-black text-white relative overflow-hidden flex flex-col">
            {/* Background Effects */}
            <div className="absolute inset-0 matrix-bg opacity-20 md:opacity-30 pointer-events-none"></div>
            <div className="absolute top-0 left-0 w-full h-[300px] md:h-96 bg-cyber-cyan/5 blur-[80px] md:blur-[120px] rounded-full -translate-y-1/2 pointer-events-none"></div>
            <div className="absolute bottom-0 right-0 w-full h-[300px] md:h-96 bg-cyber-purple/5 blur-[80px] md:blur-[120px] rounded-full translate-y-1/2 pointer-events-none"></div>

            <Navbar />

            <main className="flex-grow pt-16">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                >
                    {children}
                </motion.div>
            </main>

            <Footer />
        </div>
    );
};

export default MainLayout;
