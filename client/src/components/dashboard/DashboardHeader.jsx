import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, RefreshCw, Github, CheckCircle, Search } from 'lucide-react';

const DashboardHeader = ({ repoUrl, analyticsLoading, analyticsError, plagiarismStatus, plagiarismError }) => {
    const navigate = useNavigate();
    const [url, setUrl] = useState(repoUrl || '');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (url.trim()) {
            navigate(`/dashboard?repo=${encodeURIComponent(url.trim())}`);
        }
    };

    return (
        <header className="fixed top-0 inset-x-0 z-50 bg-[#050810]/80 backdrop-blur-md border-b border-white/5 shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
            <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between gap-4">
                
                {/* Brand & Back */}
                <div className="flex items-center gap-4">
                    <Link to="/" className="p-2 hover:bg-white/5 rounded-full transition-colors group">
                        <ArrowLeft size={18} className="text-slate-400 group-hover:text-cyan-400" />
                    </Link>
                    <div className="hidden sm:flex items-center gap-2">
                        <div className="w-6 h-6 rounded bg-gradient-to-br from-cyan-400 to-violet-500" />
                        <span className="orbitron text-sm font-black text-white tracking-widest uppercase">RepoLens</span>
                    </div>
                </div>

                {/* URL Input */}
                <form onSubmit={handleSubmit} className="flex-1 max-w-xl relative group">
                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                        <Github size={14} className="text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
                    </div>
                    <input 
                        type="text" 
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="Enter your GitHub URL (e.g., github.com/owner/repo)"
                        className="w-full bg-white/5 border border-white/10 rounded-full py-2 pl-12 pr-4 text-xs font-mono text-white focus:outline-none focus:border-cyan-500/50 focus:bg-cyan-500/5 transition-all"
                    />
                    <button type="submit" className="absolute inset-y-1 right-1 px-4 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 rounded-full text-[10px] orbitron font-bold transition-all border border-cyan-500/20">
                        RE-ANALYZE
                    </button>
                </form>

                {/* Status Pills */}
                <div className="hidden md:flex items-center gap-3">
                    <div className={`px-3 py-1 rounded-full border text-[10px] orbitron font-bold flex items-center gap-2 ${
                        analyticsLoading 
                        ? 'border-cyan-500/30 bg-cyan-500/5 text-cyan-400 animate-pulse' 
                        : analyticsError
                        ? 'border-crimson/30 bg-crimson/5 text-crimson'
                        : 'border-emerald-500/30 bg-emerald-500/5 text-emerald-400'
                    }`}>
                        {analyticsLoading ? <RefreshCw size={10} className="animate-spin" /> : <CheckCircle size={10} />}
                        ANALYTICS {analyticsLoading ? 'FETCHING' : analyticsError ? 'FAILED' : 'LOADED'}
                    </div>

                    <div className={`px-3 py-1 rounded-full border text-[10px] orbitron font-bold flex items-center gap-2 ${
                        (plagiarismStatus === 'completed') 
                        ? 'border-emerald-500/30 bg-emerald-500/5 text-emerald-400'
                        : (plagiarismStatus === 'failed' || plagiarismError)
                        ? 'border-crimson/30 bg-crimson/5 text-crimson'
                        : 'border-amber-500/30 bg-amber-500/5 text-amber-500 animate-pulse'
                    }`}>
                        {(plagiarismStatus === 'active' || plagiarismStatus === 'waiting') ? <Search size={10} className="animate-bounce" /> : <CheckCircle size={10} />}
                        SIMILARITY {plagiarismStatus === 'completed' ? 'READY' : (plagiarismStatus || 'IDLE').toUpperCase()}
                    </div>
                </div>

            </div>
            {/* Bottom glow line */}
            <div className="absolute bottom-0 left-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent w-full opacity-30 shadow-[0_0_10px_#00F5FF]" />
        </header>
    );
};

export default DashboardHeader;
