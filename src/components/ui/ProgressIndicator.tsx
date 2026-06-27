import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const SECTIONS = [
  { id: 'hero', label: 'Intro' },
  { id: 'timeline', label: 'Our Story' },
  { id: 'gallery', label: 'Moments' },
  { id: 'quotes', label: 'Quotes' },
  { id: 'loveletter', label: 'Letter' },
  { id: 'finale', label: 'Celebrate' },
];

export default function ProgressIndicator() {
  const [activeSection, setActiveSection] = useState('hero');

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight / 2;

      for (const section of SECTIONS) {
        const el = document.getElementById(section.id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleScrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      if ((window as any).lenis) {
        (window as any).lenis.scrollTo(element, { offset: -80, duration: 1.5 });
      } else {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <div className="fixed right-6 top-1/2 -translate-y-1/2 z-30 hidden md:flex flex-col gap-6 items-center">
      {SECTIONS.map((sec, index) => {
        const isActive = activeSection === sec.id;
        return (
          <div 
            key={sec.id} 
            className="group relative flex items-center justify-end cursor-pointer"
            onClick={() => handleScrollTo(sec.id)}
          >
            {/* Label popup on hover */}
            <span className="absolute right-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-[10px] uppercase tracking-widest text-gold whitespace-nowrap bg-love-dark/80 px-2 py-1 rounded border border-white/5 backdrop-blur-sm pointer-events-none">
              {sec.label}
            </span>

            {/* Connecting Line (drawn between dots) */}
            {index < SECTIONS.length - 1 && (
              <div className="absolute top-3 w-[1px] h-8 bg-white/10 left-1/2 -translate-x-1/2 pointer-events-none" />
            )}

            {/* Dot indicator */}
            <motion.div
              className={`w-2.5 h-2.5 rounded-full border relative z-10 hover-target ${
                isActive 
                  ? 'bg-gold border-gold' 
                  : 'bg-transparent border-soft-pink/40 group-hover:border-soft-pink'
              }`}
              animate={{
                scale: isActive ? 1.3 : 1,
              }}
              transition={{ type: 'spring', stiffness: 300, damping: 15 }}
            >
              {isActive && (
                <motion.div 
                  className="absolute -inset-1.5 rounded-full border border-gold/40 animate-ping"
                  layoutId="pulseDot"
                />
              )}
            </motion.div>
          </div>
        );
      })}
    </div>
  );
}
