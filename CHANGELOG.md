# 变更日志

## [2.0.0] - 2025-01-18

### 🎉 新增功能

#### 核心组件增强
- **自定义光标颜色**: 支持在iOS和Android上设置输入框光标颜色
- **EmojiTextView组件**: 新增原生图文混合显示组件，支持emoji和文字完美对齐
- **基线对齐优化**: 改进emoji和文字在iOS和Android上的基线对齐效果

#### 工具类扩展
- **EmojiUtils工具类**: 提供丰富的emoji操作方法
  - `getAllEmojis()` - 获取所有emoji映射关系
  - `getEmojisByCategory()` - 按分类获取emoji
  - `searchEmojis()` - 搜索emoji
  - `countEmojis()` - 统计emoji数量
  - `getPlainTextLength()` - 获取纯文本长度
  - `removeEmojiMarkers()` - 移除emoji标记
- **EmojiConfigManager增强**: 新增静态方法和配置验证功能

#### 开发体验改进
- **Emoji更新脚本**: 提供 `npm run update-emojis` 命令，支持一键更新emoji资源
- **完整示例应用**: 更新example项目，演示所有新功能
- **TypeScript支持增强**: 完善类型定义，提供更好的开发体验

### 🔧 技术改进

#### 性能优化
- **智能缓存机制**: 改进emoji图片缓存策略
- **动画生命周期管理**: 优化动画emoji的内存使用
- **基线对齐算法**: 提升emoji和文字对齐的精确度

#### 跨平台一致性
- **iOS优化**: 使用SDAnimatedImageView提供更好的GIF支持
- **Android优化**: 改进AnimatedEmojiSpan的渲染效果
- **统一API**: 确保iOS和Android行为完全一致

#### 资源管理
- **集成emoji资源**: emoji图片完全集成到npm包中
- **自动资源复制**: 安装时自动处理资源文件
- **支持自定义emoji**: 通过脚本轻松添加自定义emoji

### 📚 文档更新

- **完整API文档**: 详细的API参考和使用示例
- **安装指南增强**: 包含故障排除和性能优化建议
- **示例代码丰富**: 提供更多实用的代码示例

### 🐛 修复

- **基线对齐问题**: 修复emoji和文字在某些情况下对齐不准确的问题
- **内存泄漏**: 修复动画emoji可能导致的内存泄漏
- **TypeScript类型**: 修复部分类型定义不准确的问题

### ⚠️ 破坏性变更

无破坏性变更，完全向后兼容v1.x版本。

---

## [1.1.0] - 2025-01-17

### 新增功能
- 集成emoji资源到npm包
- 支持GIF和WebP动画emoji
- 改进iOS和Android原生实现

### 修复
- 修复emoji配置加载问题
- 优化图片缓存机制

---

## [1.0.0] - 2025-01-16

### 首次发布
- 基础聊天输入框功能
- 文字和emoji混合输入
- iOS和Android原生支持
- TypeScript类型定义
- React Native新架构支持

---

## 升级指南

### 从v1.x升级到v2.0.0

1. **安装新版本**:
   ```bash
   npm update react-native-emoji-chat-input
   cd ios && pod update && cd ..
   ```

2. **新功能使用**:
   ```tsx
   import { 
     EmojiChatInput, 
     EmojiTextView,  // 新组件
     EmojiUtils,     // 新工具类
     defaultEmojiConfig 
   } from 'react-native-emoji-chat-input';

   // 使用新的光标颜色功能
   <EmojiChatInput
     cursorColor="#007AFF"  // 新属性
     // 其他属性...
   />

   // 使用新的显示组件
   <EmojiTextView
     text="Hello [smile] World!"
     emojiConfig={defaultEmojiConfig}
   />

   // 使用新的工具方法
   const allEmojis = EmojiUtils.getAllEmojis(defaultEmojiConfig);
   ```

3. **更新emoji资源** (可选):
   ```bash
   # 如果需要自定义emoji
   npm run update-emojis
   ```

### 兼容性说明

- **React Native**: >= 0.70.0
- **iOS**: >= 11.0  
- **Android**: API Level >= 21
- **新架构**: 完全支持Fabric和TurboModules

### 迁移建议

1. **渐进式升级**: 可以逐步使用新功能，旧代码无需修改
2. **性能优化**: 建议使用新的EmojiTextView组件替代自定义文本显示
3. **工具方法**: 使用EmojiUtils替代自定义emoji处理逻辑

如有问题，请查看[安装指南](docs/INSTALLATION.md)或提交Issue。

