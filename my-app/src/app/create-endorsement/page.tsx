"use client";

import { useRouter } from "next/navigation"; // Changed from react-router to next/navigation
import { Plus, Trash2, Calendar, CheckCircle2, Clock, AlertTriangle } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Badge } from "../components/ui/badge";

// Added 'default' export for Next.js routing
export default function CreateEndorsementPage() {
  const router = useRouter(); // Changed from useNavigate to useRouter

  // Mock ticket data
  const completedTickets = [
    { id: "DASH-9398", laboratory: "RTA Clinic", concern: "Chemistry results showing incorrect reference ranges" },
    { id: "DASH-9367", laboratory: "Exact Check", concern: "Printer configuration reset needed for report generation" },
  ];

  const inProgressTickets = [
    { id: "DASH-9642", laboratory: "RTA Clinic", concern: "Total iron not showing up on the generated results" },
    { id: "DASH-9456", laboratory: "HealthCore Labs", concern: "Barcode scanner not reading sample labels correctly" },
  ];

  const pendingTickets = [
    { id: "DASH-9574", laboratory: "Exact Check", concern: "Patient results export failing for CBC tests" },
    { id: "DASH-9501", laboratory: "MediLab Plus", concern: "System login timeout issue affecting multiple users" },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
    
    // Redirect back to dashboard
    router.push("/");
  };

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        {/* Page Header */}
        <div className="mb-6">
          <h2 className="text-[#1E293B] mb-2 text-2xl font-semibold">Shift Endorsement</h2>
          <p className="text-[#64748B] text-sm">
            Summarize ticket status and handover information for the next shift
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section 1: Shift Information */}
          <div className="bg-white border border-[#E5EAF2] rounded-lg shadow-sm">
            <div className="px-6 py-4 border-b border-[#E5EAF2] bg-[#FAFBFC]">
              <h3 className="text-[#1E293B] font-medium">Shift Information</h3>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="internName">Intern Name</Label>
                <Input
                  id="internName"
                  defaultValue="Dr. Sarah Chen"
                  className="bg-[#F4F7FB] border-[#E5EAF2]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Input
                  id="department"
                  defaultValue="QA Laboratory"
                  className="bg-[#F4F7FB] border-[#E5EAF2]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="shiftDate">Shift Date</Label>
                <Input
                  id="shiftDate"
                  type="date"
                  defaultValue="2026-03-11"
                  className="bg-[#F4F7FB] border-[#E5EAF2]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="shiftTime">Shift Time</Label>
                <Select defaultValue="morning">
                  <SelectTrigger className="bg-[#F4F7FB] border-[#E5EAF2]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="morning">Morning Shift (6:00 AM - 2:00 PM)</SelectItem>
                    <SelectItem value="afternoon">Afternoon Shift (2:00 PM - 10:00 PM)</SelectItem>
                    <SelectItem value="night">Night Shift (10:00 PM - 6:00 AM)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Section 2: Completed Tickets */}
          <div className="bg-white border border-[#E5EAF2] rounded-lg shadow-sm">
            <div className="px-6 py-4 border-b border-[#E5EAF2] bg-[#FAFBFC] flex items-center justify-between">
              <h3 className="text-[#1E293B] font-medium">Completed Tickets</h3>
              <Badge className="bg-[#DCFCE7] text-[#22C55E] hover:bg-[#DCFCE7] border-transparent">
                {completedTickets.length} Resolved
              </Badge>
            </div>
            <div className="p-6 space-y-3">
              {completedTickets.map((ticket) => (
                <div key={ticket.id} className="p-4 bg-[#F0FDF4] border border-[#22C55E] rounded-lg">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#22C55E] flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-[#2F6FED]">{ticket.id}</span>
                        <span className="text-sm text-[#64748B]">•</span>
                        <span className="text-sm text-[#1E293B]">{ticket.laboratory}</span>
                      </div>
                      <p className="text-sm text-[#166534]">{ticket.concern}</p>
                    </div>
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
                {inProgressTickets.length} Active
              </Badge>
            </div>
            <div className="p-6 space-y-3">
              {inProgressTickets.map((ticket) => (
                <div key={ticket.id} className="p-4 bg-[#EFF6FF] border border-[#2F6FED] rounded-lg">
                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-[#2F6FED] flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-[#2F6FED]">{ticket.id}</span>
                        <span className="text-sm text-[#64748B]">•</span>
                        <span className="text-sm text-[#1E293B]">{ticket.laboratory}</span>
                      </div>
                      <p className="text-sm text-[#1E293B]">{ticket.concern}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 4: Pending Tickets */}
          <div className="bg-white border border-[#E5EAF2] rounded-lg shadow-sm">
            <div className="px-6 py-4 border-b border-[#E5EAF2] bg-[#FAFBFC] flex items-center justify-between">
              <h3 className="text-[#1E293B] font-medium">Pending Tickets</h3>
              <Badge className="bg-[#FEF3C7] text-[#F59E0B] hover:bg-[#FEF3C7] border-transparent">
                {pendingTickets.length} Pending
              </Badge>
            </div>
            <div className="p-6 space-y-3">
              {pendingTickets.map((ticket) => (
                <div key={ticket.id} className="p-4 bg-[#FEF3C7] border border-[#F59E0B] rounded-lg">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-[#F59E0B] flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-[#2F6FED]">{ticket.id}</span>
                        <span className="text-sm text-[#64748B]">•</span>
                        <span className="text-sm text-[#1E293B]">{ticket.laboratory}</span>
                      </div>
                      <p className="text-sm text-[#92400E]">{ticket.concern}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 5: Notes for Next Shift */}
          <div className="bg-white border border-[#E5EAF2] rounded-lg shadow-sm">
            <div className="px-6 py-4 border-b border-[#E5EAF2] bg-[#FAFBFC]">
              <h3 className="text-[#1E293B] font-medium">Notes for Next Shift</h3>
            </div>
            <div className="p-6">
              <Textarea
                placeholder="Waiting for confirmation from Exact Check regarding result validation..."
                className="min-h-[120px] bg-[#F4F7FB] border-[#E5EAF2]"
              />
              <p className="text-xs text-[#64748B] mt-2">
                Add any important information or context that the next shift should know
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              className="border-[#E5EAF2] text-[#64748B] hover:bg-white hover:text-[#1E293B]"
            >
              Save Draft
            </Button>
            <Button
              type="submit"
              className="bg-[#2F6FED] hover:bg-[#1D4ED8] text-white shadow-sm"
            >
              Submit Shift Endorsement
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}