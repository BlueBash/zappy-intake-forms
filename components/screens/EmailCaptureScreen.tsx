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
  const [password, setPassword] = useState('');
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordField, setShowPasswordField] = useState(false);
  const [accountExists, setAccountExists] = useState(false);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);

  const validateEmail = (value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
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
      // New account - show password field for registration
      setTimeout(() => setShowPasswordField(true), 300);
    } else {
      // Existing account - show sign-in mode
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
      if (password.length >= 8) {
        updateAnswer('email', email);
        updateAnswer('password', password);
        onSubmit();
      }
    }
  };

  const isComplete = isEmailValid && (!showPasswordField || password.length >= 8);

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

        {/* Account Exists Notice */}
        <AnimatePresence>
          {accountExists && !showForgotPassword && (
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

        {/* Password Field */}
        <AnimatePresence>
          {showPasswordField && !showForgotPassword && (
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

        {/* Already have account link */}
        {!showPasswordField && !accountExists && isEmailValid && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center"
          >
            <button
              onClick={() => {
                setIsSigningIn(true);
                setAccountExists(true);
                setShowPasswordField(true);
              }}
              className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors"
            >
              Already have an account? <span className="text-[#00A896] font-medium">Sign in</span>
            </button>
          </motion.div>
        )}

        {/* Privacy Notice at Bottom */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-xs text-neutral-500 text-center leading-relaxed"
        >
          <Lock className="w-3.5 h-3.5 inline-block mr-1 text-[#00A896]" />
          <strong className="text-neutral-600">Your Privacy:</strong> Your health information is protected under HIPAA. We use secure storage and encryption.
        </motion.div>

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
      </div>
    </ScreenLayout>
  );
};

export default EmailCaptureScreen;
