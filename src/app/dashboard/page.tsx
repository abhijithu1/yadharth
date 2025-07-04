"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth, useUser } from "@clerk/nextjs";
import { supabase } from "@/utils/supabaseClient";
import { motion, Variants } from "framer-motion"; // Import Variants type
import { Dialog } from '@headlessui/react';

interface Event {
  id: string;
  event_name: string;
  org_name: string;
  start_date: string;
  end_date: string;
  type_of_event: string;
}

// Animation variants with proper typing
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15
    }
  }
};

export default function DashboardPage() {
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, isLoaded } = useUser();
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [eventToEdit, setEventToEdit] = useState<Event | null>(null);
  const [editForm, setEditForm] = useState<Partial<Event>>({});
  const [editLoading, setEditLoading] = useState(false);
  const [deleteLoadingId, setDeleteLoadingId] = useState<string | null>(null);
  
  // Function to fetch events
  const fetchEvents = async () => {
    setLoading(true);
    try {
      const email = user?.primaryEmailAddress?.emailAddress || user?.emailAddresses[0]?.emailAddress || "";
      
      if (!email) {
        console.error("No email found for current user");
        setLoading(false);
        return;
      }
      
      const response = await fetch(`/api/Event?email=${encodeURIComponent(email)}`);
      const data = await response.json();
      
      if (response.ok && data.events) {
        setEvents(data.events);
      } else {
        console.error("Failed to fetch events:", data.error);
      }
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    if (isLoaded) {
      fetchEvents();
    }
  }, [isLoaded, user]);

  const handleDelete = async (id: string) => {
    setDeleteLoadingId(id);
    try {
      const res = await fetch(`/api/Event/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setEvents(events => events.filter(e => e.id !== id));
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to delete event');
      }
    } catch (err) {
      alert('Failed to delete event');
    } finally {
      setDeleteLoadingId(null);
    }
  };

  const openEditModal = (event: Event) => {
    setEventToEdit(event);
    setEditForm(event);
    setEditModalOpen(true);
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventToEdit) return;
    setEditLoading(true);
    try {
      const res = await fetch(`/api/Event/${eventToEdit.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm),
      });
      const data = await res.json();
      if (res.ok) {
        setEvents(events => events.map(ev => ev.id === eventToEdit.id ? { ...ev, ...data.event } : ev));
        setEditModalOpen(false);
      } else {
        alert(data.error || 'Failed to update event');
      }
    } catch (err) {
      alert('Failed to update event');
    } finally {
      setEditLoading(false);
    }
  };

  return (
    <motion.main 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-white px-4 py-8 md:px-8"
    >
      <div className="max-w-6xl mx-auto">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mb-12 flex flex-col md:flex-row md:items-center md:justify-between"
        >
          <motion.div variants={itemVariants}>
            <h1 className="text-4xl font-bold text-black mb-2">Dashboard</h1>
            <p className="text-gray-600 text-lg">Manage your events and track your activities</p>
          </motion.div>
          <motion.button 
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 mt-4 md:mt-0 bg-black text-white rounded-lg hover:bg-gray-900 transition-colors duration-200 flex items-center gap-2 shadow-md"
            onClick={() => router.push("/event-form")}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create New Event
          </motion.button>
        </motion.div>

        {/* Total Events Card */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 gap-6 mb-12"
        >
          <motion.div 
            variants={itemVariants}
            whileHover={{ y: -5 }}
            className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 transition-shadow hover:shadow-xl"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Events</p>
                <p className="text-3xl font-bold text-black">{events.length}</p>
              </div>
              <div className="bg-black p-3 rounded-full">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Events Section - Expanded full width */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div 
            variants={itemVariants}
            className="bg-white rounded-xl shadow-lg border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-black">All Events</h2>
              <motion.button 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => router.push("/event-form")}
                className="p-2 rounded-md hover:bg-gray-100 transition-colors duration-200"
                title="Add new event"
              >
                <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </motion.button>
            </div>
            
            {loading ? (
              <div className="text-center py-12">
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                  className="rounded-full h-10 w-10 border-t-2 border-b-2 border-black mx-auto"
                />
                <p className="mt-2 text-gray-600">Loading events...</p>
              </div>
            ) : events.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {events.map((event, index) => (
                  <motion.div
                    key={event.id}
                    variants={itemVariants}
                    whileHover={{ scale: 1.02 }}
                    className="p-4 rounded-lg border border-gray-200 hover:border-gray-400 transition-colors duration-200 bg-white shadow-sm hover:shadow"
                  >
                    <div className="flex justify-between items-start">
                      <h3 className="font-medium text-black">{event.event_name}</h3>
                      <span className="px-3 py-1 text-xs rounded-full bg-gray-100 text-gray-700 font-medium">
                        {event.type_of_event}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mt-1">{event.org_name}</p>
                    <div className="flex justify-between items-center mt-3 text-sm">
                      <span className="text-gray-500">
                        {new Date(event.start_date).toLocaleDateString()} - {new Date(event.end_date).toLocaleDateString()}
                      </span>
                      
                      <div className="flex gap-2">
                        <motion.button 
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/events/${event.id}/upload`);
                          }}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                          Add Participants
                        </motion.button>
                        
                        <motion.button 
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="text-yellow-600 hover:text-yellow-800 font-medium"
                          onClick={e => {
                            e.stopPropagation();
                            openEditModal(event);
                          }}
                        >
                          Edit
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="text-red-600 hover:text-red-800 font-medium"
                          disabled={deleteLoadingId === event.id}
                          onClick={e => {
                            e.stopPropagation();
                            if (confirm('Are you sure you want to delete this event?')) handleDelete(event.id);
                          }}
                        >
                          {deleteLoadingId === event.id ? 'Deleting...' : 'Delete'}
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <motion.div 
                variants={itemVariants}
                className="text-center py-12"
              >
                <div className="bg-gray-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <svg className="w-8 h-8 text-gray-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-black mb-2">No events yet</h3>
                <p className="text-gray-600 mb-4">Get started by creating your first event</p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-900 transition-colors"
                  onClick={() => router.push("/event-form")}
                >
                  Create Event
                </motion.button>
              </motion.div>
            )}
          </motion.div>
        </motion.div>

        {/* Welcome Banner */}
        <motion.div 
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, type: "spring", stiffness: 100 }}
          className="mt-12 bg-black rounded-xl p-8 text-white shadow-xl"
        >
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div>
              <h3 className="text-2xl font-semibold mb-2">Welcome to Your Dashboard!</h3>
              <p className="text-gray-300">Here you can manage your events and track your activities. Start by creating your first event to get organized.</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push("/event-form")}
              className="mt-4 md:mt-0 px-6 py-3 bg-white text-black rounded-lg hover:bg-gray-100 transition-colors font-medium"
            >
              Get Started
            </motion.button>
          </div>
        </motion.div>

        {/* Edit Modal */}
        <Dialog open={editModalOpen} onClose={() => setEditModalOpen(false)} className="fixed z-50 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="fixed inset-0 bg-black opacity-30" aria-hidden="true" />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-auto p-6 z-10"
            >
              <Dialog.Title className="text-lg font-bold mb-4">Edit Event</Dialog.Title>
              <form onSubmit={handleEditSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Event Name</label>
                  <input
                    type="text"
                    name="event_name"
                    value={editForm.event_name || ''}
                    onChange={handleEditChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-black"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Organization Name</label>
                  <input
                    type="text"
                    name="org_name"
                    value={editForm.org_name || ''}
                    onChange={handleEditChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-black"
                    required
                  />
                </div>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                    <input
                      type="date"
                      name="start_date"
                      value={editForm.start_date || ''}
                      onChange={handleEditChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-black"
                      required
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                    <input
                      type="date"
                      name="end_date"
                      value={editForm.end_date || ''}
                      onChange={handleEditChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-black"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Event Type</label>
                  <select
                    name="type_of_event"
                    value={editForm.type_of_event || ''}
                    onChange={handleEditChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-black"
                    required
                  >
                    <option value="">Select Type</option>
                    <option value="Conference">Conference</option>
                    <option value="Workshop">Workshop</option>
                    <option value="Internship">Internship</option>
                    <option value="Hackathon">Hackathon</option>
                  </select>
                </div>
                <div className="flex justify-end gap-2 mt-4">
                  <button type="button" className="px-4 py-2 rounded bg-gray-200 text-black" onClick={() => setEditModalOpen(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="px-4 py-2 rounded bg-black text-white" disabled={editLoading}>
                    {editLoading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </Dialog>
      </div>
    </motion.main>
  );
}