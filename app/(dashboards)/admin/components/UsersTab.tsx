"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { 
  Users,
  UserCheck,
  Plus,
  Activity,
  Star,
  Eye,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
  X
} from 'lucide-react';

interface UserStats {
  totalUsers: { value: string; change: string };
  activeToday: { value: string; change: string };
  clubLeaders: { value: string; change: string };
  verified: { value: string; change: string };
}

interface Role {
  name: string;
  count: number;
  color: string;
}

interface RecentActivity {
  id: string;
  name: string;
  action: string;
  club: string;
  time: string;
  avatar: string;
  image?: string;
  role: string;
}

interface UsersData {
  stats: UserStats;
  roles: Role[];
  recentActivity: RecentActivity[];
}

const UsersTab: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [usersData, setUsersData] = useState<UsersData | null>(null);
  const [showAllActivities, setShowAllActivities] = useState(false);
  const [allActivities, setAllActivities] = useState<RecentActivity[]>([]);
  const [loadingAll, setLoadingAll] = useState(false);

  useEffect(() => {
    fetchUsersData();
  }, []);

  const fetchUsersData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/admin/users');
      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch users data');
      }

      setUsersData(result.data);
    } catch (err) {
      console.error('Error fetching users data:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const fetchAllActivities = async () => {
    try {
      setLoadingAll(true);
      const response = await fetch('/api/admin/users?all=true');
      const result = await response.json();

      if (result.success) {
        setAllActivities(result.data.recentActivity);
        setShowAllActivities(true);
      }
    } catch (err) {
      console.error('Error fetching all activities:', err);
      alert('Failed to load all activities');
    } finally {
      setLoadingAll(false);
    }
  };

  const formatTimeAgo = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
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
          onClick={fetchUsersData}
          className="mt-4 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!usersData) {
    return null;
  }

  const stats = [
    { 
      title: "Total Users", 
      value: usersData.stats.totalUsers.value, 
      icon: <Users className="w-6 h-6" />, 
      change: usersData.stats.totalUsers.change,
      trend: usersData.stats.totalUsers.change.startsWith('+') ? 'up' as const : 'down' as const,
      color: "from-red-500 to-orange-500"
    },
    { 
      title: "Active Today", 
      value: usersData.stats.activeToday.value, 
      icon: <Activity className="w-6 h-6" />, 
      change: usersData.stats.activeToday.change,
      trend: usersData.stats.activeToday.change.startsWith('+') ? 'up' as const : 'down' as const,
      color: "from-orange-500 to-red-500"
    },
    { 
      title: "Club Leaders", 
      value: usersData.stats.clubLeaders.value, 
      icon: <Star className="w-6 h-6" />, 
      change: usersData.stats.clubLeaders.change,
      trend: usersData.stats.clubLeaders.change.startsWith('+') ? 'up' as const : 'down' as const,
      color: "from-red-600 to-orange-600"
    },
    { 
      title: "Verified", 
      value: usersData.stats.verified.value, 
      icon: <UserCheck className="w-6 h-6" />, 
      change: usersData.stats.verified.change,
      trend: usersData.stats.verified.change.startsWith('+') ? 'up' as const : 'down' as const,
      color: "from-orange-600 to-red-600"
    },
  ];

  return (
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
                <span className="text-sm">{usersData.stats.totalUsers.value} Total Users</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4" />
                <span className="text-sm">{usersData.stats.activeToday.value} Active Today</span>
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

    {/* User Analytics and Recent Activity */}
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* User Roles Distribution - Compact */}
      <div className="lg:col-span-4 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">User Roles</h3>
        <div className="space-y-3">
          {usersData.roles.map((role, index) => {
            const totalUsers = usersData.roles.reduce((sum, r) => sum + r.count, 0);
            const percentage = totalUsers > 0 ? Math.round((role.count / totalUsers) * 100) : 0;

            return (
              <div key={index} className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">{role.name}</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-semibold text-gray-900">{role.count}</span>
                    <span className="text-xs text-gray-500">({percentage}%)</span>
                  </div>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div 
                    className={`h-2 bg-gradient-to-r ${role.color} rounded-full transition-all duration-1000`}
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
        {/* Total Summary */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-600">Total</span>
            <span className="text-base font-bold text-gray-900">
              {usersData.roles.reduce((sum, r) => sum + r.count, 0)}
            </span>
          </div>
        </div>
      </div>

      {/* Recent User Activity */}
      <div className="lg:col-span-8 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
          <button 
            onClick={fetchAllActivities}
            disabled={loadingAll}
            className="text-red-600 hover:text-orange-600 text-sm font-medium transition-colors disabled:opacity-50"
          >
            {loadingAll ? 'Loading...' : 'View All'}
          </button>
        </div>
        <div className="space-y-3">
          {usersData.recentActivity.slice(0, 5).map((activity, index) => (
            <div key={index} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-red-50 transition-colors">
              {activity.image ? (
                <Image 
                  src={activity.image} 
                  alt={activity.name}
                  width={40}
                  height={40}
                  className="rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
                  {activity.avatar}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm">
                  <span className="font-semibold text-gray-900">{activity.name}</span>
                  <span className="text-gray-600"> {activity.action} in </span>
                  <span className="font-medium text-red-600">{activity.club}</span>
                </p>
                <p className="text-xs text-gray-500">{formatTimeAgo(activity.time)}</p>
              </div>
              <button className="p-2 text-gray-400 hover:text-red-500 transition-colors flex-shrink-0">
                <Eye className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* All Activities Modal */}
    {showAllActivities && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[85vh] overflow-hidden flex flex-col">
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
            <h3 className="text-xl font-bold text-gray-900">All User Activity</h3>
            <button
              onClick={() => setShowAllActivities(false)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-6">
            <div className="space-y-3">
              {allActivities.length > 0 ? (
                allActivities.map((activity, index) => (
                  <div key={index} className="flex items-center space-x-3 p-4 rounded-lg border border-gray-100 hover:border-red-200 hover:bg-red-50 transition-all">
                    {activity.image ? (
                      <Image 
                        src={activity.image} 
                        alt={activity.name}
                        width={40}
                        height={40}
                        className="rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
                        {activity.avatar}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm">
                        <span className="font-semibold text-gray-900">{activity.name}</span>
                        <span className="text-gray-600"> {activity.action} in </span>
                        <span className="font-medium text-red-600">{activity.club}</span>
                      </p>
                      <p className="text-xs text-gray-500">{formatTimeAgo(activity.time)}</p>
                    </div>
                    <div className="flex items-center space-x-2 flex-shrink-0">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        activity.role === 'systemAdmin' 
                          ? 'bg-purple-100 text-purple-700' 
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {activity.role === 'systemAdmin' ? 'Admin' : 'User'}
                      </span>
                      <button className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <Activity className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No activities found</p>
                </div>
              )}
            </div>
          </div>

          <div className="border-t border-gray-200 px-6 py-4 bg-gray-50 rounded-b-2xl">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Showing {allActivities.length} {allActivities.length === 1 ? 'activity' : 'activities'}
              </p>
              <button
                onClick={() => setShowAllActivities(false)}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    )}
  </div>
);
};

export default UsersTab;
