import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Database, Cpu, MessageSquare, ArrowRight, CheckCircle } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const QueueDiagram = () => {
  const containerRef = useRef();

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 70%',
      }
    });

    tl.from('.flow-step', {
      scale: 0.9,
      opacity: 0,
      y: 20,
      duration: 0.6,
      stagger: 0.2,
      ease: 'power3.out'
    })
    .from('.flow-connector', {
      scaleX: 0,
      opacity: 0,
      duration: 0.8,
      stagger: 0.2,
      ease: 'power2.inOut'
    }, '-=0.8');

    // Continuous floating dot animation
    gsap.to('.flow-dot', {
      x: '100%',
      duration: 2,
      repeat: -1,
      ease: 'none',
      stagger: 0.5
    });

  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="py-32 bg-[#050810] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        
        <div className="text-center mb-24">
           <div className="inline-block px-4 py-1.5 rounded-full border border-violet-500/30 bg-violet-500/5 text-violet-400 text-[10px] orbitron font-bold tracking-widest uppercase mb-6">
             Distributed Processing
           </div>
           <h2 className="orbitron text-4xl md:text-5xl font-black text-white mb-6">Built for Scale</h2>
           <p className="font-mono text-slate-400 text-lg max-w-2xl mx-auto">
             Scanning thousands of files is compute-heavy. RepoLens offloads heavy analysis to a distributed worker queue for non-blocking performance.
           </p>
        </div>

        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 relative pb-20">
          
          {/* Step 1: Input */}
          <div className="flow-step flex-1 w-full max-w-[280px]">
             <div className="glass-card p-6 border-white/10 text-center relative">
                <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4">
                   <MessageSquare size={20} className="text-white" />
                </div>
                <h4 className="orbitron text-sm font-bold text-white mb-2 uppercase tracking-tighter">URL Input</h4>
                <p className="font-mono text-[10px] text-slate-500">HTTPS Request Trigger</p>
                <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 lg:hidden">
                   <ArrowRight size={24} className="text-slate-800 rotate-90" />
                </div>
             </div>
          </div>

          <div className="flow-connector hidden lg:block h-0.5 flex-1 max-w-[60px] bg-white/5 relative overflow-hidden">
            <div className="flow-dot absolute top-0 left-0 h-full w-4 bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />
          </div>

          {/* Step 2: Queue */}
          <div className="flow-step flex-1 w-full max-w-[280px]">
             <div className="glass-card p-6 border-violet-500/30 bg-violet-500/5 text-center relative">
                <div className="w-12 h-12 rounded-xl bg-violet-500/10 border border-violet-500/30 flex items-center justify-center mx-auto mb-4">
                   <Database size={20} className="text-violet-400" />
                </div>
                <h4 className="orbitron text-sm font-bold text-violet-400 mb-2 uppercase tracking-tighter">BullMQ Queue</h4>
                <p className="font-mono text-[10px] text-slate-500">jobId Returned Instantly</p>
                <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 lg:hidden">
                   <ArrowRight size={24} className="text-slate-800 rotate-90" />
                </div>
             </div>
          </div>

          <div className="flow-connector hidden lg:block h-0.5 flex-1 max-w-[60px] bg-white/5 relative overflow-hidden">
            <div className="flow-dot absolute top-0 left-0 h-full w-4 bg-gradient-to-r from-transparent via-violet-400 to-transparent" />
          </div>

          {/* Step 3: Workers */}
          <div className="flow-step flex-1 w-full max-w-[280px]">
             <div className="glass-card p-6 border-cyan-500/30 bg-cyan-500/5 text-center relative scale-110 z-10 shadow-[0_0_40px_rgba(0,245,255,0.1)]">
                <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mx-auto mb-4 animate-spin-slow">
                   <Cpu size={20} className="text-cyan-400" />
                </div>
                <h4 className="orbitron text-sm font-bold text-cyan-400 mb-2 uppercase tracking-tighter">Analyzers</h4>
                <p className="font-mono text-[10px] text-slate-500">3 Parallel Algorithm Suites</p>
                <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 lg:hidden">
                   <ArrowRight size={24} className="text-slate-800 rotate-90" />
                </div>
             </div>
          </div>

          <div className="flow-connector hidden lg:block h-0.5 flex-1 max-w-[60px] bg-white/5 relative overflow-hidden">
            <div className="flow-dot absolute top-0 left-0 h-full w-4 bg-gradient-to-r from-transparent via-emerald-400 to-transparent" />
          </div>

          {/* Step 4: Finished */}
          <div className="flow-step flex-1 w-full max-w-[280px]">
             <div className="glass-card p-6 border-emerald-500/30 bg-emerald-500/5 text-center relative">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto mb-4">
                   <CheckCircle size={20} className="text-emerald-400" />
                </div>
                <h4 className="orbitron text-sm font-bold text-emerald-400 mb-2 uppercase tracking-tighter">Verdict</h4>
                <p className="font-mono text-[10px] text-slate-500">Report & Analytics Ready</p>
             </div>
          </div>

        </div>

        <div className="flex flex-col md:flex-row gap-12 mt-20 items-center justify-center">
           <div className="p-6 glass-card border-white/5 flex gap-4 items-start max-w-sm">
              <div className="text-cyan-400 font-mono text-sm">[01]</div>
              <p className="font-mono text-xs text-slate-400 leading-relaxed">
                <span className="text-white block mb-1 uppercase tracking-tighter orbitron font-bold">Latency Shield</span>
                The BullMQ layer ensures that even under heavy load, the user interface remains responsive while analysis happens asynchronously.
              </p>
           </div>
           
           <div className="p-6 glass-card border-white/5 flex gap-4 items-start max-w-sm">
              <div className="text-violet-400 font-mono text-sm">[02]</div>
              <p className="font-mono text-xs text-slate-400 leading-relaxed">
                <span className="text-white block mb-1 uppercase tracking-tighter orbitron font-bold">Cluster Ready</span>
                The Node.js worker architecture is designed to scale horizontally. Add more worker nodes to handle hundreds of concurrent repos.
              </p>
           </div>
        </div>
      </div>
    </section>
  );
};

export default QueueDiagram;
