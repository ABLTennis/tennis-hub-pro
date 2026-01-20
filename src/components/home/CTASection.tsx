import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function CTASection() {
  return (
    <section className="py-16 sm:py-24 lg:py-32 relative overflow-hidden">
      {/* Background with gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-court via-court-dark to-court-dark" />
      <div className="absolute inset-0 bg-gradient-to-t from-court-dark via-transparent to-transparent" />
      <div className="absolute inset-0 court-pattern opacity-15" />
      
      {/* Animated decorative elements */}
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.2, 0.1]
        }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute top-20 left-20 w-96 h-96 rounded-full bg-gold/10 blur-3xl" 
      />
      <motion.div 
        animate={{ 
          scale: [1.2, 1, 1.2],
          opacity: [0.15, 0.25, 0.15]
        }}
        transition={{ duration: 10, repeat: Infinity }}
        className="absolute bottom-20 right-20 w-[500px] h-[500px] rounded-full bg-gold/10 blur-3xl" 
      />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-court/5 blur-3xl" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="max-w-4xl mx-auto text-center"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: -10 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-flex items-center gap-2 px-3 sm:px-5 py-2 sm:py-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white shadow-lg mb-6 sm:mb-10"
          >
            <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gold animate-pulse flex-shrink-0" />
            <span className="font-semibold text-xs sm:text-sm tracking-wide">Join Our Tennis Community</span>
          </motion.div>

          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-display font-bold text-white leading-[1.1] tracking-tight mb-6 sm:mb-8 px-2"
          >
            Ready to Hit the Court?
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="text-lg sm:text-xl md:text-2xl text-white/90 mb-8 sm:mb-12 max-w-3xl mx-auto leading-relaxed font-light px-4"
          >
            Whether you're a seasoned player or picking up a racquet for the first time, 
            BTC welcomes you. Join us and be part of Uganda's most vibrant tennis community.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row flex-wrap justify-center gap-3 sm:gap-4 mb-10 sm:mb-16 px-4"
          >
            <Button variant="hero" size="xl" className="text-sm sm:text-base px-6 sm:px-8 py-5 sm:py-6 shadow-2xl hover:shadow-3xl hover:scale-105 transition-all font-semibold w-full sm:w-auto touch-manipulation min-h-[52px] sm:min-h-[56px]" asChild>
              <Link to="/membership">
                Become a Member
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
              </Link>
            </Button>
            <Button variant="glass" size="xl" className="text-sm sm:text-base px-6 sm:px-8 py-5 sm:py-6 backdrop-blur-md border-white/30 hover:bg-white/15 hover:scale-105 transition-all font-semibold w-full sm:w-auto touch-manipulation min-h-[52px] sm:min-h-[56px]" asChild>
              <Link to="/book">
                Book a Court Now
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
              </Link>
            </Button>
          </motion.div>

          {/* Contact info */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
            className="mt-16 pt-10 border-t border-white/20"
          >
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 max-w-2xl mx-auto">
              <p className="text-white/80 text-sm md:text-base leading-relaxed mb-2">
                Have questions? We're here to help!
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4 text-sm md:text-base">
                <a href="tel:+256772675050" className="text-gold hover:text-gold-light font-semibold hover:underline transition-colors flex items-center gap-2">
                  <span>📞</span>
                  +256 772 675 050
                </a>
                <span className="text-white/40">•</span>
                <a href="mailto:btc2023@gmail.com" className="text-gold hover:text-gold-light font-semibold hover:underline transition-colors flex items-center gap-2">
                  <span>✉️</span>
                  btc2023@gmail.com
                </a>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
