"use client";

import Link from "next/link";
import { Badge } from "./ui/badge";
import { User, Clock, ChevronRight } from "lucide-react";

interface TicketCardProps {
  ticketId: string;
  laboratory: string;
  concern: string;
  status: string;
  priority: string;
  assignedSolver: string;
  lastActivity: string;
}

export function TicketCard({ ticketId, laboratory, concern, status, priority, assignedSolver, lastActivity }: TicketCardProps) {
  const getStatusColor = (s: string) => {
    if (s === "Open") return "bg-[#FEF3C7] text-[#F59E0B]";
    if (s === "In Progress") return "bg-[#DBEAFE] text-[#2F6FED]";
    if (s === "Waiting for Info") return "bg-[#FEF3C7] text-[#F59E0B]";
    if (s === "Resolved") return "bg-[#DCFCE7] text-[#22C55E]";
    return "bg-slate-100 text-slate-800";
  };

  const getPriorityColor = (p: string) => {
    if (p === "Urgent") return "text-[#EF4444]";
    if (p === "Normal") return "text-[#2F6FED]";
    return "text-[#64748B]";
  };

  return (
    <Link href={`/ticket/${ticketId}`}>
      <div className="bg-white border border-[#E2E8F0] rounded-lg p-5 hover:border-[#2F6FED] hover:shadow-md transition-all cursor-pointer group">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-3">
          <div className="flex items-center gap-3">
            <span className="font-semibold text-[#2F6FED]">{ticketId}</span>
            <Badge className={`${getStatusColor(status)} border-transparent hover:${getStatusColor(status)}`}>
              {status}
            </Badge>
            <span className={`text-sm font-medium ${getPriorityColor(priority)}`}>{priority} Priority</span>
          </div>
          <div className="text-sm text-[#64748B] flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            {lastActivity}
          </div>
        </div>

        <h4 className="text-[#1E293B] font-medium mb-1">{laboratory}</h4>
        <p className="text-[#64748B] text-sm line-clamp-2 mb-4">{concern}</p>

        <div className="flex items-center justify-between border-t border-[#E2E8F0] pt-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-[#E0E7FF] flex items-center justify-center">
              <User className="w-3 h-3 text-[#2F6FED]" />
            </div>
            <span className="text-sm font-medium text-[#1E293B]">{assignedSolver}</span>
          </div>
          <div className="text-[#2F6FED] text-sm font-medium flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
            View Details <ChevronRight className="w-4 h-4 ml-1" />
          </div>
        </div>
      </div>
    </Link>
  );
}