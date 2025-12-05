export interface DecisionFactors {
  time: number;   // 1-5
  money: number;  // 1-5
  risk: number;   // 1-5
  energy: number; // 1-5
  upside: number; // 1-5
}

export type Leaning = 'YES' | 'NO' | null;

export interface DecisionInput {
  question: string;
  context: string;
  factors: DecisionFactors;
  leaning: Leaning;
}

export interface DecisionResult {
  recommendation: 'YES' | 'NO';
  primaryDriver: string;
  upsideSnapshot: string[];
  downsideSnapshot: string[];
  secondOrderEffect: string;
  simpleRule: string;
  scoreBenefit: number;
  scoreCost: number;
  reasoning: string;
  timestamp: string;
  originalQuestion: string;
}

export interface HistoryItem {
  id: string;
  question: string;
  timestamp: string;
  recommendation: 'YES' | 'NO';
  fullResult: DecisionResult;
}

export const FACTOR_LABELS: Record<string, string> = {
  time: "Time Required",
  money: "Money Impact",
  risk: "Risk / Uncertainty",
  energy: "Energy / Stress",
  upside: "Long-term Upside"
};