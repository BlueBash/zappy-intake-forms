/**
 * Skip step configuration
 * Defines which steps should be skipped based on conditions
 */
export interface SkipStepRule {
  screenId: string;
  condition: (answers: Record<string, any>) => boolean;
  description?: string;
}

/**
 * Default skip step rules
 * Add new rules here to skip additional steps based on conditions
 */
export const DEFAULT_SKIP_STEP_RULES: SkipStepRule[] = [
  {
    screenId: 'capture.email',
    condition: (answers) => {
      // Skip email capture if email already exists and is valid
      const email = answers.email;
      return Boolean(
        email &&
        typeof email === 'string' &&
        email.trim().length > 0 &&
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
      );
    },
    description: 'Skip email capture if email already exists',
  },
  // Add more skip rules here as needed
  // Example:
  // {
  //   screenId: 'demographics.state',
  //   condition: (answers) => Boolean(answers.state && answers.state.trim().length > 0),
  //   description: 'Skip state selection if state already provided',
  // },
];

/**
 * Get all screens that should be skipped based on current answers
 */
export const getSkippedScreens = (
  answers: Record<string, any>,
  skipRules: SkipStepRule[] = DEFAULT_SKIP_STEP_RULES
): string[] => {
  return skipRules
    .filter(rule => rule.condition(answers))
    .map(rule => rule.screenId);
};

/**
 * Check if a specific screen should be skipped
 */
export const shouldSkipScreen = (
  screenId: string,
  answers: Record<string, any>,
  skipRules: SkipStepRule[] = DEFAULT_SKIP_STEP_RULES
): boolean => {
  const rule = skipRules.find(r => r.screenId === screenId);
  return rule ? rule.condition(answers) : false;
};

/**
 * Get the count of skipped screens
 */
export const getSkippedScreensCount = (
  answers: Record<string, any>,
  allScreens: Array<{ id: string }>,
  skipRules: SkipStepRule[] = DEFAULT_SKIP_STEP_RULES
): number => {
  const skippedScreenIds = getSkippedScreens(answers, skipRules);
  // Only count screens that actually exist in the form
  return allScreens.filter(screen => skippedScreenIds.includes(screen.id)).length;
};

