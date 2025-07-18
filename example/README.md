# React Native Emoji Chat Input Example

这是一个完整的示例应用，演示了 `react-native-emoji-chat-input` 包的所有功能。

## 功能演示

### 1. EmojiChatInput 组件
- 文字和emoji混合输入
- 自定义光标颜色
- 多行输入支持
- 最大长度限制
- 事件回调（文本变化、emoji插入、提交等）

### 2. EmojiTextView 组件
- 原生图文混合显示
- emoji和文字基线对齐
- 支持多种文本样式
- 跨平台一致性

### 3. Emoji工具类
- 获取所有emoji映射关系
- 按分类获取emoji
- 文本处理工具（提取emoji、计算长度等）

### 4. 高级功能
- 动画emoji支持（GIF、WebP）
- TypeScript完整支持
- 自定义emoji配置
- 性能优化

## 运行示例

### 前提条件
- React Native 开发环境已配置
- iOS: Xcode 和 CocoaPods
- Android: Android Studio 和 SDK

### 安装依赖
```bash
cd example
npm install

# iOS
cd ios && pod install && cd ..

# Android
# 确保 android/local.properties 配置正确
```

### 运行应用
```bash
# iOS
npx react-native run-ios

# Android
npx react-native run-android
```

## 项目结构

```
example/
├── src/
│   └── App.tsx          # 主应用组件
├── ios/                 # iOS项目文件
├── android/             # Android项目文件
├── package.json         # 依赖配置
└── README.md           # 本文件
```

## 主要演示内容

### 1. 基础输入功能
- 在输入框中输入文字
- 点击emoji按钮插入emoji
- 查看实时文本变化

### 2. 显示功能
- EmojiTextView组件显示混合内容
- emoji和文字完美对齐
- 支持动画emoji

### 3. 工具功能
- 查看所有可用emoji
- 文本统计（长度、emoji数量）
- 分类浏览emoji

### 4. 控制功能
- 清空输入
- 聚焦/失焦控制
- 获取当前文本

## 自定义配置

你可以通过修改 `defaultEmojiConfig` 来自定义emoji配置：

```typescript
import { EmojiConfigManager } from 'react-native-emoji-chat-input';

const customConfig = EmojiConfigManager.createDefaultConfig();
// 修改配置...
```

## 故障排除

### iOS问题
1. 确保运行了 `pod install`
2. 检查 SDWebImage 依赖是否正确安装
3. 清理构建缓存：`npx react-native clean`

### Android问题
1. 确保 Glide 依赖已添加到 `build.gradle`
2. 检查 emoji 资源是否正确复制到 assets 目录
3. 清理构建缓存：`cd android && ./gradlew clean`

### 通用问题
1. 确保 React Native 版本 >= 0.70.0
2. 检查 TypeScript 配置
3. 验证 emoji 配置文件格式

## 更多信息

- [主项目 README](../README.md)
- [API 文档](../docs/API.md)
- [安装指南](../docs/INSTALLATION.md)

