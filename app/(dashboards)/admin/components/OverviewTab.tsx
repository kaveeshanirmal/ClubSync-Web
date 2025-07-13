"use client";
import React from 'react';
import { 
  ArrowUpRight,
  ArrowDownRight,
  Target
} from 'lucide-react';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

interface StatItem {
  icon: React.ReactNode;
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  color: string;
}

interface ChartDataItem {
  name: string;
  clubs: number;
  events: number;
}

interface PieDataItem {
  name: string;
  value: number;
  color: string;
}

interface OverviewTabProps {
  dashboardStats: StatItem[];
  chartData: ChartDataItem[];
  pieData: PieDataItem[];
}

const OverviewTab: React.FC<OverviewTabProps> = ({ dashboardStats, chartData, pieData }) => (
  <div className="space-y-8">
    {/* Executive Summary Banner */}
    <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-8 text-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
      <div className="relative z-10">
        <h3 className="text-2xl font-bold mb-2">Platform Health Score</h3>
        <div className="flex items-center space-x-6">
          <div className="text-4xl font-bold">87%</div>
          <div className="space-y-1">
            <div className="text-orange-100">Excellent performance across all metrics</div>
            <div className="text-sm text-orange-200">+5% improvement this quarter</div>
          </div>
        </div>
      </div>
    </div>

    {/* Enhanced Stats Cards */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {dashboardStats.map((stat, index) => (
        <div key={index} className="group bg-white p-6 rounded-2xl shadow-sm border border-gray-200 hover:shadow-xl hover:border-orange-200 transition-all duration-500 transform hover:-translate-y-1 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-50 to-red-50 rounded-full -translate-y-16 translate-x-16 group-hover:scale-110 transition-transform duration-500"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                {stat.icon}
              </div>
              <div className="flex items-center space-x-1">
                {stat.trend === 'up' ? (
                  <ArrowUpRight className="w-4 h-4 text-green-500" />
                ) : (
                  <ArrowDownRight className="w-4 h-4 text-red-500" />
                )}
                <span className={`text-sm font-bold ${stat.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                  {stat.change}
                </span>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-2 font-medium">{stat.title}</p>
              <p className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</p>
              <p className="text-xs text-gray-500">vs last period</p>
            </div>
          </div>
        </div>
      ))}
    </div>

    {/* Enhanced Charts Section */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Growth Chart */}
      <div className="lg:col-span-2 bg-white p-8 rounded-2xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-1">Growth Analytics</h3>
            <p className="text-sm text-gray-600">Track platform expansion over time</p>
          </div>
          <select className="text-sm border border-gray-300 rounded-xl px-4 py-3 bg-white hover:border-orange-500 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 cursor-pointer font-medium">
            <option>Last 6 months</option>
            <option>Last year</option>
            <option>All time</option>
          </select>
        </div>
        <div className="mb-6">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
              <span className="text-sm text-gray-600 font-medium">Clubs</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-sm text-gray-600 font-medium">Events</span>
            </div>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={320}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="clubsGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f97316" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="eventsGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
            <XAxis dataKey="name" stroke="#6b7280" fontSize={12} />
            <YAxis stroke="#6b7280" fontSize={12} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'white', 
                border: '1px solid #e5e7eb',
                borderRadius: '12px',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
              }}
            />
            <Area type="monotone" dataKey="clubs" stroke="#f97316" strokeWidth={3} fill="url(#clubsGradient)" />
            <Area type="monotone" dataKey="events" stroke="#ef4444" strokeWidth={3} fill="url(#eventsGradient)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Club Categories */}
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300">
        <div className="mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-1">Club Distribution</h3>
          <p className="text-sm text-gray-600">Categories breakdown</p>
        </div>
        <div className="space-y-6">
          {pieData.map((item, index) => (
            <div key={index} className="group">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-5 h-5 rounded-lg shadow-sm" 
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm font-semibold text-gray-900">{item.name}</span>
                </div>
                <span className="text-sm text-gray-600 font-bold">{item.value}%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                <div 
                  className="h-full rounded-full transition-all duration-1000 group-hover:scale-105"
                  style={{ 
                    width: `${item.value}%`, 
                    backgroundColor: item.color,
                    transformOrigin: 'left center'
                  }}
                />
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8 p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl border border-orange-200">
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center space-x-2">
              <Target className="w-4 h-4 text-orange-600" />
              <span className="text-sm font-bold text-gray-900">Leading Category</span>
            </div>
            <p className="text-xs text-gray-600">Education leads with 35% market share</p>
            <p className="text-xs text-orange-600 font-medium">+8% growth this quarter</p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default OverviewTab;
