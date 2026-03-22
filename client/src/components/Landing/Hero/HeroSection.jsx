import React, { useState, useRef, Suspense } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TypeAnimation } from 'react-type-animation';
import { motion } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import { useNavigate } from 'react-router-dom';
import ParticleNetwork from './ParticleNetwork';
import WireframeGlobe from './WireframeGlobe';
import ThemeToggle from '../../ThemeToggle';

gsap.registerPlugin(ScrollTrigger);

const HeroSection = () => {
  const navigate = useNavigate();
  const [repoUrl, setRepoUrl] = useState('');
  const container = useRef();
  const canvasContainer = useRef();

  const handleAnalyze = (e) => {
    e.preventDefault();
    if (repoUrl.trim()) {
      navigate(`/dashboard?repo=${encodeURIComponent(repoUrl.trim())}`);
    }
  };

  useGSAP(() => {
    const tl = gsap.timeline();
    tl.from('.badge-pill', { opacity: 0, y: -20, duration: 0.5, ease: 'power2.out' })
      .from('.hero-headline span', { opacity: 0, y: 30, duration: 0.8, stagger: 0.2, ease: 'power3.out' }, '-=0.2')
      .from('.hero-body', { opacity: 0, duration: 0.5 }, '-=0.4')
      .from('.hero-cta', { opacity: 0, y: 20, duration: 0.5, stagger: 0.1 }, '-=0.2')
      .from('.hero-input-bar', { opacity: 0, y: 20, duration: 0.6, ease: 'back.out(1.7)' }, '-=0.3');

    gsap.to(canvasContainer.current, {
      yPercent: -20,
      ease: "none",
      scrollTrigger: {
        trigger: container.current,
        start: "top top",
        end: "bottom top",
        scrub: true
      }
    });
  }, { scope: container });

  return (
    <section ref={container} className="relative w-full h-[100vh] flex flex-col items-center justify-center overflow-hidden">
      
      {/* Theme Toggle - top right corner */}
      <div className="absolute top-6 right-6 z-20">
        <ThemeToggle />
      </div>

      {/* 3D Background */}
      <div ref={canvasContainer} className="absolute inset-0 z-0">
        <Canvas gl={{ antialias: true, alpha: true }} camera={{ position: [0, 0, 5], fov: 75 }}>
          <Suspense fallback={null}>
            <Stars radius={100} depth={50} count={6000} factor={4} fade speed={1} />
            <ParticleNetwork />
            <WireframeGlobe />
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -3, 0]}>
              <planeGeometry args={[100, 100, 40, 40]} />
              <meshBasicMaterial color="#00F5FF" wireframe transparent opacity={0.05} />
            </mesh>
          </Suspense>
        </Canvas>
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#050810] to-transparent pointer-events-none" />
      </div>

      {/* Foreground Content */}
      <div className="z-10 flex flex-col items-center justify-center text-center px-4 max-w-4xl mx-auto mt-16">
        
        <motion.div 
          className="badge-pill mb-8 px-5 py-2 border border-[#00F5FF]/30 bg-[#00F5FF]/5 rounded-full text-[#00F5FF] text-[11px] font-mono tracking-wider shadow-[0_0_15px_rgba(0,245,255,0.1)] backdrop-blur-sm"
        >
          ⬡ Open Source · Winnowing · Structural Fingerprinting · Line Hash
        </motion.div>

        <h1 className="hero-headline orbitron text-3xl md:text-5xl lg:text-[80px] font-bold mb-6 leading-[1.1] tracking-tight">
          <span className="block drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">Decode Any Repository.</span>
          <span className="block bg-gradient-to-r from-white via-white to-slate-400 text-transparent bg-clip-text">Detect Every Clone.</span>
        </h1>

        <div className="text-lg md:text-2xl text-[#8B5CF6] font-mono mb-8 h-8 drop-shadow-[0_0_10px_rgba(139,92,246,0.5)]">
          <TypeAnimation
            sequence={[
              'Analyze tech stack. Track commit patterns.', 3000,
              '6 Strategies. 4 Algorithms. 1 Truth.', 3000,
              'Fingerprint. Compare. Verdict.', 3000,
              'Open source. Built by devs, for devs.', 3000,
            ]}
            wrapper="span"
            speed={50}
            repeat={Infinity}
            cursor={true}
          />
        </div>

        <p className="hero-body text-slate-400 text-sm md:text-xl font-mono max-w-3xl mb-12 leading-relaxed">
          RepoLens dissects GitHub repositories with surgical precision — delivering stack analytics, commit behavior insights, and multi-algorithm code similarity detection.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 mb-16">
          <button className="hero-cta w-full md:w-auto px-8 py-3 bg-[#00F5FF] text-[#050810] font-bold rounded-lg hover:shadow-[0_0_30px_rgba(0,245,255,0.6)] hover:scale-105 transition-all duration-300">
            Analyze a Repository →
          </button>
          <a href="https://github.com/dakshmiyani/github_Plagarism_checker" target="_blank" rel="noopener noreferrer" className="hero-cta w-full md:w-auto px-8 py-3 bg-[#050810]/50 backdrop-blur-md border border-[#00F5FF]/40 text-[#00F5FF] font-bold rounded-lg hover:bg-[#00F5FF]/10 hover:border-[#00F5FF] transition-all duration-300 flex items-center justify-center gap-2 text-sm">
            View on GitHub ↗
          </a>
        </div>

        <form onSubmit={handleAnalyze} className="hero-input-bar glass-card flex flex-col md:flex-row items-center p-2 w-full max-w-2xl mx-auto relative group shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
          <div className="flex items-center w-full md:flex-1 px-2">
            <input 
              type="text" 
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              placeholder="Enter your GitHub URL (e.g., github.com/owner/repo)" 
              className="flex-1 bg-transparent border-none outline-none text-white font-mono placeholder-slate-600 p-3 text-sm"
            />
          </div>
          <button type="submit" className="w-full md:w-auto px-8 py-3 bg-[#00F5FF] text-[#050810] font-bold rounded hover:shadow-[0_0_30px_rgba(0,245,255,0.6)] transition-all text-sm shrink-0">
            Analyze →
          </button>
        </form>
      </div>
      
      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce cursor-pointer opacity-50 hover:opacity-100 transition-opacity">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#00F5FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;