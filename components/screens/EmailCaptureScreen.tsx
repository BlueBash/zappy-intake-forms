import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Check, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';
import NavigationButtons from '../common/NavigationButtons';
import ScreenLayout from '../common/ScreenLayout';

interface EmailCaptureScreenProps {
  screen: {
    id: string;
    title: string;
    subtitle?: string;
    footer_note?: string;
    fields: any[];
  };
  answers: Record<string, any>;
  updateAnswer: (id: string, value: any) => void;
  onSubmit: () => void;
  showBack?: boolean;
  onBack?: () => void;
  showLoginLink?: boolean;
}

const EmailCaptureScreen: React.FC<EmailCaptureScreenProps> = ({
  screen,
  answers,
  updateAnswer,
  onSubmit,
  showBack,
  onBack,
}) => {
  const [email, setEmail] = useState(answers.email || '');
  const [firstName, setFirstName] = useState(answers.first_name || answers.account_firstName || '');
  const [lastName, setLastName] = useState(answers.last_name || answers.account_lastName || '');
  const [password, setPassword] = useState('');
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordField, setShowPasswordField] = useState(false);
  const [showNameFields, setShowNameFields] = useState(false);
  const [accountExists, setAccountExists] = useState(false);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [manualSignIn, setManualSignIn] = useState(false); // Track if user manually clicked sign in

  const validateEmail = (value: string) => {
    // Stricter email validation with valid TLD check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(value)) return false;
    
    // Check for valid TLD (common ones)
    const validTLDs = ['com', 'org', 'net', 'edu', 'gov', 'mil', 'co', 'us', 'uk', 'ca', 'au', 'de', 'fr', 'jp', 'cn', 'in', 'br', 'io', 'ai', 'app', 'dev'];
    const tld = value.split('.').pop()?.toLowerCase();
    return tld ? validTLDs.includes(tld) || tld.length >= 2 : false;
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);
    const isValid = validateEmail(value);
    setIsEmailValid(isValid);
    
    if (isValid) {
      updateAnswer('email', value);
      // Simulate account detection after 500ms
      setTimeout(() => {
        checkIfAccountExists(value);
      }, 500);
    }
  };

  const checkIfAccountExists = async (emailValue: string) => {
    // TODO: Replace with actual API call
    // For now, simulate checking if account exists
    const exists = false; // Change to true to test account exists flow
    setAccountExists(exists);
    
    if (!exists) {
      // New account - show name fields first, then password
      setTimeout(() => setShowNameFields(true), 300);
    } else {
      // Existing account detected - show sign-in mode
      // Only set accountExists if this was detected, not manually triggered
      setTimeout(() => {
        setShowPasswordField(true);
        setIsSigningIn(true);
      }, 300);
    }
  };

  const handleSignIn = () => {
    if (password.length >= 8) {
      // TODO: Implement actual sign-in logic
      console.log('Signing in with:', email, password);
      updateAnswer('email', email);
      onSubmit();
    }
  };

  const handleForgotPassword = () => {
    setShowForgotPassword(true);
  };

  const handleResetPassword = () => {
    // TODO: Implement actual password reset API call
    console.log('Sending password reset to:', email);
    setResetEmailSent(true);
    setTimeout(() => {
      setShowForgotPassword(false);
      setResetEmailSent(false);
    }, 3000);
  };

  const handleContinue = () => {
    if (!showPasswordField) {
      // Just email validated, no password yet
      return;
    }
    
    if (isSigningIn) {
      handleSignIn();
    } else {
      // New account registration
      if (password.length >= 8 && firstName.trim() && lastName.trim()) {
        updateAnswer('email', email);
        updateAnswer('first_name', firstName.trim());
        updateAnswer('account_firstName', firstName.trim());
        updateAnswer('last_name', lastName.trim());
        updateAnswer('account_lastName', lastName.trim());
        updateAnswer('password', password);
        onSubmit();
      }
    }
  };

  const isComplete = isEmailValid && 
    (!showPasswordField || (password.length >= 8 && (!showNameFields || (firstName.trim() && lastName.trim())))) && 
    (isSigningIn || agreedToTerms); // Consent not required for sign-in

  return (
    <ScreenLayout 
      title={isSigningIn ? "Welcome back!" : screen.title}
      helpText={isSigningIn ? "Sign in to continue" : "We'll keep you updated on your progress and next steps"}
      showBack={showBack}
      onBack={onBack}
    >
      <div className="space-y-6">
        {/* Email Input */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <label className="block text-sm font-medium text-neutral-700 mb-3">
            Email address
          </label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400 pointer-events-none" />
            <input
              type="email"
              value={email}
              onChange={(e) => handleEmailChange(e.target.value)}
              placeholder="you@example.com"
              className={`w-full pl-12 pr-12 py-4 rounded-xl border-2 transition-all text-base outline-none shadow-sm ${
                email && !isEmailValid
                  ? 'border-red-300 bg-white focus:border-red-500 focus:ring-4 focus:ring-red-100'
                  : 'border-neutral-300 bg-white focus:border-[#00A896] focus:ring-4 focus:ring-[#00A896]/10'
              }`}
              autoFocus
            />
            {isEmailValid && (
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#00A896] flex items-center justify-center"
              >
                <Check className="w-4 h-4 text-white" strokeWidth={3} />
              </motion.div>
            )}
          </div>
          {email && !isEmailValid && (
            <motion.p
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm text-red-600 mt-2 flex items-center gap-1"
            >
              <AlertCircle className="w-4 h-4" />
              Please enter a valid email address
            </motion.p>
          )}
        </motion.div>

        {/* Name Fields - Only for new accounts */}
        <AnimatePresence>
          {showNameFields && !isSigningIn && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-2 gap-4"
            >
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-3">
                  First Name
                </label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="John"
                  className="w-full px-4 py-4 rounded-xl border-2 border-neutral-300 bg-white focus:border-[#00A896] focus:ring-4 focus:ring-[#00A896]/10 transition-all text-base outline-none shadow-sm"
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-3">
                  Last Name
                </label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Doe"
                  className="w-full px-4 py-4 rounded-xl border-2 border-neutral-300 bg-white focus:border-[#00A896] focus:ring-4 focus:ring-[#00A896]/10 transition-all text-base outline-none shadow-sm"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Account Exists Notice - Only show if account was detected, not if manually switching to sign-in */}
        <AnimatePresence>
          {accountExists && !showForgotPassword && !manualSignIn && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4"
            >
              <p className="text-sm text-blue-900">
                <strong>An account with this email already exists.</strong> Please sign in to continue.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Show password field after name fields are filled for new accounts, or immediately for sign-in */}
        <AnimatePresence>
          {((showPasswordField && isSigningIn) || (showNameFields && firstName.trim() && lastName.trim())) && !showForgotPassword && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              onAnimationComplete={() => {
                if (!showPasswordField) setShowPasswordField(true);
              }}
            >
              <label className="block text-sm font-medium text-neutral-700 mb-3">
                {isSigningIn ? 'Password' : 'Create a password'}
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={isSigningIn ? 'Enter your password' : 'At least 8 characters'}
                  className={`w-full pl-12 pr-12 py-4 rounded-xl border-2 transition-all text-base outline-none shadow-sm ${
                    password && password.length < 8
                      ? 'border-red-300 bg-white focus:border-red-500 focus:ring-4 focus:ring-red-100'
                      : 'border-neutral-300 bg-white focus:border-[#00A896] focus:ring-4 focus:ring-[#00A896]/10'
                  }`}
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {password && password.length < 8 && !isSigningIn && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-red-600 mt-2 flex items-center gap-1"
                >
                  <AlertCircle className="w-4 h-4" />
                  Password must be at least 8 characters
                </motion.p>
              )}
              
              {/* Forgot Password Link */}
              {isSigningIn && (
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-sm text-[#00A896] hover:text-[#008977] mt-3 font-medium"
                >
                  Forgot password?
                </motion.button>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Password Field - OLD VERSION TO REMOVE */}
        <AnimatePresence>
          {false && showPasswordField && !showForgotPassword && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <label className="block text-sm font-medium text-neutral-700 mb-3">
                {isSigningIn ? 'Password' : 'Create a password'}
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={isSigningIn ? 'Enter your password' : 'At least 8 characters'}
                  className={`w-full pl-12 pr-12 py-4 rounded-xl border-2 transition-all text-base outline-none shadow-sm ${
                    password && password.length < 8
                      ? 'border-red-300 bg-white focus:border-red-500 focus:ring-4 focus:ring-red-100'
                      : 'border-neutral-300 bg-white focus:border-[#00A896] focus:ring-4 focus:ring-[#00A896]/10'
                  }`}
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {password && password.length < 8 && !isSigningIn && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-red-600 mt-2 flex items-center gap-1"
                >
                  <AlertCircle className="w-4 h-4" />
                  Password must be at least 8 characters
                </motion.p>
              )}
              
              {/* Forgot Password Link */}
              {isSigningIn && (
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-sm text-[#00A896] hover:text-[#008977] mt-3 font-medium"
                >
                  Forgot password?
                </motion.button>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Forgot Password Flow */}
        <AnimatePresence>
          {showForgotPassword && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-white border-2 border-neutral-200 rounded-xl p-6"
            >
              {!resetEmailSent ? (
                <>
                  <h3 className="text-lg font-semibold text-neutral-900 mb-2">Reset your password</h3>
                  <p className="text-sm text-neutral-600 mb-4">
                    We'll send a password reset link to <strong>{email}</strong>
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={handleResetPassword}
                      className="flex-1 px-4 py-3 bg-[#00A896] text-white rounded-xl font-medium hover:bg-[#008977] transition-colors"
                    >
                      Send reset link
                    </button>
                    <button
                      onClick={() => setShowForgotPassword(false)}
                      className="px-4 py-3 border-2 border-neutral-300 text-neutral-700 rounded-xl font-medium hover:bg-neutral-50 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center"
                >
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Check className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-neutral-900 mb-2">Check your email</h3>
                  <p className="text-sm text-neutral-600">
                    We've sent a password reset link to {email}
                  </p>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Consent Checkbox - Only show for new accounts, not for sign-in */}
        <AnimatePresence>
          {showPasswordField && !isSigningIn && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <label className="flex items-start gap-2.5 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded border border-neutral-300 text-[#00A896] focus:ring-2 focus:ring-[#00A896] focus:ring-offset-0 transition-colors cursor-pointer"
                />
                <span className="text-xs leading-relaxed text-neutral-600">
                  I agree to the{' '}
                  <a 
                    href="https://zappyhealth.com/terms" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-[#00A896] hover:underline"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Terms
                  </a>
                  ,{' '}
                  <a 
                    href="https://zappyhealth.com/privacy" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-[#00A896] hover:underline"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Privacy Policy
                  </a>
                  ,{' '}
                  <a 
                    href="https://zappyhealth.com/telehealth" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-[#00A896] hover:underline"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Telehealth Consent
                  </a>
                  , and{' '}
                  <a 
                    href="https://zappyhealth.com/hipaa" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-[#00A896] hover:underline"
                    onClick={(e) => e.stopPropagation()}
                  >
                    HIPAA Authorization
                  </a>
                </span>
              </label>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Already have account link - Only show for new account flow */}
        {!isSigningIn && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-center"
          >
          <button
            onClick={() => {
              setManualSignIn(true); // User manually clicked sign in
              setIsSigningIn(true);
              setShowPasswordField(true);
            }}
            className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors"
          >
            Already have an account? <span className="text-[#00A896] font-medium">Sign in</span>
          </button>
          </motion.div>
        )}

        {/* Navigation */}
        <div className="mt-8">
          <NavigationButtons
            showBack={showBack}
            onBack={onBack}
            onNext={handleContinue}
            isNextDisabled={!isComplete}
            nextLabel={isSigningIn ? 'Sign in' : 'Continue'}
          />
        </div>

        {/* Privacy Notice at Very Bottom */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-xs text-neutral-500 text-center leading-relaxed mt-6"
        >
          <Lock className="w-3.5 h-3.5 inline-block mr-1 text-[#00A896]" />
          <strong className="text-neutral-600">Your Privacy:</strong> Your health information is protected under HIPAA. We use secure storage and encryption.
        </motion.div>
      </div>
    </ScreenLayout>
  );
};

export default EmailCaptureScreen;
