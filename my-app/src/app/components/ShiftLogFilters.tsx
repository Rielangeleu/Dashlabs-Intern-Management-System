"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function ShiftLogFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Read current URL state
  const currentStatus = searchParams.get("status") || "active";
  const currentSearch = searchParams.get("search") || "";

  // Local state for the search bar (so it doesn't update URL on every keystroke)
  const [searchInput, setSearchInput] = useState(currentSearch);

  const updateUrl = (newStatus: string, newSearch: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", "1"); // Always reset to page 1 when filtering
    params.set("status", newStatus);
    
    if (newSearch.trim() !== "") {
      params.set("search", newSearch.trim());
    } else {
      params.delete("search"); // Clean up URL if empty
    }
    
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6 bg-white p-4 rounded-lg border border-[#E5EAF2] shadow-sm">
      {/* Search Bar */}
      <div className="flex-1">
        <label className="block text-xs font-medium text-[#64748B] mb-1">Search Endorsement ID</label>
        <div className="flex">
          <input 
            type="text" 
            placeholder="e.g. END-4021" 
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && updateUrl(currentStatus, searchInput)}
            className="flex-1 border border-gray-300 rounded-l-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button 
            onClick={() => updateUrl(currentStatus, searchInput)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-r-md text-sm font-medium transition-colors"
          >
            Search
          </button>
        </div>
      </div>

      {/* Status Filter */}
      <div className="sm:w-64">
        <label className="block text-xs font-medium text-[#64748B] mb-1">Filter View</label>
        <select 
          value={currentStatus}
          onChange={(e) => updateUrl(e.target.value, searchInput)}
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="active">Active & Recent (Last 24h)</option>
          <option value="pending">Pending Only</option>
          <option value="acknowledged">Acknowledged Only</option>
          <option value="all">All Historical Logs</option>
        </select>
      </div>
    </div>
  );
}