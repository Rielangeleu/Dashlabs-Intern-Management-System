"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import NotificationBell from "./NotificationBell";

export default function Navbar() {
  const pathname = usePathname();
  
  // For the demo, we are hardcoding the logged-in user. 
  // In a real app, you would get this from NextAuth or your session.
  const currentUser = "Night Intern Alex"; 

  // Helper to highlight the active tab
  const isActive = (path: string) => pathname?.startsWith(path) 
    ? "bg-blue-50 text-blue-700 border-blue-600" 
    : "text-gray-600 border-transparent hover:bg-gray-50 hover:text-gray-900";

  return (
    <nav className="bg-white border-b border-[#E5EAF2] shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          
          {/* Left Side: Logo & Links */}
          <div className="flex">
            {/* Logo/Brand */}
            <div className="flex-shrink-0 flex items-center mr-8">
              <span className="text-xl font-bold text-blue-600 tracking-tight">
                Dashlabs<span className="text-gray-800">QA</span>
              </span>
            </div>

            {/* Main Navigation Tabs */}
            <div className="hidden sm:ml-6 sm:flex sm:space-x-4">
              <Link 
                href="/dashboard" 
                className={`inline-flex items-center px-3 pt-1 border-b-2 text-sm font-medium transition-colors ${isActive('/dashboard')}`}
              >
                Dashboard
              </Link>
              <Link 
                href="/ticket-tracker" 
                className={`inline-flex items-center px-3 pt-1 border-b-2 text-sm font-medium transition-colors ${isActive('/ticket')}`}
              >
                Ticket Tracker
              </Link>
              <Link 
                href="/shift-logs" 
                className={`inline-flex items-center px-3 pt-1 border-b-2 text-sm font-medium transition-colors ${isActive('/shift-logs')}`}
              >
                Shift Logs
              </Link>
              <Link 
                href="/task-history" 
                className={`inline-flex items-center px-3 pt-1 border-b-2 text-sm font-medium transition-colors ${isActive('/task-history')}`}
              >
                Audit Trail
              </Link>
            </div>
          </div>

          {/* Right Side: Bell & User Profile */}
          <div className="flex items-center space-x-4">
            
            {/* 🔔 YOUR NOTIFICATION BELL GOES HERE 🔔 */}
            <NotificationBell currentUser={currentUser} />

            {/* User Profile Dropdown Placeholder */}
            <div className="flex items-center space-x-2 border-l border-gray-200 pl-4">
              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-sm">
                {currentUser.charAt(0)}
              </div>
              <span className="text-sm font-medium text-gray-700 hidden sm:block">
                {currentUser}
              </span>
            </div>
          </div>

        </div>
      </div>
    </nav>
  );
}