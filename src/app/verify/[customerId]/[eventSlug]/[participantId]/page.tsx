"use client";
import { createClient } from '@supabase/supabase-js';
import React, { useEffect, useState, use } from 'react'; // Add use import
import { motion } from 'framer-motion';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

// Helper function to format dates in DD/MM/YY format
function formatDate(dateString: string | Date): string {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear().toString().slice(-2);
  return `${day}/${month}/${year}`;
}

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

// --- Classic Template ---
function ClassicTemplate({ participant, event, customer }: any) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-white py-12 px-4 font-serif">
      <div className="bg-white border border-gray-200 rounded-2xl shadow-xl max-w-2xl w-full p-10 relative">
        {/* Blue Seal */}
        <div className="absolute -top-16 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center">
          <div className="bg-blue-500 rounded-full p-4 shadow-lg border-4 border-white">
            <svg width="60" height="60" viewBox="0 0 60 60" fill="none"><circle cx="30" cy="30" r="26" fill="#3b82f6" stroke="#2563eb" strokeWidth="6" /><path d="M20 32l7 7 13-15" stroke="#fff" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </div>
          <span className="mt-2 text-blue-800 font-extrabold text-lg tracking-wide uppercase drop-shadow">VERIFIED</span>
        </div>
        <div className="pt-16 pb-2 flex flex-col items-center">
          <h1 className="text-3xl font-extrabold mb-2 text-blue-900">Certificate of Completion</h1>
          <div className="border-b-2 border-gray-200 w-24 mb-6"></div>
          <p className="text-lg mb-2 text-gray-800 font-semibold">This is to certify that</p>
          <div className="text-2xl font-extrabold text-blue-900 mb-2">{participant.name}</div>
          <p className="mb-2 text-gray-800 font-semibold">has successfully completed</p>
          <div className="text-xl font-bold text-blue-900 mb-2">{event.event_name}</div>
          <p className="mb-2 text-gray-800 font-semibold">organized by <span className="font-bold text-blue-900">{event.org_name}</span></p>
          <p className="mb-4 text-gray-800 font-semibold">from <span className="font-bold text-blue-900">{formatDate(event.start_date)}</span> to <span className="font-bold text-blue-900">{formatDate(event.end_date)}</span></p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full mt-6">
            <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
              <h3 className="text-lg font-bold text-blue-900 mb-3">Participant Details</h3>
              <div className="space-y-2 text-sm">
                <div><span className="text-gray-700 font-semibold">Name:</span> <span className="text-gray-900">{participant.name}</span></div>
                <div><span className="text-gray-700 font-semibold">Email:</span> <span className="text-gray-900">{participant.email}</span></div>
                {participant.phone && <div><span className="text-gray-700 font-semibold">Phone:</span> <span className="text-gray-900">{participant.phone}</span></div>}
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
              <h3 className="text-lg font-bold text-blue-900 mb-3">Event Details</h3>
              <div className="space-y-2 text-sm">
                <div><span className="text-gray-700 font-semibold">Event:</span> <span className="text-gray-900">{event.event_name}</span></div>
                <div><span className="text-gray-700 font-semibold">Type:</span> <span className="text-gray-900">{event.type_of_event}</span></div>
                <div><span className="text-gray-700 font-semibold">Organization:</span> <span className="text-gray-900">{event.org_name}</span></div>
              </div>
            </div>
          </div>
          <div className="flex justify-between w-full text-xs text-blue-900 mt-8 font-semibold">
            <div>Verification ID: <span className="font-mono">{participant.id.substring(0, 8)}</span></div>
            <div>Issued on: {formatDate(new Date())}</div>
          </div>
          <div className="mt-6 text-center text-xs text-gray-500">© Yadharth {new Date().getFullYear()}</div>
        </div>
      </div>
    </div>
  );
}

