import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult, ModelType, TextSegment } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function analyzeText(text: string, model: ModelType, sensitivity: number = 50): Promise<AnalysisResult> {
  const response = await ai.models.generateContent({
    model: "gemini-3.1-pro-preview",
    contents: `You are a world-class Forensic Linguistic Expert specializing in AI-generated text detection. 
    Your task is to perform a deep forensic analysis of the provided text to determine if it is AI-generated or human-written.
    
    DETECTION SENSITIVITY: ${sensitivity}% 
    (0% = Very Conservative, only flag if absolutely certain. 100% = Very Strict, flag even subtle patterns).
    At higher sensitivity, you should be more suspicious of "synthetic perfection".

    AI FINGERPRINTS TO LOOK FOR:
    1. Synthetic Perfection: Flawless grammar and syntax that lacks the "messiness" or idiosyncratic rhythm of human thought.
    2. Low Perplexity: Highly predictable word choices and transitions.
    3. Low Burstiness: Uniform sentence lengths and structures. AI tends to have a "steady" beat, whereas humans have "bursts" of complexity followed by simplicity.
    4. Hedging & Transition Overuse: Frequent use of phrases like "It is important to note," "On the other hand," "In conclusion," and "Furthermore" in a way that feels mechanical.
    5. Lack of Subjective Experience: Absence of genuine personal anecdotes, unique sensory details, or non-obvious emotional connections.
    6. Neutrality Bias: An overly balanced, objective, or "safe" tone that avoids strong, idiosyncratic opinions or unconventional phrasing.

    HUMAN MARKERS:
    1. High Burstiness: Unpredictable shifts in sentence complexity.
    2. Idiosyncratic Voice: Unique metaphors, non-standard but effective grammar, and personal "flair".
    3. Contextual Deep-Dives: Specific, non-generic references that require deep lived experience.

    Analyze the text segment by segment. For each segment, provide:
    - text: The segment content.
    - isAI: Boolean. Be critical. If sensitivity is high, flag segments that show even subtle AI-like "smoothness".
    - confidence: 0-1 score.
    - explanation: A specific forensic reason (e.g., "Shows low burstiness and mechanical transition usage").

    Also provide overall metrics (0-1) for:
    - variability (Burstiness/Sentence variety)
    - coherence (Logical flow - AI is often 1.0)
    - repetition (Pattern frequency)
    - diversity (Vocabulary range)

    And provide the overall percentages:
    - aiPercentage: 0-100 (Weighted by segment confidence and sensitivity)
    - humanPercentage: 0-100

    Text to analyze:
    ${text}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          segments: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                text: { type: Type.STRING },
                isAI: { type: Type.BOOLEAN },
                confidence: { type: Type.NUMBER },
                explanation: { type: Type.STRING }
              },
              required: ["text", "isAI", "confidence", "explanation"]
            }
          },
          metrics: {
            type: Type.OBJECT,
            properties: {
              variability: { type: Type.NUMBER },
              coherence: { type: Type.NUMBER },
              repetition: { type: Type.NUMBER },
              diversity: { type: Type.NUMBER }
            },
            required: ["variability", "coherence", "repetition", "diversity"]
          },
          aiPercentage: { type: Type.NUMBER },
          humanPercentage: { type: Type.NUMBER }
        },
        required: ["segments", "metrics", "aiPercentage", "humanPercentage"]
      }
    }
  });

  const data = JSON.parse(response.text || "{}");
  
  const totalSegments = data.segments.length;
  const overallConfidence = data.segments.reduce((acc: number, s: any) => acc + s.confidence, 0) / totalSegments;

  return {
    id: crypto.randomUUID(),
    timestamp: Date.now(),
    inputText: text,
    modelUsed: model,
    sensitivity,
    segments: data.segments,
    aiPercentage: data.aiPercentage,
    humanPercentage: data.humanPercentage,
    overallConfidence: Math.round(overallConfidence * 100),
    metrics: data.metrics
  };
}
