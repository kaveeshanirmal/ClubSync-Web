"use client";
import { useState, useEffect, use } from "react";
import Image from "next/image";
import BeautifulLoader from "../../../components/Loader"; // Adjust the path to your Loader component
import {
  Calendar,
  MapPin,
  Users,
  Clock,
  Share2,
  BookmarkPlus,
  ArrowLeft,
  Mail,
  Tag,
  Heart,
  CalendarDays,
  Info,
  Star,
} from "lucide-react";

interface Event {
  id: string;
  title: string;
  description?: string;
  longDescription?: string;
  date: string; // Will be ISO string from API
  time: string;
  endTime?: string;
  location?: string;
  venue?: string;
  address?: string;
  coverImage?: string;
  category?: string;
  maxCapacity?: number;
  registeredCount?: number;
  isPaid: boolean;
  price?: number;
  organizer: {
    id: string;
    name: string;
    type: "club" | "organization";
    image?: string;
    contact?: {
      email?: string;
      phone?: string;
      website?: string;
    };
  };
  tags?: string[];
  requirements?: string[];
  benefits?: string[];
  agenda?: Array<{
    time: string;
    activity: string;
    description?: string;
  }>;
  speakers?: Array<{
    name: string;
    title: string;
    bio?: string;
    image?: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

export default function EventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    const fetchEvent = async () => {
      if (!resolvedParams.id) {
        setError("Event ID is missing.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/events/${resolvedParams.id}`);

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || `Error: ${response.status}`);
        }

        const data = await response.json();
        setEvent(data.event);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [resolvedParams.id]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (timeString: string) => {
    return new Date(`1970-01-01T${timeString}`).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    // TODO: Implement API call to bookmark/unbookmark
  };

  const handleShare = () => {
    if (navigator.share && event) {
      navigator
        .share({
          title: event.title,
          text: event.description,
          url: window.location.href,
        })
        .catch(console.error);
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Event URL copied to clipboard!"); // Replace with a toast notification
    }
  };

  if (loading) {
    return (
      <BeautifulLoader
        message="Loading Event Details"
        subMessage="Getting the latest information"
        type="morphing"
      />
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-orange-50/30 pt-16 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Heart className="h-10 w-10 text-red-500" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-4">
            Oops! Something went wrong
          </h3>
          <p className="text-red-600 text-lg mb-6">
            {error || "Event not found"}
          </p>
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

  const registrationPercentage = event.maxCapacity
    ? Math.round(((event.registeredCount || 0) / event.maxCapacity) * 100)
    : 0;

  // Category-specific fallback images (same as events list page)
  const categoryImages: { [key: string]: string } = {
    'workshop': 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&h=800&fit=crop',
    'seminar': 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&h=800&fit=crop',
    'conference': 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=1200&h=800&fit=crop',
    'lecture': 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=1200&h=800&fit=crop',
    'training': 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=1200&h=800&fit=crop',
    'party': 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1200&h=800&fit=crop',
    'celebration': 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=1200&h=800&fit=crop',
    'concert': 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=1200&h=800&fit=crop',
    'music': 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=1200&h=800&fit=crop',
    'festival': 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=1200&h=800&fit=crop',
    'sports': 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=1200&h=800&fit=crop',
    'fitness': 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200&h=800&fit=crop',
    'tournament': 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=1200&h=800&fit=crop',
    'meeting': 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=1200&h=800&fit=crop',
    'networking': 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=1200&h=800&fit=crop',
    'business': 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=1200&h=800&fit=crop',
    'art': 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=1200&h=800&fit=crop',
    'exhibition': 'https://images.unsplash.com/photo-1531243269054-5ebf6f34081e?w=1200&h=800&fit=crop',
    'performance': 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=1200&h=800&fit=crop',
    'technology': 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200&h=800&fit=crop',
    'competition': 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1200&h=800&fit=crop',
    'social': 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=1200&h=800&fit=crop',
    'volunteer': 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=1200&h=800&fit=crop',
    'charity': 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=1200&h=800&fit=crop',
    'default': 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1200&h=800&fit=crop',
  };

  const normalizedCategory = event.category?.toLowerCase().replace(/\s+/g, '-') || 'default';
  const backgroundImage = event.coverImage || categoryImages[normalizedCategory] || categoryImages['default'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-orange-50/30 pt-16">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-l from-orange-500 to-red-500 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        ></div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
          <div className="flex flex-col lg:flex-row items-start justify-between gap-8">
            <div className="flex-1">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center flex-shrink-0">
                  <CalendarDays className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    {event.category && (
                      <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-medium">
                        {event.category}
                      </span>
                    )}
                    {event.isPaid ? (
                      <span className="px-3 py-1 bg-yellow-500/80 backdrop-blur-sm rounded-full text-xs font-medium">
                        ${event.price}
                      </span>
                    ) : (
                      <span className="px-3 py-1 bg-green-500/80 backdrop-blur-sm rounded-full text-xs font-medium">
                        Free
                      </span>
                    )}
                  </div>
                  <h1 className="text-3xl lg:text-4xl font-bold mb-3 leading-tight">
                    {event.title}
                  </h1>
                  <p className="text-lg opacity-90 leading-relaxed">
                    {event.description}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                  <Calendar className="w-5 h-5 mb-1" />
                  <div className="text-xs opacity-80 mb-1">Date</div>
                  <div className="font-semibold text-sm">{formatDate(event.date)}</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                  <Clock className="w-5 h-5 mb-1" />
                  <div className="text-xs opacity-80 mb-1">Time</div>
                  <div className="font-semibold text-sm">
                    {formatTime(event.time)}
                    {event.endTime && ` - ${formatTime(event.endTime)}`}
                  </div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                  <MapPin className="w-5 h-5 mb-1" />
                  <div className="text-xs opacity-80 mb-1">Location</div>
                  <div className="font-semibold text-sm">{event.location}</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                  <Users className="w-5 h-5 mb-1" />
                  <div className="text-xs opacity-80 mb-1">Capacity</div>
                  <div className="font-semibold text-sm">
                    {event.registeredCount || 0} /{" "}
                    {event.maxCapacity || "Unlimited"}
                  </div>
                </div>
              </div>

              {event.maxCapacity && (
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">
                      Registration Progress
                    </span>
                    <span className="text-sm">
                      {registrationPercentage}% Full
                    </span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-green-400 to-orange-400 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${registrationPercentage}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex-shrink-0 w-full lg:w-auto">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 space-y-3">
                {/* Mobile App Registration Notice */}
                <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-xl p-4 text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17 19H7V5h10m0-2H7c-1.11 0-2 .89-2 2v14c0 1.11.89 2 2 2h10c1.11 0 2-.89 2-2V5c0-1.11-.89-2-2-2z"/>
                    </svg>
                    <h3 className="text-sm font-bold">Register via Mobile App</h3>
                  </div>
                  <p className="text-xs opacity-90">
                    Download ClubSync app to register for this event
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleBookmark}
                    className={`flex-1 px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
                      isBookmarked
                        ? "bg-yellow-500/80 text-white"
                        : "bg-white/20 text-white hover:bg-white/30"
                    }`}
                  >
                    <BookmarkPlus className="w-5 h-5 mx-auto" />
                  </button>
                  <button
                    onClick={handleShare}
                    className="flex-1 px-4 py-3 rounded-xl font-medium bg-white/20 text-white hover:bg-white/30 transition-all duration-300"
                  >
                    <Share2 className="w-5 h-5 mx-auto" />
                  </button>
                </div>

                {/* Organizer Info */}
                <div className="border-t border-white/20 pt-4">
                  <div className="flex items-center gap-3">
                    {event.organizer.image && (
                      <Image
                        src={event.organizer.image}
                        alt={event.organizer.name}
                        width={48}
                        height={48}
                        className="rounded-full"
                      />
                    )}
                    <div>
                      <div className="font-semibold">
                        {event.organizer.name}
                      </div>
                      <div className="text-sm opacity-80">Event Organizer</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white shadow-sm border-b sticky top-16 z-20 -mt-1">
        <div className="max-w-7xl mx-auto px-6">
          <nav className="flex space-x-8 overflow-x-auto">
            {[
              { id: "overview", label: "Overview", icon: Info },
              { id: "agenda", label: "Agenda", icon: Clock },
              { id: "speakers", label: "Speakers", icon: Users },
              { id: "details", label: "Details", icon: Tag },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center gap-2 py-4 px-2 border-b-2 font-medium transition-colors whitespace-nowrap ${
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
        {activeTab === "overview" && (
          <div className="space-y-8">
            <div className="bg-white rounded-2xl p-8 shadow-sm border">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                About This Event
              </h2>
              <p className="text-gray-600 leading-relaxed text-lg">
                {event.longDescription || event.description}
              </p>
            </div>

            {event.benefits && event.benefits.length > 0 && (
              <div className="bg-white rounded-2xl p-8 shadow-sm border">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <Star className="w-6 h-6 text-yellow-500" />
                  What You&apos;ll Get
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {event.benefits.map((benefit, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      <span className="text-gray-600">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {event.requirements && event.requirements.length > 0 && (
              <div className="bg-white rounded-2xl p-8 shadow-sm border">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <Info className="w-6 h-6 text-orange-500" />
                  Requirements
                </h3>
                <div className="space-y-3">
                  {event.requirements.map((requirement, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <span className="text-gray-600">{requirement}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "agenda" && event.agenda && event.agenda.length > 0 && (
          <div className="bg-white rounded-2xl p-8 shadow-sm border">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">
              Event Agenda
            </h2>
            <div className="space-y-6">
              {event.agenda.map((item, index) => (
                <div
                  key={index}
                  className="flex gap-6 pb-6 border-b border-gray-100 last:border-b-0"
                >
                  <div className="flex-shrink-0 w-32">
                    <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-2 rounded-lg text-sm font-medium text-center">
                      {item.time}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900 mb-2">
                      {item.activity}
                    </h4>
                    <p className="text-gray-600">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "speakers" &&
          event.speakers &&
          event.speakers.length > 0 && (
            <div className="bg-white rounded-2xl p-8 shadow-sm border">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">
                Featured Speakers
              </h2>
              <div className="grid md:grid-cols-2 gap-8">
                {event.speakers.map((speaker, index) => (
                  <div key={index} className="flex gap-4">
                    {speaker.image && (
                      <Image
                        src={speaker.image}
                        alt={speaker.name}
                        width={80}
                        height={80}
                        className="rounded-full flex-shrink-0"
                      />
                    )}
                    <div>
                      <h4 className="font-bold text-gray-900 mb-1">
                        {speaker.name}
                      </h4>
                      <p className="text-orange-600 font-medium mb-2">
                        {speaker.title}
                      </p>
                      <p className="text-gray-600 text-sm">{speaker.bio}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        {activeTab === "details" && (
          <div className="space-y-8">
            <div className="bg-white rounded-2xl p-8 shadow-sm border">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Event Details
              </h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      Date & Time
                    </h4>
                    <p className="text-gray-600">{formatDate(event.date)}</p>
                    <p className="text-gray-600">
                      {formatTime(event.time)}
                      {event.endTime && ` - ${formatTime(event.endTime)}`}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      Location
                    </h4>
                    <p className="text-gray-600">{event.venue}</p>
                    <p className="text-gray-600">{event.location}</p>
                    {event.address && (
                      <p className="text-gray-600">{event.address}</p>
                    )}
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      Registration
                    </h4>
                    <p className="text-gray-600">
                      {event.registeredCount || 0} registered out of{" "}
                      {event.maxCapacity || "unlimited"} spots
                    </p>
                    <p className="text-gray-600">
                      {event.isPaid
                        ? `$${event.price} per person`
                        : "Free event"}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      Organizer
                    </h4>
                    <p className="text-gray-600">{event.organizer.name}</p>
                    {event.organizer.contact?.email && (
                      <a
                        href={`mailto:${event.organizer.contact.email}`}
                        className="text-orange-600 hover:text-orange-700 flex items-center gap-2"
                      >
                        <Mail className="w-4 h-4" />
                        {event.organizer.contact.email}
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {event.tags && event.tags.length > 0 && (
              <div className="bg-white rounded-2xl p-8 shadow-sm border">
                <h3 className="text-xl font-bold mb-6">Tags</h3>
                <div className="flex flex-wrap gap-3">
                  {event.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 bg-gradient-to-r from-orange-100 to-red-100 text-orange-700 rounded-full text-sm font-medium border border-orange-200/50"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
