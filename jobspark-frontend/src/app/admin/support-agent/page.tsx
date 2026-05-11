'use client';

import { AdminShell } from '@/components/layouts/AdminShell';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Bot, User, Send, Clock, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEffect, useState, useRef } from 'react';

interface Stats {
  totalSessions: number;
  activeSessions: number;
  resolvedSessions: number;
  escalatedSessions: number;
  resolutionRate: string;
  avgResponseTime: string;
}

interface ActiveSession {
  id: string;
  user: string;
  role: string;
  issue: string;
  handledBy: string;
  status: string;
  updatedAt: string;
}

interface ChatMessage {
  id: string;
  sessionId: string;
  message: string;
  isUser: boolean;
  timestamp: string;
}

export default function SupportAgentPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [activeChats, setActiveChats] = useState<ActiveSession[]>([]);
  const [selectedChat, setSelectedChat] = useState<ActiveSession | null>(null);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [inputMessage, setInputMessage] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/admin/support-agent/stats');
      const data = await res.json();
      if (data.success) setStats(data.result);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const fetchActiveSessions = async () => {
    try {
      const res = await fetch('/api/admin/support-agent/active-sessions');
      const data = await res.json();
      if (data.success) {
        setActiveChats(data.result);
        if (data.result.length > 0 && !selectedChat) {
          const firstChat = data.result[0];
          setSelectedChat(firstChat);
          fetchChatHistory(firstChat.id);
        }
      }
    } catch (error) {
      console.error('Failed to fetch active sessions:', error);
    }
  };

  const fetchChatHistory = async (sessionId: string) => {
    try {
      const res = await fetch(`/api/admin/support-agent/history/${sessionId}`);
      const data = await res.json();
      if (data.success) setChatHistory(data.result);
    } catch (error) {
      console.error('Failed to fetch chat history:', error);
    }
  };

  useEffect(() => {
    const init = async () => {
      await Promise.all([fetchStats(), fetchActiveSessions()]);
      setLoading(false);
    };
    init();

    const interval = setInterval(() => {
      fetchStats();
      fetchActiveSessions();
    }, 15000); // Poll every 15s
    return () => clearInterval(interval);
  }, []);



  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  const handleTakeOver = async () => {
    if (!selectedChat) return;
    try {
      const res = await fetch(`/api/admin/support-agent/escalate/${selectedChat.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: 'Admin manually took over the session' })
      });
      const data = await res.json();
      if (data.success) {
        fetchActiveSessions();
      }
    } catch (error) {
      console.error('Failed to escalate session:', error);
    }
  };

  return (
    <AdminShell title="Support Agent">
      <div className="p-8 space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold text-[#202224]">AI Support Agent</h2>
            <p className="text-gray-500 font-medium">Automated resolution and human-handoff management</p>
          </div>
          <div className="flex gap-4">
            <Button variant="outline" className="rounded-xl font-bold border-gray-200">
              Training Knowledge Base
            </Button>
            <Button className="rounded-xl bg-blue-600 font-bold shadow-lg" onClick={() => fetchActiveSessions()}>
              Refresh Console
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { label: 'Active Tickets', val: stats?.activeSessions?.toString() || '0', icon: MessageSquare, color: 'text-blue-600', bg: 'bg-blue-50' },
            { label: 'AI Resolution', val: stats?.resolutionRate || '0%', icon: Bot, color: 'text-green-600', bg: 'bg-green-50' },
            { label: 'Avg Resp Time', val: stats?.avgResponseTime || '0s', icon: Clock, color: 'text-purple-600', bg: 'bg-purple-50' },
            { label: 'Escalated', val: stats?.escalatedSessions?.toString() || '0', icon: CheckCircle2, color: 'text-orange-600', bg: 'bg-orange-50' },
          ].map((stat, i) => (
            <Card key={i} className="border-0 shadow-sm rounded-2xl">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className={`p-3 rounded-xl ${stat.bg} ${stat.color} mb-3`}>
                  <stat.icon className="h-6 w-6" />
                </div>
                <p className="text-xs text-gray-500 font-bold mb-1 uppercase">{stat.label}</p>
                <h3 className="text-2xl font-bold text-[#202224]">{stat.val}</h3>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-4">
            <h4 className="font-bold text-gray-900 px-2">Active Conversations</h4>
            {activeChats.length === 0 ? (
              <p className="text-gray-500 text-sm px-2">No active conversations found.</p>
            ) : (
              activeChats.map((chat) => (
                <Card 
                  key={chat.id} 
                  className={`border-0 shadow-sm rounded-2xl cursor-pointer group transition-all ${selectedChat?.id === chat.id ? 'ring-2 ring-blue-500 bg-blue-50/50' : 'hover:bg-white'}`}
                  onClick={() => {
                    setSelectedChat(chat);
                    fetchChatHistory(chat.id);
                  }}
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h5 className="font-bold text-[#202224] group-hover:text-blue-600">{chat.user}</h5>
                      <Badge className={`${
                        chat.status === 'Critical' ? 'bg-red-50 text-red-600' : 
                        chat.status === 'Resolved' ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-600'
                      } border-0 rounded-lg text-[10px] font-bold`}>
                        {chat.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-500 font-medium mb-3">{chat.issue}</p>
                    <div className="flex items-center gap-2">
                      {chat.handledBy === 'AI Agent' ? (
                        <Bot className="h-3 w-3 text-blue-500" />
                      ) : (
                        <User className="h-3 w-3 text-orange-500" />
                      )}
                      <span className="text-xs text-gray-500 font-bold">{chat.handledBy}</span>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          <Card className="lg:col-span-2 border-0 shadow-sm rounded-2xl bg-white flex flex-col h-[600px]">
            {selectedChat ? (
              <>
                <CardHeader className="border-b border-gray-100 flex flex-row items-center justify-between p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold uppercase">
                      {selectedChat.user.substring(0, 2)}
                    </div>
                    <div>
                      <h4 className="font-bold text-[#202224]">{selectedChat.user}</h4>
                      <p className={`text-xs font-bold ${selectedChat.handledBy === 'Human' ? 'text-orange-500' : 'text-green-500'}`}>
                        {selectedChat.handledBy === 'Human' ? 'Human Agent Handling' : 'AI Agent Handling...'}
                      </p>
                    </div>
                  </div>
                  {selectedChat.handledBy !== 'Human' && (
                    <Button onClick={handleTakeOver} variant="outline" size="sm" className="rounded-xl border-gray-200 font-bold text-orange-600">
                      Take Over (Handoff)
                    </Button>
                  )}
                </CardHeader>
                <CardContent className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50/30">
                  {chatHistory.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-gray-400 text-sm font-medium">No messages yet.</div>
                  ) : (
                    chatHistory.map((msg, i) => (
                      <div key={i} className={`flex ${msg.isUser ? 'justify-start' : 'justify-end'}`}>
                        <div className={`${msg.isUser ? 'bg-gray-100 text-gray-700 rounded-tl-none' : 'bg-blue-600 text-white rounded-tr-none'} p-4 rounded-2xl max-w-[80%]`}>
                          <p className="text-sm font-medium">{msg.message}</p>
                          <span className={`text-[10px] mt-1 block opacity-70 ${msg.isUser ? 'text-gray-500' : 'text-blue-100'}`}>
                            {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                  <div ref={chatEndRef} />
                </CardContent>
                <div className="p-6 border-t border-gray-100 flex gap-4">
                  <input 
                    type="text" 
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder={selectedChat.handledBy === 'Human' ? "Type a reply to the user..." : "Take over session to reply..."} 
                    disabled={selectedChat.handledBy !== 'Human'}
                    className="flex-1 bg-gray-50 border-0 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50" 
                  />
                  <Button disabled={selectedChat.handledBy !== 'Human' || !inputMessage.trim()} className="bg-blue-600 rounded-xl px-6">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-400 font-medium">
                Select a conversation to view history
              </div>
            )}
          </Card>
        </div>
      </div>
    </AdminShell>
  );
}
