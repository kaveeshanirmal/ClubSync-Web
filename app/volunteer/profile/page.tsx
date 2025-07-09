"use client";
import { useState } from "react";
import {
  User,
  Mail,
  Phone,
  Award,
  Calendar,
  Edit3,
  Download,
  Badge,
  MapPin,
  IdCard,
  Clock,
  CheckCircle,
  X,
  FileText,
  Star,
  Camera,
  Settings,
} from "lucide-react";

interface Certificate {
  title: string;
  eventName?: string;
  dateAwarded: string;
  url: string;
}

interface EventHistory {
  title: string;
  date: string;
  status: "completed" | "upcoming" | "cancelled";
  attendanceMarked: boolean;
}

interface ServiceLetter {
  id: string;
  requestedDate: string;
  status: "pending" | "approved" | "rejected";
  downloadUrl?: string;
}

export default function VolunteerProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  
  const user = {
    name: "Shihan Mihiranga",
    email: "shihan@ucsc.cmb.ac.lk",
    universityId: "2022IS066",
    mobile: "0712345678",
    role: "Volunteer",
    profilePicture: null,
    rewardPoints: 320,
    level: "Silver",
    certificates: [
      { 
        title: "Leadership Workshop Certificate", 
        eventName: "Leadership Development Program 2024",
        dateAwarded: "2024-10-15",
        url: "#" 
      },
      { 
        title: "Event Volunteer Certificate", 
        eventName: "TechFest 2024",
        dateAwarded: "2024-10-12",
        url: "#" 
      },
      { 
        title: "Community Service Certificate", 
        eventName: "Community Clean-up Drive",
        dateAwarded: "2024-06-15",
        url: "#" 
      },
      { 
        title: "Blood Donation Certificate", 
        eventName: "Blood Donation Camp",
        dateAwarded: "2024-06-01",
        url: "#" 
      },
    ],
    eventHistory: [
      { title: "TechFest 2024", date: "2024-10-12", status: "completed" as const, attendanceMarked: true },
      { title: "Green Club Meetup", date: "2024-08-05", status: "completed" as const, attendanceMarked: true },
      { title: "Community Clean-up Drive", date: "2024-06-15", status: "completed" as const, attendanceMarked: true },
      { title: "Food Distribution Program", date: "2024-06-01", status: "completed" as const, attendanceMarked: false },
      { title: "Winter Carnival 2025", date: "2025-01-15", status: "upcoming" as const, attendanceMarked: false },
    ],
    serviceLetters: [
      {
        id: "1",
        requestedDate: "2024-11-01",
        status: "approved" as const,
        downloadUrl: "#"
      },
      {
        id: "2", 
        requestedDate: "2024-12-15",
        status: "pending" as const
      }
    ]
  };

  const [editData, setEditData] = useState({
    name: user.name,
    email: user.email,
    mobile: user.mobile,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: <User className="w-4 h-4" /> },
    { id: "certificates", label: "Certificates", icon: <Award className="w-4 h-4" /> },
    { id: "events", label: "Event History", icon: <Calendar className="w-4 h-4" /> },
    { id: "service-letters", label: "Service Letters", icon: <FileText className="w-4 h-4" /> },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-100 text-green-700 border-green-200";
      case "upcoming": return "bg-blue-100 text-blue-700 border-blue-200";
      case "cancelled": return "bg-red-100 text-red-700 border-red-200";
      case "approved": return "bg-green-100 text-green-700 border-green-200";
      case "pending": return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "rejected": return "bg-red-100 text-red-700 border-red-200";
      default: return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-white text-black pt-20 relative overflow-hidden">
      {/* Animated background elements - matching home page */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute top-20 left-10 w-2 h-2 bg-orange-300 rotate-45 animate-bounce"
          style={{ animationDelay: "0s", animationDuration: "3s" }}
        />
        <div
          className="absolute top-40 right-20 w-3 h-3 bg-orange-400 rounded-full animate-pulse"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute bottom-40 left-20 w-2 h-6 bg-orange-200 animate-bounce"
          style={{ animationDelay: "2s", animationDuration: "4s" }}
        />
        <div
          className="absolute bottom-20 right-10 w-4 h-4 bg-orange-300 rotate-45 animate-pulse"
          style={{ animationDelay: "1.5s" }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 relative z-10">
        {/* Profile Header Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8 relative group hover:shadow-xl transition-all duration-500">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          <div className="relative z-10 flex flex-col lg:flex-row items-center lg:items-start gap-8">
            {/* Profile Picture */}
            <div className="relative group/avatar">
              <div className="w-32 h-32 rounded-full bg-gradient-to-r from-orange-500 to-red-500 p-1">
                <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                  {user.profilePicture ? (
                    <img src={user.profilePicture} alt="Profile" className="w-full h-full rounded-full object-cover" />
                  ) : (
                    <User className="w-16 h-16 text-gray-400" />
                  )}
                </div>
              </div>
              <button className="absolute bottom-2 right-2 w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white hover:bg-orange-600 transition-colors">
                <Camera className="w-4 h-4" />
              </button>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 border-3 border-white rounded-full"></div>
            </div>

            {/* Profile Info */}
            <div className="flex-1 text-center lg:text-left">
              <div className="flex flex-col lg:flex-row lg:items-center gap-4 mb-4">
                <h1 className="text-4xl font-bold text-black">{user.name}</h1>
                <span className="inline-flex items-center px-4 py-2 bg-orange-100 text-orange-700 rounded-full text-sm font-medium">
                  {user.role}
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="flex items-center justify-center lg:justify-start gap-2 text-gray-600">
                  <Mail className="w-4 h-4" />
                  <span className="text-sm">{user.email}</span>
                </div>
                <div className="flex items-center justify-center lg:justify-start gap-2 text-gray-600">
                  <IdCard className="w-4 h-4" />
                  <span className="text-sm">{user.universityId}</span>
                </div>
                <div className="flex items-center justify-center lg:justify-start gap-2 text-gray-600">
                  <Phone className="w-4 h-4" />
                  <span className="text-sm">{user.mobile}</span>
                </div>
              </div>

              {/* Reward Points Section */}
              <div className="inline-flex items-center gap-4 bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-xl">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5" />
                  <span className="font-bold text-lg">{user.rewardPoints} Points</span>
                </div>
                <div className="h-6 w-px bg-white/30"></div>
                <div className="flex items-center gap-2">
                  <Badge className="w-4 h-4" />
                  <span className="font-medium">{user.level} Level</span>
                </div>
              </div>
            </div>

            {/* Edit Profile Button */}
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="flex items-center gap-2 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-medium hover:border-orange-500 hover:text-orange-500 transition-all duration-300 transform hover:scale-105"
            >
              <Edit3 className="w-4 h-4" />
              {isEditing ? "Cancel" : "Edit Profile"}
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-2 mb-8">
          <div className="flex flex-wrap gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-orange-500 to-red-500 text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
        {/* Content based on active tab */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            {/* Basic Profile Information */}
            {isEditing ? (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                <h2 className="text-2xl font-bold mb-6 text-black">Edit Profile Information</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={editData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={editData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Mobile Number</label>
                    <input
                      type="tel"
                      name="mobile"
                      value={editData.mobile}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">University ID</label>
                    <input
                      type="text"
                      value={user.universityId}
                      disabled
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 text-gray-500"
                    />
                  </div>
                </div>
                <div className="flex gap-4 pt-6">
                  <button
                    onClick={handleCancel}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl hover:from-orange-600 hover:to-red-600 transition-all duration-300 font-medium"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid lg:grid-cols-3 gap-8">
                {/* Quick Stats */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                      <Award className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">Certificates</h3>
                      <p className="text-2xl font-bold text-orange-500">{user.certificates.length}</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">Total certificates earned</p>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                      <Calendar className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">Events</h3>
                      <p className="text-2xl font-bold text-orange-500">{user.eventHistory.filter(e => e.status === 'completed').length}</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">Events completed</p>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                      <FileText className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">Service Letters</h3>
                      <p className="text-2xl font-bold text-orange-500">{user.serviceLetters.filter(l => l.status === 'approved').length}</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">Letters approved</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Certificates Tab */}
        {activeTab === "certificates" && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-black">My Certificates</h2>
              <span className="px-4 py-2 bg-orange-100 text-orange-700 rounded-full text-sm font-medium">
                {user.certificates.length} Total
              </span>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              {user.certificates.map((certificate, index) => (
                <div key={index} className="group relative bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="relative z-10">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
                        <Award className="w-6 h-6 text-white" />
                      </div>
                      <a
                        href={certificate.url}
                        className="flex items-center gap-2 text-orange-500 hover:text-orange-600 transition-colors"
                      >
                        <Download className="w-4 h-4" />
                        <span className="text-sm font-medium">Download</span>
                      </a>
                    </div>
                    <h3 className="font-bold text-gray-900 mb-2">{certificate.title}</h3>
                    {certificate.eventName && (
                      <p className="text-sm text-gray-600 mb-2">{certificate.eventName}</p>
                    )}
                    <p className="text-xs text-gray-500">Awarded on {new Date(certificate.dateAwarded).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Event History Tab */}
        {activeTab === "events" && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-black">Event History</h2>
              <span className="px-4 py-2 bg-orange-100 text-orange-700 rounded-full text-sm font-medium">
                {user.eventHistory.length} Total Events
              </span>
            </div>
            
            <div className="space-y-4">
              {user.eventHistory.map((event, index) => (
                <div key={index} className="group flex items-center justify-between p-6 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all duration-300">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                      <Calendar className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">{event.title}</h3>
                      <p className="text-sm text-gray-600">{new Date(event.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(event.status)}`}>
                      {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                    </span>
                    
                    <div className="flex items-center gap-2">
                      {event.attendanceMarked ? (
                        <div className="flex items-center gap-1 text-green-600">
                          <CheckCircle className="w-4 h-4" />
                          <span className="text-sm font-medium">Attended</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-gray-400">
                          <X className="w-4 h-4" />
                          <span className="text-sm">No attendance</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Service Letters Tab */}
        {activeTab === "service-letters" && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-black">Service Letter Requests</h2>
              <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl hover:from-orange-600 hover:to-red-600 transition-all duration-300">
                <FileText className="w-4 h-4" />
                Request New Letter
              </button>
            </div>
            
            <div className="space-y-4">
              {user.serviceLetters.map((letter) => (
                <div key={letter.id} className="flex items-center justify-between p-6 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all duration-300">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                      <FileText className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">Service Letter Request</h3>
                      <p className="text-sm text-gray-600">Requested on {new Date(letter.requestedDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(letter.status)}`}>
                      {letter.status.charAt(0).toUpperCase() + letter.status.slice(1)}
                    </span>
                    
                    {letter.status === "approved" && letter.downloadUrl && (
                      <a
                        href={letter.downloadUrl}
                        className="flex items-center gap-2 text-orange-500 hover:text-orange-600 transition-colors"
                      >
                        <Download className="w-4 h-4" />
                        <span className="text-sm font-medium">Download</span>
                      </a>
                    )}
                  </div>
                </div>
              ))}
              
              {user.serviceLetters.length === 0 && (
                <div className="text-center py-12">
                  <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Service Letters</h3>
                  <p className="text-gray-600 mb-4">You haven't requested any service letters yet.</p>
                  <button className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl hover:from-orange-600 hover:to-red-600 transition-all duration-300">
                    Request Your First Letter
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
