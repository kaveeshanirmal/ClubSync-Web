import { AlertCircle, Calendar, Users } from "lucide-react";
import React from "react";

const OverviewTab: React.FC<{
  club: {
    memberCount: number;
    upcomingEvents: number;
    pendingRequests: number;
  };
}> = ({ club }) => (
  <div className="space-y-6">
    {/* Enhanced Stats Cards with Admin Dashboard Theme */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Members Card */}
      <div className="relative overflow-hidden bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-all duration-300">
        <div className="absolute top-0 right-0 w-20 h-20 bg-orange-100 rounded-full -mr-10 -mt-10 opacity-50"></div>
        <div className="relative flex items-center">
          <div className="p-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl shadow-lg">
            <Users className="w-6 h-6 text-white" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Total Members</p>
            <p className="text-2xl font-bold text-black">{club.memberCount}</p>
            <p className="text-xs text-green-600 mt-1">+5% this month</p>
          </div>
        </div>
      </div>

      {/* Events Card */}
      <div className="relative overflow-hidden bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-all duration-300">
        <div className="absolute top-0 right-0 w-20 h-20 bg-blue-100 rounded-full -mr-10 -mt-10 opacity-50"></div>
        <div className="relative flex items-center">
          <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl shadow-lg">
            <Calendar className="w-6 h-6 text-white" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Upcoming Events</p>
            <p className="text-2xl font-bold text-black">{club.upcomingEvents}</p>
            <p className="text-xs text-blue-600 mt-1">+2 this week</p>
          </div>
        </div>
      </div>

      {/* Requests Card */}
      <div className="relative overflow-hidden bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-all duration-300">
        <div className="absolute top-0 right-0 w-20 h-20 bg-amber-100 rounded-full -mr-10 -mt-10 opacity-50"></div>
        <div className="relative flex items-center">
          <div className="p-3 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl shadow-lg">
            <AlertCircle className="w-6 h-6 text-white" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Pending Requests</p>
            <p className="text-2xl font-bold text-black">{club.pendingRequests}</p>
            <p className="text-xs text-amber-600 mt-1">Needs attention</p>
          </div>
        </div>
      </div>
    </div>

    {/* Enhanced Recent Activity */}
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-black">Recent Activity</h3>
          <p className="text-sm text-gray-600">Latest club updates and actions</p>
        </div>
        <div className="flex items-center space-x-2 bg-green-50 px-3 py-2 rounded-lg border border-green-200">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-medium text-green-700">Live Updates</span>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 hover:shadow-md transition-all duration-200">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
            <Users className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <span className="text-sm font-medium text-gray-900">New member joined - Alex Turner</span>
            <p className="text-xs text-gray-600">Member count increased to {club.memberCount}</p>
          </div>
          <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded-full">2 hours ago</span>
        </div>
        
        <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200 hover:shadow-md transition-all duration-200">
          <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
            <Calendar className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <span className="text-sm font-medium text-gray-900">Event "Robotics Workshop" scheduled</span>
            <p className="text-xs text-gray-600">Scheduled for next Friday at 2:00 PM</p>
          </div>
          <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded-full">1 day ago</span>
        </div>
        
        <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl border border-amber-200 hover:shadow-md transition-all duration-200">
          <div className="w-10 h-10 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-full flex items-center justify-center">
            <AlertCircle className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <span className="text-sm font-medium text-gray-900">Service letter request from Sarah Johnson</span>
            <p className="text-xs text-gray-600">Pending review and approval</p>
          </div>
          <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded-full">2 days ago</span>
        </div>
      </div>
    </div>
  </div>
);

export default OverviewTab;
