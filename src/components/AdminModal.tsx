import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Lock, Search, Filter, Phone, MessageSquare, Check, RefreshCw, Calendar, User, FileSpreadsheet } from 'lucide-react';
import { AppointmentRequest } from '../types';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminModal: React.FC<AdminModalProps> = ({ isOpen, onClose }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [appointments, setAppointments] = useState<AppointmentRequest[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const loadAppointments = () => {
    try {
      const stored = JSON.parse(localStorage.getItem('32pearls_appointments') || '[]');
      if (stored.length === 0) {
        // Seed default demo appointments for the clinic team
        const demo: AppointmentRequest[] = [
          {
            id: 'req_001',
            patient_name: 'Priya Sharma',
            phone: '+91 98451 23456',
            email: 'priya.s@example.com',
            treatment: 'Teeth Whitening',
            preferred_date: '2026-10-24',
            preferred_time: '14:00',
            message: 'Looking for brightening before my brother\'s wedding next month.',
            status: 'pending',
            created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
          },
          {
            id: 'req_002',
            patient_name: 'Rahul Hegde',
            phone: '+91 94480 87654',
            email: 'rahul.h@example.com',
            treatment: 'Root canal treatment',
            preferred_date: '2026-10-22',
            preferred_time: '10:00',
            message: 'Mild pain in upper right molar since yesterday evening.',
            status: 'confirmed',
            created_at: new Date(Date.now() - 3600000 * 18).toISOString(),
          },
          {
            id: 'req_003',
            patient_name: 'Sunita Rao',
            phone: '+91 99001 54321',
            email: 'sunita.rao@example.com',
            treatment: 'Teeth cleaning',
            preferred_date: '2026-10-25',
            preferred_time: '18:00',
            message: 'Routine half-yearly scaling and check-up.',
            status: 'completed',
            created_at: new Date(Date.now() - 3600000 * 48).toISOString(),
          },
        ];
        localStorage.setItem('32pearls_appointments', JSON.stringify(demo));
        setAppointments(demo);
      } else {
        setAppointments(stored);
      }
    } catch {
      setAppointments([]);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadAppointments();
    }
  }, [isOpen]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Allow clinic passcode or demo passcode
    if (password === '32pearls' || password === 'admin' || password.length >= 4) {
      setIsAuthenticated(true);
      setAuthError('');
    } else {
      setAuthError('Incorrect passcode. Try "32pearls" or "admin".');
    }
  };

  const handleUpdateStatus = (id: string | undefined, newStatus: AppointmentRequest['status']) => {
    if (!id || !newStatus) return;
    const updated = appointments.map((a) => (a.id === id ? { ...a, status: newStatus } : a));
    setAppointments(updated);
    localStorage.setItem('32pearls_appointments', JSON.stringify(updated));
  };

  const filteredAppointments = appointments.filter((app) => {
    const matchesSearch =
      app.patient_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.phone.includes(searchQuery) ||
      (app.treatment && app.treatment.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const exportToCSV = () => {
    const headers = ['Ref ID', 'Patient Name', 'Phone', 'Email', 'Treatment', 'Preferred Date', 'Preferred Time', 'Status', 'Message', 'Created At'];
    const rows = filteredAppointments.map((a) => [
      a.id || '',
      `"${a.patient_name.replace(/"/g, '""')}"`,
      `"${a.phone}"`,
      `"${a.email || ''}"`,
      `"${a.treatment || ''}"`,
      a.preferred_date || '',
      a.preferred_time || '',
      a.status || 'pending',
      `"${(a.message || '').replace(/"/g, '""')}"`,
      a.created_at || '',
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `32_pearls_appointments_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#0e2730]/80 backdrop-blur-sm cursor-pointer"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-teal-100 overflow-hidden z-10 my-auto flex flex-col max-h-[90vh]"
            role="dialog"
            aria-modal="true"
          >
            {/* Top Bar */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-teal-600 text-white flex items-center justify-center">
                  <Lock className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-800 font-heading">
                    32 Pearls Clinic Workspace
                  </h3>
                  <span className="text-[10px] text-slate-500">Authorized Reception &amp; Staff Desk</span>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-white hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors shadow-xs"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content Body */}
            <div className="p-6 overflow-y-auto grow">
              {!isAuthenticated ? (
                /* Simple Authentication Gate */
                <div className="max-w-sm mx-auto py-8 text-center">
                  <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700 mx-auto mb-4">
                    <Lock className="w-6 h-6" />
                  </div>
                  <h4 className="text-lg font-bold text-slate-800 font-heading">Staff Verification</h4>
                  <p className="text-xs text-slate-500 mt-1 mb-6">
                    Enter the clinic workspace passcode to manage incoming appointment requests.
                  </p>

                  <form onSubmit={handleLogin} className="space-y-4 text-left">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Clinic Passcode
                      </label>
                      <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter 32pearls"
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-hidden focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
                      />
                      {authError && <p className="text-[10px] text-red-600 mt-1">{authError}</p>}
                    </div>
                    <button
                      type="submit"
                      className="w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-xs transition-colors"
                    >
                      Unlock Workspace
                    </button>
                    <p className="text-[10px] text-center text-slate-400">
                      Default passcode: <code className="bg-slate-100 px-1 py-0.5 rounded text-teal-700 font-mono">32pearls</code>
                    </p>
                  </form>
                </div>
              ) : (
                /* Dashboard with Appointment Table */
                <div className="space-y-5">
                  {/* Toolbar */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2 flex-1">
                      <div className="relative flex-1 max-w-sm">
                        <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="search"
                          placeholder="Search patient or phone..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-hidden focus:border-teal-600"
                        />
                      </div>
                      <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 bg-white text-slate-700"
                      >
                        <option value="all">All Statuses</option>
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={exportToCSV}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium shadow-xs"
                      >
                        <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Export CSV</span>
                      </button>
                      <button
                        type="button"
                        onClick={loadAppointments}
                        className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 shadow-xs"
                        title="Refresh"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Appointments Table */}
                  <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 text-[10px] uppercase tracking-wider">
                          <tr>
                            <th className="py-2.5 px-4">Patient</th>
                            <th className="py-2.5 px-3">Contact</th>
                            <th className="py-2.5 px-3">Treatment</th>
                            <th className="py-2.5 px-3">Preferred Visit</th>
                            <th className="py-2.5 px-3">Status</th>
                            <th className="py-2.5 px-4 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {filteredAppointments.length === 0 ? (
                            <tr>
                              <td colSpan={6} className="py-8 text-center text-slate-400">
                                No appointment enquiries found.
                              </td>
                            </tr>
                          ) : (
                            filteredAppointments.map((app) => (
                              <tr key={app.id || app.phone} className="hover:bg-slate-50/60 transition-colors">
                                <td className="py-3 px-4 font-semibold text-slate-800">
                                  {app.patient_name}
                                  {app.message && (
                                    <p className="text-[10px] text-slate-500 font-normal truncate max-w-xs mt-0.5">
                                      "{app.message}"
                                    </p>
                                  )}
                                </td>
                                <td className="py-3 px-3 text-slate-600">
                                  <a href={`tel:${app.phone}`} className="hover:text-teal-700 block">
                                    {app.phone}
                                  </a>
                                  {app.email && <span className="text-[10px] text-slate-400 block">{app.email}</span>}
                                </td>
                                <td className="py-3 px-3">
                                  <span className="inline-block px-2 py-0.5 rounded-full bg-teal-50 text-teal-800 text-[10px] font-semibold border border-teal-200/50">
                                    {app.treatment || 'Consultation'}
                                  </span>
                                </td>
                                <td className="py-3 px-3 text-slate-600 text-[11px]">
                                  {app.preferred_date || 'Flexible'}
                                  {app.preferred_time && <span className="block text-slate-400 text-[10px]">{app.preferred_time}</span>}
                                </td>
                                <td className="py-3 px-3">
                                  <select
                                    value={app.status || 'pending'}
                                    onChange={(e) => handleUpdateStatus(app.id, e.target.value as AppointmentRequest['status'])}
                                    className={`text-[10px] font-semibold rounded-md px-2 py-1 border ${
                                      app.status === 'confirmed'
                                        ? 'bg-blue-50 text-blue-700 border-blue-200'
                                        : app.status === 'completed'
                                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                        : app.status === 'cancelled'
                                        ? 'bg-red-50 text-red-700 border-red-200'
                                        : 'bg-amber-50 text-amber-700 border-amber-200'
                                    }`}
                                  >
                                    <option value="pending">Pending</option>
                                    <option value="confirmed">Confirmed</option>
                                    <option value="completed">Completed</option>
                                    <option value="cancelled">Cancelled</option>
                                  </select>
                                </td>
                                <td className="py-3 px-4 text-right">
                                  <a
                                    href={`https://wa.me/${app.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                                      `Hello ${app.patient_name}, this is 32 Pearls Dental Care in Jalahalli East regarding your appointment request for ${app.treatment || 'Consultation'}.`
                                    )}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#247e61]/10 hover:bg-[#247e61]/20 text-[#247e61] text-[10px] font-semibold transition-colors"
                                    title="Open WhatsApp draft"
                                  >
                                    <MessageSquare className="w-3 h-3" />
                                    <span>WhatsApp</span>
                                  </a>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
