import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Shield, Lock, Package, CheckCircle2, TrendingUp, Users, Award, FlaskConical, Brain, Heart, Target } from 'lucide-react';
import WeightLossGraph from './WeightLossGraphScreen';
import { interpolateText } from '../../utils/stringInterpolator';

interface InterstitialScreenProps {
  answers?: Record<string, any>;
  calculations?: Record<string, any>;
  screen: {
    id: string;
    type: 'interstitial';
    variant?: 'stat' | 'motivation' | 'testimonial' | 'trust' | 'process' | 'stat_success' | 'stat_science' | 'stat_personalized' | 'weight_loss_graph' | 'progress_encouragement';
    
    // For stat variant
    stat_number?: string;
    stat_text?: string;
    stat_highlight?: string;
    background_image?: string;
    stat_subtitle?: string;
    
    // For motivation variant
    title?: string;
    subtitle?: string;
    message?: string;
    
    // For testimonial variant
    testimonial_title?: string;
    testimonial_subtitle?: string;
    testimonials?: Array<{
      name: string;
      age: number;
      result: string;
      timeframe: string;
      before_image?: string;
      after_image?: string;
    }>;
    
    // For trust variant
    trust_items?: Array<{
      icon: string;
      title: string;
      description: string;
    }>;
    
    // For process variant
    process_title?: string;
    process_steps?: Array<{
      step: number;
      title: string;
      description: string;
    }>;
  };
  onSubmit: () => void;
}

const ImageWithFallback: React.FC<{ src: string; alt: string; className: string }> = ({ src, alt, className }) => {
  return <img src={src} alt={alt} className={className} />;
};

