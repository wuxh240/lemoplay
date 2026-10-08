/**
 * Telegram Bot Edge Function
 * 实现 Telegram 消息发送功能
 */
Deno.serve(async (req) => {
  const functionName = 'telegram-bot';
  const requestId = crypto.randomUUID().slice(0, 8);

  const responseHeaders = {
    'Content-Type': 'application/json',
  };

  try {
    // 读取环境变量
    const botToken = Deno.env.get('TELEGRAM_BOT_TOKEN');
    if (!botToken) {
      console.error(`[${functionName}] failed ${requestId}: TELEGRAM_BOT_TOKEN not configured`);
      return new Response(
        JSON.stringify({ error: 'Telegram bot token not configured' }),
        { status: 500, headers: responseHeaders }
      );
    }

    // 解析请求体
    const body = await req.json();
    const { text, parseMode } = body;
    const chatId = '7861381431'; // 固定接收者 Telegram ID

    // 参数校验
    if (!text) {
      console.error(`[${functionName}] failed ${requestId}: missing required parameter: text`);
      return new Response(
        JSON.stringify({ error: 'Missing required parameter: text' }),
        { status: 400, headers: responseHeaders }
      );
    }

    console.info(`[${functionName}] request ${requestId} chatId=${chatId} textLength=${text.length}`);

    // 构建 Telegram API URL
    const telegramApiUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;

    // 调用 Telegram API
    const response = await fetch(telegramApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: text,
        parse_mode: parseMode || 'HTML',
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error(`[${functionName}] telegram api failed ${requestId} status=${response.status}: ${JSON.stringify(result)}`);
      return new Response(
        JSON.stringify({ error: 'Failed to send message', details: result }),
        { status: response.status, headers: responseHeaders }
      );
    }

    console.info(`[${functionName}] success ${requestId} messageId=${result.result?.message_id}`);
    return new Response(
      JSON.stringify({ success: true, data: result.result }),
      { headers: responseHeaders }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error(`[${functionName}] failed ${requestId}: ${message}`);
    return new Response(
      JSON.stringify({ error: message }),
      { status: 400, headers: responseHeaders }
    );
  }
});
