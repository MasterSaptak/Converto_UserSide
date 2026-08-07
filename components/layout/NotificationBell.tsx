'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { Bell, Check, Trash2, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNotifications } from '@/hooks/useNotifications';
import { NotificationCategory, NotificationFilter } from '@/lib/notifications/types';
import { formatRelativeTime, truncateMessage } from '@/lib/notifications/utils';
import Link from 'next/link';

export function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState<NotificationFilter>('all');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { 
    notifications, 
    unreadCount, 
    loading,
    markAsRead, 
    markAllAsRead, 
    deleteNotification,
    clearReadNotifications,
    filterNotifications
  } = useNotifications();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredNotifications = filterNotifications(filter);
  
  // Memoize counts for tabs
  const tabCounts = useMemo(() => ({
    all: notifications.length,
    unread: unreadCount,
    request: notifications.filter(n => n.category === NotificationCategory.REQUEST).length,
    payment: notifications.filter(n => n.category === NotificationCategory.PAYMENT).length,
    chat: notifications.filter(n => n.category === NotificationCategory.CHAT).length,
  }), [notifications, unreadCount]);

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (deletingId === id) {
      await deleteNotification(id);
      setDeletingId(null);
    } else {
      setDeletingId(id);
      // Reset confirmation after 3 seconds
      setTimeout(() => {
        setDeletingId((current) => current === id ? null : current);
      }, 3000);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 border-2 border-foreground bg-card hover:bg-secondary transition-colors focus:outline-none"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center bg-primary text-primary-foreground text-[10px] font-bold border-2 border-foreground animate-bounce">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="fixed md:absolute inset-x-2 md:inset-x-auto top-auto md:right-0 mt-2 md:w-[420px] bg-card border-2 border-foreground shadow-[4px_4px_0px_var(--color-foreground)] z-50 flex flex-col max-h-[70vh] md:max-h-[600px]">
          
          {/* Header */}
          <div className="p-3 border-b-2 border-foreground bg-secondary font-bold uppercase text-xs flex justify-between items-center">
            <span>Notifications</span>
            {loading ? (
              <Loader2 className="w-3 h-3 animate-spin opacity-50" />
            ) : (
              <div className="flex gap-2 items-center">
                {unreadCount > 0 && (
                  <span className="text-[10px] text-primary">{unreadCount} New</span>
                )}
              </div>
            )}
          </div>
          
          {/* Tabs */}
          <div className="flex border-b-2 border-foreground overflow-x-auto scrollbar-hide text-[9px] md:text-[10px] uppercase font-bold bg-white">
            <button onClick={() => setFilter('all')} className={cn("px-2 md:px-3 py-1.5 md:py-2 shrink-0 border-r-2 border-foreground transition-colors", filter === 'all' ? "bg-primary text-primary-foreground" : "hover:bg-secondary")}>
              All ({tabCounts.all})
            </button>
            <button onClick={() => setFilter('unread')} className={cn("px-2 md:px-3 py-1.5 md:py-2 shrink-0 border-r-2 border-foreground transition-colors", filter === 'unread' ? "bg-primary text-primary-foreground" : "hover:bg-secondary")}>
              Unread ({tabCounts.unread})
            </button>
            <button onClick={() => setFilter(NotificationCategory.CHAT)} className={cn("px-2 md:px-3 py-1.5 md:py-2 shrink-0 border-r-2 border-foreground transition-colors", filter === NotificationCategory.CHAT ? "bg-primary text-primary-foreground" : "hover:bg-secondary")}>
              Chat ({tabCounts.chat})
            </button>
            <button onClick={() => setFilter(NotificationCategory.REQUEST)} className={cn("px-2 md:px-3 py-1.5 md:py-2 shrink-0 border-r-2 border-foreground transition-colors", filter === NotificationCategory.REQUEST ? "bg-primary text-primary-foreground" : "hover:bg-secondary")}>
              Requests ({tabCounts.request})
            </button>
            <button onClick={() => setFilter(NotificationCategory.PAYMENT)} className={cn("px-2 md:px-3 py-1.5 md:py-2 shrink-0 transition-colors", filter === NotificationCategory.PAYMENT ? "bg-primary text-primary-foreground" : "hover:bg-secondary")}>
              Payments ({tabCounts.payment})
            </button>
          </div>

          {/* List */}
          <div className="overflow-y-auto flex-1 bg-white min-h-[200px]">
            {loading && notifications.length === 0 ? (
              <div className="p-8 text-center flex flex-col items-center justify-center opacity-50">
                 <Loader2 className="w-6 h-6 animate-spin mb-2" />
                 <span className="text-xs font-bold uppercase">Loading...</span>
              </div>
            ) : filteredNotifications.length > 0 ? (
              filteredNotifications.map((notification) => {
                const isUnread = !notification.is_read;
                const ContentWrapper = notification.action_url ? Link : 'div';
                
                return (
                  <div key={notification.id} className="relative group border-b-2 border-foreground last:border-b-0 flex">
                    <ContentWrapper 
                      href={notification.action_url || '#'}
                      onClick={() => { if (isUnread) markAsRead(notification.id); setIsOpen(false); }}
                      className={cn("p-4 flex-1 cursor-pointer transition-colors block", isUnread ? "bg-primary/5" : "hover:bg-secondary/50")}
                    >
                      <div className="flex justify-between items-start mb-1 gap-2">
                        <span className="font-bold text-xs uppercase leading-tight pr-6">
                          {notification.title}
                        </span>
                        <span className="text-[10px] opacity-60 font-bold shrink-0">
                          {formatRelativeTime(notification.created_at)}
                        </span>
                      </div>
                      <div className="text-[10px] font-medium opacity-80 mt-1">
                        {truncateMessage(notification.message)}
                      </div>
                    </ContentWrapper>
                    
                    {/* Delete Action */}
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex flex-col gap-1 items-end">
                       <button 
                         onClick={(e) => handleDelete(e, notification.id)}
                         className={cn(
                           "transition-all p-1.5 border-2 border-foreground bg-card text-xs font-bold",
                           deletingId === notification.id 
                             ? "bg-red-500 text-white opacity-100" 
                             : "opacity-0 group-hover:opacity-100 hover:bg-secondary text-foreground"
                         )}
                         title={deletingId === notification.id ? "Click to confirm delete" : "Delete notification"}
                       >
                         {deletingId === notification.id ? "Delete?" : <Trash2 className="w-3 h-3" />}
                       </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-12 text-center flex flex-col items-center justify-center opacity-60">
                <Bell className="w-8 h-8 mb-3 opacity-50" />
                <div className="text-xs font-bold uppercase">No notifications yet</div>
                <div className="text-[10px] font-medium mt-1">You&apos;re all caught up.</div>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          {notifications.length > 0 && (
            <div className="border-t-2 border-foreground bg-card p-2 flex flex-wrap gap-2 justify-between items-center text-[10px] uppercase font-bold">
               <button 
                 onClick={markAllAsRead} 
                 disabled={unreadCount === 0}
                 className="flex items-center gap-1 hover:text-primary transition-colors disabled:opacity-50 disabled:hover:text-foreground"
               >
                 <Check className="w-3 h-3" /> Mark all read
               </button>
               <button 
                 onClick={clearReadNotifications}
                 className="flex items-center gap-1 hover:text-red-500 transition-colors"
               >
                 <Trash2 className="w-3 h-3" /> Clear read
               </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
