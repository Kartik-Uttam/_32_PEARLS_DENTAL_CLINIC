import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { AboutSection } from './components/AboutSection';
import { TreatmentsSection } from './components/TreatmentsSection';
import { WhyUsSection } from './components/WhyUsSection';
import { ReviewsSection } from './components/ReviewsSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { AppointmentModal } from './components/AppointmentModal';
import { PrivacyModal } from './components/PrivacyModal';
import { AdminModal } from './components/AdminModal';
import { WhatsAppFloat } from './components/WhatsAppFloat';
import { DentalChatbot } from './components/DentalChatbot';

export default function App() {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<string>('');
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // Opens booking modal with optional pre-selected service category
  const handleOpenBooking = (serviceName?: string) => {
    if (serviceName) {
      setSelectedService(serviceName);
    }
    setIsBookingOpen(true);
  };

  // When user clicks on any service card in Treatments
  const handleSelectTreatment = (treatmentCategory: string) => {
    setSelectedService(treatmentCategory);
    setIsBookingOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#16333e] selection:bg-teal-100 selection:text-teal-900">
      {/* Navigation Bar */}
      <Navbar
        onOpenBooking={() => handleOpenBooking()}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* Main Content Area */}
      <main className="grow">
        {/* Hero Section with animated teeth graphics */}
        <Hero onOpenBooking={() => handleOpenBooking()} />

        {/* Our Story / About Section */}
        <AboutSection onOpenBooking={() => handleOpenBooking()} />

        {/* Treatments Section: clicking on any service transfers to modal with category pre-selected */}
        <TreatmentsSection onSelectTreatment={handleSelectTreatment} />

        {/* Why Us Section with 3 pillars and ambient animated teeth */}
        <WhyUsSection />

        {/* Google Reviews Carousel with glowing tooth motif */}
        <ReviewsSection />

        {/* Contact & Map Section */}
        <ContactSection onOpenBooking={() => handleOpenBooking()} />
      </main>

      {/* Footer */}
      <Footer
        onOpenBooking={() => handleOpenBooking()}
        onOpenPrivacy={() => setIsPrivacyOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* Smooth Appointment Booking Modal */}
      <AppointmentModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        initialService={selectedService}
      />

      {/* Patient Privacy Modal */}
      <PrivacyModal
        isOpen={isPrivacyOpen}
        onClose={() => setIsPrivacyOpen(false)}
      />

      {/* Clinic Workspace Admin Modal */}
      <AdminModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
      />

      {/* Floating WhatsApp Action Button */}
      <WhatsAppFloat />

      {/* AI Dental Assistant Chatbot (Pearl) */}
      <DentalChatbot onOpenBooking={handleOpenBooking} />
    </div>
  );
}
