
export enum ThreatLevel {
  Safe = 'Safe',
  Questionable = 'Questionable',
  Dangerous = 'Dangerous',
  Unknown = 'Unknown',
}

export interface AnalysisReport {
  credibility_score: number;
  threat_level: ThreatLevel;
  analysis_summary: string;
  detailed_explanation: string;
  educational_tips: string[];
}

export interface HistoryItem {
  id: string;
  userInput: string;
  inputType: string;
  report: AnalysisReport;
}
