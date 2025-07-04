"use client";
import { motion } from 'framer-motion';
import Image from 'next/image';
import { use } from 'react';

export default function CertificateVerificationPage({
    params,
  }: {
    params: Promise<{ certificate_id: string }>;
  }) {
    // Resolve the params promise
    const resolvedParams = use(params);
    
    // 🔁 Simulated certificate data (you can replace with real fetch logic later)
    const mockData = {
      participant_name: 'Kishan P K',
      email: 'kishan@example.com',
      phone: '9876543210',
      status: 'Issued',
      event: {
        event_name: 'AI Summit',
        organisation: 'OpenAI Events',
        event_type: 'Workshop',
        start_date: new Date('2025-03-15'),
        end_date: new Date('2025-03-17'),
        customer: { name: 'Priya Sharma' },
      },
    };
  
    const safe = (val: any) =>
      val === null || val === undefined || val === '' ? 'Data Unavailable' : val;
  
    const {
      participant_name,
      email,
      phone,
      status,
      event,
    } = mockData;
  
    const event_name = safe(event?.event_name);
    const organisation = safe(event?.organisation);
    const start_date = event?.start_date
      ? new Date(event.start_date).toLocaleDateString()
      : 'Data Unavailable';
    const end_date = event?.end_date
      ? new Date(event.end_date).toLocaleDateString()
      : 'Data Unavailable';
    const event_type = safe(event?.event_type);
    const organizer_name = safe(event?.customer?.name);
  
    return (
      <div className="min-h-screen bg-gradient-to-br from-white to-green-50 flex items-center justify-center py-12 px-4">
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, type: 'spring', stiffness: 80 }}
          className="w-full max-w-lg bg-white border border-gray-200 rounded-3xl shadow-2xl p-8 relative overflow-visible"
        >
          {/* Animated Verified Seal */}
          <motion.div
            initial={{ scale: 0, rotate: -30 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 10, delay: 0.2 }}
            className="absolute -top-16 left-1/2 -translate-x-1/2 z-10"
          >
            <div className="flex flex-col items-center">
              <div className="bg-green-500 rounded-full p-3 shadow-lg border-4 border-white">
                {/* SVG Seal */}
                <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="40" cy="40" r="36" fill="#22c55e" stroke="#16a34a" strokeWidth="6" />
                  <path d="M25 42l10 10 20-22" stroke="#fff" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <span className="mt-2 text-green-700 font-bold text-lg tracking-wide uppercase drop-shadow">Verified</span>
            </div>
          </motion.div>
  
          {/* Card Content */}
          <div className="pt-16 pb-2 flex flex-col items-center">
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-2xl font-extrabold text-center text-black mb-2 tracking-tight"
            >
              Certificate Successfully Verified!
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-green-700 text-center font-semibold mb-6"
            >
              This certificate is authentic and issued by the event organizer.
            </motion.p>
  
            <div className="w-full bg-gray-50 rounded-xl p-5 shadow-inner mb-4">
              <div className="text-base space-y-2 text-gray-800">
                <div className="flex items-center justify-between">
                  <span className="font-semibold">Status:</span>
                  <span className="text-green-600 font-bold">{safe(status)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold">Name:</span>
                  <span>{safe(participant_name)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold">Email:</span>
                  <span>{safe(email)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold">Phone:</span>
                  <span>{safe(phone)}</span>
                </div>
                <hr className="my-3 border-gray-300" />
                <div className="flex items-center justify-between">
                  <span className="font-semibold">Event:</span>
                  <span>{event_name} <span className="text-xs text-gray-500">({event_type})</span></span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold">Organizer:</span>
                  <span>{organisation} <span className="text-xs text-gray-500">({organizer_name})</span></span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold">Duration:</span>
                  <span>{start_date} to {end_date}</span>
                </div>
              </div>
            </div>
  
            {/* Optional: Confetti or celebratory effect */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="flex flex-col items-center mt-2"
            >
              <span className="text-green-600 font-bold text-lg">🎉 Congratulations! 🎉</span>
              <span className="text-gray-500 text-xs mt-1">This certificate is valid and recognized.</span>
            </motion.div>
          </div>
  
          <div className="text-center text-xs text-gray-400 mt-8">
            © Certificate Verification Platform
          </div>
        </motion.div>
        </div>
    );
  }