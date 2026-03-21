import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Layers, Activity, Zap } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const AnalyticsSection = () => {
  const containerRef = useRef();
  
  useGSAP(() => {
    const sections = gsap.utils.toArray('.analytics-row');
    
    sections.forEach((section) => {
      gsap.from(section.querySelectorAll('.animate-in'), {
        y: 60,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 80%',
        }
      });
    });
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="py-24 bg-[#050810] relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Sub-section A: Tech Stack Breakdown */}
        <div className="analytics-row grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 items-center mb-24 md:mb-40">
          <div className="animate-in">
            <div className="flex items-center gap-3 mb-4 md:mb-6">
               <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
                 <Layers className="w-5 h-5 md:w-6 md:h-6 text-cyan-400" />
               </div>
               <span className="orbitron text-cyan-400 font-bold tracking-widest text-[10px] md:text-sm uppercase">Engine Layer 01</span>
            </div>
            <h2 className="orbitron text-3xl md:text-5xl font-bold text-white mb-6 md:mb-8 leading-tight">Tech Stack Granularity</h2>
            <p className="font-mono text-slate-400 text-sm md:text-lg leading-relaxed mb-6 md:mb-8">
              RepoLens performs a byte-level audit across the repository. Each language footprint is calculated relative to the total codebase weight.
            </p>
            <div className="space-y-4 md:space-y-6">
               <div className="glass-card p-4 md:p-6 border-white/5 bg-white/2">
                  <div className="flex justify-between font-mono text-xs md:text-sm mb-2">
                    <span className="text-white">JavaScript / TS</span>
                    <span className="text-cyan-400">82.4%</span>
                  </div>
                  <div className="h-1.5 md:h-2 w-full bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-cyan-500 to-violet-500 w-[82.4%]" />
                  </div>
               </div>
            </div>
          </div>
          
          <div className="animate-in flex justify-center lg:justify-end">
            <div className="relative w-64 h-64 md:w-96 md:h-96">
               {/* Animated SVG Donut Mock */}
               <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                 <circle cx="50" cy="50" r="40" stroke="rgba(255,255,255,0.05)" strokeWidth="8" fill="none" />
                 <circle cx="50" cy="50" r="40" stroke="#00F5FF" strokeWidth="8" fill="none" strokeDasharray="251.2" strokeDashoffset="50" className="transition-all duration-1000" />
               </svg>
               <div className="absolute inset-0 flex flex-col items-center justify-center">
                 <span className="orbitron text-2xl md:text-4xl font-bold text-white">10.4MB</span>
                 <span className="font-mono text-[10px] text-slate-500 uppercase tracking-widest mt-1 md:mt-2">Analyzed</span>
               </div>
            </div>
          </div>
        </div>

        {/* Sub-section B: Commit Gap Analysis */}
        <div className="analytics-row grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 items-center mb-24 md:mb-40">
           <div className="animate-in order-2 lg:order-1">
             <div className="glass-card p-6 md:p-8 border-violet-500/20 bg-violet-500/5 relative overflow-hidden group">
                <div className="flex justify-between items-center mb-6 md:mb-8">
                  <div className="orbitron text-[10px] md:text-xs font-bold text-violet-400 tracking-widest uppercase">VELOCITY SENSORS</div>
                  <Activity className="w-4 h-4 md:w-5 md:h-5 text-violet-400" />
                </div>
                
                <div className="flex items-end gap-2 md:gap-3 h-24 md:h-32 mb-6 md:mb-8">
                  {[...Array(12)].map((_, i) => (
                    <div 
                      key={i} 
                      className="flex-1 bg-violet-500/20 rounded-t-lg group-hover:bg-violet-500/40 transition-all duration-500" 
                      style={{ height: `${20 + Math.random() * 80}%` }} 
                    />
                  ))}
                </div>
                
                <div className="bg-black/40 p-3 md:p-4 rounded-lg font-mono text-[9px] md:text-xs border border-violet-500/10">
                  <div className="text-violet-300 mb-1">// Gap Analysis</div>
                  <div className="text-slate-500 line-clamp-2 md:line-clamp-none">
                    commits.sort((a,b) =&gt; b.date - a.date)<br />
                    status: <span className="text-emerald-400 font-bold">ACTIVE</span>
                  </div>
                </div>
             </div>
           </div>
           
           <div className="animate-in order-1 lg:order-2">
             <div className="flex items-center gap-3 mb-4 md:mb-6">
               <div className="p-2 rounded-lg bg-violet-500/10 border border-violet-500/20">
                 <Activity className="w-5 h-5 md:w-6 md:h-6 text-violet-400" />
               </div>
               <span className="orbitron text-violet-400 font-bold tracking-widest text-[10px] md:text-sm uppercase">Behavioral Layer 02</span>
             </div>
             <h2 className="orbitron text-3xl md:text-5xl font-bold text-white mb-6 md:mb-8 leading-tight">Commit Rhythm</h2>
             <p className="font-mono text-slate-400 text-sm md:text-lg leading-relaxed mb-6 md:mb-8">
               We map activity patterns across time. By quantifying the average gap between commits, we identify development "bursts" and long-term consistency.
             </p>
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 border-l-2 border-violet-500 bg-violet-500/5">
                   <div className="text-xl md:text-2xl orbitron text-white">~3d 14h</div>
                   <div className="text-[9px] font-mono text-slate-500 uppercase mt-1">Avg Sync Gap</div>
                </div>
                <div className="p-4 border-l-2 border-cyan-500 bg-cyan-500/5">
                   <div className="text-xl md:text-2xl orbitron text-white">High</div>
                   <div className="text-[9px] font-mono text-slate-500 uppercase mt-1">Consistency</div>
                </div>
             </div>
           </div>
        </div>

        {/* Sub-section C: Parallel Fetching */}
        <div className="analytics-row text-center max-w-4xl mx-auto">
          <div className="animate-in">
             <div className="inline-flex items-center gap-3 mb-4 md:mb-6">
               <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                 <Zap className="w-5 h-5 md:w-6 md:h-6 text-emerald-400" />
               </div>
               <span className="orbitron text-emerald-400 font-bold tracking-widest text-[10px] md:text-sm uppercase">Layer 03</span>
             </div>
             <h2 className="orbitron text-2xl md:text-4xl font-bold text-white mb-6 md:mb-8 leading-tight">Parallel Intelligence</h2>
             <p className="font-mono text-slate-400 text-sm md:text-lg leading-relaxed mb-8 md:mb-12">
               Latency is the enemy. RepoLens triggers concurrent data streams, converging into a unified architecture map in seconds.
             </p>
             
             <div className="relative mt-12 md:mt-20 py-12 md:py-20 md:max-w-5xl mx-auto">
                <div className="absolute inset-0 bg-cyan-500/5 rounded-[40px] blur-[100px] pointer-events-none animate-pulse" />
                
                <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                   {[
                     { label: '/repos', icon: '📦', status: 'STREAMING' },
                     { label: '/contributors', icon: '👥', status: 'SYNCING' },
                     { label: '/languages', icon: '📜', status: 'MAPPING' },
                     { label: '/commits', icon: '🌿', status: 'AUDITING' }
                   ].map((item, i) => (
                     <div 
                       key={i} 
                       className="glass-card group p-5 md:p-6 border-white/5 hover:border-cyan-500/50 transition-all duration-500 bg-[#050810]/60 relative overflow-hidden text-left"
                     >
                        <div className="absolute inset-0 bg-scanline opacity-[0.03] pointer-events-none" />
                        <div className="flex items-center justify-between mb-4 md:mb-6">
                           <div className="p-1.5 md:p-2 rounded-lg bg-white/5 border border-white/10 group-hover:scale-110 transition-all">
                              <span className="text-lg md:text-xl">{item.icon}</span>
                           </div>
                           <div className="flex flex-col items-end">
                              <div className="flex gap-1 mb-1">
                                 {[1,2,3].map(bit => (
                                   <div key={bit} className="w-0.5 h-2 md:w-1 md:h-3 rounded-full bg-cyan-400 group-hover:bg-cyan-400/80 animate-pulse" />
                                 ))}
                              </div>
                              <span className="font-mono text-[7px] md:text-[8px] text-cyan-400 tracking-tighter uppercase">{item.status}</span>
                           </div>
                        </div>
                        <div className="space-y-3 md:space-y-4">
                           <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden relative">
                              <div className="h-full bg-cyan-400" style={{ width: '100%', animation: `shimmer 3s infinite linear` }} />
                           </div>
                           <div className="flex justify-between items-end">
                              <div>
                                 <span className="font-mono text-[8px] md:text-[9px] text-slate-500 uppercase block mb-0.5">Endpoint</span>
                                 <span className="font-mono text-xs md:text-sm text-white font-bold group-hover:text-cyan-400 transition-colors">{item.label}</span>
                              </div>
                              <div className="text-right">
                                 <span className="font-mono text-[8px] md:text-[9px] text-slate-500 uppercase block mb-0.5">Latency</span>
                                 <div className="font-mono text-[9px] md:text-[10px] text-emerald-400">12ms</div>
                              </div>
                           </div>
                        </div>
                     </div>
                   ))}
                </div>

                <div className="hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 items-center justify-center pointer-events-none opacity-50">
                   <div className="absolute inset-0 rounded-full border border-cyan-500/20 animate-spin-slow" />
                   <div className="w-16 h-16 rounded-full bg-[#050810] border border-cyan-500/40 flex items-center justify-center">
                      <Zap className="text-cyan-400 w-6 h-6 animate-pulse" />
                   </div>
                </div>
             </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default AnalyticsSection;
