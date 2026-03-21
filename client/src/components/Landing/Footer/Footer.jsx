import React from 'react';
import { Github, Twitter, Linkedin, Mail, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#050810] border-t border-white/5 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
          
          {/* Brand Column */}
          <div className="lg:col-span-1 text-center md:text-left">
             <div className="flex items-center justify-center md:justify-start gap-3 mb-4 md:mb-6">
                <div className="w-6 h-6 md:w-8 md:h-8 rounded bg-gradient-to-br from-cyan-400 to-violet-500" />
                <span className="orbitron text-lg md:text-xl font-black text-white tracking-widest uppercase">RepoLens</span>
             </div>
             <p className="font-mono text-[10px] md:text-xs text-slate-500 leading-relaxed max-w-xs mx-auto md:ml-0">
                The open-source code originality engine. Advanced analytics and multi-algorithm plagiarism detection for engineering teams.
             </p>
          </div>

          <div className="text-center md:text-left">
            <h4 className="orbitron text-[10px] font-bold text-white uppercase tracking-widest mb-6">Product</h4>
            <ul className="font-mono text-[10px] text-slate-500 space-y-4">
               <li><a href="#" className="hover:text-cyan-400 transition-colors uppercase">Analytics Engine</a></li>
               <li><a href="#" className="hover:text-cyan-400 transition-colors uppercase">Similarity Suite</a></li>
               <li><a href="#" className="hover:text-cyan-400 transition-colors uppercase">API Reference</a></li>
               <li><a href="#" className="hover:text-cyan-400 transition-colors uppercase">CLI Tooling</a></li>
            </ul>
          </div>

          {/* Open Source Links */}
          <div className="text-center md:text-left">
            <h4 className="orbitron text-[10px] font-bold text-white uppercase tracking-widest mb-6">Open Source</h4>
            <ul className="font-mono text-[10px] text-slate-500 space-y-4">
               <li><a href="#" className="hover:text-violet-400 transition-colors uppercase">Contribute</a></li>
               <li><a href="#" className="hover:text-violet-400 transition-colors uppercase">Whitepaper</a></li>
               <li><a href="#" className="hover:text-violet-400 transition-colors uppercase">Architecture</a></li>
               <li><a href="#" className="hover:text-violet-400 transition-colors uppercase">GitHub Repository</a></li>
            </ul>
          </div>

          {/* Community & Social */}
          <div className="flex flex-col items-center md:items-start">
            <h4 className="orbitron text-[10px] font-bold text-white uppercase tracking-widest mb-6">Connect</h4>
            <div className="flex gap-4 mb-8">
               <a href="#" className="p-2 rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:text-cyan-400 transition-all hover:bg-white/10"><Github size={16} /></a>
               <a href="#" className="p-2 rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:text-cyan-400 transition-all hover:bg-white/10"><Twitter size={16} /></a>
               <a href="#" className="p-2 rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:text-cyan-400 transition-all hover:bg-white/10"><Linkedin size={16} /></a>
               <a href="#" className="p-2 rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:text-cyan-400 transition-all hover:bg-white/10"><Mail size={16} /></a>
            </div>
          </div>

        </div>

        <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-center">
           <div className="font-mono text-[8px] md:text-[9px] text-slate-600 uppercase tracking-[0.2em]">
             &copy; 2026 REPOLENS FOUNDATION. ALL RIGHTS RESERVED.
           </div>
           <div className="flex items-center gap-2 font-mono text-[8px] md:text-[9px] text-slate-600 uppercase tracking-[0.2em]">
             MADE WITH <Heart size={10} className="text-crimson animate-pulse" /> FOR THE OPEN SOURCE COMMUNITY
           </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
