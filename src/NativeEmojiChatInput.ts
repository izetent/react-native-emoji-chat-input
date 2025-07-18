import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

export interface Spec extends TurboModule {
  insertEmoji(viewTag: number, emojiName: string): void;
  setText(viewTag: number, text: string): void;
  getText(viewTag: number): Promise<string>;
  focus(viewTag: number): void;
  blur(viewTag: number): void;
}

export default TurboModuleRegistry.getEnforcing<Spec>('RNEmojiChatInput');

