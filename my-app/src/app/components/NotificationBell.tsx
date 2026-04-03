"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getUnreadNotifications, markAsRead } from "@/app/actions/notification";

export default function NotificationBell({ currentUser }: { currentUser: string }) {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  // Function to check the database
  const checkNotifications = async () => {
    if (!currentUser) return;
    const response = await getUnreadNotifications(currentUser);
    if (response.success) setNotifications(response.notifications);
  };

  // Run on load, and poll every 30 seconds
  useEffect(() => {
    checkNotifications();
    const interval = setInterval(checkNotifications, 30000);
    return () => clearInterval(interval);
  }, [currentUser]);

  // Handle clicking a notification
  const handleNotificationClick = async (id: string) => {
    setIsOpen(false);
    // Optimistically remove it from UI
    setNotifications(prev => prev.filter(n => n.id !== id));
    // Tell database to mark as read
    await markAsRead(id);
  };

  return (
    <div className="relative">
      {/* The Bell Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-500 hover:text-blue-600 transition-colors rounded-full hover:bg-gray-100 focus:outline-none"
      >
        {/* SVG Bell Icon */}
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
        </svg>

        {/* The Red Dot Badge */}
        {notifications.length > 0 && (
          <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white border-2 border-white">
            {notifications.length}
          </span>
        )}
      </button>

      {/* The Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
            <h3 className="text-sm font-semibold text-gray-800">Notifications</h3>
          </div>
          
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="px-4 py-6 text-center text-sm text-gray-500">
                You're all caught up!
              </div>
            ) : (
              <ul className="divide-y divide-gray-100">
                {notifications.map((notif) => (
                  <li key={notif.id} className="hover:bg-blue-50 transition-colors">
                    <Link 
                      href={notif.link}
                      onClick={() => handleNotificationClick(notif.id)}
                      className="block px-4 py-3"
                    >
                      <p className="text-sm text-gray-800">{notif.message}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(notif.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}