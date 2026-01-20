import { motion } from 'framer-motion';
import { Check, Crown, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const pricingPlans = [
  {
    name: 'Per Hour',
    description: 'Pay as you play',
    icon: Star,
    featured: false,
    rates: [
      { type: 'Club Members', price: '10,000', unit: '/hour' },
      { type: 'Members\' Children', price: '5,000', unit: '/hour' },
      { type: 'Non-Members', price: '15,000', unit: '/hour' },
      { type: 'Non-Members\' Children', price: '10,000', unit: '/hour' },
    ],
    features: [
      'Book up to 1 hour sessions',
      '24 hours advance booking',
      '2 hour cancellation policy',
      'Access to both courts',
    ],
    cta: 'Book Now',
    href: '/book',
  },
  {
    name: 'Monthly',
    description: 'Unlimited court access',
    icon: Crown,
    featured: true,
    rates: [
      { type: 'Club Members', price: '150,000', unit: '/month' },
      { type: 'Non-Members', price: '200,000', unit: '/month' },
    ],
    features: [
      'Unlimited court bookings',
      'Priority booking access',
      'Access to club tournaments',
      'Member events & socials',
      'Discounted coaching rates',
    ],
    cta: 'Join Now',
    href: '/membership',
  },
];

export function PricingSection() {
  return (
    <section className="py-16 sm:py-24 lg:py-32 bg-gradient-to-b from-muted/30 via-background to-background relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-1/4 w-64 h-64 sm:w-96 sm:h-96 bg-court/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-64 h-64 sm:w-96 sm:h-96 bg-gold/5 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
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
            Transparent Pricing
          </motion.span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold mt-4 sm:mt-6 mb-4 sm:mb-6 leading-tight px-2">
            Fair & Affordable
            <br />
            <span className="text-gradient-court bg-gradient-to-r from-court to-court-light bg-clip-text text-transparent">
              Playing Rates
            </span>
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg md:text-xl leading-relaxed px-4">
            Affordable rates for everyone. Members enjoy significant discounts and exclusive benefits that make membership worthwhile.
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 lg:gap-8 max-w-6xl mx-auto">
          {pricingPlans.map((plan, idx) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: idx * 0.15, duration: 0.5, type: "spring", stiffness: 100 }}
              whileHover={{ scale: plan.featured ? 1.02 : 1.03, y: -5 }}
              className={`relative rounded-3xl overflow-hidden transition-all duration-300 ${
                plan.featured
                  ? 'bg-gradient-to-br from-court via-court-dark to-court-dark text-white shadow-2xl shadow-court/30 ring-4 ring-court/20'
                  : 'bg-card border-2 border-border/50 hover:border-court/50 shadow-xl hover:shadow-2xl'
              }`}
            >
              {plan.featured && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  className="absolute top-6 right-6 px-4 py-1.5 bg-gold text-foreground text-xs font-bold rounded-full shadow-lg uppercase tracking-wide"
                >
                  ⭐ Best Value
                </motion.div>
              )}

              <div className="p-6 sm:p-8 lg:p-10">
                {/* Header */}
                <div className="flex items-start gap-3 sm:gap-4 mb-5 sm:mb-6">
                  <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0 ${
                    plan.featured ? 'bg-white/20 backdrop-blur-sm' : 'bg-gradient-to-br from-court/15 to-court/5'
                  }`}>
                    <plan.icon className={`w-7 h-7 sm:w-8 sm:h-8 ${plan.featured ? 'text-gold' : 'text-court'}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl sm:text-2xl font-display font-bold mb-1">{plan.name}</h3>
                    <p className={`text-xs sm:text-sm font-medium ${plan.featured ? 'text-white/80' : 'text-muted-foreground'}`}>
                      {plan.description}
                    </p>
                  </div>
                </div>

                {/* Rates */}
                <div className="space-y-4 py-6 border-y border-white/10 mb-6">
                  {plan.rates.map((rate, rateIdx) => (
                    <motion.div 
                      key={rate.type}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.15 + rateIdx * 0.05 }}
                      className="flex justify-between items-center py-2"
                    >
                      <span className={`text-sm font-medium ${plan.featured ? 'text-white/90' : 'text-foreground'}`}>
                        {rate.type}
                      </span>
                      <div className="flex items-baseline gap-1.5">
                        <span className={`text-xs font-medium ${plan.featured ? 'text-white/70' : 'text-muted-foreground'}`}>
                          UGX
                        </span>
                        <span className={`text-2xl font-bold ${plan.featured ? 'text-gold' : 'text-court'}`}>
                          {rate.price}
                        </span>
                        <span className={`text-xs ${plan.featured ? 'text-white/60' : 'text-muted-foreground'}`}>
                          {rate.unit}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Features */}
                <ul className="space-y-3.5 mb-8">
                  {plan.features.map((feature, featureIdx) => (
                    <motion.li 
                      key={feature}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.15 + featureIdx * 0.05 }}
                      className="flex items-start gap-3.5"
                    >
                      <div className={`w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${
                        plan.featured ? 'bg-gold/20' : 'bg-court/10'
                      }`}>
                        <Check className={`w-4 h-4 ${plan.featured ? 'text-gold' : 'text-court'}`} />
                      </div>
                      <span className={`text-sm leading-relaxed ${plan.featured ? 'text-white/90' : 'text-muted-foreground'}`}>
                        {feature}
                      </span>
                    </motion.li>
                  ))}
                </ul>

                {/* CTA */}
                <Button
                  variant={plan.featured ? 'hero' : 'court'}
                  className={`w-full text-sm sm:text-base py-5 sm:py-6 font-semibold shadow-lg hover:shadow-xl transition-all touch-manipulation min-h-[52px] sm:min-h-[56px] ${
                    plan.featured ? 'bg-white text-court hover:bg-gold hover:text-foreground' : ''
                  }`}
                  size="lg"
                  asChild
                >
                  <Link to={plan.href}>{plan.cta}</Link>
                </Button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Payment Note */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="text-center mt-16 max-w-2xl mx-auto"
        >
          <div className="bg-muted/50 backdrop-blur-sm rounded-2xl p-6 border border-border/50">
            <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
              💳 <span className="font-semibold text-foreground">Payment Method:</span> Pay via{' '}
              <span className="text-gold font-semibold">Mobile Money (MoMo)</span> only.{' '}
              Cash payments are not accepted.
            </p>
            <p className="text-court font-bold text-lg mt-2">
              MoMo: 0790229161 (Brian Isubikalu)
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
