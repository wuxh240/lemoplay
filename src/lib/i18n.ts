import { create } from "zustand";

export type Language = "en" | "zh" | "ja";

// Get initial language from localStorage or default to 'zh'
const getInitialLanguage = (): Language => {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem("app-language") as Language;
    if (saved && ["en", "zh", "ja"].includes(saved)) {
      return saved;
    }
  }
  return "zh";
};

export interface Translations {
  [key: string]: {
    en: string;
    zh: string;
    ja: string;
  };
}

export const translations: Translations = {
  // Common
  resume: { en: "Resume", zh: "继续观看", ja: "再開" },
  watch: { en: "Watch", zh: "观看", ja: "視聴" },
  episode: { en: "Episode", zh: "第", ja: "エピソード" },
  yesterday: { en: "Yesterday", zh: "昨天", ja: "昨日" },
  hours_ago: { en: "hours ago", zh: "小时前", ja: "時間前" },
  days_ago: { en: "days ago", zh: "天前", ja: "日前" },
  weeks_ago: { en: "weeks ago", zh: "周前", ja: "週間前" },
  just_now: { en: "Just now", zh: "刚刚", ja: "たった今" },
  minutes_ago: { en: "minutes ago", zh: "分钟前", ja: "分前" },

  // Profile Page
  watched: { en: "Watched", zh: "已观看", ja: "視聴済み" },
  favorites: { en: "Favorites", zh: "收藏", ja: "お気に入り" },
  unlocked: { en: "Unlocked", zh: "已解锁", ja: "ロック解除" },
  member_since: { en: "Member since", zh: "加入于", ja: "メンバー登録日" },
  watch_history: { en: "Watch History", zh: "观看历史", ja: "視聴履歴" },
  sign_out: { en: "Sign Out", zh: "退出登录", ja: "サインアウト" },
  edit_profile: { en: "Edit Profile", zh: "编辑个人资料", ja: "プロフィール編集" },
  username: { en: "Username", zh: "用户名", ja: "ユーザー名" },
  enter_username: { en: "Enter username", zh: "输入用户名", ja: "ユーザー名を入力" },
  cancel: { en: "Cancel", zh: "取消", ja: "キャンセル" },
  save: { en: "Save", zh: "保存", ja: "保存" },
  avatar_updated: { en: "Avatar updated (example)", zh: "头像已更新（示例）", ja: "アバター更新（例）" },
  profile_updated: { en: "Profile updated", zh: "个人资料已更新", ja: "プロフィール更新" },
  username_required: { en: "Username cannot be empty", zh: "用户名不能为空", ja: "ユーザー名は空にできません" },
  click_camera_change_avatar: { en: "Click camera icon to change avatar", zh: "点击相机图标更换头像", ja: "カメラアイコンをクリックしてアバターを変更" },
  logged_out: { en: "Logged out", zh: "已退出登录", ja: "ログアウトしました" },
  continue_watching: { en: "Continue Watching", zh: "继续观看", ja: "続きを見る" },

  // Watched Page
  completed: { en: "completed", zh: "已完成", ja: "完了" },

  // Unlocked Page
  unlocked_at: { en: "Unlocked on", zh: "解锁于", ja: "ロック解除日" },
  unlocked_episodes: { en: "Unlocked Episodes", zh: "已解锁剧集", ja: "ロック解除済みエピソード" },

  // Favorites Page
  my_favorites: { en: "My Favorites", zh: "我的收藏", ja: "お気に入り" },
  no_favorites: { en: "No favorites yet", zh: "暂无收藏", ja: "お気に入りなし" },
  start_exploring: { en: "Start exploring and save your favorite dramas!", zh: "开始探索并收藏你喜欢的短剧吧！", ja: "探索してお気に入りのドラマを保存しましょう！" },

  // Settings
  settings: { en: "Settings", zh: "设置", ja: "設定" },
  language: { en: "Language", zh: "语言", ja: "言語" },
  notifications: { en: "Notifications", zh: "通知", ja: "通知" },
  privacy: { en: "Privacy", zh: "隐私", ja: "プライバシー" },
  about: { en: "About", zh: "关于", ja: "について" },
  version: { en: "Version", zh: "版本", ja: "バージョン" },

  // Comments
  comments_count: { en: "comments", zh: "条评论", ja: "件のコメント" },
  view_comments: { en: "View Comments", zh: "看评论", ja: "コメントを見る" },
  enter_comment: { en: "Enter comment...", zh: "输入评论...", ja: "コメントを入力..." },
  delete_comment: { en: "Delete Comment", zh: "删除评论", ja: "コメントを削除" },
  confirm_delete: { en: "Are you sure you want to delete this comment? This action cannot be undone.", zh: "确定要删除这条评论吗？此操作不可撤销。", ja: "このコメントを削除してもよろしいですか？この操作は取り消せません。" },
  delete: { en: "Delete", zh: "删除", ja: "削除" },

  // Paywall
  unlock_episode: { en: "Unlock Episode", zh: "解锁剧集", ja: "エピソードをアンロック" },
  pay_telegram: { en: "Pay with Telegram Stars", zh: "使用 Telegram Stars 支付", ja: "Telegram Starsで支払う" },
  pay_paypal: { en: "Pay with PayPal", zh: "使用 PayPal 支付", ja: "PayPalで支払う" },
  terms_agree: { en: "By unlocking, you agree to our Terms of Service", zh: "解锁即表示您同意我们的服务条款", ja: "アンロックすることで、利用規約に同意したことになります" },

  // Share
  share: { en: "Share", zh: "分享", ja: "シェア" },
  share_title: { en: "Share", zh: "分享", ja: "共有" },
  copy_link: { en: "Copy Link", zh: "复制链接", ja: "リンクをコピー" },
  link_copied: { en: "Link copied!", zh: "链接已复制！", ja: "リンクをコピーしました！" },
  share_to: { en: "Share to", zh: "分享到", ja: "共有先" },
  share_failed: { en: "Share failed", zh: "分享失败", ja: "共有に失敗しました" },

  // Bottom Navigation
  nav_home: { en: "Home", zh: "首页", ja: "ホーム" },
  nav_discover: { en: "Discover", zh: "发现", ja: "発見" },
  nav_favorites: { en: "Favorites", zh: "收藏", ja: "お気に入り" },
  nav_profile: { en: "Profile", zh: "我的", ja: "マイページ" },

  // Discover Page
  trending_now: { en: "Trending Now", zh: "热门推荐", ja: "トレンド" },
  new_releases: { en: "New Releases", zh: "新剧上线", ja: "新作" },
  views: { en: "views", zh: "次观看", ja: "回視聴" },

  // Drama Types
  type_romance: { en: "Romance", zh: "爱情", ja: "ロマンス" },
  type_thriller: { en: "Thriller", zh: "悬疑", ja: "スリラー" },
  type_drama: { en: "Drama", zh: "剧情", ja: "ドラマ" },
  type_business: { en: "Business", zh: "商战", ja: "ビジネス" },
  type_emotional: { en: "Emotional", zh: "情感", ja: "エモーショナル" },
  type_social: { en: "Social", zh: "社交", ja: "ソーシャル" },

  // Unlocked Page
  no_unlocked: { en: "No unlocked episodes yet", zh: "暂无解锁剧集", ja: "解放済みエピソードなし" },
  unlock_more: { en: "Unlock more episodes to enjoy full stories!", zh: "解锁更多剧集享受完整故事！", ja: "もっとエピソードを解放して完全なストーリーを楽しみましょう！" },

  // Comments
  comments: { en: "Comments", zh: "评论", ja: "コメント" },
  write_comment: { en: "Write a comment...", zh: "写条评论...", ja: "コメントを書く..." },
  send: { en: "Send", zh: "发送", ja: "送信" },
  delete_confirm: { en: "Are you sure you want to delete this comment? This action cannot be undone.", zh: "确定要删除这条评论吗？此操作不可撤销。", ja: "このコメントを削除してもよろしいですか？この操作は取り消せません。" },

  // Paywall
  unlock_price: { en: "Unlock for", zh: "解锁价格", ja: "解放価格" },
  coins: { en: "coins", zh: "金币", ja: "コイン" },
  purchase: { en: "Purchase", zh: "购买", ja: "購入" },

  // Subscription
  subscribe: { en: "Subscribe", zh: "订阅", ja: "購読" },
  subscription_plans: { en: "Subscription Plans", zh: "订阅套餐", ja: "購読プラン" },
  monthly: { en: "Monthly", zh: "月度", ja: "月間" },
  quarterly: { en: "Quarterly", zh: "季度", ja: "四半期" },
  yearly: { en: "Yearly", zh: "年度", ja: "年間" },
  per_month: { en: "/month", zh: "/月", ja: "/月" },
  save_percent: { en: "Save {percent}%", zh: "节省{percent}%", ja: "{percent}%節約" },
  popular: { en: "Most Popular", zh: "最受欢迎", ja: "最も人気" },
  best_value: { en: "Best Value", zh: "最超值", ja: "最高価値" },
  vip_benefits: { en: "VIP Benefits", zh: "VIP权益", ja: "VIP特典" },
  benefit_unlock_all: { en: "Unlock all episodes", zh: "解锁全部剧集", ja: "全エピソードをアンロック" },
  benefit_no_ads: { en: "Ad-free experience", zh: "无广告体验", ja: "広告なし体験" },
  benefit_hd_quality: { en: "HD quality streaming", zh: "高清画质流媒体", ja: "高画質ストリーミング" },
  benefit_early_access: { en: "Early access to new dramas", zh: "新剧抢先看", ja: "新作ドラマの早期アクセス" },
  benefit_offline: { en: "Offline download", zh: "离线下载", ja: "オフラインダウンロード" },
  start_subscription: { en: "Start Subscription", zh: "开始订阅", ja: "購読を開始" },
  current_plan: { en: "Current Plan", zh: "当前套餐", ja: "現在のプラン" },
  subscribed: { en: "Subscribed", zh: "已订阅", ja: "購読済み" },

  // Header
  search: { en: "Search", zh: "搜索", ja: "検索" },
  search_placeholder: { en: "Search dramas...", zh: "搜索剧集...", ja: "ドラマを検索..." },
  search_cancel: { en: "Cancel", zh: "取消", ja: "キャンセル" },

  // Time formatting helpers
  you: { en: "You", zh: "你", ja: "あなた" },

  // Invite Friends
  invite_friends: { en: "Invite Friends", zh: "邀请好友", ja: "友達を招待" },
  my_invites: { en: "My Invites", zh: "我的邀请", ja: "私の招待" },
  invited_count: { en: "Invited", zh: "已邀请", ja: "招待済み" },
  invite_link: { en: "Invite Link", zh: "邀请链接", ja: "招待リンク" },
  copy_invite_link: { en: "Copy Invite Link", zh: "复制邀请链接", ja: "招待リンクをコピー" },
  share_with_friends: { en: "Share with Friends", zh: "分享给好友", ja: "友達と共有" },
  invite_reward: { en: "Invite friends and earn rewards!", zh: "邀请好友赚取奖励！", ja: "友達を招待して報酬を獲得！" },
  invite_success: { en: "Invitation sent!", zh: "邀请已发送！", ja: "招待を送信しました！" },
  people: { en: "people", zh: "人", ja: "人" },

  // Side Menu
  menu_home: { en: "Home", zh: "首页", ja: "ホーム" },
  menu_favorites: { en: "Favorites", zh: "收藏", ja: "お気に入り" },
  menu_subscription: { en: "Subscription", zh: "订阅套餐", ja: "購読プラン" },
  menu_watch_history: { en: "Watch History", zh: "观看历史", ja: "視聴履歴" },
  menu_settings: { en: "Settings", zh: "系统设置", ja: "システム設定" },
  menu_about: { en: "About Us", zh: "关于我们", ja: "私たちについて" },
  menu_logout: { en: "Logout", zh: "退出登录", ja: "ログアウト" },
  welcome: { en: "Welcome", zh: "欢迎", ja: "ようこそ" },
  vip_status: { en: "VIP Member", zh: "VIP会员", ja: "VIP会員" },

  // Auth
  login_register: { en: "Login / Register", zh: "登录/注册", ja: "ログイン/登録" },
  email: { en: "Email", zh: "邮箱", ja: "メール" },
  phone: { en: "Phone Number", zh: "手机号", ja: "電話番号" },
  verification_code: { en: "Verification Code", zh: "验证码", ja: "認証コード" },
  send_code: { en: "Send Code", zh: "发送验证码", ja: "コードを送信" },
  login: { en: "Login", zh: "登录", ja: "ログイン" },
  register: { en: "Register", zh: "注册", ja: "登録" },
  agree_terms: { en: "By logging in, you agree to our Terms of Service and Privacy Policy", zh: "登录即代表您同意我们的服务条款和隐私政策", ja: "ログインすることで、利用規約とプライバシーポリシーに同意したことになります" },
  terms_of_service: { en: "Terms of Service", zh: "服务条款", ja: "利用規約" },
  privacy_policy: { en: "Privacy Policy", zh: "隐私政策", ja: "プライバシーポリシー" },
  and: { en: "and", zh: "和", ja: "および" },
  code_sent: { en: "Verification code sent!", zh: "验证码已发送！", ja: "認証コードを送信しました！" },
  login_success: { en: "Login successful!", zh: "登录成功！", ja: "ログイン成功！" },
  register_success: { en: "Registration successful!", zh: "注册成功！", ja: "登録成功！" },
  invalid_code: { en: "Invalid verification code", zh: "验证码无效", ja: "認証コードが無効です" },
  enter_email_or_phone: { en: "Please enter email or phone number", zh: "请输入邮箱或手机号", ja: "メールまたは電話番号を入力してください" },
  enter_verification_code: { en: "Please enter verification code", zh: "请输入验证码", ja: "認証コードを入力してください" },
  vip_expires: { en: "VIP expires on", zh: "VIP到期时间", ja: "VIP有効期限" },
  my_invites_section: { en: "My Invites", zh: "我的邀请", ja: "私の招待" },
};

interface I18nState {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

export const useI18n = create<I18nState>((set, get) => ({
  language: getInitialLanguage(),
  setLanguage: (lang) => {
    set({ language: lang });
    // Save to localStorage for persistence
    if (typeof window !== "undefined") {
      localStorage.setItem("app-language", lang);
    }
    console.log(`[i18n] Language changed to: ${lang}`);
  },
  t: (key) => {
    const { language } = get();
    const translation = translations[key];
    if (!translation) {
      console.warn(`[i18n] Missing translation for key: ${key}`);
      return key;
    }
    return translation[language] || translation.en;
  },
}));
