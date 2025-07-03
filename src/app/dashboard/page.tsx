"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from '@supabase/supabase-js';
import { useAuth, useUser } from "@clerk/nextjs";

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

interface Event {
  id: string;
  event_name: string;
  org_name: string;
  start_date: string;
  end_date: string;
  type_of_event: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, isLoaded } = useUser();
  // Function to fetch events
  const fetchEvents = async () => {
    setLoading(true);
    try {
      // Use the user's email from Clerk to fetch events
      
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
  
  // Fetch events when the component mounts or user changes
  useEffect(() => {
    if (isLoaded) {
      fetchEvents();
    }
  }, [isLoaded, user]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-8">
      {/* Header Section */}
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Dashboard</h1>
            <p className="text-gray-400 text-lg">Manage your events and track your activities</p>
          </div>
          <button 
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2 shadow-lg"
            onClick={() => router.push("/event-form")}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create New Event
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Total Events</p>
                <p className="text-2xl font-bold text-white">{events.length}</p>
              </div>
              <div className="bg-blue-600 p-3 rounded-full">
                <svg className="w-6 h-6 text-blue-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Upcoming</p>
                <p className="text-2xl font-bold text-white">
                  {events.filter(event => new Date(event.end_date) >= new Date()).length}
                </p>
              </div>
              <div className="bg-green-600 p-3 rounded-full">
                <svg className="w-6 h-6 text-green-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Completed</p>
                <p className="text-2xl font-bold text-white">
                  {events.filter(event => new Date(event.end_date) < new Date()).length}
                </p>
              </div>
              <div className="bg-purple-600 p-3 rounded-full">
                <svg className="w-6 h-6 text-purple-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Events Section */}
          <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">Recent Events</h2>
              <button 
                onClick={() => router.push("/event-form")}
                className="p-1 rounded-md hover:bg-gray-700 transition-colors duration-200"
                title="Add new event"
              >
                <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </button>
            </div>
            
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
                <p className="mt-2 text-gray-400">Loading events...</p>
              </div>
            ) : events.length > 0 ? (
              <div className="space-y-4">
                {events.slice(0, 5).map((event) => (
                  <div
                    key={event.id}
                    className="p-4 rounded-lg border border-gray-700 hover:border-blue-500 transition-colors duration-200 cursor-pointer"
                    onClick={() => router.push(`/events/${event.id}/upload`)}
                  >
                    <div className="flex justify-between items-start">
                      <h3 className="font-medium text-white">{event.event_name}</h3>
                      <span className="px-2 py-1 text-xs rounded-full bg-gray-700 text-gray-300">
                        {event.type_of_event}
                      </span>
                    </div>
                    <p className="text-gray-400 text-sm mt-1">{event.org_name}</p>
                    <div className="flex justify-between items-center mt-3 text-sm">
                      <span className="text-gray-500">
                        {new Date(event.start_date).toLocaleDateString()} - {new Date(event.end_date).toLocaleDateString()}
                      </span>
                      <button 
                        className="text-blue-400 hover:text-blue-300"
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/events/${event.id}`);
                        }}
                      >
                        Details
                      </button>
                    </div>
                  </div>
                ))}
                
                {events.length > 5 && (
                  <button 
                    className="text-blue-400 hover:text-blue-300 text-sm flex items-center justify-center w-full py-2"
                    onClick={() => router.push('/events')}
                  >
                    View All Events
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                )}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="bg-gray-700 rounded-full p-4 w-16 h-16 mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-white mb-2">No events yet</h3>
                <p className="text-gray-400 mb-4">Get started by creating your first event</p>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 p-6">
            <h2 className="text-xl font-semibold text-white mb-6">Quick Actions</h2>
            
            <div className="space-y-4">
              <div 
                className="flex items-center gap-3 p-4 rounded-lg border border-gray-600 cursor-pointer hover:border-blue-500 transition-colors"
                onClick={() => router.push("/event-form")}
              >
                <div className="bg-blue-600 p-2 rounded-lg">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-white">Create New Event</p>
                  <p className="text-sm text-gray-400">Add a new event to your dashboard</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 rounded-lg border border-gray-600 opacity-60">
                <div className="bg-gray-700 p-2 rounded-lg">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-white">View Analytics</p>
                  <p className="text-sm text-gray-400">Coming soon</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 rounded-lg border border-gray-600 opacity-60">
                <div className="bg-gray-700 p-2 rounded-lg">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-white">Manage Team</p>
                  <p className="text-sm text-gray-400">Coming soon</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 rounded-lg border border-gray-600 opacity-60">
                <div className="bg-gray-700 p-2 rounded-lg">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-white">Settings</p>
                  <p className="text-sm text-gray-400">Coming soon</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Welcome Message */}
        <div className="mt-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
          <h3 className="text-xl font-semibold mb-2">Welcome to Your Dashboard!</h3>
          <p className="text-blue-100">Here you can manage your events and track your activities. Start by creating your first event to get organized.</p>
        </div>
      </div>
    </main>
  );
}