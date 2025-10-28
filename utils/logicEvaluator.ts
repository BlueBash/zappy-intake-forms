
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

// Parse complex conditions with AND/OR
const parseComplexCondition = (conditionStr: string): Array<{left: string, op: string, right: string} | {logic: 'AND' | 'OR'}> => {
    const andPattern = /\s+AND\s+/i;
    const orPattern = /\s+OR\s+/i;
    
    if (andPattern.test(conditionStr)) {
        const parts = conditionStr.split(andPattern);
        const result = [];
        for (let i = 0; i < parts.length; i++) {
            if (i > 0) result.push({ logic: 'AND' as const });
            const parsed = parseCondition(parts[i].trim());
            if (parsed) {
                result.push({ left: parsed[0], op: parsed[1], right: parsed[2] });
            }
        }
        return result;
    } else if (orPattern.test(conditionStr)) {
        const parts = conditionStr.split(orPattern);
        const result = [];
        for (let i = 0; i < parts.length; i++) {
            if (i > 0) result.push({ logic: 'OR' as const });
            const parsed = parseCondition(parts[i].trim());
            if (parsed) {
                result.push({ left: parsed[0], op: parsed[1], right: parsed[2] });
            }
        }
        return result;
    }
    
    // Single condition
    const parsed = parseCondition(conditionStr);
    return parsed ? [{ left: parsed[0], op: parsed[1], right: parsed[2] }] : [];
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

// Check a single atomic condition
const checkSingleCondition = (
    left: string,
    op: string,
    right: string,
    currentAnswer: any,
    allAnswers: Record<string, any>,
    calculations: Record<string, any>,
    flags: Set<string>
): boolean => {
    const leftVal = getValue(left, currentAnswer, allAnswers, calculations, flags);
    
    if (leftVal === undefined || leftVal === null) return false;

    try {
        switch (op) {
            case '==': {
                const rightVal = right.replace(/['"]/g, '');
                return String(leftVal) === rightVal;
            }
            case '!=': {
                const rightVal = right.replace(/['"]/g, '');
                return String(leftVal) !== rightVal;
            }
            case '<':
            case '>':
            case '<=':
            case '>=': {
                const numLeft = parseFloat(leftVal);
                const numRight = parseFloat(right);
                if (isNaN(numLeft) || isNaN(numRight)) return false;
                if (op === '<') return numLeft < numRight;
                if (op === '>') return numLeft > numRight;
                if (op === '<=') return numLeft <= numRight;
                if (op === '>=') return numLeft >= numRight;
                return false;
            }
            case 'contains': {
                if (!Array.isArray(leftVal)) return false;
                const rightVal = right.replace(/['"]/g, '');
                return leftVal.includes(rightVal);
            }
            case 'in': {
                // Ensure leftVal is a string for 'in' checks, as options are usually strings
                const leftValStr = String(leftVal);
                const arrVal = JSON.parse(right.replace(/'/g, '"'));
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

export const checkCondition = (
    conditionStr: string,
    currentAnswer: any,
    allAnswers: Record<string, any>,
    calculations: Record<string, any>,
    flags: Set<string>
): boolean => {
    // Check if it's a complex condition with AND/OR
    const isComplex = /\s+(AND|OR)\s+/i.test(conditionStr);
    
    if (!isComplex) {
        const parsed = parseCondition(conditionStr);
        if (!parsed) return false;
        return checkSingleCondition(parsed[0], parsed[1], parsed[2], currentAnswer, allAnswers, calculations, flags);
    }
    
    // Handle complex conditions with AND/OR
    const parts = parseComplexCondition(conditionStr);
    if (parts.length === 0) return false;
    
    let result = true;
    let lastLogic: 'AND' | 'OR' = 'AND';
    
    for (const part of parts) {
        if ('logic' in part) {
            lastLogic = part.logic;
        } else if ('left' in part) {
            const partResult = checkSingleCondition(part.left, part.op, part.right, currentAnswer, allAnswers, calculations, flags);
            
            if (lastLogic === 'AND') {
                result = result && partResult;
            } else {
                result = result || partResult;
            }
        }
    }
    
    return result;
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
