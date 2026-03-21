import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useSpring, useTransform } from 'framer-motion';
import { Play, RotateCcw, PieChart, ShieldAlert, Cpu, CheckCircle2 } from 'lucide-react';

// Custom Animated Number component to avoid react-countup import issues
const AnimatedNumber = ({ value, duration = 2 }) => {
  const spring = useSpring(0, { bounce: 0, duration: duration * 1000 });
  const display = useTransform(spring, (latest) => Math.floor(latest).toLocaleString());

  useEffect(() => {
    spring.set(value);
  }, [value, spring]);

  return <motion.span>{display}</motion.span>;
};

const DemoResultPanel = ({ activeTab }) => {
  if (activeTab === 'analytics') {
    return (
      <motion.div
        key="analytics"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="space-y-6"
      >
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/5 p-4 rounded-xl border border-white/5 shadow-inner">
            <div className="text-[10px] font-mono text-slate-500 uppercase mb-1 tracking-widest">Commits</div>
            <div className="text-2xl orbitron text-white font-bold">
              <AnimatedNumber value={1428} />
            </div>
          </div>
          <div className="bg-white/5 p-4 rounded-xl border border-white/5 shadow-inner">
            <div className="text-[10px] font-mono text-slate-500 uppercase mb-1 tracking-widest">Consistency</div>
            <div className="text-2xl orbitron text-cyan-400 font-bold">98%</div>
          </div>
        </div>

        <div className="bg-black/40 p-6 rounded-xl border border-white/5 relative overflow-hidden group">
          <div className="absolute inset-0 bg-scanline opacity-[0.02] pointer-events-none" />
          <div className="flex justify-between items-center mb-4 relative z-10">
            <span className="font-mono text-xs text-white uppercase tracking-widest">Tech Stack Breakdown</span>
            <PieChart size={14} className="text-cyan-500 animate-pulse" />
          </div>
          <div className="space-y-4 relative z-10">
            {[
              { label: 'JavaScript', val: 74, color: '#00F5FF' },
              { label: 'TypeScript', val: 18, color: '#8B5CF6' },
              { label: 'CSS', val: 8, color: '#10F587' }
            ].map(lang => (
              <div key={lang.label}>
                <div className="flex justify-between text-[10px] font-mono mb-1.5">
                  <span className="text-slate-400">{lang.label}</span>
                  <span className="text-white font-bold">{lang.val}%</span>
                </div>
                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5 p-[1px]">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${lang.val}%` }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="h-full rounded-full shadow-[0_0_10px_rgba(0,245,255,0.3)]"
                    style={{ backgroundColor: lang.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      key="similarity"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="bg-emerald-500/10 border border-emerald-500/20 p-5 rounded-xl flex items-center gap-4 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-2 font-mono text-[8px] text-emerald-500/30">ID: RP-9281</div>
        <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30 group-hover:scale-110 transition-transform">
          <CheckCircle2 className="text-emerald-400" size={20} />
        </div>
        <div>
          <div className="orbitron text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-1">Final Verdict</div>
          <div className="text-white font-mono text-sm uppercase font-bold tracking-tight">Likely Original — Analysis Complete</div>
        </div>
      </div>

      <div className="space-y-5">
        {[
          { label: 'Literal Sim', val: 8.4, color: '#00F5FF' },
          { label: 'Structural Sim', val: 12.1, color: '#8B5CF6' },
          { label: 'Line Match', val: 0.0, color: '#10F587' }
        ].map(stat => (
          <div key={stat.label} className="bg-white/2 p-3 rounded-lg border border-white/5 group">
            <div className="flex justify-between text-[10px] font-mono mb-2">
              <span className="text-slate-400 group-hover:text-white transition-colors">{stat.label}</span>
              <span className="text-white font-bold">{stat.val}%</span>
            </div>
            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${stat.val}%` }}
                transition={{ duration: 1.2 }}
                className="h-full rounded-full shadow-[0_0_10px_rgba(0,245,255,0.2)]"
                style={{ backgroundColor: stat.color }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 bg-black/40 rounded-xl border border-white/5">
        <div className="text-[10px] font-mono text-slate-500 uppercase mb-4 flex justify-between items-center">
          <span>Strategies Resolved</span>
          <ShieldAlert size={12} className="text-slate-600" />
        </div>
        <div className="flex flex-wrap gap-2">
          {['FORK_API', 'METADATA', 'CODE_SEARCH', 'WINNOWING'].map(s => (
            <div key={s} className="px-3 py-1.5 rounded-md bg-white/5 border border-white/10 text-[9px] font-mono text-emerald-400 shadow-sm flex items-center gap-2">
              <div className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
              {s} ✓
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

const InteractiveDemo = () => {
  const [status, setStatus] = useState('idle'); // idle, loading, complete
  const [activeTab, setActiveTab] = useState('analytics');
  const [url, setUrl] = useState('github.com/facebook/react');
  const [logs, setLogs] = useState([]);

  const addLog = (msg) => {
    setLogs(prev => [...prev.slice(-4), msg]);
  };

  const handleRun = () => {
    setStatus('loading');
    setLogs([]);

    const steps = [
      { msg: "> INITIALIZING ANALYSIS PIPELINE...", delay: 200 },
      { msg: "> HANDSHAKE WITH GITHUB API...", delay: 800 },
      { msg: "> FETCHING REPOSITORY OBJECTS...", delay: 1400 },
      { msg: "> EXECUTING WINNOWING ALGORITHMS...", delay: 2000 },
      { msg: "> COMPARING FINGERPRINTS...", delay: 2600 },
      { msg: "> GENERATING FINAL REPORT...", delay: 3000 },
    ];

    steps.forEach(step => {
      setTimeout(() => addLog(step.msg), step.delay);
    });

    setTimeout(() => {
      setStatus('complete');
    }, 3500);
  };

  const handleReset = () => {
    setStatus('idle');
    setActiveTab('analytics');
    setLogs([]);
  };

  return (
    <section className="py-32 bg-[#050810] relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-cyan-500/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">

        <div className="text-center mb-24">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 mb-6 group cursor-default">
            <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            <span className="orbitron text-[10px] text-cyan-400 font-bold tracking-widest uppercase">Live Demo Environment</span>
          </div>
          <h2 className="orbitron text-4xl md:text-5xl font-black text-white mb-8 tracking-tight">Experience Infinite Intelligence</h2>
          <p className="font-mono text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
            Test the RepoLens heuristic engine with a simulated payload. Witness how thousands of data points transform into actionable clarity.
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-10 items-stretch min-h-[500px] md:min-h-[550px]">

          {/* Left: Input Console */}
          <div className="lg:col-span-5 glass-card p-6 md:p-10 bg-black/40 border-white/10 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-cyan-500 to-violet-500" />

            <div>
              <div className="flex items-center gap-3 mb-8 md:mb-12">
                <div className="p-1.5 md:p-2 rounded-lg bg-white/5 border border-white/10">
                  <Cpu className="text-cyan-400" size={16} md={18} />
                </div>
                <div>
                  <span className="orbitron text-[9px] md:text-[10px] font-bold text-white tracking-[0.2em] uppercase">Control Module</span>
                </div>
              </div>

              <div className="space-y-6 md:space-y-8">
                <div>
                  <label className="block font-mono text-[9px] md:text-[10px] text-slate-500 uppercase mb-2 md:mb-3 tracking-widest">Repository URI</label>
                  <div className="w-full bg-black/40 border border-white/10 rounded-xl p-3 md:p-4 font-mono text-xs md:text-sm text-white flex items-center gap-2 md:gap-3 transition-all">
                    <span className="text-slate-600 hidden sm:inline">https://</span>
                    <input
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      disabled={status !== 'idle'}
                      className="bg-transparent border-none outline-none flex-1 truncate"
                      placeholder="github.com/user/repo"
                    />
                  </div>
                </div>

                {status === 'loading' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-1.5 md:space-y-2 font-mono text-[8px] md:text-[10px] text-cyan-400/80 bg-black/60 p-3 md:p-4 rounded-lg border border-cyan-500/20"
                  >
                    {logs.map((log, i) => (
                      <div key={i} className="flex gap-2 truncate">
                        <span className="text-cyan-600">[{new Date().toLocaleTimeString().split(' ')[0]}]</span>
                        <span>{log}</span>
                      </div>
                    ))}
                    <div className="w-full h-1 bg-white/5 rounded-full mt-3 md:mt-4 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 3.5, ease: "linear" }}
                        className="h-full bg-cyan-500"
                      />
                    </div>
                  </motion.div>
                )}
              </div>
            </div>

            <div className="mt-8 md:mt-16 flex gap-3 md:gap-4">
              {status === 'idle' ? (
                <button
                  onClick={handleRun}
                  className="flex-1 py-4 md:py-5 bg-[#00F5FF] text-[#050810] orbitron text-xs md:text-sm font-bold rounded-xl hover:shadow-[0_0_30px_rgba(0,245,255,0.5)] transition-all flex items-center justify-center gap-2 md:gap-3"
                >
                  <Play size={16} fill="currentColor" />
                  EXECUTE
                </button>
              ) : (
                <button
                  onClick={handleReset}
                  className="flex-1 py-4 md:py-5 bg-white/5 border border-white/10 text-white orbitron text-xs md:text-sm font-bold rounded-xl hover:bg-white/10 flex items-center justify-center gap-2 md:gap-3"
                >
                  <RotateCcw size={16} className={status === 'loading' ? 'animate-spin' : ''} />
                  {status === 'loading' ? 'ANALYZING' : 'RESET'}
                </button>
              )}
            </div>
          </div>

          {/* Right: Output Monitor */}
          <div className="lg:col-span-7 glass-card bg-[#050810] border-white/10 overflow-hidden flex flex-col relative min-h-[400px]">
            <div className="absolute inset-0 bg-scanline opacity-[0.03] pointer-events-none" />

            <div className="border-b border-white/5 flex bg-black/20 relative z-10">
              <button
                onClick={() => setActiveTab('analytics')}
                className={`flex-1 py-4 md:py-5 orbitron text-[9px] md:text-[10px] font-bold tracking-widest transition-all relative ${activeTab === 'analytics' ? 'text-cyan-400' : 'text-slate-500'}`}
              >
                ANALYTICS
                {activeTab === 'analytics' && <motion.div layoutId="tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-400 shadow-[0_0_10px_rgba(0,245,255,1)]" />}
              </button>
              <button
                onClick={() => setActiveTab('similarity')}
                className={`flex-1 py-4 md:py-5 orbitron text-[9px] md:text-[10px] font-bold tracking-widest transition-all relative ${activeTab === 'similarity' ? 'text-violet-400' : 'text-slate-500'}`}
              >
                SIMILARITY
                {activeTab === 'similarity' && <motion.div layoutId="tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-violet-400 shadow-[0_0_10px_rgba(139,92,246,1)]" />}
              </button>
            </div>

            <div className="flex-1 p-6 md:p-10 relative z-10 flex flex-col">
              <AnimatePresence mode="wait">
                {status === 'idle' ? (
                  <motion.div
                    key="idle"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="h-full flex-1 flex flex-col items-center justify-center text-center space-y-4 md:space-y-6"
                  >
                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-full border border-white/5 flex items-center justify-center border-dashed animate-spin-slow">
                      <ShieldAlert size={24} md={32} className="text-slate-800" />
                    </div>
                    <div className="space-y-1 md:space-y-2">
                      <div className="orbitron text-[10px] font-bold text-slate-700 uppercase">Standby</div>
                    </div>
                  </motion.div>
                ) : status === 'loading' ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="h-full flex-1 flex flex-col items-center justify-center space-y-6 md:space-y-8"
                  >
                    <div className="relative">
                      <div className="w-16 h-16 md:w-24 md:h-24 rounded-full border-4 border-cyan-500/20 flex items-center justify-center">
                        <div className="w-12 h-12 md:w-16 md:h-16 rounded-full border-4 border-cyan-500 border-t-transparent animate-spin" />
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="orbitron text-xs md:text-sm font-bold text-cyan-400 mb-1 animate-pulse uppercase">Extracting...</div>
                    </div>
                  </motion.div>
                ) : (
                  <DemoResultPanel activeTab={activeTab} />
                )}
              </AnimatePresence>

              {/* Bottom Status Bar */}
              <div className="mt-auto pt-6 md:pt-8 border-t border-white/5 flex justify-between items-center text-[8px] md:text-[10px] font-mono text-slate-600">
                <div className="flex items-center gap-1.5 md:gap-2">
                  <div className={`w-1 h-1 md:w-1.5 md:h-1.5 rounded-full ${status === 'complete' ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                  {status === 'idle' ? 'IDLE' : status === 'loading' ? 'ACTIVE' : 'READY'}
                </div>
                <div className="flex gap-4 md:gap-6">
                  <span className="hidden sm:inline">NYC-01BD</span>
                  <span className="text-cyan-500/50">0.12ms</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        <div className="mt-16 text-center">
          <p className="font-mono text-[10px] text-slate-600 tracking-widest uppercase">
            Disclaimer: This dashboard is a visual interface simulation. Full analysis required RepoLens Cloud Access.
          </p>
        </div>

      </div>
    </section>
  );
};

export default InteractiveDemo;
