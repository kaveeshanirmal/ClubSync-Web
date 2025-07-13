"use client";
import React from 'react';
import { 
  Calendar,
  Users,
  Plus,
  Zap,
  Target
} from 'lucide-react';

const EventsTab: React.FC = () => (
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
                <span className="text-sm">89 Active Events</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4" />
                <span className="text-sm">2.1k Participants</span>
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
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {[
        { title: "Total Events", value: "89", icon: <Calendar className="w-6 h-6" />, change: "+12" },
        { title: "This Week", value: "15", icon: <Zap className="w-6 h-6" />, change: "+3" },
        { title: "Participants", value: "2.1k", icon: <Users className="w-6 h-6" />, change: "+156" },
        { title: "Completion Rate", value: "94%", icon: <Target className="w-6 h-6" />, change: "+5%" },
      ].map((stat, index) => (
        <div key={index} className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300 group">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300">
              {stat.icon}
            </div>
            <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">
              {stat.change}
            </span>
          </div>
          <h3 className="text-sm font-medium text-gray-600 mb-1">{stat.title}</h3>
          <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
        </div>
      ))}
    </div>

    {/* Event Categories and Recent Events */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Event Categories */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Event Categories</h3>
        <div className="space-y-4">
          {[
            { name: 'Workshops', count: 24, color: 'from-orange-500 to-red-500' },
            { name: 'Seminars', count: 18, color: 'from-red-500 to-orange-600' },
            { name: 'Competitions', count: 15, color: 'from-orange-600 to-red-600' },
            { name: 'Social Events', count: 12, color: 'from-red-600 to-orange-500' },
            { name: 'Training', count: 8, color: 'from-orange-400 to-red-400' },
          ].map((category, index) => (
            <div key={index} className="flex items-center justify-between p-3 rounded-lg hover:bg-orange-50 transition-colors">
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${category.color}`}></div>
                <span className="text-sm font-medium text-gray-900">{category.name}</span>
              </div>
              <span className="text-sm text-gray-600 font-medium">{category.count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Events */}
      <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Recent Events</h3>
          <button className="text-orange-600 hover:text-red-600 text-sm font-medium">View All</button>
        </div>
        <div className="space-y-4">
          {[
            { name: "AI Workshop Series", club: "Tech Innovators", date: "Today, 2:00 PM", status: "Live", attendees: 45 },
            { name: "Art Exhibition Opening", club: "Creative Arts Hub", date: "Tomorrow, 6:00 PM", status: "Upcoming", attendees: 67 },
            { name: "Leadership Summit", club: "Future Leaders", date: "Dec 15, 10:00 AM", status: "Scheduled", attendees: 89 },
          ].map((event, index) => (
            <div key={index} className="flex items-center justify-between p-4 rounded-lg border border-gray-100 hover:border-orange-200 hover:bg-orange-50 transition-all duration-200">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{event.name}</h4>
                  <p className="text-sm text-gray-600">{event.club} • {event.attendees} attendees</p>
                  <p className="text-xs text-gray-500">{event.date}</p>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                event.status === 'Live' ? 'bg-red-100 text-red-700' :
                event.status === 'Upcoming' ? 'bg-orange-100 text-orange-700' :
                'bg-gray-100 text-gray-700'
              }`}>
                {event.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

export default EventsTab;
