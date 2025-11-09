import React from 'react';

function ProgressBar({ label, value, color }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1 text-sm">
        <span className="text-gray-600">{label}</span>
        <span className="text-gray-900 font-medium">{value}%</span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full ${color}`} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

function AnalyticsView({ summary }) {
  const sentiment = summary?.sentiment_breakdown || { positive: 0, neutral: 0, negative: 0 };
  const priority = summary?.priority_breakdown || { high: 0, normal: 0 };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="md:col-span-1 bg-white rounded-lg border p-6 shadow-sm">
        <p className="text-sm text-gray-500">Processed Today</p>
        <p className="text-4xl font-bold text-gray-900 mt-2">{summary?.processed_today ?? 0}</p>
      </div>

      <div className="md:col-span-2 bg-white rounded-lg border p-6 shadow-sm">
        <h3 className="text-base font-semibold text-gray-800 mb-4">Sentiment Breakdown</h3>
        <div className="space-y-4">
          <ProgressBar label="Positive" value={sentiment.positive} color="bg-green-500" />
          <ProgressBar label="Neutral" value={sentiment.neutral} color="bg-yellow-500" />
          <ProgressBar label="Negative" value={sentiment.negative} color="bg-red-500" />
        </div>
      </div>

      <div className="md:col-span-3 bg-white rounded-lg border p-6 shadow-sm">
        <h3 className="text-base font-semibold text-gray-800 mb-4">Priority Breakdown</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-lg border bg-gray-50">
            <p className="text-sm text-gray-500">High</p>
            <p className="text-3xl font-bold text-gray-900">{priority.high}%</p>
          </div>
          <div className="p-4 rounded-lg border bg-gray-50">
            <p className="text-sm text-gray-500">Normal</p>
            <p className="text-3xl font-bold text-gray-900">{priority.normal}%</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AnalyticsView;