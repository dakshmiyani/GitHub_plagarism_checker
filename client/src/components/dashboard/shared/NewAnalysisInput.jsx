import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GlassCard } from './Components';
import { Search, ChevronRight, Github } from 'lucide-react';

const NewAnalysisInput = ({ currentRepo }) => {
    const navigate = useNavigate();
    const [url, setUrl] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (url.trim()) {
            navigate(`/dashboard?repo=${encodeURIComponent(url.trim())}`);
            setUrl('');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    return (
        <GlassCard className="py-20 bg-gradient-to-br from-[#00F5FF]/5 to-transparent border-[#00F5FF]/20 relative overflow-hidden group">
            {/* Animated background glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-cyan-400/5 blur-[120px] pointer-events-none group-hover:bg-cyan-400/10 transition-all duration-1000" />
            
            <div className="max-w-2xl mx-auto text-center relative z-10">
                <div className="inline-block px-4 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/5 text-cyan-400 text-[10px] orbitron font-bold tracking-widest uppercase mb-8">
                    // session complete
                </div>
                
                <h2 className="orbitron text-3xl md:text-5xl font-black text-white mb-6 uppercase tracking-tight">
                    Analyze Another <span className="text-cyan-400">Repository</span>
                </h2>
                
                <p className="font-mono text-slate-400 text-sm mb-12 uppercase tracking-wide">
                    The engine is ready. Input a public GitHub URL to begin a fresh architectural probe.
                </p>

                <form onSubmit={handleSubmit} className="relative group">
                    <div className="glass-card flex flex-col md:flex-row items-center p-2 relative shadow-[0_0_50px_rgba(0,245,255,0.1)] border-white/10 group-focus-within:border-cyan-500/50 transition-all">
                        <div className="flex items-center w-full md:flex-1">
                           <input 
                             type="text" 
                             value={url}
                             onChange={(e) => setUrl(e.target.value)}
                             placeholder="Enter your GitHub URL (e.g., github.com/owner/repo)" 
                             className="w-full md:flex-1 bg-transparent border-none outline-none text-white font-mono px-4 py-3 md:py-0 placeholder-slate-700 text-center md:text-left"
                           />
                        </div>
                        <button type="submit" className="w-full md:w-auto px-10 py-4 md:py-4 bg-[#00F5FF] text-[#050810] orbitron font-bold rounded hover:shadow-[0_0_30px_rgba(0,245,255,0.8)] transition-all flex items-center justify-center gap-2 group-active:scale-95 shrink-0">
                          PROBE <ChevronRight size={18} />
                        </button>
                    </div>
                </form>

                <div className="mt-12 flex justify-center gap-8 opacity-40">
                    <div className="flex items-center gap-2 grayscale hover:grayscale-0 transition-all cursor-default">
                        <Github size={16} /><span className="text-[10px] orbitron font-bold tracking-widest">GITHUB API</span>
                    </div>
                </div>
            </div>
        </GlassCard>
    );
};

export default NewAnalysisInput;
