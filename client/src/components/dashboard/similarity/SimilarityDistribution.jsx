import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from 'recharts';
import { GlassCard } from '../shared/Components';

const SimilarityDistribution = ({ matches }) => {
    // Sort and format data
    const chartData = [...(matches || [])]
        .sort((a, b) => b.similarity - a.similarity)
        .slice(0, 8)
        .map(m => ({
            name: m.repository.split('/').pop().replace(/\.git$/, ''),
            fullRepo: m.repository,
            similarity: m.similarity,
            type: m.matchType
        }));

    const topScore = chartData[0]?.similarity || 0;

    return (
        <GlassCard className="h-full min-h-[400px]">
            <h3 className="orbitron text-sm font-bold text-white mb-2 uppercase tracking-wider flex items-center gap-2">
                <span className="w-1 h-4 bg-cyan-400 rounded-full" />
                Similarity Distribution
            </h3>
            <p className="font-mono text-[10px] text-slate-500 uppercase mb-8">Top 8 Identified Correspondences</p>

            <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} layout="vertical" margin={{ left: 20, right: 30 }}>
                        <XAxis type="number" domain={[0, 100]} hide />
                        <YAxis 
                            type="category" 
                            dataKey="name" 
                            tick={{ fill: '#94A3B8', fontFamily: 'JetBrains Mono', fontSize: 10 }}
                            width={100}
                        />
                        <Tooltip
                            contentStyle={{
                                background: '#050810',
                                border: '1px solid rgba(0,245,255,0.3)',
                                borderRadius: '8px',
                                fontFamily: 'JetBrains Mono',
                                fontSize: '11px'
                            }}
                            cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                        />
                        <Bar dataKey="similarity" radius={[0, 4, 4, 0]}>
                            {chartData.map((entry, index) => (
                                <Cell 
                                    key={`cell-${index}`} 
                                    fill={entry.similarity > 35 ? '#FF4365' : entry.similarity > 15 ? '#F59E0B' : '#00F5FF'} 
                                />
                            ))}
                        </Bar>
                        <ReferenceLine x={topScore} stroke="#FF4365" strokeDasharray="3 3" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
            
            <div className="mt-4 flex gap-4 text-[9px] font-mono text-slate-500 uppercase">
                <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-sm bg-[#FF4365]" /> HIGH (35%+)</div>
                <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-sm bg-[#F59E0B]" /> MODERATE (15-35%)</div>
                <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-sm bg-[#00F5FF]" /> LOW (0-15%)</div>
            </div>
        </GlassCard>
    );
};

export default SimilarityDistribution;
