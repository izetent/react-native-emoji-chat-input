export { default as EmojiChatInput } from './EmojiChatInput';
export { default as EmojiTextView } from './EmojiTextView';
export { EmojiConfigManager } from './EmojiConfigManager';
export { EmojiUtils } from './EmojiUtils';
export { TextUtils } from './TextUtils';
export type {
  EmojiConfig,
  EmojiConfigMap,
  EmojiChatInputConfig,
  TextChangeEvent,
  EmojiInsertEvent,
  SubmitEvent,
  EmojiChatInputProps,
  EmojiChatInputRef,
  EmojiTextViewProps,
  EmojiTextViewRef,
  TextSegment,
} from './types';

// 导出默认emoji配置
export const defaultEmojiConfig = EmojiConfigManager.createDefaultConfig();

