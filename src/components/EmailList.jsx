import React from 'react';
import { AlertTriangle } from 'lucide-react';

function SentimentBadge({ sentiment }) {
  const map = {
    Positive: 'bg-green-100 text-green-700 border-green-200',
    Neutral: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    Negative: 'bg-red-100 text-red-700 border-red-200',
  };
  const label = sentiment || 'Neutral';
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs border ${map[label]}`}>{label}</span>
  );
}

function EmailList({ emails, selectedId, onSelect }) {
  return (
    <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
      <div className="px-4 py-2 border-b bg-gray-50 text-sm font-medium text-gray-700">Emails</div>
      <ul className="divide-y max-h-[60vh] overflow-y-auto">
        {emails.map((email) => (
          <li
            key={email.db_id}
            onClick={() => onSelect(email)}
            className={`p-4 cursor-pointer transition hover:bg-blue-50/50 ${
              selectedId === email.db_id ? 'bg-blue-50' : 'bg-white'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-gray-800 truncate">{email.sender}</p>
                  {email.priority_label === 'High' && (
                    <span className="inline-flex items-center gap-1 text-red-600 text-xs font-semibold">
                      <AlertTriangle className="h-3.5 w-3.5" /> High
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-700 truncate">{email.subject}</p>
                <div className="mt-1 flex items-center gap-2">
                  <SentimentBadge sentiment={email.sentiment} />
                  <span className="text-xs text-gray-500">{email.status}</span>
                </div>
              </div>
            </div>
          </li>
        ))}
        {emails.length === 0 && (
          <li className="p-6 text-center text-sm text-gray-500">No emails match your filters.</li>
        )}
      </ul>
    </div>
  );
}

export default EmailList;