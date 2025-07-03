import React from "react";

export default function CertificateVerificationPage({ params }: { params: { certificateId: string } }) {
  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">Certificate Verification</h1>
      <p>Certificate ID: {params.certificateId}</p>
      <p>Certificate details and status will be shown here. (Coming soon.)</p>
    </main>
  );
} 