import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { InputForm } from './components/InputForm';
import { ResultCard } from './components/ResultCard';
import { Loader } from './components/Loader';
import { EducationalContent } from './components/EducationalContent';
import { History } from './components/History';
import type { AnalysisReport, HistoryItem } from './types';
import { analyzeContent, analyzeImage } from './services/geminiService';

const HISTORY_STORAGE_KEY = 'securo-safe-history';

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>('Analyzing Content...');
  const [analysisResult, setAnalysisResult] = useState<AnalysisReport | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showWelcome, setShowWelcome] = useState<boolean>(true);
  const [inputType, setInputType] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [selectedHistoryId, setSelectedHistoryId] = useState<string | null>(null);

  useEffect(() => {
    try {
      const storedHistory = localStorage.getItem(HISTORY_STORAGE_KEY);
      if (storedHistory) {
        setHistory(JSON.parse(storedHistory));
      }
    } catch (error) {
      console.error("Failed to load history from localStorage", error);
      localStorage.removeItem(HISTORY_STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history));
    } catch (error) {
      console.error("Failed to save history to localStorage", error);
    }
  }, [history]);


  const startAnalysis = (type: string, message: string) => {
    setInputType(type);
    setIsLoading(true);
    setLoadingMessage(message);
    setError(null);
    setAnalysisResult(null);
    setShowWelcome(false);
    setSelectedHistoryId(null);
  };

  const handleAnalysis = async (inputText: string, source: string) => {
    if (!inputText.trim()) {
      setError('// Error: Input stream is empty. Please provide content to analyze.');
      return;
    }
    startAnalysis(source, 'Executing Analysis...');

    try {
      const result = await analyzeContent(inputText);
      setAnalysisResult(result);
      
      const newHistoryItem: HistoryItem = {
        id: new Date().toISOString() + Math.random(),
        userInput: inputText,
        inputType: source,
        report: result,
      };
      setHistory(prevHistory => [newHistoryItem, ...prevHistory.slice(0, 4)]);
      setSelectedHistoryId(newHistoryItem.id);

    } catch (err) {
      console.error(err);
      setError('// Error: AI model connection failed. The core matrix may be overloaded. Retry transmission.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageAnalysis = async (imageDataUri: string, mimeType: string) => {
    startAnalysis('Image Analysis', 'Processing Visual Data...');

    try {
      const result = await analyzeImage(imageDataUri, mimeType);
      setAnalysisResult(result);

      const newHistoryItem: HistoryItem = {
        id: new Date().toISOString() + Math.random(),
        userInput: imageDataUri, // Store the full data URI for the thumbnail
        inputType: 'Image Analysis',
        report: result,
      };
      setHistory(prevHistory => [newHistoryItem, ...prevHistory.slice(0, 4)]);
      setSelectedHistoryId(newHistoryItem.id);

    } catch (err) {
      console.error(err);
      setError('// Error: Image analysis failed. Ensure data stream is clear and retry.');
    } finally {
      setIsLoading(false);
    }
  };


  const handleSelectHistoryItem = (id: string) => {
    const selectedItem = history.find(item => item.id === id);
    if (selectedItem) {
        setAnalysisResult(selectedItem.report);
        setInputType(selectedItem.inputType);
        setSelectedHistoryId(selectedItem.id);
        setShowWelcome(false);
        setError(null);
        setIsLoading(false);
    }
  };


  return (
    <div className="min-h-screen font-mono text-slate-300 flex flex-col items-center p-4">
      <div 
        className="w-full max-w-7xl mx-auto p-4 md:p-8 border-2 border-cyan-500/30 shadow-[0_0_20px_rgba(0,255,255,0.2)]"
        style={{
            background: 'radial-gradient(ellipse at top, rgba(14, 165, 233, 0.1), transparent 60%), radial-gradient(ellipse at bottom, rgba(56, 189, 248, 0.1), transparent 70%)',
            backgroundColor: 'rgba(15, 23, 42, 0.7)',
            backdropFilter: 'blur(8px)'
        }}
      >
        <Header />
        <main>
          <InputForm onAnalyze={handleAnalysis} onAnalyzeImage={handleImageAnalysis} isLoading={isLoading} />

          <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="min-h-[400px]">
                {isLoading && <Loader message={loadingMessage} />}
                {error && <div className="text-center text-red-400 border border-red-500/30 bg-red-900/20 p-4 font-semibold">{error}</div>}
                {analysisResult && inputType && <ResultCard report={analysisResult} inputType={inputType} />}
                {showWelcome && !isLoading && !error && !analysisResult && <EducationalContent />}
              </div>
            </div>

            <div className="lg:col-span-1">
               <History 
                  items={history}
                  selectedId={selectedHistoryId}
                  onSelectItem={handleSelectHistoryItem}
                  onReAnalyze={handleAnalysis}
               />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;