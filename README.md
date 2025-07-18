# React Native Emoji Chat Input

一个功能强大的React Native聊天输入框组件，支持文字和emoji混合排版，提供原生级性能和跨平台一致性体验。

## ✨ 特性

### 🎯 核心功能
- **文字和emoji混合输入** - 无缝集成文本和emoji
- **原生性能** - iOS使用UITextView+NSAttributedString，Android使用SpannableString
- **动画支持** - 支持GIF和WebP动画emoji
- **跨平台一致性** - iOS和Android显示效果完全一致
- **TypeScript支持** - 完整的类型定义

### 🎨 界面定制
- **自定义光标颜色** - 支持设置光标颜色
- **基线对齐优化** - emoji和文字完美对齐
- **多种文本样式** - 支持字体、颜色、对齐方式等
- **响应式设计** - 适配不同屏幕尺寸

### 🛠 开发体验
- **零配置安装** - emoji资源已集成到包中
- **一键更新脚本** - 支持快速更新emoji资源
- **完整API** - 丰富的事件回调和方法
- **示例应用** - 提供完整的演示项目

## 📦 安装

```bash
npm install react-native-emoji-chat-input
```

### iOS配置
```bash
cd ios && pod install
```

### Android配置
确保在 `android/app/build.gradle` 中添加了Glide依赖：
```gradle
dependencies {
    implementation 'com.github.bumptech.glide:glide:4.14.2'
    // 其他依赖...
}
```

## 🚀 快速开始

### 基础使用

```tsx
import React, { useRef } from 'react';
import { View } from 'react-native';
import { 
  EmojiChatInput, 
  defaultEmojiConfig,
  type EmojiChatInputRef 
} from 'react-native-emoji-chat-input';

const App = () => {
  const inputRef = useRef<EmojiChatInputRef>(null);

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <EmojiChatInput
        ref={inputRef}
        placeholder="输入消息..."
        emojiConfig={defaultEmojiConfig}
        cursorColor="#007AFF"
        onTextChange={(event) => console.log(event.text)}
        onEmojiInsert={(event) => console.log('插入emoji:', event.emojiName)}
        onSubmit={(event) => console.log('提交:', event.text)}
      />
    </View>
  );
};
```

### 显示组件使用

```tsx
import React from 'react';
import { EmojiTextView, defaultEmojiConfig } from 'react-native-emoji-chat-input';

const DisplayComponent = () => {
  return (
    <EmojiTextView
      text="Hello [smile] Welcome! [heart]"
      emojiConfig={defaultEmojiConfig}
      fontSize={16}
      color="#333"
      numberOfLines={0}
    />
  );
};
```

## 📚 API文档

### EmojiChatInput 组件

#### Props

| 属性 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| `style` | `ViewStyle` | - | 组件样式 |
| `placeholder` | `string` | - | 占位符文本 |
| `placeholderColor` | `string` | - | 占位符颜色 |
| `value` | `string` | - | 受控组件的值 |
| `defaultValue` | `string` | - | 默认值 |
| `multiline` | `boolean` | `true` | 是否支持多行 |
| `maxLength` | `number` | - | 最大字符长度 |
| `emojiConfig` | `EmojiChatInputConfig` | - | emoji配置 |
| `cursorColor` | `string` | - | 光标颜色 |
| `onTextChange` | `(event) => void` | - | 文本变化回调 |
| `onEmojiInsert` | `(event) => void` | - | emoji插入回调 |
| `onSubmit` | `(event) => void` | - | 提交回调 |
| `onFocus` | `() => void` | - | 聚焦回调 |
| `onBlur` | `() => void` | - | 失焦回调 |

#### 方法

| 方法 | 参数 | 返回值 | 描述 |
|------|------|--------|------|
| `insertEmoji` | `emojiName: string` | `void` | 插入emoji |
| `setText` | `text: string` | `void` | 设置文本 |
| `getText` | - | `Promise<string>` | 获取当前文本 |
| `focus` | - | `void` | 聚焦输入框 |
| `blur` | - | `void` | 失焦输入框 |

### EmojiTextView 组件

#### Props

