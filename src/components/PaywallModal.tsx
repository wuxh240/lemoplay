import { X, Lock, Star } from "lucide-react";
import { useI18n } from "@/lib/i18n";

interface PaywallModalProps {
  episodeNumber: number;
  dramaTitle: string;
  onClose: () => void;
}

export function PaywallModal({ episodeNumber, dramaTitle, onClose }: PaywallModalProps) {
  const { t } = useI18n();

  const handleTelegramPay = () => {
    console.log(`[PaywallModal] User clicked Telegram Stars payment for episode ${episodeNumber}`);
    // Open Telegram payment link in new window
    const telegramPaymentUrl = `https://t.me/payment?amount=100&currency=USD&description=${encodeURIComponent(`${dramaTitle} - Episode ${episodeNumber}`)}`;
    window.open(telegramPaymentUrl, '_blank');
  };

  const handlePayPalPay = () => {
    console.log(`[PaywallModal] User clicked PayPal payment for episode ${episodeNumber}`);
    // Open PayPal payment gateway in new window
    const paypalPaymentUrl = `https://www.paypal.com/checkoutnow?amount=1.99&currency=USD&item_name=${encodeURIComponent(`${dramaTitle} - Episode ${episodeNumber}`)}`;
    window.open(paypalPaymentUrl, '_blank');
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center bg-background/80 backdrop-blur-sm">
      <div className="w-full max-w-md bg-card rounded-t-3xl p-6 animate-slide-up">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-muted hover:bg-muted/80 transition-colors"
        >
          <X className="w-5 h-5 text-foreground" />
        </button>

        {/* Header */}
        <div className="text-center mb-8 pt-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary mb-4">
            <Lock className="w-8 h-8 text-primary-foreground" />
          </div>
          <h3 className="text-2xl font-bold text-foreground mb-2" style={{ fontFamily: "var(--font-display)" }}>
            {t("unlock_episode")} {episodeNumber}
          </h3>
          <p className="text-muted-foreground text-sm">{dramaTitle}</p>
        </div>

        {/* Payment Options */}
        <div className="space-y-4 mb-6">
          {/* Telegram Stars Button */}
          <button
            onClick={handleTelegramPay}
            className="w-full py-4 rounded-xl bg-primary hover:bg-primary/90 transition-colors flex items-center justify-center gap-3 text-primary-foreground font-semibold"
          >
            <Star className="w-5 h-5 fill-current" />
            <span>{t("pay_telegram")}</span>
          </button>

          {/* PayPal Button */}
          <button
            onClick={handlePayPalPay}
            className="w-full py-4 rounded-xl border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-colors flex items-center justify-center gap-3 font-semibold"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a3.35 3.35 0 0 0-.607-.541c-.013.076-.026.175-.041.254-.93 4.778-4.005 7.201-9.138 7.201h-2.19a.563.563 0 0 0-.556.479l-1.187 7.527h-.506l-.24 1.516a.56.56 0 0 0 .554.647h3.882c.46 0 .85-.334.922-.788.06-.26.76-4.846.816-5.09a.932.932 0 0 1 .923-.788h.58c3.76 0 6.705-1.528 7.565-5.946.36-1.847.174-3.388-.777-4.471z"/>
            </svg>
            <span>{t("pay_paypal")}</span>
          </button>
        </div>

        {/* Terms */}
        <p className="text-center text-muted-foreground text-xs">
          {t("terms_agree")}
        </p>
      </div>

      <style>{`
        @keyframes slide-up {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
