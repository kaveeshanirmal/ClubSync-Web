"use client";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { 
  ArrowLeft,
  Users, 
  Calendar, 
  FileText, 
  CheckCircle, 
  MessageSquare, 
  Star,
  Award,
  Clock,
  AlertCircle,
  Plus,
  Edit,
  Trash2,
  Eye,
  Download,
  Filter,
  Search
} from "lucide-react";

export default function ClubDetailPage() {
  const { data: session } = useSession();
  const params = useParams();
  const router = useRouter();
  const clubId = params.id as string;
  const [activeTab, setActiveTab] = useState("overview");

  // Mock clubs data - this should come from your API
  const clubsData = {
    "1": {
      id: "1",
      name: "Robotics Club",
      description: "Innovate and build robots for competitions and research.",
      memberCount: 45,
      upcomingEvents: 3,
      pendingRequests: 2,
      status: "active",
      createdAt: "2023-09-15"
    },
    "2": {
      id: "2",
      name: "Drama Club",
      description: "Perform and enjoy theatre with creative productions.",
      memberCount: 32,
      upcomingEvents: 2,
      pendingRequests: 1,
      status: "active",
      createdAt: "2023-08-20"
    },
    "3": {
      id: "3",
      name: "Environmental Club",
      description: "Promote sustainability and environmental awareness.",
      memberCount: 28,
      upcomingEvents: 1,
      pendingRequests: 0,
      status: "active",
      createdAt: "2023-10-05"
    }
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
    createdAt: "Unknown"
  };

  // Mock data for different sections
  const interviews = [
    {
      id: 1,
      candidateName: "John Doe",
      position: "Technical Lead",
      date: "2024-01-20",
      time: "10:00 AM",
      status: "scheduled",
      notes: "Strong technical background"
    },
    {
      id: 2,
      candidateName: "Jane Smith",
      position: "Event Coordinator",
      date: "2024-01-21",
      time: "2:00 PM",
      status: "completed",
      notes: "Excellent communication skills"
    }
  ];

  const elections = [
    {
      id: 1,
      position: "President",
      candidates: ["Alice Johnson", "Bob Wilson"],
      status: "pending",
      deadline: "2024-02-01"
    },
    {
      id: 2,
      position: "Vice President",
      candidates: ["Charlie Brown", "Diana Prince"],
      status: "approved",
      deadline: "2024-01-25"
    }
  ];

  const events = [
    {
      id: 1,
      title: "Robotics Workshop",
      date: "2024-01-25",
      time: "3:00 PM",
      location: "Lab 101",
      status: "upcoming",
      attendees: 25
    },
    {
      id: 2,
      title: "Competition Prep",
      date: "2024-01-30",
      time: "2:00 PM",
      location: "Main Hall",
      status: "upcoming",
      attendees: 30
    }
  ];

  const minutes = [
    {
      id: 1,
      title: "Monthly Meeting - January",
      date: "2024-01-15",
      attendees: 20,
      status: "published"
    },
    {
      id: 2,
      title: "Planning Session",
      date: "2024-01-10",
      attendees: 15,
      status: "draft"
    }
  ];

  const serviceLetters = [
    {
      id: 1,
      volunteerName: "Sarah Johnson",
      requestDate: "2024-01-15",
      purpose: "University Application",
      status: "pending"
    },
    {
      id: 2,
      volunteerName: "Mike Chen",
      requestDate: "2024-01-12",
      purpose: "Job Application",
      status: "approved"
    }
  ];

  const candidates = [
    {
      id: 1,
      name: "Alex Turner",
      position: "Technical Lead",
      experience: "2 years",
      status: "pending",
      appliedDate: "2024-01-15"
    },
    {
      id: 2,
      name: "Emma Davis",
      position: "Event Coordinator",
      experience: "1 year",
      status: "approved",
      appliedDate: "2024-01-10"
    }
  ];

  const feedback = [
    {
      id: 1,
      volunteerName: "Sarah Johnson",
      rating: 5,
      comment: "Amazing experience! The club activities are well-organized and engaging.",
      date: "2024-01-15"
    },
    {
      id: 2,
      volunteerName: "Mike Chen",
      rating: 4,
      comment: "Great leadership and communication. Would love to see more events.",
      date: "2024-01-14"
    }
  ];

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

  const tabs = [
    { id: "overview", label: "Overview", icon: Eye },
    { id: "interviews", label: "Interviews", icon: Users },
    { id: "elections", label: "Elections", icon: Award },
    { id: "events", label: "Events", icon: Calendar },
    { id: "minutes", label: "Minutes", icon: FileText },
    { id: "service-letters", label: "Service Letters", icon: MessageSquare },
    { id: "candidates", label: "Candidates", icon: CheckCircle },
    { id: "feedback", label: "Feedback", icon: Star }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Members</p>
                    <p className="text-2xl font-bold text-gray-900">{club.memberCount}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Calendar className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Upcoming Events</p>
                    <p className="text-2xl font-bold text-gray-900">{club.upcomingEvents}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <div className="flex items-center">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <AlertCircle className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Pending Requests</p>
                    <p className="text-2xl font-bold text-gray-900">{club.pendingRequests}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">New member joined - Alex Turner</span>
                  <span className="text-xs text-gray-400">2 hours ago</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Event "Robotics Workshop" scheduled</span>
                  <span className="text-xs text-gray-400">1 day ago</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Service letter request from Sarah Johnson</span>
                  <span className="text-xs text-gray-400">2 days ago</span>
                </div>
              </div>
            </div>
          </div>
        );

      case "interviews":
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">Interview Management</h3>
              <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Plus className="w-4 h-4 mr-2" />
                Schedule Interview
              </button>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Candidate</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Position</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {interviews.map((interview) => (
                      <tr key={interview.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{interview.candidateName}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{interview.position}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{interview.date}</div>
                          <div className="text-sm text-gray-500">{interview.time}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(interview.status)}`}>
                            {interview.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button className="text-blue-600 hover:text-blue-900 mr-3">Edit</button>
                          <button className="text-red-600 hover:text-red-900">Cancel</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case "elections":
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">Election Management</h3>
              <button className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                <Plus className="w-4 h-4 mr-2" />
                New Election
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {elections.map((election) => (
                <div key={election.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="text-lg font-semibold text-gray-900">{election.position}</h4>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(election.status)}`}>
                      {election.status}
                    </span>
                  </div>
                  <div className="space-y-2 mb-4">
                    <p className="text-sm text-gray-600">Candidates:</p>
                    {election.candidates.map((candidate, index) => (
                      <div key={index} className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded">
                        {candidate}
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">Deadline: {election.deadline}</span>
                    <div className="space-x-2">
                      <button className="text-blue-600 hover:text-blue-900 text-sm">Edit</button>
                      <button className="text-green-600 hover:text-green-900 text-sm">Approve</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case "events":
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">Event Management</h3>
              <button className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                <Plus className="w-4 h-4 mr-2" />
                Add Event
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event) => (
                <div key={event.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="text-lg font-semibold text-gray-900">{event.title}</h4>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(event.status)}`}>
                      {event.status}
                    </span>
                  </div>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="w-4 h-4 mr-2" />
                      {event.date} at {event.time}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Users className="w-4 h-4 mr-2" />
                      {event.attendees} attendees
                    </div>
                    <div className="text-sm text-gray-600">{event.location}</div>
                  </div>
                  <div className="flex space-x-2">
                    <button className="flex-1 px-3 py-2 text-sm text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
                      Edit
                    </button>
                    <button className="flex-1 px-3 py-2 text-sm text-red-600 border border-red-600 rounded-lg hover:bg-red-50 transition-colors">
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case "minutes":
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">Meeting Minutes</h3>
              <button className="flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
                <Plus className="w-4 h-4 mr-2" />
                Add Minutes
              </button>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Attendees</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {minutes.map((minute) => (
                      <tr key={minute.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{minute.title}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{minute.date}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{minute.attendees}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(minute.status)}`}>
                            {minute.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button className="text-blue-600 hover:text-blue-900 mr-3">View</button>
                          <button className="text-green-600 hover:text-green-900 mr-3">Edit</button>
                          <button className="text-red-600 hover:text-red-900">Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case "service-letters":
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">Service Letter Requests</h3>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Volunteer</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Request Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Purpose</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {serviceLetters.map((letter) => (
                      <tr key={letter.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{letter.volunteerName}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{letter.requestDate}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{letter.purpose}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(letter.status)}`}>
                            {letter.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button className="text-blue-600 hover:text-blue-900 mr-3">View</button>
                          <button className="text-green-600 hover:text-green-900 mr-3">Approve</button>
                          <button className="text-red-600 hover:text-red-900">Reject</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case "candidates":
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">Candidate Approvals</h3>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Candidate</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Position</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Experience</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applied Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {candidates.map((candidate) => (
                      <tr key={candidate.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{candidate.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{candidate.position}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{candidate.experience}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{candidate.appliedDate}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(candidate.status)}`}>
                            {candidate.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button className="text-blue-600 hover:text-blue-900 mr-3">View</button>
                          <button className="text-green-600 hover:text-green-900 mr-3">Approve</button>
                          <button className="text-red-600 hover:text-red-900">Reject</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case "feedback":
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">Volunteer Feedback</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {feedback.map((item) => (
                <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="font-medium text-gray-900">{item.volunteerName}</h4>
                      <p className="text-sm text-gray-600">{item.date}</p>
                    </div>
                    <div className="flex items-center">
                      {renderStars(item.rating)}
                    </div>
                  </div>
                  <p className="text-sm text-gray-700">{item.comment}</p>
                </div>
              ))}
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">Overall Club Rating</p>
                <div className="flex items-center justify-center space-x-1 mb-2">
                  {renderStars(4.5)}
                </div>
                <p className="text-lg font-bold text-gray-900">4.5/5.0</p>
                <p className="text-sm text-gray-600 mt-1">Based on {feedback.length} reviews</p>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-white pt-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-50 to-red-50 shadow-sm border-b border-orange-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.back()}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{club.name}</h1>
                <p className="text-gray-600">{club.description}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(club.status)}`}>
                {club.status}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6" aria-label="Tabs">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
} 