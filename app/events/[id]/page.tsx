"use client";
import { Calendar, Users, Loader2, AlertCircle } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";

// Event type definition
interface Event {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  startDateTime: string;
  endDateTime?: string;
  venue?: string;
  category?: string;
  maxParticipants?: number;
  registeredCount?: number;
  club: {
    id: string;
    name: string;
    profileImage?: string;
  };
  registrations: { id: string }[];
  // These fields will be added from mock data since they may not be in the API response yet
  image?: string;
  date?: string; 
  time?: string;
  location?: string;
  participants?: number;
  volunteers?: Array<{name: string; photo: string}>;
  keyPoints?: string[];
  summary?: string;
}

// Reusable card list for committee/volunteers
function CardList({ data, roleColor, roleLabel }: { data: any[]; roleColor: string; roleLabel?: string }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      {data.map((person, i) => (
        <div key={i} className="relative flex flex-col items-center bg-orange-50 rounded-2xl p-5 shadow group hover:shadow-xl transition-all duration-200 border border-orange-100">
          <div className="relative mb-3">
            <img src={person.photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(person.name)}&background=FFEDD5&color=EA580C&size=128`} alt={person.name} className="w-20 h-20 rounded-full border-4 border-orange-200 object-cover shadow-lg group-hover:scale-105 transition-transform duration-200" />
            <span className={`absolute -bottom-2 left-1/2 -translate-x-1/2 ${roleColor} text-white text-xs font-bold px-3 py-1 rounded-full shadow border-2 border-white group-hover:brightness-110 transition-colors`}>
              {person.role || roleLabel}
            </span>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-orange-700 mb-1 group-hover:text-orange-900 transition-colors">{person.name}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function EventDetailPage() {
  const { id } = useParams();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State to store committee members
  const [committee, setCommittee] = useState<Array<{role: string; name: string; photo: string}>>([]);
  const [committeeLoading, setCommitteeLoading] = useState(false);

  // Fetch event data from API and enhance with mock data
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        
        const response = await fetch(`/api/events/${id}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Enhance the API response with additional mock data that isn't in the API yet
        const enhancedEvent = {
          ...data.event,
          image: `https://images.unsplash.com/photo-${1529156069898 + parseInt(data.event.id)}?w=800&h=400&fit=crop`,
          date: data.event.startDateTime, // Use the real start date time
          time: new Date(data.event.startDateTime).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
          }),
          location: data.event.venue || "Campus Main Hall",
          participants: data.event.registeredCount || 0,
          volunteers: [
            "John Doe", "Jane Smith", "Mike Johnson", "Sarah Wilson"
          ].map((name, idx) => ({
            name,
            photo: `https://randomuser.me/api/portraits/med/men/${10 + idx}.jpg`
          })),
          keyPoints: [
            "Welcome and introduction",
            "Club achievements review",
            "Upcoming projects planning",
            "Open discussion and Q&A"
          ],
          summary: "The event covered recent club achievements, planned upcoming projects, and provided a platform for open discussion among members and volunteers."
        };
        
        setEvent(enhancedEvent);
        
        // If we have a club ID, fetch the ExCom members
        if (data.event.club?.id) {
          fetchExcomMembers(data.event.club.id);
        }
      } catch (error) {
        console.error("Error fetching event:", error);
        setError("Failed to load event details. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    
    // Fetch ExCom members from the API
    const fetchExcomMembers = async (clubId: string) => {
      try {
        setCommitteeLoading(true);
        const response = await fetch(`/api/clubs/excom/${clubId}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.excomMembers && data.excomMembers.length > 0) {
          setCommittee(data.excomMembers);
        } else {
          // Use fallback mock data if no real data is available
          setCommittee([
            { role: "President", name: "A. Kumar", photo: "https://randomuser.me/api/portraits/men/11.jpg" },
            { role: "Vice President", name: "B. Silva", photo: "https://randomuser.me/api/portraits/women/22.jpg" },
            { role: "Treasurer", name: "C. Lee", photo: "https://randomuser.me/api/portraits/men/33.jpg" },
            { role: "Secretary", name: "D. Perera", photo: "https://randomuser.me/api/portraits/women/44.jpg" },
          ]);
        }
      } catch (error) {
        console.error("Error fetching ExCom members:", error);
        // Use fallback mock data if API fails
        setCommittee([
          { role: "President", name: "A. Kumar", photo: "https://randomuser.me/api/portraits/men/11.jpg" },
          { role: "Vice President", name: "B. Silva", photo: "https://randomuser.me/api/portraits/women/22.jpg" },
          { role: "Treasurer", name: "C. Lee", photo: "https://randomuser.me/api/portraits/men/33.jpg" },
          { role: "Secretary", name: "D. Perera", photo: "https://randomuser.me/api/portraits/women/44.jpg" },
        ]);
      } finally {
        setCommitteeLoading(false);
      }
    };
    
    if (id) {
      fetchEvent();
    }
  }, [id]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-orange-500 mx-auto mb-4" />
          <h2 className="text-xl font-medium text-gray-700">Loading event details...</h2>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-50 p-8 rounded-2xl max-w-lg mx-auto text-center border border-red-200">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-red-700 mb-2">Event Not Found</h2>
          <p className="text-red-600">{error || "The event you're looking for doesn't exist or has been removed."}</p>
          <a href="/events" className="mt-6 inline-block px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition-colors">
            Back to Events
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white pb-20">
      {/* Hero Banner */}
      <div className="relative w-full h-72 sm:h-96 mb-12">
        <img src={event.image} alt={event.title} className="w-full h-full object-cover object-center rounded-b-3xl shadow-lg" />
        <div className="absolute inset-0 bg-gradient-to-t from-orange-900/70 to-transparent rounded-b-3xl" />
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center z-10">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white drop-shadow-lg mb-2">{event.title}</h1>
          <div className="flex flex-wrap justify-center gap-3 mb-2">
            <span className="inline-block bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-semibold">{event.category}</span>
            <span className="inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">{event.club?.name}</span>
          </div>
          <div className="flex flex-wrap justify-center gap-4 text-orange-100 text-sm font-medium">
            <span className="inline-flex items-center gap-1">
              <Calendar className="w-5 h-5" /> 
              {event.date ? new Date(event.date).toLocaleDateString() : ""} {event.time || ""}
            </span>
            <span className="inline-flex items-center gap-1"><Users className="w-5 h-5" /> {event.participants || 0} Participants</span>
          </div>
        </div>
      </div>

      {/* Two-column layout */}
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Left: Club Committee & Volunteers */}
        <div className="flex flex-col gap-8">
          {/* Club Committee - Modern Card UI */}
          <div className="bg-white rounded-2xl shadow p-6 border border-orange-100">
            <h2 className="text-xl font-bold mb-6 text-orange-700 text-center">Club Committee</h2>
            {committeeLoading ? (
              <div className="flex justify-center items-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
                <span className="ml-2 text-gray-500">Loading committee members...</span>
              </div>
            ) : committee.length > 0 ? (
              <CardList data={committee} roleColor="bg-orange-500 group-hover:bg-orange-600" />
            ) : (
              <p className="text-center text-gray-500">No committee members found for this club.</p>
            )}
          </div>
          {/* Volunteers */}
          <div className="bg-white rounded-2xl shadow p-6 border border-orange-100">
            <h2 className="text-xl font-bold mb-6 text-orange-700 text-center">Event Volunteers</h2>
            {event.volunteers && event.volunteers.length > 0 ? (
              <CardList data={event.volunteers} roleColor="bg-green-500 group-hover:bg-green-600" roleLabel="Volunteer" />
            ) : (
              <p className="text-center text-gray-500">No volunteers assigned to this event yet.</p>
            )}
          </div>
          {/* Event Group Photo */}
          <div className="bg-white rounded-2xl shadow p-6 border border-orange-100">
            <h2 className="text-xl font-bold mb-6 text-orange-700 text-center">Event Memories</h2>
            <div className="space-y-4">
              <div className="relative overflow-hidden rounded-2xl shadow-lg">
                <img 
                  src={`https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&h=300&fit=crop`}
                  alt="Event group photo" 
                  className="w-full h-64 object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                  <p className="text-white text-sm font-medium">Participants together at {event.title}</p>
                </div>
              </div>
              <div className="text-center">
                <p className="text-gray-600 text-sm">
                  <span className="font-semibold text-orange-700">{event.participants || 0}</span> participants came together for this amazing event
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Event Info */}
        <div className="flex flex-col gap-8">
          {/* Event Info */}
          <div className="bg-white rounded-2xl shadow p-6 border border-orange-100">
            <h2 className="text-2xl font-bold mb-2 text-orange-700">{event.title}</h2>
            <div className="text-gray-500 text-sm mb-2">Organized by <span className="font-semibold text-orange-700">{event.club?.name}</span></div>
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="inline-block bg-orange-50 text-orange-700 px-3 py-1 rounded-full font-semibold text-xs">{event.category || "General"}</span>
              <span className="inline-block bg-green-50 text-green-700 px-3 py-1 rounded-full font-semibold text-xs">Max {event.maxParticipants || 50} Participants</span>
            </div>
            <div className="mb-2"><span className="font-semibold text-orange-700">Location:</span> <span className="text-gray-700">{event.location || event.venue || "Campus"}</span></div>
            <div className="mb-2"><span className="font-semibold text-orange-700">Purpose:</span> <span className="text-gray-700">{event.description}</span></div>
          </div>
          {/* Key Points */}
          <div className="bg-white rounded-2xl shadow p-6 border border-orange-100">
            <h2 className="text-xl font-bold mb-2 text-orange-700">Key Points Discussed</h2>
            <ul className="list-disc pl-6 text-gray-700 space-y-1">
              {event.keyPoints && event.keyPoints.map((point: string, i: number) => (
                <li key={i}>{point}</li>
              ))}
            </ul>
          </div>
          {/* Event Summary */}
          <div className="bg-white rounded-2xl shadow p-6 border border-orange-100">
            <h2 className="text-xl font-bold mb-2 text-orange-700">Event Summary</h2>
            <p className="text-gray-700 text-base">{event.summary || "Summary information will be available after the event is completed."}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
