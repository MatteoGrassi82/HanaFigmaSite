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
          <div className="grid grid-cols-[1fr_auto_1fr] items-center py-2.5 gap-2">

            {/* Left spacer — mirrors the dismiss button width */}
            <div />

            {/* Centered content */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-x-2 gap-y-0.5 text-center">
              <span className="text-white/90 text-xs sm:text-sm font-normal leading-snug">
                The Clinical Voice AI Guide.{" "}
                <span className="hidden sm:inline">Learn why architecture determines safety.</span>
              </span>
              <button
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center gap-1 text-white hover:text-white/80 text-xs sm:text-sm font-medium transition-colors group whitespace-nowrap"
              >
                <span>Download free</span>
                <ArrowRight className="h-3 w-3 sm:h-3.5 sm:w-3.5 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>

            {/* Dismiss button — right-aligned */}
            <div className="flex justify-end">
              <button
                onClick={handleDismiss}
                className="p-1.5 text-white/60 hover:text-white/90 hover:bg-white/5 rounded transition-colors"
                aria-label="Dismiss announcement"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>

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