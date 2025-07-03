"use client";
import React from "react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <p>Welcome! Here you can manage your events. (Event list coming soon.)</p>
      <button
        className="mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        onClick={() => router.push("/event-form")}
      >
        Create New Event
      </button>
    </main>
  );
}
