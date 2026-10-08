import { X, Camera } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface EditProfileModalProps {
  initialName?: string;
  initialAvatar?: string;
  onClose: () => void;
  onSave: (name: string, avatar: string) => void;
}

export function EditProfileModal({
  initialName = "Drama Fan",
  initialAvatar = "",
  onClose,
  onSave,
}: EditProfileModalProps) {
  const [username, setUsername] = useState(initialName);
  const [avatarUrl, setAvatarUrl] = useState(initialAvatar);

  const handleSave = () => {
    if (!username.trim()) {
      toast.error("用户名不能为空");
      return;
    }
    console.log(`[EditProfileModal] Saving profile: name="${username}", avatar="${avatarUrl}"`);
    onSave(username.trim(), avatarUrl);
    toast.success("个人资料已更新");
    onClose();
  };

  const handleAvatarChange = () => {
    // 模拟更换头像功能
    const newAvatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${Date.now()}`;
    setAvatarUrl(newAvatar);
    toast.info("头像已更新（示例）");
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[10000] bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-x-0 top-1/2 -translate-y-1/2 z-[10001] mx-4 max-w-md bg-white rounded-2xl border border-gray-300 overflow-hidden animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-300">
          <h3 className="text-lg font-bold text-black">编辑个人资料</h3>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5 text-black" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Avatar Section */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border-2 border-black">
                {avatarUrl ? (
                  <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-3xl text-black">👤</span>
                )}
              </div>
              <button
                onClick={handleAvatarChange}
                className="absolute bottom-0 right-0 w-8 h-8 bg-black rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors border border-black"
              >
                <Camera className="w-4 h-4 text-white" />
              </button>
            </div>
            <p className="text-sm text-gray-600">点击相机图标更换头像</p>
          </div>

          {/* Username Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-black">用户名</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="输入用户名"
              className="w-full px-4 py-3 bg-white border border-black rounded-lg text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-4 border-t border-gray-300">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl bg-white border border-black text-black font-medium hover:bg-gray-50 transition-colors"
          >
            取消
          </button>
          <button
            onClick={handleSave}
            className="flex-1 py-3 rounded-xl bg-black border border-black text-white font-medium hover:bg-gray-900 transition-colors"
          >
            保存
          </button>
        </div>
      </div>
    </>
  );
}
