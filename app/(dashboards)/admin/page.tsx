"use client";
import React, { useState } from 'react';
import { 
  Users, 
  Calendar, 
  Award, 
  TrendingUp, 
  Bell, 
  Settings, 
  Search,
  Filter,
  Download,
  Plus,
  Eye,
  Edit,
  Trash2,
  Activity,
  DollarSign,
  UserCheck,
  ArrowUpRight,
  ArrowDownRight,
  Zap,
  BarChart3,
  PieChart
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const AdminDashboard = () => {
  const [selectedTab, setSelectedTab] = useState('overview');
  const [notifications] = useState(1);

  // Sample data
  const dashboardStats = [
    {
      title: "Total Clubs",
      value: "524",
      change: "+12%",
      trend: "up",
      icon: <Users className="w-6 h-6" />,
      color: "from-orange-500 to-red-500"
    },
    {
      title: "Active Events",
      value: "89",
      change: "+24%",
      trend: "up",
      icon: <Calendar className="w-6 h-6" />,
      color: "from-blue-500 to-purple-500"
    },
    {
      title: "Certificates Issued",
      value: "1,247",
      change: "+8%",
      trend: "up",
      icon: <Award className="w-6 h-6" />,
      color: "from-green-500 to-emerald-500"
    },
    {
      title: "Revenue",
      value: "$12,450",
      change: "-3%",
      trend: "down",
      icon: <DollarSign className="w-6 h-6" />,
      color: "from-purple-500 to-pink-500"
    }
  ];

  const chartData = [
    { name: 'Jan', clubs: 400, events: 240, certificates: 800 },
    { name: 'Feb', clubs: 420, events: 280, certificates: 900 },
    { name: 'Mar', clubs: 450, events: 320, certificates: 1100 },
    { name: 'Apr', clubs: 480, events: 380, certificates: 1200 },
    { name: 'May', clubs: 500, events: 420, certificates: 1300 },
    { name: 'Jun', clubs: 524, events: 450, certificates: 1400 }
  ];

  const pieData = [
    { name: 'Education', value: 35, color: '#f97316' },
    { name: 'Sports', value: 25, color: '#ef4444' },
    { name: 'Technology', value: 20, color: '#3b82f6' },
    { name: 'Arts', value: 12, color: '#10b981' },
    { name: 'Others', value: 8, color: '#8b5cf6' }
  ];

  const recentClubs = [
    { id: 1, name: "Tech Innovators Club", members: 45, status: "Active", joined: "2 days ago", category: "Technology" },
    { id: 2, name: "Green Earth Society", members: 28, status: "Pending", joined: "1 week ago", category: "Environment" },
    { id: 3, name: "Creative Arts Hub", members: 67, status: "Active", joined: "3 days ago", category: "Arts" },
    { id: 4, name: "Future Leaders", members: 34, status: "Active", joined: "5 days ago", category: "Leadership" }
  ];

  const SidebarButton = ({ id, label, icon, active, onClick }: {
    id: string;
    label: string;
    icon: React.ReactNode;
    active: boolean;
    onClick: (id: string) => void;
  }) => (
    <button
      onClick={() => onClick(id)}
      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition-all duration-300 ${
        active 
          ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg' 
          : 'text-gray-600 hover:text-orange-500 hover:bg-orange-50'
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        {/* Sidebar Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">ClubSync</h1>
              <p className="text-sm text-gray-500">Admin Panel</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          <SidebarButton 
            id="overview" 
            label="Overview" 
            icon={<BarChart3 className="w-5 h-5" />}
            active={selectedTab === 'overview'} 
            onClick={setSelectedTab} 
          />
          <SidebarButton 
            id="clubs" 
            label="Clubs" 
            icon={<Users className="w-5 h-5" />}
            active={selectedTab === 'clubs'} 
            onClick={setSelectedTab} 
          />
          <SidebarButton 
            id="events" 
            label="Events" 
            icon={<Calendar className="w-5 h-5" />}
            active={selectedTab === 'events'} 
            onClick={setSelectedTab} 
          />
          <SidebarButton 
            id="users" 
            label="Users" 
            icon={<UserCheck className="w-5 h-5" />}
            active={selectedTab === 'users'} 
            onClick={setSelectedTab} 
          />
          <SidebarButton 
            id="analytics" 
            label="Analytics" 
            icon={<PieChart className="w-5 h-5" />}
            active={selectedTab === 'analytics'} 
            onClick={setSelectedTab} 
          />
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-gray-200">
          <button className="w-full flex items-center space-x-3 px-4 py-3 text-gray-600 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-all duration-300">
            <Settings className="w-5 h-5" />
            <span>Settings</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {selectedTab === 'overview' && 'Dashboard Overview'}
                {selectedTab === 'clubs' && 'Club Management'}
                {selectedTab === 'events' && 'Event Management'}
                {selectedTab === 'users' && 'User Management'}
                {selectedTab === 'analytics' && 'Analytics Dashboard'}
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                {selectedTab === 'overview' && 'Monitor your platform performance'}
                {selectedTab === 'clubs' && 'Manage and oversee all clubs'}
                {selectedTab === 'events' && 'Organize and track events'}
                {selectedTab === 'users' && 'Manage user accounts and permissions'}
                {selectedTab === 'analytics' && 'View detailed analytics and insights'}
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent w-64"
                />
              </div>
              
              <button className="relative p-2 text-gray-600 hover:text-orange-500 transition-colors">
                <Bell className="w-6 h-6" />
                {notifications > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {notifications}
                  </span>
                )}
              </button>
              
              <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">A</span>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-auto">
        {selectedTab === 'overview' && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {dashboardStats.map((stat, index) => (
                <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                      <div className="flex items-center space-x-1 mt-2">
                        {stat.trend === 'up' ? (
                          <ArrowUpRight className="w-4 h-4 text-green-500" />
                        ) : (
                          <ArrowDownRight className="w-4 h-4 text-red-500" />
                        )}
                        <span className={`text-sm ${stat.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                          {stat.change}
                        </span>
                        <span className="text-sm text-gray-500">vs last period</span>
                      </div>
                    </div>
                    <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-lg flex items-center justify-center text-white`}>
                      {stat.icon}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Growth Chart */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Growth Overview</h3>
                  <select className="text-sm border border-gray-300 rounded-lg px-3 py-2">
                    <option>Last 6 months</option>
                    <option>Last year</option>
                  </select>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="clubs" stroke="#f97316" strokeWidth={2} />
                    <Line type="monotone" dataKey="events" stroke="#ef4444" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Club Categories */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Club Categories</h3>
                <div className="space-y-4">
                  {pieData.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div 
                          className="w-4 h-4 rounded-full" 
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="text-sm font-medium text-gray-900">{item.name}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div 
                            className="h-2 rounded-full transition-all duration-300"
                            style={{ 
                              width: `${item.value}%`, 
                              backgroundColor: item.color 
                            }}
                          />
                        </div>
                        <span className="text-sm text-gray-600 font-medium">{item.value}%</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Most Popular:</span>
                    <span className="font-semibold text-orange-600">Education (35%)</span>
                  </div>
                </div>
              </div>
            </div>

            
          </div>
        )}

        {selectedTab === 'clubs' && (
          <div className="space-y-6">
            {/* Clubs Header */}
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Club Management</h2>
              <button className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-lg hover:from-orange-600 hover:to-red-600 transition-all duration-300 flex items-center space-x-2">
                <Plus className="w-4 h-4" />
                <span>Add Club</span>
              </button>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center space-x-2">
                  <Filter className="w-5 h-5 text-gray-500" />
                  <span className="text-sm text-gray-600">Filter by:</span>
                </div>
                <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
                  <option>All Status</option>
                  <option>Active</option>
                  <option>Pending</option>
                  <option>Suspended</option>
                </select>
                <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
                  <option>All Categories</option>
                  <option>Technology</option>
                  <option>Sports</option>
                  <option>Arts</option>
                </select>
                <button className="bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-lg text-sm transition-colors">
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Clubs Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="text-left p-4 font-medium text-gray-900">Club Name</th>
                      <th className="text-left p-4 font-medium text-gray-900">Category</th>
                      <th className="text-left p-4 font-medium text-gray-900">Members</th>
                      <th className="text-left p-4 font-medium text-gray-900">Status</th>
                      <th className="text-left p-4 font-medium text-gray-900">Created</th>
                      <th className="text-left p-4 font-medium text-gray-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentClubs.map((club) => (
                      <tr key={club.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                              <Users className="w-4 h-4 text-white" />
                            </div>
                            <span className="font-medium text-gray-900">{club.name}</span>
                          </div>
                        </td>
                        <td className="p-4 text-gray-600">{club.category}</td>
                        <td className="p-4 text-gray-600">{club.members}</td>
                        <td className="p-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            club.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {club.status}
                          </span>
                        </td>
                        <td className="p-4 text-gray-600">{club.joined}</td>
                        <td className="p-4">
                          <div className="flex items-center space-x-2">
                            <button className="p-2 text-gray-500 hover:text-orange-500 transition-colors">
                              <Eye className="w-4 h-4" />
                            </button>
                            <button className="p-2 text-gray-500 hover:text-orange-500 transition-colors">
                              <Edit className="w-4 h-4" />
                            </button>
                            <button className="p-2 text-gray-500 hover:text-red-500 transition-colors">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {selectedTab === 'analytics' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h2>
            
            {/* Analytics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-gray-600">Engagement Rate</h3>
                  <TrendingUp className="w-5 h-5 text-green-500" />
                </div>
                <p className="text-2xl font-bold text-gray-900">78.5%</p>
                <p className="text-sm text-green-600">+5.2% from last month</p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-gray-600">Avg. Event Attendance</h3>
                  <UserCheck className="w-5 h-5 text-blue-500" />
                </div>
                <p className="text-2xl font-bold text-gray-900">65</p>
                <p className="text-sm text-blue-600">+8 from last month</p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-gray-600">Platform Usage</h3>
                  <Activity className="w-5 h-5 text-purple-500" />
                </div>
                <p className="text-2xl font-bold text-gray-900">92%</p>
                <p className="text-sm text-purple-600">+3.1% from last month</p>
              </div>
            </div>

            {/* Detailed Analytics Chart */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Platform Activity</h3>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="clubs" fill="#f97316" />
                  <Bar dataKey="events" fill="#ef4444" />
                  <Bar dataKey="certificates" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;