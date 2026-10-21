import React, { useState, useEffect } from 'react';
import { Star, ArrowUpRight, ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import { motion } from 'motion/react';
import { AnimatedTooth } from './AnimatedTooth';

export const ReviewsSection: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const slides = [
    {
      kicker: 'A reason to smile',
      number: '4.9',
      sub: '/ 5',
      note: 'Verified Google rating supplied by the clinic. Read genuine patient feedback directly on Google Maps.',
    },
    {
      kicker: 'Experiences that matter',
      number: '154',
      sub: 'reviews',
      note: '154 Google reviews from families across Jalahalli East, Vidyaranyapura, and Bengaluru North.',
    },
    {
      kicker: 'Compassionate Dentistry',
      number: '100%',
      sub: 'care',
      note: 'Focused on gentle, painless procedures with transparent advice and personalized treatment plans.',
    },
  ];

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5500);
    return () => clearInterval(timer);
  }, [isPaused, slides.length]);

  return (
    <section id="reviews" className="py-20 sm:py-28 bg-[#132f3a] text-white relative overflow-hidden isolate">
      {/* Background Decorative Orbit Rings */}
      <div
        className="absolute -right-36 -top-48 w-[650px] h-[650px] border border-teal-200/10 rounded-full pointer-events-none -z-10"
        aria-hidden="true"
      />
      <div
        className="absolute -right-20 -top-32 w-[520px] h-[520px] border border-teal-200/10 rounded-full pointer-events-none -z-10"
        aria-hidden="true"
      />

      {/* Luminous Ambient Tooth floating in the dark navy orbit space */}
      <div className="absolute top-16 right-16 lg:right-32 pointer-events-none hidden md:block">
        <AnimatedTooth
          size={60}
          variant="sparkle-duo"
          delay={0.8}
          label="4.9 Stars"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left Column */}
          <div>
            <div className="inline-flex items-center gap-2 text-teal-300 text-[11px] font-bold tracking-widest uppercase">
              <span className="w-6 h-px bg-teal-400" />
              <span>Patient voices</span>
            </div>

            <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-white font-heading leading-tight">
              Every smile<br />
              has <span className="font-serif italic text-teal-300 font-normal">a story.</span>
            </h2>

            <p className="mt-5 text-xs sm:text-sm text-slate-300 leading-relaxed max-w-md">
              The best way to get to know our clinic? Hear from people who have visited. We take immense pride in genuine smiles and high-quality dental experiences.
            </p>

            <a
              href="https://www.google.com/maps/search/?api=1&query=32+Pearls+Dental+Care+Jalahalli+East+Bengaluru"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 text-xs font-semibold text-teal-200 hover:text-white transition-colors group"
            >
              <span className="border-b border-teal-400/50 pb-0.5 group-hover:border-white">
                Read the reviews on Google
              </span>
              <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </div>

          {/* Right Column: Interactive Review Stage */}
          <div className="relative pl-0 lg:pl-10 lg:border-l border-white/15 min-h-[260px] flex flex-col justify-center">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, x: 14 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -14 }}
              transition={{ duration: 0.35 }}
              className="space-y-4"
            >
              {/* Kicker */}
              <div className="flex items-center gap-2 text-teal-300 text-xs tracking-wider uppercase font-semibold">
                <span className="text-lg font-bold bg-gradient-to-r from-blue-400 via-amber-300 to-green-400 bg-clip-text text-transparent">
                  G
                </span>
                <span>{slides[currentSlide].kicker}</span>
              </div>

              {/* Number and suffix */}
              <div className="flex items-baseline gap-2">
                <span className="text-6xl sm:text-7xl font-bold font-heading tracking-tight text-white">
                  {slides[currentSlide].number}
                </span>
                <span className="text-2xl text-teal-200 font-normal">
                  {slides[currentSlide].sub}
                </span>
              </div>

              {/* 5 Stars */}
              <div className="flex text-amber-400 gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>

              {/* Description note */}
              <p className="text-xs text-slate-300 max-w-sm leading-relaxed">
                {slides[currentSlide].note}
              </p>
            </motion.div>

            {/* Carousel Controls */}
            <div className="mt-8 flex items-center gap-2">
              <button
                type="button"
                onClick={() => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)}
                className="w-8 h-8 rounded-full border border-white/30 flex items-center justify-center hover:bg-white/10 text-white transition-colors"
                aria-label="Previous review highlight"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
                className="w-8 h-8 rounded-full border border-white/30 flex items-center justify-center hover:bg-white/10 text-white transition-colors"
                aria-label="Next review highlight"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setIsPaused(!isPaused)}
                className="w-8 h-8 rounded-full border border-white/30 flex items-center justify-center hover:bg-white/10 text-white transition-colors ml-1"
                aria-label={isPaused ? 'Resume auto carousel' : 'Pause auto carousel'}
              >
                {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
              </button>
              <span className="text-[10px] text-slate-400 ml-2">
                {currentSlide + 1} of {slides.length}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
