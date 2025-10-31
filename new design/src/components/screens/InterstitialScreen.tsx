import { motion } from 'motion/react';
import { ArrowRight, Shield, Lock, Package, CheckCircle2, TrendingUp, Users, Award, FlaskConical, Brain, Heart, Sparkles, Target, Clock, UserCircle2, Star } from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import WeightLossGraph from '../WeightLossGraph';

interface InterstitialScreenProps {
  screen: {
    id: string;
    type: 'interstitial';
    variant?: 'stat' | 'motivation' | 'testimonial' | 'trust' | 'process' | 'stat_success' | 'stat_science' | 'stat_personalized' | 'provider_intro' | 'provider_encouragement' | 'provider_compassion' | 'provider_guidance' | 'provider_confidence' | 'weight_loss_graph';
    
    // For stat variant
    stat_number?: string;
    stat_text?: string;
    stat_highlight?: string;
    background_image?: string;
    stat_subtitle?: string;
    
    // For motivation variant
    title?: string;
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
    
    // For provider variants
    provider_name?: string;
    provider_title?: string;
    provider_image?: string;
    subtitle?: string;
    trust_badges?: string[];
    supporting_text?: string;
    progress_stat?: string;
    next_steps?: string[];
  };
  onSubmit: () => void;
}

export default function InterstitialScreen({ screen, onSubmit }: InterstitialScreenProps) {
  const variant = screen.variant || 'motivation';
  
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
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.6 }}
        className="min-h-screen flex items-center justify-center p-6 md:p-8 bg-gradient-to-br from-[#FDFBF7] via-white to-[#F8FCF9]"
      >
        <div className="w-full max-w-5xl">
          {/* Header */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-center mb-16"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-[#0D9488]/10 to-[#14B8A6]/10 px-4 py-2 rounded-full mb-6"
            >
              <CheckCircle2 className="w-4 h-4 text-[#0D9488]" />
              <span className="text-sm text-[#0D9488]">Trusted by thousands on their wellness journey</span>
            </motion.div>
            
            <h2 className="text-4xl md:text-6xl mb-3">
              <span className="text-neutral-900">Why choose </span>
              <span className="bg-gradient-to-r from-[#0D9488] to-[#14B8A6] bg-clip-text text-transparent">our program</span>
            </h2>
          </motion.div>

          {/* Trust Items Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {(screen.trust_items || defaultTrustItems).map((item, index) => {
              const IconComponent = iconMap[item.icon] || Shield;
              
              return (
                <motion.div
                  key={item.title}
                  initial={{ y: 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ 
                    delay: 0.3 + index * 0.15, 
                    duration: 0.6,
                    type: "spring",
                    stiffness: 100
                  }}
                  className="group relative"
                >
                  {/* Card */}
                  <div className="relative bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-neutral-100 hover:shadow-[0_20px_60px_rgb(0,0,0,0.08)] transition-all duration-500 h-full">
                    {/* Gradient accent on hover */}
                    <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[#0D9488]/0 to-[#14B8A6]/0 group-hover:from-[#0D9488]/5 group-hover:to-[#14B8A6]/5 transition-all duration-500" />
                    
                    <div className="relative">
                      {/* Icon Container */}
                      <div className="mb-6">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#0D9488] to-[#14B8A6] shadow-lg group-hover:scale-110 transition-transform duration-500">
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
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="flex justify-center"
          >
            <motion.button
              onClick={onSubmit}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="group bg-gradient-to-r from-[#0D9488] to-[#14B8A6] text-white px-10 py-5 rounded-full flex items-center gap-3 shadow-[0_10px_40px_rgba(13,148,136,0.3)] hover:shadow-[0_20px_60px_rgba(13,148,136,0.4)] transition-all duration-300"
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
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.6 }}
        className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-[#FDFBF7] to-white"
      >
        <div className="w-full max-w-3xl">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
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
                initial={{ x: -30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
                className="flex gap-6 items-start"
              >
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-[#0D9488] to-[#14B8A6] flex items-center justify-center text-white text-xl shadow-lg">
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
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="flex justify-center"
          >
            <button
              onClick={onSubmit}
              className="bg-neutral-900 text-white px-8 py-4 rounded-full flex items-center gap-2 font-semibold shadow-lg hover:bg-neutral-800 transition-colors"
            >
              Continue
              <ArrowRight className="w-5 h-5" />
            </button>
          </motion.div>
        </div>
      </motion.div>
    );
  }

  // STAT VARIANT - Big statistic with background image
  if (variant === 'stat') {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.6 }}
        className="min-h-screen flex items-center justify-center p-4"
      >
        <div className="w-full max-w-2xl">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="relative bg-gradient-to-br from-neutral-800 to-neutral-900 rounded-3xl overflow-hidden shadow-2xl"
          >
            {/* Background Image */}
            {screen.background_image && (
              <div className="absolute inset-0 opacity-40">
                <ImageWithFallback
                  src={screen.background_image}
                  alt="Background"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            
            {/* Content */}
            <div className="relative z-10 px-8 py-16 md:px-12 md:py-20">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                <div className="text-white mb-6">
                  <div className="text-7xl md:text-8xl font-bold mb-4">
                    {screen.stat_number}
                  </div>
                  <p className="text-2xl md:text-3xl leading-relaxed">
                    {screen.stat_text}{' '}
                    {screen.stat_highlight && (
                      <span className="text-[#FF7A59] font-semibold">
                        {screen.stat_highlight}
                      </span>
                    )}
                  </p>
                </div>

                <motion.button
                  onClick={onSubmit}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="mt-8 bg-white text-neutral-900 px-8 py-4 rounded-full flex items-center gap-2 font-semibold shadow-lg hover:shadow-xl transition-shadow"
                >
                  Next
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              </motion.div>

              {/* Disclaimer */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="mt-8 text-xs text-neutral-400"
              >
                Data based on a nationally representative survey of American adults.
              </motion.p>
            </div>
          </motion.div>
        </div>
      </motion.div>
    );
  }

  // STAT SUCCESS VARIANT - Positive, solution-focused statistics
  if (variant === 'stat_success') {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.6 }}
        className="min-h-screen flex items-center justify-center p-6 md:p-8 bg-gradient-to-br from-[#FDFBF7] via-white to-[#F0FDF4]"
      >
        <div className="w-full max-w-5xl">
          {/* Main Content Card */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6, type: "spring", stiffness: 100 }}
            className="relative"
          >
            {/* Decorative background elements */}
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-gradient-to-br from-[#0D9488]/10 to-[#14B8A6]/5 rounded-full blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-gradient-to-tr from-[#FF7A59]/10 to-[#FF7A59]/5 rounded-full blur-3xl" />
            
            <div className="relative bg-white rounded-3xl shadow-[0_20px_80px_rgba(0,0,0,0.08)] border border-neutral-100 overflow-hidden">
              <div className="p-12 md:p-16">
                {/* Icon */}
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.4, duration: 0.6, type: "spring", stiffness: 120 }}
                  className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-[#0D9488] to-[#14B8A6] shadow-lg mb-8"
                >
                  <TrendingUp className="w-10 h-10 text-white" strokeWidth={2.5} />
                </motion.div>

                {/* Main Statistic */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                  className="mb-8"
                >
                  <div className="flex items-baseline gap-3 mb-4">
                    <span className="text-8xl md:text-9xl bg-gradient-to-r from-[#0D9488] to-[#14B8A6] bg-clip-text text-transparent">
                      {screen.stat_number || '3×'}
                    </span>
                  </div>
                  
                  <h2 className="text-3xl md:text-4xl text-neutral-900 mb-4 leading-tight">
                    {screen.stat_text || 'better long-term results with medical supervision'}
                  </h2>
                  
                  {screen.stat_subtitle && (
                    <p className="text-xl text-neutral-600 leading-relaxed">
                      {screen.stat_subtitle}
                    </p>
                  )}
                </motion.div>

                {/* Supporting Stats Grid */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                  className="grid md:grid-cols-2 gap-6 mb-10 p-6 bg-gradient-to-br from-[#F8FCF9] to-[#FDFBF7] rounded-2xl border border-neutral-100"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center">
                      <Users className="w-6 h-6 text-[#0D9488]" />
                    </div>
                    <div>
                      <div className="text-2xl text-neutral-900 mb-1">82%</div>
                      <div className="text-sm text-neutral-600">of members reached their goals</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center">
                      <Award className="w-6 h-6 text-[#FF7A59]" />
                    </div>
                    <div>
                      <div className="text-2xl text-neutral-900 mb-1">94%</div>
                      <div className="text-sm text-neutral-600">Report improved confidence</div>
                    </div>
                  </div>
                </motion.div>

                {/* CTA Button */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.7, duration: 0.5 }}
                >
                  <motion.button
                    onClick={onSubmit}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="group bg-gradient-to-r from-[#0D9488] to-[#14B8A6] text-white px-10 py-5 rounded-full flex items-center gap-3 shadow-[0_10px_40px_rgba(13,148,136,0.3)] hover:shadow-[0_20px_60px_rgba(13,148,136,0.4)] transition-all duration-300"
                  >
                    <span className="font-semibold text-lg">Continue</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </motion.button>
                </motion.div>

                {/* Disclaimer */}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8, duration: 0.5 }}
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
        <div className="w-full max-w-5xl">
          {/* Main Content Card */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6, type: "spring", stiffness: 100 }}
            className="relative"
          >
            {/* Decorative background elements */}
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-gradient-to-br from-blue-500/10 to-[#0D9488]/5 rounded-full blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-gradient-to-tr from-[#0D9488]/10 to-blue-500/5 rounded-full blur-3xl" />
            
            <div className="relative bg-white rounded-3xl shadow-[0_20px_80px_rgba(0,0,0,0.08)] border border-neutral-100 overflow-hidden">
              <div className="p-12 md:p-16">
                {/* Icon */}
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.4, duration: 0.6, type: "spring", stiffness: 120 }}
                  className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-600 to-[#0D9488] shadow-lg mb-8"
                >
                  <FlaskConical className="w-10 h-10 text-white" strokeWidth={2.5} />
                </motion.div>

                {/* Main Statistic */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                  className="mb-8"
                >
                  <div className="flex items-baseline gap-3 mb-4">
                    <span className="text-8xl md:text-9xl bg-gradient-to-r from-blue-600 to-[#0D9488] bg-clip-text text-transparent">
                      {screen.stat_number || '50+'}
                    </span>
                  </div>
                  
                  <h2 className="text-3xl md:text-4xl text-neutral-900 mb-4 leading-tight">
                    {screen.stat_text || 'clinical studies validate our approach'}
                  </h2>
                  
                  {screen.stat_subtitle && (
                    <p className="text-xl text-neutral-600 leading-relaxed">
                      {screen.stat_subtitle}
                    </p>
                  )}
                </motion.div>

                {/* Supporting Stats Grid */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                  className="grid md:grid-cols-2 gap-6 mb-10 p-6 bg-gradient-to-br from-blue-50/50 to-[#F8FCF9] rounded-2xl border border-neutral-100"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center">
                      <Brain className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <div className="text-2xl text-neutral-900 mb-1">Peer-reviewed</div>
                      <div className="text-sm text-neutral-600">Published in leading journals</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center">
                      <Shield className="w-6 h-6 text-[#0D9488]" />
                    </div>
                    <div>
                      <div className="text-2xl text-neutral-900 mb-1">FDA-approved</div>
                      <div className="text-sm text-neutral-600">Safe, effective medications</div>
                    </div>
                  </div>
                </motion.div>

                {/* CTA Button */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.7, duration: 0.5 }}
                >
                  <motion.button
                    onClick={onSubmit}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="group bg-gradient-to-r from-[#0D9488] to-[#14B8A6] text-white px-10 py-5 rounded-full flex items-center gap-3 shadow-[0_10px_40px_rgba(13,148,136,0.3)] hover:shadow-[0_20px_60px_rgba(13,148,136,0.4)] transition-all duration-300"
                  >
                    <span className="font-semibold text-lg">Continue</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </motion.button>
                </motion.div>

                {/* Disclaimer */}
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
        <div className="w-full max-w-5xl">
          {/* Main Content Card */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6, type: "spring", stiffness: 100 }}
            className="relative"
          >
            {/* Decorative background elements */}
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-gradient-to-br from-[#FF7A59]/10 to-[#0D9488]/5 rounded-full blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-gradient-to-tr from-[#0D9488]/10 to-[#FF7A59]/5 rounded-full blur-3xl" />
            
            <div className="relative bg-white rounded-3xl shadow-[0_20px_80px_rgba(0,0,0,0.08)] border border-neutral-100 overflow-hidden">
              <div className="p-12 md:p-16">
                {/* Main Statistic */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                  className="mb-8"
                >
                  <div className="flex items-baseline gap-3 mb-4">
                    <span className="text-8xl md:text-9xl bg-gradient-to-r from-[#FF7A59] to-[#0D9488] bg-clip-text text-transparent">
                      {screen.stat_number || '100%'}
                    </span>
                  </div>
                  
                  <h2 className="text-3xl md:text-4xl text-neutral-900 mb-4 leading-tight">
                    {screen.stat_text || 'personalized to your unique health profile'}
                  </h2>
                  
                  {screen.stat_subtitle && (
                    <p className="text-xl text-neutral-600 leading-relaxed">
                      {screen.stat_subtitle}
                    </p>
                  )}
                </motion.div>

                {/* Supporting Stats Grid */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                  className="grid md:grid-cols-2 gap-6 mb-10 p-6 bg-gradient-to-br from-[#FFF5F3] to-[#F8FCF9] rounded-2xl border border-neutral-100"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center">
                      <Target className="w-6 h-6 text-[#FF7A59]" />
                    </div>
                    <div>
                      <div className="text-2xl text-neutral-900 mb-1">Custom dosing</div>
                      <div className="text-sm text-neutral-600">Adjusted to your body and goals</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center">
                      <Heart className="w-6 h-6 text-[#0D9488]" />
                    </div>
                    <div>
                      <div className="text-2xl text-neutral-900 mb-1">Ongoing support</div>
                      <div className="text-sm text-neutral-600">Your care team adapts with you</div>
                    </div>
                  </div>
                </motion.div>

                {/* CTA Button */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.7, duration: 0.5 }}
                >
                  <motion.button
                    onClick={onSubmit}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="group bg-gradient-to-r from-[#0D9488] to-[#14B8A6] text-white px-10 py-5 rounded-full flex items-center gap-3 shadow-[0_10px_40px_rgba(13,148,136,0.3)] hover:shadow-[0_20px_60px_rgba(13,148,136,0.4)] transition-all duration-300"
                  >
                    <span className="font-semibold text-lg">Continue</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </motion.button>
                </motion.div>

                {/* Disclaimer */}
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

  // TESTIMONIAL VARIANT - Before/after success stories
  if (variant === 'testimonial') {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.6 }}
        className="min-h-screen flex items-center justify-center p-4 py-6"
      >
        <div className="w-full max-w-4xl">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-center mb-8"
          >
            <p className="text-sm text-neutral-500 mb-2">{screen.testimonial_subtitle}</p>
            <h2 className="text-4xl md:text-5xl mb-3">
              <span className="text-neutral-900">Real </span>
              <span className="text-[#FF7A59]">results</span>
              <span className="text-neutral-900"> start here</span>
            </h2>
            <p className="text-neutral-600">
              {screen.testimonial_title || 'Join others who are loving their progress so far.'}
            </p>
          </motion.div>

          {/* Testimonials Grid */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {screen.testimonials?.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
                className="bg-gradient-to-br from-[#FDFBF7] to-white rounded-2xl p-6 shadow-lg border border-neutral-200/50"
              >
                {/* Before/After Images */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-neutral-100">
                    {testimonial.before_image ? (
                      <ImageWithFallback
                        src={testimonial.before_image}
                        alt={`${testimonial.name} before`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-neutral-200 to-neutral-300" />
                    )}
                    <div className="absolute bottom-2 left-2 bg-[#F5C451] text-neutral-900 text-xs px-2 py-1 rounded-md font-semibold">
                      Before
                    </div>
                  </div>
                  <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-neutral-100">
                    {testimonial.after_image ? (
                      <ImageWithFallback
                        src={testimonial.after_image}
                        alt={`${testimonial.name} after`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-neutral-200 to-neutral-300" />
                    )}
                    <div className="absolute bottom-2 left-2 bg-[#F5C451] text-neutral-900 text-xs px-2 py-1 rounded-md font-semibold">
                      After
                    </div>
                  </div>
                </div>

                {/* Testimonial Info */}
                <p className="text-sm text-neutral-600 mb-2">
                  {testimonial.name}, {testimonial.age}
                </p>
                <p className="text-lg mb-1">
                  <span className="text-neutral-900">Lost </span>
                  <span className="text-[#FF7A59] font-semibold">{testimonial.result}</span>
                </p>
                <p className="text-sm text-neutral-500">{testimonial.timeframe}</p>
              </motion.div>
            ))}
          </div>

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

          {/* Dots Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="flex justify-center gap-2 mt-6"
          >
            <div className="w-2 h-2 rounded-full bg-neutral-400" />
            <div className="w-2 h-2 rounded-full bg-neutral-300" />
            <div className="w-2 h-2 rounded-full bg-neutral-300" />
          </motion.div>
        </div>
      </motion.div>
    );
  }

  // PROVIDER_INTRO VARIANT - Meet your care team
  if (variant === 'provider_intro') {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.6 }}
        className="min-h-screen flex items-center justify-center p-6 md:p-8 bg-gradient-to-br from-[#FDFBF7] via-white to-[#F0FDF4]"
      >
        <div className="w-full max-w-3xl">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6, type: "spring", stiffness: 100 }}
            className="relative bg-white rounded-3xl shadow-[0_20px_80px_rgba(0,0,0,0.08)] border border-neutral-100 overflow-hidden"
          >
            <div className="p-10 md:p-14 text-center">
              {/* Provider Photo */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5, type: "spring", stiffness: 120 }}
                className="mb-8"
              >
                <div className="relative inline-block">
                  <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-xl mx-auto">
                    <ImageWithFallback
                      src={screen.provider_image || 'https://images.unsplash.com/photo-1659353888906-adb3e0041693?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmllbmRseSUyMGRvY3RvciUyMHdvbWFuJTIwaGVhbHRoY2FyZSUyMHByb2Zlc3Npb25hbHxlbnwxfHx8fDE3NjEzNzk4NDJ8MA&ixlib=rb-4.1.0&q=80&w=400'}
                      alt={screen.provider_name || 'Healthcare Provider'}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {/* Verified Badge */}
                  <div className="absolute bottom-0 right-0 w-10 h-10 bg-gradient-to-br from-[#0D9488] to-[#14B8A6] rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                    <CheckCircle2 className="w-5 h-5 text-white" strokeWidth={2.5} />
                  </div>
                </div>
              </motion.div>

              {/* Title */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="mb-8"
              >
                <h2 className="text-3xl md:text-4xl text-neutral-900 mb-2">
                  {screen.title || 'Meet Your Care Team'}
                </h2>
                {screen.subtitle && (
                  <p className="text-lg text-neutral-600">{screen.subtitle}</p>
                )}
              </motion.div>

              {/* Provider Info */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="mb-8"
              >
                <p className="text-xl text-neutral-900 mb-1">
                  {screen.provider_name || 'Dr. Sarah Chen, MD'}
                </p>
                <p className="text-base text-neutral-500">
                  {screen.provider_title || 'Medical Director'}
                </p>
              </motion.div>

              {/* Message */}
              {screen.message && (
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.7, duration: 0.5 }}
                  className="mb-8 px-4 md:px-8"
                >
                  <div className="relative">
                    <div className="absolute -top-4 -left-2 text-6xl text-[#0D9488]/10">"</div>
                    <p className="text-lg text-neutral-700 leading-relaxed italic relative z-10">
                      {screen.message}
                    </p>
                  </div>
                </motion.div>
              )}

              {/* Trust Badges */}
              {screen.trust_badges && screen.trust_badges.length > 0 && (
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.8, duration: 0.5 }}
                  className="mb-10 space-y-3"
                >
                  {screen.trust_badges.map((badge, idx) => (
                    <div key={idx} className="flex items-center justify-center gap-2 text-sm text-neutral-600">
                      <CheckCircle2 className="w-4 h-4 text-[#0D9488]" />
                      <span>{badge}</span>
                    </div>
                  ))}
                </motion.div>
              )}

              {/* CTA Button */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.9, duration: 0.5 }}
              >
                <motion.button
                  onClick={onSubmit}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="group bg-gradient-to-r from-[#0D9488] to-[#14B8A6] text-white px-10 py-5 rounded-full flex items-center gap-3 mx-auto shadow-[0_10px_40px_rgba(13,148,136,0.3)] hover:shadow-[0_20px_60px_rgba(13,148,136,0.4)] transition-all duration-300"
                >
                  <span className="font-semibold text-lg">Continue</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                </motion.button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    );
  }

  // PROVIDER_ENCOURAGEMENT VARIANT - Progress check with provider support
  if (variant === 'provider_encouragement') {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.6 }}
        className="min-h-screen flex items-center justify-center p-6 md:p-8 bg-gradient-to-br from-[#FDFBF7] via-white to-[#FFF5F3]"
      >
        <div className="w-full max-w-4xl">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6, type: "spring", stiffness: 100 }}
            className="relative bg-white rounded-3xl shadow-[0_20px_80px_rgba(0,0,0,0.08)] border border-neutral-100 overflow-hidden"
          >
            <div className="grid md:grid-cols-[300px_1fr] gap-0">
              {/* Left: Provider Photo */}
              <motion.div
                initial={{ x: -30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="relative bg-gradient-to-br from-[#0D9488]/5 to-[#FF7A59]/5 p-8 flex items-center justify-center"
              >
                <div className="relative">
                  <div className="w-48 h-48 rounded-2xl overflow-hidden shadow-xl">
                    <ImageWithFallback
                      src={screen.provider_image || 'https://images.unsplash.com/photo-1676552055618-22ec8cde399a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbWlsaW5nJTIwbnVyc2UlMjBwcmFjdGl0aW9uZXIlMjBwb3J0cmFpdHxlbnwxfHx8fDE3NjEzNzk4NDh8MA&ixlib=rb-4.1.0&q=80&w=400'}
                      alt={screen.provider_name || 'Healthcare Provider'}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="mt-4 text-center">
                    <p className="text-base text-neutral-900 mb-1">
                      {screen.provider_name || 'Jessica Martinez'}
                    </p>
                    <p className="text-sm text-neutral-500">
                      {screen.provider_title || 'Nurse Practitioner'}
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Right: Content */}
              <div className="p-10 md:p-12 flex flex-col justify-center">
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                >
                  {/* Progress Stat */}
                  {screen.progress_stat && (
                    <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#FF7A59]/10 to-[#FF9A7F]/10 px-4 py-2 rounded-full mb-6">
                      <Sparkles className="w-4 h-4 text-[#FF7A59]" />
                      <span className="text-sm text-[#FF7A59]">{screen.progress_stat}</span>
                    </div>
                  )}

                  <h2 className="text-3xl md:text-4xl text-neutral-900 mb-4">
                    {screen.title || "You're doing great!"}
                  </h2>
                  
                  {screen.subtitle && (
                    <p className="text-lg text-neutral-600 mb-6">{screen.subtitle}</p>
                  )}

                  {/* Message */}
                  {screen.message && (
                    <div className="mb-8 p-6 bg-gradient-to-br from-[#F8FCF9] to-[#FDFBF7] rounded-2xl border border-neutral-100">
                      <p className="text-base text-neutral-700 leading-relaxed">
                        {screen.message}
                      </p>
                    </div>
                  )}

                  {/* CTA Button */}
                  <motion.button
                    onClick={onSubmit}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="group bg-gradient-to-r from-[#0D9488] to-[#14B8A6] text-white px-8 py-4 rounded-full flex items-center gap-3 shadow-[0_10px_40px_rgba(13,148,136,0.3)] hover:shadow-[0_20px_60px_rgba(13,148,136,0.4)] transition-all duration-300"
                  >
                    <span className="font-semibold">Keep Going</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </motion.button>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    );
  }

  // PROVIDER_COMPASSION VARIANT - Emotional support and partnership
  if (variant === 'provider_compassion') {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.6 }}
        className="min-h-screen flex items-center justify-center p-6 md:p-8 bg-gradient-to-br from-[#FDFBF7] via-white to-[#F0FDF4]"
      >
        <div className="w-full max-w-5xl">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6, type: "spring", stiffness: 100 }}
            className="relative rounded-3xl overflow-hidden shadow-[0_20px_80px_rgba(0,0,0,0.12)]"
          >
            {/* Hero Image with Overlay */}
            <div className="relative h-64 md:h-80">
              <ImageWithFallback
                src={screen.provider_image || 'https://images.unsplash.com/photo-1659353888906-adb3e0041693?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb25maWRlbnQlMjBkb2N0b3IlMjBjb25zdWx0YXRpb24lMjBoZWFsdGhjYXJlfGVufDF8fHx8MTc2MTM3OTg1MHww&ixlib=rb-4.1.0&q=80&w=1080'}
                alt={screen.provider_name || 'Healthcare Provider'}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
              
              {/* Provider Info Overlay */}
              <div className="absolute bottom-6 left-6 md:left-10 text-white">
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                >
                  <p className="text-xl md:text-2xl mb-1">
                    {screen.provider_name || 'Dr. Michael Thompson, DO'}
                  </p>
                  <p className="text-sm md:text-base text-white/90">
                    {screen.provider_title || 'Obesity Medicine Specialist'}
                  </p>
                </motion.div>
              </div>
            </div>

            {/* Content */}
            <div className="bg-white p-10 md:p-14">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                <h2 className="text-3xl md:text-4xl text-neutral-900 mb-4">
                  {screen.title || 'Your health journey matters to us'}
                </h2>
                
                {screen.subtitle && (
                  <p className="text-xl text-neutral-600 mb-8">{screen.subtitle}</p>
                )}

                {/* Message */}
                {screen.message && (
                  <div className="mb-8 p-8 bg-gradient-to-br from-[#F8FCF9] to-[#FDFBF7] rounded-2xl border-l-4 border-[#0D9488]">
                    <p className="text-lg text-neutral-700 leading-relaxed">
                      {screen.message}
                    </p>
                  </div>
                )}

                {/* Supporting Text */}
                {screen.supporting_text && (
                  <div className="flex items-start gap-3 mb-10 p-6 bg-gradient-to-r from-[#0D9488]/5 to-[#14B8A6]/5 rounded-xl">
                    <Heart className="w-6 h-6 text-[#FF7A59] flex-shrink-0 mt-1" />
                    <p className="text-base text-neutral-700">{screen.supporting_text}</p>
                  </div>
                )}

                {/* CTA Button */}
                <motion.button
                  onClick={onSubmit}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="group bg-gradient-to-r from-[#0D9488] to-[#14B8A6] text-white px-10 py-5 rounded-full flex items-center gap-3 shadow-[0_10px_40px_rgba(13,148,136,0.3)] hover:shadow-[0_20px_60px_rgba(13,148,136,0.4)] transition-all duration-300"
                >
                  <span className="font-semibold text-lg">Continue</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                </motion.button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    );
  }

  // PROVIDER_GUIDANCE VARIANT - Expert medication guidance
  if (variant === 'provider_guidance') {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.6 }}
        className="min-h-screen flex items-center justify-center p-6 md:p-8 bg-gradient-to-br from-[#FDFBF7] via-white to-[#EFF6FF]"
      >
        <div className="w-full max-w-5xl">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6, type: "spring", stiffness: 100 }}
            className="relative bg-white rounded-3xl shadow-[0_20px_80px_rgba(0,0,0,0.08)] border border-neutral-100 overflow-hidden"
          >
            <div className="grid md:grid-cols-2 gap-0">
              {/* Left: Provider Info & Photo */}
              <div className="relative bg-gradient-to-br from-[#0D9488] to-[#14B8A6] p-10 md:p-12 flex flex-col justify-center text-white">
                <motion.div
                  initial={{ x: -30, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                >
                  {/* Provider Photo */}
                  <div className="mb-8">
                    <div className="w-32 h-32 rounded-2xl overflow-hidden border-4 border-white/20 shadow-xl">
                      <ImageWithFallback
                        src={screen.provider_image || 'https://images.unsplash.com/photo-1659353888906-adb3e0041693?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmllbmRseSUyMGRvY3RvciUyMHdvbWFuJTIwaGVhbHRoY2FyZSUyMHByb2Zlc3Npb25hbHxlbnwxfHx8fDE3NjEzNzk4NDJ8MA&ixlib=rb-4.1.0&q=80&w=400'}
                        alt={screen.provider_name || 'Healthcare Provider'}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  <p className="text-2xl mb-2">
                    {screen.provider_name || 'Dr. Sarah Chen, MD'}
                  </p>
                  <p className="text-base text-white/80 mb-6">
                    {screen.provider_title || 'Medical Director'}
                  </p>

                  {/* Stat Card */}
                  {screen.stat_number && (
                    <div className="p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
                      <div className="text-5xl mb-2">{screen.stat_number}</div>
                      <div className="text-sm text-white/90">{screen.stat_text || 'provider approval rate'}</div>
                    </div>
                  )}
                </motion.div>
              </div>

              {/* Right: Content */}
              <div className="p-10 md:p-12 flex flex-col justify-center">
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                >
                  <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500/10 to-[#0D9488]/10 px-4 py-2 rounded-full mb-6">
                    <FlaskConical className="w-4 h-4 text-[#0D9488]" />
                    <span className="text-sm text-[#0D9488]">Evidence-Based Care</span>
                  </div>

                  <h2 className="text-3xl md:text-4xl text-neutral-900 mb-4">
                    {screen.title || 'Let me help you choose'}
                  </h2>
                  
                  {screen.subtitle && (
                    <p className="text-lg text-neutral-600 mb-6">{screen.subtitle}</p>
                  )}

                  {/* Message */}
                  {screen.message && (
                    <div className="mb-8 p-6 bg-gradient-to-br from-[#F8FCF9] to-[#EFF6FF] rounded-xl border border-neutral-100">
                      <p className="text-base text-neutral-700 leading-relaxed">
                        {screen.message}
                      </p>
                    </div>
                  )}

                  {/* CTA Button */}
                  <motion.button
                    onClick={onSubmit}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="group bg-gradient-to-r from-[#0D9488] to-[#14B8A6] text-white px-8 py-4 rounded-full flex items-center gap-3 shadow-[0_10px_40px_rgba(13,148,136,0.3)] hover:shadow-[0_20px_60px_rgba(13,148,136,0.4)] transition-all duration-300"
                  >
                    <span className="font-semibold">Continue</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </motion.button>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    );
  }

  // PROVIDER_CONFIDENCE VARIANT - Final reassurance before checkout
  if (variant === 'provider_confidence') {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.6 }}
        className="min-h-screen flex items-center justify-center p-6 md:p-8 bg-gradient-to-br from-[#FDFBF7] via-white to-[#F0FDF4]"
      >
        <div className="w-full max-w-4xl">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6, type: "spring", stiffness: 100 }}
            className="relative bg-white rounded-3xl shadow-[0_20px_80px_rgba(0,0,0,0.08)] border border-neutral-100 overflow-hidden"
          >
            <div className="p-10 md:p-14">
              {/* Provider Photo - Top Center */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5, type: "spring", stiffness: 120 }}
                className="text-center mb-8"
              >
                <div className="relative inline-block">
                  <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-xl mx-auto ring-4 ring-[#0D9488]/10">
                    <ImageWithFallback
                      src={screen.provider_image || 'https://images.unsplash.com/photo-1659353888906-adb3e0041693?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb25maWRlbnQlMjBkb2N0b3IlMjBjb25zdWx0YXRpb24lMjBoZWFsdGhjYXJlfGVufDF8fHx8MTc2MTM3OTg1MHww&ixlib=rb-4.1.0&q=80&w=400'}
                      alt={screen.provider_name || 'Healthcare Provider'}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-lg text-neutral-900">
                    {screen.provider_name || 'Dr. Michael Thompson, DO'}
                  </p>
                  <p className="text-sm text-neutral-500">
                    {screen.provider_title || 'Obesity Medicine Specialist'}
                  </p>
                </div>
              </motion.div>

              {/* Title */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="text-center mb-8"
              >
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500/10 to-[#0D9488]/10 px-4 py-2 rounded-full mb-4">
                  <CheckCircle2 className="w-4 h-4 text-[#0D9488]" />
                  <span className="text-sm text-[#0D9488]">All Set!</span>
                </div>

                <h2 className="text-3xl md:text-4xl text-neutral-900 mb-4">
                  {screen.title || "You've made an excellent decision"}
                </h2>
                
                {screen.subtitle && (
                  <p className="text-lg text-neutral-600">{screen.subtitle}</p>
                )}
              </motion.div>

              {/* Message */}
              {screen.message && (
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                  className="mb-10 p-6 bg-gradient-to-br from-[#F8FCF9] to-[#FDFBF7] rounded-2xl border border-neutral-100"
                >
                  <p className="text-base text-neutral-700 leading-relaxed text-center">
                    {screen.message}
                  </p>
                </motion.div>
              )}

              {/* Next Steps */}
              {screen.next_steps && screen.next_steps.length > 0 && (
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.7, duration: 0.5 }}
                  className="mb-10"
                >
                  <h3 className="text-lg text-neutral-900 mb-6 text-center">What happens next:</h3>
                  <div className="space-y-4">
                    {screen.next_steps.map((step, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.8 + idx * 0.1, duration: 0.4 }}
                        className="flex items-start gap-4 p-4 bg-white rounded-xl border border-neutral-100 hover:border-[#0D9488]/30 transition-colors"
                      >
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-[#0D9488] to-[#14B8A6] flex items-center justify-center text-white shadow-sm">
                          {idx + 1}
                        </div>
                        <p className="text-sm text-neutral-700 pt-1">{step}</p>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* CTA Button */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1.2, duration: 0.5 }}
                className="text-center"
              >
                <motion.button
                  onClick={onSubmit}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="group bg-gradient-to-r from-[#0D9488] to-[#14B8A6] text-white px-10 py-5 rounded-full inline-flex items-center gap-3 shadow-[0_10px_40px_rgba(13,148,136,0.3)] hover:shadow-[0_20px_60px_rgba(13,148,136,0.4)] transition-all duration-300"
                >
                  <span className="font-semibold text-lg">Complete Order</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                </motion.button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    );
  }

  // WEIGHT_LOSS_GRAPH VARIANT - Show treatment impact with graph
  if (variant === 'weight_loss_graph') {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.6 }}
        className="min-h-screen flex items-center justify-center p-6 md:p-8 bg-gradient-to-br from-[#FDFBF7] via-white to-[#FFF5F3]"
      >
        <div className="w-full max-w-6xl">
          {/* Header */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-center mb-8"
          >
            {screen.title && (
              <h2 className="text-4xl md:text-5xl text-neutral-900 mb-4">
                {screen.title}
              </h2>
            )}
            {screen.subtitle && (
              <p className="text-lg md:text-xl text-neutral-600 max-w-2xl mx-auto">
                {screen.subtitle}
              </p>
            )}
          </motion.div>

          {/* Graph */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mb-8"
          >
            <WeightLossGraph companyName={screen.stat_highlight || 'ZAPPY'} />
          </motion.div>

          {/* Supporting Message */}
          {screen.message && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 2.2, duration: 0.5 }}
              className="text-center mb-10 max-w-2xl mx-auto"
            >
              <p className="text-base md:text-lg text-neutral-700 leading-relaxed">
                {screen.message}
              </p>
            </motion.div>
          )}

          {/* Stats Row */}
          {screen.stat_number && screen.stat_text && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 2.4, duration: 0.5 }}
              className="flex flex-wrap justify-center gap-8 mb-12"
            >
              <div className="text-center">
                <div className="text-5xl md:text-6xl bg-gradient-to-r from-[#FF6B4A] to-[#FF8A6B] bg-clip-text text-transparent mb-2">
                  {screen.stat_number}
                </div>
                <div className="text-sm text-neutral-600">{screen.stat_text}</div>
              </div>
              {screen.stat_subtitle && (
                <div className="text-center">
                  <div className="text-5xl md:text-6xl text-neutral-900 mb-2">
                    12
                  </div>
                  <div className="text-sm text-neutral-600">{screen.stat_subtitle}</div>
                </div>
              )}
            </motion.div>
          )}

          {/* CTA Button */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 2.6, duration: 0.5 }}
            className="flex justify-center"
          >
            <motion.button
              onClick={onSubmit}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="group bg-gradient-to-r from-[#0D9488] to-[#14B8A6] text-white px-10 py-5 rounded-full flex items-center gap-3 shadow-[0_10px_40px_rgba(13,148,136,0.3)] hover:shadow-[0_20px_60px_rgba(13,148,136,0.4)] transition-all duration-300"
            >
              <span className="font-semibold text-lg">See How It Works</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </motion.button>
          </motion.div>

          {/* Disclaimer */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.8, duration: 0.5 }}
            className="mt-8 text-xs text-neutral-500 text-center max-w-3xl mx-auto"
          >
            Results based on clinical studies of GLP-1 medications over 12 months. Individual results may vary. Always consult with a healthcare provider.
          </motion.p>
        </div>
      </motion.div>
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
      <div className="w-full max-w-3xl">
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
              <div className="text-[#FF7A59] font-serif text-2xl">
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
            <p className="text-4xl md:text-5xl text-[#C8A882] leading-snug">
              {screen.message || "We're building your personalized plan."}
            </p>
            <p className="text-4xl md:text-5xl text-[#C8A882] leading-snug">
              Our medical team will review your profile to find the treatment option that matches your goals.
            </p>
          </motion.div>

          {/* Next Button */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="flex justify-end"
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
