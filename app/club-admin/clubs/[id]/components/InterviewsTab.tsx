"use client";

import {
  Calendar,
  Link as LinkIcon,
  Settings,
  Eye,
  Mail,
  AlertCircle,
  Loader2,
} from "lucide-react";
import React, { useState, useEffect } from "react";
import BeautifulLoader from "@/components/Loader";
// Import the new modal component
import { ApplicantProfileModal } from "./modals/ApplicantProfileModal";

// Updated Applicant interface to match the full API response
interface Applicant {
  id: string;
  name: string;
  email: string;
  status: "pendingReview" | "interviewPending" | "approved" | "declined";
  submittedAt: string;
  motivation: string | null;
  relevantSkills: string[];
  socialLinks: string[];
  userImage: string;
}

// The component now only needs the clubId to fetch its own data
interface InterviewsTabProps {
  clubId: string;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "approved":
      return "bg-green-100 text-green-800";
    case "pendingReview":
      return "bg-yellow-100 text-yellow-800";
    case "interviewPending":
      return "bg-blue-100 text-blue-800";
    case "declined":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const InterviewsTab: React.FC<InterviewsTabProps> = ({ clubId }) => {
  // Data state
  const [interviewScheduleUrl, setInterviewScheduleUrl] = useState<
    string | null
  >(null);
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // UI state
  const [urlInput, setUrlInput] = useState("");
  const [isEditingUrl, setIsEditingUrl] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [sendingInvites, setSendingInvites] = useState<Set<string>>(new Set());

  // State for managing the profile modal
  const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(
    null,
  );

  // Data fetching on component mount
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [scheduleRes, applicantsRes] = await Promise.all([
          fetch(`/api/clubs/${clubId}/interview-schedule`),
          fetch(`/api/clubs/${clubId}/join-requests`),
        ]);

        if (!scheduleRes.ok || !applicantsRes.ok) {
          throw new Error("Failed to fetch initial data");
        }

        const scheduleData = await scheduleRes.json();
        const applicantsData = await applicantsRes.json();

        setInterviewScheduleUrl(scheduleData.interviewScheduleUrl);
        setUrlInput(scheduleData.interviewScheduleUrl || "");
        setApplicants(applicantsData);
      } catch (err) {
        setError("An error occurred while loading data. Please try again.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    if (clubId) {
      fetchData();
    }
  }, [clubId]);

  // API call to save the URL
  const handleSaveUrl = async () => {
    if (!urlInput.trim()) return;
    setIsSaving(true);
    try {
      const response = await fetch(`/api/clubs/${clubId}/interview-schedule`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ interviewScheduleUrl: urlInput.trim() }),
      });
      if (!response.ok) throw new Error("Failed to save URL");
      const data = await response.json();
      setInterviewScheduleUrl(data.interviewScheduleUrl);
      setIsEditingUrl(false);
    } catch (error) {
      console.error("Failed to save schedule URL:", error);
    } finally {
      setIsSaving(false);
    }
  };

  // API call to send an invite (updates status)
  const handleSendInvite = async (applicantId: string) => {
    setSendingInvites((prev) => new Set(prev).add(applicantId));
    try {
      const response = await fetch(`/api/join-requests/${applicantId}/invite`, {
        method: "POST",
      });
      if (!response.ok) throw new Error("Failed to send invite");
      setApplicants((currentApplicants) =>
        currentApplicants.map((app) =>
          app.id === applicantId ? { ...app, status: "interviewPending" } : app,
        ),
      );
    } catch (error) {
      console.error("Failed to send invite:", error);
    } finally {
      setSendingInvites((prev) => {
        const next = new Set(prev);
        next.delete(applicantId);
        return next;
      });
    }
  };

  if (isLoading) {
    return (
      <div>
        <BeautifulLoader
          type="morphing"
          message="Loading interviews"
          subMessage="Please wait a moment while we fetch the data."
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-64 bg-red-50 text-red-700 rounded-lg p-4 text-center">
        <AlertCircle className="w-8 h-8 mb-2" />
        <p className="font-semibold">{error}</p>
      </div>
    );
  }

  // Setup View - Rendered if URL is not set
  if (!interviewScheduleUrl) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center transform hover:rotate-12 transition-transform duration-300">
            <Calendar className="w-4 h-4 text-white" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">
            Interview Management
          </h3>
          <div className="h-px bg-gradient-to-r from-blue-500 to-indigo-600 flex-1 opacity-30" />
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-indigo-50 rounded-2xl shadow-lg border-2 border-blue-100 p-8">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-200 to-indigo-200 rounded-full -mr-16 -mt-16 opacity-20" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-indigo-200 to-blue-200 rounded-full -ml-12 -mb-12 opacity-20" />
            <div className="relative z-10">
              <div className="flex items-center justify-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Calendar className="w-8 h-8 text-white" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 text-center mb-3">
                Set Up Your Interview Schedule
              </h2>
              <p className="text-gray-600 text-center mb-8">
                Configure your Google Calendar appointment schedule to
                streamline the interview process.
              </p>
              <div className="space-y-6 mb-8">
                <div className="flex items-start space-x-4 bg-white rounded-xl p-4 border border-blue-100 shadow-sm">
                  <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">
                      Create Appointment Schedule
                    </h4>
                    <p className="text-sm text-gray-600">
                      Go to your Google Calendar and create an &apos;Appointment
                      schedule&apos; for interviews.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4 bg-white rounded-xl p-4 border border-blue-100 shadow-sm">
                  <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">
                      Configure Availability
                    </h4>
                    <p className="text-sm text-gray-600">
                      Set your availability (e.g., 30-minute slots on specific
                      days and times).
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4 bg-white rounded-xl p-4 border border-blue-100 shadow-sm">
                  <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">
                      Get Booking Page Link
                    </h4>
                    <p className="text-sm text-gray-600">
                      Click &apos;Share&apos;, copy the &apos;Single booking
                      page&apos; link, and paste it below.
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl p-6 border border-blue-100 shadow-sm">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  <div className="flex items-center space-x-2 mb-2">
                    <LinkIcon className="w-4 h-4 text-blue-600" />
                    <span>Google Calendar Booking Page Link</span>
                  </div>
                </label>
                <input
                  type="url"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="https://calendar.app.google/..."
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50"
                />
                <p className="mt-2 text-xs text-gray-500 flex items-center space-x-1">
                  <AlertCircle className="w-3 h-3" />
                  <span>
                    This link will be sent to applicants when you invite them
                    for an interview.
                  </span>
                </p>
              </div>
              <button
                onClick={handleSaveUrl}
                disabled={!urlInput.trim() || isSaving}
                className="w-full mt-6 group flex items-center justify-center space-x-2 px-6 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                <Calendar className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                <span>{isSaving ? "Saving..." : "Save and Continue"}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Operational View - Applicant list with invite functionality
  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center transform hover:rotate-12 transition-transform duration-300">
              <Calendar className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">
              Interview Management
            </h3>
          </div>
          <button
            onClick={() => setIsEditingUrl(!isEditingUrl)}
            className="group flex items-center space-x-2 px-4 py-2 bg-white border-2 border-gray-200 text-gray-700 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-all duration-300 transform hover:scale-105 font-medium text-sm"
          >
            <Settings className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
            <span>Schedule Settings</span>
          </button>
        </div>

        {isEditingUrl && (
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border-2 border-blue-100 shadow-sm animate-fadeIn">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              <div className="flex items-center space-x-2 mb-2">
                <LinkIcon className="w-4 h-4 text-blue-600" />
                <span>Update Google Calendar Booking Link</span>
              </div>
            </label>
            <div className="flex space-x-3">
              <input
                type="url"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://calendar.google.com/calendar/appointments/..."
                className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white"
              />
              <button
                onClick={handleSaveUrl}
                disabled={
                  !urlInput.trim() ||
                  isSaving ||
                  urlInput === interviewScheduleUrl
                }
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? "Saving..." : "Update"}
              </button>
            </div>
            <p className="mt-2 text-xs text-gray-600">
              Current link:{" "}
              <span className="font-mono text-blue-600 truncate">
                {interviewScheduleUrl}
              </span>
            </p>
          </div>
        )}

        <div className="relative overflow-hidden bg-white rounded-2xl shadow-sm border-2 border-gray-100">
          <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full -mr-8 -mt-8 opacity-30" />
          {applicants.length === 0 ? (
            <div className="py-16 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Calendar className="w-8 h-8 text-gray-400" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                No Applicants Yet
              </h4>
              <p className="text-sm text-gray-500">
                When members apply to join your club, they&apos;ll appear here
                for review.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-br from-gray-50 to-white">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-b-2 border-gray-100">
                      Applicant Name
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-b-2 border-gray-100">
                      Submitted On
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-b-2 border-gray-100">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-b-2 border-gray-100">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {applicants.map((applicant) => {
                    const isSendingInvite = sendingInvites.has(applicant.id);
                    const canSendInvite = applicant.status === "pendingReview";
                    return (
                      <tr
                        key={applicant.id}
                        className="hover:bg-gray-50/50 transition-colors duration-200"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-3">
                            <img
                              src={
                                applicant.userImage ||
                                `https://ui-avatars.com/api/?name=${applicant.name}`
                              }
                              alt={applicant.name}
                              className="w-10 h-10 rounded-full"
                            />
                            <div>
                              <div className="text-sm font-semibold text-gray-900">
                                {applicant.name}
                              </div>
                              <div className="text-xs text-gray-500">
                                {applicant.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-700">
                            {formatDate(applicant.submittedAt)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(applicant.status)}`}
                          >
                            {applicant.status.charAt(0).toUpperCase() +
                              applicant.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                          <button
                            onClick={() => setSelectedApplicant(applicant)}
                            className="group px-3 py-1.5 bg-gradient-to-b from-white to-gray-50 border border-gray-200 rounded-lg hover:from-gray-50 hover:to-gray-100 hover:border-gray-300 hover:shadow-sm transition-all duration-300 text-gray-700 hover:text-gray-900"
                          >
                            <span className="flex items-center space-x-1.5 group-hover:scale-105 transition-transform duration-300">
                              <Eye className="w-3.5 h-3.5" />
                              <span>View Profile</span>
                            </span>
                          </button>
                          <button
                            onClick={() => handleSendInvite(applicant.id)}
                            disabled={!canSendInvite || isSendingInvite}
                            className={`group px-3 py-1.5 rounded-lg transition-all duration-300 ${canSendInvite ? "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white hover:shadow-md" : "bg-gray-100 text-gray-400 cursor-not-allowed"}`}
                          >
                            <span className="flex items-center space-x-1.5 group-hover:scale-105 transition-transform duration-300">
                              {isSendingInvite ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              ) : (
                                <Mail className="w-3.5 h-3.5" />
                              )}
                              <span>
                                {isSendingInvite
                                  ? "Sending..."
                                  : "Send Interview Invite"}
                              </span>
                            </span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
        <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-blue-900 mb-1">
                How It Works
              </h4>
              <p className="text-xs text-blue-700">
                When you click &quot;Send Interview Invite&quot;, the
                applicant&apos;s status is updated to &apos;Interview
                pending&apos;. The email functionality to send the booking link
                can be integrated next.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* RENDER THE MODAL */}
      {selectedApplicant && (
        <ApplicantProfileModal
          applicant={selectedApplicant}
          isOpen={!!selectedApplicant}
          onClose={() => setSelectedApplicant(null)}
        />
      )}
    </>
  );
};

export default InterviewsTab;
