# API 参考文档

## 组件

### EmojiChatInput

聊天输入框组件，支持文字和emoji混合输入。

#### Props

```typescript
interface EmojiChatInputProps {
  style?: ViewStyle;
  placeholder?: string;
  placeholderColor?: string;
  value?: string;
  defaultValue?: string;
  multiline?: boolean;
  maxLength?: number;
  emojiConfig?: EmojiChatInputConfig;
  cursorColor?: string;  // 新增：光标颜色
  onTextChange?: (event: TextChangeEvent) => void;
  onEmojiInsert?: (event: EmojiInsertEvent) => void;
  onSubmit?: (event: SubmitEvent) => void;
  onFocus?: () => void;
  onBlur?: () => void;
}
```

#### 方法

```typescript
interface EmojiChatInputRef {
  insertEmoji: (emojiName: string) => void;
  setText: (text: string) => void;
  getText: () => Promise<string>;
  focus: () => void;
  blur: () => void;
}
```

#### 使用示例

```tsx
import React, { useRef } from 'react';
import { EmojiChatInput, defaultEmojiConfig } from 'react-native-emoji-chat-input';

const MyComponent = () => {
  const inputRef = useRef<EmojiChatInputRef>(null);

  return (
    <EmojiChatInput
      ref={inputRef}
      placeholder="输入消息..."
      emojiConfig={defaultEmojiConfig}
      cursorColor="#007AFF"
      onTextChange={(event) => console.log(event.text)}
      onEmojiInsert={(event) => console.log('插入emoji:', event.emojiName)}
    />
  );
};
```

### EmojiTextView

原生图文混合显示组件，用于显示包含emoji的文本。

#### Props

```typescript
interface EmojiTextViewProps {
  style?: ViewStyle;
  text?: string;
  emojiConfig?: EmojiChatInputConfig;
  fontSize?: number;
  color?: string;
  fontWeight?: 'normal' | 'bold' | 'italic';
  textAlign?: 'left' | 'center' | 'right';
  numberOfLines?: number;
  ellipsizeMode?: 'head' | 'middle' | 'tail' | 'clip';
}
```

#### 使用示例

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
      textAlign="center"
      numberOfLines={2}
    />
  );
};
```

## 工具类

### EmojiUtils

提供emoji相关的工具方法。

#### 方法

```typescript
class EmojiUtils {
  // 获取所有emoji
  static getAllEmojis(config: EmojiChatInputConfig): EmojiConfig[];
  
  // 根据分类获取emoji
  static getEmojisByCategory(config: EmojiChatInputConfig, categoryName: string): EmojiConfig[];
  
  // 获取所有分类
  static getCategories(config: EmojiChatInputConfig): { [categoryName: string]: string[] };
  
  // 搜索emoji
  static searchEmojis(config: EmojiChatInputConfig, query: string): EmojiConfig[];
  
  // 根据名称获取emoji
  static getEmojiByName(config: EmojiChatInputConfig, name: string): EmojiConfig | null;
  
  // 验证emoji名称
  static validateEmojiName(config: EmojiChatInputConfig, name: string): boolean;
  
  // 提取文本中的emoji名称
  static extractEmojiNames(text: string): string[];
  
  // 移除emoji标记
  static removeEmojiMarkers(text: string, replacement?: string): string;
  
  // 统计emoji数量
  static countEmojis(text: string): number;
  
  // 获取纯文本长度
  static getPlainTextLength(text: string): number;
  
  // 格式化配置为显示数据
  static formatEmojiConfigForDisplay(config: EmojiChatInputConfig): {
    categories: Array<{ name: string; emojis: EmojiConfig[] }>;
    allEmojis: EmojiConfig[];
  };
  
  // 创建emoji选择器数据
  static createEmojiPickerData(config: EmojiChatInputConfig): Array<{
    title: string;
    data: EmojiConfig[];
  }>;
}
```

#### 使用示例

```tsx
import { EmojiUtils, defaultEmojiConfig } from 'react-native-emoji-chat-input';

// 获取所有emoji
const allEmojis = EmojiUtils.getAllEmojis(defaultEmojiConfig);
console.log('总共有', allEmojis.length, '个emoji');

// 按分类获取
const faceEmojis = EmojiUtils.getEmojisByCategory(defaultEmojiConfig, 'faces');

// 文本处理
const text = 'Hello [smile] World [heart]';
const plainText = EmojiUtils.removeEmojiMarkers(text); // "Hello  World "
const emojiCount = EmojiUtils.countEmojis(text); // 2
const plainLength = EmojiUtils.getPlainTextLength(text); // 13

// 搜索emoji
const searchResults = EmojiUtils.searchEmojis(defaultEmojiConfig, 'smile');
```

### EmojiConfigManager

管理emoji配置的类。

#### 方法

```typescript
class EmojiConfigManager {
  constructor(config?: EmojiChatInputConfig);
  
  // 设置配置
  setConfig(config: EmojiChatInputConfig): void;
  
  // 获取配置
  getConfig(): EmojiChatInputConfig | null;
  
  // 获取单个emoji
  getEmoji(name: string): EmojiConfig | null;
  
  // 获取所有emoji
  getAllEmojis(): EmojiConfigMap;
  
  // 根据分类获取emoji
  getEmojisByCategory(category: string): EmojiConfig[];
  
  // 获取所有分类
  getAllCategories(): string[];
  
  // 验证emoji名称
  validateEmojiName(name: string): boolean;
  
  // 获取默认尺寸
  getDefaultSize(): { width: number; height: number };
  
  // 获取最大尺寸
  getMaxSize(): { width: number; height: number };
  
  // 获取支持的格式
  getSupportedFormats(): string[];
  
  // 搜索emoji
  searchEmojis(query: string): EmojiConfig[];
  
  // 静态方法
  static createDefaultConfig(): EmojiChatInputConfig;
  static loadConfigFromFile(filePath: string): Promise<EmojiChatInputConfig>;
  static validateConfig(config: any): config is EmojiChatInputConfig;
  static getAllEmojisFromDefault(): EmojiConfig[];
  static getAllEmojisFromConfig(config: EmojiChatInputConfig): EmojiConfig[];
  static getEmojisByCategoryFromConfig(config: EmojiChatInputConfig, categoryName: string): EmojiConfig[];
  static getCategoriesFromConfig(config: EmojiChatInputConfig): { [categoryName: string]: string[] };
}
```

#### 使用示例

```tsx
import { EmojiConfigManager, defaultEmojiConfig } from 'react-native-emoji-chat-input';

// 创建管理器实例
const manager = new EmojiConfigManager(defaultEmojiConfig);

// 获取emoji信息
const smileEmoji = manager.getEmoji('smile');
console.log('Smile emoji:', smileEmoji);

// 获取分类
const categories = manager.getAllCategories();
console.log('Available categories:', categories);

// 搜索emoji
const searchResults = manager.searchEmojis('heart');
console.log('Search results:', searchResults);

// 使用静态方法
const allEmojis = EmojiConfigManager.getAllEmojisFromDefault();
```

## 类型定义

### EmojiConfig

```typescript
interface EmojiConfig {
  name: string;
  image: string;
  width: number;
  height: number;
  description: string;
}
```

### EmojiChatInputConfig

```typescript
interface EmojiChatInputConfig {
  version: string;
  emojis: EmojiConfigMap;
  categories: {
    [categoryName: string]: string[];
  };
  settings: {
    defaultSize: {
      width: number;
      height: number;
    };
    maxSize: {
      width: number;
      height: number;
    };
    supportedFormats: string[];
  };
}
```

### 事件类型

```typescript
interface TextChangeEvent {
  text: string;
}

interface EmojiInsertEvent {
  emojiName: string;
  text: string;
}

interface SubmitEvent {
  text: string;
}
```

## 默认配置

### defaultEmojiConfig

包提供了一个默认的emoji配置：

```tsx
import { defaultEmojiConfig } from 'react-native-emoji-chat-input';

console.log(defaultEmojiConfig);
// {
//   version: '1.0.0',
//   emojis: {
//     smile: { name: 'smile', image: 'smile.gif', ... },
//     heart: { name: 'heart', image: 'heart.gif', ... },
//     // ...
//   },
//   categories: {
//     faces: ['smile', 'laugh'],
//     objects: ['heart'],
//     // ...
//   },
//   settings: { ... }
// }
```

## 高级用法

### 自定义emoji配置

```tsx
const customConfig: EmojiChatInputConfig = {
  version: '2.0.0',
  emojis: {
    custom_emoji: {
      name: 'custom_emoji',
      image: 'custom_emoji.gif',
      width: 32,
      height: 32,
      description: 'My custom emoji',
    },
  },
  categories: {
    custom: ['custom_emoji'],
  },
  settings: {
    defaultSize: { width: 24, height: 24 },
    maxSize: { width: 48, height: 48 },
    supportedFormats: ['gif', 'png', 'jpg', 'webp'],
  },
};
```

### 动态加载配置

```tsx
import { EmojiConfigManager } from 'react-native-emoji-chat-input';

const loadConfig = async () => {
  try {
    const config = await EmojiConfigManager.loadConfigFromFile('/path/to/config.json');
    if (EmojiConfigManager.validateConfig(config)) {
      return config;
    }
  } catch (error) {
    console.error('Failed to load config:', error);
    return EmojiConfigManager.createDefaultConfig();
  }
};
```

### 创建emoji选择器

```tsx
import React from 'react';
import { FlatList, TouchableOpacity, Text } from 'react-native';
import { EmojiUtils, defaultEmojiConfig } from 'react-native-emoji-chat-input';

const EmojiPicker = ({ onEmojiSelect }) => {
  const pickerData = EmojiUtils.createEmojiPickerData(defaultEmojiConfig);
  
  return (
    <FlatList
      data={pickerData}
      keyExtractor={(item) => item.title}
      renderItem={({ item }) => (
        <View>
          <Text>{item.title}</Text>
          <FlatList
            data={item.data}
            horizontal
            keyExtractor={(emoji) => emoji.name}
            renderItem={({ item: emoji }) => (
              <TouchableOpacity onPress={() => onEmojiSelect(emoji.name)}>
                <Text>[{emoji.name}]</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}
    />
  );
};
```

