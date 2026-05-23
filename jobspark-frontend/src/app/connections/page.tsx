/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users } from 'lucide-react';
import apiClient from '@/lib/api';

export default function ConnectionsPage() {
  const [recommendedUsers, setRecommendedUsers] = useState<any[]>([]);
  const [myConnections, setMyConnections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const [recommendedRes, connectionsRes] = await Promise.all([
          apiClient.get<any>('/network/users'),
          apiClient.get<any>('/network/connections')
        ]);

        if (recommendedRes.success && recommendedRes.data?.result) {
          setRecommendedUsers(recommendedRes.data.result);
        } else if (!recommendedRes.success) {
          setError(recommendedRes.error || "Failed to load network");
        }

        if (connectionsRes.success && connectionsRes.data?.result) {
          setMyConnections(connectionsRes.data.result);
        }
      } catch (err: any) {
        console.error("Failed to fetch users", err);
        setError(err.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  return (
    <div className="container mx-auto py-10 px-4 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Your Network</h1>
        <p className="text-muted-foreground mt-2">Connect with professionals and expand your career opportunities.</p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <p className="text-muted-foreground">Loading your network...</p>
        </div>
      ) : error ? (
        <div className="flex flex-col justify-center items-center h-40 bg-red-50 rounded-xl border border-red-100">
          <p className="text-red-600 font-medium mb-2">{error}</p>
          <p className="text-sm text-gray-500">Please try logging in again via the frontend.</p>
          <Link href="/login">
            <Button variant="outline" className="mt-4">Go to Login</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-12">
          {/* My Connections Section */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">My Connections ({myConnections.length})</h2>
            {myConnections.length === 0 ? (
              <div className="flex justify-center items-center h-20 bg-white/50 rounded-xl border border-gray-100">
                <p className="text-muted-foreground">You don&apos;t have any connections yet. Send some requests!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {myConnections.map((conn) => {
                  // Determine which user is the "other" person in the connection
                  // Since we are fetching from the current user's perspective, we'll just display both sender and receiver details
                  // depending on who the current user is. The backend returns full sender/receiver objects.
                  // For simplicity in this demo, we'll just show the receiver if it's not us, or sender if it is.
                  // Since we don't have the current user ID easily accessible here, we'll just render the one that has an avatar.
                  const displayUser = conn.receiver.image ? conn.receiver : conn.sender;

                  return (
                    <Card key={conn.id} className="flex flex-col h-full hover:shadow-lg transition-shadow duration-300 overflow-hidden bg-white/80 backdrop-blur-sm border-gray-100">
                      <CardContent className="p-6 flex items-center gap-4">
                        <div className="h-16 w-16 rounded-full overflow-hidden shrink-0">
                          <img src={displayUser.image || "https://github.com/shadcn.png"} alt={displayUser.name} className="h-full w-full object-cover" />
                        </div>
                        <div>
                          <Link href={`/connections/${displayUser.id}`} className="font-bold text-lg text-gray-900 hover:text-blue-600 hover:underline">
                            {displayUser.name}
                          </Link>
                          <p className="text-sm text-gray-500">Connected</p>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </section>

          {/* Recommended Users Section */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">People you may know</h2>
            {recommendedUsers.length === 0 ? (
              <div className="flex justify-center items-center h-20">
                <p className="text-muted-foreground">No recommendations right now.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {recommendedUsers.map((user) => (
                  <Card key={user.id} className="flex flex-col h-full hover:shadow-lg transition-shadow duration-300 overflow-hidden bg-white/80 backdrop-blur-sm border-gray-100">
                    <CardHeader className="p-0 pb-4 relative">
                      <div className="h-24 w-full bg-gradient-to-r from-blue-100 to-indigo-100"></div>
                      <div className="absolute -bottom-6 left-1/2 -translate-x-1/2">
                        <div className="h-20 w-20 rounded-full border-4 border-white overflow-hidden bg-white shadow-sm">
                          <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="flex-1 text-center mt-8 px-4 pb-4">
                      <Link href={`/connections/${user.id}`} className="hover:underline group">
                        <h3 className="font-bold text-lg text-gray-900 group-hover:text-blue-600 transition-colors">{user.name}</h3>
                      </Link>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2 min-h-[40px]">{user.title}</p>

                      <div className="flex items-center justify-center gap-1.5 mt-4 text-xs font-medium text-gray-500 bg-gray-50 py-1.5 px-3 rounded-full w-fit mx-auto">
                        <Users className="size-3.5" />
                        <span>{user.connections || 0} connections</span>
                      </div>
                    </CardContent>
                    <CardFooter className="p-4 pt-0">
                      <Link href={`/connections/${user.id}`} className="w-full">
                        <Button variant="outline" className="w-full rounded-xl border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300 font-semibold transition-all">
                          View Profile
                        </Button>
                      </Link>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  );
}
