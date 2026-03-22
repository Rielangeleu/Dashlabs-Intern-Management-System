"use client";

import { useState } from "react";
import { CheckCircle2, Clock, AlertTriangle, User } from "lucide-react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { EndorsementConfirmationModal } from "../components/EndorsementConfirmationModal";

export default function EndorsementReviewPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

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

  const handleConfirm = () => {
    setConfirmed(true);
    setIsModalOpen(false);
    // Reset after showing confirmation (optional, based on your UX needs)
    setTimeout(() => setConfirmed(false), 3000);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        {/* Page Header */}
        <div className="mb-6">
          <h2 className="text-[#1E293B] mb-2 text-2xl font-semibold">Handover Review</h2>
          <p className="text-[#64748B] text-sm">
            Review and confirm shift handover from previous intern
          </p>
        </div>

        {/* Success Message */}
        {confirmed && (
          <div className="mb-6 p-4 bg-[#F0FDF4] border border-[#22C55E] rounded-lg flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-[#22C55E]" />
            <span className="text-[#166534]">
              Endorsement confirmed successfully. All tickets have been transferred to your list.
            </span>
          </div>
        )}

        {/* Endorsement Card */}
        <div className="bg-white border border-[#E5EAF2] rounded-lg shadow-sm">
          {/* Card Header */}
          <div className="px-6 py-4 border-b border-[#E5EAF2] bg-[#FAFBFC]">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-[#1E293B] font-medium">Shift Endorsement</h3>
                <p className="text-sm text-[#64748B] mt-1">
                  March 10, 2026 • Night Shift (8:00 PM - 6:00 AM)
                </p>
              </div>
              <Badge className={confirmed ? "bg-[#DCFCE7] text-[#22C55E] hover:bg-[#DCFCE7] border-transparent" : "bg-[#FEF3C7] text-[#F59E0B] hover:bg-[#FEF3C7] border-transparent"}>
                {confirmed ? "Confirmed" : "Pending Review"}
              </Badge>
            </div>
          </div>

          {/* Card Content */}
          <div className="px-6 py-5">
            {/* Intern Info */}
            <div className="mb-6">
              <label className="text-sm text-[#64748B] mb-2 block">Previous Shift Intern</label>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#E0E7FF] flex items-center justify-center">
                  <User className="w-5 h-5 text-[#2F6FED]" />
                </div>
                <div>
                  <div className="text-[#1E293B] font-medium">Intern A</div>
                  <div className="text-sm text-[#64748B]">QA Laboratory</div>
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
                {completedTickets.map((ticket) => (
                  <div key={ticket.id} className="p-3 bg-[#F0FDF4] border border-[#22C55E] rounded-lg">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#22C55E] flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium text-[#2F6FED]">{ticket.id}</span>
                          <span className="text-xs text-[#64748B]">•</span>
                          <span className="text-sm text-[#1E293B]">{ticket.laboratory}</span>
                        </div>
                        <p className="text-sm text-[#166534]">{ticket.concern}</p>
                      </div>
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
                {inProgressTickets.map((ticket) => (
                  <div key={ticket.id} className="p-3 bg-[#EFF6FF] border border-[#2F6FED] rounded-lg">
                    <div className="flex items-start gap-2">
                      <Clock className="w-4 h-4 text-[#2F6FED] flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium text-[#2F6FED]">{ticket.id}</span>
                          <span className="text-xs text-[#64748B]">•</span>
                          <span className="text-sm text-[#1E293B]">{ticket.laboratory}</span>
                        </div>
                        <p className="text-sm text-[#1E293B]">{ticket.concern}</p>
                      </div>
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
                {pendingTickets.map((ticket) => (
                  <div key={ticket.id} className="p-3 bg-[#FEF3C7] border border-[#F59E0B] rounded-lg">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-[#F59E0B] flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium text-[#2F6FED]">{ticket.id}</span>
                          <span className="text-xs text-[#64748B]">•</span>
                          <span className="text-sm text-[#1E293B]">{ticket.laboratory}</span>
                        </div>
                        <p className="text-sm text-[#92400E]">{ticket.concern}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div>
              <h4 className="text-sm font-medium text-[#1E293B] mb-3">Notes for Next Shift</h4>
              <div className="p-4 bg-[#F4F7FB] border border-[#E5EAF2] rounded-lg text-sm text-[#64748B]">
                Waiting for confirmation from Exact Check regarding result validation.
                Machine X showed some fluctuations during the night shift and needs attention.
                All samples are properly labeled and stored in Refrigerator Unit B.
              </div>
            </div>

            {/* Confirmation Record (if confirmed) */}
            {confirmed && (
              <div className="mt-6 p-4 bg-[#F0FDF4] border border-[#22C55E] rounded-lg">
                <h4 className="text-sm font-medium text-[#166534] mb-2">Confirmation Record</h4>
                <div className="space-y-1 text-sm text-[#166534]">
                  <div>
                    <span className="font-medium">Confirmed by:</span> Dr. Sarah Chen
                  </div>
                  <div>
                    <span className="font-medium">Timestamp:</span> March 11, 2026 at{" "}
                    {new Date().toLocaleTimeString()}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Card Footer */}
          <div className="px-6 py-4 border-t border-[#E5EAF2] bg-[#FAFBFC] flex items-center justify-between">
            <div className="text-sm text-[#64748B]">
              Submitted on March 10, 2026 at 6:15 AM
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="border-[#E5EAF2] text-[#64748B] hover:bg-white hover:text-[#1E293B]"
              >
                Add Follow-up Note
              </Button>
              {!confirmed && (
                <Button
                  onClick={() => setIsModalOpen(true)}
                  className="bg-[#2F6FED] hover:bg-[#1D4ED8] text-white shadow-sm"
                >
                  Confirm Endorsement Received
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <EndorsementConfirmationModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        internName="Intern A"
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </div>
  );
}