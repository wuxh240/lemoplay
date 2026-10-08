# 文件存储

> **强制：** 业务前端的上传、下载、删除和 URL 获取必须使用平台生成的 `supabase.storage` 或模板提供的上传 helper。业务代码禁止自行使用裸 `fetch` / `axios` / `Taro.request` 请求 `/storage/v1`，禁止重新 `createClient()`；Taro 模板 helper 的内部跨端实现除外。

> **示例说明：** 本文中的 `avatars`、`BUCKET_ID`、RLS 策略名称和文件路径均为示例。实际开发时可以根据业务场景替换，并确保建桶 SQL、RLS 策略、上传代码和公开 URL 使用同一个 bucket。

## 创建存储桶

通过 SQL 迁移创建存储桶：

```sql
INSERT INTO storage.buckets (id, name, public)
VALUES (gen_random_uuid(), 'avatars', true);
```

> **Bucket 标识约定：** 平台创建的 bucket ID 是 UUID。`supabase.storage.from(bucketId)` 的参数、`/storage/v1/object/{bucketId}/...` 路径中的 bucket 标识，以及 `storage.objects.bucket_id` 都使用 `storage.buckets.id`，不是 `storage.buckets.name`。必须先查询真实 `id`，禁止把 `name` 传给 `.from()` 或上传 helper。

## 关键上传方法

### Bucket ID 获取与使用

创建 bucket 后，必须在开发阶段通过 CLI 查询真实 ID，并将结果写入业务代码或项目配置：

```bash
meoo-cli cloud query --sql "SELECT id, name FROM storage.buckets WHERE name = 'avatars'"
```

```typescript
const BUCKET_ID = '<上方查询返回的 storage.buckets.id UUID>';
```

- 前端运行时禁止使用 `supabase.from('storage.buckets')` 查询 bucket ID；该调用会访问默认 REST schema，无法查询 Storage 系统表。
- `supabase.storage.from(...)` 的参数必须是 bucket ID。禁止传入 bucket name，例如 `.from('avatars')`；只有 `id` 与 `name` 恰好相同时才可能正常工作。
- 上传和 `getPublicUrl()` 必须使用同一个 bucket ID。
- 默认使用 `upsert: false`。只有业务确实需要覆盖同路径文件，并已为 `storage.objects` 配置 `SELECT` 和 `UPDATE` RLS 策略时，才能使用 `upsert: true`。


**必须使用 ArrayBuffer**（通过 `base64-arraybuffer`）进行所有文件上传。使用 `Blob`、`File` 或 `FormData` 会导致 `400 InvalidRequest "No content provided"` 错误。
**注意**：必须通过友好的 Toast 交互提醒用户数据操作结果，特别是操作失败的情况。
**重要约束：必须在前端上传文件。禁止在云函数（Edge Functions）中上传文件**，因为云函数上传的文件无法获取公网访问 URL，会导致前端无法正常访问和显示文件。所有文件上传操作必须在前端（浏览器环境）中进行。

> 记得在 `package.json` 中添加 `base64-arraybuffer` 依赖。

```typescript
import { decode } from 'base64-arraybuffer';

const BUCKET_ID = '<通过 cloud query 查询得到的 UUID>';

// ✅ 从 base64 字符串上传（必须检查 error）
const { data, error } = await supabase.storage
  .from(BUCKET_ID)
  .upload('public/avatar1.png', decode('base64FileData'), {
    contentType: 'image/png',
    upsert: false,
  });

if (error) throw new Error(`上传失败: ${error.message}`);

const { data: { publicUrl } } = supabase.storage
  .from(BUCKET_ID)
  .getPublicUrl(data.path);

// 从文件输入上传（先转换为 ArrayBuffer）
const reader = new FileReader();
reader.onload = async (e) => {
  const base64 = (e.target?.result as string).split(',')[1];
  const { data, error } = await supabase.storage
    .from(BUCKET_ID)
    .upload(`path/${file.name}`, decode(base64), {
      contentType: file.type,
      upsert: false,
    });

  if (error) {
    console.error('上传失败:', error.message);
    return;
  }
};
reader.readAsDataURL(file);
```

```typescript
// ✅ 使用 bucket ID 创建 Storage bucket client（这一步是正确的）
const bucket = supabase.storage.from(BUCKET_ID);

// ❌ 在 upload() 的文件数据类型，会导致 400 错误（这个操作是错误的）
const formData = new FormData();
formData.append('file', file);
await bucket.upload('path', formData); // ❌
await bucket.upload('path', blob);     // ❌
await bucket.upload('path', file);     // ❌
```






## 存储 RLS 策略示例

如果 `storage.objects` 策略需要通过 bucket name 动态查询 ID，必须先允许对应客户端角色读取该 bucket 的元数据。该权限只允许查询 `avatars` 的 bucket 记录，不会授予文件上传权限。

```sql
-- 基础策略：允许匿名用户和已登录用户查询 avatars bucket 的元数据，后续 storage.objects 策略才能通过 name 查询当前环境的真实 bucket ID
CREATE POLICY clients_select_avatars_bucket ON storage.buckets
FOR SELECT TO anon, authenticated
USING (name = 'avatars');

-- 无登录场景：允许匿名用户向 avatars bucket 上传文件（`public = true` 不会自动允许匿名上传。业务无需登录且需要上传文件时，必须为 `anon` 角色创建 `INSERT` 策略）
CREATE POLICY anon_insert_avatars ON storage.objects
FOR INSERT TO anon
WITH CHECK (
  bucket_id = (SELECT id FROM storage.buckets WHERE name = 'avatars')
);

-- 公开读取场景：允许客户端读取 avatars bucket 中的文件记录
CREATE POLICY anon_select_avatars ON storage.objects
FOR SELECT TO anon
USING (
  bucket_id = (SELECT id FROM storage.buckets WHERE name = 'avatars')
);

-- 登录场景：仅允许已登录用户向 avatars bucket 上传文件
CREATE POLICY authenticated_insert_avatars ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = (SELECT id FROM storage.buckets WHERE name = 'avatars')
);
```

匿名上传和登录上传策略应根据业务身份选择；只有两种身份都需要上传时才同时创建。

## Edge Functions 存储限制


**重要**：存储操作应在前端执行，而非 Edge Functions。Edge Functions 使用私有网络 URL，无法提供文件的公开访问。



## 存储模式限制

不要在 `storage` 模式中执行以下操作：
- 创建自定义表或函数
- 删除现有表或函数
- 在现有存储表上创建索引
- 对 `storage.migrations` 执行破坏性操作

管理文件访问请在 `public` 模式中创建辅助函数。
