import React, { useEffect, useMemo, useState } from 'react';
import HeaderNav from './components/HeaderNav.jsx';
import FiltersPanel from './components/FiltersPanel.jsx';
import EmailList from './components/EmailList.jsx';
import EmailDetail from './components/EmailDetail.jsx';
import AnalyticsView from './components/AnalyticsView.jsx';
import { Loader2, ArrowLeft } from 'lucide-react';

/*
Type-like docs

@typedef {Object} Email
@property {string} db_id
@property {string} sender
@property {string} subject
@property {string} body_text
@property {'High'|'Normal'} priority_label
@property {'Positive'|'Neutral'|'Negative'} sentiment
@property {'New'|'Pending'|'Resolved'} status
@property {Record<string, string>} extracted_entities
@property {string} generated_response

@typedef {Object} AnalyticsSummary
@property {number} processed_today
@property {{positive:number, neutral:number, negative:number}} sentiment_breakdown
@property {{high:number, normal:number}} priority_breakdown
*/

function App() {
  // View State
  const [view, setView] = useState('emails'); // 'emails' | 'analytics'
  const [isMobile, setIsMobile] = useState(false);

  // Data State
  const [emails, setEmails] = useState(/** @type {Email[]} */([]));
  const [selectedEmail, setSelectedEmail] = useState(/** @type {Email|null} */(null));
  const [responseText, setResponseText] = useState('');

  // Filters
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sentimentFilter, setSentimentFilter] = useState('All');

  // Loading / Feedback
  const [loadingEmails, setLoadingEmails] = useState(true);
  const [loadingAction, setLoadingAction] = useState(null); // 'send' | 'regenerate' | 'resolve' | null
  const [successMessage, setSuccessMessage] = useState('');

  const [analytics, setAnalytics] = useState(/** @type {AnalyticsSummary|null} */(null));
  const [loadingAnalytics, setLoadingAnalytics] = useState(false);

  // Responsive detection
  useEffect(() => {
    const mql = window.matchMedia('(max-width: 767px)');
    const handler = (e) => setIsMobile(e.matches);
    handler(mql);
    mql.addEventListener ? mql.addEventListener('change', handler) : mql.addListener(handler);
    return () => {
      mql.removeEventListener ? mql.removeEventListener('change', handler) : mql.removeListener(handler);
    };
  }, []);

  // Mock Data
  const mockEmails = useMemo(() => {
    /** @type {Email[]} */
    const list = [
      {
        db_id: 'e1',
        sender: 'sarah.williams@example.com',
        subject: 'Order #10452 arrived damaged – need replacement',
        body_text:
          'Hello,\nMy recent order #10452 arrived with the packaging torn and the product seems scratched. Could you please advise on a replacement process?\nThanks,\nSarah',
        priority_label: 'High',
        sentiment: 'Negative',
        status: 'New',
        extracted_entities: { 'Order ID': '10452', 'Product Name': 'Noise-cancelling Headphones', 'Phone Number': '(415) 555-0133' },
        generated_response:
          'Hi Sarah,\n\nI’m so sorry your order arrived damaged. I can arrange a free replacement right away. Please confirm the shipping address, and we’ll share a prepaid return label.\n\nBest regards,\nSupport Team',
      },
      {
        db_id: 'e2',
        sender: 'michael.chen@corp.io',
        subject: 'Bulk pricing inquiry for 50 units',
        body_text:
          'Hi team,\nWe are considering a bulk purchase of 50 units of your smart hubs. Do you offer tiered discounts and net-30 terms?\n— Michael',
        priority_label: 'Normal',
        sentiment: 'Neutral',
        status: 'Pending',
        extracted_entities: { Quantity: '50', Company: 'Chen & Co', Terms: 'Net-30' },
        generated_response:
          'Hi Michael,\n\nThank you for your interest. Yes, we provide tiered discounts for orders of 25+ units and support net-30 for approved accounts. I can share a custom quote—could you confirm your shipping ZIP?\n\nBest,\nSupport Team',
      },
      {
        db_id: 'e3',
        sender: 'ana.garcia@example.org',
        subject: 'Subscription canceled by mistake',
        body_text:
          'Hello support,\nI accidentally canceled my Pro subscription. Could you restore my plan without losing data?\nThanks! Ana',
        priority_label: 'High',
        sentiment: 'Negative',
        status: 'New',
        extracted_entities: { Plan: 'Pro', Region: 'EU' },
        generated_response:
          'Hi Ana,\n\nNo worries—we can restore your Pro subscription immediately and your data remains intact. Please confirm the last four digits of your payment method to proceed.\n\nRegards,\nSupport Team',
      },
      {
        db_id: 'e4',
        sender: 'liam@startup.dev',
        subject: 'Great experience with your support!',
        body_text:
          'Just wanted to say thank you—your team resolved my issue quickly and the product works great now.',
        priority_label: 'Normal',
        sentiment: 'Positive',
        status: 'Resolved',
        extracted_entities: { NPS: '9/10' },
        generated_response:
          'Hi Liam,\n\nWe’re thrilled to hear this! Thanks for the kind words. If anything comes up, we’re here to help.\n\nCheers,\nSupport Team',
      },
      {
        db_id: 'e5',
        sender: 'priya.k@retailers.com',
        subject: 'Wrong color received – need exchange',
        body_text:
          'Hi,\nI ordered the jacket in Navy but received Black. Can you exchange it? Order #10588.\n— Priya',
        priority_label: 'Normal',
        sentiment: 'Negative',
        status: 'Pending',
        extracted_entities: { 'Order ID': '10588', Color: 'Navy', Received: 'Black' },
        generated_response:
          'Hi Priya,\n\nSorry about the mix-up. We can start an exchange right away. Please confirm your shipping address and we’ll send a prepaid label.\n\nBest,\nSupport Team',
      },
      {
        db_id: 'e6',
        sender: 'omar.hassan@example.com',
        subject: 'Feature request: webhook retries',
        body_text:
          'Hello,\nIt would be great if failed webhooks could auto-retry with exponential backoff. Is this on the roadmap?',
        priority_label: 'Normal',
        sentiment: 'Neutral',
        status: 'New',
        extracted_entities: { Feature: 'Webhook retries', Priority: 'Medium' },
        generated_response:
          'Hi Omar,\n\nThanks for the suggestion. Retries with exponential backoff are on our roadmap for Q3. I can add you to the beta list if you’d like.\n\nBest,\nSupport Team',
      },
      {
        db_id: 'e7',
        sender: 'emma.brooks@agency.co',
        subject: 'Refund processed? Payment not showing',
        body_text:
          'Hello,\nI was told my refund was processed last week, but I don’t see it on my card yet. Could you check the status?',
        priority_label: 'High',
        sentiment: 'Negative',
        status: 'Pending',
        extracted_entities: { Refund: 'In review', Bank: 'First Federal' },
        generated_response:
          'Hi Emma,\n\nI’m checking on your refund now. Card issuers can take 5–10 business days to post credits. I’ll follow up with the processor and update you within 24 hours.\n\nRegards,\nSupport Team',
      },
    ];
    return list;
  }, []);

  // Mock API functions (500ms latency)
  const fetchEmails = () =>
    new Promise((resolve) => setTimeout(() => resolve(mockEmails), 500));

  const sendResponse = (emailId, text) =>
    new Promise((resolve) => setTimeout(() => resolve({ ok: true, emailId, text }), 500));

  const regenerateResponse = (emailId) =>
    new Promise((resolve) =>
      setTimeout(
        () =>
          resolve({
            ok: true,
            draft:
              'Hi there,\n\nFollowing up with an updated draft: we’re on it and will resolve this promptly. Please let us know if there’s anything else we can do for you.\n\nBest,\nSupport Team',
            emailId,
          }),
        500,
      ),
    );

  const markResolved = (emailId) =>
    new Promise((resolve) => setTimeout(() => resolve({ ok: true, emailId, status: 'Resolved' }), 500));

  const fetchAnalytics = () =>
    new Promise((resolve) =>
      setTimeout(
        () =>
          resolve({
            processed_today: 128,
            sentiment_breakdown: { positive: 36, neutral: 28, negative: 36 },
            priority_breakdown: { high: 42, normal: 58 },
          }),
        500,
      ),
    );

  // Initial load
  useEffect(() => {
    setLoadingEmails(true);
    fetchEmails().then((data) => {
      setEmails(/** @type {Email[]} */(data));
      setLoadingEmails(false);
    });
  }, []);

  // Load analytics when switching to analytics view (lazy)
  useEffect(() => {
    if (view === 'analytics' && !analytics) {
      setLoadingAnalytics(true);
      fetchAnalytics().then((summary) => {
        setAnalytics(/** @type {AnalyticsSummary} */(summary));
        setLoadingAnalytics(false);
      });
    }
  }, [view, analytics]);

  // Filtering logic
  const filteredEmails = useMemo(() => {
    return emails.filter((e) => {
      const byPriority = priorityFilter === 'All' || e.priority_label === priorityFilter;
      const byStatus = statusFilter === 'All' || e.status === statusFilter;
      const bySentiment = sentimentFilter === 'All' || e.sentiment === sentimentFilter;
      return byPriority && byStatus && bySentiment;
    });
  }, [emails, priorityFilter, statusFilter, sentimentFilter]);

  // Handlers
  const handleSelectEmail = (email) => {
    setSelectedEmail(email);
    setResponseText(email.generated_response || '');
    setSuccessMessage('');
    if (isMobile) {
      // On mobile, focus detail view area by scrolling and hiding list
      // We will simply render detail-only when isMobile and selectedEmail exists
      // No extra state needed
      // Smooth scroll top for better UX
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSend = async () => {
    if (!selectedEmail) return;
    setLoadingAction('send');
    setSuccessMessage('');
    await sendResponse(selectedEmail.db_id, responseText);
    setLoadingAction(null);
    setSuccessMessage('Response sent successfully.');
  };

  const handleRegenerate = async () => {
    if (!selectedEmail) return;
    setLoadingAction('regenerate');
    setSuccessMessage('');
    const res = await regenerateResponse(selectedEmail.db_id);
    if (res?.draft) {
      setResponseText(res.draft);
    }
    setLoadingAction(null);
    setSuccessMessage('Draft regenerated.');
  };

  const handleResolve = async () => {
    if (!selectedEmail) return;
    setLoadingAction('resolve');
    setSuccessMessage('');
    await markResolved(selectedEmail.db_id);
    // Update local state
    setEmails((prev) => prev.map((e) => (e.db_id === selectedEmail.db_id ? { ...e, status: 'Resolved' } : e)));
    setSelectedEmail((prev) => (prev ? { ...prev, status: 'Resolved' } : prev));
    setLoadingAction(null);
    setSuccessMessage('Marked as resolved.');
  };

  // UI
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <HeaderNav view={view} onToggleView={setView} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {view === 'analytics' ? (
          <div>
            {loadingAnalytics ? (
              <div className="flex items-center justify-center py-24 text-gray-600">
                <Loader2 className="h-6 w-6 animate-spin mr-2" /> Loading analytics...
              </div>
            ) : (
              <AnalyticsView summary={analytics} />
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Left Column: Filters + List */}
            {!(isMobile && selectedEmail) && (
              <div className="md:col-span-1 space-y-4">
                <FiltersPanel
                  priorityFilter={priorityFilter}
                  setPriorityFilter={setPriorityFilter}
                  statusFilter={statusFilter}
                  setStatusFilter={setStatusFilter}
                  sentimentFilter={sentimentFilter}
                  setSentimentFilter={setSentimentFilter}
                />

                {loadingEmails ? (
                  <div className="bg-white rounded-lg border shadow-sm p-6 flex items-center justify-center text-gray-600">
                    <Loader2 className="h-5 w-5 animate-spin mr-2" /> Loading emails...
                  </div>
                ) : (
                  <EmailList emails={filteredEmails} selectedId={selectedEmail?.db_id} onSelect={handleSelectEmail} />
                )}
              </div>
            )}

            {/* Right Column: Detail */}
            <div className={`md:col-span-2 ${isMobile && !selectedEmail ? 'hidden md:block' : ''}`}>
              {isMobile && selectedEmail && (
                <div className="mb-3">
                  <button
                    onClick={() => setSelectedEmail(null)}
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-md text-sm border bg-white hover:bg-gray-50"
                  >
                    <ArrowLeft className="h-4 w-4" /> Back to Emails
                  </button>
                </div>
              )}
              <EmailDetail
                email={selectedEmail}
                responseText={responseText}
                setResponseText={setResponseText}
                onSend={handleSend}
                onRegenerate={handleRegenerate}
                onResolve={handleResolve}
                loadingAction={loadingAction}
                successMessage={successMessage}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
