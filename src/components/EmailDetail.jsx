import React from 'react';
import { CheckCircle2, Loader2, RefreshCw, Send } from 'lucide-react';

function MetaRow({ label, value, colorClass }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-gray-500">{label}</span>
      <span className={`font-medium ${colorClass || 'text-gray-800'}`}>{value}</span>
    </div>
  );
}

function Entities({ entities }) {
  const entries = Object.entries(entities || {});
  if (entries.length === 0) return (
    <p className="text-sm text-gray-500">No entities extracted.</p>
  );
  return (
    <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {entries.map(([k, v]) => (
        <div key={k} className="bg-gray-50 rounded-md p-2 border">
          <dt className="text-xs uppercase tracking-wide text-gray-500">{k}</dt>
          <dd className="text-sm font-medium text-gray-800 break-words">{String(v)}</dd>
        </div>
      ))}
    </dl>
  );
}

function EmailDetail({
  email,
  responseText,
  setResponseText,
  onSend,
  onRegenerate,
  onResolve,
  loadingAction,
  successMessage,
}) {
  if (!email) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500 text-sm">
        Select an email to view details.
      </div>
    );
  }

  const sentimentColor = {
    Positive: 'text-green-700',
    Neutral: 'text-yellow-700',
    Negative: 'text-red-700',
  }[email.sentiment] || 'text-gray-800';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div className="lg:col-span-2 space-y-4">
        <div className="bg-white rounded-lg border shadow-sm">
          <div className="px-4 py-3 border-b">
            <h2 className="text-lg font-semibold text-gray-800">{email.subject}</h2>
            <p className="text-sm text-gray-500">From: {email.sender}</p>
          </div>
          <div className="p-4 max-h-[45vh] overflow-auto text-gray-800 whitespace-pre-wrap leading-relaxed">
            {email.body_text}
          </div>
        </div>

        <div className="bg-white rounded-lg border shadow-sm">
          <div className="px-4 py-3 border-b">
            <h3 className="text-sm font-semibold text-gray-800">AI Response Draft</h3>
          </div>
          <div className="p-4 space-y-3">
            <textarea
              value={responseText}
              onChange={(e) => setResponseText(e.target.value)}
              className="w-full min-h-[140px] rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-sm"
              placeholder="Write your response..."
            />
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={onSend}
                disabled={loadingAction === 'send'}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed`}
              >
                {loadingAction === 'send' ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
                Send Response
              </button>
              <button
                onClick={onRegenerate}
                disabled={loadingAction === 'regenerate'}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium border bg-white hover:bg-gray-50"
              >
                {loadingAction === 'regenerate' ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4" />
                )}
                Regenerate Draft
              </button>
              <button
                onClick={onResolve}
                disabled={loadingAction === 'resolve'}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium border bg-white hover:bg-gray-50"
              >
                {loadingAction === 'resolve' ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                )}
                Mark Resolved
              </button>
              {successMessage && (
                <span className="text-sm text-green-700">{successMessage}</span>
              )}
            </div>
          </div>
        </div>
      </div>

      <aside className="space-y-4">
        <div className="bg-white rounded-lg border shadow-sm p-4">
          <h3 className="text-sm font-semibold text-gray-800 mb-3">Triage Results</h3>
          <div className="space-y-2">
            <MetaRow label="Priority" value={email.priority_label} colorClass={email.priority_label === 'High' ? 'text-red-700' : 'text-gray-800'} />
            <MetaRow label="Sentiment" value={email.sentiment} colorClass={sentimentColor} />
            <MetaRow label="Status" value={email.status} />
          </div>
        </div>
        <div className="bg-white rounded-lg border shadow-sm p-4">
          <h3 className="text-sm font-semibold text-gray-800 mb-3">Extracted Entities</h3>
          <Entities entities={email.extracted_entities} />
        </div>
      </aside>
    </div>
  );
}

export default EmailDetail;
