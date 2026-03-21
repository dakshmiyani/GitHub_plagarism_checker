import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { GitFork, Link, Search, FileJson, Type, Users } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const StrategyNode = ({ icon: Icon, title, description, accentColor, className }) => (
  <div className={`strategy-node glass-card p-6 border-opacity-30 relative group overflow-hidden ${className}`} style={{ borderColor: accentColor }}>
    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
    <div className="relative z-10">
      <div className="p-3 rounded-lg bg-white/5 w-fit mb-4 group-hover:scale-110 transition-transform duration-300" style={{ color: accentColor }}>
        <Icon size={24} />
      </div>
      <h4 className="orbitron text-lg font-bold text-white mb-2">{title}</h4>
      <p className="font-mono text-xs text-slate-400 leading-relaxed">{description}</p>
    </div>
  </div>
);

const StrategiesHexGrid = () => {
  const containerRef = useRef();
  const svgRef = useRef();

  useGSAP(() => {
    // Stagger nodes in
    gsap.from('.strategy-node', {
      scale: 0.8,
      opacity: 0,
      duration: 0.8,
      stagger: 0.1,
      ease: 'back.out(1.7)',
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 70%'
      }
    });

    // Animate the central pool
    gsap.from('.central-pool', {
      scale: 0,
      opacity: 0,
      duration: 1,
      delay: 0.5,
      ease: 'elastic.out(1, 0.5)',
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 70%'
      }
    });

    // Animate connection lines
    gsap.from('.connection-path', {
      strokeDashoffset: 1000,
      duration: 2,
      delay: 0.8,
      ease: 'power2.inOut',
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 70%'
      }
    });

  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="py-24 md:py-32 bg-[#050810] relative overflow-hidden">
      {/* Background radial gradient mesh */}
      <div className="absolute top-0 left-0 w-full h-full bg-mesh opacity-30 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16 md:mb-24">
          <h2 className="orbitron text-3xl md:text-5xl font-black text-white mb-4 md:mb-6">
            Discovery Architecture
          </h2>
          <p className="font-mono text-slate-400 text-sm md:text-lg max-w-2xl mx-auto leading-relaxed">
            RepoLens doesn't just check the surface. We deploy 6 parallel strategies to find hidden clones and disguised repositories.
          </p>
        </div>

        <div className="relative min-h-[500px] flex items-center justify-center">
          
          {/* Animated SVG Connections - Hidden on small mobile */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20 hidden sm:block" ref={svgRef}>
             <defs>
                <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                   <stop offset="0%" stopColor="#00F5FF" />
                   <stop offset="100%" stopColor="#8B5CF6" />
                </linearGradient>
             </defs>
          </svg>

          {/* Hexagonal Layout Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 w-full">
            <StrategyNode 
              icon={GitFork}
              title="Fork Detection"
              description="Analyzes direct fork lineage and public forks via GitHub Parent API."
              accentColor="#00F5FF"
            />
            <StrategyNode 
              icon={Link}
              title="Direct URLs"
              description="Cross-references user-provided candidate repositories in real-time."
              accentColor="#8B5CF6"
            />
            <StrategyNode 
              icon={Search}
              title="Code Search"
              description="Queries GitHub Global Search using unique extracted logic snippets."
              accentColor="#10F587"
            />
            <StrategyNode 
              icon={FileJson}
              title="Metadata Search"
              description="Spots identical README headers and unique package.json signatures."
              accentColor="#00F5FF"
            />
            <StrategyNode 
              icon={Type}
              title="Deep String Search"
              description="Scans for custom error messages and distinctive file paths globally."
              accentColor="#8B5CF6"
            />
            <StrategyNode 
              icon={Users}
              title="Owner Scraping"
              description="Audits all repositories owned by suspected clone authors."
              accentColor="#10F587"
            />
          </div>

          {/* Central Pool - absolutely centered in larger screens */}
          <div className="central-pool hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full border border-white/10 bg-[#050810] items-center justify-center z-20 shadow-[0_0_50px_rgba(0,245,255,0.1)]">
             <div className="absolute inset-0 rounded-full border-2 border-cyan-400/20 animate-ping opacity-20" />
             <div className="text-center p-4">
                <div className="orbitron text-[10px] font-bold text-cyan-400 tracking-[0.2em] mb-2 uppercase">Central Pool</div>
                <div className="orbitron text-2xl font-black text-white">CANDIDATES</div>
             </div>
          </div>
        </div>

        <div className="mt-16 md:mt-20 text-center">
           <div className="inline-block p-4 border border-white/5 bg-white/2 rounded-lg font-mono text-[10px] md:text-xs text-slate-500 max-w-lg">
             <span className="text-cyan-400 font-bold tracking-widest block md:inline mb-1 md:mb-0 mr-2">PRE-COMPUTATION:</span> 
             UP TO 50 CORE FILES ARE FINGERPRINTED BEFORE ANY CANDIDATE SCAN BEGINS
           </div>
        </div>
      </div>
    </section>
  );
};

export default StrategiesHexGrid;
