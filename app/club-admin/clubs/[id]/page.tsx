"use client";
import { useSession } from "next-auth/react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import {
  ArrowLeft,
  Users,
  Calendar,
  FileText,
  CheckCircle,
  MessageSquare,
  Star,
  Award,
  Eye,
} from "lucide-react";

// Import tab components
import OverviewTab from "./components/OverviewTab";
import InterviewsTab from "./components/InterviewsTab";
import ElectionsTab from "./components/ElectionsTab";
import EventsTab from "./components/EventsTab";
import MinutesTab from "./components/MinutesTab";
import ServiceLettersTab from "./components/ServiceLettersTab";
import CandidatesTab from "./components/CandidatesTab";
import FeedBackTab from "./components/FeedBackTab";

export default function ClubDetailPage() {
  const { data: session } = useSession();
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const clubId = params.id as string;
  const [activeTab, setActiveTab] = useState("overview");

  // Get tab from URL on mount and when URL changes
  useEffect(() => {
    const tab = searchParams.get("tab") || "overview";
    setActiveTab(tab);
  }, [searchParams]);

  // Update URL when tab changes
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    router.push(`/club-admin/clubs/${clubId}?tab=${tab}`, { scroll: false });
  };

  // Mock clubs data - this should come from your API
  const clubsData = {
    "1": {
      id: "1",
      name: "Rotaract Club of UCSC",
      description:
        "Create positive change through community service, professional development, and international understanding.",
      memberCount: 45,
      upcomingEvents: 3,
      pendingRequests: 2,
      status: "active",
      createdAt: "2023-09-15",
    },
    "2": {
      id: "2",
      name: "Drama Club",
      description: "Perform and enjoy theatre with creative productions.",
      memberCount: 32,
      upcomingEvents: 2,
      pendingRequests: 1,
      status: "active",
      createdAt: "2023-08-20",
    },
    "3": {
      id: "3",
      name: "Environmental Club",
      description: "Promote sustainability and environmental awareness.",
      memberCount: 28,
      upcomingEvents: 1,
      pendingRequests: 0,
      status: "active",
      createdAt: "2023-10-05",
    },
  };

  // Get the specific club data based on ID
  const club = clubsData[clubId as keyof typeof clubsData] || {
    id: clubId,
    name: "Unknown Club",
    description: "Club information not found.",
    memberCount: 0,
    upcomingEvents: 0,
    pendingRequests: 0,
    status: "inactive",
    createdAt: "Unknown",
  };

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

  const tabs = [
    { id: "overview", label: "Overview", icon: Eye },
    { id: "interviews", label: "Interviews", icon: Users },
    { id: "elections", label: "Elections", icon: Award },
    { id: "events", label: "Events", icon: Calendar },
    { id: "minutes", label: "Minutes", icon: FileText },
    { id: "service-letters", label: "Service Letters", icon: MessageSquare },
    { id: "candidates", label: "Candidates", icon: CheckCircle },
    { id: "feedback", label: "Feedback", icon: Star },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return <OverviewTab club={club} />;
      case "interviews":
        return <InterviewsTab />;
      case "elections":
        return <ElectionsTab />;
      case "events":
        return <EventsTab />;
      case "minutes":
        return <MinutesTab />;
      case "service-letters":
        return <ServiceLettersTab />;
      case "candidates":
        return <CandidatesTab />;
      case "feedback":
        return <FeedBackTab />;
      default:
        return <OverviewTab club={club} />;
    }
  };

  const TabButton = ({
    id,
    label,
    icon,
    active,
    onClick,
  }: {
    id: string;
    label: string;
    icon: React.ComponentType<any>;
    active: boolean;
    onClick: (id: string) => void;
  }) => {
    const Icon = icon;
    return (
      <button
        onClick={() => onClick(id)}
        className={`group flex items-center space-x-3 py-3 px-4 font-medium text-sm transition-all duration-300 border-b-2 ${
          active
            ? "border-orange-500 text-orange-600 bg-orange-50"
            : "border-transparent text-gray-500 hover:text-orange-600 hover:border-orange-300 hover:bg-gray-50"
        }`}
      >
        <Icon
          className={`w-4 h-4 transition-colors duration-300 ${
            active
              ? "text-orange-500"
              : "text-gray-400 group-hover:text-orange-500"
          }`}
        />
        <span>{label}</span>
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      {/* Header - Aligned with Admin Dashboard Style */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push("/club-admin")}
                className="p-2 text-gray-600 hover:text-orange-600 hover:bg-gray-50 rounded-lg transition-all duration-200"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-lg font-bold text-white">{club.name.charAt(0)}</span>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">{club.name}</h1>
                  <p className="text-gray-600 text-sm">{club.description}</p>
                  <div className="flex items-center mt-1 space-x-3">
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                      {club.memberCount} members
                    </span>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                      {club.upcomingEvents} events
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                  club.status,
                )}`}
              >
                {club.status.charAt(0).toUpperCase() + club.status.slice(1)}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Navigation Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-0 overflow-x-auto" aria-label="Tabs">
              {tabs.map((tab) => (
                <TabButton
                  key={tab.id}
                  id={tab.id}
                  label={tab.label}
                  icon={tab.icon}
                  active={activeTab === tab.id}
                  onClick={handleTabChange}
                />
              ))}
            </nav>
          </div>
        </div>

        {/* Enhanced Tab Content */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
}
