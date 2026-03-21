import React from 'react';
import { motion } from 'framer-motion';
import { GlassCard, SkeletonCard } from '../shared/Components';
import { format, subWeeks, eachDayOfInterval, isSameDay } from 'date-fns';

const CommitHeatmap = ({ data, loading }) => {
    if (loading) return <SkeletonCard height="350px" />;

    // Generate last 24 weeks of dates
    const end = new Date();
    const start = subWeeks(end, 23);
    const days = eachDayOfInterval({ start, end });

    const getColor = (count) => {
        if (!count) return 'bg-white/5';
        if (count < 3) return 'bg-[#00F5FF]/20';
        if (count < 8) return 'bg-[#00F5FF]/40';
        if (count < 15) return 'bg-[#00F5FF]/70';
        return 'bg-[#00F5FF]';
    };

    const commitEntries = Object.entries(data || {});

    return (
        <GlassCard className="h-full min-h-[350px]">
            <div className="flex items-center justify-between mb-8">
                <h3 className="orbitron text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <span className="w-1 h-4 bg-cyan-400 rounded-full" />
                    Neural Contribution Map
                </h3>
                <div className="flex items-center gap-2 text-[8px] font-mono text-slate-500">
                    <span>LESS</span>
                    <div className="flex gap-1">
                        <div className="w-2.5 h-2.5 rounded-sm bg-white/5" />
                        <div className="w-2.5 h-2.5 rounded-sm bg-[#00F5FF]/20" />
                        <div className="w-2.5 h-2.5 rounded-sm bg-[#00F5FF]/40" />
                        <div className="w-2.5 h-2.5 rounded-sm bg-[#00F5FF]/70" />
                        <div className="w-2.5 h-2.5 rounded-sm bg-[#00F5FF]" />
                    </div>
                    <span>MORE</span>
                </div>
            </div>

            <div className="overflow-x-auto pb-4 custom-scrollbar">
                <div className="flex flex-col gap-2 min-w-[700px]">
                    {/* Month labels would go here ideally */}
                    <div className="grid grid-flow-col grid-rows-7 gap-1">
                        {days.map((day, i) => {
                            const dateStr = format(day, 'yyyy-MM-dd');
                            const count = data?.[dateStr] || 0;
                            return (
                                <motion.div
                                    key={dateStr}
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ delay: i * 0.002 }}
                                    className={`w-3 h-3 rounded-sm ${getColor(count)} hover:ring-2 hover:ring-white transition-all cursor-crosshair`}
                                    title={`${dateStr}: ${count} commits`}
                                />
                            );
                        })}
                    </div>
                </div>
            </div>
            
            <p className="mt-8 font-mono text-[9px] text-slate-500 uppercase tracking-widest leading-relaxed">
                Visualizing the metabolic rate of the repository across the last 6 months. 
                Dense clusters indicate periods of high architectural throughput.
            </p>
        </GlassCard>
    );
};

export default CommitHeatmap;
