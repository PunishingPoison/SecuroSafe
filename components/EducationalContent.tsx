import React from 'react';
import { BookOpenIcon } from './icons/BookOpenIcon';
import { CheckCircleIcon } from './icons/CheckCircleIcon';

const WelcomeTip: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="border-l-2 border-cyan-500/50 pl-4">
        <h4 className="font-semibold text-cyan-300">{title}</h4>
        <p className="text-sm text-slate-400 mt-1">{children}</p>
    </div>
);

export const EducationalContent: React.FC = () => {
    return (
        <div className="panel p-6 animate-fade-in">
            <div className="flex items-center gap-3 mb-6">
                <BookOpenIcon className="h-8 w-8 text-cyan-400" />
                <div>
                    <h2 className="text-xl font-bold text-cyan-300 text-glow uppercase tracking-wider">System Directive</h2>
                    <p className="text-slate-400">// Initializing Threat Analysis Protocol</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <WelcomeTip title="[1] Verify Source Integrity">
                    Investigate the data source's reputation. Does the domain have a history of reliable transmissions? Query for an 'About Us' section.
                </WelcomeTip>
                <WelcomeTip title="[2] Scan for Emotional Payloads">
                    Be aware of emotionally charged language or sensationalist headers. These are indicators of bias or manipulation packets.
                </WelcomeTip>
                <WelcomeTip title="[3] Triangulate Data Streams">
                    Do not rely on a single data stream. Cross-reference the information with other trusted nodes in the network.
                </WelcomeTip>
                <WelcomeTip title="[4] Detect Phishing Vectors">
                    Never execute suspicious links or input credentials on unverified nodes. Check URLs for character deviations.
                </WelcomeTip>
            </div>
        </div>
    );
}
