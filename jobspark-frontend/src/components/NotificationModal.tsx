"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Bell, Check, Filter, Search, MoreHorizontal, ChevronUp, ChevronDown, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

const NOTIFICATIONS = [
  {
    id: 1,
    title: "Prototyping",
    subtitle: "Sample 2",
    time: "4m ago",
    user: "Joseph Collman",
    action: "changed the status to In progress",
    avatar: "https://i.pravatar.cc/150?u=1",
    color: "bg-orange-500",
    unread: true,
  },
  {
    id: 2,
    title: "Quality Control",
    subtitle: "Pre-shipment",
    time: "23m ago",
    user: "Joseph Collman",
    action: "changed timeline to...",
    avatar: "https://i.pravatar.cc/150?u=1",
    color: "bg-purple-500",
    unread: true,
  },
  {
    id: 3,
    title: "Production",
    subtitle: "Sample 2",
    time: "4h ago",
    user: "Wayne Smith",
    action: "replied",
    avatar: "https://i.pravatar.cc/150?u=2",
    color: "bg-orange-500",
    unread: true,
  },
  {
    id: 4,
    title: "Prototyping",
    subtitle: "Sample 2",
    time: "6h ago",
    user: "Anas Rafaat",
    action: "changed the status to In...",
    avatar: "https://i.pravatar.cc/150?u=3",
    color: "bg-orange-500",
    unread: false,
  },
  {
    id: 5,
    title: "Testing",
    subtitle: "Initial research",
    time: "2d ago",
    user: "Tom Labella",
    action: "changed the status to In...",
    avatar: "https://i.pravatar.cc/150?u=4",
    color: "bg-red-500",
    unread: false,
    hasMore: true,
  }
];

