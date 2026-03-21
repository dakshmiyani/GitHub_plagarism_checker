import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { GlassCard, SkeletonCard } from '../shared/Components';

const CommitsPerDayBar = ({ data, loading }) => {
    if (loading) return <SkeletonCard height="350px" />;

    const chartData = Object.entries(data || {}).map(([date, count]) => ({
        date,
        commits: count
    })).sort((a, b) => new Date(a.date) - new Date(b.date));

    return (
        <GlassCard className="h-full min-h-[350px]">
             <h3 className="orbitron text-sm font-bold text-white mb-8 uppercase tracking-wider flex items-center gap-2">
                <span className="w-1 h-4 bg-violet-500 rounded-full" />
                Commit Activity Intensity
            </h3>

            <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                        <defs>
                            <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#00F5FF" stopOpacity={0.8} />
                                <stop offset="100%" stopColor="#00F5FF" stopOpacity={0.1} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                        <XAxis 
                            dataKey="date" 
                            tick={{ fill: '#94A3B8', fontFamily: 'JetBrains Mono', fontSize: 10 }}
                            axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                            tickLine={false}
                        />
                        <YAxis 
                            tick={{ fill: '#94A3B8', fontFamily: 'JetBrains Mono', fontSize: 10 }}
                            axisLine={false}
                            tickLine={false}
                        />
                        <Tooltip
                            contentStyle={{
                                background: '#050810',
                                border: '1px solid rgba(0,245,255,0.3)',
                                borderRadius: '8px',
                                fontFamily: 'JetBrains Mono',
                                fontSize: '11px'
                            }}
                            cursor={{ fill: 'rgba(0,245,255,0.05)' }}
                        />
                        <Bar 
                            dataKey="commits" 
                            fill="url(#barGradient)" 
                            radius={[4, 4, 0, 0]}
                            animationDuration={1500}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </GlassCard>
    );
};

export default CommitsPerDayBar;
