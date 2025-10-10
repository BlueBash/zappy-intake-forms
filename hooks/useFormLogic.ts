
import { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { FormConfig, Screen, EligibilityRule } from '../types';
import { evaluateLogic, checkCondition } from '../utils/logicEvaluator';
import { performCalculations } from '../utils/calculationEngine';

export const useFormLogic = (config: FormConfig) => {
  const [currentScreenId, setCurrentScreenId] = useState<string>(config.screens[0].id);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const answersRef = useRef<Record<string, any>>({});
  const [calculations, setCalculations] = useState<Record<string, number | null>>({});
  const [history, setHistory] = useState<string[]>([]);
  const [direction, setDirection] = useState(1);
  const [returnTo, setReturnTo] = useState<string | null>(null);
  const [flags, setFlags] = useState<Set<string>>(new Set());

  useEffect(() => {
    setCurrentScreenId(config.screens[0].id);
    setAnswers({});
    answersRef.current = {};
    setCalculations({});
    setHistory([]);
    setDirection(1);
    setReturnTo(null);
    setFlags(new Set());
  }, [config]);
  
  const screenMap = useMemo(() => {
    const map = new Map<string, Screen>();
    config.screens.forEach(screen => map.set(screen.id, screen));
    return map;
  }, [config.screens]);

  const currentScreen = screenMap.get(currentScreenId) as Screen;

  const updateAnswer = useCallback((id: string, value: any) => {
    setAnswers(prev => {
      const next = { ...prev, [id]: value };
      answersRef.current = next;
      return next;
    });
  }, []);

  useEffect(() => {
    answersRef.current = answers;
  }, [answers]);

  const goToScreen = useCallback((screenId: string) => {
    if (screenMap.has(screenId)) {
        setDirection(1); 
        setReturnTo(currentScreenId);
        setCurrentScreenId(screenId);
    } else {
        console.warn(`Attempted to navigate to non-existent screen: ${screenId}`);
    }
  }, [currentScreenId, screenMap]);

  const processEligibilityRules = useCallback((
    rules: EligibilityRule[],
    currentAnswers: Record<string, any>,
    currentCalculations: Record<string, any>,
    currentFlags: Set<string>
  ): Set<string> => {
    const newFlags = new Set(currentFlags);
    for (const rule of rules) {
      // The `checkCondition` function is versatile; we can use it here.
      // We pass `null` for `currentAnswer` because these rules are global, not tied to the current screen's answer.
      if (checkCondition(rule.if, null, currentAnswers, currentCalculations, newFlags)) {
        newFlags.add(rule.action);
      }
    }
    return newFlags;
  }, []);

  const goToNext = useCallback(() => {
    setDirection(1);
    if (returnTo) {
        const returnScreenId = returnTo;
        setReturnTo(null);
        setCurrentScreenId(returnScreenId);
        return;
    }

    const latestAnswers = answersRef.current;
    const screen = screenMap.get(currentScreenId);
    if (!screen) return;

    // Perform calculations if any
    let newCalculations = calculations;
    if (screen.calculations) {
      const calculatedValues = performCalculations(screen.calculations, latestAnswers);
      newCalculations = { ...calculations, ...calculatedValues };
      setCalculations(newCalculations);
    }
    
    // Process eligibility rules and update flags
    const newFlags = processEligibilityRules(config.eligibility_rules, latestAnswers, newCalculations, flags);
    setFlags(newFlags);

    // Determine next screen
    let nextId: string | undefined = undefined;

    if (screen.next_logic) {
      const fieldId = (screen as any).field_id;
      const answerKey = fieldId || screen.id;
      const currentAnswer = latestAnswers[answerKey];
      nextId = evaluateLogic(screen.next_logic, currentAnswer, latestAnswers, newCalculations, newFlags);
    } 
    
    // FIX: Removed deprecated logic that checked for `cta_primary.go_to`, which does not exist on the Cta type.
    if (!nextId && screen.next) {
      nextId = screen.next;
    }

    if (nextId && screenMap.has(nextId)) {
      setHistory(prev => [...prev, currentScreenId]);
      setCurrentScreenId(nextId);
    } else {
      console.warn(`No valid next screen found for ${currentScreenId}`);
    }
  }, [currentScreenId, calculations, screenMap, returnTo, flags, config.eligibility_rules, processEligibilityRules]);

  const goToPrev = useCallback(() => {
    setDirection(-1);
    if (returnTo) {
        const returnScreenId = returnTo;
        setReturnTo(null);
        setCurrentScreenId(returnScreenId);
        return;
    }
    if (history.length > 0) {
      const prevScreenId = history[history.length - 1];
      setHistory(prev => prev.slice(0, -1));
      setCurrentScreenId(prevScreenId);
    }
  }, [history, returnTo]);

  const progress = useMemo(() => {
    const relevantScreens = config.screens.filter(s => s.type !== 'terminal' && s.type !== 'review');
    const totalSteps = relevantScreens.length;
    const currentStepIndex = relevantScreens.findIndex(s => s.id === currentScreenId);

    if (currentStepIndex === -1) {
      return 100;
    }

    return ((currentStepIndex + 1) / totalSteps) * 100;
  }, [currentScreenId, config.screens]);


  return {
    currentScreen,
    answers,
    calculations,
    progress,
    goToNext,
    goToPrev,
    updateAnswer,
    history,
    goToScreen,
    direction,
  };
};
