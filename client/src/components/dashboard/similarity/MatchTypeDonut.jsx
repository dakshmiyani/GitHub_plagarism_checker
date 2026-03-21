import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { GlassCard } from '../shared/Components';
import CountUp from 'react-countup';
const CountUpComponent = CountUp.default || CountUp;


const MatchTypeDonut = ({ matches, metadata }) => {
    const types = (matches || []).reduce((acc, curr) => {
        acc[curr.matchType] = (acc[curr.matchType] || 0) + 1;
        return acc;
    }, {});

    const chartData = Object.entries(types).map(([name, value]) => ({ name, value }));
    const COLORS = ['#00F5FF', '#8B5CF6', '#10F587', '#F59E0B'];

    return (
        <GlassCard className="h-full min-h-[400px] flex flex-col">
            <h3 className="orbitron text-sm font-bold text-white mb-2 uppercase tracking-wider flex items-center gap-2">
                <span className="w-1 h-4 bg-cyan-400 rounded-full" />
                Discovery Heuristics
            </h3>
            <p className="font-mono text-[10px] text-slate-500 uppercase mb-8">Candidate Identification Vector</p>

            <div className="flex-1 relative">
                <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                        <Pie
                            data={chartData}
                            cx="50%"
                            cy="50%"
                            innerRadius={50}
                            outerRadius={70}
                            paddingAngle={5}
                            dataKey="value"
                            stroke="none"
                        >
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip
                             contentStyle={{
                                background: '#050810',
                                border: '1px solid rgba(0,245,255,0.3)',
                                borderRadius: '8px',
                                fontFamily: 'JetBrains Mono',
                                fontSize: '11px'
                            }}
                        />
                    </PieChart>
                </ResponsiveContainer>
                
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mt-[-20px]">
                    <span className="orbitron text-lg font-black text-white">{chartData.length}</span>
                    <span className="font-mono text-[8px] text-slate-500 uppercase">Vectors</span>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-8">
                <div className="p-4 rounded-xl bg-white/2 border border-white/5 text-center">
                    <div className="orbitron text-xl font-black text-cyan-400">
                        <CountUpComponent end={metadata?.searchSnippetsUsed || 0} />
                    </div>
                    <div className="font-mono text-[8px] text-slate-500 uppercase tracking-widest mt-1">Snippets Used</div>
                </div>
                <div className="p-4 rounded-xl bg-white/2 border border-white/5 text-center">
                    <div className="orbitron text-xl font-black text-violet-500">
                        <CountUpComponent end={metadata?.candidatesChecked || 0} />
                    </div>
                    <div className="font-mono text-[8px] text-slate-500 uppercase tracking-widest mt-1">Heuristics Run</div>
                </div>
            </div>
        </GlassCard>
    );
};

export default MatchTypeDonut;
