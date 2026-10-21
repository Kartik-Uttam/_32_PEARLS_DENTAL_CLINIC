import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowUpRight, Phone, ShieldCheck } from 'lucide-react';
import { AnimatedTooth } from './AnimatedTooth';

interface NavbarProps {
  onOpenBooking: () => void;
  onOpenAdmin: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenBooking, onOpenAdmin }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Our Story', href: '#about' },
    { label: 'Treatments', href: '#treatments' },
    { label: 'Why Us', href: '#why-us' },
    { label: 'Reviews', href: '#reviews' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-100 py-3.5'
          : 'bg-white/90 backdrop-blur-xs border-b border-slate-100/80 py-4 sm:py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          {/* Brand Logo with Animated Tooth Symbol */}
          <a href="#home" className="group flex items-center gap-2.5 focus:outline-hidden" aria-label="32 Pearls Dental Care Home">
            <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200/80 flex items-center justify-center text-teal-700 transition-transform group-hover:scale-105 shadow-xs">
              <AnimatedTooth size={26} interactive={false} showSparkles={false} />
            </div>
            <div className="flex flex-col">
              <span className="font-heading text-xl sm:text-2xl font-bold tracking-tight text-[#16333e] leading-tight">
                32 Pearls
              </span>
              <span className="text-[8px] font-bold tracking-[0.25em] text-teal-700 uppercase -mt-0.5">
                Dental Care
              </span>
            </div>
          </a>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-7" aria-label="Main navigation">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-xs font-semibold text-slate-600 hover:text-teal-700 tracking-wide transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-teal-600 hover:after:w-full after:transition-all"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden sm:flex items-center gap-3">
            <a
              href="tel:+919019953164"
              className="hidden lg:flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-teal-700 px-2 py-1 rounded-lg transition-colors"
              title="Call Clinic Directly"
            >
              <Phone className="w-3.5 h-3.5 text-teal-600" />
              <span>+91 90199 53164</span>
            </a>

            {/* Book Appointment CTA Button */}
            <button
              type="button"
              onClick={onOpenBooking}
              className="inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-lg bg-[#132f3a] hover:bg-[#204554] text-white text-xs font-semibold tracking-wide shadow-sm hover:shadow-md transition-all transform hover:-translate-y-0.5 focus:outline-hidden focus:ring-2 focus:ring-teal-500"
            >
              <span>Book Appointment</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-teal-300" />
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              type="button"
              onClick={onOpenBooking}
              className="px-3 py-1.5 rounded-lg bg-teal-600 text-white text-[11px] font-semibold"
            >
              Book
            </button>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-slate-100 text-slate-600 hover:text-slate-900"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="sm:hidden pt-4 pb-3 border-t border-slate-100 mt-3 space-y-2">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-sm font-medium text-slate-700 hover:bg-teal-50 hover:text-teal-700 rounded-lg"
              >
                {link.label}
              </a>
            ))}
            <div className="pt-2 flex flex-col gap-2">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenBooking();
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-teal-600 text-white text-xs font-semibold"
              >
                <span>Book Appointment</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAdmin();
                }}
                className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg text-slate-500 hover:text-slate-800 text-xs"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Clinic Workspace</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
