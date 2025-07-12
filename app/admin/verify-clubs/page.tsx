'use client';

import { useState, useEffect } from 'react';

interface Club {
  id: string;
  name: string;
  description: string;
  logo?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
  updatedAt: string;
}

export default function VerifyClubsPage() {
  const [pendingClubs, setPendingClubs] = useState<Club[]>([]);
  const [approvedClubs, setApprovedClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<{type: 'success' | 'error', message: string} | null>(null);

  useEffect(() => {
    fetchClubs();
  }, []);

  // Clear status message after 5 seconds
  useEffect(() => {
    if (statusMessage) {
      const timer = setTimeout(() => {
        setStatusMessage(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [statusMessage]);

  const fetchClubs = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/clubs');
      const data = await response.json();
      
      if (response.ok) {
        setPendingClubs(data.filter((club: Club) => club.status === 'PENDING'));
        setApprovedClubs(data.filter((club: Club) => club.status === 'APPROVED'));
      } else {
        setStatusMessage({
          type: 'error', 
          message: 'Failed to fetch clubs'
        });
      }
    } catch (error) {
      console.error('Error fetching clubs:', error);
      setStatusMessage({
        type: 'error', 
        message: 'An error occurred while fetching clubs'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClubAction = async (clubId: string, status: 'APPROVED' | 'REJECTED') => {
    try {
      setActionLoading(clubId);
      const response = await fetch(`/api/clubs/${clubId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        setStatusMessage({
          type: 'success', 
          message: `Club ${status.toLowerCase()} successfully!`
        });
        fetchClubs(); // Refresh the data
      } else {
        const error = await response.json();
        setStatusMessage({
          type: 'error', 
          message: error.message || 'Failed to update club status'
        });
      }
    } catch (error) {
      console.error('Error updating club:', error);
      setStatusMessage({
        type: 'error', 
        message: 'An error occurred while updating the club'
      });
    } finally {
      setActionLoading(null);
    }
  };

  // Status message component
  const StatusMessage = () => {
    if (!statusMessage) return null;
    
    return (
      <div 
        className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 transition-all duration-300 ${
          statusMessage.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
        }`}
      >
        <div className="flex items-center">
          {statusMessage.type === 'success' ? (
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          )}
          <span>{statusMessage.message}</span>
        </div>
      </div>
    );
  };

  const LoadingSkeleton = () => (
    <div className="animate-pulse">
      <div className="bg-gray-200 rounded-xl p-6 space-y-4">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-gray-300 rounded-lg"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-300 rounded w-3/4"></div>
            <div className="h-3 bg-gray-300 rounded w-1/2"></div>
          </div>
        </div>
        <div className="space-y-2">
          <div className="h-3 bg-gray-300 rounded"></div>
          <div className="h-3 bg-gray-300 rounded w-5/6"></div>
        </div>
        <div className="flex space-x-3">
          <div className="h-10 bg-gray-300 rounded-lg w-24"></div>
          <div className="h-10 bg-gray-300 rounded-lg w-24"></div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Club Management
            </h1>
            <p className="text-xl text-gray-600">
              Review and manage club applications
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Pending Approval</h2>
              <div className="space-y-6">
                {[...Array(3)].map((_, i) => (
                  <LoadingSkeleton key={i} />
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Approved Clubs</h2>
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="animate-pulse bg-gray-200 rounded-lg p-4">
                    <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <StatusMessage />
      
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Club Management
          </h1>
          <p className="text-xl text-gray-600">
            Review and manage club applications
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Section 1: Pending Clubs */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Pending Approval</h2>
              <span className="bg-yellow-100 text-yellow-800 text-sm font-medium px-3 py-1 rounded-full">
                {pendingClubs.length} pending
              </span>
            </div>

            {pendingClubs.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">All caught up!</h3>
                <p className="text-gray-600">No clubs are pending approval at the moment.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {pendingClubs.map((club) => (
                  <div key={club.id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
                    <div className="flex items-start space-x-4 mb-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                        {club.logo ? (
                          <img src={club.logo} alt={club.name} className="w-full h-full object-cover rounded-lg" />
                        ) : (
                          club.name.charAt(0).toUpperCase()
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-1">{club.name}</h3>
                        <p className="text-sm text-gray-500">
                          Applied on {new Date(club.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <p className="text-gray-700 mb-6 leading-relaxed">
                      {club.description}
                    </p>

                    <div className="flex space-x-3">
                      <button
                        onClick={() => handleClubAction(club.id, 'APPROVED')}
                        disabled={actionLoading === club.id}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                      >
                        {actionLoading === club.id ? (
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <>
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Approve
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => handleClubAction(club.id, 'REJECTED')}
                        disabled={actionLoading === club.id}
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                      >
                        {actionLoading === club.id ? (
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <>
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            Reject
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section 2: Approved Clubs */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Approved Clubs</h2>
              <span className="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full">
                {approvedClubs.length} approved
              </span>
            </div>

            {approvedClubs.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No approved clubs yet</h3>
                <p className="text-gray-600">Approved clubs will appear here.</p>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="divide-y divide-gray-200">
                  {approvedClubs.map((club) => (
                    <div key={club.id} className="p-4 hover:bg-gray-50 transition-colors duration-200">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
                          {club.logo ? (
                            <img src={club.logo} alt={club.name} className="w-full h-full object-cover rounded-lg" />
                          ) : (
                            club.name.charAt(0).toUpperCase()
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">{club.name}</h3>
                          <p className="text-sm text-gray-500">
                            Approved on {new Date(club.updatedAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center text-green-600">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
