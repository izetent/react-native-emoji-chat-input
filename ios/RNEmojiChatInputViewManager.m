#import "RNEmojiChatInputViewManager.h"
#import "RNEmojiChatInputView.h"
#import <React/RCTUIManager.h>

@implementation RNEmojiChatInputViewManager

RCT_EXPORT_MODULE(RNEmojiChatInput)

- (UIView *)view {
    return [[RNEmojiChatInputView alloc] init];
}

// 导出属性
RCT_EXPORT_VIEW_PROPERTY(onTextChange, RCTBubblingEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onEmojiInsert, RCTBubblingEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onSubmit, RCTBubblingEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onFocus, RCTBubblingEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onBlur, RCTBubblingEventBlock)

RCT_EXPORT_VIEW_PROPERTY(placeholder, NSString)
RCT_EXPORT_VIEW_PROPERTY(placeholderColor, UIColor)
RCT_EXPORT_VIEW_PROPERTY(font, UIFont)
RCT_EXPORT_VIEW_PROPERTY(emojiConfig, NSDictionary)
RCT_EXPORT_VIEW_PROPERTY(maxLength, NSInteger)
RCT_EXPORT_VIEW_PROPERTY(multiline, BOOL)
RCT_EXPORT_VIEW_PROPERTY(cursorColor, UIColor)

// 导出方法
RCT_EXPORT_METHOD(insertEmoji:(nonnull NSNumber *)reactTag emojiName:(NSString *)emojiName) {
    [self.bridge.uiManager addUIBlock:^(__unused RCTUIManager *uiManager, NSDictionary<NSNumber *, UIView *> *viewRegistry) {
        RNEmojiChatInputView *view = (RNEmojiChatInputView *)viewRegistry[reactTag];
        if ([view isKindOfClass:[RNEmojiChatInputView class]]) {
            [view insertEmoji:emojiName];
        }
    }];
}

RCT_EXPORT_METHOD(setText:(nonnull NSNumber *)reactTag text:(NSString *)text) {
    [self.bridge.uiManager addUIBlock:^(__unused RCTUIManager *uiManager, NSDictionary<NSNumber *, UIView *> *viewRegistry) {
        RNEmojiChatInputView *view = (RNEmojiChatInputView *)viewRegistry[reactTag];
        if ([view isKindOfClass:[RNEmojiChatInputView class]]) {
            [view setText:text];
        }
    }];
}

RCT_EXPORT_METHOD(getText:(nonnull NSNumber *)reactTag resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
    [self.bridge.uiManager addUIBlock:^(__unused RCTUIManager *uiManager, NSDictionary<NSNumber *, UIView *> *viewRegistry) {
        RNEmojiChatInputView *view = (RNEmojiChatInputView *)viewRegistry[reactTag];
        if ([view isKindOfClass:[RNEmojiChatInputView class]]) {
            NSString *text = [view getText];
            resolve(text);
        } else {
            reject(@"VIEW_NOT_FOUND", @"View not found", nil);
        }
    }];
}

RCT_EXPORT_METHOD(focus:(nonnull NSNumber *)reactTag) {
    [self.bridge.uiManager addUIBlock:^(__unused RCTUIManager *uiManager, NSDictionary<NSNumber *, UIView *> *viewRegistry) {
        RNEmojiChatInputView *view = (RNEmojiChatInputView *)viewRegistry[reactTag];
        if ([view isKindOfClass:[RNEmojiChatInputView class]]) {
            [view focus];
        }
    }];
}

RCT_EXPORT_METHOD(blur:(nonnull NSNumber *)reactTag) {
    [self.bridge.uiManager addUIBlock:^(__unused RCTUIManager *uiManager, NSDictionary<NSNumber *, UIView *> *viewRegistry) {
        RNEmojiChatInputView *view = (RNEmojiChatInputView *)viewRegistry[reactTag];
        if ([view isKindOfClass:[RNEmojiChatInputView class]]) {
            [view blur];
        }
    }];
}

@end

