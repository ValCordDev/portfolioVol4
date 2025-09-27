'use client';

import { useState, useEffect } from 'react';
import { format, parseISO } from 'date-fns';
import { nb } from 'date-fns/locale';
import { PlusIcon, PencilIcon, TrashIcon, CalendarIcon } from '@heroicons/react/24/outline';
import { getAllEvents, deleteEvent, Event } from '@/lib/events';
import { useAuth } from '@/hooks/useAuth';
import ProtectedRoute from '@/components/ProtectedRoute';
import EventForm from './EventForm';

export default function AdminDashboard() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [error, setError] = useState('');
  const { logout, user } = useAuth();

  const loadEvents = async () => {
    try {
      setLoading(true);
      const fetchedEvents = await getAllEvents();
      setEvents(fetchedEvents);
    } catch (error) {
      setError('Failed to load events');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this event?')) {
      return;
    }

    try {
      await deleteEvent(id);
      await loadEvents(); // Refresh the list
    } catch (error) {
      setError('Failed to delete event');
      console.error(error);
    }
  };

  const handleEdit = (event: Event) => {
    setEditingEvent(event);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingEvent(null);
    loadEvents(); // Refresh after form closes
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <ProtectedRoute requireAdmin>
      <div className="min-h-screen bg-black text-white p-6 pt-20">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold">Event Admin Dashboard</h1>
              <p className="text-gray-400 mt-1">Manage your photography events</p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-400">
                Welcome, {user?.email}
              </span>
              <button
                onClick={() => setShowForm(true)}
                className="flex items-center space-x-2 bg-white hover:bg-gray-100 text-black px-4 py-2 rounded-lg font-medium transition"
              >
                <PlusIcon className="w-5 h-5" />
                <span>Add Event</span>
              </button>
              <button
                onClick={handleLogout}
                className="text-gray-400 hover:text-white transition"
              >
                Logout
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500 text-red-400 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-neutral-900 rounded-xl p-6">
              <div className="flex items-center">
                <CalendarIcon className="w-8 h-8 text-yellow-500" />
                <div className="ml-4">
                  <p className="text-2xl font-bold">{events.length}</p>
                  <p className="text-gray-400">Total Events</p>
                </div>
              </div>
            </div>
            <div className="bg-neutral-900 rounded-xl p-6">
              <div className="flex items-center">
                <CalendarIcon className="w-8 h-8 text-green-500" />
                <div className="ml-4">
                  <p className="text-2xl font-bold">
                    {events.filter(e => new Date(e.date) > new Date()).length}
                  </p>
                  <p className="text-gray-400">Upcoming</p>
                </div>
              </div>
            </div>
            <div className="bg-neutral-900 rounded-xl p-6">
              <div className="flex items-center">
                <CalendarIcon className="w-8 h-8 text-gray-500" />
                <div className="ml-4">
                  <p className="text-2xl font-bold">
                    {events.filter(e => new Date(e.date) < new Date()).length}
                  </p>
                  <p className="text-gray-400">Past Events</p>
                </div>
              </div>
            </div>
          </div>

          {/* Events List */}
          <div className="bg-neutral-900 rounded-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-neutral-800">
              <h2 className="text-xl font-semibold">All Events</h2>
            </div>

            {loading ? (
              <div className="p-6 text-center text-gray-400">Loading events...</div>
            ) : events.length === 0 ? (
              <div className="p-6 text-center text-gray-400">
                No events found. Click &quot;Add Event&quot; to create your first event.
              </div>
            ) : (
              <div className="divide-y divide-neutral-800">
                {events.map((event) => {
                  const eventDate = parseISO(event.date);
                  const isUpcoming = eventDate > new Date();
                  
                  return (
                    <div key={event.id} className="p-6 hover:bg-neutral-800/50 transition">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-start space-x-4">
                            <div className="flex flex-col items-center">
                              <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold ${
                                isUpcoming ? 'bg-yellow-500 text-black' : 'bg-gray-600 text-white'
                              }`}>
                                {format(eventDate, 'd')}
                              </div>
                              <span className="text-xs text-gray-400 mt-1">
                                {format(eventDate, 'MMM', { locale: nb })}
                              </span>
                            </div>
                            <div className="flex-1">
                              <h3 className="text-lg font-medium">{event.title}</h3>
                              {event.company && (
                                <p className="text-gray-400 text-sm">{event.company}</p>
                              )}
                              <p className="text-gray-500 text-sm">
                                {format(eventDate, 'EEEE, d MMMM yyyy, HH:mm', { locale: nb })}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleEdit(event)}
                            className="p-2 text-gray-400 hover:text-yellow-400 transition"
                          >
                            <PencilIcon className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(event.id!)}
                            className="p-2 text-gray-400 hover:text-red-400 transition"
                          >
                            <TrashIcon className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Event Form Modal */}
        {showForm && (
          <EventForm
            event={editingEvent}
            onClose={handleFormClose}
          />
        )}
      </div>
    </ProtectedRoute>
  );
}