"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Bell } from "lucide-react";

export function NotificationModal({ children }: { children: React.ReactNode }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {children}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[380px] p-0 rounded-xl overflow-hidden shadow-2xl border-gray-100">
        <div className="p-4 flex items-center justify-between border-b bg-gray-50/50">
          <h2 className="text-base font-bold">Notifications</h2>
        </div>
        
        <div className="p-10 text-center flex flex-col items-center justify-center gap-3 bg-white">
          <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-2">
            <Bell className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">Feature Coming Soon</h3>
          <p className="text-sm text-gray-500 leading-relaxed">
            We are working hard to bring you a robust notifications system. Stay tuned for future updates!
          </p>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

