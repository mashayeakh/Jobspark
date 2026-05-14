/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useState } from 'react';
import { AdminShell } from '@/components/layouts/AdminShell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Users,
  Search,
  Filter,
  MoreVertical,
  Shield,
  UserCheck,
  UserX,
  Mail,
  Calendar,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Loader2,
  Ban,
  User
} from 'lucide-react';
import { authService } from '@/services/authService';
import { adminService, User as UserType } from '@/services/adminService';
// import { toast } from 'sonner';

export default function UserManagementPage() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [users, setUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('ALL');
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setCurrentUser(authService.getUser());
    }, 0);
    return () => clearTimeout(timeoutId);
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await adminService.getUsers();
      if (response.success && response.data) {
        setUsers(response.data.users);
      } else {
        setError(response.error || 'Failed to fetch users');
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error('Users fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchUsers();
    }, 0);
    return () => clearTimeout(timeoutId);
  }, []);

  const handleBlockUser = async (userId: string) => {
    try {
      setActionLoading(userId);
      const response = await adminService.blockUser(userId);
      if (response.success) {
        alert('User blocked successfully');
        await fetchUsers(); // Refresh users list
      } else {
        alert(response.error || 'Failed to block user');
      }
    } catch (err) {
      alert('An unexpected error occurred');
    } finally {
      setActionLoading(null);
    }
  };

  const handleUnblockUser = async (userId: string) => {
    try {
      setActionLoading(userId);
      const response = await adminService.unblockUser(userId);
      if (response.success) {
        alert('User unblocked successfully');
        await fetchUsers(); // Refresh users list
      } else {
        alert(response.error || 'Failed to unblock user');
      }
    } catch (err) {
      alert('An unexpected error occurred');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }

    try {
      setActionLoading(userId);
      const response = await adminService.deleteUser(userId);
      if (response.success) {
        alert('User deleted successfully');
        await fetchUsers(); // Refresh users list
      } else {
        alert(response.error || 'Failed to delete user');
      }
    } catch (err) {
      alert('An unexpected error occurred');
    } finally {
      setActionLoading(null);
    }
  };

  const filteredUsers = (users || []).filter(user => {
    const matchesSearch = user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterRole === 'ALL' || user.role === filterRole;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-50 text-green-600';
      case 'PENDING': return 'bg-yellow-50 text-yellow-600';
      case 'SUSPENDED': return 'bg-red-50 text-red-600';
      case 'BLOCKED': return 'bg-red-50 text-red-600';
      default: return 'bg-gray-50 text-gray-400';
    }
  };

  if (loading) {
    return (
      <AdminShell title="User Management">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </AdminShell>
    );
  }

  if (error) {
    return (
      <AdminShell title="User Management">
        <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
          <p className="text-red-600">{error}</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </AdminShell>
    );
  }

  const userStats = {
    total: (users || []).length,
    verified: (users || []).filter(u => u.emailVerified).length,
    pending: (users || []).filter(u => u.status === 'PENDING').length,
    suspended: (users || []).filter(u => u.status === 'SUSPENDED' || u.status === 'BLOCKED').length,
  };

  return (
    <AdminShell title="User Management">
      <div className="p-8 space-y-8">
        <div className="flex justify-end items-center">
          <Button className="rounded-xl bg-[#4880FF] font-bold shadow-lg shadow-blue-100 h-12 px-6">
            <Users className="h-4 w-4 mr-2" />
            Add New User
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { label: 'Total Users', val: userStats.total.toLocaleString(), icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
            { label: 'Verified', val: userStats.verified.toLocaleString(), icon: UserCheck, color: 'text-green-600', bg: 'bg-green-50' },
            { label: 'Pending', val: userStats.pending.toLocaleString(), icon: Shield, color: 'text-orange-600', bg: 'bg-orange-50' },
            { label: 'Suspended', val: userStats.suspended.toLocaleString(), icon: UserX, color: 'text-red-600', bg: 'bg-red-50' },
          ].map((stat, i) => (
            <Card key={i} className="border-0 shadow-sm rounded-2xl">
              <CardContent className="p-6 flex items-center gap-4">
                <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                  <stat.icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-bold mb-1 uppercase">{stat.label}</p>
                  <h3 className="text-2xl font-bold text-[#202224]">{stat.val}</h3>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="border-0 shadow-sm rounded-2xl overflow-hidden">
          <CardHeader className="p-8 bg-white border-b border-gray-100">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <CardTitle className="text-xl font-bold">User Database</CardTitle>
              <div className="flex flex-wrap gap-4 w-full md:w-auto">
                <div className="relative flex-1 md:flex-none md:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search users..."
                    className="pl-10 rounded-xl border-gray-100 bg-gray-50"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <select
                  className="bg-gray-50 border-gray-100 rounded-xl px-4 py-2 text-sm font-bold text-gray-500 focus:outline-none"
                  value={filterRole}
                  onChange={(e) => setFilterRole(e.target.value)}
                >
                  <option value="ALL">All Roles</option>
                  <option value="RECRUITER">Recruiter</option>
                  <option value="JOB_SEEKER">Job Seeker</option>
                  <option value="ADMIN">Admin</option>
                </select>
                <Button variant="outline" className="rounded-xl border-gray-100 font-bold">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0 bg-white">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-[#F8F9FA] border-b border-gray-100">
                  <tr>
                    <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">User</th>
                    <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Role</th>
                    <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Joined</th>
                    <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                    <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold">
                            {user.name?.charAt(0) || user.email.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-bold text-[#202224]">{user.name || 'Unknown'}</p>
                            <p className="text-sm text-gray-400 font-medium">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <Badge className="bg-blue-50 text-blue-600 border-0 rounded-lg px-3 py-1 font-bold">
                          {user.role?.replace('_', ' ') || 'Unknown'}
                        </Badge>
                      </td>
                      <td className="px-8 py-6 text-gray-500 font-bold">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-2">
                          <Badge className={`${getStatusColor(user.status)} border-0 rounded-lg px-3 py-1 font-bold`}>
                            {user.status}
                          </Badge>
                          {user.emailVerified && (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          )}
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex gap-2">
                          <Button variant="ghost" size="icon" className="h-9 w-9 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl">
                            <Eye className="h-4 w-4" />
                          </Button>

                          {user.status === 'ACTIVE' ? (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-9 w-9 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-xl"
                              onClick={() => handleBlockUser(user.id)}
                              disabled={actionLoading === user.id}
                            >
                              {actionLoading === user.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Ban className="h-4 w-4" />}
                            </Button>
                          ) : (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-9 w-9 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-xl"
                              onClick={() => handleUnblockUser(user.id)}
                              disabled={actionLoading === user.id}
                            >
                              {actionLoading === user.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserCheck className="h-4 w-4" />}
                            </Button>
                          )}

                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl"
                            onClick={() => handleDeleteUser(user.id)}
                            disabled={actionLoading === user.id}
                          >
                            {actionLoading === user.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredUsers.length === 0 && (
                <div className="text-center py-12">
                  <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No users found</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminShell>
  );
}
