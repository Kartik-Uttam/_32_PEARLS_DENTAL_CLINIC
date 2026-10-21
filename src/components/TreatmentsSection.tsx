import React from 'react';
import { ArrowUpRight, Sparkles, Shield, Activity, Clock, Check } from 'lucide-react';
import { TREATMENTS } from '../data/treatments';
import { Treatment } from '../types';
import { AnimatedTooth } from './AnimatedTooth';

interface TreatmentsSectionProps {
  onSelectTreatment: (treatmentName: string) => void;
}

export const TreatmentsSection: React.FC<TreatmentsSectionProps> = ({ onSelectTreatment }) => {
  // Service icon resolver
  const renderIcon = (name: string) => {
    switch (name) {
      case 'sparkle':
        return <Sparkles className="w-6 h-6 text-teal-600" />;
      case 'shield':
        return <Shield className="w-6 h-6 text-teal-600" />;
      default:
        return (
          <svg className="w-6 h-6 text-teal-600" viewBox="0 0 40 44" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 7C16 6 12 3 8 6C2 10 5 19 7 24C9 30 9 37 13 37C16 37 15 26 20 26C25 26 24 37 27 37C31 37 31 30 33 24C35 19 38 10 32 6C28 3 24 6 20 7Z" />
            <path d="M14 11C17 12 20 15 25 14" />
          </svg>
        );
    }
  };

  return (
    <section id="treatments" className="py-20 sm:py-28 bg-[#f5f9f8] border-y border-[#e2ece8] relative overflow-hidden">
      {/* Decorative ambient tooth in the top-right empty space */}
      <div className="absolute top-8 right-8 lg:right-20 pointer-events-none hidden md:block">
        <AnimatedTooth
          size={64}
          variant="sparkle-duo"
          delay={0.5}
          label="Gentle Touch"
        />
      </div>

      {/* Another ambient tooth in the bottom-left empty corner */}
      <div className="absolute bottom-8 left-8 lg:left-16 pointer-events-none hidden lg:block opacity-70">
        <AnimatedTooth
          size={50}
          variant="floating-pearl"
          delay={2.1}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Intro */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 text-teal-700 text-[11px] font-bold tracking-widest uppercase">
              <span className="w-6 h-px bg-teal-600" />
              <span>Let's talk dental care</span>
            </div>
            <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-[#16333e] font-heading leading-tight">
              Care for every kind of <span className="font-serif italic text-teal-700 font-normal">smile.</span>
            </h2>
          </div>
          <p className="max-w-md text-xs sm:text-sm text-slate-600 leading-relaxed">
            Click on any service below to automatically transfer it to your appointment booking request with that category pre-selected.
          </p>
        </div>

        {/* 8 Treatments Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {TREATMENTS.map((treatment: Treatment) => (
            <button
              key={treatment.id}
              type="button"
              onClick={() => onSelectTreatment(treatment.category)}
              className="group relative flex flex-col items-start p-6 rounded-2xl bg-white/95 hover:bg-white border border-[#e2eae6] hover:border-teal-400/80 shadow-xs hover:shadow-xl hover:shadow-teal-900/5 transition-all duration-300 text-left transform hover:-translate-y-1.5 focus:outline-hidden focus:ring-2 focus:ring-teal-500 cursor-pointer"
            >
              {/* Badge & Arrow */}
              <div className="w-full flex items-center justify-between mb-5">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-teal-50 border border-teal-200/60 text-teal-800">
                  {treatment.badge}
                </span>
                <span className="w-8 h-8 rounded-full bg-slate-50 group-hover:bg-teal-50 text-slate-400 group-hover:text-teal-700 flex items-center justify-center transition-colors">
                  <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </div>

              {/* Service Icon */}
              <div className="w-12 h-12 rounded-xl bg-teal-50/70 border border-teal-100 flex items-center justify-center mb-4 group-hover:bg-teal-100/70 transition-colors">
                {renderIcon(treatment.iconName)}
              </div>

              {/* Title & Tagline */}
              <h3 className="text-base font-bold text-slate-900 font-heading group-hover:text-teal-800 transition-colors">
                {treatment.name}
              </h3>
              <p className="text-[11px] font-semibold text-teal-700 mt-0.5">
                {treatment.tagline}
              </p>

              {/* Description */}
              <p className="mt-2.5 text-xs text-slate-600 leading-relaxed grow">
                {treatment.shortDescription}
              </p>

              {/* Footer CTA prompt */}
              <div className="mt-5 pt-3.5 border-t border-slate-100 w-full flex items-center justify-between text-[11px] font-semibold text-teal-700 group-hover:text-teal-900">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3 h-3 text-slate-400" />
                  <span className="text-slate-500 font-normal">{treatment.duration}</span>
                </span>
                <span className="group-hover:underline">Book this &rarr;</span>
              </div>
            </button>
          ))}
        </div>

        {/* Provisional Note */}
        <p className="mt-8 text-center text-xs text-slate-500 flex items-center justify-center gap-2">
          <Activity className="w-3.5 h-3.5 text-teal-600" />
          <span>Select any treatment above to open the booking window with your chosen service pre-selected.</span>
        </p>
      </div>
    </section>
  );
};
