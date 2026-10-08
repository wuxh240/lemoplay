import { X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { projectUrlId, supabase, supabaseUrl } from '@/supabase/client';

interface VideoPlayerModalProps {
  videoUrl?: string;
  vid?: string;
  title: string;
  poster?: string;
  onClose: () => void;
}

declare global {
  interface Window {
    Aliplayer: any;
  }
}

export function VideoPlayerModal({ videoUrl, vid, title, poster, onClose }: VideoPlayerModalProps) {
  const playerRef = useRef<HTMLDivElement>(null);
  const aliPlayerRef = useRef<any>(null);
  const [playURL, setPlayURL] = useState<string | null>(null);
  const [coverURL, setCoverURL] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 当有 vid 时，调用 Edge Function 获取最新播放地址
  useEffect(() => {
    if (!vid) {
      // 如果没有 vid，直接使用传入的 videoUrl
      setPlayURL(videoUrl || null);
      return;
    }

    const fetchPlayURL = async () => {
      setIsLoading(true);
      setError(null);

      try {
        console.log('[VideoPlayerModal] 请求播放地址, vid:', vid);

        const response = await fetch(`${supabaseUrl}/functions/v1/get-vod-playauth`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'OneDay-App-Id': projectUrlId,
          },
          body: JSON.stringify({ videoId: vid }),
        });

        console.log('[VideoPlayerModal] 响应状态:', response.status);

        const result = await response.json();
        console.log('[VideoPlayerModal] 响应数据:', result);

        if (!response.ok) {
          console.error('[VideoPlayerModal] 获取播放地址失败:', result);
          setError(result.error || 'Failed to get playURL');
          return;
        }

        setPlayURL(result.playURL);
        if (result.coverURL) {
          setCoverURL(result.coverURL);
          console.log('[VideoPlayerModal] 获取到封面图:', result.coverURL?.substring(0, 80));
        }
        console.log('[VideoPlayerModal] 获取到播放地址:', result.playURL?.substring(0, 80));
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error';
        console.error('[VideoPlayerModal] 请求异常:', message);
        setError(message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlayURL();
  }, [vid, videoUrl]);

  // 初始化播放器
  useEffect(() => {
    if (!playerRef.current || !window.Aliplayer) return;

    // 如果正在加载或出错，不初始化播放器
    if (vid && !playURL) return;

    // 销毁旧实例
    if (aliPlayerRef.current) {
      aliPlayerRef.current.dispose();
      aliPlayerRef.current = null;
    }

    // 确定播放地址
    const sourceURL = playURL || videoUrl;
    if (!sourceURL) {
      console.error('[VideoPlayerModal] 没有可用的播放地址');
      return;
    }

    // 确定封面图：优先使用从 Edge Function 获取的 coverURL，其次使用传入的 poster
    const finalPoster = coverURL || poster;

    // 初始化阿里云播放器
    const config: any = {
      id: 'aliplayer-container',
      width: '100%',
      height: '100%',
      autoplay: true,
      isLive: false,
      rePlay: false,
      playsinline: true,
      preload: true,
      controlBarVisibility: 'hover',
      useH5Prism: true,
      source: sourceURL,
    };

    if (finalPoster) {
      config.cover = finalPoster;
    }

    console.log('[VideoPlayerModal] 使用URL播放:', sourceURL.substring(0, 80) + '...');

    try {
      aliPlayerRef.current = new window.Aliplayer(config, playerRef.current);

      aliPlayerRef.current.on('ready', () => {
        console.log('[VideoPlayerModal] 播放器就绪');
      });

      aliPlayerRef.current.on('error', (e: any) => {
        console.error('[VideoPlayerModal] 播放器错误:', e);
      });
    } catch (err) {
      console.error('[VideoPlayerModal] 初始化失败:', err);
    }

    // 清理函数
    return () => {
      if (aliPlayerRef.current) {
        aliPlayerRef.current.dispose();
        aliPlayerRef.current = null;
      }
    };
  }, [playURL, coverURL, videoUrl, vid, poster]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90">
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-50"
      >
        <X className="w-6 h-6 text-white" />
      </button>

      {/* Player Container */}
      <div className="relative w-full max-w-4xl aspect-video bg-black rounded-lg overflow-hidden">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-white text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
              <p>正在获取播放地址...</p>
            </div>
          </div>
        )}

        {error && !isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-white text-center p-8">
              <p className="text-red-400 mb-4">播放失败: {error}</p>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-white/20 rounded hover:bg-white/30 transition-colors"
              >
                关闭
              </button>
            </div>
          </div>
        )}

        <div
          id="aliplayer-container"
          ref={playerRef}
          className={`w-full h-full ${isLoading || error ? 'hidden' : ''}`}
        />
      </div>
    </div>
  );
}
