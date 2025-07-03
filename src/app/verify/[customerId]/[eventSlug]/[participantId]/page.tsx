import { createClient } from '@supabase/supabase-js';

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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-900 to-red-700">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-white/20 text-center">
          <div className="text-red-400 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-white mb-4">Certificate Not Found</h1>
          <p className="text-red-200">{data.error}</p>
        </div>
      </div>
    );
  }

  const { participant, event, customer } = data;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-purple-900 to-gray-900 p-6">
      <div className="w-full max-w-2xl mx-auto bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-white/20">
        <div className="text-center mb-8">
          <div className="bg-gradient-to-tr from-green-500 to-blue-500 p-4 rounded-full shadow-lg mb-4 inline-block">
            <svg className="h-12 w-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-3xl font-extrabold text-white mb-2">Certificate of Completion</h1>
          <p className="text-blue-200">This certificate has been verified and is authentic</p>
        </div>

        <div className="bg-white/5 rounded-xl p-6 mb-6">
          <div className="text-center text-lg text-white leading-relaxed">
            <span className="font-bold text-blue-300">{participant.name}</span> successfully completed{" "}
            <span className="font-bold text-purple-300">{event.event_name}</span> organised by{" "}
            <span className="font-bold text-green-300">{event.org_name}</span> from{" "}
            <span className="font-bold text-yellow-300">
              {new Date(event.start_date).toLocaleDateString()}
            </span>{" "}
            to{" "}
            <span className="font-bold text-yellow-300">
              {new Date(event.end_date).toLocaleDateString()}
            </span>.
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white/5 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-white mb-3">Participant Details</h3>
            <div className="space-y-2 text-sm">
              <div><span className="text-gray-300">Name:</span> <span className="text-white">{participant.name}</span></div>
              <div><span className="text-gray-300">Email:</span> <span className="text-white">{participant.email}</span></div>
              <div><span className="text-gray-300">Phone:</span> <span className="text-white">{participant.phone}</span></div>
            </div>
          </div>

          <div className="bg-white/5 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-white mb-3">Event Details</h3>
            <div className="space-y-2 text-sm">
              <div><span className="text-gray-300">Event:</span> <span className="text-white">{event.event_name}</span></div>
              <div><span className="text-gray-300">Type:</span> <span className="text-white">{event.type_of_event}</span></div>
              <div><span className="text-gray-300">Organization:</span> <span className="text-white">{event.org_name}</span></div>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-2 text-green-400 text-sm">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Certificate Verified
          </div>
        </div>
      </div>
    </div>
  );
} 