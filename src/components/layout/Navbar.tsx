import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll } from 'framer-motion';
import { Menu, X, Heart } from 'lucide-react';

const NAV_ITEMS = [
  { id: 'hero', label: 'Intro' },
  { id: 'timeline', label: 'Our Story' },
  { id: 'gallery', label: 'Moments' },
  { id: 'quotes', label: 'Quotes' },
  { id: 'loveletter', label: 'Letter' },
  { id: 'finale', label: 'Celebrate' },
];

export default function Navbar() {
  const [activeSection, setActiveSection] = useState('hero');
  const [visible, setVisible] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();

  useEffect(() => {
    let lastScrollY = 0;

    const handleScroll = () => {
      const currentScrollY = scrollY.get();
      
      // Determine if at top
      setScrolled(currentScrollY > 50);

      // Show/Hide navbar based on scroll direction
      if (currentScrollY <= 50) {
        setVisible(true);
      } else if (currentScrollY > lastScrollY) {
        setVisible(false); // Scrolling down
      } else {
        setVisible(true);  // Scrolling up
      }

      lastScrollY = currentScrollY;
    };

    const unsubscribe = scrollY.on('change', handleScroll);

    // Set up IntersectionObserver to detect active section
    const observerOptions = {
      root: null,
      rootMargin: '-50% 0px -50% 0px', // check elements in the center of the viewport
      threshold: 0,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    
    NAV_ITEMS.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });

    return () => {
      unsubscribe();
      observer.disconnect();
    };
  }, [scrollY]);

  // Smooth scroll handler
  const handleNavClick = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      // If Lenis smooth scroll is installed globally
      if ((window as any).lenis) {
        (window as any).lenis.scrollTo(element, { offset: -80, duration: 1.5 });
      } else {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <>
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 py-4 px-6 md:px-12 flex justify-between items-center ${
          scrolled 
            ? 'glass-panel-pink mx-4 mt-4 rounded-2xl border-white/10 shadow-lg' 
            : 'bg-transparent border-b border-transparent'
        }`}
        initial={{ y: -100 }}
        animate={{ y: visible ? 0 : -120 }}
        transition={{ type: 'spring', damping: 20, stiffness: 120 }}
      >
        {/* Scroll Progress Bar */}
        {scrolled && (
          <motion.div 
            className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-rose-gold to-gold origin-left rounded-b-2xl"
            style={{
              scaleX: scrollY.get() ? (scrollY.get() / (document.documentElement.scrollHeight - window.innerHeight)) : 0
            }}
          />
        )}

        {/* Brand Logo */}
        <div 
          onClick={() => handleNavClick('hero')} 
          className="flex items-center gap-2 cursor-pointer group"
        >
          <motion.div 
            whileHover={{ scale: 1.1, rotate: 15 }} 
            className="text-love-red drop-shadow-[0_0_8px_rgba(255,51,102,0.4)]"
          >
            <Heart size={20} fill="currentColor" />
          </motion.div>
          <span className="font-cursive text-3xl text-glow-pink text-soft-pink select-none group-hover:text-gold transition-colors duration-300">
            For My Love
          </span>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`relative py-1 text-sm font-light uppercase tracking-widest transition-colors duration-300 cursor-pointer ${
                activeSection === item.id ? 'text-gold' : 'text-soft-pink/70 hover:text-soft-pink'
              }`}
            >
              {item.label}
              {activeSection === item.id && (
                <motion.span
                  className="absolute bottom-0 left-0 right-0 h-[1px] bg-gold"
                  layoutId="activeIndicator"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden text-soft-pink hover:text-gold p-1 cursor-pointer transition-colors duration-300"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </motion.nav>

      {/* Mobile Glass Menu Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="fixed inset-0 z-35 bg-love-dark/95 backdrop-blur-xl flex flex-col justify-center items-center gap-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex flex-col gap-6 text-center">
              {NAV_ITEMS.map((item, idx) => (
                <motion.button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`text-2xl font-light uppercase tracking-widest transition-colors duration-300 cursor-pointer ${
                    activeSection === item.id ? 'text-gold font-medium' : 'text-soft-pink/75 hover:text-soft-pink'
                  }`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.08, type: 'spring', damping: 15 }}
                >
                  {item.label}
                </motion.button>
              ))}
            </div>

            <motion.div 
              className="absolute bottom-10 flex flex-col items-center gap-1 opacity-45"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.45 }}
              transition={{ delay: 0.5 }}
            >
              <Heart size={16} className="text-rose-gold animate-pulse" />
              <span className="text-xs uppercase tracking-widest text-rose-gold font-light">Rohi & Rohit</span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
