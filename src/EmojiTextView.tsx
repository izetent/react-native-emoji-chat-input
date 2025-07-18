import React, { forwardRef, useImperativeHandle } from 'react';
import type { ViewStyle } from 'react-native';
import NativeEmojiTextView from './NativeEmojiTextView';
import type { EmojiChatInputConfig } from './types';

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

const EmojiTextView = forwardRef<EmojiTextViewRef, EmojiTextViewProps>(
  (props, ref) => {
    useImperativeHandle(ref, () => ({}), []);

    return (
      <NativeEmojiTextView
        style={props.style}
        text={props.text}
        emojiConfig={props.emojiConfig}
        fontSize={props.fontSize}
        color={props.color}
        fontWeight={props.fontWeight}
        textAlign={props.textAlign}
        numberOfLines={props.numberOfLines}
        ellipsizeMode={props.ellipsizeMode}
      />
    );
  }
);

EmojiTextView.displayName = 'EmojiTextView';

export default EmojiTextView;

