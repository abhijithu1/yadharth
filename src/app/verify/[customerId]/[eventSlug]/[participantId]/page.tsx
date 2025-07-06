"use client";
import { createClient } from '@supabase/supabase-js';
import React, { useEffect, useState, use } from 'react'; // Add use import
import { motion } from 'framer-motion';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

interface Participant {
  id: string;
  name: string;
  email: string;
  phone?: string;
  event_id: string;
  customer_id: string;
}

interface Event {
  id: string;
  event_name: string;
  org_name: string;
  start_date: string;
  end_date: string;
  type_of_event: string;
  theme_option: string;
}

interface Customer {
  id: string;
  customer_name: string;
  email: string;
}

// Theme configurations
const themes = {
  classic: {
    bgGradient: "from-white to-gray-50",
    cardBg: "bg-white",
    primaryColor: "text-gray-800",
    accentColor: "text-blue-700",
    highlightColor: "text-blue-700",
    sealColor: "#3b82f6", // blue-500
    sealStrokeColor: "#2563eb", // blue-600
    detailsBg: "bg-gray-50",
    borderColor: "border-gray-200",
    fontFamily: "font-serif",
    titleClass: "font-serif text-3xl text-center",
    badgeBg: "bg-blue-500",
  },
  modern: {
    bgGradient: "from-white to-slate-50",
    cardBg: "bg-white",
    primaryColor: "text-black",
    accentColor: "text-black",
    highlightColor: "text-gray-800",
    sealColor: "#000000", // black
    sealStrokeColor: "#000000", // black
    detailsBg: "bg-gray-50",
    borderColor: "border-gray-200",
    fontFamily: "font-sans",
    titleClass: "font-sans text-4xl font-black tracking-tight text-center",
    badgeBg: "bg-black",
  },
  corporate: {
    bgGradient: "from-white to-sky-50",
    cardBg: "bg-white",
    primaryColor: "text-gray-900",
    accentColor: "text-sky-700",
    highlightColor: "text-sky-700",
    sealColor: "#0284c7", // sky-600
    sealStrokeColor: "#0369a1", // sky-700
    detailsBg: "bg-sky-50",
    borderColor: "border-gray-200",
    fontFamily: "font-sans",
    titleClass: "font-sans text-3xl font-bold text-center",
    badgeBg: "bg-sky-600",
  }
};

async function getParticipantData(participantId: string) {
  try {
    console.log("Fetching data for participant ID:", participantId);
    
    // Get participant data
    const { data: participant, error: participantError } = await supabase
      .from('registrations')
      .select('*')
      .eq('id', participantId)
      .single();

    if (participantError) {
      console.error("Participant error:", participantError);
      return { error: 'Participant not found' };
    }
    
    if (!participant) {
      console.error("No participant found with ID:", participantId);
      return { error: 'Participant not found' };
    }

    console.log("Found participant:", participant);

    // Get event data
    const { data: event, error: eventError } = await supabase
      .from('events')
      .select('*')
      .eq('id', participant.event_id)
      .single();

    if (eventError) {
      console.error("Event error:", eventError);
      return { error: 'Event not found' };
    }
    
    if (!event) {
      console.error("No event found with ID:", participant.event_id);
      return { error: 'Event not found' };
    }

    console.log("Found event:", event);

    // Get customer data
    const { data: customer, error: customerError } = await supabase
      .from('customers')
      .select('*')
      .eq('id', participant.customer_id)
      .single();

    if (customerError) {
      console.error("Customer error:", customerError);
      return { error: 'Customer not found' };
    }
    
    if (!customer) {
      console.error("No customer found with ID:", participant.customer_id);
      return { error: 'Customer not found' };
    }

    console.log("Found customer:", customer);

    return {
      participant,
      event,
      customer
    };
  } catch (error) {
    console.error('Error fetching data:', error);
    return { error: 'Failed to fetch certificate data' };
  }
}

