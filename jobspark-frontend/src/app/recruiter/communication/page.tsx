'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Send, Phone, MoreHorizontal, FileText, PhoneIncoming, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';
import { recruiterService } from '@/services/recruiterService';
import { io, Socket } from 'socket.io-client';

export default function CommunicationCenter() {
  const [conversations, setConversations] = useState<any[]>([]);
  const [activeConversation, setActiveConversation] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [socket, setSocket] = useState<Socket | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize socket connection
    const newSocket = io(process.env.NEXT_PUBLIC_API_URL?.replace('/api/v2', '') || 'http://localhost:5000');
    setSocket(newSocket);

    // Fetch user profile and conversations
    const initData = async () => {
      try {
        const profileRes = await recruiterService.getProfile();
        if (profileRes.success) {
          setCurrentUser(profileRes.data.user);
        }

        // We would fetch conversations here (mocking for now, will replace with real API call)
        // const convRes = await communicationService.getConversations();
        setConversations([
          { id: '1', name: 'Ronald Richards', lastMessage: 'Incoming Call', time: '08:34 AM', type: 'call', missed: true },
          { id: '2', name: 'Brooklyn Simmons', lastMessage: 'July 14, 11:15 AM', time: '28:25', type: 'sms' },
          { id: '3', name: 'Savannah Nguyen', lastMessage: 'July 14, 11:15 AM', time: '12:51', type: 'sms' },
        ]);
        setActiveConversation({ id: '1', name: 'Ronald Richards', phone: '+88017 3425 12454' });
      } catch (err) {
        console.error(err);
      }
    };
    initData();

    return () => {
      newSocket.close();
    };
  }, []);

  useEffect(() => {
    if (activeConversation && socket) {
      socket.emit('join_conversation', activeConversation.id);
      
      socket.on('new_message', (message: any) => {
        setMessages(prev => [...prev, message]);
        scrollToBottom();
      });

      return () => {
        socket.emit('leave_conversation', activeConversation.id);
        socket.off('new_message');
      };
    }
  }, [activeConversation, socket]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeConversation) return;

    // Send via API (mocked for now)
    const newMsgObj = {
      id: Date.now().toString(),
      content: newMessage,
      senderId: currentUser?.id,
      createdAt: new Date().toISOString(),
      sender: currentUser
    };
    
    // In real app: await communicationService.sendMessage(activeConversation.id, newMessage)
    
    setMessages([...messages, newMsgObj]);
    setNewMessage('');
    scrollToBottom();
  };

  return (
    <div className="flex h-full bg-[#f8f9fc] overflow-hidden rounded-tl-3xl border-t border-l border-gray-200">
      
      {/* Sidebar: Conversations List */}
      <div className="w-[320px] bg-white border-r border-gray-100 flex flex-col h-full flex-shrink-0">
        <div className="p-4 border-b border-gray-100">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input 
              placeholder="Search by client, date, or keywords..." 
              className="pl-9 bg-gray-50 border-none shadow-none text-sm"
            />
          </div>
          <div className="flex bg-gray-100 p-1 rounded-lg mt-4">
            <button className="flex-1 py-1.5 bg-white text-gray-900 font-medium text-sm rounded-md shadow-sm">Call</button>
            <button className="flex-1 py-1.5 text-gray-500 font-medium text-sm rounded-md">SMS</button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {conversations.map((conv) => (
            <div 
              key={conv.id}
              onClick={() => setActiveConversation(conv)}
              className={cn(
                "flex items-center gap-3 p-4 cursor-pointer hover:bg-gray-50 border-b border-gray-50 transition-colors",
                activeConversation?.id === conv.id ? "bg-gray-50 relative" : ""
              )}
            >
              {activeConversation?.id === conv.id && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#4880FF]" />
              )}
              <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${conv.name}`} alt={conv.name} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-gray-900 truncate">{conv.name}</h3>
                <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
                  {conv.type === 'call' && <PhoneIncoming className={cn("w-3 h-3", conv.missed ? "text-red-500" : "text-green-500")} />}
                  <span className="truncate">{conv.lastMessage}</span>
                </div>
              </div>
              <div className="text-[11px] text-gray-400 font-medium">{conv.time}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col h-full bg-[#fcfdfd]">
        {activeConversation ? (
          <>
            <div className="flex items-center justify-between p-4 bg-white border-b border-gray-100 flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${activeConversation.name}`} alt={activeConversation.name} />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-gray-900">{activeConversation.name}</h2>
                  <p className="text-xs text-gray-500">{activeConversation.phone}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-blue-500">
                <button className="hover:bg-blue-50 p-2 rounded-full"><MessageSquare className="w-5 h-5" /></button>
                <button className="hover:bg-blue-50 p-2 rounded-full"><Phone className="w-5 h-5" /></button>
                <button className="text-gray-400 hover:text-gray-600 p-2"><MoreHorizontal className="w-5 h-5" /></button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <div className="flex justify-center">
                <span className="text-xs font-medium text-gray-400 bg-white px-4 py-1 rounded-full shadow-sm border border-gray-100">Today</span>
              </div>
              
              {/* Dummy Call Log */}
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden flex-shrink-0 mt-1">
                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${activeConversation.name}`} alt={activeConversation.name} />
                </div>
                <div className="flex-1 max-w-[80%]">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-bold text-gray-900">{activeConversation.name}</span>
                    <span className="text-xs text-gray-400">08:34 AM</span>
                  </div>
                  <Card className="p-4 flex items-center justify-between shadow-sm border-gray-100 bg-white">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center">
                        <PhoneIncoming className="w-5 h-5 text-gray-400" />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-gray-900">Missed Call</h4>
                        <p className="text-xs text-gray-500">Don't received</p>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>

              {messages.map((msg, idx) => {
                const isMe = msg.senderId === currentUser?.id;
                return (
                  <div key={idx} className={cn("flex items-start gap-4", isMe ? "flex-row-reverse" : "")}>
                    <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden flex-shrink-0 mt-1">
                      <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${msg.sender?.name || 'User'}`} alt="Avatar" />
                    </div>
                    <div className={cn("flex-1 max-w-[80%] flex flex-col", isMe ? "items-end" : "items-start")}>
                      <div className={cn("flex items-center gap-2 mb-1", isMe ? "flex-row-reverse" : "")}>
                        <span className="text-sm font-bold text-gray-900">{isMe ? 'You' : msg.sender?.name}</span>
                        <span className="text-xs text-gray-400">
                          {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <div className={cn(
                        "p-3 rounded-2xl text-sm",
                        isMe ? "bg-[#4880FF] text-white rounded-tr-sm" : "bg-white border border-gray-100 text-gray-700 shadow-sm rounded-tl-sm"
                      )}>
                        {msg.content}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 bg-white border-t border-gray-100">
              <form onSubmit={handleSendMessage} className="flex items-center gap-3">
                <div className="flex-1 relative">
                  <Input 
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Write a message..." 
                    className="pr-12 py-6 bg-[#f8f9fc] border-none shadow-none rounded-xl"
                  />
                  <Button type="submit" size="icon" className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-[#4880FF] hover:bg-blue-600 rounded-lg">
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400">
            Select a conversation to start messaging
          </div>
        )}
      </div>

      {/* Right Sidebar: Profile Detail */}
      {activeConversation && (
        <div className="w-[300px] bg-white border-l border-gray-100 h-full flex flex-col flex-shrink-0">
          <div className="p-4 border-b border-gray-100">
            <h2 className="text-sm font-semibold text-gray-600">Detail Profile</h2>
          </div>
          <div className="p-6 flex flex-col items-center border-b border-gray-100">
            <div className="w-20 h-20 rounded-full bg-gray-200 overflow-hidden mb-4 ring-4 ring-gray-50">
              <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${activeConversation.name}`} alt={activeConversation.name} className="w-full h-full object-cover" />
            </div>
            <h3 className="text-base font-bold text-gray-900">{activeConversation.name}</h3>
            <p className="text-xs text-gray-500 mt-1">{activeConversation.phone}</p>
            
            <div className="flex items-center gap-3 mt-4">
              <button className="w-10 h-10 rounded-full bg-gray-50 hover:bg-gray-100 flex items-center justify-center text-gray-600 transition-colors">
                <MessageSquare className="w-4 h-4" />
              </button>
              <button className="w-10 h-10 rounded-full bg-gray-50 hover:bg-gray-100 flex items-center justify-center text-gray-600 transition-colors">
                <Phone className="w-4 h-4" />
              </button>
              <button className="w-10 h-10 rounded-full bg-gray-50 hover:bg-gray-100 flex items-center justify-center text-gray-600 transition-colors">
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <div className="p-6">
            <Card className="p-4 bg-[#f8f9fc] border-none shadow-none">
              <div className="flex items-center gap-2 mb-3">
                <FileText className="w-4 h-4 text-gray-500" />
                <h4 className="text-sm font-semibold text-gray-900">Email History</h4>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">
                Hi {activeConversation.name.split(' ')[0]},<br/><br/>
                Your documents for the technical interview have been received successfully. We'll review them and reach out if needed.
              </p>
              <div className="text-[11px] text-gray-400 mt-4 font-medium flex items-center justify-between">
                August 11, 2024, 3:45 PM
                <ArrowRight className="w-3 h-3" />
              </div>
            </Card>

            <div className="mt-6 space-y-4">
              <h4 className="text-sm font-semibold text-gray-900">Details</h4>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Phone number</span>
                <span className="font-medium text-gray-900">+56465432132</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Email</span>
                <span className="font-medium text-gray-900">useremail@cami.com</span>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

function ArrowRight(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  )
}
