import { X, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import { DownloadGuideModal } from "./DownloadGuideModal";
import { projectId, publicAnonKey } from '/utils/supabase/info';

export function AnnouncementBar() {
  const [isVisible, setIsVisible] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Check localStorage on mount to see if user has dismissed
  useEffect(() => {
    const dismissed = localStorage.getItem("announcement-bar-dismissed");
    if (dismissed === "true") {
      setIsVisible(false);
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem("announcement-bar-dismissed", "true");
  };

  const handleDownloadSubmit = async (email: string) => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-77ada9a1/guide-download`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({ email }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Guide download error:', errorData);
        throw new Error(`Server returned ${response.status}: ${JSON.stringify(errorData)}`);
      }

      const data = await response.json();
      console.log('Guide download response:', data);
      console.log('Zapier status:', data.zapier);
      return data;
    } catch (error) {
      console.error('Error sending guide download request:', error);
      throw error;
    }
  };

  if (!isVisible) return null;

  return (
    <>
      <div className="relative bg-[#00122F] border-b border-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center gap-3 py-2.5 text-sm pr-8 sm:pr-0">
            <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-center">
              <span className="text-white/90 font-normal">
                The Clinical Voice AI Guide. Learn why architecture determines safety.
              </span>
              <button
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center gap-1.5 text-white hover:text-white/80 font-medium transition-colors group"
              >
                <span>Download free</span>
                <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>

            <button
              onClick={handleDismiss}
              className="absolute right-4 p-1 text-white/60 hover:text-white/90 hover:bg-white/5 rounded transition-colors"
              aria-label="Dismiss announcement"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      <DownloadGuideModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleDownloadSubmit}
      />
    </>
  );
}