| 属性 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| `style` | `ViewStyle` | - | 组件样式 |
| `text` | `string` | - | 显示文本 |
| `emojiConfig` | `EmojiChatInputConfig` | - | emoji配置 |
| `fontSize` | `number` | `16` | 字体大小 |
| `color` | `string` | `#000` | 文字颜色 |
| `fontWeight` | `'normal' \| 'bold' \| 'italic'` | `'normal'` | 字体粗细 |
| `textAlign` | `'left' \| 'center' \| 'right'` | `'left'` | 文本对齐 |
| `numberOfLines` | `number` | `0` | 行数限制 |
| `ellipsizeMode` | `'head' \| 'middle' \| 'tail' \| 'clip'` | `'tail'` | 省略模式 |

## 🛠 工具类

### EmojiUtils

提供emoji相关的工具方法：

```tsx
import { EmojiUtils, defaultEmojiConfig } from 'react-native-emoji-chat-input';

// 获取所有emoji
const allEmojis = EmojiUtils.getAllEmojis(defaultEmojiConfig);

// 按分类获取emoji
const faceEmojis = EmojiUtils.getEmojisByCategory(defaultEmojiConfig, 'faces');

// 搜索emoji
const searchResults = EmojiUtils.searchEmojis(defaultEmojiConfig, 'smile');

// 文本处理
const plainTextLength = EmojiUtils.getPlainTextLength('Hello [smile]');
const emojiCount = EmojiUtils.countEmojis('Hello [smile] [heart]');
```

### EmojiConfigManager

管理emoji配置：

```tsx
import { EmojiConfigManager } from 'react-native-emoji-chat-input';

const manager = new EmojiConfigManager(defaultEmojiConfig);
const emoji = manager.getEmoji('smile');
const categories = manager.getAllCategories();
```

## 🎨 自定义Emoji

### 更新Emoji资源

1. 将新的emoji图片放入项目根目录的 `emoji` 文件夹
2. 运行更新脚本：

```bash
npm run update-emojis
```

这个脚本会自动：
- 复制图片到iOS和Android资源目录
- 更新emoji配置文件
- 生成新的映射关系

### 自定义配置

```tsx
import { EmojiConfigManager } from 'react-native-emoji-chat-input';

const customConfig = {
  version: '1.0.0',
  emojis: {
    custom_smile: {
      name: 'custom_smile',
      image: 'custom_smile.gif',
      width: 24,
      height: 24,
      description: 'Custom smile emoji',
    },
  },
  categories: {
    custom: ['custom_smile'],
  },
  settings: {
    defaultSize: { width: 24, height: 24 },
    maxSize: { width: 48, height: 48 },
    supportedFormats: ['gif', 'png', 'jpg', 'webp'],
  },
};
```

## 📱 示例应用

项目包含一个完整的示例应用，演示所有功能：

```bash
cd example
npm install
npx react-native run-ios  # 或 run-android
```

示例应用包含：
- 基础输入和显示功能
- emoji选择器
- 文本统计工具
- 所有API方法演示

## 🔧 高级配置

### 性能优化

1. **emoji缓存** - 自动缓存已加载的emoji图片
2. **动画管理** - 智能管理动画生命周期
3. **内存优化** - 及时释放不需要的资源

### 兼容性

- **React Native**: >= 0.70.0
- **iOS**: >= 11.0
- **Android**: API Level >= 21
- **新架构**: 完全支持Fabric和TurboModules

## 🐛 故障排除

### 常见问题

1. **emoji不显示**
   - 检查emoji配置是否正确
   - 确认图片资源已正确复制

2. **iOS编译错误**
   - 运行 `pod install`
   - 检查SDWebImage依赖

3. **Android显示异常**
   - 确认Glide依赖已添加
   - 检查assets目录权限

### 调试技巧

```tsx
// 启用调试日志
console.log('Emoji config:', defaultEmojiConfig);
console.log('Available emojis:', EmojiUtils.getAllEmojis(defaultEmojiConfig));
```

## 🤝 贡献

欢迎提交Issue和Pull Request！

### 开发环境设置

```bash
git clone <repository-url>
cd react-native-emoji-chat-input
npm install
cd example && npm install
```

### 提交规范

- 使用清晰的commit信息
- 添加相应的测试
- 更新文档

## 📄 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件

## 🙏 致谢

- [SDWebImage](https://github.com/SDWebImage/SDWebImage) - iOS动画图片支持
- [Glide](https://github.com/bumptech/glide) - Android图片加载
- React Native团队 - 优秀的跨平台框架

---

如果这个项目对你有帮助，请给个⭐️支持一下！

