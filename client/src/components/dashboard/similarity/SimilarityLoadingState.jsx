import React from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '../shared/Components';
import { Search, Shield, Cpu, Database, Network, Fingerprint } from 'lucide-react';

const StrategyNode = ({ icon: Icon, label, active }) => (
    <div className={`flex items-center gap-3 px-4 py-2 rounded-lg border transition-all duration-500 ${
        active 
        ? 'border-cyan-500 bg-cyan-500/10 text-cyan-400 shadow-[0_0_15px_#00F5FF]/30' 
        : 'border-white/5 bg-white/2 text-slate-500'
    }`}>
        <Icon size={14} className={active ? 'animate-pulse' : ''} />
        <span className="font-mono text-[10px] uppercase tracking-widest">{label}</span>
    </div>
);

const SimilarityLoadingState = ({ elapsed, status }) => {
    const strategies = [
        { icon: Shield, label: 'Fork Correlation' },
        { icon: Cpu, label: 'Structural AST Scan' },
        { icon: Database, label: 'Global Hash Lookup' },
        { icon: Network, label: 'Author Graph Analysis' },
        { icon: Fingerprint, label: 'Winnowing Fingerprinting' },
        { icon: Search, label: 'Code Snippet Probe' }
    ];

    const activeNode = Math.floor(elapsed / 3) % strategies.length;

    return (
        <GlassCard className="py-20 flex flex-col items-center justify-center overflow-hidden">
            {/* Radar Animation */}
            <div className="relative w-64 h-64 mb-12">
                <div className="absolute inset-0 border border-cyan-500/20 rounded-full" />
                <div className="absolute inset-4 border border-cyan-500/10 rounded-full" />
                <div className="absolute inset-8 border border-cyan-500/5 rounded-full" />
                
                {/* Rotating Sweep */}
                <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                    className="absolute inset-0 rounded-full border-t border-cyan-500 h-full w-full"
                    style={{ background: 'conic-gradient(from 0deg, #00F5FF22 0deg, transparent 90deg)' }}
                />

                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <Search size={40} className="text-cyan-400 animate-pulse mb-2" />
                    <span className="orbitron text-[10px] font-bold text-cyan-400 tracking-widest animate-pulse">SCANNING</span>
                </div>
            </div>

            <div className="text-center mb-12">
                <h3 className="orbitron text-xl font-black text-white mb-2 uppercase tracking-widest">
                    AI Repository Probe in Progress
                </h3>
                <p className="font-mono text-xs text-slate-500 uppercase tracking-tighter">
                    Status: <span className="text-cyan-400 pr-2">{status}</span> 
                    Elapsed Time: <span className="text-white">{Math.floor(elapsed / 60)}:{(elapsed % 60).toString().padStart(2, '0')}</span>
                </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-2xl w-full">
                {strategies.map((s, i) => (
                    <StrategyNode 
                        key={s.label}
                        icon={s.icon} 
                        label={s.label} 
                        active={activeNode === i} 
                    />
                ))}
            </div>

            {/* Progress line */}
            <div className="w-full max-w-md h-[1px] bg-white/5 mt-16 relative overflow-hidden">
                <motion.div 
                    animate={{ x: ['-100%', '100%'] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                    className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_10px_#00F5FF]"
                />
            </div>
        </GlassCard>
    );
};

export default SimilarityLoadingState;
