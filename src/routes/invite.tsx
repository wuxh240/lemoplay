import { createFileRoute, useRouter } from "@tanstack/react-router";
import { DramaHeader } from "@/components/DramaHeader";
import { DramaBottomNav } from "@/components/DramaBottomNav";
import { ArrowLeft, Users, Copy, Share2, Gift } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/invite")({
  component: Invite,
});

function Invite() {
  const router = useRouter();
  const { t } = useI18n();
  const [invitedCount, setInvitedCount] = useState(0);
  const [inviteLink, setInviteLink] = useState("");

  // Generate user ID and invite link on mount
  useEffect(() => {
    // Get or generate user ID
    let userId = localStorage.getItem("user-id");
    if (!userId) {
      userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem("user-id", userId);
    }

    // Check for referrer in URL
    const urlParams = new URLSearchParams(window.location.search);
    const referrer = urlParams.get("ref");
    if (referrer) {
      console.log(`[Invite] User referred by: ${referrer}`);
      localStorage.setItem("referred-by", referrer);
    }

    // Generate invite link
    const baseUrl = window.location.origin;
    const link = `${baseUrl}/?ref=${userId}`;
    setInviteLink(link);

    // Load invited count from localStorage
    const count = parseInt(localStorage.getItem("invited-count") || "0");
    setInvitedCount(count);
  }, []);

  const handleBack = () => {
    router.history.back();
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink);
      toast.success(t("link_copied"));
      console.log("[Invite] Invite link copied to clipboard");
    } catch (error) {
      console.error("[Invite] Failed to copy link:", error);
      toast.error(t("share_failed"));
    }
  };

  const handleShareToTelegram = async () => {
    const shareText = `${t("invite_reward")}\n${inviteLink}`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: t("invite_friends"),
          text: shareText,
          url: inviteLink,
        });
        console.log("[Invite] Shared via Web Share API");
        // Simulate incrementing invite count
        const newCount = invitedCount + 1;
        setInvitedCount(newCount);
        localStorage.setItem("invited-count", String(newCount));
        toast.success(t("invite_success"));
      } else {
        // Fallback: open Telegram share URL
        const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(inviteLink)}&text=${encodeURIComponent(shareText)}`;
        window.open(telegramUrl, "_blank");
        console.log("[Invite] Opened Telegram share URL");
      }
    } catch (error) {
      console.error("[Invite] Share failed:", error);
      toast.error(t("share_failed"));
    }
  };

  return (
    <div className="relative w-full h-screen bg-background overflow-hidden">
      <DramaHeader />

      {/* Main Content */}
      <div className="pt-16 pb-20 px-5 h-full overflow-y-auto">
        {/* Header */}
        <div className="flex items-center gap-2 mb-4">
          <button
            onClick={handleBack}
            className="p-2 rounded-full hover:bg-muted transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
          <Gift className="w-6 h-6 text-[#d4af37] fill-[#d4af37]" />
          <h2 className="text-2xl font-bold text-white" style={{ fontFamily: "var(--font-display)" }}>
            {t("invite_friends")}
          </h2>
        </div>

        {/* Invite Stats Card */}
        <div className="mb-4 p-6 bg-gradient-to-br from-[#d4af37]/20 to-[#d4af37]/5 rounded-xl border border-[#d4af37]/30 card-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">{t("invited_count")}</p>
              <p className="text-4xl font-bold text-[#d4af37]">{invitedCount}</p>
              <p className="text-gray-500 text-xs mt-1">{t("people")}</p>
            </div>
            <Users className="w-16 h-16 text-[#d4af37]/30" />
          </div>
        </div>

        {/* Reward Banner */}
        <div className="mb-4 p-4 bg-card/50 rounded-xl border border-border card-shadow">
          <div className="flex items-center gap-3">
            <Gift className="w-8 h-8 text-[#d4af37] flex-shrink-0" />
            <p className="text-white text-sm">{t("invite_reward")}</p>
          </div>
        </div>

        {/* Invite Link Section */}
        <div className="mb-4">
          <label className="block text-white font-semibold mb-3 flex items-center gap-2">
            <Copy className="w-4 h-4 text-[#d4af37]" />
            {t("invite_link")}
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={inviteLink}
              readOnly
              className="flex-1 px-4 py-3 bg-card rounded-lg border border-border text-white text-sm truncate"
            />
            <button
              onClick={handleCopyLink}
              className="px-4 py-3 bg-[#d4af37] hover:bg-[#c4a030] text-black rounded-lg font-semibold transition-colors flex items-center gap-2"
            >
              <Copy className="w-4 h-4" />
              {t("copy_link")}
            </button>
          </div>
        </div>

        {/* Share Button */}
        <button
          onClick={handleShareToTelegram}
          className="w-full py-4 rounded-xl bg-[#d4af37] hover:bg-[#c4a030] text-black font-semibold text-lg flex items-center justify-center gap-2 shadow-lg transition-colors"
        >
          <Share2 className="w-5 h-5" />
          {t("share_with_friends")}
        </button>
      </div>

      <DramaBottomNav activeTab="profile" />
    </div>
  );
}
