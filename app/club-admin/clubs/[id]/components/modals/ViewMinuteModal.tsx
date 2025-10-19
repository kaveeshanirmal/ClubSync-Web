import React from "react";
import { X, Calendar, Users, FileText, User } from "lucide-react";

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
    firstName: string;
    lastName: string;
    email: string;
  };
  club: {
    name: string;
  };
}

interface ViewMinuteModalProps {
  isOpen: boolean;
  onClose: () => void;
  minute: MeetingMinute | null;
}

const ViewMinuteModal: React.FC<ViewMinuteModalProps> = ({
  isOpen,
  onClose,
  minute,
}) => {
  if (!isOpen || !minute) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "bg-green-100 text-green-800";
      case "draft":
        return "bg-gray-100 text-gray-800";
      case "archived":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      {/* Enhanced Backdrop */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Modal with enhanced design */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[95vh] overflow-hidden border-2 border-gray-100 transform transition-all duration-300 animate-scale-in">
        {/* Enhanced Header */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-500 via-red-500 to-orange-600" />
          <div className="absolute inset-0 bg-gradient-to-r from-orange-50/90 to-red-50/90 backdrop-blur-sm" />

          <div className="relative flex justify-between items-center p-5">
            <div className="space-y-1 flex-1">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 truncate">
                  {minute.title}
                </h2>
              </div>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <span className="font-medium">Club:</span>
                  <span>{minute.club.name}</span>
                </div>
                <span
                  className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(minute.status)}`}
                >
                  {minute.status.charAt(0).toUpperCase() + minute.status.slice(1)}
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-xl transition-colors duration-200"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(95vh-140px)]">
          <div className="space-y-6">
            {/* Meeting Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl">
                <Calendar className="w-5 h-5 text-gray-600" />
                <div>
                  <div className="text-sm font-medium text-gray-700">Meeting Date</div>
                  <div className="text-gray-900">{formatDate(minute.meetingDate)}</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl">
                <Users className="w-5 h-5 text-gray-600" />
                <div>
                  <div className="text-sm font-medium text-gray-700">Attendees</div>
                  <div className="text-gray-900">
                    {minute.attendeesCount || minute.attendees.length} people
                  </div>
                </div>
              </div>
            </div>

            {/* Created By */}
            <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl">
              <User className="w-5 h-5 text-gray-600" />
              <div>
                <div className="text-sm font-medium text-gray-700">Created By</div>
                <div className="text-gray-900">
                  {minute.createdBy.firstName} {minute.createdBy.lastName}
                </div>
              </div>
            </div>

            {/* Attendees List */}
            {minute.attendees.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Attendees</h3>
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {minute.attendees.map((attendee, index) => (
                      <div key={index} className="flex items-center space-x-2 text-sm text-gray-700">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>{attendee}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Meeting Content */}
            {minute.content && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Meeting Minutes</h3>
                <div className="bg-gray-50 rounded-xl p-6">
                  <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-wrap">
                    {minute.content}
                  </div>
                </div>
              </div>
            )}

            {/* Attachments */}
            {minute.attachments.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Attachments</h3>
                <div className="space-y-2">
                  {minute.attachments.map((attachment, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <FileText className="w-5 h-5 text-gray-600" />
                      <a
                        href={attachment}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 underline text-sm"
                      >
                        Attachment {index + 1}
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Metadata */}
            <div className="pt-4 border-t border-gray-200">
              <div className="text-xs text-gray-500 space-y-1">
                <div>Created: {formatDate(minute.createdAt)}</div>
                <div>Last Updated: {formatDate(minute.updatedAt)}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewMinuteModal;
