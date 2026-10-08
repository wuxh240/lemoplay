import { createFileRoute, useRouter } from "@tanstack/react-router";
import { ArrowLeft, Mail, Phone, Shield } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/auth")({
  component: Auth,
});

type AuthMode = "login" | "register";
type ContactType = "email" | "phone";

function Auth() {
  const router = useRouter();
  const { t } = useI18n();
  const [mode, setMode] = useState<AuthMode>("login");
  const [contactType, setContactType] = useState<ContactType>("email");
  const [contactValue, setContactValue] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleBack = () => {
    router.history.back();
  };

  const handleSendCode = () => {
    if (!contactValue.trim()) {
      toast.error(t("enter_email_or_phone"));
      return;
    }

    // Validate email or phone format
    if (contactType === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(contactValue)) {
        toast.error("请输入有效的邮箱地址");
        return;
      }
    } else {
      const phoneRegex = /^\+?[\d\s-]{10,}$/;
      if (!phoneRegex.test(contactValue)) {
        toast.error("请输入有效的手机号（含国际区号）");
        return;
      }
    }

    console.log(`[Auth] Sending verification code to ${contactType}: ${contactValue}`);
    setIsProcessing(true);

    // Simulate sending code
    setTimeout(() => {
      setIsProcessing(false);
      setCodeSent(true);
      toast.success(t("code_sent"));
      console.log("[Auth] Mock verification code sent: 123456");
    }, 1500);
  };

  const handleSubmit = () => {
    if (!contactValue.trim()) {
      toast.error(t("enter_email_or_phone"));
      return;
    }

    if (!codeSent || !verificationCode.trim()) {
      toast.error(t("enter_verification_code"));
      return;
    }

    if (!agreeTerms) {
      toast.error("请同意服务条款和隐私政策");
      return;
    }

    // Mock verification (in real app, verify with backend)
    if (verificationCode !== "123456") {
      toast.error(t("invalid_code"));
      return;
    }

    console.log(`[Auth] User ${mode} with ${contactType}: ${contactValue}`);
    setIsProcessing(true);

    // Simulate auth process
    setTimeout(() => {
      setIsProcessing(false);

      // Save user info to localStorage
      const userInfo = {
        isLoggedIn: true,
        contactType,
        contactValue: contactValue.replace(/(.{3}).*(.{3})/, "$1***$2"), // Masked
        username: contactType === "email" ? contactValue.split("@")[0] : `User_${contactValue.slice(-4)}`,
        loginTime: new Date().toISOString(),
      };
      localStorage.setItem("user-info", JSON.stringify(userInfo));

      toast.success(mode === "login" ? t("login_success") : t("register_success"));

      // Navigate to profile page
      setTimeout(() => {
        router.navigate({ to: "/profile" });
      }, 1000);
    }, 1500);
  };

  return (
    <div className="relative w-full h-screen bg-background overflow-hidden">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-50 flex items-center gap-2 px-4 py-3 bg-gradient-to-b from-black/80 to-transparent">
        <button
          onClick={handleBack}
          className="p-2 rounded-full hover:bg-white/10 transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>
        <img src="/assets/logo.png" alt="LemoPlay" className="h-[50px] w-auto block" />
      </div>

      {/* Main Content */}
      <div className="pt-20 pb-8 px-6 h-full overflow-y-auto">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <img src="/assets/logo.png" alt="LemoPlay" className="h-[50px] w-auto block mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">
            {mode === "login" ? t("login") : t("register")}
          </h1>
          <p className="text-gray-400 text-sm">
            {mode === "login" ? "欢迎回来" : "创建新账号"}
          </p>
        </div>

        {/* Contact Type Toggle */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => {
              setContactType("email");
              setContactValue("");
              setCodeSent(false);
              setVerificationCode("");
            }}
            className={`flex-1 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 ${
              contactType === "email"
                ? "bg-[#d4af37] text-black"
                : "bg-card text-white border border-border"
            }`}
          >
            <Mail className="w-4 h-4" />
            {t("email")}
          </button>
          <button
            onClick={() => {
              setContactType("phone");
              setContactValue("");
              setCodeSent(false);
              setVerificationCode("");
            }}
            className={`flex-1 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 ${
              contactType === "phone"
                ? "bg-[#d4af37] text-black"
                : "bg-card text-white border border-border"
            }`}
          >
            <Phone className="w-4 h-4" />
            {t("phone")}
          </button>
        </div>

        {/* Contact Input */}
        <div className="mb-4">
          <label className="block text-white text-sm font-semibold mb-2">
            {contactType === "email" ? t("email") : t("phone")}
          </label>
          <input
            type={contactType === "email" ? "email" : "tel"}
            value={contactValue}
            onChange={(e) => setContactValue(e.target.value)}
            placeholder={contactType === "email" ? "example@email.com" : "+86 138****1234"}
            className="w-full px-4 py-3 bg-card rounded-lg border border-border text-white placeholder-gray-500 focus:outline-none focus:border-[#d4af37] transition-colors"
          />
        </div>

        {/* Verification Code */}
        <div className="mb-6">
          <label className="block text-white text-sm font-semibold mb-2">
            {t("verification_code")}
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              placeholder="123456"
              maxLength={6}
              disabled={!codeSent}
              className="flex-1 px-4 py-3 bg-card rounded-lg border border-border text-white placeholder-gray-500 focus:outline-none focus:border-[#d4af37] transition-colors disabled:opacity-50"
            />
            <button
              onClick={handleSendCode}
              disabled={isProcessing || !contactValue.trim()}
              className="px-4 py-3 bg-[#d4af37] hover:bg-[#c4a030] disabled:bg-[#d4af37]/50 text-black rounded-lg font-semibold transition-colors whitespace-nowrap"
            >
              {isProcessing ? "发送中..." : t("send_code")}
            </button>
          </div>
          {codeSent && (
            <p className="text-green-400 text-xs mt-2">验证码已发送（测试码：123456）</p>
          )}
        </div>

        {/* Terms Agreement */}
        <div className="mb-6 flex items-start gap-2">
          <input
            type="checkbox"
            id="terms"
            checked={agreeTerms}
            onChange={(e) => setAgreeTerms(e.target.checked)}
            className="mt-1 w-4 h-4 rounded border-border bg-card text-[#d4af37] focus:ring-[#d4af37]"
          />
          <label htmlFor="terms" className="text-gray-400 text-xs leading-relaxed">
            {t("agree_terms")}
            <button
              onClick={() => console.log("[Auth] View Terms of Service")}
              className="text-[#d4af37] hover:underline ml-1"
            >
              {t("terms_of_service")}
            </button>
            {" "}
            {t("and")}
            {" "}
            <button
              onClick={() => console.log("[Auth] View Privacy Policy")}
              className="text-[#d4af37] hover:underline"
            >
              {t("privacy_policy")}
            </button>
          </label>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={handleSubmit}
            disabled={isProcessing}
            className="w-full py-4 rounded-xl bg-[#d4af37] hover:bg-[#c4a030] disabled:bg-[#d4af37]/50 text-black font-semibold text-lg flex items-center justify-center gap-2 shadow-lg transition-colors"
          >
            {isProcessing ? (
              <>
                <Shield className="w-5 h-5 animate-pulse" />
                处理中...
              </>
            ) : mode === "login" ? (
              t("login")
            ) : (
              t("register")
            )}
          </button>

          <button
            onClick={() => {
              setMode(mode === "login" ? "register" : "login");
              setContactValue("");
              setCodeSent(false);
              setVerificationCode("");
              setAgreeTerms(false);
            }}
            className="w-full py-3 text-white text-sm hover:text-[#d4af37] transition-colors"
          >
            {mode === "login" ? "还没有账号？立即注册" : "已有账号？直接登录"}
          </button>
        </div>
      </div>
    </div>
  );
}
