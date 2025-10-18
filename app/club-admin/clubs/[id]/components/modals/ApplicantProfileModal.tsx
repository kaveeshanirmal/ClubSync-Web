"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Loader2,
  AlertCircle,
  Heart,
  Briefcase,
  Link as LinkIcon,
  Star,
  Calendar,
  Award,
  BarChart2,
  User,
  ClipboardList,
} from "lucide-react";

// The basic applicant info passed from the parent
interface Applicant {
  id: string; // This is the JoinRequest ID
  name: string;
  email: string;
  userImage: string;
}

// The detailed profile data fetched from the new API endpoint
interface ProfileData {
  joinRequest: {
    motivation: string | null;
    relevantSkills: string[];
    socialLinks: string[];
  };
  user: {
    firstName: string;
    lastName: string;
    email: string;
    image: string;
    createdAt: string;
  };
  stats: {
    totalPoints: number;
    eventsParticipated: number;
    eventsOrganized: number;
  };
  eventHistory: {
    title: string;
    date: string;
  }[];
}

interface ApplicantProfileModalProps {
  applicant: Applicant;
  isOpen: boolean;
  onClose: () => void;
}

export const ApplicantProfileModal: React.FC<ApplicantProfileModalProps> = ({
  applicant,
  isOpen,
  onClose,
}) => {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      // Reset state on open for clean loading
      setIsLoading(true);
      setError(null);
      setProfile(null);

      const fetchProfileData = async () => {
        try {
          const response = await fetch(
            `/api/join-requests/${applicant.id}/profile`,
          );
          if (!response.ok) {
            throw new Error("Failed to load profile data.");
          }
          const data = await response.json();
          setProfile(data);
        } catch (err) {
          setError("Could not load applicant profile. Please try again.");
          console.error(err);
        } finally {
          setIsLoading(false);
        }
      };

      // Add a small delay to allow animation to start before fetching
      const timer = setTimeout(() => {
        fetchProfileData();
      }, 200);

      return () => clearTimeout(timer);
    }
  }, [isOpen, applicant.id]);

  if (!isOpen) {
    return null;
  }

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
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600" />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-50/90 to-indigo-50/90 backdrop-blur-sm" />
          <div className="relative flex justify-between items-center p-5">
            <div className="flex items-center space-x-4">
              <img
                src={
                  applicant.userImage ||
                  `https://ui-avatars.com/api/?name=${applicant.name}&background=random`
                }
                alt={applicant.name}
                className="w-14 h-14 rounded-full border-2 border-white shadow-md"
              />
              <div className="space-y-1">
                <h2 className="text-xl font-bold text-gray-900">
                  {applicant.name}
                </h2>
                <p className="text-gray-700 font-medium text-sm">
                  {applicant.email}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="group p-2 hover:bg-white/20 rounded-xl transition-all duration-300 hover:scale-110 hover:rotate-90"
              disabled={isLoading}
            >
              <X className="w-5 h-5 text-gray-700 group-hover:text-gray-900 transition-colors duration-300" />
            </button>
          </div>
          {/* Decorative elements */}
          <div className="absolute top-3 right-20 w-2 h-2 bg-blue-300 rounded-full animate-bounce" />
          <div className="absolute bottom-3 left-20 w-2 h-2 bg-indigo-300 rounded-full animate-pulse" />
        </div>

        {/* Content with Scrollable Area */}
        <div className="overflow-y-auto max-h-[calc(95vh-96px)] bg-gradient-to-br from-gray-50/50 to-white p-6">
          {isLoading && (
            <div className="flex justify-center items-center h-96">
              <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
            </div>
          )}
          {error && !isLoading && (
            <div className="flex flex-col justify-center items-center h-96 bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-4 border-l-4 border-red-500 shadow-lg animate-slide-in">
              <AlertCircle className="w-10 h-10 mb-3 text-red-600" />
              <p className="text-red-800 font-semibold">{error}</p>
            </div>
          )}
          {profile && !isLoading && !error && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Left Column: Application Details */}
              <div className="md:col-span-2 space-y-6">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl flex items-center justify-center transform hover:rotate-12 transition-transform duration-300">
                    <ClipboardList className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">
                    Application Details
                  </h3>
                  <div className="h-px bg-gradient-to-r from-orange-500 to-red-600 flex-1 opacity-30" />
                </div>

                <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-4 border border-gray-200 hover:shadow-lg transition-all duration-300">
                  <h3 className="font-bold text-gray-700 flex items-center mb-2 text-sm">
                    <Heart className="w-4 h-4 mr-2 text-red-500" />
                    Motivation
                  </h3>
                  <p className="text-sm text-gray-600 italic">
                    "
                    {profile.joinRequest.motivation ||
                      "No motivation provided."}
                    "
                  </p>
                </div>

                <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-4 border border-gray-200 hover:shadow-lg transition-all duration-300">
                  <h3 className="font-bold text-gray-700 flex items-center mb-3 text-sm">
                    <Briefcase className="w-4 h-4 mr-2 text-blue-500" />
                    Relevant Skills
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.joinRequest.relevantSkills.length > 0 ? (
                      profile.joinRequest.relevantSkills.map((skill) => (
                        <span
                          key={skill}
                          className="bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full"
                        >
                          {skill}
                        </span>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500">No skills listed.</p>
                    )}
                  </div>
                </div>

                <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-4 border border-gray-200 hover:shadow-lg transition-all duration-300">
                  <h3 className="font-bold text-gray-700 flex items-center mb-3 text-sm">
                    <LinkIcon className="w-4 h-4 mr-2 text-green-500" />
                    Social & Professional Links
                  </h3>
                  <div className="flex flex-col space-y-2">
                    {profile.joinRequest.socialLinks.length > 0 ? (
                      profile.joinRequest.socialLinks.map((link) => (
                        <a
                          href={link}
                          target="_blank"
                          rel="noopener noreferrer"
                          key={link}
                          className="text-sm text-blue-600 hover:underline truncate max-w-full"
                        >
                          {link}
                        </a>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500">
                        No links provided.
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column: Volunteering History & Stats */}
              <div className="space-y-6">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center transform hover:rotate-12 transition-transform duration-300">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">
                    User History
                  </h3>
                  <div className="h-px bg-gradient-to-r from-green-500 to-emerald-600 flex-1 opacity-30" />
                </div>
                <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-4 border border-gray-200 hover:shadow-lg transition-all duration-300">
                  <h3 className="font-bold text-gray-700 flex items-center mb-3 text-sm">
                    <BarChart2 className="w-4 h-4 mr-2 text-indigo-500" />
                    Platform Statistics
                  </h3>
                  <div className="space-y-2.5">
                    <div className="flex justify-between items-center text-sm">
                      <span className="flex items-center text-gray-600 font-medium">
                        <Star className="w-4 h-4 mr-2 text-yellow-500" />
                        Total Points
                      </span>
                      <span className="font-bold text-gray-900 bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full text-xs">
                        {profile.stats.totalPoints}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="flex items-center text-gray-600 font-medium">
                        <Award className="w-4 h-4 mr-2 text-green-500" />
                        Participated
                      </span>
                      <span className="font-bold text-gray-900 bg-green-100 text-green-800 px-2 py-0.5 rounded-full text-xs">
                        {profile.stats.eventsParticipated}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="flex items-center text-gray-600 font-medium">
                        <Briefcase className="w-4 h-4 mr-2 text-purple-500" />
                        Organized
                      </span>
                      <span className="font-bold text-gray-900 bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full text-xs">
                        {profile.stats.eventsOrganized}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-4 border border-gray-200 hover:shadow-lg transition-all duration-300">
                  <h3 className="font-bold text-gray-700 flex items-center mb-3 text-sm">
                    <Calendar className="w-4 h-4 mr-2 text-red-500" />
                    Recent Events
                  </h3>
                  <ul className="space-y-3">
                    {profile.eventHistory.length > 0 ? (
                      profile.eventHistory.slice(0, 5).map(
                        (
                          event,
                          i, // Show max 5 events
                        ) => (
                          <li
                            key={`${event.title}-${i}`}
                            className="text-sm border-l-2 border-gray-200 pl-3"
                          >
                            <p className="font-semibold text-gray-800">
                              {event.title}
                            </p>
                            <p className="text-xs text-gray-500">
                              {new Date(event.date).toLocaleDateString(
                                "en-US",
                                {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                },
                              )}
                            </p>
                          </li>
                        ),
                      )
                    ) : (
                      <p className="text-sm text-gray-500">
                        No recent event history found.
                      </p>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        @keyframes slide-in {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }
        .animate-scale-in {
          animation: scale-in 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
        .animate-slide-in {
          animation: slide-in 0.4s ease-out forwards;
        }
      `}</style>
    </div>
  );
};
