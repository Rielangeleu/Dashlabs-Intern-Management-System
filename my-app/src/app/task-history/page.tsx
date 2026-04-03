import { getAllTaskHistory } from "@/app/actions/history";
import Link from "next/link";
import PaginationControls from "@/app/components/PaginationControls";

export default async function TaskHistoryPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  // 1. Unwrap the Next.js 15 searchParams Promise
  const resolvedSearchParams = await searchParams;

  // 2. Read the resolved URL parameters
  const page = typeof resolvedSearchParams.page === 'string' ? Number(resolvedSearchParams.page) : 1;
  const limit = typeof resolvedSearchParams.limit === 'string' ? Number(resolvedSearchParams.limit) : 15;

  // 3. Fetch the paginated data
  const response = await getAllTaskHistory(page, limit);
  const logs = response.success ? response.history : [];
  const pagination = response.pagination;

  const getActionBadge = (action: string) => {
    switch(action) {
      case "CREATED": return "bg-green-100 text-green-700 border-green-200";
      case "REASSIGNED": return "bg-blue-100 text-blue-700 border-blue-200";
      case "STATUS_CHANGED": return "bg-orange-100 text-orange-700 border-orange-200";
      case "NOTE_ADDED": return "bg-purple-100 text-purple-700 border-purple-200";
      default: return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h2 className="text-[#1E293B] mb-2 text-2xl font-semibold">Global Task History</h2>
          <p className="text-[#64748B] text-sm">
            Complete audit trail of all system activities and handovers.
          </p>
        </div>

        <div className="bg-white border border-[#E5EAF2] rounded-lg shadow-sm overflow-hidden flex flex-col">
          {logs.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-[#64748B]">No task history recorded yet.</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto min-h-[400px]">
                <table className="w-full text-left text-sm text-[#64748B]">
                  <thead className="bg-gray-50 border-b border-[#E5EAF2] text-xs uppercase text-[#1E293B]">
                    <tr>
                      <th className="px-6 py-4 font-medium">Date & Time</th>
                      <th className="px-6 py-4 font-medium">Ticket ID</th>
                      <th className="px-6 py-4 font-medium">Action</th>
                      <th className="px-6 py-4 font-medium">User</th>
                      <th className="px-6 py-4 font-medium">Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5EAF2]">
                    {logs.map((log: any) => (
                      <tr key={log._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          {log.timestamp ? new Date(log.timestamp).toLocaleString('en-US', { 
                            month: 'short', day: 'numeric', year: 'numeric', 
                            hour: 'numeric', minute: '2-digit' 
                          }) : "Unknown"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap font-medium text-blue-600 hover:underline">
                          <Link href={`/ticket/${log.ticketId}`}>
                            {log.ticketId}
                          </Link>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getActionBadge(log.action)}`}>
                            {log.action.replace("_", " ")}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap font-medium text-[#1E293B]">
                          {log.performedBy}
                        </td>
                        <td className="px-6 py-4 min-w-[300px]">
                          {log.details}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {pagination && (
                <PaginationControls 
                  currentPage={pagination.currentPage} 
                  totalPages={pagination.totalPages} 
                  currentLimit={pagination.limit} 
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}