// --- Modern Template ---
function ModernTemplate({ participant, event, customer }: any) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white py-12 px-4 font-sans">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full p-12 border border-gray-200 relative">
        {/* Black Seal */}
        <div className="absolute -top-16 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center">
          <div className="bg-black rounded-full p-4 shadow-lg border-4 border-white">
            <svg width="60" height="60" viewBox="0 0 60 60" fill="none"><circle cx="30" cy="30" r="26" fill="#000" stroke="#000" strokeWidth="6" /><path d="M20 32l7 7 13-15" stroke="#fff" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </div>
        </div>
        <div className="pt-16 pb-2 flex flex-col items-center">
          <h1 className="text-5xl font-black tracking-tight mb-2 text-black">CERTIFICATE</h1>
          <div className="border-b border-gray-300 w-24 mb-8"></div>
          <div className="text-lg text-black mb-2 font-semibold">Awarded to</div>
          <div className="text-2xl font-bold text-black mb-2">{participant.name}</div>
          <div className="text-gray-800 text-sm mb-6">{participant.email}</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full mb-6">
            <div className="rounded-lg p-5 border border-gray-200">
              <h3 className="text-lg font-bold text-black mb-3">Participant Details</h3>
              <div className="space-y-2 text-sm">
                <div><span className="text-gray-700 font-semibold">Name:</span> <span className="text-black">{participant.name}</span></div>
                <div><span className="text-gray-700 font-semibold">Email:</span> <span className="text-black">{participant.email}</span></div>
                {participant.phone && <div><span className="text-gray-700 font-semibold">Phone:</span> <span className="text-black">{participant.phone}</span></div>}
              </div>
            </div>
            <div className="rounded-lg p-5 border border-gray-200">
              <h3 className="text-lg font-bold text-black mb-3">Event Details</h3>
              <div className="space-y-2 text-sm">
                <div><span className="text-gray-700 font-semibold">Event:</span> <span className="text-black">{event.event_name}</span></div>
                <div><span className="text-gray-700 font-semibold">Type:</span> <span className="text-black">{event.type_of_event}</span></div>
                <div><span className="text-gray-700 font-semibold">Organization:</span> <span className="text-black">{event.org_name}</span></div>
              </div>
            </div>
          </div>
          <div className="flex justify-between w-full text-xs text-black mt-8 font-semibold">
            <div>Verification ID: <span className="font-mono">{participant.id.substring(0, 8)}</span></div>
            <div>Issued on: {formatDate(new Date())}</div>
          </div>
          <div className="mt-6 text-center text-xs text-gray-700">© Yadharth {new Date().getFullYear()}</div>
        </div>
      </div>
    </div>
  );
}

// --- Corporate Template ---
function CorporateTemplate({ participant, event, customer }: any) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-50 to-white py-12 px-4 font-sans">
      <div className="bg-white border-2 border-sky-600 rounded-2xl shadow-xl max-w-2xl w-full p-10 relative">
        {/* Blue Seal */}
        <div className="absolute -top-16 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center">
          <div className="bg-sky-600 rounded-full p-4 shadow-lg border-4 border-white">
            <svg width="60" height="60" viewBox="0 0 60 60" fill="none"><circle cx="30" cy="30" r="26" fill="#0284c7" stroke="#0369a1" strokeWidth="6" /><path d="M20 32l7 7 13-15" stroke="#fff" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </div>
        </div>
        <div className="pt-16 pb-2 flex flex-col items-center">
          <h1 className="text-3xl font-extrabold text-sky-800 mb-2">Certificate of Completion</h1>
          <div className="border-b-2 border-sky-600 w-24 mb-6"></div>
          <div className="text-lg mb-2 text-gray-900 font-semibold">This is to certify that</div>
          <div className="text-2xl font-extrabold text-sky-800 mb-2">{participant.name}</div>
          <div className="mb-2 text-gray-900 font-semibold">has successfully completed</div>
          <div className="text-xl font-bold text-sky-800 mb-2">{event.event_name}</div>
          <div className="mb-2 text-gray-900 font-semibold">organized by <span className="font-bold text-sky-800">{event.org_name}</span></div>
          <p className="mb-4 text-gray-900 font-semibold">from <span className="font-bold text-sky-800">{formatDate(event.start_date)}</span> to <span className="font-bold text-sky-800">{formatDate(event.end_date)}</span></p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full mt-6">
            <div className="bg-sky-50 rounded-lg p-5 border border-sky-200">
              <h3 className="text-lg font-bold text-sky-800 mb-3">Participant Details</h3>
              <div className="space-y-2 text-sm">
                <div><span className="text-gray-700 font-semibold">Name:</span> <span className="text-gray-900">{participant.name}</span></div>
                <div><span className="text-gray-700 font-semibold">Email:</span> <span className="text-gray-900">{participant.email}</span></div>
                {participant.phone && <div><span className="text-gray-700 font-semibold">Phone:</span> <span className="text-gray-900">{participant.phone}</span></div>}
              </div>
            </div>
            <div className="bg-sky-50 rounded-lg p-5 border border-sky-200">
              <h3 className="text-lg font-bold text-sky-800 mb-3">Event Details</h3>
              <div className="space-y-2 text-sm">
                <div><span className="text-gray-700 font-semibold">Event:</span> <span className="text-gray-900">{event.event_name}</span></div>
                <div><span className="text-gray-700 font-semibold">Type:</span> <span className="text-gray-900">{event.type_of_event}</span></div>
                <div><span className="text-gray-700 font-semibold">Organization:</span> <span className="text-gray-900">{event.org_name}</span></div>
              </div>
            </div>
          </div>
          <div className="flex justify-between w-full text-xs text-sky-800 mt-8 font-semibold">
            <div>Verification ID: <span className="font-mono">{participant.id.substring(0, 8)}</span></div>
            <div>Issued on: {formatDate(new Date())}</div>
          </div>
          <div className="mt-6 text-center text-xs text-gray-700">© Yadharth {new Date().getFullYear()}</div>
        </div>
      </div>
    </div>
  );
}

