"use client";

import { useState, useEffect } from "react";
import { getTicketByTicketId, updateTicketStatus, addTicketComment } from "@/app/actions/ticket";
import { useRouter } from "next/navigation";
import { Button } from "../../components/ui/button";
import { Textarea } from "../../components/ui/textarea";
import { Badge } from "../../components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { ArrowLeft, User, Clock, FileText, Code, Image as ImageIcon, Send } from "lucide-react";
import { toast } from "sonner";
import { use } from "react";

export default function TicketDetailPage({ params }: { params: Promise<{ ticketId: string }> }) {
  // In Next.js 15+, params is a Promise that must be unwrapped using React.use()
  const resolvedParams = use(params);
  const { ticketId } = resolvedParams;
  
  const router = useRouter();
  const [ticket, setTicket] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState("");
  const [isCommenting, setIsCommenting] = useState(false);

  // Load the ticket data
  useEffect(() => {
    async function loadTicket() {
      const result = await getTicketByTicketId(ticketId);
      if (result.success) {
        setTicket(result.ticket);
      } else {
        toast.error("Ticket not found.");
      }
      setLoading(false);
    }
    loadTicket();
  }, [ticketId]);

  // Handle Status Change
  const handleStatusChange = async (newStatus: string) => {
    const originalStatus = ticket.status;
    setTicket({ ...ticket, status: newStatus }); // Optimistic UI update
    
    const result = await updateTicketStatus(ticketId, newStatus);
    if (result.success) {
      toast.success(`Status updated to ${newStatus}`);
    } else {
      setTicket({ ...ticket, status: originalStatus }); // Revert if failed
      toast.error("Failed to update status.");
    }
  };

  // Handle New Comment
  const handleAddComment = async () => {
    if (!commentText.trim()) return;
    setIsCommenting(true);

    // Hardcoding "Dr. Sarah Chen" for now until you add actual User Accounts
    const result = await addTicketComment(ticketId, commentText, "Dr. Sarah Chen");
    
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
      
      {/* Back Button */}
      <Button variant="ghost" onClick={() => router.back()} className="text-[#64748B] hover:text-[#1E293B] -ml-4">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Tracker
      </Button>

      {/* Main Ticket Post */}
      <div className="bg-white rounded-xl border border-[#E5EAF2] shadow-sm overflow-hidden">
        
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

          {/* Status Updater */}
          <div className="mt-4 sm:mt-0 flex items-center gap-3">
            <span className="text-sm font-medium text-[#64748B]">Update Status:</span>
            <Select value={ticket.status} onValueChange={handleStatusChange}>
              <SelectTrigger className="w-[160px] bg-[#F8FAFC] border-[#E2E8F0] shadow-none">
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

          {/* Generated Attachments (Looking like a post) */}
          {ticket.attachments && ticket.attachments.length > 0 && (
            <div className="pt-4 border-t border-[#E5EAF2]">
              <h3 className="text-sm font-semibold text-[#64748B] uppercase tracking-wider mb-4">Attachments & Notes</h3>
              <div className="space-y-4">
                {ticket.attachments.map((att: any) => (
                  <div key={att.id} className="border border-[#E2E8F0] rounded-lg overflow-hidden">
                    {/* Header of the attachment block */}
                    <div className="bg-slate-50 px-4 py-2 border-b border-[#E2E8F0] flex items-center gap-2 text-sm text-[#64748B] font-medium">
                      {att.type === "notes" && <><FileText className="w-4 h-4" /> Text Note</>}
                      {att.type === "code" && <><Code className="w-4 h-4" /> Code Snippet</>}
                      {att.type === "image" && <><ImageIcon className="w-4 h-4" /> Image Reference</>}
                    </div>
                    {/* Body of the attachment block */}
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
          {/* List existing comments */}
          {ticket.comments?.length > 0 ? (
            <div className="space-y-6">
              {ticket.comments.map((comment: any) => (
                <div key={comment.id} className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#E0E7FF] flex-shrink-0 flex items-center justify-center">
                    <User className="w-5 h-5 text-[#2F6FED]" />
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
              <User className="w-5 h-5 text-white" />
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