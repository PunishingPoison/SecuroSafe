import React from 'react';
import type { HistoryItem } from '../types';
import { HistoryIcon } from './icons/HistoryIcon';
import { LinkIcon } from './icons/LinkIcon';
import { FileTextIcon } from './icons/FileTextIcon';
import { PhotographIcon } from './icons/PhotographIcon';
import { VideoCameraIcon } from './icons/VideoCameraIcon';
import { ArrowPathIcon } from './icons/ArrowPathIcon';

interface HistoryProps {
  items: HistoryItem[];
  selectedId: string | null;
  onSelectItem: (id: string) => void;
  onReAnalyze: (text: string, source: string) => void;
}

const getThreatColor = (level: string) => {
    switch (level) {
        case 'Safe': return 'text-green-400';
        case 'Questionable': return 'text-yellow-400';
        case 'Dangerous': return 'text-red-400';
        default: return 'text-slate-400';
    }
};

const HistoryItemContent: React.FC<{ item: HistoryItem; onReAnalyze: (text: string, source: string) => void; }> = ({ item, onReAnalyze }) => {
    const handleReAnalyzeClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        onReAnalyze(item.userInput, item.inputType);
    };

    if (item.inputType === 'Image Analysis') {
        return (
            <div className="flex items-center gap-3">
                <img src={item.userInput} alt="Analyzed thumbnail" className="h-8 w-8 object-cover border-2 border-slate-700 flex-shrink-0" />
                <div className="flex-grow overflow-hidden">
                    <p className="text-sm font-semibold text-slate-200 flex items-center gap-2"><PhotographIcon className="h-4 w-4 text-slate-400 flex-shrink-0" /> Image Analysis</p>
                    <div className="text-xs text-slate-400 mt-1">
                        <span className={`font-semibold ${getThreatColor(item.report.threat_level)}`}>{item.report.threat_level}</span>
                    </div>
                </div>
            </div>
        );
    }

    let Icon;
    switch (item.inputType) {
        case 'URL': Icon = LinkIcon; break;
        case 'Video Link': Icon = VideoCameraIcon; break;
        default: Icon = FileTextIcon;
    }
    
    const canReAnalyze = !item.inputType.includes('File') && !item.inputType.includes('Document') && item.inputType !== 'Image Analysis';

    return (
        <div className="flex items-center gap-3 relative">
            <Icon className="h-5 w-5 text-slate-400 flex-shrink-0" />
            <div className="flex-grow overflow-hidden pr-8">
                <p className="text-sm font-semibold text-slate-200 truncate" title={item.userInput}>
                    {item.userInput}
                </p>
                <div className="text-xs text-slate-400 mt-1">
                    <span className="font-semibold">{item.inputType}</span> | <span className={`font-semibold ${getThreatColor(item.report.threat_level)}`}>{item.report.threat_level}</span>
                </div>
            </div>
             {canReAnalyze && (
                <button
                    onClick={handleReAnalyzeClick}
                    title="Re-analyze stream"
                    className="absolute top-1/2 right-0 transform -translate-y-1/2 p-1 text-slate-400 hover:text-cyan-400 rounded-full hover:bg-slate-700/50 transition-colors"
                >
                    <ArrowPathIcon className="h-4 w-4" />
                </button>
            )}
        </div>
    );
};

export const History: React.FC<HistoryProps> = ({ items, selectedId, onSelectItem, onReAnalyze }) => {
  return (
    <div className="panel p-4 lg:p-6 h-full">
      <h2 className="text-lg font-bold text-cyan-300 mb-4 flex items-center gap-2 uppercase tracking-wider">
        <HistoryIcon className="h-6 w-6" />
        Recent Logs
      </h2>
      {items.length === 0 ? (
        <div className="text-center text-slate-400 text-sm py-8">
            <p>// No analysis logs found.</p>
        </div>
      ) : (
        <ul className="space-y-2">
          {items.map((item) => {
            const isSelected = item.id === selectedId;
            return (
              <li key={item.id}>
                <button
                  onClick={() => onSelectItem(item.id)}
                  className={`w-full text-left p-3 border-l-4 transition-all duration-200 ${
                    isSelected
                      ? 'bg-cyan-500/20 border-cyan-400'
                      : 'bg-slate-800/50 border-transparent hover:bg-slate-700/50 hover:border-slate-500'
                  }`}
                >
                    <HistoryItemContent item={item} onReAnalyze={onReAnalyze} />
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};