// --- Elegant Template ---
function ElegantTemplate({ participant, event, customer }: any) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-50 to-rose-100 py-12 px-4 font-serif">
      <div className="bg-[#f9f6f2] border border-yellow-300 rounded-3xl shadow-2xl max-w-2xl w-full p-12 relative" style={{ boxShadow: '0 8px 32px 0 rgba(60, 0, 0, 0.08)' }}>
        {/* Gold Seal */}
        <div className="absolute -top-16 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center">
          <div className="bg-gradient-to-br from-yellow-400 to-rose-400 rounded-full p-4 shadow-lg border-4 border-white">
            <svg width="60" height="60" viewBox="0 0 60 60" fill="none"><circle cx="30" cy="30" r="26" fill="#fbbf24" stroke="#b91c1c" strokeWidth="6" /><path d="M20 32l7 7 13-15" stroke="#fff" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </div>
        </div>
        <div className="pt-16 pb-2 flex flex-col items-center">
          <h1 className="text-4xl font-extrabold text-yellow-900 mb-2" style={{ fontFamily: 'cursive' }}>Certificate of Distinction</h1>
          <div className="border-b-2 border-yellow-300 w-24 mb-6"></div>
          <div className="text-lg mb-4 text-yellow-900 font-semibold">This is to honor</div>
          <div className="text-2xl font-extrabold text-rose-800 mb-2" style={{ fontFamily: 'cursive' }}>{participant.name}</div>
          <div className="mb-4 text-yellow-900 font-semibold">for outstanding achievement in</div>
          <div className="text-xl font-bold text-yellow-900 mb-2">{event.event_name}</div>
          <div className="mb-4 text-yellow-900 font-semibold">organized by <span className="font-bold text-rose-800">{event.org_name}</span></div>
          <div className="mb-4 text-yellow-900 font-semibold">from <span className="font-bold text-rose-800">{formatDate(event.start_date)}</span> to <span className="font-bold text-rose-800">{formatDate(event.end_date)}</span></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full mt-6">
            <div className="bg-white/80 rounded-lg p-5 border border-yellow-200">
              <h3 className="text-lg font-bold text-yellow-900 mb-3">Participant Details</h3>
              <div className="space-y-2 text-sm">
                <div><span className="text-yellow-900 font-semibold">Name:</span> <span className="text-yellow-900">{participant.name}</span></div>
                <div><span className="text-yellow-900 font-semibold">Email:</span> <span className="text-yellow-900">{participant.email}</span></div>
                {participant.phone && <div><span className="text-yellow-900 font-semibold">Phone:</span> <span className="text-yellow-900">{participant.phone}</span></div>}
              </div>
            </div>
            <div className="bg-white/80 rounded-lg p-5 border border-yellow-200">
              <h3 className="text-lg font-bold text-yellow-900 mb-3">Event Details</h3>
              <div className="space-y-2 text-sm">
                <div><span className="text-yellow-900 font-semibold">Event:</span> <span className="text-yellow-900">{event.event_name}</span></div>
                <div><span className="text-yellow-900 font-semibold">Type:</span> <span className="text-yellow-900">{event.type_of_event}</span></div>
                <div><span className="text-yellow-900 font-semibold">Organization:</span> <span className="text-yellow-900">{event.org_name}</span></div>
              </div>
            </div>
          </div>
          <div className="flex justify-between w-full text-xs text-yellow-900 mt-8 font-semibold">
            <div>Verification ID: <span className="font-mono">{participant.id.substring(0, 8)}</span></div>
            <div>Issued on: {formatDate(new Date())}</div>
          </div>
          <div className="mt-6 text-center text-xs text-yellow-900">© Yadharth {new Date().getFullYear()}</div>
        </div>
      </div>
    </div>
  );
}

