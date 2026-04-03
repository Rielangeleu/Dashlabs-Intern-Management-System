"use client";

import { useState, useEffect, use } from "react";
import { getTicketByTicketId, updateTicketStatus, addTicketComment, getSolvers, assignTicket } from "@/app/actions/ticket";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react"; 
import { Button } from "../../components/ui/button";
import { Textarea } from "../../components/ui/textarea";
import { Badge } from "../../components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { ArrowLeft, User, Clock, FileText, Code, Image as ImageIcon, Send, ChevronDown, Search } from "lucide-react";
import { toast } from "sonner";

export default function TicketDetailPage({ params }: { params: Promise<{ ticketId: string }> }) {
  // Unwrap params for Next.js 15+
  const resolvedParams = use(params);
  const { ticketId } = resolvedParams;
  
  const router = useRouter();
  const { data: session } = useSession(); // Grab the current user's session
  
  // States
  const [ticket, setTicket] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState("");
  const [isCommenting, setIsCommenting] = useState(false);
  const [solvers, setSolvers] = useState<{id: string, name: string}[]>([]);
  
  // Custom Dropdown States
  const [isAssignOpen, setIsAssignOpen] = useState(false);
  const [assignSearch, setAssignSearch] = useState("");

  // Filter solvers for the search bar
  const filteredSolvers = solvers.filter(solver =>
    solver.name.toLowerCase().includes(assignSearch.toLowerCase())
  );

  // Load Ticket and Solvers Data
  useEffect(() => {
    async function loadData() {
      const ticketResult = await getTicketByTicketId(ticketId);
      if (ticketResult.success) {
        setTicket(ticketResult.ticket);
      } else {
        toast.error("Ticket not found.");
      }

      const solversResult = await getSolvers();
      if (solversResult.success && solversResult.solvers) {
        setSolvers(solversResult.solvers);
      }

      setLoading(false);
    }
    loadData();
  }, [ticketId]);

  // Handlers
  const handleStatusChange = async (newStatus: string) => {
    const originalStatus = ticket.status;
    setTicket({ ...ticket, status: newStatus }); 
    
    const result = await updateTicketStatus(ticketId, newStatus);
    if (result.success) {
      toast.success(`Status updated to ${newStatus}`);
    } else {
      setTicket({ ...ticket, status: originalStatus }); 
      toast.error("Failed to update status.");
    }
  };

  const handleAssignChange = async (newAssignee: string) => {
    const originalAssignee = ticket.assignedSolver;
    setTicket({ ...ticket, assignedSolver: newAssignee }); 
    
    const result = await assignTicket(ticketId, newAssignee);
    if (result.success) {
      toast.success(newAssignee === "unassigned" ? "Ticket unassigned" : `Assigned to ${newAssignee}`);
    } else {
      setTicket({ ...ticket, assignedSolver: originalAssignee });
      toast.error("Failed to assign ticket.");
    }
  };

  const handleAddComment = async () => {
    if (!commentText.trim()) return;
    setIsCommenting(true);

    // Automatically use the logged-in user's name!
    const authorName = session?.user?.name || "Unknown User";

    const result = await addTicketComment(ticketId, commentText, authorName);
    
    if (result.success) {
      setTicket({ ...ticket, comments: [...(ticket.comments || []), result.comment] });
      setCommentText("");
      toast.success("Comment added!");
    } else {
      toast.error("Failed to post comment.");
    }
    setIsCommenting(false);
  };

  const getStatusColor = (status: string) => {
    const styles = {
      "Open": "bg-[#FEF3C7] text-[#F59E0B]",
      "In Progress": "bg-[#DBEAFE] text-[#2F6FED]",
      "Waiting for Info": "bg-[#FEF3C7] text-[#F59E0B]",
      "Resolved": "bg-[#DCFCE7] text-[#22C55E]",
    };
    return styles[status as keyof typeof styles] || "bg-slate-100 text-slate-800";
  };

  if (loading) return <div className="p-10 text-center text-slate-500">Loading ticket details...</div>;
  if (!ticket) return <div className="p-10 text-center text-red-500">Ticket not found or deleted.</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      
      <Button variant="ghost" onClick={() => router.back()} className="text-[#64748B] hover:text-[#1E293B] -ml-4">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Tracker
      </Button>

      {/* Main Ticket Post */}
      <div className="bg-white rounded-xl border border-[#E5EAF2] shadow-sm overflow-visible">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between px-8 py-5 border-b border-[#E5EAF2] bg-white">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h2 className="text-[#1E293B] text-xl font-bold">{ticket.ticketId}</h2>
              <Badge className={`${getStatusColor(ticket.status)} border-transparent hover:${getStatusColor(ticket.status)}`}>
                {ticket.status}
              </Badge>
              <Badge variant="outline" className="text-[#64748B] border-[#E5EAF2]">{ticket.priority} Priority</Badge>
            </div>
            <p className="text-sm text-[#64748B] flex items-center gap-2">
              <Clock className="w-3.5 h-3.5" /> Created on {ticket.createdAt}
            </p>
          </div>

          {/* Action Controls */}
          <div className="mt-4 sm:mt-0 flex flex-wrap items-center gap-4">
            
            {/* 1. Custom Searchable Assignee Dropdown */}
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-[#64748B]">Assign To:</span>
              <div className="relative">
                <button
                  onClick={() => setIsAssignOpen(!isAssignOpen)}
                  className="w-[180px] h-10 px-3 flex items-center justify-between bg-[#F8FAFC] border border-[#E2E8F0] rounded-md text-sm hover:bg-slate-50 transition-colors focus:outline-none focus:ring-2 focus:ring-[#2F6FED]"
                >
                  <span className={`truncate ${!ticket.assignedSolver || ticket.assignedSolver === "unassigned" ? "text-slate-500 italic" : "text-[#1E293B]"}`}>
                    {ticket.assignedSolver && ticket.assignedSolver !== "unassigned" ? ticket.assignedSolver : "Select Solver..."}
                  </span>
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                </button>

                {isAssignOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => { setIsAssignOpen(false); setAssignSearch(""); }} />
                    <div className="absolute top-full right-0 mt-1 w-[220px] bg-white border border-[#E2E8F0] shadow-lg rounded-md z-50 overflow-hidden">
                      <div className="p-2 border-b border-[#E2E8F0] bg-slate-50 flex items-center gap-2">
                        <Search className="w-3.5 h-3.5 text-slate-400" />
                        <input
                          type="text"
                          placeholder="Search names..."
                          value={assignSearch}
                          onChange={(e) => setAssignSearch(e.target.value)}
                          className="w-full bg-transparent border-none text-sm focus:outline-none text-[#1E293B] placeholder:text-slate-400"
                          autoFocus
                        />
                      </div>
                      <div className="max-h-[200px] overflow-y-auto p-1">
                        <div
                          className="px-2 py-2 text-sm text-slate-500 italic hover:bg-[#F4F7FB] cursor-pointer rounded-sm"
                          onClick={() => { handleAssignChange("unassigned"); setIsAssignOpen(false); setAssignSearch(""); }}
                        >
                          Unassigned
                        </div>
                        {filteredSolvers.map(solver => (
                          <div
                            key={solver.id}
                            className="px-2 py-2 text-sm text-[#1E293B] hover:bg-[#F4F7FB] hover:text-[#2F6FED] cursor-pointer rounded-sm"
                            onClick={() => { handleAssignChange(solver.name); setIsAssignOpen(false); setAssignSearch(""); }}
                          >
                            {solver.name}
                          </div>
                        ))}
                        {filteredSolvers.length === 0 && (
                          <div className="px-2 py-4 text-sm text-center text-slate-500">No solvers found.</div>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* 2. Standard Status Dropdown */}
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-[#64748B]">Status:</span>
              <Select value={ticket.status} onValueChange={handleStatusChange}>
                <SelectTrigger className="w-[140px] bg-[#F8FAFC] border-[#E2E8F0] shadow-none">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white z-50 border border-[#E2E8F0] shadow-md">
                  <SelectItem value="Open">Open</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Waiting for Info">Waiting for Info</SelectItem>
                  <SelectItem value="Resolved">Resolved</SelectItem>
                </SelectContent>
              </Select>
            </div>

          </div>
        </div>

        {/* Post Body Section */}
        <div className="p-8 space-y-8">
          <div>
            <h3 className="text-sm font-semibold text-[#64748B] uppercase tracking-wider mb-2">Laboratory</h3>
            <p className="text-[#1E293B] font-medium text-lg">{ticket.laboratory}</p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-[#64748B] uppercase tracking-wider mb-2">Concern Description</h3>
            <div className="bg-[#F8FAFC] p-4 rounded-lg border border-[#E2E8F0] text-[#1E293B] whitespace-pre-wrap">
              {ticket.description}
            </div>
          </div>

          {ticket.attachments && ticket.attachments.length > 0 && (
            <div className="pt-4 border-t border-[#E5EAF2]">
              <h3 className="text-sm font-semibold text-[#64748B] uppercase tracking-wider mb-4">Attachments & Notes</h3>
              <div className="space-y-4">
                {ticket.attachments.map((att: any) => (
                  <div key={att.id} className="border border-[#E2E8F0] rounded-lg overflow-hidden">
                    <div className="bg-slate-50 px-4 py-2 border-b border-[#E2E8F0] flex items-center gap-2 text-sm text-[#64748B] font-medium">
                      {att.type === "notes" && <><FileText className="w-4 h-4" /> Text Note</>}
                      {att.type === "code" && <><Code className="w-4 h-4" /> Code Snippet</>}
                      {att.type === "image" && <><ImageIcon className="w-4 h-4" /> Image Reference</>}
                    </div>
                    <div className="p-4">
                      {att.type === "code" ? (
                        <pre className="bg-[#1E293B] text-[#E2E8F0] p-4 rounded-md overflow-x-auto text-sm font-mono whitespace-pre-wrap">
                          {att.value}
                        </pre>
                      ) : att.type === "image" ? (
                         <div className="flex items-center gap-3 text-[#2F6FED] bg-[#EFF6FF] p-3 rounded-md">
                           <ImageIcon className="w-5 h-5" />
                           <span className="font-medium">{att.value || "No description provided"}</span>
                         </div>
                      ) : (
                        <p className="text-[#1E293B] whitespace-pre-wrap">{att.value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Comments Section */}
      <div className="bg-white rounded-xl border border-[#E5EAF2] shadow-sm overflow-hidden">
        <div className="px-8 py-5 border-b border-[#E5EAF2] bg-slate-50">
          <h2 className="text-[#1E293B] font-semibold flex items-center gap-2">
            Discussion ({ticket.comments?.length || 0})
          </h2>
        </div>

        <div className="p-8 space-y-6">
          {ticket.comments?.length > 0 ? (
            <div className="space-y-6">
              {ticket.comments.map((comment: any) => (
                <div key={comment.id} className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#E0E7FF] flex-shrink-0 flex items-center justify-center">
                    <span className="text-[#2F6FED] font-medium text-sm">
                      {comment.author ? comment.author.charAt(0).toUpperCase() : "U"}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="bg-[#F8FAFC] border border-[#E2E8F0] p-4 rounded-lg rounded-tl-none">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-[#1E293B]">{comment.author}</span>
                        <span className="text-xs text-[#64748B]">
                          {new Date(comment.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-[#334155] whitespace-pre-wrap">{comment.text}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-[#64748B]">
              No comments yet. Start the discussion below!
            </div>
          )}

          {/* Add a Comment Input */}
          <div className="flex gap-4 pt-6 border-t border-[#E5EAF2]">
            <div className="w-10 h-10 rounded-full bg-[#2F6FED] flex-shrink-0 flex items-center justify-center">
              <span className="text-white font-medium text-sm">
                {session?.user?.name ? session.user.name.charAt(0).toUpperCase() : "U"}
              </span>
            </div>
            <div className="flex-1 space-y-3">
              <Textarea 
                placeholder="Write a comment or provide an update..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="min-h-[100px] bg-[#F8FAFC] border-[#E2E8F0] focus:ring-[#2F6FED]"
              />
              <div className="flex justify-end">
                <Button 
                  onClick={handleAddComment} 
                  disabled={!commentText.trim() || isCommenting}
                  className="bg-[#2F6FED] hover:bg-[#1D4ED8]"
                >
                  <Send className="w-4 h-4 mr-2" />
                  {isCommenting ? "Posting..." : "Post Comment"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}