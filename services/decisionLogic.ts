import { DecisionInput, DecisionResult, FACTOR_LABELS } from '../types';

export const calculateDecision = (input: DecisionInput): DecisionResult => {
  const { factors, leaning, context } = input;

  // 1. Determine Primary Driver
  // Priority order for ties: upside > risk > time > money > energy
  const priorityOrder = ['upside', 'risk', 'time', 'money', 'energy'];
  let maxScore = -1;
  let primaryKey = 'upside';

  // Find max value first
  Object.entries(factors).forEach(([key, value]) => {
    if (value > maxScore) {
      maxScore = value;
    }
  });

  // Apply tie-breaking
  for (const key of priorityOrder) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((factors as any)[key] === maxScore) {
      primaryKey = key;
      break;
    }
  }

  const primaryDriverName = FACTOR_LABELS[primaryKey];

  // 2. Snapshots
  const upsideSnapshot: string[] = [];
  const downsideSnapshot: string[] = [];

  // Upside Logic
  if (factors.upside >= 4 && leaning === 'YES') {
    upsideSnapshot.push("High long-term potential aligns with your gut feeling.");
  }
  if (factors.money >= 4) {
    const ctxLower = context.toLowerCase();
    if (ctxLower.includes('salary') || ctxLower.includes('fee') || ctxLower.includes('cost') || ctxLower.includes('money')) {
      upsideSnapshot.push("Financial implications are a major factor here.");
    } else {
      upsideSnapshot.push("Significant financial impact detected.");
    }
  }
  if (upsideSnapshot.length === 0) upsideSnapshot.push("Standard benefits apply.");

  // Downside Logic
  if (factors.time >= 4) {
    downsideSnapshot.push("Heavy time commitment required.");
  }
  if (factors.energy >= 4) {
    downsideSnapshot.push("High risk of burnout or stress.");
  }
  if (factors.risk >= 4) {
    downsideSnapshot.push("Substantial uncertainty involved.");
  }
  if (downsideSnapshot.length === 0) downsideSnapshot.push("No extreme red flags.");

  // 3. Second Order Effect
  // "If you choose YES, the main thing that grows is [primary driver]."
  // Or context aware:
  let secondOrderEffect = "";
  if (['upside', 'money'].includes(primaryKey)) {
     secondOrderEffect = `If you choose YES, you primarily maximize ${primaryDriverName}.`;
  } else {
     secondOrderEffect = `If you choose NO, you primarily avoid the cost of ${primaryDriverName}.`;
  }

  // 4. Simple Rule
  let simpleRule = "";
  const benefitTotal = factors.upside + factors.money;
  const costTotal = factors.time + factors.energy + factors.risk;

  if (factors.upside > factors.time) {
    simpleRule = "Since Long-term Upside > Time Cost, favor YES.";
  } else if (factors.risk > factors.upside) {
    simpleRule = "Since Risk > Long-term Upside, favor NO.";
  } else if (benefitTotal > costTotal) {
    simpleRule = "Overall benefits outweigh the costs.";
  } else {
    simpleRule = "Overall costs outweigh the benefits.";
  }

  // 5. Final Calculation
  // benefit_score = long_term_upside_importance * 2 + money_importance
  // cost_score = time_importance + energy_importance + risk_importance
  let benefitScore = (factors.upside * 2) + factors.money;
  let costScore = factors.time + factors.energy + factors.risk;

  // Adjust for leaning
  let gutBonus = 0;
  if (leaning === 'YES') {
    benefitScore += 2; 
    gutBonus = 2;
  }
  if (leaning === 'NO') {
    costScore += 2;
    gutBonus = 2;
  }

  const recommendation = benefitScore >= costScore ? 'YES' : 'NO';

  // 6. Detailed Reasoning
  const diff = Math.abs(benefitScore - costScore);
  const strength = diff > 4 ? "strongly" : diff > 2 ? "moderately" : "marginally";
  
  const reasoning = `Based on a weighted score of ${benefitScore} (Pros) vs ${costScore} (Cons). The most critical factor was ${primaryDriverName} (Rated ${maxScore}/5). ${leaning ? `Your initial gut feeling to lean ${leaning} added ${gutBonus} points to that side.` : 'No initial bias was factored in.'}`;

  return {
    recommendation,
    primaryDriver: primaryDriverName,
    upsideSnapshot,
    downsideSnapshot,
    secondOrderEffect,
    simpleRule,
    scoreBenefit: benefitScore,
    scoreCost: costScore,
    reasoning,
    timestamp: new Date().toLocaleString(),
    originalQuestion: input.question
  };
};