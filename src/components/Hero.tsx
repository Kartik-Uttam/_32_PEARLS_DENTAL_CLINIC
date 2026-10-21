import React from 'react';
import { ArrowUpRight, ArrowRight, Star, Sparkles, MapPin } from 'lucide-react';
import { AnimatedTooth } from './AnimatedTooth';

interface HeroProps {
  onOpenBooking: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenBooking }) => {
  return (
    <section id="home" className="relative min-h-[640px] lg:min-h-[700px] flex items-center bg-[#eef4f1] overflow-hidden isolate">
      {/* Background Image with layered gradient overlays */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <img
          src="https://images.pexels.com/photos/5355920/pexels-photo-5355920.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=1600"
          alt="Modern bright dental treatment clinic environment"
          className="w-full h-full object-cover object-[70%_45%] filter brightness-[0.98]"
        />
        {/* Soft linear and radial gradient scrims for pristine readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#f7f9f3] via-[#f7f9f3]/95 sm:via-[#f7f9f3]/90 md:via-[#f7f9f3]/80 via-45% to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#eef4f1]/70 via-transparent to-transparent" />
      </div>

      {/* Decorative Curving Orbit Line */}
      <div
        className="absolute -bottom-24 -left-20 w-[650px] h-[300px] border border-teal-500/20 rounded-[50%] rotate-12 pointer-events-none -z-5"
        aria-hidden="true"
      />

      {/* Ambient Looping Animated Teeth in Empty Spaces */}
      {/* 1. Main Floating Tooth in the upper right airy sky area */}
      <div className="hidden lg:block absolute top-16 right-24 z-10">
        <AnimatedTooth
          size={74}
          variant="floating-pearl"
          delay={0}
          label="Gentle Care"
          className="filter drop-shadow-lg"
        />
      </div>

      {/* 2. Micro Sparkle Tooth in the center-right empty space */}
      <div className="hidden md:block absolute bottom-24 right-16 z-10">
        <AnimatedTooth
          size={52}
          variant="sparkle-duo"
          delay={1.6}
          label="32 Pearls"
        />
      </div>

      {/* 3. Floating Badge in the lower empty quadrant */}
      <div className="hidden sm:block absolute top-1/2 right-[18%] -translate-y-1/2 z-10 pointer-events-none">
        <AnimatedTooth
          variant="badge"
          delay={2.4}
          label="Est. 2008"
        />
      </div>

      {/* Main Content Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 w-full">
        <div className="max-w-2xl">
          {/* Eyebrow with Sparkle */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-100/70 border border-teal-200/80 text-teal-800 text-[11px] font-bold tracking-wider uppercase backdrop-blur-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-600 animate-pulse" />
            <span>A neighbourhood of smiles. Since 2008</span>
          </div>

          {/* Heading */}
          <h1 className="mt-5 text-4xl sm:text-6xl lg:text-7xl font-medium tracking-tight text-[#16333e] font-heading leading-[1.06]">
            32 Pearls
            <span className="block font-serif italic text-teal-700 font-normal mt-1 sm:mt-2 text-[1.12em] tracking-tight">
              Dental Care.
            </span>
          </h1>

          {/* Tagline */}
          <p className="mt-5 text-lg sm:text-xl font-semibold text-[#16333e] tracking-tight flex items-center gap-2">
            <span>Your Smile, Our Priority.</span>
          </p>

          {/* Description */}
          <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed max-w-lg">
            A little care goes a long way. Start your family's dental care journey with compassionate, modern dentistry right in Jalahalli East, Bengaluru.
          </p>

          {/* Action CTAs */}
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={onOpenBooking}
              className="inline-flex items-center justify-center gap-3 px-6 sm:px-7 py-3.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs sm:text-sm font-semibold tracking-wide shadow-md shadow-teal-900/15 hover:shadow-lg hover:shadow-teal-900/20 transition-all transform hover:-translate-y-0.5 focus:outline-hidden focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
            >
              <span>Book an Appointment</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>

            <a
              href="#treatments"
              className="inline-flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-semibold text-slate-700 hover:text-teal-700 group transition-colors"
            >
              <span className="border-b border-slate-300 group-hover:border-teal-600 pb-0.5 transition-colors">
                Explore our care
              </span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </a>
          </div>

          {/* Trust Highlights */}
          <div className="mt-10 pt-6 border-t border-slate-300/60 flex flex-wrap items-center gap-6 text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <div className="flex text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-current" />
                ))}
              </div>
              <span className="font-bold text-slate-800">4.9 / 5</span>
              <span className="text-slate-500">(154 Google Reviews)</span>
            </div>

            <div className="flex items-center gap-1.5 text-slate-600">
              <MapPin className="w-3.5 h-3.5 text-teal-600" />
              <span>Kalathur Layout, Jalahalli East</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