export default function VerificationPage({ 
  params 
}: { 
  params: Promise<{ customerId: string; eventSlug: string; participantId: string }> | { customerId: string; eventSlug: string; participantId: string }
}) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [participantData, setParticipantData] = useState<{
    participant: Participant;
    event: Event;
    customer: Customer;
  } | null>(null);
  const [themeKey, setThemeKey] = useState<"classic" | "modern" | "corporate">("classic");
  const [resolvedParams, setResolvedParams] = useState<{ 
    customerId: string; 
    eventSlug: string; 
    participantId: string 
  } | null>(null);

  // First, resolve the params promise
  useEffect(() => {
    async function resolveParams() {
      try {
        if (params instanceof Promise) {
          const unwrappedParams = await params;
          setResolvedParams(unwrappedParams);
        } else {
          setResolvedParams(params);
        }
      } catch (err) {
        console.error("Failed to resolve params:", err);
        setError("Invalid certificate URL");
        setLoading(false);
      }
    }
    
    resolveParams();
  }, [params]);
  
  // Once params are resolved, load the data
  useEffect(() => {
    if (!resolvedParams) return;
    
    console.log("Component mounted with params:", resolvedParams);
    
    async function loadData() {
      try {
        const data = await getParticipantData(resolvedParams.participantId? resolvedParams.participantId : '');
        
        if ('error' in data) {
          console.error("Error in data:", data.error);
          setError(data.error || 'Unknown error occurred');
        } else {
          setParticipantData(data);
          if (data.event.theme_option && 
              ['classic', 'modern', 'corporate'].includes(data.event.theme_option)) {
            setThemeKey(data.event.theme_option as "classic" | "modern" | "corporate");
          }
        }
      } catch (err: any) {
        console.error("Failed to load verification data:", err);
        setError(err?.message || "An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    }
    
    loadData();
  }, [resolvedParams]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-black"></div>
          <p className="mt-4 text-gray-600">Verifying certificate...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-red-100">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-2xl shadow-2xl p-8 border border-red-200 text-center max-w-md w-full mx-4"
        >
          <div className="text-red-400 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-red-700 mb-4">Certificate Not Found</h1>
          <p className="text-red-500 mb-6">{error}</p>
          <a 
            href="/" 
            className="inline-block px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Return Home
          </a>
        </motion.div>
      </div>
    );
  }

  if (!participantData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="text-red-400 text-xl mb-4">No data found</div>
          <a 
            href="/" 
            className="inline-block px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            Return Home
          </a>
        </div>
      </div>
    );
  }

  const { participant, event, customer } = participantData;
  const theme = themes[themeKey];
  
  return (
    <div className={`min-h-screen bg-gradient-to-br ${theme.bgGradient} flex items-center justify-center py-12 px-4 ${theme.fontFamily}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className={`w-full max-w-2xl ${theme.cardBg} border ${theme.borderColor} rounded-3xl shadow-2xl p-10 relative overflow-visible`}
      >
        {/* Verified Seal */}
        <motion.div 
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
          className="absolute -top-20 left-1/2 -translate-x-1/2 z-10"
        >
          <div className="flex flex-col items-center">
            <div className={`${theme.badgeBg} rounded-full p-3 shadow-lg border-4 border-white`}>
              {/* SVG Seal */}
              <svg width="100" height="100" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="40" cy="40" r="36" fill={theme.sealColor} stroke={theme.sealStrokeColor} strokeWidth="6" />
                <path d="M25 42l10 10 20-22" stroke="#fff" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span className={`mt-2 ${theme.accentColor} font-bold text-lg tracking-wide uppercase drop-shadow`}>Verified</span>
          </div>
        </motion.div>

        {/* Card Content */}
        <div className="pt-20 pb-2 flex flex-col items-center">
          <motion.h1 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className={`${theme.titleClass} mb-2`}
          >
            {themeKey === "modern" ? "CERTIFICATE" : "Certificate of Completion"}
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className={`${theme.accentColor} text-center font-semibold mb-6`}
          >
            This certificate has been verified and is authentic.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className={`w-full ${theme.detailsBg} rounded-xl p-6 shadow-inner mb-6`}
          >
            <div className={`text-lg ${theme.primaryColor} leading-relaxed text-center`}>
              <span className="font-bold">{participant.name}</span> successfully completed{' '}
              <span className={`font-bold ${theme.highlightColor}`}>{event.event_name}</span> organised by{' '}
              <span className="font-bold">{event.org_name}</span> from{' '}
              <span className={`font-bold ${theme.highlightColor}`}>
                {new Date(event.start_date).toLocaleDateString()}
              </span> to{' '}
              <span className={`font-bold ${theme.highlightColor}`}>
                {new Date(event.end_date).toLocaleDateString()}
              </span>.
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
              className={`${theme.cardBg} border ${theme.borderColor} rounded-lg p-5 shadow-sm`}
            >
              <h3 className={`text-lg font-semibold ${theme.primaryColor} mb-3`}>Participant Details</h3>
              <div className="space-y-2 text-sm">
                <div><span className="text-gray-500">Name:</span> <span className={theme.primaryColor}>{participant.name}</span></div>
                <div><span className="text-gray-500">Email:</span> <span className={theme.primaryColor}>{participant.email}</span></div>
                {participant.phone && (
                  <div><span className="text-gray-500">Phone:</span> <span className={theme.primaryColor}>{participant.phone}</span></div>
                )}
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
              className={`${theme.cardBg} border ${theme.borderColor} rounded-lg p-5 shadow-sm`}
            >
              <h3 className={`text-lg font-semibold ${theme.primaryColor} mb-3`}>Event Details</h3>
              <div className="space-y-2 text-sm">
                <div><span className="text-gray-500">Event:</span> <span className={theme.primaryColor}>{event.event_name}</span></div>
                <div><span className="text-gray-500">Type:</span> <span className={theme.primaryColor}>{event.type_of_event}</span></div>
                <div><span className="text-gray-500">Organization:</span> <span className={theme.primaryColor}>{event.org_name}</span></div>
              </div>
            </motion.div>
          </div>

          {/* Celebratory message */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="flex flex-col items-center mt-6"
          >
            <span className="text-gray-500 text-xs mt-1">This certificate is valid and recognized.</span>
          </motion.div>
        </div>

        {/* Additional verification info for certain themes */}
        {themeKey === "corporate" && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1 }}
            className="mt-6 border-t border-gray-200 pt-4"
          >
            <div className="flex justify-between items-center">
              <div className="text-xs text-gray-500">
                Verification ID: <span className="font-mono">{participant.id.substring(0, 8)}</span>
              </div>
              <div className="text-xs text-gray-500">
                Issued on: {new Date().toLocaleDateString()}
              </div>
            </div>
          </motion.div>
        )}

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="text-center text-xs text-gray-400 mt-8"
        >
          © Yadharth {new Date().getFullYear()}
        </motion.div>
      </motion.div>
    </div>
  );
}