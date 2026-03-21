import React from 'react';
import { GlassCard } from '../shared/Components';
import { GitFork, ExternalLink, CheckCircle } from 'lucide-react';

const ForkCloneMatches = ({ matches }) => {
    const hasForks = matches && matches.length > 0;

    return (
        <GlassCard className="h-full flex flex-col">
            <h3 className="orbitron text-sm font-bold text-white mb-8 uppercase tracking-wider flex items-center gap-2">
                <span className="w-1 h-4 bg-emerald-500 rounded-full" />
                Direct Fork Correlation
            </h3>

            {!hasForks ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
                    <div className="p-4 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-4">
                        <CheckCircle size={32} className="text-emerald-400" />
                    </div>
                    <h4 className="orbitron text-sm font-black text-white mb-2 uppercase">No Direct Forks Found</h4>
                    <p className="font-mono text-[10px] text-slate-500 px-8">
                        The repository appears to be a unique root with no direct API-level derivations identified.
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {matches.map(m => (
                        <div key={m.repository} className="p-4 rounded-xl bg-white/2 border border-white/5 hover:bg-white/5 transition-all group">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2 truncate pr-4">
                                    <GitFork size={14} className="text-emerald-400" />
                                    <span className="font-mono text-xs text-white truncate uppercase italic">{m.repository.split('/').slice(-2).join('/')}</span>
                                </div>
                                <div className={`px-2 py-0.5 rounded text-[10px] orbitron font-bold border ${
                                    m.similarity > 30 ? 'border-crimson bg-crimson/5 text-crimson' : 'border-emerald-500/30 bg-emerald-500/5 text-emerald-400'
                                }`}>
                                    {m.similarity}%
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="font-mono text-[9px] text-slate-600 uppercase tracking-widest">Strategy A: Fork Det.</span>
                                <a href={m.repository} target="_blank" rel="noopener noreferrer">
                                     <ExternalLink size={12} className="text-slate-500 hover:text-white transition-colors" />
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <div className="mt-8 pt-8 border-t border-white/5">
                <div className="p-4 rounded-xl bg-black/40 border border-white/5 text-center">
                    <p className="font-mono text-[9px] text-slate-500 leading-relaxed uppercase tracking-tighter">
                        GitHub API verified fork detection. Candidates matched by network graph proximity.
                    </p>
                </div>
            </div>
        </GlassCard>
    );
};

export default ForkCloneMatches;
