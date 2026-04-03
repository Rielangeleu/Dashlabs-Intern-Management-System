"use client";

import { useEffect, useState } from "react";
import { getHistoryForTicket } from "@/app/actions/history";

export default function TaskHistoryTimeline({ ticketId }: { ticketId: string }) {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchHistory() {
      const response = await getHistoryForTicket(ticketId);
      if (response.success) {
        setLogs(response.history);
      }
      setLoading(false);
    }
    fetchHistory();
  }, [ticketId]);

  if (loading) return <div className="text-gray-500 animate-pulse">Loading audit trail...</div>;
  if (logs.length === 0) return <div className="text-gray-500">No history found.</div>;

  return (
    <div className="relative border-l-2 border-blue-200 ml-3 mt-4 space-y-6">
      {logs.map((log) => (
        <div key={log._id} className="relative pl-6">
          {/* The Timeline Dot */}
          <div className="absolute -left-[9px] top-1 h-4 w-4 rounded-full bg-blue-500 border-2 border-white shadow"></div>
          
          {/* The Content */}
          <div className="bg-gray-50 p-3 rounded-md shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-1">
              <span className="font-semibold text-sm text-gray-800">{log.action.replace("_", " ")}</span>
              <span className="text-xs text-gray-500">
                {new Date(log.timestamp).toLocaleString()}
              </span>
            </div>
            <p className="text-sm text-gray-600 font-medium">{log.performedBy}</p>
            <p className="text-sm text-gray-500 mt-1">{log.details}</p>
          </div>
        </div>
      ))}
    </div>
  );
}