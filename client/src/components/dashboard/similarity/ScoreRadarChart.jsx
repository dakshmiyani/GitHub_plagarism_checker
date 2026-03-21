import React from 'react';
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, Tooltip } from 'recharts';
import { GlassCard } from '../shared/Components';

const ScoreRadarChart = ({ topMatch }) => {
    const radarData = [
        { metric: 'Literal', score: topMatch?.literalScore || 0 },
        { metric: 'Structural', score: topMatch?.structuralScore || 0 },
        { metric: 'Containment', score: topMatch?.containment || 0 },
        { metric: 'Line Hash', score: topMatch?.lineMatchScore || 0 },
    ];

    const getDynamicInsight = (data) => {
        if (!data) return "Crunching algorithm deltas...";
        const max = data.reduce((prev, current) => (prev.score > current.score) ? prev : current, { score: 0 });
        
        switch (max.metric) {
            case 'Structural':
                return "Structural patterns dominate — logic architecture shared across sources.";
            case 'Containment':
                return "High containment score — large portions of this repo exist within candidate datasets.";
            case 'Literal':
                return "Literal matching detected — high probability of verbatim copy-paste operations.";
            case 'Line Hash':
                return "Line hash collisions flagged — specific code blocks match candidate signatures.";
            default:
                return "Consistent fingerprinting verified across all similarity strategies.";
        }
    };

    return (
        <GlassCard className="h-full min-h-[400px] flex flex-col">
             <h3 className="orbitron text-sm font-bold text-white mb-2 uppercase tracking-wider flex items-center gap-2">
                <span className="w-1 h-4 bg-violet-500 rounded-full" />
                Algorithm Delta Radar
            </h3>
            <p className="font-mono text-[10px] text-slate-500 uppercase mb-4">Top Candidate Correlation Profile</p>

            <div className="flex-1 flex items-center justify-center">
                <ResponsiveContainer width="100%" height={250}>
                    <RadarChart cx="50%" cy="50%" outerRadius={80} data={radarData}>
                        <PolarGrid stroke="rgba(255,255,255,0.1)" />
                        <PolarAngleAxis 
                            dataKey="metric" 
                            tick={{ fill: '#94A3B8', fontFamily: 'JetBrains Mono', fontSize: 10 }} 
                        />
                        <Radar 
                            name="Similarity" 
                            dataKey="score" 
                            stroke="#8B5CF6" 
                            fill="#8B5CF6" 
                            fillOpacity={0.3} 
                            strokeWidth={2}
                        />
                        <Tooltip
                             contentStyle={{
                                background: '#050810',
                                border: '1px solid rgba(139,92,246,0.3)',
                                borderRadius: '8px',
                                fontFamily: 'JetBrains Mono',
                                fontSize: '11px'
                            }}
                        />
                    </RadarChart>
                </ResponsiveContainer>
            </div>

            <div className="mt-4 p-4 rounded-xl bg-violet-500/5 border border-violet-500/20">
                <div className="font-mono text-[9px] text-violet-400 mb-1 uppercase tracking-widest font-bold">Heuristic Insight</div>
                <p className="font-mono text-[10px] text-slate-400 leading-relaxed italic">
                    "{getDynamicInsight(radarData)}"
                </p>
            </div>
        </GlassCard>
    );
};

export default ScoreRadarChart;
