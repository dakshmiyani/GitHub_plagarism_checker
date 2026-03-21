import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Search, Code2 } from 'lucide-react'; // Using Lucide React for crisp SVG icons

gsap.registerPlugin(ScrollTrigger);

const AudienceBanner = () => {
  const containerRef = useRef();
  
  useGSAP(() => {
    // Reveal sides from off-screen
    gsap.from('.audience-left', {
      x: -100,
      opacity: 0,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 85%',
      }
    });

    gsap.from('.audience-right', {
      x: 100,
      opacity: 0,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 85%',
      }
    });

    // Animate the center divider growing from top to bottom
    gsap.fromTo('.audience-divider', 
      { scaleY: 0 },
      {
        scaleY: 1,
        transformOrigin: "top center",
        duration: 1.2,
        ease: 'power4.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 85%',
        }
      }
    );
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="relative w-full overflow-hidden border-y border-white/5 bg-[#050810]">
      <div className="flex flex-col md:flex-row min-h-[180px] w-full relative">
        
        {/* Left Half - Users */}
        <div className="audience-left flex-1 flex items-center justify-center p-6 md:p-8 lg:p-12 bg-gradient-to-r from-[#00F5FF]/10 to-transparent relative group cursor-pointer hover:bg-[#00F5FF]/5 transition-colors duration-500">
          <div className="flex items-center md:items-start gap-4 md:gap-6 max-w-md">
            <div className="p-3 md:p-4 rounded-xl bg-[#00F5FF]/10 border border-[#00F5FF]/30 group-hover:shadow-[0_0_20px_rgba(0,245,255,0.4)] transition-all duration-300 shrink-0">
              <Search className="w-6 h-6 md:w-8 md:h-8 text-[#00F5FF]" strokeWidth={2.5} />
            </div>
            <div>
              <h2 className="orbitron text-xl md:text-2xl font-bold text-white mb-1 md:mb-2 group-hover:text-[#00F5FF] transition-colors">
                Use RepoLens
              </h2>
              <p className="font-mono text-slate-400 text-[11px] md:text-sm leading-relaxed">
                Analyze any public GitHub repository instantly. Get deep insights into architectures and verify code originality.
              </p>
            </div>
          </div>
        </div>

        {/* Center Glowing Divider */}
        <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-[2px] -translate-x-1/2 z-10">
          <div className="audience-divider w-full h-full bg-gradient-to-b from-transparent via-white to-transparent opacity-30 shadow-[0_0_15px_rgba(255,255,255,0.8)]" />
        </div>
        
        {/* Mobile Horizontal Divider */}
        <div className="md:hidden w-full h-px bg-white/5 shadow-[0_0_10px_rgba(255,255,255,0.1)]" />

        {/* Right Half - Contributors */}
        <div className="audience-right flex-1 flex items-center justify-center p-6 md:p-8 lg:p-12 bg-gradient-to-l from-[#8B5CF6]/10 to-transparent relative group cursor-pointer hover:bg-[#8B5CF6]/5 transition-colors duration-500">
          <div className="flex items-center md:items-start gap-4 md:gap-6 max-w-md">
            <div className="p-3 md:p-4 rounded-xl bg-[#8B5CF6]/10 border border-[#8B5CF6]/30 group-hover:shadow-[0_0_20px_rgba(139,92,246,0.4)] transition-all duration-300 shrink-0">
              <Code2 className="w-6 h-6 md:w-8 md:h-8 text-[#8B5CF6]" strokeWidth={2.5} />
            </div>
            <div>
              <h2 className="orbitron text-xl md:text-2xl font-bold text-white mb-1 md:mb-2 group-hover:text-[#8B5CF6] transition-colors">
                Contribute
              </h2>
              <p className="font-mono text-slate-400 text-[11px] md:text-sm leading-relaxed">
                Open source. PRs welcome. Join the engineering effort on Node, React, and BullMQ.
              </p>
            </div>
          </div>
        </div>
        
      </div>
    </section>
  );
};

export default AudienceBanner;
