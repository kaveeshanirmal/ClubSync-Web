import React from "react";
import { CheckCircle } from "lucide-react";

const getStatusColor = (status: string) => {
  switch (status) {
    case "approved":
      return "bg-green-100 text-green-800";
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    case "rejected":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const CandidatesTab: React.FC = () => (
  <div className="space-y-6">
    <div className="flex items-center space-x-3 mb-4">
      <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center transform hover:rotate-12 transition-transform duration-300">
        <CheckCircle className="w-4 h-4 text-white" />
      </div>
      <h3 className="text-lg font-bold text-gray-900">Candidate Approvals</h3>
      <div className="h-px bg-gradient-to-r from-green-500 to-emerald-600 flex-1 opacity-30" />
    </div>

    <div className="relative overflow-hidden bg-white rounded-2xl shadow-sm border-2 border-gray-100">
      <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-orange-100 to-red-100 rounded-full -mr-8 -mt-8 opacity-30" />
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gradient-to-br from-gray-50 to-white">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-b-2 border-gray-100">
                Candidate
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-b-2 border-gray-100">
                Position
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-b-2 border-gray-100">
                Experience
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-b-2 border-gray-100">
                Applied Date
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
            {[
              {
                id: 1,
                name: "Alex Turner",
                position: "Technical Lead",
                experience: "2 years",
                status: "pending",
                appliedDate: "2024-01-15",
              },
              {
                id: 2,
                name: "Emma Davis",
                position: "Event Coordinator",
                experience: "1 year",
                status: "approved",
                appliedDate: "2024-01-10",
              },
              {
                id: 3,
                name: "Jordan Smith",
                position: "Marketing Head",
                experience: "3 years",
                status: "rejected",
                appliedDate: "2024-01-05",
              },
            ].map((candidate) => (
              <tr
                key={candidate.id}
                className="hover:bg-gray-50/50 transition-colors duration-200"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-semibold text-gray-900">
                    {candidate.name}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-700">
                    {candidate.position}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-700">
                    {candidate.experience}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-700">
                    {candidate.appliedDate}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      candidate.status,
                    )}`}
                  >
                    {candidate.status.charAt(0).toUpperCase() +
                      candidate.status.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <button className="group px-3 py-1 bg-gradient-to-b from-white to-gray-50 border border-gray-200 rounded-lg hover:from-gray-50 hover:to-gray-100 hover:border-gray-300 hover:shadow-sm transition-all duration-300 text-gray-700 hover:text-gray-900">
                    <span className="group-hover:scale-105 transition-transform duration-300">
                      View
                    </span>
                  </button>
                  <button className="group px-3 py-1 bg-gradient-to-b from-green-50 to-green-100 border border-green-200 rounded-lg hover:from-green-100 hover:to-green-200 hover:border-green-300 hover:shadow-sm transition-all duration-300 text-green-700 hover:text-green-900">
                    <span className="group-hover:scale-105 transition-transform duration-300">
                      Approve
                    </span>
                  </button>
                  <button className="group px-3 py-1 bg-gradient-to-b from-red-50 to-red-100 border border-red-200 rounded-lg hover:from-red-100 hover:to-red-200 hover:border-red-300 hover:shadow-sm transition-all duration-300 text-red-700 hover:text-red-900">
                    <span className="group-hover:scale-105 transition-transform duration-300">
                      Reject
                    </span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

export default CandidatesTab;
