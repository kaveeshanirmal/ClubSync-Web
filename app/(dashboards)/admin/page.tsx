"use client";
import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Users,
  Calendar,
  Award,
  TrendingUp,
  Bell,
  Settings,
  Search,
  Activity,
  UserCheck,
  BarChart3,
  PieChart,
  Globe,
  Sparkles,
} from "lucide-react";

// Import tab components
import OverviewTab from "./components/OverviewTab";
import ClubsTab from "./components/ClubsTab";
import EventsTab from "./components/EventsTab";
import UsersTab from "./components/UsersTab";
import AnalyticsTab from "./components/AnalyticsTab";

const AdminDashboard = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedTab, setSelectedTab] = useState("overview");
  const [notifications] = useState(1);

  // Get tab from URL on mount and when URL changes
  useEffect(() => {
    const tab = searchParams.get("tab") || "overview";
    setSelectedTab(tab);
  }, [searchParams]);

  // Update URL when tab changes
  const handleTabChange = (tab: string) => {
    setSelectedTab(tab);
    router.push(`/admin?tab=${tab}`, { scroll: false });
  };

  // Sample data
  const dashboardStats = [
    {
      title: "Total Clubs",
      value: "524",
      change: "+12%",
      trend: "up" as const,
      icon: <Users className="w-6 h-6" />,
      color: "from-orange-500 to-red-500",
    },
    {
      title: "Active Events",
      value: "89",
      change: "+8%",
      trend: "up" as const,
      icon: <Calendar className="w-6 h-6" />,
      color: "from-red-500 to-orange-500",
    },
    {
      title: "Certificates Issued",
      value: "1,247",
      change: "+23%",
      trend: "up" as const,
      icon: <Award className="w-6 h-6" />,
      color: "from-orange-600 to-red-600",
    },
    {
      title: "Growth Rate",
      value: "15.8%",
      change: "+2.1%",
      trend: "up" as const,
      icon: <TrendingUp className="w-6 h-6" />,
      color: "from-red-600 to-orange-500",
    },
  ];

  const chartData = [
    { name: "Jan", clubs: 400, events: 240, certificates: 800 },
    { name: "Feb", clubs: 420, events: 280, certificates: 900 },
    { name: "Mar", clubs: 450, events: 320, certificates: 1100 },
    { name: "Apr", clubs: 480, events: 380, certificates: 1200 },
    { name: "May", clubs: 500, events: 420, certificates: 1300 },
    { name: "Jun", clubs: 524, events: 450, certificates: 1400 },
  ];

  const pieData = [
    { name: "Education", value: 35, color: "#f97316" },
    { name: "Technology", value: 28, color: "#ef4444" },
    { name: "Arts", value: 15, color: "#fb923c" },
    { name: "Sports", value: 12, color: "#f87171" },
    { name: "Other", value: 10, color: "#fbbf24" },
  ];

  const recentClubs = [
    {
      id: 1,
      name: "Tech Innovators Club",
      members: 45,
      status: "Active" as const,
      joined: "2 days ago",
      category: "Technology",
    },
    {
      id: 2,
      name: "Green Earth Society",
      members: 28,
      status: "Pending" as const,
      joined: "1 week ago",
      category: "Environment",
    },
    {
      id: 3,
      name: "Creative Arts Hub",
      members: 67,
      status: "Active" as const,
      joined: "3 days ago",
      category: "Arts",
    },
    {
      id: 4,
      name: "Future Leaders",
      members: 34,
      status: "Active" as const,
      joined: "5 days ago",
      category: "Leadership",
    },
  ];

  // Render current tab content
  const renderTabContent = () => {
    switch (selectedTab) {
      case "overview":
        return (
          <OverviewTab
            dashboardStats={dashboardStats}
            chartData={chartData}
            pieData={pieData}
          />
        );
      case "clubs":
        return <ClubsTab />;
      case "events":
        return <EventsTab />;
      case "users":
        return <UsersTab />;
      case "analytics":
        return <AnalyticsTab />;
      default:
        return (
          <OverviewTab
            dashboardStats={dashboardStats}
            chartData={chartData}
            pieData={pieData}
          />
        );
    }
  };

  const SidebarButton = ({
    id,
    label,
    icon,
    active,
    onClick,
  }: {
    id: string;
    label: string;
    icon: React.ReactNode;
    active: boolean;
    onClick: (id: string) => void;
  }) => (
    <button
      onClick={() => onClick(id)}
      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition-all duration-300 ${
        active
          ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg"
          : "text-gray-600 hover:text-orange-500 hover:bg-orange-50"
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col h-full">
        {/* Sidebar Header */}
        <div className="px-6 py-5 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                ClubSync
              </h1>
              <p className="text-xs text-gray-500 font-medium">Admin Portal</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          <SidebarButton
            id="overview"
            label="Overview"
            icon={<BarChart3 className="w-5 h-5" />}
            active={selectedTab === "overview"}
            onClick={handleTabChange}
          />
          <SidebarButton
            id="clubs"
            label="Clubs"
            icon={<Users className="w-5 h-5" />}
            active={selectedTab === "clubs"}
            onClick={handleTabChange}
          />
          <SidebarButton
            id="events"
            label="Events"
            icon={<Calendar className="w-5 h-5" />}
            active={selectedTab === "events"}
            onClick={handleTabChange}
          />
          <SidebarButton
            id="users"
            label="Users"
            icon={<UserCheck className="w-5 h-5" />}
            active={selectedTab === "users"}
            onClick={handleTabChange}
          />
          <SidebarButton
            id="analytics"
            label="Analytics"
            icon={<PieChart className="w-5 h-5" />}
            active={selectedTab === "analytics"}
            onClick={handleTabChange}
          />
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">Admin User</p>
              <p className="text-xs text-gray-500">admin@clubsync.com</p>
            </div>
            <Settings className="w-5 h-5 text-gray-400" />
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Search Bar */}
            <div className="flex-1 max-w-2xl">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search clubs, events, users..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                />
              </div>
            </div>

            {/* Live Stats Pills */}
            <div className="flex items-center space-x-4 ml-6">
              <div className="flex items-center space-x-2 bg-green-50 px-3 py-2 rounded-lg border border-green-200">
                <Activity className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-green-700">
                  524 Active
                </span>
              </div>
              <div className="flex items-center space-x-2 bg-blue-50 px-3 py-2 rounded-lg border border-blue-200">
                <Globe className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-700">
                  Online
                </span>
              </div>
            </div>

            {/* User Controls */}
            <div className="flex items-center space-x-4 ml-4">
              <button className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200">
                <Bell className="w-5 h-5" />
                {notifications > 0 && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                    {notifications}
                  </span>
                )}
              </button>
              <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-full"></div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto">
          <div className="p-6">
            <Suspense fallback={<div>Loading dashboard...</div>}>
              {renderTabContent()}
            </Suspense>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
