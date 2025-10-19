"use client";
import React from "react";
import { useState, useEffect } from "react";
import { X, BarChart2, Award } from "lucide-react";
import BeautifulLoader from "@/components/Loader";

interface CandidateResult {
  id: string;
  name: string;
  image?: string;
  voteCount: number;
}

interface PositionResult {
  positionId: string;
  positionName: string;
  candidates: CandidateResult[];
}

interface ElectionResults {
  electionTitle: string;
  totalVotesCast: number;
  results: PositionResult[];
}

interface ViewResultsModalProps {
  electionId: string;
  isOpen: boolean;
  onClose: () => void;
}

const ViewResultsModal: React.FC<ViewResultsModalProps> = ({
  electionId,
  isOpen,
  onClose,
}) => {
  const [results, setResults] = useState<ElectionResults | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && electionId) {
      const fetchResults = async () => {
        setLoading(true);
        setError(null);
        try {
          const response = await fetch(`/api/elections/${electionId}/results`);
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Failed to fetch results");
          }
          const data = await response.json();
          setResults(data);
        } catch (err) {
          setError(err instanceof Error ? err.message : "An error occurred");
        } finally {
          setLoading(false);
        }
      };
      fetchResults();
    }
  }, [isOpen, electionId]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-md"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[95vh] overflow-hidden border-2 border-gray-100">
        {/* Header */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-500 via-red-500 to-orange-600" />
          <div className="absolute inset-0 bg-gradient-to-r from-orange-50/90 to-red-50/90 backdrop-blur-sm" />
          <div className="relative flex justify-between items-center p-5">
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-gray-900 flex items-center space-x-3">
                <div className="w-7 h-7 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                  <BarChart2 className="w-4 h-4 text-white" />
                </div>
                <span>Election Results</span>
              </h2>
              <p className="text-gray-700 font-medium ml-10 text-sm">
                Official vote counts and final standings.
              </p>
            </div>
            <button
              onClick={onClose}
              className="group p-2 hover:bg-white/20 rounded-xl transition-all duration-300"
            >
              <X className="w-5 h-5 text-gray-700 group-hover:text-gray-900" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(95vh-100px)] bg-gradient-to-br from-gray-50/50 to-white p-6">
          {loading ? (
            <BeautifulLoader
              type="minimal"
              message="Calculating results..."
              subMessage="Fetching final vote counts"
            />
          ) : error ? (
            <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-4 border-l-4 border-red-500 shadow-lg">
              <p className="text-red-800 font-semibold text-sm">{error}</p>
            </div>
          ) : results ? (
            <div className="space-y-6">
              <div className="text-center p-4 bg-white rounded-xl border border-gray-200">
                <h3 className="text-2xl font-bold text-gray-900">
                  {results.electionTitle}
                </h3>
                <p className="text-gray-600 mt-1">{`Based on ${results.totalVotesCast} total votes cast`}</p>
              </div>
              {results.results.map((position) => {
                const totalVotesInPosition = position.candidates.reduce(
                  (sum, c) => sum + c.voteCount,
                  0,
                );
                return (
                  <div
                    key={position.positionId}
                    className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-lg transition-shadow duration-300"
                  >
                    <h4 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">
                      {position.positionName}
                    </h4>
                    <div className="space-y-4">
                      {position.candidates.map((candidate, candIndex) => {
                        const percentage =
                          totalVotesInPosition > 0
                            ? (candidate.voteCount / totalVotesInPosition) * 100
                            : 0;
                        return (
                          <div key={candidate.id}>
                            <div className="flex justify-between items-center mb-1">
                              <span className="font-semibold text-gray-700 flex items-center">
                                {candIndex === 0 &&
                                  totalVotesInPosition > 0 && (
                                    <Award className="w-4 h-4 mr-2 text-yellow-500" />
                                  )}
                                {candidate.name}
                              </span>
                              <span className="text-sm font-medium text-gray-500">{`${candidate.voteCount} votes`}</span>
                            </div>
                            <div className="relative h-4 w-full bg-gray-200 rounded-full">
                              <div
                                className="absolute top-0 left-0 h-4 bg-gradient-to-r from-orange-400 to-red-500 rounded-full flex items-center justify-end pr-2"
                                style={{ width: `${percentage}%` }}
                              >
                                <span className="text-xs font-bold text-white">
                                  {percentage > 10
                                    ? `${percentage.toFixed(1)}%`
                                    : ""}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default ViewResultsModal;
