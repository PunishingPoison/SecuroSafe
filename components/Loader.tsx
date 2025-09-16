import React from 'react';

interface LoaderProps {
    message?: string;
}

export const Loader: React.FC<LoaderProps> = ({ message = "Analyzing Data Stream..." }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 text-cyan-300">
      <div className="relative w-16 h-16 mb-6">
        <div className="absolute inset-0 border-2 border-cyan-500/30 rounded-full animate-spin"></div>
        <div className="absolute inset-2 border-2 border-cyan-500/30 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '2s' }}></div>
        <div className="absolute inset-4 text-cyan-400 flex items-center justify-center font-bold text-xs">AI</div>
      </div>
      <p className="font-semibold text-lg typing-effect" style={{ width: `${message.length}ch` }}>{message}</p>
      <p className="text-sm text-slate-400 mt-2 animate-pulse">// Stand by for analysis report...</p>
    </div>
  );
};
