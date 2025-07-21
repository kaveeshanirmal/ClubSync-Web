"use client";
import { Calendar, Users } from "lucide-react";
import React from "react";

// Import the upcoming events data from the club page
const upcomingEventsFromClub = [
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
];

type ClubEvent = {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  category: string;
  maxParticipants: number;
  registered: number;
  image: string;
  isOpen: boolean;
  club?: string;
  volunteers?: string[];
  participants?: number;
};

// Add past events and extend upcoming events with additional fields for backward compatibility
export const mockEvents: ClubEvent[] = [
  // Upcoming events from club tab
  ...upcomingEventsFromClub.map(event => ({
    ...event,
    club: "Rotaract Club of UCSC",
    volunteers: ["Priya Sharma", "Arjun Patel"],
    participants: event.registered
  })),
  // Past events
  {
    id: 5,
    title: "Annual Coding Marathon 2024",
    date: "2024-05-10",
    time: "8:00 AM",
    location: "UCSC Lab Complex",
    description: "A 12-hour coding challenge for students to solve real-world problems. Winners received tech gadgets and certificates.",
    category: "Technology",
    maxParticipants: 100,
    registered: 100,
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=300&h=200&fit=crop",
    isOpen: false,
    club: "Tech Innovators",
    volunteers: ["Priya Sharma", "Vikram Raj"],
    participants: 100
  },
  {
    id: 6,
    title: "Green Earth Tree Planting",
    date: "2024-03-15",
    time: "7:00 AM",
    location: "Viharamahadevi Park",
    description: "Volunteers planted over 500 trees to promote environmental awareness in Colombo.",
    category: "Environmental",
    maxParticipants: 60,
    registered: 60,
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=300&h=200&fit=crop",
    isOpen: false,
    club: "Eco Warriors",
    volunteers: ["Arjun Patel", "Meera Krishnan"],
    participants: 60
  },
  {
    id: 7,
    title: "Health Awareness Walkathon",
    date: "2024-01-20",
    time: "6:30 AM",
    location: "Independence Square",
    description: "A community walkathon to raise awareness about healthy living and fitness.",
    category: "Health & Wellness",
    maxParticipants: 200,
    registered: 180,
    image: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?w=300&h=200&fit=crop",
    isOpen: false,
    club: "Red Cross UCSC",
    volunteers: ["Priya Sharma", "Rahul Menon"],
    participants: 180
  },
];

function splitEvents(events: ClubEvent[]) {
  const now = new Date();
  const upcoming = events.filter((e: ClubEvent) => new Date(e.date) >= now);
  const past = events.filter((e: ClubEvent) => new Date(e.date) < now);
  // Sort upcoming soonest first, past most recent first
  upcoming.sort((a: ClubEvent, b: ClubEvent) => new Date(a.date).getTime() - new Date(b.date).getTime());
  past.sort((a: ClubEvent, b: ClubEvent) => new Date(b.date).getTime() - new Date(a.date).getTime());
  return { upcoming, past };
}

export default function EventsPage() {
  const { upcoming, past } = splitEvents(mockEvents);
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white pb-20">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-orange-400 to-red-400 py-16 px-4 sm:px-8 mb-16 rounded-b-3xl shadow-lg">
        {/* Hero background image */}
        <img
          src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=900&h=400&fit=crop"
          alt="Event background"
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full object-cover opacity-60 blur-sm pointer-events-none select-none z-0"
        />
        <div className="max-w-3xl mx-auto text-center relative z-10 mt-8">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-4 drop-shadow-lg">Discover Club Events</h1>
          <p className="text-lg sm:text-xl text-orange-100 mb-6">Stay up to date with all upcoming and past events from every club. Join, learn, and connect!</p>
        </div>
        <div className="absolute right-8 top-8 opacity-30 pointer-events-none select-none z-10">
          <Calendar className="w-32 h-32 text-white" />
        </div>
      </div>

      {/* Upcoming Events */}
      <section className="max-w-6xl mx-auto px-4 mb-16">
        <div className="flex items-center gap-3 mb-8">
          <span className="inline-block bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">Upcoming</span>
          <h2 className="text-3xl font-bold text-green-800 tracking-tight">Upcoming Events</h2>
        </div>
        {upcoming.length === 0 ? (
          <p className="text-gray-500">No upcoming events.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {upcoming.map((event: ClubEvent) => (
              <div key={event.id} className="group relative bg-white border border-green-200 rounded-2xl p-0 shadow-lg hover:shadow-2xl transition-all duration-200 flex flex-col overflow-hidden">
                <img src={event.image} alt={event.title} className="w-full h-48 object-cover rounded-t-2xl" />
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-orange-400 to-red-500 text-white`}>{event.category}</span>
                    {event.isOpen && (
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">Open for Registration</span>
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-green-700 transition-colors">{event.title}</h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-3">{event.description}</p>
                  <div className="flex flex-wrap gap-4 mb-4 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(event.date).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="font-mono">{event.time}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="font-mono">{event.location}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-auto">
                    <div className="text-xs text-gray-600">
                      <span className="font-medium text-orange-500">{event.registered}</span>/{event.maxParticipants} registered
                    </div>
                    <button className="ml-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg font-semibold text-xs shadow hover:from-orange-600 hover:to-red-600 transition-all duration-200">Register</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Past Events */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="flex items-center gap-3 mb-8">
          <span className="inline-block bg-gray-400 text-white text-xs font-bold px-3 py-1 rounded-full">Past</span>
          <h2 className="text-3xl font-bold text-gray-800 tracking-tight">Past Events</h2>
        </div>
        {past.length === 0 ? (
          <p className="text-gray-400">No past events.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {past.map((event: ClubEvent) => (
              <a key={event.id} href={`/events/${event.id}`} className="group block relative bg-white border border-gray-200 rounded-2xl p-0 shadow-lg hover:shadow-2xl transition-all duration-200 flex flex-col overflow-hidden cursor-pointer">
                <img src={event.image} alt={event.title} className="w-full h-48 object-cover rounded-t-2xl" />
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-orange-400 to-red-500 text-white`}>{event.category}</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-gray-700 transition-colors">{event.title}</h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-3">{event.description}</p>
                  <div className="flex flex-wrap gap-4 mb-4 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(event.date).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="font-mono">{event.time}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="font-mono">{event.location}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-end mt-auto">
                    <span className="inline-block bg-gray-50 text-gray-700 px-3 py-1 rounded-full text-xs font-semibold">Past</span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
