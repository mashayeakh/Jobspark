import Link from 'next/link';
import { users } from './data';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users } from 'lucide-react';

export default function ConnectionsPage() {
  return (
    <div className="container mx-auto py-10 px-4 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Your Network</h1>
        <p className="text-muted-foreground mt-2">Connect with professionals and expand your career opportunities.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {users.map((user) => (
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
                <span>{user.connections} connections</span>
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
    </div>
  );
}
