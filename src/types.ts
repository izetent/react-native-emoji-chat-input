import type { ViewStyle } from 'react-native';

export interface EmojiConfig {
  name: string;
  image: string;
  width: number;
  height: number;
  description: string;
}

export interface EmojiConfigMap {
  [key: string]: EmojiConfig;
}

export interface EmojiChatInputConfig {
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

export interface TextChangeEvent {
  text: string;
}

export interface EmojiInsertEvent {
  emojiName: string;
  text: string;
}

export interface SubmitEvent {
  text: string;
}

export interface EmojiChatInputProps {
  style?: ViewStyle;
  placeholder?: string;
  placeholderColor?: string;
  value?: string;
  defaultValue?: string;
  multiline?: boolean;
  maxLength?: number;
  emojiConfig?: EmojiChatInputConfig;
  cursorColor?: string;
  onTextChange?: (event: TextChangeEvent) => void;
  onEmojiInsert?: (event: EmojiInsertEvent) => void;
  onSubmit?: (event: SubmitEvent) => void;
  onFocus?: () => void;
  onBlur?: () => void;
}

export interface EmojiChatInputRef {
  insertEmoji: (emojiName: string) => void;
  setText: (text: string) => void;
  getText: () => Promise<string>;
  focus: () => void;
  blur: () => void;
}

export interface EmojiTextViewProps {
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

export interface EmojiTextViewRef {
  // 可以在这里添加需要暴露给父组件的方法
}

