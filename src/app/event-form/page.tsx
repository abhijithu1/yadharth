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
    formData.endDate &&
    (!formData.startDate || !formData.endDate || formData.endDate >= formData.startDate);

  const isEndDateInvalid =
    formData.startDate &&
    formData.endDate &&
    formData.endDate < formData.startDate;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitted Event:', formData);
    alert('Event submitted! Check the console.');
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-900 text-white px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 p-8 rounded-2xl shadow-xl w-full max-w-lg space-y-6 border border-gray-700"
      >
        <div className="text-center">
          <h2 className="text-2xl font-bold tracking-tight mb-1">Create New Event</h2>
          <p className="text-gray-400 text-sm">Enter the details below to schedule your event.</p>
        </div>

        {/* Event Type */}
        <div className="space-y-1">
          <label className="block text-sm font-medium">Event Type</label>
          <select
          name="eventType"
          value={formData.eventType}
          onChange={handleChange}
          className="w-full bg-gray-700 border border-gray-600 p-3 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        >
          <option value="">Select Type</option>
          <option value="Conference">🎤 Conference</option>
          <option value="Workshop">🛠️ Workshop</option>
          <option value="Internship">💼 Internship</option>
          <option value="Hackathon">💻 Hackathon</option>
        </select>
        </div>

        {/* Event Name */}
        <div className="space-y-1">
          <label className="block text-sm font-medium">Event Name</label>
          <input
            type="text"
            name="eventName"
            value={formData.eventName}
            onChange={handleChange}
            className="w-full bg-gray-700 border border-gray-600 p-3 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            autoComplete="off"
          />
        </div>

        {/* Start Date */}
        <div className="space-y-1">
          <label className="block text-sm font-medium">Start Date</label>
          <input
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            className="w-full bg-gray-700 border border-gray-600 p-3 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* End Date */}
        <div className="space-y-1">
          <label className="block text-sm font-medium">End Date</label>
          <input
            type="date"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            className="w-full bg-gray-700 border border-gray-600 p-3 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            min={formData.startDate || undefined}
          />
          {isEndDateInvalid && (
            <p className="text-red-400 text-sm mt-1">⚠ End date cannot be before start date.</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!isFormValid}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-md transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Submit
        </button>
      </form>
    </main>
  );
}
