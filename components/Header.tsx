import React from 'react';
import { ShieldCheckIcon } from './icons/ShieldCheckIcon';

export const Header: React.FC = () => {
  return (
    <header className="text-center mb-10">
      <div className="flex items-center justify-center gap-4 mb-2">
        <ShieldCheckIcon className="h-12 w-12 text-cyan-400 animate-flicker" style={{ filter: 'drop-shadow(0 0 6px #06b6d4)'}}/>
        <h1 className="text-4xl md:text-5xl font-bold text-cyan-300 text-glow">
          SECURO/SAFE
        </h1>
      </div>
      <p className="text-slate-400 text-sm tracking-widest uppercase">
        // Analyzing Digital Threats & Misinformation Streams //
      </p>
    </header>
  );
};