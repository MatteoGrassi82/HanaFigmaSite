import { useState, useEffect } from "react";
import { projectId, publicAnonKey } from "../../../../utils/supabase/info";

export function TestWebhook() {
  const [leadResult, setLeadResult] = useState<any>(null);
  const [guideResult, setGuideResult] = useState<any>(null);
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const baseUrl = `https://${projectId}.supabase.co/functions/v1/make-server-77ada9a1`;
  const headers = { Authorization: `Bearer ${publicAnonKey}` };

  const fireTestLead = async () => {
    setLoading("lead");
    setError(null);
    try {
      const res = await fetch(`${baseUrl}/test-lead`, { headers });
      const data = await res.json();
      setLeadResult(data);
    } catch (err: any) {
      setError(err.message || "Request failed");
    } finally {
      setLoading(null);
    }
  };

  const fireTestGuide = async () => {
    setLoading("guide");
    setError(null);
    try {
      const res = await fetch(`${baseUrl}/test-guide-download`, { headers });
      const data = await res.json();
      setGuideResult(data);
    } catch (err: any) {
      setError(err.message || "Request failed");
    } finally {
      setLoading(null);
    }
  };

  // Auto-fire the guide download test on mount
  useEffect(() => {
    fireTestGuide();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-8">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl p-8 max-w-2xl w-full space-y-8">
        <h1 className="text-2xl font-light text-white">Zapier Webhook Tester</h1>
        <p className="text-slate-400 text-sm">
          Make sure your Zapier zap is turned ON and the "Catch Hook" trigger is listening before clicking.
        </p>

        {error && (
          <div className="text-red-400 bg-red-950/50 border border-red-800 rounded-lg p-4">
            {error}
          </div>
        )}

        {/* Test Lead */}
        <div className="border border-slate-700 rounded-xl p-6 space-y-4">
          <h2 className="text-lg text-white font-medium">1. Test Lead Webhook</h2>
          <button
            onClick={fireTestLead}
            disabled={loading === "lead"}
            className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white px-6 py-3 rounded-lg text-sm font-medium transition-colors"
          >
            {loading === "lead" ? "Firing..." : "Fire Test Lead"}
          </button>
          {leadResult && (
            <pre className="bg-slate-800 rounded-lg p-4 text-xs text-green-400 font-mono overflow-auto max-h-60">
              {JSON.stringify(leadResult, null, 2)}
            </pre>
          )}
        </div>

        {/* Test Guide Download */}
        <div className="border border-slate-700 rounded-xl p-6 space-y-4">
          <h2 className="text-lg text-white font-medium">2. Test Guide Download Webhook</h2>
          <button
            onClick={fireTestGuide}
            disabled={loading === "guide"}
            className="bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white px-6 py-3 rounded-lg text-sm font-medium transition-colors"
          >
            {loading === "guide" ? "Firing..." : "Fire Test Guide Download"}
          </button>
          {guideResult && (
            <pre className="bg-slate-800 rounded-lg p-4 text-xs text-green-400 font-mono overflow-auto max-h-60">
              {JSON.stringify(guideResult, null, 2)}
            </pre>
          )}
        </div>
      </div>
    </div>
  );
}