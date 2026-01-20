import { motion } from 'framer-motion';
import { Calendar, Users, Trophy, Dumbbell, Shield, Sparkles } from 'lucide-react';

const features = [
  {
    icon: Calendar,
    title: 'Easy Online Booking',
    description: 'Book courts instantly with our intelligent AI assistant. Check availability, reserve slots, and manage your bookings 24/7.',
  },
  {
    icon: Users,
    title: 'Vibrant Community',
    description: 'Join 70+ passionate players. Connect with partners, participate in club events, and be part of Uganda\'s tennis family.',
  },
  {
    icon: Trophy,
    title: 'Tournaments & Events',
    description: 'Regular club tournaments, social events, and competitive leagues. From beginners to advanced players.',
  },
  {
    icon: Dumbbell,
    title: 'Professional Coaching',
    description: 'Expert coaches available for private sessions and academy training. Perfect your game at any skill level.',
  },
  {
    icon: Shield,
    title: 'Premium Clay Courts',
    description: 'Two professionally maintained clay courts. Enjoy the traditional surface that\'s easy on joints and great for rallies.',
  },
  {
    icon: Sparkles,
    title: 'AI-Powered Assistance',
    description: 'Our smart assistant helps with bookings, answers questions, and keeps you updated on club activities.',
  },
];

export function FeaturesSection() {
  return (
    <section className="py-16 sm:py-24 lg:py-32 bg-gradient-to-b from-background via-background to-muted/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 lg:mb-20"
        >
          <motion.span 
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block text-gold font-semibold text-xs sm:text-sm tracking-widest uppercase mb-3 sm:mb-4 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-gold/10 border border-gold/20"
          >
            Why Choose BTC
          </motion.span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold mt-4 sm:mt-6 mb-4 sm:mb-6 leading-tight px-2">
            Everything You Need for
            <br />
            <span className="text-gradient-court bg-gradient-to-r from-court to-court-light bg-clip-text text-transparent">
              Exceptional Tennis
            </span>
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg md:text-xl leading-relaxed max-w-2xl mx-auto px-4">
            From state-of-the-art facilities to a welcoming community, we provide the complete tennis experience designed for players of all levels.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8 max-w-7xl mx-auto">
          {features.map((feature, idx) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: idx * 0.08, duration: 0.5 }}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
              className="group relative p-8 rounded-2xl bg-card border border-border/50 hover:border-court/50 hover:shadow-xl transition-all duration-300 overflow-hidden"
            >
              {/* Hover effect background */}
              <div className="absolute inset-0 bg-gradient-to-br from-court/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="relative z-10">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-br from-court/15 to-court/5 flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg">
                  <feature.icon className="w-7 h-7 sm:w-8 sm:h-8 text-court" />
                </div>
                <h3 className="text-lg sm:text-xl font-display font-bold mb-3 sm:mb-4 text-foreground group-hover:text-court transition-colors">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed text-sm sm:text-[15px]">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
