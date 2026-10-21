import React from 'react';
import { Star, ArrowUpRight, Award, HeartHandshake, ShieldCheck } from 'lucide-react';
import { AnimatedTooth } from './AnimatedTooth';

interface AboutSectionProps {
  onOpenBooking: () => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ onOpenBooking }) => {
  return (
    <section id="about" className="py-20 sm:py-28 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Photo & Ambient Elements */}
          <div className="relative">
            <div className="relative aspect-4/3 rounded-2xl overflow-hidden bg-teal-50 border border-slate-200 shadow-sm group">
              <img
                src="https://images.pexels.com/photos/5355863/pexels-photo-5355863.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200"
                alt="32 Pearls Dental Care clinic consultation room"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-3 left-4 right-4 text-white text-[10px] sm:text-xs opacity-90 drop-shadow-md">
                Bright, welcoming care setting designed for patient comfort.
              </div>
            </div>

            {/* Ambient Animated Tooth hovering next to photo border */}
            <div className="absolute -top-6 -right-6 z-10 hidden sm:block">
              <AnimatedTooth
                size={58}
                variant="floating-pearl"
                delay={0.8}
                label="Comfort First"
              />
            </div>

            {/* Floating Trust Badge */}
            <div className="absolute -bottom-5 -left-4 sm:left-6 bg-white/95 backdrop-blur-md px-4 py-3 rounded-xl border border-teal-100 shadow-lg flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800">18+ Years of Service</p>
                <p className="text-[10px] text-teal-700 font-medium">Serving Jalahalli East since 2008</p>
              </div>
            </div>
          </div>

          {/* Copy & Google Reviews */}
          <div className="lg:pl-6">
            <div className="inline-flex items-center gap-2 text-teal-700 text-[11px] font-bold tracking-widest uppercase">
              <span className="w-6 h-px bg-teal-600" />
              <span>A little about us</span>
            </div>

            <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-[#16333e] font-heading leading-tight">
              Good care starts with <br />
              feeling <span className="font-serif italic text-teal-700 font-normal">at home.</span>
            </h2>

            <p className="mt-6 text-sm text-slate-600 leading-relaxed">
              Since 2008, <strong>32 Pearls Dental Care</strong> has been an integral part of the Jalahalli East community. We are your neighbourhood point of contact for honest, evidence-based conversations about your family's oral health.
            </p>

            <p className="mt-3 text-sm text-slate-600 leading-relaxed">
              Whether you have an urgent toothache, an aesthetic goal like whitening, or a routine family check-up in mind, our gentle practitioners walk you through every option with warmth and transparency.
            </p>

            {/* Google Rating Card */}
            <div className="mt-8 pt-6 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <span className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 via-amber-500 to-green-600 bg-clip-text text-transparent">
                  G
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-900">4.9 / 5.0</span>
                    <div className="flex text-amber-500">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-current" />
                      ))}
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    154 Google reviews as supplied by patients
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={onOpenBooking}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-700 hover:text-teal-900 transition-colors"
              >
                <span>Request an appointment</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
