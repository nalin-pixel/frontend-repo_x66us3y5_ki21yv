import React from 'react';
import { Filter } from 'lucide-react';

function FiltersPanel({
  priorityFilter,
  setPriorityFilter,
  statusFilter,
  setStatusFilter,
  sentimentFilter,
  setSentimentFilter,
}) {
  const priorityOptions = ['All', 'High', 'Normal'];
  const statusOptions = ['All', 'New', 'Pending', 'Resolved'];
  const sentimentOptions = ['All', 'Positive', 'Neutral', 'Negative'];

  return (
    <div className="bg-white rounded-lg border p-3 sm:p-4 shadow-sm">
      <div className="flex items-center gap-2 mb-3 text-gray-700">
        <Filter className="h-4 w-4" />
        <span className="text-sm font-medium">Filters</span>
      </div>

      <div className="space-y-3">
        <div>
          <p className="text-xs font-semibold text-gray-500 mb-1">Priority</p>
          <div className="flex flex-wrap gap-2">
            {priorityOptions.map((opt) => (
              <button
                key={opt}
                onClick={() => setPriorityFilter(opt)}
                className={`px-3 py-1.5 rounded-md text-sm border transition ${
                  priorityFilter === opt
                    ? 'bg-blue-600 text-white border-blue-600 shadow'
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border-gray-200'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold text-gray-500 mb-1">Status</p>
          <div className="flex flex-wrap gap-2">
            {statusOptions.map((opt) => (
              <button
                key={opt}
                onClick={() => setStatusFilter(opt)}
                className={`px-3 py-1.5 rounded-md text-sm border transition ${
                  statusFilter === opt
                    ? 'bg-blue-50 text-blue-700 border-blue-200'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-200'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold text-gray-500 mb-1">Sentiment</p>
          <select
            value={sentimentFilter}
            onChange={(e) => setSentimentFilter(e.target.value)}
            className="w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-sm"
          >
            {sentimentOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

export default FiltersPanel;