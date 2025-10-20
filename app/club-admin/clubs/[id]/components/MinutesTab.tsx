import { Plus, FileText, Edit, Eye, Loader2, X, Calendar, Users } from "lucide-react";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import CreateMinuteModal from "./modals/CreateMinuteModal";
import EditMinuteModal from "./modals/EditMinuteModal";
import ViewMinuteModal from "./modals/ViewMinuteModal";
import BeautifulLoader from "@/components/Loader";

interface MeetingMinute {
  id: string;
  title: string;
  content?: string;
  meetingDate: string;
  attendeesCount?: number;
  attendees: string[];
  attachments: string[];
  status: string;
  createdAt: string;
  updatedAt: string;
  createdBy: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  club: {
    name: string;
  };
}

interface MinutesTabProps {
  clubId?: string;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "published":
      return "bg-green-100 text-green-800";
    case "draft":
      return "bg-gray-100 text-gray-800";
    case "archived":
      return "bg-blue-100 text-blue-800";
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const MinutesTab: React.FC<MinutesTabProps> = ({ clubId: propClubId }) => {
  const params = useParams();
  const clubId = propClubId || (params.id as string);

  const [meetingMinutes, setMeetingMinutes] = useState<MeetingMinute[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedMinute, setSelectedMinute] = useState<MeetingMinute | null>(null);
  
  // Toast state
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Fetch meeting minutes
  const fetchMeetingMinutes = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/clubs/${clubId}/minutes`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch meeting minutes');
      }
      
      const data = await response.json();
      setMeetingMinutes(data);
    } catch (err: any) {
      setError(err.message || 'An error occurred while fetching meeting minutes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (clubId) {
      fetchMeetingMinutes();
    }
  }, [clubId]);

  // Handle create minute
  const handleCreateMinute = async (minuteData: any) => {
    try {
      const response = await fetch(`/api/clubs/${clubId}/minutes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(minuteData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create meeting minute');
      }

      await fetchMeetingMinutes();
      setToast({ message: 'Meeting minute created successfully', type: 'success' });
    } catch (err: any) {
      setToast({ message: err.message || 'Failed to create meeting minute', type: 'error' });
      throw err;
    }
  };

  // Handle update minute
  const handleUpdateMinute = async (minuteId: string, minuteData: any) => {
    try {
      const response = await fetch(`/api/clubs/${clubId}/minutes/${minuteId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(minuteData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update meeting minute');
      }

      await fetchMeetingMinutes();
      setToast({ message: 'Meeting minute updated successfully', type: 'success' });
    } catch (err: any) {
      setToast({ message: err.message || 'Failed to update meeting minute', type: 'error' });
      throw err;
    }
  };

  // Handle view minute
  const handleViewMinute = async (minute: MeetingMinute) => {
    try {
      const response = await fetch(`/api/clubs/${clubId}/minutes/${minute.id}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch meeting minute details');
      }
      
      const minuteData = await response.json();
      setSelectedMinute(minuteData);
      setIsViewModalOpen(true);
    } catch (err: any) {
      setToast({ message: err.message || 'Failed to fetch meeting minute', type: 'error' });
    }
  };

  // Handle edit minute
  const handleEditMinute = (minute: MeetingMinute) => {
    setSelectedMinute(minute);
    setIsEditModalOpen(true);
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Close toast
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  return (
    <div className="space-y-6">
      {/* Header with Action Button */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
            <FileText className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Meeting Minutes</h3>
            <p className="text-sm text-gray-600">Manage club meeting records</p>
          </div>
        </div>
        <button 
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl hover:from-orange-600 hover:to-red-600 transition-all duration-300 shadow-lg font-medium text-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add Minutes</span>
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div>
          <BeautifulLoader
            type="morphing"
            message="Loading Meeting Minutes"
            subMessage="Fetching club meeting data"
          />
        </div>
      ) : (
        <>
          {meetingMinutes.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                No Meeting Minutes Yet
              </h4>
              <p className="text-gray-600 mb-4 max-w-md mx-auto">
                Get started by creating your first meeting minute record
              </p>
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl hover:from-orange-600 hover:to-red-600 transition-all duration-300 shadow-lg font-medium text-sm mx-auto"
              >
                <Plus className="w-4 h-4" />
                <span>Create Your First Minute</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {meetingMinutes.map((minute) => (
                <div
                  key={minute.id}
                  className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-300"
                >
                  {/* Minute Header */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h4 className="font-bold text-gray-900 text-lg">
                          {minute.title}
                        </h4>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(minute.status)}`}
                        >
                          {minute.status.charAt(0).toUpperCase() + minute.status.slice(1)}
                        </span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500 space-x-4">
                        <span className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1 text-blue-500" />
                          {formatDate(minute.meetingDate)}
                        </span>
                        <span className="flex items-center">
                          <Users className="w-4 h-4 mr-1 text-green-500" />
                          {minute.attendeesCount || minute.attendees.length} attendees
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => handleViewMinute(minute)}
                      className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                      title="View Minute"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleEditMinute(minute)}
                      className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all duration-200"
                      title="Edit Minute"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-4 rounded-xl shadow-lg transition-all duration-300 ${
          toast.type === 'success' 
            ? 'bg-green-500 text-white' 
            : 'bg-red-500 text-white'
        }`}>
          <div className="flex items-center space-x-2">
            <span>{toast.message}</span>
            <button 
              onClick={() => setToast(null)}
              className="text-white hover:text-gray-200 transition-colors duration-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Modals */}
      <CreateMinuteModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreateMinute={handleCreateMinute}
        clubId={clubId}
        loading={loading}
      />

      <EditMinuteModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedMinute(null);
        }}
        onUpdateMinute={handleUpdateMinute}
        minute={selectedMinute}
        loading={loading}
      />

      <ViewMinuteModal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setSelectedMinute(null);
        }}
        minute={selectedMinute}
      />
    </div>
  );
};

export default MinutesTab;
