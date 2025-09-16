import React from 'react';

interface ScoreBadgeProps {
  score: number;
}

export const ScoreBadge: React.FC<ScoreBadgeProps> = ({ score }) => {
  const getScoreStyles = () => {
    if (score >= 75) return { color: 'text-green-400', borderColor: 'border-green-500/30', shadow: 'shadow-[0_0_15px_rgba(74,222,128,0.3)]' };
    if (score >= 40) return { color: 'text-yellow-400', borderColor: 'border-yellow-500/30', shadow: 'shadow-[0_0_15px_rgba(234,179,8,0.3)]' };
    return { color: 'text-red-400', borderColor: 'border-red-500/30', shadow: 'shadow-[0_0_15px_rgba(248,113,113,0.3)]' };
  };

  const { color, borderColor, shadow } = getScoreStyles();

  return (
    <div className={`p-3 text-center border-2 bg-black/20 ${borderColor} ${shadow}`}>
      <div className={`text-sm font-semibold uppercase tracking-widest mb-1 ${color}`}>Credibility Score</div>
      <div className={`text-4xl font-bold ${color}`}>{score}<span className="text-2xl opacity-50">/100</span></div>
    </div>
  );
};
