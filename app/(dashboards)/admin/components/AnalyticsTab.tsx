"use client";
import React from 'react';
import { 
  Activity,
  Clock,
  Target,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  Users,
  Sparkles,
  Globe
} from 'lucide-react';
import { XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const AnalyticsTab: React.FC = () => {
  // Sample analytics data
  const analyticsData = {
    engagementMetrics: [
      { metric: 'User Engagement', value: 87, target: 85 },
      { metric: 'Event Attendance', value: 92, target: 90 },
      { metric: 'Club Participation', value: 78, target: 80 },
      { metric: 'Content Quality', value: 94, target: 85 },
    ],
    hourlyActivity: [
      { hour: '6AM', users: 45 },
      { hour: '9AM', users: 120 },
      { hour: '12PM', users: 180 },
      { hour: '3PM', users: 210 },
      { hour: '6PM', users: 234 },
      { hour: '9PM', users: 190 },
      { hour: '12AM', users: 95 },
    ],
    topPerformers: [
      { name: 'Tech Innovators Club', members: 156, events: 12, score: 94, growth: '+23%' },
      { name: 'Creative Arts Hub', members: 134, events: 8, score: 89, growth: '+18%' },
      { name: 'Future Leaders', members: 98, events: 15, score: 87, growth: '+31%' },
      { name: 'Green Earth Society', members: 87, events: 6, score: 82, growth: '+12%' },
    ],
    monthlyGrowth: [
      { month: 'Jul', newClubs: 12 },
      { month: 'Aug', newClubs: 19 },
      { month: 'Sep', newClubs: 25 },
      { month: 'Oct', newClubs: 31 },
      { month: 'Nov', newClubs: 28 },
      { month: 'Dec', newClubs: 34 },
    ],
    geographicData: [
      { region: 'North America', clubs: 156, color: '#f97316' },
      { region: 'Europe', clubs: 134, color: '#ef4444' },
      { region: 'Asia Pacific', clubs: 112, color: '#fb923c' },
      { region: 'Latin America', clubs: 89, color: '#f87171' },
      { region: 'Others', clubs: 33, color: '#fbbf24' },
    ]
  };

  return (
    <div className="space-y-8">
      {/* Creative Analytics Header */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="bg-gradient-to-r from-orange-500 via-red-500 to-orange-600 p-8 text-white relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 right-10 w-32 h-32 border border-white/20 rounded-full"></div>
            <div className="absolute bottom-10 left-10 w-24 h-24 border border-white/20 rounded-full"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 border border-white/10 rounded-full"></div>
          </div>
          
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-4 mb-3">
                <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
                <div className="flex items-center space-x-2 px-3 py-1 bg-white/10 rounded-lg border border-white/20">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium">Real-time</span>
                </div>
              </div>
              <p className="text-orange-100 text-base">Comprehensive insights and performance metrics</p>
              <div className="flex items-center space-x-6 mt-4 text-sm text-orange-200">
                <div className="flex items-center space-x-2">
                  <Activity className="w-4 h-4" />
                  <span>524 active users</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4" />
                  <span>Last updated: 30 seconds ago</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-4xl font-light mb-2">98.5%</div>
              <div className="text-orange-200 text-sm uppercase tracking-wide">System Health</div>
              <div className="w-24 bg-white/20 rounded-full h-1.5 mt-3">
                <div className="bg-white h-1.5 rounded-full transition-all duration-1000" style={{width: '98.5%'}}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Professional Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { 
            title: "User Engagement", 
            value: "87.2%", 
            change: "+12.5%", 
            trend: "up", 
            icon: <Activity className="w-5 h-5" />,
            color: "from-orange-600 to-red-600",
            bgColor: "bg-orange-50",
            percentage: 87
          },
          { 
            title: "Event Success Rate", 
            value: "94.7%", 
            change: "+7.2%", 
            trend: "up", 
            icon: <Target className="w-5 h-5" />,
            color: "from-red-600 to-orange-600",
            bgColor: "bg-red-50",
            percentage: 95
          },
          { 
            title: "Growth Velocity", 
            value: "23.4%", 
            change: "+8.1%", 
            trend: "up", 
            icon: <TrendingUp className="w-5 h-5" />,
            color: "from-red-500 to-orange-500",
            bgColor: "bg-red-50",
            percentage: 78
          }
        ].map((metric, index) => (
          <div 
            key={index} 
            className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`${metric.bgColor} p-3 rounded-lg`}>
                <div className={`text-white bg-gradient-to-r ${metric.color} p-2 rounded-md`}>
                  {metric.icon}
                </div>
              </div>
              <div className={`flex items-center space-x-1 px-2 py-1 rounded-md text-xs font-medium ${
                metric.trend === 'up' 
                  ? 'bg-emerald-100 text-emerald-700' 
                  : 'bg-red-100 text-red-700'
              }`}>
                {metric.trend === 'up' ? (
                  <ArrowUpRight className="w-3 h-3" />
                ) : (
                  <TrendingDown className="w-3 h-3" />
                )}
                <span>{metric.change}</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-600 uppercase tracking-wide">{metric.title}</h3>
              <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
              
              {/* Progress indicator */}
              <div className="flex items-center space-x-2 mt-3">
                <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                  <div 
                    className={`h-1.5 bg-gradient-to-r ${metric.color} rounded-full transition-all duration-1000`}
                    style={{ width: `${metric.percentage}%` }}
                  ></div>
                </div>
                <span className="text-xs text-gray-500 font-medium">{metric.percentage}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Real-time Metrics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Live Metrics */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Live Metrics</h3>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-gray-600">Real-time</span>
            </div>
          </div>
          
          <div className="space-y-6">
            {[
              { label: 'Active Users', value: '1,247', change: '+23', color: 'text-orange-600', bgColor: 'bg-orange-50' },
              { label: 'Concurrent Sessions', value: '89', change: '+12', color: 'text-red-600', bgColor: 'bg-red-50' },
              { label: 'Events Today', value: '15', change: '+3', color: 'text-orange-600', bgColor: 'bg-orange-50' },
              { label: 'Avg. Response Time', value: '120ms', change: '-15ms', color: 'text-red-600', bgColor: 'bg-red-50' },
            ].map((metric, index) => (
              <div key={index} className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{metric.label}</p>
                  <p className="text-lg font-semibold text-gray-900">{metric.value}</p>
                </div>
                <div className={`${metric.bgColor} px-2 py-1 rounded-md`}>
                  <span className={`text-xs font-medium ${metric.color}`}>{metric.change}</span>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg border border-orange-200">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                <Activity className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">System Status</p>
                <p className="text-xs text-gray-600">All systems operational</p>
              </div>
            </div>
          </div>
        </div>

        {/* Platform Health */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Platform Health</h3>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
              <span>Optimal</span>
            </div>
          </div>
          
          <div className="space-y-4">
            {[
              { name: 'Server Uptime', value: 99.9, color: 'from-orange-500 to-red-500' },
              { name: 'Database Performance', value: 95.2, color: 'from-orange-500 to-red-500' },
              { name: 'API Response Rate', value: 98.7, color: 'from-orange-500 to-red-500' },
              { name: 'User Satisfaction', value: 96.1, color: 'from-orange-500 to-red-500' },
            ].map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">{item.name}</span>
                  <span className="text-sm text-gray-600">{item.value}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 bg-gradient-to-r ${item.color} rounded-full transition-all duration-1000`}
                    style={{ width: `${item.value}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Advanced Performance Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Performance Metrics */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Performance Indicators</h3>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Target className="w-4 h-4" />
              <span>Target Analysis</span>
            </div>
          </div>
          
          <div className="space-y-6">
            {analyticsData.engagementMetrics.map((metric, index) => (
              <div key={index} className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">{metric.metric}</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">{metric.value}%</span>
                    <div className={`w-2 h-2 rounded-full ${
                      metric.value >= metric.target ? 'bg-emerald-500' : 'bg-amber-500'
                    }`}></div>
                  </div>
                </div>
                
                {/* ClubSync Progress Bar */}
                <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-orange-500 to-red-500 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${metric.value}%` }}
                  ></div>
                  
                  {/* Target indicator */}
                  <div 
                    className="absolute top-0 w-0.5 h-2 bg-orange-600"
                    style={{ left: `${metric.target}%` }}
                  ></div>
                </div>
                
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Current: {metric.value}%</span>
                  <span>Target: {metric.target}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Trend Analysis Chart */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Activity Trends</h3>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
              <span>Last 24 Hours</span>
            </div>
          </div>
          
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={analyticsData.hourlyActivity}>
              <defs>
                <linearGradient id="activityGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f97316" stopOpacity={0.3}/>
                  <stop offset="100%" stopColor="#ef4444" stopOpacity={0.05}/>
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="hour" 
                axisLine={false} 
                tickLine={false}
                tick={{ fontSize: 12, fill: '#6b7280' }}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false}
                tick={{ fontSize: 12, fill: '#6b7280' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e5e7eb', 
                  borderRadius: '8px', 
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }} 
              />
              <Area 
                type="monotone" 
                dataKey="users" 
                stroke="#f97316" 
                strokeWidth={2}
                fill="url(#activityGradient)"
                animationDuration={1500}
              />
            </AreaChart>
          </ResponsiveContainer>
          
          <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-100">
            <div className="text-center">
              <div className="text-lg font-semibold text-gray-900">234</div>
              <div className="text-xs text-gray-600">Peak Users</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-gray-900">156</div>
              <div className="text-xs text-gray-600">Avg/Hour</div>
            </div>
          </div>
        </div>
      </div>

      {/* Executive Summary & Insights */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-orange-50 to-red-50 px-6 py-4 border-b border-orange-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                <Users className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Top Performing Organizations</h3>
            </div>
            <button className="text-orange-600 hover:text-red-600 text-sm font-medium bg-white px-4 py-2 rounded-lg border border-orange-200 hover:bg-orange-50 transition-all duration-200">
              Export Report
            </button>
          </div>
        </div>
        
        <div className="p-6">
          <div className="space-y-4">
            {analyticsData.topPerformers.map((org, index) => (
              <div key={index} className="group">
                <div className="flex items-center justify-between p-4 rounded-lg border border-gray-100 hover:border-orange-200 hover:bg-orange-50 transition-all duration-200">
                  <div className="flex items-center space-x-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-white font-semibold text-sm ${
                      index === 0 ? 'bg-gradient-to-r from-orange-500 to-red-500' : 
                      index === 1 ? 'bg-gradient-to-r from-orange-400 to-red-400' : 
                      index === 2 ? 'bg-gradient-to-r from-orange-600 to-red-600' : 
                      'bg-gradient-to-r from-orange-500 to-red-500'
                    }`}>
                      #{index + 1}
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-gray-900">{org.name}</h4>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span>{org.members} members</span>
                        <span>•</span>
                        <span>{org.events} events</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="flex items-center space-x-3">
                      <div>
                        <div className="text-xl font-bold text-gray-900">{org.score}</div>
                        <div className="text-sm font-medium text-orange-600">{org.growth}</div>
                      </div>
                      <div className="w-12 h-12 relative">
                        <svg className="transform -rotate-90 w-12 h-12" viewBox="0 0 36 36">
                          <circle
                            cx="18"
                            cy="18"
                            r="16"
                            fill="none"
                            className="stroke-gray-200"
                            strokeWidth="2"
                          />
                          <circle
                            cx="18"
                            cy="18"
                            r="16"
                            fill="none"
                            className="stroke-orange-500"
                            strokeWidth="2"
                            strokeDasharray={`${org.score}, 100`}
                            strokeLinecap="round"
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-xs font-semibold text-gray-700">{org.score}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Insights Panel */}
          <div className="mt-6 p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg border border-orange-200">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">Key Insight</p>
                <p className="text-sm text-gray-600 mt-1">Organizations with higher evening engagement show 23% better retention rates and increased member satisfaction scores.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Growth Analytics & Geographic Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Growth Trends */}
        <div className="lg:col-span-3 bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Growth Analysis</h3>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <TrendingUp className="w-4 h-4" />
              <span>6-Month Trend</span>
            </div>
          </div>
          
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={analyticsData.monthlyGrowth}>
              <defs>
                <linearGradient id="growthGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f97316" stopOpacity={0.2}/>
                  <stop offset="100%" stopColor="#ef4444" stopOpacity={0.05}/>
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="month" 
                axisLine={false} 
                tickLine={false}
                tick={{ fontSize: 12, fill: '#6b7280' }}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false}
                tick={{ fontSize: 12, fill: '#6b7280' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e5e7eb', 
                  borderRadius: '8px', 
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }} 
              />
              <Area 
                type="monotone" 
                dataKey="newClubs" 
                stroke="#f97316" 
                strokeWidth={2}
                fill="url(#growthGradient)"
                animationDuration={1500}
              />
            </AreaChart>
          </ResponsiveContainer>
          
          <div className="grid grid-cols-3 gap-4 mt-6 pt-4 border-t border-gray-100">
            <div className="text-center">
              <div className="text-lg font-semibold text-gray-900">+156%</div>
              <div className="text-xs text-gray-600 uppercase tracking-wide">Growth Rate</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-gray-900">2.4k</div>
              <div className="text-xs text-gray-600 uppercase tracking-wide">New Members</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-gray-900">89%</div>
              <div className="text-xs text-gray-600 uppercase tracking-wide">Retention</div>
            </div>
          </div>
        </div>

        {/* Regional Performance */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Regional Distribution</h3>
            <Globe className="w-5 h-5 text-orange-600" />
          </div>
          
          <div className="space-y-4">
            {analyticsData.geographicData.map((region, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">{region.region}</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">{region.clubs}</span>
                    <div className="w-6 h-6 rounded-md flex items-center justify-center text-xs font-semibold text-white"
                         style={{ backgroundColor: region.color }}>
                      {region.clubs}
                    </div>
                  </div>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="h-2 rounded-full transition-all duration-1000"
                    style={{ 
                      width: `${(region.clubs / 200) * 100}%`,
                      backgroundColor: region.color
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg border border-orange-200">
            <div className="text-center space-y-2">
              <div className="flex items-center justify-center space-x-2">
                <div className="w-2 h-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-full"></div>
                <span className="text-sm font-medium text-gray-900">Global Coverage</span>
              </div>
              <p className="text-xs text-gray-600">524 organizations across 47 countries</p>
              <p className="text-xs text-orange-600">Updated 2 minutes ago</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsTab;
