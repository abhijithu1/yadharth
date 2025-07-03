'use client';

import { useState } from 'react';
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function EventFormPage() {
  const { userId, sessionId, getToken } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    email: '',
    event_name: '',
    org_name: '',
    start_date: '',
    end_date: '',
    type_of_event: '',
  });

  const isFormValid =
    formData.type_of_event &&
    formData.event_name &&
    formData.start_date &&
    formData.end_date &&
    (!formData.start_date || !formData.end_date || formData.end_date >= formData.start_date);

  const isEndDateInvalid =
    formData.start_date &&
    formData.end_date &&
    formData.end_date < formData.start_date;

  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch('/api/Event', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create event');
      }
      
      console.log('Event created:', data);
      setSuccess(true);
      router.push("/dashboard");
      
    } catch (err: any) {
      console.error('Error creating event:', err);
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-900 text-white p-6">
      <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded-xl shadow-md w-full max-w-md space-y-4">
        <h2 className="text-xl font-semibold">Create New Event</h2>

        {error && (
          <div className="bg-red-500 text-white p-3 rounded-md">
            {error}
          </div>
        )}
        
        {success && (
          <div className="bg-green-500 text-white p-3 rounded-md">
            Event created successfully!
          </div>
        )}

        <div>
          <label className="block font-medium mb-1">Your Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full bg-gray-700 border border-gray-600 p-2 rounded text-white"
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Event Type</label>
          <select
            name="type_of_event"
            value={formData.type_of_event}
            onChange={handleChange}
            className="w-full bg-gray-700 border border-gray-600 p-2 rounded text-white"
            required
          >
            <option value="">Select Type</option>
            <option value="Conference">🎤 Conference</option>
            <option value="Workshop">🛠️ Workshop</option>
            <option value="Internship">💼 Internship</option>
            <option value="Hackathon">💻 Hackathon</option>
          </select>
        </div>

        <div>
          <label className="block font-medium mb-1">Event Name</label>
          <input
            type="text"
            name="event_name"
            value={formData.event_name}
            onChange={handleChange}
            className="w-full bg-gray-700 border border-gray-600 p-2 rounded text-white"
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Organization Name</label>
          <input
            type="text"
            name="org_name"
            value={formData.org_name}
            onChange={handleChange}
            className="w-full bg-gray-700 border border-gray-600 p-2 rounded text-white"
            required
            autoComplete="off"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Start Date</label>
          <input
            type="date"
            name="start_date"
            value={formData.start_date}
            onChange={handleChange}
            className="w-full bg-gray-700 border border-gray-600 p-2 rounded text-white"
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1">End Date</label>
          <input
            type="date"
            name="end_date"
            value={formData.end_date}
            onChange={handleChange}
            className="w-full bg-gray-700 border border-gray-600 p-2 rounded text-white"
            required
            min={formData.start_date || undefined}
          />
          {isEndDateInvalid && (
            <p className="text-red-400 text-sm mt-1">⚠ End date cannot be before start date.</p>
          )}
        </div>

        <button 
          type="submit" 
          className={`w-full py-2 px-4 rounded font-medium ${
            loading 
              ? 'bg-gray-500 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
          disabled={loading || !isFormValid}
        >
          {loading ? 'Creating Event...' : 'Submit'}
        </button>
      </form>
    </main>
  );
}
