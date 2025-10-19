"use client";
import React, { useState, useEffect } from 'react';
import { 
  Calendar,
  Users,
  Plus,
  Zap,
  Target,
  AlertCircle,
  Eye,
  Trash2,
  X,
  MapPin,
  Clock,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

interface EventStats {
  totalEvents: { value: string; change: string };
  eventsThisWeek: { value: string; change: string };
  totalParticipants: { value: string; change: string };
  completionRate: { value: string; change: string };
}

interface Category {
  name: string;
  count: number;
  color: string;
}

interface RecentEvent {
  id: string;
  name: string;
  club: string;
  date: string;
  status: string;
  attendees: number;
  venue?: string;
  category: string;
}

interface EventDetails extends RecentEvent {
  subtitle?: string;
  description?: string;
  startDateTime?: string;
  endDateTime?: string;
  maxParticipants?: number;
}

interface EventsData {
  stats: EventStats;
  categories: Category[];
  recentEvents: RecentEvent[];
}

const EventsTab: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [eventsData, setEventsData] = useState<EventsData | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<EventDetails | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [deletingEventId, setDeletingEventId] = useState<string | null>(null);

  useEffect(() => {
    fetchEventsData();
  }, []);

  const fetchEventsData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/admin/events');
      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch events data');
      }

      setEventsData(result.data);
    } catch (err) {
      console.error('Error fetching events data:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return `Today, ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`;
    } else if (diffDays === 1) {
      return `Tomorrow, ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`;
    } else if (diffDays > 1 && diffDays < 7) {
      return date.toLocaleDateString('en-US', { weekday: 'short', hour: 'numeric', minute: '2-digit' });
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
    }
  };

  const handleViewEvent = async (eventId: string) => {
    try {
      const response = await fetch(`/api/events/${eventId}`);
      const result = await response.json();
      
      if (result.event) {
        const eventDetails: EventDetails = {
          id: result.event.id,
          name: result.event.title,
          subtitle: result.event.description,
          club: result.event.organizer.name,
          date: result.event.createdAt,
          startDateTime: result.event.date,
          endDateTime: result.event.updatedAt,
          status: result.event.date ? getEventStatus(result.event.date) : 'Unknown',
          attendees: result.event.registeredCount || 0,
          venue: result.event.location,
          category: result.event.category,
          description: result.event.longDescription,
          maxParticipants: result.event.maxCapacity,
        };
        setSelectedEvent(eventDetails);
        setShowModal(true);
      }
    } catch (err) {
      console.error('Error fetching event details:', err);
      alert('Failed to load event details');
    }
  };

  const getEventStatus = (dateString: string): string => {
    const eventDate = new Date(dateString);
    const now = new Date();
    
    if (eventDate.toDateString() === now.toDateString()) {
      return 'Live';
    } else if (eventDate > now) {
      return 'Upcoming';
    } else {
      return 'Completed';
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (!confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
      return;
    }

    try {
      setDeletingEventId(eventId);
      const response = await fetch(`/api/events/${eventId}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (response.ok) {
        alert('Event deleted successfully');
        await fetchEventsData();
      } else {
        alert('Failed to delete event: ' + (result.error || 'Unknown error'));
      }
    } catch (err) {
      console.error('Error deleting event:', err);
      alert('Failed to delete event');
    } finally {
      setDeletingEventId(null);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedEvent(null);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="w-12 h-12 border-4 border-t-orange-500 border-orange-200 rounded-full animate-spin"></div>
        <p className="mt-3 text-gray-600">Loading Data</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
        <p className="mt-3 text-gray-600">{error}</p>
        <button 
          onClick={fetchEventsData}
          className="mt-4 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!eventsData) {
    return null;
  }

  const stats = [
    { 
      title: "Total Events", 
      value: eventsData.stats.totalEvents.value, 
      icon: <Calendar className="w-6 h-6" />, 
      change: eventsData.stats.totalEvents.change,
      trend: eventsData.stats.totalEvents.change.startsWith('+') ? 'up' as const : 'down' as const,
      color: "from-orange-500 to-red-500"
    },
    { 
      title: "This Week", 
      value: eventsData.stats.eventsThisWeek.value, 
      icon: <Zap className="w-6 h-6" />, 
      change: eventsData.stats.eventsThisWeek.change,
      trend: eventsData.stats.eventsThisWeek.change.startsWith('+') ? 'up' as const : 'down' as const,
      color: "from-red-500 to-orange-500"
    },
    { 
      title: "Participants", 
      value: eventsData.stats.totalParticipants.value, 
      icon: <Users className="w-6 h-6" />, 
      change: eventsData.stats.totalParticipants.change,
      trend: eventsData.stats.totalParticipants.change.startsWith('+') ? 'up' as const : 'down' as const,
      color: "from-orange-600 to-red-600"
    },
    { 
      title: "Completion Rate", 
      value: eventsData.stats.completionRate.value, 
      icon: <Target className="w-6 h-6" />, 
      change: eventsData.stats.completionRate.change,
      trend: eventsData.stats.completionRate.change.startsWith('+') ? 'up' as const : 'down' as const,
      color: "from-red-600 to-orange-500"
    },
  ];

  return (
    <div className="space-y-6">
      {/* Creative Events Header */}
      <div className="relative bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-8 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-4 right-4 w-24 h-24 border border-white/30 rounded-full"></div>
          <div className="absolute bottom-4 left-4 w-16 h-16 border border-white/30 rounded-full"></div>
        </div>
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold mb-2">Event Management</h2>
              <p className="text-orange-100">Organize and track all club events seamlessly</p>
              <div className="flex items-center space-x-6 mt-4">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">{eventsData.stats.totalEvents.value} Total Events</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4" />
                  <span className="text-sm">{eventsData.stats.totalParticipants.value} Participants</span>
                </div>
              </div>
            </div>
            <button className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 flex items-center space-x-2">
              <Plus className="w-5 h-5" />
              <span>Create Event</span>
            </button>
          </div>
        </div>
      </div>

      {/* Event Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="group bg-white p-6 rounded-2xl shadow-sm border border-gray-200 hover:shadow-xl hover:border-orange-200 transition-all duration-500 transform hover:-translate-y-1 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-50 to-red-50 rounded-full -translate-y-16 translate-x-16 group-hover:scale-110 transition-transform duration-500"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  {stat.icon}
                </div>
                <div className="flex items-center space-x-1">
                  {stat.trend === 'up' ? (
                    <ArrowUpRight className="w-4 h-4 text-green-500" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4 text-red-500" />
                  )}
                  <span className={`text-sm font-bold ${stat.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                    {stat.change}
                  </span>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-2 font-medium">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</p>
                <p className="text-xs text-gray-500">vs last period</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Event Categories and Recent Events */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Event Categories */}
        <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="text-xl font-bold text-gray-900 mb-8">Event Categories</h3>
          <div className="space-y-5">
            {eventsData.categories.length > 0 ? (
              eventsData.categories.map((category, index) => {
                const totalEvents = eventsData.categories.reduce((sum, cat) => sum + cat.count, 0);
                const percentage = totalEvents > 0 ? Math.round((category.count / totalEvents) * 100) : 0;
                
                return (
                  <div key={index} className="group">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className={`w-5 h-5 rounded-full bg-gradient-to-r ${category.color} group-hover:scale-110 transition-transform duration-200`}></div>
                        <span className="text-base font-semibold text-gray-900">{category.name}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-base font-bold text-gray-900">{category.count}</span>
                        <span className="text-sm text-gray-500">({percentage}%)</span>
                      </div>
                    </div>
                    {/* Progress Bar */}
                    <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                      <div 
                        className={`h-full bg-gradient-to-r ${category.color} transition-all duration-500 ease-out`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-10 h-10 text-gray-400" />
                </div>
                <p className="text-base text-gray-500">No categories available</p>
              </div>
            )}
          </div>
          
          {/* Category Summary */}
          {eventsData.categories.length > 0 && (
            <div className="mt-8 pt-6 border-t border-gray-100">
              <div className="flex items-center justify-between text-base mb-3">
                <span className="text-gray-600 font-medium">Total Categories</span>
                <span className="font-bold text-gray-900 text-lg">{eventsData.categories.length}</span>
              </div>
              <div className="flex items-center justify-between text-base">
                <span className="text-gray-600 font-medium">Most Popular</span>
                <span className="font-semibold text-orange-600">{eventsData.categories[0]?.name}</span>
              </div>
            </div>
          )}
        </div>

        {/* Recent Events */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">Recent Events</h3>
            <button className="text-orange-600 hover:text-red-600 text-sm font-medium">View All</button>
          </div>
          <div className="space-y-4">
            {eventsData.recentEvents.length > 0 ? (
              eventsData.recentEvents.slice(0, 5).map((event, index) => (
                <div key={index} className="flex items-center justify-between p-4 rounded-lg border border-gray-100 hover:border-orange-200 transition-all duration-200">
                  <div className="flex items-center space-x-4 flex-1">
                    <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Calendar className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{event.name}</h4>
                      <p className="text-sm text-gray-600">{event.club} • {event.attendees} attendees</p>
                      <p className="text-xs text-gray-500">{formatDate(event.date)}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      event.status === 'Live' ? 'bg-red-100 text-red-700' :
                      event.status === 'Upcoming' ? 'bg-orange-100 text-orange-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {event.status}
                    </span>
                    <button
                      onClick={() => handleViewEvent(event.id)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteEvent(event.id)}
                      disabled={deletingEventId === event.id}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                      title="Delete Event"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500 text-center py-8">No recent events</p>
            )}
          </div>
        </div>
      </div>

      {/* Event Details Modal */}
      {showModal && selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
              <h3 className="text-xl font-bold text-gray-900">Event Details</h3>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Event Header */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedEvent.name}</h2>
                {selectedEvent.subtitle && (
                  <p className="text-gray-600">{selectedEvent.subtitle}</p>
                )}
                <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium ${
                  selectedEvent.status === 'Live' ? 'bg-red-100 text-red-700' :
                  selectedEvent.status === 'Upcoming' ? 'bg-orange-100 text-orange-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {selectedEvent.status}
                </span>
              </div>

              {/* Event Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Users className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Organized by</p>
                    <p className="font-medium text-gray-900">{selectedEvent.club}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Users className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Participants</p>
                    <p className="font-medium text-gray-900">
                      {selectedEvent.attendees} {selectedEvent.maxParticipants ? `/ ${selectedEvent.maxParticipants}` : ''}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Date & Time</p>
                    <p className="font-medium text-gray-900">{formatDate(selectedEvent.date)}</p>
                  </div>
                </div>

                {selectedEvent.venue && (
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Venue</p>
                      <p className="font-medium text-gray-900">{selectedEvent.venue}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Target className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Category</p>
                    <p className="font-medium text-gray-900 capitalize">{selectedEvent.category}</p>
                  </div>
                </div>
              </div>

              {/* Description */}
              {selectedEvent.description && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Description</h4>
                  <p className="text-gray-600 whitespace-pre-wrap">{selectedEvent.description}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    handleDeleteEvent(selectedEvent.id);
                    closeModal();
                  }}
                  className="px-4 py-2 text-white bg-red-500 hover:bg-red-600 rounded-lg font-medium transition-colors flex items-center space-x-2"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete Event</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventsTab;