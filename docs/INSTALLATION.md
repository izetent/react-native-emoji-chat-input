# 安装指南

## 系统要求

- **React Native**: >= 0.70.0
- **iOS**: >= 11.0
- **Android**: API Level >= 21
- **Node.js**: >= 14.0
- **TypeScript**: >= 4.0 (可选，但推荐)

## 基础安装

### 1. 安装npm包

```bash
npm install react-native-emoji-chat-input
```

或使用yarn：

```bash
yarn add react-native-emoji-chat-input
```

### 2. iOS配置

#### 安装CocoaPods依赖

```bash
cd ios && pod install && cd ..
```

#### 验证依赖

确保 `ios/Podfile.lock` 中包含以下依赖：
- `SDWebImage`
- `SDWebImageSwiftUI`

如果没有自动安装，请在 `ios/Podfile` 中手动添加：

```ruby
target 'YourApp' do
  # 其他依赖...
  
  pod 'SDWebImage', '~> 5.0'
  pod 'SDWebImageSwiftUI', '~> 2.0'
end
```

然后重新运行：

```bash
cd ios && pod install && cd ..
```

### 3. Android配置

#### 添加Glide依赖

在 `android/app/build.gradle` 文件中添加：

```gradle
dependencies {
    implementation 'com.github.bumptech.glide:glide:4.14.2'
    implementation 'com.github.bumptech.glide:gif:4.14.2'
    // 其他依赖...
}
```

#### 验证权限

确保 `android/app/src/main/AndroidManifest.xml` 中有网络权限（通常已存在）：

```xml
<uses-permission android:name="android.permission.INTERNET" />
```

## 新架构支持

本包完全支持React Native的新架构（Fabric和TurboModules）。

### 启用新架构

在 `android/gradle.properties` 中：

```properties
newArchEnabled=true
```

在 `ios/Podfile` 中：

```ruby
use_frameworks! :linkage => :static
$RNNewArchEnabled = true
```

## 验证安装

创建一个简单的测试组件来验证安装：

```tsx
import React from 'react';
import { View, Text } from 'react-native';
import { EmojiChatInput, defaultEmojiConfig } from 'react-native-emoji-chat-input';

const TestComponent = () => {
  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text>Emoji Chat Input Test</Text>
      <EmojiChatInput
        placeholder="测试输入..."
        emojiConfig={defaultEmojiConfig}
        onTextChange={(event) => console.log(event.text)}
      />
    </View>
  );
};

export default TestComponent;
```

## 高级配置

### 自定义Emoji资源

如果需要使用自定义emoji，可以使用内置的更新脚本：

1. 在项目根目录创建 `emoji` 文件夹
2. 将emoji图片放入该文件夹
3. 运行更新脚本：

```bash
npm run update-emojis
```

### ProGuard配置（Android）

如果使用ProGuard，请在 `android/app/proguard-rules.pro` 中添加：

```proguard
# Glide
-keep public class * implements com.bumptech.glide.module.GlideModule
-keep class * extends com.bumptech.glide.module.AppGlideModule {
 <init>(...);
}
-keep public enum com.bumptech.glide.load.ImageHeaderParser$** {
  **[] $VALUES;
  public *;
}

# React Native Emoji Chat Input
-keep class com.reactnativeemojichatinput.** { *; }
```

### Metro配置

如果遇到资源加载问题，可能需要配置Metro。在 `metro.config.js` 中：

```javascript
const { getDefaultConfig } = require('metro-config');

module.exports = (async () => {
  const {
    resolver: { sourceExts, assetExts },
  } = await getDefaultConfig();
  
  return {
    resolver: {
      assetExts: [...assetExts, 'gif', 'webp'],
      sourceExts: [...sourceExts, 'ts', 'tsx'],
    },
  };
})();
```

## 故障排除

### 常见问题

#### 1. iOS编译错误

**错误**: `'SDWebImage/SDWebImage.h' file not found`

**解决方案**:
```bash
cd ios
rm -rf Pods Podfile.lock
pod install
cd ..
npx react-native clean
```

#### 2. Android编译错误

**错误**: `Could not find com.github.bumptech.glide:glide`

**解决方案**:
确保在 `android/build.gradle` 中添加了正确的仓库：

```gradle
allprojects {
    repositories {
        google()
        mavenCentral()
        maven { url 'https://www.jitpack.io' }
        // 其他仓库...
    }
}
```

#### 3. Emoji不显示

**可能原因**:
- emoji配置不正确
- 图片资源未正确加载
- 网络权限问题

**解决方案**:
1. 检查emoji配置格式
2. 验证图片路径
3. 确保网络权限已添加

#### 4. TypeScript错误

**错误**: `Cannot find module 'react-native-emoji-chat-input'`

**解决方案**:
```bash
# 重新安装类型定义
npm install --save-dev @types/react @types/react-native

# 清理TypeScript缓存
npx tsc --build --clean
```

#### 5. Metro bundler错误

**错误**: `Unable to resolve module`

**解决方案**:
```bash
# 清理Metro缓存
npx react-native start --reset-cache

# 或者
rm -rf node_modules
npm install
```

### 调试技巧

#### 启用调试日志

```tsx
import { EmojiConfigManager } from 'react-native-emoji-chat-input';

// 检查配置是否正确加载
console.log('Emoji config:', EmojiConfigManager.createDefaultConfig());
```

#### 检查原生模块

```bash
# iOS
npx react-native info

# Android
cd android && ./gradlew app:dependencies
```

#### 验证资源

```tsx
import { EmojiUtils, defaultEmojiConfig } from 'react-native-emoji-chat-input';

// 检查可用的emoji
const allEmojis = EmojiUtils.getAllEmojis(defaultEmojiConfig);
console.log('Available emojis:', allEmojis.map(e => e.name));
```

## 性能优化

### 1. 图片缓存

包已内置图片缓存机制，但可以通过以下方式优化：

```tsx
// iOS: SDWebImage会自动缓存
// Android: Glide会自动缓存

// 可以通过配置调整缓存策略
const optimizedConfig = {
  ...defaultEmojiConfig,
  settings: {
    ...defaultEmojiConfig.settings,
    // 调整默认尺寸以减少内存使用
    defaultSize: { width: 20, height: 20 },
  },
};
```

### 2. 懒加载

对于大量emoji的场景，考虑懒加载：

```tsx
import { EmojiUtils } from 'react-native-emoji-chat-input';

const LazyEmojiPicker = () => {
  const [visibleEmojis, setVisibleEmojis] = useState([]);
  
  const loadMoreEmojis = () => {
    // 分批加载emoji
  };
  
  return (
    // 实现懒加载逻辑
  );
};
```

### 3. 内存管理

```tsx
// 在组件卸载时清理资源
useEffect(() => {
  return () => {
    // 清理emoji缓存（如果需要）
  };
}, []);
```

## 升级指南

### 从v1.x升级到v2.x

1. **新增功能**:
   - 光标颜色自定义
   - EmojiTextView组件
   - 改进的基线对齐
   - 更多工具方法

2. **破坏性变更**:
   - 无破坏性变更，完全向后兼容

3. **推荐更新**:
   ```bash
   npm update react-native-emoji-chat-input
   cd ios && pod update && cd ..
   ```

## 下一步

安装完成后，请查看：

- [快速开始指南](../README.md#快速开始)
- [API文档](./API.md)
- [示例应用](../example/README.md)

如果遇到问题，请查看[故障排除](#故障排除)部分或提交Issue。

