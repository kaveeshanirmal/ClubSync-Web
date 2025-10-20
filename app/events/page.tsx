"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import BeautifulLoader from "../../components/Loader";
import {
  Calendar,
  Search,
  MapPin,
  ChevronRight,
  Clock,
  Users,
  Heart,
  Grid3x3,
  LayoutList,
} from "lucide-react";

interface Event {
  id: string;
  title: string;
  description?: string;
  date: string;
  time: string;
  location?: string;
  venue?: string;
  coverImage?: string;
  category?: string;
  maxCapacity?: number;
  registeredCount?: number;
  isActive: boolean;
  isPaid: boolean;
  price?: number;
  organizer: {
    id: string;
    name: string;
    type: "club" | "organization";
  };
  createdAt: string;
  updatedAt: string;
}

// Category-specific Unsplash image IDs (curated, high-quality images)
const categoryImages: { [key: string]: string } = {
  // Academic & Educational
  'workshop': 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop',
  'seminar': 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop',
  'conference': 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800&h=600&fit=crop',
  'lecture': 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=800&h=600&fit=crop',
  'training': 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&h=600&fit=crop',
  
  // Social & Entertainment
  'party': 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&h=600&fit=crop',
  'celebration': 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800&h=600&fit=crop',
  'concert': 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800&h=600&fit=crop',
  'music': 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&h=600&fit=crop',
  'festival': 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&h=600&fit=crop',
  
  // Sports & Fitness
  'sports': 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&h=600&fit=crop',
  'fitness': 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=600&fit=crop',
  'tournament': 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800&h=600&fit=crop',
  
  // Professional & Business
  'meeting': 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&h=600&fit=crop',
  'networking': 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=800&h=600&fit=crop',
  'business': 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&h=600&fit=crop',
  
  // Creative & Arts
  'art': 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800&h=600&fit=crop',
  'exhibition': 'https://images.unsplash.com/photo-1531243269054-5ebf6f34081e?w=800&h=600&fit=crop',
  'performance': 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=800&h=600&fit=crop',
  
  // Technology
  'technology': 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&h=600&fit=crop',
  'competition': 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&h=600&fit=crop',
  
  // Community & Social
  'social': 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&h=600&fit=crop',
  'volunteer': 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800&h=600&fit=crop',
  'charity': 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&h=600&fit=crop',
  
  // Default
  'default': 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&h=600&fit=crop',
};

// Function to get event image
const getEventImage = (event: Event): string => {
  if (event.coverImage) {
    return event.coverImage;
  }
  
  // Normalize category to lowercase and remove spaces
  const normalizedCategory = event.category?.toLowerCase().replace(/\s+/g, '-') || 'default';
  
  // Return category-specific image or default
  return categoryImages[normalizedCategory] || categoryImages['default'];
};

