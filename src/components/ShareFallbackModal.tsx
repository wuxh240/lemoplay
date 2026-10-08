import { X, Copy, Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface ShareFallbackModalProps {
  dramaTitle: string;
  shareUrl: string;
  onClose: () => void;
}

export function ShareFallbackModal({
  dramaTitle,
  shareUrl,
  onClose,
}: ShareFallbackModalProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const textToCopy = `推荐你看《${dramaTitle}》\n${shareUrl}`;
    
    try {
      await navigator.clipboard.writeText(textToCopy);
      console.log(`[ShareFallbackModal] Copied to clipboard: "${textToCopy}"`);
      setCopied(true);
      toast.success("已复制到剪贴板");
      
      // Reset copied state after 2 seconds
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("[ShareFallbackModal] Copy failed:", error);
      toast.error("复制失败，请手动复制");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-md bg-gray-900 rounded-2xl shadow-2xl p-6 animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-white">分享剧集</h3>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-800 transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Drama Info */}
        <div className="mb-4">
          <p className="text-white font-semibold mb-2">{dramaTitle}</p>
          <div className="p-3 bg-gray-800 rounded-lg break-all">
            <p className="text-sm text-gray-300">{shareUrl}</p>
          </div>
        </div>

        {/* Copy Button */}
        <button
          onClick={handleCopy}
          className="w-full py-3 px-4 bg-primary hover:bg-primary/90 rounded-xl font-semibold text-white flex items-center justify-center gap-2 transition-colors"
        >
          {copied ? (
            <>
              <Check className="w-5 h-5" />
              <span>已复制</span>
            </>
          ) : (
            <>
              <Copy className="w-5 h-5" />
              <span>一键复制链接</span>
            </>
          )}
        </button>

        {/* Hint */}
        <p className="text-xs text-gray-500 text-center mt-3">
          点击复制链接后，可粘贴到微信、QQ 等应用分享
        </p>
      </div>
    </div>
  );
}
