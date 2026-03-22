"use client"; // Good practice for interactive UI components

import { Badge } from "./ui/badge"; 
import { Button } from "./ui/button"; // Adjusted path assuming it's in the same folder
import { Clock, User } from "lucide-react";
import Link from "next/link"; // Changed to Next.js Link

interface TicketCardProps {
  ticketId: string;
  laboratory: string;
  concern: string;
  status: string;
  priority: string;
  assignedSolver?: string;
  lastActivity: string;
}

export function TicketCard({
  ticketId,
  laboratory,
  concern,
  status,
  priority,
  assignedSolver,
  lastActivity,
}: TicketCardProps) {
  const getStatusBadge = (status: string) => {
    const styles = {
      Open: "bg-[#FEF3C7] text-[#F59E0B] hover:bg-[#FEF3C7]",
      "In Progress": "bg-[#DBEAFE] text-[#2F6FED] hover:bg-[#DBEAFE]",
      "Waiting for Info": "bg-[#FEF3C7] text-[#F59E0B] hover:bg-[#FEF3C7]",
      Resolved: "bg-[#DCFCE7] text-[#22C55E] hover:bg-[#DCFCE7]",
    };
    return styles[status as keyof typeof styles] || "";
  };

  const getPriorityBadge = (priority: string) => {
    const styles = {
      Urgent: "bg-[#FEE2E2] text-[#EF4444] hover:bg-[#FEE2E2]",
      Normal: "bg-[#DBEAFE] text-[#2F6FED] hover:bg-[#DBEAFE]",
      Low: "bg-[#E5EAF2] text-[#64748B] hover:bg-[#E5EAF2]",
    };
    return styles[priority as keyof typeof styles] || "";
  };

  return (
    <div className="bg-white border border-[#E5EAF2] rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm font-medium text-[#2F6FED]">{ticketId}</span>
            <Badge className={getPriorityBadge(priority)}>{priority}</Badge>
          </div>
          <h4 className="text-sm font-medium text-[#1E293B] mb-1">
            Laboratory: {laboratory}
          </h4>
          <p className="text-sm text-[#64748B] line-clamp-2">{concern}</p>
        </div>
      </div>
      <div className="flex items-center justify-between pt-3 border-t border-[#E5EAF2]">
        <div className="flex items-center gap-4 text-xs text-[#64748B]">
          {assignedSolver && (
            <div className="flex items-center gap-1">
              <User className="w-3 h-3" />
              <span>{assignedSolver}</span>
            </div>
          )}
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>{lastActivity}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge className={getStatusBadge(status)}>{status}</Badge>
          {/* Changed 'to' to 'href' for Next.js */}
          <Link href={`/ticket/${ticketId}`}>
            <Button size="sm" className="bg-[#2F6FED] hover:bg-[#1D4ED8] text-white">
              View
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}