'use client';

import { useState, useRef, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { cn } from '@/lib/utils';

export function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Mock notifications for now, ideally tied to Supabase Realtime later
  const notifications = [
    { id: 1, title: 'Request #1234', status: 'Processing', time: '2m ago', unread: true },
    { id: 2, title: 'Payment Confirmed', status: 'Completed', time: '1h ago', unread: false },
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 border-2 border-foreground bg-card hover:bg-secondary transition-colors focus:outline-none"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center bg-primary text-primary-foreground text-[10px] font-bold border-2 border-foreground">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-card border-2 border-foreground shadow-[4px_4px_0px_var(--color-foreground)] z-50">
          <div className="p-3 border-b-2 border-foreground bg-secondary font-bold uppercase text-xs flex justify-between items-center">
            <span>Notifications</span>
            {unreadCount > 0 && (
              <span className="text-[10px] text-primary">{unreadCount} New</span>
            )}
          </div>
          <div className="max-h-[300px] overflow-y-auto">
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <div key={notification.id} className={cn("p-3 border-b-2 border-foreground last:border-b-0 hover:bg-secondary/50 cursor-pointer transition-colors", notification.unread ? "bg-primary/5" : "")}>
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-bold text-xs uppercase">{notification.title}</span>
                    <span className="text-[10px] opacity-60 font-bold">{notification.time}</span>
                  </div>
                  <div className="text-[10px] uppercase font-bold text-primary">
                    Status: {notification.status}
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-xs font-bold uppercase opacity-60">
                No notifications
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
