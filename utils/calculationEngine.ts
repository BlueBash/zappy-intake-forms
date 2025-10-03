
import { Calculation } from '../types';

const evaluateFormula = (formula: string, answers: Record<string, any>): number | null => {
  try {
    const variableNames = Object.keys(answers).filter(key => {
      const value = answers[key];
      if (value === null || value === undefined || value === '') return false;
      return typeof value === 'number' || !isNaN(parseFloat(value));
    });

    let sanitizedFormula = formula;
    const args: number[] = [];

    variableNames.forEach(name => {
      const regex = new RegExp(`\\b${name}\\b`, 'g');
      if (regex.test(sanitizedFormula)) {
        sanitizedFormula = sanitizedFormula.replace(regex, `args[${args.length}]`);
        args.push(parseFloat(answers[name]));
      }
    });

    // Check for any remaining letters which would indicate an unresolved variable.
    // First, remove the "args[...]" pattern so it isn't flagged as an unresolved variable.
    const formulaWithoutArgs = sanitizedFormula.replace(/args\[\d+\]/g, '');
    
    if (/[a-zA-Z]/.test(formulaWithoutArgs)) {
        // This can happen if a field is not yet filled, which is not an error state.
        // console.error("Formula contains unresolved variables:", sanitizedFormula);
        return null;
    }

    const func = new Function('args', `return ${sanitizedFormula}`);
    const result = func(args);

    return isFinite(result) ? parseFloat(result.toFixed(2)) : null;
  } catch (error) {
    console.error(`Error evaluating formula "${formula}":`, error);
    return null;
  }
};


export const performCalculations = (
  calculations: Calculation[],
  answers: Record<string, any>
): Record<string, number | null> => {
  const results: Record<string, number | null> = {};
  calculations.forEach(({ id, formula }) => {
    results[id] = evaluateFormula(formula, answers);
  });
  return results;
};
