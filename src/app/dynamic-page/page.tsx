export default async function CertificateVerificationPage({
    params,
  }: {
    params: Promise<{ certificate_id: string }>;
  }) {
    const resolvedParams = await params;
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
      ? new Date(event.start_date).toDateString()
      : 'Data Unavailable';
    const end_date = event?.end_date
      ? new Date(event.end_date).toDateString()
      : 'Data Unavailable';
    const event_type = safe(event?.event_type);
    const organizer_name = safe(event?.customer?.name);
  
    return (
      <main className="min-h-screen bg-white text-black flex items-center justify-center p-6">
        <div className="w-full max-w-md space-y-4 border border-gray-300 p-6 rounded-lg shadow">
          <h1 className="text-xl font-bold text-center text-green-600">
            Certificate Verification
          </h1>
  
          <div className="text-sm space-y-2">
            <p><strong>Status:</strong> {safe(status)}</p>
            <p><strong>Name:</strong> {safe(participant_name)}</p>
            <p><strong>Email:</strong> {safe(email)}</p>
            <p><strong>Phone:</strong> {safe(phone)}</p>
  
            <hr className="my-2 border-gray-300" />
  
            <p><strong>Event:</strong> {event_name} ({event_type})</p>
            <p><strong>Organizer:</strong> {organisation} ({organizer_name})</p>
            <p><strong>Duration:</strong> {start_date} to {end_date}</p>
          </div>
  
          <p className="text-center text-xs text-gray-500 mt-6">
            © Certificate Verification Platform
          </p>
        </div>
      </main>
    );
  }
  