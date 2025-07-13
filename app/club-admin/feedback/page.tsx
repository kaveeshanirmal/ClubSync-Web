"use client";
import { useSession } from "next-auth/react";
import { useState } from "react";
import Link from "next/link";
import { 
  ArrowLeft,
  Star,
  Filter,
  Search,
  Download,
  TrendingUp,
  TrendingDown,
  MessageSquare,
  Users,
  Calendar
} from "lucide-react";

export default function FeedbackPage() {
  const { data: session } = useSession();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClub, setSelectedClub] = useState("all");
  const [ratingFilter, setRatingFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date");

  // Mock feedback data
  const feedback = [
    {
      id: 1,
      volunteerName: "Sarah Johnson",
      club: "Robotics Club",
      rating: 5,
      comment: "Amazing experience! The club activities are well-organized and engaging. The leadership team is very supportive and the events are always well-planned.",
      date: "2024-01-15",
      category: "positive"
    },
    {
      id: 2,
      volunteerName: "Mike Chen",
      club: "Drama Club",
      rating: 4,
      comment: "Great leadership and communication. Would love to see more events and better time management for rehearsals.",
      date: "2024-01-14",
      category: "positive"
    },
    {
      id: 3,
      volunteerName: "Emily Davis",
      club: "Environmental Club",
      rating: 5,
      comment: "Excellent initiative and dedication to environmental causes. The projects are meaningful and impactful.",
      date: "2024-01-13",
      category: "positive"
    },
    {
      id: 4,
      volunteerName: "Alex Turner",
      club: "Robotics Club",
      rating: 3,
      comment: "Good experience overall, but communication could be improved. Sometimes events are announced too late.",
      date: "2024-01-12",
      category: "neutral"
    },
    {
      id: 5,
      volunteerName: "Jessica Brown",
      club: "Drama Club",
      rating: 5,
      comment: "Fantastic experience! The club has helped me develop my acting skills and confidence. Highly recommend!",
      date: "2024-01-11",
      category: "positive"
    },
    {
      id: 6,
      volunteerName: "David Wilson",
      club: "Environmental Club",
      rating: 2,
      comment: "The club activities are good but there's a lack of organization. Meetings often start late and run over time.",
      date: "2024-01-10",
      category: "negative"
    }
  ];

  const clubs = ["Robotics Club", "Drama Club", "Environmental Club"];

  // Filter and sort feedback
  const filteredFeedback = feedback
    .filter(item => {
      const matchesSearch = item.volunteerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.comment.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesClub = selectedClub === "all" || item.club === selectedClub;
      const matchesRating = ratingFilter === "all" || 
                           (ratingFilter === "high" && item.rating >= 4) ||
                           (ratingFilter === "medium" && item.rating >= 3 && item.rating < 4) ||
                           (ratingFilter === "low" && item.rating < 3);
      
      return matchesSearch && matchesClub && matchesRating;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "date":
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case "rating":
          return b.rating - a.rating;
        case "name":
          return a.volunteerName.localeCompare(b.volunteerName);
        default:
          return 0;
      }
    });

  // Calculate statistics
  const totalFeedback = feedback.length;
  const averageRating = feedback.reduce((sum, item) => sum + item.rating, 0) / totalFeedback;
  const positiveFeedback = feedback.filter(item => item.rating >= 4).length;
  const negativeFeedback = feedback.filter(item => item.rating < 3).length;
  const neutralFeedback = feedback.filter(item => item.rating >= 3 && item.rating < 4).length;

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? "text-yellow-400 fill-current" : "text-gray-300"
        }`}
      />
    ));
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "positive":
        return "bg-green-100 text-green-800";
      case "negative":
        return "bg-red-100 text-red-800";
      case "neutral":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-white pt-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-50 to-red-50 shadow-sm border-b border-orange-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/club-admin" className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Volunteer Feedback</h1>
                <p className="text-gray-600">Manage and analyze volunteer feedback across all clubs</p>
              </div>
            </div>
            <button className="flex items-center px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-600 hover:to-red-600 transition-colors">
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <MessageSquare className="w-6 h-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Feedback</p>
                <p className="text-2xl font-bold text-black">{totalFeedback}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Star className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Average Rating</p>
                <p className="text-2xl font-bold text-gray-900">{averageRating.toFixed(1)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Positive</p>
                <p className="text-2xl font-bold text-gray-900">{positiveFeedback}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <TrendingDown className="w-6 h-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Needs Attention</p>
                <p className="text-2xl font-bold text-gray-900">{negativeFeedback}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search feedback..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Club</label>
              <select
                value={selectedClub}
                onChange={(e) => setSelectedClub(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Clubs</option>
                {clubs.map(club => (
                  <option key={club} value={club}>{club}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
              <select
                value={ratingFilter}
                onChange={(e) => setRatingFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Ratings</option>
                <option value="high">4-5 Stars</option>
                <option value="medium">3-4 Stars</option>
                <option value="low">1-3 Stars</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="date">Date</option>
                <option value="rating">Rating</option>
                <option value="name">Name</option>
              </select>
            </div>
          </div>
        </div>

        {/* Feedback List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Feedback ({filteredFeedback.length} results)
            </h2>
          </div>
          
          <div className="divide-y divide-gray-200">
            {filteredFeedback.map((item) => (
              <div key={item.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium">
                      {item.volunteerName.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{item.volunteerName}</h3>
                      <p className="text-sm text-gray-600">{item.club}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(item.category)}`}>
                      {item.category}
                    </span>
                    <div className="flex items-center">
                      {renderStars(item.rating)}
                    </div>
                  </div>
                </div>
                
                <p className="text-gray-700 mb-4 leading-relaxed">{item.comment}</p>
                
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center space-x-4">
                    <span className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {item.date}
                    </span>
                    <span className="flex items-center">
                      <Users className="w-4 h-4 mr-1" />
                      {item.club}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="text-blue-600 hover:text-blue-800">Reply</button>
                    <button className="text-gray-600 hover:text-gray-800">Flag</button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredFeedback.length === 0 && (
            <div className="p-12 text-center">
              <MessageSquare className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No feedback found</h3>
              <p className="mt-1 text-sm text-gray-500">
                Try adjusting your search or filter criteria.
              </p>
            </div>
          )}
        </div>

        {/* Rating Distribution */}
        <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Rating Distribution</h3>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {[5, 4, 3, 2, 1].map((rating) => {
              const count = feedback.filter(item => item.rating === rating).length;
              const percentage = (count / totalFeedback) * 100;
              return (
                <div key={rating} className="text-center">
                  <div className="flex items-center justify-center space-x-1 mb-2">
                    {renderStars(rating)}
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{count}</p>
                  <p className="text-sm text-gray-600">{percentage.toFixed(1)}%</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
} 