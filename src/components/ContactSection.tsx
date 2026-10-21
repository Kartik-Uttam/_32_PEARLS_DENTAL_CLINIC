import React from 'react';
import { Phone, MapPin, Clock, MessageSquare, ArrowUpRight, Navigation } from 'lucide-react';
import { AnimatedTooth } from './AnimatedTooth';

interface ContactSectionProps {
  onOpenBooking: () => void;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ onOpenBooking }) => {
  return (
    <section id="contact" className="py-20 sm:py-28 bg-[#f7f9f7] border-t border-slate-200 relative overflow-hidden">
      {/* Decorative ambient tooth in empty space */}
      <div className="absolute top-10 right-10 lg:right-24 pointer-events-none hidden md:block">
        <AnimatedTooth
          size={54}
          variant="sparkle-duo"
          delay={1.0}
          label="Visit Us"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Clinic Contact Details */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <div className="inline-flex items-center gap-2 text-teal-700 text-[11px] font-bold tracking-widest uppercase">
                <span className="w-6 h-px bg-teal-600" />
                <span>Just around the corner</span>
              </div>
              <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-[#16333e] font-heading leading-tight">
                Let's put a smile<br />
                on <span className="font-serif italic text-teal-700 font-normal">your day.</span>
              </h2>
            </div>

            {/* Address */}
            <div className="flex items-start gap-3.5 text-xs sm:text-sm text-slate-600">
              <div className="w-9 h-9 rounded-xl bg-teal-50 border border-teal-200/80 flex items-center justify-center text-teal-700 shrink-0 mt-0.5">
                <MapPin className="w-4 h-4" />
              </div>
              <address className="not-italic leading-relaxed">
                <strong className="text-slate-900 block font-semibold">32 Pearls Dental Care</strong>
                6, J &amp; J Complex, Kalathur Layout,<br />
                Jalahalli East, Bengaluru,<br />
                Karnataka 560013, India
              </address>
            </div>

            {/* Phone */}
            <div className="flex items-center gap-3.5 text-xs sm:text-sm text-slate-600">
              <div className="w-9 h-9 rounded-xl bg-teal-50 border border-teal-200/80 flex items-center justify-center text-teal-700 shrink-0">
                <Phone className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-semibold">Direct Phone</span>
                <a href="tel:+919019953164" className="text-base font-bold text-teal-800 hover:text-teal-950 transition-colors">
                  +91 90199 53164
                </a>
              </div>
            </div>

            {/* Timings */}
            <div className="flex items-center gap-3.5 text-xs sm:text-sm text-slate-600">
              <div className="w-9 h-9 rounded-xl bg-teal-50 border border-teal-200/80 flex items-center justify-center text-teal-700 shrink-0">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-semibold">Clinic Availability</span>
                <p className="text-xs text-slate-700 font-medium">Monday &ndash; Saturday (Call or request online for current doctor slots)</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={onOpenBooking}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-md shadow-teal-900/10 transition-all transform hover:-translate-y-0.5"
              >
                <span>Book Appointment</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>

              <a
                href="https://www.google.com/maps/dir/?api=1&destination=32+Pearls+Dental+Care%2C+6+J+and+J+Complex%2C+Kalathur+Layout%2C+Jalahalli+East%2C+Bengaluru+560013"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold shadow-xs transition-colors"
              >
                <Navigation className="w-3.5 h-3.5 text-teal-600" />
                <span>Get Directions</span>
              </a>

              <a
                href="https://wa.me/919019953164?text=Hello%2032%20Pearls%20Dental%20Care%2C%20I%20would%20like%20to%20enquire%20about%20a%20visit."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-3 text-xs font-semibold text-[#247e61] hover:text-[#1b674d]"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Right Column: Google Maps Embed */}
          <div className="lg:col-span-7">
            <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-md bg-white p-2">
              <div className="relative h-[340px] sm:h-[380px] rounded-xl overflow-hidden bg-slate-100">
                <iframe
                  title="Google Maps location of 32 Pearls Dental Care in Jalahalli East, Bengaluru"
                  src="https://maps.google.com/maps?q=32%20Pearls%20Dental%20Care%20Jalahalli%20East%20Bengaluru%20560013&t=&z=15&ie=UTF8&iwloc=&output=embed"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full border-0 filter saturate-[0.85] hover:saturate-100 transition-all duration-300"
                />
              </div>

              <div className="px-3 py-2.5 flex items-center justify-between text-[11px] text-slate-500">
                <span>Jalahalli East, Bengaluru &middot; Easy patient parking nearby</span>
                <a
                  href="https://www.google.com/maps/search/?api=1&query=32+Pearls+Dental+Care+Jalahalli+East+Bengaluru+560013"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-teal-700 font-semibold hover:underline flex items-center gap-1"
                >
                  <span>Open in Maps</span>
                  <ArrowUpRight className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
