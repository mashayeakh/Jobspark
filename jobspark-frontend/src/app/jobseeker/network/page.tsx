/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LayoutGrid, Table as TableIcon, List as ListIcon, Check, X, MessageSquare, Clock } from 'lucide-react';
import apiClient from '@/lib/api';

export default function JobSeekerNetworkPage() {
  const [myConnections, setMyConnections] = useState<any[]>([]);
  const [pendingSent, setPendingSent] = useState<any[]>([]);
  const [pendingReceived, setPendingReceived] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter and View state
  const [filter, setFilter] = useState<'all' | 'connected' | 'invitations' | 'sent'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'table' | 'list'>('grid');

  useEffect(() => {
    const fetchNetworkData = async () => {
      try {
        const [connectionsRes, pendingRes] = await Promise.all([
          apiClient.get<any>('/network/connections'),
          apiClient.get<any>('/network/pending')
        ]);

        if (connectionsRes.success && connectionsRes.data?.result) {
          setMyConnections(connectionsRes.data.result);
        }

        if (pendingRes.success && pendingRes.data?.result) {
          setPendingSent(pendingRes.data.result.sent || []);
          setPendingReceived(pendingRes.data.result.received || []);
        }
      } catch (err: any) {
        console.error("Failed to fetch network data", err);
        setError(err.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    };
    fetchNetworkData();
  }, []);

  const handleAction = async (connectionId: string, action: 'accept' | 'reject') => {
    try {
      const res = await apiClient.patch(`/network/connect/${connectionId}/${action}`);
      if (res.success) {
        const conn = pendingReceived.find(c => c.id === connectionId);
        setPendingReceived(prev => prev.filter(c => c.id !== connectionId));

        if (action === 'accept' && conn) {
          setMyConnections(prev => [conn, ...prev]);
        }
      } else {
        alert(res.error || `Failed to ${action} request.`);
      }
    } catch (err) {
      alert(`Error trying to ${action} request.`);
    }
  };

  if (loading) {
    return <div className="min-h-[60vh] flex items-center justify-center">Loading network...</div>;
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-600 rounded-xl font-medium">
        Error loading network: {error}
      </div>
    );
  }

  const showAll = filter === 'all';
  const totalItems = myConnections.length + pendingReceived.length + pendingSent.length;

  // Render helper for Grid View
  const renderGridCard = (type: 'invitation' | 'sent' | 'connected', conn: any) => {
    const displayUser = type === 'sent' ? conn.receiver : (type === 'invitation' ? conn.sender : (conn.sender || conn.receiver));
    const isSent = type === 'sent';
    const isInv = type === 'invitation';

    return (
      <Card key={conn.id} className={`rounded-3xl shadow-sm hover:shadow-md transition-all group ${isInv ? 'bg-blue-50/50 border-blue-100' : 'border-slate-100 hover:border-blue-100'} ${isSent ? 'opacity-80' : ''}`}>
        <CardContent className="p-6 flex flex-col gap-4 items-center text-center">
          <div className={`h-20 w-20 rounded-full overflow-hidden shrink-0 border-4 border-white shadow-sm group-hover:scale-105 transition-transform ${isSent ? 'grayscale' : ''}`}>
            <img src={displayUser.image || "https://github.com/shadcn.png"} alt={displayUser.name} className="h-full w-full object-cover" />
          </div>
          <div>
            <Link href={`/connections/${displayUser.id}`} className="font-black text-lg text-slate-900 hover:text-blue-600">
              {displayUser.name}
            </Link>
            {isSent ? (
              <p className="text-[12px] text-yellow-600 font-bold uppercase tracking-wider mt-1">Pending Approval</p>
            ) : (
              <p className="text-sm text-slate-500 mt-1 line-clamp-1">{displayUser.jobSeekerProfile?.headline || (isInv ? "Wants to connect" : "Connected")}</p>
            )}
          </div>
          <div className="flex w-full gap-2 mt-2">
            {isInv ? (
              <>
                <Button onClick={() => handleAction(conn.id, 'reject')} variant="outline" className="flex-1 rounded-xl border-slate-200 text-slate-600 font-bold hover:bg-white transition-colors">
                  Ignore
                </Button>
                <Button onClick={() => handleAction(conn.id, 'accept')} className="flex-1 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition-colors">
                  Accept
                </Button>
              </>
            ) : isSent ? (
              <Button disabled variant="outline" className="w-full rounded-xl border-slate-200 text-slate-400 font-bold bg-slate-50 mt-2">
                <Clock className="w-4 h-4 mr-2" /> Pending
              </Button>
            ) : (
              <Button variant="outline" className="w-full rounded-xl border-slate-200 text-blue-600 font-bold hover:bg-blue-50 mt-2">
                <MessageSquare className="w-4 h-4 mr-2" /> Message
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  // Render helper for List View
  const renderListCard = (type: 'invitation' | 'sent' | 'connected', conn: any) => {
    const displayUser = type === 'sent' ? conn.receiver : (type === 'invitation' ? conn.sender : (conn.sender || conn.receiver));
    const isSent = type === 'sent';
    const isInv = type === 'invitation';

    return (
      <Card key={conn.id} className={`rounded-2xl shadow-sm hover:shadow-md transition-all ${isInv ? 'bg-blue-50/30 border-blue-100' : 'border-slate-100'} ${isSent ? 'opacity-80' : ''}`}>
        <CardContent className="p-4 flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
          <div className={`h-16 w-16 rounded-full overflow-hidden shrink-0 ${isSent ? 'grayscale' : ''}`}>
            <img src={displayUser.image || "https://github.com/shadcn.png"} alt={displayUser.name} className="h-full w-full object-cover" />
          </div>
          <div className="flex-1">
            <Link href={`/connections/${displayUser.id}`} className="font-bold text-lg text-slate-900 hover:text-blue-600">
              {displayUser.name}
            </Link>
            {isSent ? (
              <p className="text-xs text-yellow-600 font-bold uppercase tracking-wider mt-0.5">Pending Approval</p>
            ) : (
              <p className="text-sm text-slate-500 line-clamp-1">{displayUser.jobSeekerProfile?.headline || (isInv ? "Wants to connect" : "Connected")}</p>
            )}
          </div>
          <div className="flex items-center gap-2 mt-2 sm:mt-0 w-full sm:w-auto">
            {isInv ? (
              <>
                <Button onClick={() => handleAction(conn.id, 'reject')} variant="outline" size="sm" className="flex-1 sm:flex-none rounded-xl border-slate-200 text-slate-600 font-bold">
                  <X className="w-4 h-4 mr-1" /> Ignore
                </Button>
                <Button onClick={() => handleAction(conn.id, 'accept')} size="sm" className="flex-1 sm:flex-none rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold">
                  <Check className="w-4 h-4 mr-1" /> Accept
                </Button>
              </>
            ) : isSent ? (
              <Button disabled variant="outline" size="sm" className="flex-1 sm:flex-none rounded-xl border-slate-200 text-slate-400 font-bold bg-slate-50">
                <Clock className="w-4 h-4 mr-2" /> Pending
              </Button>
            ) : (
              <Button variant="outline" size="sm" className="flex-1 sm:flex-none rounded-xl border-slate-200 text-blue-600 font-bold hover:bg-blue-50">
                <MessageSquare className="w-4 h-4 mr-2" /> Message
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  // Render helper for Table View row
  const renderTableRow = (type: 'invitation' | 'sent' | 'connected', conn: any) => {
    const displayUser = type === 'sent' ? conn.receiver : (type === 'invitation' ? conn.sender : (conn.sender || conn.receiver));
    const isSent = type === 'sent';
    const isInv = type === 'invitation';

    return (
      <tr key={conn.id} className="hover:bg-gray-50 border-b border-gray-100 last:border-0 transition-colors">
        <td className="px-6 py-4">
          <div className="flex items-center gap-3">
            <div className={`h-10 w-10 rounded-full overflow-hidden shrink-0 ${isSent ? 'grayscale' : ''}`}>
              <img src={displayUser.image || "https://github.com/shadcn.png"} alt={displayUser.name} className="h-full w-full object-cover" />
            </div>
            <Link href={`/connections/${displayUser.id}`} className="font-bold text-slate-900 hover:text-blue-600">
              {displayUser.name}
            </Link>
          </div>
        </td>
        <td className="px-6 py-4 text-sm text-gray-600 max-w-[300px] truncate">
          {displayUser.jobSeekerProfile?.headline || "-"}
        </td>
        <td className="px-6 py-4">
          {isInv ? (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
              Action Required
            </span>
          ) : isSent ? (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-yellow-100 text-yellow-800">
              Pending
            </span>
          ) : (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-800">
              Connected
            </span>
          )}
        </td>
        <td className="px-6 py-4 text-right">
          <div className="flex justify-end gap-2">
            {isInv ? (
              <>
                <Button onClick={() => handleAction(conn.id, 'reject')} variant="ghost" size="sm" className="h-8 w-8 p-0 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-full">
                  <X className="w-4 h-4" />
                </Button>
                <Button onClick={() => handleAction(conn.id, 'accept')} variant="ghost" size="sm" className="h-8 w-8 p-0 text-blue-600 hover:bg-blue-50 rounded-full">
                  <Check className="w-5 h-5" />
                </Button>
              </>
            ) : isSent ? (
              <span className="text-xs text-slate-400 font-medium px-2 py-1">Waiting</span>
            ) : (
              <Button variant="ghost" size="sm" className="h-8 px-3 text-blue-600 hover:bg-blue-50 rounded-full font-bold text-xs">
                Message
              </Button>
            )}
          </div>
        </td>
      </tr>
    );
  };

  const renderSection = (title: string, data: any[], type: 'invitation' | 'sent' | 'connected') => {
    if (data.length === 0) return null;

    return (
      <section className="mb-12">
        <h2 className="text-xl font-bold text-gray-900 mb-6">{title}</h2>

        {viewMode === 'grid' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.map(conn => renderGridCard(type, conn))}
          </div>
        )}

        {viewMode === 'list' && (
          <div className="flex flex-col gap-4">
            {data.map(conn => renderListCard(type, conn))}
          </div>
        )}

        {viewMode === 'table' && (
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-500 whitespace-nowrap">
                <thead className="bg-gray-50 text-xs uppercase text-gray-500 font-bold">
                  <tr>
                    <th className="px-6 py-4">User</th>
                    <th className="px-6 py-4">Headline</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {data.map(conn => renderTableRow(type, conn))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>
    );
  };

  return (
    <div className="space-y-8 max-w-5xl">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">My Network</h1>
        <p className="text-slate-500 font-medium mt-1">Manage your connections and invitations</p>
      </div>

      {/* Filter Tabs & View Toggles */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">

        {/* Filters */}
        <div className="flex flex-wrap gap-3">
          <Button
            onClick={() => setFilter('all')}
            variant={filter === 'all' ? 'default' : 'outline'}
            className={`rounded-full px-6 font-bold transition-all ${filter === 'all' ? 'bg-[#4880FF] hover:bg-blue-600 text-white shadow-md' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
          >
            All Network ({totalItems})
          </Button>
          <Button
            onClick={() => setFilter('connected')}
            variant={filter === 'connected' ? 'default' : 'outline'}
            className={`rounded-full px-6 font-bold transition-all ${filter === 'connected' ? 'bg-[#4880FF] hover:bg-blue-600 text-white shadow-md' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
          >
            Connections ({myConnections.length})
          </Button>
          <Button
            onClick={() => setFilter('invitations')}
            variant={filter === 'invitations' ? 'default' : 'outline'}
            className={`rounded-full px-6 font-bold transition-all ${filter === 'invitations' ? 'bg-[#4880FF] hover:bg-blue-600 text-white shadow-md' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
          >
            Invitations ({pendingReceived.length})
          </Button>
          <Button
            onClick={() => setFilter('sent')}
            variant={filter === 'sent' ? 'default' : 'outline'}
            className={`rounded-full px-6 font-bold transition-all ${filter === 'sent' ? 'bg-[#4880FF] hover:bg-blue-600 text-white shadow-md' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
          >
            Sent Requests ({pendingSent.length})
          </Button>
        </div>

        {/* View Toggle */}
        <div className="flex items-center bg-white border border-gray-200 rounded-xl p-1 shadow-sm shrink-0 self-start sm:self-auto">
          <Button
            onClick={() => setViewMode('grid')}
            variant="ghost"
            size="sm"
            className={`px-3 py-1.5 h-auto rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-[#4880FF] text-white' : 'text-gray-400 hover:text-gray-900 hover:bg-gray-50'}`}
            title="Grid View"
          >
            <LayoutGrid className="w-4 h-4" />
          </Button>
          <Button
            onClick={() => setViewMode('list')}
            variant="ghost"
            size="sm"
            className={`px-3 py-1.5 h-auto rounded-lg transition-colors ${viewMode === 'list' ? 'bg-[#4880FF] text-white' : 'text-gray-400 hover:text-gray-900 hover:bg-gray-50'}`}
            title="List View"
          >
            <ListIcon className="w-4 h-4" />
          </Button>
          <Button
            onClick={() => setViewMode('table')}
            variant="ghost"
            size="sm"
            className={`px-3 py-1.5 h-auto rounded-lg transition-colors ${viewMode === 'table' ? 'bg-[#4880FF] text-white' : 'text-gray-400 hover:text-gray-900 hover:bg-gray-50'}`}
            title="Table View"
          >
            <TableIcon className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="pb-12">

        {/* Render sections conditionally based on filter */}
        {(showAll || filter === 'invitations') && renderSection("Invitations", pendingReceived, 'invitation')}
        {(showAll || filter === 'sent') && renderSection("Sent Requests", pendingSent, 'sent')}
        {(showAll || filter === 'connected') && renderSection("My Connections", myConnections, 'connected')}

        {/* Empty States */}
        {(!showAll && filter === 'invitations' && pendingReceived.length === 0) && (
          <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            <p className="text-slate-500 font-medium">You don&apos;t have any pending invitations.</p>
          </div>
        )}
        {(!showAll && filter === 'sent' && pendingSent.length === 0) && (
          <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            <p className="text-slate-500 font-medium">You haven&apos;t sent any connection requests.</p>
          </div>
        )}
        {(!showAll && filter === 'connected' && myConnections.length === 0) && (
          <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            <p className="text-slate-500 font-medium">You don&apos;t have any connections yet.</p>
            <Link href="/connections" className="text-blue-600 font-bold mt-2 inline-block hover:underline">Find people you may know</Link>
          </div>
        )}

        {/* Global Empty State */}
        {showAll && totalItems === 0 && (
          <div className="p-16 text-center bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200 mt-8">
            <h3 className="text-xl font-black text-slate-900 mb-2">Your network is empty</h3>
            <p className="text-slate-500 font-medium mb-6">Start building your professional network today.</p>
            <Link href="/connections">
              <Button className="bg-[#4880FF] hover:bg-blue-600 text-white rounded-2xl px-8 h-12 font-bold shadow-md shadow-blue-200">
                Discover People
              </Button>
            </Link>
          </div>
        )}

      </div>
    </div>
  );
}
