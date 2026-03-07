import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult, ModelType, TextSegment } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function analyzeText(text: string, model: ModelType, sensitivity: number = 50): Promise<AnalysisResult> {
  const response = await ai.models.generateContent({
    model: "gemini-3.1-pro-preview",
    contents: `You are a world-class Forensic Linguistic Expert specializing in AI-generated text detection. 
    Your task is to analyze the provided text and determine the likelihood of it being AI-generated versus human-written.
    
    DETECTION SENSITIVITY: ${sensitivity}% 
    (0% = Very Conservative, only flag if absolutely certain. 100% = Very Strict, flag even subtle patterns).

    CRITERIA FOR ANALYSIS:
    1. Perplexity: AI text often has lower perplexity (predictability).
    2. Burstiness: Human writing has high burstiness (varied sentence length and structure). AI is more uniform.
    3. Syntactic Patterns: AI often uses highly structured, repetitive grammatical patterns.
    4. Contextual Nuance: Humans use idioms, cultural references, and subtle emotional shifts more naturally.
    5. Error Patterns: Humans make "natural" typos or stylistic choices; AI errors are often logical or factual.

    Analyze the text segment by segment. For each segment, provide:
    - text: The segment content.
    - isAI: Boolean (true if likely AI).
    - confidence: 0-1 score.
    - explanation: Why you reached this conclusion based on the criteria above.

    Also provide overall metrics (0-1) for:
    - variability (Burstiness)
    - coherence (Logical flow)
    - repetition (Pattern frequency)
    - diversity (Vocabulary range)

    And provide the overall percentages:
    - aiPercentage: 0-100
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
