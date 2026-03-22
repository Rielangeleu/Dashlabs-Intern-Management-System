"use client";

import { useState, useEffect } from "react";
import { getTickets } from "../actions/ticket"; // Import our new fetch function
import { Search, Filter, Calendar, User as UserIcon } from "lucide-react";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";

// Define the type so TypeScript knows what a ticket looks like
type TicketData = {
  id: string;
  ticketId: string;
  laboratory: string;
  concernSummary: string;
  assignedSolver: string | null;
  priority: string;
  status: string;
  dateCreated: string;
  lastActivity: string;
};

export default function TicketTrackerPage() {
  const [tickets, setTickets] = useState<TicketData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [laboratoryFilter, setLaboratoryFilter] = useState("all");

  // Fetch the data from MongoDB when the page loads
  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      const result = await getTickets();
      if (result.success && result.tickets) {
        setTickets(result.tickets);
      }
      setIsLoading(false);
    }
    loadData();
  }, []);

  // Make the filters and search bar actually work!
  const filteredTickets = tickets.filter((ticket) => {
    const matchesSearch = 
      ticket.ticketId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.laboratory.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.concernSummary.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesPriority = priorityFilter === "all" || ticket.priority.toLowerCase() === priorityFilter.toLowerCase();
    
    // Normalize status strings for filtering
    const normalizedFilter = statusFilter === "inprogress" ? "in progress" : statusFilter === "waiting" ? "waiting for info" : statusFilter;
    const matchesStatus = statusFilter === "all" || ticket.status.toLowerCase() === normalizedFilter.toLowerCase();

    return matchesSearch && matchesPriority && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const styles = {
      Open: "bg-[#FEF3C7] text-[#F59E0B] border-transparent",
      "In Progress": "bg-[#DBEAFE] text-[#2F6FED] border-transparent",
      "Waiting for Info": "bg-[#FEF3C7] text-[#F59E0B] border-transparent",
      Resolved: "bg-[#DCFCE7] text-[#22C55E] border-transparent",
    };
    return styles[status as keyof typeof styles] || "bg-gray-100 text-gray-800";
  };

  const getPriorityBadge = (priority: string) => {
    const styles = {
      Urgent: "bg-[#FEE2E2] text-[#EF4444] border-transparent",
      Normal: "bg-[#DBEAFE] text-[#2F6FED] border-transparent",
      Low: "bg-[#E5EAF2] text-[#64748B] border-transparent",
    };
    return styles[priority as keyof typeof styles] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h2 className="text-[#1E293B] mb-2 text-2xl font-semibold">Ticket Tracker</h2>
          <p className="text-[#64748B] text-sm">
            Monitor and manage all laboratory support tickets
          </p>
        </div>

        {/* Filters and Search */}
        <div className="bg-white border border-[#E5EAF2] rounded-lg shadow-sm mb-6">
          <div className="p-6">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex-1 min-w-[300px] relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" />
                <Input
                  placeholder="Search tickets by ID, lab, or concern..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-[#F4F7FB] border-[#E5EAF2]"
                />
              </div>

              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-[180px] bg-[#F4F7FB] border-[#E5EAF2]">
                  <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-[#64748B]" />
                    <SelectValue placeholder="Priority" />
                  </div>
                </SelectTrigger>
                <SelectContent className="bg-white z-50 border border-[#E2E8F0] shadow-md">
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px] bg-[#F4F7FB] border-[#E5EAF2]">
                  <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-[#64748B]" />
                    <SelectValue placeholder="Status" />
                  </div>
                </SelectTrigger>
                <SelectContent className="bg-white z-50 border border-[#E2E8F0] shadow-md">
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="inprogress">In Progress</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Tickets Table */}
        <div className="bg-white border border-[#E5EAF2] rounded-lg shadow-sm overflow-hidden min-h-[400px]">
          <Table>
            <TableHeader>
              <TableRow className="bg-[#FAFBFC] border-b border-[#E5EAF2]">
                <TableHead className="text-[#1E293B] font-medium">Ticket ID</TableHead>
                <TableHead className="text-[#1E293B] font-medium">Laboratory</TableHead>
                <TableHead className="text-[#1E293B] font-medium">Concern Summary</TableHead>
                <TableHead className="text-[#1E293B] font-medium">Assigned Solver</TableHead>
                <TableHead className="text-[#1E293B] font-medium">Priority</TableHead>
                <TableHead className="text-[#1E293B] font-medium">Status</TableHead>
                <TableHead className="text-[#1E293B] font-medium">Date Created</TableHead>
                <TableHead className="text-[#1E293B] font-medium text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-10 text-slate-500">
                    Loading tickets from database...
                  </TableCell>
                </TableRow>
              ) : filteredTickets.length === 0 ? (
                 <TableRow>
                  <TableCell colSpan={8} className="text-center py-10 text-slate-500">
                    No tickets found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredTickets.map((ticket) => (
                  <TableRow key={ticket.id} className="border-b border-[#E5EAF2] hover:bg-[#F8FAFC]">
                    <TableCell className="font-medium text-[#2F6FED]">
                      {ticket.ticketId}
                    </TableCell>
                    <TableCell className="text-[#1E293B]">
                      {ticket.laboratory}
                    </TableCell>
                    <TableCell className="text-sm text-[#64748B] max-w-xs truncate">
                      {ticket.concernSummary}
                    </TableCell>
                    <TableCell>
                      {ticket.assignedSolver ? (
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-[#E0E7FF] flex items-center justify-center">
                            <UserIcon className="w-3 h-3 text-[#2F6FED]" />
                          </div>
                          <span className="text-sm text-[#64748B]">{ticket.assignedSolver}</span>
                        </div>
                      ) : (
                        <span className="text-sm text-[#94A3B8] italic">Unassigned</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge className={getPriorityBadge(ticket.priority)}>
                        {ticket.priority}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusBadge(ticket.status)}>
                        {ticket.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-[#64748B]">
                      {ticket.dateCreated}
                    </TableCell>
                    <TableCell className="text-right">
                      <Link href={`/ticket/${ticket.ticketId}`}>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-[#2F6FED] hover:text-[#1D4ED8] hover:bg-[#F4F7FB]"
                        >
                          View
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Summary Stats */}
        <div className="mt-6 flex items-center justify-between text-sm text-[#64748B]">
          <div>Showing {filteredTickets.length} tickets</div>
        </div>
      </div>
    </div>
  );
}