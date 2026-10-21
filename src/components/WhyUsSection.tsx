import React from 'react';
import { AnimatedTooth } from './AnimatedTooth';

export const WhyUsSection: React.FC = () => {
  const pillars = [
    {
      number: '01',
      title: 'A familiar name since 2008',
      description: '32 Pearls Dental Care has been serving smiles in our community for over a decade and a half. Get to know the dedicated dental team behind your visit.',
    },
    {
      number: '02',
      title: 'Care close to home',
      description: 'Find us conveniently at 6, J & J Complex, Kalathur Layout, Jalahalli East, Bengaluru. A welcoming, local connection for you and your family.',
    },
    {
      number: '03',
      title: 'One easy conversation away',
      description: 'Call us directly, message on WhatsApp, or request your appointment online in seconds. Ask any question that matters to you with complete peace of mind.',
    },
  ];

  return (
    <section id="why-us" className="py-20 sm:py-28 bg-white relative overflow-hidden">
      {/* Ambient Looping Tooth in the upper center-right breathing space */}
      <div className="absolute top-12 right-12 lg:right-28 pointer-events-none hidden md:block">
        <AnimatedTooth
          size={58}
          variant="floating-pearl"
          delay={1.2}
          label="Est. 2008"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 text-teal-700 text-[11px] font-bold tracking-widest uppercase">
            <span className="w-6 h-px bg-teal-600" />
            <span>The 32 Pearls connection</span>
            <span className="w-6 h-px bg-teal-600" />
          </div>

          <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-[#16333e] font-heading leading-tight">
            A neighbourhood clinic.<br />
            A more <span className="font-serif italic text-teal-700 font-normal">personal connection.</span>
          </h2>
        </div>

        {/* 3 Pillars Grid */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10">
          {pillars.map((pillar) => (
            <div
              key={pillar.number}
              className="border-t border-[#cbdcd7] pt-7 group hover:border-teal-600 transition-colors"
            >
              <span className="font-serif italic text-3xl sm:text-4xl text-teal-700 font-normal block">
                {pillar.number}
              </span>
              <h3 className="mt-5 text-lg font-bold text-slate-900 font-heading tracking-tight group-hover:text-teal-800 transition-colors">
                {pillar.title}
              </h3>
              <p className="mt-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
                {pillar.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
