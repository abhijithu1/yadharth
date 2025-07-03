import React from "react";

export default function EventDetailsPage({ params }: { params: { eventId: string } }) {
  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">Event Details</h1>
      <p>Event ID: {params.eventId}</p>
      <p>Here you can view and manage this event. (Details coming soon.)</p>
    </main>
  );
} 