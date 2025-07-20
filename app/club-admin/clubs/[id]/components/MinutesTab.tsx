import { Plus, FileText } from "lucide-react";
import React from "react";

const getStatusColor = (status: string) => {
  switch (status) {
    case "active":
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

const MinutesTab: React.FC = () => (
  <div className="space-y-6">
    <div className="flex items-center space-x-3 mb-4">
      <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center transform hover:rotate-12 transition-transform duration-300">
        <FileText className="w-4 h-4 text-white" />
      </div>
      <h3 className="text-lg font-bold text-gray-900">Meeting Minutes</h3>
      <div className="h-px bg-gradient-to-r from-indigo-500 to-purple-600 flex-1 opacity-30" />
    </div>

    <div className="flex justify-end">
      <button className="group flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg font-semibold text-sm">
        <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
        <span>Add Minutes</span>
      </button>
    </div>

    <div className="relative overflow-hidden bg-white rounded-2xl shadow-sm border-2 border-gray-100">
      <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full -mr-8 -mt-8 opacity-30" />
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gradient-to-br from-gray-50 to-white">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-b-2 border-gray-100">
                Title
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-b-2 border-gray-100">
                Date
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-b-2 border-gray-100">
                Attendees
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
                title: "Monthly Meeting - January",
                date: "2024-01-15",
                attendees: 20,
                status: "published",
              },
              {
                id: 2,
                title: "Planning Session",
                date: "2024-01-10",
                attendees: 15,
                status: "draft",
              },
            ].map((minute) => (
              <tr
                key={minute.id}
                className="hover:bg-gray-50/50 transition-colors duration-200"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-semibold text-gray-900">
                    {minute.title}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-700">{minute.date}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-700">
                    {minute.attendees}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(minute.status)}`}
                  >
                    {minute.status.charAt(0).toUpperCase() +
                      minute.status.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <button className="group px-3 py-1 bg-gradient-to-b from-white to-gray-50 border border-gray-200 rounded-lg hover:from-gray-50 hover:to-gray-100 hover:border-gray-300 hover:shadow-sm transition-all duration-300 text-gray-700 hover:text-gray-900">
                    <span className="group-hover:scale-105 transition-transform duration-300">
                      View
                    </span>
                  </button>
                  <button className="group px-3 py-1 bg-gradient-to-b from-blue-50 to-blue-100 border border-blue-200 rounded-lg hover:from-blue-100 hover:to-blue-200 hover:border-blue-300 hover:shadow-sm transition-all duration-300 text-blue-700 hover:text-blue-900">
                    <span className="group-hover:scale-105 transition-transform duration-300">
                      Edit
                    </span>
                  </button>
                  <button className="group px-3 py-1 bg-gradient-to-b from-red-50 to-red-100 border border-red-200 rounded-lg hover:from-red-100 hover:to-red-200 hover:border-red-300 hover:shadow-sm transition-all duration-300 text-red-700 hover:text-red-900">
                    <span className="group-hover:scale-105 transition-transform duration-300">
                      Delete
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

export default MinutesTab;
