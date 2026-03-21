import React from 'react';
import { motion } from 'framer-motion';
import CountUp from 'react-countup';
const CountUpComponent = CountUp.default || CountUp;

import { GlassCard } from './shared/Components';
import { Github, Calendar, Activity, Users, Code, Clock, RefreshCw } from 'lucide-react';
import { formatRepoName, formatDate } from '../../utils/formatters';

// Inline fallback for SkeletonCard to bypass potential import issues
const SkeletonCard = ({ height = '160px' }) => (
    <div className="glass-card p-6 border-white/5 relative overflow-hidden" style={{ height }}>
        <div className="w-full h-full skeleton opacity-50 rounded-lg" />
    </div>
);

const StatChip = ({ icon: Icon, value, label, color }) => (
    <div className={`flex items-start gap-4 p-4 rounded-xl bg-black/40 border-t-2 ${color} transition-all hover:scale-105 duration-300`}>
        <div className="p-2 rounded-lg bg-white/5">
            <Icon size={18} className="text-slate-400" />
        </div>
        <div>
            <div className="orbitron text-xl font-black text-white leading-none mb-1">
                {typeof value === 'number' ? <CountUpComponent end={value} duration={1.5} /> : value}
            </div>
            <div className="font-mono text-[10px] text-slate-500 uppercase tracking-widest">{label}</div>
        </div>
    </div>
);

const RepoIdentityCard = ({ data, loading, error, repoUrl }) => {
    if (loading) {
        return <SkeletonCard height="160px" />;
    }

    return (
        <GlassCard className="relative overflow-hidden group">
            {/* Background animated mesh */}
            <div className="absolute inset-0 bg-mesh opacity-10 animate-hue-rotate pointer-events-none" />
            
            <div className="flex flex-col lg:flex-row items-center justify-between gap-8 py-4">
                
                {/* Left Side: Identity */}
                <motion.div 
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    className="flex-1 text-center lg:text-left"
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-400/10 border border-cyan-400/20 text-cyan-400 text-[10px] orbitron font-bold mb-4">
                        <Activity size={12} className="animate-pulse" /> REPOSITORY SYNCED
                    </div>
                    <h1 className="orbitron text-3xl md:text-4xl font-black text-white mb-2 tracking-tight group-hover:text-cyan-400 transition-colors">
                        {data?.repository || formatRepoName(repoUrl)}
                    </h1>
                    <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 text-slate-400 font-mono text-xs">
                        <div className="flex items-center gap-2">
                            <Calendar size={14} className="text-violet-400" /> 
                            Created {formatDate(data?.repoCreatedAt)}
                        </div>
                        <a 
                            href={repoUrl} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="flex items-center gap-2 hover:text-cyan-400 transition-colors"
                        >
                            <Github size={14} /> View on GitHub ↗
                        </a>
                    </div>
                </motion.div>

                {/* Right Side: Quick Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full lg:w-auto">
                    <StatChip 
                        icon={Activity} 
                        value={data?.totalCommits || 0} 
                        label="Commits" 
                        color="border-cyan-400" 
                    />
                    <StatChip 
                        icon={Users} 
                        value={data?.numberOfContributors || 0} 
                        label="Contributors" 
                        color="border-violet-500" 
                    />
                    <StatChip 
                        icon={Code} 
                        value={Object.keys(data?.techStack || {}).length} 
                        label="Languages" 
                        color="border-emerald-400" 
                    />
                    <StatChip 
                        icon={Clock} 
                        value={data?.averageCommitGapTime || "00:00:00"} 
                        label="Avg Gap" 
                        color="border-amber-400" 
                    />
                </div>
            </div>
        </GlassCard>
    );
};

export default RepoIdentityCard;
