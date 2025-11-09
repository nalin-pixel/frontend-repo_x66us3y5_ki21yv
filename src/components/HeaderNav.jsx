import React from 'react';
import { Mail, BarChart2 } from 'lucide-react';

function HeaderNav({ view, onToggleView }) {
  const isEmails = view === 'emails';
  return (
    <header className="w-full border-b bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-blue-50 text-blue-600"><Mail className="h-6 w-6" /></div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-800">AI-Smart Support Triage</h1>
            <p className="text-xs sm:text-sm text-gray-500">Intelligent email triage and analytics</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onToggleView('emails')}
            className={`inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              isEmails ? 'bg-blue-600 text-white shadow' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            aria-pressed={isEmails}
          >
            <Mail className="h-4 w-4" />
            <span className="hidden sm:inline">Email View</span>
            <span className="sm:hidden">Emails</span>
          </button>
          <button
            onClick={() => onToggleView('analytics')}
            className={`inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              !isEmails ? 'bg-blue-600 text-white shadow' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            aria-pressed={!isEmails}
          >
            <BarChart2 className="h-4 w-4" />
            <span className="hidden sm:inline">Analytics View</span>
            <span className="sm:hidden">Stats</span>
          </button>
        </div>
      </div>
    </header>
  );
}

export default HeaderNav;