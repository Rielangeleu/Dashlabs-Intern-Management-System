"use client"; // Required for Modal interactions

import { AlertCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog"; // Adjusted path assuming it's in the same folder
import { Button } from "./ui/button"; // Adjusted path assuming it's in the same folder

interface EndorsementConfirmationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  internName?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function EndorsementConfirmationModal({
  open,
  onOpenChange,
  internName = "Intern A",
  onConfirm,
  onCancel,
}: EndorsementConfirmationModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {/* Note: shadcn/ui DialogContent usually includes a close button built-in. 
        If it clashes with your design, you may need to tweak the DialogContent component itself.
      */}
      <DialogContent className="sm:max-w-[480px] p-0 gap-0 border-[#E5EAF2] overflow-hidden">
        
        {/* Header with Logo */}
        <div className="px-6 pt-6 pb-4 border-b border-[#E5EAF2]">
          <div className="flex items-center gap-3 mb-4">
            {/* Changed to absolute path assuming logo is in Next.js public folder */}
            <img src="/dashlabs-logo.png" alt="Dashlabs" className="h-8" />
          </div>
          <DialogHeader>
            <DialogTitle className="text-[#1E293B] text-xl">
              Endorsement Confirmation
            </DialogTitle>
            <DialogDescription className="text-[#64748B] text-sm mt-2">
              Please review before confirming
            </DialogDescription>
          </DialogHeader>
        </div>

        {/* Content */}
        <div className="px-6 py-6">
          <div className="flex gap-4">
            <div className="flex-shrink-0 mt-1">
              <div className="w-10 h-10 rounded-lg bg-[#FEF3C7] flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-[#F59E0B]" />
              </div>
            </div>
            <div className="flex-1">
              <p className="text-[#1E293B] mb-3">
                You are about to confirm the shift endorsement from{" "}
                <span className="font-medium">{internName}</span>.
              </p>
              <p className="text-[#64748B] text-sm">
                Please ensure you have reviewed all pending tasks.
              </p>
            </div>
          </div>

          {/* Info card */}
          <div className="mt-4 p-4 bg-[#F4F7FB] border border-[#E5EAF2] rounded-lg">
            <h4 className="text-sm font-medium text-[#1E293B] mb-2">
              What happens next:
            </h4>
            <ul className="space-y-1.5 text-sm text-[#64748B]">
              <li className="flex items-start gap-2">
                <span className="text-[#2F6FED] mt-0.5">•</span>
                <span>The endorsement will be marked as confirmed</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#2F6FED] mt-0.5">•</span>
                <span>Pending tasks will be transferred to your task list</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#2F6FED] mt-0.5">•</span>
                <span>A confirmation record will be created with timestamp</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <DialogFooter className="px-6 py-4 border-t border-[#E5EAF2] bg-[#FAFBFC] sm:justify-between flex-row justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="border-[#E5EAF2] text-[#64748B] hover:bg-white hover:text-[#1E293B]"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={onConfirm}
            className="bg-[#2F6FED] hover:bg-[#1D4ED8] text-white shadow-sm"
          >
            Confirm Endorsement
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}