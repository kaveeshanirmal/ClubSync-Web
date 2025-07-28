"use client";
import React, { useState } from "react";
import { X, Plus, Trash2, Save, Calendar, Users } from "lucide-react";

interface Position {
  id: string;
  name: string;
  description: string;
  candidates: Candidate[];
}

interface Candidate {
  id: string;
  name: string;
  image: string;
  vision: string;
  experience: string;
}

interface CreateElectionModalProps {
  clubId: string;
  isOpen: boolean;
  onClose: () => void;
  onSave: (newElection: unknown) => void;
}

const CreateElectionModal: React.FC<CreateElectionModalProps> = ({
  clubId,
  isOpen,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    description: "",
    year: new Date().getFullYear(),
    votingStart: "",
    votingEnd: "",
    positions: [] as Position[],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validate required fields
    if (!formData.title || !formData.votingStart || !formData.votingEnd) {
      setError("Please fill in all required fields");
      setLoading(false);
      return;
    }

    // Validate dates
    const startDate = new Date(formData.votingStart);
    const endDate = new Date(formData.votingEnd);

    if (startDate >= endDate) {
      setError("Voting start date must be before end date");
      setLoading(false);
      return;
    }

    if (startDate < new Date()) {
      setError("Voting start date cannot be in the past");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/elections", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          clubId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create election");
      }

      const newElection = await response.json();
      onSave(newElection);
      handleClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      title: "",
      subtitle: "",
      description: "",
      year: new Date().getFullYear(),
      votingStart: "",
      votingEnd: "",
      positions: [],
    });
    setError(null);
    onClose();
  };

  const addPosition = () => {
    setFormData({
      ...formData,
      positions: [
        ...formData.positions,
        {
          id: `temp-${Date.now()}`,
          name: "",
          description: "",
          candidates: [],
        },
      ],
    });
  };

  const removePosition = (index: number) => {
    setFormData({
      ...formData,
      positions: formData.positions.filter((_, i) => i !== index),
    });
  };

  const updatePosition = (index: number, field: string, value: string) => {
    const updatedPositions = [...formData.positions];
    updatedPositions[index] = {
      ...updatedPositions[index],
      [field]: value,
    };
    setFormData({
      ...formData,
      positions: updatedPositions,
    });
  };

  const addCandidate = (positionIndex: number) => {
    const updatedPositions = [...formData.positions];
    updatedPositions[positionIndex].candidates.push({
      id: `temp-${Date.now()}`,
      name: "",
      image: "",
      vision: "",
      experience: "",
    });
    setFormData({
      ...formData,
      positions: updatedPositions,
    });
  };

  const removeCandidate = (positionIndex: number, candidateIndex: number) => {
    const updatedPositions = [...formData.positions];
    updatedPositions[positionIndex].candidates.splice(candidateIndex, 1);
    setFormData({
      ...formData,
      positions: updatedPositions,
    });
  };

  const updateCandidate = (
    positionIndex: number,
    candidateIndex: number,
    field: keyof Candidate,
    value: string,
  ) => {
    const updatedPositions = [...formData.positions];
    updatedPositions[positionIndex].candidates[candidateIndex][field] = value;
    setFormData({
      ...formData,
      positions: updatedPositions,
    });
  };

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
              <h2 className="text-xl font-bold text-gray-900 flex items-center space-x-3">
                <div className="w-7 h-7 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">🗳️</span>
                </div>
                <span>Create New Election</span>
              </h2>
              <p className="text-gray-700 font-medium ml-10 text-sm">
                Design your democratic process with style and precision
              </p>
            </div>
            <button
              onClick={handleClose}
              className="group p-2 hover:bg-white/20 rounded-xl transition-all duration-300 hover:scale-110 hover:rotate-90"
              disabled={loading}
            >
              <X className="w-5 h-5 text-gray-700 group-hover:text-gray-900 transition-colors duration-300" />
            </button>
          </div>

          {/* Decorative elements */}
          <div className="absolute top-3 right-16 w-2 h-2 bg-orange-300 rounded-full animate-bounce" />
          <div className="absolute bottom-3 left-16 w-2 h-2 bg-red-300 rounded-full animate-pulse" />
        </div>

        {/* Content with Scrollable Area */}
        <form
          onSubmit={handleSubmit}
          className="overflow-y-auto max-h-[calc(95vh-180px)] bg-gradient-to-br from-gray-50/50 to-white"
        >
          <div className="p-5 space-y-6">
            {error && (
              <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-4 border-l-4 border-red-500 shadow-lg animate-slide-in">
                <p className="text-red-800 font-semibold text-sm">{error}</p>
              </div>
            )}

            {/* Basic Information Section */}
            <div className="space-y-5">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center transform hover:rotate-12 transition-transform duration-300">
                  <span className="text-white text-sm">📋</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900">
                  Basic Information
                </h3>
                <div className="h-px bg-gradient-to-r from-blue-500 to-indigo-600 flex-1 opacity-30" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-4">
                  <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-4 border border-gray-200 hover:shadow-lg transition-all duration-300">
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Election Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-300 bg-white text-gray-900 placeholder-gray-500 text-sm"
                      placeholder="Annual Executive Committee Election"
                      required
                    />
                  </div>

                  <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-4 border border-gray-200 hover:shadow-lg transition-all duration-300">
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Subtitle
                    </label>
                    <input
                      type="text"
                      value={formData.subtitle}
                      onChange={(e) =>
                        setFormData({ ...formData, subtitle: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-300 bg-white text-gray-900 placeholder-gray-500 text-sm"
                      placeholder="Shape the future of our organization"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-4 border border-gray-200 hover:shadow-lg transition-all duration-300">
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Election Year <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={formData.year}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          year: parseInt(e.target.value),
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-300 bg-white text-gray-900 text-sm"
                      min={new Date().getFullYear()}
                      max={new Date().getFullYear() + 5}
                      required
                    />
                  </div>

                  <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-4 border border-gray-200 hover:shadow-lg transition-all duration-300">
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-300 bg-white text-gray-900 placeholder-gray-500 resize-none text-sm"
                      rows={3}
                      placeholder="Describe the purpose, importance, and vision for this election..."
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Voting Schedule Section */}
            <div className="space-y-5">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center transform hover:rotate-12 transition-transform duration-300">
                  <Calendar className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">
                  Voting Schedule
                </h3>
                <div className="h-px bg-gradient-to-r from-green-500 to-emerald-600 flex-1 opacity-30" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-4 border border-gray-200 hover:shadow-lg transition-all duration-300">
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Voting Start <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.votingStart}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        votingStart: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all duration-300 bg-white text-gray-900 text-sm"
                    required
                  />
                </div>

                <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-4 border border-gray-200 hover:shadow-lg transition-all duration-300">
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Voting End <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.votingEnd}
                    onChange={(e) =>
                      setFormData({ ...formData, votingEnd: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all duration-300 bg-white text-gray-900 text-sm"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Positions and Candidates Section */}
            <div className="space-y-5">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center transform hover:rotate-12 transition-transform duration-300">
                    <Users className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">
                    Positions & Candidates
                  </h3>
                  <div className="h-px bg-gradient-to-r from-purple-500 to-indigo-600 flex-1 opacity-30" />
                </div>
                <button
                  type="button"
                  onClick={addPosition}
                  className="group flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl hover:from-orange-600 hover:to-red-600 transition-all duration-300 transform hover:scale-105 hover:shadow-lg font-semibold text-sm"
                >
                  <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
                  <span>Add Position</span>
                </button>
              </div>

              {formData.positions.length === 0 ? (
                <div className="relative overflow-hidden text-center py-10 bg-gradient-to-br from-gray-50 to-orange-50/30 rounded-2xl border-2 border-dashed border-gray-300">
                  <Users className="w-10 h-10 text-gray-400 mx-auto mb-3 animate-pulse" />
                  <h4 className="text-base font-bold text-gray-700 mb-2">
                    No positions added yet
                  </h4>
                  <p className="text-gray-500 max-w-md mx-auto text-sm">
                    Start building your election by adding positions for
                    candidates to compete for
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {formData.positions.map((position, positionIndex) => (
                    <div
                      key={position.id}
                      className="relative overflow-hidden border-2 border-gray-200 rounded-2xl p-5 bg-gradient-to-br from-white to-gray-50/50 hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1"
                    >
                      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-orange-100 to-red-100 rounded-full -mr-10 -mt-10 opacity-30" />

                      <div className="relative flex justify-between items-start mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-7 h-7 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-sm">
                            {positionIndex + 1}
                          </div>
                          <h4 className="font-bold text-gray-900 text-base">
                            Position {positionIndex + 1}
                          </h4>
                        </div>
                        <button
                          type="button"
                          onClick={() => removePosition(positionIndex)}
                          className="group p-2 text-red-500 hover:bg-red-50 rounded-xl transition-all duration-300 hover:scale-110"
                        >
                          <Trash2 className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="space-y-2">
                          <label className="block text-sm font-bold text-gray-700">
                            Position Name{" "}
                            <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={position.name}
                            onChange={(e) =>
                              updatePosition(
                                positionIndex,
                                "name",
                                e.target.value,
                              )
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300 bg-white text-gray-900 placeholder-gray-500 text-sm"
                            placeholder="President, Vice President, Secretary..."
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="block text-sm font-bold text-gray-700">
                            Description
                          </label>
                          <input
                            type="text"
                            value={position.description}
                            onChange={(e) =>
                              updatePosition(
                                positionIndex,
                                "description",
                                e.target.value,
                              )
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300 bg-white text-gray-900 placeholder-gray-500 text-sm"
                            placeholder="Brief description of responsibilities"
                          />
                        </div>
                      </div>

                      {/* Candidates Section */}
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-bold text-gray-800 flex items-center space-x-2">
                            <span>🏆</span>
                            <span>Candidates</span>
                          </span>
                          <button
                            type="button"
                            onClick={() => addCandidate(positionIndex)}
                            className="group flex items-center space-x-2 px-3 py-1 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 rounded-xl hover:from-gray-200 hover:to-gray-300 transition-all duration-300 font-medium hover:scale-105 text-xs"
                          >
                            <Plus className="w-3 h-3 group-hover:rotate-90 transition-transform duration-300" />
                            <span>Add Candidate</span>
                          </button>
                        </div>

                        {position.candidates.length > 0 ? (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {position.candidates.map(
                              (candidate, candidateIndex) => (
                                <div
                                  key={candidate.id}
                                  className="relative overflow-hidden bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-4 border border-orange-200 hover:shadow-md transition-all duration-300"
                                >
                                  <div className="absolute top-2 right-2 w-2 h-2 bg-orange-200 rounded-full opacity-50" />

                                  <div className="flex justify-between items-start mb-2">
                                    <div className="flex items-center space-x-2">
                                      <div className="w-5 h-5 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                                        {candidateIndex + 1}
                                      </div>
                                      <span className="font-bold text-gray-800 text-xs">
                                        Candidate {candidateIndex + 1}
                                      </span>
                                    </div>
                                    <button
                                      type="button"
                                      onClick={() =>
                                        removeCandidate(
                                          positionIndex,
                                          candidateIndex,
                                        )
                                      }
                                      className="group p-1 text-red-500 hover:bg-red-100 rounded-lg transition-all duration-300 hover:scale-110"
                                    >
                                      <Trash2 className="w-3 h-3 group-hover:scale-110 transition-transform duration-300" />
                                    </button>
                                  </div>

                                  <div className="space-y-3">
                                    <div className="space-y-1">
                                      <label className="block text-xs font-bold text-gray-700">
                                        Name{" "}
                                        <span className="text-red-500">*</span>
                                      </label>
                                      <input
                                        type="text"
                                        value={candidate.name}
                                        onChange={(e) =>
                                          updateCandidate(
                                            positionIndex,
                                            candidateIndex,
                                            "name",
                                            e.target.value,
                                          )
                                        }
                                        className="w-full px-3 py-1 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 bg-white transition-all duration-300 text-gray-900 placeholder-gray-500"
                                        placeholder="Full name"
                                        required
                                      />
                                    </div>

                                    <div className="space-y-1">
                                      <label className="block text-xs font-bold text-gray-700">
                                        Image URL
                                      </label>
                                      <input
                                        type="url"
                                        value={candidate.image}
                                        onChange={(e) =>
                                          updateCandidate(
                                            positionIndex,
                                            candidateIndex,
                                            "image",
                                            e.target.value,
                                          )
                                        }
                                        className="w-full px-3 py-1 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 bg-white transition-all duration-300 text-gray-900 placeholder-gray-500"
                                        placeholder="Profile photo URL"
                                      />
                                    </div>

                                    <div className="space-y-1">
                                      <label className="block text-xs font-bold text-gray-700">
                                        Vision Statement
                                      </label>
                                      <textarea
                                        value={candidate.vision}
                                        onChange={(e) =>
                                          updateCandidate(
                                            positionIndex,
                                            candidateIndex,
                                            "vision",
                                            e.target.value,
                                          )
                                        }
                                        className="w-full px-3 py-1 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 bg-white transition-all duration-300 resize-none text-gray-900 placeholder-gray-500"
                                        rows={2}
                                        placeholder="What is their vision for this role?"
                                      />
                                    </div>

                                    <div className="space-y-1">
                                      <label className="block text-xs font-bold text-gray-700">
                                        Experience & Qualifications
                                      </label>
                                      <textarea
                                        value={candidate.experience}
                                        onChange={(e) =>
                                          updateCandidate(
                                            positionIndex,
                                            candidateIndex,
                                            "experience",
                                            e.target.value,
                                          )
                                        }
                                        className="w-full px-3 py-1 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 bg-white transition-all duration-300 resize-none text-gray-900 placeholder-gray-500"
                                        rows={2}
                                        placeholder="Relevant experience and qualifications"
                                      />
                                    </div>
                                  </div>
                                </div>
                              ),
                            )}
                          </div>
                        ) : (
                          <div className="text-center py-4 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
                            <p className="text-gray-500 text-sm">
                              No candidates added yet
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Enhanced Footer */}
          <div className="relative overflow-hidden border-t border-gray-200">
            <div className="absolute inset-0 bg-gradient-to-r from-gray-50 to-orange-50/30" />
            <div className="relative flex justify-end p-5">
              <button
                type="button"
                onClick={handleClose}
                className="group px-5 py-2 text-gray-700 border-2 border-gray-300 rounded-xl hover:bg-gray-100 hover:border-gray-400 transition-all duration-300 font-semibold hover:scale-105 transform text-sm mr-3"
                disabled={loading}
              >
                <span className="group-hover:scale-105 transition-transform duration-300">
                  Cancel
                </span>
              </button>
              <button
                type="submit"
                disabled={loading}
                className="group flex items-center space-x-2 px-5 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl hover:from-orange-600 hover:to-red-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:scale-105 transform font-semibold text-sm"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                    <span>Creating...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                    <span>Create Election</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>

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
    </div>
  );
};

export default CreateElectionModal;
