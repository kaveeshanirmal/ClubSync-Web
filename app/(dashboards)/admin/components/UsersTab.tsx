"use client";
import React from 'react';
import { 
  Users,
  UserCheck,
  Plus,
  Activity,
  Star,
  Eye
} from 'lucide-react';

const UsersTab: React.FC = () => (
  <div className="space-y-6">
    {/* Creative Users Header */}
    <div className="relative bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl p-8 text-white overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-6 right-6 w-20 h-20 border border-white/30 rounded-full"></div>
        <div className="absolute bottom-6 left-6 w-14 h-14 border border-white/30 rounded-full"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-28 h-28 border border-white/20 rounded-full"></div>
      </div>
      <div className="relative z-10">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-2">User Management</h2>
            <p className="text-red-100">Manage accounts, permissions, and user activities</p>
            <div className="flex items-center space-x-6 mt-4">
              <div className="flex items-center space-x-2">
                <UserCheck className="w-4 h-4" />
                <span className="text-sm">2,450 Active Users</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4" />
                <span className="text-sm">156 New This Week</span>
              </div>
            </div>
          </div>
          <button className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 flex items-center space-x-2">
            <Plus className="w-5 h-5" />
            <span>Add User</span>
          </button>
        </div>
      </div>
    </div>

    {/* User Stats Cards */}
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {[
        { title: "Total Users", value: "2,450", icon: <Users className="w-6 h-6" />, change: "+156", color: "from-red-500 to-orange-500" },
        { title: "Active Today", value: "1,247", icon: <Activity className="w-6 h-6" />, change: "+89", color: "from-orange-500 to-red-500" },
        { title: "Club Leaders", value: "245", icon: <Star className="w-6 h-6" />, change: "+12", color: "from-red-600 to-orange-600" },
        { title: "Verified", value: "94%", icon: <UserCheck className="w-6 h-6" />, change: "+2%", color: "from-orange-600 to-red-600" },
      ].map((stat, index) => (
        <div key={index} className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300 group">
          <div className="flex items-center justify-between mb-4">
            <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-lg flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300`}>
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

    {/* User Analytics and Recent Activity */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* User Roles Distribution */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">User Roles</h3>
        <div className="space-y-4">
          {[
            { role: 'Club Members', count: 1856, percentage: 76, color: 'from-red-500 to-orange-500' },
            { role: 'Club Leaders', count: 245, percentage: 10, color: 'from-orange-500 to-red-500' },
            { role: 'Moderators', count: 189, percentage: 8, color: 'from-red-600 to-orange-600' },
            { role: 'Admins', count: 160, percentage: 6, color: 'from-orange-600 to-red-600' },
          ].map((role, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">{role.role}</span>
                <span className="text-sm text-gray-600">{role.count}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 bg-gradient-to-r ${role.color} rounded-full transition-all duration-1000`}
                  style={{ width: `${role.percentage}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent User Activity */}
      <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
          <button className="text-red-600 hover:text-orange-600 text-sm font-medium">View All</button>
        </div>
        <div className="space-y-4">
          {[
            { name: "Sarah Johnson", action: "Created new club", club: "Photography Club", time: "2 minutes ago", avatar: "SJ" },
            { name: "Mike Chen", action: "Joined event", club: "Tech Innovators", time: "15 minutes ago", avatar: "MC" },
            { name: "Emma Williams", action: "Posted update", club: "Art Society", time: "1 hour ago", avatar: "EW" },
            { name: "David Brown", action: "Completed certification", club: "Leadership Group", time: "2 hours ago", avatar: "DB" },
          ].map((activity, index) => (
            <div key={index} className="flex items-center space-x-4 p-4 rounded-lg hover:bg-red-50 transition-colors">
              <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                {activity.avatar}
              </div>
              <div className="flex-1">
                <p className="text-sm">
                  <span className="font-semibold text-gray-900">{activity.name}</span>
                  <span className="text-gray-600"> {activity.action} in </span>
                  <span className="font-medium text-red-600">{activity.club}</span>
                </p>
                <p className="text-xs text-gray-500">{activity.time}</p>
              </div>
              <button className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                <Eye className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

export default UsersTab;
