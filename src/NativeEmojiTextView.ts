import type { ViewProps } from 'react-native';
import type { HostComponent } from 'react-native';
import codegenNativeComponent from 'react-native/Libraries/Utilities/codegenNativeComponent';
import type { EmojiChatInputConfig } from './types';

export interface NativeEmojiTextViewProps extends ViewProps {
  text?: string;
  emojiConfig?: EmojiChatInputConfig;
  fontSize?: number;
  color?: string;
  fontWeight?: 'normal' | 'bold' | 'italic';
  textAlign?: 'left' | 'center' | 'right';
  numberOfLines?: number;
  ellipsizeMode?: 'head' | 'middle' | 'tail' | 'clip';
}

export default codegenNativeComponent<NativeEmojiTextViewProps>(
  'RNEmojiTextView'
) as HostComponent<NativeEmojiTextViewProps>;

