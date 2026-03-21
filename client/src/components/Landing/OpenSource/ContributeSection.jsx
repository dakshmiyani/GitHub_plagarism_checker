import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'framer-motion';
import { Github, Brain, BarChart3, Plug } from 'lucide-react';
import { TypeAnimation } from 'react-type-animation';

gsap.registerPlugin(ScrollTrigger);

const TechPill = ({ text }) => (
  <div className="px-3 py-1 rounded-md bg-white/5 border border-white/10 text-slate-400 font-mono text-[10px] hover:border-violet-500/50 hover:text-violet-400 transition-colors">
    {text}
  </div>
);

const ContributeCard = ({ icon: Icon, title, description }) => (
  <div className="p-4 rounded-xl bg-violet-500/5 border border-violet-500/10 hover:border-violet-500/30 transition-all group overflow-hidden relative">
    <div className="absolute -right-2 -bottom-2 opacity-5 group-hover:opacity-10 transition-opacity">
       <Icon size={64} />
    </div>
    <div className="relative z-10">
       <div className="flex items-center gap-2 mb-2">
         <Icon size={14} className="text-violet-400" />
         <h5 className="orbitron text-[10px] font-bold text-white uppercase tracking-wider">{title}</h5>
       </div>
       <p className="font-mono text-[11px] text-slate-500 leading-tight">{description}</p>
    </div>
  </div>
);

const ContributeSection = () => {
  const containerRef = useRef();

  useGSAP(() => {
    gsap.from('.os-left', {
      x: -50,
      opacity: 0,
      duration: 1,
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 70%'
      }
    });

    gsap.from('.os-right', {
      x: 50,
      opacity: 0,
      duration: 1,
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 70%'
      }
    });
  }, { scope: containerRef });

  const structure = `repolens/
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── styles/
└── server/
    ├── src/
    │   ├── businessLogic/
    │   │   └── managers/
    │   │       ├── PlagiarismManager.js
    │   │       └── gitHubAnalyticsManager.js
    │   ├── utils/
    │   │   ├── compareFingerprints.js
    │   │   ├── fetchRepoTree.js
    │   │   ├── githubApi.js
    │   │   ├── githubRequest.js
    │   │   ├── githubSearch.js
    │   │   ├── lineHashCompare.js
    │   │   ├── normalizeCode.js
    │   │   ├── repoMetadataSearch.js
    │   │   ├── repoUrlParser.js
    │   │   ├── similarity.js
    │   │   ├── structuralNormalize.js
    │   │   ├── tokenize.js
    │   │   └── winnowing.js
    │   ├── workers/
    │   │   └── plagiarismWorker.js
    │   ├── routes/
    │   │   ├── router/
    │   │   │   ├── gitHubAnalyticsRouter.js
    │   │   │   └── plagiarismRouter.js
    │   │   └── routeWrapper.js
    │   └── queues/
    │       └── plagiarismQueue.js
    ├── server.js
    └── worker.js`;

  return (
    <section ref={containerRef} className="py-32 bg-[#050810] border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          
          {/* Left Column: Call to Action */}
          <div className="os-left">
            <h2 className="orbitron text-violet-400 font-bold tracking-widest text-[10px] md:text-sm uppercase mb-4 md:mb-6 drop-shadow-[0_0_10px_rgba(139,92,246,0.3)]">
              Built in the Open
            </h2>
            <h1 className="orbitron text-3xl md:text-5xl font-black text-white mb-6 md:mb-8 leading-tight">
              Contribute to the Code Engine
            </h1>
            <p className="font-mono text-slate-400 text-sm md:text-lg leading-relaxed mb-8 md:mb-10">
              RepoLens is an open-source engineering effort. Help us expand its detection capabilities and join the most robust intelligence tool on the planet.
            </p>

            <div className="flex flex-wrap gap-2 mb-8 md:mb-12">
               {['Node.js', 'BullMQ', 'React', 'Three.js', 'Redis', 'Express', 'GitHub API'].map(tech => (
                 <TechPill key={tech} text={tech} />
               ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 mb-8 md:mb-12">
               <ContributeCard 
                 icon={Brain} 
                 title="Add Strategy" 
                 description="Implement new discovery methods."
               />
               <ContributeCard 
                 icon={BarChart3} 
                 title="Refine Scoring" 
                 description="Tune algorithm weights."
               />
               <ContributeCard 
                 icon={Plug} 
                 title="Integrations" 
                 description="Build CLI tools or extensions."
               />
            </div>

            <button className="w-full sm:w-auto px-8 py-4 bg-[#8B5CF6] text-white orbitron font-bold rounded-lg hover:shadow-[0_0_30px_rgba(139,92,246,0.5)] transition-all flex items-center justify-center gap-3">
              <Github size={18} />
              VIEW ON GITHUB →
            </button>
          </div>

          {/* Right Column: Code Structure Typing */}
          <div className="os-right mt-12 lg:mt-0">
             <div className="glass-card p-6 md:p-8 border-white/10 bg-black/40 min-h-[350px] md:min-h-[460px] relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-3 md:p-4 font-mono text-[8px] md:text-[10px] text-slate-800 tracking-widest uppercase">MANIFEST</div>
                
                {/* Simulated file tree with typing effect - Scrollable on mobile */}
                <div className="font-mono text-xs md:text-sm leading-relaxed whitespace-pre text-slate-300 overflow-x-auto custom-scrollbar">
                   <TypeAnimation
                     sequence={[structure]}
                     wrapper="div"
                     speed={80}
                     cursor={false}
                   />
                </div>

                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
             </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default ContributeSection;
