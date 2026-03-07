export enum ModelType {
  ROBERTA = 'RoBERTa (Optimized)',
  GPT4 = 'OpenAI GPT-4o',
  GEMINI = 'Google Gemini Pro',
  HUGGINGFACE = 'Hugging Face Ensemble'
}

export interface TextSegment {
  text: string;
  isAI: boolean;
  confidence: number;
  explanation: string;
}

export interface AnalysisResult {
  id: string;
  timestamp: number;
  inputText: string;
  modelUsed: ModelType;
  sensitivity: number;
  segments: TextSegment[];
  aiPercentage: number;
  humanPercentage: number;
  overallConfidence: number;
  metrics: {
    variability: number;
    coherence: number;
    repetition: number;
    diversity: number;
  };
}

export interface SystemLog {
  id: string;
  timestamp: number;
  level: 'info' | 'success' | 'warning' | 'error';
  message: string;
}

export type ViewType = 'home' | 'detection' | 'models' | 'workflow' | 'history' | 'logs' | 'stats';
