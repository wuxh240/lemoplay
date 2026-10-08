import { createFileRoute, useRouter } from "@tanstack/react-router";
import { DramaHeader } from "@/components/DramaHeader";
import { DramaBottomNav } from "@/components/DramaBottomNav";
import { ArrowLeft, Check, Star, Crown, Zap, Download, MonitorOff, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/subscribe")({
  component: Subscribe,
});

type PlanType = "monthly" | "quarterly" | "yearly";

interface Plan {
  id: PlanType;
  nameKey: string;
  price: number;
  originalPrice?: number;
  savePercent?: number;
  badge?: string;
  badgeColor?: string;
}

const plans: Plan[] = [
  {
    id: "monthly",
    nameKey: "monthly",
    price: 9.99,
  },
  {
    id: "quarterly",
    nameKey: "quarterly",
    price: 24.99,
    originalPrice: 29.97,
    savePercent: 17,
    badge: "popular",
    badgeColor: "bg-primary",
  },
  {
    id: "yearly",
    nameKey: "yearly",
    price: 79.99,
    originalPrice: 119.88,
    savePercent: 33,
    badge: "best_value",
    badgeColor: "bg-gradient-to-r from-amber-500 to-orange-500",
  },
];

const benefits = [
  { icon: Zap, key: "benefit_unlock_all" },
  { icon: MonitorOff, key: "benefit_no_ads" },
  { icon: MonitorOff, key: "benefit_hd_quality" },
  { icon: Star, key: "benefit_early_access" },
  { icon: Download, key: "benefit_offline" },
];

function Subscribe() {
  const router = useRouter();
  const { t } = useI18n();
  const [selectedPlan, setSelectedPlan] = useState<PlanType>("quarterly");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isVipUnlocked, setIsVipUnlocked] = useState(false);

  const handleBack = () => {
    router.history.back();
  };

  const handleSubscribe = (plan: Plan) => {
    console.log(`[Subscribe] User selected ${plan.id} plan, price $${plan.price}`);

    // Start mock payment process
    setIsProcessing(true);
    toast.loading("正在处理支付...");

    // Simulate 2 second payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setIsVipUnlocked(true);

      // Dismiss loading toast and show success
      toast.dismiss();
      toast.success("支付成功！VIP 权益已解锁");
      console.log(`[Subscribe] Mock payment successful for ${plan.id} plan`);

      // Navigate back to profile page after 1.5 seconds
      setTimeout(() => {
        router.navigate({ to: "/profile" });
      }, 1500);
    }, 2000);
  };

  const getMonthlyPrice = (plan: Plan) => {
    if (plan.id === "monthly") return plan.price;
    if (plan.id === "quarterly") return (plan.price / 3).toFixed(2);
    if (plan.id === "yearly") return (plan.price / 12).toFixed(2);
    return plan.price;
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
          <Crown className="w-6 h-6 text-amber-400 fill-amber-400" />
          <h2 className="text-2xl font-bold text-white" style={{ fontFamily: "var(--font-display)" }}>
            {t("subscription_plans")}
          </h2>
        </div>

        {/* Plans */}
        <div className="space-y-4 mb-4">
          {plans.map((plan) => (
            <div
              key={plan.id}
              onClick={() => {
                console.log(`[Subscribe] Plan card clicked: ${plan.id}`);
                setSelectedPlan(plan.id);
              }}
              className={`relative p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                selectedPlan === plan.id
                  ? "border-[#d4af37] bg-[#d4af37]/10 shadow-lg scale-[1.02]"
                  : "border-white/10 bg-card/50 hover:border-white/20 hover:bg-card/60"
              }`}
            >
              {/* Badge */}
              {plan.badge && (
                <div className={`absolute -top-3 right-4 px-3 py-1 rounded-full text-xs font-semibold text-white ${plan.badgeColor}`}>
                  {t(plan.badge)}
                </div>
              )}

              {/* Plan Info */}
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-white font-semibold text-lg">{t(plan.nameKey)}</h3>
                  {plan.savePercent && (
                    <p className="text-green-400 text-sm mt-1">{t("save_percent").replace("{percent}", String(plan.savePercent))}</p>
                  )}
                </div>
                <div className="text-right">
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold text-white">${getMonthlyPrice(plan)}</span>
                    <span className="text-gray-400 text-sm">{t("per_month")}</span>
                  </div>
                  {plan.originalPrice && (
                    <p className="text-gray-500 text-xs line-through">${plan.originalPrice}</p>
                  )}
                </div>
              </div>

              {/* Total Price */}
              <p className="text-gray-400 text-sm">
                {plan.id === "monthly" ? t("monthly") : plan.id === "quarterly" ? t("quarterly") : t("yearly")}: ${plan.price}
              </p>

              {/* Selected Indicator */}
              {selectedPlan === plan.id && (
                <div className="absolute top-4 left-4">
                  <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* VIP Benefits */}
        <div className="mb-4 p-5 bg-card rounded-xl border border-border card-shadow">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Crown className="w-5 h-5 text-amber-400 fill-amber-400" />
            {t("vip_benefits")}
          </h3>
          <div className="space-y-3">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center gap-3 text-gray-300">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <benefit.icon className="w-4 h-4 text-primary" />
                </div>
                <span>{t(benefit.key)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Subscribe Button */}
        <button
          onClick={() => handleSubscribe(plans.find((p) => p.id === selectedPlan)!)}
          disabled={isProcessing || isVipUnlocked}
          className={`w-full py-4 rounded-xl font-semibold text-lg flex items-center justify-center gap-2 shadow-lg transition-all ${
            isVipUnlocked
              ? "bg-green-500 text-white cursor-default"
              : isProcessing
              ? "bg-[#d4af37]/50 text-black/50 cursor-wait"
              : "bg-[#d4af37] hover:bg-[#c4a030] text-black"
          }`}
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              正在处理支付...
            </>
          ) : isVipUnlocked ? (
            <>
              <Check className="w-5 h-5" />
              已解锁 VIP
            </>
          ) : (
            <>
              <Crown className="w-5 h-5 fill-current" />
              {t("start_subscription")} - ${plans.find((p) => p.id === selectedPlan)!.price}
            </>
          )}
        </button>

        {/* Terms */}
        <p className="text-center text-gray-500 text-xs mt-4">
          {t("terms_agree")}
        </p>
      </div>

      <DramaBottomNav activeTab="profile" />
    </div>
  );
}
