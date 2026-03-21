import React from 'react';
import { motion } from 'framer-motion';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { GlassCard } from '../shared/Components';
import { ExternalLink, Zap, Target, Layers, AlignLeft, AlertTriangle } from 'lucide-react';

const ScoreBar = ({ label, icon: Icon, value, color, delay }) => (
    <div className="space-y-2">
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-mono text-[10px] text-slate-400 uppercase tracking-widest">
                <Icon size={12} className={color} />
                {label}
            </div>
            <span className={`orbitron text-xs font-bold ${color}`}>{value}%</span>
        </div>
        <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
            <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${value}%` }}
                transition={{ duration: 1, delay, ease: "easeOut" }}
                className={`h-full rounded-full ${color.replace('text-', 'bg-')}`}
            />
        </div>
    </div>
);

const TopMatchDeepDive = ({ topMatch }) => {
    if (!topMatch) return null;

    const repoName = topMatch.repository.split('/').slice(-2).join('/');
    
    return (
        <GlassCard className="h-full flex flex-col">
            <div className="flex flex-col md:flex-row items-start justify-between gap-6 mb-10">
                <div>
                     <h3 className="orbitron text-sm font-bold text-white mb-2 uppercase tracking-wider flex items-center gap-2">
                        <span className="w-1 h-4 bg-cyan-400 rounded-full" />
                        Top Match Deep Dive
                    </h3>
                    <div className="flex items-center gap-3">
                        <h2 className="orbitron text-2xl font-black text-white uppercase group-hover:text-cyan-400 transition-colors">
                            {repoName}
                        </h2>
                        <a href={topMatch.repository} target="_blank" rel="noopener noreferrer">
                             <ExternalLink size={18} className="text-slate-500 hover:text-cyan-400" />
                        </a>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="px-4 py-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-center">
                        <div className="orbitron text-xl font-black text-cyan-400">{topMatch.similarity}%</div>
                        <div className="font-mono text-[9px] text-slate-500 uppercase tracking-tighter">Correlation</div>
                    </div>
                    <div className="px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 font-mono text-[10px] uppercase text-slate-500">
                        Rank #1
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-10">
                <div className="space-y-6">
                    <ScoreBar label="Literal Score" icon={AlignLeft} value={topMatch.literalScore} color="text-emerald-400" delay={0.2} />
                    <ScoreBar label="Structural Delta" icon={Layers} value={topMatch.structuralScore} color="text-violet-500" delay={0.3} />
                    <ScoreBar label="Containment" icon={Target} value={topMatch.containment} color="text-cyan-400" delay={0.4} />
                    <ScoreBar label="Line Hash Match" icon={Zap} value={topMatch.lineMatchScore} color="text-amber-500" delay={0.5} />
                    
                    {topMatch.lineMatchFlagged && (
                        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center gap-3 text-amber-500 mt-8">
                            <AlertTriangle size={20} />
                            <div className="font-mono text-[10px] leading-tight font-bold uppercase tracking-widest">
                                Critical literal line-match threshold exceeded. Verification recommended.
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                        <span className="font-mono text-[10px] text-slate-500 uppercase tracking-widest font-bold">Matched Code Snippets</span>
                        <span className="text-[9px] text-cyan-400 opacity-60">Source Ref: Strategy C</span>
                    </div>
                    <div className="flex-1 rounded-2xl overflow-hidden border border-white/5 bg-black/40 shadow-2xl relative">
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-400/5 to-transparent pointer-events-none" />
                        <SyntaxHighlighter 
                            language="javascript" 
                            style={vscDarkPlus}
                            customStyle={{ margin: 0, padding: '24px', background: 'transparent', fontSize: '11px', height: '100%' }}
                        >
                            {topMatch.sampleMatchedLines?.join('\n') || '// Common boilerplate structures detected.'}
                        </SyntaxHighlighter>
                    </div>
                    <div className="mt-4 text-[9px] font-mono text-slate-600 italic">
                        "Shared logic architecture detected across standard entry points and configuration structures."
                    </div>
                </div>
            </div>
        </GlassCard>
    );
};

export default TopMatchDeepDive;
