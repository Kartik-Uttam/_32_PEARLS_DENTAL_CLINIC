import React from 'react';
import { MessageSquare } from 'lucide-react';

export const WhatsAppFloat: React.FC = () => {
  return (
    <a
      href="https://wa.me/919019953164?text=Hello%2032%20Pearls%20Dental%20Care%2C%20I%20would%20like%20to%20enquire%20about%20a%20visit."
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-40 group flex items-center justify-center w-13 h-13 rounded-full bg-[#247e61] hover:bg-[#1b674d] text-white shadow-xl shadow-teal-950/20 border-3 border-white transition-all transform hover:-translate-y-1 focus:outline-hidden focus:ring-4 focus:ring-teal-400"
      aria-label="Chat with 32 Pearls Dental Care on WhatsApp"
    >
      <MessageSquare className="w-6 h-6 stroke-[2.2]" />

      {/* Hover Tooltip */}
      <span className="absolute right-full mr-3 px-3 py-1.5 rounded-lg bg-[#132f3a] text-white text-[11px] font-medium tracking-wide whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity shadow-md">
        Let's talk smiles &rarr;
      </span>
    </a>
  );
};
