"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { getDashboardData } from "./actions/ticket";
import Link from "next/link";
import { Clock, ListTodo, AlertTriangle, ArrowRight, User, Ticket } from "lucide-react";
import { Button } from "./components/ui/button";
import { Badge } from "./components/ui/badge";
import { TicketCard } from "./components/TicketCard";

export default function Dashboard() {
  const { data: session, status: sessionStatus } = useSession();
  const userName = session?.user?.name;
  const userRole = (session?.user as any)?.role || "Intern";

  const [isLoading, setIsLoading] = useState(true);
  const [ticketStats, setTicketStats] = useState({ open: 0, inProgress: 0, urgent: 0 });
  const [pendingConcerns, setPendingConcerns] = useState<any[]>([]);
  const [shiftInfo, setShiftInfo] = useState({ name: "Loading...", time: "" });

  // 1. Calculate the Shift based on exact real-world time
  useEffect(() => {
    const currentHour = new Date().getHours();
    if (currentHour >= 6 && currentHour < 14) {
      setShiftInfo({ name: "Morning Shift", time: "6:00 AM - 2:00 PM" });
    } else if (currentHour >= 14 && currentHour < 22) {
      setShiftInfo({ name: "Afternoon Shift", time: "2:00 PM - 10:00 PM" });
    } else {
      setShiftInfo({ name: "Night Shift", time: "10:00 PM - 6:00 AM" });
    }
  }, []);

  // 2. Fetch the Dashboard Data based on who is logged in
  useEffect(() => {
    async function loadDashboard() {
      // Only fetch if session is fully loaded (so we know who they are)
      if (sessionStatus !== "loading") {
        const result = await getDashboardData(userName);
        if (result.success) {
          setTicketStats(result.stats);
          setPendingConcerns(result.pendingConcerns);
        }
        setIsLoading(false);
      }
    }
    loadDashboard();
  }, [userName, sessionStatus]);

  // The 3 UI Cards for the Summary
  const statsDisplay = [
    { title: "Open Tickets", value: ticketStats.open, icon: Ticket, color: "text-[#F59E0B]", bgColor: "bg-[#FEF3C7]" },
    { title: "In Progress", value: ticketStats.inProgress, icon: Clock, color: "text-[#2F6FED]", bgColor: "bg-[#DBEAFE]" },
    { title: "Urgent", value: ticketStats.urgent, icon: AlertTriangle, color: "text-[#EF4444]", bgColor: "bg-[#FEE2E2]" },
  ];

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Page Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-[#1E293B] mb-2">Intern Endorsement Dashboard</h2>
          <p className="text-[#64748B] text-sm">Overview of laboratory concerns and support tickets</p>
        </div>

        {/* Current Shift Card */}
        <div className="bg-white border border-[#E5EAF2] rounded-lg shadow-sm mb-6">
          <div className="px-6 py-4 border-b border-[#E5EAF2] bg-[#FAFBFC]">
            <h3 className="text-[#1E293B] font-medium">Current Shift</h3>
          </div>
          <div className="p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              
              {/* Doctor Info Group */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[#2F6FED] flex items-center justify-center shrink-0">
                  <span className="text-white text-lg font-bold">
                    {userName ? userName.charAt(0).toUpperCase() : "U"}
                  </span>
                </div>
                <div>
                  <div className="text-[#1E293B] font-medium text-lg">{userName || "Loading Profile..."}</div>
                  <div className="text-sm text-[#64748B]">{userRole}</div>
                  <div className="flex items-center gap-2 mt-1">
                    <Clock className="w-4 h-4 text-[#2F6FED]" />
                    <span className="text-sm font-medium text-[#2F6FED]">
                      {shiftInfo.name} • <span className="text-[#64748B] font-normal">{shiftInfo.time}</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons Group */}
              <div className="flex items-center gap-3">
                <Badge className="bg-[#DCFCE7] text-[#22C55E] hover:bg-[#DCFCE7] border-transparent py-1.5 px-3">
                  <div className="w-2 h-2 rounded-full bg-[#22C55E] mr-2 animate-pulse" /> Active
                </Badge>
                <Link href="/create-ticket">
                  <Button className="bg-[#2F6FED] hover:bg-[#1D4ED8] text-white shadow-sm">
                    Create New Ticket
                  </Button>
                </Link>
              </div>

            </div>
          </div>
        </div>

        {/* Ticket Summary */}
        <div className="mb-6">
          <h3 className="text-[#1E293B] font-medium mb-4">Ticket Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {statsDisplay.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.title} className="bg-white border border-[#E5EAF2] rounded-lg shadow-sm p-5 flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                      <Icon className={`w-6 h-6 ${stat.color}`} />
                    </div>
                  </div>
                  <div>
                    <div className="text-3xl font-semibold text-[#1E293B] mb-1">
                      {isLoading ? "-" : stat.value}
                    </div>
                    <div className="text-sm text-[#64748B]">{stat.title}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Pending Laboratory Concerns */}
        <div className="bg-white border border-[#E5EAF2] rounded-lg shadow-sm">
          <div className="px-6 py-4 border-b border-[#E5EAF2] bg-[#FAFBFC] flex items-center justify-between">
            <h3 className="text-[#1E293B] font-medium">My Pending Assignments</h3>
            <Link href="/ticket-tracker">
              <Button variant="ghost" className="text-[#2F6FED] hover:text-[#1D4ED8] hover:bg-[#F4F7FB]">
                View All Tickets
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
          <div className="p-6">
            {isLoading ? (
              <div className="text-center py-8 text-slate-500">Checking assignments...</div>
            ) : pendingConcerns.length > 0 ? (
              <div className="grid grid-cols-1 gap-4">
                {pendingConcerns.map((concern) => (
                  <TicketCard key={concern.ticketId} {...concern} />
                ))}
              </div>
            ) : (
              <div className="text-center py-10 bg-slate-50 border border-dashed border-slate-200 rounded-lg">
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3">
                  <ListTodo className="w-6 h-6 text-slate-400" />
                </div>
                <h3 className="text-slate-700 font-medium mb-1">No Pending Assignments</h3>
                <p className="text-slate-500 text-sm">You are all caught up on your assigned tickets!</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}