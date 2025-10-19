import React, { useState, useEffect } from "react";
import { X, Calendar, Users, FileText, UserPlus, UserMinus } from "lucide-react";
import { useParams } from "next/navigation";

interface ClubMember {
  id: string;
  userId: string;
  role: string;
  membershipStatus: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    image?: string;
  };
}

interface CreateMinuteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateMinute: (minuteData: any) => Promise<void>;
  clubId?: string;
  loading?: boolean;
}

const CreateMinuteModal: React.FC<CreateMinuteModalProps> = ({
  isOpen,
  onClose,
  onCreateMinute,
  clubId: propClubId,
  loading = false,
}) => {
  const params = useParams();
  const clubId = propClubId || (params.id as string);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    meetingDate: "",
    attendeesCount: 0,
    attendees: [] as string[],
    attachments: [] as string[],
    status: "draft",
  });
  const [attendeeInput, setAttendeeInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [clubMembers, setClubMembers] = useState<ClubMember[]>([]);
  const [loadingMembers, setLoadingMembers] = useState(false);
  const [showMemberSelector, setShowMemberSelector] = useState(false);

  // Fetch club members
  const fetchClubMembers = async () => {
    try {
      setLoadingMembers(true);
      const response = await fetch(`/api/clubs/${clubId}/members`);
      if (!response.ok) {
        throw new Error('Failed to fetch club members');
      }
      const members = await response.json();
      setClubMembers(members);
    } catch (err) {
      console.error('Error fetching club members:', err);
    } finally {
      setLoadingMembers(false);
    }
  };

  useEffect(() => {
    if (isOpen && clubId) {
      fetchClubMembers();
    }
  }, [isOpen, clubId]);

  const handleClose = () => {
    if (!isSubmitting) {
      setFormData({
        title: "",
        content: "",
        meetingDate: "",
        attendeesCount: 0,
        attendees: [],
        attachments: [],
        status: "draft",
      });
      setAttendeeInput("");
      setError("");
      setShowMemberSelector(false);
      onClose();
    }
  };

  const addAttendee = () => {
    if (attendeeInput.trim() && !formData.attendees.includes(attendeeInput.trim())) {
      setFormData({
        ...formData,
        attendees: [...formData.attendees, attendeeInput.trim()],
        attendeesCount: formData.attendees.length + 1,
      });
      setAttendeeInput("");
    }
  };

  const addMemberAsAttendee = (member: ClubMember) => {
    const memberName = `${member.user.firstName} ${member.user.lastName}`;
    if (!formData.attendees.includes(memberName)) {
      setFormData({
        ...formData,
        attendees: [...formData.attendees, memberName],
        attendeesCount: formData.attendees.length + 1,
      });
    }
  };

  const removeAttendee = (index: number) => {
    const updatedAttendees = formData.attendees.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      attendees: updatedAttendees,
      attendeesCount: updatedAttendees.length,
    });
  };

  const isMemberSelected = (member: ClubMember) => {
    const memberName = `${member.user.firstName} ${member.user.lastName}`;
    return formData.attendees.includes(memberName);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      await onCreateMinute({
        ...formData,
        meetingDate: new Date(formData.meetingDate).toISOString(),
      });
      handleClose();
    } catch (err: any) {
      setError(err.message || "An error occurred while creating the meeting minute");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      {/* Enhanced Backdrop */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-md"
        onClick={handleClose}
      />

      {/* Modal with enhanced design */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[95vh] overflow-hidden border-2 border-gray-100 transform transition-all duration-300 animate-scale-in">
        {/* Enhanced Header */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-500 via-red-500 to-orange-600" />
          <div className="absolute inset-0 bg-gradient-to-r from-orange-50/90 to-red-50/90 backdrop-blur-sm" />

          <div className="relative flex justify-between items-center p-5">
            <div className="space-y-1">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">
                  Create Meeting Minute
                </h2>
              </div>
              <p className="text-gray-600 text-sm">
                Add a new meeting minute for your club
              </p>
            </div>
            <button
              onClick={handleClose}
              disabled={isSubmitting}
              className="p-2 hover:bg-white/20 rounded-xl transition-colors duration-200 disabled:opacity-50"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Form Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(95vh-140px)]">
          {error && (
            <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Meeting Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors duration-200"
                placeholder="Enter meeting title"
                required
              />
            </div>

            {/* Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Meeting Date *
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="datetime-local"
                  value={formData.meetingDate}
                  onChange={(e) => setFormData({ ...formData, meetingDate: e.target.value })}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors duration-200"
                  required
                />
              </div>
            </div>

            {/* Content */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Meeting Content
              </label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                rows={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors duration-200 resize-none"
                placeholder="Enter meeting minutes content..."
              />
            </div>

            {/* Attendees */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Attendees
              </label>
              
              {/* Member Selection */}
              <div className="mb-4">
                <button
                  type="button"
                  onClick={() => setShowMemberSelector(!showMemberSelector)}
                  className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl hover:from-orange-600 hover:to-red-600 transition-all duration-300 shadow-lg font-medium text-sm mb-3"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Select from Club Members</span>
                </button>

                {showMemberSelector && (
                  <div className="border border-gray-200 rounded-xl p-4 max-h-48 overflow-y-auto">
                    {loadingMembers ? (
                      <div className="text-center py-4 text-gray-500">
                        Loading members...
                      </div>
                    ) : clubMembers.length === 0 ? (
                      <div className="text-center py-4 text-gray-500">
                        No club members found
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="text-sm font-medium text-gray-700 mb-2">
                          Club Members (Active):
                        </div>
                        {clubMembers
                          .filter(member => member.membershipStatus === 'active')
                          .map((member) => (
                            <div
                              key={member.id}
                              className={`flex items-center justify-between p-3 rounded-lg border transition-all duration-200 ${
                                isMemberSelected(member)
                                  ? 'bg-orange-50 border-orange-200'
                                  : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                              }`}
                            >
                              <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                                  {member.user.firstName.charAt(0)}{member.user.lastName.charAt(0)}
                                </div>
                                <div>
                                  <div className="font-medium text-gray-900">
                                    {member.user.firstName} {member.user.lastName}
                                  </div>
                                  <div className="text-sm text-gray-500 capitalize">
                                    {member.role} • {member.user.email}
                                  </div>
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={() => addMemberAsAttendee(member)}
                                disabled={isMemberSelected(member)}
                                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors duration-200 ${
                                  isMemberSelected(member)
                                    ? 'bg-green-100 text-green-700 cursor-not-allowed'
                                    : 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                                }`}
                              >
                                {isMemberSelected(member) ? 'Added' : 'Add'}
                              </button>
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Manual Attendee Input */}
              <div className="flex space-x-2 mb-3">
                <div className="relative flex-1">
                  <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={attendeeInput}
                    onChange={(e) => setAttendeeInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAttendee())}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors duration-200"
                    placeholder="Or add attendee name manually"
                  />
                </div>
                <button
                  type="button"
                  onClick={addAttendee}
                  className="px-4 py-3 bg-orange-600 text-white rounded-xl hover:bg-orange-700 transition-colors duration-200"
                >
                  Add Manual
                </button>
              </div>
              
              {/* Attendees List */}
              {formData.attendees.length > 0 && (
                <div className="space-y-2">
                  <div className="text-sm font-medium text-gray-700">
                    Selected Attendees ({formData.attendees.length}):
                  </div>
                  <div className="max-h-32 overflow-y-auto space-y-1">
                    {formData.attendees.map((attendee, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg">
                        <span className="text-sm text-gray-700">{attendee}</span>
                        <button
                          type="button"
                          onClick={() => removeAttendee(index)}
                          className="text-red-500 hover:text-red-700 transition-colors duration-200"
                        >
                          <UserMinus className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors duration-200"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={handleClose}
                disabled={isSubmitting}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || loading}
                className="px-6 py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-xl hover:from-orange-700 hover:to-red-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Creating...</span>
                  </>
                ) : (
                  <span>Create Minute</span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateMinuteModal;
