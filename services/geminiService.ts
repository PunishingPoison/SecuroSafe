
import { GoogleGenAI, Type } from "@google/genai";
import type { AnalysisReport } from '../types';
import { ThreatLevel } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    credibility_score: {
      type: Type.NUMBER,
      description: "A score from 0-100 representing credibility or safety. For URLs, this reflects trust. For text, factual accuracy. For images, authenticity. 100 is most credible/safe/authentic.",
    },
    threat_level: {
      type: Type.STRING,
      description: `The overall threat level. Must be one of: 'Safe', 'Questionable', 'Dangerous'.`,
      enum: [ThreatLevel.Safe, ThreatLevel.Questionable, ThreatLevel.Dangerous],
    },
    analysis_summary: {
      type: Type.STRING,
      description: "A concise, one-sentence summary of the analysis, mentioning if the image seems AI-generated or if the text is misleading.",
    },
    detailed_explanation: {
      type: Type.STRING,
      description: "A detailed breakdown of the findings. For URLs, mention domain reputation, phishing indicators. For text, mention bias, manipulative language. For images, explain indicators of AI generation or why the content is misleading.",
    },
    educational_tips: {
      type: Type.ARRAY,
      items: {
        type: Type.STRING,
      },
      description: "A list of actionable tips for users to identify similar threats, misinformation, or fake images in the future.",
    },
  },
  required: ["credibility_score", "threat_level", "analysis_summary", "detailed_explanation", "educational_tips"],
};

const callGemini = async (prompt: any): Promise<AnalysisReport> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      },
    });
    
    const jsonText = response.text.trim();
    const parsedJson = JSON.parse(jsonText);

    const validThreatLevels: string[] = Object.values(ThreatLevel);
    if (!validThreatLevels.includes(parsedJson.threat_level)) {
        console.warn(`Received invalid threat_level: ${parsedJson.threat_level}. Defaulting to Unknown.`);
        parsedJson.threat_level = ThreatLevel.Unknown;
    }
    
    return parsedJson as AnalysisReport;
  } catch (error) {
    console.error("Error analyzing content with Gemini:", error);
    throw new Error("Failed to get a valid analysis from the AI model.");
  }
};

export const isUrl = (text: string): boolean => {
    const trimmedText = text.trim();
    if (/\s/.test(trimmedText)) {
        return /^https?:\/\//.test(trimmedText);
    }
    try {
        const urlToTest = trimmedText.includes('://') ? trimmedText : `https://${trimmedText}`;
        const url = new URL(urlToTest);
        return url.hostname.includes('.') || url.hostname === 'localhost' || /^\d{1,3}(\.\d{1,3}){3}$/.test(url.hostname);
    } catch (_) {
        return false;
    }
};

export const isVideoUrl = (text: string): boolean => {
    if (!isUrl(text)) return false;
    try {
        const url = new URL(text.trim());
        const videoHosts = ['youtube.com', 'youtu.be', 'vimeo.com', 'dailymotion.com', 'twitch.tv'];
        return videoHosts.some(host => url.hostname === host || url.hostname.endsWith('.' + host));
    } catch (_) {
        return false;
    }
};

export const classifyInput = (text: string): string => {
    if (isVideoUrl(text)) return 'Video Link';
    if (isUrl(text)) return 'URL';
    return 'Plain Text';
};

export async function analyzeContent(userInput: string): Promise<AnalysisReport> {
  const inputType = classifyInput(userInput);
  let promptText = '';

  switch (inputType) {
    case 'Video Link':
      promptText = `You are a media literacy and fact-checking expert. The user has provided a link to a video. Analyze the video's URL and title for signs of misinformation, clickbait, emotional manipulation, propaganda techniques, or conspiracy framing. Assess the likely credibility of the source platform and channel if possible. Provide a detailed report in the specified JSON format. Video Link: "${userInput}"`;
      break;
    case 'URL':
      promptText = `You are a cybersecurity analyst. Analyze the following URL for security threats. Check for phishing indicators, malware potential, scam history, and domain reputation. Provide a detailed report in the specified JSON format. URL: "${userInput}"`;
      break;
    case 'Plain Text':
    default:
      promptText = `You are a fact-checking expert. Analyze the following text for credibility, misinformation, and bias. Assess manipulative language, factual accuracy, and emotional triggers. Provide a detailed report in the specified JSON format. Content: "${userInput}"`;
  }

  return callGemini(promptText);
}

export async function analyzeImage(imageDataUri: string, mimeType: string): Promise<AnalysisReport> {
  const base64Data = imageDataUri.split(',')[1];
  
  const imagePart = {
    inlineData: {
      mimeType: mimeType,
      data: base64Data,
    },
  };

  const textPart = {
    text: `You are a visual analyst and fact-checking expert. Analyze this image.
1.  Determine if the image is authentic or likely AI-generated. Look for artifacts, inconsistencies, or hallmarks of generative models.
2.  Analyze the image's content for misinformation. If there is text, fact-check it. If it depicts an event, assess its context and authenticity.
3.  Provide a comprehensive report in the specified JSON format, focusing on visual analysis and fact-checking.`,
  };

  const prompt = { parts: [imagePart, textPart] };

  return callGemini(prompt);
}
