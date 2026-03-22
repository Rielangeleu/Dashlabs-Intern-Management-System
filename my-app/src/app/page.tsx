"use client";

import Link from "next/link"; // Next.js Link
import { 
  Clock, 
  ListTodo, 
  AlertTriangle, 
  ArrowRight,
  User,
  Ticket
} from "lucide-react";
import { Button } from "./components/ui/button";
import { Badge } from "./components/ui/badge";
import { TicketCard } from "./components/TicketCard"; // Ensure this path is correct based on your folder structure

export default function Dashboard() {
  const stats = [
    {
      title: "Open Tickets",
      value: "8",
      icon: Ticket,
      color: "text-[#F59E0B]",
      bgColor: "bg-[#FEF3C7]",
    },
    {
      title: "In Progress",
      value: "5",
      icon: Clock,
      color: "text-[#2F6FED]",
      bgColor: "bg-[#DBEAFE]",
    },
    {
      title: "Urgent",
      value: "2",
      icon: AlertTriangle,
      color: "text-[#EF4444]",
      bgColor: "bg-[#FEE2E2]",
    },
  ];

  const pendingConcerns = [
    {
      ticketId: "DASH-9642",
      laboratory: "RTA Clinic",
      concern: "Total iron not showing up on the generated results.",
      status: "In Progress",
      priority: "Urgent",
      assignedSolver: "Dr. Sarah Chen",
      lastActivity: "5 minutes ago",
    },
    {
      ticketId: "DASH-9574",
      laboratory: "Exact Check",
      concern: "Patient results export failing for CBC tests.",
      status: "Waiting for Info",
      priority: "Normal",
      assignedSolver: "Dr. Michael Torres",
      lastActivity: "Yesterday 11:42 PM",
    },
    {
      ticketId: "DASH-9501",
      laboratory: "MediLab Plus",
      concern: "System login timeout issue affecting multiple users.",
      status: "Open",
      priority: "Urgent",
      assignedSolver: "Dr. Sarah Chen",
      lastActivity: "2 hours ago",
    },
  ];

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-[#1E293B] mb-2">Intern Endorsement Dashboard</h2>
          <p className="text-[#64748B] text-sm">
            Overview of laboratory concerns and support tickets
          </p>
        </div>

        {/* Current Shift Card */}
        <div className="bg-white border border-[#E5EAF2] rounded-lg shadow-sm mb-6">
          <div className="px-6 py-4 border-b border-[#E5EAF2] bg-[#FAFBFC]">
            <h3 className="text-[#1E293B] font-medium">Current Shift</h3>
          </div>
          <div className="p-6">
            <div className="flex items-center justify-between">
              
              {/* Doctor Info Group */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[#2F6FED] flex items-center justify-center shrink-0">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-[#1E293B] font-medium">Dr. Sarah Chen</div>
                  <div className="text-sm text-[#64748B]">QA Laboratory</div>
                  <div className="flex items-center gap-2 mt-1">
                    <Clock className="w-4 h-4 text-[#64748B]" />
                    <span className="text-sm text-[#64748B]">
                      Morning Shift • 6:00 AM - 2:00 PM
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons Group */}
              <div className="flex items-center gap-3">
                <Badge className="bg-[#DCFCE7] text-[#22C55E] hover:bg-[#DCFCE7] border-transparent">
                  Active
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
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.title}
                  className="bg-white border border-[#E5EAF2] rounded-lg shadow-sm p-5 flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                      <Icon className={`w-6 h-6 ${stat.color}`} />
                    </div>
                  </div>
                  <div>
                    <div className="text-3xl font-semibold text-[#1E293B] mb-1">
                      {stat.value}
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
            <h3 className="text-[#1E293B] font-medium">Pending Laboratory Concerns</h3>
            <Link href="/ticket-tracker">
              <Button variant="ghost" className="text-[#2F6FED] hover:text-[#1D4ED8] hover:bg-[#F4F7FB]">
                View All Tickets
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
          <div className="p-6 grid grid-cols-1 gap-4">
            {pendingConcerns.map((concern) => (
              <TicketCard key={concern.ticketId} {...concern} />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}