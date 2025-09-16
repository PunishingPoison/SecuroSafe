import React from 'react';
import { ThreatLevel } from '../types';
import { ShieldCheckIcon } from './icons/ShieldCheckIcon';
import { ShieldExclamationIcon } from './icons/ShieldExclamationIcon';
import { ShieldXIcon } from './icons/ShieldXIcon';

interface ThreatLevelBadgeProps {
  level: ThreatLevel;
}

const levelConfig = {
  [ThreatLevel.Safe]: {
    text: 'Threat Level: Safe',
    icon: <ShieldCheckIcon className="h-6 w-6" />,
    style: 'text-green-400 border-green-500/30 shadow-[0_0_15px_rgba(74,222,128,0.3)]',
  },
  [ThreatLevel.Questionable]: {
    text: 'Threat Level: Questionable',
    icon: <ShieldExclamationIcon className="h-6 w-6" />,
    style: 'text-yellow-400 border-yellow-500/30 shadow-[0_0_15px_rgba(234,179,8,0.3)]',
  },
  [ThreatLevel.Dangerous]: {
    text: 'Threat Level: Dangerous',
    icon: <ShieldXIcon className="h-6 w-6" />,
    style: 'text-red-400 border-red-500/30 shadow-[0_0_15px_rgba(248,113,113,0.3)]',
  },
  [ThreatLevel.Unknown]: {
    text: 'Threat Level: Unknown',
    icon: <ShieldExclamationIcon className="h-6 w-6" />,
    style: 'text-slate-400 border-slate-500/30 shadow-[0_0_15px_rgba(100,116,139,0.3)]',
  }
};

export const ThreatLevelBadge: React.FC<ThreatLevelBadgeProps> = ({ level }) => {
  const config = levelConfig[level] || levelConfig[ThreatLevel.Unknown];

  return (
    <div className={`flex items-center justify-center gap-3 p-3 text-center border-2 bg-black/20 ${config.style}`}>
       {config.icon}
      <div className="flex flex-col text-left">
        <span className="text-sm font-semibold uppercase tracking-widest">{config.text.split(': ')[0]}</span>
        <span className="text-lg font-bold">{config.text.split(': ')[1]}</span>
      </div>
    </div>
  );
};
