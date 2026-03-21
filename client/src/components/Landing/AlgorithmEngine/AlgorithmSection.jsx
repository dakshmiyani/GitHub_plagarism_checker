import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'framer-motion';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Shield, Layout, Hash } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const AlgorithmCard = ({ title, badge, icon: Icon, accentColor, description, detailCode, backDetail }) => {
  return (
    <div className="group perspective-1000 h-[400px] md:h-[450px] w-full max-w-[340px] md:max-w-[380px] mx-auto">
      <div className="relative w-full h-full transition-transform duration-700 preserve-3d group-hover:rotate-y-180">
        
        {/* Front Face */}
        <div className="absolute inset-0 backface-hidden glass-card p-6 md:p-8 border-opacity-20 flex flex-col justify-between" style={{ borderColor: accentColor }}>
          <div>
            <div className="flex items-center justify-between mb-4 md:mb-6">
              <div className="p-2 md:p-3 rounded-lg bg-white/5 border border-white/10" style={{ color: accentColor }}>
                <Icon size={20} md={24} />
              </div>
              <span className="text-[9px] md:text-[10px] orbitron font-bold tracking-widest px-2 py-0.5 md:py-1 rounded-md bg-white/5" style={{ color: accentColor }}>{badge}</span>
            </div>
            <h3 className="orbitron text-lg md:text-2xl font-bold text-white mb-2 md:mb-4">{title}</h3>
            <p className="font-mono text-xs md:text-sm text-slate-400 leading-relaxed">{description}</p>
          </div>
          
          <div className="mt-6 md:mt-8 border-t border-white/5 pt-4 md:pt-6">
            <div className="flex items-center gap-2 text-[10px] font-mono text-slate-500 mb-2">
               <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: accentColor }} />
               VISUALIZING LOGIC...
            </div>
            <div className="bg-black/50 rounded-lg p-2.5 md:p-3 font-mono text-[9px] md:text-[10px] overflow-hidden whitespace-nowrap overflow-ellipsis">
               {detailCode}
            </div>
          </div>
        </div>

        {/* Back Face */}
        <div className="absolute inset-0 backface-hidden rotate-y-180 glass-card p-6 md:p-8 border-opacity-30 bg-white/5 flex flex-col justify-center text-center" style={{ borderColor: accentColor }}>
          <h4 className="orbitron text-base md:text-lg font-bold text-white mb-4" style={{ color: accentColor }}>Technical Analysis</h4>
          <p className="font-mono text-xs md:text-sm text-slate-300 leading-relaxed mb-6">
             {backDetail}
          </p>
          <div className="flex justify-center">
            <div className="px-4 py-2 rounded-full border border-white/10 text-[9px] md:text-[10px] font-bold orbitron tracking-tighter text-white/50">
              CLICK TO VIEW DOCS
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

const AlgorithmSection = () => {
  const containerRef = useRef();

  useGSAP(() => {
    gsap.from('.algo-card', {
      y: 100,
      opacity: 0,
      duration: 1,
      stagger: 0.2,
      ease: 'power4.out',
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 75%'
      }
    });
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="py-32 bg-[#050810] relative">
      <div className="max-w-7xl mx-auto px-6">
        
        <div className="text-center mb-16 md:mb-20 scroll-mt-20">
          <h2 className="orbitron text-3xl md:text-5xl lg:text-6xl font-black text-white mb-4 md:mb-6 leading-tight">
            The Science Behind the Score
          </h2>
          <p className="font-mono text-slate-400 text-sm md:text-lg max-w-2xl mx-auto">
            RepoLens doesn't guess. It computes. Our detection engine runs three mathematical layers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          <div className="algo-card">
            <AlgorithmCard 
              title="Winnowing Engine"
              badge="CORE ENGINE"
              icon={Shield}
              accentColor="#00F5FF"
              description="Detects similarity even when variables are shuffled. Uses fingerprinting to isolate core logic."
              detailCode="hashes.slice(i, i+w).min()"
              backDetail="Guarantees that any copied chunk above the K-threshold produces identical fingerprints."
            />
          </div>
          
          <div className="algo-card">
            <AlgorithmCard 
              title="Structural Skeleton"
              badge="ANTI-REWRITE"
              icon={Layout}
              accentColor="#8B5CF6"
              description="Abstracts code into logical blocks like loops. Catches structural identity beneath reworks."
              detailCode="code.abstract() -> [LOOP, IF, DEF]"
              backDetail="Catches developers who rewrite every line but keep identical logical structure."
            />
          </div>

          <div className="algo-card">
            <AlgorithmCard 
              title="Line Hash Compare"
              badge="EXACT MATCH"
              icon={Hash}
              accentColor="#10F587"
              description="Performs exact line-by-line comparison after stripping imports, comments, and noise."
              detailCode="Set.intersect(base, target)"
              backDetail="Strips imports and braces before hashing. Zero false positives from frameworks."
            />
          </div>
        </div>

        <div className="mt-16 md:mt-20 p-6 md:p-8 glass-card border-white/5 bg-gradient-to-r from-cyan-500/5 to-violet-500/5 max-w-4xl mx-auto relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity hidden md:block">
              <Shield size={120} />
           </div>
           
           <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 md:gap-8 text-center md:text-left">
              <div className="flex-1 w-full">
                 <div className="font-mono text-[9px] md:text-xs text-slate-500 mb-2">// FINAL COMPUTATION</div>
                 <div className="text-white font-mono text-xs md:text-sm mb-4">
                   finalScore = <span className="text-cyan-400">MAX</span>(literal, structural, containment)
                 </div>
                 <p className="text-slate-400 font-mono text-[10px] md:text-xs leading-relaxed max-w-md mx-auto md:mx-0">
                    The MAX ensures no cheating method escapes detection — whether it's brute copy-paste or structural imitation.
                 </p>
              </div>
              <button className="w-full md:w-auto px-8 py-3 bg-white text-[#050810] orbitron text-xs font-bold rounded-lg hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] transition-all">
                VIEW WHITEPAPER
              </button>
           </div>
        </div>

      </div>
    </section>
  );
};

export default AlgorithmSection;
