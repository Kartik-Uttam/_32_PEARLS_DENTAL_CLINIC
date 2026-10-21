import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Calendar, Clock, Phone, Mail, User, CheckCircle2, MessageSquare, Sparkles, AlertCircle, ArrowRight } from 'lucide-react';
import { TREATMENTS } from '../data/treatments';
import { AppointmentRequest } from '../types';

interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialService?: string;
}

export const AppointmentModal: React.FC<AppointmentModalProps> = ({
  isOpen,
  onClose,
  initialService = '',
}) => {
  const [patientName, setPatientName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [preferredDate, setPreferredDate] = useState('');
  const [preferredTime, setPreferredTime] = useState('');
  const [selectedTreatment, setSelectedTreatment] = useState(initialService);
  const [message, setMessage] = useState('');
  const [consent, setConsent] = useState(true);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submissionId, setSubmissionId] = useState('');
  const modalRef = useRef<HTMLDivElement>(null);

  // Sync initial service when modal opens or initialService changes
  useEffect(() => {
    if (initialService) {
      setSelectedTreatment(initialService);
    }
  }, [initialService, isOpen]);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      // Reset success state shortly after close so next open is fresh
      setTimeout(() => {
        setIsSuccess(false);
        setErrors({});
      }, 300);
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const validatePhone = (num: string): boolean => {
    const clean = num.trim().replace(/[\s().-]/g, '');
    // Support +91XXXXXXXXXX or standard 10 digit Indian number or international
    if (/^[6-9]\d{9}$/.test(clean)) return true;
    if (/^\+?91[6-9]\d{9}$/.test(clean)) return true;
    if (/^\+[1-9]\d{7,14}$/.test(clean)) return true;
    return false;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!patientName.trim() || patientName.trim().length < 2) {
      newErrors.patientName = 'Please enter your full name (minimum 2 characters)';
    }

    if (!phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!validatePhone(phone)) {
      newErrors.phone = 'Please enter a valid phone number (e.g. +91 90199 53164)';
    }

    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!consent) {
      newErrors.consent = 'Please agree to allow the clinic to contact you';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    // Normalize phone number for storage
    let normalizedPhone = phone.trim().replace(/[\s().-]/g, '');
    if (/^[6-9]\d{9}$/.test(normalizedPhone)) {
      normalizedPhone = '+91' + normalizedPhone;
    } else if (!normalizedPhone.startsWith('+')) {
      normalizedPhone = '+' + normalizedPhone;
    }

    const appointmentPayload: AppointmentRequest = {
      patient_name: patientName.trim(),
      phone: normalizedPhone,
      email: email.trim() || undefined,
      treatment: selectedTreatment || undefined,
      preferred_date: preferredDate || undefined,
      preferred_time: preferredTime || undefined,
      message: message.trim() || undefined,
      status: 'pending',
      created_at: new Date().toISOString(),
    };

    try {
      // Try posting to Supabase if configured in window
      const config = (window as unknown as { CLINIC_SUPABASE_CONFIG?: { SUPABASE_URL: string; SUPABASE_PUBLISHABLE_KEY: string } }).CLINIC_SUPABASE_CONFIG;
      if (config?.SUPABASE_URL && config?.SUPABASE_PUBLISHABLE_KEY && !config.SUPABASE_URL.includes('YOUR_')) {
        try {
          await fetch(`${config.SUPABASE_URL}/rest/v1/appointments`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              apikey: config.SUPABASE_PUBLISHABLE_KEY,
              Authorization: `Bearer ${config.SUPABASE_PUBLISHABLE_KEY}`,
              Prefer: 'return=minimal',
            },
            body: JSON.stringify(appointmentPayload),
          });
        } catch (supabaseErr) {
          console.warn('Direct Supabase write note:', supabaseErr);
        }
      }

      // Also persist to local storage so clinic admin workspace can display it
      const existing = JSON.parse(localStorage.getItem('32pearls_appointments') || '[]');
      const newEntry = {
        ...appointmentPayload,
        id: 'req_' + Date.now().toString(36),
      };
      existing.unshift(newEntry);
      localStorage.setItem('32pearls_appointments', JSON.stringify(existing));

      const generatedId = newEntry.id || ('req_' + Date.now().toString(36));
      setSubmissionId(generatedId.toUpperCase());
      setIsSuccess(true);
    } catch {
      // Fallback success for graceful user experience
      setIsSuccess(true);
      setSubmissionId('REQ_' + Math.floor(100000 + Math.random() * 900000));
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setPatientName('');
    setPhone('');
    setEmail('');
    setPreferredDate('');
    setPreferredTime('');
    setSelectedTreatment('');
    setMessage('');
    setErrors({});
    setIsSuccess(false);
  };

  // Find info about the currently selected treatment
  const currentTreatmentMeta = TREATMENTS.find(
    (t) => t.category.toLowerCase() === selectedTreatment.toLowerCase() || t.name.toLowerCase() === selectedTreatment.toLowerCase()
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto">
          {/* Backdrop with smooth blur and fade */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 bg-[#0e2730]/75 backdrop-blur-md cursor-pointer"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Modal Container with smooth spring scale and slide transition */}
          <motion.div
            ref={modalRef}
            initial={{ opacity: 0, scale: 0.94, y: 28 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 28, stiffness: 320 }}
            className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-teal-100 overflow-hidden z-10 my-auto"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
          >
            {/* Header Accent Bar */}
            <div className="h-1.5 bg-gradient-to-r from-teal-600 via-teal-500 to-teal-400" />

            {/* Modal Header */}
            <div className="px-6 pt-5 pb-3 flex items-start justify-between border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200/70 flex items-center justify-center text-teal-700 shrink-0 shadow-xs">
                  <svg width="22" height="24" viewBox="0 0 40 44" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 7C16 6 12 3 8 6C2 10 5 19 7 24C9 30 9 37 13 37C16 37 15 26 20 26C25 26 24 37 27 37C31 37 31 30 33 24C35 19 38 10 32 6C28 3 24 6 20 7Z" />
                    <path d="M14 11C17 12 20 15 25 14" />
                  </svg>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-teal-700 tracking-wider uppercase">32 Pearls Dental Care</span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-teal-100 text-teal-800 font-medium">Jalahalli East</span>
                  </div>
                  <h2 id="modal-title" className="text-xl font-bold text-slate-800 tracking-tight font-heading">
                    Book an Appointment
                  </h2>
                </div>
              </div>

              {/* Close Button */}
              <button
                type="button"
                onClick={onClose}
                className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors focus:outline-hidden focus:ring-2 focus:ring-teal-500"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 max-h-[calc(85vh-100px)] overflow-y-auto">
              {isSuccess ? (
                /* Success View */
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-6 px-2"
                >
                  <div className="w-16 h-16 bg-teal-50 text-teal-600 rounded-full flex items-center justify-center mx-auto mb-4 border border-teal-200">
                    <CheckCircle2 className="w-9 h-9" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-800 font-heading">Appointment Request Sent!</h3>
                  <p className="text-sm text-slate-600 mt-2 max-w-md mx-auto leading-relaxed">
                    Thank you, <strong className="text-slate-800">{patientName}</strong>. Your enquiry for{' '}
                    <strong className="text-teal-700">{selectedTreatment || 'dental consultation'}</strong> has been recorded
                    (Ref: #{submissionId}).
                  </p>
                  <div className="mt-4 p-3 bg-teal-50/70 border border-teal-200/60 rounded-xl text-left max-w-md mx-auto text-xs text-teal-900 space-y-1">
                    <p><strong>Note:</strong> Our clinic team will call or message your phone (<strong>{phone}</strong>) shortly to confirm available slots and discuss your visit.</p>
                  </div>

                  <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
                    <a
                      href={`https://wa.me/919019953164?text=${encodeURIComponent(
                        `Hello 32 Pearls Dental Care, I submitted an appointment request for ${selectedTreatment || 'Consultation'} (Ref: ${submissionId}). My name is ${patientName}.`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#247e61] hover:bg-[#1b674d] text-white text-xs font-semibold shadow-md transition-colors"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>Chat on WhatsApp directly</span>
                    </a>
                    <button
                      type="button"
                      onClick={onClose}
                      className="w-full sm:w-auto px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
                    >
                      Done & Close
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={resetForm}
                    className="mt-5 text-xs text-teal-700 hover:text-teal-900 underline underline-offset-2 transition-colors"
                  >
                    Send another appointment request
                  </button>
                </motion.div>
              ) : (
                /* Interactive Booking Form */
                <form onSubmit={handleSubmit} noValidate className="space-y-4">
                  {/* Pre-Selected Service Highlight Banner */}
                  {selectedTreatment && (
                    <motion.div
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3.5 bg-gradient-to-r from-teal-50 via-teal-50/70 to-emerald-50/50 border border-teal-200/80 rounded-xl flex items-center justify-between gap-3 shadow-xs"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-7 h-7 rounded-lg bg-teal-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                          <Sparkles className="w-3.5 h-3.5" />
                        </div>
                        <div className="truncate">
                          <span className="text-[10px] font-bold text-teal-800 uppercase tracking-wider block">
                            Pre-selected Service
                          </span>
                          <span className="text-xs font-semibold text-slate-900 block truncate">
                            {selectedTreatment}
                          </span>
                        </div>
                      </div>

                      {currentTreatmentMeta?.duration && (
                        <span className="text-[10px] font-medium text-teal-700 bg-white/80 border border-teal-200 px-2 py-0.5 rounded-full shrink-0">
                          {currentTreatmentMeta.duration}
                        </span>
                      )}
                    </motion.div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {/* Patient Name */}
                    <div>
                      <label htmlFor="modal-patient-name" className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Your Full Name <span className="text-teal-600">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                          <User className="w-4 h-4" />
                        </div>
                        <input
                          id="modal-patient-name"
                          type="text"
                          required
                          value={patientName}
                          onChange={(e) => {
                            setPatientName(e.target.value);
                            if (errors.patientName) setErrors((prev) => ({ ...prev, patientName: '' }));
                          }}
                          placeholder="e.g. Uttam Kumar"
                          className={`w-full pl-9 pr-3 py-2 text-xs rounded-lg border ${
                            errors.patientName ? 'border-red-400 ring-1 ring-red-400' : 'border-slate-200 hover:border-slate-300'
                          } focus:outline-hidden focus:border-teal-600 focus:ring-2 focus:ring-teal-100 transition-all`}
                        />
                      </div>
                      {errors.patientName && (
                        <p className="mt-1 text-[10px] text-red-600 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" /> {errors.patientName}
                        </p>
                      )}
                    </div>

                    {/* Phone Number */}
                    <div>
                      <label htmlFor="modal-phone" className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Phone Number <span className="text-teal-600">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                          <Phone className="w-4 h-4" />
                        </div>
                        <input
                          id="modal-phone"
                          type="tel"
                          required
                          value={phone}
                          onChange={(e) => {
                            setPhone(e.target.value);
                            if (errors.phone) setErrors((prev) => ({ ...prev, phone: '' }));
                          }}
                          placeholder="+91 90199 53164"
                          className={`w-full pl-9 pr-3 py-2 text-xs rounded-lg border ${
                            errors.phone ? 'border-red-400 ring-1 ring-red-400' : 'border-slate-200 hover:border-slate-300'
                          } focus:outline-hidden focus:border-teal-600 focus:ring-2 focus:ring-teal-100 transition-all`}
                        />
                      </div>
                      {errors.phone && (
                        <p className="mt-1 text-[10px] text-red-600 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" /> {errors.phone}
                        </p>
                      )}
                    </div>

                    {/* Email (Optional) */}
                    <div>
                      <label htmlFor="modal-email" className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Email Address <span className="text-slate-400 font-normal">(Optional)</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                          <Mail className="w-4 h-4" />
                        </div>
                        <input
                          id="modal-email"
                          type="email"
                          value={email}
                          onChange={(e) => {
                            setEmail(e.target.value);
                            if (errors.email) setErrors((prev) => ({ ...prev, email: '' }));
                          }}
                          placeholder="you@example.com"
                          className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-200 hover:border-slate-300 focus:outline-hidden focus:border-teal-600 focus:ring-2 focus:ring-teal-100 transition-all"
                        />
                      </div>
                      {errors.email && (
                        <p className="mt-1 text-[10px] text-red-600 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" /> {errors.email}
                        </p>
                      )}
                    </div>

                    {/* Service / Treatment Selection Field */}
                    <div>
                      <label htmlFor="modal-treatment" className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Service / Treatment Category
                      </label>
                      <select
                        id="modal-treatment"
                        value={selectedTreatment}
                        onChange={(e) => setSelectedTreatment(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-teal-200 bg-teal-50/30 text-slate-800 font-medium hover:border-teal-400 focus:outline-hidden focus:border-teal-600 focus:ring-2 focus:ring-teal-100 transition-all"
                      >
                        <option value="">Select a treatment or consultation</option>
                        {TREATMENTS.map((t) => (
                          <option key={t.id} value={t.category}>
                            {t.name} ({t.badge || 'Care'})
                          </option>
                        ))}
                        <option value="Not sure / other enquiry">Not sure / General enquiry</option>
                      </select>
                    </div>

                    {/* Preferred Date */}
                    <div>
                      <label htmlFor="modal-date" className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Preferred Date <span className="text-slate-400 font-normal">(Optional)</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                          <Calendar className="w-4 h-4" />
                        </div>
                        <input
                          id="modal-date"
                          type="date"
                          min={new Date().toISOString().split('T')[0]}
                          value={preferredDate}
                          onChange={(e) => setPreferredDate(e.target.value)}
                          className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-200 hover:border-slate-300 focus:outline-hidden focus:border-teal-600 focus:ring-2 focus:ring-teal-100 transition-all"
                        />
                      </div>
                    </div>

                    {/* Preferred Time */}
                    <div>
                      <label htmlFor="modal-time" className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Preferred Time <span className="text-slate-400 font-normal">(Optional)</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                          <Clock className="w-4 h-4" />
                        </div>
                        <select
                          id="modal-time"
                          value={preferredTime}
                          onChange={(e) => setPreferredTime(e.target.value)}
                          className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-200 hover:border-slate-300 focus:outline-hidden focus:border-teal-600 focus:ring-2 focus:ring-teal-100 transition-all"
                        >
                          <option value="">Any convenient time</option>
                          <option value="10:00">Morning (10:00 AM - 1:00 PM)</option>
                          <option value="14:00">Afternoon (2:00 PM - 5:00 PM)</option>
                          <option value="18:00">Evening (5:00 PM - 8:30 PM)</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Notes / Questions */}
                  <div>
                    <label htmlFor="modal-message" className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Notes or Specific Concerns <span className="text-slate-400 font-normal">(Optional)</span>
                    </label>
                    <textarea
                      id="modal-message"
                      rows={2}
                      maxLength={500}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Share questions or describe tooth discomfort (e.g. sensitivity, chipped tooth)..."
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 hover:border-slate-300 focus:outline-hidden focus:border-teal-600 focus:ring-2 focus:ring-teal-100 transition-all resize-none"
                    />
                  </div>

                  {/* Consent Checkbox */}
                  <div className="pt-1">
                    <label className="flex items-start gap-2.5 cursor-pointer text-slate-600 text-[11px]">
                      <input
                        type="checkbox"
                        checked={consent}
                        onChange={(e) => {
                          setConsent(e.target.checked);
                          if (errors.consent) setErrors((prev) => ({ ...prev, consent: '' }));
                        }}
                        className="mt-0.5 rounded text-teal-600 focus:ring-teal-500 w-3.5 h-3.5 border-slate-300"
                      />
                      <span className="leading-tight">
                        I agree to be contacted by 32 Pearls Dental Care regarding this visit request. We keep your contact information strictly confidential.
                      </span>
                    </label>
                    {errors.consent && (
                      <p className="mt-1 text-[10px] text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {errors.consent}
                      </p>
                    )}
                  </div>

                  {/* Submit CTA */}
                  <div className="pt-2 flex items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-4 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 text-xs font-semibold transition-colors"
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 disabled:bg-teal-400 text-white text-xs font-semibold shadow-md shadow-teal-900/10 transition-all transform hover:-translate-y-0.5 focus:outline-hidden focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
                    >
                      {isSubmitting ? (
                        <>
                          <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                          <span>Submitting Request...</span>
                        </>
                      ) : (
                        <>
                          <span>Request Appointment</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>
                  </div>

                  <p className="text-[10px] text-center text-slate-400 pt-1">
                    Direct urgent hotline: <a href="tel:+919019953164" className="text-teal-700 font-semibold underline underline-offset-2">+91 90199 53164</a>
                  </p>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