// --- Fun Template ---
function FunTemplate({ participant, event, customer }: any) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-200 via-yellow-100 to-teal-100 py-12 px-4 font-sans">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full p-10 relative overflow-hidden border-4 border-pink-300">
        {/* Star Seal */}
        <div className="absolute -top-16 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center">
          <div className="bg-gradient-to-br from-pink-400 to-yellow-300 rounded-full p-4 shadow-lg border-4 border-white">
            <svg width="60" height="60" viewBox="0 0 60 60" fill="none"><polygon points="30,6 36,24 56,24 40,36 46,54 30,42 14,54 20,36 4,24 24,24" fill="#f472b6" stroke="#fbbf24" strokeWidth="4" /><path d="M20 32l7 7 13-15" stroke="#fff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </div>
          <span className="mt-2 text-pink-800 font-extrabold text-lg tracking-wide uppercase drop-shadow animate-bounce">You Did It!</span>
        </div>
        <div className="pt-16 pb-2 flex flex-col items-center">
          <h1 className="text-3xl font-extrabold text-pink-800 mb-2">You Did It!</h1>
          <div className="border-b-2 border-pink-300 w-24 mb-6"></div>
          <div className="text-lg mb-2 text-pink-800 font-semibold">This is to celebrate</div>
          <div className="text-2xl font-extrabold text-yellow-700 mb-2">{participant.name} 🎉</div>
          <div className="mb-2 text-pink-800 font-semibold">for participating in</div>
          <div className="text-xl font-bold text-teal-800 mb-2">{event.event_name}</div>
          <div className="mb-2 text-pink-800 font-semibold">organized by <span className="font-bold text-teal-800">{event.org_name}</span></div>
          <div className="mb-2 text-pink-800 font-semibold">from <span className="font-bold text-teal-800">{formatDate(event.start_date)}</span> to <span className="font-bold text-teal-800">{formatDate(event.end_date)}</span></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full mt-6">
            <div className="bg-yellow-50 rounded-lg p-5 border-2 border-pink-200">
              <h3 className="text-lg font-bold text-pink-800 mb-3">Participant Details</h3>
              <div className="space-y-2 text-sm">
                <div><span className="text-pink-800 font-semibold">Name:</span> <span className="text-gray-900">{participant.name}</span></div>
                <div><span className="text-pink-800 font-semibold">Email:</span> <span className="text-gray-900">{participant.email}</span></div>
                {participant.phone && <div><span className="text-pink-800 font-semibold">Phone:</span> <span className="text-gray-900">{participant.phone}</span></div>}
              </div>
            </div>
            <div className="bg-teal-50 rounded-lg p-5 border-2 border-yellow-200">
              <h3 className="text-lg font-bold text-teal-800 mb-3">Event Details</h3>
              <div className="space-y-2 text-sm">
                <div><span className="text-teal-800 font-semibold">Event:</span> <span className="text-gray-900">{event.event_name}</span></div>
                <div><span className="text-teal-800 font-semibold">Type:</span> <span className="text-gray-900">{event.type_of_event}</span></div>
                <div><span className="text-teal-800 font-semibold">Organization:</span> <span className="text-gray-900">{event.org_name}</span></div>
              </div>
            </div>
          </div>
          <div className="flex justify-between w-full text-xs text-pink-800 mt-8 font-semibold">
            <div>Verification ID: <span className="font-mono">{participant.id.substring(0, 8)}</span></div>
            <div>Issued on: {formatDate(new Date())}</div>
          </div>
          <div className="mt-6 text-center text-xs text-pink-800">© Yadharth {new Date().getFullYear()}</div>
        </div>
      </div>
    </div>
  );
}

export default function VerificationPage({ 
  params 
}: { 
  params: Promise<{ customerId: string; eventSlug: string; participantId: string }>
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
        const unwrappedParams = await params;
        setResolvedParams(unwrappedParams);
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
        // Add null check before accessing participantId
        const participantId = resolvedParams?.participantId || '';
        const data = await getParticipantData(participantId);
        
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

  switch (event.theme_option) {
    case "classic":
      return <ClassicTemplate participant={participant} event={event} customer={customer} />;
    case "modern":
      return <ModernTemplate participant={participant} event={event} customer={customer} />;
    case "corporate":
      return <CorporateTemplate participant={participant} event={event} customer={customer} />;
    case "elegant":
      return <ElegantTemplate participant={participant} event={event} customer={customer} />;
    case "fun":
      return <FunTemplate participant={participant} event={event} customer={customer} />;
    default:
      return <ClassicTemplate participant={participant} event={event} customer={customer} />;
  }
}