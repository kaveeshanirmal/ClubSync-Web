"use client";
import React, { useState, useEffect } from 'react';
import { 
  Plus,
  Filter,
  Download,
  Eye,
  Edit,
  Trash2,
  Users,
  Clock,
  Search,
  FileText,
  Check,
  X,
  AlertCircle,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

// Define types based on our schema
interface Club {
  id: string;
  name: string;
  profileImage?: string;
  about?: string;
  isActive: boolean;
  isDeleted: boolean;
  createdAt: string;
  clubType?: string;
  _count?: {
    members: number;
  }
}

interface ClubRequest {
  id: string;
  clubName: string;
  clubType: string;
  clubCategory: string;
  requestStatus: string;
  createdAt: string;
  clubLogo?: string;
  description: string;
  requestedBy: {
    firstName: string;
    lastName: string;
    email: string;
  };
  constitutionDoc?: string;
  idProofDocument?: string;
  approvalLetter?: string;
  _count?: {
    members: number;
  }
}

interface ClubsTabProps {
  // We'll ignore this prop as we'll fetch data directly
  recentClubs?: any[];
}

const ClubsTab: React.FC<ClubsTabProps> = () => {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [clubRequests, setClubRequests] = useState<ClubRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'clubs' | 'requests'>('clubs');
  const [selectedClub, setSelectedClub] = useState<Club | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<ClubRequest | null>(null);
  const [clubsCount, setClubsCount] = useState(0);
  const [membersCount, setMembersCount] = useState(0);
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  useEffect(() => {
    fetchData();
  }, []);
  
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch clubs data
      const clubsResponse = await fetch('/api/clubs', { cache: 'no-store' });
      if (!clubsResponse.ok) throw new Error('Failed to fetch clubs');
      const clubsData = await clubsResponse.json();
      
      // Fetch club requests data
      const requestsResponse = await fetch('/api/club-requests', { cache: 'no-store' });
      if (!requestsResponse.ok) throw new Error('Failed to fetch club requests');
      const requestsData = await requestsResponse.json();
      
      setClubs(clubsData);
      setClubRequests(requestsData);
      
      // Calculate stats
      setClubsCount(clubsData.length);
      const totalMembers = clubsData.reduce((sum: number, club: Club) => sum + (club._count?.members || 0), 0);
      setMembersCount(totalMembers);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError('Failed to load data. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleUpdateRequestStatus = async (requestId: string, status: string) => {
    try {
      // First update UI immediately for better user experience
      // Update in club requests list
      setClubRequests(prevRequests => 
        prevRequests.map(req => 
          req.id === requestId ? { ...req, requestStatus: status, status: status } : req
        )
      );
      
      // Also update selectedRequest if it's the one being modified
      if (selectedRequest && selectedRequest.id === requestId) {
        setSelectedRequest(prev => prev ? { ...prev, requestStatus: status, status: status } : null);
      }
      
      // Then send to API
      const response = await fetch(`/api/club-requests/${requestId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ requestStatus: status }),
      });
      
      if (response.ok) {
        console.log(`Club request status updated to: ${status}`);
        
        // For major status changes (approval/rejection), close modal and refresh all data
        if (status === 'approved' || status === 'rejected') {
          setTimeout(() => {
            setSelectedRequest(null);
            fetchData();
          }, 1000); // Give user a moment to see the updated status before closing
        }
      } else {
        setError('Failed to update request status');
        // If API call failed, refresh to get correct data
        fetchData();
      }
    } catch (err) {
      console.error("Error updating request:", err);
      setError('Failed to update request status');
      // If there was an error, refresh to get correct data
      fetchData();
    }
  };
  
  // Filter and search clubs
  const filteredClubs = clubs.filter(club => {
    const matchesCategory = filterCategory === 'all' || club.clubType === filterCategory;
    const matchesStatus = filterStatus === 'all' || 
                        (filterStatus === 'active' && club.isActive) ||
                        (filterStatus === 'inactive' && !club.isActive);
    const matchesSearch = searchQuery === '' || 
                        club.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesStatus && matchesSearch;
  });
  
  const filteredRequests = clubRequests.filter(request => {
    const matchesCategory = filterCategory === 'all' || request.clubType === filterCategory;
    const matchesStatus = filterStatus === 'all' || request.requestStatus === filterStatus;
    const matchesSearch = searchQuery === '' || 
                        request.clubName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesStatus && matchesSearch;
  });
  
  // Choose the appropriate filtered list based on view mode
  const filteredItems = viewMode === 'clubs' ? filteredClubs : filteredRequests;

  return (
  <div className="space-y-6">
    {/* Creative Clubs Header */}
    <div className="relative bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-8 text-white overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-4 right-4 w-24 h-24 border border-white/30 rounded-full"></div>
        <div className="absolute bottom-4 left-4 w-16 h-16 border border-white/30 rounded-full"></div>
      </div>
      <div className="relative z-10">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-2">Club Management</h2>
            <p className="text-orange-100">Manage and oversee all club activities and memberships</p>
            <div className="flex items-center space-x-6 mt-4">
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4" />
                <span className="text-sm">{clubsCount} Total Clubs</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4" />
                <span className="text-sm">{membersCount} Active Members</span>
              </div>
            </div>
          </div>
          <div className="flex space-x-3">
            <button 
              onClick={() => setViewMode('requests')} 
              className={`${viewMode === 'requests' ? 'bg-white/30' : 'bg-white/20 hover:bg-white/30'} text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 flex items-center space-x-2`}>
              <FileText className="w-5 h-5" />
              <span>Club Requests</span>
            </button>
            <button 
              onClick={() => setViewMode('clubs')}
              className={`${viewMode === 'clubs' ? 'bg-white/30' : 'bg-white/20 hover:bg-white/30'} text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 flex items-center space-x-2`}>
              <Users className="w-5 h-5" />
              <span>All Clubs</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    {/* Search and Filters */}
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center space-x-2">
          <Filter className="w-5 h-5 text-orange-600" />
          <span className="text-sm font-medium text-gray-700">Filters:</span>
        </div>
        
        <div className="flex-1 max-w-sm">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search clubs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
        </div>
        
        <select 
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="text-sm border border-gray-300 rounded-lg px-3 py-2 bg-white hover:border-orange-500 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 cursor-pointer"
        >
          <option value="all">All Categories</option>
          <option value="academic">Academic</option>
          <option value="sports">Sports</option>
          <option value="cultural">Cultural</option>
          <option value="volunteer">Volunteer</option>
          <option value="professional">Professional</option>
          <option value="hobby">Hobby</option>
          <option value="other">Other</option>
        </select>
        
        <select 
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="text-sm border border-gray-300 rounded-lg px-3 py-2 bg-white hover:border-orange-500 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 cursor-pointer"
        >
          {viewMode === 'clubs' ? (
            <>
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </>
          ) : (
            <>
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="underReview">Under Review</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="needsMoreInfo">Needs More Info</option>
            </>
          )}
        </select>
        
        <button className="text-sm text-orange-600 hover:text-orange-700 font-medium flex items-center space-x-1 border border-orange-300 hover:border-orange-500 px-3 py-2 rounded-lg transition-all duration-200">
          <Download className="w-4 h-4" />
          <span>Export</span>
        </button>
      </div>
    </div>

    {/* Main Table */}
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">
          {viewMode === 'clubs' ? 'All Clubs' : 'Club Requests'}
        </h3>
      </div>
      
      {loading ? (
        <div className="p-8 text-center">
          <div className="w-12 h-12 border-4 border-t-orange-500 border-orange-200 rounded-full animate-spin mx-auto"></div>
          <p className="mt-3 text-gray-600">Loading data...</p>
        </div>
      ) : error ? (
        <div className="p-8 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
          <p className="mt-3 text-gray-600">{error}</p>
          <button 
            onClick={fetchData}
            className="mt-4 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md"
          >
            Try Again
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          {viewMode === 'clubs' ? (
            // Clubs Table
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Club</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Members</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredItems.length > 0 ? (
                  // Club items rendering
                  (filteredItems as Club[]).map((club) => (
                    <tr key={club.id} className="hover:bg-gray-50 transition-colors duration-200">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gradient-to-r from-orange-400 to-red-400 rounded-lg flex items-center justify-center mr-3">
                            {club.profileImage ? (
                              <img 
                                src={club.profileImage} 
                                alt={club.name}
                                className="w-10 h-10 rounded-lg object-cover"
                              />
                            ) : (
                              <Users className="w-5 h-5 text-white" />
                            )}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">{club.name}</div>
                            <div className="text-sm text-gray-500">ID: {club.id.substring(0, 8)}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Users className="w-4 h-4 text-gray-400 mr-1" />
                          <span className="text-sm text-gray-900">{club._count?.members || 0}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          club.isActive && !club.isDeleted
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {club.isActive && !club.isDeleted ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 text-gray-400 mr-1" />
                          <span className="text-sm text-gray-500">
                            {new Date(club.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button 
                            onClick={() => setSelectedClub(club)}
                            className="text-orange-600 hover:text-orange-900 p-1 rounded transition-colors duration-200"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button 
                            className="text-gray-600 hover:text-gray-900 p-1 rounded transition-colors duration-200"
                            title="Edit Club"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button 
                            className="text-red-600 hover:text-red-900 p-1 rounded transition-colors duration-200"
                            title="Delete Club"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                      No clubs found matching your criteria
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          ) : (
            // Club Requests Table
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Club</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Requested By</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredItems.length > 0 ? (
                  (filteredItems as ClubRequest[]).map((request) => (
                    <tr key={request.id} className="hover:bg-gray-50 transition-colors duration-200">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gradient-to-r from-orange-400 to-red-400 rounded-lg flex items-center justify-center mr-3">
                            {request.clubLogo ? (
                              <img 
                                src={request.clubLogo} 
                                alt={request.clubName}
                                className="w-10 h-10 rounded-lg object-cover"
                              />
                            ) : (
                              <Users className="w-5 h-5 text-white" />
                            )}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">{request.clubName}</div>
                            <div className="text-sm text-gray-500">Type: {request.clubType.charAt(0).toUpperCase() + request.clubType.slice(1)}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900">
                          {request.clubCategory === 'communityBased' ? 'Community Based' : 'Institute Based'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          request.requestStatus === 'approved' 
                            ? 'bg-green-100 text-green-800' 
                            : request.requestStatus === 'pending' 
                            ? 'bg-yellow-100 text-yellow-800'
                            : request.requestStatus === 'underReview'
                            ? 'bg-blue-100 text-blue-800'
                            : request.requestStatus === 'needsMoreInfo'
                            ? 'bg-purple-100 text-purple-800'
                            : request.requestStatus === 'rejected'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {request.requestStatus === 'underReview' 
                            ? 'Under Review'
                            : request.requestStatus === 'needsMoreInfo'
                            ? 'Needs More Info'
                            : request.requestStatus.charAt(0).toUpperCase() + request.requestStatus.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{request.requestedBy.firstName} {request.requestedBy.lastName}</div>
                        <div className="text-xs text-gray-500">{request.requestedBy.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 text-gray-400 mr-1" />
                          <span className="text-sm text-gray-500">
                            {new Date(request.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button 
                            onClick={() => {
                              // Set the request to be viewed first for immediate UI update
                              setSelectedRequest({
                                ...request, 
                                // If status is pending, change to underReview in the UI immediately 
                                requestStatus: request.requestStatus === 'pending' ? 'underReview' : request.requestStatus,
                                status: request.requestStatus === 'pending' ? 'underReview' : request.status
                              });
                              
                              // Then update in database if currently pending
                              if (request.requestStatus === 'pending') {
                                handleUpdateRequestStatus(request.id, 'underReview');
                              }
                            }}
                            className="text-orange-600 hover:text-orange-900 p-1 rounded transition-colors duration-200"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          {(request.requestStatus !== 'approved' && request.requestStatus !== 'rejected') && (
                            <>
                              <button 
                                onClick={() => handleUpdateRequestStatus(request.id, 'approved')}
                                className="text-green-600 hover:text-green-900 p-1 rounded transition-colors duration-200"
                                title="Approve"
                              >
                                <Check className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => handleUpdateRequestStatus(request.id, 'rejected')}
                                className="text-red-600 hover:text-red-900 p-1 rounded transition-colors duration-200"
                                title="Reject"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                      No club requests found matching your criteria
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      )}
      
      <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredItems.length}</span> of{' '}
            <span className="font-medium">{filteredItems.length}</span> results
          </div>
          <div className="flex items-center space-x-2">
            <button className="px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors duration-200">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="px-3 py-1 text-sm bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors duration-200">
              1
            </button>
            <button className="px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors duration-200">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
    
    {/* Club Detail Modal */}
    {selectedClub && (
      <div className="fixed inset-0 bg-gray-900 bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[80vh] overflow-y-auto">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-900">{selectedClub.name} Details</h3>
              <button 
                onClick={() => setSelectedClub(null)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">Profile Image</h4>
                <div className="w-24 h-24 bg-gradient-to-r from-orange-400 to-red-400 rounded-lg flex items-center justify-center">
                  {selectedClub.profileImage ? (
                    <img 
                      src={selectedClub.profileImage} 
                      alt={selectedClub.name}
                      className="w-24 h-24 rounded-lg object-cover"
                    />
                  ) : (
                    <Users className="w-12 h-12 text-white" />
                  )}
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">Club Status</h4>
                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-sm font-medium ${
                  selectedClub.isActive && !selectedClub.isDeleted
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {selectedClub.isActive && !selectedClub.isDeleted ? 'Active' : 'Inactive'}
                </span>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">About</h4>
                <p className="text-gray-900">{selectedClub.about || "No description provided."}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">Created At</h4>
                <p className="text-gray-900">{new Date(selectedClub.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-medium">Actions</h4>
              <div className="flex space-x-3">
                <button className="px-4 py-2 bg-orange-100 text-orange-600 rounded-md hover:bg-orange-200 transition-colors">
                  Edit Details
                </button>
                {selectedClub.isActive ? (
                  <button className="px-4 py-2 bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200 transition-colors">
                    Deactivate Club
                  </button>
                ) : (
                  <button className="px-4 py-2 bg-green-100 text-green-600 rounded-md hover:bg-green-200 transition-colors">
                    Activate Club
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    )}
    
    {/* Club Request Detail Modal */}
    {selectedRequest && (
      <div className="fixed inset-0 bg-gray-900 bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[80vh] overflow-y-auto">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-900">{selectedRequest.clubName} Request</h3>
              <button 
                onClick={() => setSelectedRequest(null)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">Request Status</h4>
                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-sm font-medium ${
                  selectedRequest.requestStatus === 'approved' 
                    ? 'bg-green-100 text-green-800' 
                    : selectedRequest.requestStatus === 'pending' 
                    ? 'bg-yellow-100 text-yellow-800'
                    : selectedRequest.requestStatus === 'underReview'
                    ? 'bg-blue-100 text-blue-800'
                    : selectedRequest.requestStatus === 'needsMoreInfo'
                    ? 'bg-purple-100 text-purple-800'
                    : selectedRequest.requestStatus === 'rejected'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {selectedRequest.requestStatus === 'underReview' 
                    ? 'Under Review'
                    : selectedRequest.requestStatus === 'needsMoreInfo'
                    ? 'Needs More Info'
                    : selectedRequest.requestStatus.charAt(0).toUpperCase() + selectedRequest.requestStatus.slice(1)}
                </span>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">Club Type</h4>
                <p className="text-gray-900">
                  {selectedRequest.clubType.charAt(0).toUpperCase() + selectedRequest.clubType.slice(1)}
                </p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">Category</h4>
                <p className="text-gray-900">
                  {selectedRequest.clubCategory === 'communityBased' ? 'Community Based' : 'Institute Based'}
                </p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">Requested By</h4>
                <p className="text-gray-900">{selectedRequest.requestedBy.firstName} {selectedRequest.requestedBy.lastName}</p>
                <p className="text-gray-500 text-sm">{selectedRequest.requestedBy.email}</p>
              </div>
              
              <div className="col-span-2">
                <h4 className="text-sm font-medium text-gray-500 mb-1">Description</h4>
                <p className="text-gray-900">{selectedRequest.description}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">Documents</h4>
                <div className="space-y-2">
                  {selectedRequest.constitutionDoc && (
                    <a 
                      href={selectedRequest.constitutionDoc}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-2 text-orange-600 hover:text-orange-800"
                    >
                      <FileText className="w-4 h-4" />
                      <span>Constitution Document</span>
                    </a>
                  )}
                  {selectedRequest.idProofDocument && (
                    <div>
                      <a 
                        href={selectedRequest.idProofDocument}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-2 text-orange-600 hover:text-orange-800"
                      >
                        <FileText className="w-4 h-4" />
                        <span>ID Proof</span>
                      </a>
                    </div>
                  )}
                  {selectedRequest.approvalLetter && (
                    <div>
                      <a 
                        href={selectedRequest.approvalLetter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-2 text-orange-600 hover:text-orange-800"
                      >
                        <FileText className="w-4 h-4" />
                        <span>Approval Letter</span>
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {(selectedRequest.requestStatus !== 'approved' && selectedRequest.requestStatus !== 'rejected') && (
              <div className="space-y-4">
                <h4 className="font-medium">Actions</h4>
                <div className="flex space-x-3">
                  <button 
                    onClick={() => handleUpdateRequestStatus(selectedRequest.id, 'approved')}
                    className="px-4 py-2 bg-green-100 text-green-600 rounded-md hover:bg-green-200 transition-colors"
                  >
                    Approve Request
                  </button>
                  <button 
                    onClick={() => handleUpdateRequestStatus(selectedRequest.id, 'rejected')}
                    className="px-4 py-2 bg-red-100 text-red-600 rounded-md hover:bg-red-200 transition-colors"
                  >
                    Reject Request
                  </button>
                  <button 
                    onClick={() => handleUpdateRequestStatus(selectedRequest.id, 'needsMoreInfo')}
                    className="px-4 py-2 bg-yellow-100 text-yellow-600 rounded-md hover:bg-yellow-200 transition-colors"
                  >
                    Request More Info
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    )}
  </div>
  );
};

export default ClubsTab;
