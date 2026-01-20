import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, User, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Book Court', href: '/book' },
  { name: 'Membership', href: '/membership' },
  { name: 'About', href: '/about' },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <header className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
      isHome ? "bg-transparent" : "bg-background/95 backdrop-blur-md border-b border-border"
    )}>
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 sm:h-20 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 sm:gap-3 touch-manipulation">
            <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-court to-court-dark flex items-center justify-center shadow-court flex-shrink-0">
              <span className="text-lg sm:text-xl font-bold text-white font-display">B</span>
              <div className="absolute -right-0.5 -bottom-0.5 w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-tennis-yellow shadow-sm" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className={cn(
                "text-sm sm:text-lg font-bold font-display tracking-tight truncate",
                isHome ? "text-white" : "text-foreground"
              )}>
                Buwate Tennis
              </span>
              <span className={cn(
                "text-[10px] sm:text-xs tracking-widest uppercase",
                isHome ? "text-white/70" : "text-muted-foreground"
              )}>
                Club
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "text-sm font-medium transition-colors relative py-2",
                  isHome 
                    ? "text-white/80 hover:text-white" 
                    : "text-muted-foreground hover:text-foreground",
                  location.pathname === item.href && (isHome ? "text-white" : "text-foreground")
                )}
              >
                {item.name}
                {location.pathname === item.href && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold rounded-full"
                  />
                )}
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="hidden lg:flex items-center gap-3">
            <Button 
              variant={isHome ? "glass" : "ghost"} 
              size="sm"
              asChild
            >
              <Link to="/auth">
                <LogIn className="w-4 h-4 mr-2" />
                Sign In
              </Link>
            </Button>
            <Button 
              variant="hero" 
              size="sm"
              asChild
            >
              <Link to="/book">
                Book Now
              </Link>
            </Button>
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            className={cn(
              "lg:hidden p-2.5 sm:p-3 rounded-xl transition-colors touch-manipulation active:scale-95",
              isHome ? "text-white hover:bg-white/10 active:bg-white/20" : "text-foreground hover:bg-muted active:bg-muted/80"
            )}
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="h-6 w-6 sm:h-7 sm:w-7" />
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm lg:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-[85vw] max-w-[320px] bg-background shadow-2xl lg:hidden z-50 overflow-y-auto"
            >
              <div className="flex items-center justify-between p-4 sm:p-5 border-b sticky top-0 bg-background z-10">
                <span className="font-display font-bold text-lg">Menu</span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-xl hover:bg-muted active:scale-95 touch-manipulation transition-all"
                  aria-label="Close menu"
                >
                  <X className="h-5 w-5 sm:h-6 sm:w-6" />
                </button>
              </div>
              <div className="p-4 sm:p-5 space-y-2">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "block px-4 py-3.5 rounded-xl text-base font-medium transition-all touch-manipulation active:scale-[0.98] min-h-[44px] flex items-center",
                      location.pathname === item.href
                        ? "bg-court/10 text-court font-semibold"
                        : "hover:bg-muted active:bg-muted/80"
                    )}
                  >
                    {item.name}
                  </Link>
                ))}
                <div className="pt-4 space-y-3 border-t border-border mt-4">
                  <Button variant="outline" className="w-full min-h-[48px] text-base font-medium touch-manipulation" asChild>
                    <Link to="/auth" onClick={() => setMobileMenuOpen(false)}>
                      <LogIn className="w-5 h-5 mr-2" />
                      Sign In
                    </Link>
                  </Button>
                  <Button variant="hero" className="w-full min-h-[48px] text-base font-medium touch-manipulation" asChild>
                    <Link to="/book" onClick={() => setMobileMenuOpen(false)}>
                      Book Now
                    </Link>
                  </Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
