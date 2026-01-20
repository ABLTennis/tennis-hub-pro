import { motion } from 'framer-motion';
import { AlertTriangle, Ban, CreditCard, Clock, Shield, Leaf } from 'lucide-react';

const rules = [
  {
    icon: CreditCard,
    title: 'MoMo Payments Only',
    description: 'Pay court fees via Mobile Money to 0790229161 (Brian Isubikalu). Cash payments are NOT accepted.',
    type: 'important',
  },
  {
    icon: Clock,
    title: 'Booking Policy',
    description: 'Book at least 24 hours in advance. Maximum 1-hour sessions. Cancel at least 2 hours before your slot.',
    type: 'info',
  },
  {
    icon: Ban,
    title: 'Prohibited Items',
    description: 'Animals, pets, toys are NOT allowed inside the fenced court area. Smoking is prohibited.',
    type: 'warning',
  },
  {
    icon: Shield,
    title: 'Code of Conduct',
    description: 'Vulgar language, fighting, or aggressive behavior is not acceptable and may result in a ban.',
    type: 'warning',
  },
  {
    icon: Leaf,
    title: 'Court Care',
    description: 'Clay courts require care. Only racquets, tennis balls, and players should be on the play area.',
    type: 'info',
  },
  {
    icon: AlertTriangle,
    title: 'No Hawkers',
    description: 'Hawkers and unauthorized vendors are prohibited from accessing the facility.',
    type: 'info',
  },
];

export function RulesSection() {
  return (
    <section className="py-16 sm:py-24 lg:py-32 bg-gradient-to-b from-background via-muted/20 to-background relative">
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
            Club Guidelines
          </motion.span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold mt-4 sm:mt-6 mb-4 sm:mb-6 leading-tight px-2">
            Rules & 
            <br />
            <span className="text-gradient-court bg-gradient-to-r from-court to-court-light bg-clip-text text-transparent">
              Regulations
            </span>
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg md:text-xl leading-relaxed px-4">
            Help us maintain a safe, enjoyable, and professional environment for all members and guests. These guidelines ensure everyone has the best experience.
          </p>
        </motion.div>

        {/* Rules Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8 max-w-7xl mx-auto">
          {rules.map((rule, idx) => (
            <motion.div
              key={rule.title}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: idx * 0.08, duration: 0.5 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className={`group relative p-6 sm:p-8 rounded-xl sm:rounded-2xl border-2 transition-all duration-300 overflow-hidden ${
                rule.type === 'important'
                  ? 'bg-gradient-to-br from-gold/10 via-gold/5 to-transparent border-gold/40 hover:border-gold/60 shadow-lg hover:shadow-xl'
                  : rule.type === 'warning'
                  ? 'bg-gradient-to-br from-destructive/5 via-destructive/5 to-transparent border-destructive/30 hover:border-destructive/50 shadow-md hover:shadow-lg'
                  : 'bg-card border-border/50 hover:border-court/50 shadow-md hover:shadow-xl'
              }`}
            >
              {/* Hover effect overlay */}
              <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                rule.type === 'important' ? 'bg-gold/5' : rule.type === 'warning' ? 'bg-destructive/5' : 'bg-court/5'
              }`} />
              
              <div className="relative z-10">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg ${
                  rule.type === 'important'
                    ? 'bg-gradient-to-br from-gold/20 to-gold/10'
                    : rule.type === 'warning'
                    ? 'bg-gradient-to-br from-destructive/20 to-destructive/10'
                    : 'bg-gradient-to-br from-court/15 to-court/5'
                }`}>
                  <rule.icon className={`w-8 h-8 ${
                    rule.type === 'important'
                      ? 'text-gold-dark'
                      : rule.type === 'warning'
                      ? 'text-destructive'
                      : 'text-court'
                  }`} />
                </div>
                <h3 className="text-xl font-display font-bold mb-3 text-foreground group-hover:text-court transition-colors">
                  {rule.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {rule.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
