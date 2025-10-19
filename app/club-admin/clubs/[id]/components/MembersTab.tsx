import React, { useEffect, useState, useMemo } from "react";
import { Users, Search, Crown, FileEdit, DollarSign, Monitor } from "lucide-react";

interface Member {
  id: string;
  userId?: string;
  user: {
    id?: string;
    firstName: string;
    lastName: string;
    email: string;
    image?: string | null;
  };
  role?: string;
  membershipStatus?: string;
  joinedAt?: string | null;
}

const roleIcons: Record<string, any> = {
  member: Users,
  president: Crown,
  secretary: FileEdit,
  treasurer: DollarSign,
  webmaster: Monitor,
};

const roleColors: Record<string, string> = {
  member: "bg-gray-100 text-gray-800 border-gray-200",
  president: "bg-purple-100 text-purple-800 border-purple-200",
  secretary: "bg-blue-100 text-blue-800 border-blue-200",
  treasurer: "bg-green-100 text-green-800 border-green-200",
  webmaster: "bg-orange-100 text-orange-800 border-orange-200",
};

const getRoleLabel = (role?: string) => {
  if (!role) return "member";
  return role;
};

const MembersTab: React.FC<{ clubId: string }> = ({ clubId }) => {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMembers, setLoadingMembers] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchMembers = async () => {
    if (!clubId) return;
    setLoadingMembers(true);
    try {
      const res = await fetch(`/api/clubs/${clubId}/members`);
      const data = await res.json();
      if (res.ok) setMembers(Array.isArray(data) ? data : []);
      else throw new Error(data?.error || `Failed to fetch members (${res.status})`);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoadingMembers(false);
    }
  };

  useEffect(() => {
    fetchMembers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clubId]);

  const filteredMembers = useMemo(() => {
    return members.filter((member) => {
      const name = `${member.user.firstName} ${member.user.lastName}`.toLowerCase();
      return (
        name.includes(searchTerm.toLowerCase()) ||
        member.user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
  }, [members, searchTerm]);

  const membersByRole = useMemo(() => {
    return filteredMembers.reduce((acc: Record<string, Member[]>, member) => {
      const role = member.role || "member";
      if (!acc[role]) acc[role] = [];
      acc[role].push(member);
      return acc;
    }, {});
  }, [filteredMembers]);

  // No role update/remove operations in this view by design.

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-green-600 rounded-xl flex items-center justify-center transform hover:rotate-12 transition-transform duration-300">
          <Search className="w-4 h-4 text-white" />
        </div>
        <h3 className="text-lg font-bold text-gray-900">Members</h3>
        <div className="h-px bg-gradient-to-r from-emerald-500 to-green-600 flex-1 opacity-30" />
      </div>

      <div className="relative overflow-hidden bg-white rounded-2xl shadow-sm border-2 border-gray-100">
        <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full -mr-8 -mt-8 opacity-30" />

        <div className="p-5 border-b border-gray-200 bg-gradient-to-br from-gray-50/50 to-white">
          <div className="space-y-4">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-green-600 rounded-xl flex items-center justify-center transform hover:rotate-12 transition-transform duration-300">
                <Search className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Find Members</h3>
              <div className="h-px bg-gradient-to-r from-emerald-500 to-green-600 flex-1 opacity-30" />
            </div>

            <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-4 border border-gray-200 hover:shadow-lg transition-all duration-300">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search members by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-300 bg-white text-gray-900 placeholder-gray-500"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto bg-gradient-to-br from-gray-50/50 to-white p-5">
          {loadingMembers ? (
            <div className="flex items-center justify-center py-12">
              <div className="relative">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
                <div className="absolute inset-0 rounded-full border-2 border-blue-100"></div>
              </div>
              <span className="ml-4 text-gray-700 font-medium">Loading members...</span>
            </div>
          ) : (
            <div className="space-y-6">
              {( ["president","secretary","treasurer","webmaster","member"] as string[] ).map((role) => {
                const Icon = roleIcons[role] || Users;
                const roleMembers = membersByRole[role] || [];

                return (
                  <div key={role} className="relative overflow-hidden border-2 border-gray-200 rounded-2xl p-5 bg-gradient-to-br from-white to-gray-50/50 hover:shadow-xl transition-all duration-500">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full -mr-10 -mt-10 opacity-30" />

                    <div className="relative flex items-center justify-between mb-5">
                      <div className="flex items-center space-x-3">
                        <div className={`p-3 rounded-xl ${roleColors[role]} border-2 transform hover:rotate-12 transition-transform duration-300`}>
                          <Icon className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900 capitalize text-lg">{role}s</h3>
                          <p className="text-sm text-gray-600 font-medium">{roleMembers.length} member{roleMembers.length !== 1 ? 's' : ''} assigned</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <div className="bg-gradient-to-r from-gray-100 to-gray-200 px-3 py-1 rounded-full">
                          <span className="text-xs font-bold text-gray-700">{roleMembers.length} Active</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {roleMembers.map((member) => (
                        <div key={member.id} className="relative overflow-hidden group flex items-center justify-between p-4 bg-gradient-to-br from-white to-gray-50 rounded-xl border-2 border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-300 transform hover:scale-[1.02]">
                          <div className="absolute top-2 right-2 w-2 h-2 bg-blue-200 rounded-full opacity-50" />

                          <div className="flex items-center space-x-4">
                            <div className="relative">
                              <img src={member.user.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(`${member.user.firstName} ${member.user.lastName}`)}`} alt={`${member.user.firstName} ${member.user.lastName}`} className="w-12 h-12 rounded-xl object-cover" />
                              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full border-2 border-white flex items-center justify-center">
                                <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                              </div>
                            </div>
                            <div className="min-w-0 flex-1">
                              <h4 className="font-bold text-gray-900 text-base truncate">{member.user.firstName} {member.user.lastName}</h4>
                              <p className="text-sm text-gray-600 font-medium">{member.user.email}</p>
                              <div className="flex items-center space-x-2 mt-1">
                                <div className="bg-gradient-to-r from-blue-100 to-indigo-100 px-2 py-1 rounded-full">
                                  <p className="text-xs text-blue-800 font-bold">Joined: {member.joinedAt ? new Date(member.joinedAt).toLocaleDateString() : '—'}</p>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center space-x-3">
                            <div className={`px-3 py-1 rounded-full ${roleColors[member.role || 'member']} border-2`}> 
                              <span className="text-sm font-medium capitalize">{member.role || 'member'}</span>
                            </div>
                          </div>
                        </div>
                      ))}

                      {roleMembers.length === 0 && (
                        <div className="relative overflow-hidden text-center py-8 bg-gradient-to-br from-gray-50 to-blue-50/30 rounded-2xl border-2 border-dashed border-gray-300">
                          <Users className="w-8 h-8 text-gray-400 mx-auto mb-3 animate-pulse" />
                          <h4 className="text-base font-bold text-gray-700 mb-2">No members found for this role</h4>
                          <p className="text-sm text-gray-500 max-w-xs mx-auto">No members currently assigned to this role.</p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="relative overflow-hidden border-t border-gray-200 bg-white">
          <div className="absolute inset-0 bg-gradient-to-r from-gray-50 to-blue-50/30" />
          <div className="relative flex justify-between items-center p-5">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center">
                  <Users className="w-4 h-4 text-white" />
                </div>
                <div>
                  <div className="text-sm font-bold text-gray-800">Total Members: {members.length}</div>
                  <div className="text-xs text-gray-600">Filtered: {filteredMembers.length}</div>
                </div>
              </div>
            </div>

            <div className="flex space-x-3">
              <button onClick={() => fetchMembers()} className="group flex items-center space-x-2 px-5 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:scale-105 transform font-semibold text-sm">
                <span className="group-hover:scale-110 transition-transform duration-300">🔄</span>
                <span>Refresh</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MembersTab;
