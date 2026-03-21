import React from 'react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import { GlassCard, SkeletonCard } from '../shared/Components';
import { formatGapTime, getGapColor } from '../../../utils/formatters';

const AvgCommitGap = ({ gapTime, loading }) => {
    if (loading) return <SkeletonCard height="350px" />;

    const parts = (gapTime || "00:00:00").split(':');
    const colorClass = getGapColor(gapTime);
    
    // Mock sparkline data based on gap time (can be improved with real historical data)
    const sparkData = Array.from({ length: 15 }, () => ({ val: Math.random() * 100 }));

    const getIntensityLabel = (h) => {
        const hours = parseInt(h);
        if (hours < 1) return { label: "🔥 Highly Active", text: "text-emerald-400" };
        if (hours < 6) return { label: "⚡ Active Development", text: "text-cyan-400" };
        if (hours < 24) return { label: "📅 Regular Pace", text: "text-amber-400" };
        return { label: "🌙 Slow Cadence", text: "text-slate-500" };
    };

    const intensity = getIntensityLabel(parts[0]);

    return (
        <GlassCard className="h-full flex flex-col justify-between min-h-[350px]">
            <div>
                <h3 className="orbitron text-sm font-bold text-white mb-2 uppercase tracking-wider flex items-center gap-2">
                    <span className="w-1 h-4 bg-amber-500 rounded-full" />
                    Development Pace
                </h3>
                <p className="font-mono text-[10px] text-slate-500 uppercase mb-8">Avg Gap Between Commits</p>
            </div>

            <div className="flex flex-col items-center gap-6 py-6">
                <div className="flex gap-3">
                    {parts.map((unit, i) => (
                        <div key={i} className="flex flex-col items-center">
                            <div className={`w-16 h-20 bg-black/60 rounded-xl border border-white/5 flex items-center justify-center orbitron text-3xl font-black ${colorClass} shadow-[0_0_20px_rgba(0,0,0,0.3)]`}>
                                {unit}
                            </div>
                            <span className="font-mono text-[9px] text-slate-600 mt-2 uppercase">{['hours', 'mins', 'secs'][i]}</span>
                        </div>
                    ))}
                </div>

                <div className={`px-4 py-1 rounded-full bg-white/5 border border-white/10 ${intensity.text} orbitron text-[10px] font-bold tracking-widest uppercase`}>
                    {intensity.label}
                </div>
            </div>

            <div className="h-12 w-full mt-4">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={sparkData}>
                        <Line 
                            type="monotone" 
                            dataKey="val" 
                            stroke="currentColor" 
                            className={colorClass}
                            strokeWidth={2} 
                            dot={false}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </GlassCard>
    );
};

export default AvgCommitGap;
