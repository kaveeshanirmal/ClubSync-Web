"use client";
import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
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
  Briefcase,
  BookOpen,
  Users,
  Shield,
  Activity,
  Eye,
} from "lucide-react";
import { useVolunteerStats } from "@/app/hooks/useVolunteerStats";
import VolunteerStats from "@/app/components/volunteer/VolunteerStats";
import { Certificate as CertificateComponent } from "@/components/Certificate";
import { generateCertificate } from "@/utils/generateCertificate";

interface Certificate {
  id: string;
  certificateId: string;
  userName: string;
  eventName: string;
  clubName: string;
  eventDate: string;
  issuedAt: string;
  event: {
    id: string;
    title: string;
  };
}

interface EventHistory {
  id: string;
  title: string;
  subtitle?: string;
  date: string;
  endDate?: string;
  venue?: string;
  category?: string;
  clubName: string;
  status: "completed" | "upcoming" | "cancelled";
  attendanceMarked: boolean;
  attendTime?: string | null;
  eventRole?: string;
}

interface EventHistoryStats {
  totalEvents: number;
  completed: number;
  upcoming: number;
  attended: number;
}

interface ServiceLetter {
  id: string;
  requestedDate: string;
  status: "pending" | "approved" | "rejected";
  downloadUrl?: string;
}

