import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, Users, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import heroImage from '@/assets/hero-court.jpg';

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Parallax Effect */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Buwate Tennis Club Courts"
          className="w-full h-full object-cover scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-court-dark/95 via-court-dark/85 to-court-dark/75" />
        <div className="absolute inset-0 bg-gradient-to-t from-court-dark via-transparent to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-court-dark/50 via-transparent to-transparent" />
      </div>

      {/* Court Pattern Overlay */}
      <div className="absolute inset-0 court-pattern opacity-20" />

      {/* Decorative Elements */}
      <div className="absolute top-20 right-20 w-72 h-72 bg-gold/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-20 w-96 h-96 bg-court/10 rounded-full blur-3xl" />

      {/* Content */}
      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24 pb-12 sm:pb-16">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="space-y-6 sm:space-y-8"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="inline-flex items-center gap-2 px-3 sm:px-5 py-2 sm:py-2.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white shadow-lg mb-6 sm:mb-10"
            >
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-gold animate-pulse" />
              <Trophy className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gold flex-shrink-0" />
              <span className="text-white font-medium text-xs sm:text-sm tracking-wide">Uganda's Premier Tennis Community</span>
            </motion.div>

            {/* Headline */}
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-display font-bold text-white leading-[1.1] tracking-tight"
            >
              Welcome to{' '}
              <span className="text-gradient-gold bg-gradient-to-r from-gold via-gold-light to-gold bg-clip-text text-transparent">
                Buwate
              </span>
              <br />
              <span className="text-white">Tennis Club</span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-lg sm:text-xl md:text-2xl text-white/90 max-w-3xl leading-relaxed font-light"
            >
              Experience world-class clay courts, a vibrant community, and professional coaching. 
              Join over 70 passionate players in Uganda's fastest-growing tennis club.
            </motion.p>

            {/* CTAs */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 pt-2"
            >
              <Button variant="hero" size="xl" className="text-sm sm:text-base px-6 sm:px-8 py-5 sm:py-6 shadow-xl hover:shadow-2xl transition-all w-full sm:w-auto touch-manipulation min-h-[52px] sm:min-h-[56px]" asChild>
                <Link to="/book">
                  <Calendar className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  Book a Court
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
                </Link>
              </Button>
              <Button variant="glass" size="xl" className="text-sm sm:text-base px-6 sm:px-8 py-5 sm:py-6 backdrop-blur-md border-white/20 hover:bg-white/10 transition-all w-full sm:w-auto touch-manipulation min-h-[52px] sm:min-h-[56px]" asChild>
                <Link to="/membership">
                  <Users className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  Join the Club
                </Link>
              </Button>
            </motion.div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.7 }}
            className="mt-12 sm:mt-16 lg:mt-20 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 md:gap-6"
          >
            {[
              { value: '2', label: 'Clay Courts', sublabel: 'Professional Grade' },
              { value: '70+', label: 'Active Members', sublabel: 'Growing Community' },
              { value: '2', label: 'Pro Coaches', sublabel: 'Expert Training' },
              { value: '10K', label: 'UGX/Hour', sublabel: 'Member Rate' },
            ].map((stat, idx) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 0.7 + idx * 0.1, type: "spring", stiffness: 200 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="glass-dark rounded-xl sm:rounded-2xl p-4 sm:p-6 text-center border border-white/10 hover:border-white/20 transition-all cursor-default group"
              >
                <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gold mb-1 sm:mb-2 group-hover:scale-110 transition-transform">
                  {stat.value}
                </div>
                <div className="text-sm sm:text-base font-semibold text-white mb-0.5 sm:mb-1">{stat.label}</div>
                <div className="text-[10px] sm:text-xs text-white/60">{stat.sublabel}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator - Hidden on mobile */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="hidden sm:flex absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 z-10 flex-col items-center"
      >
        <motion.div
          animate={{ y: [0, 12, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-6 h-12 rounded-full border-2 border-white/40 backdrop-blur-sm bg-white/5 flex items-start justify-center pt-2 cursor-pointer hover:border-white/60 transition-colors"
        >
          <div className="w-1.5 h-4 rounded-full bg-gold" />
        </motion.div>
        <p className="text-white/60 text-xs mt-2 text-center">Scroll to explore</p>
      </motion.div>
    </section>
  );
}
