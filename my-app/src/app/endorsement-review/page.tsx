"use client";

import Link from "next/link";
import { Button } from "../components/ui/button";
import { FileText, ArrowRight } from "lucide-react";

export default function EndorsementReviewIndex() {
  return (
    <div className="p-6 flex flex-col items-center justify-center min-h-[70vh]">
      <div className="w-20 h-20 bg-[#EFF6FF] rounded-full flex items-center justify-center mb-6">
        <FileText className="w-10 h-10 text-[#2F6FED]" />
      </div>
      
      <h2 className="text-2xl font-semibold text-[#1E293B] mb-3">No Endorsement Selected</h2>
      
      <p className="text-[#64748B] text-center max-w-md mb-8">
        To review an endorsement and accept pending tickets, please select a specific shift handover from the Shift Logs page.
      </p>
      
      <Link href="/shift-logs">
        <Button className="bg-[#2F6FED] hover:bg-[#1D4ED8] text-white shadow-sm flex items-center gap-2 px-6 py-5 text-base">
          Go to Shift Logs <ArrowRight className="w-5 h-5" />
        </Button>
      </Link>
    </div>
  );
}