"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function PaginationControls({ 
  currentPage, 
  totalPages, 
  currentLimit 
}: { 
  currentPage: number; 
  totalPages: number; 
  currentLimit: number; 
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Helper function to update the URL without reloading the page
  const updateUrl = (newPage: number, newLimit: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    params.set("limit", newLimit.toString());
    router.push(`?${params.toString()}`, { scroll: false }); // scroll: false keeps them at the bottom of the table
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center px-6 py-4 border-t border-[#E5EAF2] bg-gray-50 rounded-b-lg">
      
      {/* Page Size Selector */}
      <div className="flex items-center space-x-2 text-sm text-[#64748B] mb-4 sm:mb-0">
        <span>Show</span>
        <select 
          value={currentLimit}
          onChange={(e) => updateUrl(1, Number(e.target.value))} // Reset to page 1 when changing size
          className="border border-gray-300 rounded px-2 py-1 text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value={10}>10</option>
          <option value={15}>15</option>
          <option value={20}>20</option>
          <option value={30}>30</option>
        </select>
        <span>logs per page</span>
      </div>

      {/* Next / Prev Buttons */}
      <div className="flex items-center space-x-4">
        <span className="text-sm text-[#64748B]">
          Page <span className="font-semibold text-gray-900">{currentPage}</span> of <span className="font-semibold text-gray-900">{totalPages || 1}</span>
        </span>
        
        <div className="flex space-x-2">
          <button
            onClick={() => updateUrl(currentPage - 1, currentLimit)}
            disabled={currentPage <= 1}
            className="px-3 py-1 border border-gray-300 rounded text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>
          <button
            onClick={() => updateUrl(currentPage + 1, currentLimit)}
            disabled={currentPage >= totalPages}
            className="px-3 py-1 border border-gray-300 rounded text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Next
          </button>
        </div>
      </div>
      
    </div>
  );
}