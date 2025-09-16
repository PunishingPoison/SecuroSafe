import React, { useState, useRef } from 'react';
import { SearchIcon } from './icons/SearchIcon';
import { LoaderIcon } from './icons/LoaderIcon';
import { UploadIcon } from './icons/UploadIcon';
import { CameraIcon } from './icons/CameraIcon';
import { classifyInput } from '../services/geminiService';

declare var mammoth: any;
declare var pdfjsLib: any;

const readTextFile = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => resolve(event.target?.result as string);
        reader.onerror = () => reject(new Error("Error reading text file stream."));
        reader.readAsText(file);
    });
};

const readPdfFile = async (file: File): Promise<string> => {
    if (typeof (window as any).pdfjsLib === 'undefined') {
        throw new Error('PDF parsing module not loaded.');
    }
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await (window as any).pdfjsLib.getDocument(arrayBuffer).promise;
    let fullText = '';
    for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        fullText += textContent.items.map((item: any) => item.str).join(' ') + '\n';
    }
    return fullText;
};

const readDocxFile = async (file: File): Promise<string> => {
    if (typeof mammoth === 'undefined') {
        throw new Error('DOCX processing module not loaded.');
    }
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value;
};

const readFileContent = async (file: File): Promise<string> => {
    const extension = file.name.split('.').pop()?.toLowerCase();
    if (file.type === 'text/plain' || extension === 'txt') return readTextFile(file);
    if (file.type === 'application/pdf' || extension === 'pdf') return readPdfFile(file);
    if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || extension === 'docx') return readDocxFile(file);
    throw new Error(`// Unsupported filetype: "${file.type || extension}". Please use .txt, .pdf, or .docx.`);
};

interface InputFormProps {
  onAnalyze: (text: string, source: string) => void;
  onAnalyzeImage: (imageDataUri: string, mimeType: string) => void;
  isLoading: boolean;
}

const CustomButton: React.FC<{ onClick?: () => void; type?: "button" | "submit" | "reset"; disabled: boolean; children: React.ReactNode; }> = ({ onClick, type = "button", disabled, children }) => (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className="w-full flex items-center justify-center gap-2 bg-cyan-500/10 text-cyan-300 font-bold py-3 px-4 border border-cyan-500/30 hover:bg-cyan-500/20 hover:text-cyan-200 hover:shadow-[0_0_15px_rgba(56,189,248,0.3)] disabled:bg-slate-700/20 disabled:text-slate-500 disabled:border-slate-600 disabled:cursor-not-allowed transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-cyan-500"
    >
        {children}
    </button>
);


export const InputForm: React.FC<InputFormProps> = ({ onAnalyze, onAnalyzeImage, isLoading }) => {
  const [text, setText] = useState<string>('');
  const [isProcessingFile, setIsProcessingFile] = useState<boolean>(false);
  const [fileError, setFileError] = useState<string | null>(null);
  const docFileInputRef = useRef<HTMLInputElement>(null);
  const imageFileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const sourceType = classifyInput(text);
    onAnalyze(text, sourceType);
  };

  const handleDocFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      setIsProcessingFile(true);
      setFileError(null);
      setText(`// Processing file: ${file.name}`);

      try {
          const content = await readFileContent(file);
          setText(content);
          let sourceType = 'Uploaded File';
          const extension = file.name.split('.').pop()?.toLowerCase();
          if (extension === 'pdf') sourceType = 'PDF File';
          else if (extension === 'docx') sourceType = 'Word Document';
          else if (extension === 'txt') sourceType = 'Text File';
          onAnalyze(content, sourceType);
      } catch (error) {
          const message = error instanceof Error ? error.message : 'An unknown error occurred.';
          setFileError(message);
      } finally {
          setIsProcessingFile(false);
          if (event.target) event.target.value = '';
      }
  };

  const handleImageFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      if (file.size > 4 * 1024 * 1024) {
          setFileError("// Error: Image file size exceeds 4MB limit.");
          if (event.target) event.target.value = '';
          return;
      }

      setIsProcessingFile(true);
      setFileError(null);
      setText(`// Processing image stream: ${file.name}`);

      const reader = new FileReader();
      reader.onloadend = () => {
          onAnalyzeImage(reader.result as string, file.type);
          setIsProcessingFile(false);
          setText(''); // Clear text after passing to handler
      };
      reader.onerror = () => {
          setFileError("// Error: Failed to read image data stream.");
          setIsProcessingFile(false);
      };
      reader.readAsDataURL(file);

      if (event.target) event.target.value = '';
  };


  return (
    <div className="panel p-6">
      <form onSubmit={handleSubmit}>
        <label htmlFor="content-input" className="block text-lg font-semibold mb-2 text-cyan-300">
          &gt; Analysis Input Terminal
        </label>
        <textarea
          id="content-input"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Input data stream (URL, text, etc.) or select an option below..."
          className="w-full h-32 p-3 bg-black/30 border-2 border-cyan-500/30 rounded-none focus:ring-2 focus:ring-cyan-500 focus:outline-none focus:border-cyan-500 transition-all duration-300 text-cyan-300 placeholder-slate-500"
          disabled={isLoading || isProcessingFile}
        />
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <CustomButton type="submit" disabled={isLoading || isProcessingFile || !text.trim()}>
              {isLoading && !isProcessingFile ? ( <><LoaderIcon className="animate-spin h-5 w-5" />Analyzing...</> ) : ( <><SearchIcon className="h-5 w-5" />Analyze Stream</> )}
            </CustomButton>
            
            <input type="file" ref={docFileInputRef} onChange={handleDocFileChange} className="hidden" accept=".txt,.pdf,.docx" disabled={isLoading || isProcessingFile} />
            <CustomButton onClick={() => docFileInputRef.current?.click()} disabled={isLoading || isProcessingFile}>
                {isProcessingFile ? ( <><LoaderIcon className="animate-spin h-5 w-5" />Processing...</> ) : ( <><UploadIcon className="h-5 w-5" />Upload Document</> )}
            </CustomButton>
            
            <input type="file" ref={imageFileInputRef} onChange={handleImageFileChange} className="hidden" accept="image/*" capture="environment" disabled={isLoading || isProcessingFile} />
            <CustomButton onClick={() => imageFileInputRef.current?.click()} disabled={isLoading || isProcessingFile}>
                {isProcessingFile ? ( <><LoaderIcon className="animate-spin h-5 w-5" />Processing...</> ) : ( <><CameraIcon className="h-5 w-5" />Analyze Image</> )}
            </CustomButton>
        </div>
        {fileError && <p className="text-red-400 text-sm mt-3 text-center font-semibold">{fileError}</p>}
      </form>
    </div>
  );
};
