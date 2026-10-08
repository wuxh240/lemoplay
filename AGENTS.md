# AI 短剧 H5 项目技术上下文

## Dependencies

- **sonner**: Toast 通知组件，用于用户交互反馈（点赞、播放等操作的提示）
- **lucide-react**: 图标库，提供 Heart、MessageCircle、Share2、Play、Search、Trash2 等 UI 图标

## Architecture

### 核心组件结构

- `src/components/DramaHeader.tsx`: 顶部导航栏，包含品牌 Logo 和搜索按钮，半透明渐变背景
- `src/components/DramaBottomNav.tsx`: 底部导航栏，四个 Tab（Home/Discover/Favorites/Profile），仅 Home 激活
- `src/components/DramaCard.tsx`: 单个短剧卡片，包含背景图、渐变遮罩、标题信息、播放按钮、右侧操作栏（点赞/评论/分享）、视频下方"看评论"按钮
- `src/components/DramaFeed.tsx`: 短剧滑动列表容器，管理多个示例剧集数据，处理触摸滑动和滚轮切换逻辑
- `src/components/CommentModal.tsx`: 评论弹窗组件，顶部显示视频封面和标题，下方显示评论列表，支持点赞、删除、发送评论
- `src/routes/index.tsx`: 首页路由，整合 Header、Feed、BottomNav 三个主要组件

### 数据流

- 剧集数据硬编码在 `DramaFeed.tsx` 中，包含多个示例剧集（封面图 URL、标题、类型、互动数据）
- 封面图通过 `meoo-cli image-generate` 生成，存储在 CDN
- 用户交互（点赞、播放、评论、分享）通过 toast 反馈，本期均为 UI 占位

### 状态管理

- `DramaFeed`: 使用 `currentIndex` 跟踪当前显示的剧集索引，通过触摸事件和滚轮事件更新
- `DramaCard`: 每个卡片独立管理自己的点赞状态（`isLiked`、`likeCount`）和评论弹窗显示状态（`showComments`）
- `DramaBottomNav`: 管理当前激活的 Tab（`activeTab`）
- `CommentModal`: 管理评论列表、新评论输入、删除确认状态

## Lessons

- 深色主题只需定义 `:root` 一套色值，无需 `.dark` 变体
- 滑动切换使用 CSS `transform: translateY()` 配合绝对定位实现，比原生 scroll-snap 更可控
- 防抖逻辑通过 `isScrolling` ref 标志位实现，避免快速连续滑动导致的状态混乱
- CommentModal 顶部图标间距使用 `gap: 15px` 确保不重叠
- 视频封面区域使用相对定位 + 绝对定位叠加渐变和按钮
