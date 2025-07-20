"use client";
import React from "react";
import { X, Calendar, Users, Award } from "lucide-react";

interface Election {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  year: number;
  votingStart: string;
  votingEnd: string;
  positions: {
    id: string;
    name: string;
    description?: string;
    candidates: {
      id: string;
      name: string;
      image: string;
      vision?: string;
      experience?: string;
    }[];
  }[];
  _count: {
    tokens: number;
  };
}

interface ViewElectionModalProps {
  election: Election;
  isOpen: boolean;
  onClose: () => void;
}

const ViewElectionModal: React.FC<ViewElectionModalProps> = ({
  election,
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getElectionStatus = (votingStart: string, votingEnd: string) => {
    const now = new Date();
    const start = new Date(votingStart);
    const end = new Date(votingEnd);

    if (now < start) return "upcoming";
    if (now >= start && now <= end) return "active";
    return "completed";
  };

  const status = getElectionStatus(election.votingStart, election.votingEnd);

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
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-gray-900 flex items-center space-x-3">
                <div className="w-7 h-7 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">🗳️</span>
                </div>
                <span>{election.title}</span>
              </h2>
              {election.subtitle && (
                <p className="text-gray-700 font-medium ml-10 text-sm">
                  {election.subtitle}
                </p>
              )}
            </div>
            <button
              onClick={onClose}
              className="group p-2 hover:bg-white/20 rounded-xl transition-all duration-300 hover:scale-110 hover:rotate-90"
            >
              <X className="w-5 h-5 text-gray-700 group-hover:text-gray-900 transition-colors duration-300" />
            </button>
          </div>

          {/* Decorative elements */}
          <div className="absolute top-3 right-16 w-2 h-2 bg-orange-300 rounded-full animate-bounce" />
          <div className="absolute bottom-3 left-16 w-2 h-2 bg-red-300 rounded-full animate-pulse" />
        </div>

        {/* Content with Scrollable Area */}
        <div className="overflow-y-auto max-h-[calc(95vh-180px)] bg-gradient-to-br from-gray-50/50 to-white">
          <div className="p-5 space-y-6">
            {/* Election Details */}
            <div className="space-y-5">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center transform hover:rotate-12 transition-transform duration-300">
                  <span className="text-white text-sm">📋</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900">
                  Election Details
                </h3>
                <div className="h-px bg-gradient-to-r from-blue-500 to-indigo-600 flex-1 opacity-30" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-4">
                  <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-4 border border-gray-200 hover:shadow-lg transition-all duration-300">
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Description
                    </label>
                    <p className="text-gray-900 text-sm leading-relaxed">
                      {election.description || "No description provided"}
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-4 border border-gray-200 hover:shadow-lg transition-all duration-300">
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Election Year
                    </label>
                    <p className="text-gray-900 text-lg font-semibold">
                      {election.year}
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-4 border border-gray-200 hover:shadow-lg transition-all duration-300">
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Status
                    </label>
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-bold ${
                        status === "upcoming"
                          ? "bg-blue-100 text-blue-800"
                          : status === "active"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-4 border border-gray-200 hover:shadow-lg transition-all duration-300">
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Voting Start
                    </label>
                    <div className="flex items-center text-gray-900 text-sm">
                      <Calendar className="w-4 h-4 mr-2 text-green-500" />
                      {formatDate(election.votingStart)}
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-4 border border-gray-200 hover:shadow-lg transition-all duration-300">
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Voting End
                    </label>
                    <div className="flex items-center text-gray-900 text-sm">
                      <Calendar className="w-4 h-4 mr-2 text-red-500" />
                      {formatDate(election.votingEnd)}
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-4 border border-gray-200 hover:shadow-lg transition-all duration-300">
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Voting Tokens
                    </label>
                    <div className="flex items-center text-gray-900 text-sm">
                      <Award className="w-4 h-4 mr-2 text-yellow-500" />
                      <span className="font-semibold">
                        {election._count.tokens}
                      </span>
                      <span className="ml-1 text-gray-800">
                        {election._count.tokens === 1
                          ? "token issued"
                          : "tokens issued"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Positions and Candidates */}
            <div className="space-y-5">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center transform hover:rotate-12 transition-transform duration-300">
                  <Users className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">
                  Positions & Candidates
                </h3>
                <div className="h-px bg-gradient-to-r from-purple-500 to-indigo-600 flex-1 opacity-30" />
              </div>

              {election.positions.length === 0 ? (
                <div className="relative overflow-hidden text-center py-10 bg-gradient-to-br from-gray-50 to-orange-50/30 rounded-2xl border-2 border-dashed border-gray-300">
                  <Users className="w-10 h-10 text-gray-400 mx-auto mb-3 animate-pulse" />
                  <h4 className="text-base font-bold text-gray-700 mb-2">
                    No positions available
                  </h4>
                  <p className="text-gray-500 max-w-md mx-auto text-sm">
                    This election doesn't have any positions configured yet
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {election.positions.map((position, index) => (
                    <div
                      key={position.id}
                      className="relative overflow-hidden border-2 border-gray-200 rounded-2xl p-5 bg-gradient-to-br from-white to-gray-50/50 hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1"
                    >
                      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-orange-100 to-red-100 rounded-full -mr-10 -mt-10 opacity-30" />

                      <div className="relative flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-7 h-7 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-sm">
                            {index + 1}
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-900 text-base">
                              {position.name}
                            </h4>
                            {position.description && (
                              <p className="text-sm text-gray-600 mt-1">
                                {position.description}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                          <Users className="w-3 h-3 mr-1" />
                          {position.candidates.length} candidate
                          {position.candidates.length !== 1 ? "s" : ""}
                        </div>
                      </div>

                      {position.candidates.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {position.candidates.map((candidate) => (
                            <div
                              key={candidate.id}
                              className="relative overflow-hidden bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-4 border border-orange-200 hover:shadow-md transition-all duration-300"
                            >
                              <div className="absolute top-2 right-2 w-2 h-2 bg-orange-200 rounded-full opacity-50" />

                              <div className="flex items-start space-x-3">
                                <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                                  {candidate.image ? (
                                    <img
                                      src={candidate.image}
                                      alt={candidate.name}
                                      className="w-10 h-10 rounded-full object-cover"
                                    />
                                  ) : (
                                    <span className="text-sm font-bold text-gray-600">
                                      {candidate.name.charAt(0)}
                                    </span>
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h5 className="font-bold text-gray-900 text-sm">
                                    {candidate.name}
                                  </h5>
                                  {candidate.vision && (
                                    <div className="mt-2">
                                      <p className="text-xs font-bold text-gray-700 mb-1">
                                        Vision:
                                      </p>
                                      <p className="text-xs text-gray-600 line-clamp-2">
                                        {candidate.vision}
                                      </p>
                                    </div>
                                  )}
                                  {candidate.experience && (
                                    <div className="mt-2">
                                      <p className="text-xs font-bold text-gray-700 mb-1">
                                        Experience:
                                      </p>
                                      <p className="text-xs text-gray-600 line-clamp-2">
                                        {candidate.experience}
                                      </p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-6 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
                          <p className="text-gray-500 text-sm">
                            No candidates registered yet
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Enhanced Footer */}
        <div className="relative overflow-hidden border-t border-gray-200">
          <div className="absolute inset-0 bg-gradient-to-r from-gray-50 to-orange-50/30" />
          <div className="relative flex justify-end p-5">
            <button
              onClick={onClose}
              className="group px-5 py-2 text-gray-700 border-2 border-gray-300 rounded-xl hover:bg-gray-100 hover:border-gray-400 transition-all duration-300 font-semibold hover:scale-105 transform text-sm"
            >
              <span className="group-hover:scale-105 transition-transform duration-300">
                Close
              </span>
            </button>
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

          .animate-fade-in {
            animation: fade-in 0.3s ease-out forwards;
          }

          .animate-scale-in {
            animation: scale-in 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
          }

          .line-clamp-2 {
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }
        `}</style>
      </div>
    </div>
  );
};

export default ViewElectionModal;
