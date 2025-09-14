import React, { useState } from "react";
import { X, AlertTriangle, Trash2 } from "lucide-react";

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

interface DeleteEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDeleteEvent: (eventId: string) => void;
  event: Event | null;
}

const DeleteEventModal: React.FC<DeleteEventModalProps> = ({
  isOpen,
  onClose,
  onDeleteEvent,
  event,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleDelete = async () => {
    if (!event) return;
    
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(`/api/events/${event.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete event");
      }

      onDeleteEvent(event.id);
      onClose();
    } catch (err: any) {
      setError(err.message || "An error occurred while deleting the event");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen || !event) return null;

  const eventDate = new Date(event.startDateTime).toLocaleDateString();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-red-600 rounded-xl flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Delete Event</h2>
              <p className="text-sm text-gray-600">This action cannot be undone</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm mb-4">
              {error}
            </div>
          )}

          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-8 h-8 text-red-600" />
            </div>
            
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Are you sure you want to delete this event?
            </h3>
            
            <div className="bg-gray-50 rounded-xl p-4 mb-4">
              <p className="font-medium text-gray-900 mb-1">{event.title}</p>
              <p className="text-sm text-gray-600">Scheduled for {eventDate}</p>
            </div>
            
            <p className="text-sm text-gray-600">
              This will permanently delete the event and all associated data. 
              This action cannot be undone.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-6 py-3 text-gray-700 border border-gray-300 rounded-xl hover:bg-gray-50 transition-all duration-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={isLoading}
              className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Deleting...</span>
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4" />
                  <span>Delete Event</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteEventModal;
