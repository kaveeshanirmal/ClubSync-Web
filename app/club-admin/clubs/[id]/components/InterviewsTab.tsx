import { Plus, Users } from "lucide-react";
import React from "react";

const getStatusColor = (status: string) => {
  switch (status) {
    case "active":
    case "approved":
    case "published":
      return "bg-green-100 text-green-800";
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    case "draft":
      return "bg-gray-100 text-gray-800";
    case "completed":
      return "bg-blue-100 text-blue-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const InterviewsTab: React.FC = () => (
  <div className="space-y-6">
    <div className="flex items-center space-x-3 mb-4">
      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center transform hover:rotate-12 transition-transform duration-300">
        <Users className="w-4 h-4 text-white" />
      </div>
      <h3 className="text-lg font-bold text-gray-900">Interview Management</h3>
      <div className="h-px bg-gradient-to-r from-blue-500 to-indigo-600 flex-1 opacity-30" />
    </div>

    <div className="flex justify-end">
      <button className="group flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg font-semibold text-sm">
        <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
        <span>Schedule Interview</span>
      </button>
    </div>

    <div className="relative overflow-hidden bg-white rounded-2xl shadow-sm border-2 border-gray-100">
      <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full -mr-8 -mt-8 opacity-30" />
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
                Date & Time
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
                candidateName: "John Doe",
                position: "Technical Lead",
                date: "2024-01-20",
                time: "10:00 AM",
                status: "scheduled",
                notes: "Strong technical background",
              },
              {
                id: 2,
                candidateName: "Jane Smith",
                position: "Event Coordinator",
                date: "2024-01-21",
                time: "2:00 PM",
                status: "completed",
                notes: "Excellent communication skills",
              },
            ].map((interview) => (
              <tr
                key={interview.id}
                className="hover:bg-gray-50/50 transition-colors duration-200"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-semibold text-gray-900">
                    {interview.candidateName}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-700">
                    {interview.position}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-700">{interview.date}</div>
                  <div className="text-sm text-gray-500">{interview.time}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(interview.status)}`}
                  >
                    {interview.status.charAt(0).toUpperCase() +
                      interview.status.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <button className="group px-3 py-1 bg-gradient-to-b from-white to-gray-50 border border-gray-200 rounded-lg hover:from-gray-50 hover:to-gray-100 hover:border-gray-300 hover:shadow-sm transition-all duration-300 text-gray-700 hover:text-gray-900">
                    <span className="group-hover:scale-105 transition-transform duration-300">
                      Edit
                    </span>
                  </button>
                  <button className="group px-3 py-1 bg-gradient-to-b from-red-50 to-red-100 border border-red-200 rounded-lg hover:from-red-100 hover:to-red-200 hover:border-red-300 hover:shadow-sm transition-all duration-300 text-red-700 hover:text-red-900">
                    <span className="group-hover:scale-105 transition-transform duration-300">
                      Cancel
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

export default InterviewsTab;
