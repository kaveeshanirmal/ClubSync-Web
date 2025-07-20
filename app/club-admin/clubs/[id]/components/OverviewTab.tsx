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
    {/* Stats Cards */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Members Card */}
      <div className="relative overflow-hidden bg-white rounded-2xl border-2 border-gray-100 p-6 hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1">
        <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full -mr-8 -mt-8 opacity-30" />
        <div className="flex items-center">
          <div className="p-3 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200">
            <Users className="w-6 h-6 text-blue-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Total Members</p>
            <p className="text-2xl font-bold text-gray-900">
              {club.memberCount}
            </p>
          </div>
        </div>
      </div>

      {/* Events Card */}
      <div className="relative overflow-hidden bg-white rounded-2xl border-2 border-gray-100 p-6 hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1">
        <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full -mr-8 -mt-8 opacity-30" />
        <div className="flex items-center">
          <div className="p-3 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200">
            <Calendar className="w-6 h-6 text-green-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Upcoming Events</p>
            <p className="text-2xl font-bold text-gray-900">
              {club.upcomingEvents}
            </p>
          </div>
        </div>
      </div>

      {/* Requests Card */}
      <div className="relative overflow-hidden bg-white rounded-2xl border-2 border-gray-100 p-6 hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1">
        <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-full -mr-8 -mt-8 opacity-30" />
        <div className="flex items-center">
          <div className="p-3 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl border border-yellow-200">
            <AlertCircle className="w-6 h-6 text-yellow-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">
              Pending Requests
            </p>
            <p className="text-2xl font-bold text-gray-900">
              {club.pendingRequests}
            </p>
          </div>
        </div>
      </div>
    </div>

    {/* Recent Activity */}
    <div className="relative overflow-hidden bg-white rounded-2xl border-2 border-gray-100 p-6">
      <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full -mr-8 -mt-8 opacity-30" />

      <div className="flex items-center space-x-3 mb-4">
        <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center transform hover:rotate-12 transition-transform duration-300">
          <span className="text-white text-sm">📝</span>
        </div>
        <h3 className="text-lg font-bold text-gray-900">Recent Activity</h3>
        <div className="h-px bg-gradient-to-r from-purple-500 to-indigo-600 flex-1 opacity-30" />
      </div>

      <div className="space-y-4">
        <div className="flex items-center space-x-3 p-3 hover:bg-gray-50/50 rounded-lg transition-colors duration-200">
          <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
          <span className="text-sm text-gray-700 flex-1">
            New member joined - Alex Turner
          </span>
          <span className="text-xs text-gray-500">2 hours ago</span>
        </div>
        <div className="flex items-center space-x-3 p-3 hover:bg-gray-50/50 rounded-lg transition-colors duration-200">
          <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
          <span className="text-sm text-gray-700 flex-1">
            Event "Robotics Workshop" scheduled
          </span>
          <span className="text-xs text-gray-500">1 day ago</span>
        </div>
        <div className="flex items-center space-x-3 p-3 hover:bg-gray-50/50 rounded-lg transition-colors duration-200">
          <div className="w-2 h-2 bg-yellow-500 rounded-full flex-shrink-0"></div>
          <span className="text-sm text-gray-700 flex-1">
            Service letter request from Sarah Johnson
          </span>
          <span className="text-xs text-gray-500">2 days ago</span>
        </div>
      </div>
    </div>
  </div>
);

export default OverviewTab;
