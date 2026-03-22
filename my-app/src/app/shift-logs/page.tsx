import { User, Calendar, Clock } from "lucide-react";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";

const shiftLogs = [
  {
    id: 1,
    intern: "Intern A",
    date: "March 10, 2026",
    shift: "Night Shift",
    time: "8:00 PM - 6:00 AM",
    summary: "Machine X calibration needed tomorrow – QA Lab",
    tasksCompleted: 3,
    pendingTasks: 3,
    status: "Confirmed",
  },
  {
    id: 2,
    intern: "Intern B",
    date: "March 9, 2026",
    shift: "Evening Shift",
    time: "2:00 PM - 10:00 PM",
    summary: "Sample processing completed, inventory updated",
    tasksCompleted: 5,
    pendingTasks: 2,
    status: "Confirmed",
  },
  {
    id: 3,
    intern: "Intern C",
    date: "March 8, 2026",
    shift: "Morning Shift",
    time: "6:00 AM - 2:00 PM",
    summary: "Equipment maintenance log updated, all systems operational",
    tasksCompleted: 4,
    pendingTasks: 1,
    status: "Confirmed",
  },
  {
    id: 4,
    intern: "Intern A",
    date: "March 7, 2026",
    shift: "Night Shift",
    time: "8:00 PM - 6:00 AM",
    summary: "Quality control testing completed for Batch 234",
    tasksCompleted: 6,
    pendingTasks: 2,
    status: "Confirmed",
  },
];

export default function ShiftLogsPage() {
  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="mb-6">
          <h2 className="text-[#1E293B] mb-2 text-2xl font-semibold">Shift Logs</h2>
          <p className="text-[#64748B] text-sm">
            Historical record of all shift endorsements
          </p>
        </div>

        {/* Logs List */}
        <div className="space-y-4">
          {shiftLogs.map((log) => (
            <div
              key={log.id}
              className="bg-white border border-[#E5EAF2] rounded-lg shadow-sm overflow-hidden"
            >
              {/* Card Header */}
              <div className="px-6 py-4 border-b border-[#E5EAF2] bg-[#FAFBFC] flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#E0E7FF] flex items-center justify-center">
                    <User className="w-5 h-5 text-[#2F6FED]" />
                  </div>
                  <div>
                    <h3 className="text-[#1E293B] font-medium">{log.intern}</h3>
                    <div className="flex items-center gap-4 text-sm text-[#64748B] mt-1">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {log.date}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {log.shift} ({log.time})
                      </div>
                    </div>
                  </div>
                </div>
                <Badge className="bg-[#DCFCE7] text-[#22C55E] hover:bg-[#DCFCE7] border-transparent">
                  {log.status}
                </Badge>
              </div>
              
              {/* Card Body */}
              <div className="px-6 py-4">
                <p className="text-sm text-[#64748B] mb-4">{log.summary}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6 text-sm">
                    <div className="text-[#64748B]">
                      <span className="font-medium text-[#1E293B]">{log.tasksCompleted}</span>{" "}
                      tasks completed
                    </div>
                    <div className="text-[#64748B]">
                      <span className="font-medium text-[#1E293B]">{log.pendingTasks}</span>{" "}
                      pending tasks
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-[#2F6FED] hover:text-[#1D4ED8] hover:bg-[#F4F7FB]"
                  >
                    View Details
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}