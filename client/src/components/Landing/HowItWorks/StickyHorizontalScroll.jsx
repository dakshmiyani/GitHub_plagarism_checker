import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Github, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const StickyHorizontalScroll = () => {
  const sectionRef = useRef();
  const triggerRef = useRef();

  useGSAP(() => {
    const pin = gsap.fromTo(
      sectionRef.current,
      { translateX: 0 },
      {
        translateX: "-200vw",
        ease: "none",
        duration: 1,
        scrollTrigger: {
          trigger: triggerRef.current,
          start: "top top",
          end: "2000 top",
          scrub: 0.6,
          pin: true,
          anticipatePin: 1,
        },
      }
    );
    return () => {
      pin.kill();
    };
  }, []);

  return (
    <section className="overflow-hidden">
      <div ref={triggerRef}>
        <div ref={sectionRef} className="h-screen w-[300vw] flex flex-row relative">
          
          {/* Card 1: Submit a Repository */}
          <div className="h-screen w-screen flex flex-col items-center justify-center p-6 md:p-10 bg-mesh overflow-y-auto">
             <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
                <div className="text-left">
                  <h3 className="orbitron text-cyan-400 text-[10px] md:text-sm font-bold mb-2 md:mb-4 tracking-tighter uppercase">// Step 01</h3>
                  <h2 className="orbitron text-3xl md:text-5xl font-bold text-white mb-4 md:mb-6 leading-tight">Submit Your Repo</h2>
                  <p className="font-mono text-slate-400 text-sm md:text-lg leading-relaxed mb-6 md:mb-8">
                    Paste any public GitHub URL. RepoLens clones and prepares the core architecture for analysis in milliseconds.
                  </p>
                  <div className="flex items-center gap-4 p-3 md:p-4 rounded-xl bg-white/5 border border-white/10 font-mono text-[10px] md:text-sm">
                    <span className="text-emerald-400">$</span>
                    <span className="text-white overflow-hidden text-ellipsis">repolens examine react --deep</span>
                  </div>
                </div>
                
                <div className="glass-card p-6 md:p-8 relative flex flex-col items-center justify-center min-h-[300px] md:min-h-[400px]">
                   <div className="absolute top-4 left-4 flex gap-2">
                     <div className="w-2 h-2 rounded-full bg-red-500/50" />
                     <div className="w-2 h-2 rounded-full bg-yellow-500/50" />
                     <div className="w-2 h-2 rounded-full bg-green-500/50" />
                   </div>
                   
                   <div className="p-4 md:p-6 rounded-full bg-cyan-500/10 border border-cyan-500/30 mb-6 md:mb-8 animate-pulse shadow-[0_0_30px_rgba(0,245,255,0.2)]">
                     <Github className="w-12 h-12 md:w-16 md:h-16 text-cyan-400" />
                   </div>
                   
                   <div className="bg-black/40 rounded-lg p-3 md:p-4 w-full font-mono text-[10px] text-cyan-300">
                     <p className="mb-2 text-white/50">// URL detected</p>
                     <p>repo: <span className="text-white">"facebook/react"</span></p>
                     <p className="mt-2 animate-pulse">Scanning file tree... |</p>
                   </div>
                </div>
             </div>
          </div>

          {/* Card 2: Instant Analytics */}
          <div className="h-screen w-screen flex flex-col items-center justify-center p-6 md:p-10 bg-mesh overflow-y-auto">
            <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
              <div className="text-left">
                <h3 className="orbitron text-violet-400 text-[10px] md:text-sm font-bold mb-2 md:mb-4 tracking-tighter uppercase">// Step 02</h3>
                <h2 className="orbitron text-3xl md:text-5xl font-bold text-white mb-4 md:mb-6 leading-tight">Source Analytics</h2>
                <p className="font-mono text-slate-400 text-sm md:text-lg leading-relaxed mb-6 md:mb-8">
                   Uncover the hidden metrics. We breakdown the tech stack by bytes and analyze commit hygiene.
                </p>
                <div className="space-y-3 md:space-y-4">
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-cyan-400 w-[64%] shadow-[0_0_10px_rgba(0,245,255,0.5)]" />
                  </div>
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-violet-400 w-[18%]" />
                  </div>
                </div>
              </div>
              
              <div className="glass-card p-6 md:p-8 grid grid-cols-2 gap-3 md:gap-4">
                 <div className="bg-white/5 rounded-xl p-3 md:p-4 border border-white/5 flex flex-col items-center text-center">
                    <span className="text-[8px] md:text-xs font-mono text-slate-500 mb-1 uppercase">Contributors</span>
                    <span className="text-xl md:text-3xl orbitron text-white">1,642</span>
                 </div>
                 <div className="bg-white/5 rounded-xl p-3 md:p-4 border border-white/5 flex flex-col items-center text-center">
                    <span className="text-[8px] md:text-xs font-mono text-slate-500 mb-1 uppercase">Avg Gap</span>
                    <span className="text-xl md:text-3xl orbitron text-cyan-400">~3.5d</span>
                 </div>
                 <div className="col-span-2 bg-black/40 rounded-xl p-3 md:p-4 border border-cyan-500/20">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-[10px] font-mono text-cyan-300">Frequency</span>
                      <div className="flex gap-1">
                        {[1, 2, 3].map(i => <div key={i} className="w-1.5 h-1.5 rounded-full bg-emerald-500/50" />)}
                      </div>
                    </div>
                    <div className="flex gap-1 justify-between items-end h-16 md:h-24">
                      {[...Array(15)].map((_, i) => (
                        <div 
                          key={i} 
                          className="w-full bg-emerald-500/20 rounded-sm"
                          style={{ height: `${Math.random() * 80 + 20}%`, opacity: 0.3 + (Math.random() * 0.7) }}
                        />
                      ))}
                    </div>
                 </div>
              </div>
            </div>
          </div>

          {/* Card 3: Similarity Report */}
          <div className="h-screen w-screen flex flex-col items-center justify-center p-6 md:p-10 bg-mesh overflow-y-auto">
             <div className="max-w-5xl w-full">
                <div className="text-center mb-8 md:mb-12">
                  <h3 className="orbitron text-emerald-400 text-[10px] md:text-sm font-bold mb-2 md:mb-4 tracking-tighter uppercase">// Result 03</h3>
                  <h2 className="orbitron text-3xl md:text-5xl font-bold text-white mb-4 md:mb-6 leading-tight">Verification</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
                  <div className="glass-card p-5 md:p-6 border-cyan-500/20 bg-cyan-500/5">
                    <div className="flex items-center gap-3 mb-3 md:mb-4">
                      <Loader2 className="w-4 h-4 text-cyan-400 animate-spin" />
                      <span className="orbitron text-[8px] md:text-xs font-bold text-cyan-400 tracking-widest uppercase">Winnowing</span>
                    </div>
                    <div className="text-3xl md:text-4xl orbitron text-white mb-1">94.2%</div>
                  </div>
                  
                  <div className="glass-card p-5 md:p-6 border-violet-500/20 bg-violet-500/5">
                     <div className="flex items-center gap-3 mb-3 md:mb-4">
                      <CheckCircle2 className="w-4 h-4 text-violet-400" />
                      <span className="orbitron text-[8px] md:text-xs font-bold text-violet-400 tracking-widest uppercase">Structural</span>
                    </div>
                    <div className="text-3xl md:text-4xl orbitron text-white mb-1">88.5%</div>
                  </div>

                  <div className="glass-card p-5 md:p-6 border-emerald-500/20 bg-emerald-500/5">
                    <div className="flex items-center gap-3 mb-3 md:mb-4">
                      <AlertCircle className="w-4 h-4 text-emerald-400" />
                      <span className="orbitron text-[8px] md:text-xs font-bold text-emerald-400 tracking-widest uppercase">Line Hash</span>
                    </div>
                    <div className="text-3xl md:text-4xl orbitron text-emerald-400 mb-1">FLAGGED</div>
                  </div>
                </div>
             </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default StickyHorizontalScroll;
