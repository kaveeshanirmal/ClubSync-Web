"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import BeautifulLoader from "../../../components/Loader";
import {
  Calendar,
  MapPin,
  Users,
  Mail,
  Phone,
  Globe,
  Star,
  Award,
  Clock,
  Heart,
  Target,
  Zap,
  Shield,
  ChevronRight,
  Instagram,
  Facebook,
  Linkedin,
  Twitter,
} from "lucide-react";

interface Club {
  id: string;
  name: string;
  motto?: string;
  founded?: string;
  headquarters?: string;
  coverImage?: string;
  profileImage?: string;
  about?: string;
  mission?: string;
  values?: string[];
  avenues?: string[];
  email?: string;
  phone?: string;
  website?: string;
  googleMapURL?: string;
  instagram?: string;
  facebook?: string;
  linkedIn?: string;
  twitter?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  excomMembers: Array<{
    id: string;
    name: string;
    position: string;
    image?: string;
    about?: string;
    memberSince?: string;
    businessEmail?: string;
    businessMobile?: string;
  }>;
  events: Array<{
    id: string;
    title: string;
    category: string;
    description?: string;
    startDateTime: string;
    endDateTime: string;
    venue?: string;
    maxParticipants?: number;
  }>;
  elections: Array<{
    id: string;
    title: string;
    subtitle?: string;
    description?: string;
    year: number;
    votingStart: string;
    votingEnd: string;
  }>;
}

