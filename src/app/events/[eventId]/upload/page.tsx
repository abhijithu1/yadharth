import React from "react";

export default function UploadParticipantsPage({ params }: { params: { eventId: string } }) {
  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">Upload Participants</h1>
      <p>Event ID: {params.eventId}</p>
      <p>Upload your Excel file here. (Upload form coming soon.)</p>
    </main>
  );
} 