// Certificate Card Component
function CertificateCard({ certificate }: { certificate: Certificate }) {
  const [showPreview, setShowPreview] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const certificateRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    if (!certificateRef.current) return;

    setIsGenerating(true);
    try {
      const blob = await generateCertificate({
        element: certificateRef.current,
        fileName: certificate.certificateId,
        format: 'pdf',
      });

      // Create download link
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${certificate.certificateId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error generating certificate:', error);
      alert('Failed to generate certificate. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleView = () => {
    setShowPreview(true);
  };

  return (
    <>
      <div className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between mb-4">
          <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
            <Award className="w-6 h-6 text-orange-600" />
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleView}
              className="flex items-center gap-1 px-3 py-1 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-sm"
            >
              <Eye className="w-4 h-4" />
              View
            </button>
            <button
              onClick={handleDownload}
              disabled={isGenerating}
              className="flex items-center gap-1 px-3 py-1 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors text-sm disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              {isGenerating ? 'Generating...' : 'Download'}
            </button>
          </div>
        </div>
        
        <h3 className="font-bold text-gray-900 mb-2">{certificate.eventName}</h3>
        <p className="text-sm text-gray-600 mb-3">{certificate.clubName}</p>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-500">Certificate ID</span>
            <span className="font-mono text-gray-700">{certificate.certificateId.substring(0, 12)}...</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-500">Event Date</span>
            <span className="text-gray-700">{certificate.eventDate}</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-500">Issued</span>
            <span className="text-gray-700">{new Date(certificate.issuedAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      {/* Certificate Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-6xl w-full max-h-[90vh] flex flex-col overflow-hidden">
            {/* Header - Fixed at top */}
            <div className="p-6 border-b border-gray-200 flex items-center justify-between bg-white z-10">
              <h2 className="text-xl font-bold text-gray-900">Certificate Preview</h2>
              <div className="flex gap-3">
                <button
                  onClick={handleDownload}
                  disabled={isGenerating}
                  className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50"
                >
                  <Download className="w-4 h-4" />
                  {isGenerating ? 'Generating...' : 'Download PDF'}
                </button>
                <button
                  onClick={() => setShowPreview(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            {/* Certificate Container - Scrollable */}
            <div className="flex-1 overflow-auto bg-gray-50 p-8">
              <div className="flex justify-center">
                <div className="transform scale-75 origin-top">
                  <div style={{ display: showPreview ? 'block' : 'none' }}>
                    <CertificateComponent
                      ref={certificateRef}
                      userName={certificate.userName}
                      eventName={certificate.eventName}
                      clubName={certificate.clubName}
                      eventDate={certificate.eventDate}
                      certificateId={certificate.certificateId}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default function VolunteerProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("activity");
  const { data: session } = useSession();
  
  // Fetch volunteer stats
  const { stats: volunteerStats, loading: statsLoading, error: statsError } = useVolunteerStats(session?.user?.id);
  
  const [user, setUser] = useState({
    name: "Loading...", // This will be fetched from database
    email: "Loading...", // This will be fetched from database
    universityId: "2022IS066",
    mobile: "Loading...", // This will be fetched from database
    role: "Senior Volunteer",
    department: "Computer Science",
    profilePicture: null,
    level: "Silver",
    joinedDate: "2024-01-15",
    totalEvents: 0,
    completedEvents: 0,
    upcomingEvents: 0,
    certificates: [] as Certificate[],
    eventHistory: [] as EventHistory[],
    eventStats: {
      totalEvents: 0,
      completed: 0,
      upcoming: 0,
      attended: 0,
    } as EventHistoryStats,
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
  });

  const [editData, setEditData] = useState({
    name: user.name,
    email: user.email,
    mobile: user.mobile,
    universityId: user.universityId,
  });

  // Fetch user data from database
  useEffect(() => {
    const fetchUserData = async () => {
      if (session?.user?.id) {
        try {
          const response = await fetch(`/api/users/${session.user.id}`);
          if (response.ok) {
            const userData = await response.json();
            const fullName = `${userData.firstName} ${userData.lastName}`;
            setUser(prevUser => ({
              ...prevUser,
              name: fullName,
              email: userData.email,
              mobile: userData.phone
            }));
            setEditData(prevEditData => ({
              ...prevEditData,
              name: fullName,
              email: userData.email,
              mobile: userData.phone
            }));
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          setUser(prevUser => ({
            ...prevUser,
            name: "Error loading name",
            email: "Error loading email",
            mobile: "Error loading mobile"
          }));
        }
      }
    };

    fetchUserData();
  }, [session?.user?.id]);

  // Fetch event history data
  useEffect(() => {
    const fetchEventHistory = async () => {
      if (session?.user?.id) {
        try {
          const response = await fetch(`/api/users/${session.user.id}/event-history`);
          if (response.ok) {
            const data = await response.json();
            setUser(prevUser => ({
              ...prevUser,
              eventHistory: data.events,
              eventStats: data.stats,
              totalEvents: data.stats.totalEvents,
              completedEvents: data.stats.completed,
              upcomingEvents: data.stats.upcoming,
            }));
          }
        } catch (error) {
          console.error("Error fetching event history:", error);
        }
      }
    };

    fetchEventHistory();
  }, [session?.user?.id]);

  // Fetch certificates data
  useEffect(() => {
    const fetchCertificates = async () => {
      if (session?.user?.id) {
        try {
          const response = await fetch('/api/certificates');
          if (response.ok) {
            const data = await response.json();
            setUser(prevUser => ({
              ...prevUser,
              certificates: data.certificates || [],
            }));
          }
        } catch (error) {
          console.error("Error fetching certificates:", error);
        }
      }
    };

    fetchCertificates();
  }, [session?.user?.id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    if (!session?.user?.id) {
      console.error("No user session found");
      return;
    }

    try {
      // Update user data in database
      const response = await fetch(`/api/users/${session.user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: editData.name.split(' ')[0] || editData.name,
          lastName: editData.name.split(' ').slice(1).join(' ') || '',
          email: editData.email,
          phone: editData.mobile,
        }),
      });

      if (response.ok) {
        // Update local state with edited values
        setUser(prevUser => ({
          ...prevUser,
          name: editData.name,
          email: editData.email,
          mobile: editData.mobile,
          universityId: editData.universityId,
        }));
        setIsEditing(false);
        
        // Show success message (optional)
        console.log("Profile updated successfully");
      } else {
        console.error("Failed to update profile");
        // Handle error - maybe show an error message to user
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      // Handle error - maybe show an error message to user
    }
  };

  const handleCancel = () => {
    // Reset editData to current user values
    setEditData({
      name: user.name,
      email: user.email,
      mobile: user.mobile,
      universityId: user.universityId,
    });
    setIsEditing(false);
  };

  const tabs = [
    { id: "activity", label: "Activity", icon: <Activity className="w-5 h-5" /> },
    { id: "certificates", label: "Certifications", icon: <Award className="w-5 h-5" /> },
    { id: "events", label: "Event History", icon: <Calendar className="w-5 h-5" /> },
    { id: "documents", label: "Documents", icon: <FileText className="w-5 h-5" /> },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-gray-100 text-gray-700 border-gray-300";
      case "upcoming": return "bg-gray-50 text-gray-600 border-gray-200";
      case "cancelled": return "bg-gray-100 text-gray-500 border-gray-300";
      case "approved": return "bg-gray-100 text-gray-700 border-gray-300";
      case "pending": return "bg-gray-50 text-gray-600 border-gray-200";
      case "rejected": return "bg-gray-100 text-gray-500 border-gray-300";
      default: return "bg-gray-100 text-gray-600 border-gray-200";
    }
  };

  const getLevelBadge = (level: string) => {
    switch (level) {
      case "Bronze": return { icon: <Shield className="w-4 h-4 text-orange-600" />, text: "Bronze Member" };
      case "Silver": return { icon: <Star className="w-4 h-4 text-orange-600" />, text: "Silver Member" };
      case "Gold": return { icon: <Award className="w-4 h-4 text-orange-600" />, text: "Gold Member" };
      default: return { icon: <Badge className="w-4 h-4 text-orange-600" />, text: "Member" };
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="w-full px-4 py-6">
        {/* Professional Header Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8">
          <div className="p-8">
            <div className="flex flex-col lg:flex-row items-start gap-8">
              {/* Profile Picture Section */}
              <div className="flex flex-col items-center">
                <div className="relative">
                  <div className="w-32 h-32 rounded-full bg-gray-100 border-3 border-orange-300 shadow-lg flex items-center justify-center overflow-hidden">
                    {user.profilePicture ? (
                      <img src={user.profilePicture} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-16 h-16 text-gray-400" />
                    )}
                  </div>
                  <button className="absolute bottom-2 right-2 w-8 h-8 bg-gray-600 hover:bg-gray-700 rounded-full flex items-center justify-center text-white transition-colors">
                    <Camera className="w-4 h-4" />
                  </button>
                </div>
                
                {/* Level Badge */}
                <div className="mt-4 flex items-center gap-2 px-3 py-1 bg-orange-100 rounded-full text-sm text-orange-700">
                  {getLevelBadge(user.level).icon}
                  <span className="font-medium">{getLevelBadge(user.level).text}</span>
                </div>
              </div>

              {/* Profile Information */}
              <div className="flex-1">
                <div className="mb-6">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{user.name}</h1>
                  <div className="flex flex-wrap items-center gap-4 text-gray-600">
                    <span className="flex items-center gap-2">
                      <Briefcase className="w-4 h-4" />
                      {user.role}
                    </span>
                    <span className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4" />
                      {user.department}
                    </span>
                    <span className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Joined {new Date(user.joinedDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="grid md:grid-cols-3 gap-4 mb-6">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Mail className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Email</p>
                      <p className="text-sm font-medium text-gray-900">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <IdCard className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Student ID</p>
                      <p className="text-sm font-medium text-gray-900">{user.universityId}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Phone className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Mobile</p>
                      <p className="text-sm font-medium text-gray-900">{user.mobile}</p>
                    </div>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="flex flex-wrap gap-3">
                  <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium text-gray-700">{user.completedEvents} Completed</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg">
                    <Award className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-gray-700">{user.certificates.length} Certificates</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg">
                    <Clock className="w-4 h-4 text-orange-600" />
                    <span className="text-sm font-medium text-gray-700">{user.upcomingEvents} Upcoming</span>
                  </div>
                </div>
              </div>

              {/* Edit Button */}
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-1 px-3 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  <Edit3 className="w-3 h-3" />
                  Edit Profile
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Volunteer Rewards Section */}
        {volunteerStats && !statsLoading && !statsError && (
          <div className="mb-8">
            <VolunteerStats
              totalPoints={volunteerStats.totalPoints}
              eventsParticipated={volunteerStats.eventsParticipated}
              eventsOrganized={volunteerStats.eventsOrganized}
              totalEvents={volunteerStats.totalEvents}
              badge={volunteerStats.badge}
              nextBadge={volunteerStats.nextBadge}
              progress={volunteerStats.progress}
            />
          </div>
        )}

        {/* Professional Navigation Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8">
          <div className="p-2">
            <div className="flex flex-wrap gap-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                    activeTab === tab.id
                      ? "bg-orange-500 text-white shadow-sm"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  {tab.icon}
                  <span className="hidden sm:block">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content Sections */}
        {/* Edit Profile Popup Modal */}
        {isEditing && (
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border-2 border-orange-200">
              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Edit Profile Information</h2>
                  <button
                    onClick={handleCancel}
                    className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={editData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={editData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Mobile Number</label>
                    <input
                      type="tel"
                      name="mobile"
                      value={editData.mobile}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">University ID</label>
                    <input
                      type="text"
                      name="universityId"
                      value={editData.universityId}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                    />
                  </div>
                </div>
                
                <div className="flex gap-4 pt-8">
                  <button
                    onClick={handleCancel}
                    className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="flex-1 px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "activity" && (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Activity</h2>
            <div className="space-y-4">
              {[
                { action: "Completed TechFest 2024 event", date: "2 days ago", type: "event" },
                { action: "Received Leadership Certificate", date: "1 week ago", type: "certificate" },
                { action: "Joined Community Clean-up Drive", date: "2 weeks ago", type: "event" },
                { action: "Profile updated", date: "3 weeks ago", type: "profile" },
              ].map((activity, index) => (
                <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                    {activity.type === "event" && <Calendar className="w-5 h-5 text-gray-600" />}
                    {activity.type === "certificate" && <Award className="w-5 h-5 text-gray-600" />}
                    {activity.type === "profile" && <User className="w-5 h-5 text-gray-600" />}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{activity.action}</p>
                    <p className="text-sm text-gray-600">{activity.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Certificates Tab */}
        {activeTab === "certificates" && (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">My Certificates</h2>
              <span className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                {user.certificates.length} Certificate(s)
              </span>
            </div>
            
            {user.certificates.length === 0 ? (
              <div className="text-center py-12">
                <Award className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No certificates yet</h3>
                <p className="text-gray-600 mb-4">Participate in events to earn certificates!</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {user.certificates.map((certificate) => (
                  <CertificateCard key={certificate.id} certificate={certificate} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Event History Tab */}
        {activeTab === "events" && (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
            {/* Stats Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                <div className="flex items-center gap-2 text-orange-600 mb-1">
                  <Calendar className="w-4 h-4" />
                  <span className="text-xs font-medium">Total Events</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">{user.eventStats.totalEvents}</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center gap-2 text-green-600 mb-1">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-xs font-medium">Completed</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">{user.eventStats.completed}</p>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center gap-2 text-blue-600 mb-1">
                  <Clock className="w-4 h-4" />
                  <span className="text-xs font-medium">Upcoming</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">{user.eventStats.upcoming}</p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                <div className="flex items-center gap-2 text-purple-600 mb-1">
                  <Star className="w-4 h-4" />
                  <span className="text-xs font-medium">Attended</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">{user.eventStats.attended}</p>
              </div>
            </div>

            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Event Participation History</h2>
              <span className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                {user.eventHistory.length} Events
              </span>
            </div>
            
            {user.eventHistory.length > 0 ? (
              <div className="space-y-4">
                {user.eventHistory.map((event, index) => (
                  <div key={index} className="flex items-start justify-between p-6 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors group">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-12 h-12 bg-gradient-to-br from-orange-100 to-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Calendar className="w-6 h-6 text-orange-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900 mb-1">{event.title}</h3>
                        {event.subtitle && (
                          <p className="text-sm text-gray-600 mb-2">{event.subtitle}</p>
                        )}
                        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 mb-2">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {new Date(event.date).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })}
                          </span>
                          {event.venue && (
                            <span className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              {event.venue}
                            </span>
                          )}
                          <span className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            {event.clubName}
                          </span>
                          {event.category && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium">
                              {event.category}
                            </span>
                          )}
                        </div>
                        {event.attendTime && (
                          <p className="text-xs text-green-600 flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" />
                            Attended on {new Date(event.attendTime).toLocaleString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end gap-2">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(event.status)}`}>
                        {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                      </span>
                      
                      {event.status === 'completed' && (
                        <div className="flex items-center gap-2">
                          {event.attendanceMarked ? (
                            <div className="flex items-center gap-1 text-green-600">
                              <CheckCircle className="w-4 h-4" />
                              <span className="text-sm font-medium">Attended</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1 text-gray-400">
                              <X className="w-4 h-4" />
                              <span className="text-sm">No Record</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg mb-2">No event history found</p>
                <p className="text-gray-400 text-sm">Register for events to see your participation history here</p>
              </div>
            )}
          </div>
        )}

        {/* Documents Tab */}
        {activeTab === "documents" && (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Document Requests</h2>
              <button className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors">
                <FileText className="w-4 h-4" />
                Request Document
              </button>
            </div>
            
            <div className="space-y-4">
              {user.serviceLetters.map((letter) => (
                <div key={letter.id} className="flex items-center justify-between p-6 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                      <FileText className="w-6 h-6 text-gray-600" />
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
                      <button className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
                        <Download className="w-4 h-4" />
                        <span className="text-sm font-medium">Download</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
              
              {user.serviceLetters.length === 0 && (
                <div className="text-center py-12">
                  <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Document Requests</h3>
                  <p className="text-gray-600 mb-4">You haven't requested any documents yet.</p>
                  <button className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors">
                    Request Your First Document
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
