"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { getEndorsementById, acknowledgeEndorsement, bulkAssignTickets } from "@/app/actions/endorsement";
import { getSolvers } from "@/app/actions/ticket"; // <-- Added this to get users
import { CheckCircle2, Clock, AlertTriangle, ArrowLeft, ArrowDownToLine } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"; // <-- Added Dropdown UI
import { toast } from "sonner";

export default function EndorsementReviewPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { id } = resolvedParams;
  
  const router = useRouter();
  const { data: session } = useSession();
  const userName = session?.user?.name || "Unknown User";

  const [endorsement, setEndorsement] = useState<any>(null);
  const [solvers, setSolvers] = useState<{id: string, name: string}[]>([]);
  const [selectedAssignee, setSelectedAssignee] = useState<string>(""); // Tracks who gets the tickets
  
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  // Load the specific endorsement data and the list of users
  useEffect(() => {
    async function loadData() {
      try {
        const [endorsementResult, solversResult] = await Promise.all([
          getEndorsementById(id),
          getSolvers()
        ]);

        if (endorsementResult?.success && endorsementResult?.endorsement) {
          setEndorsement(endorsementResult.endorsement);
        } else {
          toast.error("Endorsement not found.");
        }

        if (solversResult?.success) {
          setSolvers(solversResult.solvers);
        }
      } catch (error) {
        toast.error("An error occurred while loading.");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id]);

  if (loading) return <div className="p-10 text-center text-slate-500">Loading endorsement...</div>;
  if (!endorsement) return <div className="p-10 text-center text-red-500">Could not load this endorsement.</div>;

  // Extraction for safety
  const isConfirmed = endorsement.status === "Acknowledged";
  const safeTickets = endorsement.tickets || {};
  const completedTickets = safeTickets.completed || [];
  const inProgressTickets = safeTickets.inProgress || [];
  const pendingTickets = safeTickets.pending || [];

  const handleAcknowledge = async () => {
    setProcessing(true);
    const result = await acknowledgeEndorsement(id, userName);
    if (result.success) {
      toast.success("Endorsement Acknowledged!");
      setEndorsement({
        ...endorsement,
        status: "Acknowledged",
        confirmedBy: userName,
        confirmedAt: new Date().toISOString()
      });
    } else {
      toast.error("Failed to acknowledge.");
    }
    setProcessing(false);
  };

  const handleAcceptTickets = async () => {
    setProcessing(true);
    
    const ticketIdsToTransfer = [
      ...inProgressTickets.map((t: any) => t.id),
      ...pendingTickets.map((t: any) => t.id)
    ];

    if (ticketIdsToTransfer.length === 0) {
      toast.info("No active tickets to transfer.");
      setProcessing(false);
      return;
    }

    // Use the dropdown selection, or default to the person clicking the button
    const finalAssignee = selectedAssignee || userName;

    const result = await bulkAssignTickets(ticketIdsToTransfer, finalAssignee);
    if (result.success) {
      toast.success(`${ticketIdsToTransfer.length} tickets assigned to ${finalAssignee}!`);
      router.push("/ticket-tracker"); 
    } else {
      toast.error("Failed to transfer tickets.");
    }
    setProcessing(false);
  };

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        
        <Button variant="ghost" onClick={() => router.back()} className="text-[#64748B] hover:text-[#1E293B] mb-4 -ml-4">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Logs
        </Button>

        <div className="mb-6">
          <h2 className="text-[#1E293B] mb-2 text-2xl font-semibold">Handover Review</h2>
          <p className="text-[#64748B] text-sm">Review and confirm shift handover from the previous intern</p>
        </div>

        <div className="bg-white border border-[#E5EAF2] rounded-lg shadow-sm">
          
          <div className="px-6 py-4 border-b border-[#E5EAF2] bg-[#FAFBFC] flex items-center justify-between">
            <div>
              <h3 className="text-[#1E293B] font-medium">Shift Endorsement: {endorsement.id}</h3>
              <p className="text-sm text-[#64748B] mt-1">
                {endorsement.shiftDate} • {endorsement.shiftTime} ({endorsement.shiftTimeExact})
              </p>
            </div>
            <Badge className={isConfirmed ? "bg-[#DCFCE7] text-[#22C55E] hover:bg-[#DCFCE7] border-transparent" : "bg-[#FEF3C7] text-[#F59E0B] hover:bg-[#FEF3C7] border-transparent"}>
              {endorsement.status}
            </Badge>
          </div>

          <div className="px-6 py-5">
            {/* Intern Info */}
            <div className="mb-6">
              <label className="text-sm text-[#64748B] mb-2 block">Shift Handed Over By:</label>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#E0E7FF] flex items-center justify-center font-bold text-[#2F6FED]">
                  {endorsement.internName?.charAt(0) || "U"}
                </div>
                <div>
                  <div className="text-[#1E293B] font-medium">{endorsement.internName}</div>
                  <div className="text-sm text-[#64748B]">{endorsement.department}</div>
                </div>
              </div>
            </div>

            {/* Completed Tickets */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-medium text-[#1E293B]">Completed Tickets</h4>
                <Badge className="bg-[#DCFCE7] text-[#22C55E] hover:bg-[#DCFCE7] border-transparent">
                  {completedTickets.length} Resolved
                </Badge>
              </div>
              <div className="space-y-3">
                {completedTickets.length === 0 && <div className="text-sm text-slate-500 italic">None.</div>}
                {completedTickets.map((ticket: any) => (
                  <div key={ticket.id} className="p-3 bg-[#F0FDF4] border border-[#22C55E] rounded-lg flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#22C55E] flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-[#2F6FED]">{ticket.id}</span>
                        <span className="text-xs text-[#64748B]">•</span>
                        <span className="text-sm text-[#1E293B]">{ticket.laboratory}</span>
                      </div>
                      <p className="text-sm text-[#166534]">{ticket.concern}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* In Progress Tickets */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-medium text-[#1E293B]">In Progress Tickets</h4>
                <Badge className="bg-[#DBEAFE] text-[#2F6FED] hover:bg-[#DBEAFE] border-transparent">
                  {inProgressTickets.length} Active
                </Badge>
              </div>
              <div className="space-y-3">
                {inProgressTickets.length === 0 && <div className="text-sm text-slate-500 italic">None.</div>}
                {inProgressTickets.map((ticket: any) => (
                  <div key={ticket.id} className="p-3 bg-[#EFF6FF] border border-[#2F6FED] rounded-lg flex items-start gap-2">
                    <Clock className="w-4 h-4 text-[#2F6FED] flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-[#2F6FED]">{ticket.id}</span>
                        <span className="text-xs text-[#64748B]">•</span>
                        <span className="text-sm text-[#1E293B]">{ticket.laboratory}</span>
                      </div>
                      <p className="text-sm text-[#1E293B]">{ticket.concern}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pending Tickets */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-medium text-[#1E293B]">Pending Tickets</h4>
                <Badge className="bg-[#FEF3C7] text-[#F59E0B] hover:bg-[#FEF3C7] border-transparent">
                  {pendingTickets.length} Pending
                </Badge>
              </div>
              <div className="space-y-3">
                {pendingTickets.length === 0 && <div className="text-sm text-slate-500 italic">None.</div>}
                {pendingTickets.map((ticket: any) => (
                  <div key={ticket.id} className="p-3 bg-[#FEF3C7] border border-[#F59E0B] rounded-lg flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-[#F59E0B] flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-[#2F6FED]">{ticket.id}</span>
                        <span className="text-xs text-[#64748B]">•</span>
                        <span className="text-sm text-[#1E293B]">{ticket.laboratory}</span>
                      </div>
                      <p className="text-sm text-[#92400E]">{ticket.concern}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div>
              <h4 className="text-sm font-medium text-[#1E293B] mb-3">Notes for Next Shift</h4>
              <div className="p-4 bg-[#F4F7FB] border border-[#E5EAF2] rounded-lg text-sm text-[#334155] whitespace-pre-wrap">
                {endorsement.notes || "No notes provided."}
              </div>
            </div>

            {/* Confirmation Record Box */}
            {isConfirmed && (
              <div className="mt-6 p-4 bg-[#F0FDF4] border border-[#22C55E] rounded-lg">
                <h4 className="text-sm font-medium text-[#166534] mb-2 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" /> Endorsement Acknowledged
                </h4>
                <div className="space-y-1 text-sm text-[#166534]">
                  <div><span className="font-medium">Acknowledged by:</span> {endorsement.confirmedBy}</div>
                  <div><span className="font-medium">Timestamp:</span> {new Date(endorsement.confirmedAt).toLocaleString()}</div>
                </div>
              </div>
            )}
          </div>

          {/* Card Footer Actions */}
          <div className="px-6 py-4 border-t border-[#E5EAF2] bg-[#FAFBFC] flex items-center justify-between flex-wrap gap-4">
            <div className="text-sm text-[#64748B]">
              Submitted on: {endorsement.createdAt}
            </div>
            
            <div className="flex items-center gap-3">
              {!isConfirmed ? (
                <Button onClick={handleAcknowledge} disabled={processing} className="bg-[#2F6FED] hover:bg-[#1D4ED8] text-white shadow-sm">
                  {processing ? "Processing..." : "Acknowledge Endorsement"}
                </Button>
              ) : (
                <div className="flex items-center gap-3">
                  {/* NEW DROP DOWN UI */}
                  <span className="text-sm font-medium text-[#64748B]">Assign tickets to:</span>
                  <Select value={selectedAssignee || userName} onValueChange={setSelectedAssignee}>
                    <SelectTrigger className="w-[180px] bg-white border-[#E2E8F0] shadow-sm h-10">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white z-50 shadow-md border-[#E2E8F0]">
                      <SelectItem value={userName}>{userName} (Me)</SelectItem>
                      {solvers.filter(s => s.name !== userName).map(s => (
                        <SelectItem key={s.id} value={s.name}>{s.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Button onClick={handleAcceptTickets} disabled={processing} className="bg-[#22C55E] hover:bg-[#16a34a] text-white shadow-sm flex items-center gap-2 h-10">
                    <ArrowDownToLine className="w-4 h-4" />
                    {processing ? "Transferring..." : "Accept Tickets"}
                  </Button>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}