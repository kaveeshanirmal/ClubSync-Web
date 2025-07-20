"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import BeautifulLoader from "../../components/Loader";
import {
  Users,
  Search,
  Filter,
  Building,
  ChevronRight,
  Sparkles,
  TrendingUp,
  Award,
  Target,
  Zap,
  Heart,
  ArrowRight,
  Eye,
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
}

export default function ClubsPage() {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [filteredClubs, setFilteredClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterActive, setFilterActive] = useState<boolean | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const clubsPerPage = 12;

  useEffect(() => {
    const fetchClubs = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/clubs");

        if (!response.ok) {
          throw new Error("Failed to fetch clubs");
        }

        const clubsData = await response.json();
        setClubs(clubsData);
        setFilteredClubs(clubsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchClubs();
  }, []);

  useEffect(() => {
    let filtered = clubs;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (club) =>
          club.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          club.motto?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          club.about?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by active status
    if (filterActive !== null) {
      filtered = filtered.filter((club) => club.isActive === filterActive);
    }

    setFilteredClubs(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [clubs, searchTerm, filterActive]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredClubs.length / clubsPerPage);
  const startIndex = (currentPage - 1) * clubsPerPage;
  const endIndex = startIndex + clubsPerPage;
  const currentClubs = filteredClubs.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <BeautifulLoader 
        message="Discovering Amazing Clubs"
        subMessage="Loading communities that inspire..."
        type="morphing"
      />
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50 pt-16">
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
                className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-3 rounded-full hover:from-orange-600 hover:to-red-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
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
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50 pt-16">
      {/* Hero Section with Enhanced Design */}
      <div className="relative overflow-hidden bg-gradient-to-r from-orange-500 via-red-500 to-yellow-500 text-white">
        <div className="absolute inset-0 bg-black/10"></div>
        
        {/* Animated Background Shapes */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/4 w-20 h-20 bg-white/20 rounded-full animate-bounce delay-500"></div>
          <div className="absolute bottom-1/4 right-1/3 w-16 h-16 bg-white/20 rounded-full animate-bounce delay-700"></div>
        </div>

        <div className="relative z-10 container mx-auto px-4 py-20">
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mr-4 animate-pulse">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-5xl md:text-6xl font-bold">
                Discover Your
                <span className="block bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                  Perfect Club
                </span>
              </h1>
            </div>
            
            <p className="text-xl md:text-2xl text-white/90 mb-8 leading-relaxed">
              Join extraordinary communities, build lasting connections, and 
              <span className="font-semibold"> make a difference together</span>
            </p>

            <div className="flex flex-wrap justify-center gap-8 mb-12">
              <div className="flex items-center bg-white/20 backdrop-blur-sm rounded-full px-6 py-3">
                <Users className="h-6 w-6 mr-2 text-yellow-300" />
                <span className="font-semibold">1000+ Members</span>
              </div>
              <div className="flex items-center bg-white/20 backdrop-blur-sm rounded-full px-6 py-3">
                <Award className="h-6 w-6 mr-2 text-yellow-300" />
                <span className="font-semibold">50+ Active Clubs</span>
              </div>
              <div className="flex items-center bg-white/20 backdrop-blur-sm rounded-full px-6 py-3">
                <Target className="h-6 w-6 mr-2 text-yellow-300" />
                <span className="font-semibold">200+ Events</span>
              </div>
            </div>

            {/* Call to Action */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-orange-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-50 transition-all duration-300 transform hover:scale-105 shadow-lg">
                <TrendingUp className="inline h-5 w-5 mr-2" />
                Explore Trending Clubs
              </button>
              <button className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white hover:text-orange-600 transition-all duration-300 transform hover:scale-105">
                <Eye className="inline h-5 w-5 mr-2" />
                Browse All Categories
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Compact Search and Filter Section */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="bg-white/70 backdrop-blur-md rounded-xl shadow-lg border border-white/30 p-4">
            <div className="flex flex-col md:flex-row gap-3">
              {/* Compact Search Bar */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search clubs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-300 focus:border-orange-400 transition-all duration-200 text-sm"
                />
              </div>

              {/* Compact Filter */}
              <div className="relative">
                <select
                  value={filterActive === null ? "" : filterActive.toString()}
                  onChange={(e) =>
                    setFilterActive(
                      e.target.value === ""
                        ? null
                        : e.target.value === "true"
                    )
                  }
                  className="appearance-none bg-white border border-gray-200 rounded-lg px-4 py-2.5 pr-8 focus:ring-2 focus:ring-orange-300 focus:border-orange-400 transition-all duration-200 text-sm font-medium min-w-[140px]"
                >
                  <option value="">All Clubs</option>
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
                <Filter className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Compact Results Summary */}
            <div className="mt-3 flex items-center justify-between text-sm">
              <div className="flex items-center text-gray-600">
                <Zap className="h-4 w-4 mr-1 text-orange-500" />
                <span className="font-medium text-orange-600">{filteredClubs.length}</span>
                <span className="ml-1">clubs found</span>
              </div>
              
              {filteredClubs.length > 0 && (
                <div className="text-xs text-gray-400">
                  Click to explore →
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Compact Clubs Grid */}
        {filteredClubs.length === 0 ? (
          <div className="text-center py-16">
            <div className="max-w-sm mx-auto">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-200 to-red-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <Building className="h-8 w-8 text-gray-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-700 mb-2">
                {searchTerm || filterActive !== null
                  ? "No clubs found"
                  : "No clubs available"}
              </h3>
              <p className="text-gray-500 text-sm">
                {searchTerm || filterActive !== null
                  ? "Try adjusting your search"
                  : "Check back soon for new clubs!"}
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {currentClubs.map((club, index) => (
                <Link
                  key={club.id}
                  href={`/clubs/${club.id}`}
                  className="group block"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-white/40 hover:border-orange-200 h-full">
                    {/* Compact Cover Image */}
                    <div className="relative h-32 overflow-hidden">
                      {club.coverImage ? (
                        <Image
                          src={club.coverImage}
                          alt={`${club.name} cover`}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-orange-400 via-red-500 to-yellow-500 flex items-center justify-center">
                          <Building className="h-12 w-12 text-white/40" />
                        </div>
                      )}
                      
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

                      {/* Active Status Badge */}
                      <div className="absolute top-2 right-2">
                        <span
                          className={`px-3 py-1 text-xs font-semibold rounded-full ${
                            club.isActive
                              ? "bg-green-500/90 text-white"
                              : "bg-gray-500/90 text-white"
                          }`}
                        >
                          {club.isActive ? "Active" : "Inactive"}
                        </span>
                      </div>

                      {/* Hover Arrow */}
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <div className="w-8 h-8 bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center">
                          <ArrowRight className="h-4 w-4 text-white" />
                        </div>
                      </div>
                    </div>

                    {/* Compact Content */}
                    <div className="p-3">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-sm font-bold text-gray-900 group-hover:text-orange-600 transition-colors duration-200 leading-tight flex-1 pr-1">
                          {club.name}
                        </h3>
                        <ChevronRight className="h-4 w-4 text-orange-500 group-hover:translate-x-0.5 transition-transform duration-200 flex-shrink-0" />
                      </div>

                      {club.motto && (
                        <p className="text-xs text-gray-500 italic mb-3 line-clamp-2">
                          &ldquo;{club.motto}&rdquo;
                        </p>
                      )}

                      {/* Compact Avenues */}
                      {club.avenues && club.avenues.length > 0 && (
                        <div className="mb-3">
                          <div className="flex flex-wrap gap-1">
                            {club.avenues.slice(0, 2).map((avenue, index) => (
                              <span
                                key={index}
                                className="px-2 py-0.5 bg-gradient-to-r from-orange-100 to-red-100 text-orange-700 text-xs rounded-full font-medium"
                              >
                                {avenue}
                              </span>
                            ))}
                            {club.avenues.length > 2 && (
                              <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full font-medium">
                                +{club.avenues.length - 2}
                              </span>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Compact Footer */}
                      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                        <div className="flex items-center text-xs text-gray-500">
                          <Users className="h-3 w-3 mr-1 text-orange-500" />
                          <span>Connect</span>
                        </div>
                        <div className="text-xs text-gray-400">
                          {new Date(club.createdAt).getFullYear()}
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

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
                            ? 'bg-orange-500 text-white'
                            : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50 hover:text-gray-700'
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

            {/* Results Info */}
            <div className="text-center mt-6 text-sm text-gray-500">
              Showing {startIndex + 1}-{Math.min(endIndex, filteredClubs.length)} of {filteredClubs.length} clubs
            </div>
          </>
        )}

      </div>
    </div>
  );
}
