import { getEndorsements } from "@/app/actions/endorsement";
import Link from "next/link";
import PaginationControls from "@/app/components/PaginationControls";
import ShiftLogFilters from "@/app/components/ShiftLogFilters";

export default async function ShiftLogsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  // 1. Unwrap the Next.js 15 searchParams Promise
  const resolvedSearchParams = await searchParams;

  // 2. Read the resolved URL parameters
  const page = typeof resolvedSearchParams.page === 'string' ? Number(resolvedSearchParams.page) : 1;
  const limit = typeof resolvedSearchParams.limit === 'string' ? Number(resolvedSearchParams.limit) : 10;
  const statusFilter = typeof resolvedSearchParams.status === 'string' ? resolvedSearchParams.status : "active";
  const searchId = typeof resolvedSearchParams.search === 'string' ? resolvedSearchParams.search : "";

  // 3. Fetch the data
  const response = await getEndorsements(page, limit, statusFilter, searchId);
  const logs = response.success ? response.logs : [];
  const pagination = response.pagination;

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex justify-between items-end">
          <div>
            <h2 className="text-[#1E293B] mb-2 text-2xl font-semibold">Shift Handovers</h2>
            <p className="text-[#64748B] text-sm">
              Review and acknowledge laboratory shift endorsements.
            </p>
          </div>
          <Link 
            href="/create-endorsement" 
            className="bg-blue-600 text-white px-4 py-2 rounded-md font-medium text-sm hover:bg-blue-700 transition-colors"
          >
            + Create Endorsement
          </Link>
        </div>

        <ShiftLogFilters />

        <div className="bg-white border border-[#E5EAF2] rounded-lg shadow-sm overflow-hidden flex flex-col">
          {logs.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-[#64748B]">No shift logs found for this filter.</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto min-h-[400px]">
                <table className="w-full text-left text-sm text-[#64748B]">
                  <thead className="bg-gray-50 border-b border-[#E5EAF2] text-xs uppercase text-[#1E293B]">
                    <tr>
                      <th className="px-6 py-4 font-medium">Endorsement ID</th>
                      <th className="px-6 py-4 font-medium">Shift Date</th>
                      <th className="px-6 py-4 font-medium">Submitted By</th>
                      <th className="px-6 py-4 font-medium">Status</th>
                      <th className="px-6 py-4 font-medium text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5EAF2]">
                    {logs.map((log: any) => (
                      <tr key={log._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap font-medium text-[#1E293B]">
                          {log.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {log.date} ({log.shift})
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {log.intern}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${
                            log.status === "Pending" 
                              ? "bg-amber-100 text-amber-700 border-amber-200" 
                              : "bg-green-100 text-green-700 border-green-200"
                          }`}>
                            {log.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <Link 
                            href={`/endorsement-review/${log.id}`}
                            className="text-blue-600 hover:text-blue-800 font-medium hover:underline"
                          >
                            View Details
                          </Link>
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