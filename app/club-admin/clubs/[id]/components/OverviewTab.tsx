import { AlertCircle, Calendar, Users, Clock, CheckCircle } from "lucide-react";
import React, { useEffect, useState } from "react";

interface Activity {
  id: string;
  type: 'member_join' | 'event_scheduled' | 'join_request' | 'certificate_issued';
  title: string;
  description: string;
  timestamp: string;
}

const OverviewTab: React.FC<{
  club: {
    id?: string;
    memberCount?: number;
    upcomingEvents?: number;
    pendingRequests?: number;
  };
}> = ({ club }) => {
  const [counts, setCounts] = useState({
    memberCount: club.memberCount ?? 0,
    upcomingEvents: club.upcomingEvents ?? 0,
    pendingRequests: club.pendingRequests ?? 0,
  });
  const [loading, setLoading] = useState(false);
  const [activities, setActivities] = useState<Activity[]>([]);

  const getRelativeTime = (timestamp: string) => {
    const now = new Date();
    const past = new Date(timestamp);
    const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    return past.toLocaleDateString();
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'member_join':
        return 'from-orange-50 to-red-50 border-orange-200';
      case 'event_scheduled':
        return 'from-amber-50 to-orange-50 border-amber-200';
      case 'join_request':
        return 'from-yellow-50 to-amber-50 border-yellow-200';
      case 'certificate_issued':
        return 'from-red-50 to-orange-50 border-red-200';
      default:
        return 'from-gray-50 to-gray-100 border-gray-200';
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'member_join':
        return <Users className="w-5 h-5 text-white" />;
      case 'event_scheduled':
        return <Calendar className="w-5 h-5 text-white" />;
      case 'join_request':
        return <AlertCircle className="w-5 h-5 text-white" />;
      case 'certificate_issued':
        return <CheckCircle className="w-5 h-5 text-white" />;
      default:
        return <Clock className="w-5 h-5 text-white" />;
    }
  };

  const getActivityIconBg = (type: string) => {
    switch (type) {
      case 'member_join':
        return 'from-orange-500 to-red-500';
      case 'event_scheduled':
        return 'from-amber-500 to-orange-500';
      case 'join_request':
        return 'from-yellow-500 to-amber-500';
      case 'certificate_issued':
        return 'from-red-500 to-orange-500';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  useEffect(() => {
    if (!club?.id) return;
    let cancelled = false;
    const fetchOverview = async () => {
      setLoading(true);
      try {
        const idStr = String(club.id);
        const res = await fetch(`/api/clubs/${encodeURIComponent(idStr)}/overview`, { cache: "no-store" });
        if (!res.ok) return;
        const data = await res.json();
        if (cancelled) return;
        setCounts({
          memberCount: typeof data.memberCount === "number" ? data.memberCount : counts.memberCount,
          upcomingEvents: typeof data.upcomingEvents === "number" ? data.upcomingEvents : counts.upcomingEvents,
          pendingRequests: typeof data.pendingRequests === "number" ? data.pendingRequests : counts.pendingRequests,
        });
        if (data.recentActivities && Array.isArray(data.recentActivities)) {
          setActivities(data.recentActivities);
        }
      } catch {
        // keep existing counts on error
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchOverview();
    return () => {
      cancelled = true;
    };
  }, [club?.id]);

  return (
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
            <p className="text-2xl font-bold text-black">{counts.memberCount}</p>
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
            <p className="text-2xl font-bold text-black">{counts.upcomingEvents}</p>
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
            <p className="text-2xl font-bold text-black">{counts.pendingRequests}</p>
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

      {loading ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
          <p className="text-sm text-gray-500 mt-2">Loading activities...</p>
        </div>
      ) : activities.length > 0 ? (
        <div className="space-y-4">
          {activities.map((activity) => (
            <div 
              key={activity.id}
              className={`flex items-center space-x-4 p-4 bg-gradient-to-r ${getActivityColor(activity.type)} rounded-xl border hover:shadow-md transition-all duration-200`}
            >
              <div className={`w-10 h-10 bg-gradient-to-r ${getActivityIconBg(activity.type)} rounded-full flex items-center justify-center`}>
                {getActivityIcon(activity.type)}
              </div>
              <div className="flex-1">
                <span className="text-sm font-medium text-gray-900">{activity.title}</span>
                <p className="text-xs text-gray-600">{activity.description}</p>
              </div>
              <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded-full">
                {getRelativeTime(activity.timestamp)}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <Clock className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-sm text-gray-500">No recent activities</p>
          <p className="text-xs text-gray-400 mt-1">Activities will appear here as they happen</p>
        </div>
      )}
    </div>
  </div>
);

};

export default OverviewTab;
