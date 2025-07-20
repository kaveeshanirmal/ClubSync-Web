import { Calendar, Plus, Users } from "lucide-react";
import React from "react";

const getStatusColor = (status: string) => {
  switch (status) {
    case "active":
    case "approved":
    case "published":
      return "bg-green-100 text-green-800";
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    case "draft":
      return "bg-gray-100 text-gray-800";
    case "completed":
      return "bg-blue-100 text-blue-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const EventsTab: React.FC = () => (
  <div className="space-y-6">
    <div className="flex items-center space-x-3 mb-4">
      <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center transform hover:rotate-12 transition-transform duration-300">
        <Calendar className="w-4 h-4 text-white" />
      </div>
      <h3 className="text-lg font-bold text-gray-900">Event Management</h3>
      <div className="h-px bg-gradient-to-r from-purple-500 to-indigo-600 flex-1 opacity-30" />
    </div>

    <div className="flex justify-end">
      <button className="group flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-xl hover:from-purple-600 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg font-semibold text-sm">
        <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
        <span>Add Event</span>
      </button>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[
        {
          id: 1,
          title: "Robotics Workshop",
          date: "2024-01-25",
          time: "3:00 PM",
          location: "Lab 101",
          status: "upcoming",
          attendees: 25,
        },
        {
          id: 2,
          title: "Competition Prep",
          date: "2024-01-30",
          time: "2:00 PM",
          location: "Main Hall",
          status: "upcoming",
          attendees: 30,
        },
      ].map((event) => (
        <div
          key={event.id}
          className="relative overflow-hidden bg-white rounded-2xl border-2 border-gray-100 p-6 hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1"
        >
          <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-full -mr-8 -mt-8 opacity-30" />

          <div className="flex justify-between items-start mb-4">
            <h4 className="font-bold text-gray-900 text-lg">{event.title}</h4>
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(event.status)}`}
            >
              {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
            </span>
          </div>

          <div className="space-y-3 mb-4">
            <div className="flex items-center text-sm text-gray-700">
              <Calendar className="w-4 h-4 mr-2 text-blue-500" />
              {event.date} at {event.time}
            </div>
            <div className="flex items-center text-sm text-gray-700">
              <Users className="w-4 h-4 mr-2 text-green-500" />
              {event.attendees} attendees
            </div>
            <div className="text-sm text-gray-700">{event.location}</div>
          </div>

          <div className="flex space-x-2">
            <button className="flex-1 px-3 py-2 text-sm text-blue-600 border-2 border-blue-200 rounded-xl hover:bg-blue-50 hover:border-blue-300 transition-all duration-300">
              Edit
            </button>
            <button className="flex-1 px-3 py-2 text-sm text-red-600 border-2 border-red-200 rounded-xl hover:bg-red-50 hover:border-red-300 transition-all duration-300">
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default EventsTab;
