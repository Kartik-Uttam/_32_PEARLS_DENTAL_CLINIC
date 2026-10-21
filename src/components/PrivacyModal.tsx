import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ShieldCheck, Lock, Phone } from 'lucide-react';

interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyModal: React.FC<PrivacyModalProps> = ({ isOpen, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#0e2730]/75 backdrop-blur-sm cursor-pointer"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-teal-100 overflow-hidden z-10 p-6 sm:p-8"
            role="dialog"
            aria-modal="true"
          >
            <button
              type="button"
              onClick={onClose}
              className="absolute right-4 top-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors"
              aria-label="Close dialog"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="w-12 h-12 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700 mb-4">
              <ShieldCheck className="w-6 h-6" />
            </div>

            <span className="text-[10px] font-bold text-teal-700 tracking-wider uppercase">Your details matter</span>
            <h3 className="text-2xl font-bold text-slate-900 font-heading mt-1">
              Only what's needed to plan a visit.
            </h3>

            <p className="mt-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
              Your name and phone number are gathered strictly to allow the 32 Pearls dental team to connect with you regarding your appointment request.
            </p>

            <ul className="mt-4 space-y-2.5 text-xs text-slate-600 list-disc pl-5 leading-relaxed">
              <li>Your enquiry is safely handled with administrative controls and access security.</li>
              <li>We never share, sell, or rent your personal contact information to any third-party advertisers.</li>
              <li>Please refrain from submitting medical history, sensitive identifiers, or financial records through the online booking form.</li>
              <li>For prompt privacy queries, corrections, or appointment cancellations, contact the clinic directly at <a href="tel:+919019953164" className="text-teal-700 font-semibold underline">+91 90199 53164</a>.</li>
            </ul>

            <button
              type="button"
              onClick={onClose}
              className="mt-6 w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-xs transition-colors"
            >
              I Understand
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
