"use client";
import { useSession } from "next-auth/react";
import { useState } from "react";
import Link from "next/link";
import { 
  ArrowLeft,
  Award, 
  Users, 
  Calendar, 
  CheckCircle,
  XCircle,
  Clock,
  Plus,
  Edit,
  Eye,
  Download,
  Search,
  Filter,
  Vote
} from "lucide-react";

export default function ElectionsPage() {
  const { data: session } = useSession();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);

  // Mock elections data
  const elections = [
    {
      id: 1,
      position: "President",
      club: "Robotics Club",
      candidates: [
        { name: "Alice Johnson", votes: 25, percentage: 62.5 },
        { name: "Bob Wilson", votes: 15, percentage: 37.5 }
      ],
      totalVotes: 40,
      status: "pending",
      deadline: "2024-02-01",
      startDate: "2024-01-15",
      endDate: "2024-01-31",
      description: "Lead the club's technical initiatives and represent the club in university events"
    },
    {
      id: 2,
      position: "Vice President",
      club: "Drama Club",
      candidates: [
        { name: "Charlie Brown", votes: 18, percentage: 60.0 },
        { name: "Diana Prince", votes: 12, percentage: 40.0 }
      ],
      totalVotes: 30,
      status: "approved",
      deadline: "2024-01-25",
      startDate: "2024-01-10",
      endDate: "2024-01-24",
      description: "Support the president and oversee event coordination"
    },
    {
      id: 3,
      position: "Secretary",
      club: "Environmental Club",
      candidates: [
        { name: "Emma Davis", votes: 22, percentage: 73.3 },
        { name: "Frank Miller", votes: 8, percentage: 26.7 }
      ],
      totalVotes: 30,
      status: "completed",
      deadline: "2024-01-20",
      startDate: "2024-01-05",
      endDate: "2024-01-19",
      description: "Manage club records and communication"
    },
    {
      id: 4,
      position: "Treasurer",
      club: "Robotics Club",
      candidates: [
        { name: "Grace Lee", votes: 0, percentage: 0 },
        { name: "Henry Adams", votes: 0, percentage: 0 }
      ],
      totalVotes: 0,
      status: "upcoming",
      deadline: "2024-02-15",
      startDate: "2024-02-01",
      endDate: "2024-02-14",
      description: "Manage club finances and budget"
    }
  ];

  const filteredElections = elections.filter(election => {
    const matchesSearch = election.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         election.club.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || election.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      case "upcoming":
        return "bg-purple-100 text-purple-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="w-4 h-4" />;
      case "pending":
        return <Clock className="w-4 h-4" />;
      case "completed":
        return <Award className="w-4 h-4" />;
      case "upcoming":
        return <Calendar className="w-4 h-4" />;
      case "rejected":
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
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
                <h1 className="text-2xl font-bold text-gray-900">Election Management</h1>
                <p className="text-gray-600">Approve office bearer lists and manage election processes</p>
              </div>
            </div>
            <button 
              onClick={() => setShowAddModal(true)}
              className="flex items-center px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-600 hover:to-red-600 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Election
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Award className="w-6 h-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Elections</p>
                <p className="text-2xl font-bold text-black">{elections.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Approved</p>
                <p className="text-2xl font-bold text-gray-900">
                  {elections.filter(e => e.status === "approved").length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">
                  {elections.filter(e => e.status === "pending").length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Vote className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Votes</p>
                <p className="text-2xl font-bold text-gray-900">
                  {elections.reduce((sum, e) => sum + e.totalVotes, 0)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search positions or clubs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="upcoming">Upcoming</option>
                <option value="pending">Pending Approval</option>
                <option value="approved">Approved</option>
                <option value="completed">Completed</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            <div className="flex items-end">
              <button className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                <Filter className="w-4 h-4 inline mr-2" />
                More Filters
              </button>
            </div>
          </div>
        </div>

        {/* Elections List */}
        <div className="space-y-6">
          {filteredElections.map((election) => (
            <div key={election.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">{election.position}</h3>
                  <p className="text-sm text-gray-600">{election.club}</p>
                  <p className="text-sm text-gray-700 mt-2">{election.description}</p>
                </div>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(election.status)}
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(election.status)}`}>
                    {election.status}
                  </span>
                </div>
              </div>

              {/* Candidates and Results */}
              <div className="mb-6">
                <h4 className="text-lg font-medium text-gray-900 mb-4">Candidates & Results</h4>
                <div className="space-y-3">
                  {election.candidates.map((candidate, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium text-sm">
                            {candidate.name.charAt(0)}
                          </div>
                          <span className="font-medium text-gray-900">{candidate.name}</span>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-gray-900">{candidate.votes} votes</div>
                          <div className="text-sm text-gray-600">{candidate.percentage}%</div>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${candidate.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 text-sm text-gray-600">
                  Total Votes: {election.totalVotes}
                </div>
              </div>

              {/* Timeline */}
              <div className="mb-6">
                <h4 className="text-lg font-medium text-gray-900 mb-4">Timeline</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-blue-50 rounded-lg p-3">
                    <div className="text-sm font-medium text-blue-900">Start Date</div>
                    <div className="text-sm text-blue-700">{election.startDate}</div>
                  </div>
                  <div className="bg-green-50 rounded-lg p-3">
                    <div className="text-sm font-medium text-green-900">End Date</div>
                    <div className="text-sm text-green-700">{election.endDate}</div>
                  </div>
                  <div className="bg-yellow-50 rounded-lg p-3">
                    <div className="text-sm font-medium text-yellow-900">Approval Deadline</div>
                    <div className="text-sm text-yellow-700">{election.deadline}</div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>Deadline: {election.deadline}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="flex items-center px-3 py-2 text-sm text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
                    <Eye className="w-4 h-4 mr-1" />
                    View Details
                  </button>
                  {election.status === "pending" && (
                    <>
                      <button className="flex items-center px-3 py-2 text-sm text-green-600 border border-green-600 rounded-lg hover:bg-green-50 transition-colors">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Approve
                      </button>
                      <button className="flex items-center px-3 py-2 text-sm text-red-600 border border-red-600 rounded-lg hover:bg-red-50 transition-colors">
                        <XCircle className="w-4 h-4 mr-1" />
                        Reject
                      </button>
                    </>
                  )}
                  <button className="flex items-center px-3 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                    <Download className="w-4 h-4 mr-1" />
                    Export
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredElections.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
            <Award className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No elections found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your search or filter criteria.
            </p>
          </div>
        )}
      </div>

      {/* Add Election Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Create New Election
              </h3>
              
              <div className="space-y-4 text-left">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter position title"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Club</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="">Select club</option>
                    <option value="robotics">Robotics Club</option>
                    <option value="drama">Drama Club</option>
                    <option value="environmental">Environmental Club</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter position description"
                  ></textarea>
                </div>
              </div>
              
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button className="flex-1 px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors">
                  Create Election
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 