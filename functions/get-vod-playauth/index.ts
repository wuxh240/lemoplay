/**
 * Get VOD PlayURL Edge Function
 * 调用阿里云 VOD GetPlayInfo 接口获取视频真实播放地址
 */
Deno.serve(async (req) => {
  const functionName = 'get-vod-playauth';
  const requestId = crypto.randomUUID().slice(0, 8);

  const responseHeaders = {
    'Content-Type': 'application/json',
  };

  try {
    // 读取环境变量
    const accessKeyId = Deno.env.get('ALIYUN_VOD_ACCESS_KEY_ID');
    const accessKeySecret = Deno.env.get('ALIYUN_VOD_ACCESS_KEY_SECRET');

    if (!accessKeyId || !accessKeySecret) {
      console.error(`[${functionName}] failed ${requestId}: ALIYUN_VOD credentials not configured`);
      return new Response(
        JSON.stringify({ error: 'Aliyun VOD credentials not configured' }),
        { status: 500, headers: responseHeaders }
      );
    }

    // 解析请求体
    const body = await req.json();
    const { videoId } = body;

    // 参数校验
    if (!videoId) {
      console.error(`[${functionName}] failed ${requestId}: missing required parameter: videoId`);
      return new Response(
        JSON.stringify({ error: 'Missing required parameter: videoId' }),
        { status: 400, headers: responseHeaders }
      );
    }

    console.info(`[${functionName}] request ${requestId} videoId=${videoId}`);

    // 构建阿里云 VOD API 请求参数
    const timestamp = new Date().toISOString().replace(/[:-]|\.\d{3}/g, '');
    const nonce = crypto.randomUUID();

    const params: Record<string, string> = {
      Action: 'GetPlayInfo',
      Version: '2017-03-21',
      Format: 'JSON',
      AccessKeyId: accessKeyId,
      SignatureMethod: 'HMAC-SHA1',
      Timestamp: timestamp,
      SignatureVersion: '1.0',
      SignatureNonce: nonce,
      VideoId: videoId,
    };

    // 按字典序排序参数并构建规范查询字符串
    const sortedKeys = Object.keys(params).sort();
    const canonicalQueryString = sortedKeys
      .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
      .join('&');

    // 构建签名字符串
    const stringToSign = `GET&${encodeURIComponent('/')}&${encodeURIComponent(canonicalQueryString)}`;

    // 计算 HMAC-SHA1 签名
    const encoder = new TextEncoder();
    const keyData = encoder.encode(`${accessKeySecret}&`);
    const messageData = encoder.encode(stringToSign);

    const cryptoKey = await crypto.subtle.importKey(
      'raw',
      keyData,
      { name: 'HMAC', hash: 'SHA-1' },
      false,
      ['sign']
    );

    const signature = await crypto.subtle.sign('HMAC', cryptoKey, messageData);
    const signatureBase64 = btoa(String.fromCharCode(...new Uint8Array(signature)));

    // 添加签名到参数
    params.Signature = signatureBase64;

    // 构建最终查询字符串
    const queryString = Object.entries(params)
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
      .join('&');

    // 调用阿里云 VOD API（尝试多个地域）
    // OSS bucket 是 ap-southeast-1，先尝试新加坡地域
    const apiUrl = `https://vod.ap-southeast-1.aliyuncs.com/?${queryString}`;
    const startTime = Date.now();

    const response = await fetch(apiUrl, {
      method: 'GET',
    });

    const duration = Date.now() - startTime;
    const result = await response.json();

    if (!response.ok) {
      console.error(`[${functionName}] upstream failed ${requestId} status=${response.status} durationMs=${duration}: ${JSON.stringify(result).slice(0, 300)}`);
      return new Response(
        JSON.stringify({ error: 'Failed to call Aliyun VOD API', details: result }),
        { status: response.status, headers: responseHeaders }
      );
    }

    // 检查业务错误
    if (result.Code) {
      console.error(`[${functionName}] business error ${requestId} code=${result.Code} message=${result.Message}`);
      return new Response(
        JSON.stringify({ error: result.Message || 'Aliyun VOD API error', code: result.Code }),
        { status: 400, headers: responseHeaders }
      );
    }

    // 提取播放地址
    const playInfoList = result.PlayInfo?.PlayInfo || [];
    
    if (playInfoList.length === 0) {
      console.error(`[${functionName}] no play info in response ${requestId}`);
      return new Response(
        JSON.stringify({ error: 'No play URL found in response' }),
        { status: 404, headers: responseHeaders }
      );
    }

    // 获取第一个可用的播放地址（通常选择清晰度最高的）
    const playInfo = playInfoList[0];
    const playURL = playInfo.PlayURL;

    // 提取封面图：优先使用 Video.CoverURL，其次从 Snapshots 快照数组取第一个
    let coverURL = result.Video?.CoverURL || null;
    if (!coverURL && playInfo.Snapshots && playInfo.Snapshots.length > 0) {
      coverURL = playInfo.Snapshots[0];
      console.info(`[${functionName}] using snapshot as coverURL ${requestId}`);
    }

    if (!playURL) {
      console.error(`[${functionName}] no PlayURL in first play info ${requestId}`);
      return new Response(
        JSON.stringify({ error: 'No PlayURL available' }),
        { status: 404, headers: responseHeaders }
      );
    }

    console.info(`[${functionName}] success ${requestId} durationMs=${duration} playURL=${playURL.substring(0, 80)}... coverURL=${coverURL ? coverURL.substring(0, 80) : 'null'}...`);
    return new Response(
      JSON.stringify({ playURL, coverURL }),
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
