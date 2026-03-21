import React from 'react';
import { motion } from 'framer-motion';
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer } from 'recharts';
import { GlassCard, SkeletonCard } from '../shared/Components';

const ContributorsLeaderboard = ({ contributors, loading }) => {
    if (loading) return <SkeletonCard height="350px" />;

    const sorted = [...(contributors || [])].sort((a, b) => b.commits - a.commits);
    const totalCommits = sorted.reduce((acc, curr) => acc + curr.commits, 0);

    const radarData = sorted.slice(0, 5).map(c => ({
        subject: c.username,
        A: c.commits,
        fullMark: totalCommits
    }));

    const colors = ['#F59E0B', '#94A3B8', '#B45309', '#334155'];

    return (
        <GlassCard className="h-full min-h-[350px] flex flex-col">
            <div className="flex items-center justify-between mb-8">
                <h3 className="orbitron text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <span className="w-1 h-4 bg-cyan-400 rounded-full" />
                    Lead Architects
                </h3>
                <div className="px-2 py-0.5 rounded bg-cyan-400/10 border border-cyan-400/20 text-cyan-400 text-[10px] font-mono">
                    {sorted.length} Total
                </div>
            </div>

            <div className="space-y-4 flex-1">
                {sorted.slice(0, 4).map((c, i) => (
                    <motion.div 
                        key={c.username}
                        initial={{ x: -10, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: i * 0.1 }}
                        className="group"
                    >
                        <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-3">
                                <span className={`orbitron text-xs font-black ${i < colors.length ? `text-[${colors[i]}]` : 'text-slate-600'}`}>
                                    #{i + 1}
                                </span>
                                <span className="font-mono text-[11px] text-white group-hover:text-cyan-400 transition-colors uppercase tracking-tighter">
                                    {c.username}
                                </span>
                            </div>
                            <span className="font-mono text-[10px] text-slate-500">
                                {c.commits} <span className="text-[8px] opacity-60">commits</span> ({((c.commits / totalCommits) * 100).toFixed(1)}%)
                            </span>
                        </div>
                        <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                            <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${(c.commits / totalCommits) * 100}%` }}
                                transition={{ duration: 1, delay: 0.8 + i * 0.1 }}
                                className="h-full bg-cyan-400 rounded-full group-hover:shadow-[0_0_10px_#00F5FF]/50 transition-all"
                            />
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="h-32 w-full mt-6 flex justify-center opacity-40 hover:opacity-100 transition-opacity">
                <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                        <PolarGrid stroke="#334155" />
                        <PolarAngleAxis 
                            dataKey="subject" 
                            tick={{ fill: '#475569', fontSize: 9, fontFamily: 'JetBrains Mono' }} 
                        />
                        <Radar
                            name="Commits"
                            dataKey="A"
                            stroke="#00F5FF"
                            fill="#00F5FF"
                            fillOpacity={0.6}
                        />
                    </RadarChart>
                </ResponsiveContainer>
            </div>
        </GlassCard>
    );
};

export default ContributorsLeaderboard;
