"use client";
import { motion } from 'framer-motion';

export default async function EventDetailsPage({ params }: { params: Promise<{ eventId: string }> }) {
  const resolvedParams = await params;
  // 🔁 Simulated event data (replace with real fetch logic later)
  const mockEvent = {
    event_name: 'AI Summit',
    org_name: 'OpenAI Events',
    type_of_event: 'Workshop',
    start_date: new Date('2025-03-15'),
    end_date: new Date('2025-03-17'),
    organizer: 'Priya Sharma',
    status: 'Active',
    description: 'A premier workshop on Artificial Intelligence, featuring top speakers and hands-on sessions.'
  };

  const safe = (val: any) => val === null || val === undefined || val === '' ? 'Data Unavailable' : val;

  const event_name = safe(mockEvent.event_name);
  const org_name = safe(mockEvent.org_name);
  const type_of_event = safe(mockEvent.type_of_event);
  const start_date = mockEvent.start_date ? new Date(mockEvent.start_date).toLocaleDateString() : 'Data Unavailable';
  const end_date = mockEvent.end_date ? new Date(mockEvent.end_date).toLocaleDateString() : 'Data Unavailable';
  const organizer = safe(mockEvent.organizer);
  const status = safe(mockEvent.status);
  const description = safe(mockEvent.description);

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-green-50 flex items-center justify-center py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, type: 'spring', stiffness: 80 }}
        className="w-full max-w-lg bg-white border border-gray-200 rounded-3xl shadow-2xl p-8 relative overflow-visible"
      >
        {/* Animated Event Details Seal */}
        <motion.div
          initial={{ scale: 0, rotate: -30 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 10, delay: 0.2 }}
          className="absolute -top-16 left-1/2 -translate-x-1/2 z-10"
        >
          <div className="flex flex-col items-center">
            <div className="bg-black rounded-full p-3 shadow-lg border-4 border-white">
              {/* SVG Seal */}
              <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="40" cy="40" r="36" fill="#000" stroke="#22c55e" strokeWidth="6" />
                <path d="M25 42l10 10 20-22" stroke="#22c55e" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span className="mt-2 text-black font-bold text-lg tracking-wide uppercase drop-shadow">Event Details</span>
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
            {event_name}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-gray-700 text-center font-semibold mb-6"
          >
            {description}
          </motion.p>

          <div className="w-full bg-gray-50 rounded-xl p-5 shadow-inner mb-4">
            <div className="text-base space-y-2 text-gray-800">
              <div className="flex items-center justify-between">
                <span className="font-semibold">Status:</span>
                <span className="text-green-600 font-bold">{status}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-semibold">Organizer:</span>
                <span>{org_name} <span className="text-xs text-gray-500">({organizer})</span></span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-semibold">Type:</span>
                <span>{type_of_event}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-semibold">Duration:</span>
                <span>{start_date} to {end_date}</span>
              </div>
            </div>
          </div>

          {/* Optional: Celebratory effect */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="flex flex-col items-center mt-2"
          >
            <span className="text-green-600 font-bold text-lg">🎉 Welcome to the Event! 🎉</span>
            <span className="text-gray-500 text-xs mt-1">This event is active and ready for participants.</span>
          </motion.div>
        </div>

        <div className="text-center text-xs text-gray-400 mt-8">
          © Event Management Platform
        </div>
      </motion.div>
    </div>
  );
} 