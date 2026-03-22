"use client";

import { useState, useEffect } from "react";
import { createTicket } from "../actions/ticket";
import { useRouter } from "next/navigation";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Label } from "../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import FormBuilder, { FormField } from "../components/FormBuilder";
import { toast } from "sonner";

export default function CreateTicketPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [dynamicFields, setDynamicFields] = useState<FormField[]>([]);
  
  const [form, setForm] = useState({
    ticketId: "", 
    laboratory: "",
    priority: "Normal",
    description: ""
  });

  // Generate the initial DASH-1234 ID when the component loads
  useEffect(() => {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    setForm(prev => ({ ...prev, ticketId: `DASH-${randomNum}` }));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const ticketData = {
      ...form,
      attachments: dynamicFields
    };

    const result = await createTicket(ticketData);

    if (result.success) {
      toast.success(`Ticket ${result.ticketId} Created!`);
      router.push("/ticket-tracker");
    } else {
      toast.error("Failed to save ticket.");
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      
      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-[#E5EAF2] shadow-sm overflow-hidden">
        
        {/* Top Header Section matching the screenshot */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between px-8 py-5 border-b border-[#E5EAF2] bg-white">
          <h2 className="text-[#1E293B] text-xl font-semibold">Ticket Information</h2>
          
          <div className="flex items-center gap-2 mt-2 sm:mt-0">
            <span className="text-sm text-[#64748B]">Ticket ID:</span>
            {/* Editable Ticket ID Input that blends in */}
            <Input 
              value={form.ticketId} 
              onChange={(e) => setForm({...form, ticketId: e.target.value})}
              className="w-28 h-8 px-2 py-1 text-[#2F6FED] font-medium bg-transparent border-transparent hover:border-[#E5EAF2] focus:border-[#2F6FED] focus:bg-white transition-all shadow-none"
            />
          </div>
        </div>

        {/* Form Body Layout */}
        <div className="p-8 space-y-8">
          
          {/* Laboratory Name */}
          <div className="space-y-2">
            <Label className="text-[#1E293B] font-medium text-base">
              Laboratory Name <span className="text-red-500">*</span>
            </Label>
            <Input 
              required 
              value={form.laboratory}
              onChange={(e) => setForm({...form, laboratory: e.target.value})}
              placeholder="e.g., RTA Clinic, Exact Check" 
              className="bg-[#F8FAFC] border-[#E2E8F0] focus:ring-[#2F6FED] h-11 shadow-none rounded-md"
            />
          </div>

          {/* Issue Description */}
          <div className="space-y-2">
            <Label className="text-[#1E293B] font-medium text-base">
              Concern / Issue Description <span className="text-red-500">*</span>
            </Label>
            <Textarea 
              required 
              value={form.description}
              onChange={(e) => setForm({...form, description: e.target.value})}
              placeholder="e.g., Total iron not showing up on the generated results."
              className="min-h-[140px] bg-[#F8FAFC] border-[#E2E8F0] focus:ring-[#2F6FED] shadow-none rounded-md resize-y"
            />
            <p className="text-[13px] text-[#64748B] pt-1">
              Provide as much detail as possible to help solvers understand the issue
            </p>
          </div>

          {/* Priority Level */}
          <div className="space-y-2">
            <Label className="text-[#1E293B] font-medium text-base">
              Priority Level <span className="text-red-500">*</span>
            </Label>
            <Select onValueChange={(val) => setForm({...form, priority: val})} defaultValue="Normal">
              <SelectTrigger className="bg-[#F8FAFC] border-[#E2E8F0] h-11 shadow-none rounded-md w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent
              className="bg-white z-50 border shadow-md">
                <SelectItem value="Low">Low</SelectItem>
                <SelectItem value="Normal">Normal</SelectItem>
                <SelectItem value="Urgent">Urgent</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Dynamic Attachments Section */}
          <div className="space-y-4 pt-4">
            <Label className="text-[#1E293B] font-medium text-base">Attachments (Notes, Code, Screenshots)</Label>
            <FormBuilder fields={dynamicFields} setFields={setDynamicFields} />
          </div>

        </div>

        {/* Footer Actions */}
        <div className="flex justify-end gap-3 px-8 py-5 border-t border-[#E5EAF2] bg-slate-50">
          <Button 
            type="button" 
            variant="ghost" 
            onClick={() => router.back()}
            className="text-[#64748B] hover:bg-[#E2E8F0]"
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={loading} 
            className="bg-[#2F6FED] hover:bg-[#1D4ED8] text-white px-8"
          >
            {loading ? "Saving..." : "Create Ticket"}
          </Button>
        </div>
      </form>
    </div>
  );
}