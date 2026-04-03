"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { getUserTicketsForEndorsement, createEndorsement } from "../actions/endorsement";
import { CheckCircle2, Clock, AlertTriangle } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Badge } from "../components/ui/badge";
import { toast } from "sonner";

export default function CreateEndorsementPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const userName = session?.user?.name || "";
  const userRole = (session?.user as any)?.role || "";

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  // Form Data
  const [notes, setNotes] = useState("");
  const [shiftInfo, setShiftInfo] = useState({ name: "Morning Shift", exact: "6:00 AM - 2:00 PM" });
  
  // Ticket Data directly from DB
  const [tickets, setTickets] = useState({ completed: [], inProgress: [], pending: [] });

  // Load Data on Mount
  useEffect(() => {
    async function init() {
      // Set Date and Shift dynamically
      const currentHour = new Date().getHours();
      if (currentHour >= 6 && currentHour < 14) setShiftInfo({ name: "Morning Shift", exact: "6:00 AM - 2:00 PM" });
      else if (currentHour >= 14 && currentHour < 22) setShiftInfo({ name: "Afternoon Shift", exact: "2:00 PM - 10:00 PM" });
      else setShiftInfo({ name: "Night Shift", exact: "10:00 PM - 6:00 AM" });

      // Fetch user's tickets
      if (userName) {
        const result = await getUserTicketsForEndorsement(userName);
        if (result.success) setTickets(result.tickets as any);
      }
      setLoading(false);
    }
    init();
  }, [userName]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const endorsementData = {
      internName: userName,
      department: userRole,
      shiftDate: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      shiftTime: shiftInfo.name,
      shiftTimeExact: shiftInfo.exact,
      notes: notes,
      tickets: tickets,
    };

    const result = await createEndorsement(endorsementData);

    if (result.success) {
      toast.success("Shift Endorsement submitted!");
      router.push("/shift-logs");
    } else {
      toast.error("Failed to submit endorsement.");
      setSubmitting(false);
    }
  };

  if (loading) return <div className="p-10 text-center text-slate-500">Loading your shift data...</div>;

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h2 className="text-[#1E293B] mb-2 text-2xl font-semibold">Shift Endorsement</h2>
          <p className="text-[#64748B] text-sm">Summarize ticket status and handover information for the next shift</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section 1: Shift Information */}
          <div className="bg-white border border-[#E5EAF2] rounded-lg shadow-sm">
            <div className="px-6 py-4 border-b border-[#E5EAF2] bg-[#FAFBFC]">
              <h3 className="text-[#1E293B] font-medium">Shift Information</h3>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input disabled value={userName} className="bg-[#F4F7FB] border-[#E5EAF2] text-slate-500" />
              </div>
              <div className="space-y-2">
                <Label>Department</Label>
                <Input disabled value={userRole} className="bg-[#F4F7FB] border-[#E5EAF2] text-slate-500" />
              </div>
              <div className="space-y-2">
                <Label>Shift Date</Label>
                <Input disabled value={new Date().toLocaleDateString()} className="bg-[#F4F7FB] border-[#E5EAF2] text-slate-500" />
              </div>
              <div className="space-y-2">
                <Label>Shift Time</Label>
                <Input disabled value={`${shiftInfo.name} (${shiftInfo.exact})`} className="bg-[#F4F7FB] border-[#E5EAF2] text-slate-500" />
              </div>
            </div>
          </div>

          {/* Section 2: Completed Tickets */}
          <div className="bg-white border border-[#E5EAF2] rounded-lg shadow-sm">
            <div className="px-6 py-4 border-b border-[#E5EAF2] bg-[#FAFBFC] flex items-center justify-between">
              <h3 className="text-[#1E293B] font-medium">Completed Tickets</h3>
              <Badge className="bg-[#DCFCE7] text-[#22C55E] hover:bg-[#DCFCE7] border-transparent">
                {tickets.completed.length} Resolved
              </Badge>
            </div>
            <div className="p-6 space-y-3">
              {tickets.completed.length === 0 && <p className="text-sm text-slate-500 italic">No resolved tickets this shift.</p>}
              {tickets.completed.map((ticket: any) => (
                <div key={ticket.id} className="p-4 bg-[#F0FDF4] border border-[#22C55E] rounded-lg flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#22C55E] flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-[#2F6FED]">{ticket.id}</span>
                      <span className="text-sm text-[#64748B]">•</span>
                      <span className="text-sm text-[#1E293B]">{ticket.laboratory}</span>
                    </div>
                    <p className="text-sm text-[#166534]">{ticket.concern}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: In Progress Tickets */}
          <div className="bg-white border border-[#E5EAF2] rounded-lg shadow-sm">
            <div className="px-6 py-4 border-b border-[#E5EAF2] bg-[#FAFBFC] flex items-center justify-between">
              <h3 className="text-[#1E293B] font-medium">In Progress Tickets</h3>
              <Badge className="bg-[#DBEAFE] text-[#2F6FED] hover:bg-[#DBEAFE] border-transparent">
                {tickets.inProgress.length} Active
              </Badge>
            </div>
            <div className="p-6 space-y-3">
              {tickets.inProgress.length === 0 && <p className="text-sm text-slate-500 italic">No tickets currently in progress.</p>}
              {tickets.inProgress.map((ticket: any) => (
                <div key={ticket.id} className="p-4 bg-[#EFF6FF] border border-[#2F6FED] rounded-lg flex items-start gap-3">
                  <Clock className="w-5 h-5 text-[#2F6FED] flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-[#2F6FED]">{ticket.id}</span>
                      <span className="text-sm text-[#64748B]">•</span>
                      <span className="text-sm text-[#1E293B]">{ticket.laboratory}</span>
                    </div>
                    <p className="text-sm text-[#1E293B]">{ticket.concern}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 4: Pending Tickets */}
          <div className="bg-white border border-[#E5EAF2] rounded-lg shadow-sm">
            <div className="px-6 py-4 border-b border-[#E5EAF2] bg-[#FAFBFC] flex items-center justify-between">
              <h3 className="text-[#1E293B] font-medium">Pending / Open Tickets</h3>
              <Badge className="bg-[#FEF3C7] text-[#F59E0B] hover:bg-[#FEF3C7] border-transparent">
                {tickets.pending.length} Pending
              </Badge>
            </div>
            <div className="p-6 space-y-3">
              {tickets.pending.length === 0 && <p className="text-sm text-slate-500 italic">No pending tickets.</p>}
              {tickets.pending.map((ticket: any) => (
                <div key={ticket.id} className="p-4 bg-[#FEF3C7] border border-[#F59E0B] rounded-lg flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-[#F59E0B] flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-[#2F6FED]">{ticket.id}</span>
                      <span className="text-sm text-[#64748B]">•</span>
                      <span className="text-sm text-[#1E293B]">{ticket.laboratory}</span>
                    </div>
                    <p className="text-sm text-[#92400E]">{ticket.concern}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 5: Notes */}
          <div className="bg-white border border-[#E5EAF2] rounded-lg shadow-sm">
            <div className="px-6 py-4 border-b border-[#E5EAF2] bg-[#FAFBFC]">
              <h3 className="text-[#1E293B] font-medium">Notes for Next Shift</h3>
            </div>
            <div className="p-6">
              <Textarea
                required
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="What does the next shift need to know?"
                className="min-h-[120px] bg-[#F8FAFC] border-[#E2E8F0] focus:ring-[#2F6FED]"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
            <Button type="submit" disabled={submitting} className="bg-[#2F6FED] hover:bg-[#1D4ED8] text-white">
              {submitting ? "Submitting..." : "Submit Shift Endorsement"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}