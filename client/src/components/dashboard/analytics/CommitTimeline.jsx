import React from 'react';
import { motion } from 'framer-motion';
import { GlassCard, SkeletonCard } from '../shared/Components';
import { formatRelativeTime, getGapColor } from '../../../utils/formatters';
import { Clock, GitCommit } from 'lucide-react';

const CommitTimeline = ({ history, loading }) => {
    if (loading) return <SkeletonCard height="400px" />;

    return (
        <GlassCard className="h-full min-h-[400px] flex flex-col">
            <h3 className="orbitron text-sm font-bold text-white mb-8 uppercase tracking-wider flex items-center gap-2">
                <span className="w-1 h-4 bg-violet-600 rounded-full" />
                Chronological Flux Log
            </h3>

            <div className="flex-1 overflow-y-auto pr-4 custom-scrollbar max-h-[400px] relative">
                {/* Vertical Line */}
                <div className="absolute left-[39px] top-0 bottom-0 w-[1px] bg-gradient-to-b from-cyan-400 via-violet-500 to-transparent opacity-20" />

                <div className="space-y-6">
                    {(history || []).map((commit, i) => {
                        const gapColor = getGapColor(commit.timeSincePreviousCommit);
                        return (
                            <motion.div 
                                key={commit.sha}
                                initial={{ x: 20, opacity: 0 }}
                                whileInView={{ x: 0, opacity: 1 }}
                                transition={{ delay: i * 0.05 }}
                                className="flex items-start gap-8 relative z-10"
                            >
                                <div className="mt-1 flex flex-col items-center">
                                    <div className="w-5 h-5 rounded-full bg-black border-2 border-violet-500 flex items-center justify-center">
                                        <div className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
                                    </div>
                                    <span className="font-mono text-[8px] text-slate-600 mt-2 uppercase">SYNC</span>
                                </div>

                                <div className="flex-1 p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] transition-all group">
                                    <div className="flex flex-wrap items-center justify-between gap-4 mb-2">
                                        <div className="flex items-center gap-4">
                                            <span className="px-2 py-0.5 rounded bg-cyan-400/10 border border-cyan-400/20 text-cyan-400 font-mono text-[10px] tracking-widest uppercase">
                                                {commit.sha}
                                            </span>
                                            <span className="font-mono text-[10px] text-slate-500 uppercase tracking-tighter">
                                                {formatRelativeTime(commit.date)}
                                            </span>
                                        </div>
                                        
                                        {commit.timeSincePreviousCommit && (
                                            <div className={`flex items-center gap-2 font-mono text-[10px] ${gapColor}`}>
                                                <Clock size={10} />
                                                ⏱ +{commit.timeSincePreviousCommit}
                                            </div>
                                        )}
                                    </div>
                                    <p className="font-mono text-xs text-white group-hover:text-cyan-400 transition-colors">
                                        {commit.message}
                                    </p>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </GlassCard>
    );
};

export default CommitTimeline;
