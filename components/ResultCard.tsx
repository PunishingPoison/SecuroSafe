import React, { useState, useEffect } from 'react';
import type { AnalysisReport } from '../types';
import { ScoreBadge } from './ScoreBadge';
import { ThreatLevelBadge } from './ThreatLevelBadge';
import { ChevronDownIcon } from './icons/ChevronDownIcon';
import { InfoIcon } from './icons/InfoIcon';
import { LightbulbIcon } from './icons/LightbulbIcon';
import { ClipboardCopyIcon } from './icons/ClipboardCopyIcon';
import { CheckCircleIcon } from './icons/CheckCircleIcon';


interface ResultCardProps {
  report: AnalysisReport;
  inputType: string;
}

const Section: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode; isOpen?: boolean; onToggle?: () => void; }> = ({ title, icon, children, isOpen, onToggle }) => (
    <div className="border border-cyan-500/20 bg-black/20 p-4 mt-4">
        <button
          onClick={onToggle}
          disabled={!onToggle}
          className={`w-full flex justify-between items-center text-left font-semibold text-cyan-300 ${onToggle ? '' : 'cursor-default'}`}
        >
          <div className="flex items-center gap-2">
            {icon}
            <span className="uppercase tracking-wider">{title}</span>
          </div>
          {onToggle && (
            <ChevronDownIcon
              className={`h-6 w-6 transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
            />
          )}
        </button>
        {(!onToggle || isOpen) && (
          <div className="mt-4 pl-7 text-slate-300 prose prose-invert prose-p:text-slate-300 animate-fade-in-down">
             {children}
          </div>
        )}
    </div>
);


export const ResultCard: React.FC<ResultCardProps> = ({ report, inputType }) => {
  const [isDetailsOpen, setIsDetailsOpen] = useState(true);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    setIsCopied(false);
  }, [report]);

  const handleCopy = () => {
    const reportText = `
// AI ANALYSIS REPORT
// INPUT_TYPE: ${inputType}
---------------------------------
[+] CREDIBILITY_SCORE: ${report.credibility_score}/100
[+] THREAT_LEVEL: ${report.threat_level}
[+] SUMMARY: ${report.analysis_summary}
---------------------------------
[+] DETAILS: ${report.detailed_explanation}
---------------------------------
[+] INTEL_TIPS:
${report.educational_tips.map(tip => `    - ${tip}`).join('\n')}
    `.trim().replace(/^\s+/gm, '');

    navigator.clipboard.writeText(reportText).then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2500);
    });
  };

  return (
    <div className="panel p-6 animate-fade-in relative">
      <button 
          onClick={handleCopy}
          title="Copy report to clipboard"
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-cyan-400 bg-slate-900/50 border border-cyan-500/20 rounded-none transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-500"
      >
          {isCopied ? <CheckCircleIcon className="h-5 w-5 text-green-400" /> : <ClipboardCopyIcon className="h-5 w-5" />}
      </button>

      <div className="mb-6">
        <h2 className="text-xl font-bold text-cyan-300 text-glow uppercase tracking-widest">Analysis Report</h2>
        <p className="text-sm font-semibold text-cyan-400 mb-2">// {inputType} Stream Analyzed</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <ScoreBadge score={report.credibility_score} />
        <ThreatLevelBadge level={report.threat_level} />
      </div>

      <div className="border border-cyan-500/20 bg-black/20 p-4">
        <p className="text-slate-300"><span className="text-cyan-400 font-semibold">&gt; Summary:</span> {report.analysis_summary}</p>
      </div>


      <Section 
        title="Detailed Explanation" 
        icon={<InfoIcon className="h-5 w-5" />} 
        isOpen={isDetailsOpen}
        onToggle={() => setIsDetailsOpen(!isDetailsOpen)}
      >
        <p>{report.detailed_explanation}</p>
      </Section>

      <Section 
        title="Intel & Tips" 
        icon={<LightbulbIcon className="h-5 w-5 text-yellow-300" />}
      >
        <ul className="space-y-2 list-inside">
          {report.educational_tips.map((tip, index) => (
            <li key={index} className="flex items-start">
              <span className="text-cyan-400 mr-2 font-bold">&gt;</span>
              <span className="text-slate-300">{tip}</span>
            </li>
          ))}
        </ul>
      </Section>
    </div>
  );
};

const style = document.createElement('style');
style.innerHTML = `
  @keyframes fade-in {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-fade-in {
    animation: fade-in 0.5s ease-out forwards;
  }
  @keyframes fade-in-down {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-fade-in-down {
    animation: fade-in-down 0.3s ease-out forwards;
  }
`;
document.head.appendChild(style);
