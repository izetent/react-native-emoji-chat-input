import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import {
  requireNativeComponent,
  UIManager,
  findNodeHandle,
  NativeSyntheticEvent,
  ViewStyle,
} from 'react-native';
import type {
  EmojiChatInputProps,
  EmojiChatInputRef,
  TextChangeEvent,
  EmojiInsertEvent,
  SubmitEvent,
} from './types';

const LINKING_ERROR =
  `The package 'react-native-emoji-chat-input' doesn't seem to be linked. Make sure: \n\n` +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo Go\n';

interface NativeProps extends Omit<EmojiChatInputProps, 'onTextChange' | 'onEmojiInsert' | 'onSubmit'> {
  onTextChange?: (event: NativeSyntheticEvent<TextChangeEvent>) => void;
  onEmojiInsert?: (event: NativeSyntheticEvent<EmojiInsertEvent>) => void;
  onSubmit?: (event: NativeSyntheticEvent<SubmitEvent>) => void;
}

const ComponentName = 'RNEmojiChatInput';

const NativeEmojiChatInput =
  UIManager.getViewManagerConfig(ComponentName) != null
    ? requireNativeComponent<NativeProps>(ComponentName)
    : () => {
        throw new Error(LINKING_ERROR);
      };

const EmojiChatInput = forwardRef<EmojiChatInputRef, EmojiChatInputProps>(
  (
    {
      style,
      onTextChange,
      onEmojiInsert,
      onSubmit,
      placeholder = '输入消息...',
      placeholderColor = '#999999',
      textColor = '#000000',
      fontSize = 16,
      fontWeight = 'normal',
      maxLength,
      multiline = true,
      emojiConfig,
      ...otherProps
    },
    ref
  ) => {
    const nativeRef = useRef(null);

    useImperativeHandle(ref, () => ({
      insertEmoji: (emojiName: string) => {
        const viewTag = findNodeHandle(nativeRef.current);
        if (viewTag) {
          UIManager.dispatchViewManagerCommand(
            viewTag,
            'insertEmoji',
            [emojiName]
          );
        }
      },
      setText: (text: string) => {
        const viewTag = findNodeHandle(nativeRef.current);
        if (viewTag) {
          UIManager.dispatchViewManagerCommand(
            viewTag,
            'setText',
            [text]
          );
        }
      },
      getText: async (): Promise<string> => {
        const viewTag = findNodeHandle(nativeRef.current);
        if (viewTag) {
          return new Promise((resolve, reject) => {
            UIManager.dispatchViewManagerCommand(
              viewTag,
              'getText',
              [],
              (result: string) => resolve(result),
              (error: string) => reject(new Error(error))
            );
          });
        }
        return '';
      },
      focus: () => {
        const viewTag = findNodeHandle(nativeRef.current);
        if (viewTag) {
          UIManager.dispatchViewManagerCommand(
            viewTag,
            'focus',
            []
          );
        }
      },
      blur: () => {
        const viewTag = findNodeHandle(nativeRef.current);
        if (viewTag) {
          UIManager.dispatchViewManagerCommand(
            viewTag,
            'blur',
            []
          );
        }
      },
    }));

    const handleTextChange = (event: NativeSyntheticEvent<TextChangeEvent>) => {
      onTextChange?.(event.nativeEvent);
    };

    const handleEmojiInsert = (event: NativeSyntheticEvent<EmojiInsertEvent>) => {
      onEmojiInsert?.(event.nativeEvent);
    };

    const handleSubmit = (event: NativeSyntheticEvent<SubmitEvent>) => {
      onSubmit?.(event.nativeEvent);
    };

    const containerStyle: ViewStyle = {
      minHeight: 40,
      borderWidth: 1,
      borderColor: '#E0E0E0',
      borderRadius: 8,
      backgroundColor: '#FFFFFF',
      ...style,
    };

    return (
      <NativeEmojiChatInput
        ref={nativeRef}
        style={containerStyle}
        placeholder={placeholder}
        placeholderColor={placeholderColor}
        textColor={textColor}
        fontSize={fontSize}
        fontWeight={fontWeight}
        maxLength={maxLength}
        multiline={multiline}
        emojiConfig={emojiConfig}
        onTextChange={handleTextChange}
        onEmojiInsert={handleEmojiInsert}
        onSubmit={handleSubmit}
        {...otherProps}
      />
    );
  }
);

EmojiChatInput.displayName = 'EmojiChatInput';

export default EmojiChatInput;