export function NotificationModal({ children }: { children: React.ReactNode }) {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSelectNotification = (id: number) => {
    setSelectedId(id);
    setIsModalOpen(true);
  };

  const selectedNotification = NOTIFICATIONS.find(n => n.id === selectedId) || NOTIFICATIONS[0];

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          {children}
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[380px] p-0 rounded-xl overflow-hidden shadow-2xl border-gray-100">
          <div className="p-4 flex items-center justify-between border-b bg-gray-50/50">
            <h2 className="text-base font-bold">Notifications</h2>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" className="h-7 text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-2">
                Mark all as read
              </Button>
            </div>
          </div>
          
          <div className="max-h-[400px] overflow-y-auto">
            {NOTIFICATIONS.map((notif) => (
              <DropdownMenuItem 
                key={notif.id}
                onSelect={() => handleSelectNotification(notif.id)}
                className={cn(
                  "p-4 flex flex-col gap-2 items-start cursor-pointer transition-colors border-b last:border-b-0 border-gray-50 focus:bg-gray-50 rounded-none",
                  notif.unread ? "bg-blue-50/30" : ""
                )}
              >
                <div className="flex w-full justify-between items-start">
                  <div className="flex items-center gap-3">
                    <img src={notif.avatar} alt={notif.user} className="w-10 h-10 rounded-full border border-gray-100" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {notif.user} <span className="text-gray-500 font-normal">{notif.action}</span>
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        <span className={cn("inline-block w-2 h-2 rounded-full mr-1.5", notif.color)} />
                        {notif.title} <span className="text-gray-400">· {notif.subtitle}</span>
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className="text-xs text-gray-400 font-medium whitespace-nowrap">{notif.time}</span>
                    {notif.unread && <div className="w-2.5 h-2.5 rounded-full bg-blue-600" />}
                  </div>
                </div>
              </DropdownMenuItem>
            ))}
          </div>
          <div className="p-2 border-t bg-gray-50 text-center">
            <Button variant="ghost" className="w-full text-sm font-semibold text-blue-600 hover:bg-blue-100 hover:text-blue-700 h-9">
              View all notifications
            </Button>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-3xl p-0 h-[80vh] overflow-hidden flex flex-col rounded-2xl">
          <DialogTitle className="sr-only">Notification Details</DialogTitle>
          {/* RIGHT MAIN CONTENT - DETAILS */}
          <div className="flex-1 flex flex-col bg-white overflow-hidden">
            <div className="p-4 border-b flex justify-between items-center bg-gray-50/50">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <div className={cn("w-3 h-3 rounded-full", selectedNotification.color)} />
                {selectedNotification.title} <span className="text-gray-400 font-normal">· {selectedNotification.subtitle}</span>
              </h2>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="h-8 text-xs gap-1">
                  <Check className="size-3" /> Mark as read
                </Button>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-8">
              <div className="flex justify-between items-start mb-8">
                <h1 className="text-3xl font-bold tracking-tight">{selectedNotification.subtitle}</h1>
              </div>

              <div className="grid grid-cols-[100px_1fr] gap-y-4 mb-8 text-sm">
                <div className="text-gray-500 font-medium">Order</div>
                <div className="font-medium">#80149 - Summer Linen Jacket SS</div>
                
                <div className="text-gray-500 font-medium">Stage</div>
                <div className="flex items-center gap-2 font-medium">
                  <div className={cn("w-3 h-3 rounded-sm", selectedNotification.color)}></div>
                  {selectedNotification.title}
                </div>
                
                <div className="text-gray-500 font-medium">Timeline</div>
                <div className="font-medium text-gray-700">16/08/2022 - 31/08/2022</div>
                
                <div className="text-gray-500 font-medium">Status</div>
                <div>
                  <Badge variant="outline" className="bg-gray-50 border-gray-200 gap-1.5 py-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 border-2 border-white box-content"></div>
                    In progress
                  </Badge>
                </div>
              </div>

              <Separator className="my-6" />

              <div className="border rounded-xl p-3 bg-gray-50/50">
                <Input 
                  placeholder="Add a comment. Use @ to mention." 
                  className="border-0 bg-transparent shadow-none focus-visible:ring-0 px-1 pb-4" 
                />
                <div className="flex items-center gap-2 text-xs text-gray-500 px-1 mt-2">
                  <span className="flex items-center justify-center border rounded-full w-4 h-4">i</span>
                  Comments will visible after approval from Recruiter
                </div>
              </div>

              <div className="mt-10 relative">
                <div className="absolute left-4 top-0 bottom-0 w-px bg-gray-200"></div>
                
                <div className="flex justify-center mb-8 relative z-10">
                  <span className="bg-white px-3 text-xs font-bold tracking-wider text-gray-400 uppercase">
                    June 27th
                  </span>
                </div>

                {/* Timeline Items */}
                <div className="space-y-8">
                  <div className="relative pl-12">
                    <img src={selectedNotification.avatar} alt="Avatar" className="absolute left-0 top-0 w-8 h-8 rounded-full border-4 border-white shadow-sm" />
                    <div className="mb-1">
                      <span className="font-bold">{selectedNotification.user}</span>
                    </div>
                    <div className="text-sm text-gray-500 mb-3">{selectedNotification.action} · {selectedNotification.time}</div>
                    
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-gray-600">Moved status to</span>
                      <Badge variant="outline" className="bg-white border-gray-200 gap-1.5 font-normal shadow-sm">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                        Pre-production check
                      </Badge>
                    </div>
                  </div>

                  <div className="relative pl-12">
                    <div className="absolute left-1 top-1 w-6 h-6 rounded-full bg-gray-100 border-4 border-white flex items-center justify-center shadow-sm">
                      <Check className="size-3 text-gray-500" />
                    </div>
                    <div className="flex items-center gap-2 mb-2 text-sm">
                      <span className="font-bold text-gray-900">System Notification</span>
                      <span className="text-gray-600">updated status automatically</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="bg-white border-gray-200 gap-1.5 font-normal shadow-sm">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                        Pre-production check
                      </Badge>
                      <span className="text-sm text-gray-400">12 hours ago</span>
                    </div>
                  </div>
                </div>
              </div>
              
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
