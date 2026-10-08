/**
 * Telegram Bot 前端调用工具
 * 用于从前端调用 telegram-bot Edge Function 发送消息
 */
import { projectUrlId, supabase, supabaseUrl } from '@/supabase/client';

export interface SendMessageParams {
  chatId: string; // Telegram 聊天 ID（用户 ID 或群组 ID）
  text: string;   // 消息内容
  parseMode?: 'HTML' | 'Markdown' | 'MarkdownV2'; // 可选，默认 HTML
}

export interface SendMessageResult {
  success: boolean;
  data?: {
    message_id: number;
    chat: { id: number };
    date: number;
    text: string;
  };
  error?: string;
}

/**
 * 通过 Edge Function 发送 Telegram 消息
 * @param params - 消息参数
 * @returns 发送结果
 */
export async function sendTelegramMessage(params: SendMessageParams): Promise<SendMessageResult> {
  try {
    // 获取认证 headers
    const session = (await supabase.auth.getSession()).data.session;
    const authHeaders = session ? { Authorization: `Bearer ${session.access_token}` } : {};

    const response = await fetch(`${supabaseUrl}/functions/v1/telegram-bot`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'OneDay-App-Id': projectUrlId,
        ...authHeaders,
      },
      body: JSON.stringify({
        chatId: params.chatId,
        text: params.text,
        parseMode: params.parseMode || 'HTML',
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error('Telegram bot error:', result);
      return { success: false, error: result.error || 'Failed to send message' };
    }

    return { success: true, data: result.data };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Telegram bot call failed:', message);
    return { success: false, error: message };
  }
}
