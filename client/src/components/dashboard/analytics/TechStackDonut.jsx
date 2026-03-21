import React from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { GlassCard, SkeletonCard } from '../shared/Components';

const COLORS = ['#00F5FF', '#8B5CF6', '#10F587', '#F59E0B', '#334155'];

const TechStackDonut = ({ data, loading }) => {
    if (loading) return <SkeletonCard height="350px" />;
    
    const chartData = Object.entries(data || {}).map(([name, value]) => ({
        name,
        value: typeof value === 'string' ? parseFloat(value.replace('%', '')) : value
    }));

    const mainLang = chartData[0] || { name: 'N/A', value: 0 };

    return (
        <GlassCard className="flex flex-col h-full min-h-[350px]">
            <h3 className="orbitron text-sm font-bold text-white mb-6 uppercase tracking-wider flex items-center gap-2">
                <span className="w-1 h-4 bg-cyan-400 rounded-full" />
                Tech Stack Distribution
            </h3>
            
            <div className="flex-1 relative min-h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={chartData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={85}
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
                            itemStyle={{ color: '#fff' }}
                        />
                    </PieChart>
                </ResponsiveContainer>
                
                {/* Center Content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="orbitron text-xl font-black text-white">{mainLang.value}%</span>
                    <span className="font-mono text-[10px] text-slate-500 uppercase">{mainLang.name}</span>
                </div>
            </div>

            {/* Legend */}
            <div className="mt-6 space-y-3">
                {chartData.slice(0, 3).map((lang, i) => (
                    <div key={lang.name}>
                        <div className="flex items-center justify-between text-[10px] mb-1 uppercase">
                            <div className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                                <span className="text-slate-300">{lang.name}</span>
                            </div>
                            <span className="text-white font-bold">{lang.value}%</span>
                        </div>
                        <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                            <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${lang.value}%` }}
                                transition={{ duration: 1, delay: 0.5 + i * 0.1 }}
                                className="h-full rounded-full"
                                style={{ backgroundColor: COLORS[i % COLORS.length] }}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </GlassCard>
    );
};

export default TechStackDonut;
