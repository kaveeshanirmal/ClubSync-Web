"use client";
import React from 'react';
import { 
  Plus,
  Filter,
  Download,
  Eye,
  Edit,
  Trash2,
  Users,
  Clock
} from 'lucide-react';

interface ClubItem {
  id: number;
  name: string;
  members: number;
  status: 'Active' | 'Pending' | 'Inactive';
  joined: string;
  category: string;
}

interface ClubsTabProps {
  recentClubs: ClubItem[];
}

const ClubsTab: React.FC<ClubsTabProps> = ({ recentClubs }) => (
  <div className="space-y-6">
    {/* Creative Clubs Header */}
    <div className="relative bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-8 text-white overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-4 right-4 w-24 h-24 border border-white/30 rounded-full"></div>
        <div className="absolute bottom-4 left-4 w-16 h-16 border border-white/30 rounded-full"></div>
      </div>
      <div className="relative z-10">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-2">Club Management</h2>
            <p className="text-orange-100">Manage and oversee all club activities and memberships</p>
            <div className="flex items-center space-x-6 mt-4">
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4" />
                <span className="text-sm">524 Total Clubs</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4" />
                <span className="text-sm">2.1k Active Members</span>
              </div>
            </div>
          </div>
          <button className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 flex items-center space-x-2">
            <Plus className="w-5 h-5" />
            <span>Add Club</span>
          </button>
        </div>
      </div>
    </div>

    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center space-x-2">
          <Filter className="w-5 h-5 text-orange-600" />
          <span className="text-sm font-medium text-gray-700">Filters:</span>
        </div>
        
        <select className="text-sm border border-gray-300 rounded-lg px-3 py-2 bg-white hover:border-orange-500 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 cursor-pointer">
          <option>All Categories</option>
          <option>Technology</option>
          <option>Arts</option>
          <option>Sports</option>
          <option>Education</option>
        </select>
        
        <select className="text-sm border border-gray-300 rounded-lg px-3 py-2 bg-white hover:border-orange-500 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 cursor-pointer">
          <option>All Status</option>
          <option>Active</option>
          <option>Pending</option>
          <option>Inactive</option>
        </select>
        
        <button className="text-sm text-orange-600 hover:text-orange-700 font-medium flex items-center space-x-1 border border-orange-300 hover:border-orange-500 px-3 py-2 rounded-lg transition-all duration-200">
          <Download className="w-4 h-4" />
          <span>Export</span>
        </button>
      </div>
    </div>

    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Recent Clubs</h3>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Club</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Members</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {recentClubs.map((club) => (
              <tr key={club.id} className="hover:bg-gray-50 transition-colors duration-200">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gradient-to-r from-orange-400 to-red-400 rounded-lg flex items-center justify-center mr-3">
                      <Users className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">{club.name}</div>
                      <div className="text-sm text-gray-500">ID: {club.id}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <Users className="w-4 h-4 text-gray-400 mr-1" />
                    <span className="text-sm text-gray-900">{club.members}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    club.status === 'Active' 
                      ? 'bg-green-100 text-green-800' 
                      : club.status === 'Pending'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {club.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-900">{club.category}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 text-gray-400 mr-1" />
                    <span className="text-sm text-gray-500">{club.joined}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center space-x-2">
                    <button className="text-orange-600 hover:text-orange-900 p-1 rounded transition-colors duration-200">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="text-gray-600 hover:text-gray-900 p-1 rounded transition-colors duration-200">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="text-red-600 hover:text-red-900 p-1 rounded transition-colors duration-200">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing <span className="font-medium">1</span> to <span className="font-medium">{recentClubs.length}</span> of{' '}
            <span className="font-medium">{recentClubs.length}</span> results
          </div>
          <div className="flex items-center space-x-2">
            <button className="px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors duration-200">
              Previous
            </button>
            <button className="px-3 py-1 text-sm bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors duration-200">
              1
            </button>
            <button className="px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors duration-200">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default ClubsTab;