export default function ClubPage() {
  const params = useParams();
  const clubId = params.id as string;
  
  const [activeTab, setActiveTab] = useState("overview");
  const [club, setClub] = useState<Club | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClubData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/clubs/${clubId}`);

        if (!response.ok) {
          throw new Error("Failed to fetch club data");
        }

        const clubData = await response.json();
        setClub(clubData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchClubData();
  }, [clubId]);

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      "Community Service": "from-orange-400 to-red-500",
      "Professional Development": "from-orange-500 to-yellow-500",
      "Health & Wellness": "from-red-500 to-orange-600",
      Leadership: "from-orange-600 to-amber-500",
      Environmental: "from-amber-500 to-orange-400",
    };
    return colors[category] || "from-orange-500 to-red-500";
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      time: date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
  };

  if (loading) {
    return (
      <BeautifulLoader 
        message="Loading Club Details"
        subMessage="Getting the latest information"
        type="morphing"
      />
    );
  }

  if (error || !club) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 pt-16 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Heart className="h-10 w-10 text-red-500" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-4">
            Oops! Something went wrong
          </h3>
          <p className="text-red-600 text-lg mb-6">{error || "Club not found"}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-3 rounded-full hover:from-orange-600 hover:to-red-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 pt-16">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-l from-orange-500 to-red-500 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        {club.coverImage && (
          <div
            className="absolute inset-0 bg-cover bg-center opacity-30"
            style={{ backgroundImage: `url(${club.coverImage})` }}
          ></div>
        )}

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-16">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                  <Zap className="w-10 h-10 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl lg:text-5xl font-bold mb-2">
                    {club.name}
                  </h1>
                  <p className="text-xl opacity-90">
                    {club.motto || "Service Above Self"}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
                  <Users className="w-8 h-8 mx-auto mb-2" />
                  <div className="text-2xl font-bold">
                    {club.excomMembers?.length || 0}
                  </div>
                  <div className="text-sm opacity-80">Executive Members</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
                  <Award className="w-8 h-8 mx-auto mb-2" />
                  <div className="text-2xl font-bold">
                    {club.events?.length || 0}
                  </div>
                  <div className="text-sm opacity-80">Upcoming Events</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
                  <Heart className="w-8 h-8 mx-auto mb-2" />
                  <div className="text-2xl font-bold">
                    {club.elections?.length || 0}
                  </div>
                  <div className="text-sm opacity-80">Elections</div>
                </div>
              </div>

              <div className="flex flex-wrap gap-4">
                {club.founded && (
                  <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
                    <Calendar className="w-5 h-5" />
                    <span>Founded {club.founded}</span>
                  </div>
                )}
                {club.headquarters && (
                  <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
                    <MapPin className="w-5 h-5" />
                    <span>{club.headquarters}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex-shrink-0">
              <div className="relative">
                <Image
                  src={
                    club.profileImage ||
                    "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=300&h=300&fit=crop&crop=center"
                  }
                  alt={`${club.name} Logo`}
                  width={192}
                  height={192}
                  className="w-48 h-48 rounded-full border-4 border-white/20 shadow-2xl object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white shadow-sm border-b sticky top-16 z-20 -mt-1">
        <div className="max-w-7xl mx-auto px-6">
          <nav className="flex space-x-8">
            {[
              { id: "overview", label: "Overview", icon: Target },
              { id: "exco", label: "Executive Committee", icon: Users },
              { id: "events", label: "Upcoming Events", icon: Calendar },
              { id: "contact", label: "Contact & Social", icon: Mail },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center gap-2 py-4 px-2 border-b-2 font-medium transition-colors ${
                  activeTab === id
                    ? "border-orange-500 text-orange-500"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <Icon className="w-5 h-5" />
                {label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content Sections */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            <div className="bg-white rounded-2xl p-8 shadow-sm border">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  About Our Club
                </h2>
              </div>

              <p className="text-gray-600 leading-relaxed">
                {club.about || "No description available."}
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white rounded-2xl p-8 shadow-sm border">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <Target className="w-6 h-6 text-orange-500" />
                  Our Mission
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {club.mission || "No mission statement available."}
                </p>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-sm border">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <Shield className="w-6 h-6 text-orange-500" />
                  Our Values
                </h3>
                {club.values && club.values.length > 0 ? (
                  <ul className="space-y-2 text-gray-600">
                    {club.values.map((value, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <ChevronRight className="w-4 h-4 text-orange-500" />
                        {value}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-600">No values listed.</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Executive Committee Tab */}
        {activeTab === "exco" && (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-bold text-gray-900">
                Executive Committee
              </h2>
            </div>

            {club.excomMembers && club.excomMembers.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {club.excomMembers.map((member) => (
                  <div
                    key={member.id}
                    className="bg-white rounded-2xl p-6 shadow-sm border hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                  >
                    <div className="relative mb-4">
                      <Image
                        src={
                          member.image ||
                          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
                        }
                        alt={member.name}
                        width={96}
                        height={96}
                        className="w-24 h-24 rounded-full mx-auto border-4 border-orange-100 object-cover"
                      />
                    </div>

                    <div className="text-center">
                      <h3 className="text-lg font-bold text-gray-900 mb-1">
                        {member.name}
                      </h3>
                      <p className="text-orange-600 font-semibold mb-3">
                        {member.position}
                      </p>
                      <p className="text-gray-600 text-sm mb-4">
                        {member.about || "No bio available."}
                      </p>

                      <div className="flex justify-center gap-2">
                        {member.businessEmail && (
                          <button className="p-2 bg-orange-100 text-orange-500 rounded-lg hover:bg-orange-200 transition-colors">
                            <Mail className="w-4 h-4" />
                          </button>
                        )}
                        {member.businessMobile && (
                          <button className="p-2 bg-orange-100 text-orange-500 rounded-lg hover:bg-orange-200 transition-colors">
                            <Phone className="w-4 h-4" />
                          </button>
                        )}
                      </div>

                      {member.memberSince && (
                        <div className="mt-4 text-xs text-gray-500">
                          Member since {member.memberSince}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">
                  No executive committee members listed.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Events Tab */}
        {activeTab === "events" && (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-bold text-gray-900">
                Upcoming Events
              </h2>
            </div>

            {club.events && club.events.length > 0 ? (
              <div className="grid gap-6">
                {club.events.map((event) => {
                  const { date, time } = formatDateTime(event.startDateTime);
                  return (
                    <div
                      key={event.id}
                      className="bg-white rounded-2xl shadow-sm border overflow-hidden hover:shadow-lg transition-shadow"
                    >
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${getCategoryColor(event.category)} text-white`}
                              >
                                {event.category}
                              </span>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">
                              {event.title}
                            </h3>
                            <p className="text-gray-600 mb-4">
                              {event.description || "No description available."}
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-4 mb-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {date}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {time}
                          </div>
                          {event.venue && (
                            <div className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              {event.venue}
                            </div>
                          )}
                        </div>

                        <div className="flex items-center justify-between">
                          {event.maxParticipants && (
                            <div className="text-sm text-gray-600">
                              Max participants:{" "}
                              <span className="font-medium text-orange-500">
                                {event.maxParticipants}
                              </span>
                            </div>
                          )}
                          <Link href={`/events/${event.id}`}>
                            <button className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-2 rounded-lg hover:from-orange-600 hover:to-red-600 transition-all duration-300">
                              View Details
                            </button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No upcoming events scheduled.</p>
              </div>
            )}
          </div>
        )}

        {/* Contact Tab */}
        {activeTab === "contact" && (
          <div className="space-y-8">
            <h2 className="text-3xl font-bold text-gray-900">
              Contact & Social Media
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white rounded-2xl p-8 shadow-sm border">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <Mail className="w-6 h-6 text-orange-500" />
                  Contact Information
                </h3>

                <div className="space-y-4">
                  {club.email && (
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                        <Mail className="w-5 h-5 text-orange-500" />
                      </div>
                      <div>
                        <p className="font-medium">Email</p>
                        <p className="text-gray-600">{club.email}</p>
                      </div>
                    </div>
                  )}

                  {club.phone && (
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                        <Phone className="w-5 h-5 text-orange-500" />
                      </div>
                      <div>
                        <p className="font-medium">Phone</p>
                        <p className="text-gray-600">{club.phone}</p>
                      </div>
                    </div>
                  )}

                  {club.website && (
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                        <Globe className="w-5 h-5 text-orange-500" />
                      </div>
                      <div>
                        <p className="font-medium">Website</p>
                        <p className="text-gray-600">{club.website}</p>
                      </div>
                    </div>
                  )}

                  {club.headquarters && (
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                        <MapPin className="w-5 h-5 text-orange-500" />
                      </div>
                      <div>
                        <p className="font-medium">Headquarters</p>
                        <p className="text-gray-600">{club.headquarters}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-sm border">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <Star className="w-6 h-6 text-orange-500" />
                  Follow Us
                </h3>

                <div className="grid grid-cols-2 gap-4">
                  {club.instagram && (
                    <a
                      href={`https://instagram.com/${club.instagram}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300"
                    >
                      <Instagram className="w-6 h-6" />
                      <span>Instagram</span>
                    </a>
                  )}

                  {club.facebook && (
                    <a
                      href={`https://facebook.com/${club.facebook}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300"
                    >
                      <Facebook className="w-6 h-6" />
                      <span>Facebook</span>
                    </a>
                  )}

                  {club.linkedIn && (
                    <a
                      href={`https://linkedin.com/company/${club.linkedIn}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-4 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-all duration-300"
                    >
                      <Linkedin className="w-6 h-6" />
                      <span>LinkedIn</span>
                    </a>
                  )}

                  {club.twitter && (
                    <a
                      href={`https://twitter.com/${club.twitter}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-4 bg-blue-400 text-white rounded-lg hover:bg-blue-500 transition-all duration-300"
                    >
                      <Twitter className="w-6 h-6" />
                      <span>Twitter</span>
                    </a>
                  )}
                </div>

                <div className="mt-6 p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-2">
                    Want to join our community?
                  </p>
                  <button className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-2 rounded-lg hover:from-orange-600 hover:to-red-600 transition-all duration-300">
                    Join {club.name}
                  </button>
                </div>
              </div>
            </div>

            {/* Map Section */}
            {club.googleMapURL && (
              <div className="bg-white rounded-2xl p-8 shadow-sm border">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <MapPin className="w-6 h-6 text-orange-500" />
                  Find Us
                </h3>
                <div className="bg-gray-100 rounded-lg overflow-hidden">
                  <iframe
                    src={club.googleMapURL}
                    width="100%"
                    height="300"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title={`${club.name} Location`}
                  ></iframe>
                </div>
                {club.headquarters && (
                  <div className="mt-4 text-center">
                    <p className="text-gray-600 font-medium">
                      {club.headquarters}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

    </div>
  );
}
