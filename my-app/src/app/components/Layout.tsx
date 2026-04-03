"use client"; // Required for usePathname and useSession

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react"; // Import NextAuth hooks
import { 
  LayoutDashboard, 
  FileText, 
  ClipboardList, 
  ListTodo,
  History,
  Bell, 
  Settings as SettingsIcon,
  User,
  Ticket,
  LogOut // Added the logout icon
} from "lucide-react";

// The menu items array
const menuItems = [
  { path: "/", label: "Dashboard", icon: LayoutDashboard },
  { path: "/create-ticket", label: "Create Ticket", icon: Ticket },
  { path: "/create-endorsement", label: "Create Endorsement", icon: FileText },
  { path: "/ticket-tracker", label: "Ticket Tracker", icon: ListTodo },
  { path: "/shift-logs", label: "Shift Logs", icon: ClipboardList },
  { path: "/endorsement-review", label: "Endorsement Review", icon: ClipboardList },
  { path: "/task-history", label: "Task History", icon: History },
  { path: "/notifications", label: "Notifications", icon: Bell },
  { path: "/settings", label: "Settings", icon: SettingsIcon },
];

export default function FigmaLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: session, status } = useSession(); // Get the active user session

  // 1. Hide the entire layout if the user is on the login screen
  if (pathname === "/login") {
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen bg-[#F4F7FB]">
      {/* Left Sidebar */}
      <aside className="w-64 bg-[#1E293B] text-white flex flex-col">
        {/* Sidebar Logo */}
        <div className="px-6 py-5 border-b border-[#334155]">
          <img src="/Dashlabs logo.png" alt="Dashlabs" className="h-8" />
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 py-6 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.path;
            
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`flex items-center gap-3 px-6 py-3 transition-colors relative ${
                  isActive
                    ? "bg-[#2F6FED] text-white"
                    : "text-[#94A3B8] hover:bg-[#334155] hover:text-white"
                }`}
              >
                {isActive && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#60A5FA]" />
                )}
                <Icon className="w-5 h-5" />
                <span className="text-sm">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="px-6 py-4 border-t border-[#334155]">
          <div className="text-xs text-[#64748B]">
            © 2026 Dashlabs.ai
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation Bar */}
        <header className="bg-white border-b border-[#E5EAF2]">
          <div className="px-6 py-3 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-[#1E293B] font-semibold">Intern Endorsement System</h1>
            </div>
            
            <div className="flex items-center gap-4">
              <button className="p-2 hover:bg-[#F4F7FB] rounded-lg transition-colors relative">
                <Bell className="w-5 h-5 text-[#64748B]" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#EF4444] rounded-full" />
              </button>
              
              {/* Dynamic User Profile */}
              <div className="flex items-center gap-2 px-3 py-1.5 bg-[#F4F7FB] rounded-lg border border-[#E5EAF2]">
                <div className="w-8 h-8 rounded-full bg-[#2F6FED] flex items-center justify-center text-white font-medium text-sm">
                  {/* Show the first letter of their name, or a User icon if loading */}
                  {status === "loading" ? <User className="w-4 h-4" /> : session?.user?.name?.charAt(0) || "U"}
                </div>
                <div className="text-sm pr-2">
                  <div className="text-[#1E293B] font-medium whitespace-nowrap">
                    {session?.user?.name || "Loading..."}
                  </div>
                  <div className="text-[#64748B] text-xs">
                    {/* We cast to 'any' here to access the custom role we added to the session */}
                    {(session?.user as any)?.role || "Intern"}
                  </div>
                </div>
              </div>

              {/* Log Out Button */}
              <button 
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="p-2 text-[#94A3B8] hover:text-[#EF4444] hover:bg-red-50 rounded-lg transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-5 h-5" />
              </button>

            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}