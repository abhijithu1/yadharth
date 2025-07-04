import { createClient } from '@supabase/supabase-js';
import React from 'react';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

interface Participant {
  id: string;
  name: string;
  email: string;
  phone: string;
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
}

interface Customer {
  id: string;
  customer_name: string;
  email: string;
}

async function getParticipantData(participantId: string) {
  try {
    // Get participant data
    const { data: participant, error: participantError } = await supabase
      .from('registrations')
      .select('*')
      .eq('id', participantId)
      .single();

    if (participantError || !participant) {
      return { error: 'Participant not found' };
    }

    // Get event data
    const { data: event, error: eventError } = await supabase
      .from('events')
      .select('*')
      .eq('id', participant.event_id)
      .single();

    if (eventError || !event) {
      return { error: 'Event not found' };
    }

    // Get customer data
    const { data: customer, error: customerError } = await supabase
      .from('customers')
      .select('*')
      .eq('id', participant.customer_id)
      .single();

    if (customerError || !customer) {
      return { error: 'Customer not found' };
    }

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

export default async function VerificationPage({ 
  params 
}: { 
  params: Promise<{ customerId: string; eventSlug: string; participantId: string }> 
}) {
  const resolvedParams = await params;
  const data = await getParticipantData(resolvedParams.participantId);

  if ('error' in data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-100 to-red-300">
        <div className="bg-white rounded-2xl shadow-2xl p-8 border border-red-200 text-center">
          <div className="text-red-400 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-red-700 mb-4">Certificate Not Found</h1>
          <p className="text-red-500">{data.error}</p>
        </div>
      </div>
    );
  }

  const { participant, event, customer } = data;

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-green-50 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-2xl bg-white border border-gray-200 rounded-3xl shadow-2xl p-10 relative overflow-visible animate-in fade-in-50 slide-in-from-bottom-10 duration-700">
        {/* Verified Seal */}
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 z-10 animate-in zoom-in-50 duration-500 delay-200">
          <div className="flex flex-col items-center">
            <div className="bg-green-500 rounded-full p-3 shadow-lg border-4 border-white">
              {/* SVG Seal */}
              <svg width="100" height="100" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="40" cy="40" r="36" fill="#22c55e" stroke="#16a34a" strokeWidth="6" />
                <path d="M25 42l10 10 20-22" stroke="#fff" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span className="mt-2 text-green-700 font-bold text-lg tracking-wide uppercase drop-shadow">Verified</span>
          </div>
        </div>

        {/* Card Content */}
        <div className="pt-20 pb-2 flex flex-col items-center">
          <h1 className="text-3xl font-extrabold text-center text-black mb-2 tracking-tight animate-in fade-in-50 delay-300">
            Certificate of Completion
          </h1>
          <p className="text-green-700 text-center font-semibold mb-6 animate-in fade-in-50 delay-400">
            This certificate has been verified and is authentic.
          </p>

          <div className="w-full bg-gray-50 rounded-xl p-6 shadow-inner mb-4">
            <div className="text-lg text-gray-800 leading-relaxed text-center">
              <span className="font-bold text-black">{participant.name}</span> successfully completed{' '}
              <span className="font-bold text-green-700">{event.event_name}</span> organised by{' '}
              <span className="font-bold text-black">{event.org_name}</span> from{' '}
              <span className="font-bold text-green-700">{new Date(event.start_date).toLocaleDateString()}</span> to{' '}
              <span className="font-bold text-green-700">{new Date(event.end_date).toLocaleDateString()}</span>.
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
            <div className="bg-white border border-gray-100 rounded-lg p-4 shadow-sm">
              <h3 className="text-lg font-semibold text-black mb-3">Participant Details</h3>
              <div className="space-y-2 text-sm">
                <div><span className="text-gray-500">Name:</span> <span className="text-black">{participant.name}</span></div>
                <div><span className="text-gray-500">Email:</span> <span className="text-black">{participant.email}</span></div>
                <div><span className="text-gray-500">Phone:</span> <span className="text-black">{participant.phone}</span></div>
              </div>
            </div>

            <div className="bg-white border border-gray-100 rounded-lg p-4 shadow-sm">
              <h3 className="text-lg font-semibold text-black mb-3">Event Details</h3>
              <div className="space-y-2 text-sm">
                <div><span className="text-gray-500">Event:</span> <span className="text-black">{event.event_name}</span></div>
                <div><span className="text-gray-500">Type:</span> <span className="text-black">{event.type_of_event}</span></div>
                <div><span className="text-gray-500">Organization:</span> <span className="text-black">{event.org_name}</span></div>
              </div>
            </div>
          </div>

          {/* Celebratory message */}
          <div className="flex flex-col items-center mt-6 animate-in fade-in-50 delay-700">
            <span className="text-green-600 font-bold text-lg">🎉 Congratulations! 🎉</span>
            <span className="text-gray-500 text-xs mt-1">This certificate is valid and recognized.</span>
          </div>
        </div>

        <div className="text-center text-xs text-gray-400 mt-8">
          © Yadharth
        </div>
      </div>
    </div>
  );
}