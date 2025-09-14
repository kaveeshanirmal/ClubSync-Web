import React, { useState, useEffect } from "react";
import { X, Calendar, Users, MapPin, Clock, FileText, Save, Search } from "lucide-react";

interface Event {
  id: string;
  title: string;
  subtitle?: string;
  category: string;
  description?: string;
  startDateTime: string;
  endDateTime?: string;
  venue?: string;
  eventOrganizerId?: string;
  maxParticipants?: number;
  registrations?: { id: string }[];
}

interface EditEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdateEvent: (eventData: any) => void;
  event: Event | null;
}

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

const EditEventModal: React.FC<EditEventModalProps> = ({
  isOpen,
  onClose,
  onUpdateEvent,
  event,
}) => {
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    category: "other",
    description: "",
    startDateTime: "",
    endDateTime: "",
    venue: "",
    eventOrganizerId: "",
    maxParticipants: "",
  });

  const [users, setUsers] = useState<User[]>([]);
  const [selectedOrganizer, setSelectedOrganizer] = useState<User | null>(null);
  const [isOrganizerDropdownOpen, setIsOrganizerDropdownOpen] = useState(false);
  const [organizerSearch, setOrganizerSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [error, setError] = useState("");

  const eventCategories = [
    { value: "workshop", label: "Workshop" },
    { value: "seminar", label: "Seminar" },
    { value: "competition", label: "Competition" },
    { value: "social", label: "Social" },
    { value: "fundraising", label: "Fundraising" },
    { value: "meeting", label: "Meeting" },
    { value: "conference", label: "Conference" },
    { value: "other", label: "Other" },
  ];

  // Get current date/time for validation
  const getCurrentDateTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const fetchUsers = async () => {
    try {
      setIsLoadingUsers(true);
      const response = await fetch("/api/users/select");
      
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users || []);
      }
    } catch (err) {
      console.error("Failed to fetch users:", err);
    } finally {
      setIsLoadingUsers(false);
    }
  };

  // Initialize form data when event changes
  useEffect(() => {
    if (event && isOpen) {
      const startDateTime = new Date(event.startDateTime);
      const endDateTime = event.endDateTime ? new Date(event.endDateTime) : null;
      
      // Format datetime for input fields
      const formatDateTimeForInput = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${year}-${month}-${day}T${hours}:${minutes}`;
      };

      setFormData({
        title: event.title,
        subtitle: event.subtitle || "",
        category: event.category,
        description: event.description || "",
        startDateTime: formatDateTimeForInput(startDateTime),
        endDateTime: endDateTime ? formatDateTimeForInput(endDateTime) : "",
        venue: event.venue || "",
        eventOrganizerId: event.eventOrganizerId || "",
        maxParticipants: event.maxParticipants ? event.maxParticipants.toString() : "",
      });

      // Fetch users and set organizer
      fetchUsers();
    }
  }, [event, isOpen]);

  // Set organizer after users are loaded
  useEffect(() => {
    if (event && event.eventOrganizerId && users.length > 0) {
      const organizer = users.find(user => user.id === event.eventOrganizerId);
      if (organizer) {
        setSelectedOrganizer(organizer);
        setOrganizerSearch(`${organizer.firstName} ${organizer.lastName}`);
      }
    }
  }, [users, event]);

  const filteredUsers = users.filter(user =>
    `${user.firstName} ${user.lastName}`.toLowerCase().includes(organizerSearch.toLowerCase()) ||
    user.email.toLowerCase().includes(organizerSearch.toLowerCase())
  );

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

    // If start date changes, ensure end date is not before it
    if (name === 'startDateTime' && value && formData.endDateTime) {
      const startDate = new Date(value);
      const endDate = new Date(formData.endDateTime);
      if (endDate < startDate) {
        setFormData(prev => ({
          ...prev,
          endDateTime: value, // Set end date to start date
        }));
      }
    }
  };

  const handleOrganizerSelect = (user: User) => {
    setSelectedOrganizer(user);
    setFormData(prev => ({
      ...prev,
      eventOrganizerId: user.id,
    }));
    setOrganizerSearch(`${user.firstName} ${user.lastName}`);
    setIsOrganizerDropdownOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!event) return;
    
    setIsLoading(true);
    setError("");

    try {
      // Validate that end date is not before start date
      if (formData.endDateTime && formData.startDateTime) {
        const startDate = new Date(formData.startDateTime);
        const endDate = new Date(formData.endDateTime);
        if (endDate < startDate) {
          setError("End date cannot be before start date");
          setIsLoading(false);
          return;
        }
      }

      // Validate that start date is not in the past
      const startDate = new Date(formData.startDateTime);
      const now = new Date();
      if (startDate < now) {
        setError("Start date cannot be in the past");
        setIsLoading(false);
        return;
      }

      const eventData = {
        ...formData,
        maxParticipants: formData.maxParticipants ? parseInt(formData.maxParticipants) : null,
      };

      const response = await fetch(`/api/events/${event.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(eventData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update event");
      }

      const result = await response.json();
      onUpdateEvent(result.event);
      
      onClose();
    } catch (err: any) {
      setError(err.message || "An error occurred while updating the event");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen || !event) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Edit Event</h2>
              <p className="text-sm text-gray-600">Update event details</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
              {error}
            </div>
          )}

          {/* Event Title */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Event Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              placeholder="Enter event title"
            />
          </div>

          {/* Event Subtitle */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Event Subtitle
            </label>
            <input
              type="text"
              name="subtitle"
              value={formData.subtitle}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              placeholder="Enter event subtitle (optional)"
            />
          </div>

          {/* Category and Event Organizer */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              >
                {eventCategories.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Event Organizer
              </label>
              <div className="relative">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={organizerSearch}
                    onChange={(e) => {
                      setOrganizerSearch(e.target.value);
                      setIsOrganizerDropdownOpen(true);
                    }}
                    onFocus={() => setIsOrganizerDropdownOpen(true)}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    placeholder="Search for an organizer (optional)..."
                  />
                </div>
                
                {isOrganizerDropdownOpen && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                    {isLoadingUsers ? (
                      <div className="p-4 text-center text-gray-500">
                        <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                        Loading users...
                      </div>
                    ) : filteredUsers.length > 0 ? (
                      filteredUsers.map((user) => (
                        <button
                          key={user.id}
                          type="button"
                          onClick={() => handleOrganizerSelect(user)}
                          className="w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors duration-200"
                        >
                          <div className="font-medium text-gray-900">
                            {user.firstName} {user.lastName}
                          </div>
                          <div className="text-sm text-gray-600">
                            {user.email} • {user.role}
                          </div>
                        </button>
                      ))
                    ) : (
                      <div className="p-4 text-center text-gray-500">
                        No users found
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 resize-none"
              placeholder="Enter event description"
            />
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Start Date & Time *
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="datetime-local"
                  name="startDateTime"
                  value={formData.startDateTime}
                  onChange={handleInputChange}
                  min={getCurrentDateTime()}
                  required
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                End Date & Time
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="datetime-local"
                  name="endDateTime"
                  value={formData.endDateTime}
                  onChange={handleInputChange}
                  min={formData.startDateTime || getCurrentDateTime()}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                />
              </div>
            </div>
          </div>

          {/* Venue and Max Participants */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Venue
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="venue"
                  value={formData.venue}
                  onChange={handleInputChange}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  placeholder="Enter venue"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Max Participants
              </label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="number"
                  name="maxParticipants"
                  value={formData.maxParticipants}
                  onChange={handleInputChange}
                  min="1"
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  placeholder="Enter max participants"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 text-gray-700 border border-gray-300 rounded-xl hover:bg-gray-50 transition-all duration-300 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 shadow-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Updating...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Update Event</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
      
      {/* Click outside to close organizer dropdown */}
      {isOrganizerDropdownOpen && (
        <div
          className="fixed inset-0 z-5"
          onClick={() => setIsOrganizerDropdownOpen(false)}
        />
      )}
    </div>
  );
};

export default EditEventModal;