export default function EventsPage() {
  const [, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const eventsPerPage = 12;

  // Function to fetch categories
  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/events/categories");
      if (response.ok) {
        const data = await response.json();
        setCategories(data.categories || []);
      }
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  // Function to fetch events with filters
  const fetchEvents = async (search = "", category = "") => {
    try {
      setLoading(true);

      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (category) params.append("category", category);

      const response = await fetch(`/api/events/all?${params.toString()}`);

      if (!response.ok) {
        throw new Error("Failed to fetch events");
      }

      const data = await response.json();
      setEvents(data.events || []);
      setFilteredEvents(data.events || []);
    } catch (err) {
      console.error("Error fetching events:", err);
      setError(err instanceof Error ? err.message : "Failed to load events");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
    fetchCategories();
  }, []);

  // Debounced search effect
  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      fetchEvents(searchTerm, filterCategory);
      setCurrentPage(1);
    }, 300);

    return () => clearTimeout(delayedSearch);
  }, [searchTerm, filterCategory]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Calculate pagination
  const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);
  const startIndex = (currentPage - 1) * eventsPerPage;
  const endIndex = startIndex + eventsPerPage;
  const currentEvents = filteredEvents.slice(startIndex, endIndex);

  if (loading) {
    return (
      <BeautifulLoader
        message="Discovering Amazing Events"
        subMessage="Loading experiences that inspire"
        type="morphing"
      />
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-orange-50/30 pt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center max-w-md">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="h-10 w-10 text-red-500" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                Oops! Something went wrong
              </h3>
              <p className="text-red-600 text-lg mb-6">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="bg-gradient-to-r from-orange-400 to-red-400 text-white px-8 py-3 rounded-full hover:from-orange-500 hover:to-red-500 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-orange-50/30 to-red-50">
      {/* Simplified Hero Section */}
      <div className="relative bg-gradient-to-r from-orange-500 to-red-500 text-white overflow-hidden">
        {/* Subtle Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 container mx-auto px-4 py-24">
          <div className="max-w-4xl mx-auto text-center">
            {/* Main Heading */}
            <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
              Discover Amazing Events
            </h1>
          </div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
            <path d="M0,32 C320,96 420,0 720,32 C1020,64 1120,0 1440,32 L1440,100 L0,100 Z" fill="rgb(255, 247, 237)" />
          </svg>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 -mt-8 relative z-20">
        {/* Compact Search and Filter Section */}
        <div className="max-w-7xl mx-auto mb-8">
          {/* Search Bar */}
          <div className="relative mb-4">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all text-gray-700 placeholder-gray-400 shadow-sm"
            />
          </div>

          {/* Controls Bar */}
          <div className="flex items-center justify-between gap-4">
            {/* Left: Count and Filter */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-orange-100 rounded-lg px-3 py-1.5">
                <Calendar className="h-4 w-4 text-orange-600" />
                <span className="font-semibold text-orange-700 text-sm">
                  {filteredEvents.length} {filteredEvents.length === 1 ? 'event' : 'events'}
                </span>
              </div>

              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="appearance-none bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg px-3 py-1.5 pr-8 text-sm font-medium text-gray-700 hover:border-gray-300 focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all cursor-pointer"
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>

              {(searchTerm || filterCategory) && (
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setFilterCategory("");
                  }}
                  className="text-xs text-gray-500 hover:text-orange-600 transition-colors underline"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Right: View Toggle */}
            <div className="flex bg-gray-100 rounded-lg p-0.5">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-all ${
                  viewMode === 'grid' 
                    ? 'bg-white shadow-sm text-orange-600' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                title="Grid view"
              >
                <Grid3x3 className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition-all ${
                  viewMode === 'list' 
                    ? 'bg-white shadow-sm text-orange-600' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                title="List view"
              >
                <LayoutList className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Events Grid */}
        {filteredEvents.length === 0 ? (
          <div className="text-center py-16">
            <div className="max-w-sm mx-auto">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-200 to-red-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="h-8 w-8 text-gray-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-700 mb-2">
                {searchTerm || filterCategory
                  ? "No events found"
                  : "No events available"}
              </h3>
              <p className="text-gray-500 text-sm">
                {searchTerm || filterCategory
                  ? "Try adjusting your search"
                  : "Check back soon for new events!"}
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Grid View */}
            {viewMode === 'grid' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {currentEvents.map((event, index) => (
                  <Link
                    key={event.id}
                    href={`/events/${event.id}`}
                    className="group block"
                    style={{ 
                      animation: 'fadeInUp 0.6s ease-out',
                      animationDelay: `${index * 50}ms`,
                      animationFillMode: 'both'
                    }}
                  >
                    <div className="relative bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border border-gray-200 hover:border-orange-300 h-full flex flex-col">
                      
                      {/* Event Image */}
                      <div className="relative h-48 overflow-hidden">
                        <Image
                          src={getEventImage(event)}
                          alt={event.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                        />
                        
                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                        
                        {/* Date Badge on Image */}
                        <div className="absolute top-3 left-3">
                          <div className="flex items-center gap-1.5 bg-white/95 backdrop-blur-sm text-orange-700 rounded-lg px-2.5 py-1.5 shadow-lg">
                            <Calendar className="h-3 w-3" />
                            <span className="text-xs font-bold">
                              {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </span>
                          </div>
                        </div>
                        
                        {/* Price Badge on Image */}
                        <div className="absolute top-3 right-3">
                          {event.isPaid ? (
                            <div className="bg-yellow-400/95 backdrop-blur-sm text-yellow-900 px-2.5 py-1 rounded-lg font-bold text-xs shadow-lg">
                              ${event.price}
                            </div>
                          ) : (
                            <div className="bg-emerald-400/95 backdrop-blur-sm text-emerald-900 px-2.5 py-1 rounded-lg font-bold text-xs shadow-lg">
                              FREE
                            </div>
                          )}
                        </div>
                        
                        {/* Participants Badge - Creative Bottom Left */}
                        <div className="absolute bottom-3 left-3">
                          <div className="flex items-center gap-1.5 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg px-2.5 py-1.5 shadow-lg backdrop-blur-sm">
                            <Users className="h-3 w-3" />
                            <span className="text-xs font-bold">
                              {event.registeredCount || 0}
                              {event.maxCapacity && `/${event.maxCapacity}`}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Top Accent Line */}
                      <div className="h-1 bg-gradient-to-r from-orange-400 to-red-400"></div>
                      
                      {/* Main Content */}
                      <div className="p-3 flex-1 flex flex-col">
                        {/* Event Title */}
                        <h3 className="text-base font-bold text-gray-900 mb-2 line-clamp-2 leading-tight group-hover:text-orange-600 transition-colors">
                          {event.title}
                        </h3>

                        {/* Event Details - Stacked */}
                        <div className="space-y-1.5 mb-2 flex-1">
                          {/* Time */}
                          <div className="flex items-center gap-1.5 text-sm text-gray-600">
                            <Clock className="h-3.5 w-3.5 text-orange-500 flex-shrink-0" />
                            <span className="truncate">{event.time}</span>
                          </div>

                          {/* Location */}
                          {event.location && (
                            <div className="flex items-center gap-1.5 text-sm text-gray-600">
                              <MapPin className="h-3.5 w-3.5 text-orange-500 flex-shrink-0" />
                              <span className="truncate">{event.location}</span>
                            </div>
                          )}
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-between pt-2 border-t border-gray-100 mt-auto">
                          {/* Category */}
                          {event.category && (
                            <span className="inline-block px-2 py-0.5 bg-orange-50 text-orange-700 text-xs font-bold uppercase tracking-wide rounded-md border border-orange-200 truncate max-w-[60%]">
                              {event.category}
                            </span>
                          )}
                          
                          {/* View Button */}
                          <div className="ml-auto flex items-center gap-1 text-orange-600 group-hover:text-orange-700 font-semibold text-sm">
                            <span>View</span>
                            <ChevronRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {/* List View */}
            {viewMode === 'list' && (
              <div className="space-y-4 mb-10">
                {currentEvents.map((event, index) => (
                  <Link
                    key={event.id}
                    href={`/events/${event.id}`}
                    className="group block"
                    style={{ 
                      animation: 'fadeInUp 0.6s ease-out',
                      animationDelay: `${index * 50}ms`,
                      animationFillMode: 'both'
                    }}
                  >
                    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 hover:border-orange-300 overflow-hidden">
                      <div className="flex flex-col sm:flex-row">
                        {/* Event Image */}
                        <div className="relative sm:w-72 h-48 sm:h-auto flex-shrink-0">
                          <Image
                            src={getEventImage(event)}
                            alt={event.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                            sizes="(max-width: 640px) 100vw, 288px"
                          />
                          
                          {/* Gradient Overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                          
                          {/* Category Badge on Image */}
                          {event.category && (
                            <div className="absolute bottom-3 left-3">
                              <span className="inline-block px-3 py-1.5 bg-white/95 backdrop-blur-sm text-orange-700 text-xs font-bold uppercase tracking-wide rounded-lg shadow-lg border border-orange-200">
                                {event.category}
                              </span>
                            </div>
                          )}
                        </div>
                        
                        {/* Vertical Accent Line */}
                        <div className="hidden sm:block absolute left-72 top-0 bottom-0 w-1 bg-gradient-to-b from-orange-400 to-red-400"></div>
                      
                        <div className="p-6 flex-1">
                          <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                            <div className="flex-1 w-full">
                              {/* Title */}
                              <h3 className="text-xl font-bold text-gray-900 group-hover:text-orange-600 transition-colors mb-2">
                                {event.title}
                              </h3>
                              
                              {/* Description */}
                              {event.description && (
                                <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                                  {event.description}
                                </p>
                              )}
                              
                              {/* Event Details */}
                              <div className="flex flex-wrap gap-4 mb-4">
                                {/* Date */}
                                <div className="flex items-center gap-1.5 bg-orange-50 text-orange-700 rounded-lg px-3 py-1.5 border border-orange-200">
                                  <Calendar className="h-4 w-4" />
                                  <span className="text-sm font-bold">
                                    {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                  </span>
                                </div>
                                
                                {/* Time */}
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                  <Clock className="h-4 w-4 text-orange-500 flex-shrink-0" />
                                  <span className="font-medium">{event.time}</span>
                                </div>
                                
                                {/* Location */}
                                {event.location && (
                                  <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <MapPin className="h-4 w-4 text-orange-500 flex-shrink-0" />
                                    <span className="font-medium">{event.location}</span>
                                  </div>
                                )}
                                
                                {/* Attendees */}
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                  <Users className="h-4 w-4 text-orange-500 flex-shrink-0" />
                                  <span className="font-medium">
                                    {event.registeredCount || 0}
                                    {event.maxCapacity && ` / ${event.maxCapacity}`} attending
                                  </span>
                                </div>
                              </div>
                              
                              {/* Organizer */}
                              {event.organizer && (
                                <span className="text-sm text-gray-500">
                                  by <span className="font-semibold text-gray-700">{event.organizer.name}</span>
                                </span>
                              )}
                            </div>
                            
                            {/* Right Side: Price & CTA */}
                          <div className="flex sm:flex-col flex-row items-end sm:items-end justify-between sm:justify-start gap-3 sm:ml-6 w-full sm:w-auto">
                            {/* Price */}
                            {event.isPaid ? (
                              <div className="bg-yellow-100 text-yellow-700 px-4 py-2 rounded-lg font-bold text-sm border border-yellow-300 whitespace-nowrap">
                                ${event.price}
                              </div>
                            ) : (
                              <div className="bg-emerald-100 text-emerald-700 px-4 py-2 rounded-lg font-bold text-sm border border-emerald-300 whitespace-nowrap">
                                FREE
                              </div>
                            )}
                            
                            {/* View Button */}
                            <div className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-5 py-2.5 rounded-lg font-semibold text-sm shadow-md group-hover:shadow-lg group-hover:from-orange-600 group-hover:to-red-600 transition-all whitespace-nowrap">
                              <span>View Details</span>
                              <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center mt-8 space-x-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>

                <div className="flex space-x-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNumber;
                    if (totalPages <= 5) {
                      pageNumber = i + 1;
                    } else if (currentPage <= 3) {
                      pageNumber = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNumber = totalPages - 4 + i;
                    } else {
                      pageNumber = currentPage - 2 + i;
                    }

                    return (
                      <button
                        key={pageNumber}
                        onClick={() => handlePageChange(pageNumber)}
                        className={`px-3 py-2 text-sm font-medium rounded-lg ${
                          currentPage === pageNumber
                            ? "bg-gradient-to-r from-orange-400 to-red-400 text-white"
                            : "text-gray-500 bg-white border border-gray-300 hover:bg-gray-50 hover:text-gray-700"
                        }`}
                      >
                        {pageNumber}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}

            <div className="text-center mt-6 text-sm text-gray-500">
              Showing {startIndex + 1}-
              {Math.min(endIndex, filteredEvents.length)} of{" "}
              {filteredEvents.length} events
            </div>
          </>
        )}
      </div>

      {/* Add CSS animations */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
