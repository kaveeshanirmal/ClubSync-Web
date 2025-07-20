"use client";
import React from "react";
import { X, AlertTriangle, Trash2 } from "lucide-react";

interface Election {
  id: string;
  title: string;
  subtitle?: string;
  year: number;
  votingStart: string;
  votingEnd: string;
  positions: {
    id: string;
    name: string;
    candidates: {
      id: string;
      name: string;
    }[];
  }[];
  _count: {
    tokens: number;
  };
}

interface DeleteElectionModalProps {
  election: Election | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading?: boolean;
}

const DeleteElectionModal: React.FC<DeleteElectionModalProps> = ({
  election,
  isOpen,
  onClose,
  onConfirm,
  loading = false,
}) => {
  if (!isOpen || !election) return null;

  const totalCandidates = election.positions.reduce(
    (acc, pos) => acc + pos.candidates.length,
    0,
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop with blur */}
      <div
        className="absolute inset-0 bg-black/20 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 bg-gradient-to-r from-red-50 to-orange-50 border-b border-red-100">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg">
              <AlertTriangle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">
                Delete Election
              </h3>
              <p className="text-sm text-red-600 font-medium">
                This action cannot be undone
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-red-100 rounded-xl transition-all duration-200 hover:scale-105"
            disabled={loading}
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="mb-6">
            <p className="text-gray-700 mb-4 text-base">
              Are you sure you want to delete this election? This will
              permanently remove:
            </p>

            {/* What will be deleted */}
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-100">
                <span className="text-red-800 font-medium">
                  📋 {election.positions.length} position(s)
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-100">
                <span className="text-red-800 font-medium">
                  👥 {totalCandidates} candidate(s)
                </span>
              </div>
              {election._count.tokens > 0 && (
                <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-100">
                  <span className="text-red-800 font-medium">
                    🎫 {election._count.tokens} voting token(s)
                  </span>
                </div>
              )}
              <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-100">
                <span className="text-red-800 font-medium">
                  🗳️ All associated votes and data
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-3 p-6 bg-gray-50 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-6 py-2.5 text-sm font-semibold text-gray-700 bg-white border-2 border-gray-300 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 hover:scale-105"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="px-6 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-red-600 to-red-700 rounded-xl hover:from-red-700 hover:to-red-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105 shadow-lg flex items-center space-x-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Deleting...</span>
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                <span>Delete Election</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteElectionModal;
