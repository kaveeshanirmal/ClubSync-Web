"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import BeautifulLoader from "../../components/Loader";
import {
  Users,
  Search,
  Building,
  ChevronRight,
  Heart,
  Calendar,
  MapPin,
  Grid3x3,
  LayoutList,
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
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
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
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 pt-16">
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
                className="bg-gradient-to-r from-orange-400 to-red-400 text-white px-8 py-3 rounded-xl hover:from-orange-500 hover:to-red-500 transition-all duration-300 transform hover:scale-105 shadow-lg"
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
    <div className="min-h-screen bg-gradient-to-r from-orange-50 via-orange-50/30 to-red-50">
      {/* Simplified Hero Section */}
      <div className="relative bg-gradient-to-r from-orange-400 to-red-400 text-white overflow-hidden">
        {/* Subtle Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 container mx-auto px-4 py-24">
          <div className="max-w-4xl mx-auto text-center">
            {/* Main Heading */}
            <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
              Discover Amazing Clubs
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

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 -mt-8 relative z-20">
        {/* Compact Search and Filter Section */}
        <div className="max-w-7xl mx-auto mb-8">
          {/* Search Bar */}
          <div className="relative mb-4">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search clubs..."
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
                <Building className="h-4 w-4 text-orange-600" />
                <span className="font-semibold text-orange-700 text-sm">
                  {filteredClubs.length} {filteredClubs.length === 1 ? 'club' : 'clubs'}
                </span>
              </div>

              <select
                value={filterActive === null ? "" : filterActive.toString()}
                onChange={(e) =>
                  setFilterActive(
                    e.target.value === "" ? null : e.target.value === "true"
                  )
                }
                className="appearance-none bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg px-3 py-1.5 pr-8 text-sm font-medium text-gray-700 hover:border-gray-300 focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all cursor-pointer"
              >
                <option value="">All Status</option>
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>

              {(searchTerm || filterActive !== null) && (
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setFilterActive(null);
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
            {/* Grid View */}
            {viewMode === 'grid' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-10">
                {currentClubs.map((club, index) => (
                  <Link
                    key={club.id}
                    href={`/clubs/${club.id}`}
                    className="group"
                    style={{ 
                      animation: 'fadeInUp 0.6s ease-out',
                      animationDelay: `${index * 50}ms`,
                      animationFillMode: 'both'
                    }}
                  >
                    <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-orange-100/50 h-full">
                      {/* Cover Image */}
                      <div className="relative h-40 overflow-hidden">
                        {club.coverImage ? (
                          <Image
                            src={club.coverImage}
                            alt={`${club.name} cover`}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-700"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-orange-400 to-red-400 flex items-center justify-center">
                            <Building className="h-16 w-16 text-white/40" />
                          </div>
                        )}
                        
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                        {/* Status Badge */}
                        <div className="absolute top-4 right-4">
                          <span
                            className={`px-3 py-1.5 text-xs font-bold rounded-full backdrop-blur-md ${
                              club.isActive
                                ? "bg-emerald-500/90 text-white shadow-lg"
                                : "bg-gray-500/90 text-white shadow-lg"
                            }`}
                          >
                            {club.isActive ? "● Active" : "● Inactive"}
                          </span>
                        </div>

                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-orange-500/0 group-hover:bg-orange-500/10 transition-all duration-300" />
                      </div>

                      {/* Content */}
                      <div className="p-5">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="text-base font-bold text-gray-900 group-hover:text-orange-600 transition-colors duration-300 leading-tight flex-1 pr-2 line-clamp-2">
                            {club.name}
                          </h3>
                          <ChevronRight className="h-5 w-5 text-orange-500 group-hover:translate-x-1 transition-transform duration-300 flex-shrink-0 mt-1" />
                        </div>

                        {club.motto && (
                          <p className="text-sm text-gray-600 italic mb-3 line-clamp-2 leading-relaxed">
                            &ldquo;{club.motto}&rdquo;
                          </p>
                        )}

                        {/* Avenues */}
                        {club.avenues && club.avenues.length > 0 && (
                          <div className="mb-3">
                            <div className="flex flex-wrap gap-1.5">
                              {club.avenues.slice(0, 2).map((avenue, idx) => (
                                <span
                                  key={idx}
                                  className="px-2.5 py-1 bg-gradient-to-r from-orange-50 to-red-50 text-orange-700 text-xs rounded-lg font-semibold border border-orange-200"
                                >
                                  {avenue}
                                </span>
                              ))}
                              {club.avenues.length > 2 && (
                                <span className="px-2.5 py-1 bg-gray-50 text-gray-600 text-xs rounded-lg font-semibold border border-gray-200">
                                  +{club.avenues.length - 2}
                                </span>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Footer */}
                        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                          <div className="flex items-center text-sm text-gray-500">
                            <Users className="h-4 w-4 mr-1.5 text-orange-500" />
                            <span className="font-medium">Join Now</span>
                          </div>
                          <div className="text-xs text-gray-400 font-medium">
                            Est. {club.founded || new Date(club.createdAt).getFullYear()}
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
                {currentClubs.map((club, index) => (
                  <Link
                    key={club.id}
                    href={`/clubs/${club.id}`}
                    className="group block"
                    style={{ 
                      animation: 'fadeInUp 0.6s ease-out',
                      animationDelay: `${index * 50}ms`,
                      animationFillMode: 'both'
                    }}
                  >
                    <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-orange-100/50 overflow-hidden group-hover:border-orange-300">
                      <div className="flex flex-col sm:flex-row">
                        {/* Image */}
                        <div className="relative sm:w-64 h-48 sm:h-auto flex-shrink-0">
                          {club.coverImage ? (
                            <Image
                              src={club.coverImage}
                              alt={`${club.name} cover`}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-orange-400 to-red-400 flex items-center justify-center">
                              <Building className="h-16 w-16 text-white/40" />
                            </div>
                          )}

                          {/* Status Badge */}
                          <div className="absolute top-4 right-4">
                            <span
                              className={`px-3 py-1.5 text-xs font-bold rounded-full backdrop-blur-md ${
                                club.isActive
                                  ? "bg-emerald-500/90 text-white"
                                  : "bg-gray-500/90 text-white"
                              }`}
                            >
                              {club.isActive ? "● Active" : "● Inactive"}
                            </span>
                          </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 p-6">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <h3 className="text-2xl font-bold text-gray-900 group-hover:text-orange-600 transition-colors duration-300 mb-2">
                                {club.name}
                              </h3>
                              {club.motto && (
                                <p className="text-gray-600 italic mb-3">
                                  &ldquo;{club.motto}&rdquo;
                                </p>
                              )}
                            </div>
                            <ChevronRight className="h-6 w-6 text-orange-500 group-hover:translate-x-2 transition-transform duration-300 flex-shrink-0 ml-4" />
                          </div>

                          {club.about && (
                            <p className="text-gray-600 mb-4 line-clamp-2 leading-relaxed">
                              {club.about}
                            </p>
                          )}

                          {/* Avenues */}
                          {club.avenues && club.avenues.length > 0 && (
                            <div className="mb-4">
                              <div className="flex flex-wrap gap-2">
                                {club.avenues.slice(0, 4).map((avenue, idx) => (
                                  <span
                                    key={idx}
                                    className="px-3 py-1.5 bg-gradient-to-r from-orange-50 to-red-50 text-orange-700 text-xs rounded-lg font-semibold border border-orange-200"
                                  >
                                    {avenue}
                                  </span>
                                ))}
                                {club.avenues.length > 4 && (
                                  <span className="px-3 py-1.5 bg-gray-50 text-gray-600 text-xs rounded-lg font-semibold border border-gray-200">
                                    +{club.avenues.length - 4} more
                                  </span>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Footer Info */}
                          <div className="flex items-center gap-6 text-sm text-gray-500">
                            {club.headquarters && (
                              <div className="flex items-center gap-1.5">
                                <MapPin className="h-4 w-4 text-orange-500" />
                                <span>{club.headquarters}</span>
                              </div>
                            )}
                            <div className="flex items-center gap-1.5">
                              <Calendar className="h-4 w-4 text-orange-500" />
                              <span>Est. {club.founded || new Date(club.createdAt).getFullYear()}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Users className="h-4 w-4 text-orange-500" />
                              <span className="font-medium text-orange-600">Join Now</span>
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
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-10">
                <div className="text-sm text-gray-600">
                  Showing <span className="font-semibold text-gray-900">{startIndex + 1}</span> to{' '}
                  <span className="font-semibold text-gray-900">{Math.min(endIndex, filteredClubs.length)}</span> of{' '}
                  <span className="font-semibold text-gray-900">{filteredClubs.length}</span> clubs
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 hover:border-gray-400 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
                  >
                    Previous
                  </button>

                  <div className="flex gap-1">
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
                          className={`px-4 py-2 text-sm font-medium rounded-xl transition-all duration-200 ${
                            currentPage === pageNumber
                              ? 'bg-gradient-to-r from-orange-400 to-red-400 text-white shadow-lg'
                              : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 hover:border-gray-400'
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
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 hover:border-gray-400 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}

            {/* Results Info */}
            <div className="text-center mt-6 text-sm text-gray-500">
              Showing {startIndex + 1}-{Math.min(endIndex, filteredClubs.length)} of {filteredClubs.length} clubs
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
