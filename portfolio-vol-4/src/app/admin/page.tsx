'use client';

import { useState, useEffect } from 'react';
import { format, parseISO } from 'date-fns';
import { nb } from 'date-fns/locale';
import Link from 'next/link';
import { PlusIcon, PencilIcon, TrashIcon, CalendarIcon, PhotoIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { getAllEvents, deleteEvent, Event } from '@/lib/events';
import { useAuth } from '@/hooks/useAuth';
import ProtectedRoute from '@/components/ProtectedRoute';
import EventForm from './EventForm';
import AlbumsAdmin from './albums/page';

type TabType = 'events' | 'albums' | 'migrate';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<TabType>('events');
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
              <h1 className="text-3xl font-bold">Admin Dashboard</h1>
              <p className="text-gray-400 mt-1">Manage your portfolio content</p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-400">
                Welcome, {user?.email}
              </span>
              <button
                onClick={handleLogout}
                className="text-gray-400 hover:text-white transition"
              >
                Logout
              </button>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex space-x-1 mb-8 bg-neutral-900 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab('events')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md font-medium transition ${
                activeTab === 'events'
                  ? 'bg-yellow-500 text-black'
                  : 'text-gray-400 hover:text-white hover:bg-neutral-800'
              }`}
            >
              <CalendarIcon className="w-5 h-5" />
              <span>Events</span>
            </button>
            <button
              onClick={() => setActiveTab('albums')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md font-medium transition ${
                activeTab === 'albums'
                  ? 'bg-yellow-500 text-black'
                  : 'text-gray-400 hover:text-white hover:bg-neutral-800'
              }`}
            >
              <PhotoIcon className="w-5 h-5" />
              <span>Albums</span>
            </button>
            <button
              onClick={() => setActiveTab('migrate')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md font-medium transition ${
                activeTab === 'migrate'
                  ? 'bg-yellow-500 text-black'
                  : 'text-gray-400 hover:text-white hover:bg-neutral-800'
              }`}
            >
              <ArrowPathIcon className="w-5 h-5" />
              <span>Migration</span>
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === 'events' && (
            <div>
              {/* Events Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold">Events Management</h2>
                  <p className="text-gray-400 text-sm">Manage your photography events and calendar</p>
                </div>
                <button
                  onClick={() => setShowForm(true)}
                  className="flex items-center space-x-2 bg-yellow-500 hover:bg-yellow-400 text-black px-4 py-2 rounded-lg font-medium transition"
                >
                  <PlusIcon className="w-5 h-5" />
                  <span>Add Event</span>
                </button>
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500 text-red-400 px-4 py-3 rounded-lg mb-6">
                  {error}
                </div>
              )}

              {/* Events Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-neutral-900 rounded-xl p-6">
                  <div className="flex items-center">
                    <CalendarIcon className="w-8 h-8 text-yellow-500" />
                    <div className="ml-4">
                      <div className="text-2xl font-bold">{events.length}</div>
                      <div className="text-gray-400 text-sm">Total Events</div>
                    </div>
                  </div>
                </div>
                <div className="bg-neutral-900 rounded-xl p-6">
                  <div className="flex items-center">
                    <CalendarIcon className="w-8 h-8 text-green-500" />
                    <div className="ml-4">
                      <div className="text-2xl font-bold">
                        {events.filter(event => new Date(event.date) >= new Date()).length}
                      </div>
                      <div className="text-gray-400 text-sm">Upcoming</div>
                    </div>
                  </div>
                </div>
                <div className="bg-neutral-900 rounded-xl p-6">
                  <div className="flex items-center">
                    <CalendarIcon className="w-8 h-8 text-blue-500" />
                    <div className="ml-4">
                      <div className="text-2xl font-bold">
                        {events.filter(event => new Date(event.date) < new Date()).length}
                      </div>
                      <div className="text-gray-400 text-sm">Past</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Events List */}
              {loading ? (
                <div className="text-center py-12">
                  <div className="text-gray-400">Loading events...</div>
                </div>
              ) : events.length === 0 ? (
                <div className="text-center py-12">
                  <CalendarIcon className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                  <div className="text-gray-400 mb-4">No events found</div>
                  <button
                    onClick={() => setShowForm(true)}
                    className="text-yellow-500 hover:text-yellow-400"
                  >
                    Create your first event
                  </button>
                </div>
              ) : (
                <div className="bg-neutral-900 rounded-xl overflow-hidden">
                  <div className="p-6 border-b border-neutral-800">
                    <h3 className="font-semibold">All Events</h3>
                  </div>
                  <div className="divide-y divide-neutral-800">
                    {events.map((event) => {
                      const eventDate = parseISO(event.date);
                      const isUpcoming = eventDate >= new Date();
                      
                      return (
                        <div key={event.id} className="p-6 hover:bg-neutral-800/50 transition">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium text-white">{event.title}</h4>
                              <div className="flex items-center space-x-4 mt-2 text-sm text-gray-400">
                                <span>
                                  {format(eventDate, 'PPP', { locale: nb })}
                                </span>
                                {event.company && (
                                  <span>🏢 {event.company}</span>
                                )}
                                <span className={`px-2 py-1 rounded-full text-xs ${
                                  isUpcoming 
                                    ? 'bg-green-500/20 text-green-400' 
                                    : 'bg-gray-500/20 text-gray-400'
                                }`}>
                                  {isUpcoming ? 'Upcoming' : 'Past'}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => handleEdit(event)}
                                className="p-2 text-gray-400 hover:text-yellow-500 transition"
                              >
                                <PencilIcon className="w-5 h-5" />
                              </button>
                              <button
                                onClick={() => handleDelete(event.id)}
                                className="p-2 text-gray-400 hover:text-red-500 transition"
                              >
                                <TrashIcon className="w-5 h-5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'albums' && (
            <AlbumsAdmin />
          )}

          {activeTab === 'migrate' && (
            <div>
              <h2 className="text-xl font-semibold mb-6">Data Migration</h2>
              <div className="bg-neutral-900 rounded-xl p-6">
                <h3 className="text-lg font-medium mb-4">Migrate Local Albums to Firebase</h3>
                <p className="text-gray-400 mb-6">
                  Migrate your existing local album data to Firebase Firestore. 
                  This is a one-time setup process that should be run after configuring Firebase.
                </p>
                <Link
                  href="/admin/migrate-albums"
                  className="inline-flex items-center space-x-2 bg-yellow-500 hover:bg-yellow-400 text-black px-4 py-2 rounded-lg font-medium transition"
                >
                  <ArrowPathIcon className="w-5 h-5" />
                  <span>Start Album Migration</span>
                </Link>
              </div>
            </div>
          )}

          {/* Event Form Modal */}
          {showForm && (
            <EventForm
              event={editingEvent}
              onClose={handleFormClose}
            />
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}