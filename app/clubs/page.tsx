"use client";
import { useState } from "react";
import Image from "next/image";
import {
  Calendar,
  MapPin,
  Users,
  Mail,
  Phone,
  Globe,
  Edit3,
  Save,
  Plus,
  Trash2,
  Star,
  Award,
  Clock,
  Camera,
  Settings,
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

export default function RotaractClubPage() {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [isAdmin, setIsAdmin] = useState(false); // Toggle this to test admin view
  const [hoveredMember, setHoveredMember] = useState<number | null>(null);

  // Club data state
  const [clubData, setClubData] = useState({
    name: "Rotaract Club of UCSC",
    tagline: "Service Above Self",
    description: "Rotaract Club of UCSC is a vibrant community of young professionals and students at the University of Colombo School of Computing, dedicated to creating positive change in Sri Lanka and beyond. We focus on community service, professional development, and international understanding through technology and innovation.",
    founded: "2018",
    meetingLocation: "UCSC Auditorium, Reid Avenue",
    memberCount: 38,
    projectsCompleted: 85,
    volunteersEngaged: 1200,
    contact: {
      email: "rotaract@ucsc.cmb.ac.lk",
      phone: "+94 11 2 158 158",
      website: "www.rotaractucsc.lk"
    },
    social: {
      instagram: "@rotaractucsc",
      facebook: "RotaractUCSC",
      linkedin: "rotaract-ucsc",
      twitter: "@rotaractucsc"
    }
  });

  const [excoMembers] = useState([
    {
      id: 1,
      name: "Priya Sharma",
      position: "President",
      bio: "Leading the club with passion for community service and technological innovation in Sri Lanka.",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
      email: "president@rotaractucsc.lk",
      phone: "+94 77 123 4567",
      joinDate: "2022"
    },
    {
      id: 2,
      name: "Arjun Patel",
      position: "Vice President",
      bio: "Focused on membership development and international service projects across South Asia.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      email: "vp@rotaractucsc.lk",
      phone: "+94 77 234 5678",
      joinDate: "2022"
    },
    {
      id: 3,
      name: "Meera Krishnan",
      position: "Secretary",
      bio: "Ensuring smooth operations and effective communication within the UCSC community.",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      email: "secretary@rotaractucsc.lk",
      phone: "+94 77 345 6789",
      joinDate: "2023"
    },
    {
      id: 4,
      name: "Vikram Raj",
      position: "Treasurer",
      bio: "Managing club finances and fundraising initiatives with transparency and innovation.",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      email: "treasurer@rotaractucsc.lk",
      phone: "+94 77 456 7890",
      joinDate: "2023"
    },
    {
      id: 5,
      name: "Ananya Gupta",
      position: "Community Service Director",
      bio: "Organizing impactful community service projects leveraging technology for social good.",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
      email: "community@rotaractucsc.lk",
      phone: "+94 77 567 8901",
      joinDate: "2023"
    },
    {
      id: 6,
      name: "Rahul Menon",
      position: "Professional Development Chair",
      bio: "Facilitating career growth and skill development opportunities in the tech industry.",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
      email: "professional@rotaractucsc.lk",
      phone: "+94 77 678 9012",
      joinDate: "2024"
    }
  ]);

  const [upcomingEvents, setUpcomingEvents] = useState([
    {
      id: 1,
      title: "Clean Colombo Initiative",
      date: "2025-07-20",
      time: "6:00 AM",
      location: "Galle Face Green, Colombo",
      description: "Join us for a coastal cleanup drive to make Colombo cleaner and greener. Volunteers will receive certificates and refreshments.",
      category: "Community Service",
      maxParticipants: 80,
      registered: 52,
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=200&fit=crop",
      isOpen: true
    },
    {
      id: 2,
      title: "Tech Career Workshop",
      date: "2025-07-25",
      time: "2:00 PM",
      location: "UCSC Main Auditorium",
      description: "Professional development workshop featuring Sri Lankan tech industry experts sharing insights on career growth and innovation opportunities.",
      category: "Professional Development",
      maxParticipants: 60,
      registered: 45,
      image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300&h=200&fit=crop",
      isOpen: true
    },
    {
      id: 3,
      title: "Blood Donation Camp",
      date: "2025-08-01",
      time: "9:00 AM",
      location: "National Hospital of Sri Lanka",
      description: "Annual blood donation camp in partnership with National Hospital. Every donation can save up to 3 lives in our community.",
      category: "Health & Wellness",
      maxParticipants: 150,
      registered: 89,
      image: "https://images.unsplash.com/photo-1615461066841-6116e61058f4?w=300&h=200&fit=crop",
      isOpen: true
    },
    {
      id: 4,
      title: "Youth Leadership Summit",
      date: "2025-08-10",
      time: "10:00 AM",
      location: "University of Colombo",
      description: "District-level summit bringing together young leaders from across Sri Lanka to discuss sustainable development goals and digital transformation.",
      category: "Leadership",
      maxParticipants: 200,
      registered: 127,
      image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=300&h=200&fit=crop",
      isOpen: true
    }
  ]);

  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  const addNewEvent = () => {
    const newEvent = {
      id: Date.now(),
      title: "New Event",
      date: new Date().toISOString().split('T')[0],
      time: "6:00 PM",
      location: "TBD",
      description: "Event description",
      category: "Community Service",
      maxParticipants: 50,
      registered: 0,
      image: "/api/placeholder/300/200",
      isOpen: true
    };
    setUpcomingEvents([...upcomingEvents, newEvent]);
  };

  const deleteEvent = (eventId: number) => {
    setUpcomingEvents(upcomingEvents.filter(event => event.id !== eventId));
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      "Community Service": "from-orange-400 to-red-500",
      "Professional Development": "from-orange-500 to-yellow-500", 
      "Health & Wellness": "from-red-500 to-orange-600",
      "Leadership": "from-orange-600 to-amber-500",
      "Environmental": "from-amber-500 to-orange-400"
    };
    return colors[category] || "from-orange-500 to-red-500";
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 pt-16">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-l from-orange-500 to-red-500 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1200&h=600&fit=crop')] bg-cover bg-center opacity-30"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-16">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                  <Zap className="w-10 h-10 text-white" />
                </div>
                <div>
                  {isEditing ? (
                    <input
                      type="text"
                      value={clubData.name}
                      onChange={(e) => setClubData({...clubData, name: e.target.value})}
                      className="text-4xl font-bold bg-transparent border-b border-white/50 focus:border-white outline-none"
                    />
                  ) : (
                    <h1 className="text-4xl lg:text-5xl font-bold mb-2">{clubData.name}</h1>
                  )}
                  {isEditing ? (
                    <input
                      type="text"
                      value={clubData.tagline}
                      onChange={(e) => setClubData({...clubData, tagline: e.target.value})}
                      className="text-xl bg-transparent border-b border-white/50 focus:border-white outline-none"
                    />
                  ) : (
                    <p className="text-xl opacity-90">{clubData.tagline}</p>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
                  <Users className="w-8 h-8 mx-auto mb-2" />
                  <div className="text-2xl font-bold">{clubData.memberCount}</div>
                  <div className="text-sm opacity-80">Active Members</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
                  <Award className="w-8 h-8 mx-auto mb-2" />
                  <div className="text-2xl font-bold">{clubData.projectsCompleted}</div>
                  <div className="text-sm opacity-80">Projects Completed</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
                  <Heart className="w-8 h-8 mx-auto mb-2" />
                  <div className="text-2xl font-bold">{clubData.volunteersEngaged}</div>
                  <div className="text-sm opacity-80">Volunteers Engaged</div>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
                  <Calendar className="w-5 h-5" />
                  <span>Founded {clubData.founded}</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
                  <MapPin className="w-5 h-5" />
                  <span>{clubData.meetingLocation}</span>
                </div>
              </div>
            </div>
            
            <div className="flex-shrink-0">
              <div className="relative">
                <Image
                  src="https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=300&h=300&fit=crop&crop=center" 
                  alt="Club Logo" 
                  width={192}
                  height={192}
                  className="w-48 h-48 rounded-full border-4 border-white/20 shadow-2xl object-cover"
                />
                {isAdmin && (
                  <button 
                    onClick={toggleEdit}
                    className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm rounded-full p-2 hover:bg-white/30 transition-colors"
                  >
                    {isEditing ? <Save className="w-5 h-5" /> : <Edit3 className="w-5 h-5" />}
                  </button>
                )}
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
              { id: 'overview', label: 'Overview', icon: Target },
              { id: 'exco', label: 'Executive Committee', icon: Users },
              { id: 'events', label: 'Upcoming Events', icon: Calendar },
              { id: 'contact', label: 'Contact & Social', icon: Mail }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center gap-2 py-4 px-2 border-b-2 font-medium transition-colors ${
                  activeTab === id
                    ? 'border-orange-500 text-orange-500'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
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
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div className="bg-white rounded-2xl p-8 shadow-sm border">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">About Our Club</h2>
                {isAdmin && (
                  <button
                    onClick={toggleEdit}
                    className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-lg hover:from-orange-600 hover:to-red-600 transition-all duration-300"
                  >
                    <Edit3 className="w-4 h-4" />
                    {isEditing ? 'Save Changes' : 'Edit Description'}
                  </button>
                )}
              </div>
              
              {isEditing ? (
                <textarea
                  value={clubData.description}
                  onChange={(e) => setClubData({...clubData, description: e.target.value})}
                  className="w-full h-32 p-4 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                  placeholder="Club description..."
                />
              ) : (
                <p className="text-gray-600 leading-relaxed text-lg">{clubData.description}</p>
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white rounded-2xl p-8 shadow-sm border">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <Target className="w-6 h-6 text-orange-500" />
                  Our Mission
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  To provide opportunities for young people in Sri Lanka to enhance their leadership and professional skills, 
                  to address the physical and social needs of their communities through technology and innovation, and to promote better relations 
                  between all people worldwide through a framework of friendship and service.
                </p>
              </div>
              
              <div className="bg-white rounded-2xl p-8 shadow-sm border">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <Shield className="w-6 h-6 text-orange-500" />
                  Our Values
                </h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-center gap-2">
                    <ChevronRight className="w-4 h-4 text-orange-500" />
                    Service Above Self
                  </li>
                  <li className="flex items-center gap-2">
                    <ChevronRight className="w-4 h-4 text-orange-500" />
                    Innovation & Technology
                  </li>
                  <li className="flex items-center gap-2">
                    <ChevronRight className="w-4 h-4 text-orange-500" />
                    Community Development
                  </li>
                  <li className="flex items-center gap-2">
                    <ChevronRight className="w-4 h-4 text-orange-500" />
                    Cultural Unity
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Executive Committee Tab */}
        {activeTab === 'exco' && (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-bold text-gray-900">Executive Committee</h2>
              {isAdmin && (
                <button className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-lg hover:from-orange-600 hover:to-red-600 transition-all duration-300">
                  <Plus className="w-4 h-4" />
                  Add Member
                </button>
              )}
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {excoMembers.map((member) => (
                <div
                  key={member.id}
                  className="bg-white rounded-2xl p-6 shadow-sm border hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                  onMouseEnter={() => setHoveredMember(member.id)}
                  onMouseLeave={() => setHoveredMember(null)}
                >
                  <div className="relative mb-4">
                    <Image
                      src={member.image}
                      alt={member.name}
                      width={96}
                      height={96}
                      className="w-24 h-24 rounded-full mx-auto border-4 border-orange-100"
                    />
                    {hoveredMember === member.id && isAdmin && (
                      <button className="absolute top-0 right-0 bg-orange-500 text-white p-2 rounded-full hover:bg-orange-600 transition-colors">
                        <Camera className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  
                  <div className="text-center">
                    <h3 className="text-lg font-bold text-gray-900 mb-1">{member.name}</h3>
                    <p className="text-orange-600 font-semibold mb-3">{member.position}</p>
                    <p className="text-gray-600 text-sm mb-4">{member.bio}</p>
                    
                    <div className="flex justify-center gap-2">
                      <button className="p-2 bg-orange-100 text-orange-500 rounded-lg hover:bg-orange-200 transition-colors">
                        <Mail className="w-4 h-4" />
                      </button>
                      <button className="p-2 bg-orange-100 text-orange-500 rounded-lg hover:bg-orange-200 transition-colors">
                        <Phone className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <div className="mt-4 text-xs text-gray-500">
                      Member since {member.joinDate}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Events Tab */}
        {activeTab === 'events' && (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-bold text-gray-900">Upcoming Events</h2>
              {isAdmin && (
                <button
                  onClick={addNewEvent}
                  className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-lg hover:from-orange-600 hover:to-red-600 transition-all duration-300"
                >
                  <Plus className="w-4 h-4" />
                  Add Event
                </button>
              )}
            </div>
            
            <div className="grid gap-6">
              {upcomingEvents.map((event) => (
                <div
                  key={event.id}
                  className="bg-white rounded-2xl shadow-sm border overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="md:flex">
                    <div className="md:w-1/3">
                      <Image
                        src={event.image}
                        alt={event.title}
                        width={300}
                        height={200}
                        className="w-full h-48 md:h-full object-cover"
                      />
                    </div>
                    <div className="md:w-2/3 p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${getCategoryColor(event.category)} text-white`}>
                              {event.category}
                            </span>
                            {event.isOpen && (
                              <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                                Open for Registration
                              </span>
                            )}
                          </div>
                          <h3 className="text-xl font-bold text-gray-900 mb-2">{event.title}</h3>
                          <p className="text-gray-600 mb-4">{event.description}</p>
                        </div>
                        {isAdmin && (
                          <div className="flex gap-2">
                            <button className="p-2 text-gray-400 hover:text-orange-500 transition-colors">
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => deleteEvent(event.id)}
                              className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex flex-wrap gap-4 mb-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {formatDate(event.date)}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {event.time}
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {event.location}
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="text-sm text-gray-600">
                            <span className="font-medium text-orange-500">{event.registered}</span>
                            /{event.maxParticipants} registered
                          </div>
                          <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-orange-500 to-red-500 transition-all duration-300"
                              style={{ width: `${(event.registered / event.maxParticipants) * 100}%` }}
                            />
                          </div>
                        </div>
                        <button className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-2 rounded-lg hover:from-orange-600 hover:to-red-600 transition-all duration-300">
                          Register Now
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Contact Tab */}
        {activeTab === 'contact' && (
          <div className="space-y-8">
            <h2 className="text-3xl font-bold text-gray-900">Contact & Social Media</h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white rounded-2xl p-8 shadow-sm border">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <Mail className="w-6 h-6 text-orange-500" />
                  Contact Information
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                      <Mail className="w-5 h-5 text-orange-500" />
                    </div>
                    <div>
                      <p className="font-medium">Email</p>
                      <p className="text-gray-600">{clubData.contact.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                      <Phone className="w-5 h-5 text-orange-500" />
                    </div>
                    <div>
                      <p className="font-medium">Phone</p>
                      <p className="text-gray-600">{clubData.contact.phone}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                      <Globe className="w-5 h-5 text-orange-500" />
                    </div>
                    <div>
                      <p className="font-medium">Website</p>
                      <p className="text-gray-600">{clubData.contact.website}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-orange-500" />
                    </div>
                    <div>
                      <p className="font-medium">Meeting Location</p>
                      <p className="text-gray-600">{clubData.meetingLocation}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-2xl p-8 shadow-sm border">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <Star className="w-6 h-6 text-orange-500" />
                  Follow Us
                </h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <a
                    href={`https://instagram.com/${clubData.social.instagram}`}
                    className="flex items-center gap-3 p-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300"
                  >
                    <Instagram className="w-6 h-6" />
                    <span>Instagram</span>
                  </a>
                  
                  <a
                    href={`https://facebook.com/${clubData.social.facebook}`}
                    className="flex items-center gap-3 p-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300"
                  >
                    <Facebook className="w-6 h-6" />
                    <span>Facebook</span>
                  </a>
                  
                  <a
                    href={`https://linkedin.com/company/${clubData.social.linkedin}`}
                    className="flex items-center gap-3 p-4 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-all duration-300"
                  >
                    <Linkedin className="w-6 h-6" />
                    <span>LinkedIn</span>
                  </a>
                  
                  <a
                    href={`https://twitter.com/${clubData.social.twitter}`}
                    className="flex items-center gap-3 p-4 bg-blue-400 text-white rounded-lg hover:bg-blue-500 transition-all duration-300"
                  >
                    <Twitter className="w-6 h-6" />
                    <span>Twitter</span>
                  </a>
                </div>
                
                <div className="mt-6 p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-2">Want to join our community?</p>
                  <button className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-2 rounded-lg hover:from-orange-600 hover:to-red-600 transition-all duration-300">
                    Join Rotaract UCSC
                  </button>
                </div>
              </div>
            </div>
            
            {/* Map Section */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <MapPin className="w-6 h-6 text-orange-500" />
                Find Us
              </h3>
              <div className="bg-gray-100 rounded-lg overflow-hidden">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3960.798473427587!2d79.85395661477326!3d6.914776495034298!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae25963120b1509%3A0x2db2c18a68712863!2sUniversity%20of%20Colombo%20School%20of%20Computing!5e0!3m2!1sen!2slk!4v1642681234567!5m2!1sen!2slk"
                  width="100%"
                  height="300"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="UCSC Location"
                ></iframe>
              </div>
              <div className="mt-4 text-center">
                <p className="text-gray-600 font-medium">{clubData.meetingLocation}</p>
                <p className="text-sm text-gray-500 mt-1">University of Colombo School of Computing, Reid Avenue, Colombo 00700</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Admin Toggle for Demo */}
      <div className="fixed bottom-6 right-6 z-30">
        <button
          onClick={() => setIsAdmin(!isAdmin)}
          className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
            isAdmin 
              ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white hover:from-red-600 hover:to-orange-600' 
              : 'bg-gray-500 text-white hover:bg-gray-600'
          }`}
        >
          {isAdmin ? 'Admin View' : 'Member View'}
        </button>
      </div>

      {/* Floating Action Button for Quick Actions */}
      {isAdmin && (
        <div className="fixed bottom-20 right-6 z-30">
          <div className="bg-white rounded-full shadow-lg border">
            <button className="w-14 h-14 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full flex items-center justify-center hover:from-orange-600 hover:to-red-600 transition-all duration-300 shadow-lg">
              <Settings className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}