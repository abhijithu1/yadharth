'use client';

import { useState } from 'react';

export default function EventFormPage() {
  const [formData, setFormData] = useState({
    eventType: '',
    eventName: '',
    startDate: '',
    endDate: '',
  });

  const isFormValid =
    formData.eventType &&
    formData.eventName &&
    formData.startDate &&
    formData.endDate;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitted Event:', formData);
    alert('Event submitted! Check the console.');
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-900 text-white p-6">
      <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded-xl shadow-md w-full max-w-md space-y-4">
        <h2 className="text-xl font-semibold">Create New Event</h2>

        <div>
          <label className="block font-medium mb-1">Event Type</label>
          <select
            name="eventType"
            value={formData.eventType}
            onChange={handleChange}
            className="w-full bg-gray-700 border border-gray-600 p-2 rounded text-white"
            required
          >
            <option value="">Select Type</option>
            <option value="Conference">Conference</option>
            <option value="Workshop">Workshop</option>
            <option value="Internship">Internship</option>
            <option value="Hackathon">Hackathon</option>
          </select>
        </div>

        <div>
          <label className="block font-medium mb-1">Event Name</label>
          <input
            type="text"
            name="eventName"
            value={formData.eventName}
            onChange={handleChange}
            className="w-full bg-gray-700 border border-gray-600 p-2 rounded text-white"
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Start Date</label>
          <input
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            className="w-full bg-gray-700 border border-gray-600 p-2 rounded text-white"
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1">End Date</label>
          <input
            type="date"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            className="w-full bg-gray-700 border border-gray-600 p-2 rounded text-white"
            required
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!isFormValid}
        >
          Submit
        </button>
      </form>
    </main>
  );
}
