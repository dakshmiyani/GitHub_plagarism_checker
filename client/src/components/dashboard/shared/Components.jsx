import React from 'react';
import { motion } from 'framer-motion';

export const GlassCard = ({ children, className = '', hover = true }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`glass-card p-6 border-white/5 relative overflow-hidden group ${hover ? 'hover:border-[#00F5FF]/20 transition-all duration-500' : ''} ${className}`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
};

export const SkeletonCard = ({ className = '', height = '200px' }) => {
  return (
    <div 
      className={`glass-card p-6 border-white/5 relative overflow-hidden ${className}`}
      style={{ height }}
    >
      <div className="w-full h-full skeleton opacity-50 rounded-lg" />
    </div>
  );
};
