'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Database, Shield, Zap, Layers, Cpu, Cloud, Code } from 'lucide-react';

const mockTools = [
    { name: 'Vercel', category: 'Hosting', icon: Cloud, color: 'text-white', bg: 'bg-zinc-800' },
    { name: 'Supabase', category: 'Database', icon: Database, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
    { name: 'Stripe', category: 'Payments', icon: Code, color: 'text-indigo-400', bg: 'bg-indigo-400/10' },
    { name: 'Clerk', category: 'Auth', icon: Shield, color: 'text-purple-400', bg: 'bg-purple-400/10' },
    { name: 'Upstash', category: 'Redis', icon: Zap, color: 'text-rose-400', bg: 'bg-rose-400/10' },
];

export function HeroMockup() {
    const [activeStep, setActiveStep] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setActiveStep((prev) => (prev + 1) % 4);
        }, 2800);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="relative mx-auto mt-20 max-w-5xl px-4 sm:px-6 lg:px-8 perspective-1000 z-20">
            <motion.div
                initial={{ opacity: 0, y: 60, rotateX: 25 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="rounded-[2rem] border border-[var(--border)] bg-zinc-950/80 backdrop-blur-2xl shadow-[0_30px_100px_-15px_rgba(0,0,0,0.8)] overflow-hidden relative transform-gpu ring-1 ring-white/10"
            >
                {/* Browser Header */}
                <div className="flex items-center px-6 py-4 border-b border-[var(--border)] bg-zinc-900/40">
                    <div className="flex gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500/80 shadow-sm" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500/80 shadow-sm" />
                        <div className="w-3 h-3 rounded-full bg-green-500/80 shadow-sm" />
                    </div>
                    <div className="mx-auto flex items-center justify-center bg-zinc-800/40 px-6 py-1.5 rounded-full text-xs text-zinc-400 font-mono shadow-inner border border-white/5">
                        <Shield className="w-3 h-3 mr-2" />
                        techstackengine.com/builder
                    </div>
                </div>

                {/* Dashboard Content */}
                <div className="flex h-[450px] md:h-[550px]">
                    {/* Sidebar */}
                    <div className="hidden md:flex w-72 border-r border-[var(--border)] bg-zinc-900/30 flex-col p-6">
                        <div className="h-4 w-1/3 bg-zinc-800 rounded-md mb-8" />
                        <div className="space-y-5">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <div key={i} className="flex items-center gap-4">
                                    <div className="w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700/50" />
                                    <div className="flex flex-col gap-2 w-full">
                                        <div className="h-3 w-1/2 bg-zinc-700 rounded opacity-60" />
                                        <div className="h-2 w-full bg-zinc-800 rounded opacity-40" />
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-auto p-5 rounded-2xl border border-[var(--primary)]/20 bg-gradient-to-b from-[var(--primary)]/5 to-transparent relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary)]/10 to-transparent pointer-events-none" />
                            <div className="flex justify-between items-center mb-3">
                                <div className="text-[10px] uppercase tracking-widest text-[var(--primary)] font-bold">Status</div>
                                <div className="w-2 h-2 rounded-full bg-[var(--primary)] animate-ping" />
                            </div>
                            <div className="text-sm font-medium text-white mb-4">
                                {activeStep === 0 ? "Analyzing requirements" : activeStep === 1 ? "Mapping architectures" : "Stack generated"}
                            </div>
                            <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full"
                                    animate={{ width: activeStep === 0 ? '15%' : activeStep === 1 ? '60%' : '100%' }}
                                    transition={{ duration: 1.5, ease: "easeInOut" }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Main Area */}
                    <div className="flex-1 p-8 lg:p-12 bg-[#09090b]/80 relative overflow-hidden flex flex-col">
                        {/* Background Gradients */}
                        <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-emerald-500/10 blur-[100px] rounded-full pointer-events-none" />
                        <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-blue-500/10 blur-[100px] rounded-full pointer-events-none" />

                        <header className="flex justify-between items-end mb-10 relative z-10">
                            <div>
                                <h2 className="text-3xl font-bold tracking-tight text-white mb-2">Stack Builder</h2>
                                <div className="text-zinc-400 text-sm flex items-center gap-3">
                                    <span className="flex items-center gap-2 text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded border border-emerald-400/20">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Live Engine
                                    </span>
                                    <span>Querying {mockTools.length} modules</span>
                                </div>
                            </div>
                            <div className="hidden sm:flex items-center gap-4">
                                <div className="px-4 py-2 rounded-xl border border-zinc-700/50 text-zinc-300 text-sm bg-zinc-800/20 backdrop-blur-md shadow-sm">
                                    Constraints: <span className="text-white font-medium">B2B SaaS</span>
                                </div>
                                <div className="px-5 py-2.5 rounded-xl bg-white text-zinc-950 font-bold text-sm shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:scale-105 transition-transform cursor-pointer">
                                    Export Stack
                                </div>
                            </div>
                        </header>

                        {/* Architecture Visualization */}
                        <div className="flex-1 rounded-[1.5rem] bg-zinc-900/40 border border-white/5 shadow-inner relative overflow-hidden p-8 flex items-center justify-center">

                            <AnimatePresence mode="wait">
                                {activeStep === 0 && (
                                    <motion.div
                                        key="step1"
                                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                                        className="text-center"
                                    >
                                        <Cpu className="w-20 h-20 text-zinc-600 mx-auto mb-6 animate-pulse" />
                                        <div className="text-xl text-zinc-300 font-semibold tracking-tight">Ingesting Constraints...</div>
                                        <div className="text-sm text-zinc-500 mt-3 font-mono bg-zinc-950 px-3 py-1.5 rounded-lg inline-block border border-zinc-800">
                                            SOC2 <span className="text-zinc-700 mx-2">|</span> TypeScript <span className="text-zinc-700 mx-2">|</span> Budget $100
                                        </div>
                                    </motion.div>
                                )}
                                {activeStep === 1 && (
                                    <motion.div
                                        key="step2"
                                        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.05 }}
                                        className="text-center"
                                    >
                                        <Layers className="w-20 h-20 text-blue-500 mx-auto mb-6 animate-bounce" />
                                        <div className="text-xl text-zinc-300 font-semibold tracking-tight">Mapping Compatibility Graph...</div>
                                        <div className="text-sm text-zinc-500 mt-3 font-mono bg-zinc-950 px-3 py-1.5 rounded-lg inline-block border border-zinc-800">
                                            Checking 2,000+ permutations
                                        </div>
                                    </motion.div>
                                )}
                                {(activeStep === 2 || activeStep === 3) && (
                                    <motion.div
                                        key="step3"
                                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                        className="w-full h-full flex items-center"
                                    >
                                        <div className="w-full grid grid-cols-2 lg:grid-cols-3 gap-5">
                                            {mockTools.map((tool, i) => (
                                                <motion.div
                                                    key={tool.name}
                                                    initial={{ opacity: 0, scale: 0.8, y: 20 }}
                                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                                    transition={{ delay: i * 0.15, type: "spring", stiffness: 200 }}
                                                    className="p-5 rounded-2xl border border-zinc-800 bg-zinc-900/60 flex flex-col items-center justify-center text-center relative group hover:bg-zinc-800 transition-colors shadow-lg"
                                                >
                                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 shadow-inner ${tool.bg} ${tool.color}`}>
                                                        <tool.icon className="w-7 h-7" />
                                                    </div>
                                                    <div className="font-semibold text-zinc-200">{tool.name}</div>
                                                    <div className="text-xs font-mono text-zinc-500 mt-1">{tool.category}</div>

                                                    {i !== 0 && (
                                                        <motion.div
                                                            initial={{ width: 0 }}
                                                            animate={{ width: "24px" }}
                                                            transition={{ delay: 0.8 + (i * 0.1) }}
                                                            className="absolute top-1/2 -left-6 h-px bg-zinc-700 hidden lg:block"
                                                        />
                                                    )}
                                                </motion.div>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Decorative environment glows matching the mockup container */}
            <div className="absolute top-[20%] left-[15%] w-[30%] h-[30%] bg-[var(--primary)]/30 blur-[120px] rounded-full pointer-events-none mix-blend-screen" />
            <div className="absolute top-[30%] right-[15%] w-[40%] h-[40%] bg-blue-500/20 blur-[130px] rounded-full pointer-events-none mix-blend-screen" />
            <div className="absolute bottom-[10%] left-[30%] w-[35%] h-[35%] bg-emerald-500/20 blur-[140px] rounded-full pointer-events-none mix-blend-screen" />
        </div>
    );
}
