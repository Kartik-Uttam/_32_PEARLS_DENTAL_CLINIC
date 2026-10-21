import React from 'react';
import { ArrowUpRight, ShieldCheck, Lock } from 'lucide-react';
import { AnimatedTooth } from './AnimatedTooth';

interface FooterProps {
  onOpenBooking: () => void;
  onOpenPrivacy: () => void;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenBooking,
  onOpenPrivacy,
  onOpenAdmin,
}) => {
  return (
    <footer className="bg-white border-t border-slate-200 py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-10 pb-12 border-b border-slate-100">
          {/* Brand Info */}
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700">
                <AnimatedTooth size={24} interactive={false} showSparkles={false} />
              </div>
              <div className="flex flex-col">
                <span className="font-heading text-xl font-bold tracking-tight text-[#16333e]">
                  32 Pearls
                </span>
                <span className="text-[7.5px] font-bold tracking-[0.25em] text-teal-700 uppercase -mt-0.5">
                  Dental Care
                </span>
              </div>
            </div>
            <p className="mt-3 font-serif italic text-slate-600 text-base">
              Your Smile, Our Priority.
            </p>
            <p className="text-xs text-slate-500 mt-1 max-w-sm">
              Compassionate neighbourhood dental clinic in Jalahalli East, Bengaluru since 2008.
            </p>
          </div>

          {/* Quick Navigation Links */}
          <div className="flex flex-wrap gap-8 text-xs font-semibold text-slate-600">
            <div className="space-y-2.5">
              <span className="text-[10px] font-bold text-teal-800 tracking-wider uppercase block">Explore</span>
              <a href="#about" className="block hover:text-teal-700 transition-colors">Our Story</a>
              <a href="#treatments" className="block hover:text-teal-700 transition-colors">Treatments</a>
              <a href="#why-us" className="block hover:text-teal-700 transition-colors">Why 32 Pearls</a>
            </div>
            <div className="space-y-2.5">
              <span className="text-[10px] font-bold text-teal-800 tracking-wider uppercase block">Patient Care</span>
              <button
                type="button"
                onClick={onOpenBooking}
                className="block text-left text-teal-700 hover:text-teal-900 font-semibold"
              >
                Book Appointment
              </button>
              <a href="#reviews" className="block hover:text-teal-700 transition-colors">Google Reviews</a>
              <a href="#contact" className="block hover:text-teal-700 transition-colors">Find Clinic</a>
            </div>
            <div className="space-y-2.5">
              <span className="text-[10px] font-bold text-teal-800 tracking-wider uppercase block">Clinic Access</span>
              <button
                type="button"
                onClick={onOpenPrivacy}
                className="block text-left hover:text-teal-700 transition-colors"
              >
                Privacy &amp; Data
              </button>
              <button
                type="button"
                onClick={onOpenAdmin}
                className="block text-left hover:text-teal-700 transition-colors text-slate-500"
              >
                Clinic Workspace &rarr;
              </button>
            </div>
          </div>
        </div>

        {/* Footer Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>
            &copy; {new Date().getFullYear()} 32 Pearls Dental Care. Established in 2008. All rights reserved.
          </p>

          <div className="flex items-center gap-5">
            <button
              type="button"
              onClick={onOpenPrivacy}
              className="hover:underline hover:text-slate-800"
            >
              Privacy Policy
            </button>
            <span className="text-slate-300">&middot;</span>
            <button
              type="button"
              onClick={onOpenAdmin}
              className="flex items-center gap-1 text-teal-700 hover:underline"
            >
              <Lock className="w-3 h-3" />
              <span>Admin Login</span>
            </button>
          </div>
        </div>

        <p className="mt-4 text-[10px] text-slate-400 text-center sm:text-left">
          Clinical photography and imagery are illustrative and represent clinical environments.
        </p>
      </div>
    </footer>
  );
};
