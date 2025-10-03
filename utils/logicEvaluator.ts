
import { NextLogic } from '../types';

const parseCondition = (conditionStr: string): [string, string, string] | null => {
    const operators = ['contains', 'in', '==', '<', '>', '<=', '>=', '!='];
    for (const op of operators) {
        const parts = conditionStr.split(` ${op} `);
        if (parts.length === 2) {
            return [parts[0].trim(), op, parts[1].trim()];
        }
    }
    return null;
};

const getValue = (key: string, currentAnswer: any, allAnswers: Record<string, any>, calculations: Record<string, any>, flags: Set<string>) => {
    if (key === 'answer') {
        return currentAnswer;
    }
    if (key.startsWith('calc.')) {
        return calculations[key.substring(5)];
    }
    if (key === 'flags') {
        return Array.from(flags); // Return as an array for the 'contains' operator
    }
    return allAnswers[key];
};

export const checkCondition = (
    conditionStr: string,
    currentAnswer: any,
    allAnswers: Record<string, any>,
    calculations: Record<string, any>,
    flags: Set<string>
): boolean => {
    const parsed = parseCondition(conditionStr);
    if (!parsed) return false;

    const [key, op, valueStr] = parsed;
    const leftVal = getValue(key, currentAnswer, allAnswers, calculations, flags);

    if (leftVal === undefined || leftVal === null) return false;

    try {
        switch (op) {
            case '==': {
                const rightVal = valueStr.replace(/['"]/g, '');
                return String(leftVal) === rightVal;
            }
            case '!=': {
                const rightVal = valueStr.replace(/['"]/g, '');
                return String(leftVal) !== rightVal;
            }
            case '<':
            case '>':
            case '<=':
            case '>=': {
                const numLeft = parseFloat(leftVal);
                const numRight = parseFloat(valueStr);
                if (isNaN(numLeft) || isNaN(numRight)) return false;
                if (op === '<') return numLeft < numRight;
                if (op === '>') return numLeft > numRight;
                if (op === '<=') return numLeft <= numRight;
                if (op === '>=') return numLeft >= numRight;
                return false;
            }
            case 'contains': {
                if (!Array.isArray(leftVal)) return false;
                const rightVal = valueStr.replace(/['"]/g, '');
                return leftVal.includes(rightVal);
            }
            case 'in': {
                // Ensure leftVal is a string for 'in' checks, as options are usually strings
                const leftValStr = String(leftVal);
                const arrVal = JSON.parse(valueStr.replace(/'/g, '"'));
                if (!Array.isArray(arrVal)) return false;
                return arrVal.includes(leftValStr);
            }
            default:
                return false;
        }
    } catch (e) {
        console.error("Error checking condition:", e);
        return false;
    }
};

export const evaluateLogic = (
    logic: NextLogic[],
    currentAnswer: any,
    allAnswers: Record<string, any>,
    calculations: Record<string, any>,
    flags: Set<string>
): string | undefined => {
    let elseGoTo: string | undefined = undefined;

    for (const rule of logic) {
        if (rule.if) {
            if (checkCondition(rule.if, currentAnswer, allAnswers, calculations, flags)) {
                return rule.go_to;
            }
        } else if (rule.else) {
            // Capture the else case but continue checking ifs.
            elseGoTo = rule.else;
        }
    }
    // If no 'if' condition was met, return the 'else' route if it exists.
    return elseGoTo;
};
