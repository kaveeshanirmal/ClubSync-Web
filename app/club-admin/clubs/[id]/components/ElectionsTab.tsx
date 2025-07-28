"use client";
import { Plus, Calendar, Clock, Eye, Edit, Trash2, Award } from "lucide-react";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import ViewElectionModal from "./modals/ViewElectionModal";
import EditElectionModal from "./modals/EditElectionModal";
import CreateElectionModal from "./modals/CreateElectionModal";
import DeleteElectionModal from "./modals/DeleteElectionModal";
import BeautifulLoader from "@/components/Loader";

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

const getStatusColor = (status: string) => {
  switch (status) {
    case "upcoming":
      return "bg-blue-100 text-blue-800";
    case "active":
      return "bg-green-100 text-green-800";
    case "completed":
      return "bg-gray-100 text-gray-800";
    case "draft":
      return "bg-yellow-100 text-yellow-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getElectionStatus = (votingStart: string, votingEnd: string) => {
  const now = new Date();
  const start = new Date(votingStart);
  const end = new Date(votingEnd);

  if (now < start) return "upcoming";
  if (now >= start && now <= end) return "active";
  return "completed";
};

const ElectionsTab: React.FC = () => {
  const params = useParams();
  const clubId = params.id as string;
  const [elections, setElections] = useState<Election[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal states
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedElection, setSelectedElection] = useState<Election | null>(
    null,
  );
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    const fetchElections = async () => {
      try {
        const response = await fetch(`/api/clubs/${clubId}/elections`);
        if (!response.ok) {
          throw new Error("Failed to fetch elections");
        }
        const data = await response.json();
        setElections(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    if (clubId) {
      fetchElections();
    }
  }, [clubId]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleViewElection = (election: Election) => {
    setSelectedElection(election);
    setViewModalOpen(true);
  };

  const handleEditElection = (election: Election) => {
    setSelectedElection(election);
    setEditModalOpen(true);
  };

  const handleCreateElection = () => {
    setCreateModalOpen(true);
  };

  const handleDeleteElection = (election: Election) => {
    const status = getElectionStatus(election.votingStart, election.votingEnd);

    if (status === "active") {
      alert(
        "Cannot delete an active election. Please wait for the voting period to end.",
      );
      return;
    }

    setSelectedElection(election);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedElection) return;

    setDeleteLoading(true);
    try {
      const response = await fetch(`/api/elections/${selectedElection.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete election");
      }

      setElections(elections.filter((e) => e.id !== selectedElection.id));
      setDeleteModalOpen(false);
      setSelectedElection(null);
    } catch (err) {
      console.error("Failed to delete election:", err);
      alert(err instanceof Error ? err.message : "Failed to delete election");
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleSaveElection = (updatedElection: Election) => {
    setElections(
      elections.map((e) => (e.id === updatedElection.id ? updatedElection : e)),
    );
  };

  const handleAddElection = (newElection: Election) => {
    setElections([newElection, ...elections]);
  };

  if (loading) {
    return (
      <div>
        <BeautifulLoader
          type="morphing"
          message="Loading elections..."
          subMessage="Fetching club election data"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative overflow-hidden bg-gradient-to-br from-red-50 to-red-100 rounded-2xl p-6 border-l-4 border-red-500 shadow-lg animate-slide-in">
        <div className="absolute top-0 right-0 w-16 h-16 bg-red-100 rounded-full -mr-8 -mt-8 opacity-50" />
        <div className="relative">
          <p className="text-red-800 font-semibold mb-4">
            Error loading elections: {error}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="group px-5 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl hover:from-orange-600 hover:to-red-600 transition-all duration-300 shadow-lg hover:scale-105 transform font-semibold text-sm"
          >
            <span className="group-hover:scale-105 transition-transform duration-300">
              Retry
            </span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
          <Award className="w-4 h-4 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900">Election Management</h3>
          <p className="text-sm text-gray-600">Manage club elections and voting</p>
        </div>
      </div>

      {/* Create Button */}
      <div className="flex justify-end mb-6">
        <button
          onClick={handleCreateElection}
          className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl hover:from-orange-600 hover:to-red-600 transition-all duration-300 shadow-lg font-medium text-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Create Election</span>
        </button>
      </div>

      {/* Elections Grid */}
      {elections.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
          <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h4 className="text-lg font-semibold text-gray-900 mb-2">
            No Elections Yet
          </h4>
          <p className="text-gray-600 mb-4 max-w-md mx-auto">
            Get started by creating your first club election
          </p>
          <button
            onClick={handleCreateElection}
            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl hover:from-orange-600 hover:to-red-600 transition-all duration-300 shadow-lg font-medium text-sm mx-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Create Your First Election</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {elections.map((election) => {
            const status = getElectionStatus(
              election.votingStart,
              election.votingEnd,
            );
            const totalCandidates = election.positions.reduce(
              (acc, pos) => acc + pos.candidates.length,
              0,
            );

            return (
              <div
                key={election.id}
                className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-300"
              >

                {/* Election Header */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h4 className="font-bold text-gray-900 text-lg">
                        {election.title}
                      </h4>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(status)}`}
                      >
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </span>
                    </div>
                    {election.subtitle && (
                      <p className="text-sm text-gray-600 mb-2">
                        {election.subtitle}
                      </p>
                    )}
                    <div className="flex items-center text-sm text-gray-500 space-x-4">
                      <span className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1 text-blue-500" />
                        {election.year}
                      </span>
                      <span className="flex items-center">
                        <Clock className="w-4 h-4 mr-1 text-green-500" />
                        {formatDate(election.votingStart)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Election Stats */}
                <div className="grid grid-cols-3 gap-4 mb-4 p-3 bg-gray-50 rounded-lg">
                  <div className="text-center">
                    <div className="text-lg font-bold text-gray-900">
                      {election.positions.length}
                    </div>
                    <div className="text-xs text-gray-600">Positions</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-gray-900">
                      {totalCandidates}
                    </div>
                    <div className="text-xs text-gray-600">Candidates</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-gray-900">
                      {election._count.tokens}
                    </div>
                    <div className="text-xs text-gray-600">Tokens</div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => handleViewElection(election)}
                    className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                    title="View Election"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleEditElection(election)}
                    className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all duration-200"
                    title="Edit Election"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteElection(election)}
                    className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                    title="Delete Election"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modals */}
      {selectedElection && (
        <>
          <ViewElectionModal
            election={selectedElection}
            isOpen={viewModalOpen}
            onClose={() => {
              setViewModalOpen(false);
              setSelectedElection(null);
            }}
          />
          <EditElectionModal
            election={selectedElection}
            isOpen={editModalOpen}
            onClose={() => {
              setEditModalOpen(false);
              setSelectedElection(null);
            }}
            onSave={handleSaveElection}
          />
        </>
      )}

      <CreateElectionModal
        clubId={clubId}
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSave={(newElection: unknown) =>
          handleAddElection(newElection as Election)
        }
      />

      <DeleteElectionModal
        election={selectedElection}
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setSelectedElection(null);
        }}
        onConfirm={handleConfirmDelete}
        loading={deleteLoading}
      />
    </div>
  );
};

export default ElectionsTab;
