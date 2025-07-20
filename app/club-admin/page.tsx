"use client";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import {
  Users,
  Calendar,
  FileText,
  CheckCircle,
  MessageSquare,
  Plus,
  Star,
  TrendingUp,
  Award,
  Clock,
  AlertCircle,
} from "lucide-react";

export default function ClubAdminDashboard() {
  const { data: session } = useSession();
  const userName = session?.user?.firstName || session?.user?.name || "Admin";
  const [showAddClubModal, setShowAddClubModal] = useState(false);

  // Mocked clubs data with more details
  const clubs = [
    {
      id: "1",
      name: "Rotaract Club of UCSC",
      description:
        "create positive change through community service, professional development, and international understanding",
      image: "/robotics.jpg",
      memberCount: 45,
      upcomingEvents: 3,
      pendingRequests: 2,
      status: "active",
    },
    {
      id: "2",
      name: "Drama Club",
      description: "Perform and enjoy theatre with creative productions.",
      image: "/drama.jpg",
      memberCount: 32,
      upcomingEvents: 2,
      pendingRequests: 1,
      status: "active",
    },
    {
      id: "3",
      name: "Environmental Club",
      description: "Promote sustainability and environmental awareness.",
      image: "/environmental.jpg",
      memberCount: 28,
      upcomingEvents: 1,
      pendingRequests: 0,
      status: "active",
    },
  ];

  // Mocked feedback data
  const recentFeedback = [
    {
      id: 1,
      volunteerName: "Sarah Johnson",
      club: "Robotics Club",
      rating: 5,
      comment:
        "Amazing experience! The club activities are well-organized and engaging.",
      date: "2024-01-15",
    },
    {
      id: 2,
      volunteerName: "Mike Chen",
      club: "Drama Club",
      rating: 4,
      comment:
        "Great leadership and communication. Would love to see more events.",
      date: "2024-01-14",
    },
    {
      id: 3,
      volunteerName: "Emily Davis",
      club: "Environmental Club",
      rating: 5,
      comment: "Excellent initiative and dedication to environmental causes.",
      date: "2024-01-13",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "inactive":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? "text-yellow-400 fill-current" : "text-gray-300"
        }`}
      />
    ));
  };

  return (
    <div className="min-h-screen bg-white pt-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-50 to-red-50 shadow-sm border-b border-orange-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-center items-center min-h-[150px]">
            <div className="flex flex-col justify-center">
              <h1 className="text-3xl font-bold text-black">
                Welcome back,{" "}
                <span className="text-orange-600">{userName}</span>!
              </h1>
              <p className="text-gray-600 mt-1">
                Manage your clubs and oversee all administrative activities
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right ml-99">
                <p className="text-sm text-gray-500">Total Clubs</p>
                <p className="text-2xl font-bold text-black">{clubs.length}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Users className="w-6 h-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Total Members
                </p>
                <p className="text-2xl font-bold text-black">
                  {clubs.reduce((sum, club) => sum + club.memberCount, 0)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Calendar className="w-6 h-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Upcoming Events
                </p>
                <p className="text-2xl font-bold text-black">
                  {clubs.reduce((sum, club) => sum + club.upcomingEvents, 0)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <AlertCircle className="w-6 h-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Pending Requests
                </p>
                <p className="text-2xl font-bold text-black">
                  {clubs.reduce((sum, club) => sum + club.pendingRequests, 0)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Star className="w-6 h-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg. Rating</p>
                <p className="text-2xl font-bold text-black">4.8</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Clubs Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-black">Your Clubs</h2>
                <button
                  onClick={() => setShowAddClubModal(true)}
                  className="flex items-center px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-600 hover:to-red-600 transition-all duration-200 shadow-sm"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add New Club
                </button>
              </div>

              <div className="space-y-4">
                {clubs.map((club) => (
                  <Link key={club.id} href={`/club-admin/clubs/${club.id}`}>
                    <div className="bg-gray-50 rounded-xl p-6 hover:bg-orange-50 transition-all duration-200 cursor-pointer border border-gray-200 hover:border-orange-300">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                            {club.name.charAt(0)}
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-black">
                              {club.name}
                            </h3>
                            <p className="text-gray-600 text-sm">
                              {club.description}
                            </p>
                            <div className="flex items-center space-x-4 mt-2">
                              <span className="text-xs text-gray-500 flex items-center">
                                <Users className="w-3 h-3 mr-1" />
                                {club.memberCount} members
                              </span>
                              <span className="text-xs text-gray-500 flex items-center">
                                <Calendar className="w-3 h-3 mr-1" />
                                {club.upcomingEvents} events
                              </span>
                              {club.pendingRequests > 0 && (
                                <span className="text-xs text-yellow-600 flex items-center">
                                  <AlertCircle className="w-3 h-3 mr-1" />
                                  {club.pendingRequests} pending
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(club.status)}`}
                          >
                            {club.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Feedback Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-black">
                  Recent Feedback
                </h2>
                <Link
                  href="/club-admin/feedback"
                  className="text-orange-600 hover:text-orange-700 text-sm font-medium"
                >
                  View All
                </Link>
              </div>

              <div className="space-y-4">
                {recentFeedback.map((feedback) => (
                  <div key={feedback.id} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-medium text-gray-900">
                          {feedback.volunteerName}
                        </h4>
                        <p className="text-sm text-gray-600">{feedback.club}</p>
                      </div>
                      <div className="flex items-center">
                        {renderStars(feedback.rating)}
                      </div>
                    </div>
                    <p className="text-sm text-gray-700 mb-2">
                      {feedback.comment}
                    </p>
                    <p className="text-xs text-gray-500">{feedback.date}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-2">
                    Overall Satisfaction
                  </p>
                  <div className="flex items-center justify-center space-x-1 mb-2">
                    {renderStars(4.8)}
                  </div>
                  <p className="text-lg font-bold text-gray-900">4.8/5.0</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-black mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link href="/club-admin/interviews" className="group">
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 hover:from-orange-100 hover:to-orange-200 transition-all duration-200 border border-orange-200">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-orange-600 rounded-lg group-hover:bg-orange-700 transition-colors">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-medium text-black">
                      Manage Interviews
                    </h3>
                    <p className="text-sm text-gray-600">Schedule & conduct</p>
                  </div>
                </div>
              </div>
            </Link>

            <Link href="/club-admin/elections" className="group">
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 hover:from-orange-100 hover:to-orange-200 transition-all duration-200 border border-orange-200">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-orange-600 rounded-lg group-hover:bg-orange-700 transition-colors">
                    <Award className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-medium text-black">
                      Approve Elections
                    </h3>
                    <p className="text-sm text-gray-600">Office bearer list</p>
                  </div>
                </div>
              </div>
            </Link>

            <Link href="/club-admin/events" className="group">
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 hover:from-orange-100 hover:to-orange-200 transition-all duration-200 border border-orange-200">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-orange-600 rounded-lg group-hover:bg-orange-700 transition-colors">
                    <Calendar className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-medium text-black">Manage Events</h3>
                    <p className="text-sm text-gray-600">Add, update, remove</p>
                  </div>
                </div>
              </div>
            </Link>

            <Link href="/club-admin/minutes" className="group">
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 hover:from-orange-100 hover:to-orange-200 transition-all duration-200 border border-orange-200">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-orange-600 rounded-lg group-hover:bg-orange-700 transition-colors">
                    <FileText className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-medium text-black">Meeting Minutes</h3>
                    <p className="text-sm text-gray-600">Record & manage</p>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Add Club Modal */}
      {showAddClubModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-orange-100 mb-4">
                <Plus className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="text-lg font-medium text-black mb-2">
                Add New Club
              </h3>
              <p className="text-sm text-gray-600 mb-6">
                Are you sure you want to add a new club? You'll need to complete
                the verification process to get your club approved.
              </p>

              <div className="flex space-x-3">
                <button
                  onClick={() => setShowAddClubModal(false)}
                  className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <Link href="/club-verify" className="flex-1">
                  <button className="w-full px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-orange-500 to-red-500 rounded-lg hover:from-orange-600 hover:to-red-600 transition-all duration-200">
                    Continue
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