export default function InterstitialScreen({ screen, onSubmit, answers = {}, calculations = {} }: InterstitialScreenProps) {
  const variant = screen.variant || 'motivation';
  const reducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  // TRUST VARIANT - Build credibility with trust signals
  if (variant === 'trust') {
    const iconMap: Record<string, any> = {
      '🏥': Shield,
      '🔒': Lock,
      '📦': Package,
    };
    
    const defaultTrustItems = [
      { icon: '🏥', title: 'Licensed Medical Team', description: 'Board-certified doctors review every case' },
      { icon: '🔒', title: 'HIPAA Compliant', description: 'Your privacy is our priority' },
      { icon: '📦', title: 'Discreet Delivery', description: 'Direct to your door in unmarked packaging' },
    ];
    
    return (
      <motion.div
        initial={reducedMotion ? { opacity: 1 } : { opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={reducedMotion ? { opacity: 1 } : { opacity: 0 }}
        transition={reducedMotion ? { duration: 0.01 } : { duration: 0.4 }}
        className="min-h-screen flex items-center justify-center p-6 md:p-8 bg-gradient-to-br from-[#FDFBF7] via-white to-[#F8FCF9]"
      >
        <div className="w-full max-w-2xl">
          {/* Header */}
          <motion.div
            initial={reducedMotion ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={reducedMotion ? { duration: 0.01 } : { delay: 0.1, duration: 0.3 }}
            className="text-center mb-16"
          >
            <motion.div
              initial={reducedMotion ? { scale: 1, opacity: 1 } : { scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={reducedMotion ? { duration: 0.01 } : { duration: 0.3 }}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-[#00A896]/10 to-[#E0F5F3]/10 px-4 py-2 rounded-full mb-6"
            >
              <CheckCircle2 className="w-4 h-4 text-[#00A896]" />
              <span className="text-sm text-[#00A896]">Trusted by thousands on their wellness journey</span>
            </motion.div>
            
            <h2 className="text-4xl md:text-6xl mb-3">
              <span className="text-neutral-900">Why choose </span>
              <span className="bg-gradient-to-r from-[#00A896] to-[#E0F5F3] bg-clip-text text-transparent">our program</span>
            </h2>
          </motion.div>

          {/* Trust Items Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {(screen.trust_items || defaultTrustItems).map((item, index) => {
              const IconComponent = iconMap[item.icon] || Shield;
              
              return (
                <motion.div
                  key={item.title}
                  initial={reducedMotion ? { y: 0, opacity: 1 } : { y: 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={reducedMotion ? { duration: 0.01 } : {
                    delay: 0.1 + index * 0.1,
                    duration: 0.4,
                    ease: [0.16, 1, 0.3, 1]
                  }}
                  className="group relative"
                >
                  {/* Card */}
                  <div className="relative bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-neutral-100 hover:shadow-[0_20px_60px_rgb(0,0,0,0.08)] transition-all duration-500 h-full">
                    {/* Gradient accent on hover */}
                    <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[#00A896]/0 to-[#E0F5F3]/0 group-hover:from-[#00A896]/5 group-hover:to-[#E0F5F3]/5 transition-all duration-500" />
                    
                    <div className="relative">
                      {/* Icon Container */}
                      <div className="mb-6">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#00A896] to-[#E0F5F3] shadow-lg group-hover:scale-110 transition-transform duration-500">
                          <IconComponent className="w-8 h-8 text-white" strokeWidth={1.5} />
                        </div>
                      </div>
                      
                      {/* Content */}
                      <h3 className="text-xl mb-3 text-neutral-900">
                        {item.title}
                      </h3>
                      <p className="text-neutral-600 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* CTA Button */}
          <motion.div
            initial={reducedMotion ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={reducedMotion ? { duration: 0.01 } : { delay: 0.3, duration: 0.3 }}
            className="flex justify-center"
          >
            <motion.button
              onClick={onSubmit}
              whileHover={reducedMotion ? {} : { scale: 1.01 }}
              whileTap={reducedMotion ? {} : { scale: 0.98 }}
              className="group bg-[#00A896] hover:bg-[#0F766E] text-white px-10 py-5 rounded-full flex items-center gap-3 shadow-[0_10px_40px_rgba(13,148,136,0.3)] hover:shadow-[0_20px_60px_rgba(13,148,136,0.4)] transition-all"
              style={{
                transitionDuration: 'var(--timing-normal)',
                transitionTimingFunction: 'var(--easing-elegant)'
              }}
            >
              <span className="font-semibold text-lg">Continue</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </motion.button>
          </motion.div>
        </div>
      </motion.div>
    );
  }
  
  // PROCESS VARIANT - Explain what happens next
  if (variant === 'process') {
    return (
      <motion.div
        initial={reducedMotion ? { opacity: 1 } : { opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={reducedMotion ? { opacity: 1 } : { opacity: 0 }}
        transition={reducedMotion ? { duration: 0.01 } : { duration: 0.4 }}
        className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-[#FDFBF7] to-white"
      >
        <div className="w-full max-w-2xl">
          <motion.div
            initial={reducedMotion ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={reducedMotion ? { duration: 0.01 } : { delay: 0.1, duration: 0.3 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl mb-4 text-neutral-900">
              {screen.process_title || "Here's what happens next"}
            </h2>
          </motion.div>

          <div className="space-y-6 mb-12">
            {(screen.process_steps || [
              { step: 1, title: 'Medical Review', description: 'A licensed healthcare provider reviews your health profile within 24 hours' },
              { step: 2, title: 'Personalized Plan', description: 'Receive your custom treatment plan tailored to your goals' },
              { step: 3, title: 'Delivery', description: 'Medication ships discreetly to your door with ongoing support' },
            ]).map((item, index) => (
              <motion.div
                key={item.step}
                initial={reducedMotion ? { x: 0, opacity: 1 } : { x: -30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={reducedMotion ? { duration: 0.01 } : { delay: 0.1 + index * 0.05, duration: 0.3 }}
                className="flex gap-6 items-start"
              >
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-[#00A896] to-[#E0F5F3] flex items-center justify-center text-white text-xl shadow-lg">
                  {item.step}
                </div>
                <div className="flex-1 pt-2">
                  <h3 className="text-xl mb-2 text-neutral-900">{item.title}</h3>
                  <p className="text-neutral-600">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={reducedMotion ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={reducedMotion ? { duration: 0.01 } : { delay: 0.3, duration: 0.3 }}
            className="flex justify-center"
          >
            <button
              onClick={onSubmit}
              className="bg-neutral-900 text-white px-8 py-4 rounded-full flex items-center gap-2 font-semibold shadow-lg hover:bg-neutral-800 transition-colors"
              style={{
                transitionDuration: 'var(--timing-fast)',
                transitionTimingFunction: 'var(--easing-elegant)'
              }}
            >
              Continue
              <ArrowRight className="w-5 h-5" />
            </button>
          </motion.div>
        </div>
      </motion.div>
    );
  }

  // STAT SUCCESS VARIANT - Positive, solution-focused statistics
  if (variant === 'stat_success') {
    return (
      <motion.div
        initial={reducedMotion ? { opacity: 1 } : { opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={reducedMotion ? { opacity: 1 } : { opacity: 0 }}
        transition={reducedMotion ? { duration: 0.01 } : { duration: 0.4 }}
        className="min-h-screen flex items-center justify-center p-6 md:p-8 bg-gradient-to-br from-[#FDFBF7] via-white to-[#F0FDF4]"
      >
        <div className="w-full max-w-2xl">
          {/* Main Content Card */}
          <motion.div
            initial={reducedMotion ? { y: 0, opacity: 1 } : { y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={reducedMotion ? { duration: 0.01 } : { delay: 0.1, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
          >
            {/* Decorative background elements */}
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-gradient-to-br from-[#00A896]/10 to-[#E0F5F3]/5 rounded-full blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-gradient-to-tr from-[#FF6B6B]/10 to-[#FF6B6B]/5 rounded-full blur-3xl" />
            
            <div className="relative bg-white rounded-3xl shadow-[0_20px_80px_rgba(0,0,0,0.08)] border border-neutral-100 overflow-hidden">
              <div className="p-12 md:p-16">
                {/* Icon */}
                <motion.div
                  initial={reducedMotion ? { scale: 1, rotate: 0 } : { scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={reducedMotion ? { duration: 0.01 } : { delay: 0.15, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-[#00A896] to-[#E0F5F3] shadow-lg mb-8"
                >
                  <TrendingUp className="w-10 h-10 text-white" strokeWidth={2.5} />
                </motion.div>

                {/* Main Statistic */}
                <motion.div
                  initial={reducedMotion ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={reducedMotion ? { duration: 0.01 } : { delay: 0.2, duration: 0.3 }}
                  className="mb-8"
                >
                  <div className="flex items-baseline gap-3 mb-4">
                    <span className="text-8xl md:text-9xl bg-gradient-to-r from-[#00A896] to-[#E0F5F3] bg-clip-text text-transparent">
                      {screen.stat_number || '3×'}
                    </span>
                  </div>
                  
                  <h2 className="text-3xl md:text-4xl text-neutral-900 mb-4 leading-tight">
                    {screen.stat_text || 'better long-term results with medical supervision'}
                  </h2>
                  
                </motion.div>

                {/* Supporting Stats Grid */}
                <motion.div
                  initial={reducedMotion ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={reducedMotion ? { duration: 0.01 } : { delay: 0.25, duration: 0.3 }}
                  className="grid md:grid-cols-2 gap-6 mb-10 p-6 bg-gradient-to-br from-[#F8FCF9] to-[#FDFBF7] rounded-2xl border border-neutral-100"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center">
                      <Users className="w-6 h-6 text-[#00A896]" />
                    </div>
                    <div>
                      <div className="text-2xl text-neutral-900 mb-1">82%</div>
                      <div className="text-sm text-neutral-600">of members reached their goals</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center">
                      <Award className="w-6 h-6 text-[#FF6B6B]" />
                    </div>
                    <div>
                      <div className="text-2xl text-neutral-900 mb-1">94%</div>
                      <div className="text-sm text-neutral-600">Report improved confidence</div>
                    </div>
                  </div>
                </motion.div>

                {/* CTA Button */}
                <motion.div
                  initial={reducedMotion ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={reducedMotion ? { duration: 0.01 } : { delay: 0.3, duration: 0.3 }}
                  className="flex justify-center"
                >
                  <motion.button
                    onClick={onSubmit}
                    whileHover={reducedMotion ? {} : { scale: 1.01 }}
                    whileTap={reducedMotion ? {} : { scale: 0.98 }}
                    className="group bg-[#00A896] hover:bg-[#0F766E] text-white px-10 py-5 rounded-full flex items-center gap-3 shadow-[0_10px_40px_rgba(13,148,136,0.3)] hover:shadow-[0_20px_60px_rgba(13,148,136,0.4)] transition-all"
                    style={{
                      transitionDuration: 'var(--timing-normal)',
                      transitionTimingFunction: 'var(--easing-elegant)'
                    }}
                  >
                    <span className="font-semibold text-lg">Continue</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </motion.button>
                </motion.div>

                {/* Disclaimer */}
                <motion.p
                  initial={reducedMotion ? { opacity: 1 } : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={reducedMotion ? { duration: 0.01 } : { delay: 0.35, duration: 0.3 }}
                  className="mt-8 text-xs text-neutral-500"
                >
                  {screen.stat_highlight || 'Data based on clinical studies and member outcomes over 12 months.'}
                </motion.p>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    );
  }

  // STAT SCIENCE VARIANT - Clinical research and science-backed approach
  if (variant === 'stat_science') {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.6 }}
        className="min-h-screen flex items-center justify-center p-6 md:p-8 bg-gradient-to-br from-[#FDFBF7] via-white to-[#EFF6FF]"
      >
        <div className="w-full max-w-2xl">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6, type: "spring", stiffness: 100 }}
            className="relative"
          >
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-gradient-to-br from-blue-500/10 to-[#00A896]/5 rounded-full blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-gradient-to-tr from-[#00A896]/10 to-blue-500/5 rounded-full blur-3xl" />
            
            <div className="relative bg-white rounded-3xl shadow-[0_20px_80px_rgba(0,0,0,0.08)] border border-neutral-100 overflow-hidden">
              <div className="p-12 md:p-16">
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.4, duration: 0.6, type: "spring", stiffness: 120 }}
                  className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-600 to-[#00A896] shadow-lg mb-8"
                >
                  <FlaskConical className="w-10 h-10 text-white" strokeWidth={2.5} />
                </motion.div>

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                  className="mb-8"
                >
                  <div className="flex items-baseline gap-3 mb-4">
                    <span className="text-8xl md:text-9xl bg-gradient-to-r from-blue-600 to-[#00A896] bg-clip-text text-transparent">
                      {screen.stat_number || '50+'}
                    </span>
                  </div>
                  
                  <h2 className="text-3xl md:text-4xl text-neutral-900 mb-4 leading-tight">
                    {screen.stat_text || 'clinical studies validate our approach'}
                  </h2>
                  
                </motion.div>

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                  className="grid md:grid-cols-2 gap-6 mb-10 p-6 bg-gradient-to-br from-blue-50/50 to-[#F8FCF9] rounded-2xl border border-neutral-100"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center">
                      <Brain className="w-6 h-6 text-[var(--teal)]" />
                    </div>
                    <div>
                      <div className="text-2xl text-neutral-900 mb-1">Peer-reviewed</div>
                      <div className="text-sm text-neutral-600">Published in leading journals</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center">
                      <Shield className="w-6 h-6 text-[#00A896]" />
                    </div>
                    <div>
                      <div className="text-2xl text-neutral-900 mb-1">FDA-approved</div>
                      <div className="text-sm text-neutral-600">Safe, effective medications</div>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={reducedMotion ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={reducedMotion ? { duration: 0.01 } : { delay: 0.7, duration: 0.5 }}
                  className="flex justify-center"
                >
                  <motion.button
                    onClick={onSubmit}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="group bg-[#00A896] hover:bg-[#0F766E] text-white px-10 py-5 rounded-full flex items-center gap-3 shadow-[0_10px_40px_rgba(13,148,136,0.3)] hover:shadow-[0_20px_60px_rgba(13,148,136,0.4)] transition-all duration-300"
                  >
                    <span className="font-semibold text-lg">Continue</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </motion.button>
                </motion.div>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8, duration: 0.5 }}
                  className="mt-8 text-xs text-neutral-500"
                >
                  {screen.stat_highlight || 'Based on published clinical research and FDA guidelines.'}
                </motion.p>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    );
  }

  // WEIGHT_LOSS_GRAPH VARIANT - Show treatment impact with graph
  if (variant === 'weight_loss_graph') {
    return (
      <div className="min-h-screen bg-[#fef8f2] flex items-start justify-center p-4 sm:p-6">
        <div className="w-full max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="text-center"
          >
            {/* Title */}
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-3xl sm:text-4xl md:text-5xl mb-4 sm:mb-6 text-neutral-900"
            >
              {screen.title || 'Your potential transformation'}
            </motion.h1>

            {/* Subtitle */}
            {screen.subtitle && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="text-lg sm:text-xl text-neutral-600 mb-8 sm:mb-12 max-w-2xl mx-auto"
              >
                {interpolateText(screen.subtitle, calculations, answers)}
              </motion.p>
            )}

            {/* Graph */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="mb-8 sm:mb-12"
            >
              <WeightLossGraph companyName={screen.stat_highlight || 'Zappy'} />
            </motion.div>

            {/* Supporting Message */}
            {screen.message && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="text-base sm:text-lg text-neutral-600 mb-8 sm:mb-10 max-w-2xl mx-auto"
              >
                {screen.message}
              </motion.p>
            )}

            {/* Stats */}
            {screen.stat_number && screen.stat_text && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="mb-8 sm:mb-12"
              >
                <div className="text-4xl sm:text-5xl text-[#FF6B6B] font-bold mb-2">
                  {screen.stat_number}
                </div>
                <div className="text-sm sm:text-base text-neutral-600">{screen.stat_text}</div>
                {screen.stat_subtitle && (
                  <div className="text-sm text-neutral-500 mt-1">{screen.stat_subtitle}</div>
                )}
              </motion.div>
            )}

            {/* Continue Button */}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.5 }}
              onClick={onSubmit}
              className="group relative inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#FF6B6B] to-[#FF8A6B] text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 text-lg"
            >
              <span>Continue</span>
              <svg
                className="w-5 h-5 transition-transform group-hover:translate-x-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </motion.button>
          </motion.div>
        </div>
      </div>
    );
  }

  // STAT PERSONALIZED VARIANT - Customization and personalized care
  if (variant === 'stat_personalized') {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.6 }}
        className="min-h-screen flex items-center justify-center p-6 md:p-8 bg-gradient-to-br from-[#FDFBF7] via-white to-[#FEF3F2]"
      >
        <div className="w-full max-w-2xl">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6, type: "spring", stiffness: 100 }}
            className="relative"
          >
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-gradient-to-br from-[#FF6B6B]/10 to-[#00A896]/5 rounded-full blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-gradient-to-tr from-[#00A896]/10 to-[#FF6B6B]/5 rounded-full blur-3xl" />
            
            <div className="relative bg-white rounded-3xl shadow-[0_20px_80px_rgba(0,0,0,0.08)] border border-neutral-100 overflow-hidden">
              <div className="p-12 md:p-16">
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                  className="mb-8"
                >
                  <div className="flex items-baseline gap-3 mb-4">
                    <span className="text-8xl md:text-9xl bg-gradient-to-r from-[#FF6B6B] to-[#00A896] bg-clip-text text-transparent">
                      {screen.stat_number || '100%'}
                    </span>
                  </div>
                  
                  <h2 className="text-3xl md:text-4xl text-neutral-900 mb-4 leading-tight">
                    {screen.stat_text || 'personalized to your unique health profile'}
                  </h2>
                  
                </motion.div>

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                  className="grid md:grid-cols-2 gap-6 mb-10 p-6 bg-gradient-to-br from-[#FFF5F3] to-[#F8FCF9] rounded-2xl border border-neutral-100"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center">
                      <Target className="w-6 h-6 text-[#FF6B6B]" />
                    </div>
                    <div>
                      <div className="text-2xl text-neutral-900 mb-1">Custom dosing</div>
                      <div className="text-sm text-neutral-600">Adjusted to your body and goals</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center">
                      <Heart className="w-6 h-6 text-[#00A896]" />
                    </div>
                    <div>
                      <div className="text-2xl text-neutral-900 mb-1">Ongoing support</div>
                      <div className="text-sm text-neutral-600">Your care team adapts with you</div>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.7, duration: 0.5 }}
                  className="flex justify-center"
                >
                  <motion.button
                    onClick={onSubmit}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="group bg-[#00A896] hover:bg-[#0F766E] text-white px-10 py-5 rounded-full flex items-center gap-3 shadow-[0_10px_40px_rgba(13,148,136,0.3)] hover:shadow-[0_20px_60px_rgba(13,148,136,0.4)] transition-all duration-300"
                  >
                    <span className="font-semibold text-lg">Continue</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </motion.button>
                </motion.div>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8, duration: 0.5 }}
                  className="mt-8 text-xs text-neutral-500"
                >
                  {screen.stat_highlight || 'Every treatment plan is tailored by licensed healthcare providers.'}
                </motion.p>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    );
  }

  // PROGRESS ENCOURAGEMENT VARIANT - Mid-assessment motivation
  if (variant === 'progress_encouragement') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FDFBF7] via-white to-[#F8FCF9] flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="text-center"
          >
            {/* Icon */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5, type: 'spring', stiffness: 200 }}
              className="mb-6"
            >
              <div className="inline-flex items-center justify-center w-20 h-20 bg-[#00A896] rounded-full shadow-lg shadow-[#00A896]/30">
                <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </motion.div>

            {/* Title */}
            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-3xl sm:text-4xl mb-4 text-neutral-900"
            >
              {screen.title || "You're making great progress!"}
            </motion.h2>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-lg sm:text-xl text-neutral-600 mb-8 max-w-xl mx-auto"
            >
              {screen.subtitle || "Just a few more questions to ensure we can support you safely. You're halfway there!"}
            </motion.p>

            {/* Continue Button */}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              onClick={onSubmit}
              className="group relative inline-flex items-center gap-3 px-8 py-4 bg-[#FF6B6B] hover:bg-[#FF5252] text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 text-lg"
            >
              <span>Continue</span>
              <svg
                className="w-5 h-5 transition-transform group-hover:translate-x-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </motion.button>
          </motion.div>
        </div>
      </div>
    );
  }

  // MOTIVATION VARIANT - Encouraging message (default)
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
        className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-[#FDFBF7] via-[#FEF9F3] to-[#FDF6EF]"
      >
        <div className="w-full max-w-2xl">
          <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="p-12 md:p-16"
        >
          {/* Optional Brand Logo Area */}
          {screen.title && (
            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="mb-12"
            >
              <div className="text-[#FF6B6B] font-serif text-2xl">
                {screen.title}
              </div>
            </motion.div>
          )}

          {/* Message */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="mb-16 space-y-6"
          >
            <p className="text-4xl md:text-5xl text-neutral-600 leading-snug">
              {screen.message || "We're building your personalized plan."}
            </p>
            <p className="text-4xl md:text-5xl text-neutral-600 leading-snug">
              Our medical team will review your profile to find the treatment option that matches your goals.
            </p>
          </motion.div>

          {/* Next Button */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="flex justify-center"
          >
            <button
              onClick={onSubmit}
              className="bg-neutral-900 text-white px-8 py-4 rounded-full flex items-center gap-2 font-semibold shadow-lg hover:bg-neutral-800 transition-colors"
            >
              Next
              <ArrowRight className="w-5 h-5" />
            </button>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}
