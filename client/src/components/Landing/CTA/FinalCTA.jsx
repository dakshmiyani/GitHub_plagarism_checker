import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Github, FileText, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const FinalCTA = () => {
  const navigate = useNavigate();
  const [repoUrl, setRepoUrl] = useState('');

  const handleAnalyze = (e) => {
    e.preventDefault();
    if (repoUrl.trim()) {
      navigate(`/dashboard?repo=${encodeURIComponent(repoUrl.trim())}`);
    }
  };
  return (
    <section className="relative py-40 bg-[#050810] overflow-hidden">
      {/* Animated gradient mesh background */}
      <div className="absolute inset-0 bg-mesh opacity-40 animate-hue-rotate pointer-events-none" />
      
      {/* Drifting code snippets in background - Hidden on mobile for clarity */}
      <div className="absolute inset-0 pointer-events-none opacity-10 font-mono text-[10px] uppercase tracking-[0.5em] overflow-hidden select-none hidden md:block">
        <motion.div 
          animate={{ y: [0, -1000] }} 
          transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
          className="flex flex-col gap-20 p-20"
        >
          {['winnowing.normalize()', 'skeleton.abstract(ast)', 'strategyC.execute()', 'verdict: "likely_original"', 'git.fetchTree()', 'score.calculateMax()'].map((snip, i) => (
            <div key={i} className={i % 2 === 0 ? 'text-cyan-400 ml-40' : 'text-violet-400 ml-0'}>{snip}</div>
          ))}
          {['winnowing.normalize()', 'skeleton.abstract(ast)', 'strategyC.execute()', 'verdict: "likely_original"', 'git.fetchTree()', 'score.calculateMax()'].map((snip, i) => (
            <div key={i + 'copy'} className={i % 2 === 0 ? 'text-cyan-400 ml-40' : 'text-violet-400 ml-0'}>{snip}</div>
          ))}
        </motion.div>
      </div>

      <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
        <motion.div
           initial={{ opacity: 0, scale: 0.9 }}
           whileInView={{ opacity: 1, scale: 1 }}
           transition={{ duration: 0.8 }}
           viewport={{ once: true }}
        >
          <div className="inline-block px-4 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/5 text-cyan-400 text-[10px] orbitron font-bold tracking-widest uppercase mb-6 md:mb-8">
            // ready to start
          </div>
          
          <h2 className="orbitron text-3xl md:text-6xl lg:text-7xl font-black text-white mb-6 md:mb-8 leading-tight">
            Analyze Your First <span className="text-cyan-400">Repository</span>
          </h2>
          
          <p className="font-mono text-slate-400 text-sm md:text-xl mb-10 md:mb-12 max-w-2xl mx-auto uppercase tracking-wider">
            Paste any public GitHub URL. Results in seconds. Built by developers.
          </p>

          <div className="max-w-2xl mx-auto mb-12 md:mb-16 relative">
             <form onSubmit={handleAnalyze} className="glass-card flex flex-col md:flex-row items-center p-2 relative group shadow-[0_0_50px_rgba(0,245,255,0.1)] gap-2 md:gap-0">
                <div className="flex items-center w-full md:flex-1">
                   <input 
                     type="text" 
                     value={repoUrl}
                     onChange={(e) => setRepoUrl(e.target.value)}
                     placeholder="Enter your GitHub URL (e.g., github.com/owner/repo)" 
                     className="w-full md:flex-1 bg-transparent border-none outline-none text-white font-mono px-4 py-3 md:py-0 placeholder-slate-700 text-center md:text-left"
                   />
                </div>
                <button type="submit" className="w-full md:w-auto px-8 py-4 md:py-3 bg-[#00F5FF] text-[#050810] orbitron font-bold rounded hover:shadow-[0_0_30px_rgba(0,245,255,0.8)] transition-all flex items-center justify-center gap-2 shrink-0">
                  ANALYZE <ChevronRight size={18} />
                </button>
             </form>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 md:gap-8">
             <a href="#" className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors orbitron text-[10px] md:text-xs font-bold tracking-widest">
                <Github size={14} /> OR CONTRIBUTE ON GITHUB →
             </a>
             <a href="#" className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors orbitron text-[10px] md:text-xs font-bold tracking-widest">
                <FileText size={14} /> READ THE DOCUMENTATION →
             </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FinalCTA;
